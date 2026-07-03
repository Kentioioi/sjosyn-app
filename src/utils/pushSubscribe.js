// Klient-side helper for FCM push-abonnement, sync, unsubscribe og
// GDPR-sletting. unsubToken lagres i localStorage så vi alltid kan
// unsubscribe / slette uten å vente på server-roundtrip.

import { API_BASE } from './apiBase'
import { isNative, registerNativePush } from './pushNative'

const UNSUB_TOKEN_KEY = 'mw_push_unsub_token'
const FCM_TOKEN_KEY = 'mw_fcm_token'
const PUSH_ENABLED_KEY = 'mw_push_enabled'

export function isPushSupported() {
  return isNative()
}

// Returns the cached FCM token if the user has push enabled, else null.
export async function getExistingSubscription() {
  if (!isPushSupported()) return null
  if (localStorage.getItem(PUSH_ENABLED_KEY) !== '1') return null
  return localStorage.getItem(FCM_TOKEN_KEY)
}

function loadUnsubToken() {
  try { return localStorage.getItem(UNSUB_TOKEN_KEY) } catch { return null }
}
function saveUnsubToken(token) {
  try { localStorage.setItem(UNSUB_TOKEN_KEY, token) } catch { /* private mode */ }
}
function clearUnsubToken() {
  try { localStorage.removeItem(UNSUB_TOKEN_KEY) } catch { /* ignore */ }
}

export async function subscribeToPush() {
  if (!isPushSupported()) throw new Error('Push støttes ikke på denne enheten')
  const token = await registerNativePush()
  if (!token) throw new Error('Varslingstilgang ble ikke gitt')
  localStorage.setItem(FCM_TOKEN_KEY, token)
  localStorage.setItem(PUSH_ENABLED_KEY, '1')
  return token
}

// Stopper abonnement (backend-side) + best-effort unsubscribe til backenden
export async function unsubscribeFromPush() {
  const token = await getExistingSubscription()
  localStorage.removeItem(PUSH_ENABLED_KEY)
  const unsubToken = loadUnsubToken()
  if (token && unsubToken) {
    try {
      await fetch(`${API_BASE}/push-unsubscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fcmToken: token, unsubToken }),
      })
    } catch { /* best-effort */ }
  }
  clearUnsubToken()
  return true
}

// GDPR Art 17 — slett ALT vi har lagret om brukeren
export async function deleteAllData() {
  const token = await getExistingSubscription()
  const unsubToken = loadUnsubToken()
  if (token && unsubToken) {
    try {
      await fetch(`${API_BASE}/push-delete-data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fcmToken: token, unsubToken }),
      })
    } catch { /* fortsett uansett */ }
  }
  localStorage.removeItem(PUSH_ENABLED_KEY)
  clearUnsubToken()
}

// Sync alle armerte tripwires til backend. Lagrer unsubToken første gang.
// alarmMode: 'chime' (engangs, mild vibrasjon) | 'alarm' (sterk vibrasjon +
// bekreft-knapp i notifikasjonen).
export async function syncTripwiresToBackend(tripwires, alarmMode = 'chime') {
  const token = await getExistingSubscription()
  if (!token) return false
  const list = Object.entries(tripwires || {})
    .filter(([, t]) => t?.armed && (
      (Array.isArray(t.a) && Array.isArray(t.b)) ||
      (t.type === 'corridor' && Array.isArray(t.path) && t.path.length >= 2)
    ))
    .map(([mmsi, t]) => t.type === 'corridor'
      ? { mmsi, id: t.id ?? null, name: t.vesselName ?? null, type: 'corridor', path: t.path, widthM: t.widthM }
      : { mmsi, id: t.id ?? null, name: t.vesselName ?? null, type: 'line', a: t.a, b: t.b }
    )
  const existingToken = loadUnsubToken()
  const res = await fetch(`${API_BASE}/push-subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fcmToken: token,
      tripwires: list,
      alarmMode,
      unsubToken: existingToken,
    }),
  })
  if (!res.ok) throw new Error(`Backend (${res.status})`)
  const data = await res.json()
  if (data.unsubToken && data.unsubToken !== existingToken) {
    saveUnsubToken(data.unsubToken)
  }
  return true
}
