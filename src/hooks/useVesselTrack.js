import { useState, useEffect, useRef } from 'react'

// /bw-historic proxies to https://historic.ais.barentswatch.no
// The open API lives under /open prefix with auth
const BASE = '/bw-historic/open/v1/historic'

export function useVesselTrack(mmsi, hours, getToken) {
  const [track, setTrack] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  // Nonce som «Prøv igjen» bumper for å trigge effekten på nytt uten at
  // fartøy/timer endrer seg.
  const [retryNonce, setRetryNonce] = useState(0)
  const abortRef = useRef(null)

  useEffect(() => {
    if (!mmsi || !getToken || hours === 0) {
      setTrack([])
      setError(null)
      return
    }

    if (abortRef.current) abortRef.current.abort()
    abortRef.current = new AbortController()
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const token = await getToken()

        let url
        if (hours === 24) {
          // Dedicated last-24h endpoint
          url = `${BASE}/trackslast24hours/${mmsi}`
        } else {
          // Date-range endpoint — dates go in the URL path
          const toDate = new Date().toISOString()
          const fromDate = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()
          url = `${BASE}/tracks/${mmsi}/${fromDate}/${toDate}`
        }

        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
          signal: abortRef.current.signal,
        })

        if (!res.ok) throw new Error(`Track ${res.status}`)

        const data = await res.json()
        const list = Array.isArray(data) ? data : []

        const parsed = list
          .map(p => ({
            lat: p.latitude,
            lon: p.longitude,
            sog: p.speedOverGround ?? 0,
            cog: p.courseOverGround ?? 0,
            time: p.msgtime,
          }))
          .filter(p => p.lat != null && p.lon != null &&
            Math.abs(p.lat) <= 90 && Math.abs(p.lon) <= 180)
          .sort((a, b) => new Date(a.time) - new Date(b.time))

        if (!cancelled) setTrack(parsed)
      } catch (err) {
        if (err.name === 'AbortError') return
        if (!cancelled) {
          setError(err.message)
          setTrack([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
      abortRef.current?.abort()
    }
  }, [mmsi, hours, getToken, retryNonce])

  // Tving en ny henting for samme fartøy + timer (brukes av «Prøv igjen»).
  const retry = () => setRetryNonce(n => n + 1)

  return { track, loading, error, retry }
}
