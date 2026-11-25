# Builds src/course/catalog.ts from the trilingual map files and checks coverage against the decree checklists.
import json, sys
from ids import load
SUBJ = {'Matemáticas': ('M', 'Matemàtiques', 'Maths'), 'Matemáticas A': ('MA', 'Matemàtiques A', 'Maths A'), 'Matemáticas B': ('MB', 'Matemàtiques B', 'Maths B'),
 'Conocimiento del Medio': ('CM', 'Coneixement del Medi', 'Science and Environment'), 'Biología y Geología': ('BG', 'Biologia i Geologia', 'Biology and Geology'),
 'Física y Química': ('FQ', 'Física i Química', 'Physics and Chemistry'), 'Tecnología y Digitalización': ('TD', 'Tecnologia i Digitalització', 'Technology and Digital Skills'),
 'Tecnología': ('TC', 'Tecnologia', 'Technology'), 'Digitalización': ('DG', 'Digitalització', 'Digital Skills')}
BLK = {'Números y operaciones': ('Nombres i operacions', 'Numbers and operations'), 'Medida': ('Mesura', 'Measurement'), 'Geometría': ('Geometria', 'Geometry'),
 'Estadística y probabilidad': ('Estadística i probabilitat', 'Statistics and probability'), 'Álgebra y pensamiento computacional': ('Àlgebra i pensament computacional', 'Algebra and computational thinking'),
 'Seres vivos y ecología': ('Éssers vius i ecologia', 'Living things and ecology'), 'Cuerpo humano y salud': ('Cos humà i salut', 'The human body and health'),
 'Materia, fuerzas y energía': ('Matèria, forces i energia', 'Matter, forces and energy'), 'Tecnología y digitalización': ('Tecnologia i digitalització', 'Technology and digital skills'),
 'La Tierra y el clima': ('La Terra i el clima', 'The Earth and climate'), 'Cultura científica y consumo': ('Cultura científica i consum', 'Science and consumers'),
 'Números': ('Nombres', 'Numbers'), 'Álgebra': ('Àlgebra', 'Algebra'), 'Funciones': ('Funcions', 'Functions'), 'Probabilidad': ('Probabilitat', 'Probability'),
 'Estadística': ('Estadística', 'Statistics'), 'Pensamiento computacional': ('Pensament computacional', 'Computational thinking'),
 'Proyecto científico': ('Projecte científic', 'Science project'), 'Los seres vivos': ('Els éssers vius', 'Living things'), 'La Tierra': ('La Terra', 'The Earth'),
 'Ecología y sostenibilidad': ('Ecologia i sostenibilitat', 'Ecology and sustainability'), 'Ecología y salud': ('Ecologia i salut', 'Ecology and health'),
 'La célula': ('La cèl·lula', 'The cell'), 'Genética': ('Genètica', 'Genetics'), 'Evolución': ('Evolució', 'Evolution'), 'Ecología': ('Ecologia', 'Ecology'), 'Geología': ('Geologia', 'Geology'),
 'Destrezas científicas': ('Destreses científiques', 'Science skills'), 'La materia': ('La matèria', 'Matter'), 'El cambio químico': ('El canvi químic', 'Chemical change'),
 'Movimiento y fuerzas': ('Moviment i forces', 'Motion and forces'), 'La energía': ("L'energia", 'Energy'), 'La interacción': ('La interacció', 'Interactions'),
 'Proceso tecnológico': ('Procés tecnològic', 'The design process'), 'Materiales y estructuras': ('Materials i estructures', 'Materials and structures'),
 'Máquinas y electricidad': ('Màquines i electricitat', 'Machines and electricity'), 'Digitalización': ('Digitalització', 'Digital skills'),
 'Tecnología y sociedad': ('Tecnologia i societat', 'Technology and society'), 'Proyectos': ('Projectes', 'Projects'), 'Electrónica y fluidos': ('Electrònica i fluids', 'Electronics and fluid power'),
 'Control y robótica': ('Control i robòtica', 'Control and robotics'), 'Instalaciones de la vivienda': ("Instal·lacions de l'habitatge", 'Services in the home'),
 'Tecnología sostenible': ('Tecnologia sostenible', 'Sustainable technology'), 'Dispositivos y redes': ('Dispositius i xarxes', 'Devices and networks'),
 'Crear y colaborar': ('Crear i col·laborar', 'Creating and collaborating'), 'Seguridad y bienestar': ('Seguretat i benestar', 'Security and wellbeing'), 'Ciudadanía digital': ('Ciutadania digital', 'Digital citizenship'),
 'Cuerpo humano y salud ': None}
ORDER = ['1P','2P','3P','4P','5P','6P','1E','2E','3E','4E']
cat = {c: [] for c in ORDER}
course = subj = blk = None; bad = 0
for f in ['map3_pm.txt','map3_pc.txt','map3_em.txt','map3_sci.txt','map3_tec.txt']:
    for raw in open(f):
        l = raw.rstrip('\n')
        if not l.strip(): continue
        if l.startswith('= '): course = l[2:].strip(); continue
        if l.startswith('# '):
            name = l[2:].strip(); code, ca, en = SUBJ[name]
            subj = {'code': code, 'title': [name, ca, en], 'blocks': []}; cat[course].append(subj); continue
        if l.startswith('## '):
            name = l[3:].strip()
            if name not in BLK: print('NO BLOCK TR', name); bad += 1; continue
            blk = {'title': [name, *BLK[name]], 'lessons': []}; subj['blocks'].append(blk); continue
        t, _, ids = l.partition(' @')
        parts = [x.strip() for x in t.split('|')]
        if len(parts) != 3 or not all(parts): print('BAD LINE', f, l); bad += 1; continue
        n = sum(len(b['lessons']) for b in subj['blocks']) + 1
        blk['lessons'].append({'id': f"{course}-{subj['code']}-{n}", 'title': parts, 'sab': [i.strip() for i in ids.split(',') if i.strip()]})
# coverage (same rules as check.py, on the trilingual map)
S = load(); byid = {s['id']: s for s in S}; where = {}
NAME = {v[0]: k for k, v in SUBJ.items()}
for c in ORDER:
    for s in cat[c]:
        for b in s['blocks']:
            for les in b['lessons']:
                for i in les['sab']:
                    if i not in byid: print('UNKNOWN', i); bad += 1; continue
                    where.setdefault(i, set()).add((c, NAME[s['code']]))
                    if not any((c, NAME[s['code']]) in g for g in byid[i]['need']): print('OUT OF PLACE', i, les['id']); bad += 1
for x in S:
    for g in x['need']:
        if not (where.get(x['id'], set()) & set(g)): print('MISSING', x['id'], x['text']); bad += 1
n = sum(len(b['lessons']) for c in ORDER for s in cat[c] for b in s['blocks'])
print(f'{n} lessons, {len(S)} saberes, {bad} problems')
if bad: sys.exit(1)
out = ['// Generated by curriculum/build_catalog.py from curriculum/map3_*.txt. Do not edit by hand.',
       "import type { Catalog } from './types';",
       'export const CATALOG: Catalog = ' + json.dumps([{'id': c, 'subjects': cat[c]} for c in ORDER], ensure_ascii=False, indent=0) + ';', '']
import os; os.makedirs('../src/course', exist_ok=True)
open('../src/course/catalog.ts', 'w').write('\n'.join(out))
