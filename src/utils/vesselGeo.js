// Shared dead-reckoning math for vessel rendering.
//
// This MIRRORS the per-vessel motion logic in MapView.jsx's MotionTicker so the
// canvas renderer (CanvasVesselLayer) dead-reckons identically to the DOM path.
// MotionTicker is intentionally left untouched for now (proven path); once the
// canvas layer is accepted, MotionTicker should be refactored to call stepVessel
// here so the math lives in exactly one place. Keep the two in sync until then.

export const TICK_MS = 100              // ~10 fps — sub-pixel smooth at all zooms
export const MAX_PROJECT_MS = 60_000    // never project a report older than this
export const STALE_MS = 15 * 60_000     // past this: no DR, faded marker
export const DEAD_MS  = 90 * 60_000     // past this: drop from live map (App filters)
const EASE_TAU = 900                    // ms to absorb ~63% of a correction
const KN_TO_MS = 0.514444               // knots → m/s
const M_PER_DEG = 111_320               // metres per degree latitude
const ALONG_MIN = -0.4                  // along-track correction clamp (×step)
const ALONG_MAX = 1.2

// Haversine forward projection: move distM metres from lat/lon along brngDeg.
export function projectMeters(lat, lon, brngDeg, distM) {
  const R = 6371000
  const brng = (brngDeg * Math.PI) / 180
  const lat1 = (lat * Math.PI) / 180
  const lon1 = (lon * Math.PI) / 180
  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(distM / R) +
    Math.cos(lat1) * Math.sin(distM / R) * Math.cos(brng)
  )
  const lon2 = lon1 + Math.atan2(
    Math.sin(brng) * Math.sin(distM / R) * Math.cos(lat1),
    Math.cos(distM / R) - Math.sin(lat1) * Math.sin(lat2)
  )
  return [(lat2 * 180) / Math.PI, (lon2 * 180) / Math.PI]
}

// Where will the vessel be in N minutes if course and speed hold?
export function projectPoint(lat, lon, cogDeg, sogKn, minutes) {
  return projectMeters(lat, lon, cogDeg, sogKn * 1852 * (minutes / 60))
}

// exp-decay easing factor for a frame of dt ms.
export function easeAlpha(dt) {
  return 1 - Math.exp(-dt / EASE_TAU)
}

// One dead-reckoning step for a single vessel entry. Pure: returns the new
// rendered [lat, lon]; the caller decides what to do with it (DOM setLatLng or
// canvas draw). `entry` = { vessel, rendered, msgMs }.
//
// ctx = { project, alpha, dtEff, nowMs, freezeBeforeMs }
//   project        — whether zoom is high enough that motion is >sub-pixel
//   alpha          — easeAlpha(dt)
//   dtEff          — min(dt, 1500): caps lurch after background throttling
//   nowMs          — Date.now() for this tick
//   freezeBeforeMs — entries with msgMs older than this are frozen (post-resume)
export function stepVessel(entry, { project, alpha, dtEff, nowMs, freezeBeforeMs }) {
  const { vessel } = entry
  const sog = vessel.sog ?? 0
  let pos = entry.rendered
  const age = nowMs - entry.msgMs
  const stale = age > STALE_MS
  const preResume = entry.msgMs < freezeBeforeMs

  if (project && sog >= 0.5 && !stale && !preResume) {
    // Target = reported position projected to *now* along cog/sog.
    const projAge = Math.min(Math.max(age, 0), MAX_PROJECT_MS)
    const target = projectMeters(
      vessel.lat, vessel.lon, vessel.cog ?? 0, sog * KN_TO_MS * (projAge / 1000))

    if (!pos || Math.abs(target[0] - pos[0]) + Math.abs(target[1] - pos[1]) > 0.05) {
      pos = target   // first frame or a real jump → snap
    } else {
      // 1) Always sail forward at the vessel's own speed …
      const stepM = sog * KN_TO_MS * (dtEff / 1000)
      const rad = ((vessel.cog ?? 0) * Math.PI) / 180
      const ux = Math.sin(rad), uy = Math.cos(rad)   // course unit (E, N)
      const mLon = M_PER_DEG * Math.cos((pos[0] * Math.PI) / 180)

      // 2) … and steer toward the target with the along-track part of the
      // correction clamped, so staleness jitter modulates speed instead of
      // freezing or reversing the marker.
      const errE = (target[1] - pos[1]) * mLon
      const errN = (target[0] - pos[0]) * M_PER_DEG
      const alongErr = errE * ux + errN * uy
      const crossE = errE - alongErr * ux
      const crossN = errN - alongErr * uy
      const along = Math.max(ALONG_MIN * stepM, Math.min(ALONG_MAX * stepM, alongErr * alpha))

      const moveE = (stepM + along) * ux + crossE * alpha
      const moveN = (stepM + along) * uy + crossN * alpha
      pos = [pos[0] + moveN / M_PER_DEG, pos[1] + moveE / mLon]
    }
  } else {
    // Stationary (or zoomed far out): ease to the reported position.
    const target = [vessel.lat, vessel.lon]
    if (!pos || Math.abs(target[0] - pos[0]) + Math.abs(target[1] - pos[1]) > 0.05) {
      pos = target
    } else {
      pos = [
        pos[0] + (target[0] - pos[0]) * alpha,
        pos[1] + (target[1] - pos[1]) * alpha,
      ]
    }
  }
  return pos
}
