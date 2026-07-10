import { getStore } from '@netlify/blobs'
import crypto from 'node:crypto'
import corsModule from './_cors.cjs'
const { corsHeaders } = corsModule

const MAX_TRIPWIRES_PER_SUB = 10
const MAX_PATH_POINTS = 50
const MAX_BODY_BYTES = 8 * 1024
const MAX_TOTAL_SUBS = 10_000
const MAX_FCM_TOKEN_LEN = 4096
const RATE_LIMIT_PER_IP_PER_MIN = 5

function safeEqual(a, b) {
  const ab = Buffer.from(String(a ?? ''))
  const bb = Buffer.from(String(b ?? ''))
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb)
}

function validLatLon(pt) {
  return Array.isArray(pt) && pt.length >= 2 &&
    Number.isFinite(pt[0]) && Math.abs(pt[0]) <= 90 &&
    Number.isFinite(pt[1]) && Math.abs(pt[1]) <= 180
}

async function rateLimit(ip) {
  const store = getStore('rate-limits')
  const minuteBucket = Math.floor(Date.now() / 60_000)
  const key = `subscribe:${ip}:${minuteBucket}`
  const cur = await store.get(key, { type: 'json' }) || { count: 0 }
  cur.count++
  await store.setJSON(key, cur)
  return cur.count > RATE_LIMIT_PER_IP_PER_MIN
}

export default async (req) => {
  const cors = corsHeaders(req.headers.get('origin'))
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors })
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: cors })
  const text = await req.text()
  if (text.length > MAX_BODY_BYTES) return new Response('Body too large', { status: 413, headers: cors })

  const ip = req.headers.get('x-nf-client-connection-ip')
        || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
        || 'unknown'
  if (await rateLimit(ip)) return new Response('Rate limit exceeded', { status: 429, headers: cors })

  let body
  try { body = JSON.parse(text || '{}') }
  catch { return new Response('Bad JSON', { status: 400, headers: cors }) }

  const { fcmToken, tripwires, alarmMode, unsubToken: existingToken } = body
  if (!fcmToken || typeof fcmToken !== 'string' || fcmToken.length > MAX_FCM_TOKEN_LEN) {
    return new Response('Missing/invalid fcmToken', { status: 400, headers: cors })
  }
  if (!Array.isArray(tripwires)) return new Response('tripwires must be array', { status: 400, headers: cors })
  if (tripwires.length > MAX_TRIPWIRES_PER_SUB) {
    return new Response(`Too many tripwires (max ${MAX_TRIPWIRES_PER_SUB})`, { status: 400, headers: cors })
  }
  const mode = alarmMode === 'alarm' ? 'alarm' : 'chime'

  const subs = getStore('tripwire-subs')
  const key = encodeURIComponent(fcmToken)
  const existing = await subs.get(key, { type: 'json' })

  // Eierskaps-sjekk: unsubToken er autorisasjons-hemmeligheten (samme modell som
  // unsubscribe/delete-data). Uten den kunne hvem som helst med kjennskap til
  // FCM-tokenet overskrive vaktene ELLER få utlevert unsubToken — og dermed
  // slette brukerens data via /push-delete-data.
  if (existing && !safeEqual(existingToken, existing.unsubToken)) {
    return new Response('Invalid token', { status: 403, headers: cors })
  }

  if (!existing) {
    let count = 0
    let cursor
    do {
      const page = await subs.list({ cursor })
      count += page.blobs.length
      cursor = page.cursor
      if (count > MAX_TOTAL_SUBS) {
        return new Response('Tjenesten er midlertidig på maks-kapasitet', { status: 503, headers: cors })
      }
    } while (cursor)
  }

  const unsubToken = existing?.unsubToken || existingToken || crypto.randomBytes(16).toString('hex')
  // Normaliser mmsi til ren sifferstreng (bg-poll sin parseInt + String()-oppslag
  // må alltid matche) og valider geometri — bg-poll konsumerer den blindt.
  const cleanTripwires = []
  for (const t of tripwires) {
    const mmsi = String(t?.mmsi ?? '').replace(/\D/g, '')
    if (!mmsi) continue
    if (t.type === 'corridor') {
      if (!Array.isArray(t.path) || t.path.length < 2 || t.path.length > MAX_PATH_POINTS) continue
      if (!t.path.every(validLatLon)) continue
      if (!Number.isFinite(t.widthM) || t.widthM <= 0 || t.widthM > 100_000) continue
    } else {
      if (!validLatLon(t.a) || !validLatLon(t.b)) continue
    }
    const name = typeof t.name === 'string' ? t.name.slice(0, 100) : null
    cleanTripwires.push({ ...t, mmsi, name })
  }
  const record = {
    fcmToken,
    tripwires: cleanTripwires,
    alarmMode: mode,
    unsubToken,
    createdAt: existing?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  await subs.setJSON(key, record)
  return new Response(JSON.stringify({ ok: true, unsubToken }), { headers: { 'Content-Type': 'application/json', ...cors } })
}

export const config = { path: '/push-subscribe' }
