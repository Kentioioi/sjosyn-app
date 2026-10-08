"""Generate the markdown report from timeline_data.json (+ chat digest + verification log).
Usage: python3 -I report.py timeline_data.json chat_digest.json verification.json out.md
"""
import json, sys, collections, datetime
data = json.load(open(sys.argv[1], encoding='utf-8'))
digest = json.load(open(sys.argv[2], encoding='utf-8')) if len(sys.argv) > 2 and sys.argv[2] != '-' else {}
verif = json.load(open(sys.argv[3], encoding='utf-8')) if len(sys.argv) > 3 and sys.argv[3] != '-' else {}
out = sys.argv[4]
lanes = {l['id']: l for l in data['lanes']}
byid = {e['id']: e for e in data['events']}; byid.update({w['id']: w for w in data['windows']})
today = data['meta']['today']
L = []
L.append(f"# poLight and its competitors on the road to top-tier AR/VR/XR glasses — timeline map and commentary\n")
L.append(f"*As of {today}. Interactive map: `timeline-map.html` (open locally or via the published artifact). Data: `timeline_data.json`. Every dated row carries its source URL; confidence is confirmed (primary source), strong (several reputable outlets), circumstantial (inference) or rumor (forum / unnamed sources).*\n")
L.append("## 1. Headline findings\n")
for f in data.get('headline_findings', []): L.append(f"- {f}")
L.append("\n## 2. How to read the map\n")
L.append("- **Lanes**: the upper group is the glasses and headset producers, the lower group is poLight and every competing autofocus / tunable-lens supplier plus two evidence lanes (Meta patents & people; analysts, brokers & press).\n- **Markers** are dated signals, coloured by category (product, commercial, IP & people, analyst/press). Hollow markers are circumstantial or rumour. A thin line under a marker shows the date's imprecision (month, quarter, half, year).\n- **Bars** are launch windows or dated ranges; everything right of the today line is expected, not observed.\n- **Washes** on supplier lanes show where supplier milestones are expected for a given future launch, working backwards with optics-industry lead times (see §4).\n- **Match lines** connect a supplier signal to the launch it plausibly feeds; click a marker to read why, and what would contradict it.\n- **Cadence strips** in the commentary show the days between a lane's updates.\n")
L.append("## 3. Future launch windows (producers)\n")
L.append("| Window | Producer | Title | Confidence | Source |\n|---|---|---|---|---|")
for w in sorted(data['windows'], key=lambda w: w['start']):
    if w['end'] >= today: L.append(f"| {w['start']} → {w['end']} | {lanes.get(w['lane'],{}).get('name',w['lane'])} | {w['title']} | {w['conf']} | {w['url'] or ''} |")
L.append("\n## 4. Where supplier timelines meet future launches\n")
L.append("### 4.1 Expected supplier milestone windows (lead-time logic)\n")
for lt in data.get('leadtimes', []):
    w = byid.get(lt['window'], {})
    L.append(f"**{w.get('title', lt['window'])}** ({w.get('start','?')} → {w.get('end','?')}), drawn on lanes: {', '.join(lanes.get(x,{}).get('name',x) for x in lt['lanes'])}")
    for ph in lt['phases']: L.append(f"- {ph['label']}: {ph['start']} → {ph['end']}")
    L.append(f"- Rationale: {lt.get('rationale','')}\n")
L.append("### 4.2 Matches\n")
for m in data.get('matches', []):
    a, b = byid.get(m['from'], {}), byid.get(m['to'], {})
    L.append(f"**{m['title']}** — strength: {m['strength']}")
    L.append(f"- Supplier signal: {a.get('date', a.get('start','?'))} · {lanes.get(a.get('lane'),{}).get('name','')} · {a.get('title','')}" + (f" ({a.get('url')})" if a.get('url') else ''))
    L.append(f"- Producer side: {b.get('date', b.get('start','?'))}{(' → ' + b['end']) if b.get('end') else ''} · {lanes.get(b.get('lane'),{}).get('name','')} · {b.get('title','')}" + (f" ({b.get('url')})" if b.get('url') else ''))
    L.append(f"- {m['comment']}\n")
L.append("## 5. Commentary per lane — what each timeline indicates\n")
for l in data['lanes']:
    evs = sorted([e for e in data['events'] if e['lane'] == l['id']], key=lambda e: e['date'])
    L.append(f"### {l['name']} ({l['group']}; {len(evs)} dated signals)\n")
    if l.get('blurb'): L.append(l['blurb'] + "\n")
    # cadence numbers
    ds = []
    for e in evs:
        if e['cat'] == 'press': continue
        try:
            d = e['date']; d = d if len(d) == 10 else (d + '-15' if len(d) == 7 else None)
            if d: ds.append(datetime.date.fromisoformat(d))
        except Exception: pass
    if len(ds) >= 3:
        gaps = [(ds[i] - ds[i-1]).days for i in range(1, len(ds))]
        rec = [g for i, g in enumerate(gaps) if ds[i+1] >= datetime.date(2025, 1, 1)]
        L.append(f"Cadence: {len(ds)} day/month-dated non-press signals; median gap {sorted(gaps)[len(gaps)//2]} days overall" + (f", {sorted(rec)[len(rec)//2]} days since 2025" if rec else '') + f"; longest silence {max(gaps)} days.\n")
    c = next((c for c in data.get('commentary', []) if c['lane'] == l['id']), None)
    if c:
        for sg in c['segments']: L.append(f"**{sg['start']} → {sg['end']}: {sg['title']}**  \n{sg['text']}\n")
    else: L.append("_No commentary generated for this lane._\n")
L.append("## 6. What the earlier ChatGPT research thread established\n")
if digest:
    L.append(digest.get('summary', '') + "\n")
    L.append("Probability drift inside that thread (assistant's own estimates, in message order):\n")
    L.append("| msg | estimate | context |\n|---|---|---|")
    for p in digest.get('probability_estimates', []): L.append(f"| {p['message_index']} | {p['value']} | {p['context'][:140]} |")
    L.append("\nOpen questions the thread left (carried into this research):\n")
    for q in digest.get('open_questions', []): L.append(f"- {q}")
    L.append("")
L.append("## 7. Verification of load-bearing dates\n")
if verif:
    L.append(f"{verif.get('summary','')}\n")
    L.append("| Event | Date | Verdict | Note |\n|---|---|---|---|")
    for v in verif.get('rows', []): L.append(f"| {v.get('title','')} | {v.get('date','')} | {v.get('verdict','')} | {v.get('note','')} |")
    L.append("")
else: L.append("_Verification results not attached._\n")
L.append("## 8. Full event table (chronological)\n")
L.append("| Date | Lane | Category | Event | Confidence | Source |\n|---|---|---|---|---|---|")
for e in sorted(data['events'], key=lambda e: e['date']):
    L.append(f"| {e['date']} | {lanes.get(e['lane'],{}).get('name',e['lane'])} | {e['cat']}/{e['type']} | {e['title']}{(' — ' + e['detail']) if e.get('detail') else ''} | {e['conf']} | {e.get('url','')} |")
L.append("\n## 9. Coverage, gaps and method\n")
cnt = collections.Counter(e['src'] for e in data['events'])
L.append("Signals by source type: " + ", ".join(f"{k} {v}" for k, v in cnt.most_common()) + ".\n")
L.append("Method: round 1 — nine research agents compiled dated timelines per producer and supplier from company newsrooms, Oslo Børs / HKEX / SEC filings, Google Patents, developer documentation and reputable press, with forum and unnamed-source items marked as rumour; a digest of the earlier ChatGPT thread supplied the starting hypotheses; the rows were converted to a common schema, deduplicated per lane, cross-matched against launch windows, criticised for completeness, and the load-bearing dates were re-checked against their cited sources. Round 2 — five agents on Meta's autofocus program, the Chinese supply chain and analyst trail, module makers, poLight's historical lead times and the primary documents; 128 load-bearing rows checked by two independent fact-checkers each. Round 3 — a full-text patent sweep for TLens / poLight (2024-2026); all 69 rows and windows checked on the registers by two independent checkers each, false positives dropped, and the synthesis audited by eighteen skeptics (evidence, logic, dates-and-arithmetic) before an editor of record rewrote findings, matches and the estimate.\n")
if data.get('critique'):
    L.append("Completeness critic's list of remaining gaps:\n")
    L.append("```\n" + data['critique'].strip() + "\n```\n")
L.append(f"\n*{data['meta'].get('foot','')}*\n")
open(out, 'w', encoding='utf-8').write("\n".join(L))
print('report lines', len(L))
