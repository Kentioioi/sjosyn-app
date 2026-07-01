// POST /bg-poll-trigger — ekstern cron pinger denne hvert minutt.
// V2-syntax (default export) for Netlify Blobs auto-config.

import { getStore } from '@netlify/blobs'
import webpush from 'web-push'
import corsModule from './_cors.cjs'
const { corsHeaders } = corsModule

const TOKEN_URL = 'https://id.barentswatch.no/connect/token'
const AIS_URL   = 'https://live.ais.barentswatch.no/v1/latest/combined'
const RETENTION_MS = 90 * 24 * 60 * 60_000
// Tripwiren blir værende armert etter fyring (ikke engangs). Deteksjon er
// overgangs-basert, men en cooldown guard'er mot jitter rett på linja/kanten.
const COOLDOWN_MS = 60_000
// Alarm-modus: 3 pushes med 5 s mellomrom. Web Push lar ikke PWA velge
// varsel-lyd selv → vi simulerer "alarm" ved å trigge OS-lyd + vibrasjon
// flere ganger på rad. Tap "Bekreft" stopper visuelt på telefonen (kan
// ikke avbryte allerede-køet pushes).
const ALARM_BURST_COUNT = 3
const ALARM_BURST_GAP_MS = 5_000
const sleep = (ms) => new Promise(r => setTimeout(r, ms))

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

export default async (req) => {
  const cors = corsHeaders(req.headers.get('origin'))
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors })
  if (req.method !== 'POST' && req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405, headers: cors })
  }
  const auth = req.headers.get('authorization') || ''
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401, headers: cors })
  }
  if (!process.env.VAPID_PRIVATE_KEY || !process.env.BW_BG_CLIENT_ID) {
    return new Response('Missing env vars', { status: 500, headers: cors })
  }

  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:kenneth222.kn@gmail.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY,
  )

  const subs  = getStore('tripwire-subs')
  const stateStore = getStore({ name: 'tripwire-state', consistency: 'strong' })
  const meta  = getStore('tripwire-meta')

  await meta.setJSON('heartbeat', { at: Date.now(), iso: new Date().toISOString() })

  const stateAll = (await stateStore.get('all', { type: 'json' })) || {}

  const subList = await listAll(subs)
  const records = []
  const now = Date.now()
  for (const blob of subList) {
    const rec = await subs.get(blob.key, { type: 'json' })
    if (!rec) continue
    const updated = Date.parse(rec.updatedAt || rec.createdAt || 0)
    if (Number.isFinite(updated) && now - updated > RETENTION_MS) {
      await subs.delete(blob.key)
      delete stateAll[blob.key]
      continue
    }
    if (rec.tripwires?.length) records.push({ key: blob.key, rec })
  }
  if (!records.length) {
    const liveKeys = new Set(subList.map(b => b.key))
    let pruned = false
    for (const k of Object.keys(stateAll)) if (!liveKeys.has(k)) { delete stateAll[k]; pruned = true }
    if (pruned) await stateStore.setJSON('all', stateAll)
    return new Response(JSON.stringify({ ok: true, subs: 0 }), { headers: { 'Content-Type': 'application/json', ...cors } })
  }

  const mmsiSet = new Set()
  for (const { rec } of records) for (const t of rec.tripwires) if (t.mmsi) mmsiSet.add(String(t.mmsi))
  const mmsis = [...mmsiSet].map(m => parseInt(m, 10)).filter(Number.isFinite)
  if (!mmsis.length) return new Response(JSON.stringify({ ok: true, subs: records.length, mmsis: 0 }), { headers: { 'Content-Type': 'application/json', ...cors } })

  let aisToken
  try { aisToken = await getAisToken() }
  catch (err) { return new Response(`Token: ${err.message}`, { status: 502, headers: cors }) }

  const aisRes = await fetch(AIS_URL, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${aisToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ mmsi: mmsis }),
  })
  if (!aisRes.ok) return new Response(`AIS (${aisRes.status})`, { status: 502, headers: cors })
  const aisData = await aisRes.json()
  const vessels = Array.isArray(aisData) ? aisData : aisData.vessels ?? []
  const vesselByMmsi = new Map()
  for (const v of vessels) {
    const mmsi = String(v.mmsi)
    const lat = v.latitude ?? v.lat
    const lon = v.longitude ?? v.lon
    if (Number.isFinite(lat) && Number.isFinite(lon)) {
      vesselByMmsi.set(mmsi, { lat, lon, name: v.name ?? v.shipName ?? `MMSI ${mmsi}` })
    }
  }

  // ── Fase 1: deteksjon. Avanser baseline + bestem hvem som skal fyre. INGEN
  // nettverkskall her, så fasen er rask og kan ikke time-oute halvveis. ──
  const toSend = []   // { key, rec, mmsi, payload, burst }
  for (const { key, rec } of records) {
    let st = stateAll[key] || { lastPositions: {}, lastFired: {} }
    if (!st.lastFired) st.lastFired = {}
    for (const tw of rec.tripwires) {
      const mmsi = String(tw.mmsi)
      const v = vesselByMmsi.get(mmsi)
      if (!v) continue
      const cur = [v.lat, v.lon]
      const prev = st.lastPositions[mmsi]
      st.lastPositions[mmsi] = cur
      if (!prev) continue
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
      const payload = JSON.stringify({
        title,
        body: `${what}kl. ${new Date(now).toLocaleTimeString('nb-NO', { hour:'2-digit', minute:'2-digit', timeZone: 'Europe/Oslo' })}`,
        tag: `tripwire-${mmsi}`,
        mode: rec.alarmMode === 'alarm' ? 'alarm' : 'chime',
        data: { mmsi, id: tw.id ?? null, lat: v.lat, lon: v.lon, ts: now },
      })
      toSend.push({ key, rec, mmsi, payload, burst: rec.alarmMode === 'alarm' ? ALARM_BURST_COUNT : 1 })
    }
    stateAll[key] = st
  }

  const liveKeys = new Set(subList.map(b => b.key))
  for (const k of Object.keys(stateAll)) if (!liveKeys.has(k)) delete stateAll[k]
  await stateStore.setJSON('all', stateAll)

  // ── Fase 2: sending. Hver fyring er uavhengig — en forbigående feil på én
  // sub stopper IKKE de andre. ──
  const results = []
  const goneKeys = new Set()
  for (const s of toSend) {
    if (goneKeys.has(s.key)) continue
    let sent = 0
    for (let i = 0; i < s.burst; i++) {
      if (i > 0) await sleep(ALARM_BURST_GAP_MS)
      try {
        await webpush.sendNotification(s.rec.subscription, s.payload)
        sent++
      } catch (err) {
        if (err.statusCode === 404 || err.statusCode === 410) {
          await subs.delete(s.key)
          delete stateAll[s.key]
          goneKeys.add(s.key)
          results.push({ key: s.key, mmsi: s.mmsi, gone: true, sent })
        } else {
          results.push({ key: s.key, mmsi: s.mmsi, error: err.message, sent })
        }
        break
      }
    }
    if (sent > 0) results.push({ key: s.key, mmsi: s.mmsi, sent })
  }
  if (goneKeys.size) await stateStore.setJSON('all', stateAll)

  return new Response(JSON.stringify({ ok: true, subs: records.length, mmsis: mmsis.length, fires: toSend.length, results }), { headers: { 'Content-Type': 'application/json', ...cors } })
}

export const config = { path: '/bg-poll-trigger' }
