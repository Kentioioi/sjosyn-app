import { HORIZONS, horizonLabel } from '../hooks/useWaveForecast'

function fmtTime(unixSec) {
  return new Date(unixSec * 1000).toLocaleString('nb-NO', {
    weekday: 'short', hour: '2-digit', minute: '2-digit',
  })
}

export default function WindTimeline({
  horizon, onHorizon,
  scrub, onScrub,          // timer fra anker (null = vindue-modus)
  anchorT, maxOffsetH,     // unix sek anker + hvor langt dataene rekker
  unit, onUnit,            // 'ms' | 'kn'
  thin = 0, onThin,        // 0–100 punkt-tetthet (høyere = færre merker)
  loading = false, error = null, hasData = false,
  onClose,
}) {
  const available = HORIZONS.filter((h, i, arr) => h <= maxOffsetH || arr[i - 1] < maxOffsetH)

  return (
    <div className="wave-timeline wind-timeline" onClick={e => e.stopPropagation()}>
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
        <div className="wind-unit-toggle">
          <button className={`wind-unit-btn${unit === 'ms' ? ' active' : ''}`} onClick={() => onUnit('ms')}>m/s</button>
          <button className={`wind-unit-btn${unit === 'kn' ? ' active' : ''}`} onClick={() => onUnit('kn')}>knop</button>
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
          ? '⚠ Kunne ikke hente vindvarsel'
          : loading && !hasData
            ? 'Henter vindvarsel…'
            : !hasData
              ? 'Ingen vinddata i dette området'
              : scrub == null
                ? `Sterkeste ventede vind neste ${horizonLabel(horizon)} — dra tidslinja`
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
