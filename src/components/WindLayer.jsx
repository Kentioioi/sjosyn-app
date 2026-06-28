import { memo, useMemo, useState, useEffect, useCallback } from 'react'
import { Marker, useMap } from 'react-leaflet'
import { divIcon } from 'leaflet'
import { windColor, formatWind, windUnitLabel } from '../utils/windScale'
import { badgeAnchorY } from '../utils/badgeStack'
import { layerById } from '../utils/layersRegistry'

// Badge fill = the Lag-panel «Vind» font colour (single source: registry); the
// border carries the Beaufort speed ramp so wind strength still reads at a glance.
const WIND_BADGE_BG = layerById('wind').textColor

// Vind-merker — fargekodet vindstyrke + retningspil. Bevisst ULIK bølge-merkene
// (annen palett, fylt pil) så lagene skilles. Egen pane (z 442) over bølge (440),
// under fartøy (600) så et fartøy alltid vinner klikket.
function windIcon(ms, dirTo, unit, slot) {
  const txt = formatWind(ms, unit)
  const style = `background:${WIND_BADGE_BG};color:#0b1018;text-shadow:none;border:2px solid ${windColor(ms)}`
  const arrow = dirTo == null
    ? ''
    : `<span class="wind-dir" style="transform:rotate(${dirTo - 90}deg)">` +
      '<svg viewBox="0 0 10 10" width="8" height="8" aria-hidden="true">' +
      '<path d="M1 5 H7 M4.4 2 L8 5 L4.4 8 Z" fill="currentColor" stroke="currentColor" stroke-width="1.1" stroke-linejoin="round"/>' +
      '</svg></span>'
  const html = `<div class="wind-badge" style="${style}">${txt}<span class="wind-unit">${windUnitLabel(unit)}</span>${arrow}</div>`
  // Anker badgen ~11px UNDER cellepunktet: bølge-laget bruker SAMME rutenett, så
  // uten dette ligger vind-merket oppå bølge-merket. Bølge sitter sentrert,
  // vind rett under → begge lesbare når begge lag er på.
  return divIcon({ html, className: '', iconSize: [40, 17], iconAnchor: [20, badgeAnchorY(17, slot)] })
}

const WindMarker = memo(function WindMarker({ point, horizon, scrubT, unit, slot, onSelect }) {
  let ms, rawDir
  if (scrubT != null && point.series) {
    const idx = Math.round((scrubT - point.series.t0) / 3600)
    const ok = idx >= 0 && idx < point.series.vs.length
    ms = ok ? point.series.vs[idx] : null
    rawDir = ok ? point.series.vd[idx] : null
  } else {
    ms = point.values[horizon]
    rawDir = point.dirs?.[horizon]
  }
  // Pila peker dit vinden BLÅSER (meteorologisk fra + 180°).
  const dirTo = rawDir == null ? null : Math.round(((rawDir + 180) % 360) / 10) * 10
  const icon = useMemo(() => (ms == null ? null : windIcon(ms, dirTo, unit, slot)), [ms, dirTo, unit, slot])
  const handlers = useMemo(() => ({ click: () => onSelect(point) }), [onSelect, point])
  if (!icon) return null
  return (
    <Marker position={point.position} icon={icon} pane="windPane" eventHandlers={handlers} />
  )
})

export default memo(function WindLayer({ points, horizon, scrubT, unit = 'ms', slot = 0, onSelectPoint }) {
  const map = useMap()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!map.getPane('windPane')) {
      const pane = map.createPane('windPane')
      pane.style.zIndex = 442          // over wavePane (440), under vessels (600)
    }
    setReady(true)
  }, [map])

  const onSelect = useCallback(p => onSelectPoint?.(p), [onSelectPoint])

  if (!ready) return null
  return points.map(p => (
    <WindMarker key={p.key} point={p} horizon={horizon} scrubT={scrubT} unit={unit} slot={slot} onSelect={onSelect} />
  ))
})
