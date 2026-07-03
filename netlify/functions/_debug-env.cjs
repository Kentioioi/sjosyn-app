// TEMPORARY diagnostic — reveals only length/whitespace metadata, never the
// actual secret content. Delete after debugging the invalid_client issue.
exports.handler = async () => {
  const id = process.env.BW_BG_CLIENT_ID || ''
  const secret = process.env.BW_BG_CLIENT_SECRET || ''
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      idSet: !!process.env.BW_BG_CLIENT_ID,
      idLength: id.length,
      idFirst4: id.slice(0, 4),
      idLast4: id.slice(-4),
      secretSet: !!process.env.BW_BG_CLIENT_SECRET,
      secretLength: secret.length,
      secretLeadingSpace: /^\s/.test(secret),
      secretTrailingSpace: /\s$/.test(secret),
      secretNewline: /[\r\n]/.test(secret),
      sameAsId: id === secret,
    }),
  }
}
