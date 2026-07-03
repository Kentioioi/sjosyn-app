import { getStore } from '@netlify/blobs'
import crypto from 'node:crypto'
import corsModule from './_cors.cjs'
const { corsHeaders } = corsModule

const MAX_TRIPWIRES_PER_SUB = 10
const MAX_BODY_BYTES = 8 * 1024
const MAX_TOTAL_SUBS = 10_000
const RATE_LIMIT_PER_IP_PER_MIN = 5

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
  if (!fcmToken || typeof fcmToken !== 'string') {
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
  const cleanTripwires = []
  for (const t of tripwires) {
    const mmsi = String(t?.mmsi ?? '').replace(/\D/g, '')
    if (!mmsi) continue
    cleanTripwires.push({ ...t, mmsi })
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
