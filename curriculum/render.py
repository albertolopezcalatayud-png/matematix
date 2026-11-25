from map import MAP
import html
NAMES={'1P':'1.º Primaria','2P':'2.º Primaria','3P':'3.º Primaria','4P':'4.º Primaria','5P':'5.º Primaria','6P':'6.º Primaria','1E':'1.º ESO','2E':'2.º ESO','3E':'3.º ESO','4E':'4.º ESO'}
COL={'Matemáticas':'#E8E4FF','Matemáticas A':'#E8E4FF','Matemáticas B':'#E8E4FF','Conocimiento del Medio':'#E1F5EC','Biología y Geología':'#E1F5EC','Física y Química':'#E3EEFB','Tecnología y Digitalización':'#FFF1D9','Tecnología':'#FFF1D9','Digitalización':'#FFF1D9'}
n=sum(len(l) for c in MAP.values() for s in c.values() for l in s.values())
out=[]
for c,subs in MAP.items():
    out.append(f'<section class="course"><h2>{NAMES[c]}</h2>')
    for s,blocks in subs.items():
        out.append(f'<div class="subj" style="background:{COL[s]}"><h3>{html.escape(s)} <small>{sum(len(v) for v in blocks.values())} lecciones</small></h3><div class="blocks">')
        for b,ls in blocks.items():
            out.append(f'<div class="block"><h4>{html.escape(b)}</h4><ol>'+''.join(f'<li>{html.escape(l)}</li>' for l in ls)+'</ol></div>')
        out.append('</div></div>')
    out.append('</section>')
doc=f'''<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Matematix: mapa de contenidos</title>
<style>
@page{{size:A4;margin:14mm 12mm}}
body{{font-family:"Lexend","Segoe UI",system-ui,sans-serif;color:#262A40;font-size:9.5pt;line-height:1.35}}
h1{{font-size:20pt;color:#5B4BC4;margin:0 0 2mm}} .sub{{color:#5C6078;margin:0 0 5mm}}
.intro{{background:#F6F4FF;border-radius:14px;padding:4mm 5mm;margin-bottom:5mm}} .intro h3{{margin:0 0 2mm;font-size:11pt}}
.intro ul{{margin:0;padding-left:5mm}} .intro li{{margin:1mm 0}}
.course{{margin-top:6mm}} h2{{break-after:avoid}}
h2{{font-size:15pt;color:#5B4BC4;margin:0 0 3mm;border-bottom:2px solid #E4E0F2;padding-bottom:1mm}}
.subj{{border-radius:14px;padding:3mm 4mm;margin-bottom:4mm;break-inside:avoid}}
h3{{margin:0 0 2mm;font-size:12pt}} h3 small{{font-weight:400;color:#5C6078;font-size:9pt}}
.blocks{{display:grid;grid-template-columns:repeat(3,1fr);gap:3mm}}
.block{{background:#fff;border-radius:10px;padding:2mm 3mm}} h4{{margin:0 0 1mm;font-size:9.5pt;color:#3d3870}}
ol{{margin:0;padding-left:4.5mm}} li{{margin:.4mm 0}}
</style></head><body>
<h1>Matematix · mapa de contenidos</h1>
<p class="sub">Propuesta para revisar antes de construir · {n} lecciones · Currículo de la Comunitat Valenciana (Decreto 106/2022 modificado por el 96/2026, y Decreto 107/2022)</p>
<div class="intro"><h3>Cómo se organizará la app</h3><ul>
<li><b>Curso → Materia → Bloque → Lección.</b> Al entrar se elige el curso; dentro, las materias de ese curso; en cada materia, los bloques del currículo; en cada bloque, las lecciones en orden.</li>
<li><b>Cada lección:</b> una explicación breve con un ejemplo resuelto y después ejercicios.</li>
<li><b>Cada ejercicio:</b> un enunciado breve y una sola pregunta. Nivel 1, elegir entre opciones; nivel 2, escribir la respuesta; nivel 3, sin ayuda.</li>
<li><b>La recta numérica</b> deja de ser el menú. Solo aparece como dibujo de ayuda en los ejercicios donde sirve (contar, sumar y restar, fracciones, decimales, negativos).</li>
<li>Se mantienen la prueba de nivel, el «más fácil / más difícil» dentro de cada materia, las fichas en papel y la zona de adultos.</li>
<li><b>Materias:</b> Primaria, Matemáticas y Conocimiento del Medio (parte de ciencias y tecnología). ESO, Matemáticas, Biología y Geología (1.º, 3.º y 4.º), Física y Química (2.º, 3.º y 4.º), Tecnología y Digitalización (1.º y 2.º), y Tecnología y Digitalización en 4.º.</li>
</ul><p style="margin:2mm 0 0"><b>Qué revisar:</b> si falta o sobra algún tema, si algo está en el curso equivocado y si el orden de las lecciones es el que se sigue en clase.</p></div>
{''.join(out)}
</body></html>'''
open('/home/claude/matematix/curriculum/mapa.html','w').write(doc)
