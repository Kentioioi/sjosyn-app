import { LAYERS } from '../utils/layersRegistry'

// Compact top-left layers panel. Presentational: all state via props.
// Row = icon · name (opens timeline) · › · switch (on-map toggle).
// Font colors come from CSS tokens (--text/--text-muted) — never recolored
// per layer; off-state dims only the icon.
export default function LayerPanel({
  layers, collapsed, onToggleCollapse, onToggleActive, onOpenTimeline, info = {}, errors = {},
}) {
  const enrolled = LAYERS.filter(l => layers[l.id]?.enrolled)
  if (enrolled.length === 0) return null
  const activeCount = enrolled.filter(l => layers[l.id]?.active).length

  if (collapsed) {
    return (
      <button className="layer-panel layer-panel--collapsed" onClick={onToggleCollapse}
              title="Vis kartlag" aria-label="Vis kartlag">
        <span className="layer-menu-icon" aria-hidden="true">☰</span>
        <span className="layer-collapsed-label">Lag</span>
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
            <button className="layer-name" style={{ color: l.textColor }}
                    onClick={() => onOpenTimeline(l.id)}
                    title={`Åpne ${l.label.toLowerCase()}-tidslinje`}>
              <span className="layer-name-text">{l.label}</span>
              {info[l.id] && <span className="layer-info">{info[l.id]}</span>}
              {errors[l.id] && <span className="layer-err" title={errors[l.id]} aria-hidden="true">⚠</span>}
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
