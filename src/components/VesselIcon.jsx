import { divIcon } from 'leaflet'
import { getVesselColor } from '../utils/vesselTypes'

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

// Ghost triangle shown at the playhead (historical) position while scrubbing
export function createPlayheadIcon(trackPoint, vesselColor) {
  const color = vesselColor || '#00b4d8'
  const cog = trackPoint?.cog ?? 0
  const size = 26
  const outer = size + 14

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${outer}" height="${outer}" viewBox="0 0 ${outer} ${outer}">
      <!-- Dashed history ring -->
      <circle
        cx="${outer / 2}" cy="${outer / 2}" r="${outer / 2 - 2}"
        fill="none"
        stroke="${color}"
        stroke-width="1.5"
        stroke-dasharray="4 3"
        opacity="0.7"
      />
      <!-- Ghost triangle pointing in COG direction -->
      <g transform="translate(${outer / 2},${outer / 2}) rotate(${cog})">
        <polygon
          points="0,${-size / 2} ${size / 2.8},${size / 2.8} 0,${size / 4} ${-size / 2.8},${size / 2.8}"
          fill="rgba(255,255,255,0.15)"
          stroke="${color}"
          stroke-width="2"
          stroke-linejoin="round"
        />
      </g>
    </svg>
  `

  return divIcon({
    html: svg,
    className: '',
    iconSize: [outer, outer],
    iconAnchor: [outer / 2, outer / 2],
  })
}

// Tiny "5′ / 10′ / 15′" label dot for the selected vessel's heading vector
export function createMinuteLabel(minutes, color) {
  return divIcon({
    html: `<div class="vector-minute" style="color:${color}">${minutes}′</div>`,
    className: '',
    iconSize: [28, 14],
    iconAnchor: [14, -4],   // hangs just below the projection dot
  })
}

// Triangle size scaled by real vessel length (clamped so nothing gets silly).
// Exported so the canvas renderer (CanvasVesselLayer) draws identical sizes.
export function sizeForVessel(vessel, isSelected) {
  const len = vessel.length
  let size
  if (len == null || len <= 0) size = 16        // unknown
  else if (len < 20)   size = 14                // leisure / small fishing
  else if (len < 50)   size = 17                // small commercial
  else if (len < 100)  size = 20                // ferries, coasters
  else if (len < 200)  size = 24                // cargo, tankers
  else                 size = 28                // giants
  return isSelected ? size + 3 : size
}

// Label position + size are expressed as CSS classes (positioning lives in
// index.css) rather than inline style. This lets the map update a label's
// side/size on zoom by swapping a className on the existing element — no divIcon
// rebuild (setIcon). Rebuilding 2600+ icons per zoom step cost ~137ms.
const LABEL_POS_CLASS  = { top: 'vl-top', bottom: 'vl-bottom', left: 'vl-left', right: 'vl-right' }
const LABEL_SIZE_CLASS = { '0.42rem': 'vl-sm', '0.50rem': 'vl-md', '0.58rem': 'vl-lg' }

export function vesselLabelClass(labelPos = 'top', labelFontSize = '0.58rem') {
  const pos  = LABEL_POS_CLASS[labelPos]  || 'vl-top'
  const size = LABEL_SIZE_CLASS[labelFontSize] || 'vl-lg'
  return `vessel-label ${pos} ${size}`
}

// Round badge with the vessel count inside — used when 4+ stationary
// vessels are lumped together. Grows slightly with the count.
export function createClusterIcon(count) {
  // Mindre footprint enn før — store grupper sluker ikke lenger plass:
  // 4-9 fartøy ≈ 22 px, 10-49 ≈ 25-27 px, 50+ cappet på 32 px.
  const size = Math.round(Math.min(40, 28 + Math.floor(count / 10) * 3) * 0.8)
  const fontSize = count >= 100 ? '0.54rem' : count >= 10 ? '0.62rem' : '0.66rem'
  const html = `
    <div class="cluster-circle" style="width:${size}px;height:${size}px">
      <span class="cluster-count" style="font-size:${fontSize}">${count}</span>
    </div>`
  return divIcon({
    html,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

export function createVesselIcon(vessel, isSelected, { showLabel = false, labelFontSize = '0.58rem', labelPos = 'top', stale = false } = {}) {
  const color = getVesselColor(vessel.type)
  const heading = vessel.hdg ?? vessel.cog ?? 0
  const size = sizeForVessel(vessel, isSelected)
  const outerSize = size + 8

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${outerSize}" height="${outerSize}" viewBox="0 0 ${outerSize} ${outerSize}">
      ${isSelected ? `<circle cx="${outerSize/2}" cy="${outerSize/2}" r="${outerSize/2-1}" fill="${color}33" stroke="${color}" stroke-width="1.5"/>` : ''}
      <g transform="translate(${outerSize/2},${outerSize/2}) rotate(${heading})">
        <polygon
          points="0,${-size/2} ${size/2.8},${size/2.8} 0,${size/4} ${-size/2.8},${size/2.8}"
          fill="${color}"
          stroke="${isSelected ? '#ffffff' : 'rgba(0,0,0,0.35)'}"
          stroke-width="${isSelected ? 1.5 : 0.8}"
        />
      </g>
    </svg>
  `

  // Name label — skip MMSI-fallback names; position and size are caller-controlled
  const name = vessel.name && !vessel.name.startsWith('MMSI ') ? vessel.name : null
  const label = showLabel && name
    ? `<div class="${vesselLabelClass(labelPos, labelFontSize)}">${escapeHtml(name)}</div>`
    : ''

  return divIcon({
    html: `<div class="vessel-wrap${stale ? ' vessel-wrap--stale' : ''}">${svg}${label}</div>`,
    className: '',
    iconSize: [outerSize, outerSize],
    iconAnchor: [outerSize / 2, outerSize / 2],
  })
}
