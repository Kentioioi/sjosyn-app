// TEMPORARY — reads the diagnostic captured by bg-poll-trigger.mjs. Delete
// both this file and the capture block once the cron-job.org 401 is solved.
import { getStore } from '@netlify/blobs'

export default async () => {
  const rec = await getStore('debug').get('last-auth-attempt', { type: 'json' })
  return new Response(JSON.stringify(rec || { note: 'no attempt captured yet' }), {
    headers: { 'Content-Type': 'application/json' },
  })
}

export const config = { path: '/_debug-cron-auth' }
