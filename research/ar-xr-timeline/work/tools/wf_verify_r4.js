export const meta = {
  name: 'r4-verify',
  description: 'Two-lens fact-check (dates lens + claims lens) of the load-bearing round-4 rows against their cited sources',
  phases: [{ title: 'Verify', detail: 'one dates-lens and one claims-lens checker per batch' }],
}
const D = args.dir
const VSCHEMA = { type: 'object', required: ['results'], properties: { results: { type: 'array', items: { type: 'object', required: ['id', 'verdict', 'note'], properties: {
  id: { type: 'string' },
  verdict: { type: 'string', enum: ['confirmed', 'date_wrong', 'claim_wrong', 'partially_supported', 'source_unreachable', 'not_found'] },
  corrected_date: { type: 'string' }, corrected_precision: { type: 'string' }, corrected_start: { type: 'string' }, corrected_end: { type: 'string' },
  corrected_conf: { type: 'string', description: 'confirmed|strong|circumstantial|rumor or empty' },
  found_url: { type: 'string', description: 'primary URL you verified against, or empty' },
  note: { type: 'string', description: '<= 40 words: what the source actually says (quote key words)' } } } } } }
const COMMON = (b) => `Today is 2026-10-08. Read ${D}/verify/batch_${b}.json — a JSON array of dated timeline rows (events with date/precision, or windows with start/end), each with title, detail, cited url and stated confidence. For EVERY item open the cited url (WebFetch; for PDFs use mcp__Firecrawl__firecrawl_scrape with parsers ["pdf"]; load tools with ToolSearch first). If the url is missing, a search page, or unreachable, run one WebSearch (extended mode) for a primary source and record it in found_url. Public sources only: never log in anywhere; for LinkedIn items use only what search engines show or what a public post renders without login (if login-gated, verdict source_unreachable with a note). Default to skepticism: a fact is supported only if you saw it. Return one result per item (every id in the file).`
const datesPrompt = (b) => `You are the DATES-lens fact-checker. ${COMMON(b)}
Check ONLY chronology: the row's date (or window) is what the source says, with the right precision (YYYY-MM-DD=day, YYYY-MM=month, YYYY-Qn=quarter); for regulatory rows the grant/filing date; for windows, that start/end follow from the stated facts (e.g. FCC-to-launch lags computed from the listed grants). Verdict confirmed when exact; date_wrong with corrected_* when the source gives a different date/precision; partially_supported when only part checks out.`
const claimsPrompt = (b) => `You are the CLAIMS-lens fact-checker. ${COMMON(b)}
Check the substance: amounts, currencies, model numbers, share counts, prices, product names and every quoted phrase are in the source; the actor is right (a company statement vs an analyst/press/forum claim); the stated confidence is justified (confirmed only for company/exchange/regulator/patent-office sources you saw). Verdict claim_wrong when a key fact is contradicted, partially_supported when the source supports only part, confirmed when all key facts are seen.`
phase('Verify')
const out = await pipeline(args.batches, b => parallel([
  () => agent(datesPrompt(b), { label: `verify:${b}:dates`, phase: 'Verify', schema: VSCHEMA, effort: 'high', model: 'sonnet' }),
  () => agent(claimsPrompt(b), { label: `verify:${b}:claims`, phase: 'Verify', schema: VSCHEMA, effort: 'high', model: 'sonnet' }),
]))
return out.map((r, i) => ({ batch: args.batches[i], dates: r && r[0] ? r[0].results.length : null, claims: r && r[1] ? r[1].results.length : null }))
