#!/bin/bash
# Round 4: assemble on top of round 3, add estimate history, report sections, refresh repo copies, commit and push.
set -e
S="$(cd "$(dirname "$0")/.." && pwd)"
J=$1; MSG=$2
cd $S
python3 -I tools/assemble_r2.py build/out_r3/timeline_data.json research/json/r4/stage1.json "$J" research/json/r4/corrections_r4.json build/timeline-map.html build/out_r4
python3 -I - <<'PY'
import json, re
p='build/out_r4/timeline_data.json'; d=json.load(open(p,encoding='utf-8'))
d['meta']['today']='2026-10-08'
d['estimate_history']=[dict(round='round 1',p_tlens_in_meta_vr_glasses=0.55),dict(round='round 2',p_tlens_in_meta_vr_glasses=0.62,p_meta_is_qtech_backed_oem=0.80),dict(round='round 3',p_tlens_in_meta_vr_glasses=0.58,p_meta_is_qtech_backed_oem=0.78)]
foot=d['meta'].get('foot') or ''
if 'Round 4' not in foot: d['meta']['foot']=foot+' Round 4: primary copies of key documents, the public LinkedIn and job-post trail, regulatory filings, trade data, Q Tech HKEX and poLight Newsweb filings, and a Program B candidate study; load-bearing rows checked twice, synthesis audited by a skeptic panel.'
json.dump(d,open(p,'w',encoding='utf-8'),ensure_ascii=False,indent=1)
h=open('build/out_r4/timeline-map.html',encoding='utf-8').read()
m=re.search(r'<script type="application/json" id="tl-data">.*?</script>',h,flags=re.S)
embed=json.dumps({k:v for k,v in d.items() if k not in ('critique','changes_made')},ensure_ascii=False).replace('</','<\\/')
open('build/out_r4/timeline-map.html','w',encoding='utf-8').write(h[:m.start()]+'<script type="application/json" id="tl-data">\n'+embed+'\n</script>'+h[m.end():])
e=d.get('estimate') or {}
print('final events',len(d['events']),'windows',len(d['windows']),'matches',len(d['matches']),'findings',len(d['headline_findings']),'estimate',e.get('p_tlens_in_meta_vr_glasses'),e.get('p_meta_is_qtech_backed_oem'),'cmdq',len(d.get('cmd_questions',[])),'watch',len(d.get('watchlist',[])),'changes',len(d.get('changes_made',[])))
PY
python3 -I - <<'PY'
import json
a=json.load(open('research/json/verification_all.json',encoding='utf-8')); b=json.load(open('research/json/r4/verification_r4.json',encoding='utf-8'))
if 'Round 4' not in a['summary']: a=dict(summary=a['summary']+' '+b['summary'], rows=a['rows']+b['rows'])
json.dump(a,open('research/json/verification_all_r4.json','w',encoding='utf-8'),ensure_ascii=False,indent=1); print('verification rows', len(a['rows']))
PY
python3 -I tools/report.py build/out_r4/timeline_data.json research/chat_digest.json research/json/verification_all_r4.json build/out_r4/REPORT.md | tail -1
python3 -I - <<'PY'
import json
d=json.load(open('build/out_r4/timeline_data.json',encoding='utf-8')); e=d.get('estimate') or {}
s=open('build/out_r4/REPORT.md',encoding='utf-8').read()
hist=' → '.join(f"{h['round']}: {h.get('p_tlens_in_meta_vr_glasses')}"+(f" / {h['p_meta_is_qtech_backed_oem']}" if h.get('p_meta_is_qtech_backed_oem') else '') for h in d.get('estimate_history',[]))
blk=f"\n## 10. Working estimate after round 4\n\n- Probability TLens is in Meta VR Glasses at launch: **{e.get('p_tlens_in_meta_vr_glasses')}**\n- Probability Meta is the Q Tech-backed top-tier US OEM: **{e.get('p_meta_is_qtech_backed_oem')}**\n- History: {hist}\n\n{e.get('reasoning','')}\n"
q=d.get('cmd_questions') or []
if q: blk+="\n## 11. Questions for the Q3 report (2026-10-29) and Capital Markets Day (2026-10-30)\n\n"+'\n'.join(f"{i+1}. **{x['question']}** {x.get('why','')} If yes: {x.get('if_yes','')} If no: {x.get('if_no','')}" for i,x in enumerate(q))+'\n'
w=d.get('watchlist') or []
if w: blk+="\n## 12. Hard-evidence watch list\n\n| When | What to check | Where | If positive | If negative |\n|---|---|---|---|---|\n"+'\n'.join(f"| {x.get('date_from','')} → {x.get('date_to','')} | {x.get('what','')} | {x.get('where','')} | {x.get('if_positive','')} | {x.get('if_negative','')} |" for x in w)+'\n'
ch=d.get('changes_made') or []
if ch: blk+="\n## 13. Editorial changes after the round-4 skeptic panel\n\n"+'\n'.join('- '+c for c in ch)+'\n'
open('build/out_r4/REPORT.md','w',encoding='utf-8').write(s+blk)
R='../README.md'; r=open(R,encoding='utf-8').read()
import re
r=re.sub(r'23 lanes \(13 producers, 10 supplier/evidence lanes\), \d+ dated signals, \d+ launch windows', f"23 lanes (13 producers, 10 supplier/evidence lanes), {len(d['events'])} dated signals, {len(d['windows'])} launch windows", r)
r=re.sub(r'\d+ supplier↔launch matches', f"{len(d['matches'])} supplier↔launch matches", r)
v=json.load(open('research/json/verification_all_r4.json',encoding='utf-8'))
r=re.sub(r'\| `data/verification.json` \| \d+ load-bearing items', f"| `data/verification.json` | {len(v['rows'])} load-bearing items", r)
if 'Round 4' not in r:
    r=r.rstrip('\n')+"\n\nRound 4 (2026-10-08): primary copies of the documents the estimate rests on (DBS's Q Tech note, Meta's developer page), the public LinkedIn and job-post trail (search engines only, no login), Meta's regulatory filing history and the expected VR Glasses filing window, public trade data, Q Tech's HKEX filings, poLight's Newsweb insider, holder and short data plus the latest Q&A answers, and a Program B candidate study. The map now shows the working estimate with its history, a question list for the Q3 report and Capital Markets Day, and a dated hard-evidence watch list; the round-4 source files are in `sources/round4/`.\n"
open(R,'w',encoding='utf-8').write(r)
PY
cd "$S/../../.."
mkdir -p research/ar-xr-timeline/sources/round4
cp $S/build/out_r4/timeline-map.html research/ar-xr-timeline/timeline-map.html
cp $S/build/out_r4/REPORT.md research/ar-xr-timeline/REPORT.md
cp $S/build/out_r4/timeline_data.json research/ar-xr-timeline/data/timeline_data.json
cp $S/research/json/verification_all_r4.json research/ar-xr-timeline/data/verification.json
cp $S/research/entities4/*.md research/ar-xr-timeline/sources/round4/
true
git add research/ar-xr-timeline
git commit -q -m "$MSG"
for i in 1 2 3 4 5; do git push -q -u origin claude/arvr-xr-glasses-timeline-a2qlwg && break || sleep $((2**i)); done
git log --oneline -1
