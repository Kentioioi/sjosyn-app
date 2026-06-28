// Tynn ut varsel-punkter (bølge/vind) etter minste tillatte avstand i
// mercator-piksler ved gjeldende zoom. Grådig: går gjennom punktene og beholder
// et punkt bare hvis ingen alllerede-beholdt punkt er nærmere enn minPx. Effekten
// er at TETTE områder tynnes først (klynger kollapser til ett-per-minPx), mens
// spredte punkter alltid beholdes. minPx <= 0 → behold alt.

function mercatorPx(lat, lon, zoom) {
  const scale = 256 * Math.pow(2, zoom)
  const x = ((lon + 180) / 360) * scale
  const latRad = (lat * Math.PI) / 180
  const y = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * scale
  return [x, y]
}

function unmercatorPx(x, y, zoom) {
  const scale = 256 * Math.pow(2, zoom)
  const lon = (x / scale) * 360 - 180
  const n = Math.PI - 2 * Math.PI * (y / scale)
  const lat = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)))
  return [lat, lon]
}

// Nudge badges apart so their boxes don't overlap, each kept as close as possible
// to its intended position. Works ACROSS layers (wave + wind) so a wave badge and
// a wind badge from different cells don't stack either. Collision runs on each
// badge's RENDERED screen centre (cell px + the layer's vertical slot offset
// `dy`), then the nudge is written back to the point's lat/lon (minus dy, since
// the slot offset is re-applied at render via the marker anchor).
//
// sets: [{ points, w, h, dy }] — badge px size + slot offset per layer.
// Returns one displaced points array per set, in the same order. Greedy: earlier
// items hold their spot; later ones push out along the smaller penetration axis,
// total displacement capped so nothing drifts far off its sea cell.
export function deOverlapLayers(sets, zoom, gap = 2) {
  if (zoom == null) return sets.map(s => s.points || [])
  const maxMove = 40
  const items = []
  sets.forEach((s, si) => (s.points || []).forEach((p, pi) => {
    const [x, y] = mercatorPx(p.position[0], p.position[1], zoom)
    const ry0 = y + (s.dy || 0)
    items.push({ si, pi, w: s.w, h: s.h, dy: s.dy || 0, x0: x, ry0, x, ry: ry0 })
  }))
  const placed = []
  for (const it of items) {
    let x = it.x0, ry = it.ry0
    for (let iter = 0; iter < 12; iter++) {
      let moved = false
      for (const q of placed) {
        const padX = (it.w + q.w) / 2 + gap
        const padY = (it.h + q.h) / 2 + gap
        const dx = x - q.x, dy = ry - q.ry
        const ox = padX - Math.abs(dx), oy = padY - Math.abs(dy)
        if (ox > 0 && oy > 0) {
          if (ox <= oy) x += dx >= 0 ? ox : -ox      // exact overlap → push +x
          else ry += dy >= 0 ? oy : -oy
          moved = true
        }
      }
      if (!moved) break
      const ddx = x - it.x0, ddy = ry - it.ry0, d = Math.hypot(ddx, ddy)
      if (d > maxMove) { x = it.x0 + (ddx / d) * maxMove; ry = it.ry0 + (ddy / d) * maxMove; break }
    }
    it.x = x; it.ry = ry
    placed.push({ x, ry, w: it.w, h: it.h })
  }
  const out = sets.map(s => (s.points || []).slice())
  for (const it of items) {
    if (it.x === it.x0 && it.ry === it.ry0) continue
    const pt = sets[it.si].points[it.pi]
    out[it.si][it.pi] = { ...pt, position: unmercatorPx(it.x, it.ry - it.dy, zoom) }
  }
  return out
}

export function thinBySpacing(points, minPx, zoom) {
  if (!minPx || minPx <= 0 || zoom == null || points.length < 2) return points
  const min2 = minPx * minPx
  const cell = minPx
  const grid = new Map()   // "i:j" → [[x,y], …] av beholdte punkter
  const kept = []
  for (const p of points) {
    const [x, y] = mercatorPx(p.position[0], p.position[1], zoom)
    const gi = Math.floor(x / cell)
    const gj = Math.floor(y / cell)
    let tooClose = false
    for (let i = gi - 1; i <= gi + 1 && !tooClose; i++) {
      for (let j = gj - 1; j <= gj + 1 && !tooClose; j++) {
        const arr = grid.get(i + ':' + j)
        if (!arr) continue
        for (const [kx, ky] of arr) {
          const dx = kx - x, dy = ky - y
          if (dx * dx + dy * dy < min2) { tooClose = true; break }
        }
      }
    }
    if (tooClose) continue
    kept.push(p)
    const key = gi + ':' + gj
    let arr = grid.get(key)
    if (!arr) grid.set(key, (arr = []))
    arr.push([x, y])
  }
  return kept
}
