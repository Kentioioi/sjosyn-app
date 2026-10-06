# Document retrieval — poLight post-Q2 Q&A, Q2 call transcript, Sept–Oct 2026 announcements, DBS Q Tech note, broker/press (as of 2026-10-06)

Research date: 2026-10-06. Method: direct HTTP retrieval (curl) of PDFs with `pdftotext`, Investorweb public Q&A API (`POST https://investorweb.co/functions/getPublicQAIndex {"limit":5000}`), MFN feed, NewsWeb (JS-rendered via Firecrawl), Cision, polight.com/mfn_news, ir.polight.com/qa (Firecrawl), DBS public research pages and PDF slots, WebSearch/Firecrawl search. Local copies of every retrieved file are in `scratchpad/research/entities2/dl_docs/` (DBS PDFs in `dl_docs/dbs/`); the two poLight transcripts were already in `scratchpad/research/pdf_in/` (`qa_post_q2_2026.pdf`, `transcript_q2_2026.pdf`) with text in `pdf_txt/`. Quotes below are verbatim from the extracted text (transcription typos preserved); timestamps are the speaker timestamps printed in poLight's transcripts; page numbers are the PDF page footers where printed.

## 0. Retrieval verdicts

| # | Document | Found? | Canonical URL | Date | Note |
|---|---|---|---|---|---|
| 1 | poLight post-Q2 2026 Q&A transcript ("Post Quarter Q/A – 19 Aug, 2026") | **Yes** (PDF, 11 pp.) | https://investorweb-ir-documents.s3.eu-north-1.amazonaws.com/Documents/polight-asa/financial-documents/2026/polight-post-quarter-q-a-transcript-e-9ec413.pdf | Session 2026-08-19; file Last-Modified 2026-08-20 17:40 GMT | Filename carries a hash suffix (`-e-9ec413`), not `polight-q2-2026-qa-*`; it is **not** in the Investorweb Q&A API index (that index only holds the Feb/Mar 2026 written Q&A) and not on MFN — which is why a text search for it fails. Finansavisen's PLT ticker page lists the recording as "Investor update 19.08.2026 • 48 min". |
| 2 | Q2 2026 results call transcript (2026-08-06) | **Yes** (PDF, 21 pp.) | https://investorweb-ir-documents.s3.eu-north-1.amazonaws.com/Documents/polight-asa/financial-documents/2026/polight-q2-2026-transcript-ff2523.pdf | Call 2026-08-06; file Last-Modified 2026-08-06 10:37 GMT | Secondary copy: Investing.com "Earnings call transcript: poLight Q2 2026 revenue momentum lifts shares 4.3%" (2026-08-06) https://www.investing.com/news/transcripts/earnings-call-transcript-polight-q2-2026-revenue-momentum-lifts-shares-43-93CH-4840290 |
| 3 | poLight regulatory announcements 2026-09-21 → 2026-10-06 | **One** item only | NewsWeb message 682779 (https://newsweb.oslobors.no/message/682779); MFN https://mfn.se/a/polight/polight-asa-receives-follow-on-purchase-order-for-twedge-r-wobulation-technology-technical-samples-for-ar-mr-use-from-a-leading-consumer-oem | 2026-09-21 10:22 CEST | NewsWeb search (fromDate 2026-09-20, toDate 2026-10-06, title "poLight") returned exactly one PLT row; MFN, polight.com/mfn_news, Cision and Finansavisen's "Siste om PLT" list show nothing later. |
| 4 | DBS Group Research note on Q Technology (1478 HK), 26 Aug 2026, analyst Jim Au | **Yes** (PDF, 12 pp.) | https://www.dbs.com/content/article/pdf/000000_HK/1478_HK.pdf (DBS "current company guide" slot — may be overwritten by the next note; local copy `dl_docs/dbs/dbs_1478_cg.pdf`) | PDF CreationDate 2026-08-26 03:44 UTC; HTTP Last-Modified 2026-08-31 | Public summary pages: https://www.dbs.com.hk/treasures/aics/templatedata/article/equity/data/en/DBSV/012014/1478_HK.xml and the .sg twin. The Meta + Q Tech + poLight + 1H27 sentence is on **page 4** of the PDF and is **not** in the public summary. |
| 5 | Broker/press notes Sept–Oct 2026 on poLight's Meta exposure / CMD / Q3 | **None found** from Pareto, Arctic, SB1, Redeye, DNB Carnegie, E24, DN, Xtrainvestor | — | Only press items: TDN Direkt 2026-09-21 (order wire) and TradingView/MarketScreener reprints of the 09-21 release. Analyst Group's last items are 2026-02-06 (initiation, NOK 9.0) and 2026-08-06 (Q2 comment). Forum threads (Finansavisen) exist but are rumor-tier. |

---

## 1. poLight post-Q2 2026 Q&A transcript — 2026-08-19

**Source:** https://investorweb-ir-documents.s3.eu-north-1.amazonaws.com/Documents/polight-asa/financial-documents/2026/polight-post-quarter-q-a-transcript-e-9ec413.pdf (HTTP 200 on 2026-10-06; `Last-Modified: Thu, 20 Aug 2026 17:40:42 GMT`; PDF title "poLight –Post Quarter Q/A – Transcript"; 11 pages; Google-Docs render). Speakers: Joakim Hines Bredahl (CFO), Øyvind Isaksen (CEO). CFO at 0s: "We have so far received over 50 questions." Hard stop at 45 min; unanswered questions were moved to ir.polight.com/qa (answered in writing 2026-09-10, see §1.6).

### 1.1 The three programs are different customers (15m45s–16m35s)
CFO (15m45s), reading the question: "Based on poLight's communication over the last year, my understanding is that three of the most significant current TLens consumer projects are: one, consumer AR/MR design-in project that has been talked about; two, the Q Tech qualification program; and three, the AR camera program. Is that understanding correct? Can you confirm if these are three different end customers?"
CEO (16m17s): "Those are three of the cases we have been mentioning in press releases. We have others you have not seen."
CEO (16m32s): **"Those three are different, but there are more."**

Related (15m0s–15m12s), on whether the same OEM could have two design-ins this year: "That is possible. If you talk about this particular design-in customer, we are already engaging with that customer on other cases. I do not believe those will develop as quick as becoming a design-in this year, but we are already engaging with them with new opportunities."

### 1.2 Capacity doubling and the Q Tech line (28m42s–31m40s)
CFO (28m42s): "In the 2025 Q3 presentation, you stated that installed capacity was around 200,000 per month. Test installed capacity was around 400,000 - 500,000 per month with a ramp-up plan in place for 1 million per month in the Philippines. Can you say anything about what those numbers are expected to be at the end of Q3 and end of Q4 in 2026?"
CEO (29m11s): **"What will happen in that timeframe is, of course, that we will have two lines, including the Q Tech, which will have a similar capacity. That's a doubling. Then we also have order a new final test machine, which will double the test capacity at Tongxing. That's what's going to happen. When it comes to the long lead items for increasing capacity further, it is the final test machine, which is critical. That's kind of allocated capacity or more standard equipment, which is today at Tongxing at 200,000 can easily be changed because those are standard machinery which easily can allocate more to us."** ("Tongxing" as transcribed = the Philippines assembly partner.)
CFO (30m15s): "...it is not only about increasing capacity so we can do more a week, but also that we can do different variants of a TLens simultaneously. So we can ship to different customers and then decrease the lead time per customer. ... The Q Tech line was reportedly built around the expected volumes of one OEM. If that OEM does not proceed, who will bear the cost of the idle capacity? Is it Q Tech or poLight?"
CEO (31m8s): **"Just to rephrase that or to comment on that question, because it was not really built for the capacity of that OEM. It was Q Tech's need to prove the ability to produce. The capacity they need for that particular customer, we would expect will be much higher."**

### 1.3 Wafers (26m51s–28m42s)
CFO (26m51s): "poLight has a large inventory of wafers that have been purchased. These are written down in value in the accounts every quarter ... Is it true that the quality of the wafers does not really deteriorate corresponding to the write-down, and that these wafers can be included in future production?"
CEO (27m26s): "There are two sides of that. There is a mechanics which you, Joakim, using when writing down that inventory. That is only mechanics and nothing to do with the quality of the inventory. Meaning that we are taking some whatever percent write-down due to just mechanics and doesn't relate to anything about having less quality. Then, of course, there are some elements. I would say smaller elements that we have seen through a manufacturing process, assembly process, test process. That some of this inventory is not good. ... But I would say those are smaller part of it. **The inventory which is there is regarded as good inventory, but to be prudent, we write down due to the age.**"
(Q2 2026 report, p. "Operations": "No new MEMS wafers were ordered, manufactured or delivered during the quarter, as inventory levels are deemed to be sufficient for current needs. Work to establish a lead-free MEMS supply remains ongoing. The timing of mass production will however depend on technical progress, market demand and current inventory of solgel wafers." — https://storage.mfn.se/26f4d787-badf-4c7d-be3a-7319960ce333/polight-q2-2026-report.pdf)

### 1.4 "Design-in" vs "design-win"; mass-production POs; pricing (1m26s–9m33s, 40m53s)
CFO (1m26s): "Regarding the design-in, you mentioned that there have been three POs for mass production. Could you please explain the term mass production and why it is used?"
CEO (1m51s): **"Those three POs are all material for which the customer plan to use in a commercial product. It is also at a price which is kind of connected to exactly that.** That margined aspect, we do not want to comment on the margin, but we have been saying before that we typically, at the moment in the consumer space, we are selling TLens for around $2 +."
CFO (2m37s): "You now classify one consumer AR/MR case as design-in with expected product release in 2026. Could you give more color on what remains technically and commercially before this reaches design win status? ..."
CEO (3m18s): "The last three POs ... the first one was bigger than the two following ones. ... in the early development stage, when they order more like, say, samples for the development phase, then they paid a different price, multiple, say 2x, 3x, 4 x the mass production price." (4m24s) "But those three POs are mass production prices. Those price level are triggered by that they are going to use those samples for commercial product."
CEO (4m52s): "...the customer would like to place as small POs and as often as possible, whereas we would like to have as high visibility and a big PO as possible."
CFO (5m20s): "The leading OEM that is registered for design-in was called a big guy in the February presentation when a PO came for this project. ... does this mean that the project we are designed into is actually with a major consumer player?"
CEO (5m42s): **"This case is with a, I would say, a big company and a major player in the ecosystem. That is all what we can say."**
CEO (6m10s): "...the important thing for poLight now is that this is the first design-in and hopefully design win in a consumer AR/MR space ... Whether it's A, B, C, or D is, of course, interesting, but it's not the important thing. The important thing is that we are putting our poLight flag in the AR/MR consumer space with a high-end solution, which will be a fundamental platform for future growth."
CFO (9m22s): "Do we know if this design-in, will it be launched at an event ...?" CEO (9m33s): "No comment."
CEO (14m45s), on whether it can be bought in Norway at launch: "That we do not know, but what we know that normally they do not launch worldwide day one."
CEO (40m53s): "...if you look at these three POs from the design-in, that is TLens, which will be in a product on the market."
CEO (12m43s) on labels: "we are using Tier 1, Tier 2, Tier 3, leading, major. We use these Tier 1 or leading, meaning that it is a very sizable company. It is a worldwide known company. ... **we have been confusing you by design.** Also the customer we are talking with and working with, they also really are nervous that the way we express and what we say and how we say it, is leading people to understand who it is, and that they do not want." (13m57s) "...the cases which you have been following us closely and the press releases are, I would say, companies which are big companies in the consumer space. I cannot be more specific."

### 1.5 "2027" — the only occurrence is in a shareholder's question
CFO (17m11s): "Looking at the 20 active consumer AR/MR PoC projects, how many of these OEM cases have progressed past the initial optical qualification stage to reach system-level validation, positioning them to transition into design-ins **late in 2026 or early in 2027**?"
CEO (17m34s): "I think that most of those PoCs are. There are some of these PoCs which in addition to the design-in we talked about last quarter. There are some other PoC which are getting more and more mature. Also, some of them you would not have seen in being referred to in a press release. I do not want to go into the details of how many, how big part of it, but are quite a few, which is also starting to be quite mature."
→ Management itself gives **no 2027 date** anywhere in the Q&A or the call transcript (grep of both texts: "2027" appears only in this question).

### 1.6 Other quotable items
- Who sets the TLens price (36m36s): "it is the OEM ... who is kind of the big boss. The big boss, he is negotiating all key components. It's we talking to the OEM and agreeing on the price, and the common module guy will be informed."
- TWedge and TLens customers overlap (24m8s): "many of the people we work and qualify over TLens is also qualifying the TWedge."
- TWedge sample stage (20m40s): "We are TS5, fifth-generation sample. We have the next revision on the drawing table."
- Patents (42m20s question): "With the earliest core patents from 2006 set to expire starting this September"; CEO (42m54s): "we have continuously tried to build around that patent to extend the protection".
- Analyst Group report (CFO 37m22s): "We have no input, and we do not pull the plug on any of their forecasts. This is their work entirely."
- CMD (CFO 48m17s): "Remember, look out for the Capital Market Day on the 30th of October."
- Written follow-ups (ir.polight.com/qa, all dated 10 September 2026, CEO): on design-in retractions — "If a design-in is removed from our reporting, it is because we believe, or it has been clearly decided, that the programme will not progress to a design-win / mass production stage. ... we will either announce it when the decision is made, as we did with the smartphone programme a few years ago, or report it as part of our quarterly reporting, as we did with the LSB programme."; on competition — "we expect competition from a range of technologies, including some of those you mention [next-gen VCMs, liquid lenses, metalenses]. However, TLens continues to be regarded as an attractive solution by many customers. Where compactness, low power consumption, and performance are key requirements, we believe poLight offers a highly competitive solution."; on confidentiality — "customers are very selective about what they share with us before a product is launched ... In some cases, we have greater visibility into the overall product and application than in others."; TWedge vs TLens — "We believe TLens has the greater volume potential over the next few years." No written answers are dated after 2026-09-10. (https://ir.polight.com/qa)

### 1.7 Investorweb public Q&A API (for completeness)
`getPublicQAIndex` returns 94 items across 8 Norwegian tickers; **24 for PLT**, all created 2026-02-25 (Q4-2025 webcast Q&A) and 2026-03-10 (written follow-ups); none for Aug 2026. Key PLT items:
- 2026-02-25, CEO, on the Q Tech line: "We are running a qualification of units being produced at Q Tech. ... Qualification means that we take the produced lenses which were produced as Q Tech, compare them to what's produced in the Philippines; get them through qualification, temperature, humidity, drop test ... So that's ongoing at the moment."
- 2026-02-25, CEO, on the Feb-2026 call-off: "some of them are there, but only the qualification units. Those units which is going into the program is likely coming from the Philippines, but part of them will go to a qualification program. After they qualify, they will go into camera modules."
- 2026-02-25, CEO, on the Nov-2025 "leading OEM" (now Program B): "when it comes to AR/MR, we are mainly focusing on U.S. and China. So you pick."
- 2026-02-25, CEO, asked whether the Aug/Oct/Nov-2025 POs all use Q Tech as module maker: "Yes, Q Tech is actually involved in -- and I have to think all these cases, but not alone."
- 2026-02-25, CEO, on the top-tier U.S. OEM qualification program: "we are now in PoC stage, some of them mature PoC stage. And then when they kind of lock the design, have component qualification ready, then they -- we can kind of potentially call it a design-in. ... I believe that this year, there may be meaningful milestones achieved in the consumer AR/MR space for poLight."
- 2026-03-10, CEO, Q Tech line status/capacity: "This is under qualification. ... Capacity there is limited by only having one test machine. ... **If you're going to have a kind of very high volume in that line through that U.S. OEM, they need to invest in more final test capacity, for sure.**"
- 2026-02-25, CEO, MLens ramp: "That will be 2027 plus" (the only management "2027" in the index; it concerns industrial MLens, not AR).

---

## 2. Q2 2026 results call transcript — 2026-08-06

**Source:** https://investorweb-ir-documents.s3.eu-north-1.amazonaws.com/Documents/polight-asa/financial-documents/2026/polight-q2-2026-transcript-ff2523.pdf (HTTP 200; `Last-Modified: Thu, 06 Aug 2026 10:37:49 GMT`; PDF title "poLight Q2 2026 Transcript"; 21 pages). Companion documents: Q2 2026 report https://storage.mfn.se/26f4d787-badf-4c7d-be3a-7319960ce333/polight-q2-2026-report.pdf; release "poLight ASA - revenue growth first half-year and significant commercial milestone reached" (MFN 2026-08-06).

### 2.1 Key events (CEO 1m22s, p.1)
"We have, post quarter, we had another PO for them, so that in sum there is actually three mass production POs, which led us to kind of regard this now as a design-in. ... You'll remember that we had a project together with an OEM, which was related to the Q Tech investment. That has also been progressing, and we also received a PO based on that project. Towards the end of the quarter, quite an exciting milestone was also achieved. You know that we have this program where we received some significant NREs to support developing a camera module based on TLens. Now finally we have shipped some cameras to the OEM, which is now currently being tested."

### 2.2 The design-in customer (Program B) and launch timing
CEO (9m56s, p.2): "We are extremely proud, even though we're not there as a design win, but we have the first design-in in a consumer AR/MR device. That has been an extremely tough fight, in all aspects. ... we believe that this design-in will go all the way into a design-win. There is, of course, always a risk, but now we have three mass production POs. We have shipped quite a few lenses already and are still shipping, and that is a very, very good sign, and **I would be very surprised if this go away.**"
CEO (11m7s): "We waited a long time for classified as a design-in, and I'm typically very careful in doing that, because I don't like to reverse it. I've done that once too much. ... **we believe actually a launch this year of the product.** We believe that. Of course, what will be the volumes will be a natural question, and we don't know."
CEO (39m47s, p.8): "I do not like to comment on where this customer is. ... **the release plan is this year. When this year is still for us a little bit uncertain, but I think it seems to be quite certain this year.** When it comes to next steps, we have already, as I mentioned, received three mass production POs based on mass production prices. ... Typically these customer, they would like to have as close to zero inventory."
CEO (42m2s): "we don't expect major OEMs to bring new technology immediately into super high volumes. That will be too risky. ... **It's probably high-end. It's probably high performance. That's why they use us.** We don't know, and the customer doesn't know."
Design-win definition (CEO 43m50s, p.9): "Typically, that will be when we know that this is being released to market. ... Typically, there will be some announcements upfront of release. That's when we define design win, meaning **when we are sure it will be in the shop.**"
CEO (1h9m, p.17): the Nov-24-2025 AR order is the same project as the Apr–Jul 2026 POs — "Seems to be the same, yeah."; device type — "It's an external device."

### 2.3 The top-tier U.S. OEM / Q Tech-backed qualification program (Program A)
CFO (44m24s, p.9): "The Q2 report clarifies that the new 2026 design-in is a separate case from the consumer OEM backing the Q Tech assembly line investment. Could you share some color on the maturity of this Q Tech-related OEM case and what milestones, validation steps remain before that project might also reach a formal design-in status?"
CEO (44m54s): **"That is another extremely thorough process, with an extremely important OEM in the U.S., as we have said before. We had another PO this quarter, as of Q2. We are in constant dialogue with both the camera module supplier and the OEM, which I also will meet in a couple of weeks. I feel that that program is doing quite well. It is a relatively slow-moving process. Again, very advanced glasses. High-end glasses. Big OEM. That means that they are extremely thorough. You wouldn't imagine. They are even acquiring themself very advanced optical test equipment to basically do what we have been doing for 20 years, characterizing.** What the management is telling me when I am complaining a little bit about speed and all the effort we need to support them and for no money, they go, Øyvind, this is how we work."
CEO (46m18s): "We cannot take a risk of not doing a good job. We have to be as thorough as this. **This will sooner or later, maybe not in the beginning, ramp in huge volumes.** We cannot do that before we have gone through this thorough assessment. It is slow, frustrating slow, but hopefully for good reasons."
CFO (48m33s, p.10): "This project is a qualification for a specific product. Can you say something about whether you have seen any demonstration glasses in this project?" CEO (48m55s): "Yes."
Q2 report wording (p. "Market review"): "During the quarter, three strategically important purchase orders were received. **Two of them related to a product which may be released in 2026, and one related to the consumer OEM backing Q Tech investment in poLight.** Post-quarter (10 July) poLight announced a third purchase order for first case mentioned above. This is now classified as a design-in, and included in this report."

### 2.4 Q Tech line and capacity
CFO (48m56s): "Can you say something about the lenses that have been produced at Q Tech?" CEO (49m1s): **"Yeah. Those have been tested and qualified, I would say. It seems to be good. We are tuning some of the processes still, but what has been delivered as good lenses out of Q Tech line are good and qualified. There are some tuning to be done in some of the processes, it seems good."**
CFO (1h0m): "When do we expect to ramp TLens production?" CEO: **"it depends, at least partly, on the OEM backing that investment, when they need what kind of volume. That is a question mark we or Q Tech don't know. To be seen."**
CEO (1h11m, p.19), on the NOK 1.3m test-equipment investment: "That particular investment is related to doubling capacity in the Philippine factory. Yes, we assume we have to do more, and also at the other line. ... That 1.3 is only a fraction of the total cost of that kind of test equipment."
Q2 report, related-party note: "Q Tech is establishing a dedicated TLens® assembly and test line pursuant to the Strategic Partnership Agreement. poLight has allocated test equipment which has been shipped to Q Tech's premises. ... significant efforts have been made by poLight to support Q Tech in establishing the assembly line and getting it qualified for mass production. In Q2 2026, poLight invoiced, through its distributor, USD 178,662 for NRE-related support. In Q1 2026, USD 313,141 for NRE-related support in 2025 were invoiced." Q Tech held 29.90% at 30 June 2026.

### 2.5 Wafers (CFO 34m2s, p.7)
"If we take the wafer out of the inventory and we assemble it into TLens, that increases the value of the inventory slightly because we add the work done." (Plus the Q2 report sentence quoted in §1.3: no new MEMS wafers ordered in Q2 2026.)

### 2.6 Program C (NOK 5m AR camera program) and outlook
CEO (48m4s, p.10): "the honest answer is that we don't know. I'm going to meet key management in a few weeks, discussing results they have achieved so far. My understanding from last meeting I had with this company is that there may be some kind of visibility towards the end of the year. Very important program, by the way."
CEO (47m1s): "we have activity with many of the big names and less big names and announced POs."
AF adoption (CEO 1h5m, p.15): "two to three years is a number. ... in three years from now, I think that we will see definitely much more plans related to also having AF. ... There are also other tunable optics which could go in. ... It's the liquid crystal guys, it's the liquid guys".
CMD (CEO 1h12m, p.19): "we have planned for a capital market day. ... 30th of October, the day after Q3. We will have it in Pareto".

---

## 3. poLight regulatory announcements 2026-09-21 → 2026-10-06

Checks performed on 2026-10-06: NewsWeb search page (JS-rendered through Firecrawl) for title "poLight", 2026-09-20→2026-10-06 → exactly **one** row: `21.09.2026 04:22 | XOSL | PLT | poLight ASA Receives Follow-on Purchase Order for TWedge® Wobulation Technology Technical Samples for AR|MR Use from… | INSIDE INFORMATION` (https://newsweb.oslobors.no/message/682779; the 04:22 is the renderer's US-East clock = 10:22 CEST). The NewsWeb REST API (api3.oslobors.no) is blocked (502 via proxy) and the HTML page still prints "The system is not available at the moment" beside the result. MFN (https://mfn.se/a/polight), https://www.polight.com/mfn_news/, Cision and Finansavisen's "Siste om PLT" (checked 5 Oct 23:12) list no item after 2026-09-21. Next calendar dates printed on the MFN page: 2026-10-29 (Q3 2026) and 2027-02-24 (Q4 2026).

**2026-09-21 10:22 CEST — "poLight ASA Receives Follow-on Purchase Order for TWedge® Wobulation Technology Technical Samples for AR|MR Use from a Leading Consumer OEM"** (MFN; Securities Trading Act §5-12 and MAR). Full operative text:
"Tønsberg, Norway 21 September 2026 - poLight ASA (OSE: PLT) today announced that the company has received a follow-on purchase order worth approximately NOK 1.2 million to supply its TWedge® wobulation technology technical samples to a leading consumer OEM for an AR|MR display application.
“We are pleased to announce another follow-on purchase order for our TWedge® wobulation technology. We still see a strong interest in this new concept, and most of the OEMs we have engaged with continue exploring using TWedge® for future AR|MR display solutions. Notably, most customers evaluating TWedge® are also engaged with us on TLens®” said Dr Øyvind Isaksen, CEO of poLight ASA.
The delivery of TWedge® technical samples is expected to be completed in September/October 2026."
Press pick-up: TDN Direkt 2026-09-21 "POLIGHT: OPPFØLGINGSORDRE PÅ TWEDGE WOBULATION, VERDI 1,2M" (https://www.finansavisen.no/tdn/2026/09/21/06597680/polight-oppfolgingsordre-pa-twedge-wobulation-verdi-1-2m); TradingView and MarketScreener reprints. Note: product naming changed from "TWedge® Wobulator" (all 2024–Mar 2026 releases) to "TWedge® Wobulation Technology"; customer label "leading consumer OEM" matches the 2025-11-10 TWedge PO (NOK 880,000) and the Program B TLens label, but the CEO says labels are "confusing you by design" (§1.4), so no identity link can be drawn.

### Timeline of poLight announcements since the Q2 report (all MFN/NewsWeb, company/IR, confirmed)

| date | precision | category | event | source URL | source type | confidence |
|---|---|---|---|---|---|---|
| 2026-08-06 | day | earnings | Q2 2026 report/call: first consumer AR\|MR design-in (three mass-production POs 04-07/05-20/07-10, ~NOK 4.0m), "release plan is this year"; Program A PO 06-18 (NOK 0.7m) "still qualification"; Program C cameras shipped for validation end-Q2; no new MEMS wafers ordered. | https://mfn.se/a/polight/polight-asa-revenue-growth-first-half-year-and-significant-commercial-milestone-reached ; transcript URL §2 | company/IR | confirmed |
| 2026-08-06 | day | announcement | Invitation to Capital Markets Day, Fri 30 Oct 2026, 09:00–15:00 CET at Pareto Securities AS, Dronning Mauds gate 3, Oslo — "the day following poLight's Q3 2026 quarterly presentation ... deep-dives ... as well as an external review of key strategic markets". | https://mfn.se/a/polight/polight-asa-invitation-to-capital-markets-day-30-october-2026 | company/IR | confirmed |
| 2026-08-13 | day | hire | Q Tech-nominated director Yung Pang (Louis) So resigns "due to the internal work arrangement adjustments of Q Tech"; Q Tech appoints Fan Fuqiang (Q Tech Executive Director since 2020, finance/securities/risk) under §5 of the Articles, effective immediately. | https://mfn.se/a/polight/polight-asa-changes-to-the-board-of-directors | company/IR | confirmed |
| 2026-08-14 | day | financing | Exercise of share options and joint sale of option shares (CEO/COO/CTO). | https://mfn.se/a/polight/polight-asa-exercise-of-share-options-and-joint-sale-of-share-option-sales | regulator/exchange | confirmed |
| 2026-08-19 | day | earnings (Q&A) | Post-quarter Q&A webcast (48 min, >50 questions); transcript PDF posted 2026-08-20. | §1 URL | company/IR | confirmed |
| 2026-08-25 | day | financing | Share capital increase registered (option exercise). | https://mfn.se/a/polight/polight-asa-share-capital-increase-registered-4 | regulator/exchange | confirmed |
| 2026-08-26 | day | financing | Primary-insider notification: 1,109,586 shares from Marianne Sandal (COO), Pierre Craen (CTO) and Øyvind Isaksen (CEO), transferred to DNB Carnegie for joint sale, "have been sold at an average price of NOK 12.1318. The sale ended today, 26 August 2026." | https://mfn.se/a/polight/mandatory-notification-of-trades-primary-insider | regulator/exchange | confirmed |
| 2026-09-10 | day | other | CEO written answers on ir.polight.com/qa (design-in retraction policy, competition, confidentiality, TWedge vs TLens volume). | https://ir.polight.com/qa | company/IR | confirmed |
| **2026-09-21** | day | **order** | TWedge® technical-samples follow-on PO ~NOK 1.2m, "leading consumer OEM", "AR\|MR display application"; delivery Sept/Oct 2026; "most customers evaluating TWedge® are also engaged with us on TLens®". Only regulatory filing between 2026-09-21 and 2026-10-06. | https://newsweb.oslobors.no/message/682779 ; MFN URL above | regulator/exchange | confirmed |
| 2026-09-22 → 2026-10-06 | range | — | **No poLight filings** (NewsWeb, MFN, Cision, polight.com, Finansavisen all checked 2026-10-06). | — | — | confirmed (absence) |

---

## 4. DBS Group Research — Q Technology (1478 HK), 26 Aug 2026 (Jim Au)

**Found and downloaded.** URL: https://www.dbs.com/content/article/pdf/000000_HK/1478_HK.pdf (HTTP 200, `content-type: application/pdf`, `Last-Modified: Mon, 31 Aug 2026`; PDF metadata: Author "DBSV", CreationDate 2026-08-26 03:44:29 UTC, 12 pages). Caveat: this path is DBS's rolling "current company guide" slot for 1478 HK (the .hk/.sg copies of the same path are stale HTML), so it will be replaced when DBS next publishes on Q Tech; a local copy is kept at `scratchpad/research/entities2/dl_docs/dbs/dbs_1478_cg.pdf` (+ `.txt`). The dbs.com.sg sequential pattern `.../1478_HK_Equity/2026/08/1478_HK_Equity_NN_26082026.pdf` returns 200 for every NN but serves HTML (catch-all), so it is not a usable locator.

Page 1 header (verbatim): "HONG KONG EQUITY RESEARCH / Q Technology (Group) Co Ltd / DBS Group Research / 26 Aug 2026 / **Handset share gains intact; auto and AI vision drive the next leg** / BUY / Last Traded Price: HKD5.99 / Price Target 12-mth: HKD12.60 / Analyst Jim Hin Kwong Au | jimau@dbs.com". Bullets: "1H26 revenue rose 12% y/y, in line, but net profit fell 11% and missed consensus by 15% ..."; "Cut FY26/27F earnings by 13%/14% ..."; "Maintain BUY; lower TP to HKD12.6 on 13x FY27F PE". (DBS's public web summary lists the same 26 Aug 2026 item under a slightly different title, "Q Technology - Handset mix delays recovery; auto and AI optics build the next leg".)

**Page 4, section "Smart glasses provide a near-term AI-device opportunity." — verbatim:**
> "Monochrome AR optical engines have entered volume production, colour optical engines are in small-batch delivery, and products are already being shipped to Meta and Samsung. **A Meta project combining Q Tech's module capabilities with poLight's low-power tunable-lens technology is expected to enter mass production in 1H27.** This should expand Q Tech's content exposure from camera assembly towards lenses, actuators, optical engines and system-level integration."

Page 4, "Valuation" (verbatim): "We maintain BUY and lower our TP to HKD12.6 from HKD15.0. We roll forward our valuation benchmark to FY27F EPS and apply 13x FY27F P/E (prev. 17x FY26F P/E) ... We expect improving visibility in automotive and smart glasses to offset weaker near-term handset assumptions. Key catalysts include faster ramps in 8MP automotive cameras and LiDAR, **volume production of smart-glasses projects**, and progress in consolidating upstream actuator assets."
Page 1 (verbatim, public summary too): "Smart glasses provide a nearer-term AI-device opportunity through camera modules, low-power tunable lenses and optical engines, while integrated RGB-D and binocular-camera-plus-IMU solutions give Q Tech higher content potential in humanoid robots."
Disclaimer (verbatim, p.10 ff.): "The research set out in this report is based on information obtained from sources believed to be reliable, but we ... have not conducted due diligence on any of the companies, verified any information or sources or taken into account any other factors which we may consider to be relevant or appropriate in preparing the research."

Assessment for the timeline: this is the **only** document found that names Meta + Q Tech + poLight together with a date; DBS cites no source for the sentence, does not name the product, and poLight itself has never said "2027" (§1.5). Treat as analyst_report / circumstantial. The public DBS summary page (https://www.dbs.com.hk/treasures/aics/templatedata/article/equity/data/en/DBSV/012014/1478_HK.xml) contains only the generic "low-power tunable lenses" phrase, which explains why earlier web searches could not confirm the sentence.

Other DBS documents checked (no poLight link): "Meta Platforms" US note (https://www.dbs.com/content/article/pdf/US_clover/Meta_Platforms.pdf, created 2026-05-08) — mentions "smart glasses" once, no Q Tech/poLight; "Lens Technology (6613 HK) Initiating coverage" 2026-06-16 (insightsdirect PDF, 27 pp.) — zero hits for poLight/Q Tech/Meta/tunable. Chinese secondary coverage found: VRAR星球 2025-06-19 "丘钛科技通过控股poLight，有望进入Meta供应链" (cites "挪威DNB Markets的报告显示，poLight技术路线符合AR设备轻量化趋势，Meta、苹果下一代产品或将采用类TLens方案" — an un-dated, un-linked DNB Markets attribution; no DBS); Sohu 2025-06-05 — no DBS/Meta. No Chinese aggregator (慧博/发现报告/东方财富/萝卜投研/富途/智通/格隆汇) summary of the 26 Aug 2026 DBS note surfaced in search.

---

## 5. Broker and press notes, Sept–Oct 2026 (Meta exposure, CMD expectations, Q3)

Searched: Pareto, Arctic, SB1 Markets, Redeye, Analyst Group, DNB Carnegie, Finansavisen, E24, DN, Xtrainvestor, TDN, Investing.com, TradingView, MarketScreener; Firecrawl news (last month) and WebSearch extended.

| date | item | finding | source | type |
|---|---|---|---|---|
| 2026-08-06 | Analyst Group, "Comment on poLight's Q2-26 Report" (David Rimbe) | No Meta, no 2027, no CMD, no capacity; notes "approximately NOK 1.8m related to poLight's continued support for the establishment of Q Tech's TLens® assembly and test line" and that "a design-win is classified once the product is confirmed for market release, typically around a product announcement". Latest justified value remains NOK 9.0 (2026-02-06 initiation). | https://analystgroup.se/kommentarer/comment-on-polights-q2-26-report/ ; https://analystgroup.se/analyser/polight/ | analyst (commissioned) |
| 2026-08-06 | Investing.com transcript/slides articles | Reproduce the call; no Meta/2027. | https://www.investing.com/news/transcripts/earnings-call-transcript-polight-q2-2026-revenue-momentum-lifts-shares-43-93CH-4840290 | press |
| 2026-08-27 | TDN Direkt "POLIGHT: DIREKTØRER SOLGT 1,1M AKSJER ETTER OPSJONSINNLØSNING" | Insider sale at NOK 12.1318. | https://www.finansavisen.no/tdn/2026/08/27/06591792/polight-direktorer-solgt-1-1m-aksjer-etter-opsjonsinnlosning | press |
| 2026-09-21 | TDN Direkt / TradingView / MarketScreener | Reprints of the NOK 1.2m TWedge PO. | see §3 | press |
| 2026-09-23 → 10-06 | Meta Connect coverage (Bloomberg, UploadVR, Road to VR, TechCrunch, Fortune, MediaPost 09-28) | **No** article links poLight/TLens/Q Tech to Meta VR Glasses. | e.g. https://www.uploadvr.com/meta-vr-glasses-officially-announced-connect-2026/ | press |
| Sept–Oct 2026 | Pareto / Arctic / SB1 / Redeye / DNB Carnegie | No public note on poLight found (Pareto has no published poLight coverage page; its only poLight item is a 2022-03-10 Pareto TV interview). Share price reference seen in search snippets: NOK 14.82 on 2026-09-28 (investing.com). | — | — |
| 2026-01-15 → 01-28 | Finansavisen forum thread "Den som venter på noe godt…" | Retail speculation only (names Meta/Apple; one poster claims "DnB sier volumordre mellom 8-16 mnd" — unverified). | https://www.finansavisen.no/forum/thread/173344/den-som-venter-pa-noe-godt-venter-ofte-ikke-forgjeves | forum/rumor |

---

## 6. Future / expected events (from these documents)

| expected window | event | source | confidence |
|---|---|---|---|
| Sept/Oct 2026 | Delivery of the NOK 1.2m TWedge technical samples to the "leading consumer OEM". | 2026-09-21 release | confirmed (company plan) |
| 2026 ("release plan is this year") | Launch of the Program B consumer AR\|MR product → design-win trigger ("when we are sure it will be in the shop"). | Q2 call 39m47s, 43m50s; Q2 report outlook | strong (company expectation) |
| "towards the end of the year" 2026 | Visibility on Program C (NOK 5m AR camera platform) and Program A milestones. | Q2 call 48m4s | strong |
| by end-2026 | Two assembly lines of similar capacity (Philippines + Q Tech) = "a doubling"; new final-test machine doubles test capacity. | Q&A 29m11s | strong |
| 2026-10-29 | Q3 2026 report/presentation. | MFN calendar; CMD invitation | confirmed |
| 2026-10-30 | Capital Markets Day at Pareto Securities, Oslo, incl. "an external review of key strategic markets". | MFN 2026-08-06 | confirmed |
| 1H27 | DBS: Meta project with Q Tech modules + poLight tunable lens "expected to enter mass production". | DBS 26 Aug 2026, p.4 | circumstantial (analyst, unsourced; not stated by poLight) |
| 2027-02-24 | Q4 2026 report (MFN calendar). | mfn.se/a/polight | confirmed (calendar) |

## 7. Cadence observations
- Program A (Q Tech-backed U.S. OEM) POs: 2025-08-06 → 2026-02-11 (189 d) → 2026-06-18 (127 d). No further Program A PO as of 2026-10-06 (110 d since the last). The CEO said on 2026-08-06 he would "meet key management in a few weeks" for both Program A and C, i.e. late Aug/Sept 2026; nothing has been filed since, so any update would land with Q3 (10-29) or CMD (10-30).
- TWedge POs labelled "leading consumer OEM": 2025-11-10 (NOK 880k) → 2026-09-21 (NOK 1.2m) = 315 d; other TWedge POs ("top tier consumer OEM" 2025-08-12/10-24/11-05; "leading AR platform company" 2026-03-07). TWedge is still TS5 samples with the next revision "on the drawing table" (Q&A 20m40s).
- Transcript publication lag: call transcript posted the same day (06 Aug, 12:37 CEST); Q&A transcript posted the next day (20 Aug); written Q&A follow-ups 22 days after the Q&A (10 Sept).
- Filing silence: 15 days (09-22 → 10-06) is the longest gap since the Q2 report; the previous gap (08-27 → 09-21) was 25 days.

## 8. Cross-links
| link | date | source |
|---|---|---|
| DBS → Meta + Q Tech + poLight "1H27" mass production (only such document). | 2026-08-26 | §4 PDF p.4 |
| poLight → Q Tech-backed OEM = "extremely important OEM in the U.S.", "very advanced glasses. High-end glasses. Big OEM", "ramp in huge volumes"; demonstration glasses seen ("Yes"). | 2026-08-06 | §2.3 |
| poLight → the three press-released consumer programs are "different" end customers "but there are more". | 2026-08-19 | §1.1 |
| poLight → Q Tech involved "in all these cases, but not alone"; "we support all camera module guys being asked by the OEMs". | 2026-02-25 | §1.7 |
| poLight → Q Tech board seat passes from Louis So to Fan Fuqiang. | 2026-08-13 | §3 |
| poLight → insiders' option shares sold through DNB Carnegie (broker relationship; no research note found). | 2026-08-26 | §3 |
| poLight → CMD hosted at Pareto Securities (no Pareto research found). | 2026-08-06 | §3 |

## 9. Gaps
- No transcript or recording index exists for a Q4-2025 (Feb 2026) post-quarter Q&A PDF; only the Investorweb API items (§1.7) cover it.
- Investorweb's S3 bucket does not allow listing (403), so any further hashed-filename documents (e.g., CMD materials) cannot be enumerated until linked from ir.polight.com.
- DBS's note is retrievable only through a rolling slot; the dated insightsdirect attachment URL (pattern `.../article_attachment/20260826/HH-MM-SS_Q Technology_26-Aug-2026_HK_CG.pdf`) could not be guessed.
- No sell-side note (Pareto/Arctic/SB1/DNB Carnegie/Redeye) on poLight in Sept–Oct 2026 is publicly visible; Norwegian broker research is paywalled, so absence online ≠ absence.
- Finansavisen forum content beyond the first page is behind SSO; the 21jingji 2026-09-24 Meta Connect pre-market piece returned 503.

## Return summary
Found and quoted verbatim: (1) poLight's post-Q2 Q&A transcript (19 Aug 2026; Investorweb PDF `polight-post-quarter-q-a-transcript-e-9ec413.pdf`, posted 20 Aug) — "Those three are different, but there are more"; "two lines, including the Q Tech ... That's a doubling"; Q Tech line "was not really built for the capacity of that OEM ... much higher"; wafers "regarded as good inventory"; three design-in POs "all for mass production" at "$2 +"; "2027" appears only in a shareholder's question. (2) Q2 call transcript (6 Aug 2026) — U.S. OEM "very advanced glasses. High-end glasses. Big OEM ... ramp in huge volumes"; Q Tech lenses "tested and qualified"; ramp "depends ... on the OEM backing that investment"; design-in launch "this year". (3) Only one filing 21 Sep–6 Oct: NOK 1.2m TWedge PO (21 Sep). (4) DBS 26 Aug 2026 PDF (p.4): "A Meta project combining Q Tech's module capabilities with poLight's low-power tunable-lens technology is expected to enter mass production in 1H27" — unsourced, disclaimed. (5) No Sept–Oct broker/press note on Meta exposure found. File: entities2/documents_retrieval.md.
