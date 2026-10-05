// Kjør: node scripts/check-bw-ais.cjs
// Sjekker at bw-ais-proxyen videresender POST-body (BW-filteret: område/mmsi)
// med JSON-type og appens eget token, og at GET er uendret. Uten nett: fetch
// er mocket (også token-kallet til id.barentswatch.no).
const assert = require('node:assert')
process.env.BW_BG_CLIENT_ID = 'test'
process.env.BW_BG_CLIENT_SECRET = 'test'
const { handler } = require('../netlify/functions/bw-ais.cjs')

const calls = []
globalThis.fetch = async (url, init) => {
  if (String(url).includes('id.barentswatch.no')) return Response.json({ access_token: 'apptoken', expires_in: 3600 })
  calls.push({ url, ...init })
  return new Response('[]', { headers: { 'content-type': 'application/json' } })
}

;(async () => {
  const body = JSON.stringify({ modelType: 'Simple', mmsi: [257000000] })
  const r = await handler({ rawUrl: 'https://x/bw-ais/v1/latest/combined', httpMethod: 'POST', headers: { origin: 'https://localhost' }, body })
  assert.equal(r.statusCode, 200)
  assert.equal(r.headers['Access-Control-Allow-Origin'], 'https://localhost')
  assert.equal(calls[0].url, 'https://live.ais.barentswatch.no/v1/latest/combined')
  assert.equal(calls[0].method, 'POST')
  assert.equal(calls[0].body, body)
  assert.equal(calls[0].headers['Content-Type'], 'application/json')
  assert.equal(calls[0].headers.Authorization, 'Bearer apptoken')

  await handler({ rawUrl: 'https://x/bw-ais/v1/latest/combined', httpMethod: 'POST', headers: {}, isBase64Encoded: true, body: Buffer.from(body).toString('base64') })
  assert.equal(String(calls[1].body), body)

  await handler({ rawUrl: 'https://x/bw-ais/v1/latest/combined?since=x', httpMethod: 'GET', headers: {} })
  assert.equal(calls[2].method, 'GET')
  assert.equal(calls[2].body, undefined)
  assert.equal(calls[2].url, 'https://live.ais.barentswatch.no/v1/latest/combined?since=x')
  console.log('bw-ais proxy OK')
})()
