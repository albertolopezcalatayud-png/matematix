from map2 import MAP
from ids import load
S = load(); byid = {s['id']: s for s in S}
where = {}  # id -> set of (course, subject)
lessons = {}
bad = 0
for c, subs in MAP.items():
    for s, blocks in subs.items():
        for b, ls in blocks.items():
            for t, ids in ls:
                if not ids: print('NO IDS', c, s, t); bad += 1
                for i in ids:
                    if i not in byid: print('UNKNOWN', i, c, s, t); bad += 1; continue
                    where.setdefault(i, set()).add((c, s)); lessons.setdefault(i, []).append((c, s, t))
                    if not any((c, s) in grp for grp in byid[i]['need']):
                        print('OUT OF PLACE', i, byid[i]['cols'], c, s, t); bad += 1
for x in S:
    for grp in x['need']:
        if not (where.get(x['id'], set()) & set(grp)):
            print('MISSING', x['id'], grp, x['text']); bad += 1
n = sum(len(l) for c in MAP.values() for s in c.values() for l in s.values())
print(f'{len(S)} saberes, {n} lecciones, {bad} problemas')
