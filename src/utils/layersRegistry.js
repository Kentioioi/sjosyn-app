// Display catalog for the Kartlag panel. Metadata only — no component imports
// (timelines are rendered by App off `openTimeline`). Add a layer = one entry
// here (+ its hook/Timeline/Settings sub-option). Order = badge stack order.
export const LAYERS = [
  { id: 'wave', label: 'Bølge', icon: '🌊', accent: '#00b4d8', textColor: '#7dd3fc' },
  { id: 'wind', label: 'Vind',  icon: '🌬', accent: '#3aa15a', textColor: '#8ee0a8' },
]

export function layerById(id) {
  return LAYERS.find(l => l.id === id) ?? null
}
