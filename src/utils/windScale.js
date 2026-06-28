// Vind: fargeskala (Beaufort-ish, m/s) + enhetshåndtering (m/s ↔ knop).
// Bevisst ULIK bølge-paletten (grå→grønn→gul→oransje→rød→lilla) så vind-merkene
// skiller seg fra bølge-merkene på kartet.

// Vindstyrke (m/s) → merkets KANT-farge (ringen rundt merket). Svak vind får
// gjennomsiktig kant (ingen farge), så bare merkbar vind skiller seg ut. Ramper
// til rødt ved 18 m/s og lilla ved storm.
export function windColor(ms) {
  if (ms < 3.4)  return 'transparent'  // flau/svak vind (≤ F2) — ingen farge
  if (ms < 8.0)  return '#3aa15a'      // lett/laber bris (F3–4)
  if (ms < 13.0) return '#e9c46a'      // frisk bris (F5–6)
  if (ms < 18.0) return '#f4793a'      // liten/stiv kuling (F6–7)
  if (ms < 28.5) return '#e63946'      // rødt — fra 18 m/s (sterk kuling+)
  return '#9d4edd'                     // lilla — storm/orkan (F11+)
}

// Tekstfarge paret med windColor (mørk på gul, ellers hvit).
export function windTextColor(ms) {
  return ms >= 8.0 && ms < 13.9 ? '#0a1622' : '#fff'
}

const MS_TO_KN = 1.943844

// Vis vindverdi i valgt enhet (heltall — vind oppgis konvensjonelt i hele tall).
export function formatWind(ms, unit) {
  if (!Number.isFinite(ms)) return '–'
  return String(Math.round(unit === 'kn' ? ms * MS_TO_KN : ms))
}

export function windUnitLabel(unit) {
  return unit === 'kn' ? 'kn' : 'm/s'
}
