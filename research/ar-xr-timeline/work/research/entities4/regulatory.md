# Regulatory filings: Meta (and competitor) glasses, FCC cadence, and the expected Meta VR Glasses filing window

Research date 2026-10-08. All FCC data comes from public fccid.io mirror pages of the FCC EAS database, scraped 2026-10-08. apps.fcc.gov returned an Akamai "Access Denied" (403) to this environment. Downloads (exhibit PDFs and the Meta developer page) are saved in `entities4/dl_regulatory/`. No logins, no submissions, and no Save Page Now were used.

## 1. Profile

Meta's glasses and headset hardware is certified under two FCC grantee codes:

- **2AGOZ** is Meta Platforms Technologies, LLC, formerly Oculus/Facebook Technologies. It was registered 2015-11-25 and lists 33 FCC IDs. It covers every Quest headset and controller, Meta Ray-Ban Display (JN3), Meta Neural Band (WQ8), Project Aria Gen 2 (NU4), the new own-brand "Meta Glasses" (G4Q) and a 60 GHz "Debug Tool" (C4B).
- **2AYOA** is Luxottica Group S.p.A., registered 2021-01-12. It covers Ray-Ban Stories, Ray-Ban Meta Gen 1, Gen 2 and Gen 3, Oakley Meta HSTN and Vanguard, Ray-Ban Meta Blayzer/Scriber Optics, Ray-Ban Meta Audio and the Nuance Audio products.

Meta-led devices (Quest headsets, Display, Neural Band, Meta Glasses) are filed under 2AGOZ. A **Meta VR Glasses** filing would therefore most likely appear under 2AGOZ. **As of 2026-10-08 there is no FCC record for Meta VR Glasses or its puck.** Every 2AGOZ and 2AYOA grant from 2024-01 to 2026-10 matches a launched product, a research device or a debug tool. Meta's grants consistently use a ~180-day short-term confidentiality period (179–181 days in all ten cases checked). Internal photos, external photos and user manuals therefore become public about six months after grant. Schematics, block diagrams, BOM and operational descriptions are under permanent (long-term) confidentiality.

## 2. Timeline table

Notes on reading the table:
- "Grant" is the TCB grant date. "App." is the "Application Dated" value on the grant.
- C2PC = Class II Permissive Change, which adds models or changes hardware under an existing FCC ID.
- STC = short-term confidentiality release date.

| date | precision | category | event | source URL | source type | confidence |
|---|---|---|---|---|---|---|
| 2021-09-09 | day | product_release | Ray-Ban Stories announced and on sale; its FCC grant (2AYOA-4002, app. 2021-05-26) is dated 2021-09-10, one day **after** launch. | https://fccid.io/2AYOA-4002 ; https://en.wikipedia.org/wiki/Ray-Ban_Meta | regulator (mirror); press | confirmed |
| 2021-09-10 | day | other | FCC grant 2AYOA-4002 "Ray-Ban Stories" (Luxottica). STC to 2022-03-09 (180 days). | https://fccid.io/2AYOA-4002 | regulator (mirror) | confirmed |
| 2022-10-11 | day | product_release | Quest Pro announced (shipped 2022-10-25). FCC grant 2AGOZ-L31W "VR Headset" (app. 2022-07-28) is dated 2022-10-12, one day after the announcement. STC to 2023-04-10. | https://fccid.io/2AGOZ-L31W | regulator (mirror) | confirmed (grant); release dates widely reported |
| 2023-06-01 | day | announcement | Quest 3 teased before any FCC filing. Shows Meta can pre-announce a headset months before FCC. | https://en.wikipedia.org/wiki/Meta_Quest_3 | press | confirmed |
| 2023-07-25 | day | other | FCC grants 2AGOZ-V6P and 2AGOZ-S2Y "Handheld controller" (app. 2023-06-29/30). These are the Quest 3 Touch Plus controllers, granted 9 days **before** the headset. | https://fccid.io/2AGOZ-V6P ; https://fccid.io/2AGOZ-S2Y | regulator (mirror) | strong (product mapping inferred from timing) |
| 2023-08-03 | day | other | FCC grant 2AGOZ-S3A "VR Headset" (Quest 3; app. 2023-06-30). STC to 2024-01-31. Mixed reported it 2023-08-05. | https://fccid.io/2AGOZ-S3A ; https://mixed-news.com/en/meta-quest-3-fcc-approval/ | regulator (mirror); press | confirmed |
| 2023-09-11 | day | other | FCC grant 2AYOA-4003, original equipment (Ray-Ban Meta Gen 1; app. 2023-07-03). | https://fccid.io/2AYOA-4003 | regulator (mirror) | confirmed |
| 2023-09-27 | day | product_release | Quest 3 full reveal (shipped 2023-10-10) and Ray-Ban Meta Gen 1 announced (shipped 2023-10-17). | https://en.wikipedia.org/wiki/Meta_Quest_3 ; https://en.wikipedia.org/wiki/Ray-Ban_Meta | press | confirmed |
| 2024-03-01 | day | other | 2AYOA-4003 C2PC (app. 2024-01-31): "Add the model name: RW4009F, RW4010, RW4006M" (Gen 1 Headliner low-bridge, Skyler, Wayfarer M). | https://fccid.io/2AYOA-4003 | regulator (mirror) | confirmed |
| 2024-05-24 | day | other | 2AGOZ-V6P/S2Y C2PC (app. 2024-05-14): "Change antenna type FPC Dipole to PCBA PIFA". This is a controller revision, not a new product. | https://fccid.io/2AGOZ-V6P | regulator (mirror) | confirmed |
| 2024-09-01 | day | other | FCC grant 2AGOZ-P97 "VR Headset" (Quest 3S), second action 2024-09-02. STC to 2025-02-28 (179 days). UploadVR: "Quest 3S Seemingly Gets FCC Certification Ahead Of Launch". | https://fccid.io/2AGOZ-P97 ; https://www.uploadvr.com/quest-3s-fcc-certification/ | regulator (mirror); press | confirmed |
| 2024-09-25 | day | other | FCC grant 2AGOZ-M7K "Charging Dock" (app. 2024-08-29; Part 15 <1705 kHz). STC to 2025-03-24. Product not identified. | https://fccid.io/2AGOZ-M7K | regulator (mirror) | confirmed (grant); product unmatched (accessory) |
| 2024-09-25 | day | product_release | Quest 3S announced (shipped 2024-10-15). | https://en.wikipedia.org/wiki/Meta_Quest_3S | press | confirmed |
| 2025-02-06 | day | other | 2AYOA-4003 C2PC (app. 2025-01-15) adds model RW4006S. | https://fccid.io/2AYOA-4003 | regulator (mirror) | confirmed |
| 2025-05-26 | day | other | Sporton (Shenzhen) external-photo report EP522809A issued for JN3 (Meta Ray-Ban Display). This is lab work done ~4 months before launch. | https://fccid.io/2AGOZ-JN3 (ExtPho_r2 exhibit) | regulator (mirror) | confirmed |
| 2025-06-20 | day | product_release | Oakley Meta HSTN announced. Limited-edition pre-orders 2025-07-11; the rest of the line "later this summer". | https://techcrunch.com/2025/06/20/meta-unveils-its-oakley-smart-glasses | press | confirmed |
| 2025-06-30 | day | other | 2AYOA-4003 C2PC grant: "Change the product dimensions (Include LENS & Frame & Temple), **Change Digital component & camera for OW8002** and Add the model name: OW8002" (Oakley Meta HSTN). Granted 10 days **after** the announcement. A grant note can name a camera change. | https://fccid.io/2AYOA-4003 | regulator (mirror) | confirmed |
| 2025-07-15 | day | other | 2AYOA-4003 C2PC grant: "Change Digital component, Add the model name: RW4012, RW4013, RW4013F, RW4014" (Ray-Ban Meta Gen 2 Wayfarer/Headliner/Headliner LBF/Skyler, per a retailer model table). Gen 2 was certified as a permissive change under the Gen 1 FCC ID. | https://fccid.io/2AYOA-4003 ; https://tajima-direct.com/blogs/news/ray-ban-meta-gen-3-audio-prescription-lenses-guide | regulator (mirror); retailer | confirmed (grant); strong (model→product) |
| 2025-08-12 | day | other | FCC grants 2AGOZ-JN3 "SMART GLASSES" (app. 2025-06-09) and 2AGOZ-WQ8 "Wrist Band" (BLE; app. 2025-07-17). JN3 photos show Standard and Large samples and a right-lens projector/waveguide, i.e. Meta Ray-Ban Display. WQ8 = Meta Neural Band. | https://fccid.io/2AGOZ-JN3 ; https://fccid.io/2AGOZ-WQ8 | regulator (mirror) | strong (mapping from exhibits + timing) |
| 2025-08-28 | day | other | FCC grant 2AGOZ-NU4 "SMART GLASSES" (Wi-Fi 2x2, BT, 903–927 MHz sub-GHz). Draft manual reads "Model: NU4, **Aria Gen2**", the research glasses, not a consumer product. | https://fccid.io/2AGOZ-NU4 (User manual exhibit) | regulator (mirror) | confirmed |
| 2025-09-17 | day | other | FCC grant 2AYOA-4007 "AI GLASSES" (app. 2025-08-07), granted on Connect day. Photo report: "Brand Name: Oakley Meta / Model Name: OW8001" = Oakley Meta Vanguard. Manual metadata title "OW PALOMA". STC to 2026-03-17. | https://fccid.io/2AYOA-4007 | regulator (mirror) | confirmed |
| 2025-09-17 | day | product_release | Connect 2025: Meta Ray-Ban Display + Neural Band (on sale 2025-09-30), Ray-Ban Meta Gen 2 (available same day) and Oakley Meta Vanguard (shipped 2025-10-21) announced. | https://techcrunch.com/2025/09/17/meta-unveils-its-new-oakley-meta-vanguard-smart-glasses-for-athletes ; https://www.xrtoday.com/?p=58722 | press | confirmed |
| 2025-12-16 | day | other | 2AYOA-4007 gets a 6 GHz (6XD) grant (app. 2025-11-19). This is a post-launch Wi-Fi 6E enablement. | https://fccid.io/2AYOA-4007 | regulator (mirror) | confirmed |
| 2026-01-13 | day | other | 2AGOZ-JN3 gets a 6 GHz (6XD) grant (app. 2025-12-16). JN3 manuals and internal/external photos released 2026-07-12. | https://fccid.io/2AGOZ-JN3 | regulator (mirror) | confirmed |
| 2026-01-20 | day | other | G4Q (Meta Glasses) OTA antenna testing runs 2026-01-20 to 2026-02-05. This is ~5 months before its 2026-06-23 launch. | https://fccid.io/2AGOZ-G4Q (FCC_AUT_Report exhibit) | regulator (mirror) | confirmed |
| 2026-02-26 | day | other | Samsung SM-O200P SAR testing begins (runs to 2026-07-13). | https://fccid.io/A3LSMO200P (RF Exposure Test Report) | regulator (mirror) | confirmed |
| 2026-03-10 | day | other | FCC grant 2AYOA-4010 "AI GLASSES" (app. 2026-01-22): RW7001/RW7002 = Ray-Ban Meta Blayzer/Scriber Optics (Gen 2). Road to VR reported it 2026-03-27. | https://fccid.io/2AYOA-4010 ; https://roadtovr.com/meta-ray-ban-smart-glasses-2026-next-gen/ | regulator (mirror); press | confirmed |
| 2026-03-31 | day | product_release | Ray-Ban Meta Blayzer Optics and Scriber Optics announced, US$499. In optical retail 2026-04-14. | https://techcrunch.com/2026/03/31/meta-launches-two-new-ray-ban-glasses-designed-for-prescription-wearers/ | press | confirmed |
| 2026-05-21 | day | other | FCC grant 2AGOZ-G4Q "AI Glasses" (BT/Wi-Fi 2.4/5 GHz; app. 2026-03-24). Models G4QM, G4QR, G4QB, G4QS. 60 GHz grant 2026-05-27. Same day: FCC grant 2AGOZ-C4B "Debug Tool" (60 GHz only, app. 2026-05-18, STC to 2026-11-18). Lowpass/Android Authority reported them. | https://fccid.io/2AGOZ-G4Q ; https://fccid.io/2AGOZ-C4B ; https://www.androidauthority.com/meta-smart-glasses-fcc-filing-3672710/ | regulator (mirror); press | confirmed |
| 2026-06-03 | day | other | 2AGOZ-NU4 (Aria Gen 2) gets a 6 GHz (6XD) grant (app. 2026-05-07). This is the only 2026 "smart glasses" grant not tied to a consumer launch, and it is a research device. | https://fccid.io/2AGOZ-NU4 | regulator (mirror) | confirmed |
| 2026-06-23 | day | product_release | Meta launches own-brand "Meta Glasses" (Adventurer, Fury at US$299; Starfire by Kylie at US$399), made with EssilorLuxottica, 12 MP camera, "available ... starting today". Matches G4Q. | https://about.fb.com/news/2026/06/meta-essilorluxottica-partner-launch-meta-glasses/ ; https://techcrunch.com/2026/06/23/meta-debuts-new-cheaper-smart-glasses-under-its-own-brand/ | company; press | confirmed (launch); strong (G4Q mapping) |
| 2026-06-30 | day | other | 2AGOZ-G4Q C2PC (app. 2026-06-25): "Added new G4QL, G4QP and G4QC models. Differences from the original include industrial design, colors, and Meta logo location." This most likely covers the Connect-2026 styles (Capri, Nova, etc.). | https://fccid.io/2AGOZ-G4Q | regulator (mirror) | confirmed (grant); circumstantial (style mapping) |
| 2026-07-20 | day | other | 2AGOZ-G4Q gets a 6 GHz grant (app. 2026-06-29). G4Q exhibits are confidential until 2026-11-24 (first batch) and 2027-01-17 (second batch). The exhibit list includes "PED for 7 models", "Schematics_MLB_EVT_POR" and "POR_BOM", all metadata only. | https://fccid.io/2AGOZ-G4Q | regulator (mirror) | confirmed |
| 2026-07-29 | day | other | 2AYOA-4010 C2PC (app. 2026-05-20): "Add models RW4011, RW4011V, RW4015, RW4015V, RW4016, RW4016V" = Ray-Ban Meta Gen 3 Wayfarer/Zena/Aviator (+ Optics "V" versions). Gen 3 was certified as a C2PC on the Blayzer/Scriber ID. | https://fccid.io/2AYOA-4010 ; https://tajima-direct.com/blogs/news/ray-ban-meta-gen-3-audio-prescription-lenses-guide | regulator (mirror); retailer | confirmed (grant); strong (model→product) |
| 2026-09-01 | day | other | Pico (ByteDance; grantee 2A5NV, Qingdao Chuangjian Weilai) "Mixed Reality Computer" FCC IDs **2A5NV-AA1Z0 (headset) and 2A5NV-B3110 (tethered puck)** listed. Per UploadVR/vr.org, the puck carries a 7,000 mAh battery and Wi-Fi 7, and STC runs to 2027-02-28. This is a template for a glasses + puck filing. | https://fccid.io/2A5NV ; https://www.uploadvr.com/pico-space-pro-appears-to-receive-fcc-certification-following-delay-to-q4/ | regulator (mirror); press | confirmed (IDs/dates); strong (radio split, from press) |
| 2026-09-09 | day | other | FCC grant 2AYOA-4012 "AI GLASSES" (app. 2026-08-31, 9 days; BT/DTS only). Models RW7004/RW7005 = Ray-Ban Meta Audio Clubmaster/Burbank (camera-free). STC to 2027-03-08. | https://fccid.io/2AYOA-4012 ; https://tajima-direct.com/blogs/news/ray-ban-meta-gen-3-audio-prescription-lenses-guide | regulator (mirror); retailer | confirmed (grant); strong (model→product) |
| 2026-09-23 | day | product_release | Connect 2026: Meta VR Glasses (US$1,299.99, "on sale Spring 2027"); Ray-Ban Meta Gen 3 (available same day); Ray-Ban Meta Audio (ships 2026-10-13); new Meta Glasses styles. No FCC authorization notice appears on Meta's VR Glasses blog. | https://www.meta.com/blog/meta-connect-2026-everything-we-announced/ ; https://www.meta.com/blog/meta-vr-glasses-announcement-meta-connect/ | company | confirmed |
| 2026-09-27 | day | other | FCC grants A3LSMO200P and A3LSMO200J (Samsung "Smart Glasses"/"Extended Reality Glasses"; app. 2026-07-22). Variants SM-O201P–O204P differ only in "the design of the front frame". Wi-Fi 6E incl. VLP, charging case. STC to 2027-03-26. **No public exhibit mentions a camera, lens or autofocus.** | https://fccid.io/A3LSMO200P ; https://fccid.io/A3LSMO200J | regulator (mirror) | confirmed |
| 2026-09-29 | day | other | Xreal FCC ID 2BBNY-X7012 "XREAL Keyboard" granted. Exhibit filenames reference "AURA_QSG_20260523". No Aura glasses grant reported. | https://mixed-news.com/en/xreal-fcc-grant-folding-keyboard-aura-exhibits/ | press | strong (single outlet) |
| 2026-10-08 | day | other | Meta developer page (saved copy, sha256 127d2459…) states: "Open-periphery color passthrough with **autofocus** and depth sensing" and "High-quality, full-color passthrough with autofocus and depth lets your apps blend the digital and physical worlds". This is a primary copy of the AF claim. (The dataset's "26 PPD stereoscopic" wording is **not** on the page.) | https://developers.meta.com/vr/discover/meta-vr-glasses/ | company | confirmed |
| 2026-10-08 | day | other | No FCC filing for Meta VR Glasses or its puck exists under 2AGOZ or 2AYOA. The latest 2AGOZ actions are G4Q (2026-07-20) and NU4 (2026-06-03); the latest 2AYOA is 4012 (2026-09-09). No Snap Specs grant appears under Snap's code 2AIRN (latest 2AIRN-005, 2024-10-21). | https://fccid.io/2AGOZ ; https://fccid.io/2AYOA ; https://fccid.io/2AIRN | regulator (mirror) | confirmed (as of scrape) |

### 2a. Meta filing→launch lag table (computed)

The "grant→announce" and "grant→ship" columns are counted from the first original-equipment grant (or the C2PC that added the model).

| Product | FCC ID | App.→grant (d) | Grant | Announced | Ship / on sale | Grant→announce (d) | Grant→ship (d) |
|---|---|---|---|---|---|---|---|
| Ray-Ban Stories | 2AYOA-4002 | 107 | 2021-09-10 | 2021-09-09 | 2021-09-09 | −1 | −1 |
| Quest Pro | 2AGOZ-L31W | 76 | 2022-10-12 | 2022-10-11 | 2022-10-25 | −1 | 13 |
| Quest 3 | 2AGOZ-S3A | 34 | 2023-08-03 | 2023-09-27 (teased 06-01) | 2023-10-10 | 55 | 68 |
| Ray-Ban Meta Gen 1 | 2AYOA-4003 | 70 | 2023-09-11 | 2023-09-27 | 2023-10-17 | 16 | 36 |
| Quest 3S | 2AGOZ-P97 | ~0 (as listed) | 2024-09-01 | 2024-09-25 | 2024-10-15 | 24 | 44 |
| Oakley Meta HSTN (C2PC) | 2AYOA-4003 | 0 | 2025-06-30 | 2025-06-20 | 2025-07-11 (pre-order) | −10 | 11 |
| Ray-Ban Meta Gen 2 (C2PC) | 2AYOA-4003 | 0 | 2025-07-15 | 2025-09-17 | 2025-09-17 | 64 | 64 |
| Meta Ray-Ban Display | 2AGOZ-JN3 | 64 | 2025-08-12 | 2025-09-17 | 2025-09-30 | 36 | 49 |
| Meta Neural Band | 2AGOZ-WQ8 | 26 | 2025-08-12 | 2025-09-17 | 2025-09-30 | 36 | 49 |
| Oakley Meta Vanguard | 2AYOA-4007 | 41 | 2025-09-17 | 2025-09-17 | 2025-10-21 | 0 | 34 |
| RB Meta Blayzer/Scriber Optics | 2AYOA-4010 | 47 | 2026-03-10 | 2026-03-31 | 2026-04-14 | 21 | 35 |
| Meta Glasses (G4Q) | 2AGOZ-G4Q | 58 | 2026-05-21 | 2026-06-23 | 2026-06-23 | 33 | 33 |
| Meta Glasses new styles (C2PC) | 2AGOZ-G4Q | 5 | 2026-06-30 | 2026-09-23 | 2026-09-23 | 85 | 85 |
| Ray-Ban Meta Gen 3 (C2PC) | 2AYOA-4010 | 70 | 2026-07-29 | 2026-09-23 | 2026-09-23 | 56 | 56 |
| Ray-Ban Meta Audio | 2AYOA-4012 | 9 | 2026-09-09 | 2026-09-23 | 2026-10-13 | 14 | 34 |
| *Samsung SM-O200P/J (competitor)* | A3LSMO200P/J | 67 | 2026-09-27 | (Nov 2026 per press) | — | — | — |

Summary for new original-equipment products (10 cases):
- Grant→ship ranges from −1 to 68 days, median ~35 days.
- Headsets only: 13 days (Quest Pro), 44 (Quest 3S), 68 (Quest 3).
- Application→grant is typically 26–76 days (outliers: 9 and 107).
- RF/SAR lab testing starts ~4–5 months before launch (G4Q: antenna tests Jan–Feb 2026 for a June launch; Samsung: SAR from Feb 2026 for a ~Nov launch).

## 3. Future / expected events

| Expected event | Window | Basis | Confidence |
|---|---|---|---|
| Meta VR Glasses RF/SAR lab testing (not public) | already under way or 2026-Q4 | Lab work starts 4–5 months before launch (G4Q, Samsung, JN3 precedents) | circumstantial |
| VR Glasses FCC application filed (not visible until grant) | ~2026-11 to 2027-03 | 26–76 days before grant | circumstantial |
| **VR Glasses + puck FCC grant(s) (2AGOZ-xxx)** | **core 2027-01-10 to 2027-04-30; outer 2026-12-22 to 2027-06-07** | Ship in Mar–May 2027 minus the 33–49-day typical grant→ship lag (core). Ship Mar 1–Jun 20 minus the 13–68-day headset range (outer). Likely two FCC IDs, as with Pico Space Pro (headset + puck, both 2026-09-01) and Quest 3 (controllers granted 9 days before the headset). | circumstantial (derived) |
| VR Glasses internal photos / manual public on FCC | ~180 days after grant → **~2027-07 to 2027-10** | Meta short-term confidentiality was 179–181 days in all 10 cases checked | strong (pattern) |
| Korea KC (RRA) certification of VR Glasses | probably within weeks of the FCC grant, Q1–Q2 2027 | No Meta RRA data was retrievable (see Gaps). This window is an assumption, not a measured lag. | rumor-grade assumption |
| G4Q (Meta Glasses) internal photos public | 2026-11-24 and 2027-01-17 | fccid.io exhibit dates | confirmed |
| Ray-Ban Meta Audio exhibits public | 2027-03-08 | fccid.io | confirmed |
| Samsung SM-O200P/J photos/manual public | 2027-03-26 | fccid.io | confirmed |
| Pico Space Pro exhibits public | 2027-02-28 | UploadVR / vr.org | strong |

## 4. Camera / autofocus relevance

**Primary AF confirmation.** Meta's developer page (retrieved 2026-10-08, saved copy in `dl_regulatory/`) says the VR Glasses have "Open-periphery color passthrough with autofocus and depth sensing". The consumer blog says "passthrough camera" and "full-color passthrough" but does not mention autofocus.

**What FCC filings show about cameras.**
- Meta's FCC test reports and manuals for JN3, NU4, G4Q and 4007 contain no camera or autofocus text. The JN3 draft manual is only a regulatory statement.
- Grant notes can disclose camera changes in permissive changes. The 2025-06-30 Oakley HSTN note says "Change Digital component & camera for OW8002".
- Samsung SM-O200P public exhibits (SAR report, label, multi-TX appendix) do not mention any camera. The "single 12 MP camera" detail comes from press, not from the FCC record.

**What a VR Glasses FCC filing could reveal immediately:**
- the FCC ID(s), including whether the glasses and the puck have separate IDs;
- application and grant dates;
- model numbers and variants (e.g., sizes);
- radios (Wi-Fi 6E/7, BT, 60 GHz, UWB);
- SAR test positions;
- the test lab;
- the label location;
- for permissive changes, text describing hardware or camera changes.

**What it could not reveal:**
- Internal and external photos and the user manual stay confidential for ~180 days. That pushes them to mid/late 2027, after launch.
- Schematics, block diagram, BOM and operational description are permanently confidential. The G4Q list shows "POR_BOM" and "Schematics_MLB_EVT_POR" as metadata only.
- Camera-module or actuator vendor names would appear only if they were legible in internal photos.

**Key caveat.** Meta says the puck "connected by an optical tether, handles compute, battery, and storage". If the glasses carry no intentional radiator, they may not need their own FCC certification. They could fall under Part 15B self-declaration. In that case the FCC internal photos would show only the puck, not the camera module.

## 5. Cadence observations

- **Filing structure.** Meta files new hardware generations of Ray-Ban/Oakley glasses as permissive changes under existing EssilorLuxottica IDs:
  - Gen 2, HSTN and new frames went under 4003;
  - Gen 3 went under 4010.
  
  New FCC IDs appear only for new platforms (4007 Vanguard, 4010 Blayzer/Scriber, 4012 Audio; on the Meta side JN3, WQ8, G4Q). A VR Glasses filing would be a new 2AGOZ ID.
- **Lag regime.** Meta usually gets the FCC grant 2–7 weeks before shipping. Three times the grant came on or after the announcement: Stories, Quest Pro and HSTN. Lags are shorter for products sold on announcement day and longest (55–85 days) when a grant precedes a fixed Connect date. For a product already announced (VR Glasses, 2026-09-23), the relevant lag is grant→ship.
- **Confidentiality.** Meta and Luxottica request 180 days of short-term confidentiality every time (10 of 10 cases: 179–181 days). Samsung uses 180 days too (2026-09-27 → 2027-03-26).
- **2026 Meta cadence.** Grants (some of them permissive changes) came on 2026-01-13, 03-10, 05-21, 06-03, 06-30, 07-20, 07-29 and 09-09. That is roughly every 3–8 weeks, all tied to glasses. There has been no headset-class grant since Quest 3S (2024-09).

## 6. Cross-links

- **Sporton International** (Taiwan HQ; Shenzhen lab; TCB Sporton USA, Milpitas) tested JN3, NU4, G4Q, 4003, 4007, 4010 and 4012. Meta's glasses certification runs through Sporton's Shenzhen/Taiwan labs. Element Materials Technology (Washington DC) tested Samsung's glasses.
- **EssilorLuxottica (2AYOA)** is the FCC applicant for Ray-Ban Meta and Oakley Meta. Meta (2AGOZ) is the applicant for Display, Neural Band, Meta Glasses and Quest. Meta Glasses are "made in partnership with EssilorLuxottica" but certified under Meta's own code (2026-06-23).
- **Pico Space Pro** uses a headset plus tethered-puck structure with two FCC IDs (2026-09-01), with radios mostly in the puck per press. This is the closest analog for how Meta VR Glasses (also a glasses + puck design) may appear.
- **Samsung SM-O200P/SM-O200J** are, per press, the Google Android XR glasses with Gentle Monster and Warby Parker (two FCC IDs, eleven frame models, "Made in Vietnam" per the vr.org teaser).
- **No regulatory filing names Goertek, Q Tech, Sunny or poLight.** FCC applicants are brand owners. Manufacturer and module identity appears only in internal photos, and only if markings are legible.

## 7. Gaps

- **apps.fcc.gov (official EAS)**: Akamai 403 from this environment. I relied on the fccid.io mirror, which was cross-checked against fccid.co (a less complete mirror). fcc.report and device.report served a 403 "security check".
- **Korea RRA/KC** (rra.go.kr): the search is a POST form (fields firm/maker/model_no/fromdate/todate). HTTPS connections from this environment were reset. No Meta KC records were retrieved, so Korean lag data is not available. Meta Glasses launched in South Korea at Connect 2026, so KC records must exist.
- **Japan MIC Giteki**: a GET query returned "入力値に不正な値が含まれています" (invalid input). Not retrieved.
- **Bluetooth SIG Launch Studio** is a JavaScript app backed by a POST API, and **Wi-Fi Alliance** certifications were not queried. No public press reports of 2026 Meta listings were found.
- **Taiwan NCC, China SRRC/CMIIT/TENAA/CCC, Indonesia SDPPI, India BIS/WPC, Brazil Anatel**: web searches found no Meta VR Glasses or puck listings and no press reports. The databases were not queried directly. EU EPREL does not cover headsets or glasses (an energy-label database), so it is not applicable.
- **Alibaba Quark/Qwen glasses**: no FCC or CMIIT record found.
- **Snap Specs**: no FCC grant found under 2AIRN or any "Specs Inc" code, despite the fall-2026 ship target.
- **Google-partner glasses**: no FCC grants found other than Samsung SM-O200P/J.
- **Xreal Aura**: no glasses grant found; only the keyboard.
- **Product mappings inferred from exhibits rather than stated in filings**: JN3 = Ray-Ban Display, WQ8 = Neural Band, G4Q = Meta Glasses, RW-model→style.
- **M7K "Charging Dock" (2024-09-25)** is not matched to a product.
- **Release dates for 2021–2024 products** are cited from Wikipedia or press, not from Meta newsroom pages.
- **A search-engine summary claiming the VR Glasses headset and puck "cleared the FCC on September 1"** was checked against the cited vr.org article and is **false**. It confused the Pico Space Pro filing.

## Return summary

FCC mirrors (fccid.io) show Meta uses grantee codes 2AGOZ (Meta: Quest, Ray-Ban Display JN3, Neural Band WQ8, Aria Gen 2 NU4, Meta Glasses G4Q, debug tool C4B) and 2AYOA (Luxottica: Ray-Ban/Oakley Meta). As of 2026-10-08, every 2024–2026 grant matches a launched product or a research or debug device. There is no filing yet for Meta VR Glasses or its puck. For new products, FCC grant→ship runs −1 to 68 days, median ~35. Short-term confidentiality is always ~180 days. Given a spring-2027 launch, I expect the VR Glasses grant(s) around 2027-01-10 to 2027-04-30 (outer window Dec 2026–early Jun 2027), and internal photos would not be public until ~Jul–Oct 2027. FCC exhibits rarely mention cameras; one exception is the Oakley HSTN note "change ... camera". Samsung SM-O200P/J (granted 2026-09-27) exhibits contain no camera or autofocus detail. Meta's developer page does say "passthrough with autofocus" (saved copy). The KR, JP and BT SIG registries could not be accessed.
