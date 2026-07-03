// Innstillinger — kartvisning og tilkobling. Preferansene lagres i
// localStorage (mw_prefs) via App.
import { HORIZONS as WAVE_HORIZONS, horizonLabel as waveHorizonLabel } from '../hooks/useWaveForecast'
import { deleteAllData, getExistingSubscription } from '../utils/pushSubscribe'

function ToggleRow({ label, sub, checked, onChange, disabled = false }) {
  return (
    <button
      className={`settings-row${disabled ? ' settings-row--disabled' : ''}`}
      onClick={() => { if (!disabled) onChange(!checked) }}
      aria-disabled={disabled}
    >
      <div className="settings-row-text">
        <div className="settings-row-label">{label}</div>
        {sub && <div className="settings-row-sub">{sub}</div>}
      </div>
      <span className={`toggle${checked && !disabled ? ' on' : ''}`} aria-hidden>
        <span className="toggle-knob" />
      </span>
    </button>
  )
}

// Værlag-rad: slår laget av/på OG velger hvor langt fram varselet rekker, i én
// rad. Bryter til høyre; tidsvalget dukker opp ved siden av når laget er på.
function WeatherLayerRow({ label, sub, enrolled, onEnroll, horizon, onHorizon }) {
  return (
    <div className="settings-row settings-row--static">
      <div className="settings-row-text">
        <div className="settings-row-label">{label}</div>
        {sub && <div className="settings-row-sub">{sub}</div>}
      </div>
      <div className="settings-row-control">
        {enrolled && (
          <select
            className="settings-select"
            value={horizon}
            onChange={e => onHorizon(Number(e.target.value))}
            aria-label={`${label}: tidsrom for høyeste verdi`}
          >
            {WAVE_HORIZONS.map(h => <option key={h} value={h}>{waveHorizonLabel(h)}</option>)}
          </select>
        )}
        <button
          type="button"
          className="settings-toggle-btn"
          role="switch"
          aria-checked={enrolled}
          aria-label={`${label} av/på`}
          onClick={() => onEnroll(!enrolled)}
        >
          <span className={`toggle${enrolled ? ' on' : ''}`} aria-hidden>
            <span className="toggle-knob" />
          </span>
        </button>
      </div>
    </div>
  )
}

export default function SettingsPanel({
  prefs, onPrefs, onEnroll,
  showVectors, onShowVectors,
  isDemoMode, onToggleDemo,
  connected, connError,
  fcmToken,
  onSetHome,
  onClose,
}) {
  return (
    <div className="settings-overlay" onClick={e => e.stopPropagation()}>
      <div className="settings-header">
        <h2>Innstillinger</h2>
        <button className="close-btn" onClick={onClose} title="Lukk">✕</button>
      </div>

      <div className="settings-body">
        <div className="settings-section">
          <div className="settings-section-title">Kartvisning</div>

          <ToggleRow
            label="Fartøysnavn"
            sub="Vis navn ved fartøyene når du zoomer inn"
            checked={prefs.showNames}
            onChange={v => onPrefs({ showNames: v })}
          />
          <ToggleRow
            label="Grupper fartøy i ro"
            sub="Fire eller flere stillestående fartøy samles i én markør med antall"
            checked={prefs.clusterStationary}
            onChange={v => onPrefs({ clusterStationary: v })}
          />
          <ToggleRow
            label="Kursvektorer"
            sub="Stiplet linje som viser posisjon om 5, 10 og 15 minutter"
            checked={showVectors}
            onChange={onShowVectors}
          />
        </div>

        <div className="settings-section">
          <div className="settings-section-title">Værdata</div>

          <WeatherLayerRow
            label="Bølgevarsel"
            sub="Vis på kart: Største bølger ventet innenfor valgt tidsrom."
            enrolled={!!prefs.layers?.wave?.enrolled}
            onEnroll={v => onEnroll('wave', v)}
            horizon={prefs.waveHorizon}
            onHorizon={h => onPrefs({ waveHorizon: h })}
          />
          <WeatherLayerRow
            label="Vindvarsel"
            sub="Vis på kart: Sterkeste vind ventet innenfor valgt tidsrom."
            enrolled={!!prefs.layers?.wind?.enrolled}
            onEnroll={v => onEnroll('wind', v)}
            horizon={prefs.windHorizon}
            onHorizon={h => onPrefs({ windHorizon: h })}
          />
          {prefs.layers?.wind?.enrolled && (
            <div className="settings-row settings-row--static">
              <div className="settings-row-text">
                <div className="settings-row-label">Vindenhet</div>
                <div className="settings-row-sub">Vises på vind-merkene og i popup</div>
              </div>
              <div className="alarm-mode-options">
                <label className={`alarm-mode-opt${prefs.windUnit !== 'kn' ? ' alarm-mode-opt--active' : ''}`}>
                  <input type="radio" name="windUnit" value="ms"
                    checked={prefs.windUnit !== 'kn'}
                    onChange={() => onPrefs({ windUnit: 'ms' })} />
                  m/s
                </label>
                <label className={`alarm-mode-opt${prefs.windUnit === 'kn' ? ' alarm-mode-opt--active' : ''}`}>
                  <input type="radio" name="windUnit" value="kn"
                    checked={prefs.windUnit === 'kn'}
                    onChange={() => onPrefs({ windUnit: 'kn' })} />
                  knop
                </label>
              </div>
            </div>
          )}
        </div>

        <div className="settings-section">
          <div className="settings-section-title">Varsling</div>

          <div className="settings-row settings-row--static">
            <div className="settings-row-text">
              <div className="settings-row-label">Modus</div>
              <div className="settings-row-sub">Engangs: én stille varsling. Alarm-modus: 3 varsler med 5s mellomrom + sterk vibrasjon + bekreft-knapp</div>
            </div>
            <div className="alarm-mode-options">
              <label className={`alarm-mode-opt${prefs.alarmMode === 'chime' ? ' alarm-mode-opt--active' : ''}`}>
                <input type="radio" name="alarmMode" value="chime"
                  checked={prefs.alarmMode === 'chime'}
                  onChange={() => onPrefs({ alarmMode: 'chime' })} />
                Engangs
              </label>
              <label className={`alarm-mode-opt${prefs.alarmMode === 'alarm' ? ' alarm-mode-opt--active' : ''}`}>
                <input type="radio" name="alarmMode" value="alarm"
                  checked={prefs.alarmMode === 'alarm'}
                  onChange={() => onPrefs({ alarmMode: 'alarm' })} />
                Alarm-modus
              </label>
            </div>
          </div>

          <div className="settings-attrib">
            Lyd styres av telefonen din. Bytt varsel-lyd for Sjøsyn i{' '}
            <strong>Android: Innstillinger → Apper → Sjøsyn → Varsler → Lyd</strong>{' '}
            eller{' '}
            <strong>iOS: Innstillinger → Varsler → Sjøsyn → Lyd</strong>.
            Velg en alarm-tone der hvis du vil ha noe mer påtrengende enn vanlig varsel.
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-section-title">Hjem</div>
          <div className="settings-row settings-row--static">
            <div className="settings-row-text">
              <div className="settings-row-label">Min hjemmehavn</div>
              <div className="settings-row-sub">
                {prefs.home
                  ? `Lagret: ${prefs.home.lat.toFixed(4)}, ${prefs.home.lon.toFixed(4)}`
                  : 'Ikke satt — trykk «Velg på kart» og sett en pin'}
              </div>
            </div>
            <div className="home-btns">
              <button className="settings-btn" onClick={onSetHome}>Velg på kart</button>
              {prefs.home && (
                <button className="settings-btn settings-btn--danger" onClick={() => { if (window.confirm('Slette lagret hjemmeposisjon?')) onPrefs({ home: null }) }}>Slett</button>
              )}
            </div>
          </div>
          <div className="settings-attrib">
            Lagres kun på din enhet — ingen sky, ingen database, ingen sporing.
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-section-title">Tilkobling</div>
          <div className="settings-row settings-row--static">
            <div className="settings-row-text">
              <div className="settings-row-label">Datakilde</div>
              <div className="settings-row-sub settings-conn">
                {!isDemoMode && <span className={'conn-dot ' + (connected ? 'connected' : 'disconnected')} />}
                {isDemoMode
                  ? 'Demomodus aktiv'
                  : connected
                    ? 'Tilkoblet BarentsWatch'
                    : connError
                      ? 'Ikke tilkoblet — ' + connError
                      : 'Ikke tilkoblet'}
              </div>
            </div>
            <button className="settings-btn" onClick={onToggleDemo}>
              {isDemoMode ? 'Bruk ekte data' : 'Bruk demomodus'}
            </button>
          </div>
          {/* M3a midlertidig: viser FCM-token for manuell test fra Firebase-
              konsollen. Erstattes av ekte abonnements-UI i M3b. */}
          <div className="settings-row settings-row--static">
            <div className="settings-row-text">
              <div className="settings-row-label">Push-token (FCM)</div>
              <div className="settings-row-sub" style={{ wordBreak: 'break-all' }}>
                {fcmToken ? fcmToken : 'Ikke registrert ennå'}
              </div>
            </div>
            {fcmToken && (
              <button
                className="settings-btn"
                onClick={() => navigator.clipboard?.writeText(fcmToken)}
              >
                Kopier
              </button>
            )}
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-section-title">Personvern</div>
          <div className="settings-row settings-row--static">
            <div className="settings-row-text">
              <div className="settings-row-label">Personvernerklæring</div>
              <div className="settings-row-sub">Hvilke data vi lagrer, hvor lenge, og dine rettigheter</div>
            </div>
            <a className="settings-btn" href="/privacy" target="_blank" rel="noopener noreferrer">Les</a>
          </div>
          <div className="settings-row settings-row--static">
            <div className="settings-row-text">
              <div className="settings-row-label">Slett alle mine data</div>
              <div className="settings-row-sub">Fjerner push-abonnement + serverdata. Lokale innstillinger må slettes manuelt fra nettleseren.</div>
            </div>
            <button
              className="settings-btn settings-btn--danger"
              onClick={async () => {
                if (!confirm('Slette alt? Dette stopper bakgrunnsvarsling og fjerner alle serverdata. Kan ikke angres.')) return
                try { await deleteAllData(); localStorage.removeItem('mw_demo'); alert('Slettet. Lokale innstillinger ligger fortsatt i nettleseren.') }
                catch (e) { alert('Feil ved sletting: ' + e.message) }
              }}
            >Slett</button>
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-section-title">Om</div>
          <div className="settings-about">
            <strong>Ikke for navigasjon.</strong> AIS-posisjoner kan være forsinket eller
            mangle, og bølgedata er modellbaserte varsler uten garanti. Bruk offisielle
            sjøkart for navigasjon og sikkerhet. All bruk skjer på eget ansvar.
          </div>
          <div className="settings-attrib">
            Data levert av{' '}
            <a href="https://www.barentswatch.no/" target="_blank" rel="noopener noreferrer">BarentsWatch</a>{' '}
            (kilde: Kystverket)
          </div>
          <div className="settings-attrib">
            Personvern: alt lagres kun på din enhet — ingen sporing eller analyse
          </div>
        </div>
      </div>
    </div>
  )
}
