// Sample-point planning for the wave-forecast layer.
//
// The map viewport is covered by a world-anchored grid (~110 px between points
// at the current zoom). Each cell gets one display point, jittered by a
// deterministic hash of the cell index so the scatter looks organic but never
// jumps around between renders or pans — and cell keys double as cache keys.
//
// At wide zooms a cell covers a big patch of sea, so we sample 3 sub-points
// per cell and combine them with a "trimmed max": the highest value wins
// unless it towers over the second-highest (likely a bad coastal model cell),
// in which case the second-highest is used. Peaks survive; flukes don't.

// 85 px is ~45 % more cells per viewport vs. the old 102 px (linear density
// scales the count quadratically). Open-Meteo's DWD EWAM model is ~5 km wide;
// at zoom 10 Norway, 85 px ≈ 6.8 km between samples — still above model
// resolution, so each badge carries real signal rather than duplicating a
// neighbour. Above 66°N the active model is coarser (~9 km), so the grid
// backs off to keep us from asking for points that snap to the same cell.
const SPACING_PX_DENSE   = 85
const SPACING_PX_SPARSE  = 130
const DENSE_LAT_MAX      = 66   // EWAM upper bound (approx)
const MAX_CELLS = 90   // headroom for the denser grid; URL stays well under 8 KB

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

// Deterministic [0,1) from integer cell coords — stable jitter across renders
function hash01(ix, iy, salt) {
  let h = Math.imul(ix, 374761393) + Math.imul(iy, 668265263) + Math.imul(salt + 1, 2654435761)
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  h ^= h >>> 16
  return (h >>> 0) / 4294967296
}

// Viewport bounds + zoom → list of cells with their sample coordinates.
// samples[0] is the jittered primary sample; extra entries are the sub-samples
// used for the trimmed-max aggregation at wide zooms. Note: badges are NOT
// drawn at these points — the displayed position is the wave model's own
// sea-cell coordinate returned by the API (so badges always sit on water).
export function buildWavePlan(bounds, zoom, opts = {}) {
  const gz = Math.max(3, Math.min(14, Math.round(zoom)))
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
    spacing *= 1.5
  }
  const i1 = Math.floor(Math.min(x1, x2) / spacing)
  const i2 = Math.floor(Math.max(x1, x2) / spacing)
  const j1 = Math.floor(Math.min(y1, y2) / spacing)
  const j2 = Math.floor(Math.max(y1, y2) / spacing)

  // Default: wide zoom adds 3 sub-samples per cell (Open-Meteo workaround for
  // coarse EWAM cells). MET's WAM is finer — caller passes {multi:false}.
  const multi = opts.multi ?? (gz < 9)
  const cells = []
  for (let i = i1; i <= i2; i++) {
    for (let j = j1; j <= j2; j++) {
      const jx = (hash01(i, j, 1) - 0.5) * 0.55   // ±27.5 % of spacing
      const jy = (hash01(i, j, 2) - 0.5) * 0.55
      const cx = (i + 0.5 + jx) * spacing
      const cy = (j + 0.5 + jy) * spacing
      const [lat, lon] = unmercator(cx, cy, gz)
      if (Math.abs(lat) > 80) continue   // outside wave-model coverage

      const samples = [{ lat, lon }]
      if (multi) {
        const r = spacing * 0.38
        const a0 = hash01(i, j, 3) * Math.PI * 2
        for (const da of [0, 2.1]) {
          const [la, lo] = unmercator(cx + Math.cos(a0 + da) * r, cy + Math.sin(a0 + da) * r, gz)
          samples.push({ lat: la, lon: lo })
        }
      }
      cells.push({ key: `${gz}/${Math.round(spacing)}/${i}/${j}`, lat, lon, samples })
    }
  }
  return { cells }
}

// Trimmed max over a cell's sub-sample values: keep real peaks, drop lone
// flukes that tower over their neighbours. The trim only applies when the
// runner-up is itself a meaningful sea state (≥ 0.5 m) — otherwise a calm
// sheltered-fjord sample could veto a genuine offshore peak, and for a
// mariner the safe direction is to over-report, never under-report.
export function resolveCellValue(vals) {
  const v = vals.filter(Number.isFinite).sort((a, b) => b - a)
  if (!v.length) return null
  if (v.length >= 2 && v[1] >= 0.5 && v[0] > v[1] * 1.5 && v[0] - v[1] > 0.5) return v[1]
  return v[0]
}

// Significant wave height → the badge's BORDER colour (the "ring" around the
// sticker). Calm seas get a transparent ring (no colour) so only meaningful
// sea states stand out; the ramp reaches red at 2 m and violet for extreme.
export function waveColor(h) {
  if (h < 0.5)  return 'transparent'  // calm — no colour ring
  if (h < 1)    return '#2a9d8f'      // green — slight
  if (h < 1.5)  return '#e9c46a'      // yellow — moderate
  if (h < 2)    return '#f4a261'      // orange — rough
  if (h < 3.5)  return '#e63946'      // red — starts at 2 m
  return '#9d4edd'                    // violet — extreme
}

// Text colour paired with waveColor — the teal/yellow/orange buckets are too
// bright for white text (WCAG ~1.7–3.3:1), so they get dark glyphs instead,
// same convention as .icon-btn.active.
export function waveTextColor(h) {
  return h >= 0.5 && h < 4 ? '#0a1622' : '#fff'
}
