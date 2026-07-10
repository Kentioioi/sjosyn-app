import { useState, useEffect, useRef } from 'react'
import { buildWavePlan, mercator } from '../utils/waveGrid'
import { metFetch } from '../utils/metOceanFetch'
import { makeForecastStore } from '../utils/forecastCache'
import { API_BASE } from '../utils/apiBase'

// Wave forecasts from MET Norway oceanforecast 2.0 (WAM800, 800 m grid,
// 206-timestep hourly series ≈ 8.6 d horizon). Auth-free — only a User-Agent
// header is required by MET TOS, injected by the /met-ocean proxy (netlify
// function in prod, vite dev-proxy in dev). MET serves Expires + Last-Modified
// with strong caching, so we use If-Modified-Since on revalidation and get
// 304 Not Modified for the (frequent) case where nothing changed.
//
// One badge per cell, displayed at the cell's exact grid center. Land is
// filtered server-side (MET returns meta.error="no data at the given
// location" for inland points).

const BASE = `${API_BASE}/met-ocean`                   // proxy → MET oceanforecast/2.0/complete
export const HORIZONS = [6, 12, 24, 48, 96, 168, 192] // 6 t … 8 d (MET serves ~8.6 d / 206 timesteg)

// "6 t", "12 t", "2 d", "7 d" — readable label per horizon
export function horizonLabel(h) {
  return h >= 48 ? `${Math.round(h / 24)} d` : `${h} t`
}

const TTL = 30 * 60_000           // forecast cells stay fresh this long (MET Expires ~30 min)
const SETTLE_MS = 350             // wait for pan/zoom to settle before fetching
const REFRESH_MS = 30 * 60_000    // MET updates 2×/day — long revalidate cadence
const MAX_CACHE = 600
const FETCH_TIMEOUT_MS = 20_000

// Module-level cache; values:null marks "no sea data here" (land).
// Keyed by `${gz}/${spacing}/${i}/${j}` (cellenøkkelen fra buildWavePlan).
const cache = new Map()

// Persist cells to IndexedDB and hydrate the in-memory cache once on load, so a
// reload / pan-back restores 30-min-fresh data instantly instead of re-fanning
// out ~60 GETs. Kicked off at module load to overlap with the SETTLE debounce;
// run() awaits it before the first emit so cached badges paint immediately.
// 'wave-v2': nytt navnerom — gamle entries har MET-snappet pos + annen
// spacing, og rundet spacing kan kollidere med gamle nøkler (f.eks. 293).
const idb = makeForecastStore('wave-v2', TTL)
const hydratedOnce = idb.hydrate(cache)

let failCooldownUntil = 0

function cacheSet(key, entry) {
  if (!cache.has(key) && cache.size >= MAX_CACHE) {
    const drop = cache.size - MAX_CACHE + 50
    let n = 0
    for (const k of cache.keys()) {
      cache.delete(k)
      if (++n >= drop) break
    }
  }
  cache.delete(key)
  cache.set(key, entry)
  idb.save(key, entry)
}

function fetchSignal(ctrl) {
  if (typeof AbortSignal.any === 'function' && typeof AbortSignal.timeout === 'function') {
    return AbortSignal.any([ctrl.signal, AbortSignal.timeout(FETCH_TIMEOUT_MS)])
  }
  return ctrl.signal
}

// Aggregate hourly series into per-horizon window max + direction at peak.
function aggregateHorizons(t0, vh, vd, now) {
  const len = vh.length
  const idx0 = Math.max(0, Math.round((now / 1000 - t0) / 3600))
  const values = {}
  const dirs = {}
  let any = false
  for (const h of HORIZONS) {
    const end = Math.min(len - 1, Math.round((now / 1000 + h * 3600 - t0) / 3600))
    if (end < idx0) continue
    let max = null, dir = null
    for (let k = idx0; k <= end; k++) {
      if (vh[k] != null && (max == null || vh[k] > max)) { max = vh[k]; dir = vd[k] }
    }
    values[h] = max
    dirs[h] = dir
    if (max != null) any = true
  }
  return { values: any ? values : null, dirs }
}

export function useWaveForecast(enabled, bounds, zoom) {
  const [points, setPoints] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const abortRef = useRef(null)
  const emittedRef = useRef([])

  useEffect(() => {
    if (!enabled || !bounds || zoom == null) {
      if (emittedRef.current.length) {
        emittedRef.current = []
        setPoints([])
      }
      setLoading(false)
      setError(null)
      return
    }
    let cancelled = false
    const plan = buildWavePlan(bounds, zoom)

    // Grov zoom (gz ≤ 9): én celle dekker 15–70 km, og kystceller får data fra
    // fjordarmer/viker som er sub-piksel på skjermen — merket ser ut som det
    // står på land og undergraver tilliten til dataene. Der dropper vi bølge-
    // celler som har en eksplisitt LAND-nabo (values:null i cachen); åpne
    // sjøområder beholdes. Ukjente naboer (utenfor viewport) teller ikke.
    const coarse = plan.gz <= 9
    const isLandNeighbor = (i, j) => {
      const nb = cache.get(`${plan.gz}/${plan.spacing}/${i}/${j}`)
      return !!nb && !nb.values
    }

    const emit = () => {
      if (cancelled) return
      const prevByKey = new Map(emittedRef.current.map(p => [p.key, p]))
      const pts = []
      const seenPos = new Set()   // to naboceller kan snappe til samme MET-celle
      for (const c of plan.cells) {
        const hit = cache.get(c.key)
        if (!hit) continue
        cache.delete(c.key); cache.set(c.key, hit)   // LRU promote
        if (!hit.values) continue
        const pos = hit.pos
        if (!pos) continue
        if (coarse && (
          isLandNeighbor(c.i - 1, c.j) || isLandNeighbor(c.i + 1, c.j) ||
          isLandNeighbor(c.i, c.j - 1) || isLandNeighbor(c.i, c.j + 1)
        )) continue
        const posKey = pos[0].toFixed(3) + ':' + pos[1].toFixed(3)
        if (seenPos.has(posKey)) continue
        seenPos.add(posKey)
        const old = prevByKey.get(c.key)
        pts.push(old && old.values === hit.values
          ? old
          : { key: c.key, position: pos, values: hit.values, dirs: hit.dirs, series: hit.series })
      }
      const prev = emittedRef.current
      if (pts.length === prev.length && pts.every((p, i) => p === prev[i])) return
      emittedRef.current = pts
      setPoints(pts)
    }

    const run = async () => {
      await hydratedOnce   // restore persisted cells before first paint/fetch
      if (cancelled) return
      emit()
      const now = Date.now()
      const todo = plan.cells.filter(c => {
        const hit = cache.get(c.key)
        return !hit || now - hit.at > TTL
      })
      if (!todo.length || cancelled || now < failCooldownUntil) {
        if (!cancelled) setLoading(false)
        return
      }

      abortRef.current?.abort()
      const ctrl = new AbortController()
      abortRef.current = ctrl
      const signal = fetchSignal(ctrl)
      setLoading(true)

      // Tegn nye celler etter hvert som svarene lander (throttlet) — ikke i én
      // batch etter at ALLE er ferdige. Ett tregt svar (verste fall 20 s
      // timeout) skal ikke holde igjen resten av viewportet.
      let emitTimer = 0
      const scheduleEmit = () => {
        if (emitTimer) return
        emitTimer = setTimeout(() => { emitTimer = 0; emit() }, 150)
      }

      let anyError = false
      const results = await Promise.allSettled(todo.map(async (c) => {
        const [lat, lon] = [c.lat, c.lon]
        const url = `${BASE}?lat=${lat.toFixed(4)}&lon=${lon.toFixed(4)}`
        const prev = cache.get(c.key)
        const headers = prev?.lastModified ? { 'If-Modified-Since': prev.lastModified } : {}
        const res = await metFetch(url, { signal, headers })
        if (res.status === 304 && prev) {
          cacheSet(c.key, { ...prev, at: Date.now() })
          scheduleEmit()
          return
        }
        if (!res.ok) {
          const ra = Number(res.headers.get('retry-after'))
          if (res.status === 429 || res.status === 503) {
            failCooldownUntil = Date.now() + (ra > 0 ? ra * 1000 : 90_000)
          }
          if (res.status === 403) {
            failCooldownUntil = Date.now() + 60 * 60_000   // UA banned — back off 1h
          }
          throw new Error(`MET (${res.status})`)
        }
        const data = await res.json()
        const err = data?.properties?.meta?.error
        const ts = data?.properties?.timeseries
        if (err || !Array.isArray(ts) || !ts.length) {
          cacheSet(c.key, { values: null, at: Date.now() })   // land or empty
          scheduleEmit()
          return
        }
        const t0 = Math.floor(Date.parse(ts[0].time) / 1000)
        const vh = ts.map(e => {
          const v = e?.data?.instant?.details?.sea_surface_wave_height
          return Number.isFinite(v) ? v : null
        })
        const vd = ts.map(e => {
          const v = e?.data?.instant?.details?.sea_surface_wave_from_direction
          return Number.isFinite(v) ? v : null
        })
        // Vis merket på MODELLENS sjøcelle-koordinat (geometry) — garantert på
        // vann, og det er der verdien faktisk gjelder. Uten jitter er avviket
        // fra rutenett-senteret ≤ ~800 m (WAM800) og usynlig på normal zoom.
        // Snappet MET mer enn 35 % av cellebredden (senteret godt inne på
        // land), behandles cella som land: merket ville klistret seg til
        // nærmeste strand i stedet for å representere sin egen celle — da er
        // en vind-solo på cellesenteret ærligere.
        const coords = data?.geometry?.coordinates
        let pos = [lat, lon]
        if (Array.isArray(coords) && coords.length >= 2) {
          pos = [coords[1], coords[0]]
          const [rx, ry] = mercator(lat, lon, plan.gz)
          const [sx, sy] = mercator(pos[0], pos[1], plan.gz)
          if (Math.hypot(sx - rx, sy - ry) > plan.spacing * 0.35) {
            cacheSet(c.key, { values: null, at: Date.now() })   // for langt fra sjø
            scheduleEmit()
            return
          }
        }
        const { values, dirs } = aggregateHorizons(t0, vh, vd, Date.now())
        cacheSet(c.key, {
          values,
          dirs,
          series: { t0, vh, vd },
          pos,
          lastModified: res.headers.get('Last-Modified') || prev?.lastModified || null,
          at: Date.now(),
        })
        scheduleEmit()
      }))
      clearTimeout(emitTimer)

      for (const r of results) {
        if (r.status === 'rejected' && r.reason?.name !== 'AbortError') anyError = true
      }
      if (anyError && !cancelled) {
        setError('Bølgedata utilgjengelig')
      } else if (!cancelled) {
        setError(null)
        failCooldownUntil = 0
      }
      emit()
      if (abortRef.current === ctrl) setLoading(false)
    }

    const t = setTimeout(run, SETTLE_MS)
    const iv = setInterval(() => { if (!document.hidden) run() }, REFRESH_MS)
    return () => {
      cancelled = true
      clearTimeout(t)
      clearInterval(iv)
      abortRef.current?.abort()
    }
  }, [enabled, bounds, zoom])

  return { points, loading, error }
}
