import { memo, useMemo, useState, useEffect, useCallback } from 'react'
import { Marker, useMap } from 'react-leaflet'
import { divIcon } from 'leaflet'
import { waveBadgeStyle } from '../utils/badgeColors'

// Minimalistiske sirkelmerker: åpen ring + verdi, retningspil ut fra kanten.
// Ingen fylling — kartet synes gjennom. Egen pane under fartøyene (z 440 < 600)
// så et fartøy alltid vinner klikket.
function waveIcon(h, dir, dark) {
  const { ring, text, halo } = waveBadgeStyle(h, dark)
  const txt = h >= 10 ? Math.round(h) : h.toFixed(1)
  const arrow = dir == null
    ? ''
    : `<g transform="rotate(${dir} 24 24)">` +
      `<path d="M24 9.3 V3 M21 6 L24 2 L27 6" stroke="${ring}" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` +
      `</g>`
  const html =
    `<svg class="fc-badge" width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">` +
    arrow +
    `<circle cx="24" cy="24" r="13.2" fill="none" stroke="${ring}" stroke-width="2.2"/>` +
    `<text x="24" y="25.5" text-anchor="middle" class="fc-badge-val" fill="${text}" stroke="${halo}">${txt}</text>` +
    `<text x="24" y="33" text-anchor="middle" class="fc-badge-unit" fill="${text}" stroke="${halo}">m</text>` +
    `</svg>`
  // Hitboks = 30×30 rundt selve sirkelen — IKKE hele 48×48-SVG-en. Den store
  // boksen stjal fartøy-tap i canvas-renderstien (usynlige hjørner over båter).
  // SVG-en sentreres med negativ margin i CSS og er pointer-events:none.
  return divIcon({ html, className: 'fc-badge-wrap', iconSize: [30, 30], iconAnchor: [15, 15] })
}

const WaveMarker = memo(function WaveMarker({ point, horizon, scrubT, dark, onSelect }) {
  let h, rawDir
  if (scrubT != null && point.series) {
    const idx = Math.round((scrubT - point.series.t0) / 3600)
    const ok = idx >= 0 && idx < point.series.vh.length
    h = ok ? point.series.vh[idx] : null
    rawDir = ok ? point.series.vd[idx] : null
  } else {
    h = point.values[horizon]
    rawDir = point.dirs?.[horizon]
  }
  // Pila peker dit bølgene GÅR (meteorologisk fra + 180°), avrundet til 10°
  // så ikonet ikke regenereres for hver minste retningsendring.
  const dir = rawDir == null ? null : Math.round(((rawDir + 180) % 360) / 10) * 10
  const icon = useMemo(() => (h == null ? null : waveIcon(h, dir, dark)), [h, dir, dark])
  const handlers = useMemo(() => ({ click: () => onSelect(point) }), [onSelect, point])
  if (!icon) return null
  return (
    <Marker position={point.position} icon={icon} pane="wavePane" eventHandlers={handlers} />
  )
})

export default memo(function WaveLayer({ points, horizon, scrubT, dark = false, onSelectPoint }) {
  const map = useMap()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!map.getPane('wavePane')) {
      const pane = map.createPane('wavePane')
      pane.style.zIndex = 440          // over polylines (400), under vessels (600)
    }
    setReady(true)
  }, [map])

  // Stable default if parent doesn't pass a handler
  const onSelect = useCallback(p => onSelectPoint?.(p), [onSelectPoint])

  if (!ready) return null
  return points.map(p => (
    <WaveMarker key={p.key} point={p} horizon={horizon} scrubT={scrubT} dark={dark} onSelect={onSelect} />
  ))
})
