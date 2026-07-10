import { HORIZONS, horizonLabel } from '../hooks/useWaveForecast'

// Samlet varsel-linje for bølge + vind — ETT tidsvalg og ÉN scrub styrer begge
// lag (tid er samme dimensjon). Glass-stil: kartet synes gjennom.
function fmtTime(unixSec) {
  return new Date(unixSec * 1000).toLocaleString('nb-NO', {
    weekday: 'short', hour: '2-digit', minute: '2-digit',
  })
}

export default function ForecastBar({
  horizon, onHorizon,
  scrub, onScrub,          // timer fra anker (null = vindusmodus)
  anchorT, maxOffsetH,     // unix sek anker + hvor langt dataene rekker
  loading = false, error = null, hasData = false,
  onClose,
}) {
  // Tilby KUN vinduer dataene faktisk fyller — aldri lov mer varsel enn vi har.
  const available = HORIZONS.filter(h => h <= maxOffsetH)
  const pct = ((scrub ?? 0) / Math.max(1, maxOffsetH)) * 100
  // Scrub-avlesing vises i statuslinja UNDER slideren — en flytende boble over
  // tommelen dekket horisont-knappene og ble stående etter draget.
  const scrubLabel = scrub != null
    ? `${fmtTime(anchorT + scrub * 3600)} · +${scrub >= 48 ? `${Math.round(scrub / 24)} d` : `${scrub} t`}`
    : null
  const status = error
    ? '⚠ Kunne ikke hente varsel'
    : loading && !hasData
      ? 'Henter varsel…'
      : !hasData
        ? 'Ingen varseldata i dette området'
        : scrubLabel

  return (
    <div className="fc-bar" onClick={e => e.stopPropagation()}>
      <div className="fc-bar-top">
        <span className="fc-bar-hint">Merkene viser høyeste verdi i tidsrommet:</span>
        <button className="close-btn" onClick={onClose} title="Lukk">✕</button>
      </div>
      <div className="horizon-opts">
        {available.map(h => (
          <button
            key={h}
            className={`horizon-btn${scrub == null && horizon === h ? ' active' : ''}`}
            onClick={() => { onScrub(null); onHorizon(h) }}
          >
            {horizonLabel(h)}
          </button>
        ))}
      </div>

      <div className="fc-slider-sec">
        <div className="fc-bar-hint">…eller bla deg time for time gjennom varselet:</div>
        <div className="fc-slider-wrap">
          <input
            type="range"
            className="timeline-slider fc-slider"
            min={0}
            max={Math.max(1, maxOffsetH)}
            value={scrub ?? 0}
            style={{ '--pct': `${pct}%` }}
            onChange={e => onScrub(Number(e.target.value))}
            aria-label="Tidslinje: timer fram i tid"
          />
        </div>
      </div>

      {status && <div className={`fc-status${error ? ' is-error' : ''}`}>{status}</div>}
    </div>
  )
}
