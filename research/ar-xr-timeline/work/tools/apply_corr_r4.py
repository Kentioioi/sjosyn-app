"""Apply corrections_r4.json to the round-3 new/ files (compact, lane_*, windows) so dedupe/synthesis agents see register-checked rows.
Usage: python3 -I apply_corr_r3.py r3_dir"""
import json, sys, glob, os
D = sys.argv[1]; corr = json.load(open(f'{D}/corrections_r4.json', encoding='utf-8'))
S = corr.get('set', {}); n = 0
def fix(rows, is_window=False):
    global n
    for r in rows:
        s = S.get(r.get('id'))
        if not s: continue
        for k, v in s.items():
            if k == 'detail': r['detail'] = v[:900] if is_window else v[:900]
            elif k in r or k in ('date', 'precision', 'conf', 'url', 'start', 'end'): r[k] = v
        n += 1
    return rows
for f in glob.glob(f'{D}/new/lane_*.json') + [f'{D}/new/compact.json']:
    rows = json.load(open(f, encoding='utf-8')); fix(rows)
    if f.endswith('compact.json'):
        for r in rows: r['detail'] = (r.get('detail') or '')[:900]
    json.dump(rows, open(f, 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
wf = f'{D}/new/windows.json'; w = json.load(open(wf, encoding='utf-8')); fix(w, True); json.dump(w, open(wf, 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
print('applied', n, 'row updates across new/ files')
