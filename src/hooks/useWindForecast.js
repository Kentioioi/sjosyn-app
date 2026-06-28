import { useState, useEffect, useRef } from 'react'
import { buildWavePlan } from '../utils/waveGrid'
import { metFetch } from '../utils/metOceanFetch'
import { HORIZONS } from './useWaveForecast'
import { makeForecastStore } from '../utils/forecastCache'

// Vind-varsel fra MET Norway locationforecast 2.0 (luft). Auth-fritt — kun
// User-Agent kreves (injiseres av /met-weather-proxyen). Speiler useWaveForecast:
// samme rutenett (buildWavePlan), samme concurrency-kø (metFetch), samme
// 304-revalidering. Forskjell: BASE-proxy, vind-feltnavn, og egen modul-cache.
//
// MERK: locationforecast dekker BÅDE sjø og land (i motsetning til
// oceanforecast), så vind-merker vises også over land — ønsket for et vær-lag.

const BASE = '/met-weather'
const TTL = 30 * 60_000
const SETTLE_MS = 350
const REFRESH_MS = 30 * 60_000
const MAX_CACHE = 600
const FETCH_TIMEOUT_MS = 20_000

// Egen modul-cache (kollidererer ikke med wave-cachen — separat modul).
const cache = new Map()
// Persist + hydrate via IndexedDB (own 'wind' store) — same as useWaveForecast.
const idb = makeForecastStore('wind', TTL)
const hydratedOnce = idb.hydrate(cache)
let failCooldownUntil = 0

function cacheSet(key, entry) {
  if (!cache.has(key) && cache.size >= MAX_CACHE) {
    const drop = cache.size - MAX_CACHE + 50
    let n = 0
    for (const k of cache.keys()) { cache.delete(k); if (++n >= drop) break }
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

// Aggreger timeserie til per-horisont vindue-MAKS (sterkeste vind) + retning ved topp.
function aggregateHorizons(t0, vs, vd, now) {
  const len = vs.length
  const idx0 = Math.max(0, Math.round((now / 1000 - t0) / 3600))
  const values = {}
  const dirs = {}
  let any = false
  for (const h of HORIZONS) {
    const end = Math.min(len - 1, Math.round((now / 1000 + h * 3600 - t0) / 3600))
    if (end < idx0) continue
    let max = null, dir = null
    for (let k = idx0; k <= end; k++) {
      if (vs[k] != null && (max == null || vs[k] > max)) { max = vs[k]; dir = vd[k] }
    }
    values[h] = max
    dirs[h] = dir
    if (max != null) any = true
  }
  return { values: any ? values : null, dirs }
}

export function useWindForecast(enabled, bounds, zoom) {
  const [points, setPoints] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const abortRef = useRef(null)
  const emittedRef = useRef([])

  useEffect(() => {
    if (!enabled || !bounds || zoom == null) {
      if (emittedRef.current.length) { emittedRef.current = []; setPoints([]) }
      setLoading(false)
      setError(null)
      return
    }
    let cancelled = false
    const plan = buildWavePlan(bounds, zoom, { multi: false })

    const emit = () => {
      if (cancelled) return
      const prevByKey = new Map(emittedRef.current.map(p => [p.key, p]))
      const pts = []
      const seenPos = new Set()
      for (const c of plan.cells) {
        const hit = cache.get(c.key)
        if (!hit) continue
        cache.delete(c.key); cache.set(c.key, hit)
        if (!hit.values) continue
        const pos = hit.pos
        if (!pos) continue
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

      let anyError = false
      const results = await Promise.allSettled(todo.map(async (c) => {
        const [lat, lon] = [c.samples[0].lat, c.samples[0].lon]
        const url = `${BASE}?lat=${lat.toFixed(4)}&lon=${lon.toFixed(4)}`
        const prev = cache.get(c.key)
        const headers = prev?.lastModified ? { 'If-Modified-Since': prev.lastModified } : {}
        const res = await metFetch(url, { signal, headers })
        if (res.status === 304 && prev) {
          cacheSet(c.key, { ...prev, at: Date.now() })
          return
        }
        if (!res.ok) {
          const ra = Number(res.headers.get('retry-after'))
          if (res.status === 429 || res.status === 503) {
            failCooldownUntil = Date.now() + (ra > 0 ? ra * 1000 : 90_000)
          }
          if (res.status === 403) {
            failCooldownUntil = Date.now() + 60 * 60_000
          }
          throw new Error(`MET (${res.status})`)
        }
        const data = await res.json()
        const err = data?.properties?.meta?.error
        const ts = data?.properties?.timeseries
        if (err || !Array.isArray(ts) || !ts.length) {
          cacheSet(c.key, { values: null, at: Date.now() })
          return
        }
        const t0 = Math.floor(Date.parse(ts[0].time) / 1000)
        const vs = ts.map(e => {
          const v = e?.data?.instant?.details?.wind_speed
          return Number.isFinite(v) ? v : null
        })
        const vd = ts.map(e => {
          const v = e?.data?.instant?.details?.wind_from_direction
          return Number.isFinite(v) ? v : null
        })
        const coords = data?.geometry?.coordinates
        const pos = Array.isArray(coords) && coords.length >= 2
          ? [coords[1], coords[0]]
          : [lat, lon]
        const { values, dirs } = aggregateHorizons(t0, vs, vd, Date.now())
        cacheSet(c.key, {
          values,
          dirs,
          series: { t0, vs, vd },
          pos,
          lastModified: res.headers.get('Last-Modified') || prev?.lastModified || null,
          at: Date.now(),
        })
      }))

      for (const r of results) {
        if (r.status === 'rejected' && r.reason?.name !== 'AbortError') anyError = true
      }
      if (anyError && !cancelled) setError('Vinddata utilgjengelig')
      else if (!cancelled) { setError(null); failCooldownUntil = 0 }
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
