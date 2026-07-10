import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import MapView, { MAP_STYLES, STALE_MS, DEAD_MS } from './components/MapView'
import VesselPanel from './components/VesselPanel'
import ForecastBar from './components/ForecastBar'
import LayerPanel from './components/LayerPanel'
import { migrateLayerPrefs, normalizeLayer } from './utils/layersPrefs'
import { distanceMeters } from './utils/geom'
import SearchPanel from './components/SearchPanel'
import SettingsPanel from './components/SettingsPanel'
import { useTripwireAlerts } from './hooks/useTripwireAlerts'
import PushSetupModal from './components/PushSetupModal'
import AlarmSoundModal from './components/AlarmSoundModal'
import InstallModal from './components/InstallModal'
import { syncTripwiresToBackend, getExistingSubscription, startNativePushTokenSync } from './utils/pushSubscribe'
import { formatSpeed } from './utils/vesselTypes'
import { useBarentswatch, zoomToPollInterval } from './hooks/useBarentswatch'
import { useVesselTrack } from './hooks/useVesselTrack'
import { useWindForecast } from './hooks/useWindForecast'
import { useWaveForecast, HORIZONS as WAVE_HORIZONS, horizonLabel as waveHorizonLabel } from './hooks/useWaveForecast'
import { API_BASE } from './utils/apiBase'

// Open-Meteo bølgelaget er ghosted mens vi går over til BarentsWatch
// waveforecast — koden lar vi ligge slik at den enkelt kan reaktiveres ved å
// flippe denne til true (samt re-aktivere Værdata-seksjonen i SettingsPanel).
const WAVE_LAYER_ACTIVE = true

// Korteste tillatte vakt-linje. Kortere = degenerert (a≈b) → kan aldri krysses.
const MIN_LINE_M = 25

export default function App() {
  // AIS auth lives server-side now (app-owned BarentsWatch client) — no
  // per-user credentials, no PIN. Demo mode is just a local toggle.
  const [demoMode, setDemoMode] = useState(() => localStorage.getItem('mw_demo') === '1')
  const [selectedVessel, setSelectedVessel] = useState(null)
  const [showSearch, setShowSearch] = useState(false)
  const [showNautical, setShowNautical] = useState(false)
  const [activeTab, setActiveTab] = useState('map')
  const [bounds, setBounds] = useState(null)
  const [zoom, setZoom] = useState(10) // Stavanger default
  const [mapStyleIndex, setMapStyleIndex] = useState(1) // Voyager = day mode default
  const [locating, setLocating] = useState(false)
  const [userPos, setUserPos] = useState(null)   // [lat, lon] — vises som pulse 4 s etter geolocate
  const mapRef = useRef(null)
  const userPosTimeoutRef = useRef(null)

  // Hjemmehavn velges ved å sette en pin på kartet: lukk overlays, gå i
  // pick-modus, og neste kart-trykk lagrer posisjonen.
  function handleStartSetHome() {
    setShowSettings(false)
    setShowSearch(false)
    setPanelCollapsed(true)
    setHomePickMode(true)
  }

  function handleConfirmHome() {
    if (!mapRef.current) return
    const c = mapRef.current.getCenter()
    setPrefs(p => ({ ...p, home: { lat: c.lat, lon: c.lng, zoom: mapRef.current.getZoom() } }))
    setHomePickMode(false)
  }

  function handleFlyHome() {
    if (!prefs.home || !mapRef.current) return
    const ll = [prefs.home.lat, prefs.home.lon]
    setPanelCollapsed(true)
    mapRef.current.flyTo(ll, prefs.home.zoom ?? 13, { duration: 1.5 })
    setUserPos(ll)
    clearTimeout(userPosTimeoutRef.current)
    userPosTimeoutRef.current = setTimeout(() => setUserPos(null), 4000)
  }

  // Drag-flytt av hjem-markøren på kartet — behold lagret zoom.
  function handleMoveHome(ll) {
    setPrefs(p => (p.home ? { ...p, home: { ...p.home, lat: ll[0], lon: ll[1] } } : p))
  }

  function handleGeolocate() {
    if (!navigator.geolocation || !mapRef.current) return
    setLocating(true)
    // Same prinsipp: dra ned detaljpanelet hvis åpent — brukeren vil se sin
    // egen omegn på kartet, ikke ha det dekket av vessel-info
    setPanelCollapsed(true)
    navigator.geolocation.getCurrentPosition(
      pos => {
        const ll = [pos.coords.latitude, pos.coords.longitude]
        mapRef.current.flyTo(ll, 13, { duration: 1.5 })
        // Pulse-markør synlig 4 s etter flyTo fullført. Vis umiddelbart så
        // brukeren ser den tegne mens kartet flyr inn.
        setUserPos(ll)
        clearTimeout(userPosTimeoutRef.current)
        userPosTimeoutRef.current = setTimeout(() => setUserPos(null), 4000)
        setLocating(false)
      },
      () => setLocating(false),
      { timeout: 10000, enableHighAccuracy: true }
    )
  }
  const mapStyle = MAP_STYLES[mapStyleIndex]

  const [trackHours, setTrackHours] = useState(0)
  const [playheadIndex, setPlayheadIndex] = useState(-1)
  const [showVectors, setShowVectors] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [panelCollapsed, setPanelCollapsed] = useState(false)
  const [homePickMode, setHomePickMode] = useState(false)
  const [coverageDismissed, setCoverageDismissed] = useState(false)
  const [tapHintDismissed, setTapHintDismissed] = useState(() => { try { return !!localStorage.getItem('mw_tapboat_seen') } catch { return true } })

  // Ansvarsfraskrivelse — vises én gang ved første oppstart
  const [showDisclaimer, setShowDisclaimer] = useState(() => !localStorage.getItem('mw_disclaimer_ok'))

  // Brukerpreferanser — lagres på enheten
  const [prefs, setPrefs] = useState(() => {
    const defaults = { showNames: true, clusterStationary: true, layers: { wave: { enrolled: false, active: false }, wind: { enrolled: false, active: false } }, layerPanelCollapsed: false, forecastHorizon: 12, windUnit: 'ms', forecastThin: 0, alarmMode: 'chime', alarmSoundAck: false, corridorWidthM: 1000, driftRadiusM: 200, savedFleet: [], home: null }
    try {
      const stored = JSON.parse(localStorage.getItem('mw_prefs') ?? '{}')
      const merged = { ...defaults, ...stored }
      // Migrer separate bølge/vind-horisonter → én delt varsel-horisont.
      // Sjekk RÅ lagret objekt — merged har alltid default forecastHorizon.
      if (!('forecastHorizon' in stored) || !WAVE_HORIZONS.includes(merged.forecastHorizon)) {
        merged.forecastHorizon = WAVE_HORIZONS.includes(stored.waveHorizon) ? stored.waveHorizon : 12
      }
      delete merged.waveHorizon; delete merged.windHorizon
      // Migrate gamle alarmMode-verdier
      if (merged.alarmMode === 'continuous') merged.alarmMode = 'alarm'
      if (!['chime', 'alarm'].includes(merged.alarmMode)) merged.alarmMode = 'chime'
      // Fold gamle waveLayer/windLayer-flagg inn i per-lag layers-strukturen
      merged.layers = migrateLayerPrefs(merged)
      if (merged.layerPanelCollapsed == null) merged.layerPanelCollapsed = false
      delete merged.waveLayer; delete merged.windLayer
      return merged
    } catch { return defaults }
  })
  useEffect(() => {
    localStorage.setItem('mw_prefs', JSON.stringify(prefs))
  }, [prefs])
  const updatePrefs = useCallback((patch) => setPrefs(p => ({ ...p, ...patch })), [])

  // Posisjoner til armerte tripwire-fartøy → useBarentswatch bruker tett
  // bbox rundt disse når tab er bakgrunnet. Komputeres senere etter at
  // tripwires og vessels er definert.
  const armedPositionsRef = useRef([])
  const { vessels: vesselsRaw, connected, error, msgCount, isDemoMode, retry } = useBarentswatch(
    demoMode, bounds, zoomToPollInterval(zoom), armedPositionsRef.current,
  )

  // Fersk/gammel/død AIS-håndtering — fjern fartøy hvis siste rapport er
  // veldig gammel (transponder av / utenfor rekkevidde / kysten passert), og
  // legg på en `stale`-flagg så markøren kan vises tonet ned.
  const vessels = useMemo(() => {
    const now = Date.now()
    const out = []
    for (const v of vesselsRaw) {
      const age = now - (Date.parse(v.timestamp) || now)
      if (age > DEAD_MS) continue
      out.push(age > STALE_MS ? { ...v, stale: true } : v)
    }
    return out
  }, [vesselsRaw])

  // Kartlag-tilstand (enrolled/active per lag) — migrert fra gamle flagg
  const layers = prefs.layers ?? migrateLayerPrefs(prefs)

  // Bølgevarsel-laget — henter kun når laget er aktivt i Lag-panelet
  const waveEnabled = WAVE_LAYER_ACTIVE && !!layers.wave?.active
  const { points: wavePoints, loading: waveLoading, error: waveError } = useWaveForecast(waveEnabled, bounds, zoom)
  const [selectedWavePoint, setSelectedWavePoint] = useState(null)

  // Vind-varsel — samme UI-mønster som bølge, egen kilde (MET locationforecast)
  const windEnabled = !!layers.wind?.active
  const { points: windPoints, loading: windLoading, error: windError } = useWindForecast(windEnabled, bounds, zoom)
  const [selectedWindPoint, setSelectedWindPoint] = useState(null)

  // Varsel-tidslinje: én linje styrer BÅDE bølge og vind (delt tid). Ankeret
  // fryses (inneværende hele time) når linja åpnes, så merkene ikke
  // re-rendres av hvert AIS-poll.
  const [forecastPanelOpen, setForecastPanelOpen] = useState(false)
  const [forecastScrub, setForecastScrub] = useState(null)
  const [forecastAnchor, setForecastAnchor] = useState(0)

  const toggleForecastPanel = useCallback(() => {
    setForecastPanelOpen(open => {
      if (open) { setForecastScrub(null); return false }
      setForecastAnchor(Math.floor(Date.now() / 3_600_000) * 3600)
      return true
    })
  }, [])

  // Åpne (uten toggle) — brukes når et merke trykkes: tidslinja skal dukke
  // opp som om brukeren trykket Bølge/Vind i Lag-panelet.
  const panelOpenRef = useRef(false)
  useEffect(() => { panelOpenRef.current = forecastPanelOpen })
  const openForecastPanel = useCallback(() => {
    if (panelOpenRef.current) return
    setForecastAnchor(Math.floor(Date.now() / 3_600_000) * 3600)
    setForecastPanelOpen(true)
  }, [])

  // Leaflet holder bare én popup åpen om gangen — å velge det ene laget lukker
  // det andre eksplisitt så React-tilstanden følger kartet. Re-klikk på et
  // åpent merke: ref-speilet leser COMMITTED valg ved klikk, så re-klikk blir
  // ekte toggle til null (ellers batcher Leaflets preclick + marker-click til
  // uendret state og popupen kan aldri åpnes igjen).
  const [selectedComboPair, setSelectedComboPair] = useState(null)
  const selWaveRef = useRef(null)
  useEffect(() => { selWaveRef.current = selectedWavePoint })
  const selWindRef = useRef(null)
  useEffect(() => { selWindRef.current = selectedWindPoint })
  const selComboRef = useRef(null)
  useEffect(() => { selComboRef.current = selectedComboPair })
  const handleSelectWavePoint = useCallback(p => {
    setSelectedWindPoint(null)
    setSelectedComboPair(null)
    const next = selWaveRef.current === p ? null : p
    setSelectedWavePoint(next)
    if (next) openForecastPanel()   // merke-tap åpner tidslinja
  }, [openForecastPanel])
  const handleSelectWindPoint = useCallback(p => {
    setSelectedWavePoint(null)
    setSelectedComboPair(null)
    const next = selWindRef.current === p ? null : p
    setSelectedWindPoint(next)
    if (next) openForecastPanel()
  }, [openForecastPanel])
  const handleSelectComboPair = useCallback(p => {
    setSelectedWavePoint(null)
    setSelectedWindPoint(null)
    const next = selComboRef.current === p ? null : p
    setSelectedComboPair(next)
    if (next) openForecastPanel()
  }, [openForecastPanel])
  const closeWavePopup = useCallback(() => setSelectedWavePoint(null), [])
  const closeWindPopup = useCallback(() => setSelectedWindPoint(null), [])
  const closeComboPopup = useCallback(() => setSelectedComboPair(null), [])
  const windUnit = prefs.windUnit === 'kn' ? 'kn' : 'ms'
  // Tetthets-slider (0–100) → strukturell rutenett-tynning (0 = vis alle punkter)
  const forecastThin = prefs.forecastThin ?? 0

  // Tripwire: én linje per valgt fartøy (kun for økten).
  // tripwires[mmsi] = { a:[lat,lon], b:[lat,lon], armed:true, lastCrossed?:number, vesselName?:string }
  const [tripwires, setTripwires] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mw_tripwires') ?? '{}') }
    catch { return {} }
  })
  useEffect(() => {
    try { localStorage.setItem('mw_tripwires', JSON.stringify(tripwires)) } catch { /* private mode */ }
  }, [tripwires])
  const handleRemoveTripwire = useCallback((mmsi) => {
    const tw = tripwires[String(mmsi)]
    const label = tw?.vesselName || ('MMSI ' + mmsi)
    if (!window.confirm('Fjern varsling for ' + label + '?')) return
    setTripwires(prev => {
      if (!prev[mmsi]) return prev
      const next = { ...prev }; delete next[String(mmsi)]; return next
    })
  }, [tripwires])

  // Pause/fortsett. Paused (armed:false) rendres dimmet, fyrer ikke, og
  // synces ikke til backend (sync-filteret krever armed) → backend slutter
  // å overvåke til den fortsettes.
  const handleToggleTripwireArmed = useCallback((mmsi) => {
    setTripwires(prev => {
      const tw = prev[String(mmsi)]
      if (!tw) return prev
      return { ...prev, [String(mmsi)]: { ...tw, armed: !tw.armed } }
    })
  }, [])

  // Tap-på-varsel → SW navigerer til /#trip=<mmsi>,<lat>,<lon>,<ts> ELLER
  // postMessage hvis app alt åpen. Vi sentrerer kartet + velger fartøyet.
  const focusTripwire = useCallback(({ mmsi, lat, lon }) => {
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return
    const tryFly = () => {
      if (!mapRef.current) return false
      mapRef.current.flyTo([lat, lon], 13, { duration: 1.2 })
      return true
    }
    if (!tryFly()) setTimeout(tryFly, 500)
    if (mmsi != null) {
      // Velg fartøyet hvis vi har det i state; ellers stub så panel åpnes
      setSelectedVessel(prev => {
        const live = vesselsRaw?.find?.(v => String(v.mmsi) === String(mmsi))
        return live || prev || { mmsi: String(mmsi), lat, lon, name: tripwires[String(mmsi)]?.vesselName }
      })
    }
  }, [vesselsRaw, tripwires])

  useEffect(() => {
    const m = window.location.hash.match(/^#trip=([^,]+),(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)(?:,(\d+))?/)
    if (!m) return
    focusTripwire({ mmsi: decodeURIComponent(m[1]), lat: parseFloat(m[2]), lon: parseFloat(m[3]) })
    // Fjern hash så reload ikke gjenåpner det samme
    history.replaceState(null, '', window.location.pathname + window.location.search)
  // Kjør én gang etter mount + når mapRef er klart
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    const onMessage = (event) => {
      if (event.data?.type === 'tripwire-focus') focusTripwire(event.data)
      else if (event.data?.type === 'tripwire-event') {
        setInAppTripwire({
          title: event.data.title,
          body: event.data.body,
          mode: event.data.mode,
          data: event.data.data || {},
          ts: Date.now(),
        })
        if (event.ports && event.ports[0]) event.ports[0].postMessage('shown')
      }
    }
    navigator.serviceWorker.addEventListener('message', onMessage)
    return () => navigator.serviceWorker.removeEventListener('message', onMessage)
  }, [focusTripwire])

  // In-app tripwire-banner: vises 12 s etter en push når app er fokusert.
  // Tap → flyTo + lukk banner.
  const [inAppTripwire, setInAppTripwire] = useState(null)
  useEffect(() => {
    if (!inAppTripwire) return
    const t = setTimeout(() => setInAppTripwire(null), 12_000)
    return () => clearTimeout(t)
  }, [inAppTripwire])
  // drawMode: 'idle' | 'point0'/'point1' (linje) | 'route' (korridor) | 'circle' (driftvakt)
  const [drawMode, setDrawMode] = useState('idle')
  const [draftPoint, setDraftPoint] = useState(null)
  const [draftPath, setDraftPath] = useState([])   // korridor under tegning
  const [draftWidth, setDraftWidth] = useState(1000) // korridor-bredde under tegning
  const [drawWarn, setDrawWarn] = useState(false)
  const [draftCircle, setDraftCircle] = useState(null)   // driftvakt under tegning: { center:[lat,lon], radiusM }

  const promptNotify = () => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }

  const handleAddTripwirePoint = useCallback((latlng) => {
    if (drawMode === 'point0') {
      setDraftPoint(latlng)
      setDrawMode('point1')
    } else if (drawMode === 'point1') {
      const mmsi = selectedVessel?.mmsi
      if (!mmsi || !draftPoint) { setDrawMode('idle'); setDraftPoint(null); return }
      // Avvis null-/nær-null-lengde linje (dobbelttap samme punkt). En a≈b-linje
      // kan aldri krysses (segmentsIntersect på degenerert segment = false), så
      // vakta ville stått armert men STUM. Behold første punkt, be om nytt tap.
      if (distanceMeters(draftPoint, latlng) < MIN_LINE_M) {
        setDrawWarn(true)
        return
      }
      setDrawWarn(false)
      setTripwires(prev => ({
        ...prev,
        [mmsi]: {
          id: (crypto?.randomUUID?.() ?? `${mmsi}-${Date.now()}`),
          type: 'line',
          a: draftPoint, b: latlng, armed: true,
          vesselName: selectedVessel.name || null, createdAt: Date.now(),
        },
      }))
      setDrawMode('idle')
      setDraftPoint(null)
      promptNotify()
    } else if (drawMode === 'route') {
      // Korridor: legg til punkt i ruta. Avsluttes via «Ferdig».
      setDraftPath(prev => [...prev, latlng])
    } else if (drawMode === 'circle') {
      // Driftvakt: tapp i kartet flytter sirkelens senter.
      setDraftCircle(c => (c ? { ...c, center: latlng } : c))
    }
  }, [drawMode, draftPoint, selectedVessel?.mmsi])

  const handleUndoRoutePoint = useCallback(() => {
    setDraftPath(prev => prev.slice(0, -1))
  }, [])

  const handleFinishRoute = useCallback(() => {
    const mmsi = selectedVessel?.mmsi
    if (!mmsi || draftPath.length < 2) return
    setTripwires(prev => ({
      ...prev,
      [mmsi]: {
        id: (crypto?.randomUUID?.() ?? `${mmsi}-${Date.now()}`),
        type: 'corridor',
        path: draftPath,
        widthM: draftWidth,
        armed: true,
        vesselName: selectedVessel.name || null, createdAt: Date.now(),
      },
    }))
    setPrefs(p => ({ ...p, corridorWidthM: draftWidth }))
    setDrawMode('idle')
    setDraftPath([])
    promptNotify()
  }, [selectedVessel?.mmsi, selectedVessel?.name, draftPath, draftWidth])

  // Driftvakt: lagre sirkelen som vakt. Deteksjonen er tilstandsbasert (se
  // useTripwireAlerts / bg-poll) — re-fyrer så lenge fartøyet er utenfor.
  const handleSaveCircle = useCallback(() => {
    const mmsi = selectedVessel?.mmsi
    if (!mmsi || !draftCircle || !(draftCircle.radiusM >= 50)) return
    setTripwires(prev => ({
      ...prev,
      [mmsi]: {
        id: (crypto?.randomUUID?.() ?? `${mmsi}-${Date.now()}`),
        type: 'circle',
        center: draftCircle.center,
        radiusM: draftCircle.radiusM,
        armed: true,
        vesselName: selectedVessel.name || null, createdAt: Date.now(),
      },
    }))
    setPrefs(p => ({ ...p, driftRadiusM: draftCircle.radiusM }))
    setDrawMode('idle')
    setDraftCircle(null)
    promptNotify()
  }, [selectedVessel?.mmsi, selectedVessel?.name, draftCircle])

  // Endre bredde på en aktiv korridor (og husk valget som ny default).
  const handleSetCorridorWidth = useCallback((mmsi, widthM) => {
    setTripwires(prev => {
      const tw = prev[String(mmsi)]
      if (!tw || tw.type !== 'corridor') return prev
      return { ...prev, [String(mmsi)]: { ...tw, widthM } }
    })
    setPrefs(p => ({ ...p, corridorWidthM: widthM }))
  }, [])

  // Endre radius på en aktiv driftvakt (og husk valget som ny default).
  const handleSetCircleRadius = useCallback((mmsi, radiusM) => {
    setTripwires(prev => {
      const tw = prev[String(mmsi)]
      if (!tw || tw.type !== 'circle') return prev
      return { ...prev, [String(mmsi)]: { ...tw, radiusM } }
    })
    setPrefs(p => ({ ...p, driftRadiusM: radiusM }))
  }, [])

  // Flytt driftvakt-senteret til fartøyets nåværende posisjon — nyttig når
  // båten har svaiet på plass etter ankring.
  const handleRecenterCircle = useCallback((mmsi) => {
    const live = vessels.find(v => String(v.mmsi) === String(mmsi))
    if (!live || !Number.isFinite(live.lat) || !Number.isFinite(live.lon)) return
    setTripwires(prev => {
      const tw = prev[String(mmsi)]
      if (!tw || tw.type !== 'circle') return prev
      return { ...prev, [String(mmsi)]: { ...tw, center: [live.lat, live.lon] } }
    })
  }, [vessels])

  // Start tegning. type 'line' (to punkter), 'corridor' (flere punkter) eller
  // 'circle' (driftvakt, auto-sentrert på fartøyets siste AIS-posisjon).
  const handleStartDraw = useCallback((type = 'line') => {
    const mmsi = selectedVessel?.mmsi
    if (type === 'circle') {
      // Driftvakt: auto-sentrert på fartøyets siste AIS-posisjon.
      if (!mmsi) return
      const live = vessels.find(v => String(v.mmsi) === String(mmsi)) ?? selectedVessel
      if (!Number.isFinite(live?.lat) || !Number.isFinite(live?.lon)) return
      setDraftPoint(null)
      setDraftPath([])
      setDrawWarn(false)
      setDraftCircle({ center: [live.lat, live.lon], radiusM: prefs.driftRadiusM ?? 200 })
      // Nullstill forrige tripwire på dette fartøyet så brukeren alltid kan
      // tegne en ny rett etter en krysning uten å klikke Fjern først.
      setTripwires(prev => {
        if (!prev[mmsi]) return prev
        const next = { ...prev }; delete next[mmsi]; return next
      })
      setDrawMode('circle')
      setPanelCollapsed(true)
      return
    }
    setDraftPoint(null)
    setDraftPath([])
    setDraftCircle(null)
    setDrawWarn(false)
    setDraftWidth(prefs.corridorWidthM ?? 1000)
    // Nullstill forrige tripwire på dette fartøyet så brukeren alltid kan
    // tegne en ny rett etter en krysning uten å klikke Fjern først.
    if (mmsi) {
      setTripwires(prev => {
        if (!prev[mmsi]) return prev
        const next = { ...prev }; delete next[mmsi]; return next
      })
    }
    setDrawMode(type === 'corridor' ? 'route' : 'point0')
    setPanelCollapsed(true)   // dra ned detalj-panelet så kartet er fritt å tegne på
  }, [selectedVessel, prefs.corridorWidthM, prefs.driftRadiusM, vessels])

  const handleCancelDraw = useCallback(() => {
    setDrawMode('idle')
    setDraftPoint(null)
    setDraftPath([])
    setDraftCircle(null)
    setDrawWarn(false)
  }, [])

  const handleClearTripwire = useCallback(() => {
    const mmsi = selectedVessel?.mmsi
    if (!mmsi) return
    setTripwires(prev => {
      const next = { ...prev }; delete next[mmsi]; return next
    })
  }, [selectedVessel?.mmsi])

  // Frontend-deteksjon (kun når push er AV): vis banner. Wiren slettes IKKE —
  // brukeren velger «Fjern» eller «Behold» i banneret.
  const handleCross = useCallback((vessel) => {
    const mmsi = String(vessel.mmsi)
    const tw = tripwires[mmsi]
    if (!tw) return
    const klokke = new Date().toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Oslo' })
    if (tw.type === 'circle') {
      const distM = Math.round(distanceMeters([vessel.lat, vessel.lon], tw.center))
      setInAppTripwire({
        title: `⚠ ${vessel.name || `MMSI ${mmsi}`} driver utenfor området`,
        body: `${distM} m fra senter (radius ${tw.radiusM} m) kl. ${klokke}`,
        mode: prefs.alarmMode,
        data: { mmsi, lat: vessel.lat, lon: vessel.lon, ts: Date.now() },
        ts: Date.now(),
      })
      return
    }
    const isCorridor = tw.type === 'corridor'
    setInAppTripwire({
      title: isCorridor
        ? `⚠ ${vessel.name || `MMSI ${mmsi}`} forlot ruta`
        : `⚠ ${vessel.name || `MMSI ${mmsi}`} krysset linja`,
      body: isCorridor
        ? `Forlot korridoren kl. ${klokke}`
        : `Passerte ${tw.vesselName || `MMSI ${mmsi}`} kl. ${klokke}`,
      mode: prefs.alarmMode,
      data: { mmsi, lat: vessel.lat, lon: vessel.lon, ts: Date.now() },
      ts: Date.now(),
    })
  }, [prefs.alarmMode, tripwires])

  // Push subscription status — deklareres her så useTripwireAlerts kan se den.
  const [showPushSetup, setShowPushSetup] = useState(false)
  const [pushSubActive, setPushSubActive] = useState(false)

  // PWA install — Android Chrome fyrer beforeinstallprompt vi fanger.
  // Tap på logo → enten prompter installasjon, viser iOS-instruks, eller
  // bekrefter at appen alt er installert.
  const [installPrompt, setInstallPrompt] = useState(null)
  const [isStandalone, setIsStandalone] = useState(false)
  useEffect(() => {
    setIsStandalone(window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true)
    const onPrompt = (e) => { e.preventDefault(); setInstallPrompt(e) }
    const onInstalled = () => { setInstallPrompt(null); setIsStandalone(true) }
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])
  const [showInstall, setShowInstall] = useState(false)
  const handleLogoClick = useCallback(() => setShowInstall(true), [])
  // Tripwire-meny (toolbar) + «Mine tripwires»-liste
  const [showTripwireMenu, setShowTripwireMenu] = useState(false)
  const [showTripwireList, setShowTripwireList] = useState(false)
  // Alarm-sound-modal: vises første gang bruker velger alarm-modus.
  const [showAlarmSoundSetup, setShowAlarmSoundSetup] = useState(false)
  useEffect(() => {
    if (prefs.alarmMode === 'alarm' && !prefs.alarmSoundAck) {
      setShowAlarmSoundSetup(true)
    }
  }, [prefs.alarmMode, prefs.alarmSoundAck])

  // Live tripwire watch for selected vessel
  const liveSelectedForTw = useMemo(
    () => selectedVessel ? vessels.find(v => v.mmsi === selectedVessel.mmsi) ?? selectedVessel : null,
    [vessels, selectedVessel]
  )
  // Frontend-deteksjon kjører KUN når push er AV. Når push er PÅ eier backend
  // deteksjonen → ingen dobbeltvarsel.
  useTripwireAlerts(
    liveSelectedForTw,
    selectedVessel ? tripwires[selectedVessel.mmsi] : null,
    handleCross,
    !pushSubActive,
  )

  // Sync armerte tripwire-fartøys siste posisjon til ref. useBarentswatch
  // leser fra ref ved hver scheduleTick — ingen restart av poll-loopen.
  useEffect(() => {
    const positions = []
    for (const mmsi of Object.keys(tripwires)) {
      const v = vessels.find(v => String(v.mmsi) === mmsi)
      if (v) positions.push({ lat: v.lat, lon: v.lon })
    }
    armedPositionsRef.current = positions
  }, [tripwires, vessels])

  // Bakgrunnsvarsling — abonnement-status + sync av tripwires til backend
  const [pushSyncError, setPushSyncError] = useState(false)
  const [backendDown, setBackendDown] = useState(false)   // heartbeat stale
  useEffect(() => {
    getExistingSubscription().then(sub => setPushSubActive(!!sub)).catch(() => {})
  }, [])

  // Refs så «re-sync on focus/online»-effekten alltid ser ferskeste data uten
  // å re-registrere lyttere ved hver tripwire-endring.
  const tripwiresRef = useRef(tripwires)
  const alarmModeRef = useRef(prefs.alarmMode)
  const pushSubActiveRef = useRef(pushSubActive)
  useEffect(() => { tripwiresRef.current = tripwires }, [tripwires])
  useEffect(() => { alarmModeRef.current = prefs.alarmMode }, [prefs.alarmMode])
  useEffect(() => { pushSubActiveRef.current = pushSubActive }, [pushSubActive])

  const doSync = useCallback(() => {
    if (!pushSubActiveRef.current) return Promise.resolve()
    return syncTripwiresToBackend(tripwiresRef.current, alarmModeRef.current)
      .then(() => setPushSyncError(false))
      .catch(() => { setPushSyncError(true); throw new Error('sync failed') })
  }, [])

  // Sync når tripwires/alarmMode endres OG vi har aktivt abonnement.
  useEffect(() => {
    if (!pushSubActive) return
    syncTripwiresToBackend(tripwires, prefs.alarmMode)
      .then(() => setPushSyncError(false))
      .catch(() => setPushSyncError(true))
  }, [tripwires, pushSubActive, prefs.alarmMode])

  // Robusthet: re-valider abonnement + re-sync + sjekk backend-helse når appen
  // blir synlig igjen, ved fokus og når nett kommer tilbake. Fanger: død/rotert
  // subscription (backend slettet den), tapt sync, og at cron/backend er nede.
  useEffect(() => {
    const onActive = () => {
      if (document.visibilityState !== 'visible') return
      // Re-valider lokal subscription → hold pushSubActive i takt med virkeligheten.
      getExistingSubscription().then(sub => {
        setPushSubActive(!!sub)
        if (sub) doSync().catch(() => {})
      }).catch(() => {})
      // Backend-helse: hvis siste poll er stale, varsle (bakgrunnsvarsling er dark).
      if (pushSubActiveRef.current) {
        fetch(`${API_BASE}/heartbeat-status`)
          .then(r => r.json())
          .then(h => setBackendDown(!(h && h.ok)))
          .catch(() => { /* nett nede — la onOnline ta det */ })
      }
    }
    const onOnline = () => onActive()
    document.addEventListener('visibilitychange', onActive)
    window.addEventListener('focus', onActive)
    window.addEventListener('online', onOnline)
    // SW kan rotere endpoint (pushsubscriptionchange) — re-valider da også.
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener?.('message', (e) => {
        if (e.data?.type === 'pushsubscriptionchange') onActive()
      })
    }
    return () => {
      document.removeEventListener('visibilitychange', onActive)
      window.removeEventListener('focus', onActive)
      window.removeEventListener('online', onOnline)
    }
  }, [doSync])

  // Native FCM-token-rotasjon: oppdater lagret token + re-sync vaktene når FCM
  // roterer tokenet. Uten dette pusher backend til et dødt token (→ 404 → sub
  // slettes) og bakgrunnsdekningen dør stille. Varig lytter; refs gir ferske
  // vakter. No-op i nettleser (ikke-native).
  useEffect(() => {
    const cleanup = startNativePushTokenSync(
      () => tripwiresRef.current,
      () => alarmModeRef.current,
    )
    return cleanup
  }, [])

  const tripwireUiState = useMemo(() => {
    if (drawMode === 'point0') return 'drawing-0'
    if (drawMode === 'point1') return 'drawing-1'
    if (drawMode === 'route') return 'drawing-route'
    if (selectedVessel && tripwires[selectedVessel.mmsi]) return 'armed'
    return 'idle'
  }, [drawMode, selectedVessel?.mmsi, tripwires])

  // Dekningsadvarsel: bruker har armerte tripwires, men ingen bakgrunnsdekning.
  // Uten push overvåkes bare valgt fartøy mens appen er åpen; blokkerte varsler
  // gir ingen dekning i det hele tatt i bakgrunn.
  const coverageWarning = useMemo(() => {
    const hasArmed = Object.values(tripwires).some(t => t && t.armed !== false)
    if (!hasArmed || pushSubActive) return null
    const denied = typeof Notification !== 'undefined' && Notification.permission === 'denied'
    return {
      denied,
      msg: denied
        ? 'Varsler er blokkert — vaktene overvåkes ikke i bakgrunnen'
        : 'Uten bakgrunnsvarsling overvåkes kun valgt fartøy mens appen er åpen',
    }
  }, [tripwires, pushSubActive])

  // Når advarselen forsvinner (push aktivert / ingen armerte) nullstilles
  // «OK»-avvisningen, så et nytt udekket tripwire viser advarselen igjen.
  useEffect(() => {
    if (!coverageWarning) setCoverageDismissed(false)
  }, [coverageWarning])

  // Markér «trykk på en båt»-hintet som sett så snart brukeren velger et fartøy.
  useEffect(() => {
    if (selectedVessel && !tapHintDismissed) {
      setTapHintDismissed(true)
      try { localStorage.setItem('mw_tapboat_seen', '1') } catch { /* private mode */ }
    }
  }, [selectedVessel, tapHintDismissed])

  // ── Fleet (manuelt lagrede fartøy) ─────────────────────────
  const savedFleet = prefs.savedFleet ?? []
  const isInFleet = selectedVessel
    ? savedFleet.some(s => String(s.mmsi) === String(selectedVessel.mmsi))
    : false
  const handleToggleFleet = useCallback(() => {
    if (!selectedVessel) return
    const mmsi = String(selectedVessel.mmsi)
    setPrefs(p => {
      const cur = p.savedFleet ?? []
      const has = cur.some(s => String(s.mmsi) === mmsi)
      const next = has
        ? cur.filter(s => String(s.mmsi) !== mmsi)
        : [...cur, { mmsi, name: selectedVessel.name, type: selectedVessel.type }]
      return { ...p, savedFleet: next }
    })
  }, [selectedVessel])

  // BarentsWatch waveforecast — offisielle Kystverket-punkter via GeoServer
  // WFS (auth-fri, CORS åpen). Virker også i demo-modus siden ingen
  // credentials trengs.

  // ── Kartlag-panel: enroll (Settings) vs active (panel-bryter) ──
  // Enroll på/av i Innstillinger: legger laget til/fjerner det fra panelet.
  const enrollLayer = useCallback((id, on) => {
    setPrefs(p => {
      const ls = migrateLayerPrefs(p)
      return { ...p, layers: { ...ls, [id]: on ? { enrolled: true, active: true } : { enrolled: false, active: false } } }
    })
    if (!on) {   // av-meldt → lukk tidslinja hvis ingen varsel-lag igjen + lagets popup
      if (id === 'wave') setSelectedWavePoint(null)
      else if (id === 'wind') setSelectedWindPoint(null)
      setSelectedComboPair(null)
      const other = id === 'wave' ? 'wind' : 'wave'
      if (forecastPanelOpen && !prefs.layers?.[other]?.active) toggleForecastPanel()
    }
  }, [forecastPanelOpen, toggleForecastPanel, prefs.layers])

  // Panel-bryter: vis/skjul lagets merker på kartet nå.
  const toggleLayerActive = useCallback((id) => {
    const wasActive = !!(prefs.layers?.[id]?.active)
    setPrefs(p => {
      const ls = migrateLayerPrefs(p)
      return { ...p, layers: { ...ls, [id]: normalizeLayer({ ...ls[id], active: !ls[id].active }) } }
    })
    if (wasActive) {   // slår av → lukk tidslinja hvis ingen varsel-lag igjen + lagets popup
      if (id === 'wave') setSelectedWavePoint(null)
      else if (id === 'wind') setSelectedWindPoint(null)
      setSelectedComboPair(null)
      const other = id === 'wave' ? 'wind' : 'wave'
      if (forecastPanelOpen && !prefs.layers?.[other]?.active) toggleForecastPanel()
    }
  }, [prefs.layers, forecastPanelOpen, toggleForecastPanel])

  // Trykk på rad-navn: aktiver laget (om av) og åpne tidslinja.
  const openLayerTimeline = useCallback((id) => {
    setPrefs(p => {
      const ls = migrateLayerPrefs(p)
      if (ls[id].active) return p
      return { ...p, layers: { ...ls, [id]: { enrolled: true, active: true } } }
    })
    if (!forecastPanelOpen) toggleForecastPanel()
  }, [forecastPanelOpen, toggleForecastPanel])

  // Hvor langt frem dataene rekker (timer fra ankeret), på tvers av begge lag
  const forecastMaxOffsetH = useMemo(() => {
    const anchor = forecastAnchor || Math.floor(Date.now() / 3_600_000) * 3600
    let max = 0
    for (const p of wavePoints) {
      if (!p.series) continue
      const end = p.series.t0 + (p.series.vh.length - 1) * 3600
      max = Math.max(max, Math.floor((end - anchor) / 3600))
    }
    for (const p of windPoints) {
      if (!p.series) continue
      const end = p.series.t0 + (p.series.vs.length - 1) * 3600
      max = Math.max(max, Math.floor((end - anchor) / 3600))
    }
    return max
  }, [wavePoints, windPoints, forecastAnchor])

  const forecastScrubT = forecastPanelOpen && forecastScrub != null
    ? forecastAnchor + forecastScrub * 3600
    : null

  // Valgt horisont klemmes til det dataene faktisk rekker.
  const effectiveHorizon = useMemo(() => {
    if (!forecastMaxOffsetH) return prefs.forecastHorizon
    const fit = WAVE_HORIZONS.filter(h => h <= forecastMaxOffsetH)
    if (!fit.length) return WAVE_HORIZONS[0]
    return Math.min(prefs.forecastHorizon, fit[fit.length - 1])
  }, [prefs.forecastHorizon, forecastMaxOffsetH])

  // Kortinfo til Lag-panelet: valgt horisont ("12 t") eller scrub-offset ("+6 t")
  const forecastInfo = forecastScrubT != null
    ? (forecastScrub >= 48 ? `+${Math.round(forecastScrub / 24)} d` : `+${forecastScrub} t`)
    : waveHorizonLabel(effectiveHorizon)

  // The selected vessel object is captured at click time — derive the live
  // version from the latest poll so the panel, marker, and heading vector
  // all track current position/speed.
  const liveSelected = useMemo(
    () => selectedVessel
      ? vessels.find(v => v.mmsi === selectedVessel.mmsi) ?? selectedVessel
      : null,
    [vessels, selectedVessel]
  )

  const panelPx = selectedVessel ? (panelCollapsed ? 88 : (trackHours > 0 ? 220 : 360)) : 0

  // Kart-visning er i fokus (ikke Søk/Flåte/Innstillinger). Topp-verktøyene er
  // kart-verktøy → de skal kun vise «aktiv» når kartet faktisk er fremme, ellers
  // får vi to aktive menyvalg samtidig (f.eks. Tripwire oppe + Flåte nede).
  const onMap = activeTab === 'map' && !showSearch && !showSettings

  // Et topp-kartverktøy henter alltid fokus tilbake til kartet (lukk Søk/Flåte/
  // Innstillinger) før det gjør noe — ellers kan f.eks. Tripwire-menyen åpne seg
  // oppå Innstillinger.
  const focusMap = () => { setShowSettings(false); setShowSearch(false); setActiveTab('map') }

  const { track, loading: trackLoading, error: trackError, retry: retryTrack } = useVesselTrack(
    selectedVessel?.mmsi,
    isDemoMode ? 0 : trackHours,
  )

  // Reset playhead to "live" end whenever the track data changes
  useEffect(() => {
    setPlayheadIndex(track.length > 0 ? track.length - 1 : -1)
  }, [track.length, selectedVessel?.mmsi, trackHours])

  // Ignorer moveend som ikke faktisk flyttet kartet (f.eks. popup-autopan
  // som allerede er i posisjon) — hindrer setState-ekko fra Leaflet-events.
  const lastBoundsRef = useRef(null)
  const handleBoundsChange = useCallback((b) => {
    const p = lastBoundsRef.current
    if (p &&
        Math.abs(p.north - b.north) < 1e-6 && Math.abs(p.south - b.south) < 1e-6 &&
        Math.abs(p.east - b.east) < 1e-6 && Math.abs(p.west - b.west) < 1e-6) return
    lastBoundsRef.current = b
    setBounds(b)
  }, [])
  const handleZoomChange  = useCallback((z) => setZoom(z), [])

  const handleSelectVessel = useCallback((vessel) => {
    setSelectedVessel(vessel)
    setTrackHours(0)
    setPlayheadIndex(-1)
    // Max kart, detaljer på forespørsel: åpne nye fartøy i sammenslått modus
    // (kun navn + type-stripen). Brukeren utvider med chevron eller dra-opp
    // hvis de vil se mer.
    setPanelCollapsed(true)
    setShowSearch(false)
    setActiveTab('map')
    setForecastPanelOpen(false)    // vessel panel takes the bottom — close the forecast bar
    setForecastScrub(null)
  }, [])

  const handleCloseVessel = useCallback(() => {
    setSelectedVessel(null)
    setTrackHours(0)
    setPlayheadIndex(-1)
  }, [])

  return (
    <div className={`app-shell${selectedVessel && activeTab === 'map' ? ' app-shell--panel' : ''}`}>
      <header className="top-bar">
        <div className="top-bar-left">
          <img
            className="app-logo-img app-logo-img--clickable"
            src="/sjosyn-logo.jpg"
            alt="Sjøsyn logo — tap for å installere som app"
            title={isStandalone ? 'Sjøsyn er installert' : 'Tap for å installere som app'}
            onClick={handleLogoClick}
          />
          <div className="app-brand">
            <span className="app-sub">Ryfylke</span>
            <span className="app-name">Sjøsyn</span>
          </div>
        </div>
        <div className="top-bar-right">
          <button
            className="icon-btn"
            title={`Kartstil: ${mapStyle.title} — trykk for å bytte`}
            onClick={() => setMapStyleIndex(i => (i + 1) % MAP_STYLES.length)}
          >
            <span className="icon-glyph">{mapStyle.label}</span>
            <span className="icon-label">Tema</span>
          </button>
          <button
            className={`icon-btn ${showNautical && onMap ? 'active' : ''}`}
            title="Sjøkart av/på"
            onClick={() => { focusMap(); setShowNautical(n => !n) }}
          >
            <span className="icon-glyph">🗺</span>
            <span className="icon-label">Sjøkart</span>
          </button>
          <button
            className={`icon-btn ${(drawMode !== 'idle' || showTripwireMenu) && onMap ? 'active' : ''}`}
            title="Vakt — varsling når fartøy krysser linje eller forlater rute"
            onClick={() => { focusMap(); setShowTripwireMenu(v => !v) }}
          >
            <span className="icon-glyph">🎯</span>
            <span className="icon-label">Vakt</span>
          </button>
          <button
            className="icon-btn"
            title={prefs.home ? 'Fly til lagret hjem' : 'Sett hjem-posisjon'}
            onClick={() => { focusMap(); if (prefs.home) handleFlyHome(); else handleStartSetHome() }}
          >
            <span className="icon-glyph">🏠</span>
            <span className="icon-label">Hjem</span>
          </button>
          <button
            className={`icon-btn ${locating ? 'active' : ''}`}
            title="Gå til min posisjon"
            onClick={() => { focusMap(); handleGeolocate() }}
          >
            <span className="icon-glyph">📍</span>
            <span className="icon-label">Meg</span>
          </button>
        </div>
      </header>

      {error && (
        <div className="error-banner">
          ⚠ {error}
          <button className="retry-btn" onClick={retry}>Prøv igjen</button>
        </div>
      )}

      {/* No onClick here — vessel stays locked until X or selecting another vessel */}
      <main className="map-area">
        <MapView
          vessels={vessels}
          selectedVessel={liveSelected}
          onSelectVessel={handleSelectVessel}
          onBoundsChange={handleBoundsChange}
          onZoomChange={handleZoomChange}
          mapRef={mapRef}
          showNautical={showNautical}
          track={track}
          trackLoading={trackLoading}
          playheadIndex={playheadIndex}
          panelPx={panelPx}
          trackHours={trackHours}
          tileUrl={mapStyle.url}
          zoom={zoom}
          showVectors={showVectors}
          showNames={prefs.showNames}
          clusterOn={prefs.clusterStationary}
          bgColor={mapStyle.bg}
          wavePoints={wavePoints}
          waveScrubT={forecastScrubT}
          onSelectWavePoint={handleSelectWavePoint}
          selectedWavePoint={selectedWavePoint}
          onCloseWavePopup={closeWavePopup}
          windPoints={windPoints}
          windScrubT={forecastScrubT}
          windUnit={windUnit}
          onSelectWindPoint={handleSelectWindPoint}
          selectedWindPoint={selectedWindPoint}
          onCloseWindPopup={closeWindPopup}
          onSelectComboPair={handleSelectComboPair}
          selectedComboPair={selectedComboPair}
          onCloseComboPopup={closeComboPopup}
          forecastHorizon={effectiveHorizon}
          forecastThin={forecastThin}
          userPos={userPos}
          tripwires={tripwires}
          tripwireDrawMode={drawMode !== 'idle'}
          tripwireDraftPoint={draftPoint}
          tripwireDraftPath={draftPath}
          tripwireDraftWidth={draftWidth}
          tripwireDraftCircle={draftCircle}
          onAddTripwirePoint={handleAddTripwirePoint}
          onRemoveTripwire={handleRemoveTripwire}
          onSetCorridorWidth={handleSetCorridorWidth}
          onSetCircleRadius={handleSetCircleRadius}
          onRecenterCircle={handleRecenterCircle}
          bounds={bounds}
          aisCredit={!isDemoMode}
          waveCredit={waveEnabled}
          home={prefs.home}
          homePickMode={homePickMode}
          onMoveHome={handleMoveHome}
        />

        {isDemoMode && <div className="demo-badge">DEMOMODUS</div>}

        {/* Spor-scrub: dato + tid ØVERST på kartet mens man vrir hjulet, så det
            er lett synlig (panel/finger dekker readout-en nederst). Vises kun når
            man står på et historisk punkt i spor-modus. */}
        {trackHours > 0 && track.length > 1 && playheadIndex >= 0 && playheadIndex < track.length - 1 && activeTab === 'map' && (
          <div className="scrub-readout">
            {new Date(track[playheadIndex].time).toLocaleString('nb-NO', {
              weekday: 'short', day: 'numeric', month: 'short',
              hour: '2-digit', minute: '2-digit',
            })}
          </div>
        )}

        {/* Hjemmehavn pick-modus — dra kartet så senteret peker på hjemmet, bekreft */}
        {homePickMode && (
          <>
            <div className="home-pick-center" aria-hidden="true" />
            <div className="home-pick-hint home-pick-hint--confirm">
              <span>🏠 Dra kartet dit hjemmet ditt skal være. Kartet åpner her — med samme zoom — hver gang du starter appen.</span>
              <div className="home-pick-actions">
                <button className="home-pick-cancel" onClick={() => setHomePickMode(false)}>Avbryt</button>
                <button className="home-pick-ok" onClick={handleConfirmHome}>Bruk dette</button>
              </div>
            </div>
          </>
        )}

        {/* Kartlag-panel — på/av per lag + åpne tidslinje. Erstatter chip-ene. */}
        {!showSettings && !showSearch && activeTab === 'map' && (
          <LayerPanel
            layers={layers}
            collapsed={prefs.layerPanelCollapsed}
            onToggleCollapse={() => updatePrefs({ layerPanelCollapsed: !prefs.layerPanelCollapsed })}
            onToggleActive={toggleLayerActive}
            onOpenTimeline={openLayerTimeline}
            info={{ wave: forecastInfo, wind: forecastInfo }}
            errors={{ wave: waveError, wind: windError }}
          />
        )}

        {/* Varsel-linje — ett tidsvalg + scrub styrer både bølge og vind */}
        {(waveEnabled || windEnabled) && forecastPanelOpen && !showSettings && !showSearch && activeTab === 'map' && (
          <ForecastBar
            horizon={effectiveHorizon}
            onHorizon={h => updatePrefs({ forecastHorizon: h })}
            scrub={forecastScrub}
            onScrub={setForecastScrub}
            anchorT={forecastAnchor}
            maxOffsetH={forecastMaxOffsetH}
            loading={waveLoading || windLoading}
            error={waveError || windError}
            hasData={wavePoints.length > 0 || windPoints.length > 0}
            onClose={toggleForecastPanel}
          />
        )}

        {selectedVessel && activeTab === 'map' && (
          <VesselPanel
            vessel={liveSelected}
            onClose={handleCloseVessel}
            collapsed={panelCollapsed}
            onToggleCollapse={() => setPanelCollapsed(c => !c)}
            trackHours={trackHours}
            onTrackHours={setTrackHours}
            trackLoading={trackLoading}
            trackError={trackError}
            onRetryTrack={retryTrack}
            trackPoints={track.length}
            track={track}
            playheadIndex={playheadIndex}
            onPlayheadChange={setPlayheadIndex}
            isInFleet={isInFleet}
            onToggleFleet={handleToggleFleet}
          />
        )}

        {showSearch && (
          <SearchPanel
            vessels={vessels}
            onSelectVessel={handleSelectVessel}
            onClose={() => setShowSearch(false)}
          />
        )}

        {showSettings && (
          <SettingsPanel
            prefs={prefs}
            onPrefs={updatePrefs}
            onEnroll={enrollLayer}
            showVectors={showVectors}
            onShowVectors={setShowVectors}
            isDemoMode={isDemoMode}
            connected={connected}
            connError={error}
            onSetHome={handleStartSetHome}
            onToggleDemo={() => {
              const next = !demoMode
              if (next) localStorage.setItem('mw_demo', '1')
              else localStorage.removeItem('mw_demo')
              setDemoMode(next)
              setSelectedVessel(null)
            }}
            onClose={() => setShowSettings(false)}
          />
        )}
      </main>

      {showPushSetup && (
        <PushSetupModal
          onClose={() => setShowPushSetup(false)}
          onSubscribed={sub => {
            setPushSubActive(!!sub)
            if (sub) syncTripwiresToBackend(tripwires, prefs.alarmMode)
              .then(() => setPushSyncError(false))
              .catch(() => setPushSyncError(true))
          }}
        />
      )}

      {showAlarmSoundSetup && (
        <AlarmSoundModal
          onClose={() => setShowAlarmSoundSetup(false)}
          onAcknowledge={() => {
            updatePrefs({ alarmSoundAck: true })
            setShowAlarmSoundSetup(false)
          }}
        />
      )}

      {showInstall && (
        <InstallModal
          installPrompt={installPrompt}
          isStandalone={isStandalone}
          onClose={() => setShowInstall(false)}
        />
      )}

      {/* Tripwire-meny (fra toolbar) */}
      {showTripwireMenu && onMap && (
        <div className="tw-menu-backdrop" onClick={() => setShowTripwireMenu(false)}>
          <div className="tw-menu" onClick={e => e.stopPropagation()}>
            <div className="tw-menu-title">🎯 Vakt</div>
            {selectedVessel ? (
              <>
                <button className="tw-menu-item" onClick={() => { setShowTripwireMenu(false); handleStartDraw('line') }}>
                  <strong>Ny vakt – linje</strong>
                  <span>Varsel når {selectedVessel.name || 'fartøyet'} krysser en strek</span>
                </button>
                <button className="tw-menu-item" onClick={() => { setShowTripwireMenu(false); handleStartDraw('corridor') }}>
                  <strong>Ny vakt – rute</strong>
                  <span>Varsel når {selectedVessel.name || 'fartøyet'} forlater en korridor</span>
                </button>
                <button className="tw-menu-item" onClick={() => { setShowTripwireMenu(false); handleStartDraw('circle') }}>
                  <strong>Ny vakt – driftvakt</strong>
                  <span>Alarm når {selectedVessel.name || 'fartøyet'} driver ut av en sirkel</span>
                </button>
              </>
            ) : (
              <div className="tw-menu-hint">Velg et fartøy på kartet først for å lage en vakt.</div>
            )}
            <button className="tw-menu-item" onClick={() => { setShowTripwireMenu(false); setShowTripwireList(true) }}>
              <strong>Mine vakter</strong>
              <span>{Object.keys(tripwires).length} aktive</span>
            </button>
            {!pushSubActive && (
              <button className="tw-menu-item" onClick={() => { setShowTripwireMenu(false); setShowPushSetup(true) }}>
                <strong>📡 Aktiver bakgrunnsvarsling</strong>
                <span>Få varsel selv når appen er lukket</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mine tripwires — liste */}
      {showTripwireList && (
        <div className="tw-menu-backdrop" onClick={() => setShowTripwireList(false)}>
          <div className="tw-list" onClick={e => e.stopPropagation()}>
            <div className="tw-list-header">
              <span>Mine vakter</span>
              <button className="close-btn" onClick={() => setShowTripwireList(false)} title="Lukk" aria-label="Lukk">✕</button>
            </div>
            {Object.keys(tripwires).length === 0 ? (
              <div className="tw-menu-hint">Ingen aktive vakter.</div>
            ) : (
              <ul className="tw-list-items">
                {Object.entries(tripwires).map(([mmsi, t]) => (
                  <li key={mmsi} className={`tw-list-item${t.armed === false ? ' tw-list-item--paused' : ''}`}>
                    <div className="tw-list-text">
                      <strong>{t.vesselName || `MMSI ${mmsi}`}</strong>
                      <span>
                        {t.type === 'circle' ? `Driftvakt · ${t.radiusM ?? 200} m radius`
                          : t.type === 'corridor' ? `Rute · ${t.widthM ?? 250} m bred` : 'Linje'}
                        {t.armed === false && ' · ⏸ pauset'}
                      </span>
                    </div>
                    <div className="tw-list-actions">
                      <button className="tw-list-btn" onClick={() => {
                        const anchor = t.type === 'circle' ? t.center : t.type === 'corridor' ? t.path?.[0] : t.a
                        if (anchor && mapRef.current) mapRef.current.flyTo(anchor, 13, { duration: 1.0 })
                        setShowTripwireList(false)
                      }}>Vis</button>
                      <button className="tw-list-btn" onClick={() => handleToggleTripwireArmed(mmsi)}>
                        {t.armed === false ? 'Fortsett' : 'Pause'}
                      </button>
                      <button className="tw-list-btn tw-list-btn--danger" onClick={() => handleRemoveTripwire(mmsi)}>Fjern</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Draw-kontroll — flyter uavhengig av fartøy-panelet, kun i kart-visning */}
      {drawMode !== 'idle' && onMap && (
        <div className="draw-control">
          {drawMode === 'point0' && <span>🎯 Trykk på kartet: punkt 1 av 2 (linje)</span>}
          {drawMode === 'point1' && (
            <span>{drawWarn
              ? '⚠ For nær forrige punkt — trykk lenger unna'
              : '🎯 Trykk på kartet: punkt 2 av 2 (linje)'}</span>
          )}
          {drawMode === 'route' && (
            <span>🧭 Trykk for å legge til rute-punkter ({draftPath.length} satt). Minst 2.</span>
          )}
          {drawMode === 'circle' && (
            <span>⚓ Driftvakt: trykk på kartet for å flytte senteret. Juster radius under.</span>
          )}
          {drawMode === 'route' && (
            <div className="draw-width">
              <label>Bredde: <strong>{draftWidth} m</strong></label>
              <input type="range" min="250" max="4000" step="50"
                value={draftWidth}
                onChange={e => setDraftWidth(Number(e.target.value))} />
              <div className="draw-width-presets">
                {[1000, 2000, 3000, 4000].map(w => (
                  <button key={w}
                    className={`corridor-preset${draftWidth === w ? ' corridor-preset--active' : ''}`}
                    onClick={() => setDraftWidth(w)}>{w} m</button>
                ))}
              </div>
            </div>
          )}
          {drawMode === 'circle' && draftCircle && (
            <div className="draw-width">
              <label>Radius: <strong>{draftCircle.radiusM} m</strong></label>
              <input type="range" min="50" max="5000" step="50"
                value={draftCircle.radiusM}
                onChange={e => setDraftCircle(c => ({ ...c, radiusM: Number(e.target.value) }))} />
              <div className="draw-width-presets">
                {[100, 200, 500, 1000].map(r => (
                  <button key={r}
                    className={`corridor-preset${draftCircle.radiusM === r ? ' corridor-preset--active' : ''}`}
                    onClick={() => setDraftCircle(c => ({ ...c, radiusM: r }))}>{r} m</button>
                ))}
              </div>
            </div>
          )}
          <div className="draw-control-actions">
            {drawMode === 'route' && draftPath.length > 0 && (
              <button className="draw-btn" onClick={handleUndoRoutePoint}>Angre</button>
            )}
            {drawMode === 'route' && (
              <button className="draw-btn draw-btn--primary" disabled={draftPath.length < 2} onClick={handleFinishRoute}>Ferdig</button>
            )}
            {drawMode === 'circle' && (
              <button className="draw-btn draw-btn--primary" onClick={handleSaveCircle}>Lagre</button>
            )}
            <button className="draw-btn draw-btn--cancel" onClick={handleCancelDraw}>Avbryt</button>
          </div>
        </div>
      )}

      {pushSyncError && (
        <div className="sync-error-chip">
          <span>⚠ Bakgrunnsvarsling kunne ikke oppdateres</span>
          <button className="sync-error-retry" onClick={() => doSync().catch(() => {})}>Prøv igjen</button>
        </div>
      )}

      {!pushSyncError && backendDown && (
        <div className="sync-error-chip" onClick={() => setBackendDown(false)}>
          ⚠ Bakgrunnsvarsling-tjenesten svarer ikke akkurat nå
        </div>
      )}

      {coverageWarning && !coverageDismissed && (
        <div className="coverage-warn-chip">
          {coverageWarning.denied ? (
            <div className="coverage-warn-main coverage-warn-info">
              🔕 {coverageWarning.msg}. Skru på varsler for Sjøsyn i nettleser- eller systeminnstillingene.
            </div>
          ) : (
            <button
              className="coverage-warn-main"
              onClick={() => setShowPushSetup(true)}
            >
              🔕 {coverageWarning.msg} — trykk for å aktivere bakgrunnsvarsling
            </button>
          )}
          <button
            className="coverage-warn-ok"
            onClick={() => setCoverageDismissed(true)}
            aria-label="Lukk"
          >
            Lukk
          </button>
        </div>
      )}

      {!tapHintDismissed && onMap && !selectedVessel && drawMode === 'idle' && !showSettings && !showSearch && (
        <div className="tap-hint">
          <span>👆 Trykk på et fartøy på kartet for å se detaljer</span>
          <button
            className="tap-hint-close"
            onClick={() => { setTapHintDismissed(true); try { localStorage.setItem('mw_tapboat_seen', '1') } catch { /* ignore */ } }}
            aria-label="Lukk"
          >✕</button>
        </div>
      )}

      {inAppTripwire && (
        <div className={`tripwire-banner${inAppTripwire.mode === 'alarm' ? ' tripwire-banner--alarm' : ''}`}>
          <div className="tripwire-banner-text">
            <strong>{inAppTripwire.title}</strong>
            <span>{inAppTripwire.body}</span>
          </div>
          <div className="tripwire-banner-actions">
            <button
              className="tripwire-banner-btn"
              onClick={() => {
                focusTripwire(inAppTripwire.data)
                setInAppTripwire(null)
              }}
            >Vis</button>
            <button
              className="tripwire-banner-btn tripwire-banner-btn--danger"
              onClick={() => {
                if (inAppTripwire.data?.mmsi) handleRemoveTripwire(String(inAppTripwire.data.mmsi))
                setInAppTripwire(null)
              }}
            >Fjern</button>
            <button
              className="tripwire-banner-close"
              onClick={() => setInAppTripwire(null)}
              aria-label="Behold og lukk"
            >✕</button>
          </div>
        </div>
      )}

      {/* Varsel-popupene rendres nå forankret inne i MapView (Leaflet Popup) */}

      {/* Ansvarsfraskrivelse ved første oppstart — kreves synlig info om
          datakilde (Barentswatch-vilkår) og "ikke for navigasjon" */}
      {showDisclaimer && (
        <div className="disclaimer-overlay">
          <div className="disclaimer-card">
            <div className="disclaimer-title">⚓ Viktig</div>
            <p>
              <strong>Sjøsyn er kun til informasjon og skal ikke brukes til navigasjon.</strong>{' '}
              AIS-posisjoner kan være forsinket eller mangle, og bølgedata er modellbaserte
              varsler uten garanti. Bruk offisielle sjøkart og godkjente kilder for navigasjon
              og sikkerhet. All bruk skjer på eget ansvar.
            </p>
            <p className="disclaimer-sub">
              Data levert av{' '}
              <a href="https://www.barentswatch.no/" target="_blank" rel="noopener noreferrer">BarentsWatch</a>{' '}
              (kilde: Kystverket). Alt lagres kun på din enhet — ingen sporing eller analyse.
            </p>
            <button
              className="disclaimer-btn"
              onClick={() => { localStorage.setItem('mw_disclaimer_ok', '1'); setShowDisclaimer(false) }}
            >
              Jeg forstår
            </button>
          </div>
        </div>
      )}

      <nav className="bottom-nav">
        <button
          className={`nav-btn ${activeTab === 'map' && !showSearch && !showSettings ? 'active' : ''}`}
          onClick={() => { setActiveTab('map'); setShowSearch(false); setShowSettings(false) }}
        >
          <span className="nav-icon">🗺</span>
          <span>Kart</span>
        </button>
        <button
          className={`nav-btn ${showSearch ? 'active' : ''}`}
          onClick={() => { setShowSearch(s => !s); setShowSettings(false); setShowTripwireMenu(false); setActiveTab('map') }}
        >
          <span className="nav-icon">🔍</span>
          <span>Søk</span>
        </button>
        <button
          className={`nav-btn ${activeTab === 'fleet' ? 'active' : ''}`}
          onClick={() => { setActiveTab('fleet'); setShowSearch(false); setShowSettings(false); setShowTripwireMenu(false) }}
        >
          <span className="nav-icon">🚢</span>
          <span>Flåte</span>
        </button>
        <button
          className={`nav-btn ${showSettings ? 'active' : ''}`}
          onClick={() => { setShowSettings(s => !s); setShowSearch(false); setShowTripwireMenu(false); setActiveTab('map') }}
        >
          <span className="nav-icon">⚙</span>
          <span>Innstillinger</span>
        </button>
      </nav>

      {activeTab === 'fleet' && (
        <div className="fleet-overlay" onClick={e => e.stopPropagation()}>
          <div className="fleet-header">
            <h2>Flåte — {savedFleet.length} {savedFleet.length === 1 ? 'fartøy' : 'fartøy'}</h2>
            <button className="close-btn" onClick={() => setActiveTab('map')} title="Lukk" aria-label="Lukk">✕</button>
          </div>
          <div className="fleet-list">
            {savedFleet.length === 0 && (
              <div className="fleet-empty">
                <div className="fleet-empty-icon">🚢</div>
                <div className="fleet-empty-title">Ingen fartøy i flåten</div>
                <div className="fleet-empty-sub">
                  Trykk på et fartøy i kartet og velg <strong>«Legg til i flåten»</strong>{' '}
                  for å samle dine egne båter her.
                </div>
              </div>
            )}
            {savedFleet.map(saved => {
              const live = vessels.find(v => String(v.mmsi) === String(saved.mmsi))
              const view = live ?? saved
              const colors = { 30: '#ffd166', 60: '#457b9d', 70: '#6d6875', 80: '#e9c46a', 36: '#81b29a', 37: '#a8dadc' }
              const color = colors[parseInt(view.type)] || '#adb5bd'
              return (
                <button
                  key={saved.mmsi}
                  className={`vessel-list-item${live ? '' : ' vessel-list-item--offline'}`}
                  onClick={() => live && handleSelectVessel(live)}
                  disabled={!live}
                >
                  <span className="vessel-list-dot" style={{ background: color }} />
                  <div className="vessel-list-info">
                    <div className="vessel-list-name">{view.name || `MMSI ${saved.mmsi}`}</div>
                    <div className="vessel-list-meta">
                      {live
                        ? `${formatSpeed(live.sog)}${live.destination ? ` · ➜ ${live.destination}` : ''}`
                        : 'Utenfor kart-området'}
                    </div>
                  </div>
                  <span style={{ color: '#888', fontSize: '0.7rem' }}>{saved.mmsi}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
