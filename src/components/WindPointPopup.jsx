import { useMemo } from 'react'
import { horizonLabel } from '../hooks/useWaveForecast'
import { formatWind, windUnitLabel } from '../utils/windScale'

function fmtTime(unixSec) {
  if (!Number.isFinite(unixSec)) return '–'
  const d = new Date(unixSec * 1000)
  return d.toLocaleString('nb-NO', { weekday: 'long', day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })
}

// 8-punkts himmelretning (norsk). 90° = Ø (øst).
function cardinal(deg) {
  const dirs = ['N', 'NØ', 'Ø', 'SØ', 'S', 'SV', 'V', 'NV']
  return dirs[Math.round(deg / 45) % 8]
}

function findPeak(series, horizon, anchor) {
  const { t0, vs, vd } = series
  const idx0 = Math.max(0, Math.round((anchor - t0) / 3600))
  const end  = Math.min(vs.length - 1, Math.round((anchor + horizon * 3600 - t0) / 3600))
  let peakIdx = -1, peakVal = -Infinity
  for (let k = idx0; k <= end; k++) {
    if (vs[k] != null && vs[k] > peakVal) { peakVal = vs[k]; peakIdx = k }
  }
  if (peakIdx < 0) return null
  return { timeSec: t0 + peakIdx * 3600, ms: peakVal, rawDirFrom: vd[peakIdx] }
}

export default function WindPointPopup({ point, horizon, scrubT, unit = 'ms', onClose }) {
  const anchor = scrubT != null ? scrubT : Math.floor(Date.now() / 1000)
  const peak = useMemo(
    () => point?.series ? findPeak(point.series, scrubT != null ? 0 : horizon, anchor) : null,
    [point, horizon, scrubT, anchor],
  )

  if (!point) return null
  // Vind oppgis FRA en retning (meteorologisk konvensjon).
  const dirFrom = peak && Number.isFinite(peak.rawDirFrom) ? Math.round(peak.rawDirFrom) % 360 : null
  const whenSec = scrubT != null ? scrubT : (peak ? peak.timeSec : null)
  const whenLabel = scrubT != null ? 'Ved' : 'Sterkest'
  const headerLabel = scrubT != null ? 'Vindvarsel' : `Maks neste ${horizonLabel(horizon)}`

  return (
    <div className="wave-popup-backdrop" onClick={onClose}>
      <div className="wave-popup" onClick={e => e.stopPropagation()}>
        <div className="wave-popup-header">
          <div className="wave-popup-label">{headerLabel}</div>
          <button className="close-btn" onClick={onClose} title="Lukk">✕</button>
        </div>
        <div className="wave-popup-body">
          {whenSec != null && (
            <div className="wave-popup-when">{whenLabel} {fmtTime(whenSec)}</div>
          )}
          <div className="wave-popup-hs">
            {peak ? `${formatWind(peak.ms, unit)} ${windUnitLabel(unit)}` : '–'}
          </div>
          <div className="wave-popup-meta">
            {dirFrom != null && (
              <div>Vind fra: <strong>{dirFrom}° {cardinal(dirFrom)}</strong></div>
            )}
            <div>Posisjon: {point.position[0].toFixed(3)}, {point.position[1].toFixed(3)}</div>
          </div>
        </div>
        <div className="wave-popup-footer">
          Vinddata: MET Norway
        </div>
      </div>
    </div>
  )
}
