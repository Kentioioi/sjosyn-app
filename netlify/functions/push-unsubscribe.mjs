import { getStore } from '@netlify/blobs'
import crypto from 'node:crypto'
import corsModule from './_cors.cjs'
const { corsHeaders } = corsModule

function safeEqual(a, b) {
  const ab = Buffer.from(String(a ?? ''))
  const bb = Buffer.from(String(b ?? ''))
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb)
}

export default async (req) => {
  const cors = corsHeaders(req.headers.get('origin'))
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors })
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: cors })
  let body
  try { body = await req.json() }
  catch { return new Response('Bad JSON', { status: 400, headers: cors }) }

  const { fcmToken, unsubToken: token } = body
  if (!fcmToken || !token) return new Response('Missing fcmToken or unsubToken', { status: 400, headers: cors })

  const subs = getStore('tripwire-subs')
  const key = encodeURIComponent(fcmToken)

  const rec = await subs.get(key, { type: 'json' })
  if (!rec) return new Response(JSON.stringify({ ok: true, note: 'already gone' }), { headers: { 'Content-Type': 'application/json', ...cors } })
  if (!safeEqual(token, rec.unsubToken)) return new Response('Invalid token', { status: 403, headers: cors })

  await subs.delete(key)
  return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json', ...cors } })
}

export const config = { path: '/push-unsubscribe' }
