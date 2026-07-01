// Proxy → MET Norway locationforecast 2.0 (air: wind, temp, precip). Mirrors
// met-ocean.cjs; only the upstream path differs. MET TOS requires a real
// User-Agent — injected here so the app never calls api.met.no directly.
const { corsHeaders } = require('./_cors.cjs')

const UPSTREAM   = 'https://api.met.no/weatherapi/locationforecast/2.0/complete'
const USER_AGENT = 'Sjosyn-native (kenneth222.kn@gmail.com)'

exports.handler = async (event) => {
  const cors = corsHeaders(event.headers['origin'] || event.headers['Origin'])
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: cors }
  if (event.httpMethod !== 'GET' && event.httpMethod !== 'HEAD') {
    return { statusCode: 405, headers: cors, body: 'Method not allowed' }
  }

  const url = new URL(event.rawUrl)
  const upstreamUrl = `${UPSTREAM}${url.search}`

  const ims =
    event.headers['if-modified-since'] ||
    event.headers['If-Modified-Since'] ||
    ''
  const upstreamHeaders = { 'User-Agent': USER_AGENT }
  if (ims) upstreamHeaders['If-Modified-Since'] = ims

  let upstream
  try {
    upstream = await fetch(upstreamUrl, { headers: upstreamHeaders })
  } catch (err) {
    return {
      statusCode: 502,
      headers: { 'Content-Type': 'application/json', ...cors },
      body: JSON.stringify({
        error: 'upstream_fetch_failed',
        upstream: UPSTREAM,
        message: String(err && err.message ? err.message : err),
      }),
    }
  }

  const passthrough = ['expires', 'last-modified', 'cache-control', 'age']
  const headers = {
    'Content-Type': upstream.headers.get('content-type') || 'application/json',
    ...cors,
  }
  for (const name of passthrough) {
    const v = upstream.headers.get(name)
    if (v) {
      const pretty = name.split('-').map(p => p[0].toUpperCase() + p.slice(1)).join('-')
      headers[pretty] = v
    }
  }
  if (upstream.status === 200) {
    headers['Netlify-CDN-Cache-Control'] = 'public, durable, s-maxage=1800, stale-while-revalidate=1800'
  }

  if (upstream.status === 304) {
    return { statusCode: 304, headers, body: '' }
  }
  const text = await upstream.text()
  return { statusCode: upstream.status, headers, body: text }
}
