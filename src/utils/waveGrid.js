// Sample-point planning for the forecast layers (wave + wind).
//
// The map viewport is covered by a world-anchored grid. Each cell gets ONE
// display point at its exact center — no jitter, no post-hoc displacement —
// so the pattern reads as an even, calm grid. Cell keys double as cache keys.
//
// Wave AND wind sample the SAME grid: cells with both datasets render as one
// combined badge (see ForecastComboLayer), so values/directions for a cell
// come from the same spot — no spatial mismatch between the two layers.

// 110 px between points at the reference zoom. Open-Meteo's EWAM model is
// ~5 km wide and MET's WAM800 800 m, so each badge carries real signal.
// Above 66°N the active model is coarser (~9 km) → wider grid.
const SPACING_PX_DENSE   = 110
const SPACING_PX_SPARSE  = 150
const DENSE_LAT_MAX      = 66   // EWAM upper bound (approx)
const MAX_CELLS = 140           // brede vinduer beholder tett rutenett

// Web-mercator world-pixel coords at a given zoom (no map instance needed)
export function mercator(lat, lon, zoom) {
  const scale = 256 * Math.pow(2, zoom)
  const x = ((lon + 180) / 360) * scale
  const latRad = (lat * Math.PI) / 180
  const y = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * scale
  return [x, y]
}

export function unmercator(x, y, zoom) {
  const scale = 256 * Math.pow(2, zoom)
  const lon = (x / scale) * 360 - 180
  const n = Math.PI - 2 * Math.PI * (y / scale)
  const lat = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)))
  return [lat, lon]
}

// Viewport bounds + zoom → list of cells at exact grid centers.
export function buildWavePlan(bounds, zoom) {
  const gz = Math.max(3, Math.min(16, Math.round(zoom)))
  const [x1, y1] = mercator(bounds.north, bounds.west, gz)
  const [x2, y2] = mercator(bounds.south, bounds.east, gz)

  // Grow the spacing until the viewport fits in MAX_CELLS cells. The check
  // uses the worst-case count for the pixel SPAN (alignment-independent) —
  // counting the actually covered cells would flip the spacing back and
  // forth while panning near the limit, rotating every cache key.
  const w = Math.abs(x2 - x1), h = Math.abs(y2 - y1)
  const centerLat = (bounds.north + bounds.south) / 2
  let spacing = centerLat < DENSE_LAT_MAX ? SPACING_PX_DENSE : SPACING_PX_SPARSE
  while ((Math.floor(w / spacing) + 2) * (Math.floor(h / spacing) + 2) > MAX_CELLS) {
    spacing *= 1.25
  }
  spacing = Math.round(spacing)

  const xmin = Math.min(x1, x2), xmax = Math.max(x1, x2)
  const ymin = Math.min(y1, y2), ymax = Math.max(y1, y2)
  const i1 = Math.floor(xmin / spacing)
  const i2 = Math.floor(xmax / spacing)
  const j1 = Math.floor(ymin / spacing)
  const j2 = Math.floor(ymax / spacing)

  const cells = []
  for (let i = i1; i <= i2; i++) {
    for (let j = j1; j <= j2; j++) {
      const cx = (i + 0.5) * spacing
      const cy = (j + 0.5) * spacing
      const [lat, lon] = unmercator(cx, cy, gz)
      if (Math.abs(lat) > 80) continue   // outside wave-model coverage
      cells.push({ key: `${gz}/${spacing}/${i}/${j}`, i, j, lat, lon })
    }
  }
  // gz + spacing følger med så kallere kan måle avstander i grid-piksler
  // (f.eks. hvor langt MET snappet et punkt).
  return { cells, gz, spacing }
}

// Significant wave height → badge ring colour when the sea is worth noticing.
// Below 1 m the badge uses the calm layer colour instead (see badgeColors.js).
export function waveColor(h) {
  if (h < 0.5)  return 'transparent'  // calm — no colour ring
  if (h < 1)    return '#2a9d8f'      // green — slight
  if (h < 1.5)  return '#e9c46a'      // yellow — moderate
  if (h < 2)    return '#f4a261'      // orange — rough
  if (h < 3.5)  return '#e63946'      // red — starts at 2 m
  return '#9d4edd'                    // violet — extreme
}
