const { corsHeaders } = require('./_cors.cjs')

exports.handler = async (event) => {
  const cors = corsHeaders(event.headers['origin'] || event.headers['Origin'])
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: cors }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: cors, body: 'Method not allowed' }
  }

  const upstream = await fetch('https://id.barentswatch.no/connect/token', {
    method: 'POST',
    headers: {
      'Content-Type': event.headers['content-type'] || 'application/x-www-form-urlencoded',
    },
    body: event.body,
  })

  const text = await upstream.text()
  return {
    statusCode: upstream.status,
    headers: { 'Content-Type': upstream.headers.get('content-type') || 'application/json', ...cors },
    body: text,
  }
}
