const { corsHeaders } = require('./_cors.cjs')
const { getBwToken } = require('./_bwToken.cjs')

exports.handler = async (event) => {
  const cors = corsHeaders(event.headers['origin'] || event.headers['Origin'])
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: cors }

  // Use rawUrl to reliably get the original path + query string
  const url = new URL(event.rawUrl)
  const subpath = url.pathname.replace(/^\/bw-ais/, '') || '/v1/latest/combined'

  // Saniter: ingen traversering, ingen backslash, ingen protokoll-relative
  // triks — må være et absolutt sti-segment.
  if (
    subpath.includes('..') ||
    subpath.includes('\\') ||
    subpath.startsWith('//') ||
    !subpath.startsWith('/')
  ) {
    return { statusCode: 400, headers: cors, body: 'Bad request' }
  }

  const upstreamUrl = `https://live.ais.barentswatch.no${subpath}${url.search}`
  // POST: BW filtrerer (område/mmsi) kun via JSON-body — videresend den.
  const isPost = event.httpMethod === 'POST'

  let token
  try { token = await getBwToken() }
  catch (err) {
    return { statusCode: 502, headers: { 'Content-Type': 'application/json', ...cors }, body: JSON.stringify({ error: 'bw_token_failed', message: String(err.message || err) }) }
  }

  let upstream
  try {
    upstream = await fetch(upstreamUrl, {
      method: isPost ? 'POST' : 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        ...(isPost && { 'Content-Type': 'application/json' }),
      },
      body: isPost ? (event.isBase64Encoded ? Buffer.from(event.body || '', 'base64') : event.body) : undefined,
      signal: AbortSignal.timeout(8000),
    })
  } catch {
    return {
      statusCode: 502,
      headers: { 'Content-Type': 'application/json', ...cors },
      body: JSON.stringify({ error: 'upstream_unavailable' }),
    }
  }

  const text = await upstream.text()
  return {
    statusCode: upstream.status,
    headers: { 'Content-Type': upstream.headers.get('content-type') || 'application/json', ...cors },
    body: text,
  }
}
