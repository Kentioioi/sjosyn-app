// Modal som forklarer hvordan bakgrunnsvarsling settes opp + utfører
// abonnementet. Detekterer iOS Safari vs standalone PWA og viser riktig
// install-instruks før push kan aktiveres.

import { useEffect, useState } from 'react'
import { isPushSupported, getExistingSubscription, subscribeToPush, unsubscribeFromPush } from '../utils/pushSubscribe'

function isStandalone() {
  return window.matchMedia?.('(display-mode: standalone)').matches
    || window.navigator.standalone === true
}

function isIOS() {
  return /iP(hone|ad|od)/.test(navigator.userAgent)
}

export default function PushSetupModal({ onClose, onSubscribed }) {
  const [supported] = useState(isPushSupported())
  const [standalone] = useState(isStandalone())
  const [ios] = useState(isIOS())
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
      const sub = await subscribeToPush()
      setExisting(sub)
      onSubscribed?.(sub)
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
            <p className="push-modal-warn">⚠ Web Push støttes ikke av denne nettleseren.</p>
          )}

          {supported && ios && !standalone && (
            <div className="push-modal-step">
              <h3>1. Installer som app først</h3>
              <p>iPhone krever at Sjøsyn er installert til hjem-skjermen før varsler kan leveres når appen er minimert.</p>
              <ol>
                <li>Trykk <strong>Del-ikonet</strong> ⬆️ nederst i Safari</li>
                <li>Bla ned og velg <strong>«Legg til på Hjem-skjerm»</strong></li>
                <li>Åpne Sjøsyn fra hjem-skjermen og kom tilbake hit</li>
              </ol>
            </div>
          )}

          {supported && !ios && !standalone && (
            <div className="push-modal-step">
              <h3>1. Installer som app (anbefalt)</h3>
              <p>Med Sjøsyn installert til hjem-skjermen får du varslene som vanlige push-notifikasjoner — også når appen er drept eller telefonen ligger i lomma.</p>
              <ol>
                <li>I Chrome: trykk de tre prikkene ⋮ øverst til høyre</li>
                <li>Velg <strong>«Installer app»</strong> eller <strong>«Legg til på Hjem-skjerm»</strong></li>
              </ol>
              <p className="push-modal-sub">Du kan også aktivere uten å installere, men da kan Android Chrome dempe varselene etter en stund.</p>
            </div>
          )}

          {supported && (
            <div className="push-modal-step">
              <h3>{standalone ? '1.' : '2.'} Aktiver varsling</h3>
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
