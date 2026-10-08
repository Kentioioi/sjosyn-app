"""Build the journal.jsonl that assemble_r2.py reads from plain JSON files in handoff/.
Usage: python3 -I tools/make_journal.py handoff/ handoff/journal.jsonl
Reads: dedupe_r4.json (label -> {drop, fix}), synth_core.json, synth_patches.json, repair.json (optional), critic.txt (optional)."""
import json, sys, os
H, out = sys.argv[1], sys.argv[2]; lines = []; n = 0
def add(label, result):
    global n; n += 1; k = f'k{n}'
    lines.append(json.dumps({'type': 'started', 'key': k, 'label': label})); lines.append(json.dumps({'type': 'result', 'key': k, 'result': result}, ensure_ascii=False))
for lab, r in json.load(open(os.path.join(H, 'dedupe_r4.json'), encoding='utf-8')).items(): add(lab, r)
for f, lab in (('synth_core.json', 'synth:core'), ('synth_patches.json', 'synth:patches'), ('repair.json', 'repair')):
    p = os.path.join(H, f)
    if os.path.exists(p): add(lab, json.load(open(p, encoding='utf-8')))
p = os.path.join(H, 'critic.txt')
if os.path.exists(p): add('critic', open(p, encoding='utf-8').read())
open(out, 'w', encoding='utf-8').write('\n'.join(lines) + '\n'); print('journal entries', n)
