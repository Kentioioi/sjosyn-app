import { useMemo } from 'react'
import { horizonLabel } from '../hooks/useWaveForecast'

// Popup som vises når brukeren trykker på en bølge-badge. Viser nåværende
// horisont-aggregat: maks Hs i vinduet [nå, nå+horisont], hvilken time
// peak'en faller på, og retningen ved peak.

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
  // anchor = unix sec at "now" the windows were computed against; horizon = hours.
  const { t0, vh, vd } = series
  const idx0 = Math.max(0, Math.round((anchor - t0) / 3600))
  const end  = Math.min(vh.length - 1, Math.round((anchor + horizon * 3600 - t0) / 3600))
  let peakIdx = -1, peakVal = -Infinity
  for (let k = idx0; k <= end; k++) {
    if (vh[k] != null && vh[k] > peakVal) { peakVal = vh[k]; peakIdx = k }
  }
  if (peakIdx < 0) return null
  return {
    timeSec: t0 + peakIdx * 3600,
    hs: peakVal,
    rawDirFrom: vd[peakIdx],
  }
}

export default function WavePointPopup({ point, horizon, scrubT, onClose }) {
  const anchor = scrubT != null ? scrubT : Math.floor(Date.now() / 1000)
  const peak = useMemo(() => point?.series ? findPeak(point.series, scrubT != null ? 0 : horizon, anchor) : null, [point, horizon, scrubT, anchor])

  if (!point) return null
  // Retningen bølgene GÅR (meteorologisk fra + 180°), samme som pila på badgen.
  // 90° = bølgene beveger seg mot øst.
  const dirTo = peak && Number.isFinite(peak.rawDirFrom)
    ? Math.round(((peak.rawDirFrom + 180) % 360))
    : null

  // Dato/tid for når det er høyest — vises FØR høyden så det er tydelig at
  // det er da bølgene topper seg. I scrub-modus er tiden allerede valgt.
  const whenSec = scrubT != null ? scrubT : (peak ? peak.timeSec : null)
  const whenLabel = scrubT != null ? 'Ved' : 'Høyest'
  const headerLabel = scrubT != null
    ? `Bølgevarsel`
    : `Maks neste ${horizonLabel(horizon)}`

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
            {peak ? `${peak.hs.toFixed(1)} m` : '–'}
          </div>
          <div className="wave-popup-meta">
            {dirTo != null && (
              <div>Bølgeretning: <strong>{dirTo}° {cardinal(dirTo)}</strong></div>
            )}
            <div>Posisjon: {point.position[0].toFixed(3)}, {point.position[1].toFixed(3)}</div>
          </div>
        </div>
        <div className="wave-popup-footer">
          Bølgedata: MET Norway WAM800
        </div>
      </div>
    </div>
  )
}
