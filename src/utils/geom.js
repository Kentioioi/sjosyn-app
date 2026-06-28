// Geometri-hjelpere for tripwire/krysningsdeteksjon.
// 2D segment-segment intersect via cross-product. Bruker lat/lon som rene
// kartesiske koordinater — for kort-distansier (en linje på kartet) er feilen
// vesentlig mindre enn AIS-posisjonsoppløsningen, så projeksjon er unødvendig.

function cross(ax, ay, bx, by) {
  return ax * by - ay * bx
}

// Returnerer true hvis segmentet p1→p2 krysser q1→q2.
// p, q = [lat, lon]. Endepunkts-berøring teller som krysning.
export function segmentsIntersect(p1, p2, q1, q2) {
  const r = [p2[0] - p1[0], p2[1] - p1[1]]
  const s = [q2[0] - q1[0], q2[1] - q1[1]]
  const denom = cross(r[0], r[1], s[0], s[1])
  if (denom === 0) return false   // parallelle eller kollineære
  const qp = [q1[0] - p1[0], q1[1] - p1[1]]
  const t = cross(qp[0], qp[1], s[0], s[1]) / denom
  const u = cross(qp[0], qp[1], r[0], r[1]) / denom
  return t >= 0 && t <= 1 && u >= 0 && u <= 1
}

// ── Korridor-/rute-geometri (meter) ────────────────────────────
// Equirektangulær lokal projeksjon: god nok på korridor-skala (feilen er
// langt under AIS-oppløsningen). p/a/b/path-punkter er [lat, lon].
const R_EARTH = 6371000
const D2R = Math.PI / 180

function toXY(lat, lon, latRef) {
  return [lon * D2R * R_EARTH * Math.cos(latRef * D2R), lat * D2R * R_EARTH]
}

export function pointToSegmentMeters(p, a, b) {
  const latRef = p[0]
  const P = toXY(p[0], p[1], latRef)
  const A = toXY(a[0], a[1], latRef)
  const B = toXY(b[0], b[1], latRef)
  const dx = B[0] - A[0], dy = B[1] - A[1]
  const len2 = dx * dx + dy * dy
  let t = len2 === 0 ? 0 : ((P[0] - A[0]) * dx + (P[1] - A[1]) * dy) / len2
  t = Math.max(0, Math.min(1, t))
  const cx = A[0] + t * dx, cy = A[1] + t * dy
  return Math.hypot(P[0] - cx, P[1] - cy)
}

// Avstand i meter mellom to [lat,lon]-punkter (lokal equirektangulær — god
// nok på vakt-skala, feilen er under AIS-oppløsningen).
export function distanceMeters(a, b) {
  const latRef = a[0]
  const A = toXY(a[0], a[1], latRef)
  const B = toXY(b[0], b[1], latRef)
  return Math.hypot(B[0] - A[0], B[1] - A[1])
}

// Minste avstand (m) fra punkt p til en polyline (rute med ≥1 punkt).
export function distanceToPathMeters(p, path) {
  if (!path || !path.length) return Infinity
  if (path.length === 1) return pointToSegmentMeters(p, path[0], path[0])
  let min = Infinity
  for (let i = 0; i < path.length - 1; i++) {
    const d = pointToSegmentMeters(p, path[i], path[i + 1])
    if (d < min) min = d
  }
  return min
}

// Er punktet innenfor korridoren (halve bredden på hver side av ruta)?
export function insideCorridor(p, path, widthM) {
  if (!path || path.length < 1 || !(widthM > 0)) return false
  return distanceToPathMeters(p, path) <= widthM / 2
}

// Beregner venstre/høyre kant-polyline for å tegne korridoren. Per-vertex
// normal = snitt av tilstøtende segmenters normaler (enkel miter).
export function corridorEdges(path, widthM) {
  if (!path || path.length < 2 || !(widthM > 0)) return null
  const latRef = path[Math.floor(path.length / 2)][0]
  const xy = path.map(p => toXY(p[0], p[1], latRef))
  const h = widthM / 2
  const fromXY = (x, y) => [y / (D2R * R_EARTH), x / (D2R * R_EARTH * Math.cos(latRef * D2R))]
  const left = [], right = []
  for (let i = 0; i < xy.length; i++) {
    const prev = xy[i - 1], cur = xy[i], next = xy[i + 1]
    let nx = 0, ny = 0
    if (prev) { const dx = cur[0] - prev[0], dy = cur[1] - prev[1], L = Math.hypot(dx, dy) || 1; nx += -dy / L; ny += dx / L }
    if (next) { const dx = next[0] - cur[0], dy = next[1] - cur[1], L = Math.hypot(dx, dy) || 1; nx += -dy / L; ny += dx / L }
    const L = Math.hypot(nx, ny) || 1
    nx /= L; ny /= L
    left.push(fromXY(cur[0] + nx * h, cur[1] + ny * h))
    right.push(fromXY(cur[0] - nx * h, cur[1] - ny * h))
  }
  return { left, right }
}
