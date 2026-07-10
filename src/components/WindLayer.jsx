import { memo, useMemo, useState, useEffect, useCallback } from 'react'
import { Marker, useMap } from 'react-leaflet'
import { divIcon } from 'leaflet'
import { formatWind, windUnitLabel } from '../utils/windScale'
import { windBadgeStyle } from '../utils/badgeColors'

// Vind-sirkler — samme form som bølge, men FYLT pil (bevisst ulik strek-pila
// på bølge) og grønn basefarge. Egen pane (z 442) over bølge (440), under
// fartøy (600) så et fartøy alltid vinner klikket.
function windIcon(ms, dirTo, unit, dark) {
  const { ring, text, halo } = windBadgeStyle(ms, dark)
  const txt = formatWind(ms, unit)
  const arrow = dirTo == null
    ? ''
    : `<g transform="rotate(${dirTo} 24 24)">` +
      `<path d="M24 9.8 V4.3 M20.8 7.3 L24 2.3 L27.2 7.3 Z" fill="${ring}" stroke="${ring}" stroke-width="1.3" stroke-linejoin="round"/>` +
      `</g>`
  const html =
    `<svg class="fc-badge" width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">` +
    arrow +
    `<circle cx="24" cy="24" r="13.2" fill="none" stroke="${ring}" stroke-width="2.2"/>` +
    `<text x="24" y="25.5" text-anchor="middle" class="fc-badge-val" fill="${text}" stroke="${halo}">${txt}</text>` +
    `<text x="24" y="33" text-anchor="middle" class="fc-badge-unit" fill="${text}" stroke="${halo}">${windUnitLabel(unit)}</text>` +
    `</svg>`
  // Hitboks = 30×30 rundt sirkelen (se WaveLayer — hindrer tap-tyveri fra båter)
  return divIcon({ html, className: 'fc-badge-wrap', iconSize: [30, 30], iconAnchor: [15, 15] })
}

const WindMarker = memo(function WindMarker({ point, horizon, scrubT, unit, dark, onSelect }) {
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
  const icon = useMemo(() => (ms == null ? null : windIcon(ms, dirTo, unit, dark)), [ms, dirTo, unit, dark])
  const handlers = useMemo(() => ({ click: () => onSelect(point) }), [onSelect, point])
  if (!icon) return null
  return (
    <Marker position={point.position} icon={icon} pane="windPane" eventHandlers={handlers} />
  )
})

export default memo(function WindLayer({ points, horizon, scrubT, unit = 'ms', dark = false, onSelectPoint }) {
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
    <WindMarker key={p.key} point={p} horizon={horizon} scrubT={scrubT} unit={unit} dark={dark} onSelect={onSelect} />
  ))
})
