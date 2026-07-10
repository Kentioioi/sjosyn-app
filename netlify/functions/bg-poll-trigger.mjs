// POST /bg-poll-trigger — ekstern cron pinger denne. Sender FCM-datavarsel når
// et armert fartøy krysser en vaktlinje. V2-syntax (default export).

import { getStore } from '@netlify/blobs'
import crypto from 'node:crypto'
import corsModule from './_cors.cjs'
import fcmModule from './_fcm.cjs'
const { corsHeaders } = corsModule
const { sendFcmMessage } = fcmModule

const TOKEN_URL = 'https://id.barentswatch.no/connect/token'
const AIS_URL   = 'https://live.ais.barentswatch.no/v1/latest/combined'
const RETENTION_MS = 90 * 24 * 60 * 60_000
// Cooldown MÅ være lengre enn cron-intervallet, ellers fyrer et fartøy som
// ligger og jitterer rett på linja et varsel hvert eneste tick.
const COOLDOWN_MS = 10 * 60_000
// Baseline/rapport eldre enn dette er ubrukelig — et segment fra en timegammel
// posisjon til «nå» gir fantom-krysninger. Posisjoner purges også etter 24 t
// (personvern).
const STALE_POS_MS = 30 * 60_000
const POS_RETENTION_MS = 24 * 60 * 60_000

function safeEqual(a, b) {
  const ab = Buffer.from(String(a ?? ''))
  const bb = Buffer.from(String(b ?? ''))
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb)
}

// Kjør async fn over items med maks `limit` samtidige (unngå N parallelle
// blob-GETs mot fd-/socket-taket). Bevarer rekkefølge.
async function mapLimit(items, limit, fn) {
  const out = new Array(items.length)
  let i = 0
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (i < items.length) { const idx = i++; out[idx] = await fn(items[idx], idx) }
  })
  await Promise.all(workers)
  return out
}

let cachedToken = null
let cachedTokenExpiry = 0

async function getAisToken() {
  if (cachedToken && Date.now() < cachedTokenExpiry - 60_000) return cachedToken
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: process.env.BW_BG_CLIENT_ID,
    client_secret: process.env.BW_BG_CLIENT_SECRET,
    scope: 'ais',
  })
  const r = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
    signal: AbortSignal.timeout(5_000),
  })
  if (!r.ok) throw new Error(`BW token (${r.status}): ${(await r.text()).slice(0, 200)}`)
  const data = await r.json()
  cachedToken = data.access_token
  cachedTokenExpiry = Date.now() + (data.expires_in ?? 3600) * 1000
  return cachedToken
}

function cross(ax, ay, bx, by) { return ax * by - ay * bx }
function segmentsIntersect(p1, p2, q1, q2) {
  const r = [p2[0] - p1[0], p2[1] - p1[1]]
  const s = [q2[0] - q1[0], q2[1] - q1[1]]
  const denom = cross(r[0], r[1], s[0], s[1])
  if (denom === 0) return false
  const qp = [q1[0] - p1[0], q1[1] - p1[1]]
  const t = cross(qp[0], qp[1], s[0], s[1]) / denom
  const u = cross(qp[0], qp[1], r[0], r[1]) / denom
  return t >= 0 && t <= 1 && u >= 0 && u <= 1
}

// Korridor-geometri (equirektangulær, meter). Speiler src/utils/geom.js.
const R_EARTH = 6371000
const D2R = Math.PI / 180
function pointToSegmentMeters(p, a, b) {
  const latRef = p[0]
  const sx = (lon) => lon * D2R * R_EARTH * Math.cos(latRef * D2R)
  const sy = (lat) => lat * D2R * R_EARTH
  const Px = sx(p[1]), Py = sy(p[0])
  const Ax = sx(a[1]), Ay = sy(a[0])
  const Bx = sx(b[1]), By = sy(b[0])
  const dx = Bx - Ax, dy = By - Ay
  const len2 = dx * dx + dy * dy
  let t = len2 === 0 ? 0 : ((Px - Ax) * dx + (Py - Ay) * dy) / len2
  t = Math.max(0, Math.min(1, t))
  return Math.hypot(Px - (Ax + t * dx), Py - (Ay + t * dy))
}
function distanceToPathMeters(p, path) {
  if (!path || !path.length) return Infinity
  if (path.length === 1) return pointToSegmentMeters(p, path[0], path[0])
  let min = Infinity
  for (let i = 0; i < path.length - 1; i++) {
    const d = pointToSegmentMeters(p, path[i], path[i + 1])
    if (d < min) min = d
  }
  return min
}
function insideCorridor(p, path, widthM) {
  if (!path || path.length < 1 || !(widthM > 0)) return false
  return distanceToPathMeters(p, path) <= widthM / 2
}

async function listAll(store) {
  const all = []
  let cursor
  do {
    const page = await store.list({ cursor })
    all.push(...page.blobs)
    cursor = page.cursor
  } while (cursor)
  return all
}

// Rydd gamle rate-limit-buckets (push-subscribe skriver én per IP per minutt).
// Best-effort, aldri fatal.
async function pruneRateLimits(now) {
  try {
    const store = getStore('rate-limits')
    const curBucket = Math.floor(now / 60_000)
    const blobs = await listAll(store)
    const old = blobs.filter(b => {
      const bucket = parseInt(b.key.split(':').pop(), 10)
      return Number.isFinite(bucket) && bucket < curBucket - 1
    }).slice(0, 100)
    await Promise.allSettled(old.map(b => store.delete(b.key)))
  } catch (err) {
    console.error('bg-poll: rate-limit prune feilet:', err.message)
  }
}

export default async (req) => {
  const cors = corsHeaders(req.headers.get('origin'))
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors })
  if (req.method !== 'POST' && req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405, headers: cors })
  }
  const auth = req.headers.get('authorization') || ''
  if (!process.env.CRON_SECRET || !safeEqual(auth, `Bearer ${process.env.CRON_SECRET}`)) {
    return new Response('Unauthorized', { status: 401, headers: cors })
  }
  if (!process.env.BW_BG_CLIENT_ID) {
    console.error('bg-poll: mangler env vars')
    return new Response('Missing env vars', { status: 500, headers: cors })
  }

  const subs  = getStore('tripwire-subs')
  const stateStore = getStore({ name: 'tripwire-state', consistency: 'strong' })
  const meta  = getStore('tripwire-meta')
  const now = Date.now()
  const json = (obj, status = 200) =>
    new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json', ...cors } })

  // Heartbeat skrives KUN etter at hele deteksjons-pipelinen har lykkes — ellers
  // rapporterer /heartbeat-status «friskt» gjennom en hel BarentsWatch-nedetid.
  const beat = () => meta.setJSON('heartbeat', { at: Date.now(), iso: new Date().toISOString() })
    .catch(err => console.error('bg-poll: heartbeat-skriv feilet:', err.message))

  const stateAll = (await stateStore.get('all', { type: 'json' })) || {}

  const subList = await listAll(subs)
  const fetched = await mapLimit(subList, 25, async (blob) => {
    try { return { blob, rec: await subs.get(blob.key, { type: 'json' }) } }
    catch (err) {
      // Transient lesefeil: IKKE slett noe (en glitch må aldri felle en sub).
      console.error(`bg-poll: klarte ikke lese sub ${blob.key.slice(0, 40)}…:`, err.message)
      return { blob, rec: null }
    }
  })
  const records = []
  for (const { blob, rec } of fetched) {
    if (!rec) continue
    const updated = Date.parse(rec.updatedAt || rec.createdAt || 0)
    if (Number.isFinite(updated) && now - updated > RETENTION_MS) {
      await subs.delete(blob.key)
      delete stateAll[blob.key]
      continue
    }
    if (rec.tripwires?.length) records.push({ key: blob.key, rec })
  }

  await pruneRateLimits(now)

  // Rydd foreldreløse entries + posisjoner eldre enn 24 t. Kjøres på ALLE
  // retur-stier — ellers ligger posisjoner igjen i ubegrenset tid.
  const liveKeys = new Set(subList.map(b => b.key))
  const purgeState = () => {
    for (const k of Object.keys(stateAll)) {
      if (!liveKeys.has(k)) { delete stateAll[k]; continue }
      const lp = stateAll[k].lastPositions || {}
      for (const m of Object.keys(lp)) {
        const ts = lp[m]?.[2]
        if (!Number.isFinite(ts) || now - ts > POS_RETENTION_MS) delete lp[m]
      }
    }
  }

  if (!records.length) {
    purgeState()
    await stateStore.setJSON('all', stateAll)
    await beat()
    return json({ ok: true, subs: 0 })
  }

  const mmsiSet = new Set()
  for (const { rec } of records) for (const t of rec.tripwires) if (t.mmsi) mmsiSet.add(String(t.mmsi))
  const mmsis = [...mmsiSet].map(m => parseInt(m, 10)).filter(Number.isFinite)
  if (!mmsis.length) { await beat(); return json({ ok: true, subs: records.length, mmsis: 0 }) }

  let aisToken
  try { aisToken = await getAisToken() }
  catch (err) { console.error('bg-poll: BW token feilet:', err.message); return new Response(`Token: ${err.message}`, { status: 502, headers: cors }) }

  let aisRes
  try {
    aisRes = await fetch(AIS_URL, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${aisToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ mmsi: mmsis }),
      signal: AbortSignal.timeout(6_000),
    })
  } catch (err) {
    console.error('bg-poll: AIS-kall feilet:', err.message)
    return new Response(`AIS: ${err.message}`, { status: 502, headers: cors })
  }
  if (!aisRes.ok) {
    // 401/403 = token revokert server-side selv om ikke lokalt utløpt — invalider
    // cachen så neste tick henter nytt (ellers opptil ~55 min stille utfall).
    if (aisRes.status === 401 || aisRes.status === 403) { cachedToken = null; cachedTokenExpiry = 0 }
    console.error(`bg-poll: AIS svarte ${aisRes.status}`)
    return new Response(`AIS (${aisRes.status})`, { status: 502, headers: cors })
  }
  const aisData = await aisRes.json()
  const vessels = Array.isArray(aisData) ? aisData : aisData.vessels ?? []
  const vesselByMmsi = new Map()
  for (const v of vessels) {
    const mmsi = String(v.mmsi)
    const lat = v.latitude ?? v.lat
    const lon = v.longitude ?? v.lon
    // Stale AIS-rapport (fartøy som har sluttet å sende): segmentet fra
    // timegammel baseline til «nå» kan krysse linja uten at fartøyet gjorde det
    // nylig. Dropp dem fra deteksjon.
    const msgMs = Date.parse(v.msgtime ?? '')
    if (Number.isFinite(msgMs) && now - msgMs > STALE_POS_MS) continue
    if (Number.isFinite(lat) && Number.isFinite(lon)) {
      vesselByMmsi.set(mmsi, { lat, lon, name: v.name ?? v.shipName ?? `MMSI ${mmsi}` })
    }
  }

  // ── Fase 1: deteksjon. Avanser baseline + bestem hvem som skal fyre. INGEN
  // nettverkskall her, så fasen er rask og kan ikke time-oute halvveis. ──
  const toSend = []   // { key, rec, mmsi, data }
  for (const { key, rec } of records) {
    let st = stateAll[key] || { lastPositions: {}, lastFired: {} }
    if (!st.lastFired) st.lastFired = {}
    for (const tw of rec.tripwires) {
      const mmsi = String(tw.mmsi)
      const v = vesselByMmsi.get(mmsi)
      if (!v) continue
      const cur = [v.lat, v.lon]
      const prev = st.lastPositions[mmsi]
      // [lat, lon, ts] — ts brukes til 24 t-purge; prev[0]/prev[1] er
      // bakoverkompatibel med gammelt [lat, lon]-format.
      st.lastPositions[mmsi] = [v.lat, v.lon, now]
      // !prev = første gang vi ser fartøyet (nettopp armert): ingen baseline.
      if (!prev) continue
      // Gammel baseline (fartøyet var borte fra AIS en stund): segmentet
      // prev→cur spenner hele fraværet → fantom-krysning. Re-baseline og hopp.
      if (Number.isFinite(prev[2]) && now - prev[2] > STALE_POS_MS) continue
      if (prev[0] === cur[0] && prev[1] === cur[1]) continue

      const isCorridor = tw.type === 'corridor' && Array.isArray(tw.path) && tw.path.length >= 2
      let triggered
      if (isCorridor) {
        triggered = insideCorridor(prev, tw.path, tw.widthM) && !insideCorridor(cur, tw.path, tw.widthM)
      } else {
        triggered = tw.a && tw.b && segmentsIntersect(prev, cur, tw.a, tw.b)
      }
      if (!triggered) continue
      if (now - (st.lastFired[mmsi] || 0) < COOLDOWN_MS) continue   // jitter-guard
      st.lastFired[mmsi] = now

      const title = isCorridor ? `⚠ ${v.name} forlot ruta` : `⚠ ${v.name} krysset linja`
      const what = isCorridor
        ? `Forlot korridoren ${tw.name ? `(${tw.name}) ` : ''}`
        : `Passerte ${tw.name || `MMSI ${mmsi}`} `
      const body = `${what}kl. ${new Date(now).toLocaleTimeString('nb-NO', { hour:'2-digit', minute:'2-digit', timeZone: 'Europe/Oslo' })}`
      toSend.push({
        key, rec, mmsi,
        data: { title, body, mmsi, id: tw.id ?? null, lat: v.lat, lon: v.lon, ts: now, mode: rec.alarmMode === 'alarm' ? 'alarm' : 'chime' },
      })
    }
    stateAll[key] = st
  }

  // Rydd + PERSISTER STATE FØR sending. Slik kan en timeout under (treg)
  // FCM-sending aldri tape baseline/cooldown-stempler.
  purgeState()
  await stateStore.setJSON('all', stateAll)
  // Pipelinen (subs → BW → deteksjon → state) har lykkes → friskmeld.
  await beat()

  // ── Fase 2: sending. Fyringer grupperes per fcmToken (key). ULIKE tokens
  // sendes PARALLELT, fyringene til SAMME token sekvensielt — slik at en 404
  // (UNREGISTERED) på første stopper resten for det tokenet. Ett FCM-datavarsel
  // per fyring; native alarm-loop-plugin (M4) eier repetisjon basert på
  // data.mode. Kun 404 sletter tokenet (permanent dødt); transient feil (429/
  // 5xx) beholder det for retry neste tick.
  const byKey = new Map()
  for (const s of toSend) {
    if (!byKey.has(s.key)) byKey.set(s.key, [])
    byKey.get(s.key).push(s)
  }
  const results = []
  let anyGone = false
  await Promise.all([...byKey.values()].map(async (fires) => {
    let gone = false
    for (const s of fires) {
      if (gone) break
      try {
        await sendFcmMessage(s.rec.fcmToken, s.data)
        results.push({ key: s.key, mmsi: s.mmsi, sent: true })
      } catch (err) {
        if (err.status === 404) {
          gone = true; anyGone = true
          try { await subs.delete(s.key) } catch { /* neste tick rydder */ }
          delete stateAll[s.key]
          results.push({ key: s.key, mmsi: s.mmsi, gone: true })
        } else {
          console.error(`bg-poll: FCM feilet (${s.mmsi}):`, err.status, err.message)
          results.push({ key: s.key, mmsi: s.mmsi, error: err.message })
        }
      }
    }
  }))
  if (anyGone) await stateStore.setJSON('all', stateAll)   // persister slettinger

  if (toSend.length) console.log(`bg-poll: ${toSend.length} fyring(er)`, JSON.stringify(results))
  return json({ ok: true, subs: records.length, mmsis: mmsis.length, fires: toSend.length, results })
}

export const config = { path: '/bg-poll-trigger' }
