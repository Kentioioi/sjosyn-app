// Native push (FCM via Capacitor) — replaces Web Push for the native app.
// No-ops entirely when not running inside the native shell (browser preview).
import { Capacitor } from '@capacitor/core'
import { PushNotifications } from '@capacitor/push-notifications'

export const isNative = () => Capacitor.isNativePlatform()

// Requests notification permission, registers with FCM, resolves with the
// device token (or null if unsupported / denied / registration failed).
export function registerNativePush() {
  return new Promise((resolve) => {
    if (!isNative()) return resolve(null)

    let settled = false
    const done = (value) => { if (!settled) { settled = true; resolve(value) } }

    PushNotifications.addListener('registration', (token) => done(token.value))
    PushNotifications.addListener('registrationError', (err) => {
      console.error('FCM registration failed', err)
      done(null)
    })

    PushNotifications.requestPermissions()
      .then((perm) => {
        if (perm.receive !== 'granted') return done(null)
        PushNotifications.register()
      })
      .catch((err) => {
        console.error('Push permission request failed', err)
        done(null)
      })
  })
}

export function onPushReceived(cb) {
  if (!isNative()) return () => {}
  const subPromise = PushNotifications.addListener('pushNotificationReceived', cb)
  return () => subPromise.then(sub => sub.remove())
}

export function onPushActionPerformed(cb) {
  if (!isNative()) return () => {}
  const subPromise = PushNotifications.addListener('pushNotificationActionPerformed', cb)
  return () => subPromise.then(sub => sub.remove())
}
