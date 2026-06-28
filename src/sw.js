/// <reference lib="webworker" />
// Custom Service Worker for Sjøsyn — workbox-precache + Web Push handler.
// Bygget via vite-plugin-pwa injectManifest-strategi.

import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { CacheFirst } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'

// __WB_MANIFEST blir injisert av workbox-build under bygg
precacheAndRoute(self.__WB_MANIFEST)

// Map tiles cache — CARTO
registerRoute(
  ({ url }) => url.hostname === 'basemaps.cartocdn.com',
  new CacheFirst({
    cacheName: 'carto-tiles',
    plugins: [new ExpirationPlugin({ maxEntries: 1000, maxAgeSeconds: 7 * 24 * 60 * 60 })],
  })
)

// Map tiles cache — Kartverket sjøkart
registerRoute(
  ({ url }) => url.hostname === 'cache.kartverket.no',
  new CacheFirst({
    cacheName: 'kartverket-tiles',
    plugins: [new ExpirationPlugin({ maxEntries: 1500, maxAgeSeconds: 7 * 24 * 60 * 60 })],
  })
)

// Aktiver ny SW umiddelbart
self.skipWaiting()
self.clients.claim()

// Post en melding til klienten og vent på ack via MessageChannel. Returnerer
// true hvis klienten bekreftet innen timeoutMs, ellers false. Lar oss bruke
// in-app banner KUN når en levende, fokusert klient faktisk viste det —
// ellers faller vi tilbake til OS-notif (slik at et varsel aldri forsvinner).
function postAndAwaitAck(client, msg, timeoutMs) {
  return new Promise((resolve) => {
    let done = false
    const finish = (v) => { if (!done) { done = true; resolve(v) } }
    const ch = new MessageChannel()
    ch.port1.onmessage = () => finish(true)
    try { client.postMessage(msg, [ch.port2]) }
    catch { finish(false); return }
    setTimeout(() => finish(false), timeoutMs)
  })
}

// ── Push event: bakgrunnsvarsling fra Sjøsyn-backend ─────────
// Samme varslingsflate uansett om appen er åpen eller lukket: vis ALLTID
// OS-varselet (med lyd via systemets varselkanal + renotify/vibrate). Tidligere
// undertrykte vi OS-varselet når en klient var fokusert og viste et stille
// in-app banner i stedet → da fikk man ingen lyd mens appen var åpen. Doble
// varsler er likevel unngått fordi backend er eneste detektor når push er på.
self.addEventListener('push', (event) => {
  let data = {}
  try { data = event.data?.json() ?? {} }
  catch { data = { title: 'Sjøsyn', body: event.data?.text() ?? '' } }
  const isAlarm = data.mode === 'alarm'
  const title = data.title || '⚠ Sjøsyn-varsel'

  event.waitUntil((async () => {
    const opts = {
      body: data.body || '',
      icon: '/icon.png',
      badge: '/badge.png',   // monokrom gjennomsiktig silhuett — status-linje-ikon (ikke hvit firkant)
      tag: data.tag || 'sjosyn-alert',
      renotify: true,
      vibrate: isAlarm
        ? [400, 200, 400, 200, 400, 200, 400, 200, 800]
        : [200, 100, 200, 100, 400],
      requireInteraction: true,
      actions: isAlarm ? [{ action: 'ack', title: '✓ Bekreft' }] : [],
      data: { ...(data.data || {}), mode: data.mode || 'chime' },
    }
    await self.registration.showNotification(title, opts)
  })())
})

// notificationclick: bekreft-knapp lukker bare. Body-click åpner appen og
// navigerer til krysningsstedet (mmsi + lat/lon i URL hash så App kan
// pan + velg fartøy på mount). Hvis appen alt er åpen: focus + postMessage
// så App reagerer uten full reload.
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  if (event.action === 'ack') return
  const d = event.notification.data || {}
  const hasFocus = d.mmsi != null && d.lat != null && d.lon != null
  const hash = hasFocus
    ? `#trip=${encodeURIComponent(d.mmsi)},${d.lat},${d.lon},${d.ts || ''}`
    : ''
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
      for (const c of clients) {
        if ('focus' in c) {
          if (hasFocus) c.postMessage({ type: 'tripwire-focus', mmsi: String(d.mmsi), lat: d.lat, lon: d.lon, ts: d.ts })
          return c.focus()
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow('/' + hash)
    })
  )
})
