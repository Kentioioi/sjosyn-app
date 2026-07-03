// App-owned Firebase Admin credentials (server-side only, never shipped to
// the device). Signs a JWT with the service account's private key to get an
// OAuth2 access token for the FCM HTTP v1 API — no firebase-admin SDK needed,
// mirrors the manual OAuth pattern already used for BarentsWatch (_bwToken.cjs).
const crypto = require('node:crypto')

let cachedAccessToken = null
let cachedExpiry = 0
let cachedProjectId = null

function base64url(input) {
  return Buffer.from(input).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function getServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
  if (!raw) throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON not set')
  return JSON.parse(raw)
}

async function getFcmAccessToken() {
  if (cachedAccessToken && Date.now() < cachedExpiry - 60_000) {
    return { accessToken: cachedAccessToken, projectId: cachedProjectId }
  }

  const sa = getServiceAccount()
  cachedProjectId = sa.project_id

  const now = Math.floor(Date.now() / 1000)
  const header = { alg: 'RS256', typ: 'JWT' }
  const claims = {
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/firebase.messaging',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  }
  const signingInput = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(claims))}`
  const signature = crypto.createSign('RSA-SHA256').update(signingInput).sign(sa.private_key)
  const jwt = `${signingInput}.${base64url(signature)}`

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  })
  if (!res.ok) throw new Error(`FCM OAuth (${res.status}): ${(await res.text()).slice(0, 200)}`)
  const data = await res.json()
  cachedAccessToken = data.access_token
  cachedExpiry = Date.now() + (data.expires_in ?? 3600) * 1000
  return { accessToken: cachedAccessToken, projectId: cachedProjectId }
}

// Sends one FCM message. Pure DATA message — no `notification` block — so
// Android always hands it to SjosynMessagingService.onMessageReceived()
// regardless of app state (foreground/background/killed). A `notification`
// block would make Android auto-display it via the system tray WITHOUT ever
// calling our code when backgrounded/killed, which would silently break the
// native alarm (M4). title/body travel as plain data fields instead — the
// native code builds its own notification/alarm UI from them.
async function sendFcmMessage(fcmToken, data = {}) {
  const { accessToken, projectId } = await getFcmAccessToken()
  const message = {
    token: fcmToken,
    android: { priority: 'high' },
    // FCM v1 requires every data value to be a string.
    data: Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v)])),
  }

  const res = await fetch(`https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  })
  if (!res.ok) {
    const text = await res.text()
    const err = new Error(`FCM send (${res.status}): ${text.slice(0, 300)}`)
    err.status = res.status
    err.body = text
    throw err
  }
  return res.json()
}

module.exports = { getFcmAccessToken, sendFcmMessage }
