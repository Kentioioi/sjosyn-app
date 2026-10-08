# Round 4: primary copies of the evidence the estimate rests on (DBS, Meta developer pages, Meta official pages, poLight releases)

Retrieved 2026-10-08. Every file listed below was saved to `entities4/dl_primary/`. Nothing was logged into, and Save Page Now was not used. Existing Wayback captures were read through the CDX API.

## 1. Profile
This file gathers primary copies of the four pieces of evidence the TLens-in-Meta-VR-Glasses estimate depends on:
- **DBS's Q Tech research.** We now have the 2026-08-26 PDF and DBS's full Q Tech note trail from 2025-07 to 2026-08.
- **Meta's developer specification pages** for Meta VR Glasses, both live and in Wayback captures.
- **Meta's consumer and newsroom pages**, plus hands-on press coverage.
- **poLight's releases** from 2026-08-20 to 2026-10-08.

Main results:
1. DBS's sentence is confirmed verbatim in the primary PDF. DBS's own note archive shows it is the first DBS note to name Meta.
2. Meta's own developer documentation says "autofocus" in three places. The wording was already there in the earliest capture (2026-09-27).
3. Meta's consumer and newsroom copy never says autofocus.
4. No Meta source, and no hands-on report, says how the autofocus works (actuator type).

## 2. Timeline table

| date | precision | category | event | source URL | source type | confidence |
|---|---|---|---|---|---|---|
| 2025-07-11 | day | analyst_report | DBS (Jim Au), Q Tech, maintain BUY, TP raised to HKD12.50 from 10.0: "Depth cameras and piezo‑driven tunable lenses (co-developed with poLight) are now in customer sampling for AI glasses and service robots." No OEM named. | https://www.dbs.com.sg/treasures/aics/templatedata/article/recentdevelopment/data/en/DBSV/072025/1478_HK_07112025.xml | analyst | confirmed (that DBS wrote it) |
| 2025-08-12 | day | analyst_report | DBS (Jim Au), Q Tech, BUY, TP HKD15.0: "becoming the largest shareholder in poLight (tuneable lenses [Tlens]/semiconductor piezo motors) strengthen its high-precision module and XR optics stack". Lists "AR light-engine design-ins" as a catalyst. No OEM named. | https://www.dbs.com.sg/treasures/aics/templatedata/article/recentdevelopment/data/en/DBSV/082025/1478_HK_08122025.xml | analyst | confirmed |
| 2026-03-17 | day | analyst_report | DBS (Jim Au), Q Tech, BUY, TP unchanged at HKD15.0: Q Tech "invested in poLight to strengthen its optics stack in lenses, tunable lenses and piezo-motor technology … higher-end modules and XR optics". No Meta mention. | https://www.dbs.com.sg/treasures/aics/templatedata/article/recentdevelopment/data/en/DBSV/032026/1478_HK_03172026.xml | analyst | confirmed |
| 2026-05-08 | day | analyst_report | DBS Meta Platforms note (analyst Sachin Mittal; PDF author metadata "Alyssa Ann DE SOUZA"; 7 pages). It has no mention of poLight, Q Tech, tunable lenses, autofocus or varifocal. It mentions Reality Labs ("Management is now significantly decreasing VR investment to prioritize wearables"). | https://www.dbs.com/content/article/pdf/US_clover/Meta_Platforms.pdf | analyst | confirmed (absence) |
| 2026-08-13 | day | other | poLight: Q Tech replaces its board nominee Louis So with Fan Fuqiang, a Q Tech executive director responsible for finance, securities affairs and risk control. Already in the dataset (polight-4-88). | https://mfn.se/a/polight/polight-asa-changes-to-the-board-of-directors | company/IR | confirmed |
| 2026-08-26 | day | analyst_report | DBS (Jim Au), Q Tech, "Maintain BUY; lower TP to HKD12.6" (prev. HKD15.0), 13x FY27F PE. This is **not an initiation**. Page 4 of the PDF: "A Meta project combining Q Tech's module capabilities with poLight's low-power tunable-lens technology is expected to enter mass production in 1H27." This is the first DBS Q Tech note in the trail to name Meta. | https://www.dbs.com/content/article/pdf/000000_HK/1478_HK.pdf (same file at https://www.dbs.com.hk/treasures/aics/pdfController.page?pdfpath=/content/article/pdf/000000_HK/1478_HK.pdf) | analyst | confirmed (that DBS wrote it); circumstantial (as a fact about Meta) |
| 2026-08-26 | day | analyst_report | Same note, page 4: "Monochrome AR optical engines have entered volume production, colour optical engines are in small-batch delivery, and products are already being shipped to Meta and Samsung." | same | analyst | confirmed (that DBS wrote it) |
| 2026-09-21 | day | order | poLight: TWedge follow-on PO "approximately NOK 1.2 million" from "a leading consumer OEM for an AR\|MR display application", delivery "September/October 2026". CEO: "most customers evaluating TWedge® are also engaged with us on TLens®". Already in the dataset (polight-4-95). | https://mfn.se/a/polight/polight-asa-receives-follow-on-purchase-order-for-twedge-r-wobulation-technology-technical-samples-for-ar-mr-use-from-a-leading-consumer-oem | company/IR | confirmed |
| 2026-09-23 | day | announcement | Meta newsroom (published 2026-09-23T11:42:46Z): "The open sides and passthrough camera keep you aware…"; "with full-color passthrough, you can still see your desk…". No autofocus, camera count or camera MP. | https://about.fb.com/news/2026/09/introducing-meta-vr-glasses-3d-movies-immersive-live-sports-100-grams/ | company/IR | confirmed |
| 2026-09-23 | day | announcement | Meta consumer blog (dated Sep 23, 2026; modified 2026-09-29). Says ~100 g, puck with "compute, battery, and storage", optical tether, 5K Infinite Display, 37 PPD, Snapdragon Reality Elite, "up to three hours", US$1,299.99, Spring 2027. Again "passthrough camera" (singular) and no autofocus. Image filenames include "Lime_Phoenix_Headset". | https://www.meta.com/blog/meta-vr-glasses-announcement-meta-connect/ | company/IR | confirmed |
| 2026-09-23 | day | product_release | Road to VR spec sheet (Connect, 2026-09-23) lists "Passthrough Cameras: 26 PPD RGB", "Autofocus: Yes", "Depth Sensing: Yes", "Eye Tracking: 4 cameras, 2 per eye", "VR Glasses Weight ~100g", "Compute Puck Weight 300g", 5.5 MP (2,412 x 2,288) per eye, H70°×V66° (D88°). | https://roadtovr.com/meta-vr-glasses-unveiled-price-release-date/ | press | strong |
| 2026-09-23 | day | other | GadgetGuy hands-on (Valens Quinn; published 2026-09-23T23:43Z): "The colour passthrough cameras run at 26 pixels per degree, compared with 18 on the Quest 3, and they have autofocus. The glasses also use your eye tracking to sharpen whatever you're looking at." Also: "13 cameras and sensors in total. Six watch the world around you … two colour cameras for passthrough, four eye tracking cameras and a time-of-flight depth sensor." | https://www.gadgetguy.com.au/meta-vr-glasses-hands-on-a-lighter-cheaper-rival-to-vision-pro/ | press | strong (reporter's own words, not a Meta quote) |
| 2026-09-23 | day | other | Engadget hands-on: "equipped with four cameras that enable hand tracking and passthrough video". This conflicts with GadgetGuy's count of 13. | https://www.engadget.com/2267222/meta-vr-glasses-hands-on-hand-tracking/ | press | circumstantial |
| 2026-09-26 | day | other | MIXED (Chris Steven, 2026-09-26) quotes Meta's developer spec: "Colour stereoscopic passthrough at 26 PPD, with autofocus and depth sensing". This is independent confirmation of the wording three days after Connect. | https://mixed-news.com/en/meta-vr-glasses-puck-displayport-dp-in-mac-windows-console-display/ | press | strong |
| 2026-09-27 | day | announcement | **Earliest Wayback capture** of the developer page (20260927071227, at /horizon/discover/meta-vr-glasses/; the /vr/ URL captured one second earlier 302-redirects there). It already reads "Open-periphery color passthrough with autofocus and depth sensing". Differences from the live page: "5K micro-OLED display" (now "5K Infinite Display") and "running Meta Horizon OS" (since removed). | https://web.archive.org/web/20260927071227/https://developers.meta.com/horizon/discover/meta-vr-glasses/ | company/IR (archived) | confirmed |
| 2026-10-05 | day | announcement | Earliest Wayback capture of compare-devices (20261005110543, /vr/essentials/compare-devices/): "Color stereoscopic (26 PPD) passthrough with autofocus and depth sensing". A pre-Connect capture (2026-09-08, /horizon/resources/compare-devices/) lists Quest 3/3S only. | https://web.archive.org/web/20261005110543/https://developers.meta.com/vr/essentials/compare-devices/ | company/IR (archived) | confirmed |
| 2026-10-07 | day | announcement | poLight LinkedIn company page, post about 19 h before fetch (≈2026-10-07): CMD 30 Oct 2026 will offer "a deep-dive into different aspects of the company, as well as demos, guest speakers, and Q&A. Stay tuned for the complete agenda and registration link." No agenda, no named customer speaker, no mention of Q Tech or AR\|MR programmes. | https://no.linkedin.com/company/polight | company (social) | confirmed |
| 2026-10 (≈Oct 6–8) | week | other | poLight at the VISION 2026 machine-vision trade fair (Hall 10, Stand 10B84) with CEO Øyvind Isaksen and Jon Edwards. The messaging covers MLens/TLens for industrial, machine-vision and robotics use, with no AR mention. Earlier posts: Pierre Craen spoke at A*STAR IME "Innovate Together" on 25 Sep 2026 (MEMS); Jon Edwards attended "MicroLED Connect + AR/VR Connect" (posted about 3 weeks earlier). | https://no.linkedin.com/company/polight | company (social) | confirmed (relative dates) |
| 2026-10-08 | day | announcement | **Live developer page** (sha256 d44811de…). Mixed-reality row: "Open-periphery color passthrough with autofocus and depth sensing" (Quest: "Color passthrough with depth sensing"). Use-case text: "High-quality, full-color passthrough with autofocus and depth lets your apps blend the digital and physical worlds." Form factor: "At about 100g, VR Glasses stay light by moving compute and battery into a compact puck connected by a thin tether". Also "5K Infinite Display", "Snapdragon XR2 Gen 3", "Available Spring 2027". | https://developers.meta.com/vr/discover/meta-vr-glasses/ | company/IR | confirmed |
| 2026-10-08 | day | announcement | **Live compare-devices spec table** (sha256 af5f2422…). Passthrough: "Color stereoscopic (26 PPD) passthrough with autofocus and depth sensing" (Quest 3: "Color stereoscopic 4 MP (18 PPD) passthrough with depth sensor"; Quest 3S: "4 MP (18 PPD) passthrough"). Display micro-OLED, 2412x2288 per eye, 37 PPD, 120 Hz, FOV "70° horizontal 66° vertical", "Snapdragon XR2 Gen 3", 12 GB, "Head, hand, and eye tracking", "No camera-based face tracking available to apps", IPD "56–70mm. Manual, per-eye.", Wi-Fi 7, Bluetooth 5.4, "Up to ~3 hours for media playback", "1x USB-C (puck)", "DisplayPort DP-In (puck)", Android 14. **No passthrough camera MP is given** for VR Glasses, unlike Quest. | https://developers.meta.com/vr/resources/compare-devices/ (identical at /vr/essentials/compare-devices/) | company/IR | confirmed |
| 2026-10-08 | day | other | Horizon OS passthrough doc: "The device's stereo cameras capture the physical environment … On Meta VR Glasses, Quest 3 and Quest 3S, passthrough is full color with depth estimation". No autofocus. Passthrough Camera API docs still cover only Quest 3/3S. | https://developers.meta.com/vr/essentials/horizon-os-passthrough/ | company/IR | confirmed |
| 2026-10-29 | day | earnings | poLight Q3 2026 report, 07:00 (MFN calendar). | https://mfn.se/all/a/polight | company/IR | confirmed |
| 2026-10-30 | day | other | poLight CMD, 09:00–15:00 CET at Pareto Securities, Dronning Mauds gate 3, Oslo. "external review of key strategic markets"; "More details on the program … will follow". | https://mfn.se/a/polight/polight-asa-invitation-to-capital-markets-day-30-october-2026 (NewsWeb msg 679139) | company/IR | confirmed |

## 3. Future / expected events
| window | event | source | confidence |
|---|---|---|---|
| 2026-09/10 | Delivery of the NOK 1.2m TWedge samples | poLight 2026-09-21 | confirmed (company guidance) |
| 2026-10-29 | poLight Q3 2026 report | MFN calendar | confirmed |
| 2026-10-30 | poLight CMD with "guest speakers" and an "external review of key strategic markets"; agenda not yet published | poLight release 2026-08-06; LinkedIn ≈2026-10-07 | confirmed (date); agenda unknown |
| 1H27 | "Meta project" (Q Tech modules + poLight tunable lens) mass production, per DBS | DBS 2026-08-26 p.4 | analyst claim, single source |
| Spring 2027 | Meta VR Glasses on sale at US$1,299.99 | Meta blog / newsroom 2026-09-23 | confirmed |
| 2027-02-24 | poLight Q4/FY2026 report (estimated) | MFN calendar | strong |

## 4. Camera / autofocus relevance
- **What Meta says about autofocus (primary).** Autofocus appears only on developer pages, in three strings:
  1. "Open-periphery color passthrough with autofocus and depth sensing"
  2. "High-quality, full-color passthrough with autofocus and depth lets your apps blend the digital and physical worlds."
  3. "Color stereoscopic (26 PPD) passthrough with autofocus and depth sensing"
- **Where Meta does not mention it.** The consumer blog, the newsroom post and the meta.com/vr-glasses page never say autofocus, focus, camera MP or camera count. Meta.com/vr-glasses (JS-rendered; checked via WebFetch) shows only "Coming Spring 2027 for $1,299." and "weighing ~100 grams". There is no official spec sheet or FAQ beyond the developer table, and no "varifocal" or "variable focus" wording anywhere official.
- **Camera count and MP.** Meta publishes no camera MP for VR Glasses passthrough (it does for Quest: 4 MP). Press counts conflict:
  - GadgetGuy: 2 colour passthrough cameras plus 4 eye-tracking cameras plus a ToF sensor; 6 world-facing; 13 cameras and sensors in total.
  - Road to VR: 4 eye-tracking cameras, "26 PPD RGB" passthrough.
  - Engadget: "four cameras" for hand tracking and passthrough.
- **How focus is controlled.** GadgetGuy reports that eye tracking drives where the passthrough focuses ("use your eye tracking to sharpen whatever you're looking at"). A Reddit post title says the same ("supports eye tracked camera focusing"); the thread is login-gated, so this is forum-level evidence. A gaze-driven, fast-refocusing passthrough is consistent with a fast actuator, but it does not identify one.
- **Actuator.** No Meta staff quote found, at Connect or in hands-ons from Road to VR, UploadVR, CNET, Engadget, Gizmodo, GadgetGuy or MIXED, on the autofocus mechanism (moving lens, liquid lens, piezo or MEMS). The Verge and CNET could not be searched by domain; the CNET article fetched directly had no autofocus text.
- **DBS link to poLight.** In the trail checked, DBS (2026-08-26) is still the only document linking the Meta program to poLight's tunable lens. DBS calls it "a Meta project", not specifically the VR Glasses.

## 5. Cadence observations
- **DBS Q Tech notes:** 2025-07-11, 2025-08-12, 2026-03-17, 2026-08-26. Roughly one note per results period.
  - poLight wording moves from "co-developed with poLight … customer sampling for AI glasses" (Jul 2025), to the shareholder/XR optics stack (Aug 2025, Mar 2026), to a named "Meta project … mass production in 1H27" (Aug 2026).
  - DBS first names Meta 4 weeks before Connect.
  - No newer DBS Q Tech note exists as of 2026-10-08: the rolling URL still serves the 2026-08-26 PDF, and the treasures "Recent Developments" list ends at 26 Aug 2026.
- **Developer page.** The autofocus wording was present by 2026-09-27, 4 days after the announcement (no earlier capture exists). Copy edits since then (micro-OLED → "Infinite Display"; "Meta Horizon OS" → "Meta VR") left the autofocus wording unchanged.
- **poLight releases in the window.** Only one commercial release (TWedge, 2026-09-21) between 2026-08-20 and 2026-10-08. There was no TLens PO, design-in or design-win release; the last TLens items are 2026-07-10 (Program B) and 2026-06-18 (Program A).

## 6. Cross-links
- **DBS → Meta ↔ Q Tech ↔ poLight**, 2026-08-26, page 4 (quoted above).
- **DBS → Q Tech AR optical engines → Meta, Samsung**, 2026-08-26, page 4.
- **DBS → Q Tech ↔ poLight co-development, "customer sampling for AI glasses"**, 2025-07-11.
- **poLight → Q Tech:** board nominee change, 2026-08-13 (Fan Fuqiang).
- **poLight CEO, 2026-09-21:** TWedge customers "are also engaged with us on TLens®". No OEM is named.
- **Meta developer docs → autofocus passthrough:** 2026-09-27 (capture) and 2026-10-08 (live). No supplier is named.

## 7. Gaps
- The CDX API and wayback/available show no capture of the developer page before 2026-09-27. The "at announcement (2026-09-23)" wording therefore rests on the Road to VR (09-23) and MIXED (09-26) reports, not on a capture.
- The Wayback `id_` raw capture is stored zstd-compressed (no decoder installed). The replay version was used instead (sha256 f3633c02…).
- No newer DBS Q Tech note than 2026-08-26 was found. DBS PDF archive URLs for 2025–2026 notes return HTML stubs; the treasures HTML versions were used instead.
  - The 2026-08-26 PDF headline is "Handset share gains intact; auto and AI vision drive the next leg", while the treasures listing title is "Handset mix delays recovery; auto and AI optics build the next leg". Both are the same 26 Aug 2026 note.
  - A researchwise.dbsvresearch.com link that searches return for "Q Technology" is a 2020 note (10 Mar 2020), so it is irrelevant.
- No about.fb.com Connect keynote transcript was found. "The Biggest News From Connect 2026" (2026-09-24) has no camera or autofocus text.
- No Meta engineer statement on the autofocus mechanism was found. The Axios hands-on returned 403; CNET and Reddit are blocked for Firecrawl; The Verge cannot be searched by domain.
- No poLight CMD agenda, guest-speaker names or registration page published as of 2026-10-08.
- No poLight presentation at Pareto, DNB Carnegie, ABG or Arctic conferences found for Sep–Oct 2026. The only appearances found are VISION 2026 (machine vision), A*STAR Innovate Together (25 Sep) and MicroLED/AR-VR Connect.

### Dataset rows these primary copies upgrade
- **meta-0-73** (2026-09-23, "Meta developer docs: VR Glasses passthrough 'with autofocus and depth'", conf=rumor): upgrade to **confirmed**.
  - Live page copy saved (meta_vr_glasses_live.html, sha256 d44811de10c43c22b2b58a36d80d12fff0b932b45aa2f50dff87ea331a3763e5).
  - Compare-devices copy saved (sha256 af5f24229326103de6d401627137195bdd51535929e90f623fc90993bee4af6a).
  - Wayback capture 2026-09-27 confirms the wording.
  - Correct the quote to the exact strings above. The "26 PPD" string is on compare-devices, not on the discover page.
- **r2-meta-0-40 / meta-0-68**: the "developer specs say passthrough with autofocus" part is now primary-confirmed.
- **analysts-7-52** ("Unverified DBS sentence", conf=rumor): **retire or merge into r2-analysts-4-45**.
  - The sentence is verbatim on PDF page 4 (dbs_1478_HK.pdf, 12 pages, CreationDate 2026-08-26 03:44 UTC, sha256 a0a99c5ade769d7476185d6922eef257c8e660b3e39ae1c5f95eee8575d21b69). The dbs.com.hk treasures copy is byte-identical, and the treasures HTML gives the same text.
  - Tag r2-analysts-4-45 "confirmed that DBS wrote it". Its content stays an analyst claim (circumstantial).
  - Fix the BRIEF4 wording "initiation": the note is a maintain-BUY with a TP cut from HKD15.0.
- **analysts-4-76** (DBS Meta note has no poLight): re-confirmed. It also has no Q Tech, tunable, autofocus or varifocal mention.
- **New rows to add:** DBS 2025-07-11, 2025-08-12 and 2026-03-17 notes; earliest developer-page capture 2026-09-27; GadgetGuy eye-tracked focus 2026-09-23; MIXED 2026-09-26; CMD "guest speakers" post ≈2026-10-07; VISION 2026 appearance.

### Files (dl_primary/)
- **DBS:** dbs_1478_HK.pdf/.txt, p4.txt, dbs_hk_treasures_1478.pdf (identical), dbs_meta.pdf/.txt, dbs_treasures_1478_HK.xml, dbs_rd_1478_HK_{07112025,08122025,03172026,08262026}.html/.txt, dbs_researchwise_1478.pdf (2020, irrelevant).
- **Meta developer pages:** meta_vr_glasses_live.html/.txt, vr_resources_compare-devices_.html/.txt, vr_essentials_compare-devices_.html/.txt, vr_discover_devices_.html, vr_essentials_bring-your-app-glasses_.html.
- **Wayback captures:** wb_20260927_glasses_replay.html/.txt, wb_20261005110543_compare.html/.txt, wb_20260908025812_compare.html/.txt.
- **Other Meta and press pages:** meta_com_vr-glasses.html; web2 (Road to VR), web3 (Engadget), web11 (about.fb.com), web12, web21 (passthrough doc), web31 (dev blog recap), web40 (Road to VR hands-on), web42 (UploadVR), web51 (CNET).
- **poLight:** mfn1–3 (poLight releases), pl_* listings, li_polight_company.html.

## Return summary
DBS: the 2026-08-26 PDF (12 pp, sha256 a0a99c5a…) carries the page-4 sentence verbatim: "A Meta project combining Q Tech's module capabilities with poLight's low-power tunable-lens technology is expected to enter mass production in 1H27". The same page says AR optical engines ship "to Meta and Samsung". The note is a maintain-BUY with a TP cut from 15.0, not an initiation. There is no newer DBS note. Earlier DBS notes (2025-07-11, 2025-08-12, 2026-03-17) mention poLight but not Meta. The 2026-05-08 DBS Meta note has none of these terms.

Meta: the developer docs say "Color stereoscopic (26 PPD) passthrough with autofocus and depth sensing". The autofocus wording is in the earliest capture (2026-09-27). Consumer and newsroom copy never says autofocus. No source names the actuator. GadgetGuy reports eye-tracked focusing.

Upgrades: meta-0-73 rumor→confirmed; analysts-7-52 retire (merge into r2-analysts-4-45).

poLight: one TWedge PO (NOK 1.2m, 2026-09-21); CMD agenda pending ("guest speakers").
