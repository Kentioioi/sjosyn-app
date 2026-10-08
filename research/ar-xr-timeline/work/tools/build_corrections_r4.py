"""Merge two-lens verification results (from workflow journals) for round 3 into corrections_r4.json, verification_r4.json and new/verification_summary.txt.
Usage: python3 -I build_corrections_r3.py r3_dir journal1.jsonl [journal2.jsonl ...]
"""
import json, sys, collections
D = sys.argv[1]; journals = sys.argv[2:]
st = json.load(open(f'{D}/stage1.json', encoding='utf-8'))
byid = {e['id']: e for e in st['events']}; byid.update({w['id']: w for w in st['windows']})
rank = {'confirmed': 0, 'partially_supported': 1, 'source_unreachable': 2, 'date_wrong': 3, 'not_found': 4, 'claim_wrong': 5}
per = collections.defaultdict(list); nagents = 0
for jp in journals:
    labels = {}
    for line in open(jp, encoding='utf-8'):
        try: o = json.loads(line)
        except Exception: continue
        if o.get('type') == 'started': labels[o['key']] = o.get('label')
        if o.get('type') == 'result' and isinstance(o.get('result'), dict):
            lab = labels.get(o['key'], ''); nagents += 1
            for r in o['result'].get('results', []):
                r['_lens'] = lab.split(':')[-1]; per[r.get('id')].append(r)
def search_page(u): return (not u) or ('xhr/query' in u) or ('search?q=' in u) or ('/search' in u)
corr = {'drop': [], 'set': {}}; rows = []; cnt = collections.Counter(); summ_lines = []
for id_, rs in per.items():
    o = byid.get(id_)
    if not o: continue
    rs = sorted(rs, key=lambda r: -rank.get(r.get('verdict'), 0))
    v = rs[0].get('verdict'); cnt[v] += 1; s = {}
    for r in rs:
        if r.get('verdict') == 'date_wrong':
            for k in ('date', 'precision', 'start', 'end'):
                if r.get('corrected_' + k): s[k] = r['corrected_' + k]
        fu = r.get('found_url') or ''
        if fu.startswith('http') and search_page(o.get('url', '')) and not search_page(fu): s['url'] = fu
    claims = [r for r in rs if r.get('_lens') == 'claims']
    ctx = ' '.join((r.get('tlens_context') or '').strip() for r in claims if (r.get('tlens_context') or '').strip() and r.get('tlens_context','').lower() != 'not mentioned')
    rel = next((r.get('xr_relevance') for r in claims if r.get('xr_relevance') and r.get('xr_relevance') != 'unknown'), None)
    notes = ' | '.join((r.get('note') or '') for r in rs if r.get('note'))
    cc = [r.get('corrected_conf') for r in rs if r.get('corrected_conf')]
    tag = ''
    if v == 'claim_wrong': s['conf'] = 'rumor'; tag = '[Source check: not supported by the cited source — ' + notes + '] '
    elif v == 'not_found': s['conf'] = 'rumor'; tag = '[Source check: no source found — ' + notes + '] '
    elif v == 'partially_supported': s['conf'] = cc[0] if cc else ('circumstantial' if o.get('conf') in ('confirmed', 'strong') else o.get('conf')); tag = '[Source check: partially supported — ' + notes + '] '
    elif v == 'source_unreachable': tag = '[Source check: source unreachable — ' + notes + '] '
    elif v in ('confirmed', 'date_wrong'):
        if cc: s['conf'] = cc[0]
        elif o.get('conf') == 'circumstantial' and ctx: s['conf'] = 'confirmed'
    extra = ''
    if ctx: extra += ' [Full text: ' + ctx[:260] + ']'
    if rel: extra += ' [Relevance: ' + rel + ']'
    if rel == 'unrelated' and s.get('conf', o.get('conf')) in ('confirmed', 'strong'): s['conf'] = 'circumstantial'
    if tag or extra: s['detail'] = tag + (o.get('detail') or '') + extra
    if s: corr['set'][id_] = s
    rows.append(dict(id=id_, title=o.get('title', ''), date=o.get('date') or (o.get('start', '') + '→' + o.get('end', '')), verdict=v, note=(notes + (' // ' + ctx if ctx else '') + (' // relevance ' + rel if rel else ''))[:400]))
    summ_lines.append(f"{id_} | {v} | relevance={rel or '?'} | {(ctx or notes)[:220]}")
summary = f"Round 4: {len(per)} load-bearing rows and windows checked against their sources by {nagents} independent checkers (dates lens + claims lens per batch; the more skeptical verdict wins): " + ", ".join(f"{k} {v}" for k, v in cnt.most_common()) + "."
json.dump(corr, open(f'{D}/corrections_r4.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
json.dump(dict(summary=summary, rows=rows), open(f'{D}/verification_r4.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
open(f'{D}/new/verification_summary.txt', 'w', encoding='utf-8').write('\n'.join([summary, '', 'Per row (id | verdict | XR relevance | what the source says):'] + summ_lines))
print(summary); print('corrections', len(corr['set']), 'url upgrades', sum(1 for s in corr['set'].values() if 'url' in s))
