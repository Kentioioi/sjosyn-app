# Non-mechanical / tunable-lens competitors to poLight TLens — Optotune, Corning Varioptic, Sheba, others, Meta in-house, and poLight's foundry/assembly partners (ST, Tong Hsing)

Compiled 2026-10-06. Scope: tunable-lens / non-VCM autofocus suppliers that could compete with poLight's TLens for the autofocus cameras of top-tier AR/VR/XR glasses, plus (a) evidence of Meta developing its own piezo tunable lens and (b) poLight's manufacturing chain (STMicroelectronics → Tong Hsing/assembly partners → Q Tech). VCM and SMA (Cambridge Mechatronics) suppliers are covered in other entity files.

Method note: WebSearch budget was exhausted mid-task; the remaining facts come from direct fetches (WebFetch/Firecrawl/curl) of primary PDFs and pages. Where only a search-engine snippet could be seen, the row says so. Dates are only given where seen in a source. "n/s" = not sourced in this session.

---

## 0. Executive read-out (what the dated evidence says)

1. **Optotune is the only tunable-lens competitor with a product that is physically comparable to a TLens-class component for glasses** (EL-3.1-10.8: 1.72 mm high, 0.3 g, 3.1 mm aperture, 20 mW @ 10 dpt). Its public launch came on **2026-09-21** (LinkedIn) with a datasheet dated **2026-09-18**, but the part's Handling Instructions are dated **2025-09-17**, so OEM-facing documentation existed a full year earlier. No consumer/XR design win, financing round, or XR conference talk by Optotune was found; its own pages describe "custom tunable liquid lenses for the AR/VR market" and "Mu per month" capacity.
2. **Corning Varioptic** is explicitly positioned by Corning as "Market-leading adjustable lens solutions for industrial applications" (page last modified 2026-09-24); its 2026–27 event calendar is machine-vision shows. Corning's AR effort is **waveguide glass**, not autofocus lenses. The smallest Varioptic lens (A-16F, 1.6 mm CA) is a barcode/endoscope part; the A-25H packaged lens is 3.5 mm thick — thicker than Optotune's 1.72 mm or a TLens.
3. **Sheba Microsystems** launched an AR/VR/XR MEMS sensor-shift autofocus camera on **2024-01-09** (<10 mW, <5 ms) but, per the Ontario CES-2026 delegate page, had **17 employees and USD 400K annual sales** in 2026 — not at consumer-ramp scale. A COO hire on **2026-06-09** is framed as a "new acceleration phase".
4. **Meta's own patents** describe exactly a piezo-membrane tunable lens for a >100° FOV wearable camera. **US 12,663,619 B2 (granted 2026-06-23, filed 2023-02-08)** cites three poLight documents as "Other Publications" (48MP 120° FOV TLens Add-In; "New PZT MEMS Tunable Optics Technology Solutions", MSTC 2022-04-27; Packaged TLens), retrieved by Meta on **2022-10-19**. A continuation on a **tunable-lens barrel** published **2026-09-17**. A former Meta engineer's public LinkedIn profile (now at Tesla), who is a named inventor on three of these Meta camera patents, states he "Led development of miniature piezoelectric tunable lens AF camera module ... passing full reliability qualifications for AR/VR/MR". No evidence was found of Meta owning a tunable-lens fab or of a Meta–STMicroelectronics piezo-MEMS deal; no Reality Labs paper on camera-side tunable lenses was found.
5. **STMicroelectronics** has made poLight's PZT thin-film actuators at its 200 mm Agrate fab since the **2014-09-23** TFP-process launch (volume from mid-2015). **Tong Hsing (THEIL)** has been the assembler since at least **Q1 2017**. poLight's 2025 annual report says **"No new MEMS wafers were ordered, manufactured or delivered during the year"** (inventory sufficient) and that Q Tech's dedicated TLens assembly/test line was "under establishment" with poLight invoicing **USD 313,141** of NRE in **March 2026**. A fresh ST wafer order would therefore be a leading indicator of a volume ramp.

---

## 1. Optotune (Switzerland)

### 1.1 Profile
Optotune Switzerland AG (Dietikon, ETH Zurich spin-off founded 2008 by Manuel Aschwanden, David Niederer and Mark Ventura) makes electrically focus-tunable "shape-changing" liquid lenses actuated by voice-coil (electromagnetic) actuators, plus speckle reducers, 2D mirrors and pixel-shifters. It is privately owned (early support: Venture Kick CHF 130,000; investors listed by CB Insights are Venture Leaders Mobile, Venture Kick, Debiopharm Investment, ETH Zurich). It reports "2+ million units shipped worldwide", "180+ employees" and "200+ patents filed" (about-us page) and runs production in Switzerland, Slovakia (since 2017) and Taiwan. poLight names Optotune as one of its two tunable-optics competitors (per the user's earlier thread). Relevance: its new EL-3.1-10.8 is the first Optotune lens in a TLens-class form factor marketed for "high-volume OEM integration", and Optotune's AR page offers custom lenses "for the AR/VR market".

### 1.2 Timeline
| date | precision | category | event | source URL | source type | confidence |
|---|---|---|---|---|---|---|
| 2008 | year | other | Optotune founded as ETH Zurich spin-off ("focusing and steering light"). | https://www.optotune.com/about-us/ | company | confirmed |
| 2011 | year | other | Ranked No. 1 Swiss startup (Top100 Swiss Startup Award). | https://www.optotune.com/about-us/ | company | confirmed |
| 2017 | year | capacity | First manufacturing site outside Switzerland opened in Slovakia (Trnava). | https://www.optotune.com/about-us/ | company | confirmed |
| 2018 | year | hire | Passed 100 employees. | https://www.optotune.com/about-us/ | company | confirmed |
| 2019 | year | other | Sales office established in Taiwan. | https://www.optotune.com/about-us/ | company | confirmed |
| 2020-12-01 | day | product_release | EL-3-10 datasheet revision "01.12.2020" (distributor-hosted copy; earlier revision cited by search results). | https://1stvision.com/lens/Optotune/dataman/Optotune%20EL-3-10.pdf | company (via distributor) | strong |
| 2021 | year | capacity | "One-millionth Optotune component shipped". | https://www.optotune.com/about-us/ | company | confirmed |
| 2022-12 (brochure upload date) | month | roadmap | Company brochure: "250 employees in Switzerland, Slovakia, Taiwan and Korea", "More than 1 million products sold worldwide", "MARKETS Industrial, medical, AR/VR and automotive markets", "5000 m2 production & cleanroom capacities exceeding 300 Ku/year", "privately owned". | https://www.japanlaser.co.jp/wp2025/wp-content/uploads/2022/12/Optotunefocustunablelensesbrochure.pdf | company | confirmed |
| undated (legacy AR page) | n/a | roadmap | Optotune AR/VR page: "Optotune provides custom tunable liquid lenses for the AR/VR market ... The process for custom lens design is well defined and controlled from specification to volume production. Optotune is a manufacturing company with large volume capacity (Mu per month)." (Current optotune.com/augmented-reality no longer shows this text; mirror at expo21xx.) | https://www.expo21xx.com/optics/22412_st3_optical-components/default.htm | company (mirror) | strong |
| 2023-03-14 | day | product_release | EL-3-10 datasheet revision "Update: 14.03.2023". | https://www.optotune.com/images/products/Optotune%20EL-3-10.pdf | company | confirmed |
| 2025-08-19 | day | patent | US patent granted to Optotune AG, "Tunable lens and method for operating a tunable lens" (inventor Michael Büeler) — seen only in Justia assignee-page snippet. | https://patents.justia.com/assignee/optotune-ag | patent office (via Justia snippet) | strong |
| 2025-09-17 | day | product_release | EL-3.1-10.8 **Handling Instructions** dated "Update: 17.09.2025" — the part existed in customer documentation a year before public launch. | https://www.optotune.com/wp-content/uploads/OptotuneEL-3.1-10.8HandlingInstructions.pdf | company | confirmed |
| 2026-01-08 | day | hire | Job post "US Sales Manager (Remote)": Optotune develops "adaptive optical elements for industrial and consumer applications"; no AR/VR wording. | https://join.com/companies/optotune/16770829-us-sales-manager | company (job board) | confirmed |
| 2026-04-10 | day | product_release | EL-7-20-TC datasheet revision "Update: 10.04.2026". | https://www.optotune.com/wp-content/uploads/2026/04/Optotune-EL-7-20-TC.pdf | company | confirmed |
| 2026-07-09 | day | product_release | EL-3-10 datasheet revision "Update: 09.07.2026" (3 mm CA, 1.25 g, 0–100 mW full range, 0–15 mW for ±5 dpt, <1 ms response, 2/4 ms settling, >1e9 cycles). | https://www.optotune.com/wp-content/uploads/OptotuneEL-3-10datasheet.pdf | company | confirmed |
| 2026-09-18 | day | product_release | EL-3.1-10.8 **datasheet** "Update: 18.09.2026": CA 3.1 mm, body Ø10.8 mm, height 1.72 mm, weight 0.3 g, -8 to +8 dpt (class 1: -8 to +10), response 1 ms, settling 4 ms (conditioned) / 7 ms (rectangular step), 20 mW for 10 dpt range, 85 mW for 16 dpt range, -20…85 °C, >1e9 cycles, coil 8.5 Ω, ±125 mA nominal; four SKUs (OEM / FPC55, class 1/2). Text: "designed for OEM integration ... ultra-compact". No AR/VR wording in the datasheet. | https://www.optotune.com/wp-content/uploads/OptotuneEL-3.1-10.8datasheet.pdf | company | confirmed |
| 2026-09-21 | day (decoded from LinkedIn activity ID 7507719871812706304 → 2026-09-21 08:38 UTC) | announcement | LinkedIn launch post: "Today we're introducing the new EL-3.1-10.8, our most compact liquid lens designed for high-volume OEM integration." | https://www.linkedin.com/posts/optotune_el-31-activity-7507719871812706304-gR5C | company (social) | strong (date derived from ID) |
| 2026 (current) | n/a | roadmap | CCM series page: "liquid lens cores and actuated lens solutions for compact devices ... mobile phones, action cams, robotics, or embedded vision"; variants H0/H1/H2/H3/Maia 1/Maia 2; table lists EL-3.1-10.8 (-8 to 10 dpt, 3.1 mm, Ø10.8, 1/4 ms). A search-engine snippet of the same site reads "mini camera modules ... fast, low-power autofocus, ideal for AR/VR, mobile, and automotive" (not verified on the fetched page). | https://www.optotune.com/products/focus-tunable-lenses/ccm-series/ | company | confirmed (snippet part: circumstantial) |
| 2026 (current) | n/a | other | Homepage/about: "2+ million units shipped worldwide", "180+ employees", "200+ patents filed", AR/VR named among application areas. CB Insights counts 96 patents and total raised USD 130K. | https://www.optotune.com/ ; https://www.optotune.com/about-us/ ; https://www.cbinsights.com/company/optotune | company / analyst | confirmed |

### 1.3 Future / expected
| expected window | item | source | confidence |
|---|---|---|---|
| none announced | No Optotune consumer/XR design win, financing, or dated roadmap item was found. Optotune's AR page promises "custom" lenses to "volume production" but gives no timeline. | expo21xx mirror (above) | n/a |

### 1.4 Camera / autofocus relevance
EL-3.1-10.8 is a camera-side focus element (push-pull, concave to convex). Power is quoted as 20 mW for a 10 dpt range and 85 mW for 16 dpt (datasheet 2026-09-18) — versus poLight's "<6 mW" for TLens incl. driver (MLens article, mvpromedia 2026-10-01). Thickness 1.72 mm and 0.3 g are glasses-compatible. Optotune's lenses also appear on the **display** side of XR research (Stanford focus-tunable VR displays, PNAS 2017, on Optotune's publications page) — a different function.

### 1.5 Cadence
- EL-3-10 datasheet revisions: 2020-12-01 → 2023-03-14 (27 months) → 2026-07-09 (40 months).
- EL-3.1-10.8: handling instructions 2025-09-17 → datasheet 2026-09-18 → public launch post 2026-09-21: ~12 months of OEM documentation before public launch; launch two days before Meta's 2026-09-23 glasses announcement (no causal link evidenced).

### 1.6 Cross-links
- Optotune → Nextlens: both registered in Dietikon (startup.ch lists NEXTLENS Switzerland AG, founded June 2017, Dietikon); corporate relationship not verified in this session.
- Optotune → XR display research (Stanford varifocal displays using Optotune lenses, 2016–2017).

### 1.7 Gaps
No AWE/SPIE AR|VR|MR talk by Optotune found in the 2025 invited-talks volume or the 2026 Optical Architectures program; no job posts mentioning AR/VR; the LinkedIn post body beyond the first paragraph was not retrievable; patent list beyond one 2025 grant not retrievable (Justia blocked).

---

## 2. Corning Varioptic (Corning Inc., Advanced Optics; Lyon, France)

### 2.1 Profile
Varioptic (Lyon) pioneered electrowetting liquid lenses (two immiscible liquids whose interface curvature changes with voltage; no moving parts). AF liquid lenses have shipped since 2007 (camcorders, barcode readers, security cameras). The business passed from Parrot to Invenios (closed 2016-12-29) and then into Corning in 2017 ("an acquisition that included Varioptic and Invenios technologies"). Corning today sells A-series bare lenses (A-16F 1.6 mm, A-25H 2.5 mm, A-39N 3.9 mm, A-58N 5.8 mm CA), the new 8-electrode V-PE-80R0 (8.0 mm, focus + astigmatism), A-PE lenses with integrated driver, C-/S-/T-mount AF modules and the "AF Explorer" kit. Corning positions the line for "industrial applications"; Corning's AR activity is high-index waveguide glass. poLight names Corning as a tunable-optics competitor.

### 2.2 Timeline
| date | precision | category | event | source URL | source type | confidence |
|---|---|---|---|---|---|---|
| 2007 | year | product_release | Varioptic AF liquid lenses "deployed since 2007" in consumer/industrial devices (camcorders, barcode readers, security cameras). | https://www.laserfocusworld.com/optics/article/16563070/varioptic-programmable-liquid-lens-for-smart-phone-cameras | press | strong |
| 2011-01-24 | day | product_release | Varioptic B617 programmable liquid lens with OIS + AF for smartphones; "up to 90% less power" than VCM; sampling April 2011. (Second-generation family; no smartphone design win reported.) | same as above | press | confirmed |
| 2016-12-29 | day | partnership | Invenios LLC completes acquisition of Varioptic from Parrot Drones (undisclosed amount); assets moved to Invenios France SAS. | https://www.vision-systems.com/cameras-accessories/article/16750650/liquid-lens-company-varioptic-acquired-by-invenios ; https://www.lincolninternational.com/transactions/invenios-has-acquired-parrots-varioptic-business-unit/ | press / advisor | confirmed |
| 2017 | year | partnership | "Varioptic became a part of Corning in 2017 through an acquisition that included Varioptic and Invenios technologies" (John Duke, Corning). | https://www.corning.com/worldwide/en/about-us/news-events/news-releases/2019/06/corning-celebrates-2-million-varioptic-lenses.html ; mirror https://www.imveurope.com/press-releases/corning-delivers-two-million-varioptic-lenses | company | confirmed |
| 2018 | year | capacity | "Our manufacturing capacity nearly doubled in 2018" (Frédéric Laune); sales doubled over two years. | same | company | confirmed |
| 2019-06 | month | capacity | 2-millionth Corning Varioptic lens delivered (announced at Laser World of Photonics); markets: machine vision, barcode, medical imaging. | same | company | confirmed |
| 2022-01-28 | day | product_release | Corning launches 2.0 refractive-index glass for AR/MR diffractive waveguides (150/200/300 mm wafers), shown at SPIE AR|VR|MR and Photonics West. | https://displaydaily.com/corning-expands-high-index-glass-portfolio-to-help-accelerate-mass-adoption-of-augmented-reality-technology/ | press (release repost) | confirmed |
| 2023-12-19 | day | roadmap | Corning "Augmented Reality Solutions" page (release date in page metadata): "first to market with ultra-flat, high refractive index glass wafers for leading AR/MR device makers pursuing waveguide-based designs"; supports "high-volume manufacturing of waveguide-based AR/MR devices" for "industrial and consumer applications". No liquid-lens/AF mention. | https://www.corning.com/worldwide/en/products/advanced-optics/product-materials/PrecisionGlassSolutions/augmented-reality-solutions.html | company | confirmed |
| 2026-09-17 | day | analyst_report | Patsnap liquid-lens-AF-actuator patent landscape (37 records): LG Innotek 7, **Corning 5**, EyeSmart 4, **Meta Platforms Technologies 3**, Apple 3; filings fell 67% from 2021 to 2024. | https://www.patsnap.com/resources/blog/rd-blog/camera-module-liquid-lens-autofocus-actuator-patent-landscape-patent-landscape/ | analyst | strong |
| 2026-09-24 | day | roadmap | Corning Varioptic landing page (lastModified 2026-09-24): "Market-leading adjustable lens solutions for industrial applications"; new V-PE-80R0 8-electrode lens; new C-mount (12 mm) and S-mount (25 mm) modules; AF Explorer kit. Events: VISION Stuttgart 2026-10-06/08, ITE 2026-12-02/04, Photonics West 2027-01-30/02-04, Vision China 2027-03, Automate 2027-05. | https://www.corning.com/worldwide/en/products/advanced-optics/product-materials/corning-varioptic-lenses.html | company | confirmed |
| current | n/a | product_release | Edmund catalog: A-16F0 1.6 mm CA "smallest liquid lens currently available ... barcode engines, industrial and medical endoscopes"; A-25H0-P33 packaged lens Ø9.40 mm, 3.50 mm thick, -5 to +13 dpt, -30…+85 °C, "Typical applications: barcode readers, industrial cameras, medical imaging and biometrics"; A-25H1-D0 -35 to +35 dpt; A-39N -5 to +15 dpt; A-58N -5 to +10 dpt; D-V-PE-80R0-07 8.0 mm focus+astigmatism kit. | https://www.edmundoptics.com/f/corning-varioptic-variable-focus-liquid-lenses/15042/ ; https://www.edmundoptics.com/p/25mm-ca-vis-coated-a-25h0-p33-corningr-variopticr-variable-focus-liquid-lens-packaged-a-series---6-pins-fpc-with-thermistor/52390/ | distributor | confirmed |

### 2.3 Future / expected
| expected window | item | source | confidence |
|---|---|---|---|
| 2026-10-06 → 2027-05 | Trade-show calendar is entirely industrial/machine vision (VISION Stuttgart, ITE, Photonics West, Vision China, Automate). | Corning Varioptic page (2026-09-24) | confirmed |
| none | No consumer/XR Varioptic product or statement found. | — | — |

### 2.4 Camera / autofocus relevance
Electrowetting lenses are genuine camera AF elements with no moving parts, but current packaged parts are ≥3.5 mm thick with Ø9.4 mm bodies (A-25H), and Corning markets them for industrial use. Corning's AR role is waveguide substrate supply (high-index glass), i.e., display side.

### 2.5 Cadence
Milestones are sparse: acquisition 2017 → 2 M lenses 2019 → V-PE/A-PE platform refresh (undated, current). No consumer cadence.

### 2.6 Cross-links
- poLight's board includes a director whose background includes "development teams at Varioptic, Barco" (poLight AR2025, board bios).
- Corning's AR glass customers are unnamed ("leading AR/MR device makers").

### 2.7 Gaps
Corning's own A-series spec pages blocked (403) — response time and power figures for current parts not captured; exact 2017 Corning–Invenios closing date not found; the brief's "V-80R0" is Corning's V-PE-80R0 (confirmed), launch date not found.

---

## 3. Sheba Microsystems (Toronto, Canada)

### 3.1 Profile
Fabless MEMS company (founded 2015 per its Jan-2024 release; "Founded: 2016" per the Ontario CES-2026 delegate page) led by CEO/co-founder Dr. Faez Ba-Tis and CTO Ridha Ben Mrad. Its electrostatic silicon micro-actuators ("µPistons") move the **image sensor** (not the lens) along the optical axis for autofocus/athermalization; the sensor weighs ~25 mg. It markets to automotive, action cams, drones, surveillance and AR/VR cameras. Evidence of scale: 17 employees and USD 400K annual sales (2026). Relevance: it explicitly markets an "ultra-low power" AF camera for AR/VR/XR headsets, but has no disclosed customers.

### 3.2 Timeline
| date | precision | category | event | source URL | source type | confidence |
|---|---|---|---|---|---|---|
| 2015 / 2016 | year | other | Founded (2015 per company release summary; 2016 per Ontario delegate page). | https://venturebeat.com/business/sheba-microsystems-launches-mems-autofocus-compact-camera-for-ar-vr-xr-headsets/ ; https://www.sourcefromontario.com/en/page/delegate/138117/sheba-microsystems | company/press; government | strong |
| 2023-09-21 | day | product_release | Launch of MEMS AF actuator for "active athermalization" in embedded vision cameras (automotive, action, drones, machine vision, security, robotics). | https://www.businesswire.com/news/home/20230921387023/en/Sheba-Microsystems-Launches-Revolutionary-MEMS-Autofocus-Actuator-for-Active-Athermalization-in-Embedded-Vision-Cameras | company (wire) | confirmed |
| 2024-01-09 | day | product_release | "Sheba MEMS Autofocus Compact Camera for AR/VR/XR Headsets": sensor-shift µPistons, <10 mW, <5 ms response, <0.5 µm precision, supports large-aperture optics, no EMI; targets "consumer and enterprise AR/VR/XR". No customers named. | https://www.businesswire.com/news/home/20240109847144/en/Sheba-Microsystems-Launches-MEMS-Autofocus-Compact-Camera-for-ARVRXR-Headsets (mirror: VentureBeat above) | company (wire) | confirmed |
| 2024-05-16 | day | product_release | Sharp-7 "world's first autofocus automotive camera" (8 MP automotive sensor, integrated MEMS driver; -40 to 150 °C); demo at AutoSens Detroit 2024-05-21/23; evaluation kits "exclusively available for OEMs and Tier 1 customers". | https://www.businesswire.com/news/home/20240516532004/en/Sheba-Microsystems-Launches-Sharp-7-The-Worlds-First-Autofocus-Automotive-Camera | company (wire) | confirmed |
| 2024-06-11 | day | hire | Matt Crowley (ex-Sand 9, Vesper, Qualcomm) appointed Senior Strategic Advisor. | https://www.businesswire.com/news/home/20240611750148/en/ | company (wire) | confirmed (listing) |
| 2024-10-10 | day | other | DXOMARK test report on Sharp-7 across automotive temperature range. | https://www.businesswire.com/news/home/20241010637010/en/ | company (wire) | confirmed (listing) |
| undated (current) | n/a | roadmap | AR/VR/XR web page: "MEMS AF Actuator for AR/VR and Selfie Cameras in Smartphones" (January 2024); <7 mW ("20X less"), sensor 25 mg; evaluation kit (driver board, camera samples, Nvidia Jetson TX2); reliability: 600 thermal cycles, 100 M lifecycle cycles, drop tests. | https://shebamicrosystems.ca/ar-vr-xr/ | company | confirmed |
| 2026-01-06 → 01-09 | day | other | CES 2026 (Ontario delegation): "Founded: 2016; Staff: 17; Annual sales: USD 400K"; targets incl. "AR/VR camera systems". | https://www.sourcefromontario.com/en/page/delegate/138117/sheba-microsystems | government | confirmed |
| 2026-06-09 | day | hire | Vincent Cruvellier appointed COO — "Enters New Acceleration Phase"; brings "industrialization, supply chain, manufacturing readiness" experience. | https://www.businesswire.com/news/home/20260609394591/en/ | company (wire) | confirmed (listing) |
| undated | n/a | financing | Tracxn/PitchBook profiles describe Sheba as unfunded/bootstrapped (seen only in search-engine summaries). | https://tracxn.com/d/companies/sheba-microsystems/__rfJ8gy9N9yAIKKXP1p4a3DoRqXEmWeqe1DD1ig3iqhE | analyst | circumstantial |

### 3.3 Future / expected
None announced. The June-2026 COO hire signals an industrialization push but no customer or volume target was published.

### 3.4 Camera / autofocus relevance
Sensor-shift MEMS AF (moves a 25 mg sensor), <7–10 mW, <5 ms. Technically relevant for passthrough/world cameras; however, with 17 staff and USD 0.4 M sales in 2026 it has no demonstrated consumer volume.

### 3.5 Cadence
Product cadence 2023-09 → 2024-01 (3.5 months) → 2024-05 (4 months) → 2024-10 (validation) → 2026-06 (COO). ~20-month gap between the last product news and the COO hire.

### 3.6 Cross-links
None to Meta, Q Tech, ST or poLight found.

### 3.7 Gaps
PitchBook/Crunchbase/Tracxn pages blocked; no funding round or customer could be confirmed.

---

## 4. Other tunable / liquid / LC lens players (camera-side) and display-side varifocal players (kept separate)

### 4.1 Camera-side players
| date | precision | category | company — event | source URL | source type | confidence |
|---|---|---|---|---|---|---|
| 2010-02-16 | day | financing | **LensVector** (LC autofocus, Université Laval tech): USD 30 M Series C (IVP; Menlo, Samsung, SVB, Mitsui, Kodak), USD 50 M total; "sampling today with key customers" (handsets). | https://www.laserfocusworld.com/optics/article/16568582/lensvector-gets-50-million-for-solid-state-lcd-autofocus-technology | press | confirmed |
| current | n/a | other | **LensVector** now owned by Patqer Photonique Inc.; products are LC beam-shaping lenses (S2F/M2M, 35–65 mm) for lighting; website lists XR and "variable-focus camera lenses" as application areas but no camera AF product. | https://lensvector.com/ | company | confirmed |
| 2017-06 / 2019 | year | other | **NEXTLENS** (Switzerland): "holding company focusing on bringing innovative tunable optical components to the mobile phone industry" — founded June 2017, Dietikon (startup.ch) / 2019, canton NW (startupticker). | https://www.startup.ch/nextlens-switzerland ; https://www.startupticker.ch/en/companies/nextlens-ag | directory | strong |
| 2021-03-30 (approx.; Xiaomi launch "today" in article) | day | design_in | **NEXTLENS** liquid lens in Xiaomi Mi MIX Fold telephoto/macro camera — "first ever usage of its novel liquid lens element in a flagship phone" (Nextlens via gophotonics; Xiaomi launch per Android Central). | https://www.androidcentral.com/xiaomis-new-1500-mi-mix-fold-galaxy-z-fold-2-rival-liquid-lens-camera ; https://www.gophotonics.com/news/details/2605-first-ever-smartphone-camera-powered-by-liquid-lens-technology | press | strong |
| 2021-05-06 | day | design_in | startupticker: "Flagship smartphone camera powered by Swiss technology" (Nextlens). | https://www.startupticker.ch/en/companies/nextlens-ag | press | confirmed |
| 2022-12-14 | day | other | Nextlens among ten startups representing Switzerland at MWC 2023. | same | press | confirmed |
| 2024-07-16 | day | financing | **Phaseform GmbH** (Freiburg): >EUR 6 M EIC Accelerator for Deformable Phase Plate (transmissive adaptive optics) — ophthalmology/microscopy; no camera-AF or XR positioning. | https://www.optica.org/about/newsroom/corporate_member_news/2024/phaseform_gmbh_wins_over_eu6m_funding_from_the_eic-accelerator | industry body | confirmed |
| current | n/a | other | **Holochip** (US): defense/XR software and the H50 "ruggedized goggle-style AR device"; "Adaptive Lenses" listed only as a project. | https://holochip.com/ | company | confirmed |
| 2016–2026 | year | partnership | **Metalenz** (Boston; metasurface flat optics — *not* a tunable/AF lens): founded 2016; ST partnership disclosed June 2021; **2022-06-09** ST VL53L8 dToF = first metasurface in mass production; **2022-10-12** USD 30 M Series B (Neotribe; Intel Capital, TDK Ventures, 3M Ventures, Foothill, M Ventures et al.); 2023 UMC foundry partnership; 2024 Polar ID at MWC; **2025-07-10** expanded ST license (ST 300 mm fab), >140 M units shipped since 2022; **2025-08-18** 150+ patents; **2025-11-12** UMC Polar ID mass production; 2026 Polar ID under-display at Display Week, Gen-1 >300 M units, Polar 3D at MWC. No AR-glasses or autofocus product found. | https://metalenz.com/about-us/ ; https://newsroom.st.com/media-center/press-item.html/t4458.html ; https://metalenz.com/metalenz-raises-30-million-series-b-led-by-neotribe-ventures/ ; https://www.optica.org/about/newsroom/corporate_member_news/2025/stmicroelectronics_and_metalenz_sign_a_new_license_agreement_to_accelerate_metasurface_optics_adopti/ ; https://metalenz.com/?p=3407 | company / industry body | confirmed |
| — | — | other | **Dynamic Optics** (IT), **TAG Optics** (US; domain now parked for sale), **Edmund** (reseller of Optotune and Corning Varioptic only) — no primary data retrievable. **Twenty20 Therapeutics** — not camera-relevant; not researched. | https://www.tag-optics.com/ (parked) | — | gap |

### 4.2 Display-side varifocal / tunable see-through lenses (could be confused with camera AF — different function)
| date | item | source | note |
|---|---|---|---|
| 2016–2017 | Stanford/Optotune focus-tunable VR displays (PNAS 2017 "Optimizing virtual reality for all users through gaze-contingent and adaptive focus displays") listed on Optotune's publications page. | https://www.optotune.com/publications/ | display-side use of Optotune lenses |
| 2023 | Meta Reality Labs "Butterscotch Varifocal" prototype — mechanical display movement with eye tracking (seen in search summary only). | https://www.laserfocusworld.com/optics/article/55132443/tunable-focus-lenses-enhance-see-through-augmented-reality-glasses | display-side, not camera |
| 2025-01 | SPIE AR|VR|MR 2025 invited talks include FlexEnable "flexible active optics for AR/VR" (LC) and poLight's Pierre Craen "Making vision better: improving AR/MR cameras and micro display systems"; Meta's Jason Hartlove gave the opening strategic talk. | https://spie.org/Publications/Proceedings/Volume/13415 | see §5 |
| 2026-01-19 | SPIE AR|VR|MR 2026 session 6 "Switchable, Tunable and Flexible See-Through Lenses" (chair Andreas Georgiou, Reality Optics): Oxford Optical Labs fluid lens for in-device prescription; FlexEnable plastic LC dimming cells; QMUL dielectric-elastomer tunable lenses (cancelled). No Optotune/Corning/Sheba/poLight talk in this session. | https://spie.org/AVR26/conferencedetails/optical-architectures-for-displays-and-sensing-in-augmented-virtual-and-mixed-reality | display/prescription side |
| — | Deep Optics (IL), Morrow (BE), LC-Tec, Elcyon: sites unreachable in this session; not characterised. | — | gap |

---

## 5. Meta's own in-house piezo tunable lens — evidence

### 5.1 Profile
Meta Platforms Technologies LLC holds a cluster of camera patents for wearables that (i) describe a thin-film PZT piezo actuator deforming a soft polymer/membrane tunable lens inside a >100° FOV, ~5 mm track-length camera, (ii) integrate the tunable-lens electrode into the lens barrel, and (iii) minimise AF actuation power on a smartwatch camera. The granted wide-FOV patent cites poLight's TLens Add-In and PZT-MEMS material as prior art, and a named inventor on three of the filings publicly states he led development and reliability qualification of a "miniature piezoelectric tunable lens AF camera module" for AR/VR/MR at Meta. No evidence was found that Meta fabricates tunable lenses itself, has a foundry agreement (e.g., with ST) for them, or has published Reality Labs research on camera-side tunable lenses.

### 5.2 Timeline
| date | precision | category | event | source URL | source type | confidence |
|---|---|---|---|---|---|---|
| 2022-04-27 | day | other | poLight presents "New PZT MEMS Tunable Optics Technology Solutions" at MEMS Sensor Technical Congress (MSTC 2022) — later cited by Meta's patent. | https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/12663619 (p. 2, Other Publications) | patent office | confirmed |
| 2022-07-12 | day | patent | Meta files application for "Camera device assembled with lens-to-sensor distance that reduces auto-focusing actuation power in macro mode" (inventors Abhishek Dhanda, **Lidu Huang**, Yizhi Xiong) — smartwatch/wristband camera. | https://patents.google.com/patent/US12493197B2/en | patent office | confirmed |
| 2022-10-19 | day | other | Meta's filing team retrieves poLight web pages "48MP 1/1.5\" 120° FOV F/2.2 TLens Add-In" and "Packaged TLens" (retrieval date printed in the patent's citations). | USPTO PDF above | patent office | confirmed |
| 2023-02-08 | day | patent | Meta files US 18/107,338 "Wide field of view (FOV) optical lens assembly with tunable optical lens" (inventors Dongmin Yang, Romeo Iguico Mercado, Yi Zhou, Yizhi Xiong): PZT thin-film piezo actuator modifies a tunable lens between two lens groups; FOV >100° diagonal; autofocus/zoom without increasing track length. | USPTO PDF above | patent office | confirmed |
| 2023-05-10 | day | patent | Meta files US 2023/0280637 A1 "Camera device with two-stage actuators ..." (Vijay Kumar, **Lidu Huang**, Samuel Tam); published 2023-09-07; smartwatch/headset wearable; status **abandoned**. | https://patents.google.com/patent/US20230280637A1/en | patent office | confirmed |
| 2023-06-15 | day | patent | Meta files US 18/210,574 (lens barrel with built-in conductor for a tunable lens) — parent of the 2026 continuation. | https://patentlyze.com/patent/meta-tunable-lens-barrel-built-electrode/ | patent office (via aggregator) | strong |
| 2023-07-26 | day | patent | Meta files CIP US 18/359,544 (Jianer Bao, Yi Zhou, Yizhi Xiong, Dongmin Yang, Tuoqi Li, Alexander Hsing): tunable lens with soft transparent polymer layer reshaped by piezoelectric actuators / multi-zone transparent piezo layer; published **2024-08-08** as US 2024/0264430 A1; assigned 2023-09-25. | https://patents.google.com/patent/US20240264430A1/en ; https://patents.justia.com/patent/20240264430 | patent office | confirmed |
| 2024-08-08 | day | patent | US 2024/0264413 A1 published (pre-grant publication of 18/107,338). | USPTO PDF above | patent office | confirmed |
| 2025-01 | month | other | SPIE AR|VR|MR 2025 invited talk: Jason Hartlove (Meta), "Accelerating the augmented reality revolution: a strategic analysis of enabling technologies and emerging trends". Same volume: poLight CTO Pierre Craen on AR/MR cameras. | https://spie.org/Publications/Proceedings/Volume/13415 | conference | confirmed |
| 2025-12-09 | day | patent | **US 12,493,197 B2** granted (low-power AF smartwatch camera; inventor Lidu Huang). | https://patents.google.com/patent/US12493197B2/en | patent office | confirmed |
| 2026-01-19 → 01-20 | day | other | SPIE AR|VR|MR 2026 "Optical Architectures for Displays and Sensing" conference chaired by Naamah Argaman (Meta) with Meta program-committee members (Weichuan Gao, Zhujun Shi, Guohua Wei, Miaomiao Xu); Meta paper "On-chip laser beam scanner based on SiN PIC integrated with PZT MEMS cantilever for AR" (display side). No Meta talk on autofocus cameras found. | https://spie.org/AVR26/conferencedetails/optical-architectures-for-displays-and-sensing-in-augmented-virtual-and-mixed-reality | conference | confirmed |
| 2026-04-30 | day | patent | Meta files continuation (of 18/210,574) on the tunable-lens barrel (inventors **Lidu Huang**, Michael Andrew Brookmire, Vijay Kumar, Ingrid Anda Cotoros). | https://patentlyze.com/patent/meta-tunable-lens-barrel-built-electrode/ | patent office (via aggregator) | strong |
| 2026-06-23 | day | patent | **US 12,663,619 B2** granted ("Wide field of view (FOV) optical lens assembly with tunable optical lens"; 15 claims; term adjusted by 356 days). Cited references include poLight ×3 (above), US 2020/0204740 A1 (Tallaron et al., 6/2020 — a poLight-inventor family) and WO 2022/245801 A1. | https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/12663619 | patent office | confirmed |
| 2026-09-17 | day | patent | **US 2026/0276939 A1** published: "conductive via runs through lens barrel so an electrical signal can adjust an optical power of the tunable lens held by the lens barrel"; targets "AR glasses" compact cameras. | https://patentlyze.com/patent/meta-tunable-lens-barrel-built-electrode/ | patent office (via aggregator) | strong |
| undated (profile live 2026-10) | n/a | hire | LinkedIn profile "Lidu H. – Tesla": "Led development of miniature piezoelectric tunable lens AF camera module, exceeding design targets and passing full reliability qualifications for AR/VR/MR ..." — Lidu Huang is a named inventor on US 12,493,197 B2, US 2023/0280637 A1 and US 2026/0276939 A1 (Meta). Employment dates (Sept 2020–Apr 2025 per the user's earlier thread) could not be verified (profile scraping blocked). | https://www.linkedin.com/in/lidu-h-3825903 | forum/social | strong (text seen in search snippet) |

### 5.3 Future / expected
| expected window | item | source | confidence |
|---|---|---|---|
| 2026-Q4 → 2027 | Possible grant of the 2024/0264430 CIP and the 2026/0276939 continuation (pending). | Google Patents / Patentlyze | circumstantial |

### 5.4 Camera / autofocus relevance
The granted patent is a camera-side (world-facing) architecture: tunable element between fixed lens groups, >100° FOV, PZT thin-film piezo, "without increasing a length of the optical lens assembly". The cited poLight material (48 MP 1/1.5" 120° FOV F/2.2 TLens Add-In; packaged TLens; PZT-MEMS presentation) is the same product family poLight sells. The LinkedIn statement is the only public evidence that a piezo tunable-lens AF module "passed full reliability qualifications for AR/VR/MR" inside Meta; it does not say whose lens.

### 5.5 Cadence
Filing → grant: 2022-07-12 → 2025-12-09 (41 months); 2023-02-08 → 2026-06-23 (40 months). Continuation filed 10 months after the parent's prosecution (2026-04-30) and published 4.5 months later (2026-09-17), six days before Meta's 2026-09-23 glasses announcement.

### 5.6 Cross-links
- Meta ↔ poLight: three poLight citations in US 12,663,619 (retrieved 2022-10-19) and a Tallaron (poLight) application cited.
- Meta ↔ Lidu Huang ↔ piezo tunable lens AF qualification for AR/VR/MR (LinkedIn).
- Meta ↔ STMicroelectronics: none found for tunable lenses (ST is poLight's PZT foundry and Metalenz's metasurface foundry; no Meta link).
- Meta ↔ Cambridge Mechatronics: CML references in US 2023/0280637 per the user's thread; not re-verified here (Google Patents citation list not fully read).

### 5.7 Gaps
No Reality Labs Research paper on camera-side tunable lenses located; no Meta job posts examined; LinkedIn employment dates unverifiable; Google Patents returned 404 for the B2 number (USPTO PDF used instead).

---

## 6. STMicroelectronics and Tong Hsing — poLight's manufacturing chain

### 6.1 Profile
poLight is fabless: the optical polymer is made in Horten (Norway); **STMicroelectronics** fabricates the PZT thin-film piezo MEMS actuator wafers at a 200 mm (8-inch) fab in Agrate, Italy, using the TFP process ST launched in 2014 with poLight as first customer; **Tong Hsing Electronic Industries (THEIL)** has assembled and tested complete TLenses since at least 2017 (poLight's 2021–2025 reports refer generically to "assembly partners" in Taiwan/the Philippines/China); since 2025-04-15, **Q Tech** is building a dedicated TLens assembly and test line in China. ST is also Metalenz's metasurface foundry (300 mm), which is why ST appears in both camps.

### 6.2 Timeline
| date | precision | category | event | source URL | source type | confidence |
|---|---|---|---|---|---|---|
| 2011-09-07 | day | capacity | poLight signs process-demonstration agreement with SVTC Technologies (US) to scale TLens manufacturing: ~1 million units/month on 8-inch wafers, with parallel ramp at a larger manufacturer. | https://optics.org/news/polight-moves-to-scale-up-tunable-lens-production | press | confirmed |
| 2014-09-23 | day | partnership | ST unveils TFP thin-film piezoelectric MEMS process; "one of the first customers" is poLight (TLens: "10 times faster than VCM ... 1/20 of the power"); volume production from the 200 mm Agrate fab targeted mid-2015. | https://www.eenewseurope.com/en/st-adds-piezoelectric-mems-to-process-portfolio/ ; https://www.eejournal.com/industry_news/20140923-05/ | press / company | confirmed |
| 2014–2015 | year | capacity | "poLight is ramping up manufacturing capacity in a cooperation with ST Microelectronics ... volume production planned for the second half of 2015"; "the company owns the full process IP and could easily second source". | https://www.eenewseurope.com/en/polight-readies-mems-lens-actuator-for-mass-production/ | press | confirmed |
| 2017-Q1 | quarter | capacity | Q1-2017 interim report: "poLight works primarily with two sub-contractors – STMicroelectronics (ST) and Tong Hsing Electronic Industries, Ltd. (THEIL). ST produces the actuator, and THEIL assembles the complete product." "A capacity increase from 400 wafers/month to 1 000 wafers/month is under planning (i.e. 900 000 to 2 250 000 units per month un-yielded) in cooperation with ST." Wafer output from ST increased; first design-win targeted 1H 2017. | https://storage.mfn.se/a/polight/12a0b071-242d-4abd-be78-d536370ee49d/q1-2017-polight-interim-report.pdf | company/IR | confirmed |
| 2017-Q2 | quarter | capacity | Q2-2017: "ST is currently working on further capacity increases"; improved TLens packaging "underway at THEIL"; ST material used for assembly at THEIL "for yield optimization ... and for supply to various customer qualification programs"; wafers buffered for a potential customer delivery in 1H 2018. | https://storage.mfn.se/a/polight/c70298c6-dfec-44c8-8eb0-ddf7d85b101c/q2-2017-polight-interim-report-20-1.pdf | company/IR | confirmed |
| 2021 (AR published 2022) | year | capacity | AR2021: "Polymer and wafers with actuators are shipped to manufacturing partners in the Philippines and Taiwan"; "poLight collaborates with two assembly partners in Asia ... The targeted monthly assembly capacity is planned to exceed 1 million towards the end of 2022"; "ST has been, and is still, processing a backlog of wafers ordered by poLight". | https://mb.cision.com/Main/14821/3555201/1570577.pdf | company/IR | confirmed |
| 2024 (AR published 2025) | year | capacity | AR2024: ST "manufacturing partner for the MEMS actuator, utilising their thin film piezo technology in an 8-inch semiconductor fabrication plant in Italy. Polymer and wafers with actuators are shipped to manufacturing partners in the Philippines which assemble and test"; employees in the Philippines (expense line: Philippines 6,338 / 7,176 kNOK). | https://storage.mfn.se/c/aHR0cHM6Ly9tYi5jaXNpb24uY29tL01haW4vMTQ4MjEvNDE0MzAzNi8zNDE5OTkyLnBkZg/polight-annual-report-2024.pdf | company/IR | confirmed |
| 2025-04-15 | day | partnership | Q Tech strategic investment (63,743,112 shares at NOK 2.69 = NOK 171,468,971 gross; later total NOK 209.5 M net incl. subsequent offering) "backed by a top tier U.S. consumer electronics customer"; "Q Tech is working to establish a dedicated TLens® assembly and test line". ST and Tong Hsing not mentioned in the release. | https://www.polight.com/mfn_news/polight-asa-enters-into-strategic-investment-agreement-with-q-technology-group-backed-by-u-s-top-tier-consumer-electronics-oem/ | company/IR | confirmed |
| 2025 (AR published 2026) | year | capacity | AR2025: partners now "in the Philippines and China"; "Output from the assembly partner has increased throughout the year, and a new assembly line setup at Q Tech in China is under establishment. **No new MEMS wafers were ordered, manufactured or delivered during the year, as inventory has been considered to be sufficient.**" Component inventory (mainly wafers at cost) NOK 78.3 M. Lead-free (non-PZT) piezo wafer programme: first lead-free TLens samples assembled. TLens weighs "approx. 6 milligrams". Deliveries 2025: AR/MR 55 %, industrial 32 %, healthcare 19 %; TLens in 42 products (28 in 2024); revenue NOK 20.5 M (+114 %). | https://storage.mfn.se/4705396e-22eb-4885-bf69-882310f55558/polight-asa-annual-report-2025.pdf | company/IR | confirmed |
| 2026-03 | month | capacity | poLight invoiced Q Tech (through its distributor) **USD 313,141** for 2025 NRE support in establishing the Q Tech assembly/test line and "getting it qualified for mass production"; agreement that poLight can invoice 50 % of such expenses; "This work has continued into 2026." | AR2025 (Note 18/19), same PDF | company/IR | confirmed |
| 2021-06 / 2022-06-09 / 2025-07-10 | day | partnership | ST–Metalenz: partnership disclosed June 2021; VL53L8 metasurface product debut 2022-06-09 (Boston/Geneva release); expanded license 2025-07-10 to make metasurface optics in ST's 300 mm fab (>140 M units shipped since 2022). (Context: ST runs both poLight's PZT MEMS and Metalenz's meta-optics.) | https://newsroom.st.com/media-center/press-item.html/t4458.html ; https://www.optica.org/about/newsroom/corporate_member_news/2025/stmicroelectronics_and_metalenz_sign_a_new_license_agreement_to_accelerate_metasurface_optics_adopti/ | company | confirmed |

### 6.3 Future / expected
| expected window | item | source | confidence |
|---|---|---|---|
| 2026 | Qualification of Q Tech's dedicated TLens assembly/test line "for mass production" (work "continued into 2026"). | poLight AR2025 | strong |
| unknown | Next ST MEMS wafer order — none in 2025; a new order would precede any multi-million-unit ramp by the wafer lead time (ST processed a wafer "backlog" in 2021–22). | poLight AR2021/AR2025 | inference |
| multi-year | Lead-free piezo TLens (replacing PZT) — EU RoHS exemption for PZT MEMS expected to be withdrawn "at some point". | poLight AR2025 | strong |

### 6.4 Cadence observations
- Capacity statements: 2011 (~1 M units/month plan at SVTC) → 2017 (400→1,000 wafers/month plan with ST, i.e. 0.9→2.25 M units/month un-yielded) → 2021 (>1 M assembled/month targeted by end-2022) → 2025 (no new wafers; Q Tech line being built). Capacity has repeatedly been planned years ahead of demand.
- Tong Hsing: named only in 2017-era reports; 2021–2025 reports use "assembly partners" (Taiwan → Philippines → Philippines and China).

### 6.5 Cross-links
- ST ↔ poLight (PZT foundry since 2014); ST ↔ Metalenz (meta-optics foundry since 2021/22); no ST ↔ Meta tunable-lens link found.
- Tong Hsing/THEIL ↔ poLight (assembly since ≤2017); Q Tech ↔ poLight (2025-04-15 agreement; line under establishment; NRE invoiced 2026-03).

### 6.6 Gaps
Whether the "Philippines" assembly partner is Tong Hsing's Philippine operation was not confirmed in sources; no ST or Tong Hsing public statement specific to poLight after 2014 was found; no wafer-level capacity number after 2017.

---

## 7. Comparison table (each cell sourced; "n/s" = not sourced in this session)

| Supplier / product | Technology | Aperture | Thickness | Weight | Power | Response time | Maturity / shipped volumes | Documented XR engagement |
|---|---|---|---|---|---|---|---|---|
| **poLight TLens** | PZT thin-film piezo MEMS on glass membrane deforming optical polymer; ST fab + THEIL/Q Tech assembly [poLight AR2025 pdf; eeNews 2014] | 48 MP 1/1.5" 120° FOV F/2.2 "TLens Add-In" reference design (aperture n/s) [USPTO 12663619 p.2] | n/s here (see poLight file) | "approx. 6 milligrams" [AR2025] | "<6 mW" (MLens/TLens incl. driver) [mvpromedia 2026-10-01]; "1/20 the power" of VCM [eeNews 2014-09-23] | "<5 ms" 10–90 % (MLens) [mvpromedia]; "10 times faster than VCM" [eeNews 2014] | 42 products end-2025 (28 in 2024); revenue NOK 20.5 M; no new wafers ordered 2025 [AR2025] | 55 % of 2025 deliveries to AR/MR; "Top Tier U.S. Consumer Electronics OEM" POs 2025-10-13, 2026-02-11, 2026-04-07; Q Tech line backed by "top tier U.S. consumer electronics customer" (2025-04-15) [AR2025 list; polight.com] |
| **Optotune EL-3.1-10.8** | Shape-changing liquid lens, voice-coil actuator, push-pull [datasheet 2026-09-18] | 3.1 mm CA; body Ø10.8 mm [datasheet] | 1.72 mm height [datasheet] | 0.3 g [datasheet] | 20 mW (10 dpt range); 85 mW (16 dpt) [datasheet] | 1 ms response; 4 ms settling (conditioned) / 7 ms (step) [datasheet] | Launched 2026-09-21 (docs since 2025-09-17); company 2+ M units shipped, 300 Ku/yr cleanroom capacity (2022), "Mu per month" claim [LinkedIn post; brochure 2022; expo21xx] | "custom tunable liquid lenses for the AR/VR market" page; no design win, talk, or financing found [expo21xx mirror] |
| **Optotune EL-3-10** | same [datasheet 2026-07-09] | 3 mm CA; Ø10 mm [datasheet] | n/s (height not in text) | 1.25 g [datasheet] | 0–100 mW full ±13 dpt; 0–15 mW for ±5 dpt [datasheet] | <1 ms; settling 2/4 ms [datasheet] | Datasheet revisions 2020-12-01, 2023-03-14, 2026-07-09; sold via Edmund/1stVision [datasheets] | none |
| **Corning Varioptic A-25H0 (A-series)** | Electrowetting liquid lens, no moving parts [corning.com Varioptic page] | 2.5 mm CA (family 1.6–8.0 mm) [Edmund] | 3.50 mm; Ø9.40 mm [Edmund product page] | n/s | n/s (2011 B617 claimed "up to 90% less power" than VCM) [LFW 2011] | n/s | 2 M lenses delivered by 2019-06 (industrial); capacity "nearly doubled in 2018" [Corning 2019 release] | None; positioned for "industrial applications" (page 2026-09-24); Corning AR = waveguide glass [corning.com] |
| **Sheba MEMS sensor-shift AF** | Electrostatic silicon micro-actuators move the image sensor [BusinessWire 2024-05-16] | lens-agnostic ("large aperture optics") [BW 2024-01-09] | n/s | sensor 25 mg moved [shebamicrosystems.ca] | <10 mW [BW 2024-01-09]; "<7 mW, 20X less" [company page] | <5 ms [BW 2024-01-09] | Eval kits; 17 staff, USD 400K sales (2026); COO hired 2026-06-09 [Ontario CES page; BW] | AR/VR/XR headset camera launched 2024-01-09; no customer named [BW] |
| **Metalenz (ST/UMC)** | Metasurface flat optics (static; not AF) [metalenz.com] | n/a | wafer-level | n/a | n/a | n/a | >140 M units by 2025-07; >300 M gen-1 in 2026 [Optica 2025-07-10; metalenz.com] | None found (smartphone/tablet sensing) |
| **NEXTLENS** | Liquid lens for smartphone cameras [startupticker] | n/s | n/s | n/s | n/s | "thousands of a second" focusing (company claim via gophotonics) | Xiaomi Mi MIX Fold 2021 (and MIX Fold 2 per search summary) [Android Central; gophotonics] | None |
| **LensVector** | LC refractive-index lens [LFW 2010] | 35–65 mm lighting lenses today [lensvector.com] | n/a | n/a | n/s | n/s | USD 50 M raised by 2010; now Patqer Photonique; lighting products [LFW; lensvector.com] | XR listed as application area only [lensvector.com] |
| **Meta in-house (patents)** | PZT thin-film piezo actuator deforming soft polymer / membrane tunable lens; electrode in lens barrel [USPTO 12663619; Patentlyze 2026/0276939] | >100° diagonal FOV camera [USPTO 12663619 abstract] | "without increasing a length of the optical lens assembly" [same] | n/a | n/a | n/a | Patents only; a former Meta engineer states a piezo tunable-lens AF module "passed full reliability qualifications for AR/VR/MR" [LinkedIn lidu-h-3825903] | Patents target wearables/"AR glasses"; cites poLight TLens Add-In ×3 [USPTO] |

---

## 8. Cross-entity cadence synthesis (for the timeline map)
- **2022-10-19**: Meta retrieves poLight TLens pages → **2023-02-08** Meta files wide-FOV tunable-lens patent → **2025-04-15** Q Tech/poLight deal "backed by a top tier U.S. consumer electronics customer" → **2025-10-13 / 2026-02-11 / 2026-04-07** poLight POs from/for a "Top Tier (U.S.) Consumer OEM" AR program → **2026-06-23** Meta patent granted citing poLight → **2026-09-17** Meta lens-barrel continuation published → **2026-09-21** Optotune launches its first glasses-class lens → **2026-09-23** Meta announces VR glasses (spring 2027).
- Competitor readiness as of 2026-10-06: Optotune has a comparable part but no public XR customer; Corning is industrial; Sheba is sub-scale; Nextlens/LensVector/Phaseform/Holochip are not in the race; Metalenz is not an AF technology.
- Supply-chain tell-tales to watch: a new poLight MEMS wafer order at ST (none in 2025), qualification completion of the Q Tech line (NRE still running in 2026), and any Optotune OEM/consumer design-win announcement.

## 9. Gaps (whole file)
- WebSearch budget exhausted; Firecrawl rate-limited; Corning product pages, Justia, PitchBook/Crunchbase and LinkedIn profiles blocked.
- Not found: Optotune AWE/SPIE XR talks, Optotune financing beyond Venture Kick, Optotune compact-lens patent list; Corning's 2017 closing date and current A-series power/response specs; Sheba funding; Deep Optics/Morrow/Dynamic Optics/TAG Optics status; any Reality Labs paper on camera tunable lenses; any Meta–ST tunable-lens link; confirmation that Tong Hsing operates poLight's Philippine assembly.

## Return summary
Optotune is the only tunable-lens rival with a glasses-class part: EL-3.1-10.8 (1.72 mm, 0.3 g, 3.1 mm CA, 20 mW @10 dpt, 1 ms) launched 2026-09-21 (datasheet 2026-09-18) but documented since 2025-09-17; no XR design win, financing or talk found. Corning Varioptic is explicitly "for industrial applications" (page 2026-09-24; A-25H 3.5 mm thick); Corning's AR role is waveguide glass. Sheba launched an AR/VR/XR MEMS sensor-shift AF camera 2024-01-09 (<10 mW, <5 ms) but had 17 staff/USD 400K sales in 2026. Meta's US 12,663,619 B2 (granted 2026-06-23) cites three poLight TLens/PZT documents retrieved 2022-10-19; a lens-barrel continuation published 2026-09-17; inventor Lidu Huang's LinkedIn says he led a piezo tunable-lens AF module through AR/VR/MR qualification at Meta. No Meta fab or Meta–ST deal found. ST has made poLight's PZT wafers since 2014 (Agrate 200 mm), Tong Hsing assembled since ≤2017; poLight ordered no new wafers in 2025 and invoiced Q Tech USD 313,141 NRE in March 2026 for its new line.
