// Shared CORS helper for the Sjosyn NATIVE APP backend (separate Netlify
// deploy from the web PWA — this backend has exactly one client, so the
// allow-list is short and explicit rather than "*").
const ALLOWED_ORIGINS = [
  /^https:\/\/localhost$/,      // Capacitor Android WebView default origin
  /^capacitor:\/\/localhost$/,  // Capacitor iOS (future)
  /^http:\/\/localhost:\d+$/,   // local `npm run dev` testing against this backend
]

function corsHeaders(originHeader) {
  const origin = originHeader || ''
  if (!ALLOWED_ORIGINS.some((re) => re.test(origin))) return {}
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    Vary: 'Origin',
  }
}

module.exports = { corsHeaders, ALLOWED_ORIGINS }
