// Ring/tekst/halo-farger for varselmerkene. RINGEN har alltid lagfargen
// (blå bølge, grønn vind) så brukeren kan skille lagene på formen alene;
// alvorlighetsrampene fra waveColor/windColor farger bare VERDIEN inni når
// sjø/vind er verdt oppmerksomhet. Lys/mørk kartvariant styres av darkMap.
import { waveColor } from './waveGrid'
import { windColor } from './windScale'

const WAVE_BASE = {
  light: { ring: '#1d6fa5', text: '#124e79' },
  dark:  { ring: '#7dd3fc', text: '#7dd3fc' },
}
const WIND_BASE = {
  light: { ring: '#2f7d4f', text: '#1f5c38' },
  dark:  { ring: '#8ee0a8', text: '#8ee0a8' },
}

// Rampefargene er valgt for mørk bakgrunn — på lyst kart trenger TEKSTEN en
// mørkere makker.
const SEV_TEXT_LIGHT = {
  '#2a9d8f': '#1c6b62',
  '#e9c46a': '#8a6508',
  '#f4a261': '#a3541a',
  '#f4793a': '#a3480f',
  '#e63946': '#b02633',
  '#9d4edd': '#7d2fbd',
}

function halo(dark) {
  return dark ? 'rgba(6, 14, 22, 0.85)' : 'rgba(255, 255, 255, 0.85)'
}

function style(base, sevColor, dark) {
  const b = base[dark ? 'dark' : 'light']
  const text = sevColor == null
    ? b.text
    : dark ? sevColor : (SEV_TEXT_LIGHT[sevColor] || sevColor)
  return { ring: b.ring, text, halo: halo(dark) }
}

export function waveBadgeStyle(h, dark) {
  return style(WAVE_BASE, h < 1 ? null : waveColor(h), dark)
}

export function windBadgeStyle(ms, dark) {
  return style(WIND_BASE, ms < 8 ? null : windColor(ms), dark)
}
