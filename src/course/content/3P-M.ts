import type { ContentPack } from '../types';
import { int, mc, pick, q, S, T, X } from '../lib';
import { addCarry, angles, barChart, CAP, clockRead, compareOrder, convert, diceCoins, divide, fractions, gapEquation, gridPoints, LEN, loops, MASS, money, mulDigits, mulTable, nim, oneStep, perimeter, placeValue, properties, radiusDiameter, roundWhole, sequence, share, subBorrow, tally, triangles, twoStep, averages } from '../gens';

const both = (...gs: ((r: () => number) => ReturnType<ReturnType<typeof placeValue>>)[]) => (r: () => number) => gs[int(r, 0, gs.length - 1)](r);

const P: ContentPack = {
  '3P-M-1': {
    explain: [T('Diez centenas forman una unidad de millar: 1 000. Un número de cuatro cifras tiene unidades de millar, centenas, decenas y unidades.', 'Deu centenes formen una unitat de miler: 1 000. Un nombre de quatre xifres té unitats de miler, centenes, desenes i unitats.', 'Ten hundreds make a thousand: 1,000. A four-digit number has thousands, hundreds, tens and ones.'),
      T('En el 4 625, el 4 vale 4 000, el 6 vale 600, el 2 vale 20 y el 5 vale 5.', 'En el 4 625, el 4 val 4 000, el 6 val 600, el 2 val 20 i el 5 val 5.', 'In 4,625, the 4 is worth 4,000, the 6 is worth 600, the 2 is worth 20 and the 5 is worth 5.')],
    example: { q: T('¿Qué número es 3 000 + 400 + 7?', 'Quin nombre és 3 000 + 400 + 7?', 'Which number is 3,000 + 400 + 7?'),
      steps: [T('3 millares, 4 centenas, 0 decenas y 7 unidades.', '3 milers, 4 centenes, 0 desenes i 7 unitats.', '3 thousands, 4 hundreds, 0 tens and 7 ones.'), T('No hay decenas: escribo un 0 en su lugar. Es 3 407.', 'No hi ha desenes: escric un 0 en el seu lloc. És 3 407.', 'There are no tens: I write a 0 in their place. It is 3,407.')] },
    make: placeValue(4),
  },
  '3P-M-2': {
    explain: [T('En la recta numérica, los números están ordenados: más a la derecha, mayor.', 'En la recta numèrica, els nombres estan ordenats: més a la dreta, major.', 'On the number line, numbers are in order: further right means bigger.'),
      T('Para comparar dos números de cuatro cifras, compara cifra a cifra empezando por los millares.', 'Per a comparar dos nombres de quatre xifres, compara xifra a xifra començant pels milers.', 'To compare two four-digit numbers, compare digit by digit starting with the thousands.')],
    example: { q: T('¿Cuál es mayor, 5 360 o 5 306?', 'Quin és major, 5 360 o 5 306?', 'Which is bigger, 5,360 or 5,306?'),
      steps: [T('Millares iguales (5) y centenas iguales (3).', 'Milers iguals (5) i centenes iguals (3).', 'Same thousands (5) and same hundreds (3).'), T('Decenas: 6 y 0. 5 360 es mayor.', 'Desenes: 6 i 0. 5 360 és major.', 'Tens: 6 and 0. 5,360 is bigger.')] },
    make: compareOrder(9999, 1000),
  },
  '3P-M-3': {
    explain: [T('Redondear es cambiar un número por otro «redondo» que esté cerca. Así es más fácil calcular de cabeza.', 'Arredonir és canviar un nombre per un altre «rodó» que estiga a prop. Així és més fàcil calcular de cap.', 'Rounding means swapping a number for a nearby "round" one. It makes mental maths easier.'),
      T('Para redondear a la decena, mira las unidades: si son 5 o más, sube; si no, baja.', 'Per a arredonir a la desena, mira les unitats: si són 5 o més, puja; si no, baixa.', 'To round to the nearest ten, look at the ones: 5 or more rounds up; otherwise down.')],
    example: { q: T('Redondea 368 a la decena más cercana.', 'Arredonix 368 a la desena més pròxima.', 'Round 368 to the nearest ten.'), visual: { type: 'line', min: 360, max: 370, marks: [360, 361, 362, 363, 364, 365, 366, 367, 368, 369, 370], labels: [360, 365, 370], point: 368 },
      steps: [T('368 está entre 360 y 370.', '368 està entre 360 i 370.', '368 is between 360 and 370.'), T('Las unidades son 8 (5 o más): sube a 370.', 'Les unitats són 8 (5 o més): puja a 370.', 'The ones digit is 8 (5 or more): round up to 370.')] },
    make: roundWhole(9999, [10, 100]),
  },
  '3P-M-4': {
    explain: [T('Con números grandes se suma y se resta igual que con los pequeños: en columna, empezando por las unidades.', 'Amb nombres grans se suma i es resta igual que amb els xicotets: en columna, començant per les unitats.', 'With big numbers we add and subtract just like with small ones: in columns, starting with the ones.'),
      T('Antes de empezar, estima el resultado redondeando: así sabrás si tu respuesta tiene sentido.', 'Abans de començar, estima el resultat arredonint: així sabràs si la teua resposta té sentit.', 'Before you start, estimate by rounding: then you will know if your answer makes sense.')],
    example: { q: S('2 748 + 1 365 = ?'),
      steps: [T('Estimo: 2 700 + 1 400 ≈ 4 100.', 'Estime: 2 700 + 1 400 ≈ 4 100.', 'Estimate: 2,700 + 1,400 ≈ 4,100.'), T('8 + 5 = 13, pongo 3 y me llevo 1. 4 + 6 + 1 = 11, pongo 1 y me llevo 1. 7 + 3 + 1 = 11, pongo 1 y me llevo 1. 2 + 1 + 1 = 4.', '8 + 5 = 13, pose 3 i me’n porte 1. 4 + 6 + 1 = 11, pose 1 i me’n porte 1. 7 + 3 + 1 = 11, pose 1 i me’n porte 1. 2 + 1 + 1 = 4.', '8 + 5 = 13, write 3 carry 1. 4 + 6 + 1 = 11, write 1 carry 1. 7 + 3 + 1 = 11, write 1 carry 1. 2 + 1 + 1 = 4.'), T('Resultado: 4 113. Se parece a la estimación. ✓', 'Resultat: 4 113. S’assembla a l’estimació. ✓', 'Answer: 4,113. Close to the estimate. ✓')] },
    make: both(addCarry(4), subBorrow(4), addCarry(3)),
  },
  '3P-M-5': {
    explain: [T('Las tablas de multiplicar son las multiplicaciones de los números del 1 al 10. Saberlas de memoria ahorra mucho tiempo.', 'Les taules de multiplicar són les multiplicacions dels nombres de l’1 al 10. Saber-les de memòria estalvia molt de temps.', 'Times tables are the multiplications of the numbers 1 to 10. Knowing them by heart saves lots of time.'),
      T('Trucos: ×2 es el doble; ×5 acaba en 0 o 5; ×10 añade un 0; ×9: el resultado de 9 × 4 es 36, y 3 + 6 = 9.', 'Trucs: ×2 és el doble; ×5 acaba en 0 o 5; ×10 afig un 0; ×9: el resultat de 9 × 4 és 36, i 3 + 6 = 9.', 'Tips: ×2 is double; ×5 ends in 0 or 5; ×10 adds a 0; ×9: 9 × 4 = 36 and 3 + 6 = 9.')],
    example: { q: S('7 × 8 = ?'),
      steps: [T('Si me sé 7 × 7 = 49, sumo 7 más.', 'Si sé 7 × 7 = 49, sume 7 més.', 'If I know 7 × 7 = 49, I add 7 more.'), T('49 + 7 = 56.', '49 + 7 = 56.', '49 + 7 = 56.')] },
    make: mulTable([2, 3, 4, 5, 6, 7, 8, 9, 10]),
  },
  '3P-M-6': {
    explain: [T('Para multiplicar un número grande por una cifra, multiplica cada cifra empezando por las unidades.', 'Per a multiplicar un nombre gran per una xifra, multiplica cada xifra començant per les unitats.', 'To multiply a big number by a single digit, multiply each digit starting with the ones.'),
      T('Si un resultado pasa de 9, escribe las unidades y lleva las decenas a la columna siguiente.', 'Si un resultat passa de 9, escriu les unitats i porta les desenes a la columna següent.', 'If a result is over 9, write the ones and carry the tens to the next column.')],
    example: { q: S('34 × 6 = ?'),
      steps: [T('4 × 6 = 24: pongo 4 y me llevo 2.', '4 × 6 = 24: pose 4 i me’n porte 2.', '4 × 6 = 24: write 4, carry 2.'), T('3 × 6 = 18, más 2 = 20. Resultado: 204.', '3 × 6 = 18, més 2 = 20. Resultat: 204.', '3 × 6 = 18, plus 2 = 20. Answer: 204.')] },
    make: both(mulDigits(2, 1), mulDigits(3, 1)),
  },
  '3P-M-7': {
    explain: [T('Propiedad conmutativa: el orden no cambia el resultado. 4 × 7 = 7 × 4.', 'Propietat commutativa: l’ordre no canvia el resultat. 4 × 7 = 7 × 4.', 'Commutative property: order does not change the result. 4 × 7 = 7 × 4.'),
      T('Propiedad asociativa: puedes agrupar como quieras. (2 × 5) × 3 = 2 × (5 × 3).', 'Propietat associativa: pots agrupar com vulgues. (2 × 5) × 3 = 2 × (5 × 3).', 'Associative property: you can group them any way. (2 × 5) × 3 = 2 × (5 × 3).')],
    example: { q: S('2 × 7 × 5 = ?'),
      steps: [T('Cambio el orden para que sea fácil: 2 × 5 × 7.', 'Canvie l’ordre perquè siga fàcil: 2 × 5 × 7.', 'I change the order to make it easy: 2 × 5 × 7.'), T('2 × 5 = 10, y 10 × 7 = 70.', '2 × 5 = 10, i 10 × 7 = 70.', '2 × 5 = 10, and 10 × 7 = 70.')] },
    make: properties(['comm', 'assoc']),
  },
  '3P-M-8': {
    explain: [T('Dividir es repartir en partes iguales. 20 ÷ 4 quiere decir «20 repartido entre 4».', 'Dividir és repartir en parts iguals. 20 ÷ 4 vol dir «20 repartit entre 4».', 'Dividing is sharing equally. 20 ÷ 4 means "20 shared between 4".'),
      T('La división es la operación contraria a la multiplicación: 20 ÷ 4 = 5 porque 4 × 5 = 20.', 'La divisió és l’operació contrària a la multiplicació: 20 ÷ 4 = 5 perquè 4 × 5 = 20.', 'Division is the opposite of multiplication: 20 ÷ 4 = 5 because 4 × 5 = 20.')],
    example: { q: T('Reparto 15 globos entre 3 niños. ¿Cuántos tiene cada uno?', 'Repartisc 15 globus entre 3 xiquets. Quants en té cadascun?', 'I share 15 balloons between 3 children. How many does each get?'), visual: { type: 'emoji', rows: ['🎈🎈🎈🎈🎈', '🎈🎈🎈🎈🎈', '🎈🎈🎈🎈🎈'] },
      steps: [T('15 ÷ 3: ¿qué número por 3 da 15?', '15 ÷ 3: quin nombre per 3 dona 15?', '15 ÷ 3: what times 3 makes 15?'), T('3 × 5 = 15. Cada uno tiene 5.', '3 × 5 = 15. Cadascun en té 5.', '3 × 5 = 15. Each gets 5.')] },
    make: share(9, [2, 3, 4, 5, 6]),
  },
  '3P-M-9': {
    explain: [T('Para dividir por una cifra, busca en la tabla de ese número cuál se acerca más sin pasarse.', 'Per a dividir per una xifra, busca en la taula d’eixe nombre quin s’acosta més sense passar-se’n.', 'To divide by a single digit, look in that times table for the closest answer that does not go over.')],
    example: { q: S('56 ÷ 7 = ?'),
      steps: [T('Busco en la tabla del 7: 7 × 8 = 56.', 'Busque en la taula del 7: 7 × 8 = 56.', 'I look in the 7 times table: 7 × 8 = 56.'), T('56 ÷ 7 = 8.', '56 ÷ 7 = 8.', '56 ÷ 7 = 8.')] },
    make: divide(10, [2, 3, 4, 5, 6, 7, 8, 9]),
  },
  '3P-M-10': {
    explain: [T('Una fracción es una parte de algo partido en trozos iguales. La mitad (1/2) es una de dos partes; un tercio (1/3), una de tres; un cuarto (1/4), una de cuatro.', 'Una fracció és una part d’una cosa partida en trossos iguals. La meitat (1/2) és una de dues parts; un terç (1/3), una de tres; un quart (1/4), una de quatre.', 'A fraction is a part of something cut into equal pieces. A half (1/2) is one of two parts; a third (1/3), one of three; a quarter (1/4), one of four.'),
      T('Las partes tienen que ser iguales. Si no, no son mitades ni cuartos.', 'Les parts han de ser iguals. Si no, no són meitats ni quarts.', 'The parts must be equal. If not, they are not halves or quarters.')],
    example: { q: T('¿Qué fracción está coloreada?', 'Quina fracció està acolorida?', 'Which fraction is shaded?'), visual: { type: 'frac', n: 1, d: 4, shape: 'circle' },
      steps: [T('La pizza está partida en 4 partes iguales.', 'La pizza està partida en 4 parts iguals.', 'The pizza is cut into 4 equal parts.'), T('Hay 1 coloreada: 1/4, un cuarto.', 'N’hi ha 1 acolorida: 1/4, un quart.', '1 is shaded: 1/4, a quarter.')] },
    make: fractions(['read', 'of', 'parts'], 4),
  },
  '3P-M-11': {
    explain: [T('Para resolver un problema: 1) lee y busca la pregunta; 2) piensa qué operación necesitas; 3) calcula; 4) comprueba que la respuesta tiene sentido.', 'Per a resoldre un problema: 1) llig i busca la pregunta; 2) pensa quina operació necessites; 3) calcula; 4) comprova que la resposta té sentit.', 'To solve a problem: 1) read it and find the question; 2) decide which operation you need; 3) calculate; 4) check the answer makes sense.')],
    example: { q: T('En cada caja hay 6 huevos. ¿Cuántos huevos hay en 4 cajas?', 'En cada caixa hi ha 6 ous. Quants ous hi ha en 4 caixes?', 'Each box has 6 eggs. How many eggs are there in 4 boxes?'),
      steps: [T('Es la misma cantidad muchas veces: multiplico.', 'És la mateixa quantitat moltes vegades: multiplique.', 'The same amount many times: I multiply.'), T('4 × 6 = 24 huevos.', '4 × 6 = 24 ous.', '4 × 6 = 24 eggs.')] },
    make: both(oneStep(60), twoStep(80, true)),
  },
  '3P-M-12': {
    explain: [T('1 metro (m) = 10 decímetros (dm) = 100 centímetros (cm) = 1 000 milímetros (mm).', '1 metre (m) = 10 decímetres (dm) = 100 centímetres (cm) = 1 000 mil·límetres (mm).', '1 metre (m) = 10 decimetres (dm) = 100 centimetres (cm) = 1,000 millimetres (mm).'),
      T('Cada escalón hacia una unidad más pequeña es multiplicar por 10.', 'Cada graó cap a una unitat més xicoteta és multiplicar per 10.', 'Each step down to a smaller unit means multiplying by 10.')],
    example: { q: S('3 m = ? cm'), visual: { type: 'ladder', units: ['m', 'dm', 'cm', 'mm'], from: 0, to: 2 },
      steps: [T('De m a cm bajo 2 escalones: × 10 × 10 = × 100.', 'De m a cm baixe 2 graons: × 10 × 10 = × 100.', 'From m to cm is 2 steps down: × 10 × 10 = × 100.'), T('3 × 100 = 300 cm.', '3 × 100 = 300 cm.', '3 × 100 = 300 cm.')] },
    make: convert(LEN.slice(3), [['m', 'cm'], ['m', 'dm'], ['dm', 'cm'], ['cm', 'mm'], ['cm', 'm'], ['mm', 'cm']]),
  },
  '3P-M-13': {
    explain: [T('Cada magnitud tiene su instrumento: la regla o la cinta métrica miden longitudes; la balanza, masas; el reloj, el tiempo; la jarra medidora, capacidades; el termómetro, la temperatura.', 'Cada magnitud té el seu instrument: el regle o la cinta mètrica mesuren longituds; la balança, masses; el rellotge, el temps; la gerra mesuradora, capacitats; el termòmetre, la temperatura.', 'Each quantity has its tool: a ruler or tape measure for length; scales for mass; a clock for time; a measuring jug for capacity; a thermometer for temperature.')],
    example: { q: T('¿Con qué medirías cuánto pesa tu mochila?', 'Amb què mesuraries quant pesa la teua motxilla?', 'What would you use to find how heavy your rucksack is?'),
      steps: [T('Pesar es medir la masa.', 'Pesar és mesurar la massa.', 'Weighing means measuring mass.'), T('Uso una balanza.', 'Use una balança.', 'I use scales.')] },
    bank: (() => {
      const I = { reg: T('una regla', 'un regle', 'a ruler'), cin: T('una cinta métrica', 'una cinta mètrica', 'a tape measure'), bal: T('una balanza', 'una balança', 'scales'), rel: T('un reloj', 'un rellotge', 'a clock'), jar: T('una jarra medidora', 'una gerra mesuradora', 'a measuring jug'), ter: T('un termómetro', 'un termòmetre', 'a thermometer'), cro: T('un cronómetro', 'un cronòmetre', 'a stopwatch') };
      const B = (qq: readonly [string, string, string], a: readonly [string, string, string], w: (readonly [string, string, string])[], h: readonly [string, string, string]) => mc(qq, a, w, h);
      return [
        B(T('¿Con qué medirías el largo de tu cuaderno?', 'Amb què mesuraries la llargària del teu quadern?', 'What would you use to measure the length of your exercise book?'), I.reg, [I.bal, I.ter, I.jar], T('Es una longitud pequeña.', 'És una longitud xicoteta.', 'It is a short length.')),
        B(T('¿Con qué medirías el largo de la clase?', 'Amb què mesuraries la llargària de la classe?', 'What would you use to measure the length of the classroom?'), I.cin, [I.reg, I.bal, I.rel], T('Es una longitud grande: necesitas algo largo y flexible.', 'És una longitud gran: necessites una cosa llarga i flexible.', 'It is a long length: you need something long and bendy.')),
        B(T('¿Con qué sabes si tienes fiebre?', 'Amb què saps si tens febre?', 'What tells you whether you have a temperature?'), I.ter, [I.bal, I.rel, I.reg], T('La fiebre es una temperatura alta.', 'La febre és una temperatura alta.', 'A fever is a high temperature.')),
        B(T('¿Con qué medirías cuánta agua cabe en una botella?', 'Amb què mesuraries quanta aigua cap en una botella?', 'What would you use to measure how much water a bottle holds?'), I.jar, [I.bal, I.cin, I.ter], T('Es una capacidad: se mide en litros.', 'És una capacitat: es mesura en litres.', 'It is capacity: measured in litres.')),
        B(T('¿Con qué medirías cuánto tardas en correr 50 metros?', 'Amb què mesuraries quant tardes a córrer 50 metres?', 'What would you use to time a 50-metre run?'), I.cro, [I.ter, I.reg, I.jar], T('Es un tiempo corto que hay que medir con precisión.', 'És un temps curt que cal mesurar amb precisió.', 'It is a short time that needs measuring accurately.')),
        B(T('¿Con qué medirías la masa de unas manzanas?', 'Amb què mesuraries la massa d’unes pomes?', 'What would you use to measure the mass of some apples?'), I.bal, [I.jar, I.cin, I.rel], T('La masa es lo que pesa.', 'La massa és el que pesa.', 'Mass is how heavy something is.')),
        q(T('Mido un lápiz con la regla: empieza en el 0 y acaba en el 14. ¿Cuántos centímetros mide?', 'Mesure un llapis amb el regle: comença en el 0 i acaba en el 14. Quants centímetres mesura?', 'I measure a pencil with a ruler: it starts at 0 and ends at 14. How many centimetres long is it?'), 14, [13, 15, 140], T('Si empieza en 0, el número del final es lo que mide.', 'Si comença en 0, el nombre del final és el que mesura.', 'If it starts at 0, the number at the end is the length.')),
        q(T('Mido una goma con la regla: empieza en el 2 y acaba en el 7. ¿Cuántos centímetros mide?', 'Mesure una goma amb el regle: comença en el 2 i acaba en el 7. Quants centímetres mesura?', 'I measure a rubber: it starts at 2 and ends at 7. How many centimetres long is it?'), 5, [7, 9, 2], T('No empieza en 0: resta el final menos el principio.', 'No comença en 0: resta el final menys el principi.', 'It does not start at 0: subtract the start from the end.'), { visual: { type: 'line', min: 0, max: 10, marks: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], jumps: [[2, 7]] } }),
      ];
    })(),
  },
  '3P-M-14': {
    explain: [T('1 kilo (kg) = 1 000 gramos (g). Medio kilo = 500 g; un cuarto de kilo = 250 g.', '1 quilo (kg) = 1 000 grams (g). Mig quilo = 500 g; un quart de quilo = 250 g.', '1 kilogram (kg) = 1,000 grams (g). Half a kilo = 500 g; a quarter of a kilo = 250 g.'),
      T('1 litro (L) = 1 000 mililitros (mL). Medio litro = 500 mL.', '1 litre (L) = 1 000 mil·lilitres (mL). Mig litre = 500 mL.', '1 litre (L) = 1,000 millilitres (mL). Half a litre = 500 mL.')],
    example: { q: T('¿Cuántos gramos son 2 kilos y medio?', 'Quants grams són 2 quilos i mig?', 'How many grams are 2 and a half kilograms?'),
      steps: [T('2 kg = 2 000 g. Medio kilo = 500 g.', '2 kg = 2 000 g. Mig quilo = 500 g.', '2 kg = 2,000 g. Half a kilo = 500 g.'), T('2 000 + 500 = 2 500 g.', '2 000 + 500 = 2 500 g.', '2,000 + 500 = 2,500 g.')] },
    make: (r) => {
      if (r() < 0.35) { const half = pick(r, [[500, T('medio kilo', 'mig quilo', 'half a kilo')], [250, T('un cuarto de kilo', 'un quart de quilo', 'a quarter of a kilo')], [750, T('tres cuartos de kilo', 'tres quarts de quilo', 'three quarters of a kilo')]] as const);
        return q(X((l) => [`¿Cuántos gramos son ${half[1][0]}?`, `Quants grams són ${half[1][1]}?`, `How many grams are ${half[1][2]}?`][l]), half[0], [100, 50, 1000, 400].filter((x) => x !== half[0]), T('1 kg = 1 000 g. La mitad es 500; la cuarta parte, 250.', '1 kg = 1 000 g. La meitat és 500; la quarta part, 250.', '1 kg = 1,000 g. Half is 500; a quarter is 250.')); }
      return r() < 0.5 ? convert(MASS, [['kg', 'g'], ['g', 'kg']])(r) : convert(CAP, [['L', 'mL'], ['mL', 'L']])(r);
    },
  },
  '3P-M-15': {
    explain: [T('Entre número y número del reloj hay 5 minutos. Cuando la aguja larga está en el 3, son «y cuarto» (15 minutos); en el 9, «menos cuarto».', 'Entre nombre i nombre del rellotge hi ha 5 minuts. Quan l’agulla llarga està en el 3, són «i quart» (15 minuts); en el 9, «menys quart».', 'Between each number on the clock there are 5 minutes. When the long hand is on 3, it is quarter past (15 minutes); on 9, quarter to.'),
      T('A las «menos cuarto» la hora es la siguiente: 4:45 son las 5 menos cuarto.', 'A les «menys quart» l’hora és la següent: 4:45 són les 5 menys quart.', 'At quarter to, it is the next hour: 4:45 is quarter to 5.')],
    example: { q: T('¿Qué hora marca el reloj?', 'Quina hora marca el rellotge?', 'What time does the clock show?'), visual: { type: 'clock', h: 7, m: 45 },
      steps: [T('La aguja larga está en el 9: faltan 15 minutos para la hora en punto.', 'L’agulla llarga està en el 9: falten 15 minuts per a l’hora en punt.', 'The long hand is on 9: 15 minutes to the hour.'), T('La corta está casi en el 8: son las 8 menos cuarto.', 'La curta està quasi en el 8: són les 8 menys quart.', 'The short hand is nearly on 8: quarter to 8.')] },
    make: both(clockRead(15), clockRead(5)),
  },
  '3P-M-16': {
    explain: [T('Para saber el cambio, cuenta desde el precio hasta el dinero que entregas, como en las tiendas.', 'Per a saber el canvi, compta des del preu fins als diners que dones, com a les botigues.', 'To work out change, count up from the price to the money you hand over, as shopkeepers do.'),
      T('Recuerda: 1 € = 100 céntimos. 2,50 € son 2 euros y 50 céntimos.', 'Recorda: 1 € = 100 cèntims. 2,50 € són 2 euros i 50 cèntims.', 'Remember: €1 = 100 cents. €2.50 is 2 euros and 50 cents.')],
    example: { q: T('Un libro cuesta 7,50 €. Pago con 10 €. ¿Cuánto me devuelven?', 'Un llibre costa 7,50 €. Pague amb 10 €. Quant em tornen?', 'A book costs €7.50. I pay with €10. How much change?'),
      steps: [T('De 7,50 a 8 hay 0,50 €.', 'De 7,50 a 8 hi ha 0,50 €.', 'From 7.50 to 8 is €0.50.'), T('De 8 a 10 hay 2 €. Total: 2,50 €.', 'De 8 a 10 hi ha 2 €. Total: 2,50 €.', 'From 8 to 10 is €2. Total: €2.50.')] },
    make: money(15, true),
  },
  '3P-M-17': {
    explain: [T('Dos rectas son paralelas si nunca se cortan, como los raíles del tren. Son perpendiculares si se cortan formando cuatro ángulos rectos, como una cruz +.', 'Dues rectes són paral·leles si mai es tallen, com els rails del tren. Són perpendiculars si es tallen formant quatre angles rectes, com una creu +.', 'Two lines are parallel if they never meet, like railway tracks. They are perpendicular if they cross at four right angles, like a plus sign +.'),
      T('Si se cortan pero sin ángulos rectos, son secantes.', 'Si es tallen però sense angles rectes, són secants.', 'If they cross but not at right angles, they are intersecting lines.')],
    example: { q: T('Las dos rayas del signo = , ¿cómo son?', 'Les dues ratlles del signe = , com són?', 'What are the two lines of the = sign?'),
      steps: [T('Van una al lado de la otra y nunca se tocan.', 'Van una al costat de l’altra i mai es toquen.', 'They run side by side and never touch.'), T('Son paralelas.', 'Són paral·leles.', 'They are parallel.')] },
    bank: (() => {
      const PA = T('paralelas', 'paral·leles', 'parallel'), PE = T('perpendiculares', 'perpendiculars', 'perpendicular'), SE = T('secantes no perpendiculares', 'secants no perpendiculars', 'intersecting, not perpendicular');
      const B = (o: readonly [string, string, string], a: readonly [string, string, string], e: string) => mc(X((l) => [`${o[0]}: ¿cómo son esas líneas?`, `${o[1]}: com són eixes línies?`, `${o[2]}: what kind of lines are they?`][l]), a, [PA, PE, SE].filter((x) => x !== a), T('Paralelas: nunca se cortan. Perpendiculares: se cortan en ángulo recto.', 'Paral·leles: mai es tallen. Perpendiculars: es tallen en angle recte.', 'Parallel: never meet. Perpendicular: meet at a right angle.'), { visual: { type: 'emoji', rows: [e], big: true } });
      return [B(T('Las vías del tren', 'Les vies del tren', 'Railway tracks'), PA, '🛤️'), B(T('El signo +', 'El signe +', 'The + sign'), PE, '➕'), B(T('La letra X', 'La lletra X', 'The letter X'), SE, '✖️'), B(T('Las líneas de un cuaderno de rayas', 'Les línies d’un quadern de ratlles', 'The lines on lined paper'), PA, '📒'), B(T('El borde de abajo y el de la izquierda de una hoja', 'La vora de baix i la de l’esquerra d’un full', 'The bottom and left edges of a sheet of paper'), PE, '📄'), B(T('Las dos rayas de la letra V', 'Les dues ratlles de la lletra V', 'The two strokes of the letter V'), SE, 'V'),
        mc(T('Una línea que no se tuerce nada es…', 'Una línia que no es torça gens és…', 'A line that does not bend at all is…'), T('recta', 'recta', 'straight'), [T('curva', 'corba', 'curved'), T('poligonal', 'poligonal', 'polygonal')], T('Recta: como el borde de una regla.', 'Recta: com la vora d’un regle.', 'Straight: like the edge of a ruler.'))];
    })(),
  },
  '3P-M-18': {
    explain: [T('Un ángulo recto mide 90°, como la esquina de un folio. Un ángulo agudo es más pequeño que el recto; uno obtuso, más grande.', 'Un angle recte mesura 90°, com el cantó d’un foli. Un angle agut és més xicotet que el recte; un obtús, més gran.', 'A right angle is 90°, like the corner of a sheet of paper. An acute angle is smaller than a right angle; an obtuse one is bigger.'),
      T('Un ángulo llano mide 180°: es una línea recta.', 'Un angle pla mesura 180°: és una línia recta.', 'A straight angle is 180°: a straight line.')],
    example: { q: T('Un ángulo de 120°, ¿cómo es?', 'Un angle de 120°, com és?', 'What kind of angle is 120°?'),
      steps: [T('120° es más que 90° y menos que 180°.', '120° és més que 90° i menys que 180°.', '120° is more than 90° and less than 180°.'), T('Es obtuso.', 'És obtús.', 'It is obtuse.')] },
    make: angles(['classify']),
  },
  '3P-M-19': {
    explain: [T('Según sus lados, un triángulo es equilátero (3 lados iguales), isósceles (2 iguales) o escaleno (todos distintos).', 'Segons els seus costats, un triangle és equilàter (3 costats iguals), isòsceles (2 iguals) o escalé (tots diferents).', 'By its sides, a triangle is equilateral (3 equal sides), isosceles (2 equal) or scalene (all different).'),
      T('Según sus ángulos, es acutángulo (todos agudos), rectángulo (uno recto) u obtusángulo (uno obtuso).', 'Segons els seus angles, és acutangle (tots aguts), rectangle (un recte) o obtusangle (un obtús).', 'By its angles, it is acute-angled (all acute), right-angled (one right angle) or obtuse-angled (one obtuse).')],
    example: { q: T('Un triángulo tiene lados de 5, 5 y 3 cm. ¿Cómo es?', 'Un triangle té costats de 5, 5 i 3 cm. Com és?', 'A triangle has sides of 5, 5 and 3 cm. What type is it?'),
      steps: [T('Tiene dos lados iguales (5 y 5).', 'Té dos costats iguals (5 i 5).', 'It has two equal sides (5 and 5).'), T('Es isósceles.', 'És isòsceles.', 'It is isosceles.')] },
    make: triangles(),
  },
  '3P-M-20': {
    explain: [T('Los cuadriláteros tienen 4 lados: cuadrado (4 lados iguales y 4 ángulos rectos), rectángulo (4 ángulos rectos), rombo (4 lados iguales), trapecio (solo 2 lados paralelos).', 'Els quadrilàters tenen 4 costats: quadrat (4 costats iguals i 4 angles rectes), rectangle (4 angles rectes), rombe (4 costats iguals), trapezi (només 2 costats paral·lels).', 'Quadrilaterals have 4 sides: square (4 equal sides and 4 right angles), rectangle (4 right angles), rhombus (4 equal sides), trapezium (only 2 parallel sides).'),
      T('Una figura es cóncava si tiene una «entrada» hacia dentro; si no, es convexa.', 'Una figura és còncava si té una «entrada» cap a dins; si no, és convexa.', 'A shape is concave if it has a "dent" going inwards; if not, it is convex.')],
    example: { q: T('¿Qué cuadrilátero tiene 4 lados iguales pero ningún ángulo recto?', 'Quin quadrilàter té 4 costats iguals però cap angle recte?', 'Which quadrilateral has 4 equal sides but no right angles?'), visual: { type: 'shape', pts: [[0, 2], [3, 4], [6, 2], [3, 0]] },
      steps: [T('4 lados iguales: cuadrado o rombo.', '4 costats iguals: quadrat o rombe.', '4 equal sides: square or rhombus.'), T('Sin ángulos rectos: es un rombo.', 'Sense angles rectes: és un rombe.', 'No right angles: it is a rhombus.')] },
    bank: (() => {
      const SQ = T('cuadrado', 'quadrat', 'square'), RE = T('rectángulo', 'rectangle', 'rectangle'), RO = T('rombo', 'rombe', 'rhombus'), TR = T('trapecio', 'trapezi', 'trapezium'), CV = T('convexa', 'convexa', 'convex'), CC = T('cóncava', 'còncava', 'concave');
      const W = (qq: readonly [string, string, string], a: readonly [string, string, string], pts?: [number, number][]) => mc(qq, a, [SQ, RE, RO, TR].filter((x) => x !== a), T('Fíjate en los lados iguales, los ángulos rectos y los lados paralelos.', 'Fixa’t en els costats iguals, els angles rectes i els costats paral·lels.', 'Look at equal sides, right angles and parallel sides.'), pts ? { visual: { type: 'shape', pts } } : {});
      const nm = T('¿Qué cuadrilátero es?', 'Quin quadrilàter és?', 'Which quadrilateral is it?');
      return [W(nm, SQ, [[0, 0], [4, 0], [4, 4], [0, 4]]), W(nm, RE, [[0, 0], [6, 0], [6, 3], [0, 3]]), W(nm, RO, [[0, 2], [3, 4], [6, 2], [3, 0]]), W(nm, TR, [[0, 0], [6, 0], [4, 3], [1, 3]]),
        W(T('¿Qué cuadrilátero tiene 4 ángulos rectos y los lados de enfrente iguales, pero no todos?', 'Quin quadrilàter té 4 angles rectes i els costats de davant iguals, però no tots?', 'Which quadrilateral has 4 right angles and opposite sides equal, but not all four?'), RE),
        mc(T('¿Esta figura es cóncava o convexa?', 'Esta figura és còncava o convexa?', 'Is this shape concave or convex?'), CC, [CV], T('¿Tiene alguna «entrada» hacia dentro?', 'Té alguna «entrada» cap a dins?', 'Does it have a dent going inwards?'), { visual: { type: 'shape', pts: [[0, 0], [6, 0], [6, 5], [3, 2], [0, 5]] } }),
        mc(T('¿Esta figura es cóncava o convexa?', 'Esta figura és còncava o convexa?', 'Is this shape concave or convex?'), CV, [CC], T('¿Tiene alguna «entrada» hacia dentro?', 'Té alguna «entrada» cap a dins?', 'Does it have a dent going inwards?'), { visual: { type: 'shape', sides: 5 } })];
    })(),
  },
  '3P-M-21': {
    explain: [T('El perímetro es la longitud del borde de una figura: la suma de todos sus lados.', 'El perímetre és la longitud de la vora d’una figura: la suma de tots els seus costats.', 'The perimeter is the length of the edge of a shape: all its sides added together.')],
    example: { q: T('¿Cuál es el perímetro de un rectángulo de 5 cm por 3 cm?', 'Quin és el perímetre d’un rectangle de 5 cm per 3 cm?', 'What is the perimeter of a 5 cm by 3 cm rectangle?'), visual: { type: 'shape', pts: [[0, 0], [5, 0], [5, 3], [0, 3]], labels: ['5', '3', '5', '3'] },
      steps: [T('Lados: 5 + 3 + 5 + 3.', 'Costats: 5 + 3 + 5 + 3.', 'Sides: 5 + 3 + 5 + 3.'), T('Perímetro = 16 cm.', 'Perímetre = 16 cm.', 'Perimeter = 16 cm.')] },
    make: perimeter(12),
  },
  '3P-M-22': {
    explain: [T('Para localizar un punto en una cuadrícula damos dos números: primero cuántas casillas hacia la derecha y después cuántas hacia arriba.', 'Per a localitzar un punt en una quadrícula donem dos nombres: primer quantes caselles cap a la dreta i després quantes cap amunt.', 'To locate a point on a grid we give two numbers: first how many squares across, then how many up.'),
      T('Se escriben entre paréntesis: (3, 2) es 3 a la derecha y 2 arriba.', 'S’escriuen entre parèntesis: (3, 2) és 3 a la dreta i 2 amunt.', 'They are written in brackets: (3, 2) means 3 across and 2 up.')],
    example: { q: T('¿Cuáles son las coordenadas del punto A?', 'Quines són les coordenades del punt A?', 'What are the coordinates of point A?'), visual: { type: 'grid', w: 5, h: 5, pts: [{ x: 4, y: 1, label: 'A' }], axes: true },
      steps: [T('Hacia la derecha: 4.', 'Cap a la dreta: 4.', 'Across: 4.'), T('Hacia arriba: 1. A = (4, 1).', 'Cap amunt: 1. A = (4, 1).', 'Up: 1. A = (4, 1).')] },
    make: gridPoints(6, false),
  },
  '3P-M-23': {
    explain: [T('Elementos de la circunferencia: el centro (en medio), el radio (del centro al borde) y el diámetro (de borde a borde pasando por el centro).', 'Elements de la circumferència: el centre (en el mig), el radi (del centre a la vora) i el diàmetre (de vora a vora passant pel centre).', 'Parts of a circle: the centre (in the middle), the radius (from the centre to the edge) and the diameter (edge to edge through the centre).'),
      T('El diámetro mide el doble que el radio.', 'El diàmetre mesura el doble que el radi.', 'The diameter is twice the radius.')],
    example: { q: T('Una rueda tiene 30 cm de radio. ¿Cuánto mide su diámetro?', 'Una roda té 30 cm de radi. Quant mesura el seu diàmetre?', 'A wheel has a radius of 30 cm. What is its diameter?'),
      steps: [T('El diámetro son dos radios.', 'El diàmetre són dos radis.', 'The diameter is two radii.'), T('30 × 2 = 60 cm.', '30 × 2 = 60 cm.', '30 × 2 = 60 cm.')] },
    make: radiusDiameter(25),
  },
  '3P-M-24': {
    explain: [T('Un experimento aleatorio es uno en el que no sabemos qué va a salir, como lanzar un dado. Cada resultado posible es un suceso elemental.', 'Un experiment aleatori és un en què no sabem què eixirà, com llançar un dau. Cada resultat possible és un succés elemental.', 'A random experiment is one where we do not know what will happen, like rolling a dice. Each possible result is an outcome.'),
      T('Un suceso puede tener varios resultados: «sacar par» son 2, 4 y 6.', 'Un succés pot tindre diversos resultats: «traure parell» són 2, 4 i 6.', 'An event can include several outcomes: "rolling an even number" is 2, 4 and 6.')],
    example: { q: T('Al lanzar un dado, ¿qué resultados forman el suceso «sacar más de 4»?', 'En llançar un dau, quins resultats formen el succés «traure més de 4»?', 'When you roll a dice, which outcomes make the event "more than 4"?'),
      steps: [T('Los resultados posibles son 1, 2, 3, 4, 5 y 6.', 'Els resultats possibles són 1, 2, 3, 4, 5 i 6.', 'The possible outcomes are 1, 2, 3, 4, 5 and 6.'), T('Más de 4: el 5 y el 6.', 'Més de 4: el 5 i el 6.', 'More than 4: 5 and 6.')] },
    bank: [
      mc(T('¿Cuál de estos es un experimento aleatorio?', 'Quin d’estos és un experiment aleatori?', 'Which of these is a random experiment?'), T('Sacar una carta sin mirar', 'Traure una carta sense mirar', 'Picking a card without looking'), [T('Sumar 2 + 2', 'Sumar 2 + 2', 'Working out 2 + 2'), T('Soltar una piedra y ver si cae', 'Deixar anar una pedra i veure si cau', 'Dropping a stone to see if it falls'), T('Contar los días de la semana', 'Comptar els dies de la setmana', 'Counting the days of the week')], T('Aleatorio: no puedes saber antes qué saldrá.', 'Aleatori: no pots saber abans què eixirà.', 'Random: you cannot know beforehand what will happen.')),
      q(T('Al lanzar un dado, ¿cuántos sucesos elementales hay?', 'En llançar un dau, quants successos elementals hi ha?', 'How many outcomes are there when you roll a dice?'), 6, [1, 3, 12], T('Uno por cada cara.', 'Un per cada cara.', 'One for each face.')),
      q(T('Al lanzar un dado, ¿cuántos resultados tiene el suceso «sacar un número impar»?', 'En llançar un dau, quants resultats té el succés «traure un nombre imparell»?', 'When you roll a dice, how many outcomes are in the event "an odd number"?'), 3, [1, 2, 6], T('Los impares son 1, 3 y 5.', 'Els imparells són 1, 3 i 5.', 'The odd numbers are 1, 3 and 5.')),
      q(T('Sacas una bola de una bolsa con bolas roja, azul, verde y amarilla. ¿Cuántos sucesos elementales hay?', 'Traus una bola d’una bossa amb boles roja, blava, verda i groga. Quants successos elementals hi ha?', 'You take a ball from a bag with a red, a blue, a green and a yellow ball. How many outcomes are there?'), 4, [1, 2, 8], T('Uno por cada color.', 'Un per cada color.', 'One for each colour.'), { visual: { type: 'emoji', rows: ['🔴🔵🟢🟡'] } }),
      q(T('Al lanzar un dado, ¿cuántos resultados tiene el suceso «sacar menos de 3»?', 'En llançar un dau, quants resultats té el succés «traure menys de 3»?', 'When you roll a dice, how many outcomes are in "less than 3"?'), 2, [3, 1, 4], T('Menos de 3: el 1 y el 2.', 'Menys de 3: l’1 i el 2.', 'Less than 3: 1 and 2.')),
      mc(T('Lanzar una moneda, ¿qué resultados puede tener?', 'Llançar una moneda, quins resultats pot tindre?', 'What results can tossing a coin have?'), T('cara o cruz', 'cara o creu', 'heads or tails'), [T('solo cara', 'només cara', 'only heads'), T('1, 2, 3, 4, 5 o 6', '1, 2, 3, 4, 5 o 6', '1 to 6'), T('rojo o azul', 'roig o blau', 'red or blue')], T('Una moneda tiene dos caras.', 'Una moneda té dues cares.', 'A coin has two sides.')),
    ],
  },
  '3P-M-25': {
    explain: [T('Con dados y monedas hacemos experimentos. Si repetimos muchas veces, vemos qué resultados salen más.', 'Amb daus i monedes fem experiments. Si repetim moltes vegades, veiem quins resultats ixen més.', 'With dice and coins we can do experiments. If we repeat them many times, we see which results come up most.'),
      T('Un suceso con más resultados posibles es más probable.', 'Un succés amb més resultats possibles és més probable.', 'An event with more possible outcomes is more likely.')],
    example: { q: T('¿Es más probable sacar par o sacar un 1?', 'És més probable traure parell o traure un 1?', 'Is an even number or a 1 more likely?'),
      steps: [T('Par: 2, 4, 6 (tres resultados). Un 1: un resultado.', 'Parell: 2, 4, 6 (tres resultats). Un 1: un resultat.', 'Even: 2, 4, 6 (three outcomes). A 1: one outcome.'), T('Es más probable sacar par.', 'És més probable traure parell.', 'Even is more likely.')] },
    make: diceCoins(),
  },
  '3P-M-26': {
    explain: [T('Una encuesta es hacer la misma pregunta a muchas personas. Las respuestas se cuentan y se ponen en una tabla de frecuencias.', 'Una enquesta és fer la mateixa pregunta a moltes persones. Les respostes es compten i es posen en una taula de freqüències.', 'A survey means asking many people the same question. The answers are counted and put in a frequency table.'),
      T('La frecuencia es cuántas veces aparece cada respuesta.', 'La freqüència és quantes vegades apareix cada resposta.', 'The frequency is how many times each answer appears.')],
    example: { q: T('Respuestas: 🍎🍌🍎🍓🍎🍌. ¿Cuál es la frecuencia de 🍌?', 'Respostes: 🍎🍌🍎🍓🍎🍌. Quina és la freqüència de 🍌?', 'Answers: 🍎🍌🍎🍓🍎🍌. What is the frequency of 🍌?'),
      steps: [T('Cuento los plátanos: 2.', 'Compte els plàtans: 2.', 'I count the bananas: 2.'), T('La frecuencia de 🍌 es 2.', 'La freqüència de 🍌 és 2.', 'The frequency of 🍌 is 2.')] },
    make: tally(18),
  },
  '3P-M-27': {
    explain: [T('En un diagrama de barras, mira bien los números del eje: a veces van de 2 en 2 o de 5 en 5.', 'En un diagrama de barres, mira bé els nombres de l’eix: a vegades van de 2 en 2 o de 5 en 5.', 'In a bar chart, look carefully at the numbers on the axis: sometimes they go up in 2s or 5s.'),
      T('Para comparar, resta lo que mide una barra menos lo que mide otra.', 'Per a comparar, resta el que mesura una barra menys el que mesura una altra.', 'To compare, subtract one bar from another.')],
    example: { q: T('¿Cuántos votos más tiene la fresa que el plátano?', 'Quants vots més té la maduixa que el plàtan?', 'How many more votes did strawberry get than banana?'), visual: { type: 'chart', kind: 'bar', x: ['🍎', '🍌', '🍓'], y: [8, 4, 12], yMax: 14, yStep: 2 },
      steps: [T('Fresa: 12. Plátano: 4.', 'Maduixa: 12. Plàtan: 4.', 'Strawberry: 12. Banana: 4.'), T('12 − 4 = 8 votos más.', '12 − 4 = 8 vots més.', '12 − 4 = 8 more votes.')] },
    make: barChart(20, 4),
  },
  '3P-M-28': {
    explain: [T('La moda es el dato que más se repite. Si en clase hay más niños con 8 años que con otra edad, la moda es 8.', 'La moda és la dada que més es repetix. Si en classe hi ha més xiquets amb 8 anys que amb una altra edat, la moda és 8.', 'The mode is the value that appears most often. If more children in a class are 8 than any other age, the mode is 8.')],
    example: { q: T('Datos: 3, 5, 3, 7, 3, 5. ¿Cuál es la moda?', 'Dades: 3, 5, 3, 7, 3, 5. Quina és la moda?', 'Data: 3, 5, 3, 7, 3, 5. What is the mode?'),
      steps: [T('El 3 aparece 3 veces; el 5, 2; el 7, 1.', 'El 3 apareix 3 vegades; el 5, 2; el 7, 1.', '3 appears 3 times; 5 twice; 7 once.'), T('La moda es 3.', 'La moda és 3.', 'The mode is 3.')] },
    make: averages(['mode'], 7, 9),
  },
  '3P-M-29': {
    explain: [T('Una serie sigue una regla. Puede sumar siempre lo mismo (de 25 en 25), restar, o hacer el doble.', 'Una sèrie seguix una regla. Pot sumar sempre el mateix (de 25 en 25), restar, o fer el doble.', 'A sequence follows a rule. It might add the same each time (in 25s), subtract, or double.'),
      T('Escribe debajo de cada salto cuánto cambia: así verás la regla.', 'Escriu davall de cada salt quant canvia: així veuràs la regla.', 'Write how much it changes under each jump: then you will see the rule.')],
    example: { q: S('100, 125, 150, 175, ?'),
      steps: [T('Cada vez suma 25.', 'Cada vegada suma 25.', 'It adds 25 each time.'), T('175 + 25 = 200.', '175 + 25 = 200.', '175 + 25 = 200.')] },
    make: sequence(200, [3, 4, 5, 10, 25, 50, 100], true),
  },
  '3P-M-30': {
    explain: [T('Para encontrar el número que falta, usa la operación contraria: si falta un sumando, resta; si falta un factor, divide.', 'Per a trobar el nombre que falta, usa l’operació contrària: si falta un sumand, resta; si falta un factor, dividix.', 'To find the missing number, use the opposite operation: if an addend is missing, subtract; if a factor is missing, divide.')],
    example: { q: S('? × 6 = 42'), visual: { type: 'balance', left: '? × 6', right: '42' },
      steps: [T('¿Qué número por 6 da 42? Es 42 ÷ 6.', 'Quin nombre per 6 dona 42? És 42 ÷ 6.', 'What times 6 makes 42? It is 42 ÷ 6.'), T('42 ÷ 6 = 7.', '42 ÷ 6 = 7.', '42 ÷ 6 = 7.')] },
    make: gapEquation(100, ['+', '−', '×']),
  },
  '3P-M-31': {
    explain: [T('Cuando un grupo de órdenes se repite, en vez de escribirlas muchas veces decimos «repite 3 veces». Es un bucle.', 'Quan un grup d’ordres es repetix, en lloc d’escriure-les moltes vegades diem «repetix 3 vegades». És un bucle.', 'When a group of instructions repeats, instead of writing them out many times we say "repeat 3 times". That is a loop.')],
    example: { q: T('El robot sale del 0 y repite 3 veces «avanza 2». ¿Dónde acaba?', 'El robot ix del 0 i repetix 3 vegades «avança 2». On acaba?', 'The robot starts at 0 and repeats "forward 2" three times. Where does it end?'),
      steps: [T('Cada repetición avanza 2.', 'Cada repetició avança 2.', 'Each repeat moves forward 2.'), T('3 × 2 = 6. Acaba en el 6.', '3 × 2 = 6. Acaba en el 6.', '3 × 2 = 6. It ends on 6.')] },
    make: loops(),
  },
  '3P-M-32': {
    explain: [T('En los juegos de estrategia, piensa hacia atrás: ¿qué tendría que pasar justo antes de ganar?', 'En els jocs d’estratègia, pensa cap arrere: què hauria de passar just abans de guanyar?', 'In strategy games, think backwards: what would have to happen just before you win?')],
    example: { q: T('Hay 7 fichas. Cada uno quita de 1 a 3. Gana quien quita la última. ¿Cuántas quitas?', 'Hi ha 7 fitxes. Cadascú en lleva d’1 a 3. Guanya qui lleva l’última. Quantes en lleves?', 'There are 7 counters. Each player removes 1 to 3. Whoever takes the last wins. How many do you take?'),
      steps: [T('Si dejo 4, el otro quite lo que quite, yo puedo quitar el resto.', 'Si en deixe 4, l’altre en lleve les que en lleve, jo puc llevar la resta.', 'If I leave 4, whatever the other player takes, I can take the rest.'), T('7 − 4 = 3. Quito 3.', '7 − 4 = 3. En lleve 3.', '7 − 4 = 3. I take 3.')] },
    make: nim(15),
  },
};
export default P;

