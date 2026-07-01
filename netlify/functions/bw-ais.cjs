const { corsHeaders } = require('./_cors.cjs')

exports.handler = async (event) => {
  const cors = corsHeaders(event.headers['origin'] || event.headers['Origin'])
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: cors }

  // Use rawUrl to reliably get the original path + query string
  const url = new URL(event.rawUrl)
  const subpath = url.pathname.replace(/^\/bw-ais/, '') || '/v1/latest/combined'
  const upstreamUrl = `https://live.ais.barentswatch.no${subpath}${url.search}`

  const upstream = await fetch(upstreamUrl, {
    headers: { Authorization: event.headers['authorization'] || event.headers['Authorization'] || '' },
  })

  const text = await upstream.text()
  return {
    statusCode: upstream.status,
    headers: { 'Content-Type': upstream.headers.get('content-type') || 'application/json', ...cors },
    body: text,
  }
}
