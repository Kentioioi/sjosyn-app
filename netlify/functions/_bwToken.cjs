// App-owned BarentsWatch client (server-side only — never exposed to the
// device). Same credential pair the bg-poll cron already uses. Token is
// cached module-scope per warm function instance, mirrors bg-poll-trigger.mjs.
const TOKEN_URL = 'https://id.barentswatch.no/connect/token'

let cachedToken = null
let cachedTokenExpiry = 0

async function getBwToken() {
  if (cachedToken && Date.now() < cachedTokenExpiry - 60_000) return cachedToken
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: process.env.BW_BG_CLIENT_ID,
    client_secret: process.env.BW_BG_CLIENT_SECRET,
    scope: 'ais',
  })
  let r
  try {
    r = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      signal: AbortSignal.timeout(8000),
    })
  } catch {
    // Nettverksfeil/timeout mot BW → kall-siden fanger dette og svarer 502.
    throw new Error('bw_token_upstream_unavailable')
  }
  if (!r.ok) throw new Error(`BW token (${r.status}): ${(await r.text()).slice(0, 200)}`)
  const data = await r.json()
  cachedToken = data.access_token
  cachedTokenExpiry = Date.now() + (data.expires_in ?? 3600) * 1000
  return cachedToken
}

module.exports = { getBwToken }
