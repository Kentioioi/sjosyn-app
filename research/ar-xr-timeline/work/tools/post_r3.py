"""Post-assembly corrections for round 3 (critic-flagged consistency fixes).
Usage: python3 -I post_r3.py timeline_data.json"""
import json, sys
p = sys.argv[1]; d = json.load(open(p, encoding='utf-8')); n = 0
SUBS = [
  ("and only unattributed 2026-09-20 reports place Goertek on Phoenix, so this is",
   "and Goertek's place on Phoenix rests on unattributed 2026-09-20 supply-chain reports plus Citi's 2026-09-24 note naming Goertek and Sunny key beneficiaries of the VR Glasses, so this is"),
  ("Sunny is reported as Meta's AI-glasses module maker; no camera-module vendor is reported for Phoenix.",
   "Sunny is reported as the camera-module maker for Meta's AI glasses, and Citi (2026-09-24) names it a VR Glasses beneficiary without saying for which part; no source names the VR Glasses camera-module or actuator vendor."),
  ("is placed on Phoenix only by unattributed reports",
   "is placed on Phoenix by unattributed supply-chain reports and by Citi's 2026-09-24 beneficiary note, neither naming a camera part"),
]
def fix(t):
    global n
    for a, b in SUBS:
        if a in t: t = t.replace(a, b); n += 1
    return t
d['headline_findings'] = [fix(f) for f in d['headline_findings']]
if d.get('estimate'): d['estimate']['reasoning'] = fix(d['estimate']['reasoning'])
for c in d.get('commentary', []):
    for s in c['segments']: s['text'] = fix(s['text'])
for m in d.get('matches', []): m['comment'] = fix(m.get('comment', ''))
for e in d['events']:
    if e['id'] == 'modules-0-65' and 'AI glasses' not in e['title']:
        e['title'] = 'Chinese supply-chain preview: Phoenix assembled by Goertek (Sony sensors and Sunny camera modules are listed for the AI glasses, not Phoenix)'; n += 1
json.dump(d, open(p, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('post_r3 substitutions', n)
