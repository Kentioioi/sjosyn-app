# Kartlag-panel — design spec

Date: 2026-06-25
Status: approved design, pending implementation plan
Repo: Sjøsyn / marine-traffic

## Problem

Two floating forecast chips sit top-left of the map: `.wave-chip` (🌊) and
`.wind-chip` (🌬). Each toggles its own timeline. They waste space (dead area
left, top, and between them), don't scale as more data layers are added, and
duplicate the on/off intent that also lives in Settings.

Goal: one compact, persistent on-map panel that turns each data layer on/off and
launches its timeline — built so new layers (temperatur, strøm, …) drop in
without bespoke UI.

## Decisions (locked)

1. **Persistent on-map panel**, top-left, where the chips were. Replaces both
   floating chips entirely. The chips are deleted.
2. **Row = enrolled layer**: `icon · name · ▸ · switch`.
   - Switch = show/hide that layer's badges on the map *now* (the `active` state).
   - Tapping the name / `▸` = open that layer's timeline (the launcher).
3. **Two-tier state, per layer**:
   - `enrolled` — controlled in Settings → Værdata (the catalog). On → the row
     appears in the panel. Off → the row leaves the panel AND the layer is forced
     inactive.
   - `active` — controlled by the panel switch → badges drawn on the map.
4. **Multiple layers active at once.** Badges from different layers at the same
   grid cell must sit adjacent — shoulder-to-shoulder / toe-to-toe — never
   overlapping. Generalize the existing "wind anchored below wave" offset to an
   N-layer vertical stack.
5. **One timeline open at a time.** The bottom scrub panel is single-tenant;
   tapping a different row's name swaps which timeline is open.
6. **Collapses to a single ☰ icon** to reclaim the map corner. Collapsed/expanded
   state is persisted — opens in whatever state it was last left (remember last).
7. **Keep the existing emoji icons** (🌊 / 🌬), not a new icon set.
8. **Compact.** Panel text + icons ~10% smaller than default; tight padding; no
   dead space between rows.
9. **Font colors unchanged — use the app's existing tokens** (`var(--text)`,
   `var(--text-muted)`) exactly as elsewhere. Do NOT recolor row labels per
   layer or dim the label for the off-state. Off-state is signalled by the
   switch (and a dimmed *icon* at most), never by changing the text color.

Settings → Værdata keeps its per-layer sub-options (e.g. wind unit m/s↔knop). Its
on/off toggles become the `enrolled` (catalog) switches.

## Architecture

Break into focused units:

- `src/utils/layersRegistry.js` — the catalog. An array of layer descriptors:
  `{ id, label, icon, accent, availableFlag, Timeline, useForecast }`. Adding a
  future layer = one entry here + its hook/Timeline. No per-layer branching in
  `App.jsx` or the panel.
- `src/components/LayerPanel.jsx` — renders one row per *enrolled* layer from the
  registry. Switch drives `active`; row/name tap drives `openTimeline`; header
  toggles collapsed. Pure presentational over props + callbacks.
- `App.jsx` — owns:
  - `prefs.layers` — `{ [id]: { enrolled, active } }` (migrated from the old flat
    `waveLayer` / `windLayer`).
  - `prefs.layerPanelCollapsed` — bool, persisted.
  - `openTimeline` — id of the single open timeline (or null). The panel sets it;
    timelines render off it.
- `SettingsPanel.jsx` — Værdata section drives `enrolled` per layer (the catalog).
  Keeps sub-options.
- `MapView.jsx` — badge layers render for each `active` layer. Generalize badge
  vertical anchor: offset by the layer's index among the active set so 2+ layers
  stack adjacently instead of overlapping.

## Data flow

```
Settings (Værdata)  ──enrolled──▶  prefs.layers[id].enrolled
LayerPanel switch   ──active────▶  prefs.layers[id].active
LayerPanel name tap ──────────────▶ openTimeline = id   (swaps the single timeline)

prefs.layers + registry ──▶ LayerPanel rows (only enrolled; switch = active)
active layers           ──▶ MapView badge layers (anchors stacked by active index)
openTimeline            ──▶ App renders exactly one <Timeline>
```

## State model & migration

Per layer: `{ enrolled: bool, active: bool }`.

- `enrolled` false ⇒ row absent from panel ⇒ `active` forced false (and badges off).
- `enrolled` true, `active` false ⇒ row in panel, switch off, no badges.
- `enrolled` true, `active` true ⇒ row in panel, switch on, badges drawn.

Newly enrolling a layer in Settings (off→on) defaults `active = true` — it shows
on the map immediately; the user hides it from the panel without un-enrolling.
Un-enrolling (on→off) forces `active = false`.

Migration from existing prefs (pure function, tested):

- old `waveLayer: true`  → `layers.wave = { enrolled: true, active: true }`
- old `waveLayer: false` → `layers.wave = { enrolled: false, active: false }`
- same for `windLayer` → `layers.wind`.
- `windHorizon`, `windUnit`, `waveHorizon`, `forecastThin` unchanged.

## Edge cases

- **Zero enrolled layers** → hide the panel entirely (nothing to toggle; reclaim
  the corner). Re-enroll one in Settings → panel reappears.
- **Layer data error** (token dead / fetch fail) → the row shows a ⚠ on its icon
  (same signal the chips used), switch still reflects `active`.
- **Collapsed** → show ☰ plus a small count of active layers so state is legible
  without expanding.
- **Swap timeline** → opening layer B's timeline closes layer A's; A stays
  `active` (badges remain), only its scrub panel closes.

## Badge co-placement (no overshadow)

Today: wave badge centered on the cell; wind anchored ~10px below (`iconAnchor`
`[…, -10]`). Generalize: each active layer gets a stack slot `k = 0,1,2,…` by a
fixed registry order; badge vertical anchor = `baseAnchor + k * rowGap`. With one
layer active it sits centered; with several they read top-to-bottom, none
overlapping. Pure offset function, tested by slot index.

## Testing

- `layersRegistry` shape (ids unique, required fields present).
- prefs migration: old flat flags → new `layers` map (pure, table-driven).
- enroll/active invariants: `enrolled=false ⇒ active=false`.
- badge anchor offset: given active-layer slot index → expected vertical anchor,
  no two slots equal.
- LayerPanel render: enrolled filter, switch reflects active, collapsed shows ☰.

## YAGNI / scope

- Implement only wave + wind layers now. Registry holds those two entries; the
  data-driven shape *proves* extensibility without building temperatur/strøm.
- No drag-reorder of layers. Fixed registry order.
- No per-layer color theming beyond the existing accent.
