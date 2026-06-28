// Bounded-concurrency queue + single-flight dedupe for MET Norway oceanforecast.
//
// MET's /weatherapi/oceanforecast/2.0/complete is point-only (no batch), so a
// 60-cell viewport produces 60 separate GETs. Cap concurrency at 6 to stay
// well under MET's 20 req/sec/app guideline even on a fast network where
// requests complete in ~150 ms.
//
// Single-flight: if a URL is already in flight, return the same promise to
// any subsequent caller — pan-pan-pan during the SETTLE debounce can race
// the same cell.

// Raised 6 → 8: HTTP/2 multiplexes these same-origin proxy requests on one
// connection, so a slightly deeper queue cuts cold-viewport fan-out without a
// big jump in peak MET req/s (kept conservative vs MET's ~20 req/s guideline —
// 8 bursts to ~47/s briefly on a fully-cold viewport). The new durable CDN cache
// on the proxies (met-ocean/met-weather) absorbs repeat/pan-back cells, so
// sustained MET load actually drops.
const CONCURRENCY = 8

let active = 0
const queue = []
const inflight = new Map()   // url → Promise<Response>

function pump() {
  while (active < CONCURRENCY && queue.length) {
    const task = queue.shift()
    active++
    task().finally(() => {
      active--
      pump()
    })
  }
}

export function metFetch(url, init = {}) {
  const key = url + '|' + (init.headers?.['If-Modified-Since'] ?? '')
  const existing = inflight.get(key)
  if (existing) return existing
  const p = new Promise((resolve, reject) => {
    queue.push(async () => {
      try { resolve(await fetch(url, init)) }
      catch (err) { reject(err) }
    })
  }).finally(() => {
    inflight.delete(key)
  })
  inflight.set(key, p)
  pump()
  return p
}
