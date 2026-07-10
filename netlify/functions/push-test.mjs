// POST /push-test[?mode=alarm|chime] — sender umiddelbar test-melding til alle
// registrerte subs, via samme datashape som en ekte vakt-krysning (mode=alarm
// er default — tester den fulle native alarm-koden, ikke bare levering).
// Bruk: curl -X POST -H "Authorization: Bearer <CRON_SECRET>" .../push-test

import { getStore } from '@netlify/blobs'
import crypto from 'node:crypto'
import corsModule from './_cors.cjs'
import fcmModule from './_fcm.cjs'
const { corsHeaders } = corsModule
const { sendFcmMessage } = fcmModule

function safeEqual(a, b) {
  const ab = Buffer.from(String(a ?? ''))
  const bb = Buffer.from(String(b ?? ''))
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb)
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
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: cors })
  const auth = req.headers.get('authorization') || ''
  if (!process.env.CRON_SECRET || !safeEqual(auth, `Bearer ${process.env.CRON_SECRET}`)) {
    return new Response('Unauthorized', { status: 401, headers: cors })
  }

  const url = new URL(req.url)
  const mode = url.searchParams.get('mode') === 'chime' ? 'chime' : 'alarm'

  const subs = getStore('tripwire-subs')
  const blobs = await listAll(subs)
  const results = []
  for (const blob of blobs) {
    const rec = await subs.get(blob.key, { type: 'json' })
    if (!rec?.fcmToken) continue
    try {
      await sendFcmMessage(rec.fcmToken, {
        title: '✅ Sjøsyn test',
        body: 'Push fungerer. Backend → telefon-kanal er live.',
        mode,
        test: true,
        ts: Date.now(),
      })
      results.push({ key: blob.key, sent: true })
    } catch (err) {
      results.push({ key: blob.key, error: err.message, status: err.status })
    }
  }
  return new Response(JSON.stringify({ ok: true, count: results.length, results }), { headers: { 'Content-Type': 'application/json', ...cors } })
}

export const config = { path: '/push-test' }
