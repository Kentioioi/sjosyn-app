// Single source of truth for the backend origin. Unlike the web PWA (which
// has a same-origin Netlify/Vite dev proxy), the native app runs from
// Capacitor's own origin — every backend call needs an absolute URL.
// Set via .env (VITE_API_BASE) — see .env.example.
export const API_BASE = import.meta.env.VITE_API_BASE || ''

if (!API_BASE) {
  // Loud on purpose: a silent empty base would fall back to relative fetches
  // that 404 inside the native shell (no dev proxy to catch them there).
  console.error('VITE_API_BASE is not set — see .env.example. Backend calls will fail.')
}
