import { useState } from 'react'

export default function ApiKeyModal({ onSave, onDemo, onCancel, onForget }) {
  const [clientId, setClientId] = useState('')
  const [clientSecret, setClientSecret] = useState('')
  const [remember, setRemember] = useState(true)

  const canConnect = clientId.trim() && clientSecret.trim()

  function save() {
    onSave({ clientId: clientId.trim(), clientSecret: clientSecret.trim() }, remember)
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-icon">⚓</div>
        <h1 className="modal-title">Sjøsyn</h1>
        <p className="modal-sub">Sanntids AIS-sporing av fartøy</p>

        <div className="modal-section">
          <p className="modal-desc">
            Koble til <strong>BarentsWatch</strong> — den offisielle norske AIS-tjenesten
            med dekning langs hele kysten.
          </p>

          <label className="modal-label">Klient-ID</label>
          <input
            className="modal-input"
            placeholder="din-app@klient"
            value={clientId}
            onChange={e => setClientId(e.target.value)}
          />

          <label className="modal-label">Klienthemmelighet</label>
          <input
            className="modal-input"
            type="password"
            placeholder="••••••••••••••••"
            value={clientSecret}
            onChange={e => setClientSecret(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && canConnect && save()}
          />

          <label className="remember-row">
            <input
              type="checkbox"
              checked={remember}
              onChange={e => setRemember(e.target.checked)}
            />
            <span>Husk på denne enheten <small>(kryptert med PIN-koden din)</small></span>
          </label>

          <button className="btn-primary" disabled={!canConnect} onClick={save}>
            Koble til AIS-data
          </button>
        </div>

        <div className="modal-divider"><span>eller</span></div>

        <button className="btn-secondary" onClick={onDemo}>
          Prøv demomodus
        </button>

        {onCancel && (
          <button className="btn-secondary" onClick={onCancel}>
            ← Tilbake til kartet
          </button>
        )}

        {onForget && (
          <button className="modal-forget" onClick={onForget}>
            🗑 Glem lagret API-nøkkel
          </button>
        )}

        <p className="modal-hint">
          Gratis konto på{' '}
          <span className="modal-link">barentswatch.no</span>
          {' '}→ registrer deg → opprett API-klient → tilgang: <code style={{color:'#7dd3fc',fontSize:'0.7rem'}}>ais</code>
        </p>
      </div>
    </div>
  )
}
