// Proxy → MET Norway locationforecast 2.0 (air: wind, temp, precip). Mirrors
// met-ocean.cjs; only the upstream path differs. MET TOS requires a real
// User-Agent — injected here so the app never calls api.met.no directly.
const { corsHeaders } = require('./_cors.cjs')

const UPSTREAM   = 'https://api.met.no/weatherapi/locationforecast/2.0/complete'
const USER_AGENT = 'Sjosyn-native (kenneth222.kn@gmail.com)'

// Appen bruker bare vind (fart, retning, kast). Svaret slankes fra ~90 KB til
// ~11 KB per celle — samme JSON-form, så klienten er uendret. Opptil 140 celler
// per kartutsnitt → mye mindre nedlasting og JSON-parsing på mobil.
const KEEP = ['wind_speed', 'wind_from_direction', 'wind_speed_of_gust']
function slim(text) {
  try {
    const d = JSON.parse(text)
    const ts = d?.properties?.timeseries
    if (!Array.isArray(ts)) return text
    return JSON.stringify({
      type: d.type,
      geometry: d.geometry,
      properties: {
        meta: d.properties.meta,
        timeseries: ts.map(e => {
          const src = e?.data?.instant?.details || {}
          const details = {}
          for (const k of KEEP) if (src[k] != null) details[k] = src[k]
          return { time: e.time, data: { instant: { details } } }
        }),
      },
    })
  } catch {
    return text
  }
}

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
    upstream = await fetch(upstreamUrl, {
      headers: upstreamHeaders,
      signal: AbortSignal.timeout(8000),
    })
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
  return { statusCode: upstream.status, headers, body: upstream.status === 200 ? slim(text) : text }
}
