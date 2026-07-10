import { useEffect, useRef, useMemo, memo, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, useMapEvents, useMap, AttributionControl } from 'react-leaflet'
import { svg, divIcon, marker as lMarker } from 'leaflet'
import { createVesselIcon, createPlayheadIcon, createMinuteLabel, createClusterIcon, vesselLabelClass } from './VesselIcon'
import { getVesselColor, getVesselType } from '../utils/vesselTypes'
import WaveLayer from './WaveLayer'
import WindLayer from './WindLayer'
import { thinBySpacing, deOverlapLayers } from '../utils/thinPoints'
import { buildLabelLayout } from '../utils/labelLayout'
import TripwireOverlay from './TripwireOverlay'
import CanvasVesselLayer from './CanvasVesselLayer'

// Vessel render path. 'dom' = one divIcon Marker per vessel (proven; heavy at
// thousands — ~15.8k DOM nodes / 2600 boats). 'canvas' = all triangles on one
// <canvas> (CanvasVesselLayer), with hybrid on-screen DOM name labels and
// on-canvas heading vectors. Flip to 'canvas' to test; flip back to revert.
// 'canvas' (default now) | 'dom'. Override live with ?render=dom (or ?render=canvas)
// so the paths can be compared without a redeploy each flip — fall back to 'dom'
// instantly if canvas misbehaves on a real device.
const VESSEL_RENDER = (() => {
  try {
    const r = new URLSearchParams(window.location.search).get('render')
    return r === 'canvas' || r === 'dom' ? r : 'canvas'
  } catch { return 'canvas' }
})()

const BASE_ATTR = '&copy; <a href="https://carto.com">CARTO</a> &copy; <a href="https://openstreetmap.org">OSM</a>'
// Kartverket sjokartraster — Norges offisielle sjøkart med dybdekoter,
// hindringer, fyrlamper, bøyer og all standard sjøkart-symbolikk.
// Web Mercator WMTS-cache, gratis for visning. NB: tile-stien bruker
// {z}/{y}/{x} (ikke standard {z}/{x}/{y}).
const NAUTICAL_TILES = 'https://cache.kartverket.no/v1/wmts/1.0.0/sjokartraster/default/webmercator/{z}/{y}/{x}.png'
const NAUTICAL_ATTR  = 'Sjøkart: <a href="https://kartverket.no/" target="_blank" rel="noopener">© Kartverket</a>'

// bg ≈ the tile style's water colour — shows behind unloaded tiles while
// panning so the edges blend instead of flashing a mismatched backdrop.
export const MAP_STYLES = [
  {
    key: 'dark',
    label: '🌑',
    title: 'Mørk',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    bg: '#0e0e10',
  },
  {
    key: 'voyager',
    label: '🌗',
    title: 'Voyager',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    bg: '#aad3df',
  },
  {
    key: 'light',
    label: '☀️',
    title: 'Lys',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    bg: '#d4dadc',
  },
]

function speedColor(sog) {
  if (sog < 1) return '#4a6a8a'
  if (sog < 5) return '#2a9d8f'
  if (sog < 12) return '#e9c46a'
  if (sog < 20) return '#f4a261'
  return '#e63946'
}

function BoundsWatcher({ onBoundsChange, onZoomChange }) {
  const map = useMapEvents({
    moveend: () => {
      const b = map.getBounds()
      onBoundsChange({
        north: b.getNorth(), south: b.getSouth(),
        east: b.getEast(),  west: b.getWest(),
      })
    },
    zoomend: () => {
      onZoomChange(map.getZoom())
    },
  })

  // Report the initial view too — moveend only fires on interaction, so
  // without this, bounds stay null until the user pans for the first time.
  // The map may not have measured its container yet at mount (getBounds()
  // then returns a zero-area box at the centre), so retry until it has size.
  // setTimeout, not rAF: rAF doesn't fire while the page isn't compositing
  // (backgrounded PWA launch), which would silently skip the report.
  useEffect(() => {
    let timer = 0
    let tries = 0
    const report = () => {
      const size = map.getSize()
      if (!size.x || !size.y) {
        map.invalidateSize()
        if (tries++ < 20) timer = setTimeout(report, 150)
        return   // hidden/zero-size map — moveend covers it later
      }
      const b = map.getBounds()
      onBoundsChange({
        north: b.getNorth(), south: b.getSouth(),
        east: b.getEast(),  west: b.getWest(),
      })
      onZoomChange(map.getZoom())
    }
    report()
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}

// Captures the Leaflet map instance into a ref so App can call flyTo from outside
function MapCapture({ mapRef }) {
  const map = useMap()
  useEffect(() => { mapRef.current = map }, [map, mapRef])
  return null
}

// Data-source credits in the attribution line. Barentswatch's API terms
// require the marking to be clearly visible while the app is in use;
// MET Norway's CC BY 4.0 licence requires attribution next to displayed data.
const AIS_CREDIT  = 'Data levert av <a href="https://www.barentswatch.no/" target="_blank" rel="noopener">BarentsWatch</a> (Kystverket)'
const WAVE_CREDIT = 'Bølgevarsel: <a href="https://www.met.no/" target="_blank" rel="noopener">MET Norway</a> (CC BY 4.0)'

function Credits({ ais, waves }) {
  const map = useMap()
  useEffect(() => {
    const ctl = map.attributionControl
    if (!ctl || !ais) return
    ctl.addAttribution(AIS_CREDIT)
    return () => ctl.removeAttribution(AIS_CREDIT)
  }, [map, ais])
  useEffect(() => {
    const ctl = map.attributionControl
    if (!ctl || !waves) return
    ctl.addAttribution(WAVE_CREDIT)
    return () => ctl.removeAttribution(WAVE_CREDIT)
  }, [map, waves])
  return null
}

// Sammenleggbar attribusjon: starter som en «ⓘ Kilder»-chip og utvider full
// kreditering ved trykk. CSS (.attr-open) styrer visningen; her toggler vi
// klassen. Lenker inni får virke uten å lukke.
function CollapsibleAttribution() {
  const map = useMap()
  useEffect(() => {
    const ctl = map.attributionControl
    if (!ctl) return
    const el = ctl.getContainer()
    if (!el) return
    el.classList.remove('attr-open')
    el.title = 'Datakilder / attribusjon'
    const onClick = (e) => {
      if (e.target.tagName === 'A') return   // la lenker navigere
      el.classList.toggle('attr-open')
    }
    el.addEventListener('click', onClick)
    return () => el.removeEventListener('click', onClick)
  }, [map])
  return null
}

// Fly to vessel, offsetting the centre so the vessel appears in the
// middle of the visible map area above the panel (not behind it).
function FlyToVessel({ vessel, panelPx }) {
  const map = useMap()
  const prevMmsi = useRef(null)
  const prevPanelPx = useRef(0)

  useEffect(() => {
    if (!vessel) { prevMmsi.current = null; return }

    const newVessel = vessel.mmsi !== prevMmsi.current
    const panelChanged = panelPx !== prevPanelPx.current

    if (newVessel || panelChanged) {
      const curZoom = map.getZoom()
      const zoom = newVessel ? Math.max(curZoom, 12) : curZoom
      const pt = map.project([vessel.lat, vessel.lon], zoom)
      pt.y += panelPx / 2
      const center = map.unproject(pt, zoom)

      // flyTo lager en zoom-ut-zoom-inn-bue — bra når vi faktisk må zoome inn fra
      // langt ute, men rykkete når zoomen ikke endrer seg (vanlig skip-til-skip).
      // Bruk en jevn lineær panTo når zoomen er uendret.
      if (newVessel && zoom !== curZoom) {
        map.flyTo(center, zoom, { duration: 1.0, easeLinearity: 0.25 })
      } else {
        map.panTo(center, { animate: true, duration: 0.6, easeLinearity: 0.25 })
      }

      prevMmsi.current = vessel.mmsi
      prevPanelPx.current = panelPx
    }
  }, [vessel, panelPx, map])
  return null
}

// Pans to the playhead position with the same panel offset
function PlayheadFollower({ point, panelPx }) {
  const map = useMap()
  const prev = useRef(null)
  useEffect(() => {
    if (!point) return
    if (prev.current?.lat === point.lat && prev.current?.lon === point.lon) return
    prev.current = point
    const zoom = map.getZoom()
    const pt = map.project([point.lat, point.lon], zoom)
    pt.y += panelPx / 2
    const center = map.unproject(pt, zoom)
    map.panTo(center, { animate: true, duration: 0.25 })
  }, [point, panelPx, map])
  return null
}

// Playhead (ghost triangle at the scrubbed historical position). Driven by an
// imperative marker + easing ticker — same idea as the live-vessel MotionTicker:
// instead of snapping the marker to each discrete track point as the jog-wheel
// emits a new index (which looks like teleporting), we ease the rendered position
// toward the target every frame so it glides smoothly between points. Reads live
// track/index from a ref so the effect mounts once and the ticker tracks scrubs.
const PLAYHEAD_TICK_MS = 33      // ~30fps — smooth scrub without a per-marker rAF
const PLAYHEAD_EASE = 0.35       // fraction of the remaining gap closed per tick
const PLAYHEAD_SNAP_DEG = 0.2    // gap bigger than this (new track / vessel) → jump
function PlayheadMarker({ track, playheadIndex, color }) {
  const map = useMap()
  const stateRef = useRef({ track, playheadIndex, color })
  stateRef.current = { track, playheadIndex, color }

  useEffect(() => {
    const at = () => {
      const { track: t, playheadIndex: i } = stateRef.current
      return t && i >= 0 && i < t.length ? t[i] : null
    }
    const start = at()
    if (!start) return
    let rendered = [start.lat, start.lon]
    const mk = lMarker(rendered, {
      icon: createPlayheadIcon(start, stateRef.current.color),
      zIndexOffset: 500, interactive: false, keyboard: false,
    }).addTo(map)
    let cogBucket = Math.round((start.cog ?? 0) / 5) * 5

    const timer = setInterval(() => {
      const p = at()
      if (!p) return
      const target = [p.lat, p.lon]
      const gap = Math.abs(target[0] - rendered[0]) + Math.abs(target[1] - rendered[1])
      rendered = gap > PLAYHEAD_SNAP_DEG
        ? target                                   // big jump → don't ease across the map
        : [rendered[0] + (target[0] - rendered[0]) * PLAYHEAD_EASE,
           rendered[1] + (target[1] - rendered[1]) * PLAYHEAD_EASE]
      mk.setLatLng(rendered)
      // Heading rotation is baked into the icon → only rebuild when the bucket
      // actually changes (rare vs every tick). The swap re-applies mk's eased
      // latlng to the new element, so it never teleports.
      const cb = Math.round((p.cog ?? 0) / 5) * 5
      if (cb !== cogBucket) { cogBucket = cb; mk.setIcon(createPlayheadIcon(p, stateRef.current.color)) }
    }, PLAYHEAD_TICK_MS)

    return () => { clearInterval(timer); mk.remove() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map])
  return null
}

// ── Geometry helpers ────────────────────────────────────────────────────────
// Haversine forward projection: move distM metres from lat/lon along brngDeg.
function projectMeters(lat, lon, brngDeg, distM) {
  const R = 6371000
  const brng = (brngDeg * Math.PI) / 180
  const lat1 = (lat * Math.PI) / 180
  const lon1 = (lon * Math.PI) / 180
  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(distM / R) +
    Math.cos(lat1) * Math.sin(distM / R) * Math.cos(brng)
  )
  const lon2 = lon1 + Math.atan2(
    Math.sin(brng) * Math.sin(distM / R) * Math.cos(lat1),
    Math.cos(distM / R) - Math.sin(lat1) * Math.sin(lat2)
  )
  return [(lat2 * 180) / Math.PI, (lon2 * 180) / Math.PI]
}

// Where will the vessel be in N minutes if course and speed hold?
function projectPoint(lat, lon, cogDeg, sogKn, minutes) {
  return projectMeters(lat, lon, cogDeg, sogKn * 1852 * (minutes / 60))
}

// Dashed course line with passing points at 5 / 10 / 15 minutes.
// `labeled` adds 5′/10′/15′ text (used for the selected vessel only).
//
// The line originates from the vessel's *dead-reckoned* (rendered) position, not
// its stale reported one — otherwise the line's tail lags behind the moving icon
// and pokes out the back. We register the Leaflet layers in dynRef so the shared
// MotionTicker drags them forward every frame, locked to the icon.
function HeadingVector({ vessel, labeled, dynRef }) {
  const lineRef = useRef(null)
  const dotRefs = useRef([])
  const labelRefs = useRef([])

  // Snapshot the current rendered position at render time so React's initial
  // geometry already matches where the ticker has the icon (no per-poll snap-back).
  const base = dynRef?.current?.get(vessel.mmsi)?.rendered ?? [vessel.lat, vessel.lon]
  const moving = (vessel.sog ?? 0) >= 0.5

  const pts = useMemo(() => {
    if (!moving) return null
    return [5, 10, 15].map(m => ({
      m,
      pos: projectPoint(base[0], base[1], vessel.cog ?? 0, vessel.sog, m),
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vessel, base[0], base[1], moving])

  // Hand the layer refs to the ticker (attaches to the marker's existing entry).
  useEffect(() => {
    if (!dynRef || !moving) return
    const reg = dynRef.current
    const mmsi = vessel.mmsi
    let entry = reg.get(mmsi)
    if (!entry) { entry = {}; reg.set(mmsi, entry) }
    entry.vector = {
      line: lineRef.current,
      dots: dotRefs.current,
      labels: labeled ? labelRefs.current : null,
    }
    return () => { const e = reg.get(mmsi); if (e) e.vector = null }
  }, [vessel.mmsi, labeled, moving, dynRef])

  if (!pts) return null
  const color = getVesselColor(vessel.type)

  return (
    <>
      <Polyline
        ref={lineRef}
        positions={[base, ...pts.map(p => p.pos)]}
        color={color}
        weight={2}
        opacity={0.85}
        dashArray="4 6"
        interactive={false}
      />
      {pts.map((p, i) => (
        <CircleMarker
          key={p.m}
          ref={el => { dotRefs.current[i] = el }}
          center={p.pos}
          radius={p.m === 15 ? 5 : 4}   // end-of-line 15′ point a touch larger
          color="#ffffff"               // white ring → reads on dark & light tiles
          fillColor={color}
          fillOpacity={1}
          weight={1.5}
          interactive={false}
        />
      ))}
      {labeled && pts.map((p, i) => (
        <Marker
          key={`lbl-${p.m}`}
          ref={el => { labelRefs.current[i] = el }}
          position={p.pos}
          icon={createMinuteLabel(p.m, color)}
          interactive={false}
          zIndexOffset={400}
        />
      ))}
    </>
  )
}

// ── Dead-reckoning motion ───────────────────────────────────────────────────
// Markers are positioned by projecting each vessel's *reported* position
// (msgtime) forward along cog at sog — so the rendered position tracks the
// vessel's real AIS report rate, automatically compensating for Barentswatch
// cache lag and our own poll timing. One shared rAF loop moves every marker;
// the rendered point eases toward the projected target so a fresh report
// bends the path smoothly instead of jumping.
const TICK_MS = 100              // ~10 fps is sub-pixel-smooth at all zooms
// Hard cap: AIS sends moving-vessel positions every 2-10 s. If we haven't
// heard from a vessel in 60 s, the report is uncertain — projecting further
// has been observed to put fast vessels solidly inland. Past this we freeze
// the marker at the last reported position and dim it.
const MAX_PROJECT_MS = 60_000
// Pas på: vessels stale past STALE_MS get no dead-reckoning at all and a
// faded marker; past DEAD_MS they drop off the live map entirely (see App).
export const STALE_MS = 15 * 60_000
export const DEAD_MS  = 90 * 60_000
const EASE_TAU = 900             // ms to absorb ~63 % of a correction
const KN_TO_MS = 0.514444        // knots → metres/second
const M_PER_DEG = 111_320        // metres per degree latitude

// Along-track correction limits, as multiples of the vessel's own step:
// net forward speed stays within [1+MIN, 1+MAX] × sog — never backwards,
// never frozen, catches up at ~2× speed when behind.
const ALONG_MIN = -0.4
const ALONG_MAX = 1.2

function MotionTicker({ dynRef, zoomRef }) {
  useEffect(() => {
    let last = performance.now()
    // Når app blir aktiv etter å ha vært hidden/bfcache: alle AIS-rapporter er
    // pre-resume → ukjent ground-truth. Inntil fersk poll kommer, ikke DR;
    // snap markøren til siste rapporterte posisjon. Bevart over hidden så vi
    // ikke driver båt forbi sin egentlige plassering.
    let resumedAt = Date.now()
    const onResume = () => {
      if (document.visibilityState === 'visible') resumedAt = Date.now()
    }
    document.addEventListener('visibilitychange', onResume)
    window.addEventListener('pageshow', onResume)
    // setInterval (not a perpetual rAF loop): 10 fps is plenty for sub-pixel
    // marker steps, and the page goes idle between ticks.
    const timer = setInterval(() => {
      if (document.hidden) { last = performance.now(); return }
      const now = performance.now()
      const dt = now - last
      last = now
      const alpha = 1 - Math.exp(-dt / EASE_TAU)
      // Below regional zoom the movement is sub-pixel — skip the projection
      const project = (zoomRef.current ?? 0) >= 9
      const nowMs = Date.now()
      // Vessels med msgMs eldre enn resumedAt: DR ville drevet dem feil basert
      // på stale cog/sog. Frys ved rapportert posisjon inntil fersk poll lander.
      const freezeBeforeMs = resumedAt

      // Cap the motion step after background throttling so a returning tab
      // doesn't lurch markers forward in one giant frame
      const dtEff = Math.min(dt, 1500)

      dynRef.current.forEach(entry => {
        const { marker, vessel } = entry
        if (!marker) return

        const sog = vessel.sog ?? 0
        let pos = entry.rendered
        const age = nowMs - entry.msgMs
        // No dead-reckoning for stale reports — the vessel's true position is
        // by now unknown, projecting it further was putting fast boats on land.
        const stale = age > STALE_MS
        // Etter resume: AIS-rapporten er fra før appen ble bortlagt, så cog/sog
        // er ikke nødvendigvis representativ for hva båt har gjort siden. Frys
        // ved rapportert posisjon inntil neste poll lander (entry.msgMs hopper
        // fram → freeze deaktiveres for den fartøyet).
        const preResume = entry.msgMs < freezeBeforeMs

        if (project && sog >= 0.5 && !stale && !preResume) {
          // Target = reported position projected to *now* along cog/sog.
          const projAge = Math.min(Math.max(age, 0), MAX_PROJECT_MS)
          const target = projectMeters(
            vessel.lat, vessel.lon, vessel.cog ?? 0, sog * KN_TO_MS * (projAge / 1000))

          if (!pos || Math.abs(target[0] - pos[0]) + Math.abs(target[1] - pos[1]) > 0.05) {
            pos = target   // first frame or a real jump → snap
          } else {
            // 1) Always sail forward at the vessel's own speed …
            const stepM = sog * KN_TO_MS * (dtEff / 1000)
            const rad = ((vessel.cog ?? 0) * Math.PI) / 180
            const ux = Math.sin(rad), uy = Math.cos(rad)   // course unit (E, N)
            const mLon = M_PER_DEG * Math.cos((pos[0] * Math.PI) / 180)

            // 2) … and steer toward the target with the along-track part of
            // the correction clamped, so report-staleness jitter modulates
            // speed (0.6×–2.2×) instead of freezing or reversing the marker.
            const errE = (target[1] - pos[1]) * mLon
            const errN = (target[0] - pos[0]) * M_PER_DEG
            const alongErr = errE * ux + errN * uy
            const crossE = errE - alongErr * ux
            const crossN = errN - alongErr * uy
            const along = Math.max(ALONG_MIN * stepM, Math.min(ALONG_MAX * stepM, alongErr * alpha))

            const moveE = (stepM + along) * ux + crossE * alpha
            const moveN = (stepM + along) * uy + crossN * alpha
            pos = [pos[0] + moveN / M_PER_DEG, pos[1] + moveE / mLon]
          }
        } else {
          // Stationary (or zoomed far out): ease to the reported position
          const target = [vessel.lat, vessel.lon]
          if (!pos || Math.abs(target[0] - pos[0]) + Math.abs(target[1] - pos[1]) > 0.05) {
            pos = target
          } else {
            pos = [
              pos[0] + (target[0] - pos[0]) * alpha,
              pos[1] + (target[1] - pos[1]) * alpha,
            ]
          }
        }

        // Skip the DOM write when movement is far below a pixel
        if (!entry.rendered ||
            Math.abs(pos[0] - entry.rendered[0]) > 1e-7 ||
            Math.abs(pos[1] - entry.rendered[1]) > 1e-7) {
          entry.rendered = pos
          marker.setLatLng(pos)
        }

        // Drag the heading vector along with the dead-reckoned icon so the
        // 5/10/15-min line stays glued to the boat, re-projected from `pos`.
        const vec = entry.vector
        if (vec && vec.line) {
          const cog = vessel.cog ?? 0
          const sv = sog * KN_TO_MS
          const p5 = projectMeters(pos[0], pos[1], cog, sv * 300)
          const p10 = projectMeters(pos[0], pos[1], cog, sv * 600)
          const p15 = projectMeters(pos[0], pos[1], cog, sv * 900)
          vec.line.setLatLngs([pos, p5, p10, p15])
          vec.dots[0]?.setLatLng(p5)
          vec.dots[1]?.setLatLng(p10)
          vec.dots[2]?.setLatLng(p15)
          if (vec.labels) {
            vec.labels[0]?.setLatLng(p5)
            vec.labels[1]?.setLatLng(p10)
            vec.labels[2]?.setLatLng(p15)
          }
        }
      })
    }, TICK_MS)
    return () => {
      clearInterval(timer)
      document.removeEventListener('visibilitychange', onResume)
      window.removeEventListener('pageshow', onResume)
    }
  }, [dynRef, zoomRef])
  return null
}

// ── Memoized marker — only re-renders when this vessel's data changes ──────
// Because useBarentswatch preserves object references for unchanged vessels,
// vessels that didn't move will pass the same `vessel` prop → skips re-render.
// Movement itself is driven entirely by the shared MotionTicker via dynRef.
const VesselMarker = memo(function VesselMarker({ vessel, isSelected, onSelectVessel, showLabel, labelFontSize, labelPos, dynRef }) {
  const markerRef = useRef(null)

  // The icon only depends on these *visual buckets* — a vessel sailing
  // straight keeps the exact same divIcon across polls, so Leaflet never
  // touches its DOM. (The old version rebuilt every moved vessel's icon
  // each poll: hundreds of DOM swaps at once on live data.)
  const headingBucket = Math.round(((vessel.hdg ?? vessel.cog ?? 0) / 5)) * 5
  const stale = vessel.stale === true
  // labelFontSize/labelPos are intentionally OUT of the deps: they change on
  // every zoom step (density relayout) and rebuilding the divIcon for all
  // ~2600 markers cost ~137ms (1353 setIcon calls per zoom). The label's
  // side/size are applied as CSS classes and updated in place below.
  const icon = useMemo(
    () => createVesselIcon({ ...vessel, hdg: headingBucket }, isSelected, { showLabel, labelFontSize, labelPos, stale }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [vessel.type, vessel.length, vessel.name, headingBucket, isSelected, showLabel, stale]
  )

  // Update label side/size by swapping the className on the existing label
  // element — no setIcon, so a zoom doesn't rebuild thousands of divIcons.
  useEffect(() => {
    if (!showLabel) return
    const el = markerRef.current?._icon?.querySelector('.vessel-label')
    if (el) el.className = vesselLabelClass(labelPos, labelFontSize)
  }, [labelPos, labelFontSize, showLabel])

  // Click handler reads the latest vessel from a ref — stays referentially
  // stable so react-leaflet doesn't rebind events on every poll.
  const vesselRef = useRef(vessel)
  vesselRef.current = vessel
  const handlers = useMemo(() => ({
    click: (e) => { e.originalEvent?.stopPropagation(); onSelectVessel(vesselRef.current) },
  }), [onSelectVessel])

  // Register with the dead-reckoning ticker; keep rendered position across updates
  useEffect(() => {
    const reg = dynRef.current
    const entry = reg.get(vessel.mmsi) ?? {}
    entry.vessel = vessel
    entry.msgMs = Date.parse(vessel.timestamp) || Date.now()
    entry.marker = markerRef.current
    reg.set(vessel.mmsi, entry)
  }, [vessel, dynRef])

  useEffect(() => {
    const reg = dynRef.current
    const mmsi = vessel.mmsi   // stable: markers are keyed by mmsi
    return () => { reg.delete(mmsi) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Marker
      ref={markerRef}
      position={dynRef.current.get(vessel.mmsi)?.rendered ?? [vessel.lat, vessel.lon]}
      icon={icon}
      eventHandlers={handlers}
      zIndexOffset={isSelected ? 1000 : 0}
    />
  )
})

// ── Cluster marker — one big boat with a count, list of vessels on tap ─────
const ClusterMarker = memo(function ClusterMarker({ cluster, onSelectVessel }) {
  const icon = useMemo(() => createClusterIcon(cluster.vessels.length), [cluster.vessels.length])
  return (
    <Marker position={cluster.pos} icon={icon} zIndexOffset={600}>
      <Popup className="cluster-popup" maxWidth={260} autoPan>
        <div className="cluster-list">
          <div className="cluster-list-header">
            {cluster.vessels.length} fartøy i ro her
          </div>
          {cluster.vessels.map(v => {
            const t = getVesselType(v.type)
            return (
              <button
                key={v.mmsi}
                className="cluster-item"
                onClick={() => onSelectVessel(v)}
              >
                <span className="vessel-list-dot" style={{ background: getVesselColor(v.type) }} />
                <span className="cluster-item-name">{v.name}</span>
                <span className="cluster-item-type">{t.label}</span>
              </button>
            )
          })}
        </div>
      </Popup>
    </Marker>
  )
})

// Vessels slower than this are considered "i ro" (at rest) for clustering
const STATIONARY_KN = 0.3
const CLUSTER_MIN = 4      // user spec: lump together at 4+ boats
const CLUSTER_CELL_PX = 56 // grid cell ≈ cluster radius on screen

// Web-mercator pixel coords at a given zoom (no map instance needed)
function mercatorPx(lat, lon, zoom) {
  const scale = 256 * Math.pow(2, zoom)
  const x = ((lon + 180) / 360) * scale
  const latRad = (lat * Math.PI) / 180
  const y = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * scale
  return [x, y]
}

const homeIcon = divIcon({
  html: '<div class="home-pin">🏠</div>',
  className: '',
  iconSize: [16, 16],
  iconAnchor: [8, 14],
})

export default function MapView({
  vessels, selectedVessel, onSelectVessel, onBoundsChange, onZoomChange, mapRef,
  showNautical, track, trackLoading,
  playheadIndex, panelPx,
  trackHours,
  tileUrl, zoom, showVectors, showNames, clusterOn, bgColor,
  wavePoints = [], waveHorizon = 6, waveScrubT = null, onSelectWavePoint,
  windPoints = [], windHorizon = 6, windScrubT = null, windUnit = 'ms', onSelectWindPoint,
  forecastThinPx = 0,
  userPos = null,
  tripwires = {}, tripwireDrawMode = false, tripwireDraftPoint = null,
  tripwireDraftPath = [], tripwireDraftWidth = 1000, tripwireDraftCircle = null,
  onAddTripwirePoint, onRemoveTripwire, onSetCorridorWidth, onSetCircleRadius, onRecenterCircle,
  bounds = null,
  aisCredit = false, waveCredit = false,
  home = null, homePickMode = false, onMoveHome,
}) {
  // One shared SVG renderer with a big off-screen padding (Leaflet's analogue of
  // the tile keepBuffer). The <svg> rides the map-pane transform during a pan, so
  // its paths (heading-vectors, tracks) stay glued to the map with NO per-frame
  // work — the padding just has to be large enough that a normal pan/inertia
  // doesn't scroll past the pre-drawn area before moveend redraws. (Per-frame
  // renderer._update() kept it glued on extreme pans too, but stole the main
  // thread from tile loading → blank/blue tiles on fast pans.)
  const bigPadRenderer = useMemo(() => svg({ padding: 2 }), [])
  const trackColor = selectedVessel ? getVesselColor(selectedVessel.type) : '#00b4d8'
  // Dark basemap -> light marker outline; light basemap -> dark outline.
  const darkMap = (() => {
    const h = (bgColor || '').replace('#', '')
    if (h.length < 6) return false
    const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16)
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) < 110
  })()

  // Tetthets-tynning: brukeren kan dra ned antall varsel-merker på kartet
  // (tetteste områder forsvinner først). 0 = vis alt.
  // Thin by the density slider, then nudge remaining overlaps apart across BOTH
  // layers together (so wave and wind badges never stack either). Badge px size =
  // divIcon iconSize (wave 28×15, wind 34×16); wind's slot offset (when both
  // layers are on) is dy = slot×(h+2), matching badgeAnchorY.
  const [thinWave, thinWind] = useMemo(() => {
    const waveBase = thinBySpacing(wavePoints, forecastThinPx, zoom)
    const windBase = thinBySpacing(windPoints, forecastThinPx, zoom)
    const windSlot = waveBase.length > 0 ? 1 : 0
    return deOverlapLayers([
      { points: waveBase, w: 32, h: 17, dy: 0 },
      { points: windBase, w: 38, h: 17, dy: windSlot * (17 + 2) },
    ], zoom)
  }, [wavePoints, windPoints, forecastThinPx, zoom])

  const atLive = !track || track.length === 0 || playheadIndex < 0 || playheadIndex >= track.length - 1
  const playheadPoint = !atLive && playheadIndex >= 0 && playheadIndex < track.length
    ? track[playheadIndex]
    : null

  // Memoize track segments — only recalculate when track data or playhead changes
  const segments = useMemo(() => {
    if (!track || track.length < 2) return []
    const cutoff = atLive ? track.length - 1 : playheadIndex
    return track.slice(0, -1).map((pt, i) => ({
      positions: [[pt.lat, pt.lon], [track[i + 1].lat, track[i + 1].lon]],
      color: speedColor(pt.sog),
      past: i <= cutoff,
    }))
  }, [track, playheadIndex, atLive])

  // At full-Norway zoom, cap at 1000 to keep rendering manageable.
  // At regional zoom (7+) show everything — the bounding box already limits it.
  const visibleVessels = useMemo(() => {
    if (trackHours !== 0) {
      // I spor-modus skjules alle live-markører — UNNTATT når tidslinjen står på
      // «live»: da viser vi live-posisjonen til kun det sporede fartøyet (det er
      // hele poenget med «live» i sporvisningen).
      if (atLive && selectedVessel) {
        const liveSel = vessels.find(v => String(v.mmsi) === String(selectedVessel.mmsi))
        return liveSel ? [liveSel] : []
      }
      return []
    }
    if (!zoom || zoom >= 7 || vessels.length <= 1000) return vessels
    return [...vessels].sort((a, b) => (b.sog || 0) - (a.sog || 0)).slice(0, 1000)
  }, [vessels, zoom, trackHours, atLive, selectedVessel])

  // ── Stationary clustering ────────────────────────────────────────────────
  // Boats at rest are bucketed on a screen-space grid; buckets of CLUSTER_MIN+
  // become one cluster marker. Everything else renders individually.
  const { clusters, singles } = useMemo(() => {
    if (!clusterOn || !zoom) return { clusters: [], singles: visibleVessels }
    const buckets = new Map()
    const singles = []
    for (const v of visibleVessels) {
      const moving = (v.sog ?? 0) >= STATIONARY_KN
      const isSelected = v.mmsi === selectedVessel?.mmsi
      if (moving || isSelected) { singles.push(v); continue }
      const [x, y] = mercatorPx(v.lat, v.lon, zoom)
      const key = `${Math.floor(x / CLUSTER_CELL_PX)}:${Math.floor(y / CLUSTER_CELL_PX)}`
      let b = buckets.get(key)
      if (!b) buckets.set(key, (b = []))
      b.push(v)
    }
    const clusters = []
    buckets.forEach((group, key) => {
      if (group.length >= CLUSTER_MIN) {
        const lat = group.reduce((s, v) => s + v.lat, 0) / group.length
        const lon = group.reduce((s, v) => s + v.lon, 0) / group.length
        // pos must keep a stable identity across re-renders: a fresh array
        // per render makes react-leaflet re-place the marker, which re-pans
        // an open popup → moveend → setBounds → re-render → … (update loop)
        clusters.push({ key, pos: [lat, lon], vessels: group })
      } else {
        singles.push(...group)
      }
    })
    return { clusters, singles }
  }, [visibleVessels, zoom, clusterOn, selectedVessel?.mmsi])

  // Shared dead-reckoning registry: mmsi → { marker, vessel, msgMs, rendered }
  const dynRef = useRef(new Map())
  const zoomRef = useRef(zoom)
  zoomRef.current = zoom

  // Stable callback so VesselMarker memo isn't broken by a new function ref
  const handleSelect = useCallback(onSelectVessel, [onSelectVessel])

  // Boolean zoom buckets — icons only regenerate when crossing the threshold,
  // not on every zoom step
  const showLabels = showNames && zoom >= 10
  const vectorsForAll = showVectors && zoom >= 11 && trackHours === 0

  // Label size/placement for all visible vessels in one O(n) pass
  const labelLayout = useMemo(
    () => (showLabels ? buildLabelLayout(singles, zoom) : null),
    [showLabels, singles, zoom]
  )

  return (
    <MapContainer
      center={home ? [home.lat, home.lon] : [58.97, 5.73]}
      zoom={home && home.zoom != null ? home.zoom : 10}
      style={{ width: '100%', height: '100%', background: bgColor }}
      zoomControl={false}
      attributionControl={false}
      renderer={bigPadRenderer}
    >
      {/* keepBuffer holds extra tile rings around the view and
          updateWhenIdle={false} starts loading mid-pan — fewer bare edges */}
      <TileLayer url={tileUrl} attribution={BASE_ATTR} maxZoom={19} keepBuffer={6} updateWhenIdle={false} />
      {showNautical && (
        <TileLayer url={NAUTICAL_TILES} attribution={NAUTICAL_ATTR} opacity={0.92} maxZoom={18} keepBuffer={6} updateWhenIdle={false} />
      )}
      <AttributionControl position="bottomright" prefix={false} />
      <Credits ais={aisCredit} waves={waveCredit} />
      <CollapsibleAttribution />
      <BoundsWatcher onBoundsChange={onBoundsChange} onZoomChange={onZoomChange} />
      <MapCapture mapRef={mapRef} />
      <FlyToVessel vessel={selectedVessel} panelPx={panelPx} />
      <PlayheadFollower point={playheadPoint} panelPx={panelPx} />
      {VESSEL_RENDER === 'dom' && <MotionTicker dynRef={dynRef} zoomRef={zoomRef} />}
      {VESSEL_RENDER === 'canvas' && (
        <CanvasVesselLayer
          vessels={singles}
          selectedMmsi={selectedVessel?.mmsi}
          onSelectVessel={handleSelect}
          project={zoom >= 9}
          pickMode={homePickMode}
          drawMode={tripwireDrawMode}
          showLabels={showLabels}
          vectorsForAll={vectorsForAll}
          zoom={zoom}
          trackHours={trackHours}
          darkMap={darkMap}
        />
      )}

      {/* Bølgevarsel — fargekodede høydepunkter på sjøen. Slot 0 = sentrert på
          cellen; vind får slot 1 (rett under bølge) når begge lag er aktive, så
          merkene ligger tå-mot-tå uten å dekke hverandre. */}
      {thinWave.length > 0 && <WaveLayer points={thinWave} horizon={waveHorizon} scrubT={waveScrubT} slot={0} onSelectPoint={onSelectWavePoint} />}
      {thinWind.length > 0 && <WindLayer points={thinWind} horizon={windHorizon} scrubT={windScrubT} unit={windUnit} slot={thinWave.length > 0 ? 1 : 0} onSelectPoint={onSelectWindPoint} />}

      {/* Hjemmehavn — markør tegnes på lagret posisjon */}
      {home && (
        <Marker
          position={[home.lat, home.lon]}
          icon={homeIcon}
          zIndexOffset={300}
          draggable={true}
          eventHandlers={{ dragend: (e) => { const ll = e.target.getLatLng(); if (onMoveHome) onMoveHome([ll.lat, ll.lng]) } }}
        />
      )}

      {/* GPS-pulse — vises 4 s etter brukeren har trykt 📍 */}
      {userPos && (
        <>
          <CircleMarker center={userPos} radius={9}
            pathOptions={{ color: '#00b4d8', weight: 3, fillColor: '#00b4d8', fillOpacity: 0.8, className: 'gps-dot' }} />
          <CircleMarker center={userPos} radius={20}
            pathOptions={{ color: '#00b4d8', weight: 2, fill: false, opacity: 0.6, className: 'gps-pulse' }} />
        </>
      )}

      <TripwireOverlay
        tripwires={tripwires}
        draftMode={tripwireDrawMode}
        draftPoint={tripwireDraftPoint}
        draftPath={tripwireDraftPath}
        draftWidth={tripwireDraftWidth}
        draftCircle={tripwireDraftCircle}
        onAddPoint={onAddTripwirePoint}
        vessels={vessels}
        onRemoveTripwire={onRemoveTripwire}
        onSelectVessel={onSelectVessel}
        onSetCorridorWidth={onSetCorridorWidth}
        onSetCircleRadius={onSetCircleRadius}
        onRecenterCircle={onRecenterCircle}
      />

      {/* Track segments */}
      {segments.map((seg, i) => (
        <Polyline
          key={i}
          positions={seg.positions}
          color={seg.color}
          weight={seg.past ? 3 : 2}
          opacity={seg.past ? 0.8 : 0.2}
        />
      ))}

      {/* Track start dot */}
      {track && track.length > 0 && (
        <CircleMarker
          center={[track[0].lat, track[0].lon]}
          radius={4}
          color={trackColor}
          fillColor={trackColor}
          fillOpacity={0.5}
          weight={1}
        />
      )}

      {/* Playhead — ghost triangle at historical position, eased between points
          so jog-wheel scrubbing glides instead of teleporting point-to-point. */}
      {playheadPoint && (
        <PlayheadMarker track={track} playheadIndex={playheadIndex} color={trackColor} />
      )}

      {/* Live vessel markers — clustered boats render as one badge each.
          DOM path only; canvas path draws these in CanvasVesselLayer. */}
      {VESSEL_RENDER === 'dom' && singles.map(vessel => {
        const isSelected = selectedVessel?.mmsi === vessel.mmsi
        const lay = !isSelected ? labelLayout?.get(vessel.mmsi) : null
        const labelFontSize = lay?.fontSize ?? '0.58rem'
        const labelPos = lay?.pos ?? 'top'
        return (
          <VesselMarker
            key={vessel.mmsi}
            vessel={vessel}
            isSelected={isSelected}
            onSelectVessel={handleSelect}
            showLabel={showLabels}
            labelFontSize={labelFontSize}
            labelPos={labelPos}
            dynRef={dynRef}
          />
        )
      })}

      {clusters.map(c => (
        <ClusterMarker key={c.key} cluster={c} onSelectVessel={handleSelect} />
      ))}

      {/* Heading vectors: selected vessel always (with 5′/10′/15′ labels),
          all moving vessels when the ↗ toggle is on and zoomed in enough.
          DOM path only — canvas heading vectors are a follow-up. */}
      {VESSEL_RENDER === 'dom' && trackHours === 0 && selectedVessel && (
        <HeadingVector vessel={selectedVessel} labeled dynRef={dynRef} />
      )}
      {VESSEL_RENDER === 'dom' && vectorsForAll && singles
        .filter(v => v.mmsi !== selectedVessel?.mmsi && (v.sog ?? 0) >= 0.5)
        .map(v => <HeadingVector key={`hv-${v.mmsi}`} vessel={v} dynRef={dynRef} />)}

      {trackLoading && (
        <div style={{
          position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(15,25,35,0.85)', color: '#7dd3fc',
          padding: '4px 12px', borderRadius: 20, fontSize: '0.7rem',
          zIndex: 800, pointerEvents: 'none',
        }}>
          Laster spor…
        </div>
      )}

    </MapContainer>
  )
}
