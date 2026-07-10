import { memo, useMemo } from 'react'
import { Popup } from 'react-leaflet'
import { horizonLabel } from '../hooks/useWaveForecast'
import { formatWind, windUnitLabel, MS_TO_KN } from '../utils/windScale'

// Kart-forankret varsel-popup: festes til merket, kartet forblir synlig og
// pannbart. Viser peak-verdi, retning, tid og en 48-timers sparkline fra
// seriedataene som allerede ligger i punktet. kind='combo' viser bølge- og
// vind-seksjon i samme kort (kombinert merke).

function fmtTime(unixSec) {
  if (!Number.isFinite(unixSec)) return '–'
  return new Date(unixSec * 1000).toLocaleString('nb-NO', {
    weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
  })
}

// 8-punkts himmelretning (norsk). 90° = Ø (øst).
function cardinal(deg) {
  const dirs = ['N', 'NØ', 'Ø', 'SØ', 'S', 'SV', 'V', 'NV']
  return dirs[Math.round(deg / 45) % 8]
}

function findPeak(series, vals, horizon, anchor) {
  const idx0 = Math.max(0, Math.round((anchor - series.t0) / 3600))
  const end  = Math.min(vals.length - 1, Math.round((anchor + horizon * 3600 - series.t0) / 3600))
  let peakIdx = -1, peakVal = -Infinity
  for (let k = idx0; k <= end; k++) {
    if (vals[k] != null && vals[k] > peakVal) { peakVal = vals[k]; peakIdx = k }
  }
  if (peakIdx < 0) return null
  return { timeSec: series.t0 + peakIdx * 3600, val: peakVal, rawDir: series.vd[peakIdx] }
}

// «Fine» y-akse-ticks: minste steg som gir maks ~4 nivåer under maksverdien.
function yTicks(maxDisp) {
  for (const step of [0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50]) {
    if (maxDisp / step <= 4.5) {
      // Teller i stedet for akkumulering (flyttall-drift), desimaler etter steg
      const dec = step < 0.1 ? 2 : step < 1 ? 1 : 0
      const ticks = []
      for (let k = 1; step * k <= maxDisp; k++) ticks.push((step * k).toFixed(dec))
      return ticks
    }
  }
  return []
}

// 48 t utvikling fra ankeret — mini-graf med akser: enhet + tallticks til
// venstre (gridlinjer), tidsticks hver 6./12. time (etter vinduslengde).
// Ankeret er scrub-tidspunktet når brukeren scrubber — venstre etikett viser
// da klokkeslettet, ikke «nå», og høyre etikett følger faktisk vinduslengde
// (serien kan slutte før +48 t). factor/unitLabel: vind kan vises i knop.
function Sparkline({ series, vals, anchor, scrubbed, color, unitLabel = 'm', factor = 1 }) {
  const W = 204, H = 66, LEFT = 18, RIGHT = 200, TOP = 10, BASE = 54
  const idx0 = Math.max(0, Math.round((anchor - series.t0) / 3600))
  const end = Math.min(vals.length - 1, idx0 + 48)
  if (end - idx0 < 2) return null
  const win = vals.slice(idx0, end + 1)
  const finite = win.filter(Number.isFinite)
  if (finite.length < 2) return null
  const span = win.length - 1
  const maxDisp = Math.max(...finite, 0.001) * factor
  const px = i => LEFT + (i / span) * (RIGHT - LEFT)
  const py = disp => BASE - (disp / maxDisp) * (BASE - TOP)
  const pts = win.map((v, i) => (v == null ? null : [px(i), py(v * factor)])).filter(Boolean)
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ')
  const area = `${line} L${pts[pts.length - 1][0].toFixed(1)} ${BASE} L${pts[0][0].toFixed(1)} ${BASE} Z`
  let peakI = 0
  win.forEach((v, i) => { if (v != null && (win[peakI] == null || v > win[peakI])) peakI = i })
  const startLbl = scrubbed
    ? new Date(anchor * 1000).toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' })
    : 'nå'
  const yt = yTicks(maxDisp)
  const xStep = span <= 24 ? 6 : 12
  const xt = []
  for (let t = xStep; t < span; t += xStep) xt.push(t)
  // Tidsticks viser KLOKKESLETT (ikke +timer); midnatt viser ukedag i stedet
  const clockLbl = t => {
    const d = new Date((anchor + t * 3600) * 1000)
    const h = d.getHours()
    return h === 0
      ? d.toLocaleDateString('nb-NO', { weekday: 'short' }).replace('.', '')
      : String(h).padStart(2, '0')
  }
  const endLbl = new Date((anchor + span * 3600) * 1000)
    .toLocaleString('nb-NO', { weekday: 'short', hour: '2-digit' })
    .replace('.,', '').replace(' kl.', '')
  return (
    <svg className="fc-spark" width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
      <text x={LEFT - 3} y={7} textAnchor="end" className="fc-spark-lbl">{unitLabel}</text>
      {yt.map(v => (
        <g key={v}>
          <line x1={LEFT} y1={py(+v)} x2={RIGHT} y2={py(+v)} className="fc-spark-grid" />
          <text x={LEFT - 3} y={py(+v) + 2} textAnchor="end" className="fc-spark-lbl">{v}</text>
        </g>
      ))}
      {xt.map(t => (
        <g key={t}>
          <line x1={px(t)} y1={TOP} x2={px(t)} y2={BASE} className="fc-spark-grid" />
          <text x={px(t)} y={H - 2} textAnchor="middle" className="fc-spark-lbl">{clockLbl(t)}</text>
        </g>
      ))}
      <line x1={LEFT} y1={BASE} x2={RIGHT} y2={BASE} className="fc-spark-grid fc-spark-grid--base" />
      <path d={area} fill={color} opacity="0.14" />
      <path d={line} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
      {win[peakI] != null && <circle cx={px(peakI)} cy={py(win[peakI] * factor)} r="2.4" fill={color} />}
      <text x={LEFT} y={H - 2} className="fc-spark-lbl">{startLbl}</text>
      <text x={RIGHT} y={H - 2} textAnchor="end" className="fc-spark-lbl">{endLbl}</text>
    </svg>
  )
}

// Én lag-seksjon (bølge ELLER vind) — verdi, tid, retning, sparkline.
function Section({ kind, point, horizon, scrubT, unit, showLabel }) {
  const series = point.series
  const vals = kind === 'wave' ? series?.vh : series?.vs
  const anchor = scrubT != null ? scrubT : Math.floor(Date.now() / 1000)
  const peak = useMemo(
    () => (series && vals ? findPeak(series, vals, scrubT != null ? 0 : horizon, anchor) : null),
    [series, vals, horizon, scrubT, anchor],
  )
  const color = kind === 'wave' ? '#4fb8e8' : '#5fce8b'
  // Bølge: retningen bølgene GÅR (fra + 180°). Vind: oppgis FRA (met. konvensjon).
  const dirDeg = peak && Number.isFinite(peak.rawDir)
    ? (kind === 'wave' ? Math.round((peak.rawDir + 180) % 360) : Math.round(peak.rawDir) % 360)
    : null
  const valTxt = peak == null
    ? '–'
    : kind === 'wave' ? `${peak.val.toFixed(1)} m` : `${formatWind(peak.val, unit)} ${windUnitLabel(unit)}`
  return (
    <div className="fc-popup-sec">
      {showLabel && <div className="fc-popup-sec-label" style={{ color }}>{kind === 'wave' ? 'Bølge' : 'Vind'}</div>}
      <div className="fc-popup-val" style={{ color }}>{valTxt}</div>
      {peak && (
        <div className="fc-popup-meta">
          {scrubT == null && <div>{kind === 'wave' ? 'Høyest' : 'Sterkest'} {fmtTime(peak.timeSec)}</div>}
          {scrubT != null && <div>Ved {fmtTime(scrubT)}</div>}
          {dirDeg != null && (
            <div>{kind === 'wave' ? 'Bølgeretning' : 'Vind fra'}: <strong>{dirDeg}° {cardinal(dirDeg)}</strong></div>
          )}
        </div>
      )}
      {series && vals && (
        <Sparkline
          series={series} vals={vals} anchor={anchor} scrubbed={scrubT != null} color={color}
          unitLabel={kind === 'wave' ? 'm' : windUnitLabel(unit)}
          factor={kind === 'wind' && unit === 'kn' ? MS_TO_KN : 1}
        />
      )}
    </div>
  )
}

// memo: App re-rendres av hvert AIS-poll; uten memo re-kjører react-leaflet
// popup-effekten og autoPan rykker kartet tilbake til popupen hvert poll.
// Alle props er identitetsstabile på tvers av polls (point/onClose/primitiver).
export default memo(function ForecastPointPopup({ kind, point, windPoint, position, horizon, scrubT, unit = 'ms', onClose }) {
  const header = scrubT != null
    ? (kind === 'combo' ? 'Varsel' : kind === 'wave' ? 'Bølgevarsel' : 'Vindvarsel')
    : `Maks neste ${horizonLabel(horizon)}`
  const handlers = useMemo(() => ({ remove: onClose }), [onClose])

  return (
    <Popup
      position={position ?? point.position}
      className="fc-popup"
      closeButton={false}
      autoPan
      offset={[0, -12]}
      maxWidth={230}
      eventHandlers={handlers}
    >
      <div className="fc-popup-card">
        <div className="fc-popup-header">
          <span>{header}</span>
          <button className="fc-popup-close" onClick={onClose} aria-label="Lukk">✕</button>
        </div>
        {kind === 'combo' ? (
          <>
            <Section kind="wave" point={point} horizon={horizon} scrubT={scrubT} showLabel />
            <Section kind="wind" point={windPoint} horizon={horizon} scrubT={scrubT} unit={unit} showLabel />
          </>
        ) : (
          <Section kind={kind} point={point} horizon={horizon} scrubT={scrubT} unit={unit} />
        )}
        <div className="fc-popup-foot">
          {kind === 'combo' ? 'MET Norway WAM800 + locationforecast' : kind === 'wave' ? 'MET Norway WAM800' : 'MET Norway'}
        </div>
      </div>
    </Popup>
  )
})
