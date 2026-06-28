// Bunnpanel for bølgevarselet — åpnes ved trykk på bølge-chipen.
// Vindusknapper (6/12/24/48/96/168 t — kappet til det data faktisk rekker)
// og en tidslinje som kan dras time for time gjennom hele varselet (~7 d).
// Når tidslinjen dras overstyrer den vindusmodusen: merkene viser da
// varslet bølgehøyde og -retning på akkurat det tidspunktet.
import { HORIZONS, horizonLabel } from '../hooks/useWaveForecast'

function fmtTime(unixSec) {
  return new Date(unixSec * 1000).toLocaleString('nb-NO', {
    weekday: 'short', hour: '2-digit', minute: '2-digit',
  })
}

export default function WaveTimeline({
  horizon, onHorizon,
  scrub, onScrub,          // hours from anchor (null = window mode)
  anchorT, maxOffsetH,     // unix sec anchor + how far the data reaches
  thin = 0, onThin,        // 0–100 punkt-tetthet (høyere = færre merker)
  loading = false, error = null, hasData = false,
  onClose,
}) {
  // Only offer windows the data can actually fill — keep the next one above
  // maxOffsetH so the user still sees the full reach as a labelled cap.
  const available = HORIZONS.filter((h, i, arr) => h <= maxOffsetH || arr[i - 1] < maxOffsetH)

  return (
    <div className="wave-timeline" onClick={e => e.stopPropagation()}>
      <div className="wave-timeline-top">
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
        <button className="close-btn" onClick={onClose} title="Lukk">✕</button>
      </div>

      <input
        type="range"
        className="timeline-slider"
        min={0}
        max={Math.max(1, maxOffsetH)}
        value={scrub ?? 0}
        style={{ '--pct': `${((scrub ?? 0) / Math.max(1, maxOffsetH)) * 100}%` }}
        onChange={e => onScrub(Number(e.target.value))}
      />

      <div className={'wave-timeline-label' + (error ? ' is-error' : '')}>
        {error
          ? '⚠ Kunne ikke hente bølgevarsel'
          : loading && !hasData
            ? 'Henter bølgevarsel…'
            : !hasData
              ? 'Ingen bølgedata i dette området'
              : scrub == null
                ? `Største ventede bølger neste ${horizonLabel(horizon)} — dra tidslinja`
                : `${fmtTime(anchorT + scrub * 3600)} · +${Math.round(scrub)} t`}
      </div>

      {onThin && (
        <div className="density-row">
          <span className="density-label">Merker</span>
          <input
            type="range" className="timeline-slider density-slider"
            min={0} max={100} step={5} value={100 - thin}
            style={{ '--pct': `${100 - thin}%` }}
            onChange={e => onThin(100 - Number(e.target.value))}
          />
        </div>
      )}
    </div>
  )
}
