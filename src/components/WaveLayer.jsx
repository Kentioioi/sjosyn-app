import { memo, useMemo, useState, useEffect, useCallback } from 'react'
import { Marker, useMap } from 'react-leaflet'
import { divIcon } from 'leaflet'
import { waveColor } from '../utils/waveGrid'
import { badgeAnchorY } from '../utils/badgeStack'
import { layerById } from '../utils/layersRegistry'

// Badge fill = the Lag-panel «Bølge» font colour (single source: registry);
// the border carries the wave-height colour ramp so strength still reads at a glance.
const WAVE_BADGE_BG = layerById('wave').textColor

// Colour-coded badges with the forecast significant wave height. Rendered in
// their own pane below the vessel markers — vessels sit at z-index 600 so a
// vessel marker on top of a wave badge still wins the click. Wave-only spots
// open the WavePointPopup.
function waveIcon(h, dir, slot) {
  const txt = h >= 10 ? Math.round(h) : h.toFixed(1)
  const style = `background:${WAVE_BADGE_BG};color:#0b1018;text-shadow:none;border:2px solid ${waveColor(h)}`
  const arrow = dir == null
    ? ''
    : `<span class="wave-dir" style="transform:rotate(${dir - 90}deg)">` +
      '<svg viewBox="0 0 10 10" width="7" height="7" aria-hidden="true">' +
      '<path d="M1 5 H7.6 M5 2.4 L7.8 5 L5 7.6" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg></span>'
  const html = `<div class="wave-badge" style="${style}">${txt}<span class="wave-unit">m</span>${arrow}</div>`
  // Hitbox = iconSize. Krympet sammen med den visuelle badgen så tap-arealet
  // ikke blir større enn pillen.
  return divIcon({ html, className: '', iconSize: [32, 17], iconAnchor: [16, badgeAnchorY(17, slot)] })
}

const WaveMarker = memo(function WaveMarker({ point, horizon, scrubT, slot, onSelect }) {
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
  const dir = rawDir == null ? null : Math.round(((rawDir + 180) % 360) / 10) * 10
  const icon = useMemo(() => (h == null ? null : waveIcon(h, dir, slot)), [h, dir, slot])
  const handlers = useMemo(() => ({ click: () => onSelect(point) }), [onSelect, point])
  if (!icon) return null
  return (
    <Marker
      position={point.position}
      icon={icon}
      pane="wavePane"
      eventHandlers={handlers}
    />
  )
})

export default memo(function WaveLayer({ points, horizon, scrubT, slot = 0, onSelectPoint }) {
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
    <WaveMarker key={p.key} point={p} horizon={horizon} scrubT={scrubT} slot={slot} onSelect={onSelect} />
  ))
})
