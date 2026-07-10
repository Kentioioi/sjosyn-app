import { getStore } from '@netlify/blobs'
import corsModule from './_cors.cjs'
const { corsHeaders } = corsModule

// Cron (cron-job.org) pinger /bg-poll-trigger hvert 3. min. Stale = 2+ tapte
// ticks pluss jitter — 8 min. (3 min traff cron-intervallet nøyaktig og
// flappet 503 på grensen under normal drift.)
const STALE_MS = 8 * 60_000

export default async (req) => {
  const cors = corsHeaders(req.headers.get('origin'))
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors })

  const meta = getStore('tripwire-meta')
  const hb = await meta.get('heartbeat', { type: 'json' })
  if (!hb?.at) {
    return new Response(JSON.stringify({ ok: false, reason: 'no heartbeat yet' }),
      { status: 503, headers: { 'Content-Type': 'application/json', ...cors } })
  }
  const age = Date.now() - hb.at
  if (age > STALE_MS) {
    return new Response(JSON.stringify({ ok: false, ageMs: age, lastIso: hb.iso }),
      { status: 503, headers: { 'Content-Type': 'application/json', ...cors } })
  }
  return new Response(JSON.stringify({ ok: true, ageMs: age, lastIso: hb.iso }),
    { headers: { 'Content-Type': 'application/json', ...cors } })
}

export const config = { path: '/heartbeat-status' }
