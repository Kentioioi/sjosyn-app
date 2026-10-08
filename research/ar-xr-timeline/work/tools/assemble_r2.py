"""Merge round-2 rows into the existing dataset and apply the updated synthesis.
Usage: python3 -I assemble_r2.py existing_timeline_data.json stage1_r2.json stage2_r2_journal.jsonl corrections_r2.json html_template out_dir
"""
import json, copy, sys, os, re, collections
ex_p, st_p, journal, corr_p, html_tpl, out_dir = sys.argv[1:7]
d = json.load(open(ex_p, encoding='utf-8')); st = json.load(open(st_p, encoding='utf-8'))
res = {}; labels = {}
for line in open(journal, encoding='utf-8'):
    try: o = json.loads(line)
    except Exception: continue
    if o.get('type') == 'started': labels[o['key']] = o.get('label')
    if o.get('type') == 'result': res[labels.get(o['key'])] = o['result']
drop = set(); fixes = []
for lab, r in res.items():
    if lab and lab.startswith('dedupe:') and isinstance(r, dict): drop.update(r.get('drop', [])); fixes += r.get('fix', [])
new_ev = [e for e in st['events'] if e['id'] not in drop]; new_w = [w for w in st['windows'] if w['id'] not in drop]
corr = json.load(open(corr_p, encoding='utf-8')) if os.path.exists(corr_p) else {'set': {}, 'drop': []}
new_ev = [e for e in new_ev if e['id'] not in set(corr.get('drop', []))]; new_w = [w for w in new_w if w['id'] not in set(corr.get('drop', []))]
for e in new_ev + new_w:
    if e['id'] in corr.get('set', {}): e.update(corr['set'][e['id']])
allev = d['events'] + new_ev; allw = d['windows'] + new_w
for f in fixes:
    for o in allev + allw:
        if o['id'] == f['id']: o[f['field']] = f['value']
valid = {l['id'] for l in d['lanes']}
allev = [e for e in allev if e['lane'] in valid]; allw = [w for w in allw if w['lane'] in valid]
def pick(label):
    c = [res[k] for k in res if (k == label or (k or '').startswith(label + ':retry')) and res[k]]
    return c[-1] if c else None
def apply_patches(syn, rep):
    if not isinstance(rep, dict): return
    if rep.get('headline_findings'): syn['headline_findings'] = rep['headline_findings']
    if rep.get('estimate'): syn['estimate'] = rep['estimate']
    if rep.get('matches'): syn['matches'] = rep['matches']
    for p_ in rep.get('commentary_patches') or []:
        lane = next((c for c in syn['commentary'] if c['lane'] == p_['lane']), None)
        seg = dict(start=p_['start'], end=p_['end'], title=p_['title'], text=p_['text'])
        if lane is None: syn['commentary'].append(dict(lane=p_['lane'], segments=[seg])); continue
        ex = next((s_ for s_ in lane['segments'] if s_['title'].strip().lower() == p_['title'].strip().lower()), None)
        if ex: ex.update(seg)
        else: lane['segments'].append(seg)
        lane['segments'].sort(key=lambda s_: s_['start'])
    for p_ in rep.get('leadtime_patches') or []:
        lt = next((l for l in syn['leadtimes'] if l['window'] == p_['window']), None)
        if lt: lt.update(phases=p_['phases'], rationale=p_['rationale'], lanes=p_.get('lanes') or lt.get('lanes'))
        else: syn['leadtimes'].append(dict(window=p_['window'], lanes=p_.get('lanes') or [], phases=p_['phases'], rationale=p_['rationale']))
    for k in ('subtitle', 'foot'):
        if rep.get(k): syn[k] = rep[k]
    if rep.get('changes_made'): syn['changes_made'] = rep['changes_made']
    for k in ('cmd_questions', 'watchlist'):
        if rep.get(k): syn[k] = rep[k]
syn = pick('synthesize_final') or pick('synthesize') or {}
if not syn and (pick('synth:core') or pick('repair')):
    syn = dict(leadtimes=copy.deepcopy(d.get('leadtimes', [])), matches=[{k: v for k, v in m.items() if k != 'id'} for m in d.get('matches', [])], commentary=copy.deepcopy(d.get('commentary', [])), headline_findings=list(d.get('headline_findings', [])), subtitle=d['meta'].get('subtitle', ''), foot=d['meta'].get('foot', ''), estimate=d.get('estimate'))
    apply_patches(syn, pick('synth:core')); apply_patches(syn, pick('synth:patches'))
apply_patches(syn, pick('repair'))
ids = {e['id'] for e in allev} | {w['id'] for w in allw}
title_of = {e['id']: e['title'] for e in allev}; title_of.update({w['id']: w['title'] for w in allw})
ID = r'w-r[2-9]-[a-z]+-\d+-\d+|r[2-9]-[a-z]+-\d+-\d+|(?:w-)?[a-z]+-\d+-\d+'
def deid(t):
    if not isinstance(t, str): return t
    t = re.sub(r'\s*\((?:' + ID + r')\)', '', t); t = re.sub(r'\((?:' + ID + r'),\s*', '(', t); t = re.sub(r',\s*(?:' + ID + r')(?=[\),;.\s])', '', t); t = re.sub(r'\b(?:' + ID + r')\b', '', t)
    t = re.sub(r'\(\s*\)', '', t); t = re.sub(r'\s{2,}', ' ', t); t = re.sub(r'\s+([,.;)])', r'\1', t); return t.strip()
if syn:
    d['matches'] = [dict(id=f'm{i}', **{k: deid(v) if k in ('title', 'comment') else v for k, v in m.items() if k != 'id'}) for i, m in enumerate(syn['matches']) if m.get('from') in ids and m.get('to') in ids]
    d['leadtimes'] = [dict(lt, rationale=deid(lt.get('rationale', ''))) for lt in syn['leadtimes'] if lt['window'] in ids]
    for c in syn['commentary']:
        for sg in c['segments']: sg['text'] = deid(sg['text']); sg['title'] = deid(sg['title'])
    d['commentary'] = syn['commentary']; d['headline_findings'] = [deid(x) for x in syn['headline_findings']]
    d['meta']['subtitle'] = syn.get('subtitle', d['meta']['subtitle']); d['meta']['foot'] = syn.get('foot', d['meta']['foot'])
    d['estimate'] = syn.get('estimate'); d['changes_made'] = syn.get('changes_made', [])
    for k in ('cmd_questions', 'watchlist'):
        if syn.get(k): d[k] = syn[k]
d['critique'] = (pick('critic') or '') + '\n\n--- earlier critic rounds ---\n' + (d.get('critique') or '')
d['events'] = sorted(allev, key=lambda e: e['date']); d['windows'] = allw
os.makedirs(out_dir, exist_ok=True)
json.dump(d, open(os.path.join(out_dir, 'timeline_data.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
html = open(html_tpl, encoding='utf-8').read()
m = re.search(r'<script type="application/json" id="tl-data">.*?</script>', html, flags=re.S)
embed = json.dumps({k: v for k, v in d.items() if k not in ('critique', 'changes_made')}, ensure_ascii=False).replace('</', '<\\/')
open(os.path.join(out_dir, 'timeline-map.html'), 'w', encoding='utf-8').write(html[:m.start()] + '<script type="application/json" id="tl-data">\n' + embed + '\n</script>' + html[m.end():])
print(f"events {len(d['events'])} (+{len(new_ev)} new, {len(drop)} dropped) windows {len(d['windows'])} matches {len(d['matches'])} leadtimes {len(d['leadtimes'])}")
