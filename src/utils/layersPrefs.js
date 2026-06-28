// Per-layer map state. Each layer has two flags:
//   enrolled — listed in the Kartlag panel (curated in Settings → Værdata)
//   active   — its badges are drawn on the map right now (panel switch)
// Invariant: an un-enrolled layer is never active.

export const LAYER_IDS = ['wave', 'wind']

export function defaultLayers() {
  return {
    wave: { enrolled: false, active: false },
    wind: { enrolled: false, active: false },
  }
}

// Map legacy flat flags (waveLayer/windLayer) onto the per-layer shape.
// Idempotent: if prefs already has `layers`, merge it over defaults so newly
// added layer ids get sane defaults without losing saved state.
export function migrateLayerPrefs(prefs = {}) {
  const out = defaultLayers()
  if (prefs.layers && typeof prefs.layers === 'object') {
    for (const id of LAYER_IDS) {
      if (prefs.layers[id]) out[id] = { ...out[id], ...prefs.layers[id] }
    }
    return out
  }
  if (prefs.waveLayer) out.wave = { enrolled: true, active: true }
  if (prefs.windLayer) out.wind = { enrolled: true, active: true }
  return out
}

// Enforce the invariant: an un-enrolled layer is never active.
export function normalizeLayer(state) {
  if (!state?.enrolled) return { enrolled: false, active: false }
  return { enrolled: true, active: !!state.active }
}
