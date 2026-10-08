# poLight "Program B": identifying the "leading consumer OEM" design-in (round 4)

Research date: 2026-10-08. Public sources only. Downloads (Varjo user guide, Varjo FCC exhibits) are in `entities4/dl_programb/`. "Program B" is the poLight case that ran from a "mature proof-of-concept" PO on 2025-11-24, through mass-production-priced POs on 2026-04-07 (~NOK 2.4m), 2026-05-20 (~0.8m) and 2026-07-10 (~0.8m), to poLight's first consumer AR|MR "design-in" on 2026-07-10, with a launch "this year".

## 1. Profile

Program B is an unnamed consumer AR|MR program. poLight describes the customer as "a big company and a major player in the ecosystem" (CEO, Q&A 2026-08-19). On geography the CEO said "mainly focusing on U.S. and China. So you pick." (2026-02-25), and asked about the device he said "It's an external device." (Q2 call 2026-08-06, auto-transcript). Other descriptions: "probably high-end … probably high performance", not "super high volumes", and "normally they do not launch worldwide day one". Q Tech was "involved in … all these cases, but not alone" for the Aug/Oct/Nov-2025 POs (CEO 2026-02-25), so Program B's November 2025 PO very likely runs through Q Tech as a camera-module (CCM) partner. As of 2026-10-08 poLight has issued no design-win release for Program B. Its last release is dated 2026-09-21 (a TWedge PO).

What this round found:
- **No 2026 product has an official spec page that says "autofocus" for its camera.** The only autofocus claim is a leak about Samsung's glasses (GalaxyClub, 2026-01-13).
- **A public TLens sighting in China.** Ant Group's AI-glasses reference design, shown at WAIC in July 2026, uses "邱钛Tlens液态可变焦镜头" ("Qiu-Tai" is a misspelling of 丘钛, i.e. Q Tech) with real-time autofocus (ZOL, 2026-07-22). poLight's CFO raised it on the Q2 call. The CEO replied "we know that initiative. It's Alibaba".
- **The Varjo precedent holds twice.** poLight declared its MR-headset design-wins on the day of, or the day after, Varjo announced XR-4 hardware (2023-11-27 / 2023-11-27, and 2025-10-08 / 2025-10-09).

## 2. Timeline table

| date | precision | category | event | source URL | source type | confidence |
|---|---|---|---|---|---|---|
| 2023-11-16 | day | other | Varjo files FCC application 2AROD-005 ("Virtual reality headset" = XR-4 series); original grant 2023-11-29. | https://fccid.io/2AROD-005 | regulator | confirmed |
| 2023-11-27 | day | product_release | Varjo XR-4 series announced (XR-4, XR-4 Focal Edition, XR-4 Secure); Focal Edition has gaze-directed autofocus passthrough, dual 20 MP passthrough cameras, ~51 PPD passthrough; shipping December 2023; Focal ≈US$10,000 / €9,990. | https://roadtovr.com/varjo-xr-4-announcement-specs-price-release-date/ ; https://www.cnbc.com/2023/11/27/finnish-startup-varjo-launches-3990-xr-4-mixed-reality-headset.html | press | confirmed |
| 2023-11-27 | day | design_in (design-win) | poLight: TLens "used in a recently announced MR head-mounted device from a market leading company"; initial mass-production PO ≈NOK 0.4m. Same day as Varjo's XR-4 launch. | https://www.inderes.dk/en/releases/polight-new-design-win-and-initial-mass-production-purchase-order-received-for-high-end-mixed-reality-head-mounted-device | company/IR | confirmed (customer unnamed) |
| 2023-11-28 | day | rumor | Nweon (映维网) speculates the MR-HMD customer is Varjo (XR-4). | https://news.nweon.com/115353 | press | rumor |
| 2024-01-10 | day | other | Varjo C2PC cover letter: "This application for C2PC is prepared to new model variants in Varjo XR-4 product series"; internal photos titled "HS-10B & HS-10C Internal Photos" (dated 2024-01-11); grant 2024-02-19. "Parts List Cameras" and "Operational Description – Model Differences" are under long-term confidentiality (metadata only). | https://fccid.io/2AROD-005 (C2PC letter, Internal Photos 1–5) | regulator | confirmed |
| 2024 (role dated Jan–Jun 2024 in round-1 screenshot) | year | hire | Hon Hai/Foxconn Taoyuan AR/VR camera-module RD head's public profile lists "Varjo客戶HMD產品順利量產" next to "完成Tlens快速對焦相機模組驅動程式開發" (TLens fast-focus camera-module driver development). | (round-2 file module_makers_tlens.md; tw.linkedin.com public profile, not reopened) | forum/profile | circumstantial |
| 2024-11-16 | day | rumor | Maeil Business (MK), citing Wellsenn XR (Shenzhen): Samsung AI glasses use AR1 + NXP, 12 MP Sony IMX681, "payment with QR code recognition", 155 mAh, 50 g; "first production volume is 500,000 units in the third quarter of 2025". (The quoted English text does not mention autofocus.) | https://www.mk.co.kr/en/business/11169803 | press (citing analyst) | rumor |
| 2025-06-17 | day | other | Rokid and Alipay launch the "看一下支付" (look-to-pay) feature on Rokid Glasses, using a 12 MP camera to scan Alipay QR codes. Shows why close-range autofocus matters for QR payment. | https://www.thepaper.cn/newsDetail_forward_30998406 | press | confirmed |
| 2025-07-18 | day | rumor | The Information (via Road to VR): Pico "Swan" MR goggles with a tethered compute puck. | https://roadtovr.com/pico-report-mixed-reality-goggles-meta-phoenix-puffin-loma/ | press | strong |
| 2025-10-08 | day | product_release | Varjo announces a refreshed XR-4 Series (incl. Focal Edition) with "optimized autofocus passthrough cameras". | https://www.auganix.org/vr-news-varjo-xr-4-updated-version/ ; https://varjo.com/news/varjo-launches-mixed-reality-headsets-purpose-built-for-training-across-air-land-and-sea | company + press | confirmed |
| 2025-10-09 | day | design_in (design-win) | poLight 08:30 CEST: "Repeat Design-win for High End Mixed Reality Head-Mounted Device". TLens is used in a "recently announced enterprise mixed reality head-mounted device"; existing customer; PO ≈NOK 0.4m. One day after Varjo's refresh. | https://mfn.se/a/polight/polight-receives-repeat-design-win-for-high-end-mixed-reality-head-mounted-device | company/IR | confirmed (customer unnamed) |
| 2025-11-24 | day | order | **Program B PO #0**: ~NOK 0.9m TLens follow-on "for AR\|MR Use from a Leading Consumer OEM", "mature proof-of-concept program". | https://mfn.se/a/polight/polight-asa-receives-follow-on-purchase-order-for-tlens-r-for-ar-mr-use-from-a-leading-consumer-oem | company/IR | confirmed |
| 2025-11-27 | day | product_release | Alibaba Quark AI Glasses S1 (display) / G1 launched in China; 12 MP Sony IMX681, f/2.2, 109°, 5P lens. | https://news.qq.com/rain/a/20251127A06NI200 | press | confirmed |
| 2025-12-02 | day | other | VR陀螺 review of Quark S1: "大多数AI眼镜的拍摄对焦往往以「自动对焦」为主"; S1's capacitive shutter "通过波导镜片显示对焦标识" (shows a focus marker). The focus mechanism is not stated. | http://www.tuoluo.cn/article/detail-10127014.html | press | confirmed (wording); AF hardware unknown |
| 2026-01-13 | day | rumor | GalaxyClub: Samsung SM-O200P/SM-O200J glasses, "12-megapixelcamera … met autofocus", probably launching only in the US and South Korea. A reader comment asks "Will the autofocus come from a VCM or a liquid/tlens?" | https://www.galaxyclub.nl/samsung/galaxy-glasses/ | press (leak) | rumor/strong |
| 2026-02-04 | day | rumor | XRVision (Xueqiu column): Samsung glasses "很可能会搭载液态镜头" (poLight T-Lens). The **only** basis given is GalaxyClub's "AutoFocus". Same author previously claimed Meta is studying poLight/Q Tech T-Lens modules. | https://xueqiu.com/7140368854/374858752 | forum/blog | rumor (inference only) |
| 2026-02-06 | day | rumor | Sina XR / Tencent News repost: "三星2026款AI眼镜或将搭载液态镜头与像素位移技术" (AI-assisted article; poLight T-Lens and TWedge). | https://news.qq.com/rain/a/20260206A06DRK00 ; https://www.sinaxr.com/doc/docView/7411 | press (aggregator) | rumor |
| 2026-02-25 | day | other | poLight CEO on the Nov-2025 "leading OEM": "when it comes to AR/MR, we are mainly focusing on U.S. and China. So you pick." Also: Q Tech "involved in … all these cases, but not alone". | https://ir.polight.com/qa (Investorweb public Q&A) | company/IR | confirmed |
| 2026-03-02 | day | announcement | Pico teases "Project Swan" (4,000 PPI micro-OLED, dual-chip, ~12 ms passthrough pipeline), global launch "late 2026". | https://roadtovr.com/pico-project-swan-os-6-update/ | press (company statements) | confirmed |
| 2026-03-11 | day | teardown | 52audio teardown of Quark S1: 12 MP Sony IMX681, f/2.2, 109°, 5-element lens; TDK ICM-42688-P IMU used for stabilisation; manufacturer "浙江未来精灵人工智能科技有限公司". No focus actuator mentioned. | https://www.52audio.com/archives/269965.html | press (teardown) | confirmed |
| 2026-04-07 | day | order | **Program B PO #1** ~NOK 2.4m (mass-production priced); deliveries from May 2026. | https://mfn.se/a/polight/polight-asa-receives-tlens-r-follow-on-purchase-order-from-a-consumer-oem-for-ar-mr-use | company/IR | confirmed |
| 2026-04-20 | day | product_release | Huawei AI Glasses launched (on sale 04-25, from ¥2,499): "1200 万像素超广角摄像头 × 1", 1/2.8" sensor, 6P lens, EIS. **No focus wording** on the official spec page. Launched before the design-in, so it cannot be Program B. | https://consumer.huawei.com/cn/audio/ai-glasses/specs/ ; https://www.ithome.com/0/941/277.htm | company | confirmed |
| 2026-05-19 | day | announcement | Google I/O: Samsung-built Android XR glasses previewed; Xreal says Aura will launch before end-2026. | https://9to5google.com/2026/05/19/xreal-project-aura-android-xr-developers-2026-launch/ | press | confirmed |
| 2026-05-20 | day | order | **Program B PO #2** ~NOK 0.8m, "same customer case as announced 7 April 2026"; delivery Q3 2026. | https://mfn.se/a/polight/polight-asa-receives-tlens-r-follow-on-purchase-order-from-a-consumer-oem-for-ar-mr-use-1 | company/IR | confirmed |
| 2026-05-27 | day | product_release | RayNeo V4 (¥2,199): OmniVision OG09B 1/2.9" square sensor, 17 mm F2.2, EIS. No AF wording. | https://finance.sina.com.cn/tech/digi/2026-05-27/doc-inhzizph8313564.shtml | press | confirmed |
| 2026-06-16 | day | product_release | Snap SPECS unveiled at AWE: US$2,195, pre-order, ships "this fall" in US/UK/France; two full-colour high-resolution cameras plus two IR cameras; Snap gave no camera specs. | https://www.macrumors.com/2026/06/16/snap-specs-ar-glasses/ ; https://www.techtimes.com/articles/318575/20260617/snap-specs-ar-glasses-open-preorder-2195-resolution-stays-secret.htm | press | confirmed |
| 2026-07-10 | day | design_in | **Program B PO #3** ~NOK 0.8m; "the units ordered, and those units shipped lately, will potentially be used in the commercial product to be launched … We now define this case as design-in." Delivery Q4 2026. | https://www.polight.com/mfn_news/polight-asa-receives-another-follow-on-purchase-order-from-a-consumer-oem-for-armr-use/ | company/IR | confirmed |
| 2026-07-22 | day | announcement | Samsung Unpacked (London): "intelligent eyewear" (Gentle Monster / Warby Parker), Snapdragon AR1 Gen1, "A built-in camera brings visual context into the AI experience". No resolution or AF spec; Korean release says "연내 출시". 12 days after Program B's design-in. | https://news.samsung.com/global/samsung-brings-galaxy-ecosystem-into-everyday-eyewear ; https://www.samsung.com/sec/business/insights/news/news_260728_05/ | company | confirmed |
| 2026-07-22 | day | design_in (reference design) | ZOL: at WAIC 2026, Ant Group shows its own AI-glasses reference design (Ling Device OS): BES2800 + SA62105X ISP; "影像采集系统搭载索尼IMX681图像传感器及邱钛Tlens液态可变焦镜头，支持实时自动对焦"; 光峰 "蜻蜓C1" full-colour LCoS + binocular waveguide; payment, navigation, translation apps. It is a reference design for brands and ODMs, not a retail product. | https://ai.zol.com.cn/1219/12198157.html | press | confirmed (reported spec) |
| 2026-07-31 | day | announcement | Samsung interview: "With a high-quality camera, microphones and speakers integrated into its frame…". No AF wording. | https://news.samsung.com/global/interview-galaxy-unpacked-july-2026-intelligent-eyewear-the-first-step-toward-the-next-mobile-ai-interface | company | confirmed |
| 2026-08-05 | day | rumor | IT之家 citing XR Vision: Xiaomi AI Glasses gen 2 "R&D complete" but launch paused by Lu Weibing; may slip to Q4 2026 or 2027. Xiaomi called this "造谣" (a fabricated rumour). | https://www.ithome.com/0/985/781.htm | press | rumor (denied) |
| 2026-08-06 | day | earnings | Q2 call: CFO asks about "Ant Group showed off a demo glasses with a TLens camera at an event in Asia … so that payment solutions … Look to Pay, could work optimally"; CEO: "we know that initiative. It's Alibaba…". On Program B: "the release plan is this year … a little bit uncertain"; "It's probably high-end. It's probably high performance."; "It's an external device." | https://investorweb-ir-documents.s3.eu-north-1.amazonaws.com/Documents/polight-asa/financial-documents/2026/polight-q2-2026-transcript-ff2523.pdf ; https://www.investing.com/news/transcripts/earnings-call-transcript-polight-q2-2026-revenue-momentum-lifts-shares-43-93CH-4840290 | company/IR | confirmed |
| 2026-08-19 | day | announcement | Pico names "Pico Space Pro", sets a 2026-09-02 Beijing launch. | https://roadtovr.com/picos-vision-pro-competitor-release-date-pricr-name/ | press | confirmed |
| 2026-08-19 | day | other | poLight Q&A: Program B customer is "a big company and a major player in the ecosystem". | https://ir.polight.com/qa | company/IR | confirmed |
| 2026-08-24 | day | roadmap | Q Tech 1H26 deck: "TLens及AR单色光机 实现批量交付" (TLens and AR mono light engines delivered in volume); "海外关键客户预计于26H2 / 2027年放量" (overseas key customers expected to ramp in 2H26 / 2027). | https://www.qtechsmartvision.com/ueditor/php/upload/file/20260824/1787550624681112.pdf | company | confirmed |
| 2026-08-24/25 | day | roadmap | Pico cancels the Sept 2 event; release moved to "the fourth quarter of this year" for "a major upgrade to the software experience"; China focus, but also global. | https://roadtovr.com/pico-vision-pro-competitor-delayed-cancelled-event/ | press (company statement) | confirmed |
| 2026-08-26 | day | analyst_report | DBS on Q Tech: AR optical engines "already being shipped to Meta and Samsung". | https://www.dbs.com/content/article/pdf/000000_HK/1478_HK.pdf | analyst | strong |
| 2026-09-05 | day | other | UploadVR: Pico FCC IDs 2A5NV-AA1Z0 ("Mixed Reality Headset") and 2A5NV-B3110 ("Mixed Reality Main Unit", tethered puck, 7,000 mAh); short-term confidentiality until 2027-02-28. | https://www.uploadvr.com/pico-space-pro-appears-to-receive-fcc-certification-following-delay-to-q4/ | press (regulatory) | confirmed |
| 2026-09-10 | day | announcement | Qwen N1 previewed at the Bund Summit AI-payment area (no display, iris recognition). | https://technode.com/2026/09/10/alibaba-qwen-previews-n1-ai-glasses-with-iris-recognition-and-no-display/ | press | confirmed |
| 2026-09-11 | day | other | Luxshare CIOE release lists a "T-LENS Camera" among its AR-glasses optics (round-2 finding). | https://www.luxshare-ict.com/news/release/209.html | company | confirmed |
| 2026-09-16 | day | announcement | Snap SPECS event: "Shipping is expected to begin later this fall in the United States, United Kingdom and France"; "computing hardware built directly into the glasses without a puck or tether". | https://investor.snap.com/news/news-details/2026/SPECS-Make-Computing-More-Human-with-New-Experiences-Partnerships-and-SPECS-Intelligence/default.aspx | company | confirmed |
| 2026-09-21 | day | order | poLight TWedge technical-samples PO ~NOK 1.2m from a "leading consumer OEM" for an "AR\|MR display application". This is the latest poLight release as of 2026-10-08. | https://www.polight.com/mfn_news/ | company/IR | confirmed |
| 2026-09-22 | day | product_release | Alibaba Apsara: Qwen AI Glasses N1 / N1 Pro: "5000 万像素传感器" (50 MP), 4K video, three-chip (AR1 + BES2800 + low-power sensing chip), "晶曜" lens; N1 Pro adds eye tracking (<1° centre) and iris payment; no display; in-stock sale 2026-10-13; price not announced. No focus wording in press or company copy. | https://www.ithome.com/1/005/647.htm ; https://post.smzdm.com/p/awwz8554/ ; https://www.alizila.com/alibaba-unveils-agentic-computer-ai-wearables-and-more-at-2026-apsara-conference/ | press + company | confirmed |
| 2026-09-23 | day | product_release | Meta Connect: Ray-Ban Meta Gen 3 ($449) keeps the 12 MP camera; Ray-Ban Meta Audio has no camera. No AF. | https://www.meta.com/blog/meta-connect-2026-everything-we-announced/ | company | confirmed |
| 2026-09-24 | day | announcement | Rokid gen-2 display AI glasses shown in Hangzhou; formal launch 2026-10-27. Upgrades: stabilisation and night mode; no AF wording. | https://finance.sina.com.cn/tech/roll/2026-09-24/doc-inisxxkt8167761.shtml ; http://news.10jqka.com.cn/20260929/c680355614.shtml | press | confirmed |
| 2026-09-28 | day | hire | Q Tech (Kunshan) Liepin job ad, AR/VR manufacturing-centre head: new XR whole-device factory, camera modules, "直接对接品牌客户（如Meta、Pico等）" (deals directly with brand customers, e.g. Meta, Pico). | https://m.liepin.com/job/1985561045.shtml | job board | confirmed |
| 2026-10-01 | day | other | Samsung SM-O200P/SM-O200J clear the FCC (single 12 MP front camera); Korea Herald: a Samsung official confirms a November 2026 launch. | https://roadtovr.com/samsung-fcc-gentle-monster-warby-parker-smart-glasses/ ; https://9to5google.com/2026/10/01/samsung-android-xr-glasses-release-date-report/ | press | strong |
| 2026-10-02 | day | rumor | Social leak: Pico Space Pro listed at US$2,899 (Knoxlabs enterprise listing); JD leak ¥16,999 / ¥18,499. | https://x.com/MizoChris/status/2106001472634708373 ; https://m.sohu.com/a/1066155635_122618814 | forum/rumor | rumor |
| 2026-10-07 | day | announcement | XREAL Aura priced at US$1,279 (12/256 GB) / US$1,499; first wave "before the holidays"; pre-orders "later this month". Official page: "World-facing tracking cameras ×2" and "High-resolution camera with privacy LED indicator — Real-time AI perception"; compute puck; launch regions incl. US, EU, Japan, Korea. No AF wording. | https://9to5google.com/2026/10/07/xreal-aura-with-android-xr-start-at-1279/ ; https://www.xreal.com/aura | press + company | confirmed |
| 2026-10-08 | day | other | poLight's news feed shows no release after 2026-09-21. No design-win has been declared for Program B, 90 days after the design-in. | https://www.polight.com/mfn_news/ | company/IR | confirmed |

## 3. Future / expected events

| window | event | source | confidence |
|---|---|---|---|
| 2026-10-13 | Qwen N1 / N1 Pro in-stock sale (China); JD spec page and first reviews may show the focus type. | ithome 2026-09-22 | confirmed |
| 2026-10 (late) | XREAL Aura pre-orders; shipping "before the holidays". | 9to5google 2026-10-07 | confirmed |
| 2026-10-27 | Rokid gen-2 AI glasses launch event. | 10jqka 2026-09-29 | confirmed |
| 2026-10-29 / 10-30 | poLight Q3 report / Capital Markets Day: possible Program B launch status or design-win. | poLight IR | confirmed (dates) |
| 2026-11 | Samsung intelligent eyewear on sale (select markets: US, Korea likely). | Korea Herald via 9to5google 2026-10-01; GalaxyClub 2026-01-13 | strong |
| 2026-Q4 | Pico Space Pro release (China first); FCC confidentiality on Pico exhibits ends 2027-02-28. | Road to VR 2026-08-25; UploadVR 2026-09-05 | confirmed (company) |
| 2026 "later this fall" | Snap SPECS shipping (US/UK/FR). | Snap 2026-09-16 | confirmed (company) |
| 2026-Q4 / 2027 | Xiaomi AI Glasses gen 2 (rumoured, denied). | ithome 2026-08-05 | rumor |
| +1–4 months after each launch | First teardowns. Precedents: 52audio Quark S1 3.5 months after launch; iFixit Ray-Ban Display 8 days; TechInsights blog 8 months. | 52audio; round-2 meta file | circumstantial |
| within 0–1 day of the customer's "in the shop" announcement | Expected poLight design-win release for Program B, if the Varjo precedent holds (see §5). | poLight 2023-11-27, 2025-10-09 | strong (pattern) |

## 4. Camera / autofocus relevance — candidate matrix (2026-07 → 2027-01 launches with a camera)

| product (OEM, HQ) | announce → on sale | camera (official wording) | AF wording on official page | module / ODM known | price | volume signal | teardown |
|---|---|---|---|---|---|---|---|
| Samsung intelligent eyewear SM-O200P/J (Samsung, KR; with Google) | 2026-07-22 → Nov 2026 | "A built-in camera"; FCC: single 12 MP | **None official**; leak "12-megapixelcamera … met autofocus" (GalaxyClub 2026-01-13, citing MK/Wellsenn 2024) | none public; Q Tech ships AR engines to Samsung (DBS) | not announced (leaks US$379–499) | Wellsenn 2024: 500k first production | none yet |
| Pico Space Pro (ByteDance, CN) | 2026-08-19 name → Q4 2026 | passthrough camera specs undisclosed; custom XR chip for "perception and imaging" | none (no spec sheet) | Q Tech job ad names Pico as a brand client; ODM unconfirmed | leaks ¥16,999–18,499 / US$2,899 enterprise | high-end, low volume | none (FCC exhibits confidential to 2027-02-28) |
| Snap SPECS (Snap, US) | 2026-06-16 → "later this fall" | "two full-color high-resolution cameras" + 2 IR | none; Snap declined camera specs | none public | US$2,195 | low (premium AR) | none |
| Qwen AI Glasses N1 / N1 Pro (Alibaba, CN) | 2026-09-22 → 2026-10-13 | "5000万像素传感器", 4K, "晶曜" lens | none | none public (Quark S1 made by 浙江未来精灵) | not announced (rumour ~¥2,000) | mass market, China only | none yet (S1 teardown came 3.5 months after launch) |
| XREAL Aura (Xreal, CN) | 2026-05/06 → Nov–Dec 2026 | "High-resolution camera with privacy LED" + 2 tracking cams | none | none public | US$1,279 / 1,499 | moderate | none |
| Xiaomi AI Glasses 2 (Xiaomi, CN) | unannounced; Q4 2026/2027 rumour | rumour: OmniVision 50 MP | n/a | n/a | n/a | gen-1 had 28% China share Q1 2026 | n/a |
| Rokid gen-2 AI glasses (Rokid, CN) | 2026-09-24 shown → 2026-10-27 launch | stabilisation + night mode upgrades | none | none | n/a | Rokid claims 41% of H1-2026 shipments | n/a |
| Ray-Ban Meta Gen 3 (Meta, US) | 2026-09-23 → on sale | 12 MP (unchanged) | none (third-party: "fixed focus") | Sunny (analysts) | US$449 | high | n/a |
| Huawei AI Glasses (CN) | 2026-04-20 → 04-25 | 12 MP UW, 1/2.8" | none | none | ¥2,499 | — | 52audio teardown exists |
| RayNeo V4 / X3 Pro / iO (TCL, CN) | 2026-05-27 / 2025 / 2026-09-04 | V4 OG09B 17 mm F2.2; X3 Pro IMX681; iO no camera | none | none | ¥2,199 / US$1,099 / US$469 | — | — |
| Rokid AI Glasses Style (CN) | 2025 / JP 2026-09-15 | 12 MP | "fixed focus, 34 cm minimum focus distance" (review) | — | ¥64,990 JP | — | — |
| Meizu StarV Snap (Geely, CN) | 2025-09-15 | 12 MP, 109° | none | — | ¥1,999 | — | — |
| INMO GO3 (CN) | 2025-10 | 13 MP | none | — | ¥2,999 | — | EDN teardown |
| Viture Helix (US/CN) | 2026-06-16 → Q1 2027 | 12 MP | none | — | from US$600 | enterprise | — |
| Even Realities G2, Viture Pro 2, RayNeo GT, Halliday | 2026 | no camera | — | — | — | — | — |
| Amazon "Jayhawk" (US) | rumoured late 2026/early 2027; no 2026 news | "a camera" (The Information) | — | Meta-Bounds display | — | — | — |
| Apple glasses (US) | end-2027 (Gurman) | two sensors | — | — | — | — | — |
| Kering/Gucci Android XR | "Probably next year, 2027" | — | — | — | — | — | — |
| Ant Group AI-glasses reference design (CN; not retail) | WAIC 2026-07 | IMX681 + "邱钛Tlens液态可变焦镜头" | **"支持实时自动对焦"** (ZOL) | Q Tech TLens; 光峰 LCoS | — | reference for brands/ODMs | — |
| Varjo XR-4 Focal Edition (FI, enterprise) | 2023-11-27 → Dec 2023; refresh 2025-10-08 | dual 20 MP passthrough | **"autofocus"** (HS-10A model) vs "fixed focus" (HS-10) in the user guide | Foxconn (profile: "Varjo … 量產" + TLens driver) | ≈US$10,000 | enterprise | FCC internal photos (HS-10B/C) do not show camera internals; camera parts list confidential |

Keyword sweep ("TLens", "T-Lens", "poLight", "压电液态镜头", "压电式可变焦", "可变焦镜头 自动对焦 眼镜"):
- The only 2026 glasses-product hit is the Ant Group reference design (ZOL 2026-07-22), plus Luxshare's CIOE "T-LENS Camera" (round 2).
- The Samsung "T-Lens" stories (2026-02-04/06) are inference from the word "autofocus".
- No 52audio, iFixit, TechInsights or System Plus teardown of a 2026 glasses product mentions TLens, a VCM or a liquid lens in the camera.

## 5. Cadence observations

1. **The Varjo "same-day disclosure" precedent is now two-for-two (strong circumstantial).**
   - XR-4 announced 2023-11-27 → poLight MR-HMD design-win 2023-11-27 (0 days).
   - Refreshed XR-4 with "optimized autofocus passthrough cameras" 2025-10-08 → poLight "repeat design-win … recently announced enterprise MR HMD … existing customer" 2025-10-09 (1 day).
   - Supporting evidence: Varjo's user guide splits HS-10A "autofocus" from HS-10 "fixed focus", and a Foxconn camera-module lead lists Varjo HMD mass production next to TLens driver development.
   - No teardown or Varjo statement names TLens, and the FCC camera parts list is confidential. So the Varjo link stays strong-circumstantial, not confirmed.
   - Rule this implies: **poLight declares a design-win within ≈0–1 day of the customer's public product announcement, once a firm in-shop date exists.**
2. **Applying the rule to Program B.** No design-win has appeared 90 days after the design-in.
   - Products already announced with a firm date that poLight did *not* react to are weakened: Qwen N1 (date fixed 2026-09-22 for 10-13) and Ray-Ban Meta Gen 3.
   - Products announced without a firm date fit the silence: Samsung (07-22 "this fall"; November only via Korea Herald 10-01), Snap ("later this fall") and Xreal (priced 10-07, no ship date).
   - Products not yet launched also fit: Pico Space Pro (Q4), Xiaomi gen 2, Rokid gen 2 (10-27).
3. **PO cadence vs. launch.** Gaps were 134 d, 43 d and 51 d. Deliveries run May → Q3 → Q4 2026, i.e. a build programme spanning May–December 2026, consistent with a Q4 2026 launch. Total mass-production-priced POs are ≈NOK 4.0m; at the CEO's "around $2 +" per lens that is roughly 150–190k lenses. This fits a high-end, low-volume launch (CEO: not "super high volumes"). It looks small against Samsung's reported 500k first production.
4. **Design-in → customer announcement.** For Samsung the gap is 12 days (07-10 → 07-22). For Pico, 40 days to the naming (08-19), then a delay. For Qwen N1, 74 days (→ 09-22). poLight's historical design-in → launch median is about 6 months (round-2 lead-time file), so a Q4 2026 launch would be fast but in range.
5. **Announce → ship lags in this cohort.**
   - Chinese OEMs: 0–3 weeks (Huawei 5 days, Qwen N1 21 days).
   - Samsung: about 4 months (07-22 → Nov).
   - Snap: about 5 months (06-16 → fall).
   - Pico: at least 2 months after naming and slipping.

## 6. Cross-links

| link | date | source |
|---|---|---|
| Q Tech ↔ TLens in Ant Group's AI-glasses reference design ("邱钛Tlens") | 2026-07-22 | ZOL |
| poLight ↔ Alibaba/Ant initiative acknowledged by the CEO ("we know that initiative. It's Alibaba") | 2026-08-06 | Q2 transcript |
| Q Tech ↔ Pico and Meta (XR factory job ad naming brand clients) | 2026-09-28 | Liepin |
| Q Tech ↔ Samsung (AR optical engines shipped, per DBS) | 2026-08-26 | DBS |
| Q Tech ↔ Program B (CEO: Q Tech involved in the Aug/Oct/Nov-2025 cases "but not alone") | 2026-02-25 | poLight Q&A |
| Q Tech ↔ TLens volume delivery ("TLens及AR单色光机 实现批量交付") | 2026-08-24 | Q Tech deck |
| Foxconn ↔ Varjo (HMD mass production) ↔ TLens (driver development) | 2024 profile | round-2 module file |
| Wellsenn XR / XRVision ↔ Samsung/T-Lens rumour chain (MK 2024-11-16 → GalaxyClub 2026-01-13 → XRVision 2026-02-04) | 2024–2026 | as cited |
| TWedge "leading consumer OEM" (2025-11-10, 2026-09-21) uses the same label as Program B. TWedge targets LCoS displays (Snap SPECS, Ant reference design, Meta Ray-Ban Display), but the CEO says labels are "confusing you by design". | 2025–2026 | poLight releases |

## 7. Gaps

- No official spec page (Samsung, Pico, Snap, Alibaba, Xreal, Rokid) states the camera focus type. Samsung's AF claim is a leak only.
- No teardown exists yet of any candidate. Pico FCC exhibits are confidential until 2027-02-28. Varjo's "Parts List Cameras" is under long-term confidentiality.
- The MK/Wellsenn original Korean or Chinese note was not seen; the English page does not contain "autofocus", so GalaxyClub's "confirmation" is unverified.
- Reddit r/augmentedreality thread "Ant Group unveils smartglasses OS and reference design … poLight tunable TLens" could not be opened: Reddit blocks the fetch tools. Only the search-engine snippet was seen.
- "External device" comes from an auto-generated transcript and is ambiguous. It could refer to a puck (Pico, Xreal) or be a mis-transcription.
- No primary source ties Program B to any OEM. The Finansavisen and Inderes forums were not mined beyond snippets.
- Pico ODM and passthrough-camera specs, Snap SPECS camera module vendor, and Qwen N1 camera module vendor were not found.
- Ant Group reference-design commercial adopters (which brands or ODMs) and timing were not found.

## 8. Ranked candidates for Program B (probabilities sum to 1)

| rank | candidate | P | fit / misfit | what would confirm |
|---|---|---|---|---|
| 1 | **Pico Space Pro (ByteDance)** | 0.24 | Fit: true MR, "big company … major player in the ecosystem", China ("you pick"), high-end and low volume, launch "this year" with uncertain timing (the 08-06 hedge, then the 08-24 delay), tethered puck (matches "external device"), Q Tech job ad names Pico, and poLight's MR-passthrough-AF history (Varjo). Misfit: no AF evidence at all; Pico's camera suppliers are unknown. | Q4 launch event / spec sheet saying "自动对焦透视"; poLight design-win within 0–1 day; Chinese teardowns (VR陀螺, Bilibili, 52audio) in Q4 2026–Q1 2027. |
| 2 | **Samsung intelligent eyewear** | 0.22 | Fit: the only candidate with a leaked "12 MP … autofocus"; design-in 12 days before Unpacked; Nov 2026 launch in select markets; "major player in the [Android XR] ecosystem"; QR-payment use case; Q Tech–Samsung link (DBS). Misfit: Korean, against "U.S. and China, you pick"; no display, so "AR\|MR" is a stretch; mass-market price; 500k-unit plan vs ≈NOK 4m of POs. | Samsung's November on-sale announcement followed by a poLight design-win within 0–1 day; iFixit/TechInsights teardown (Dec 2026–Q1 2027); spec page wording "AF". |
| 3 | **Snap SPECS** | 0.13 | Fit: US, true AR, high-end ($2,195), "major player in the [AR] ecosystem", fall 2026 launch in 3 countries, no firm ship date (fits the silence). Misfit: "big company" / "leading consumer OEM" is a stretch; no Q Tech link; PO volume large for a ~$2.2k device. | Snap ship-date announcement plus poLight release; iFixit teardown. |
| 4 | **Alibaba (Qwen N1/N1 Pro or a later Alibaba/Ant-ecosystem product)** | 0.10 | Fit: China, big, Ant's TLens reference design via Q Tech, CEO acknowledged the Alibaba initiative, 50 MP sensor, payment use case. Misfit: no display; mass-market; firm on-sale date (09-22 → 10-13) yet no poLight design-win, against the precedent. | JD spec page / reviews after 10-13 mentioning 自动对焦; 52audio teardown (~Jan 2027); poLight release around 10-13. |
| 5 | **Xiaomi AI Glasses gen 2** | 0.07 | Fit: China, big, prior TLens customer (2020 watch), rumoured 50 MP, unannounced (fits the silence). Misfit: rumoured slip to 2027; no display. | Launch event; teardown. |
| 6 | **XREAL Aura** | 0.07 | Fit: China HQ, AR, Android XR ecosystem, puck, high-res camera, select-market launch before the holidays. Misfit: "big company" is doubtful. | Shipping announcement plus poLight release; teardown. |
| 7 | Other Chinese (Rokid gen 2 on 10-27, an Ant-reference-design brand, Lenovo, Meizu, RayNeo) | 0.09 | Fit: China, payment use case. Misfit: mostly not "big"; no AF wording. | Launch spec sheets; teardowns. |
| 8 | A second Meta product (not VR Glasses) | 0.04 | Fit: US, big. Misfit: Q2 report treats the Q Tech-backed OEM case as separate; Meta's 2026 glasses are unchanged 12 MP. | — |
| 9 | Other US (Amazon "Jayhawk", Google first-party) | 0.04 | Fit: US, big. Misfit: no 2026 product news. | — |

**Ruled out (dated reasons):**
- Huawei AI Glasses: launched 2026-04-20, before the 07-10 design-in; no focus wording.
- Ray-Ban Meta Gen 3: 2026-09-23, camera unchanged, poLight silent.
- Quark S1/G1: launched 2025-11-27, before the 2026 launch window; teardown 2026-03-11 shows no actuator.
- RayNeo V4 / iO / GT: V4 is 17 mm F2.2 with no AF wording; iO and GT have no camera; all shipped May–Sept 2026 with poLight silent.
- Even G2, Viture Pro 2, Halliday: no camera.
- Viture Helix: enterprise, ships Q1 2027.
- Apple: 2027.
- Kering/Gucci: 2027.
- Amazon driver glasses: enterprise.
- Varjo: enterprise, already poLight's MR-HMD customer.

## Return summary

No public source names Program B. Probabilities: Pico Space Pro 0.24, Samsung intelligent eyewear 0.22, Snap SPECS 0.13, Alibaba/Qwen 0.10, Xiaomi gen 2 0.07, XREAL Aura 0.07, others 0.17. Samsung is the only candidate with a leaked autofocus spec (GalaxyClub 2026-01-13), but it is Korean, display-less and mass-market. Pico best fits "MR", "high-end", "China", "this year, uncertain" and Q Tech's job ad. The strongest new TLens evidence is Ant Group's WAIC reference design with "邱钛Tlens … 实时自动对焦" (ZOL 2026-07-22); poLight's CEO tied it to Alibaba. poLight declared its MR-headset design-wins 0 and 1 days after Varjo's XR-4 announcements (2023-11-27, 2025-10-08/09), so a Program B design-in should turn into a design-win release within about a day of an in-shop launch date. Its absence so far weakens Qwen N1. Watch: Qwen N1 sale 10-13, poLight Q3 report and CMD 10-29/30, Samsung in November, Pico in Q4, and the teardowns that follow.
