// Vessel name-label layout: density-driven font size + collision-aware side.
// One pass over a coarse spatial grid instead of comparing every vessel with
// every other (the old O(n²) version froze the app ~100-300 ms per poll in busy
// waters). Returns mmsi → { fontSize, pos }.
//
// Shared by the DOM path (MapView) and the canvas path (CanvasVesselLayer, which
// runs it over the on-screen subset only).
export function buildLabelLayout(vessels, zoom) {
  const r = zoom >= 13 ? 0.02 : zoom >= 12 ? 0.04 : zoom >= 11 ? 0.08 : 0.15
  const grid = new Map()
  for (const v of vessels) {
    const key = Math.floor(v.lat / r) + ':' + Math.floor(v.lon / r)
    let arr = grid.get(key)
    if (!arr) grid.set(key, (arr = []))
    arr.push(v)
  }

  const layout = new Map()
  for (const v of vessels) {
    const ci = Math.floor(v.lat / r), cj = Math.floor(v.lon / r)
    let n = 0, best = Infinity, dx = 0, dy = 0, checked = 0
    outer:
    for (let i = ci - 1; i <= ci + 1; i++) {
      for (let j = cj - 1; j <= cj + 1; j++) {
        const arr = grid.get(i + ':' + j)
        if (!arr) continue
        for (const o of arr) {
          if (o.mmsi === v.mmsi) continue
          const dla = o.lat - v.lat, dlo = o.lon - v.lon
          if (Math.abs(dla) < r && Math.abs(dlo) < r) n++
          const d = dla * dla + dlo * dlo
          if (d < best) { best = d; dx = dlo; dy = dla }
          // Density buckets max out quickly — no need to scan a whole harbour
          if (++checked > 24) break outer
        }
      }
    }
    const fontSize = n >= 7 ? '0.42rem' : n >= 3 ? '0.50rem' : '0.58rem'
    const pos = best === Infinity ? 'top'
      : Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'left' : 'right')
      : (dy > 0 ? 'bottom' : 'top')
    layout.set(v.mmsi, { fontSize, pos })
  }
  return layout
}
