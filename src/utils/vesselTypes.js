export const VESSEL_TYPES = {
  0: { label: 'Ukjent', color: '#888888', icon: '?' },
  20: { label: 'WIG-fartøy', color: '#ff6b6b', icon: '✈' },
  21: { label: 'WIG-fartøy (farlig last A)', color: '#ff6b6b', icon: '✈' },
  30: { label: 'Fiskefartøy', color: '#ffd166', icon: '🎣' },
  31: { label: 'Slepebåt', color: '#f77f00', icon: '⚓' },
  32: { label: 'Slepebåt (langt slep)', color: '#f77f00', icon: '⚓' },
  33: { label: 'Mudringsfartøy', color: '#e07a5f', icon: '⚙' },
  34: { label: 'Dykkerfartøy', color: '#3d405b', icon: '🤿' },
  35: { label: 'Militært fartøy', color: '#264653', icon: '🛡' },
  36: { label: 'Seilbåt', color: '#81b29a', icon: '⛵' },
  37: { label: 'Fritidsbåt', color: '#a8dadc', icon: '🚤' },
  40: { label: 'Hurtigbåt', color: '#e63946', icon: '💨' },
  50: { label: 'Losbåt', color: '#f4a261', icon: '🛥' },
  51: { label: 'Redningsfartøy', color: '#ff4444', icon: '🆘' },
  52: { label: 'Taubåt', color: '#e76f51', icon: '🚢' },
  53: { label: 'Havnefartøy', color: '#2a9d8f', icon: '⛴' },
  54: { label: 'Oljevernfartøy', color: '#2a9d8f', icon: '♻' },
  55: { label: 'Politi/oppsyn', color: '#023e8a', icon: '🚔' },
  60: { label: 'Passasjerskip', color: '#457b9d', icon: '🛳' },
  61: { label: 'Passasjerskip', color: '#457b9d', icon: '🛳' },
  62: { label: 'Passasjerskip', color: '#457b9d', icon: '🛳' },
  63: { label: 'Passasjerskip', color: '#457b9d', icon: '🛳' },
  64: { label: 'Passasjerskip', color: '#457b9d', icon: '🛳' },
  69: { label: 'Passasjerskip', color: '#457b9d', icon: '🛳' },
  70: { label: 'Lasteskip', color: '#6d6875', icon: '📦' },
  71: { label: 'Lasteskip (farlig last A)', color: '#b5838d', icon: '📦' },
  72: { label: 'Lasteskip (farlig last B)', color: '#b5838d', icon: '📦' },
  73: { label: 'Lasteskip (farlig last C)', color: '#b5838d', icon: '📦' },
  74: { label: 'Lasteskip (farlig last D)', color: '#b5838d', icon: '📦' },
  79: { label: 'Lasteskip', color: '#6d6875', icon: '📦' },
  80: { label: 'Tankskip', color: '#e9c46a', icon: '🛢' },
  81: { label: 'Tankskip (farlig last A)', color: '#f4a261', icon: '🛢' },
  82: { label: 'Tankskip (farlig last B)', color: '#f4a261', icon: '🛢' },
  83: { label: 'Tankskip (farlig last C)', color: '#f4a261', icon: '🛢' },
  84: { label: 'Tankskip (farlig last D)', color: '#f4a261', icon: '🛢' },
  89: { label: 'Tankskip', color: '#e9c46a', icon: '🛢' },
  90: { label: 'Annet', color: '#adb5bd', icon: '🚢' },
}

export function getVesselType(typeCode) {
  const code = parseInt(typeCode) || 0
  return VESSEL_TYPES[code] || { label: 'Annet', color: '#adb5bd', icon: '🚢' }
}

export const VESSEL_CATEGORIES = {
  commercial: { key: 'commercial', label: 'Yrkesfartøy',   color: '#334155' },
  passenger:  { key: 'passenger',  label: 'Passasjer/rute', color: '#1d6fb8' },
  leisure:    { key: 'leisure',    label: 'Fritid',         color: '#0e7a53' },
  fishing:    { key: 'fishing',    label: 'Fiske',          color: '#c25e10' },
  emergency:  { key: 'emergency',  label: 'Nød/myndighet',  color: '#d33b3b' },
  other:      { key: 'other',      label: 'Annet',          color: '#6b7280' },
}

// AIS-typekode -> fargekategori. Kollapser ~30 koder til 5 grupper som er
// til a skille pa kartet (detaljert type ligger fortsatt i fartoy-panelet).
export function getVesselCategory(typeCode) {
  const c = parseInt(typeCode) || 0
  if (c === 30) return VESSEL_CATEGORIES.fishing
  if (c === 35 || c === 50 || c === 51 || c === 54 || c === 55) return VESSEL_CATEGORIES.emergency
  if (c === 40 || (c >= 60 && c <= 69)) return VESSEL_CATEGORIES.passenger
  if (c === 36 || c === 37) return VESSEL_CATEGORIES.leisure
  if ((c >= 70 && c <= 89) || c === 31 || c === 32 || c === 33 || c === 34 || c === 52 || c === 53 || c === 20 || c === 21) return VESSEL_CATEGORIES.commercial
  return VESSEL_CATEGORIES.other
}

export function getVesselColor(typeCode) {
  return getVesselCategory(typeCode).color
}

// Øvre fartstak for ekte fartøy (knop). Selv hurtigbåter topper ~35–40 kn;
// 60 gir god margin. Alt over regnes som datafeil.
const MAX_PLAUSIBLE_SOG = 60
// AIS-sentinel for «ikke tilgjengelig» (SOG-felt = 1023 → 102.3 kn).
const AIS_SOG_NA = 102.3

// Eneste sannhetskilde for om en SOG-verdi er ekte. Ugyldig =
// null/undefined, AIS «ikke tilgjengelig»-sentinelen (102.3), eller
// fysisk umulige verdier over fartstaket.
export function isPlausibleSpeed(sog) {
  return sog != null && sog !== AIS_SOG_NA && sog >= 0 && sog <= MAX_PLAUSIBLE_SOG
}

export function formatSpeed(sog) {
  if (!isPlausibleSpeed(sog)) return '–'
  return `${sog.toFixed(1)} kn`
}

export function formatHeading(hdg) {
  if (hdg == null || hdg === 511) return '–'
  const dirs = ['N', 'NØ', 'Ø', 'SØ', 'S', 'SV', 'V', 'NV']
  return `${hdg}° ${dirs[Math.round(hdg / 45) % 8]}`
}

export function formatCoords(lat, lon) {
  if (lat == null || lon == null) return '–'
  const latDir = lat >= 0 ? 'N' : 'S'
  const lonDir = lon >= 0 ? 'Ø' : 'V'
  return `${Math.abs(lat).toFixed(4)}°${latDir} ${Math.abs(lon).toFixed(4)}°${lonDir}`
}

export function timeSince(timestamp) {
  if (!timestamp) return 'ukjent'
  const diff = (Date.now() - new Date(timestamp).getTime()) / 1000
  if (diff < 60) return `${Math.round(diff)} s siden`
  if (diff < 3600) return `${Math.round(diff / 60)} min siden`
  return `${Math.round(diff / 3600)} t siden`
}

// Demo vessels for when no API key is set.
// Authored as a compact harbour layout around coordinate (51.5, -0.09), then
// shifted to the app's default map centre (Ryfylke, [58.97, 5.73]) so the demo
// fleet appears in view on launch instead of off the coast of England.
const DEMO_LAT_SHIFT = 7.465
const DEMO_LON_SHIFT = 5.82
const DEMO_VESSELS_RAW = [
  { mmsi: '123456789', name: 'ATLANTIC QUEEN', type: 60, lat: 51.505, lon: -0.09, sog: 12.4, cog: 45, hdg: 47, flag: 'GB', destination: 'LONDON', draught: 8.5, length: 220, timestamp: new Date().toISOString() },
  { mmsi: '234567890', name: 'NORTHERN STAR', type: 70, lat: 51.52, lon: -0.12, sog: 8.2, cog: 180, hdg: 182, flag: 'NO', destination: 'ROTTERDAM', draught: 12.0, length: 290, timestamp: new Date().toISOString() },
  { mmsi: '345678901', name: 'PACIFIC FISHER', type: 30, lat: 51.49, lon: -0.07, sog: 4.1, cog: 270, hdg: 268, flag: 'US', destination: '', draught: 4.2, length: 45, timestamp: new Date().toISOString() },
  { mmsi: '456789012', name: 'OCEAN PRIDE', type: 80, lat: 51.51, lon: -0.15, sog: 14.3, cog: 90, hdg: 91, flag: 'GR', destination: 'ANTWERP', draught: 15.2, length: 320, timestamp: new Date().toISOString() },
  { mmsi: '567890123', name: 'SEA BREEZE', type: 37, lat: 51.495, lon: -0.11, sog: 6.7, cog: 315, hdg: 314, flag: 'NL', destination: 'AMSTERDAM', draught: 2.1, length: 22, timestamp: new Date().toISOString() },
  { mmsi: '678901234', name: 'CARGO MASTER', type: 71, lat: 51.515, lon: -0.085, sog: 10.0, cog: 220, hdg: 221, flag: 'DE', destination: 'HAMBURG', draught: 11.8, length: 185, timestamp: new Date().toISOString() },
  { mmsi: '789012345', name: 'RESCUE 1', type: 51, lat: 51.508, lon: -0.13, sog: 22.5, cog: 0, hdg: 2, flag: 'GB', destination: 'PATROL', draught: 2.8, length: 35, timestamp: new Date().toISOString() },
  { mmsi: '890123456', name: 'SAILING DREAM', type: 36, lat: 51.502, lon: -0.095, sog: 5.3, cog: 135, hdg: 133, flag: 'SE', destination: 'GOTHENBURG', draught: 2.2, length: 18, timestamp: new Date().toISOString() },
  { mmsi: '901234567', name: 'TUG HERCULES', type: 52, lat: 51.512, lon: -0.105, sog: 3.2, cog: 60, hdg: 62, flag: 'BE', destination: 'PORT ASSIST', draught: 3.5, length: 32, timestamp: new Date().toISOString() },
  { mmsi: '112345678', name: 'FERRY EXPRESS', type: 60, lat: 51.498, lon: -0.118, sog: 18.0, cog: 165, hdg: 166, flag: 'DK', destination: 'DOVER', draught: 5.5, length: 155, timestamp: new Date().toISOString() },
  { mmsi: '223456789', name: 'BULK TITAN', type: 79, lat: 51.525, lon: -0.075, sog: 7.8, cog: 200, hdg: 199, flag: 'PL', destination: 'GDANSK', draught: 13.1, length: 265, timestamp: new Date().toISOString() },
  { mmsi: '334567890', name: 'PILOT DELTA', type: 50, lat: 51.506, lon: -0.14, sog: 9.4, cog: 330, hdg: 328, flag: 'FR', destination: 'PILOT STN', draught: 2.9, length: 28, timestamp: new Date().toISOString() },
  // Anchored marina group — exercises stationary clustering (6 boats ≈ 200 m apart)
  { mmsi: '441000001', name: 'HAVBRIS', type: 37, lat: 51.5030, lon: -0.0560, sog: 0, cog: 0, hdg: 12, flag: 'NO', destination: '', draught: 1.8, length: 12, timestamp: new Date().toISOString() },
  { mmsi: '441000002', name: 'FJORDGLIMT', type: 36, lat: 51.5042, lon: -0.0548, sog: 0.1, cog: 0, hdg: 95, flag: 'NO', destination: '', draught: 2.0, length: 14, timestamp: new Date().toISOString() },
  { mmsi: '441000003', name: 'MÅKEN II', type: 30, lat: 51.5021, lon: -0.0577, sog: 0, cog: 0, hdg: 203, flag: 'NO', destination: '', draught: 3.1, length: 21, timestamp: new Date().toISOString() },
  { mmsi: '441000004', name: 'SJØSPRØYT', type: 37, lat: 51.5035, lon: -0.0590, sog: 0.2, cog: 0, hdg: 318, flag: 'NO', destination: '', draught: 1.5, length: 9, timestamp: new Date().toISOString() },
  { mmsi: '441000005', name: 'NORDLYS', type: 36, lat: 51.5048, lon: -0.0572, sog: 0, cog: 0, hdg: 47, flag: 'NO', destination: '', draught: 2.3, length: 16, timestamp: new Date().toISOString() },
  { mmsi: '441000006', name: 'BØLGEN', type: 90, lat: 51.5026, lon: -0.0541, sog: 0.1, cog: 0, hdg: 160, flag: 'NO', destination: '', draught: 2.7, length: 24, timestamp: new Date().toISOString() },
]

export const DEMO_VESSELS = DEMO_VESSELS_RAW.map(v => ({
  ...v,
  lat: +(v.lat + DEMO_LAT_SHIFT).toFixed(4),
  lon: +(v.lon + DEMO_LON_SHIFT).toFixed(4),
}))
