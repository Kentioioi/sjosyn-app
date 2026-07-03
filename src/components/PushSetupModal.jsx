// Modal som forklarer bakgrunnsvarsling + utfører FCM-abonnementet.

import { useEffect, useState } from 'react'
import { isPushSupported, getExistingSubscription, subscribeToPush, unsubscribeFromPush } from '../utils/pushSubscribe'

export default function PushSetupModal({ onClose, onSubscribed }) {
  const [supported] = useState(isPushSupported())
  const [existing, setExisting] = useState(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)

  useEffect(() => {
    getExistingSubscription().then(setExisting).catch(() => {})
  }, [])

  const [consented, setConsented] = useState(false)
  async function handleEnable() {
    if (!consented) { setErr('Du må krysse av for samtykke nedenfor først.'); return }
    setBusy(true); setErr(null)
    try {
      const token = await subscribeToPush()
      setExisting(token)
      onSubscribed?.(token)
      onClose()
    } catch (e) {
      setErr(e.message)
    } finally {
      setBusy(false)
    }
  }

  async function handleDisable() {
    setBusy(true); setErr(null)
    try {
      await unsubscribeFromPush()
      setExisting(null)
      onSubscribed?.(null)
    } catch (e) {
      setErr(e.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="push-modal-backdrop" onClick={onClose}>
      <div className="push-modal" onClick={e => e.stopPropagation()}>
        <div className="push-modal-header">
          <h2>Bakgrunnsvarsling</h2>
          <button className="close-btn" onClick={onClose} title="Lukk">✕</button>
        </div>

        <div className="push-modal-body">
          {!supported && (
            <p className="push-modal-warn">⚠ Push støttes ikke på denne enheten.</p>
          )}

          {supported && (
            <div className="push-modal-step">
              <h3>Aktiver varsling</h3>
              <p>Sjøsyn-serveren overvåker dine armerte vakter hvert minutt. Når et fartøy krysser linja, sender vi varsel rett til telefonen din — selv om appen er lukket.</p>
              <p className="push-modal-sub">Ingen konto, ingen e-post, ingen lagring av posisjonsdata utenfor dette varslingsbehovet.</p>
              {!existing && (
                <label className="push-consent">
                  <input type="checkbox" checked={consented} onChange={e => setConsented(e.target.checked)} />
                  <span>
                    Jeg samtykker til at Sjøsyn lagrer push-abonnementet mitt og vakt-koordinatene
                    på Netlify (USA, SCC) for å levere bakgrunnsvarsler. Data slettes når jeg deaktiverer
                    eller etter 90 dagers inaktivitet. Se{' '}
                    <a href="/privacy" target="_blank" rel="noopener noreferrer">personvernerklæringen</a>.
                  </span>
                </label>
              )}
              {existing
                ? <button className="push-modal-btn push-modal-btn--off" onClick={handleDisable} disabled={busy}>
                    {busy ? 'Stopper…' : 'Stopp bakgrunnsvarsling'}
                  </button>
                : <button className="push-modal-btn" onClick={handleEnable} disabled={busy || !consented}>
                    {busy ? 'Aktiverer…' : 'Aktiver bakgrunnsvarsling'}
                  </button>}
              {err && <p className="push-modal-err">⚠ {err}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
