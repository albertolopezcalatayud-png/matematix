import type { ContentPack } from '../types';
import { int, mc, near, pick, pickN, q, S, T, X } from '../lib';
import { barChart, chance, gridPoints, clockRead, compareOrder, doublesHalves, equalGroups, gapEquation, mentalPowers, money, nim, placeValue, polygons, robot, sequence, share, tally, twoStep } from '../gens';
import { addQ, subQ } from '../lib';

const P: ContentPack = {
  '2P-M-1': {
    explain: [T('Diez decenas forman una centena: 100. En un número de tres cifras, la primera dice las centenas, la segunda las decenas y la tercera las unidades.', 'Deu desenes formen una centena: 100. En un nombre de tres xifres, la primera diu les centenes, la segona les desenes i la tercera les unitats.', 'Ten tens make a hundred: 100. In a three-digit number, the first digit tells you the hundreds, the second the tens and the third the ones.'),
      T('El 352 son 3 centenas (300), 5 decenas (50) y 2 unidades.', 'El 352 són 3 centenes (300), 5 desenes (50) i 2 unitats.', '352 is 3 hundreds (300), 5 tens (50) and 2 ones.')],
    example: { q: T('¿Qué número es 300 + 50 + 2?', 'Quin nombre és 300 + 50 + 2?', 'Which number is 300 + 50 + 2?'),
      steps: [T('3 centenas, 5 decenas y 2 unidades.', '3 centenes, 5 desenes i 2 unitats.', '3 hundreds, 5 tens and 2 ones.'), T('Escribo las cifras en orden: 352.', 'Escric les xifres en ordre: 352.', 'I write the digits in order: 352.')] },
    make: placeValue(3),
  },
  '2P-M-2': {
    explain: [T('Para comparar números de tres cifras, mira primero las centenas. Si son iguales, las decenas; y si también, las unidades.', 'Per a comparar nombres de tres xifres, mira primer les centenes. Si són iguals, les desenes; i si també, les unitats.', 'To compare three-digit numbers, look at the hundreds first. If they are equal, the tens; if those are equal too, the ones.')],
    example: { q: T('¿Cuál es mayor, 427 o 472?', 'Quin és major, 427 o 472?', 'Which is bigger, 427 or 472?'),
      steps: [T('Centenas: 4 y 4, iguales.', 'Centenes: 4 i 4, iguals.', 'Hundreds: 4 and 4, the same.'), T('Decenas: 2 y 7. 7 es mayor, así que 472 es mayor.', 'Desenes: 2 i 7. 7 és major, així que 472 és major.', 'Tens: 2 and 7. 7 is bigger, so 472 is bigger.')] },
    make: compareOrder(999, 100),
  },
  '2P-M-3': {
    explain: [T('Para sumar en columna, pon unidades debajo de unidades y decenas debajo de decenas. Empieza por las unidades.', 'Per a sumar en columna, posa unitats davall d’unitats i desenes davall de desenes. Comença per les unitats.', 'To add in columns, put ones under ones and tens under tens. Start with the ones.'),
      T('Si las unidades suman 10 o más, forman una decena: «me llevo una» y la sumo con las decenas.', 'Si les unitats sumen 10 o més, formen una desena: «me’n porte una» i la sume amb les desenes.', 'If the ones add up to 10 or more, they make a ten: carry one and add it to the tens.')],
    example: { q: S('47 + 38 = ?'),
      steps: [T('Unidades: 7 + 8 = 15. Pongo 5 y me llevo 1.', 'Unitats: 7 + 8 = 15. Pose 5 i me’n porte 1.', 'Ones: 7 + 8 = 15. I write 5 and carry 1.'), T('Decenas: 4 + 3 + 1 = 8. Resultado: 85.', 'Desenes: 4 + 3 + 1 = 8. Resultat: 85.', 'Tens: 4 + 3 + 1 = 8. Answer: 85.')] },
    make: (r) => { const a = int(r, 15, 79), b = int(r, 15, 99 - a); return (a % 10) + (b % 10) < 10 && r() < 0.7 ? addQ(r, a, Math.min(99 - a, b + (10 - ((a + b) % 10)))) : addQ(r, a, b); },
  },
  '2P-M-4': {
    explain: [T('Para restar en columna, empieza por las unidades. Si arriba hay menos que abajo, cambia una decena por 10 unidades.', 'Per a restar en columna, comença per les unitats. Si dalt n’hi ha menys que baix, canvia una desena per 10 unitats.', 'To subtract in columns, start with the ones. If the top digit is smaller, exchange a ten for 10 ones.'),
      T('Comprueba siempre: el resultado más lo que has quitado debe dar el número de arriba.', 'Comprova sempre: el resultat més el que has llevat ha de donar el nombre de dalt.', 'Always check: the answer plus what you took away should give the top number.')],
    example: { q: S('52 − 27 = ?'),
      steps: [T('2 − 7 no se puede: cambio una decena. Quedan 4 decenas y 12 unidades.', '2 − 7 no es pot: canvie una desena. Queden 4 desenes i 12 unitats.', '2 − 7 cannot be done: I exchange a ten. That leaves 4 tens and 12 ones.'), T('12 − 7 = 5. 4 − 2 = 2. Resultado: 25.', '12 − 7 = 5. 4 − 2 = 2. Resultat: 25.', '12 − 7 = 5. 4 − 2 = 2. Answer: 25.'), T('Compruebo: 25 + 27 = 52. ✓', 'Comprove: 25 + 27 = 52. ✓', 'Check: 25 + 27 = 52. ✓')] },
    make: (r) => { const a = int(r, 30, 99); let b = int(r, 11, a - 5); if ((a % 10) >= (b % 10) && r() < 0.7) b = Math.min(a - 1, b + 9 - (b % 10) + ((a % 10) + 1 <= 9 ? 0 : 0)); return subQ(r, a, Math.max(1, Math.min(b, a - 1))); },
  },
  '2P-M-5': {
    explain: [T('El doble de un número es ese número dos veces: el doble de 6 es 6 + 6 = 12.', 'El doble d’un nombre és eixe nombre dues vegades: el doble de 6 és 6 + 6 = 12.', 'Double a number means that number twice: double 6 is 6 + 6 = 12.'),
      T('La mitad es repartir en dos partes iguales: la mitad de 12 es 6. Doble y mitad son operaciones contrarias.', 'La meitat és repartir en dues parts iguals: la meitat de 12 és 6. Doble i meitat són operacions contràries.', 'Half means splitting into two equal parts: half of 12 is 6. Doubling and halving are opposites.')],
    example: { q: T('¿Cuál es la mitad de 18?', 'Quina és la meitat de 18?', 'What is half of 18?'),
      steps: [T('Busco un número que sumado consigo mismo dé 18.', 'Busque un nombre que sumat amb ell mateix done 18.', 'I look for a number that added to itself makes 18.'), T('9 + 9 = 18. La mitad de 18 es 9.', '9 + 9 = 18. La meitat de 18 és 9.', '9 + 9 = 18. Half of 18 is 9.')] },
    make: doublesHalves(25),
  },
  '2P-M-6': {
    explain: [T('Cuando sumamos el mismo número varias veces, podemos multiplicar: 4 + 4 + 4 = 3 × 4.', 'Quan sumem el mateix nombre diverses vegades, podem multiplicar: 4 + 4 + 4 = 3 × 4.', 'When we add the same number several times, we can multiply: 4 + 4 + 4 = 3 × 4.'),
      T('3 × 4 se lee «3 por 4» y quiere decir 3 grupos de 4.', '3 × 4 es llig «3 per 4» i vol dir 3 grups de 4.', '3 × 4 is read "3 times 4" and means 3 groups of 4.')],
    example: { q: T('Hay 3 platos con 4 galletas cada uno. ¿Cuántas galletas hay?', 'Hi ha 3 plats amb 4 galetes cadascun. Quantes galetes hi ha?', 'There are 3 plates with 4 biscuits each. How many biscuits are there?'), visual: { type: 'emoji', rows: ['🍪🍪🍪🍪', '🍪🍪🍪🍪', '🍪🍪🍪🍪'] },
      steps: [T('Son 3 grupos de 4: 4 + 4 + 4.', 'Són 3 grups de 4: 4 + 4 + 4.', 'It is 3 groups of 4: 4 + 4 + 4.'), T('3 × 4 = 12 galletas.', '3 × 4 = 12 galetes.', '3 × 4 = 12 biscuits.')] },
    make: equalGroups(5, 5),
  },
  '2P-M-7': {
    explain: [T('Repartir en partes iguales es dar a cada uno lo mismo hasta que no quede nada.', 'Repartir en parts iguals és donar a cadascun el mateix fins que no en quede res.', 'Sharing equally means giving everyone the same until nothing is left.'),
      T('Si repartes 12 entre 3, a cada uno le tocan 4, porque 3 × 4 = 12.', 'Si repartixes 12 entre 3, a cadascun li’n toquen 4, perquè 3 × 4 = 12.', 'If you share 12 between 3, each gets 4, because 3 × 4 = 12.')],
    example: { q: T('Reparto 10 cromos entre 2 amigos. ¿Cuántos le tocan a cada uno?', 'Repartisc 10 cromos entre 2 amics. Quants li’n toquen a cadascun?', 'I share 10 stickers between 2 friends. How many does each get?'), visual: { type: 'emoji', rows: ['🃏🃏🃏🃏🃏', '🃏🃏🃏🃏🃏'] },
      steps: [T('Doy uno a cada uno por turnos.', 'En done un a cadascun per torns.', 'I give one to each in turn.'), T('Cada uno recibe 5. 2 × 5 = 10.', 'Cadascun en rep 5. 2 × 5 = 10.', 'Each gets 5. 2 × 5 = 10.')] },
    make: share(5, [2, 3, 4, 5]),
  },
  '2P-M-8': {
    explain: [T('Sumar 10 hace subir una decena: solo cambia la cifra de las decenas. Sumar 100 hace subir una centena.', 'Sumar 10 fa pujar una desena: només canvia la xifra de les desenes. Sumar 100 fa pujar una centena.', 'Adding 10 goes up one ten: only the tens digit changes. Adding 100 goes up one hundred.'),
      T('Restar 10 o 100 hace bajar una decena o una centena.', 'Restar 10 o 100 fa baixar una desena o una centena.', 'Subtracting 10 or 100 goes down one ten or one hundred.')],
    example: { q: S('346 + 100 = ?'),
      steps: [T('Sumar 100 cambia solo las centenas: 3 → 4.', 'Sumar 100 canvia només les centenes: 3 → 4.', 'Adding 100 changes only the hundreds: 3 → 4.'), T('346 + 100 = 446.', '346 + 100 = 446.', '346 + 100 = 446.')] },
    make: mentalPowers([10, 100], 999),
  },
  '2P-M-9': {
    explain: [T('Un problema de dos pasos se resuelve en dos operaciones. Haz la primera, escribe el resultado y úsalo en la segunda.', 'Un problema de dos passos es resol en dues operacions. Fes la primera, escriu el resultat i usa’l en la segona.', 'A two-step problem needs two calculations. Do the first, write down the result and use it in the second.')],
    example: { q: T('Pau tiene 15 canicas, gana 8 y pierde 5. ¿Cuántas tiene?', 'Pau té 15 bales, en guanya 8 i en perd 5. Quantes en té?', 'Pau has 15 marbles, wins 8 and loses 5. How many does he have?'),
      steps: [T('Paso 1: gana 8. 15 + 8 = 23.', 'Pas 1: en guanya 8. 15 + 8 = 23.', 'Step 1: wins 8. 15 + 8 = 23.'), T('Paso 2: pierde 5. 23 − 5 = 18. Tiene 18.', 'Pas 2: en perd 5. 23 − 5 = 18. En té 18.', 'Step 2: loses 5. 23 − 5 = 18. He has 18.')] },
    make: twoStep(50),
  },
  '2P-M-10': {
    explain: [T('Estimar es decir una medida aproximada sin medir. Para hacerlo bien, compara con algo que conoces: tu palmo mide unos 15 cm y un paso, unos 50 cm.', 'Estimar és dir una mesura aproximada sense mesurar. Per a fer-ho bé, compara amb una cosa que coneixes: el teu pam mesura uns 15 cm i un pas, uns 50 cm.', 'Estimating means giving a rough measurement without measuring. Compare with something you know: your hand span is about 15 cm and a step about 50 cm.')],
    example: { q: T('¿Cuánto mide más o menos una puerta de alto?', 'Quant mesura més o menys una porta d’alt?', 'About how tall is a door?'),
      steps: [T('Una persona adulta mide unos 170 cm y la puerta es un poco más alta.', 'Una persona adulta mesura uns 170 cm i la porta és un poc més alta.', 'A grown-up is about 170 cm and a door is a bit taller.'), T('Unos 2 metros.', 'Uns 2 metres.', 'About 2 metres.')] },
    bank: [
      mc(T('¿Cuánto mide más o menos un lápiz?', 'Quant mesura més o menys un llapis?', 'About how long is a pencil?'), T('15 cm', '15 cm', '15 cm'), [T('15 m', '15 m', '15 m'), T('1 cm', '1 cm', '1 cm'), T('150 cm', '150 cm', '150 cm')], T('Es como un palmo.', 'És com un pam.', 'It is about one hand span.')),
      mc(T('¿Cuánto pesa más o menos una manzana?', 'Quant pesa més o menys una poma?', 'About how much does an apple weigh?'), T('200 g', '200 g', '200 g'), [T('20 kg', '20 kg', '20 kg'), T('2 g', '2 g', '2 g'), T('2 kg', '2 kg', '2 kg')], T('Un paquete de 1 kg de harina pesa como 5 manzanas.', 'Un paquet d’1 kg de farina pesa com 5 pomes.', 'A 1 kg bag of flour weighs about the same as 5 apples.')),
      mc(T('¿Cuánta agua cabe más o menos en un vaso?', 'Quanta aigua cap més o menys en un got?', 'About how much water does a glass hold?'), T('200 mL', '200 mL', '200 mL'), [T('20 L', '20 L', '20 L'), T('2 mL', '2 mL', '2 mL'), T('2 L', '2 L', '2 L')], T('Una botella grande de 1 litro llena unos 5 vasos.', 'Una botella gran d’1 litre ompli uns 5 gots.', 'A big 1-litre bottle fills about 5 glasses.')),
      mc(T('¿Cuánto mide más o menos el largo de un autobús?', 'Quant mesura més o menys la llargària d’un autobús?', 'About how long is a bus?'), T('12 m', '12 m', '12 m'), [T('12 cm', '12 cm', '12 cm'), T('120 m', '120 m', '120 m'), T('1 m', '1 m', '1 m')], T('Piensa en unos 8 coches en fila… o en 24 pasos tuyos.', 'Pensa en uns 8 cotxes en fila… o en 24 passos teus.', 'Think of about 24 of your steps.')),
      mc(T('¿Qué unidad usarías para medir la distancia entre dos ciudades?', 'Quina unitat usaries per a mesurar la distància entre dues ciutats?', 'Which unit would you use for the distance between two cities?'), T('kilómetros', 'quilòmetres', 'kilometres'), [T('centímetros', 'centímetres', 'centimetres'), T('litros', 'litres', 'litres'), T('gramos', 'grams', 'grams')], T('Para distancias muy largas se usa el kilómetro (1 000 m).', 'Per a distàncies molt llargues s’usa el quilòmetre (1 000 m).', 'Long distances are measured in kilometres (1,000 m).')),
      mc(T('¿Cuánto pesa más o menos un niño de 7 años?', 'Quant pesa més o menys un xiquet de 7 anys?', 'About how much does a 7-year-old weigh?'), T('25 kg', '25 kg', '25 kg'), [T('25 g', '25 g', '25 g'), T('250 kg', '250 kg', '250 kg'), T('2 kg', '2 kg', '2 kg')], T('Una bolsa de 1 kg multiplicada por veinticinco.', 'Una bossa d’1 kg multiplicada per vint-i-cinc.', 'About twenty-five 1 kg bags.')),
      mc(T('¿Cuánto mide más o menos el ancho de tu dedo?', 'Quant mesura més o menys l’amplària del teu dit?', 'About how wide is your finger?'), T('1 cm', '1 cm', '1 cm'), [T('1 m', '1 m', '1 m'), T('10 cm', '10 cm', '10 cm'), T('1 km', '1 km', '1 km')], T('Mira la regla: un centímetro es muy pequeño.', 'Mira el regle: un centímetre és molt xicotet.', 'Look at a ruler: a centimetre is tiny.')),
    ],
  },
  '2P-M-11': {
    explain: [T('El metro (m) sirve para medir cosas grandes y el centímetro (cm), para cosas pequeñas.', 'El metre (m) servix per a mesurar coses grans i el centímetre (cm), per a coses xicotetes.', 'Metres (m) measure big things and centimetres (cm) small things.'),
      T('1 metro = 100 centímetros. Medio metro = 50 cm.', '1 metre = 100 centímetres. Mig metre = 50 cm.', '1 metre = 100 centimetres. Half a metre = 50 cm.')],
    example: { q: T('¿Cuántos centímetros son 2 metros?', 'Quants centímetres són 2 metres?', 'How many centimetres are 2 metres?'),
      steps: [T('Cada metro son 100 cm.', 'Cada metre són 100 cm.', 'Each metre is 100 cm.'), T('2 × 100 = 200 cm.', '2 × 100 = 200 cm.', '2 × 100 = 200 cm.')] },
    make: (r) => {
      const k = int(r, 0, 2);
      if (k === 0) { const m = int(r, 1, 9); return q(X((l) => [`¿Cuántos centímetros son ${m} metros?`, `Quants centímetres són ${m} metres?`, `How many centimetres are ${m} metres?`][l]), m * 100, near(r, m * 100, { also: [m * 10, m * 1000, m] }), T('1 m = 100 cm. Multiplica por 100.', '1 m = 100 cm. Multiplica per 100.', '1 m = 100 cm. Multiply by 100.')); }
      if (k === 1) { const c = int(r, 10, 90); return q(X((l) => [`Tengo una cinta de ${c} cm. ¿Cuántos centímetros le faltan para medir 1 metro?`, `Tinc una cinta de ${c} cm. Quants centímetres li falten per a mesurar 1 metre?`, `I have a ribbon ${c} cm long. How many more centimetres to make 1 metre?`][l]), 100 - c, near(r, 100 - c, { also: [c, 10 - (c % 10)] }), T('1 metro son 100 cm: ¿cuánto le falta a tu número para llegar a 100?', '1 metre són 100 cm: quant li falta al teu nombre per a arribar a 100?', '1 metre is 100 cm: how far is your number from 100?')); }
      const OBJ = [[T('una goma', 'una goma', 'a rubber'), true], [T('un campo de fútbol', 'un camp de futbol', 'a football pitch'), false], [T('una hormiga', 'una formiga', 'an ant'), true], [T('una piscina', 'una piscina', 'a swimming pool'), false], [T('un cuaderno', 'un quadern', 'an exercise book'), true], [T('un pasillo', 'un corredor', 'a corridor'), false]] as const;
      const [o, small] = pick(r, OBJ);
      return mc(X((l) => [`Para medir ${o[0]}, ¿qué usarías?`, `Per a mesurar ${o[1]}, què usaries?`, `To measure ${o[2]}, what would you use?`][l]), small ? T('centímetros', 'centímetres', 'centimetres') : T('metros', 'metres', 'metres'), [small ? T('metros', 'metres', 'metres') : T('centímetros', 'centímetres', 'centimetres'), T('kilos', 'quilos', 'kilograms')],
        T('Para cosas pequeñas, centímetros; para cosas grandes, metros.', 'Per a coses xicotetes, centímetres; per a coses grans, metres.', 'Small things: centimetres. Big things: metres.'));
    },
  },
  '2P-M-12': {
    explain: [T('El kilo (kg) mide cuánto pesa algo. El litro (L) mide cuánto líquido cabe.', 'El quilo (kg) mesura quant pesa una cosa. El litre (L) mesura quant de líquid hi cap.', 'Kilograms (kg) measure how heavy something is. Litres (L) measure how much liquid fits.'),
      T('Medio kilo + medio kilo = 1 kilo. Dos botellas de medio litro = 1 litro.', 'Mig quilo + mig quilo = 1 quilo. Dues botelles de mig litre = 1 litre.', 'Half a kilo + half a kilo = 1 kilo. Two half-litre bottles = 1 litre.')],
    example: { q: T('¿Cuántas botellas de medio litro llenan una jarra de 2 litros?', 'Quantes botelles de mig litre omplin una gerra de 2 litres?', 'How many half-litre bottles fill a 2-litre jug?'),
      steps: [T('Dos botellas de medio litro son 1 litro.', 'Dues botelles de mig litre són 1 litre.', 'Two half-litre bottles make 1 litre.'), T('Para 2 litros hacen falta 4 botellas.', 'Per a 2 litres en calen 4 botelles.', 'For 2 litres you need 4 bottles.')] },
    make: (r) => {
      const k = int(r, 0, 2);
      if (k === 0) { const L = int(r, 1, 6); return q(X((l) => [`¿Cuántas botellas de medio litro llenan ${L} ${L === 1 ? 'litro' : 'litros'}?`, `Quantes botelles de mig litre omplin ${L} ${L === 1 ? 'litre' : 'litres'}?`, `How many half-litre bottles fill ${L} ${L === 1 ? 'litre' : 'litres'}?`][l]), 2 * L, near(r, 2 * L, { also: [L, L + 2], min: 1 }), T('En cada litro caben 2 botellas de medio litro.', 'En cada litre hi caben 2 botelles de mig litre.', 'Each litre holds 2 half-litre bottles.')); }
      if (k === 1) { const a = int(r, 1, 9), b = int(r, 1, 9); return q(X((l) => [`Una bolsa pesa ${a} kg y otra ${b} kg. ¿Cuánto pesan juntas?`, `Una bossa pesa ${a} kg i una altra ${b} kg. Quant pesen juntes?`, `One bag weighs ${a} kg and another ${b} kg. How much do they weigh together?`][l]), a + b, near(r, a + b, { also: [Math.abs(a - b), a * b] }), T('Juntas: suma los kilos.', 'Juntes: suma els quilos.', 'Together: add the kilograms.')); }
      const IT = [[T('el agua de una bañera', 'l’aigua d’una banyera', 'the water in a bath'), 'L'], [T('una sandía', 'una síndria', 'a watermelon'), 'kg'], [T('la leche de un cartón', 'la llet d’un cartó', 'the milk in a carton'), 'L'], [T('un saco de patatas', 'un sac de creïlles', 'a sack of potatoes'), 'kg'], [T('el zumo de una jarra', 'el suc d’una gerra', 'the juice in a jug'), 'L'], [T('un perro', 'un gos', 'a dog'), 'kg']] as const;
      const [o, u] = pick(r, IT);
      return mc(X((l) => [`Para medir ${o[0]}, ¿qué unidad usarías?`, `Per a mesurar ${o[1]}, quina unitat usaries?`, `Which unit would you use to measure ${o[2]}?`][l]), u === 'L' ? T('litros', 'litres', 'litres') : T('kilos', 'quilos', 'kilograms'), [u === 'L' ? T('kilos', 'quilos', 'kilograms') : T('litros', 'litres', 'litres'), T('metros', 'metres', 'metres')],
        T('Si es un líquido y quieres saber cuánto cabe, litros. Si quieres saber cuánto pesa, kilos.', 'Si és un líquid i vols saber quant hi cap, litres. Si vols saber quant pesa, quilos.', 'For how much liquid fits, use litres. For how heavy it is, kilograms.'));
    },
  },
  '2P-M-13': {
    explain: [T('Cuando la aguja larga está en el 12, es en punto. Cuando está en el 6, es «y media»: ha pasado media hora.', 'Quan l’agulla llarga està en el 12, és en punt. Quan està en el 6, és «i mitja»: ha passat mitja hora.', 'When the long hand is on 12, it is o’clock. When it is on 6, it is half past: half an hour has gone by.'),
      T('A las «y media», la aguja corta está entre dos números: la hora es el número que ya ha pasado.', 'A les «i mitja», l’agulla curta està entre dos nombres: l’hora és el nombre que ja ha passat.', 'At half past, the short hand is between two numbers: the hour is the one it has just passed.')],
    example: { q: T('¿Qué hora marca el reloj?', 'Quina hora marca el rellotge?', 'What time does the clock show?'), visual: { type: 'clock', h: 4, m: 30 },
      steps: [T('La aguja larga está en el 6: es «y media».', 'L’agulla llarga està en el 6: és «i mitja».', 'The long hand is on 6: half past.'), T('La corta ha pasado el 4: son las 4 y media.', 'La curta ha passat el 4: són les 4 i mitja.', 'The short hand has passed 4: it is half past 4.')] },
    make: clockRead(30),
  },
  '2P-M-14': {
    explain: [T('El euro (€) se divide en 100 céntimos. Hay monedas de 1, 2, 5, 10, 20 y 50 céntimos, y de 1 y 2 euros.', 'L’euro (€) es dividix en 100 cèntims. Hi ha monedes d’1, 2, 5, 10, 20 i 50 cèntims, i d’1 i 2 euros.', 'A euro (€) is split into 100 cents. There are 1, 2, 5, 10, 20 and 50 cent coins, and 1 and 2 euro coins.'),
      T('Para pagar, junta monedas hasta llegar al precio. Si das más, te devuelven el cambio.', 'Per a pagar, ajunta monedes fins a arribar al preu. Si dones més, et tornen el canvi.', 'To pay, put coins together until you reach the price. If you give more, you get change.')],
    example: { q: T('Un zumo cuesta 3 €. Pago con un billete de 5 €. ¿Cuánto me devuelven?', 'Un suc costa 3 €. Pague amb un bitllet de 5 €. Quant em tornen?', 'A juice costs €3. I pay with a €5 note. How much change do I get?'),
      steps: [T('Cuento desde 3 hasta 5: 4, 5.', 'Compte des de 3 fins a 5: 4, 5.', 'I count up from 3 to 5: 4, 5.'), T('Me devuelven 2 €.', 'Em tornen 2 €.', 'I get €2 back.')] },
    make: (r) => {
      if (r() < 0.3) { const c = pickN(r, [1, 2, 5, 10, 20, 50], 3); const tot = c.reduce((a, b) => a + b, 0); return q(X((l) => [`Tengo monedas de ${c.join(', ')} céntimos. ¿Cuántos céntimos tengo en total?`, `Tinc monedes de ${c.join(', ')} cèntims. Quants cèntims tinc en total?`, `I have coins of ${c.join(', ')} cents. How many cents do I have altogether?`][l]), tot, near(r, tot, { also: [tot + 10, tot - 5].filter((x) => x > 0) }), T('Empieza por la moneda más grande y suma las demás.', 'Comença per la moneda més gran i suma les altres.', 'Start with the biggest coin and add the others.')); }
      return money(9, false)(r);
    },
  },
  '2P-M-15': {
    explain: [T('Un polígono es una figura plana cerrada con lados rectos. Se llama según cuántos lados tiene.', 'Un polígon és una figura plana tancada amb costats rectes. Es diu segons quants costats té.', 'A polygon is a closed flat shape with straight sides. It is named by how many sides it has.'),
      T('3 lados: triángulo. 4: cuadrilátero. 5: pentágono. 6: hexágono.', '3 costats: triangle. 4: quadrilàter. 5: pentàgon. 6: hexàgon.', '3 sides: triangle. 4: quadrilateral. 5: pentagon. 6: hexagon.')],
    example: { q: T('¿Qué polígono es?', 'Quin polígon és?', 'Which polygon is it?'), visual: { type: 'shape', sides: 5 },
      steps: [T('Cuento los lados: 5.', 'Compte els costats: 5.', 'I count the sides: 5.'), T('Con 5 lados es un pentágono.', 'Amb 5 costats és un pentàgon.', 'With 5 sides it is a pentagon.')] },
    make: polygons(6),
  },
  '2P-M-16': {
    explain: [T('La circunferencia es la línea curva cerrada; el círculo es la línea y todo lo de dentro.', 'La circumferència és la línia corba tancada; el cercle és la línia i tot el de dins.', 'The circumference is the closed curved line; the circle is the line and everything inside it.'),
      T('Todos los puntos de la circunferencia están a la misma distancia del centro.', 'Tots els punts de la circumferència estan a la mateixa distància del centre.', 'Every point on the circumference is the same distance from the centre.')],
    example: { q: T('Un aro de baloncesto, ¿es una circunferencia o un círculo?', 'Un cércol de bàsquet, és una circumferència o un cercle?', 'Is a basketball hoop a circumference or a circle?'), visual: { type: 'shape', sides: 0, dash: true },
      steps: [T('El aro es solo el borde: por dentro está vacío.', 'El cércol és només la vora: per dins està buit.', 'The hoop is just the edge: it is empty inside.'), T('Es una circunferencia.', 'És una circumferència.', 'It is a circumference.')] },
    bank: (() => {
      const CF = T('circunferencia', 'circumferència', 'circumference (the edge)'), CI = T('círculo', 'cercle', 'circle (the whole disc)');
      const it = (o: readonly [string, string, string], edge: boolean, e: string) => mc(X((l) => [`${o[0]}, ¿se parece más a una circunferencia o a un círculo?`, `${o[1]}, s’assembla més a una circumferència o a un cercle?`, `${o[2]}: is it more like a circumference or a circle?`][l]), edge ? CF : CI, [edge ? CI : CF, T('polígono', 'polígon', 'polygon')], T('Si solo es el borde, circunferencia. Si está lleno por dentro, círculo.', 'Si només és la vora, circumferència. Si està ple per dins, cercle.', 'If it is just the edge, circumference. If it is filled in, circle.'), { visual: { type: 'emoji', rows: [e], big: true } });
      return [it(T('Un anillo', 'Un anell', 'A ring'), true, '💍'), it(T('Una moneda', 'Una moneda', 'A coin'), false, '🪙'), it(T('Una galleta redonda', 'Una galeta redona', 'A round biscuit'), false, '🍪'), it(T('Un aro', 'Un cércol', 'A hoop'), true, '⭕'), it(T('Una pizza', 'Una pizza', 'A pizza'), false, '🍕'), it(T('El borde de un vaso', 'La vora d’un got', 'The rim of a glass'), true, '🥛'),
        mc(T('¿Dónde está el centro de una circunferencia?', 'On està el centre d’una circumferència?', 'Where is the centre of a circle?'), T('A la misma distancia de todos los puntos del borde', 'A la mateixa distància de tots els punts de la vora', 'The same distance from every point on the edge'), [T('En el borde', 'En la vora', 'On the edge'), T('Fuera de la figura', 'Fora de la figura', 'Outside the shape')], T('El centro está justo en el medio.', 'El centre està just en el mig.', 'The centre is right in the middle.'))];
    })(),
  },
  '2P-M-17': {
    explain: [T('En una cuadrícula nos movemos por casillas: arriba, abajo, derecha o izquierda.', 'En una quadrícula ens movem per caselles: amunt, avall, dreta o esquerra.', 'On a grid we move square by square: up, down, right or left.'),
      T('Cada flecha es un paso de una casilla. Sigue las flechas en orden.', 'Cada fletxa és un pas d’una casella. Seguix les fletxes en ordre.', 'Each arrow is a one-square step. Follow the arrows in order.')],
    example: { q: T('El robot está en (1, 1) y sigue ➡️ ➡️ ⬆️. ¿Dónde acaba?', 'El robot està en (1, 1) i seguix ➡️ ➡️ ⬆️. On acaba?', 'The robot is at (1, 1) and follows ➡️ ➡️ ⬆️. Where does it end?'), visual: { type: 'grid', w: 4, h: 4, pts: [{ x: 1, y: 1, label: '🤖' }], axes: true },
      steps: [T('Dos a la derecha: de 1 a 3.', 'Dos a la dreta: d’1 a 3.', 'Two to the right: from 1 to 3.'), T('Uno arriba: de 1 a 2. Acaba en (3, 2).', 'Un amunt: d’1 a 2. Acaba en (3, 2).', 'One up: from 1 to 2. It ends at (3, 2).')] },
    make: gridPoints(5, true),
  },
  '2P-M-18': {
    explain: [T('Las figuras se pueden juntar para formar otras más grandes o partir en otras más pequeñas.', 'Les figures es poden ajuntar per a formar-ne altres de més grans o partir en altres de més xicotetes.', 'Shapes can be put together to make bigger shapes or split into smaller ones.'),
      T('Al juntar dos figuras, los lados que se tocan desaparecen por dentro.', 'En ajuntar dues figures, els costats que es toquen desapareixen per dins.', 'When two shapes are joined, the sides that touch disappear inside.')],
    example: { q: T('Junto dos cuadrados iguales, uno al lado del otro. ¿Qué figura sale?', 'Ajunte dos quadrats iguals, un al costat de l’altre. Quina figura n’ix?', 'I put two equal squares side by side. Which shape do I get?'), visual: { type: 'emoji', rows: ['🟦🟦'], big: true },
      steps: [T('El lado del medio queda dentro.', 'El costat del mig queda dins.', 'The middle side ends up inside.'), T('Sale un rectángulo.', 'N’ix un rectangle.', 'I get a rectangle.')] },
    bank: [
      q(T('¿Cuántos triángulos iguales forman este hexágono si lo corto desde el centro a cada esquina?', 'Quants triangles iguals formen este hexàgon si el talle des del centre a cada cantó?', 'How many equal triangles make this hexagon if I cut from the centre to each corner?'), 6, [3, 4, 8], T('Hay un triángulo por cada lado del hexágono.', 'Hi ha un triangle per cada costat de l’hexàgon.', 'There is one triangle for each side of the hexagon.'), { visual: { type: 'shape', sides: 6 } }),
      q(T('Con cuadrados pequeños formo un rectángulo de 3 filas y 4 columnas. ¿Cuántos cuadrados uso?', 'Amb quadrats xicotets forme un rectangle de 3 files i 4 columnes. Quants quadrats use?', 'I make a rectangle of 3 rows and 4 columns from small squares. How many squares do I use?'), 12, [7, 10, 14], T('3 filas de 4: 4 + 4 + 4.', '3 files de 4: 4 + 4 + 4.', '3 rows of 4: 4 + 4 + 4.'), { visual: { type: 'emoji', rows: ['🟦🟦🟦🟦', '🟦🟦🟦🟦', '🟦🟦🟦🟦'] } }),
      mc(T('Corto un rectángulo por una diagonal. ¿Qué figuras salen?', 'Talle un rectangle per una diagonal. Quines figures n’ixen?', 'I cut a rectangle along a diagonal. Which shapes do I get?'), T('dos triángulos', 'dos triangles', 'two triangles'), [T('dos cuadrados', 'dos quadrats', 'two squares'), T('dos círculos', 'dos cercles', 'two circles'), T('un pentágono', 'un pentàgon', 'a pentagon')], T('La diagonal va de una esquina a la de enfrente.', 'La diagonal va d’un cantó al de davant.', 'The diagonal goes from one corner to the opposite one.')),
      mc(T('Junto dos triángulos iguales por un lado. ¿Qué figura NO puede salir?', 'Ajunte dos triangles iguals per un costat. Quina figura NO pot eixir?', 'I join two equal triangles along one side. Which shape can NOT be made?'), T('un círculo', 'un cercle', 'a circle'), [T('un cuadrado', 'un quadrat', 'a square'), T('un triángulo más grande', 'un triangle més gran', 'a bigger triangle'), T('un rombo', 'un rombe', 'a rhombus')], T('Con lados rectos nunca sale una figura redonda.', 'Amb costats rectes mai n’ix una figura redona.', 'Straight sides can never make a round shape.')),
      q(T('Un cuadrado grande está hecho de cuadrados pequeños: 3 en cada lado. ¿Cuántos pequeños hay?', 'Un quadrat gran està fet de quadrats xicotets: 3 en cada costat. Quants xicotets n’hi ha?', 'A big square is made of small squares: 3 along each side. How many small squares are there?'), 9, [6, 12, 3], T('3 filas de 3.', '3 files de 3.', '3 rows of 3.'), { visual: { type: 'emoji', rows: ['🟨🟨🟨', '🟨🟨🟨', '🟨🟨🟨'] } }),
      q(T('¿Cuántos lados tiene la figura que sale al juntar un cuadrado y un triángulo encima (como una casa)?', 'Quants costats té la figura que ix en ajuntar un quadrat i un triangle damunt (com una casa)?', 'How many sides does the shape have when you put a triangle on top of a square (like a house)?'), 5, [4, 6, 7], T('El lado que se tocan desaparece: 4 del cuadrado + 3 del triángulo − 2.', 'El costat que es toquen desapareix: 4 del quadrat + 3 del triangle − 2.', 'The touching side disappears: 4 from the square + 3 from the triangle − 2.'), { visual: { type: 'shape', pts: [[0, 0], [4, 0], [4, 3], [2, 5], [0, 3]] } }),
    ],
  },
  '2P-M-19': {
    explain: [T('A nuestro alrededor hay líneas rectas (el borde de una mesa) y curvas (el borde de un plato).', 'Al nostre voltant hi ha línies rectes (la vora d’una taula) i corbes (la vora d’un plat).', 'All around us there are straight lines (the edge of a table) and curved lines (the edge of a plate).'),
      T('Una línea poligonal está hecha de trozos rectos; una curva no tiene ningún trozo recto.', 'Una línia poligonal està feta de trossos rectes; una corba no té cap tros recte.', 'A polygonal line is made of straight pieces; a curve has no straight pieces at all.')],
    example: { q: T('Las letras L y O, ¿están hechas de rectas o de curvas?', 'Les lletres L i O, estan fetes de rectes o de corbes?', 'Are the letters L and O made of straight or curved lines?'),
      steps: [T('La L tiene dos trozos rectos.', 'La L té dos trossos rectes.', 'L has two straight pieces.'), T('La O es una curva cerrada.', 'La O és una corba tancada.', 'O is a closed curve.')] },
    bank: (() => {
      const RR = T('solo rectas', 'només rectes', 'only straight lines'), CC = T('solo curvas', 'només corbes', 'only curves'), MX = T('rectas y curvas', 'rectes i corbes', 'straight and curved lines');
      const L = (s: string, a: readonly [string, string, string]) => mc(X((l) => [`La letra ${s}, ¿de qué líneas está hecha?`, `La lletra ${s}, de quines línies està feta?`, `What lines is the letter ${s} made of?`][l]), a, [RR, CC, MX].filter((x) => x !== a), T('Recórrela con el dedo: ¿se tuerce?', 'Recorre-la amb el dit: es torça?', 'Trace it with your finger: does it bend?'), { visual: { type: 'emoji', rows: [s], big: true } });
      return [L('E', RR), L('O', CC), L('D', MX), L('T', RR), L('C', CC), L('P', MX), L('H', RR), L('S', CC)];
    })(),
  },
  '2P-M-20': {
    explain: [T('Si en una bolsa hay más bolas de un color, es más probable sacar ese color.', 'Si en una bossa hi ha més boles d’un color, és més probable traure eixe color.', 'If a bag has more balls of one colour, that colour is more likely to come out.'),
      T('Más probable no quiere decir seguro: a veces sale el otro color.', 'Més probable no vol dir segur: a vegades ix l’altre color.', 'More likely does not mean certain: sometimes the other colour comes out.')],
    example: { q: T('En la bolsa hay 5 bolas rojas y 1 azul. ¿Qué es más probable sacar?', 'En la bossa hi ha 5 boles roges i 1 blava. Què és més probable traure?', 'The bag has 5 red balls and 1 blue. Which is more likely?'), visual: { type: 'emoji', rows: ['🔴🔴🔴🔴🔴🔵'] },
      steps: [T('Hay más rojas que azules.', 'Hi ha més roges que blaves.', 'There are more red than blue.'), T('Es más probable sacar roja.', 'És més probable traure roja.', 'Red is more likely.')] },
    make: chance(['likely']),
  },
  '2P-M-21': {
    explain: [T('Una tabla de recuento sirve para contar datos. Por cada dato hacemos una marca: ||||. La quinta marca cruza las cuatro anteriores.', 'Una taula de recompte servix per a comptar dades. Per cada dada fem una marca: ||||. La cinquena marca creua les quatre anteriors.', 'A tally chart helps us count data. We make one mark for each answer: ||||. The fifth mark crosses the first four.'),
      T('Al final contamos las marcas de 5 en 5.', 'Al final comptem les marques de 5 en 5.', 'At the end we count the marks in fives.')],
    example: { q: T('Frutas favoritas: 🍎🍌🍎🍎🍌🍓🍎. ¿Cuántas manzanas?', 'Fruites preferides: 🍎🍌🍎🍎🍌🍓🍎. Quantes pomes?', 'Favourite fruits: 🍎🍌🍎🍎🍌🍓🍎. How many apples?'),
      steps: [T('Hago una marca por cada manzana: ||||.', 'Faig una marca per cada poma: ||||.', 'I make a mark for each apple: ||||.'), T('Hay 4 manzanas.', 'Hi ha 4 pomes.', 'There are 4 apples.')] },
    make: tally(14),
  },
  '2P-M-22': {
    explain: [T('Un diagrama de barras muestra datos con barras. Cuanto más alta la barra, más hay.', 'Un diagrama de barres mostra dades amb barres. Com més alta és la barra, més n’hi ha.', 'A bar chart shows data with bars. The taller the bar, the more there are.'),
      T('Para leer una barra, mira hasta dónde llega en los números de la izquierda.', 'Per a llegir una barra, mira fins on arriba en els nombres de l’esquerra.', 'To read a bar, see how far up it reaches on the numbers on the left.')],
    example: { q: T('¿Cuántos votos tiene la manzana?', 'Quants vots té la poma?', 'How many votes did apple get?'), visual: { type: 'chart', kind: 'bar', x: ['🍎', '🍌', '🍓'], y: [6, 3, 4], yMax: 8, yStep: 1 },
      steps: [T('Busco la barra de la manzana.', 'Busque la barra de la poma.', 'I find the apple bar.'), T('Llega hasta el 6: 6 votos.', 'Arriba fins al 6: 6 vots.', 'It reaches 6: 6 votes.')] },
    make: barChart(10, 3),
  },
  '2P-M-23': {
    explain: [T('En una serie de números, cada número se obtiene del anterior siempre igual: por ejemplo, sumando 2.', 'En una sèrie de nombres, cada nombre s’obté de l’anterior sempre igual: per exemple, sumant 2.', 'In a number pattern, each number comes from the one before in the same way: for example, adding 2.'),
      T('Para seguirla, calcula cuánto cambia de uno al siguiente.', 'Per a continuar-la, calcula quant canvia d’un al següent.', 'To carry it on, work out how much it changes each time.')],
    example: { q: S('5, 10, 15, 20, ?'),
      steps: [T('De 5 a 10 suma 5; de 10 a 15, otra vez 5.', 'De 5 a 10 suma 5; de 10 a 15, una altra vegada 5.', 'From 5 to 10 is +5; from 10 to 15, +5 again.'), T('20 + 5 = 25.', '20 + 5 = 25.', '20 + 5 = 25.')] },
    make: sequence(30, [2, 3, 5, 10]),
  },
  '2P-M-24': {
    explain: [T('Un algoritmo es una lista de órdenes en un orden concreto. Si cambias el orden, el resultado puede cambiar.', 'Un algorisme és una llista d’ordres en un ordre concret. Si canvies l’ordre, el resultat pot canviar.', 'An algorithm is a list of instructions in a set order. If you change the order, the result can change.')],
    example: { q: T('El robot está en (0, 0) y sigue ⬆️ ⬆️ ➡️. ¿Dónde acaba?', 'El robot està en (0, 0) i seguix ⬆️ ⬆️ ➡️. On acaba?', 'The robot is at (0, 0) and follows ⬆️ ⬆️ ➡️. Where does it end?'), visual: { type: 'grid', w: 4, h: 4, pts: [{ x: 0, y: 0, label: '🤖' }], axes: true },
      steps: [T('Dos arriba: (0, 2).', 'Dos amunt: (0, 2).', 'Two up: (0, 2).'), T('Uno a la derecha: (1, 2).', 'Un a la dreta: (1, 2).', 'One right: (1, 2).')] },
    make: robot(4),
  },
  '2P-M-25': {
    explain: [T('El signo = quiere decir que los dos lados valen lo mismo, como una balanza equilibrada.', 'El signe = vol dir que els dos costats valen el mateix, com una balança equilibrada.', 'The = sign means both sides are worth the same, like a balanced scale.'),
      T('Para encontrar el número que falta, piensa qué hace que los dos lados sean iguales.', 'Per a trobar el nombre que falta, pensa què fa que els dos costats siguen iguals.', 'To find the missing number, think what makes both sides equal.')],
    example: { q: S('12 + ? = 20'), visual: { type: 'balance', left: '12 + ?', right: '20' },
      steps: [T('De 12 a 20 faltan 8.', 'De 12 a 20 en falten 8.', 'From 12 to 20 is 8.'), T('12 + 8 = 20. El número que falta es 8.', '12 + 8 = 20. El nombre que falta és 8.', '12 + 8 = 20. The missing number is 8.')] },
    make: gapEquation(50, ['+', '−']),
  },
  '2P-M-26': {
    explain: [T('En los juegos de estrategia, antes de mover piensa qué hará el otro jugador. Busca jugadas que te dejen siempre ganar.', 'En els jocs d’estratègia, abans de moure pensa què farà l’altre jugador. Busca jugades que et deixen guanyar sempre.', 'In strategy games, before you move think what the other player will do. Look for moves that always let you win.')],
    example: { q: T('Hay 4 fichas. Cada uno quita 1 o 2. Gana quien quita la última. ¿Cuántas quitas?', 'Hi ha 4 fitxes. Cadascú en lleva 1 o 2. Guanya qui lleva l’última. Quantes en lleves?', 'There are 4 counters. Each player removes 1 or 2. Whoever takes the last wins. How many do you take?'), visual: { type: 'emoji', rows: ['🟣🟣🟣🟣'] },
      steps: [T('Si dejo 3, el otro quite lo que quite, yo me llevo la última.', 'Si en deixe 3, l’altre en lleve les que en lleve, jo m’emporte l’última.', 'If I leave 3, whatever the other player takes, I take the last one.'), T('Quito 1.', 'En lleve 1.', 'I take 1.')] },
    make: nim(10),
  },
};
export default P;

