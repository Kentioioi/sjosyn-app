export const meta = {
  name: 'xr-timeline-research-r4',
  description: 'Round 4 research (primary copies, public LinkedIn trail, regulatory, trade, HKEX, Newsweb, Program B) then JSONify each file',
  phases: [
    { title: 'Research', detail: 'one deep-research agent per scope, writes a markdown file' },
    { title: 'JSONify', detail: 'Sonnet converts each research file into timeline rows' },
  ],
}
const R = '/tmp/claude-0/-home-user-sjosyn-app/cc62af71-3feb-5cb9-a40f-5be92e14d1d4/scratchpad/research'
const E = `${R}/entities4`
const PRE = (k) => `Today is 2026-10-08. Read ${R}/BRIEF.md and then ${R}/BRIEF4.md completely before you start; follow their rules (public sources only, never log in, no Save Page Now, downloads only into ${E}/dl_${k}/, python3 -I for downloaded data). Write your findings to ${E}/${k}.md in the BRIEF.md structure (timeline table rows with date, precision, category, event, source URL, source type, confidence). Your scope:\n`
const SCOPES = {
  primary: `PRIMARY COPIES of the evidence the estimate hangs on.
1. DBS Q Tech note (1478 HK, 2026-08-26, Jim Au, BUY, TP HKD 12.60). Download https://www.dbs.com/content/article/pdf/000000_HK/1478_HK.pdf with curl into ${E}/dl_primary/ (also try the dbs.com.hk 'treasures' URL for the same note if you find it). That URL is a rolling "latest report" link, so first record the report date and title printed in the PDF you received, page count and sha256. If it is the 2026-08-26 note, extract page 4 with pdftotext -f 4 -l 4 and quote verbatim every sentence mentioning Meta, poLight, tunable, 1H27, Samsung or optical engine; also report every other page that mentions them. If DBS has since issued a newer Q Tech note, read that too and record whether the Meta/poLight sentence survives. Check DBS's 2026-05-08 Meta Platforms note (https://www.dbs.com/content/article/pdf/US_clover/Meta_Platforms.pdf) for any poLight/Q Tech/tunable mention.
2. Meta developer page https://developers.meta.com/vr/discover/meta-vr-glasses/ : fetch the live page (WebFetch, else Firecrawl scrape) and quote verbatim every spec line about cameras, passthrough, autofocus, depth, resolution, weight, battery, puck. Query existing archive captures (https://archive.org/wayback/available?url=developers.meta.com/vr/discover/meta-vr-glasses/ and http://web.archive.org/cdx/search/cdx?url=developers.meta.com/vr/discover/meta-vr-glasses*&output=json&limit=50): earliest and latest capture timestamps; open the earliest capture and record whether the autofocus wording was present at announcement. Save the live HTML/markdown into ${E}/dl_primary/.
3. Meta's other official pages for the VR Glasses (meta.com product page, about.fb.com newsroom post of 2026-09-23, Connect keynote transcript or video description, developer blog posts, Horizon OS docs, any spec sheet or FAQ): every mention of autofocus, focus, camera count, camera MP, passthrough latency, "variable focus", "varifocal". Then hands-on coverage (UploadVR, Road to VR, The Verge, Android Central, MIXED, Tom's Guide, CNET) that quotes Meta staff on how passthrough autofocus works (moving lens, liquid lens, piezo, MEMS?) — exact quotes with dates.
4. poLight primary announcements 2026-08-20 to 2026-10-08 (Newsweb / polight.com/mfn_news / mfn.se): any new PO, design-in/design-win, CMD 2026-10-30 invitation and agenda (does it mention AR|MR programs, a customer speaker, Q Tech?), Q3 date, presentations at conferences in Sep–Oct 2026 (Pareto, DNB, ABG, Arctic tech conferences) and what the CEO said.
State explicitly which dataset rows these primary copies upgrade (the developer-page row is tagged rumor; an old DBS row calls the sentence unverified).`,
  linkedin: `PUBLIC LINKEDIN AND JOB-POST TRAIL — public search engines only (see the LinkedIn rule in BRIEF4.md).
For each item below, establish what is publicly verifiable: the original public URL (if a search engine returns one), the date, the exact original wording (English original vs the auto-translated forum screenshot), and whether it names a technology (piezo, membrane, liquid, VCM, MEMS) or supplier. Use exact-phrase searches in WebSearch (extended mode) and mcp__Firecrawl__firecrawl_search, with and without site:linkedin.com, plus Bing/DuckDuckGo-style variants.
(1) Reality Labs software engineer Saeid "Sai" Bagheri's post that he "led the autofocus work" on Meta VR Glasses ("years of effort across the whole stack").
(2) Former Meta DFx manufacturing engineer (now at Avegant): "DRI for TLens camera process development" / "drove 2 Eng mini-builds" — confirm the phrase in a public index and the Meta employment window; describe by role, do not name unless already public in press.
(3) Bay Area module-integration lead: "NTI dToF/TLens camera module process developments with dual Active Alignments" — which employer, which years.
(4) Lidu Huang (named inventor on Meta tunable-lens patents): profile wording "miniature piezoelectric tunable lens AF camera module", Meta tenure dates (Sep/Dec 2020–Apr 2025 vs earlier), Apple years, current employer.
(5) Hon Hai/Foxconn Taoyuan engineer: "TLens fast-focus camera module driver development" (Jan–Jun 2024; customers Microsoft/Amazon/Varjo).
(6) NEW: any other public post, profile snippet, conference bio, patent-inventor page or résumé site (e.g. RocketReach/ZoomInfo public snippets, personal sites, GitHub, Google Scholar) that pairs TLens or poLight with Meta, Reality Labs, Oculus, Q Tech, Goertek, Luxshare or Sunny, 2023–2026. Search patterns like "TLens" "Reality Labs", "poLight" "Meta" engineer, "tunable lens" "Reality Labs" camera module, "TLens" camera module Meta.
(7) NEW: Meta, Q Tech, Goertek and Luxshare job postings 2025–2026 (careers pages, Indeed, Glassdoor public listings, Chinese boards like BOSS直聘/猎聘/智联 public pages) that mention TLens, poLight, tunable lens, piezo lens, 液态镜头/可变焦镜头 together with VR/AR/XR or Meta; record posting dates and quotes. Note which ones are already in the dataset per BRIEF4 and add only new ones.
For each item give a verdict: verified-public (URL + quote), partially verified, login-gated, not found.`,
  regulatory: `REGULATORY FILINGS that could reveal the VR Glasses hardware before launch, and Meta's historical filing→launch cadence.
1. FCC: identify Meta Platforms Technologies' grantee code(s) (Oculus-era and Meta-era; check fccid.io, fcc.report, apps.fcc.gov/oetcf/eas). List every grant 2024-01 to 2026-10 with grant date, FCC ID, model number, equipment class, short-term confidentiality date, and the product it became (Quest 3S, Ray-Ban Meta Gen 2, Oakley Meta HSTN/Vanguard, Meta Ray-Ban Display, Meta Neural Band, Quest controllers, …). Compute filing→announcement and filing→ship lags. Flag any 2026 grant not yet matched to a launched product (candidate VR Glasses, puck, controller). Check whether user manuals/test reports for those grants mention cameras or autofocus.
2. Bluetooth SIG Launch Studio, Wi-Fi Alliance certifications, Korea RRA/KC (rra.go.kr), Japan MIC Giteki, Taiwan NCC, China SRRC/CMIIT/TENAA/CCC, Indonesia SDPPI, India BIS/WPC, Brazil Anatel, EU EPREL: any Meta listing 2026 that could be the VR Glasses or its puck; same historical lags where available.
3. Competitors' 2026 filings with camera details: Samsung SM-O200P/SM-O200J (FCC 2026-10-01 — do its exhibits mention autofocus or the camera module?), Pico / ByteDance, Alibaba Quark/Qwen glasses, Snap Specs, Xreal, Google partners: grant dates, and any camera/AF detail.
4. Produce: a table of Meta filing→launch lags, and a dated expected window for VR Glasses FCC/KC filings given a spring-2027 launch; note what an FCC filing could and could not reveal (internal photos usually confidential for 45–180 days).`,
  trade: `TRADE AND SHIPMENT EVIDENCE for poLight TLens / PZT dies flowing to camera-module makers or assemblers, and production-ramp signals for the VR Glasses.
1. Identify poLight's Philippine assembly and test partners (annual reports 2021–2025, prospectus, Q reports, Q&A transcripts) and the ST Microelectronics piezo fab (Agrate, Italy?) — names, roles, any capacity numbers.
2. Q Tech's Philippines plant from the TDK actuator deal: location (e.g. Batangas/Laguna/Cebu), what it makes, staff, whether it can assemble camera modules; relate to the CEO's 2026-08-19 remark that programme units are "likely coming from the Philippines".
3. Public shipment data: ImportYeti (free US bill-of-lading search), Volza, Panjiva / ImportGenius / Trademo public previews, India and Latin-American customs data aggregators: search shipper/consignee names "poLight", "Polight AS/ASA", "Q Technology", "Kunshan Q Technology", "Actutek", "TDK Philippines", "Goertek", "Sunny Optical" with Philippines, Italy or Norway origin; record what is visible for free and dates.
4. Aggregate statistics: Philippine Statistics Authority export data and UN Comtrade (public API/website) for HS 9002/9013/8529/8541 Philippines→China/Vietnam monthly 2025–2026 — only if retrievable; note limits.
5. Production-ramp reporting for Meta VR Glasses: Digitimes, TrendForce, Counterpoint, IDC, Wellsenn XR, Chinese supply-chain media (2026-07 to 2026-10) on build volumes, ramp timing, Goertek Vietnam/Weifang lines, camera-module allocations.
6. poLight's own unit-shipment disclosures 2025–2026 by quarter (TLens units delivered) as a baseline.
Be explicit about every source that is paywalled or not public.`,
  qtech: `Q TECHNOLOGY (1478.HK) PRIMARY FILINGS 2025–2026 (HKEXnews full-text search, qtechsmartvision.com investor pages; PDFs via Firecrawl parsers ["pdf"] or curl+pdftotext into ${E}/dl_qtech/).
1. Monthly voluntary announcements of production/sales volumes: tabulate every month Jan 2025 – Sep 2026 (camera modules total, ≥32MP share, fingerprint modules, any new IoT/vehicle/smart-glasses category); note month-on-month and year-on-year changes and any new category wording around 2026-H2.
2. 2026 interim report (period to 2026-06-30, published ~Aug/Sep 2026): notes on the investment in associate poLight (stake %, share of loss, carrying value, impairment test), related-party transactions with poLight (TLens purchases, licence fees, equipment, prepayments), commitments/capex for the TLens line, segment wording on XR/AR/smart glasses, and any mention of a US customer.
3. The 2026-07-27 connected-transaction announcement and any later circular/EGM: counterparties (Heyuan Yova, Actutek, QT Investment group …), annual caps (RMB 325m/765m/870m), stated purpose and actuator types (VCM, SMA, OIS, piezo?), and whether TLens/poLight appears.
4. Any HKEX announcement concerning poLight (share subscriptions, voting, board nominations, disclosure of interests) 2025–2026.
5. Interim-results presentation (~2026-08-24) and any Sep–Oct 2026 IR material: exact XR/AR slide wording (overseas key customer, VR VST TLens AF camera, AR mono engine, ramp timing).
Give dated rows; quote exact phrases.`,
  newsweb: `poLight ASA (PLT, Oslo Børs) MARKET-DATA SIGNALS 2025-01 to 2026-10-08.
1. Every PDMR / primary-insider transaction notice on Newsweb (newsweb.oslobors.no, also mfn.se/a/polight and polight.com/mfn_news): date, role, shares, price, buy / sell / option exercise / subscription. Note clusters relative to program news (POs, design-in 2026-07-10, Q2 2026-08-06, Connect 2026-09-23).
2. Major-shareholding flaggings (Q Tech's stake changes, others crossing 5/10/15/20/25/30%).
3. Top-20 shareholder lists (poLight IR page, Euronext VPS snapshots via Newsweb or Nordnet/Investtech/aksjeanalyse public pages): latest available vs mid-2026; changes in funds.
4. Norwegian short-selling register (Finanstilsynet SSR, https://ssr.finanstilsynet.no/) positions in PLT during 2026.
5. Share issues, warrants, option grants, AGM/EGM resolutions 2026.
6. CMD 2026-10-30 invitation and Q3 2026 report date notice (exact wording; any agenda).
7. New Investorweb Q&A answers: POST https://investorweb.co/functions/getPublicQAIndex with JSON {"limit":5000} (save the JSON into ${E}/dl_newsweb/ and read it with python3 -I); list every question/answer dated after 2026-09-15 about Program A/B/C, design-in vs design-win, Meta, Q Tech line, Philippines, CMD. Quote the CEO's answers exactly.
Interpret cautiously what insider and holder behaviour does and does not indicate.`,
  programb: `IDENTIFY poLight's PROGRAM B and test the candidates (see BRIEF4.md for Program B's clues: "leading consumer OEM", AR|MR, POs Nov 2025 – Jul 2026, first consumer design-in 2026-07-10, launch expected 2026, "U.S. and China, you pick", "big guy behind the PO").
1. List every AR / MR / AI-glasses / headset product launched or scheduled 2026-07 to 2027-01 that has a camera: Alibaba Quark / Qwen glasses (incl. a "Qwen N1" reportedly on sale 2026-10-13), Pico Space Pro / "Swan", Snap Specs (fall 2026), Samsung SM-O200P/J (Nov 2026), Xreal Aura / ROG Xreal R1, Rokid, RayNeo X3 Pro / V3, INMO, Meizu StarV, Xiaomi AI glasses 2nd gen, Huawei, Lenovo, Viture, Even Realities, Amazon, Google partners (Warby Parker, Gentle Monster, Kering), Brilliant Labs, Mentra, Halliday, Rokid, Thunderbird. For each: announce and on-sale dates, camera spec (MP, FOV, and the exact autofocus wording or its absence on the official spec page), known camera-module/ODM supplier, price, volume expectations, teardown availability.
2. Score each candidate against Program B's clues (consumer; AR|MR not plain camera glasses; launch in 2026; U.S. or Chinese OEM; "big"; order cadence Nov 2025 → Jul 2026 design-in). Rule candidates out with dated reasons.
3. Search official product pages, Chinese press (36Kr, IT之家, 新浪, 腾讯, 雷锋网, VR陀螺, 映维网), Weibo/Bilibili launch posts and teardown channels (52audio 我爱音频网, iFixit, TechInsights, System Plus) for "TLens", "T-Lens", "poLight", "压电液态镜头", "压电式可变焦", "可变焦镜头 自动对焦 眼镜" in 2026 products.
4. Varjo XR-4 Focal Edition (announced 2023-11-27, the day poLight declared an MR-headset design-win): any teardown or official statement confirming TLens; use it to test poLight's "same-day disclosure" precedent.
5. Conclude with a ranked candidate list for Program B with probabilities and what would confirm each (teardown dates, launch events).`,
}
const LANES = `Allowed lane ids (use ONLY these; group in parentheses):
producer: meta (Meta), apple (Apple), google (Google / Android XR), samsung (Samsung), snap (Snap), xreal (Xreal), rokid (Rokid), rayneo (RayNeo / TCL), even (Even Realities), amazon (Amazon), alibaba (Alibaba Quark), xiaomi (Xiaomi), otheroem (Other producers: Vuzix, Magic Leap, Huawei, Lenovo, HTC, Pico/ByteDance, Valve, Sony, Microsoft, Viture, Brilliant Labs, Halliday, Mentra, INMO, Meizu, Varjo …)
supplier: polight (poLight TLens), qtech (Q Technology), cml (Cambridge Mechatronics), optotune (Optotune), varioptic (Corning Varioptic), sheba (Sheba Microsystems), vcm (VCM/SMA actuator makers: Alps Alpine, MinebeaMitsumi, TDK, SEMCO, LG Innotek, Jahwa…), modules (Camera-module & assembly chain: Goertek, Luxshare, Sunny, LG Innotek, Cowell, STMicro, Tong Hsing…), metaip (Meta patents & people evidence, incl. Meta job posts and public profiles), analysts (Analyst, broker & press claims: DBS, Pareto, Arctic, The Information, Bloomberg…)`
const SCHEMA = {
  type: 'object', required: ['events', 'windows', 'lane_blurbs'],
  properties: {
    events: { type: 'array', items: { type: 'object', required: ['lane', 'date', 'precision', 'cat', 'type', 'title', 'detail', 'url', 'src', 'conf', 'key'], properties: {
      lane: { type: 'string' }, date: { type: 'string', description: 'YYYY-MM-DD | YYYY-MM | YYYY-Qn | YYYY-Hn | YYYY' }, precision: { type: 'string', enum: ['day', 'month', 'quarter', 'half', 'year'] },
      cat: { type: 'string', enum: ['product', 'commercial', 'ip', 'press'] },
      type: { type: 'string', enum: ['product_release', 'announcement', 'roadmap', 'order', 'design_in', 'qualification', 'partnership', 'financing', 'capacity', 'earnings', 'patent', 'hire', 'paper', 'teardown', 'analyst_report', 'press', 'rumor', 'other'] },
      title: { type: 'string', description: '≤ 90 chars, specific, with the number/amount if any' }, detail: { type: 'string', description: '1–3 sentences: what exactly was said, by whom, exact quote for key wording; for verification items say what was verified and how' },
      url: { type: 'string' }, src: { type: 'string', enum: ['company', 'exchange', 'patent_office', 'press', 'analyst', 'forum', 'other'] },
      conf: { type: 'string', enum: ['confirmed', 'strong', 'circumstantial', 'rumor'] }, key: { type: 'boolean' },
      label: { type: 'string' },
    } } },
    windows: { type: 'array', items: { type: 'object', required: ['lane', 'start', 'end', 'cat', 'title', 'detail', 'url', 'conf'], properties: {
      lane: { type: 'string' }, start: { type: 'string' }, end: { type: 'string' }, cat: { type: 'string', enum: ['product', 'commercial', 'ip', 'press'] }, title: { type: 'string' }, detail: { type: 'string' }, url: { type: 'string' }, conf: { type: 'string', enum: ['confirmed', 'strong', 'circumstantial', 'rumor'] } } } },
    lane_blurbs: { type: 'array', items: { type: 'object', required: ['lane', 'blurb'], properties: { lane: { type: 'string' }, blurb: { type: 'string' } } } },
  },
}
const jsonPrompt = (f) => `Read the research file ${f} completely (use Read with offset/limit in several calls if it is long). Convert EVERY dated row of its timeline tables and future-events tables into the structured output. Rules:
- ${LANES}
- Future launches and expected filings/events are windows (start/end = the reported window; "spring 2027" → 2027-03-01..2027-05-31; "H1 2027" → 2027-01-01..2027-06-30; a specific day → start=end). Past launches are events (type product_release).
- Keep dates exactly as sourced; precision must match the date format. Never invent a day.
- url must be the row's source URL (copy exactly); if none, write "" and set conf no higher than circumstantial.
- conf: confirmed = primary source (company/exchange/regulator/patent office) seen; strong = multiple reputable press; circumstantial = inference; rumor = forum/unnamed-source press or unverified screenshot.
- Rows that only VERIFY an existing claim (e.g. a primary copy of the DBS page or Meta's developer page) are events too: date = the source's own date, detail = what the primary copy says verbatim and how it was obtained.
- key=true for events that bear directly on whether poLight or a competitor is in a top-tier glasses product.
- Do NOT create rows for "not found" results; those belong in the research file's Gaps only.
Be exhaustive: more rows is better than fewer.`
phase('Research')
const out = await pipeline(args.keys,
  k => agent(PRE(k) + SCOPES[k], { label: `research:${k}`, phase: 'Research', effort: 'high', model: 'sonnet' }).then(r => (r === null ? null : k)),
  k => agent(jsonPrompt(`${E}/${k}.md`), { label: `jsonify:${k}.md`, phase: 'JSONify', schema: SCHEMA, effort: 'high', model: 'sonnet' }).then(r => ({ k, events: r ? r.events.length : null, windows: r ? r.windows.length : null })))
log(`done: ${JSON.stringify(out)}`)
return out
