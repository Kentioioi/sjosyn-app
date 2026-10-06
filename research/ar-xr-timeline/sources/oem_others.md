# Other AR/VR/XR producers (potential "top-tier" autofocus / tunable-lens customers)

Research date: 2026-10-06. Scope: Amazon, Alibaba, Xiaomi, Huawei, Lenovo, HTC, Pico/ByteDance, Valve, Sony, Microsoft (+Anduril), Baidu, RayNeo (TCL/Thunderbird), Vuzix, Magic Leap, plus an industry calendar for 2026–2027. Meta, Apple, Google/Samsung, Snap and the supplier entities are covered in other files; they appear here only where they intersect.

Conventions: `precision` = day / month / quarter / year. `confidence` = confirmed (primary source or two independent reputable sources) / strong (one reputable press source) / circumstantial / rumor. "Company says" vs "press infers" is separated in the event text. Amounts in original currency.

Method note: web-search quota for this session ran out mid-task; the second half of the research relied on direct page fetches and Firecrawl searches, so some minor items (flagged in each "Gaps" list) could not be re-verified.

---

## 1. Amazon

### Profile
Amazon's wearable line has been audio-only "Echo Frames" (three generations since 2019, no camera, no display). In Nov 2024 Reuters reported an internal project, "Amelia", to build display-and-camera glasses for delivery drivers on the Echo Frames base; in Sept 2025 The Information added a consumer sibling, "Jayhawk", with a monocular full-colour display, camera, mics and speakers, targeted at late 2026 / early 2027. Amazon publicly unveiled the driver glasses on 2025-10-22 and on 2026-09-21 announced a scale-up to 20,000+ devices by end-2027. Amazon is relevant to an AF supplier because the driver product has a camera that must both scan barcodes at arm's length and photograph doorsteps (a classic variable-focus use case), and because a consumer camera-glasses launch would be a volume programme.

### Timeline
| date | precision | category | event | source URL | source type | confidence |
|---|---|---|---|---|---|---|
| 2019-09-25 | day | product_release | Echo Frames (1st gen, "Day 1 Edition", invitation-only) introduced at $179.99; audio-only, no camera. | https://aiwiki.ai/wiki/amazon_echo_frames | press/wiki | strong |
| 2020-11-19 | day | product_release | Echo Frames 2nd gen announced at $249.99; shipped 2020-12-10; audio-only. | https://www.pymnts.com/amazon/2020/amazon-introduces-2nd-gen-smart-echo-frames-powered-by-alexa/ | press | confirmed |
| 2021-11-10 | day | product_release | Echo Frames 2nd-gen refresh (new colours / lens options). | https://aiwiki.ai/wiki/amazon_echo_frames | press/wiki | circumstantial |
| 2023-09-20 | day | product_release | Echo Frames 3rd gen announced from $269.99 (Carrera-branded variants $389.99); 15% thinner, 6 h battery; explicitly no camera and no display; shipped Dec 2023. | https://techcrunch.com/2023/09/20/amazon-unveils-next-gen-echo-frames-starting-at-269-99 | press | confirmed |
| 2024-11-11 | day | rumor | Reuters: Amazon developing driver glasses codenamed "Amelia" on the Echo Frames base: "tiny embedded display" in one lens for turn-by-turn navigation plus a camera to photograph delivered packages; "could take years" (battery for 8 h shift, mapping data). | https://siliconangle.com/2024/11/11/report-amazon-developing-smart-glasses-delivery-drivers/ | press (citing Reuters) | strong |
| 2025-09-10 | day | rumor | The Information (via Road to VR): consumer glasses "Jayhawk" with "microphones, speakers, a camera, and a monocular, full-color display", launch "late 2026 or early 2027"; driver version "Amelia" as soon as Q2 2026 with an "initial production run of 100,000 units"; display tech reportedly from Chinese firm Meta-Bounds. | https://roadtovr.com/amazon-jayhawk-smart-glasses-report-meta-hypernova-celeste/ | press (anonymous sources) | strong |
| 2025-10-22 | day | announcement | Amazon unveils "smart delivery glasses" at its "Delivering the Future" event (San Francisco): heads-up display, "integrated cameras supporting computer vision", vest-worn controller with swappable battery and emergency button, hardware privacy switch, prescription/transition lenses; "currently being tested by hundreds" of Delivery Associates in North America. | https://www.aboutamazon.com/news/transportation/smart-glasses-amazon-delivery-drivers | company | confirmed |
| 2025-10-22 | day | announcement | TechCrunch coverage of the same unveiling (always-on camera captures proof-of-delivery photos hands-free). | https://techcrunch.com/2025/10/22/amazon-unveils-ai-smart-glasses-for-its-delivery-drivers | press | confirmed |
| 2025-11-24 | day | patent | Parola Analytics review of Amazon AR patents linked to "Jayhawk" (US 10,055,645; 9,158,115; 10,319,150; 10,754,418; 10,176,636; 10,008,039) — all UI/fulfilment patents from 2015–2020; no optics, autofocus or tunable-lens claims. | https://parolaanalytics.com/parolanews/amazon-ar-tech-jayhawk-patents/ | analyst | confirmed |
| 2026-09-21 | day | roadmap | Amazon updates its blog: over 18 months, 500+ drivers completed "more than 275,000 customer deliveries" with the glasses; "5,000 additional devices deploying this year" and "over 20,000 devices by end of 2027"; new features: wrong-address defect detection, pet alerts. | https://www.aboutamazon.com/news/transportation/smart-glasses-amazon-delivery-drivers | company | confirmed |
| 2026-09-24 | day | analyst_report | Trade press (TechRepublic, LEDinside, Retail Customer Experience) relay the 20,000-by-2027 plan. | https://www.ledinside.com/news/2026/9/2026_09_24_01 | press | confirmed |

### Future / expected
| window | event | source | confidence |
|---|---|---|---|
| 2026 (rest of year) | +5,000 driver glasses deployed ("this year"). | aboutamazon.com (2026-09-21) | confirmed (company plan) |
| late 2026 – early 2027 | Consumer "Jayhawk" display glasses (The Information). No 2026 follow-up reporting found. | roadtovr.com (2025-09-10) | rumor |
| by end-2027 | >20,000 driver devices in field. | aboutamazon.com (2026-09-21) | confirmed (company plan) |

### Camera / autofocus relevance
- Driver glasses: Amazon says only "integrated cameras" used for package scanning, proof-of-delivery capture and hazard detection. No resolution, focus type or supplier disclosed. Barcode scanning at ~30–60 cm plus doorstep photos at 2–5 m is a use case where fixed-focus is marginal; an AF or extended-depth-of-field module would be a natural fit, but there is no public evidence either way.
- Jayhawk: "a camera" (The Information). No specs.
- Supplier clues: only Meta-Bounds (display/waveguide) reported. No camera-module or actuator supplier reported; no teardown exists because the device is not sold.

### Cadence observations
- Echo Frames: Sept 2019 → Nov 2020 (14 months) → Sept 2023 (34 months); no 4th gen in 3 years → line effectively paused while glasses with display are developed.
- Driver glasses: Reuters leak Nov 2024 → public unveil Oct 2025 (11 months) → scale-up announcement Sept 2026 (11 months). Amazon's actual ramp ("5,000 this year, 20,000 by end-2027") is an order of magnitude below The Information's "100,000 initial run" — expect volumes in the low tens of thousands, not consumer-scale, through 2027.
- Jayhawk: reported 15–18 months before target; no further leaks in 2026 found, which for a late-2026 product would be unusual — suggests slippage into 2027.

### Cross-links
- Meta-Bounds (CN waveguide/display) → Amazon Jayhawk, reported 2025-09-10 (The Information via Road to VR / GIGAZINE).
- None found to poLight, Q Tech, CML, Optotune, Corning Varioptic, Goertek, Luxshare, Sunny.

### Gaps
- No 2026 reporting on Jayhawk status; no camera specs for either device; no ODM identified; Echo Frames status after 2024 unknown (not confirmed discontinued).

---

## 2. Alibaba (Quark → Qwen AI Glasses)

### Profile
Alibaba's Intelligent Information unit (Quark) previewed AI glasses at WAIC in July 2025, launched them in China on 2025-11-27 as Quark AI Glasses S1 (dual micro-OLED display) and G1 (no display), rebranded them "Qwen AI Glasses" at MWC Barcelona on 2026-03-02, and on 2026-09-22 unveiled a second generation (N1 / N1 Pro, 50 MP sensor, eye-tracking and iris payment on the Pro) at the Apsara Conference, on sale 2026-10-13. Two hardware generations in ten months make Alibaba the fastest-cadence large OEM in the category and a plausible early adopter of a differentiated camera (the N1's 50 MP sensor is the largest in any shipping glasses).

### Timeline
| date | precision | category | event | source URL | source type | confidence |
|---|---|---|---|---|---|---|
| 2025-07-28 | day | announcement | Alibaba Cloud press release (WAIC 2025, Shanghai): Quark AI Glasses unveiled, "scheduled for official release in China by the end of 2025", powered by Qwen; "long battery life and high-quality imaging". | https://www.alibabacloud.com/en/press-room/alibaba-unveils-intelligent-cockpits-enterprise | company | confirmed |
| 2025-11-27 | day | product_release | Quark AI Glasses launched in China: two series, six SKUs; S1 from 3,799 yuan (dual micro-OLED), G1 from 1,899 yuan (no display, 40 g). | http://www.xinhuanet.com/tech/20251127/08d77754e3654647b345f1b71ca496c1/c.html | press (state media) | confirmed |
| 2025-11-27 | day | product_release | CNBC: S1 3,799 yuan ($536), G1 1,899 yuan; "0.6-second instant photo capture, smooth 3K video, AI-enhanced 4K output", Qwen app integration. | https://www.cnbc.com/2025/11/27/alibaba-quark-ai-glasses-go-on-sale-price-specs.html | press | confirmed |
| 2025-11-28 | day | product_release | GIGAZINE spec sheet: S1 dual-chip, replaceable dual batteries (up to 24 h), bone-conduction voice; G1 shares S1 core minus display. Baidu Baike for G1: Qualcomm AR1 + BES2800, 272 mAh, 9 h, 5 mics + bone conduction, "12-megapixel camera capable of 3K video". | https://gigazine.net/gsc_news/en/20251128-alibaba-quark-ai-glasses-s1-g1/ | press | strong |
| 2026-03-02 | day | product_release | "Qwen AI Glasses" (renamed Quark line) open reservations on all channels on MWC Barcelona day 1; G1 "to-hand" price 1,997 yuan after national subsidy; "topped the all-platform smart glasses best-seller list within three hours"; full lineup to be shown at AWE2026 (Appliance & Electronics World Expo), Shanghai SNIEC, 2026-03-12/15; "planned to enter global markets within 2026". | https://baike.baidu.com/en/item/Qwen%20AI%20Glasses/1469262 | wiki (CN) | strong |
| 2026-03-03 | day | product_release | MWC booth specs (The Deep View): 12 MP POV camera, Sony IMX681, 5P lens, 109° ultra-wide, 3K video, HDR; Snapdragon AR1 + coprocessor; swappable 272 mAh packs; 8 mm temples. | https://www.thedeepview.com/articles/alibaba-makes-surprise-leap-into-ai-glasses | press | strong |
| 2026-03-04 | day | announcement | Alibaba Cloud blog: Qwen Glasses S1 (premium) and G1 series (incl. sunglasses in 7 lens colours); G1 from RMB 1,997 (~$275); official China sales 2026-03-08; "international release within 2026". | https://www.alibabacloud.com/blog/alibaba-unveils-qwen-glasses-at-mwc-barcelona-accelerating-ai-hardware-ambitions_602920 | company | confirmed |
| 2026-03-02 | day | announcement | SCMP: Alibaba to launch new Qwen-powered glasses at MWC with presales from day 1. | https://www.scmp.com/tech/article/3344971/mwc-2026-alibaba-launch-new-smart-glasses-powered-qwen-ai-assistant | press | confirmed |
| 2026-05-08 | day | roadmap | Alizila: Qwen Glasses upgrade — "proactive AI" services and a "spatial 3D display" using "dual optical engines with binocular stereoscopic imaging"; company claims 53% share of China online smart-glasses sales (cumulative since launch). | https://www.alizila.com/alibabas-qwen-glasses-upgrades-with-proactive-ai-capabilities-and-spatial-3d-display-to-elevate-intuitive-ai-experiences/ | company | confirmed (company claim) |
| 2026-09-10 | day | announcement | TechNode (via IT Home): Qwen previews "N1" glasses at the 2026 Bund Summit, Shanghai — no display, iris recognition; specs/price/date not yet disclosed. | https://technode.com/2026/09/10/alibaba-qwen-previews-n1-ai-glasses-with-iris-recognition-and-no-display/ | press | strong |
| 2026-09-22 | day | product_release | Apsara Conference: Qwen AI Glasses N1 and N1 Pro unveiled — "5000万像素传感器" (50 MP sensor), 4K video, live photos, multi-stage stabilisation, three-chip design, hot-swappable batteries; N1 Pro adds eye tracking and iris payment; also Qwen Clip earbuds (with Bose). Online reservations opened same day; "10月13日现货发售" (in-stock sale 2026-10-13). | https://finance.sina.com.cn/tech/roll/2026-09-22/doc-inisspzf8887020.shtml | press | confirmed |
| 2026-09-24 | day | product_release | Alizila (company): Qwen Glasses N1 series, 50 MP, N1 Pro eye-tracking/iris payment; pre-orders 2026-09-22, sales 2026-10-13; China only. | https://www.alizila.com/alibaba-unveils-agentic-computer-ai-wearables-and-more-at-2026-apsara-conference/ | company | confirmed |

### Future / expected
| window | event | source | confidence |
|---|---|---|---|
| 2026-10-13 | N1 / N1 Pro in-stock sale (China). | sina.com.cn 2026-09-22; alizila 2026-09-24 | confirmed |
| within 2026 | International release of Qwen Glasses (S1/G1). No market or date yet. | alibabacloud blog 2026-03-04 | strong (company statement) |
| 2027 | Next generation (unannounced) — at the observed 6–10-month cadence a successor by mid-2027 is likely. | inference | circumstantial |

### Camera / autofocus relevance
- S1/G1 (2025–26): 12 MP Sony IMX681, 5P lens, 109° FOV — identical sensor to Xiaomi and RayNeo; no autofocus mentioned anywhere → almost certainly fixed-focus.
- N1 / N1 Pro (Oct 2026): 50 MP sensor with 4K video; Chinese coverage lists stabilisation and live photos but no "对焦"/autofocus wording. A 50 MP sensor is larger than the 1/2.8-inch class used by peers, so depth of field is shallower and AF would add more value — unverified. Camera-module supplier not disclosed.
- Eye-tracking + iris payment on N1 Pro = additional inward cameras.

### Cadence observations
- Preview (2025-07-28) → launch (2025-11-27): 4 months. Launch → rebrand/MWC (2026-03-02): 3 months. MWC → N1 (2026-09-22): 6.5 months. Two generations in 10 months; Alibaba aligns hardware drops with its own events (Apsara, Sept) and MWC (March). Expect March and September as the recurring windows.

### Cross-links
- Sony (IMX681 sensor) → Quark/Qwen S1/G1 (The Deep View, 2026-03-03).
- Qualcomm AR1 + BES2800 → G1 (Baidu Baike).
- Bose → Qwen Clip earbuds (Alizila 2026-09-24).
- No public link to poLight, Q Tech, CML, Optotune, Varioptic, Goertek, Luxshare or Sunny found.

### Gaps
- N1 price, exact camera module (sensor maker, focus type); ODM; international launch market; S1 "spatial 3D display" ship date.

---

## 3. Xiaomi

### Profile
Xiaomi was poLight's first commercial customer: the Mitu (Mi Bunny) Children's Learning Watch 4Pro, launched 2020-01-07, carried an 8 MP side camera "with T-LENS ultra-fast focus". Xiaomi entered AI glasses on 2025-06-26 with Xiaomi AI Glasses (12 MP Sony IMX681, Snapdragon AR1, 1,999 yuan), reportedly built with ODM Goertek; it took 28% of China's smart-glasses market in Q1 2026 (per IT Home). A second generation was reported in Aug 2026 as complete but paused over design, possibly slipping to Q4 2026 or 2027 — Xiaomi called the report false.

### Timeline
| date | precision | category | event | source URL | source type | confidence |
|---|---|---|---|---|---|---|
| 2020-01-07 | day | product_release | Xiaomi Mitu Children's Learning Watch 4Pro launched, 1,299 yuan; front 5 MP f/2.4 82°; side "8-megapixel zoom camera ... f/2.2 aperture and 84.9-degree field-of-view with T-LENS ultra-fast focus". (This is the Mitu/Mi Bunny kids' watch, not the "Mi Watch".) | https://www.gizmochina.com/2020/01/07/xiaomi-mitu-children-learning-watch-4pro-launched/ | press | confirmed |
| 2020-01 | month | design_in | Yole: Xiaomi's Mitu 4Pro (Jan 2020) was "the first commercial product in the world" using poLight's TLens. | https://www.yolegroup.com/product/report/polight-tlens-mems-autofocus | analyst | strong |
| 2024-11-13 | day | rumor | Road to VR citing 36Kr: Xiaomi partnering with ODM Goertek on AI glasses benchmarked against Ray-Ban Meta; launch expected Q2 2025; Lei Jun reportedly expects >300,000 units. | https://roadtovr.com/xiaomi-goertek-competes-ray-ban-meta-smart-glasses/ | press (citing 36Kr) | strong |
| 2025-06-25 | day | announcement | Xiaomi officially teases AI Glasses for next-day launch as "next-generation personal smart device". | https://finance.sina.com.cn/jjxw/2025-06-25/doc-infchcvt4745357.shtml | press | confirmed |
| 2025-06-26 | day | product_release | Xiaomi AI Glasses launched at "Human x Car x Home" event: 12 MP Sony IMX681, f/2.2, 105° FOV, EIS, 4032×3024 stills, 2K/30 fps video (45-min cap); Snapdragon AR1 + BES2700; 263 mAh / 8.6 h; 40 g; 1,999 yuan base, 2,699 electrochromic, 2,999 colour electrochromic; China only. | https://roadtovr.com/xiaomi-ai-glasses-meta-smart-glasses-features/ | press | confirmed |
| 2025-06-26 | day | product_release | GSMArena confirms IMX681, AR1, CNY 1,999. | https://www.gsmarena.com/xiaomi_ai_glasses_debut_with_2k_recording_and_over_8_hours_of_battery_life_openwear_stereo_pro_offer-news-68416.php | press | confirmed |
| 2026-08-05 | day | rumor | IT Home citing XR Vision: 2nd-gen AI glasses "R&D complete" but Lu Weibing "pressed the pause button" over appearance; launch may slip to Q4 2026 or 2027. Xiaomi official: "false ... constitutes rumors" (造谣). Same piece: gen-1 held 28% of China smart-glasses market in Q1 2026. | https://www.ithome.com/0/985/781.htm | press/rumor | rumor (denied) |

### Future / expected
| window | event | source | confidence |
|---|---|---|---|
| Q4 2026 – 2027 | Xiaomi AI Glasses 2nd gen (design rework). | ithome.com 2026-08-05 (denied by Xiaomi) | rumor |

### Camera / autofocus relevance
- Gen 1: 12 MP IMX681 f/2.2 105°; no autofocus stated by Xiaomi or reviewers → fixed focus. ODM reportedly Goertek; camera-module maker not disclosed.
- Historical: Xiaomi used poLight TLens in a 2020 kids' watch (8 MP), showing willingness to adopt MEMS AF in wearables at ~1,299-yuan price points.

### Cadence observations
- Leak (Nov 2024) → launch (June 2025): 7.5 months (slipped from "Q2"). Gen 2 at Q4 2026 would be ~16–18 months after gen 1; a 2027 slip would be 20+ months — slower than Alibaba's 6–10-month cycle.

### Cross-links
- poLight → Xiaomi (Mitu 4Pro, 2020-01-07, Gizmochina; Yole).
- Goertek → Xiaomi AI Glasses ODM (36Kr via Road to VR, 2024-11-13; Yicai).
- Sony IMX681 → Xiaomi AI Glasses (GSMArena 2025-06-26).
- Qualcomm AR1 / BES2700 → Xiaomi AI Glasses.

### Gaps
- Camera-module supplier for AI Glasses; whether gen 2 adds AF; any official 2026 roadmap; the 28% share figure is single-source.

---

## 4. Huawei

### Profile
Huawei sold audio-only "Eyewear" glasses (Eyewear 2 sunglasses launched 2024-05-15) before launching its first camera glasses, "HUAWEI AI Glasses", on 2026-04-20 (12 MP, 35.5 g, HarmonyOS, in-house chip, 2,499/2,899 yuan). Huawei's volume in China and vertical silicon make it a candidate for differentiated camera modules in later generations.

### Timeline
| date | precision | category | event | source URL | source type | confidence |
|---|---|---|---|---|---|---|
| 2024-05-15 | day | product_release | Huawei Eyewear 2 sunglasses launch (audio-only, no camera). | https://m.gsmarena.com/newscomm-62807.php | press | strong |
| 2026-04-08 | day | announcement | Huawei teases first AI glasses with a real-world camera sample; launch expected 2026-04-21 alongside Pura 90. | https://www.gizmochina.com/2026/04/08/huawei-ai-glasses-teased-with-real-world-camera-sample/ | press | confirmed |
| 2026-04-20 | day | product_release | HUAWEI AI Glasses launched (event in China): 12 MP "super-sensing" ultra-wide, 1/2.8-inch sensor, 4096×3072 stills, 1920×1440@30 fps, HDR Vivid, AI RAW multi-frame fusion, EIS with horizon lock, 0.7-s capture; 35.5 g; 258 mAh (9 h music); 64 GB; three frames; 2,499 yuan (titanium silver grey / modern black), 2,899 yuan (shimmering silver sunglasses); official sale 2026-04-25. | https://www.fonearena.com/blog/480594/huawei-ai-glasses-price-features.html | press | confirmed |
| 2026-04-21 | day | product_release | The Gadgeteer: unveiled April 20; 1/2.8-inch sensor; in-house chip; sale opens April 25 10:08. | https://the-gadgeteer.com/2026/04/21/huawei-ai-glasses-debut/ | press | confirmed |
| 2026-04-30 | day | analyst_report | Omdia: launch 2026-04-20; "lightest among mainstream non-display AI glasses" in China; differentiation is HarmonyOS cross-device integration; Zeiss/Sibo/Stepper for prescription fulfilment. | https://omdia.tech.informa.com/blogs/2026/apr/huawei-launches-its-first-ai-glasses-centered-on-ecosystem-integration-and-seamless-ai-experiences | analyst | confirmed |

### Future / expected
No announced successor. At Huawei's 23-month gap (May 2024 audio → Apr 2026 camera), a display or second camera generation in 2027 is plausible but unsourced.

### Camera / autofocus relevance
12 MP 1/2.8-inch ultra-wide; no autofocus stated → fixed focus. Supplier not disclosed.

### Cross-links
Zeiss (prescription) → Huawei (Omdia). None to the actuator suppliers.

### Gaps
Huawei Eyewear gen-1 date; camera-module vendor; sales volumes.

---

## 5. Lenovo

### Profile
Enterprise AR (ThinkReality A3, 2021; VRX, 2022/23), consumer display glasses (Legion Glasses, 2023; Legion Glasses 2, 2025) and a CES 2026 "AI Glasses Concept" (45 g, camera-based image recognition, 8 h). No shipping Lenovo product has an AF camera.

### Timeline
| date | precision | category | event | source URL | source type | confidence |
|---|---|---|---|---|---|---|
| 2021-01-10 | day | announcement | ThinkReality A3 enterprise smart glasses announced at CES 2021; available mid-2021 (~$1,499). | https://news.lenovo.com/pressroom/press-releases/thinkreality-a3-most-versatile-smart-glasses-ever-designed-for-the-enterprise/ | company | confirmed |
| 2022-10 | month | announcement | ThinkReality VRX announced; available 2023 (~$1,299); 2 passthrough + 4 tracking cameras. | https://vrarwiki.com/wiki/Lenovo_ThinkReality_VRX | wiki | strong |
| 2023-09 | month | product_release | Legion Glasses (gen 1, 96 g, display glasses) announced alongside Legion Go at IFA 2023, $329.99. | https://www.notebookcheck.net/Lenovo-s-Legion-Glasses-2-are-stylish-lighter-and-better-all-round.943293.0.html | press | strong |
| 2025-01-07 | day | product_release | Legion Glasses 2 at CES 2025: 65 g, 800 nits, 120 Hz, $399; availability Feb 2025 (mixed-news) / March 2025 (Lenovo). | https://mixed-news.com/en/lenovo-legion-glasses-2-new-ar-glasses-with-gaming-focus-coming-in-february-for-399/ | press | confirmed |
| 2026-01-07 | day | announcement | Lenovo "AI Glasses Concept" at CES 2026: 45 g, touch/voice, live translation, image recognition (camera), notification summaries, up to 8 h; concept only. | https://www.techtimes.com/articles/313827/20260107/lenovo-unveils-rollable-pcs-ai-glasses-smart-displays-ces-2026.htm | press | confirmed |

### Camera / AF: Legion Glasses have no camera; AI Glasses Concept has a camera (specs undisclosed). Cadence: Legion Glasses ~16 months between gens (Sept 2023 → Jan 2025). Cross-links: none to suppliers in scope. Gaps: whether the concept ships in 2026/27.

---

## 6. HTC (VIVE)

### Profile
HTC sold a large part of its XR engineering to Google in Jan 2025 ($250M) and has since positioned "AR glasses" as its endgame: VIVE Eagle AI glasses (12 MP ultra-wide, <49 g) launched in Taiwan on 2025-09-01; VIVE Focus Vision (dual 16 MP passthrough) is its last headset (Sept 2024).

### Timeline
| date | precision | category | event | source URL | source type | confidence |
|---|---|---|---|---|---|---|
| 2023-01 | month | announcement | VIVE XR Elite announced at CES 2023 (colour passthrough, depth sensor, dioptre lenses). | https://en.wikipedia.org/wiki/HTC_Vive | wiki | strong |
| 2024-09-18 | day | product_release | VIVE Focus Vision announced, $999; dual 16 MP colour passthrough, depth sensor, IR; pre-orders 2024-09-18 to 10-17. | https://www.auganix.org/vr-news-new-htc-vive-focus-vision-xr-headset-offers-5k-resolution-eye-tracking-and-mixed-reality-for-999/ | press | confirmed |
| 2025-01 | month | partnership | HTC sells "a significant portion of its XR division" to Google for $250 million. | https://skarredghost.com/2026/03/09/htc-vive-xr-business-2/ | press | strong |
| 2025-08-14 | day | product_release | VIVE Eagle AI glasses announced: 12 MP ultra-wide (3024×4032 stills, 1512×2016@30 fps), <49 g, 235 mAh, GPT/Gemini support, 13-language translation; NT$15,600; pre-order Aug 14–31; GA 2025-09-01 Taiwan only. | https://www.vive.com/us/newsroom/2025-08-14/ | company | confirmed |
| 2026-03-09 | day | roadmap | HTC: "bright future for XR"; Eagle "available in limited regions", expansion worldwide intended, no dates; focus on AR glasses, 5G/cloud, LBE, Viverse. | https://skarredghost.com/2026/03/09/htc-vive-xr-business-2/ | press | strong |

### Camera / AF: Eagle 12 MP ultra-wide, no AF stated. Cadence: headset→glasses pivot; Eagle announce→GA 18 days (Taiwan). Cross-links: Google (Jan 2025). Gaps: Eagle global launch date; next headset.

---

## 7. Pico / ByteDance

### Profile
ByteDance's Pico shipped Pico 4 (Oct 2022) and Pico 4 Ultra (China Aug 2024, global Sept 2024). Its next flagship — leaked as "Swan" (July 2025), teased as "Project Swan" (Mar 2026), named "Pico Space Pro" (Aug 2026) — uses ~4,000 PPI micro-OLED and custom XR silicon; a Sept 2, 2026 launch event was cancelled and release moved to Q4 2026. Space Pro is a Vision-Pro-class device with eye tracking and passthrough cameras, i.e. a potential high-end camera customer.

### Timeline
| date | precision | category | event | source URL | source type | confidence |
|---|---|---|---|---|---|---|
| 2022-09-22 | day | announcement | Pico 4 unveiled; released 2022-10-18. | https://en.wikipedia.org/wiki/PICO_4 | wiki | confirmed |
| 2024-08-20 | day | product_release | Pico 4 Ultra launched in China (Snapdragon XR2 Gen 2, colour MR passthrough); pre-orders ~4,300 RMB, shipping Sept 2. | https://mixed-news.com/en/pico-4-ultra-china-launch/ | press | confirmed |
| 2024-09-02 | day | product_release | Pico 4 Ultra released (Europe) at €549. | https://en.wikipedia.org/wiki/PICO_4 | wiki | confirmed |
| 2025-07-18 | day | rumor | The Information (via Road to VR): Pico developing MR goggles "Swan", ~100 g, tethered compute puck, eye/hand tracking, custom chips. | https://roadtovr.com/pico-report-mixed-reality-goggles-meta-phoenix-puffin-loma/ | press (anonymous sources) | strong |
| 2025-11-26 | day | rumor | Road to VR citing STAR Market Daily / Nweon: 2026 Vision Pro competitor with self-developed chip (started 2022, in mass production, ~12 ms latency), ~4,000 PPI micro-OLED, 40 PPD avg / 45 centre. | https://roadtovr.com/pico-vision-pro-competitor-specs-release-date/ | press | strong |
| 2026-03-02 | day | announcement | Pico officially teases "Project Swan" + Pico OS 6 ahead of GDC 2026 (Mar 9–13): 4,000 PPI micro-OLED, dual-chip (custom XR silicon ~12 ms + flagship SoC ">2× CPU/GPU vs XR2 Gen 2"); global launch "late 2026"; Global Early Access Program. | https://roadtovr.com/pico-project-swan-os-6-update/ | press (company statements) | confirmed |
| 2026-03-02 | day | announcement | UploadVR on the same reveal. | https://www.uploadvr.com/pico-project-swan-official-display-compute-specs-announcement/ | press | confirmed |
| 2026-08-19 | day | announcement | Official name "Pico Space Pro"; debut event set for 2026-09-02, Beijing (announced on Weibo; Nweon). | https://roadtovr.com/picos-vision-pro-competitor-release-date-pricr-name/ | press | confirmed |
| 2026-08-25 | day | roadmap | Pico cancels the Sept 2 event: "We have decided to adjust the product release date to the fourth quarter of this year ... a major upgrade to the software experience"; early-access programme expanded. | https://roadtovr.com/pico-vision-pro-competitor-delayed-cancelled-event/ | press (company statement) | confirmed |
| 2026-10-02 | day | rumor | Social-media leak (Nathie VR): Space Pro reportedly launching first week of October at $2,899. | https://www.facebook.com/nathievr/posts/looks-like-the-launch-date-and-price-of-the-pico-space-pro-may-have-leaked-its-r/1668610914632411/ | forum/rumor | rumor |

### Future / expected
| window | event | source | confidence |
|---|---|---|---|
| Q4 2026 | Pico Space Pro release (China first; global "late 2026" per March statement). | roadtovr 2026-08-25 | confirmed (company) |

### Camera / AF: Space Pro passthrough and tracking camera specs undisclosed; eye tracking confirmed. Pico 4 Ultra has colour passthrough (fixed-focus class). Cadence: Pico 4 → 4 Ultra 23 months; leak → official tease 7.5 months; tease → planned launch ~9 months (slipped once). Cross-links: Goertek is widely cited as Pico's ODM but not verified here (gap). Gaps: camera specs, price, ODM.

---

## 8. Valve

### Profile
Valve announced Steam Frame on 2025-11-12 (standalone/streaming VR, Snapdragon 8 Gen 3) for "early 2026"; memory-price shocks pushed it to 2026-09-18 at $1,059/$1,299. It uses four monochrome fisheye tracking cameras (two for mono passthrough), eye tracking and a front expansion port with a MIPI camera interface — no colour camera, so no AF relevance unless a third-party add-on appears.

### Timeline
| date | precision | category | event | source URL | source type | confidence |
|---|---|---|---|---|---|---|
| 2025-11-12 | day | announcement | Steam Frame announced: "early 2026"; 4 grayscale fisheye cameras + IR illuminators (2 front for mono passthrough), eye tracking, expansion port (dual 2.5 Gbps MIPI camera + PCIe Gen4 x1); 185 g visor / 440 g; Snapdragon 8 Gen 3, 16 GB. | https://www.uploadvr.com/valve-steam-frame-official-announcement-features-details/ | press (company briefing) | confirmed |
| 2026-02 | month | roadmap | Valve says prices "would be higher than anticipated" due to global memory shortage. | https://en.wikipedia.org/wiki/Steam_Frame | wiki | strong |
| 2026-09-14 | day | product_release | Reservations open; $1,059 (256 GB) / $1,299 (1 TB), incl. controllers, Wi-Fi 6E adapter, Half-Life: Alyx. | https://www.dexerto.com/gaming/valve-reveals-steam-frame-price-and-release-date-starting-at-1059-3408909/ | press | confirmed |
| 2026-09-18 | day | product_release | Steam Frame released (purchase emails). | https://en.wikipedia.org/wiki/Steam_Frame | wiki | confirmed |

### Cadence: announce → ship 10 months (slipped from "early 2026"). Camera/AF: none (monochrome tracking only). Cross-links: none. Gaps: manufacturer.

---

## 9. Sony

### Profile
Sony ships PS VR2 (Feb 2023) and the enterprise SRH-S1 / XYN spatial headset (orders Jan 2025, $4,750). Sony is more important to this project as a supplier: its IMX681 12 MP sensor sits in Xiaomi, RayNeo X3 Pro and Alibaba Qwen glasses, and Sony Innovation Fund invested in CML (Feb 2024, per the brief). No new Sony headset or glasses were found for 2026.

### Timeline
| date | precision | category | event | source URL | source type | confidence |
|---|---|---|---|---|---|---|
| 2022-11-02 | day | announcement | PS VR2 priced $549.99, launch Feb 2023. | https://blog.playstation.com/2022/11/02/playstation-vr2-launches-in-february-at-549-99/ | company | confirmed |
| 2023-02-22 | day | product_release | PS VR2 released worldwide. | https://en.wikipedia.org/wiki/PlayStation_VR2 | wiki | confirmed |
| 2024-01-09 | day | announcement | CES 2024: Sony spatial-content-creation XR headset (XR2+ Gen 2, dual 4K OLED micro-displays, six cameras/sensors, flip-up), with Siemens; "later in 2024". | https://www.notebookcheck.net/Sony-spatial-XR-headset-gets-showcased-at-CES-2024-arrives-later-this-year.791258.0.html | press | confirmed |
| 2025-01-10 | day | product_release | SRH-S1 priced $4,750; orders from 2025-01-23 via Siemens; shipping Feb 2025; 3552×3840 micro-OLED, colour passthrough; shown under "XYN" brand at CES 2025. | https://www.uploadvr.com/sony-enterprise-standalone-headset-price-release-date/ | press | confirmed |

### Camera/AF: passthrough cameras (specs undisclosed). Cross-links: Sony IMX681 → Xiaomi (2025-06-26), RayNeo X3 Pro (2025), Alibaba Qwen (2026-03-03); Sony Innovation Fund → CML (brief). Gaps: any 2026 Sony XR hardware; PS VR2 successor.

---

## 10. Microsoft (+ Anduril / IVAS → SBMC)

### Profile
Microsoft ended HoloLens 2 production in Oct 2024 (support to 2027-12-31) and handed the US Army's IVAS programme to Anduril (announced 2025-02-11). Anduril then partnered with Meta (2025-05-29, "EagleEye") and won a $159M SBMC prototype award (Sept 2025). Microsoft itself is no longer an AR hardware customer; the successor programme's camera stack is Meta/Anduril's.

### Timeline
| date | precision | category | event | source URL | source type | confidence |
|---|---|---|---|---|---|---|
| 2021-03-26 | day | order | Army awards Microsoft IVAS fixed-price production agreement up to $21.88 billion. | https://en.wikipedia.org/wiki/Integrated_Visual_Augmentation_System | wiki | confirmed |
| 2024-10-01 | day | announcement | HoloLens 2 discontinued (production ended); security updates through 2027-12-31; no successor. | https://www.uploadvr.com/microsoft-discontinuing-hololens-2/ | press | confirmed |
| 2025-02-11 | day | partnership | Microsoft and Anduril: Anduril to "assume oversight of production, future development of hardware and software, and delivery timelines" for IVAS, pending DoD approval. | https://news.microsoft.com/source/2025/02/11/anduril-and-microsoft-partner-to-advance-integrated-visual-augmentation-system-ivas-program-for-the-u-s-army/ | company | confirmed |
| 2025-05-29 | day | partnership | "Anduril and Meta Team Up to Transform XR for the American Military" (EagleEye); to compete for the Army's next-gen HUD (SBMC). | https://www.anduril.com/news/anduril-and-meta-team-up-to-transform-xr-for-the-american-military | company | confirmed |
| 2025-09-09 | day | order | Army awards Anduril $159M and Rivet $195M for Soldier Borne Mission Command (SBMC) prototypes; Anduril's system built "in partnership with Meta, Qualcomm Technologies, OSI and Gentex". | https://www.govconwire.com/articles/anduril-rivet-contract-award-sbmc-warfighter | press | confirmed |

### Camera/AF: military thermal/low-light sensors; not a consumer AF use case. Cross-links: Meta → Anduril (May 2025); Qualcomm. Gaps: DoD approval date for the transfer; 2026 SBMC milestones.

---

## 11. Baidu (Xiaodu)

### Timeline
| date | precision | category | event | source URL | source type | confidence |
|---|---|---|---|---|---|---|
| 2024-11-12 | day | announcement | Baidu World 2024 (Shanghai): Xiaodu AI Glasses unveiled — 16 MP ultra-wide with AI anti-shake, 45 g, 56 h standby / 5 h use; launch "first half of 2025". | https://technode.com/2024/11/13/baidu-unveils-xiaodu-ai-glasses-its-first-ai-glasses-powered-by-a-large-language-model/ | press | confirmed |
| 2025-11-10 | day | product_release | Xiaodu AI Glasses Pro on sale, 2,299 yuan (2,199 yuan Double-11 promo), next-day delivery via JD; "after 364 days" since unveiling; 36Kr also lists an "S1" at 4,699 yuan (3,329 promo). | https://eu.36kr.com/en/p/3546829403631752 | press | strong |

### Camera/AF: 16 MP ultra-wide, no AF stated. Cadence: unveil → sale 12 months (slipped from H1 2025). Gaps: Pro camera specs; whether the 4,699-yuan "S1" is a Xiaodu display model.

---

## 12. RayNeo (TCL / Thunderbird Innovation)

### Timeline
| date | precision | category | event | source URL | source type | confidence |
|---|---|---|---|---|---|---|
| 2025-01-06 | day | announcement | RayNeo X3 Pro (full-colour micro-LED waveguide AR) and V3 camera glasses announced at CES 2025. | https://vrarwiki.com/wiki/RayNeo_X3_Pro | wiki | strong |
| 2025-05-27 | day | product_release | X3 Pro China pre-orders (¥8,999; ¥7,649 after subsidy); general sale 2025-06-15; RayNeo Air 3 also launched. | https://vrarwiki.com/wiki/RayNeo_X3_Pro | wiki | strong |
| 2025-12-17 | day | product_release | X3 Pro international release: $1,299 ($1,099 early bird), £1,299, €1,399. | https://vrarwiki.com/wiki/RayNeo_X3_Pro | wiki | strong |
| 2026-01-04 | day | announcement | RayNeo "Project eSIM" prototype announced for CES 2026. | https://vrarwiki.com/wiki/RayNeo_X3_Pro | wiki | strong |

### Camera/AF: X3 Pro main camera 12 MP Sony IMX681 (up to 4K stills, 1440p video at launch) + OmniVision monochrome SLAM camera; no AF stated. Cross-links: Sony. Gaps: V3 camera spec; 2026 product line.

---

## 13. Vuzix

### Profile
Vuzix is a waveguide/OEM-platform supplier and enterprise glasses maker (Z100, Ultralite, M-series, Shrike defense display). Quanta Computer invested $20M (Sept 2024 – Sept 2025) for a long-term waveguide design/supply partnership. Its Ultralite/Z100 glasses have no camera; relevance to an AF supplier is limited to M-series enterprise glasses and any Quanta-built OEM designs.

### Timeline
| date | precision | category | event | source URL | source type | confidence |
|---|---|---|---|---|---|---|
| 2024-01-09 | day | product_release | Z100 Developer Edition at CES 2024 (monocular 640×480 green microLED waveguide, 38 g, no camera). | https://vrarwiki.com/wiki/Vuzix_Z100 | wiki | strong |
| 2024-09-03 | day | financing | Quanta Computer strategic investment: $20M in three tranches ($10M common; two $5M Series B preferred tied to milestones) for waveguide production and co-development of smart glasses. | https://ir.vuzix.com/news-events/press-releases/detail/2095/quanta-computer-enters-into-a-strategic-investment-in-vuzix | company | confirmed |
| 2024-11-20 | day | product_release | Z100 general availability, $499. | https://vrarwiki.com/wiki/Vuzix_Z100 | wiki | strong |
| 2025-01 | month | product_release | Ultralite Audio and Ultralite Pro OEM platforms (with Quanta) at CES 2025. | https://vrarwiki.com/wiki/Vuzix_Z100 | wiki | strong |
| 2025-09-22 | day | financing | Third Quanta tranche ($5M) received; total $20M. | https://ir.vuzix.com/news-events/press-releases/detail/2149/vuzix-achieves-waveguide-production-milestones-and-receives | company | confirmed |
| 2025-11-13 | day | earnings | Q3 2025: revenue $1.161M; "first wave of volume purchase orders from a leading global online retailer"; six-figure defense waveguide HUD development order. | https://sec.gov/Archives/edgar/data/1463972/000110465925112621/tm2531381d1_ex99-1.htm | regulator/SEC | confirmed |
| 2026-02-18 | day | product_release | "Vuzix Solutions" enterprise kits (Teams/Zoom). | https://ir.vuzix.com/news-events/press-releases?page=2 | company | confirmed |
| 2026-03-31 | day | order | Online-retailer follow-on orders and Ultralite Pro OEM program orders. | https://ir.vuzix.com/news-events/press-releases?page=2 | company | confirmed |
| 2026-04-06 | day | order | Follow-on production shipment of waveguide AR display systems to a major US defense customer. | https://ir.vuzix.com/news-events/press-releases?page=2 | company | confirmed |
| 2026-04-28 | day | order | Customer-funded development order from a Tier-1 defense supplier (next-gen waveguide display program). | https://ir.vuzix.com/news-events/press-releases?page=2 | company | confirmed |
| 2026-08-11 | day | order | Follow-on smart-glasses order from Augmex for its US launch. | https://ir.vuzix.com/news-events/press-releases | company | confirmed |
| 2026-09-29 | day | product_release | "Shrike" defense display platform introduced; initial evaluation units shipped. | https://ir.vuzix.com/news-events/press-releases | company | confirmed |

### Cadence: order/press-release cadence roughly every 2–6 weeks in 2026, mostly waveguide and defense. Cross-links: Quanta (ODM) → Vuzix; no poLight/CML link found. Gaps: LX1 launch date; camera specs of M-series.

---

## 14. Magic Leap

### Profile
Magic Leap 2 (2022) was its last own-brand headset. Since the Google partnership (2024-05-30, extended three years on 2025-10-29) it has pivoted to being an "AR ecosystem partner" and waveguide supplier (Pegatron manufacturing deal 2025-12-30; July 2026 waveguide strategy). The Google/Magic Leap Android XR prototype glasses (Oct 2025) include cameras but Magic Leap will not sell consumer glasses, so it is a component supplier rather than an AF customer.

### Timeline
| date | precision | category | event | source URL | source type | confidence |
|---|---|---|---|---|---|---|
| 2022-09-30 | day | product_release | Magic Leap 2 released: Base $3,299, Developer Pro $4,099, Enterprise $4,999. | https://www.thefpsreview.com/2022/07/13/magic-leap-2-releases-on-september-30-starts-at-3299/ | press | confirmed |
| 2023-10-25 | day | hire | Ross Rosenberg appointed CEO. | https://www.magicleap.com/newsroom | company | confirmed |
| 2024-05-30 | day | partnership | Magic Leap–Google strategic partnership to "combine Magic Leap's leadership in optics and manufacturing with [Google's] technologies". | https://www.magicleap.com/newsroom/magic-leap-and-google-partnership | company | confirmed |
| 2025-10-29 | day | partnership | Glasses prototype shown at FII Riyadh (Magic Leap waveguides + Google Raxium microLED; cameras, mics, in-lens displays); Google partnership extended three years; Magic Leap positions as "AR ecosystem partner", will not sell its own glasses. | https://www.magicleap.com/newsroom/magic-leap-showcases-ar-expertise-in-glasses-prototype-extends-google-partnership | company | confirmed |
| 2025-12-30 | day | partnership | Pegatron agreement for "scaled production of Magic Leap's AR components, including its industry-leading waveguides". | https://www.magicleap.com/newsroom/magic-leap-and-pegatron-enter-agreement-for-production-of-ar-glasses-components | company | confirmed |
| 2026-07-09 | day | roadmap | "Magic Leap Accelerates the Future of AI Display Glasses with Waveguide Expertise" — waveguide samples in multiple FOVs, J-FIL imprint lithography; pivot from first-party devices to supplier. | https://www.magicleap.com/newsroom/magic-leap-accelerates-the-future-of-ai-display-glasses-with-waveguide-expertise | company | confirmed |
| 2026-09-09 | day | hire | Scott Carden promoted to COO, "accelerating partners' path to AI display glasses". | https://www.magicleap.com/newsroom | company | confirmed |

### Camera/AF: prototype "includes cameras" (no specs). Cross-links: Google (Android XR), Pegatron. Gaps: 2026 prototype updates at Google I/O (May 19–20, 2026) not verified.

---

## 15. Industry calendar 2026–2027 (where glasses get announced or shipped)

| date | precision | event | what happened / expected | source URL | confidence |
|---|---|---|---|---|---|
| 2026-01-06 → 01-09 | day | CES 2026, Las Vegas | Lenovo AI Glasses Concept; RayNeo Project eSIM; (Vuzix exhibits). | https://en.wikipedia.org/wiki/Consumer_Electronics_Show | confirmed |
| 2026-02-25 | day | Samsung Galaxy Unpacked (S26), San Francisco | Phones; no glasses. | https://en.wikipedia.org/wiki/Samsung_Galaxy_S26 | confirmed |
| 2026-03-02 → 03-05 | day | MWC Barcelona 2026 | Alibaba Qwen AI Glasses reservations opened day 1. | https://en.wikipedia.org/wiki/Mobile_World_Congress | confirmed |
| 2026-03-09 → 03-13 | day | GDC 2026, San Francisco | Pico Project Swan / OS 6 developer session. | https://roadtovr.com/pico-project-swan-os-6-update/ | confirmed |
| 2026-03-12 → 03-15 | day | AWE2026 = Appliance & Electronics World Expo, Shanghai SNIEC (not Augmented World Expo) | Qwen Glasses full lineup shown. | https://baike.baidu.com/en/item/Qwen%20AI%20Glasses/1469262 | strong |
| 2026-04-20 | day | Huawei launch event (with Pura 90) | HUAWEI AI Glasses; sale 2026-04-25. | https://the-gadgeteer.com/2026/04/21/huawei-ai-glasses-debut/ | confirmed |
| 2026-05-19 → 05-20 | day | Google I/O 2026, Shoreline | Android XR glasses updates (see Google file). | https://9to5google.com/2026/02/17/google-io-2026-date/ | confirmed |
| 2026-06-08 → 06-12 | day | Apple WWDC 2026 | (see Apple file). | https://www.apple.com/newsroom/2026/03/apples-worldwide-developers-conference-returns-the-week-of-june-8/ | confirmed |
| 2026-06-15 → 06-18 | day | AWE USA 2026, Long Beach | Snap Specs revealed 2026-06-16 ($2,195, pre-orders, ship "this fall"). | https://techcrunch.com/2026/06/16/snap-finally-debuts-its-long-awaited-ar-glasses-specs-and-oof-they-arent-cheap/ | confirmed |
| 2026-07-22 | day | Samsung Galaxy Unpacked, London | "Intelligent eyewear" (Android XR, AR1 Gen1, Gentle Monster / Warby Parker) introduced; availability "soon"/"this fall", no price. | https://www.auganix.org/xr-news-samsung-smart-glasses-galaxy-unpacked-2026/ | confirmed |
| 2026-09-02 | day | Pico Space Pro event, Beijing | Cancelled 2026-08-25; release moved to Q4 2026. | https://roadtovr.com/pico-vision-pro-competitor-delayed-cancelled-event/ | confirmed |
| 2026-09-14 / 09-18 | day | Valve Steam Frame | Reservations / release, $1,059–$1,299. | https://en.wikipedia.org/wiki/Steam_Frame | confirmed |
| 2026-09-16 | day | Snap SPECS launch event, Los Angeles (4 pm PT) | In-depth Specs reveal (no 2026 "Partner Summit" found; 2024's was 2024-09-17). | https://newsroom.snap.com/specs-launch-date | confirmed |
| 2026-09-21 | day | Amazon blog update | Driver glasses scale-up (5,000 in 2026; 20,000+ by end-2027). | https://www.aboutamazon.com/news/transportation/smart-glasses-amazon-delivery-drivers | confirmed |
| 2026-09-22 | day | Alibaba Apsara Conference 2026 (云栖大会), Hangzhou | Qwen AI Glasses N1 / N1 Pro + Qwen Clip; sale 2026-10-13. | https://www.alizila.com/alibaba-unveils-agentic-computer-ai-wearables-and-more-at-2026-apsara-conference/ | confirmed |
| 2026-09-23 → 09-24 | day | Meta Connect 2026 | Meta VR Glasses announced, spring-2027 launch (see Meta file). | https://www.meta.com/blog/connect-2026-save-the-date/ | confirmed |
| 2026-10-13 | day | Qwen N1 in-stock sale (China) | | https://finance.sina.com.cn/tech/roll/2026-09-22/doc-inisspzf8887020.shtml | confirmed |
| 2026-Q4 | quarter | Pico Space Pro release | Company statement. | https://roadtovr.com/pico-vision-pro-competitor-delayed-cancelled-event/ | confirmed |
| 2026-Q4 / 2027 | quarter | Xiaomi AI Glasses 2 (rumoured, denied) | | https://www.ithome.com/0/985/781.htm | rumor |
| late 2026 – early 2027 | quarter | Amazon Jayhawk (reported) | | https://roadtovr.com/amazon-jayhawk-smart-glasses-report-meta-hypernova-celeste/ | rumor |
| 2026 (by year-end) | year | Alibaba Qwen Glasses international release | Company statement. | https://www.alibabacloud.com/blog/alibaba-unveils-qwen-glasses-at-mwc-barcelona-accelerating-ai-hardware-ambitions_602920 | strong |
| 2026-12-07 → 12-09 | day | UnitedXR EU 2026 (AWE), Brussels | | https://www.awexr.com/ | confirmed |
| 2027-01-06 → 01-09 | day | CES 2027, Las Vegas (Wikipedia lists a Jan 5 start; CTA site says Jan 6–9) | Typical window for Lenovo/RayNeo/Vuzix/TCL glasses. | https://www.ces.tech/ | confirmed |
| 2027-03-01 → 03-04 | day | MWC Barcelona 2027 | Alibaba used MWC 2026 for its March drop; likely repeat. | https://www.cmswire.com/events/conference/gsma-mwc-barcelona-2027/ | strong |
| 2027 spring | quarter | Meta VR Glasses commercial launch (per brief/Meta file) | | https://www.meta.com/blog/connect-2026-save-the-date/ | see Meta file |
| 2027-06-14 → 06-17 | day | AWE USA 2027, Long Beach | | https://www.awexr.com/ | confirmed |
| 2027-06-23 → 06-25 | day | MWC Shanghai 2027 | | https://www.mwcshanghai.com/ | strong |
| 2027-07-14 → 07-16 | day | AWE Asia 2027, Shanghai | | https://www.awexr.com/ | confirmed |
| 2027 (not yet dated) | year | Google I/O 2027, WWDC 2027, Meta Connect 2027, Samsung Unpacked 2027, Snap event, Alibaba Apsara 2027, Xiaomi "Human x Car x Home" / Lei Jun annual speech (2025 editions: 2025-06-26 and 2025-09-25), Amazon "Delivering the Future" (2025 edition: 2025-10-22), Baidu World (Nov) | Recurring; 2027 dates unannounced as of 2026-10-06. | https://en.wikipedia.org/wiki/Xiaomi_17 | n/a |

Pattern: Chinese OEMs (Alibaba, Xiaomi, Huawei, Baidu, RayNeo) announce at their own events or MWC/CES and ship within 0–4 weeks; Western OEMs (Amazon, Valve, Pico-global, Snap) announce 6–15 months ahead and slip. Autumn (Sept 16–24, 2026) has become the densest window: Snap, Valve, Amazon, Alibaba and Meta all made glasses announcements within nine days.

---

## 16. Cross-entity supplier links found in this scope (all dated above)

| supplier | OEM / product | date | evidence |
|---|---|---|---|
| poLight (TLens) | Xiaomi Mitu Children's Watch 4Pro, 8 MP side camera | 2020-01-07 | Gizmochina; Yole ("first commercial product") |
| Goertek (ODM) | Xiaomi AI Glasses | reported 2024-11-13 | 36Kr via Road to VR |
| Sony (IMX681 12 MP) | Xiaomi AI Glasses; RayNeo X3 Pro; Alibaba Qwen S1/G1 | 2025-06 / 2025 / 2026-03 | GSMArena; vrarwiki; The Deep View |
| Qualcomm (AR1) | Xiaomi; Alibaba G1/Qwen; Samsung eyewear; HTC (unstated) | 2025–2026 | multiple |
| Meta-Bounds (display) | Amazon Jayhawk | reported 2025-09 | The Information via GIGAZINE/Road to VR |
| Quanta (ODM/investor) | Vuzix Ultralite / waveguides | 2024-09-03 → 2025-09-22 | Vuzix IR |
| Pegatron (manufacturing) | Magic Leap waveguides | 2025-12-30 | Magic Leap newsroom |
| Google | Magic Leap (2024-05-30, ext. 2025-10-29); HTC XR team ($250M, 2025-01); Samsung eyewear (2026-07-22) | | newsroom / press |
| Meta | Anduril EagleEye / SBMC | 2025-05-29; 2025-09-09 | Anduril; GovConWire |
| Siemens | Sony SRH-S1 | 2025-01-23 | UploadVR |
| Zeiss / Sibo / Stepper | Huawei AI Glasses prescriptions | 2026-04 | Omdia |

No public evidence was found in this scope linking any of these OEMs to Q Tech, CML, Optotune, Corning Varioptic, Luxshare or Sunny Optical for glasses/headset cameras, and none of the shipping glasses here (Xiaomi, Alibaba S1/G1, Huawei, HTC Eagle, RayNeo, Baidu) advertises autofocus; all use ~12–16 MP fixed-focus ultra-wide modules. The two products where AF would plausibly matter are Alibaba's N1 (50 MP, Oct 2026) and Amazon's driver glasses (barcode scan + doorstep photos) — both unverified.

---

## Return summary

Outside Meta/Apple/Google/Snap, no shipping AR/AI glasses from Amazon, Alibaba, Xiaomi, Huawei, HTC, RayNeo or Baidu advertises an autofocus camera; all use 12–16 MP fixed-focus ultra-wide modules (Sony IMX681 dominates). The one historical poLight design-in is Xiaomi's Mitu 4Pro kids' watch (2020-01-07). Key dated signals: Amazon unveiled driver glasses 2025-10-22 and on 2026-09-21 committed only 5,000 units in 2026 and 20,000+ by end-2027 (far below The Information's 100,000); consumer "Jayhawk" (late 2026/early 2027) has no 2026 updates. Alibaba is the fastest mover: Quark S1/G1 (2025-11-27) → Qwen rebrand at MWC (2026-03-02) → N1/N1 Pro with a 50 MP sensor (2026-09-22, on sale 2026-10-13). Huawei launched 12 MP glasses 2026-04-20; Pico Space Pro slipped to Q4 2026; Valve shipped Steam Frame 2026-09-18; Microsoft/HoloLens is dead (IVAS → Anduril+Meta). Calendar: CES 2027 Jan 6–9, MWC 2027 Mar 1–4, AWE USA 2027 Jun 14–17; Meta VR Glasses spring 2027.
