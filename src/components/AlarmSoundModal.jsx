// Vises første gang bruker velger Alarm-modus. Web Push lar oss ikke
// velge varsel-lyd fra koden — det styres av telefonens innstillinger
// per app. Vi guider bruker dit.

function isIOS() {
  return /iP(hone|ad|od)/.test(navigator.userAgent)
}

export default function AlarmSoundModal({ onAcknowledge, onClose }) {
  const ios = isIOS()
  return (
    <div className="push-modal-backdrop" onClick={onClose}>
      <div className="push-modal" onClick={e => e.stopPropagation()}>
        <div className="push-modal-header">
          <h2>🔔 Sett en alarm-lyd</h2>
          <button className="close-btn" onClick={onClose} title="Lukk">✕</button>
        </div>

        <div className="push-modal-body">
          <p>
            Web-apper kan ikke velge varsel-lyd selv. For at alarm-modus
            skal høres ut som en alarm, må du sette en kraftig lyd på Sjøsyn
            i telefon-innstillingene.
          </p>

          <div className="push-modal-step">
            <strong>{ios ? 'iOS' : 'Android'}</strong>
            {ios ? (
              <ol>
                <li>Åpne <strong>Innstillinger</strong></li>
                <li><strong>Varsler</strong> → finn <strong>Sjøsyn</strong></li>
                <li>Skru på <strong>Lyd</strong> og <strong>Tidssensitive varsler</strong></li>
                <li>iOS bruker standardlyden — ikke mulig å velge en spesifikk alarm-lyd uten native app</li>
              </ol>
            ) : (
              <ol>
                <li>Åpne <strong>Innstillinger</strong></li>
                <li><strong>Apper</strong> → <strong>Sjøsyn</strong> (eller MarineWatch)</li>
                <li><strong>Varsler</strong> → trykk på en kategori</li>
                <li><strong>Lyd</strong> → velg en alarm-/sirene-lyd</li>
                <li>Skru på <strong>Vibrer</strong> + <strong>Vis pop-up</strong> for låseskjerm</li>
              </ol>
            )}
          </div>

          <p className="push-modal-sub">
            Innstillingen gjelder for alle Sjøsyn-varsler.
          </p>

          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <button className="push-modal-btn push-modal-btn--off" onClick={onClose}>Senere</button>
            <button className="push-modal-btn" onClick={onAcknowledge}>Jeg har satt lyd</button>
          </div>
        </div>
      </div>
    </div>
  )
}
