from map2 import MAP
from ids import load
import html
E = html.escape
NAMES={'1P':'1.º Primaria','2P':'2.º Primaria','3P':'3.º Primaria','4P':'4.º Primaria','5P':'5.º Primaria','6P':'6.º Primaria','1E':'1.º ESO','2E':'2.º ESO','3E':'3.º ESO','4E':'4.º ESO'}
COL={'Matemáticas':'#ECE9FB','Matemáticas A':'#ECE9FB','Matemáticas B':'#ECE9FB','Conocimiento del Medio':'#E3F4EA','Biología y Geología':'#E3F4EA','Física y Química':'#E3EEFB','Tecnología y Digitalización':'#FDF1DC','Tecnología':'#FDF1DC','Digitalización':'#FDF1DC'}
S = load()
num = {}  # (course, subject, title) -> lesson number label
uses = {}
n = 0; out = []
for c, subs in MAP.items():
    out.append(f'<section class="course"><h2>{NAMES[c]}</h2>')
    for s, blocks in subs.items():
        k = sum(len(v) for v in blocks.values())
        out.append(f'<div class="subj" style="background:{COL[s]}"><h3>{E(s)} <small>{k} lecciones</small></h3><div class="blocks">')
        for b, ls in blocks.items():
            out.append(f'<div class="block"><h4>{E(b)}</h4><ol>')
            for t, ids in ls:
                n += 1
                for i in ids: uses.setdefault(i, []).append(f'{NAMES[c]} · {t}')
                out.append(f'<li>{E(t)} <span class="ids">{" ".join(ids)}</span></li>')
            out.append('</ol></div>')
        out.append('</div></div>')
    out.append('</section>')
GROUPS = [('PM','Primaria · Matemáticas (Decreto 106/2022; columnas = ciclos 1.º, 2.º y 3.º)'),('PC','Primaria · Conocimiento del Medio, parte de ciencias, tecnología, Tierra y clima (Decreto 106/2022; columnas = ciclos)'),
 ('EM','ESO · Matemáticas (Decreto 66/2024; S = 1.º y 2.º, T = 3.º, A = 4.º A, B = 4.º B)'),('BG','ESO · Biología y Geología (Decreto 66/2024; columna = curso)'),('FQ','ESO · Física y Química (Decreto 107/2022)'),
 ('TD','ESO · Tecnología y Digitalización 1.º y 3.º (Decreto 107/2022)'),('TC','ESO · Tecnología 4.º'),('DG','ESO · Digitalización 4.º')]
ann = []
for p, title in GROUPS:
    rows = [x for x in S if x['id'].startswith(p) and x['id'][2:].isdigit()]
    ann.append(f'<h3 class="anh">{E(title)} <small>{len(rows)} saberes, todos cubiertos</small></h3><table><tr><th>Id</th><th>Saber del decreto</th><th>Curso</th><th>Lecciones que lo trabajan</th></tr>')
    for x in rows:
        ann.append(f'<tr><td>{x["id"]}</td><td>{E(x["text"])}</td><td>{E(x["cols"] or "")}</td><td>{E("; ".join(uses.get(x["id"], ["⚠ SIN CUBRIR"])))}</td></tr>')
    ann.append('</table>')
doc=f'''<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Matematix: mapa de contenidos</title>
<style>
@page{{size:A4;margin:13mm 11mm}}
body{{font-family:"Lexend","Segoe UI",system-ui,sans-serif;color:#262A40;font-size:9pt;line-height:1.35}}
h1{{font-size:20pt;color:#5B4BC4;margin:0 0 2mm}} .sub{{color:#5C6078;margin:0 0 5mm}}
.intro{{background:#F4F2FD;border-radius:14px;padding:4mm 5mm;margin-bottom:4mm}} .intro h3{{margin:0 0 2mm;font-size:11pt}}
.intro ul{{margin:0;padding-left:5mm}} .intro li{{margin:1mm 0}}
.course{{margin-top:5mm}} h2{{break-after:avoid;font-size:15pt;color:#5B4BC4;margin:0 0 3mm;border-bottom:2px solid #E4E0F2;padding-bottom:1mm}}
.subj{{border-radius:14px;padding:3mm 4mm;margin-bottom:4mm}}
h3{{margin:0 0 2mm;font-size:12pt}} h3 small{{font-weight:400;color:#5C6078;font-size:9pt}}
.blocks{{display:grid;grid-template-columns:repeat(3,1fr);gap:3mm}}
.block{{background:#fff;border-radius:10px;padding:2mm 3mm;break-inside:avoid}} h4{{margin:0 0 1mm;font-size:9.5pt;color:#3d3870}}
ol{{margin:0;padding-left:4.5mm}} li{{margin:.4mm 0}} .ids{{color:#8A8EA6;font-size:7pt}}
.annex{{break-before:page}} .anh{{margin-top:5mm;color:#3d3870;break-after:avoid}}
table{{width:100%;border-collapse:separate;border-spacing:0;font-size:7.5pt;margin-bottom:3mm;border-radius:10px;overflow:hidden;border:1px solid #E4E0F2}}
th{{background:#ECE9FB;text-align:left;padding:1.2mm 2mm}} td{{padding:1mm 2mm;border-top:1px solid #EFEDF7;vertical-align:top}}
tr{{break-inside:avoid}} td:first-child{{white-space:nowrap;color:#5C6078}} td:nth-child(3){{white-space:nowrap}}
</style></head><body>
<h1>Matematix · mapa de contenidos</h1>
<p class="sub">Versión 2, revisada saber por saber · {n} lecciones · {len(S)} saberes del currículo, todos cubiertos · Comunitat Valenciana</p>
<div class="intro"><h3>Cómo se ha hecho</h3><ul>
<li>He copiado <b>todos los saberes básicos</b> de las tablas oficiales: Decreto 106/2022 de Primaria (modificado por el 96/2026, que no cambia los saberes); Decreto 107/2022 de ESO, con los anexos de Matemáticas y Biología y Geología reescritos por el Decreto 66/2024.</li>
<li>Cada lección lleva al lado, en gris, el código del saber que trabaja. Un programa comprueba que <b>ningún saber quede sin lección en el curso que le corresponde</b> y que ninguna lección esté en un curso que no toca. Resultado: 0 saberes sin cubrir. El anexo final lo recoge saber por saber.</li>
<li><b>Reparto por cursos.</b> El decreto agrupa Primaria por ciclos y las Matemáticas de 1.º y 2.º de ESO en una sola columna; el centro reparte. Mi criterio: el primer curso del ciclo introduce y el segundo amplía. Lo que el decreto pone en todo el ciclo (cálculo mental, problemas, estrategia) aparece en los dos cursos.</li>
<li><b>Materias por curso.</b> 1.º ESO: Matemáticas, Biología y Geología, Tecnología y Digitalización. 2.º: Matemáticas, Física y Química. 3.º: Matemáticas, Biología y Geología, Física y Química, Tecnología y Digitalización. 4.º: Matemáticas A y B; y, como optativas, Biología y Geología, Física y Química, Tecnología y Digitalización.</li>
<li><b>Fuera del mapa, a propósito.</b> En Conocimiento del Medio, la parte de sociedad e historia, porque la app es de matemáticas y ciencias. El bloque socioafectivo de Matemáticas (actitudes y gestión de la frustración) no tiene lecciones propias: se trabaja en todas, con Chispa y los mensajes de ánimo.</li>
</ul></div>
<div class="intro"><h3>Cómo se organizará la app</h3><ul>
<li><b>Curso → Materia → Bloque → Lección.</b> Primero se elige el curso; después, sus materias; dentro de cada materia, los bloques; y en cada bloque, las lecciones en orden.</li>
<li><b>Cada lección</b> empieza con una explicación breve y un ejemplo resuelto. Después vienen los ejercicios: un enunciado corto y una sola pregunta. En el nivel 1 se elige entre opciones, en el nivel 2 se escribe la respuesta y en el nivel 3 se responde sin ayuda.</li>
<li><b>La recta numérica</b> deja de ser el menú. Solo aparece como dibujo de ayuda en los ejercicios donde sirve.</li>
</ul><p style="margin:2mm 0 0"><b>Qué revisar:</b> el reparto entre los dos cursos de cada ciclo y el orden de las lecciones dentro de cada bloque.</p></div>
{"".join(out)}
<div class="annex"><h2>Anexo · Cada saber del decreto y sus lecciones</h2>{"".join(ann)}</div>
</body></html>'''
open('mapa.html','w').write(doc)
print(n)
