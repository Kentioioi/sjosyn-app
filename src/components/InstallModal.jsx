// Modal som vises når bruker tapper logoen. Dekker fire scenarier:
// 1. Allerede installert (standalone) → bekreftelse
// 2. Chrome som har fyrt beforeinstallprompt → "Installer"-knapp som trigger
//    den native Chrome-dialogen
// 3. iOS Safari → visuell instruks for Del-knappen
// 4. Chrome/annet uten fanget event → manuell instruks via menyen

import { useEffect, useState } from 'react'

function isIOS() { return /iP(hone|ad|od)/.test(navigator.userAgent) }

function isAndroid() { return /Android/.test(navigator.userAgent) }

export default function InstallModal({ installPrompt, isStandalone, onClose }) {
  const [busy, setBusy] = useState(false)

  // Lytt på appinstalled mens modalen er åpen → lukk automatisk
  useEffect(() => {
    const onInstalled = () => onClose()
    window.addEventListener('appinstalled', onInstalled)
    return () => window.removeEventListener('appinstalled', onInstalled)
  }, [onClose])

  async function handleInstall() {
    if (!installPrompt) return
    setBusy(true)
    try {
      installPrompt.prompt()
      const choice = await installPrompt.userChoice
      if (choice?.outcome === 'accepted') onClose()
    } catch { /* ignore */ }
    setBusy(false)
  }

  return (
    <div className="push-modal-backdrop" onClick={onClose}>
      <div className="push-modal" onClick={e => e.stopPropagation()}>
        <div className="push-modal-header">
          <h2>{isStandalone ? '✓ Sjøsyn er installert' : '📲 Installer Sjøsyn som app'}</h2>
          <button className="close-btn" onClick={onClose} title="Lukk">✕</button>
        </div>

        <div className="push-modal-body">
          {isStandalone && (
            <p>Du kjører Sjøsyn som installert app. Alt fungerer som det skal.</p>
          )}

          {!isStandalone && installPrompt && (
            <>
              <p>Sjøsyn fungerer bedre som installert app: raskere oppstart, varsler i bakgrunn, ingen nettleser-distraksjon.</p>
              <div style={{ marginTop: 16 }}>
                <button className="push-modal-btn" onClick={handleInstall} disabled={busy}>
                  {busy ? 'Installerer…' : 'Installer nå'}
                </button>
              </div>
            </>
          )}

          {!isStandalone && !installPrompt && isIOS() && (
            <>
              <p>iPhone/iPad lar ikke web-apper installere seg automatisk. Det tar 3 sekunder manuelt:</p>
              <div className="push-modal-step">
                <ol>
                  <li>Trykk <strong>Del</strong>-knappen <span style={{ display: 'inline-block', padding: '2px 8px', background: '#0a84ff', color: '#fff', borderRadius: 6, fontSize: '0.9em' }}>⎙</span> nederst i Safari</li>
                  <li>Bla ned → <strong>«Legg til på Hjem-skjerm»</strong></li>
                  <li>Trykk <strong>Legg til</strong> oppe til høyre</li>
                </ol>
              </div>
              <p className="push-modal-sub">Sjøsyn-ubåten dukker opp på hjem-skjermen.</p>
            </>
          )}

          {!isStandalone && !installPrompt && !isIOS() && (
            <>
              <p>Nettleseren har ikke tilbudt automatisk installasjon enda. Du kan installere manuelt:</p>
              <div className="push-modal-step">
                <ol>
                  {isAndroid() ? (
                    <>
                      <li>Åpne <strong>Chrome-menyen</strong> (⋮ oppe til høyre)</li>
                      <li>Trykk <strong>«Installer app»</strong> eller <strong>«Legg til på Hjem-skjerm»</strong></li>
                    </>
                  ) : (
                    <>
                      <li>Åpne nettlesermenyen</li>
                      <li>Velg <strong>«Installer Sjøsyn»</strong> eller <strong>«Legg til på Hjem-skjerm»</strong></li>
                    </>
                  )}
                </ol>
              </div>
              <p className="push-modal-sub">
                Tips: Chrome viser noen ganger en automatisk install-prompt etter at du har brukt siden et par ganger — kom tilbake senere og tap logoen igjen.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
