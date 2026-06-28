# Kartlag-panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the two floating wave/wind chips with one compact, persistent top-left "Lag" panel that toggles each data layer on/off and launches its timeline, driven by a layers registry so new layers drop in without bespoke UI.

**Architecture:** A pure layers registry + pure prefs-migration + pure badge-stack offset back a presentational `LayerPanel`. `App.jsx` owns per-layer `{enrolled, active}` state, a single `openTimeline` id, and panel-collapsed state. Settings → Værdata drives `enrolled` (catalog); the panel drives `active` (on-map). Badges from multiple active layers stack toe-to-toe via a shared anchor function.

**Tech Stack:** React 19, Vite, react-leaflet/Leaflet, vitest (added here).

Spec: `docs/superpowers/specs/2026-06-25-kartlag-panel-design.md`

---

## File structure

- Create `src/utils/layersRegistry.js` — layer catalog (display metadata only; no component imports → no cycles).
- Create `src/utils/layersPrefs.js` — pure `migrateLayerPrefs`, `defaultLayers`, invariant helper.
- Create `src/utils/badgeStack.js` — pure `badgeAnchorY(height, slot)`.
- Create `src/components/LayerPanel.jsx` — presentational panel.
- Create test files alongside utils.
- Modify `src/components/WaveLayer.jsx`, `src/components/WindLayer.jsx` — accept `slot`, use `badgeAnchorY`.
- Modify `src/components/MapView.jsx` — compute active-layer slots, pass `slot` to layers.
- Modify `src/components/SettingsPanel.jsx` — Værdata toggles drive `enrolled`.
- Modify `src/App.jsx` — migrate prefs, `layers` + `openTimeline` + `layerPanelCollapsed` state, render `LayerPanel`, drop chips, render single timeline.
- Modify `src/index.css` — `.layer-panel*` styles; remove `.wave-chip`/`.wind-chip`.

---

## Task 1: Add vitest

**Files:**
- Modify: `package.json`
- Create: `vitest.config.js`

- [ ] **Step 1: Install vitest**

Run: `npm i -D vitest`
Expected: adds `vitest` to devDependencies, exit 0.

- [ ] **Step 2: Add test script + config**

`package.json` scripts — add:
```json
"test": "vitest run",
"test:watch": "vitest"
```

Create `vitest.config.js`:
```js
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: { environment: 'node', include: ['src/**/*.test.js'] },
})
```

- [ ] **Step 3: Verify runner works**

Run: `npx vitest run`
Expected: "No test files found" (exit 0) — runner is wired.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json vitest.config.js
git commit -m "chore: add vitest for unit tests"
```

---

## Task 2: Layers prefs migration (pure, TDD)

**Files:**
- Create: `src/utils/layersPrefs.js`
- Test: `src/utils/layersPrefs.test.js`

- [ ] **Step 1: Write the failing test**

```js
import { describe, test, expect } from 'vitest'
import { migrateLayerPrefs, defaultLayers, LAYER_IDS } from './layersPrefs'

describe('migrateLayerPrefs', () => {
  test('legacy waveLayer:true → wave enrolled+active', () => {
    expect(migrateLayerPrefs({ waveLayer: true }).wave).toEqual({ enrolled: true, active: true })
  })
  test('legacy windLayer:true → wind enrolled+active', () => {
    expect(migrateLayerPrefs({ windLayer: true }).wind).toEqual({ enrolled: true, active: true })
  })
  test('legacy flags false → all default off', () => {
    expect(migrateLayerPrefs({ waveLayer: false, windLayer: false })).toEqual(defaultLayers())
  })
  test('empty prefs → all default off', () => {
    expect(migrateLayerPrefs({})).toEqual(defaultLayers())
  })
  test('already-migrated layers pass through, missing ids filled', () => {
    const layers = { wave: { enrolled: true, active: false } }
    const out = migrateLayerPrefs({ layers })
    expect(out.wave).toEqual({ enrolled: true, active: false })
    expect(out.wind).toEqual({ enrolled: false, active: false })
  })
  test('LAYER_IDS covers wave and wind', () => {
    expect(LAYER_IDS).toEqual(['wave', 'wind'])
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/utils/layersPrefs.test.js`
Expected: FAIL — cannot resolve `./layersPrefs`.

- [ ] **Step 3: Write minimal implementation**

```js
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/utils/layersPrefs.test.js`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add src/utils/layersPrefs.js src/utils/layersPrefs.test.js
git commit -m "feat: layer prefs migration (legacy flags → per-layer state)"
```

---

## Task 3: Badge stack offset (pure, TDD)

**Files:**
- Create: `src/utils/badgeStack.js`
- Test: `src/utils/badgeStack.test.js`

- [ ] **Step 1: Write the failing test**

Anchors derived to match the current hand-tuned values: wind (height 16) at slot 1 must equal the existing `-10`; a single-layer badge (slot 0) sits centered.

```js
import { describe, test, expect } from 'vitest'
import { badgeAnchorY } from './badgeStack'

describe('badgeAnchorY', () => {
  test('slot 0 is centered (height/2)', () => {
    expect(badgeAnchorY(16, 0)).toBe(8)
    expect(badgeAnchorY(15, 0)).toBe(7.5)
  })
  test('slot 1 sits fully below (matches legacy wind -10)', () => {
    expect(badgeAnchorY(16, 1)).toBe(-10)
  })
  test('successive slots are distinct and descending', () => {
    const ys = [0, 1, 2].map(s => badgeAnchorY(16, s))
    expect(new Set(ys).size).toBe(3)
    expect(ys[0]).toBeGreaterThan(ys[1])
    expect(ys[1]).toBeGreaterThan(ys[2])
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/utils/badgeStack.test.js`
Expected: FAIL — cannot resolve `./badgeStack`.

- [ ] **Step 3: Write minimal implementation**

```js
// Leaflet iconAnchor[1] for a forecast badge of `height` px at stack `slot`
// among the active layers sharing a grid cell. Slot 0 centers on the cell;
// each next slot drops a full badge height (+2px gap) below → toe-to-toe,
// never overlapping. (slot 1, height 16 → -10, matching the prior wind anchor.)
const GAP = 2
export function badgeAnchorY(height, slot) {
  return height / 2 - slot * (height + GAP)
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/utils/badgeStack.test.js`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/utils/badgeStack.js src/utils/badgeStack.test.js
git commit -m "feat: badge stack anchor offset (generalize wind-below-wave)"
```

---

## Task 4: Layers registry (pure, TDD)

**Files:**
- Create: `src/utils/layersRegistry.js`
- Test: `src/utils/layersRegistry.test.js`

- [ ] **Step 1: Write the failing test**

```js
import { describe, test, expect } from 'vitest'
import { LAYERS, layerById } from './layersRegistry'

describe('layers registry', () => {
  test('has wave and wind with required fields', () => {
    const ids = LAYERS.map(l => l.id)
    expect(ids).toContain('wave')
    expect(ids).toContain('wind')
    for (const l of LAYERS) {
      expect(typeof l.label).toBe('string')
      expect(typeof l.icon).toBe('string')
      expect(typeof l.accent).toBe('string')
    }
  })
  test('ids are unique', () => {
    const ids = LAYERS.map(l => l.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
  test('layerById resolves and returns null for unknown', () => {
    expect(layerById('wave').label).toBe('Bølge')
    expect(layerById('nope')).toBeNull()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/utils/layersRegistry.test.js`
Expected: FAIL — cannot resolve `./layersRegistry`.

- [ ] **Step 3: Write minimal implementation**

```js
// Display catalog for the Kartlag panel. Metadata only — no component imports
// (timelines are rendered by App off `openTimeline`). Add a layer = one entry
// here (+ its hook/Timeline/Settings sub-option). Order = badge stack order.
export const LAYERS = [
  { id: 'wave', label: 'Bølge', icon: '🌊', accent: '#00b4d8' },
  { id: 'wind', label: 'Vind',  icon: '🌬', accent: '#3aa15a' },
]

export function layerById(id) {
  return LAYERS.find(l => l.id === id) ?? null
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/utils/layersRegistry.test.js`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/utils/layersRegistry.js src/utils/layersRegistry.test.js
git commit -m "feat: layers registry catalog"
```

---

## Task 5: LayerPanel component + styles

**Files:**
- Create: `src/components/LayerPanel.jsx`
- Modify: `src/index.css` (add `.layer-panel*`)

No DOM test framework — verified live in Task 8.

- [ ] **Step 1: Create the component**

```jsx
import { LAYERS } from '../utils/layersRegistry'

// Compact top-left layers panel. Presentational: all state via props.
// Row = icon · name(opens timeline) · › · switch(on-map toggle).
// Font colors come from CSS tokens (--text/--text-muted) — never recolored
// per layer; off-state dims only the icon.
export default function LayerPanel({
  layers, collapsed, onToggleCollapse, onToggleActive, onOpenTimeline, errors = {},
}) {
  const enrolled = LAYERS.filter(l => layers[l.id]?.enrolled)
  if (enrolled.length === 0) return null
  const activeCount = enrolled.filter(l => layers[l.id]?.active).length

  if (collapsed) {
    return (
      <button className="layer-panel layer-panel--collapsed" onClick={onToggleCollapse}
              title="Vis kartlag" aria-label="Vis kartlag">
        <span className="layer-menu-icon" aria-hidden="true">☰</span>
        {activeCount > 0 && <span className="layer-active-count">{activeCount}</span>}
      </button>
    )
  }

  return (
    <div className="layer-panel">
      <button className="layer-panel-header" onClick={onToggleCollapse}
              title="Skjul kartlag" aria-label="Skjul kartlag" aria-expanded="true">
        <span className="layer-menu-icon" aria-hidden="true">☰</span>
        <span className="layer-panel-title">Lag</span>
        <span className="layer-collapse-chevron" aria-hidden="true">⌃</span>
      </button>

      {enrolled.map(l => {
        const st = layers[l.id] || {}
        return (
          <div key={l.id} className="layer-row">
            <span className={`layer-icon${st.active ? '' : ' layer-icon--off'}`} aria-hidden="true">{l.icon}</span>
            <button className="layer-name" onClick={() => onOpenTimeline(l.id)}
                    title={`Åpne ${l.label.toLowerCase()}-tidslinje`}>
              <span className="layer-name-text">{l.label}</span>
              {errors[l.id] && <span className="layer-err" title={errors[l.id]} aria-hidden="true">⚠</span>}
              <span className="layer-open-chevron" aria-hidden="true">›</span>
            </button>
            <button
              className={`layer-switch${st.active ? ' layer-switch--on' : ''}`}
              role="switch" aria-checked={!!st.active}
              aria-label={`${l.label} ${st.active ? 'på' : 'av'}`}
              onClick={() => onToggleActive(l.id)}>
              <span className="layer-switch-knob" aria-hidden="true" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 2: Add styles** (append near the old chip styles in `src/index.css`)

```css
/* ─── Kartlag-panel (top-left) ─── */
.layer-panel {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 600;
  width: 150px;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.45);
  overflow: hidden;
  font-family: var(--font);
}
.layer-panel-header {
  display: flex;
  align-items: center;
  gap: 7px;
  width: 100%;
  padding: 6px 8px 6px 9px;
  background: var(--bg3, #1b2836);
  border: none;
  border-bottom: 1px solid var(--border);
  color: var(--text);
  cursor: pointer;
}
.layer-menu-icon { font-size: 0.82rem; color: var(--text-muted); }
.layer-panel-title { flex: 1; text-align: left; font-size: 0.72rem; font-weight: 500; color: var(--text); }
.layer-collapse-chevron { font-size: 0.78rem; color: var(--text-muted); }
.layer-row {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 7px 8px 7px 9px;
  border-bottom: 1px solid var(--border);
}
.layer-row:last-child { border-bottom: none; }
.layer-icon { font-size: 0.86rem; }
.layer-icon--off { opacity: 0.5; }
.layer-name {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0;
  background: none;
  border: none;
  color: var(--text);          /* app token — never recolored per layer */
  font-size: 0.74rem;
  text-align: left;
  cursor: pointer;
}
.layer-open-chevron { color: var(--text-muted); font-size: 0.74rem; }
.layer-err { color: var(--danger); font-size: 0.7rem; }
.layer-switch {
  flex-shrink: 0;
  width: 28px;
  height: 16px;
  padding: 0;
  border: none;
  border-radius: 999px;
  background: #44505e;
  position: relative;
  cursor: pointer;
  transition: background 0.15s;
}
.layer-switch--on { background: var(--accent); }
.layer-switch-knob {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #fff;
  transition: left 0.15s;
}
.layer-switch--on .layer-switch-knob { left: 14px; }
.layer-panel--collapsed {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  width: auto;
  padding: 6px 9px;
}
.layer-active-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 15px;
  height: 15px;
  padding: 0 3px;
  border-radius: 8px;
  background: var(--accent);
  color: #042c3a;
  font-size: 0.6rem;
  font-weight: 500;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/LayerPanel.jsx src/index.css
git commit -m "feat: LayerPanel component + styles"
```

---

## Task 6: WaveLayer/WindLayer accept slot

**Files:**
- Modify: `src/components/WaveLayer.jsx`
- Modify: `src/components/WindLayer.jsx`

- [ ] **Step 1: WaveLayer — use badgeAnchorY**

In `src/components/WaveLayer.jsx`:
- Add import: `import { badgeAnchorY } from '../utils/badgeStack'`
- Change `waveIcon(h, dir)` → `waveIcon(h, dir, slot)`; the badge height is 15:
  ```js
  return divIcon({ html, className: '', iconSize: [28, 15], iconAnchor: [14, badgeAnchorY(15, slot)] })
  ```
- Thread `slot` through `WaveMarker` and the default export prop:
  - `WaveMarker({ point, horizon, scrubT, slot, onSelect })`, memo dep add `slot`, call `waveIcon(h, dir, slot)`.
  - `export default ... function WaveLayer({ points, horizon, scrubT, slot = 0, onSelectPoint })`, pass `slot={slot}` to each `<WaveMarker>`.

- [ ] **Step 2: WindLayer — use badgeAnchorY**

In `src/components/WindLayer.jsx`:
- Add import: `import { badgeAnchorY } from '../utils/badgeStack'`
- Change `windIcon(ms, dirTo, unit)` → `windIcon(ms, dirTo, unit, slot)`; badge height 16:
  ```js
  return divIcon({ html, className: '', iconSize: [34, 16], iconAnchor: [17, badgeAnchorY(16, slot)] })
  ```
- Thread `slot` through `WindMarker` and the default export (`slot = 0`), pass to each marker, add to memo deps.

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: exit 0, no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/WaveLayer.jsx src/components/WindLayer.jsx
git commit -m "feat: wave/wind layers take stack slot for badge anchor"
```

---

## Task 7: App + Settings + MapView wiring

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/components/SettingsPanel.jsx`
- Modify: `src/components/MapView.jsx`

- [ ] **Step 1: App — migrate prefs + new state**

In `src/App.jsx`:
- Import: `import { migrateLayerPrefs, normalizeLayer } from './utils/layersPrefs'` and `import LayerPanel from './components/LayerPanel'`.
- In the prefs `defaults` object (line ~112): remove `waveLayer`/`windLayer`; add `layers: { wave: { enrolled: false, active: false }, wind: { enrolled: false, active: false } }, layerPanelCollapsed: false`.
- After prefs load, run migration once:
  ```js
  // one-time: fold legacy waveLayer/windLayer into prefs.layers
  useEffect(() => {
    setPrefs(p => (p.layers ? p : { ...p, layers: migrateLayerPrefs(p), layerPanelCollapsed: p.layerPanelCollapsed ?? false }))
  }, [])
  ```
- Derived: `const layers = prefs.layers ?? migrateLayerPrefs(prefs)`.
- Replace `waveEnabled`/`windEnabled`:
  ```js
  const waveEnabled = WAVE_LAYER_ACTIVE && !!layers.wave?.active
  const windEnabled = !!layers.wind?.active
  ```
- Replace `wavePanelOpen`/`windPanelOpen` mutually-exclusive state with one:
  ```js
  const [openTimeline, setOpenTimeline] = useState(null)  // 'wave' | 'wind' | null
  ```
- Handlers:
  ```js
  const toggleLayerActive = id => setPrefs(p => {
    const layers = migrateLayerPrefs(p)
    const next = normalizeLayer({ ...layers[id], active: !layers[id].active })
    if (!next.active && openTimeline === id) setOpenTimeline(null)
    return { ...p, layers: { ...layers, [id]: next } }
  })
  const openLayerTimeline = id => {
    setPrefs(p => {                       // opening implies active
      const layers = migrateLayerPrefs(p)
      if (layers[id].active) return p
      return { ...p, layers: { ...layers, [id]: normalizeLayer({ enrolled: true, active: true }) } }
    })
    setOpenTimeline(id)
  }
  ```

- [ ] **Step 2: App — render LayerPanel, drop chips, single timeline**

- Delete the `.wave-chip` button block and the `.wind-chip` button block (the two `{waveEnabled && !showSettings ...}` chip renders).
- Add the panel (sibling of the map, inside the map-area, before vessel panel):
  ```jsx
  {activeTab === 'map' && !showSettings && !showSearch && (
    <LayerPanel
      layers={layers}
      collapsed={prefs.layerPanelCollapsed}
      onToggleCollapse={() => updatePrefs({ layerPanelCollapsed: !prefs.layerPanelCollapsed })}
      onToggleActive={toggleLayerActive}
      onOpenTimeline={openLayerTimeline}
      errors={{ wave: waveError, wind: windError }}
    />
  )}
  ```
- Change the two timeline render guards from `wavePanelOpen`/`windPanelOpen` to `openTimeline === 'wave'` / `openTimeline === 'wind'`, and their `onClose` to `() => setOpenTimeline(null)`. Keep `waveEnabled`/`windEnabled` in the guard.

- [ ] **Step 3: Settings — Værdata drives enrolled**

In `src/components/SettingsPanel.jsx`, the Bølgevarsel/Vindvarsel toggles currently flip `prefs.waveLayer`/`windLayer`. Repoint them to enroll:
- Bølgevarsel checked = `layers.wave.enrolled`; onChange → `onEnroll('wave', next)`.
- Vindvarsel checked = `layers.wind.enrolled`; onChange → `onEnroll('wind', next)`.
- Pass an `onEnroll` prop from App:
  ```js
  const enrollLayer = (id, on) => setPrefs(p => {
    const layers = migrateLayerPrefs(p)
    const next = on ? normalizeLayer({ enrolled: true, active: true }) : { enrolled: false, active: false }
    if (!on && openTimeline === id) setOpenTimeline(null)
    return { ...p, layers: { ...layers, [id]: next } }
  })
  ```
  Wire `layers={layers}` and `onEnroll={enrollLayer}` into `<SettingsPanel>`. Keep the wind-unit selector unchanged.

- [ ] **Step 4: MapView — slot per active layer**

In `src/components/MapView.jsx` where `WaveLayer`/`WindLayer` render: compute slots from the active set in registry order (wave before wind), so a lone active layer gets slot 0 (centered):
```js
const activeOrder = ['wave', 'wind'].filter(id => (id === 'wave' ? waveActive : windActive))
const waveSlot = activeOrder.indexOf('wave')
const windSlot = activeOrder.indexOf('wind')
```
Pass `slot={waveSlot}` / `slot={windSlot}` to the respective layer. (`waveActive`/`windActive` are the existing booleans MapView uses to decide whether to render each layer — reuse them.)

- [ ] **Step 5: Verify build**

Run: `npm run build`
Expected: exit 0.

- [ ] **Step 6: Commit**

```bash
git add src/App.jsx src/components/SettingsPanel.jsx src/components/MapView.jsx
git commit -m "feat: wire LayerPanel — enroll in Settings, toggle on map, single timeline"
```

---

## Task 8: Live verification in preview

**Files:** none (verification only).

- [ ] **Step 1: Run unit tests**

Run: `npx vitest run`
Expected: PASS (all Tasks 2–4 tests).

- [ ] **Step 2: Start preview + drive (demo mode → 18 vessels, screenshot renders)**

- `preview_start` → unlock PIN → Prøv demomodus.
- Settings → enroll Bølge + Vind (Værdata toggles) → confirm both rows appear in the top-left Lag panel.
- Panel: toggle Bølge active → wave badges appear; toggle Vind active → wind badges appear stacked BELOW wave (no overlap).
- Tap "Bølge" name → wave timeline opens; tap "Vind" name → wind timeline swaps in (wave timeline closes, wave badges stay).
- Collapse panel (header) → single ☰ + active count; reload → opens collapsed (remember last).
- Settings → un-enroll Vind → Vind row leaves the panel, wind badges gone.
- Confirm row label text color = app `--text` (unchanged), only the icon dims when off.

- [ ] **Step 3: Screenshot proof** (demo mode, badges on)

Capture the panel expanded with both layers active + stacked badges; capture collapsed state.

- [ ] **Step 4: Commit any fixes, then final commit**

```bash
git add -A
git commit -m "test: verify Kartlag panel end-to-end in preview"
```

---

## Notes / out of scope

- Only wave + wind implemented; registry proves extensibility (temperatur/strøm not built — YAGNI).
- No drag-reorder; fixed registry order = badge stack order.
- The separate uncommitted label-perf refactor (MapView/VesselIcon/`vl-*` CSS) and this session's badge-shrink/demo/panel-polish changes are NOT part of this plan's commits — keep them in their own commits.
