import { useState, useEffect, useRef, useCallback } from 'react'
import { DEMO_VESSELS } from '../utils/vesselTypes'
import { API_BASE } from '../utils/apiBase'

const AIS_URL = `${API_BASE}/bw-ais/v1/latest/combined`

// Demo mode advances vessels on this cadence
const DEMO_TICK_MS = 2000

// Zoom → poll interval
// < 7  (all of Norway):      60s
// 7-11 (region/county):      30s
// 11-13 (local/harbour):     15s
// ≥ 13 (navigation/docking): 10s
export function zoomToPollInterval(zoom) {
  if (!zoom || zoom < 7)  return 60_000
  if (zoom < 11)          return 30_000
  if (zoom < 13)          return 15_000
  return 10_000
}

function parseVessel(v) {
  const mmsi = String(v.mmsi)
  const lat = v.latitude ?? v.lat
  const lon = v.longitude ?? v.lon
  if (!lat || !lon || Math.abs(lat) > 90 || Math.abs(lon) > 180) return null

  return {
    mmsi,
    name: (v.name ?? v.shipName ?? `MMSI ${mmsi}`).trim(),
    type: v.shipType ?? v.vesselType ?? 0,
    lat,
    lon,
    sog: v.speedOverGround ?? v.sog ?? 0,
    cog: v.courseOverGround ?? v.cog ?? 0,
    hdg: v.trueHeading !== 511 && v.trueHeading != null
      ? v.trueHeading
      : (v.courseOverGround ?? v.cog ?? 0),
    flag: v.countryCode ?? v.flag ?? '',
    destination: (v.destination ?? '').trim(),
    draught: v.draught ?? null,
    length: v.length ?? (v.dimBow != null && v.dimStern != null ? v.dimBow + v.dimStern : null),
    callsign: v.callsign ?? '',
    imo: v.imoNumber ?? null,
    timestamp: v.msgtime ?? v.timestamp ?? new Date().toISOString(),
  }
}

// Tett margin (≈ 5.5 km på 60° N) rundt hver armerte tripwire-vessel når
// vi bakgrunns-poller. Stort nok til at vessel ikke faller utenfor mellom
// 30-sekunders pollene selv ved full marsjfart (30 kn ≈ 15 km på 30 s).
const ARMED_PADDING_DEG = 0.05
const BG_POLL_INTERVAL  = 30_000

// AIS auth is handled server-side (the backend holds its own app-owned
// BarentsWatch client) — the app just calls the proxy, no token round-trip.
export function useBarentswatch(demoMode, bounds, pollInterval = 30_000, armedVesselsPositions = []) {
  const [vessels, setVessels] = useState({})
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState(null)
  const [msgCount, setMsgCount] = useState(0)
  const demoTimer = useRef(null)
  const abortRef = useRef(null)

  // ── Stable refs so poll() doesn't need to be recreated when these change ──
  // Without this, every zoom/pan recreates poll → restarts the interval → fires
  // a new request on each zoom frame.
  const boundsRef       = useRef(bounds)
  const pollIntervalRef = useRef(pollInterval)
  const pollFnRef       = useRef(null)   // always points to latest poll()
  const armedPosRef     = useRef(armedVesselsPositions)
  const inBgPollRef     = useRef(false)   // poll() merges (true) vs replaces (false)

  useEffect(() => { boundsRef.current = bounds },       [bounds])
  useEffect(() => { pollIntervalRef.current = pollInterval }, [pollInterval])
  useEffect(() => { armedPosRef.current = armedVesselsPositions }, [armedVesselsPositions])

  // ── Demo mode ──────────────────────────────────────────────
  useEffect(() => {
    if (!demoMode) return

    const initial = {}
    DEMO_VESSELS.forEach(v => { initial[v.mmsi] = { ...v } })
    setVessels(initial)
    setConnected(true)
    setError(null)

    demoTimer.current = setInterval(() => {
      setVessels(prev => {
        const next = { ...prev }
        Object.keys(next).forEach(mmsi => {
          const v = next[mmsi]
          if ((v.sog ?? 0) < 0.5) return   // anchored boats stay put
          const rad = (v.cog * Math.PI) / 180
          // Real-scale movement: sog knots over DEMO_TICK_MS, in degrees
          // (1° latitude ≈ 60 nm) — keeps dead reckoning consistent.
          const delta = v.sog * (DEMO_TICK_MS / 3_600_000) / 60
          next[mmsi] = {
            ...v,
            lat: v.lat + Math.cos(rad) * delta,
            lon: v.lon + Math.sin(rad) * delta / Math.cos((v.lat * Math.PI) / 180),
            timestamp: new Date().toISOString(),
          }
        })
        return next
      })
      setMsgCount(c => c + 1)
    }, DEMO_TICK_MS)

    return () => {
      clearInterval(demoTimer.current)
      setConnected(false)
    }
  }, [demoMode])

  // ── AIS poll — reads bounds from ref, not from closure ────
  // Keeping bounds out of the dep array means this function is stable;
  // it never causes the poll loop to restart just because the map moved.
  const poll = useCallback(async () => {
    if (demoMode) return
    if (abortRef.current) abortRef.current.abort()
    abortRef.current = new AbortController()
    // Watchdog: abort hele pollen hvis den henger (død socket etter resume) →
    // poll() resolver alltid → scheduleTick kjører → loopen dør aldri.
    const ctrl = abortRef.current
    const watchdog = setTimeout(() => ctrl.abort(), 15_000)

    try {
      // Når vi er i bakgrunns-modus med armerte tripwires: lag et tett
      // bbox kun rundt de armerte fartøyene. Det reduserer respons-størrelsen
      // dramatisk (typisk 1-3 fartøy istedet for 30+) og holder mobildata-
      // bruken nede.
      const armed = inBgPollRef.current ? armedPosRef.current : null
      let b = boundsRef.current
      // Foreground-poll: utvid bbox 60 % i hver retning så fartøy godt utenfor
      // viewporten allerede er lastet når brukeren panner — ingen pop-in på
      // kantene. Kostnaden er flere vessel-rader per respons, men panneringen
      // blir merkbart jevnere.
      if (b && !armed) {
        const margin = 0.60
        const w = (b.east - b.west) * margin
        const h = (b.north - b.south) * margin
        b = {
          west:  b.west  - w,
          east:  b.east  + w,
          south: b.south - h,
          north: b.north + h,
        }
      }
      if (armed && armed.length) {
        let west = Infinity, east = -Infinity, south = Infinity, north = -Infinity
        for (const p of armed) {
          if (p.lon < west)  west  = p.lon
          if (p.lon > east)  east  = p.lon
          if (p.lat < south) south = p.lat
          if (p.lat > north) north = p.lat
        }
        b = {
          west:  west  - ARMED_PADDING_DEG,
          east:  east  + ARMED_PADDING_DEG,
          south: south - ARMED_PADDING_DEG,
          north: north + ARMED_PADDING_DEG,
        }
      }
      let url = AIS_URL
      if (b) {
        const params = new URLSearchParams({
          Xmin: b.west.toFixed(4),
          Ymin: b.south.toFixed(4),
          Xmax: b.east.toFixed(4),
          Ymax: b.north.toFixed(4),
        })
        url = `${AIS_URL}?${params}`
      }

      const res = await fetch(url, { signal: abortRef.current.signal })

      if (!res.ok) {
        throw new Error(`Kunne ikke hente AIS-data: ${res.status}`)
      }

      const data = await res.json()
      const list = Array.isArray(data) ? data : data.vessels ?? []

      // I bg-poll: merge inn over forrige state (vi har kun spurt om de
      // armerte fartøyene — andre vessels skal stå urørt). I normal poll:
      // erstatt — viewport-svaret er sannheten for det området.
      const merge = inBgPollRef.current
      setVessels(prev => {
        const next = merge ? { ...prev } : {}
        list.forEach(v => {
          const parsed = parseVessel(v)
          if (!parsed) return
          const old = prev[parsed.mmsi]
          if (
            old &&
            old.lat === parsed.lat && old.lon === parsed.lon &&
            old.hdg === parsed.hdg && old.sog === parsed.sog &&
            old.cog === parsed.cog
          ) {
            next[parsed.mmsi] = old
          } else {
            next[parsed.mmsi] = parsed
          }
        })
        return next
      })
      setConnected(true)
      setError(null)
      setMsgCount(c => c + list.length)
    } catch (err) {
      if (err.name === 'AbortError') return
      setConnected(false)
      setError(err.message)
    } finally {
      clearTimeout(watchdog)
    }
  }, [demoMode])   // ← bounds intentionally omitted

  // Keep the ref current so the scheduler always calls the latest version
  useEffect(() => { pollFnRef.current = poll }, [poll])

  // ── Stable poll loop ───────────────────────────────────────
  // Pauses automatically when the browser tab is hidden (phone locked,
  // app switched, tab backgrounded) — saves Netlify function invocations.
  // Resumes and fires an immediate catch-up poll when the tab becomes visible again.
  useEffect(() => {
    if (demoMode) return
    let cancelled = false
    // The timeout id lives in THIS effect generation. A shared ref here lets
    // two overlapping generations (remount, mode change, HMR) clobber
    // each other's id — the orphaned chain then re-schedules itself forever
    // and polls stack up far past the intended rate.
    let timeoutId = null
    let lastPollAt = 0

    const runPoll = async () => {
      lastPollAt = Date.now()
      await pollFnRef.current()
    }

    const scheduleTick = () => {
      clearTimeout(timeoutId)
      const hidden = document.visibilityState === 'hidden'
      const hasArmed = (armedPosRef.current?.length ?? 0) > 0
      // Backgrounded: poll kun hvis vi har en armert tripwire (tett bbox,
      // 30 s cadence). Ellers full pause — sparer mobildata.
      const interval = hidden && hasArmed
        ? BG_POLL_INTERVAL
        : pollIntervalRef.current
      timeoutId = setTimeout(async () => {
        if (cancelled) return
        const stillHidden = document.visibilityState === 'hidden'
        const stillArmed  = (armedPosRef.current?.length ?? 0) > 0
        if (stillHidden && !stillArmed) {
          scheduleTick()   // full pause inntil vi blir synlig eller noen armer
          return
        }
        inBgPollRef.current = stillHidden && stillArmed
        try { await runPoll() }
        finally {
          inBgPollRef.current = false
          if (!cancelled) scheduleTick()   // alltid resched, selv om pollen feilet
        }
      }, interval)
    }

    // Resume when the tab comes back into view: cancel any in-flight bg-poll
    // og kjør én umiddelbar full-viewport-poll så markøren ikke står frosset.
    const onVisible = () => {
      if (cancelled || document.visibilityState !== 'visible') return
      // Tving full poll uansett sinceLast — bg-pollen så bare på 1-2 fartøy,
      // resten av viewporten kan være timer gammel.
      inBgPollRef.current = false
      if (abortRef.current) abortRef.current.abort()
      clearTimeout(timeoutId)
      runPoll().finally(() => { if (!cancelled) scheduleTick() })
    }
    document.addEventListener('visibilitychange', onVisible)
    // iOS Safari + Chrome PWA fyrer ikke alltid visibilitychange ved bfcache-
    // restore / app-resume. pageshow fanger den stien.
    window.addEventListener('pageshow', onVisible)

    runPoll().finally(() => { if (!cancelled) scheduleTick() })

    return () => {
      cancelled = true
      clearTimeout(timeoutId)
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('pageshow', onVisible)
      if (abortRef.current) abortRef.current.abort()
      setConnected(false)
    }
  }, [demoMode])   // ← pollInterval and bounds NOT here

  // Manual retry for the error banner — fires an immediate poll
  const retry = useCallback(() => { pollFnRef.current?.() }, [])

  return {
    vessels: Object.values(vessels),
    connected,
    error,
    msgCount,
    isDemoMode: demoMode,
    retry,
  }
}
