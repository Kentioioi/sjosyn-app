"""Snapshot an assembled dataset as the 'existing' files the round-N agents read.
Usage: python3 -I make_existing.py timeline_data.json out_dir"""
import json, sys, os, collections
d = json.load(open(sys.argv[1], encoding='utf-8')); O = sys.argv[2]; os.makedirs(O, exist_ok=True)
for f in os.listdir(O):
    if f.endswith('.json'): os.remove(os.path.join(O, f))
lanes = collections.defaultdict(list)
for e in d['events']:
    lanes[e['lane']].append(dict(id=e['id'], date=e['date'], precision=e.get('precision'), cat=e['cat'], type=e.get('type'), title=e['title'], detail=(e.get('detail') or '')[:260], url=e.get('url', ''), conf=e['conf']))
for l, rows in lanes.items(): json.dump(sorted(rows, key=lambda r: r['date']), open(f'{O}/lane_{l}.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
json.dump([dict(id=w['id'], lane=w['lane'], start=w['start'], end=w['end'], cat=w['cat'], title=w['title'], detail=(w.get('detail') or '')[:220], url=w.get('url', ''), conf=w['conf']) for w in d['windows']], open(f'{O}/windows.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
json.dump([dict(id=e['id'], lane=e['lane'], date=e['date'], cat=e['cat'], type=e.get('type'), title=e['title'], conf=e['conf'], key=e.get('key', False)) for e in d['events']], open(f'{O}/compact.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
syn = dict(leadtimes=d.get('leadtimes', []), matches=[{k: v for k, v in m.items() if k != 'id'} for m in d.get('matches', [])], commentary=d.get('commentary', []), headline_findings=d.get('headline_findings', []), subtitle=d['meta'].get('subtitle', ''), foot=d['meta'].get('foot', ''), estimate=d.get('estimate'))
json.dump(syn, open(f'{O}/synthesis.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('existing snapshot:', len(d['events']), 'events,', len(d['windows']), 'windows,', len(lanes), 'lanes')
