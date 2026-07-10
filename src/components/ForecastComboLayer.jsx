import { memo, useMemo, useState, useEffect, useCallback } from 'react'
import { Marker, useMap } from 'react-leaflet'
import { divIcon } from 'leaflet'
import { formatWind, windUnitLabel } from '../utils/windScale'
import { waveBadgeStyle, windBadgeStyle } from '../utils/badgeColors'

// Kombinert bølge+vind-merke — vises når BEGGE lag har data for samme celle
// (samme rutenett → verdiene gjelder samme punkt). Venstre halvring blå med
// bølgeverdi, høyre halvring grønn med vindverdi. Pilene beholder hvert lags
// farge/form og peker i egne retninger; er retningene nesten like (< 35°)
// forskyves de sideveis så de står side om side i stedet for å overlappe.
//
// Canvas 72×72 (plass til to pil-bånd), sirkel r 16 i senter — større enn
// enkelt-merkene (r 13.2) fordi to verdier deler plassen. Hitboks 34×34.

const CX = 36, RIM = 20   // senter + ring-topp (36 − 16)

function comboIcon(h, waveDir, ms, windDir, unit, dark) {
  const wv = waveBadgeStyle(h ?? 0, dark)
  const wn = windBadgeStyle(ms ?? 0, dark)
  const waveTxt = h == null ? '–' : (h >= 10 ? Math.round(h) : h.toFixed(1))
  const windTxt = ms == null ? '–' : formatWind(ms, unit)

  // Begge piler starter på ringen og peker sin egen retning. Vindpila er LANG
  // (skaftet går fra ringen helt ut forbi bølgebåndet), bølgepila kort og
  // tegnet SIST med halo → bølge er dominant og dekkes aldri av vind. Ved lik
  // retning ligger vindskaftet bak bølgepila, og vindhodet stikker tydelig ut
  // forbi bølgetuppen — begge leses.
  const waveArrow = waveDir == null
    ? ''
    : `<g transform="rotate(${waveDir} ${CX} ${CX})">` +
      `<path d="M36 19.5 V13 M33 16 L36 12 L39 16" stroke="${wv.halo}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<path d="M36 19.5 V13 M33 16 L36 12 L39 16" stroke="${wv.ring}" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` +
      `</g>`
  const windArrow = windDir == null
    ? ''
    : `<g transform="rotate(${windDir} ${CX} ${CX})">` +
      `<path d="M36 19.8 V5 M32.8 8 L36 3 L39.2 8 Z" stroke="${wn.halo}" stroke-width="3.4" fill="${wn.halo}" stroke-linejoin="round"/>` +
      `<path d="M36 19.8 V5 M32.8 8 L36 3 L39.2 8 Z" fill="${wn.ring}" stroke="${wn.ring}" stroke-width="1.3" stroke-linejoin="round"/>` +
      `</g>`

  const html =
    `<svg class="fc-badge fc-badge--combo" width="72" height="72" viewBox="0 0 72 72" aria-hidden="true">` +
    windArrow + waveArrow +
    `<path d="M36 ${RIM} A16 16 0 0 0 36 ${72 - RIM}" fill="none" stroke="${wv.ring}" stroke-width="2.2"/>` +
    `<path d="M36 ${RIM} A16 16 0 0 1 36 ${72 - RIM}" fill="none" stroke="${wn.ring}" stroke-width="2.2"/>` +
    `<line x1="36" y1="22" x2="36" y2="50" stroke="${wv.halo}" stroke-width="1" opacity="0.55"/>` +
    `<text x="28.5" y="35.5" text-anchor="middle" class="fc-combo-val" fill="${wv.text}" stroke="${wv.halo}">${waveTxt}</text>` +
    `<text x="28.5" y="42.5" text-anchor="middle" class="fc-combo-unit" fill="${wv.text}" stroke="${wv.halo}">m</text>` +
    `<text x="43.5" y="35.5" text-anchor="middle" class="fc-combo-val" fill="${wn.text}" stroke="${wn.halo}">${windTxt}</text>` +
    `<text x="43.5" y="42.5" text-anchor="middle" class="fc-combo-unit" fill="${wn.text}" stroke="${wn.halo}">${windUnitLabel(unit)}</text>` +
    `</svg>`
  return divIcon({ html, className: 'fc-badge-wrap', iconSize: [34, 34], iconAnchor: [17, 17] })
}

// Verdi + retning for et punkt ved gjeldende horisont/scrub (samme logikk som
// enkeltlagenes markører).
function valueAt(point, valsKey, horizon, scrubT) {
  if (scrubT != null && point.series) {
    const idx = Math.round((scrubT - point.series.t0) / 3600)
    const ok = idx >= 0 && idx < point.series[valsKey].length
    return [ok ? point.series[valsKey][idx] : null, ok ? point.series.vd[idx] : null]
  }
  return [point.values[horizon], point.dirs?.[horizon]]
}

const ComboMarker = memo(function ComboMarker({ pair, horizon, scrubT, unit, dark, onSelect }) {
  const [h, waveRaw] = valueAt(pair.wave, 'vh', horizon, scrubT)
  const [ms, windRaw] = valueAt(pair.wind, 'vs', horizon, scrubT)
  // Begge piler peker dit bølgene går / vinden blåser (fra + 180°), 10°-rundet
  const waveDir = waveRaw == null ? null : Math.round(((waveRaw + 180) % 360) / 10) * 10
  const windDir = windRaw == null ? null : Math.round(((windRaw + 180) % 360) / 10) * 10
  const icon = useMemo(
    () => (h == null && ms == null ? null : comboIcon(h, waveDir, ms, windDir, unit, dark)),
    [h, waveDir, ms, windDir, unit, dark],
  )
  const handlers = useMemo(() => ({ click: () => onSelect(pair) }), [onSelect, pair])
  if (!icon) return null
  return (
    <Marker position={pair.position} icon={icon} pane="comboPane" eventHandlers={handlers} />
  )
})

export default memo(function ForecastComboLayer({ pairs, horizon, scrubT, unit = 'ms', dark = false, onSelectPair }) {
  const map = useMap()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!map.getPane('comboPane')) {
      const pane = map.createPane('comboPane')
      pane.style.zIndex = 443          // over vind (442), under fartøy (600)
    }
    setReady(true)
  }, [map])

  const onSelect = useCallback(p => onSelectPair?.(p), [onSelectPair])

  if (!ready) return null
  return pairs.map(p => (
    <ComboMarker key={p.key} pair={p} horizon={horizon} scrubT={scrubT} unit={unit} dark={dark} onSelect={onSelect} />
  ))
})
