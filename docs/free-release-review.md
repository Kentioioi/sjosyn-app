# MarineWatch — legality & practicality of free release

*Researched 2026-06-12 against live primary sources (Barentswatch/Kystverket terms, Open-Meteo licence/pricing, CARTO docs, OpenSeaMap FAQ, Datatilsynet/ekomloven 2025, Norwegian information-liability doctrine, Netlify pricing). Verdicts: ✅ permitted · ⚠️ permitted with conditions · ❗ action required.*

## Verdict per dependency

### 1. Barentswatch AIS API — ⚠️ permitted with conditions (verified 3-0, high confidence)
- Open AIS data is **NLOD-licensed** open government data (owner: Kystverket). Reuse, redistribution and proxying through Netlify Functions are **explicitly permitted** — even commercially, so a free app qualifies a fortiori.
- **Conditions from the API terms:**
  - ❗ **Mandatory visible marking**: `Data levert av BarentsWatch` (or "Data delivered by BarentsWatch"), linked if possible, **clearly visible to the end user when using or starting the application**. A settings-page mention is not sufficient. *(Currently missing — must add.)*
  - Credit the data owner (Kystverket). Recommended combined credit: **"Data levert av BarentsWatch (kilde: Kystverket)"**.
  - Do not alter data content; do not present the app as a BarentsWatch product; do not use "BarentsWatch" in the app name (MarineWatch is fine).
  - Registration is per user account: each API client is tied to a barentswatch.no/minside user. The current design (each user enters their own credentials, stored on-device, PIN-encrypted) **is the compliant mechanism**. Sharing one credential among 7–8 people is neither sanctioned nor expressly forbidden — per-user clients are the safe choice.
  - Terms ask developers to **contact Barentswatch before high-traffic use** (possible server-handling fees). Before a public release: email post@barentswatch.no.
- **Hard limit:** the *extended* AIS dataset (fishing vessels <15 m, recreational craft <45 m) is purpose-bound, registration-gated and **bans third-party distribution**. MarineWatch must stay on the open feed — small recreational vessels will simply not appear, and that's correct.

### 2. Open-Meteo Marine + Elevation — ⚠️ permitted with conditions (verified, high confidence)
- Free tier is for **non-commercial use** as defined by Creative Commons; the terms' own qualifying example is *"private or non-profit websites or apps that do not have subscriptions or advertising"*. MarineWatch qualifies both privately and as a public free release, as long as it stays ad-free and revenue-free.
- Licence is **CC-BY 4.0** with a prescribed attribution: `<a href="https://open-meteo.com/">Weather data by Open-Meteo.com</a>` — and it must appear **"next to any location Open-Meteo data are displayed"**. ❗ *The current credit ("Bølgedata: open-meteo.com" in settings) does not meet the placement requirement — add the linked credit to the map's attribution line when the wave layer is on.*
- Limits: **<10 000 calls/day, 5 000/hour, 600/minute**. The pricing page defines fractional weighting for variables/time-span; per the maintainer, batched multi-location requests weigh roughly per location. With the app's 30-min cell cache, backoff and elevation cache, 7–8 users are far inside the limits; a busy public release would need self-hosting (the API is open-source) or a paid plan.

### 3. CARTO basemaps — ⚠️ permitted with conditions (medium confidence — greyest area)
- CARTO's docs state the basemaps **can be used for free in applications for non-commercial purposes**; commercial use requires an Enterprise licence. Historic basemap terms capped free use around 75 000 map views/month — far above this app's scale.
- Attribution "© CARTO © OSM" is required and already displayed ✅. OSM data within requires "© OpenStreetMap contributors" credit (covered by the existing line).
- The 7-day service-worker tile cache reduces load on their CDN; no published policy prohibits client-side caching.
- **Risk**: these endpoints are offered, not contractually guaranteed — CARTO can change terms. At hobby scale this is normal practice (used by countless Leaflet apps), but keep a fallback in mind (OSM-based raster providers) if it ever breaks.

### 4. OpenSeaMap overlay — ✅ permitted (attribution already in place)
- Tiles are **CC-BY-SA 2.0**, data ODbL; reuse including commercial is allowed with attribution. The app credits "© OpenSeaMap" ✅.
- Volunteer-run server: the overlay only loads when toggled on, and the tile cache reduces repeat load — polite use ✅. Note OpenSeaMap's own stance: their charts are not for navigation, which reinforces the disclaimer below.

### 5. Liability / "ikke for navigasjon" — ❗ disclaimer strongly recommended
- Norwegian law has **no strict liability** for incorrect information services; claims require **negligence (ulovfestet culpaansvar)** and foreseeable, proximate loss. Case law in this area is nearly nonexistent.
- **Disclaimers are customary and largely effective** for free information services (within avtaleloven § 36 limits — you can't disclaim gross negligence). Courts apply a *higher* standard of care where physical safety is involved — which is exactly why maritime apps universally carry "not for navigation" wording.
- A free app + honest labeling + a visible disclaimer ≈ very low practical exposure for a private person. Recommended Norwegian text (first launch + settings):

  > **MarineWatch er kun til informasjon og skal ikke brukes til navigasjon.** AIS-posisjoner kan være forsinket eller mangle, og bølgedata er modellbaserte varsler uten garanti. Bruk offisielle sjøkart og godkjente kilder for navigasjon og sikkerhet. All bruk skjer på eget ansvar.

### 6. GDPR / ekomloven (privacy) — ✅ compliant as designed
- **Private 7–8 group:** effectively within GDPR's household sphere; no policy required.
- **Public release:** the app stores credentials/preferences in localStorage only, transmits no personal data to any backend, has no analytics. Under **ekomloven § 3-15 (in force 1 Jan 2025)**, storage that is *"strengt nødvendig"* to deliver the service the user requested is **exempt from consent** — exactly this app's storage. **No cookie banner needed.** The PWA tile cache and PIN session storage are likewise functional.
- Good practice for a public release: a one-paragraph privacy note ("everything stays on your device; we collect nothing") in settings. Cheap, builds trust, ends questions.

### 7. Practical scaling — ✅ free at current scale, with one surprise
- **Netlify now uses a credit model**: Free plan = **300 credits/month**; production deploys cost **15 credits each**, bandwidth 20 credits/GB, web requests 2 credits/10k, compute 10 credits/GB-hour.
  - For 7–8 casual users, AIS proxy traffic ≈ a few GB/month ≈ 60–120 credits. Manageable.
  - **The hidden cost is deploys**: 10 pushes a month = 150 credits, half the budget. This is what drained the credits earlier. Mitigation: batch changes into fewer pushes, or disable auto-deploy for trivial commits.
- The wave layer costs Netlify **nothing** (browser → Open-Meteo direct).
- **If the app goes public** with hundreds of users, AIS proxy bandwidth breaks first. Cheapest mitigation: move the two tiny proxy functions (`bw-token`, `bw-ais`) to **Cloudflare Workers' free tier** (100k requests/day, no bandwidth metering) and keep Netlify for static hosting — or pay Netlify. Also re-contact Barentswatch per their high-traffic clause.

## Action list
| # | Action | Status |
|---|---|---|
| 1 | Add visible **"Data levert av BarentsWatch (kilde: Kystverket)"** marking at app start/on map | ❗ required by API terms |
| 2 | Move Open-Meteo credit to the **map attribution line** as linked "Weather data by Open-Meteo.com" (when layer on) | ❗ required by CC-BY placement |
| 3 | Add **"ikke for navigasjon"** disclaimer (first launch + settings) | strongly recommended |
| 4 | Privacy one-liner in settings ("alt lagres kun på din enhet") | recommended before public release |
| 5 | Email post@barentswatch.no before any public launch | required by high-traffic clause |
| 6 | Batch pushes to conserve Netlify deploy credits; consider Cloudflare Workers for the AIS proxy if going public | practicality |

## CARTO alternatives if the app is later priced (commercial)

CARTO fails both easy outs: commercial basemap use is **contact-sales/Enterprise only** (no self-serve monthly price, no credit-only path) — verified on their pricing page 2026-06-12. If MarineWatch ever charges users, the basemap must be swapped. Options, easiest first:

| Option | Cost (commercial) | Migration effort | Notes |
|---|---|---|---|
| **Stadia Maps** (recommended) | **$20/mo** Starter, 1M credits | ~Zero — change 3 tile-URL strings in `MAP_STYLES` | Raster tiles for Leaflet incl. **Alidade Smooth Dark/Smooth** — the closest visual match to the current CARTO dark/light styles. Free 200k credits/mo tier remains for the non-commercial phase. |
| **MapTiler Flex** | $25/mo, 500k requests | ~Zero — URL swap | Raster + vector + WMTS; dark/light styles available. |
| **Protomaps (PMTiles on Cloudflare R2) or OpenFreeMap** | **$0 at any scale**, commercial allowed (OSM/ODbL + attribution) | ~1 day — swap Leaflet raster for MapLibre GL vector rendering | The route if recurring fees must be zero; self-hosted = nobody can change terms under you. |
| **Mapbox pay-as-you-go** | Free monthly allowance, then usage-based | Small — token + raster endpoint | Scales with revenue; vendor lock-in and per-use billing. |

**Knock-ons if the app is priced** (per the "cheap subscription / credit-only ⇒ no alternatives needed" rule):
- **Open-Meteo** → commercial requires their paid API (Standard: 1M calls/mo, roughly €30/mo) — cheap subscription, no alternative needed. (It's also open-source and can be self-hosted for $0 if desired.)
- **Barentswatch** → NLOD permits commercial use; crediting + notifying them is all — no alternative needed.
- **OpenSeaMap** → CC-BY-SA crediting only — no alternative needed.

So CARTO is the **only** dependency that forces a swap on commercialization, and the swap is a three-line change if Stadia/MapTiler is chosen.

## Bottom line
Offering MarineWatch **free to the current group is legal and practical today** — every data source permits it, the per-user credential design is exactly what Barentswatch's terms envision, and costs stay at zero (minus deploy-credit discipline). A **public free release is also viable** provided the app stays ad-free, the three attribution/disclaimer gaps above are fixed first, Barentswatch is notified, and the AIS proxy is moved somewhere bandwidth-free if usage grows. The main legal exposures are the missing mandatory Barentswatch marking and the misplaced Open-Meteo credit — both are 15-minute fixes. *(This is research, not legal advice; a public launch at scale would warrant a qualified review.)*
