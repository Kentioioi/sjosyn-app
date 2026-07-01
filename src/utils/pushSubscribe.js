// Klient-side helper for Web Push abonnement, sync, unsubscribe og
// GDPR-sletting. unsubToken lagres i localStorage så vi alltid kan
// unsubscribe / slette uten å vente på server-roundtrip.

import { VAPID_PUBLIC_KEY } from './pushConfig'
import { API_BASE } from './apiBase'

const UNSUB_TOKEN_KEY = 'mw_push_unsub_token'

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(base64)
  const out = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; ++i) out[i] = raw.charCodeAt(i)
  return out
}

export function isPushSupported() {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window
}

export async function getExistingSubscription() {
  if (!isPushSupported()) return null
  const reg = await navigator.serviceWorker.ready
  return reg.pushManager.getSubscription()
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
  if (!isPushSupported()) throw new Error('Web Push støttes ikke av denne enheten')
  const perm = await Notification.requestPermission()
  if (perm !== 'granted') throw new Error('Varslingstilgang ble ikke gitt')
  const reg = await navigator.serviceWorker.ready
  let sub = await reg.pushManager.getSubscription()
  if (!sub) {
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    })
  }
  return sub
}

// Stopper abonnement på telefonen + sender best-effort unsubscribe til backenden
export async function unsubscribeFromPush() {
  const sub = await getExistingSubscription()
  if (!sub) { clearUnsubToken(); return false }
  const endpoint = sub.endpoint
  const token = loadUnsubToken()
  await sub.unsubscribe()
  if (token) {
    try {
      await fetch(`${API_BASE}/push-unsubscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint, unsubToken: token }),
      })
    } catch { /* best-effort */ }
  }
  clearUnsubToken()
  return true
}

// GDPR Art 17 — slett ALT vi har lagret om brukeren
export async function deleteAllData() {
  const sub = await getExistingSubscription()
  const token = loadUnsubToken()
  if (sub && token) {
    try {
      await fetch(`${API_BASE}/push-delete-data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: sub.endpoint, unsubToken: token }),
      })
    } catch { /* fortsett uansett */ }
  }
  if (sub) try { await sub.unsubscribe() } catch { /* ignore */ }
  clearUnsubToken()
}

// Sync alle armerte tripwires til backend. Lagrer unsubToken første gang.
// alarmMode: 'chime' (engangs, mild vibrasjon) | 'alarm' (sterk vibrasjon +
// bekreft-knapp i notifikasjonen).
export async function syncTripwiresToBackend(tripwires, alarmMode = 'chime') {
  const sub = await getExistingSubscription()
  if (!sub) return false
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
      subscription: sub.toJSON(),
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
