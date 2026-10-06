# Research brief — poLight vs. competitors: timelines toward top-tier AR/VR/XR glasses

Today's date: **2026-10-06**. Your training data likely ends before mid-2026; everything after that must come from the web. Treat anything you "remember" about 2026 as a hypothesis to verify.

## Goal of the overall project
The user (a poLight ASA shareholder, Norwegian) wants a **timeline map**: for poLight and every competing autofocus / tunable-lens supplier, the dated public signals that point toward them being designed into top-tier AR/VR/XR glasses, overlaid against the **release timelines of the glasses producers** (past releases and announced/expected future releases). The final deliverable will be an interactive timeline with commentary on what each part of each timeline indicates, including the time between updates (order cadence, qualification→production lead times, announce→ship lags).

## Background established by the user's earlier ChatGPT research (Sept 25–27, 2026)
- Meta announced new **"Meta VR Glasses"** on 2026-09-23 with commercial launch in **spring 2027**; they use autofocus cameras (confirmed in Meta's developer specs per the thread). Verify this and get exact product naming/specs.
- poLight (Oslo: PLT) TLens = piezo (PZT) MEMS actuator deforming a polymer lens on a glass membrane; <6 mW incl. driver; "TLens Add-In" 120° FOV 48MP design.
- **Q Technology (Q Tech, HK:1478)** and poLight announced a strategic partnership on **2025-04-15**, with Q Tech investing and building TLens production capacity, backed by an anonymous **"US top-tier customer"**. Later poLight purchase orders (qualification orders) are explicitly tied to "the same customer". poLight shifted wording to "design-in" in Aug–Sept 2026. The thread found several orders in 2026 (one around NOK 2.5m); check all Oslo Børs announcements.
- Q Tech's 2024 XR presentation mentioned a vendor code from a **"US M brand"** with multiple XR projects.
- A **DBS** research report names Meta + Q Tech + poLight together with an **H1 2027 production** timeline (the thread later de-weighted DBS as a single secondary source).
- Meta patents: **US 12,663,619** (granted June 2026, wide-FOV piezo membrane tunable autofocus; cites poLight TLens Add-In / PZT MEMS material), a **Sept 17, 2026 continuation**, **US20230280637A1** (abandoned; two-stage actuator, cites CML), **US12493197B2** (Dec 2025, low-power AF). Verify numbers and dates on Google Patents.
- A LinkedIn profile of a former Meta reliability engineer (Sept 2020–Apr 2025) says they "led development of miniature piezoelectric tunable lens AF camera module ... passing full reliability qualifications for AR/VR/MR ... readiness for production ramp".
- Competitors assessed: **Cambridge Mechatronics (CML)** SMA actuators (San Francisco office Oct 18 2021 "multiple commercial engagements with US technology giants"; Alps Alpine mass production Jan 2023; AF+OIS in mass production Mar 2023; $40m+ round Feb 2024 incl. Intel Capital, Sony Innovation Fund; >100m devices Oct 2025; Zero Hold Power May 2025; new deformable-lens application **WO2026087900A1**), **Optotune** (EL-3.1-10.8 tunable lens, datasheet updated 2026-09-18, 1.72 mm, 0.3 g, 20 mW @10 dpt, targets AR/VR), **Corning Varioptic** (electrowetting liquid lens, industrial focus), **Sheba Microsystems** (MEMS), VCM makers (**Alps Alpine, MinebeaMitsumi, TDK** — TDK transferred its camera actuator business to Q Tech 2025/26), Meta's own custom piezo lens.
- The thread's final probability that TLens is in Meta's spring-2027 VR glasses: ~85% (user-driven; treat as the user's prior, not as fact).

## What every research agent must deliver
Write your findings to the output file given in your task (markdown). Structure:
1. **Profile** (3–6 sentences): who they are, what they make, why relevant to AR/VR/XR glasses.
2. **Timeline table** — one row per dated event, ascending: `| date (YYYY-MM-DD or YYYY-MM or YYYY-Qn) | precision | category | event (one sentence, with numbers) | source URL | source type (company/IR, regulator/exchange, patent office, press, analyst, forum/rumor) | confidence (confirmed/strong/circumstantial/rumor) |`. Categories: product_release, announcement, order, design_in, qualification, patent, partnership, financing, capacity, hire, teardown, analyst_report, rumor, roadmap, earnings, other. Aim for completeness from ~2021 to today; for OEMs include every glasses/headset product release date and every announced or credibly reported future product with its expected window and who reported it.
3. **Future / expected events**: table of upcoming releases or milestones with expected date window, source, and confidence.
4. **Camera / autofocus relevance**: does the product use autofocus cameras (which ones, how many, FOV, specs)? Any public clue about the camera-module or actuator supplier (teardowns, supplier lists, analyst notes, job posts, patents)?
5. **Cadence observations**: intervals between releases or between company updates (e.g., order announcements every N weeks; announce→ship lag of N months); what pattern it suggests.
6. **Cross-links**: evidence connecting this entity to any other entity in the project (supplier↔OEM↔module maker), each with date and source.
7. **Gaps**: what you looked for and could not find.

## Rules
- Date everything. Prefer primary sources: company IR/newsroom pages, Oslo Børs NewsWeb (newsweb.oslobors.no) / Euronext, HKEX filings, SEC filings, Google Patents (patents.google.com), official developer docs. Then reputable press (Reuters, Bloomberg, The Verge, UploadVR, Road to VR, The Information, Android Authority, 9to5, DigiTimes, Nikkei), analyst notes, and last forums (mark as rumor).
- Use WebSearch in "extended" mode for anything from 2026, and for niche items; also use the Firecrawl search/scrape tools (mcp__Firecrawl__firecrawl_search, mcp__Firecrawl__firecrawl_scrape) when WebFetch fails or a page is JavaScript-heavy. Load tool schemas with ToolSearch if a tool is not yet loaded.
- Never state a date you have not seen in a source. If sources disagree, record both with sources.
- Separate what a company said from what press/analysts inferred. Quote short exact phrases for key wording (e.g. "design-in", "qualification order", "top-tier customer").
- Report amounts in the original currency.
- Keep the file self-contained; the reader will not see your search history.
- Finish with a short "Return summary" paragraph (≤150 words) that you also return as your final message.
