import type { ContentPack, T3 } from '../types';
import { int, mc, q, S, T, X } from '../lib';
import { angles, area, areaUnits, averages, CAP, compareOrder, convert, decimals, diceCoins, divisibility, durations, fracAddSub, fractions, gapEquation, gridPoints, LEN, loops, MASS, multiples, nim, orderOps, pieChart, placeValue, powers, probScale, properties, radiusDiameter, relFreq, roundWhole, sequence, similar, simplify, spreadsheet, tally, timeUnits } from '../gens';

type G = (r: () => number) => ReturnType<ReturnType<typeof placeValue>>;
const mix = (...gs: G[]): G => (r) => gs[int(r, 0, gs.length - 1)](r);
const B = (qq: T3, a: T3, w: T3[], h: T3, extra = {}) => mc(qq, a, w, h, extra);
const YES = T('Sí', 'Sí', 'Yes'), NO = T('No', 'No', 'No');

const P: ContentPack = {
  '5P-M-1': {
    explain: [T('Los números grandes se leen por grupos de tres cifras desde la derecha: unidades, millares y millones. 4 235 600 = 4 millones, 235 mil, 600.', 'Els nombres grans es lligen per grups de tres xifres des de la dreta: unitats, milers i milions. 4 235 600 = 4 milions, 235 mil, 600.', 'Big numbers are read in groups of three digits from the right: ones, thousands and millions. 4,235,600 = 4 million, 235 thousand, 600.')],
    example: { q: T('¿Cuánto vale el 4 en 4 235 600?', 'Quant val el 4 en 4 235 600?', 'What is the 4 worth in 4,235,600?'),
      steps: [T('Es la séptima cifra por la derecha: las unidades de millón.', 'És la sèptima xifra per la dreta: les unitats de milió.', 'It is the seventh digit from the right: the millions.'), T('Vale 4 000 000.', 'Val 4 000 000.', 'It is worth 4,000,000.')] },
    make: mix(placeValue(7), compareOrder(9999999, 1000000)),
  },
  '5P-M-2': {
    explain: [T('Criterios de divisibilidad: por 2 si acaba en par; por 3 si sus cifras suman múltiplo de 3; por 5 si acaba en 0 o 5; por 9 si sus cifras suman múltiplo de 9; por 10 si acaba en 0.', 'Criteris de divisibilitat: per 2 si acaba en parell; per 3 si les xifres sumen múltiple de 3; per 5 si acaba en 0 o 5; per 9 si les xifres sumen múltiple de 9; per 10 si acaba en 0.', 'Divisibility rules: by 2 if it ends in an even digit; by 3 if its digits add up to a multiple of 3; by 5 if it ends in 0 or 5; by 9 if its digits add up to a multiple of 9; by 10 if it ends in 0.')],
    example: { q: T('¿Es 426 divisible por 3?', '426 és divisible per 3?', 'Is 426 divisible by 3?'),
      steps: [T('Sumo sus cifras: 4 + 2 + 6 = 12.', 'Sume les xifres: 4 + 2 + 6 = 12.', 'I add its digits: 4 + 2 + 6 = 12.'), T('12 es múltiplo de 3, así que 426 es divisible por 3.', '12 és múltiple de 3, així que 426 és divisible per 3.', '12 is a multiple of 3, so 426 divides by 3.')] },
    make: mix(divisibility(), multiples(['isMult', 'whichDiv', 'nextMult'])),
  },
  '5P-M-3': {
    explain: [T('Un número primo solo tiene dos divisores: el 1 y él mismo (2, 3, 5, 7, 11, 13…). Un número compuesto tiene más de dos.', 'Un nombre primer només té dos divisors: l’1 i ell mateix (2, 3, 5, 7, 11, 13…). Un nombre compost en té més de dos.', 'A prime number has only two factors: 1 and itself (2, 3, 5, 7, 11, 13…). A composite number has more than two.'),
      T('El 1 no es primo ni compuesto.', 'L’1 no és primer ni compost.', '1 is neither prime nor composite.')],
    example: { q: T('¿Es primo el 15?', 'El 15 és primer?', 'Is 15 prime?'),
      steps: [T('15 = 3 × 5: además de 1 y 15, tiene los divisores 3 y 5.', '15 = 3 × 5: a més d’1 i 15, té els divisors 3 i 5.', '15 = 3 × 5: as well as 1 and 15, it has the factors 3 and 5.'), T('No es primo: es compuesto.', 'No és primer: és compost.', 'It is not prime: it is composite.')] },
    make: multiples(['prime', 'countDiv']),
  },
  '5P-M-4': {
    explain: [T('Una potencia es una multiplicación de factores iguales: 5³ = 5 × 5 × 5 = 125. El 5 es la base y el 3, el exponente.', 'Una potència és una multiplicació de factors iguals: 5³ = 5 × 5 × 5 = 125. El 5 és la base i el 3, l’exponent.', 'A power is a multiplication of equal factors: 5³ = 5 × 5 × 5 = 125. 5 is the base and 3 is the exponent.'),
      T('Exponente 2: «al cuadrado». Exponente 3: «al cubo».', 'Exponent 2: «al quadrat». Exponent 3: «al cub».', 'Exponent 2: "squared". Exponent 3: "cubed".')],
    example: { q: S('4³ = ?'),
      steps: [T('4³ = 4 × 4 × 4.', '4³ = 4 × 4 × 4.', '4³ = 4 × 4 × 4.'), T('4 × 4 = 16 y 16 × 4 = 64.', '4 × 4 = 16 i 16 × 4 = 64.', '4 × 4 = 16 and 16 × 4 = 64.')] },
    make: powers(['sq', 'cube', 'read']),
  },
  '5P-M-5': {
    explain: [T('Dos fracciones son equivalentes si representan la misma cantidad: 1/2 = 2/4 = 3/6.', 'Dues fraccions són equivalents si representen la mateixa quantitat: 1/2 = 2/4 = 3/6.', 'Two fractions are equivalent if they show the same amount: 1/2 = 2/4 = 3/6.'),
      T('Se obtienen multiplicando o dividiendo numerador y denominador por el mismo número.', 'S’obtenen multiplicant o dividint numerador i denominador pel mateix nombre.', 'You get them by multiplying or dividing the numerator and denominator by the same number.')],
    example: { q: T('Simplifica 6/8.', 'Simplifica 6/8.', 'Simplify 6/8.'), visual: { type: 'frac', n: 6, d: 8, shape: 'bar' },
      steps: [T('6 y 8 se pueden dividir entre 2.', '6 i 8 es poden dividir entre 2.', '6 and 8 can both be divided by 2.'), T('6/8 = 3/4.', '6/8 = 3/4.', '6/8 = 3/4.')] },
    make: mix(fractions(['equiv']), simplify()),
  },
  '5P-M-6': {
    explain: [T('Para comparar fracciones con distinto denominador, búscales un denominador común y compara los numeradores.', 'Per a comparar fraccions amb denominador diferent, busca’ls un denominador comú i compara els numeradors.', 'To compare fractions with different denominators, find a common denominator and compare the numerators.')],
    example: { q: T('¿Qué es mayor, 2/3 o 3/4?', 'Què és major, 2/3 o 3/4?', 'Which is bigger, 2/3 or 3/4?'),
      steps: [T('Denominador común 12: 2/3 = 8/12 y 3/4 = 9/12.', 'Denominador comú 12: 2/3 = 8/12 i 3/4 = 9/12.', 'Common denominator 12: 2/3 = 8/12 and 3/4 = 9/12.'), T('9/12 es mayor: 3/4 > 2/3.', '9/12 és major: 3/4 > 2/3.', '9/12 is bigger: 3/4 > 2/3.')] },
    make: (r) => {
      if (r() < 0.5) return fractions(['compare'], 12)(r);
      const p: [number, number, number, number][] = [[2, 3, 3, 4], [1, 2, 3, 5], [3, 4, 5, 6], [2, 5, 1, 3], [3, 8, 1, 2], [5, 6, 7, 9], [3, 5, 2, 3], [1, 4, 2, 7]];
      const [a, b, c, d] = p[int(r, 0, p.length - 1)]; const big = a / b > c / d ? `${a}/${b}` : `${c}/${d}`, small = big === `${a}/${b}` ? `${c}/${d}` : `${a}/${b}`;
      return q(T('¿Qué fracción es mayor?', 'Quina fracció és major?', 'Which fraction is bigger?'), big, [small], X((l) => [`Pásalas a denominador ${b * d / (b === d ? b : 1)} y compara los numeradores.`, `Passa-les a denominador ${b * d / (b === d ? b : 1)} i compara els numeradors.`, `Rewrite them with denominator ${b * d / (b === d ? b : 1)} and compare the numerators.`][l]), { mc: true, visual: { type: 'table', head: [`${a}/${b}`, `${c}/${d}`], rows: [] } });
    },
  },
  '5P-M-7': {
    explain: [T('Con el mismo denominador, se suman o restan los numeradores. Con distinto denominador, primero se buscan fracciones equivalentes con un denominador común.', 'Amb el mateix denominador, se sumen o resten els numeradors. Amb denominador diferent, primer es busquen fraccions equivalents amb un denominador comú.', 'With the same denominator, add or subtract the numerators. With different denominators, first find equivalent fractions with a common denominator.')],
    example: { q: S('1/2 + 1/4 = ?'),
      steps: [T('1/2 = 2/4.', '1/2 = 2/4.', '1/2 = 2/4.'), T('2/4 + 1/4 = 3/4.', '2/4 + 1/4 = 3/4.', '2/4 + 1/4 = 3/4.')] },
    make: mix(fracAddSub(), fractions(['addsame'], 10)),
  },
  '5P-M-8': {
    explain: [T('Las milésimas son la tercera cifra después de la coma: 1 unidad = 1 000 milésimas. 2,345 = 2 unidades, 3 décimas, 4 centésimas y 5 milésimas.', 'Les mil·lèsimes són la tercera xifra després de la coma: 1 unitat = 1 000 mil·lèsimes. 2,345 = 2 unitats, 3 dècimes, 4 centèsimes i 5 mil·lèsimes.', 'Thousandths are the third digit after the decimal point: 1 = 1,000 thousandths. 2.345 = 2 ones, 3 tenths, 4 hundredths and 5 thousandths.')],
    example: { q: T('Ordena de menor a mayor: 0,5; 0,45; 0,405.', 'Ordena de menor a major: 0,5; 0,45; 0,405.', 'Put in order, smallest first: 0.5; 0.45; 0.405.'),
      steps: [T('Escribo todos con tres decimales: 0,500; 0,450; 0,405.', 'Escric tots amb tres decimals: 0,500; 0,450; 0,405.', 'I write them all with three decimal places: 0.500; 0.450; 0.405.'), T('Orden: 0,405 < 0,45 < 0,5.', 'Ordre: 0,405 < 0,45 < 0,5.', 'Order: 0.405 < 0.45 < 0.5.')] },
    make: decimals(['place', 'compare'], 3),
  },
  '5P-M-9': {
    explain: [T('Para redondear un decimal, mira la cifra siguiente a la que quieres dejar: si es 5 o más, sube; si es menos de 5, déjala igual.', 'Per a arredonir un decimal, mira la xifra següent a la que vols deixar: si és 5 o més, puja; si és menys de 5, deixa-la igual.', 'To round a decimal, look at the digit after the one you want to keep: 5 or more rounds up; less than 5 stays the same.')],
    example: { q: T('Redondea 3,476 a las décimas.', 'Arredonix 3,476 a les dècimes.', 'Round 3.476 to the nearest tenth.'),
      steps: [T('Las décimas: 4. La cifra siguiente: 7.', 'Les dècimes: 4. La xifra següent: 7.', 'Tenths: 4. Next digit: 7.'), T('7 es 5 o más: subo. 3,5.', '7 és 5 o més: puge. 3,5.', '7 is 5 or more: round up. 3.5.')] },
    make: decimals(['round'], 3),
  },
  '5P-M-10': {
    explain: [T('Para multiplicar decimales, multiplica como si no hubiera coma y pon en el resultado tantos decimales como tengan entre los dos factores.', 'Per a multiplicar decimals, multiplica com si no hi haguera coma i posa en el resultat tants decimals com tinguen entre els dos factors.', 'To multiply decimals, multiply as if there were no decimal point, then give the answer as many decimal places as the two numbers have together.'),
      T('Para dividir un decimal entre un número natural, divide normal y pon la coma en el cociente al bajar la primera cifra decimal.', 'Per a dividir un decimal entre un nombre natural, dividix normal i posa la coma en el quocient en baixar la primera xifra decimal.', 'To divide a decimal by a whole number, divide as usual and put the point in the answer when you bring down the first decimal digit.')],
    example: { q: S('2,4 × 3 = ?'),
      steps: [T('24 × 3 = 72.', '24 × 3 = 72.', '24 × 3 = 72.'), T('2,4 tiene un decimal: 7,2.', '2,4 té un decimal: 7,2.', '2.4 has one decimal place: 7.2.')] },
    make: decimals(['mul', 'div'], 2),
  },
  '5P-M-11': {
    explain: [T('Multiplicar por 10, 100 o 1 000 mueve la coma 1, 2 o 3 lugares a la derecha. Dividir la mueve a la izquierda. Si faltan cifras, se añaden ceros.', 'Multiplicar per 10, 100 o 1 000 mou la coma 1, 2 o 3 llocs a la dreta. Dividir la mou a l’esquerra. Si falten xifres, s’afigen zeros.', 'Multiplying by 10, 100 or 1,000 moves the point 1, 2 or 3 places right. Dividing moves it left. Add zeros if you run out of digits.')],
    example: { q: S('3,7 × 100 = ?'),
      steps: [T('× 100: la coma se mueve 2 lugares a la derecha.', '× 100: la coma es mou 2 llocs a la dreta.', '× 100: the point moves 2 places right.'), T('3,7 → 37 → 370.', '3,7 → 37 → 370.', '3.7 → 37 → 370.')] },
    make: decimals(['mul10'], 2),
  },
  '5P-M-12': {
    explain: [T('Orden de las operaciones: primero los paréntesis, después multiplicaciones y divisiones, y al final sumas y restas.', 'Ordre de les operacions: primer els parèntesis, després multiplicacions i divisions, i al final sumes i restes.', 'Order of operations: brackets first, then multiplication and division, and finally addition and subtraction.'),
      T('Propiedad distributiva: 6 × 23 = 6 × 20 + 6 × 3.', 'Propietat distributiva: 6 × 23 = 6 × 20 + 6 × 3.', 'Distributive property: 6 × 23 = 6 × 20 + 6 × 3.')],
    example: { q: S('5 + 3 × 4 = ?'),
      steps: [T('Primero la multiplicación: 3 × 4 = 12.', 'Primer la multiplicació: 3 × 4 = 12.', 'Multiplication first: 3 × 4 = 12.'), T('Después la suma: 5 + 12 = 17 (¡no 32!).', 'Després la suma: 5 + 12 = 17 (no 32!).', 'Then the addition: 5 + 12 = 17 (not 32!).')] },
    make: mix(orderOps(10), properties(['dist'])),
  },
  '5P-M-13': {
    explain: [T('Para calcular de cabeza, descompón: 48 × 5 = 48 × 10 ÷ 2 = 240. Para estimar, redondea antes de operar.', 'Per a calcular de cap, descompon: 48 × 5 = 48 × 10 ÷ 2 = 240. Per a estimar, arredonix abans d’operar.', 'For mental maths, break numbers up: 48 × 5 = 48 × 10 ÷ 2 = 240. To estimate, round before calculating.')],
    example: { q: T('Estima 61 × 19.', 'Estima 61 × 19.', 'Estimate 61 × 19.'),
      steps: [T('61 ≈ 60 y 19 ≈ 20.', '61 ≈ 60 i 19 ≈ 20.', '61 ≈ 60 and 19 ≈ 20.'), T('60 × 20 = 1 200.', '60 × 20 = 1 200.', '60 × 20 = 1,200.')] },
    make: mix(roundWhole(999999, [100, 1000, 10000]), (r) => {
      const a = int(r, 12, 98), b = int(r, 12, 98), ra = Math.round(a / 10) * 10, rb = Math.round(b / 10) * 10, est = ra * rb;
      return q(X((l) => [`Estima redondeando a las decenas: ${a} × ${b} ≈ ?`, `Estima arredonint a les desenes: ${a} × ${b} ≈ ?`, `Estimate by rounding to the nearest ten: ${a} × ${b} ≈ ?`][l]), est, [a * b, ra + rb, est * 10].filter((x) => x !== est), X((l) => [`${a} ≈ ${ra} y ${b} ≈ ${rb}.`, `${a} ≈ ${ra} i ${b} ≈ ${rb}.`, `${a} ≈ ${ra} and ${b} ≈ ${rb}.`][l]));
    }),
  },
  '5P-M-14': {
    explain: [T('El sistema métrico decimal usa siempre la misma escalera: kilo (×1 000), hecto (×100), deca (×10), la unidad, deci (÷10), centi (÷100), mili (÷1 000).', 'El sistema mètric decimal usa sempre la mateixa escala: quilo (×1 000), hecto (×100), deca (×10), la unitat, deci (÷10), centi (÷100), mil·li (÷1 000).', 'The metric system always uses the same ladder: kilo (×1,000), hecto (×100), deca (×10), the unit, deci (÷10), centi (÷100), milli (÷1,000).'),
      T('Vale para metros, gramos y litros.', 'Val per a metres, grams i litres.', 'It works for metres, grams and litres.')],
    example: { q: S('2,5 kg = ? g'), visual: { type: 'ladder', units: ['kg', 'hg', 'dag', 'g'], from: 0, to: 3 },
      steps: [T('De kg a g: 3 escalones, × 1 000.', 'De kg a g: 3 graons, × 1 000.', 'From kg to g: 3 steps, × 1,000.'), T('2,5 × 1 000 = 2 500 g.', '2,5 × 1 000 = 2 500 g.', '2.5 × 1,000 = 2,500 g.')] },
    make: mix(convert(LEN, [['km', 'm'], ['m', 'cm'], ['hm', 'dm'], ['mm', 'm'], ['dam', 'dm']]), convert(MASS, [['kg', 'g'], ['g', 'mg'], ['hg', 'g'], ['mg', 'g']]), convert(CAP, [['L', 'mL'], ['kL', 'L'], ['dL', 'mL'], ['cL', 'L']])),
  },
  '5P-M-15': {
    explain: [T('La superficie se mide en unidades cuadradas: m², dm², cm². Un m² es un cuadrado de 1 m de lado.', 'La superfície es mesura en unitats quadrades: m², dm², cm². Un m² és un quadrat d’1 m de costat.', 'Area is measured in square units: m², dm², cm². One m² is a square with 1 m sides.'),
      T('En superficie, cada escalón multiplica o divide por 100 (no por 10): 1 m² = 100 dm² = 10 000 cm².', 'En superfície, cada graó multiplica o dividix per 100 (no per 10): 1 m² = 100 dm² = 10 000 cm².', 'For area, each step multiplies or divides by 100 (not 10): 1 m² = 100 dm² = 10,000 cm².')],
    example: { q: S('3 m² = ? dm²'),
      steps: [T('Un m² tiene 10 × 10 = 100 dm².', 'Un m² té 10 × 10 = 100 dm².', 'One m² holds 10 × 10 = 100 dm².'), T('3 × 100 = 300 dm².', '3 × 100 = 300 dm².', '3 × 100 = 300 dm².')] },
    make: mix(areaUnits(), area(12, ['rect', 'square'], 'm')),
  },
  '5P-M-16': {
    explain: [T('Elige el instrumento según lo que mides y la precisión que necesitas: una regla mide hasta el milímetro; una cinta métrica, distancias largas; una báscula de cocina, gramos; un cronómetro, décimas de segundo.', 'Tria l’instrument segons el que mesures i la precisió que necessites: un regle mesura fins al mil·límetre; una cinta mètrica, distàncies llargues; una bàscula de cuina, grams; un cronòmetre, dècimes de segon.', 'Choose the tool by what you measure and how precise you need to be: a ruler measures to the millimetre; a tape measure, long distances; kitchen scales, grams; a stopwatch, tenths of a second.')],
    example: { q: T('Para medir la harina de una receta, ¿qué usarías?', 'Per a mesurar la farina d’una recepta, què usaries?', 'What would you use to measure flour for a recipe?'),
      steps: [T('Necesito gramos con precisión.', 'Necessite grams amb precisió.', 'I need grams, accurately.'), T('Una báscula de cocina.', 'Una bàscula de cuina.', 'Kitchen scales.')] },
    bank: (() => {
      const I = { reg: T('una regla', 'un regle', 'a ruler'), cin: T('una cinta métrica', 'una cinta mètrica', 'a tape measure'), bas: T('una báscula de cocina', 'una bàscula de cuina', 'kitchen scales'), bp: T('una báscula de baño', 'una bàscula de bany', 'bathroom scales'), cro: T('un cronómetro', 'un cronòmetre', 'a stopwatch'), pro: T('un transportador', 'un transportador', 'a protractor'), ter: T('un termómetro', 'un termòmetre', 'a thermometer'), pro2: T('una probeta', 'una proveta', 'a measuring cylinder') };
      return [
        B(T('¿Con qué medirías el ángulo de una rampa en un dibujo?', 'Amb què mesuraries l’angle d’una rampa en un dibuix?', 'What would you use to measure the angle of a ramp in a drawing?'), I.pro, [I.reg, I.cin, I.cro], T('Los ángulos se miden en grados.', 'Els angles es mesuren en graus.', 'Angles are measured in degrees.')),
        B(T('¿Con qué medirías tu peso?', 'Amb què mesuraries el teu pes?', 'What would you use to measure your weight?'), I.bp, [I.bas, I.cin, I.pro2], T('Para pesos grandes, una báscula grande.', 'Per a pesos grans, una bàscula gran.', 'For big weights, big scales.')),
        B(T('¿Con qué medirías 25 mL de agua para un experimento?', 'Amb què mesuraries 25 mL d’aigua per a un experiment?', 'What would you use to measure 25 mL of water for an experiment?'), I.pro2, [I.bas, I.reg, I.ter], T('Para volúmenes pequeños y precisos de líquido, una probeta.', 'Per a volums xicotets i precisos de líquid, una proveta.', 'For small, precise volumes of liquid, a measuring cylinder.')),
        B(T('¿Con qué medirías el largo de un campo de fútbol?', 'Amb què mesuraries la llargària d’un camp de futbol?', 'What would you use to measure the length of a football pitch?'), I.cin, [I.reg, I.pro, I.bas], T('Necesitas algo largo.', 'Necessites una cosa llarga.', 'You need something long.')),
        B(T('¿Con qué medirías cuánto tardas en nadar 25 metros?', 'Amb què mesuraries quant tardes a nadar 25 metres?', 'What would you use to time a 25-metre swim?'), I.cro, [I.ter, I.reg, I.cin], T('Hay que medir el tiempo con precisión.', 'Cal mesurar el temps amb precisió.', 'You need to time it accurately.')),
        B(T('¿Con qué medirías el grosor de una moneda?', 'Amb què mesuraries el gruix d’una moneda?', 'What would you use to measure the thickness of a coin?'), I.reg, [I.cin, I.bp, I.cro], T('Es muy pequeño: necesitas los milímetros de la regla.', 'És molt xicotet: necessites els mil·límetres del regle.', 'It is tiny: you need the millimetres on a ruler.')),
        B(T('¿Qué instrumento es más preciso para medir 3,7 cm?', 'Quin instrument és més precís per a mesurar 3,7 cm?', 'Which tool is most precise for measuring 3.7 cm?'), I.reg, [I.cin, I.pro, I.ter], T('3,7 cm son 37 mm: la regla marca los milímetros.', '3,7 cm són 37 mm: el regle marca els mil·límetres.', '3.7 cm is 37 mm: a ruler shows millimetres.')),
      ];
    })(),
  },
  '5P-M-17': {
    explain: [T('Para calcular duraciones, cuenta primero hasta la hora en punto siguiente y después las horas y minutos que faltan.', 'Per a calcular duracions, compta primer fins a l’hora en punt següent i després les hores i minuts que falten.', 'To work out how long something lasts, count up to the next o’clock first, then the hours and minutes left.'),
      T('Recuerda: 1 h = 60 min, 1 min = 60 s, 1 día = 24 h.', 'Recorda: 1 h = 60 min, 1 min = 60 s, 1 dia = 24 h.', 'Remember: 1 h = 60 min, 1 min = 60 s, 1 day = 24 h.')],
    example: { q: T('Un tren sale a las 9:40 y llega a las 11:15. ¿Cuánto dura el viaje?', 'Un tren ix a les 9:40 i arriba a les 11:15. Quant dura el viatge?', 'A train leaves at 9:40 and arrives at 11:15. How long is the journey?'),
      steps: [T('De 9:40 a 10:00: 20 min. De 10:00 a 11:00: 60 min. De 11:00 a 11:15: 15 min.', 'De 9:40 a 10:00: 20 min. De 10:00 a 11:00: 60 min. D’11:00 a 11:15: 15 min.', 'From 9:40 to 10:00: 20 min. From 10:00 to 11:00: 60 min. From 11:00 to 11:15: 15 min.'), T('20 + 60 + 15 = 95 min (1 h 35 min).', '20 + 60 + 15 = 95 min (1 h 35 min).', '20 + 60 + 15 = 95 min (1 h 35 min).')] },
    make: mix(durations(150), timeUnits()),
  },
  '5P-M-18': {
    explain: [T('El transportador mide ángulos en grados. Pon su centro en el vértice, alinea el 0 con un lado y lee dónde pasa el otro lado.', 'El transportador mesura angles en graus. Posa el centre en el vèrtex, alinea el 0 amb un costat i llig per on passa l’altre costat.', 'A protractor measures angles in degrees. Put its centre on the vertex, line up 0 with one side and read where the other side crosses.'),
      T('Los ángulos de un triángulo suman 180°.', 'Els angles d’un triangle sumen 180°.', 'The angles of a triangle add up to 180°.')],
    example: { q: T('Un triángulo tiene ángulos de 50° y 60°. ¿Cuánto mide el tercero?', 'Un triangle té angles de 50° i 60°. Quant mesura el tercer?', 'A triangle has angles of 50° and 60°. What is the third?'),
      steps: [T('50 + 60 = 110.', '50 + 60 = 110.', '50 + 60 = 110.'), T('180 − 110 = 70°.', '180 − 110 = 70°.', '180 − 110 = 70°.')] },
    make: angles(['classify', 'missing', 'tri']),
  },
  '5P-M-19': {
    explain: [T('Área del rectángulo = base × altura. Área del triángulo = base × altura ÷ 2, porque un triángulo es la mitad de un rectángulo.', 'Àrea del rectangle = base × altura. Àrea del triangle = base × altura ÷ 2, perquè un triangle és la meitat d’un rectangle.', 'Area of a rectangle = base × height. Area of a triangle = base × height ÷ 2, because a triangle is half a rectangle.')],
    example: { q: T('Un triángulo tiene 8 cm de base y 5 cm de altura. ¿Cuál es su área?', 'Un triangle té 8 cm de base i 5 cm d’altura. Quina és la seua àrea?', 'A triangle has a base of 8 cm and a height of 5 cm. What is its area?'), visual: { type: 'shape', pts: [[0, 0], [8, 0], [3, 5]], labels: ['8', '', ''] },
      steps: [T('8 × 5 = 40.', '8 × 5 = 40.', '8 × 5 = 40.'), T('40 ÷ 2 = 20 cm².', '40 ÷ 2 = 20 cm².', '40 ÷ 2 = 20 cm².')] },
    make: area(12, ['rect', 'tri', 'square']),
  },
  '5P-M-20': {
    explain: [T('En los ejes de coordenadas, el eje horizontal es el eje X y el vertical, el eje Y. Un punto se escribe (x, y): primero lo horizontal, después lo vertical.', 'En els eixos de coordenades, l’eix horitzontal és l’eix X i el vertical, l’eix Y. Un punt s’escriu (x, y): primer l’horitzontal, després el vertical.', 'On coordinate axes, the horizontal axis is the x-axis and the vertical one the y-axis. A point is written (x, y): across first, then up.')],
    example: { q: T('¿Dónde está el punto (2, 5)?', 'On està el punt (2, 5)?', 'Where is the point (2, 5)?'), visual: { type: 'grid', w: 6, h: 6, pts: [{ x: 2, y: 5, label: 'P' }], axes: true },
      steps: [T('2 hacia la derecha por el eje X.', '2 cap a la dreta per l’eix X.', '2 across along the x-axis.'), T('5 hacia arriba en el eje Y.', '5 cap amunt en l’eix Y.', '5 up the y-axis.')] },
    make: mix(gridPoints(8, false), gridPoints(8, true)),
  },
  '5P-M-21': {
    explain: [T('Una recta no tiene principio ni fin. Una semirrecta tiene principio pero no fin. Un segmento tiene principio y fin: se puede medir.', 'Una recta no té principi ni fi. Una semirecta té principi però no fi. Un segment té principi i fi: es pot mesurar.', 'A line has no start or end. A ray has a start but no end. A line segment has a start and an end: it can be measured.'),
      T('Dos rectas pueden ser paralelas, secantes o perpendiculares (secantes que forman ángulos rectos).', 'Dues rectes poden ser paral·leles, secants o perpendiculars (secants que formen angles rectes).', 'Two lines can be parallel, intersecting, or perpendicular (intersecting at right angles).')],
    example: { q: T('El lado de un cuadrado, ¿es una recta, una semirrecta o un segmento?', 'El costat d’un quadrat, és una recta, una semirecta o un segment?', 'Is the side of a square a line, a ray or a line segment?'),
      steps: [T('Empieza en un vértice y acaba en otro.', 'Comença en un vèrtex i acaba en un altre.', 'It starts at one vertex and ends at another.'), T('Es un segmento.', 'És un segment.', 'It is a line segment.')] },
    bank: (() => {
      const RE = T('recta', 'recta', 'line'), SE = T('semirrecta', 'semirecta', 'ray'), SG = T('segmento', 'segment', 'line segment');
      const PA = T('paralelas', 'paral·leles', 'parallel'), PE = T('perpendiculares', 'perpendiculars', 'perpendicular'), SC = T('secantes no perpendiculares', 'secants no perpendiculars', 'intersecting, not perpendicular');
      const h1 = T('Recta: sin principio ni fin. Semirrecta: con principio. Segmento: con principio y fin.', 'Recta: sense principi ni fi. Semirecta: amb principi. Segment: amb principi i fi.', 'Line: no start or end. Ray: has a start. Segment: has a start and an end.');
      const h2 = T('Paralelas: nunca se cortan. Perpendiculares: se cortan en ángulo recto.', 'Paral·leles: mai es tallen. Perpendiculars: es tallen en angle recte.', 'Parallel: never meet. Perpendicular: meet at a right angle.');
      return [
        B(T('Un rayo de luz que sale de una linterna y no se acaba, ¿qué es?', 'Un raig de llum que ix d’una llanterna i no s’acaba, què és?', 'A beam of light from a torch that never ends: what is it?'), SE, [RE, SG], h1),
        B(T('La distancia entre dos ciudades en un mapa, trazada con regla, ¿qué es?', 'La distància entre dues ciutats en un mapa, traçada amb regle, què és?', 'The distance between two towns drawn on a map with a ruler: what is it?'), SG, [RE, SE], h1),
        B(T('¿Cuál de estas se puede medir con una regla?', 'Quina d’estes es pot mesurar amb un regle?', 'Which of these can be measured with a ruler?'), SG, [RE, SE], h1),
        B(T('Las rectas que dibujan el signo +, ¿cómo son?', 'Les rectes que dibuixen el signe +, com són?', 'The lines in a + sign: what are they?'), PE, [PA, SC], h2),
        B(T('Dos lados opuestos de un rectángulo, ¿cómo son?', 'Dos costats oposats d’un rectangle, com són?', 'Two opposite sides of a rectangle: what are they?'), PA, [PE, SC], h2),
        B(T('Las dos rectas de la letra X, ¿cómo son?', 'Les dues rectes de la lletra X, com són?', 'The two lines in the letter X: what are they?'), SC, [PA, PE], h2),
        B(T('Si dos rectas paralelas se cortan con una tercera, ¿cómo son las dos primeras entre sí?', 'Si dues rectes paral·leles es tallen amb una tercera, com són les dues primeres entre elles?', 'If two parallel lines are crossed by a third line, what are the first two to each other?'), PA, [PE, SC], T('Cortar con otra recta no cambia la relación entre las dos primeras.', 'Tallar amb una altra recta no canvia la relació entre les dues primeres.', 'Crossing them with another line does not change how the first two relate.')),
      ];
    })(),
  },
  '5P-M-22': {
    explain: [T('Un poliedro regular tiene todas sus caras iguales y son polígonos regulares. Solo hay cinco: tetraedro (4 triángulos), cubo (6 cuadrados), octaedro (8 triángulos), dodecaedro (12 pentágonos) e icosaedro (20 triángulos).', 'Un poliedre regular té totes les cares iguals i són polígons regulars. Només n’hi ha cinc: tetraedre (4 triangles), cub (6 quadrats), octaedre (8 triangles), dodecaedre (12 pentàgons) i icosaedre (20 triangles).', 'A regular polyhedron has all faces identical regular polygons. There are only five: tetrahedron (4 triangles), cube (6 squares), octahedron (8 triangles), dodecahedron (12 pentagons) and icosahedron (20 triangles).')],
    example: { q: T('¿Qué forma tienen las caras de un dodecaedro?', 'Quina forma tenen les cares d’un dodecaedre?', 'What shape are the faces of a dodecahedron?'),
      steps: [T('«Dodeca» quiere decir doce: tiene 12 caras.', '«Dodeca» vol dir dotze: té 12 cares.', '"Dodeca" means twelve: it has 12 faces.'), T('Sus caras son pentágonos regulares.', 'Les seues cares són pentàgons regulars.', 'Its faces are regular pentagons.')] },
    bank: (() => {
      const TRI = T('triángulos', 'triangles', 'triangles'), SQ = T('cuadrados', 'quadrats', 'squares'), PEN = T('pentágonos', 'pentàgons', 'pentagons'), HEX = T('hexágonos', 'hexàgons', 'hexagons');
      const H = T('Tetraedro, octaedro e icosaedro: triángulos. Cubo: cuadrados. Dodecaedro: pentágonos.', 'Tetraedre, octaedre i icosaedre: triangles. Cub: quadrats. Dodecaedre: pentàgons.', 'Tetrahedron, octahedron, icosahedron: triangles. Cube: squares. Dodecahedron: pentagons.');
      return [
        B(T('¿Qué forma tienen las caras de un cubo?', 'Quina forma tenen les cares d’un cub?', 'What shape are the faces of a cube?'), SQ, [TRI, PEN, HEX], H),
        B(T('¿Qué forma tienen las caras de un octaedro?', 'Quina forma tenen les cares d’un octaedre?', 'What shape are the faces of an octahedron?'), TRI, [SQ, PEN, HEX], H),
        q(T('¿Cuántas caras tiene un icosaedro?', 'Quantes cares té un icosaedre?', 'How many faces does an icosahedron have?'), 20, [12, 8, 6], T('«Icosa» quiere decir veinte.', '«Icosa» vol dir vint.', '"Icosa" means twenty.')),
        q(T('¿Cuántas caras tiene un tetraedro?', 'Quantes cares té un tetraedre?', 'How many faces does a tetrahedron have?'), 4, [3, 6, 8], T('«Tetra» quiere decir cuatro.', '«Tetra» vol dir quatre.', '"Tetra" means four.')),
        q(T('¿Cuántos poliedros regulares existen?', 'Quants poliedres regulars existixen?', 'How many regular polyhedra are there?'), 5, [4, 6, 10], T('Se llaman sólidos platónicos y son solo cinco.', 'Es diuen sòlids platònics i només en són cinc.', 'They are called Platonic solids and there are only five.')),
        B(T('¿Es un prisma triangular un poliedro regular?', 'És un prisma triangular un poliedre regular?', 'Is a triangular prism a regular polyhedron?'), NO, [YES], T('Sus caras no son todas iguales: tiene triángulos y rectángulos.', 'Les seues cares no són totes iguals: té triangles i rectangles.', 'Its faces are not all the same: it has triangles and rectangles.')),
        q(T('¿Cuántas caras tiene un octaedro?', 'Quantes cares té un octaedre?', 'How many faces does an octahedron have?'), 8, [6, 12, 4], T('«Octa» quiere decir ocho.', '«Octa» vol dir huit.', '"Octa" means eight.')),
      ];
    })(),
  },
  '5P-M-23': {
    explain: [T('El desarrollo de un cuerpo es la figura plana que obtienes al «abrirlo» y extenderlo sobre la mesa. Al doblarlo, vuelve a formar el cuerpo.', 'El desenvolupament d’un cos és la figura plana que obtens en «obrir-lo» i estendre’l damunt de la taula. En doblegar-lo, torna a formar el cos.', 'The net of a solid is the flat shape you get by "opening it out" on the table. Folding it up makes the solid again.'),
      T('Un prisma tiene dos bases iguales y rectángulos alrededor. Una pirámide tiene una base y triángulos que se juntan en un punto.', 'Un prisma té dues bases iguals i rectangles al voltant. Una piràmide té una base i triangles que s’ajunten en un punt.', 'A prism has two equal bases and rectangles around them. A pyramid has one base and triangles that meet at a point.')],
    example: { q: T('El desarrollo de un cubo, ¿cuántos cuadrados tiene?', 'El desenvolupament d’un cub, quants quadrats té?', 'How many squares are in the net of a cube?'),
      steps: [T('Cada cara del cubo es un cuadrado.', 'Cada cara del cub és un quadrat.', 'Each face of a cube is a square.'), T('El cubo tiene 6 caras: 6 cuadrados.', 'El cub té 6 cares: 6 quadrats.', 'A cube has 6 faces: 6 squares.')] },
    bank: [
      q(T('El desarrollo de un prisma triangular, ¿cuántos rectángulos tiene?', 'El desenvolupament d’un prisma triangular, quants rectangles té?', 'How many rectangles are in the net of a triangular prism?'), 3, [2, 4, 5], T('Uno por cada lado de la base.', 'Un per cada costat de la base.', 'One for each side of the base.')),
      q(T('El desarrollo de un prisma triangular, ¿cuántos triángulos tiene?', 'El desenvolupament d’un prisma triangular, quants triangles té?', 'How many triangles are in the net of a triangular prism?'), 2, [1, 3, 4], T('Las dos bases.', 'Les dues bases.', 'The two bases.')),
      q(T('El desarrollo de una pirámide de base cuadrada, ¿cuántos triángulos tiene?', 'El desenvolupament d’una piràmide de base quadrada, quants triangles té?', 'How many triangles are in the net of a square-based pyramid?'), 4, [3, 5, 6], T('Un triángulo por cada lado de la base.', 'Un triangle per cada costat de la base.', 'One triangle for each side of the base.')),
      q(T('El desarrollo de una pirámide hexagonal, ¿cuántas caras tiene en total?', 'El desenvolupament d’una piràmide hexagonal, quantes cares té en total?', 'How many faces in total in the net of a hexagonal pyramid?'), 7, [6, 8, 12], T('6 triángulos + 1 hexágono de base.', '6 triangles + 1 hexàgon de base.', '6 triangles + 1 hexagon base.')),
      mc(T('¿Qué cuerpo sale al doblar un desarrollo con 2 círculos y 1 rectángulo?', 'Quin cos ix en doblegar un desenvolupament amb 2 cercles i 1 rectangle?', 'Which solid do you get by folding a net of 2 circles and 1 rectangle?'), T('un cilindro', 'un cilindre', 'a cylinder'), [T('un cono', 'un con', 'a cone'), T('una esfera', 'una esfera', 'a sphere'), T('un cubo', 'un cub', 'a cube')], T('Dos bases redondas y una superficie que las rodea.', 'Dues bases redones i una superfície que les envolta.', 'Two round bases and a surface wrapped around them.')),
      mc(T('Un desarrollo tiene 1 pentágono y 5 triángulos. ¿Qué cuerpo forma?', 'Un desenvolupament té 1 pentàgon i 5 triangles. Quin cos forma?', 'A net has 1 pentagon and 5 triangles. Which solid does it make?'), T('una pirámide pentagonal', 'una piràmide pentagonal', 'a pentagonal pyramid'), [T('un prisma pentagonal', 'un prisma pentagonal', 'a pentagonal prism'), T('un cubo', 'un cub', 'a cube'), T('un cilindro', 'un cilindre', 'a cylinder')], T('Una base y triángulos: pirámide.', 'Una base i triangles: piràmide.', 'One base and triangles: pyramid.')),
      q(T('El desarrollo de un prisma pentagonal, ¿cuántos rectángulos tiene?', 'El desenvolupament d’un prisma pentagonal, quants rectangles té?', 'How many rectangles in the net of a pentagonal prism?'), 5, [2, 6, 7], T('Uno por cada lado del pentágono.', 'Un per cada costat del pentàgon.', 'One for each side of the pentagon.')),
    ],
  },
  '5P-M-24': {
    explain: [T('Dos figuras son semejantes si tienen la misma forma aunque distinto tamaño: una es una ampliación o reducción de la otra.', 'Dues figures són semblants si tenen la mateixa forma encara que diferent grandària: una és una ampliació o reducció de l’altra.', 'Two shapes are similar if they have the same shape but different size: one is an enlargement or reduction of the other.'),
      T('Todos los lados se multiplican por el mismo número y los ángulos no cambian.', 'Tots els costats es multipliquen pel mateix nombre i els angles no canvien.', 'All the sides are multiplied by the same number and the angles do not change.')],
    example: { q: T('Un triángulo de lados 3, 4 y 5 cm se amplía al doble. ¿Cuánto miden sus lados?', 'Un triangle de costats 3, 4 i 5 cm s’amplia al doble. Quant mesuren els seus costats?', 'A triangle with sides 3, 4 and 5 cm is enlarged to double size. What are its sides?'),
      steps: [T('Multiplico cada lado por 2.', 'Multiplique cada costat per 2.', 'I multiply each side by 2.'), T('6, 8 y 10 cm. Los ángulos son los mismos.', '6, 8 i 10 cm. Els angles són els mateixos.', '6, 8 and 10 cm. The angles are the same.')] },
    make: similar(),
  },
  '5P-M-25': {
    explain: [T('La geometría dinámica (programas como GeoGebra) permite dibujar figuras y moverlas para ver qué cambia y qué se mantiene.', 'La geometria dinàmica (programes com GeoGebra) permet dibuixar figures i moure-les per a veure què canvia i què es manté.', 'Dynamic geometry (software such as GeoGebra) lets you draw shapes and move them to see what changes and what stays the same.'),
      T('Con figuras sencillas podemos componer otras: dos triángulos rectángulos iguales forman un rectángulo.', 'Amb figures senzilles podem compondre’n d’altres: dos triangles rectangles iguals formen un rectangle.', 'Simple shapes can make others: two equal right-angled triangles make a rectangle.')],
    example: { q: T('Al estirar un vértice de un triángulo, ¿cuánto siguen sumando sus ángulos?', 'En estirar un vèrtex d’un triangle, quant continuen sumant els seus angles?', 'If you drag one vertex of a triangle, what do its angles still add up to?'),
      steps: [T('El triángulo cambia de forma.', 'El triangle canvia de forma.', 'The triangle changes shape.'), T('Pero sus ángulos siempre suman 180°.', 'Però els seus angles sempre sumen 180°.', 'But its angles always add up to 180°.')] },
    bank: [
      q(T('Si estiro un rectángulo en un programa de geometría para que mida el doble de largo, ¿por cuánto se multiplica su área?', 'Si estire un rectangle en un programa de geometria perquè mesure el doble de llarg, per quant es multiplica la seua àrea?', 'If I stretch a rectangle in a geometry program to twice the length, what is its area multiplied by?'), 2, [4, 1, 3], T('Solo cambia una dimensión.', 'Només canvia una dimensió.', 'Only one dimension changes.')),
      q(T('Si amplío un cuadrado al doble de lado, ¿por cuánto se multiplica su área?', 'Si amplie un quadrat al doble de costat, per quant es multiplica la seua àrea?', 'If I double the side of a square, what is its area multiplied by?'), 4, [2, 8, 3], T('Cambian las dos dimensiones: 2 × 2.', 'Canvien les dues dimensions: 2 × 2.', 'Both dimensions change: 2 × 2.'), { visual: { type: 'emoji', rows: ['🟦🟦', '🟦🟦'] } }),
      q(T('¿Cuántos triángulos equiláteros iguales forman un hexágono regular?', 'Quants triangles equilàters iguals formen un hexàgon regular?', 'How many equal equilateral triangles make a regular hexagon?'), 6, [4, 3, 8], T('Une el centro con cada vértice.', 'Unix el centre amb cada vèrtex.', 'Join the centre to each vertex.'), { visual: { type: 'shape', sides: 6 } }),
      mc(T('Junto dos triángulos rectángulos iguales por su lado más largo. ¿Qué figura puede salir?', 'Ajunte dos triangles rectangles iguals pel costat més llarg. Quina figura pot eixir?', 'I join two equal right-angled triangles along their longest side. What shape can I get?'), T('un rectángulo', 'un rectangle', 'a rectangle'), [T('un círculo', 'un cercle', 'a circle'), T('un pentágono', 'un pentàgon', 'a pentagon'), T('un hexágono', 'un hexàgon', 'a hexagon')], T('El lado largo es la diagonal del rectángulo.', 'El costat llarg és la diagonal del rectangle.', 'The long side is the diagonal of the rectangle.')),
      mc(T('Al mover un vértice de un cuadrilátero, ¿qué se mantiene siempre?', 'En moure un vèrtex d’un quadrilàter, què es manté sempre?', 'When you drag a vertex of a quadrilateral, what always stays the same?'), T('Que sus ángulos suman 360°', 'Que els seus angles sumen 360°', 'Its angles add up to 360°'), [T('Su área', 'La seua àrea', 'Its area'), T('Que tiene ángulos rectos', 'Que té angles rectes', 'It has right angles'), T('Su perímetro', 'El seu perímetre', 'Its perimeter')], T('Un cuadrilátero se divide en dos triángulos: 180° + 180°.', 'Un quadrilàter es dividix en dos triangles: 180° + 180°.', 'A quadrilateral splits into two triangles: 180° + 180°.')),
      q(T('¿Cuántos cuadrados de 1 cm de lado caben en un cuadrado de 3 cm de lado?', 'Quants quadrats d’1 cm de costat caben en un quadrat de 3 cm de costat?', 'How many 1 cm squares fit in a 3 cm square?'), 9, [3, 6, 12], T('3 filas de 3.', '3 files de 3.', '3 rows of 3.')),
    ],
  },
  '5P-M-26': {
    explain: [T('Además del centro, el radio y el diámetro, la circunferencia tiene cuerdas (segmentos que unen dos puntos del borde) y arcos (trozos del borde). Un sector circular es un «trozo de pizza».', 'A més del centre, el radi i el diàmetre, la circumferència té cordes (segments que unixen dos punts de la vora) i arcs (trossos de la vora). Un sector circular és un «tros de pizza».', 'As well as the centre, radius and diameter, a circle has chords (segments joining two points on the edge) and arcs (pieces of the edge). A sector is a "slice of pizza".'),
      T('El diámetro es la cuerda más larga.', 'El diàmetre és la corda més llarga.', 'The diameter is the longest chord.')],
    example: { q: T('¿Qué es un trozo de pizza visto desde arriba?', 'Què és un tros de pizza vist des de dalt?', 'What is a slice of pizza seen from above?'), visual: { type: 'frac', n: 1, d: 8, shape: 'circle' },
      steps: [T('Tiene dos radios y un arco.', 'Té dos radis i un arc.', 'It has two radii and an arc.'), T('Es un sector circular.', 'És un sector circular.', 'It is a sector.')] },
    make: mix(radiusDiameter(40), (r) => {
      const IT: [T3, T3][] = [[T('Un segmento que une dos puntos de la circunferencia sin pasar por el centro', 'Un segment que unix dos punts de la circumferència sense passar pel centre', 'A segment joining two points on the circle, not through the centre'), T('cuerda', 'corda', 'chord')], [T('Un trozo de la circunferencia', 'Un tros de la circumferència', 'A piece of the circle’s edge'), T('arco', 'arc', 'arc')], [T('La región entre dos radios y un arco', 'La regió entre dos radis i un arc', 'The region between two radii and an arc'), T('sector circular', 'sector circular', 'sector')], [T('El segmento del centro a la circunferencia', 'El segment del centre a la circumferència', 'The segment from the centre to the edge'), T('radio', 'radi', 'radius')], [T('La cuerda que pasa por el centro', 'La corda que passa pel centre', 'The chord through the centre'), T('diámetro', 'diàmetre', 'diameter')]];
      const i = int(r, 0, IT.length - 1); return mc(X((l) => [`${IT[i][0][0]}. ¿Cómo se llama?`, `${IT[i][0][1]}. Com es diu?`, `${IT[i][0][2]}. What is it called?`][l]), IT[i][1], IT.filter((_, j) => j !== i).map((x) => x[1]), T('Recuerda: radio, diámetro, cuerda, arco y sector.', 'Recorda: radi, diàmetre, corda, arc i sector.', 'Remember: radius, diameter, chord, arc and sector.'));
    }),
  },
  '5P-M-27': {
    explain: [T('Un polígono es convexo si todos sus ángulos interiores miden menos de 180°: no tiene «entrantes». Si tiene algún ángulo de más de 180°, es cóncavo.', 'Un polígon és convex si tots els seus angles interiors mesuren menys de 180°: no té «entrants». Si té algun angle de més de 180°, és còncau.', 'A polygon is convex if all its interior angles are less than 180°: it has no "dents". If any angle is more than 180°, it is concave.'),
      T('Truco: si una goma elástica alrededor de la figura toca todos los lados, es convexa.', 'Truc: si una goma elàstica al voltant de la figura toca tots els costats, és convexa.', 'Tip: if a rubber band stretched around the shape touches every side, it is convex.')],
    example: { q: T('Una estrella de cinco puntas, ¿es cóncava o convexa?', 'Una estrela de cinc puntes, és còncava o convexa?', 'Is a five-pointed star concave or convex?'), visual: { type: 'emoji', rows: ['⭐'], big: true },
      steps: [T('Entre punta y punta hay entrantes.', 'Entre punta i punta hi ha entrants.', 'There are dents between the points.'), T('Es cóncava.', 'És còncava.', 'It is concave.')] },
    bank: (() => {
      const CV = T('convexo', 'convex', 'convex'), CC = T('cóncavo', 'còncau', 'concave');
      const Q = (a: T3, pts?: [number, number][], sides?: number) => mc(T('¿Este polígono es cóncavo o convexo?', 'Este polígon és còncau o convex?', 'Is this polygon concave or convex?'), a, [a === CV ? CC : CV], T('¿Tiene algún entrante (un ángulo de más de 180°)?', 'Té algun entrant (un angle de més de 180°)?', 'Does it have a dent (an angle over 180°)?'), { visual: { type: 'shape', ...(pts ? { pts } : { sides }) } });
      return [Q(CV, undefined, 6), Q(CC, [[0, 0], [6, 0], [6, 5], [3, 2], [0, 5]]), Q(CV, [[0, 0], [5, 0], [6, 3], [2, 5]]), Q(CC, [[0, 0], [4, 0], [4, 2], [2, 2], [2, 4], [0, 4]]), Q(CV, undefined, 5), Q(CC, [[0, 0], [3, 2], [6, 0], [5, 5], [1, 5]]),
        q(T('Un polígono convexo de 5 lados, ¿cuánto suman sus ángulos interiores?', 'Un polígon convex de 5 costats, quant sumen els seus angles interiors?', 'What do the interior angles of a convex 5-sided polygon add up to?'), 540, [360, 180, 720], T('Se divide en 3 triángulos: 3 × 180°.', 'Es dividix en 3 triangles: 3 × 180°.', 'It splits into 3 triangles: 3 × 180°.'))];
    })(),
  },
  '5P-M-28': {
    explain: [T('Un fenómeno es aleatorio si no podemos saber el resultado antes de que ocurra (lanzar un dado). Es determinista si siempre da el mismo resultado (el agua hierve a 100 °C a nivel del mar).', 'Un fenomen és aleatori si no podem saber el resultat abans que passe (llançar un dau). És determinista si sempre dona el mateix resultat (l’aigua bull a 100 °C a nivell de la mar).', 'An event is random if we cannot know the result in advance (rolling a dice). It is deterministic if it always gives the same result (water boils at 100 °C at sea level).')],
    example: { q: T('Soltar una pelota desde la ventana y ver si cae, ¿es aleatorio o determinista?', 'Deixar anar una pilota des de la finestra i veure si cau, és aleatori o determinista?', 'Dropping a ball out of the window to see if it falls: random or deterministic?'),
      steps: [T('Siempre cae, por la gravedad.', 'Sempre cau, per la gravetat.', 'It always falls, because of gravity.'), T('Es determinista.', 'És determinista.', 'It is deterministic.')] },
    bank: (() => {
      const AL = T('aleatorio', 'aleatori', 'random'), DE = T('determinista', 'determinista', 'deterministic');
      const Q = (s: T3, a: T3) => mc(X((l) => [`${s[0]}: ¿aleatorio o determinista?`, `${s[1]}: aleatori o determinista?`, `${s[2]}: random or deterministic?`][l]), a, [a === AL ? DE : AL], T('¿Puedes saber seguro el resultado antes? Si sí, determinista.', 'Pots saber segur el resultat abans? Si sí, determinista.', 'Can you know the result for sure beforehand? If so, deterministic.'));
      return [Q(T('Sacar una carta de una baraja sin mirar', 'Traure una carta d’una baralla sense mirar', 'Picking a card from a pack without looking'), AL), Q(T('Calcular 7 × 8', 'Calcular 7 × 8', 'Working out 7 × 8'), DE), Q(T('El número de la lotería que saldrá premiado', 'El nombre de la loteria que eixirà premiat', 'The winning lottery number'), AL), Q(T('Calentar hielo y ver si se derrite', 'Escalfar gel i veure si es fon', 'Heating ice to see if it melts'), DE), Q(T('Lanzar una moneda al aire', 'Llançar una moneda a l’aire', 'Tossing a coin'), AL), Q(T('La hora a la que sale el sol mañana según el calendario', 'L’hora a què ix el sol demà segons el calendari', 'The time the sun rises tomorrow, from the calendar'), DE), Q(T('El color del primer coche que pasará por la calle', 'El color del primer cotxe que passarà pel carrer', 'The colour of the next car to drive past'), AL)];
    })(),
  },
  '5P-M-29': {
    explain: [T('El espacio muestral es el conjunto de todos los resultados posibles. Un suceso es una parte de ese conjunto: «sacar par» = {2, 4, 6}.', 'L’espai mostral és el conjunt de tots els resultats possibles. Un succés és una part d’eixe conjunt: «traure parell» = {2, 4, 6}.', 'The sample space is the set of all possible outcomes. An event is part of that set: "even" = {2, 4, 6}.')],
    example: { q: T('Lanzo dos monedas. ¿Cuál es el espacio muestral?', 'Llance dues monedes. Quin és l’espai mostral?', 'I toss two coins. What is the sample space?'),
      steps: [T('Primera moneda: cara o cruz. Segunda: cara o cruz.', 'Primera moneda: cara o creu. Segona: cara o creu.', 'First coin: heads or tails. Second: heads or tails.'), T('{CC, CX, XC, XX}: 4 resultados.', '{CC, CX, XC, XX}: 4 resultats.', '{HH, HT, TH, TT}: 4 outcomes.')] },
    make: diceCoins(),
  },
  '5P-M-30': {
    explain: [T('La probabilidad es un número entre 0 y 1. Imposible = 0; seguro = 1; igual de probable que no = 1/2.', 'La probabilitat és un nombre entre 0 i 1. Impossible = 0; segur = 1; igual de probable que no = 1/2.', 'Probability is a number from 0 to 1. Impossible = 0; certain = 1; as likely as not = 1/2.'),
      T('Si todos los resultados son igual de probables: probabilidad = casos favorables ÷ casos posibles.', 'Si tots els resultats són igual de probables: probabilitat = casos favorables ÷ casos possibles.', 'If all outcomes are equally likely: probability = favourable ÷ possible outcomes.')],
    example: { q: T('En una bolsa hay 2 bolas rojas y 6 blancas. ¿Probabilidad de roja?', 'En una bossa hi ha 2 boles roges i 6 blanques. Probabilitat de roja?', 'A bag has 2 red and 6 white balls. Probability of red?'), visual: { type: 'emoji', rows: ['🔴🔴⚪⚪⚪⚪⚪⚪'] },
      steps: [T('Favorables: 2. Posibles: 8.', 'Favorables: 2. Possibles: 8.', 'Favourable: 2. Possible: 8.'), T('2/8 = 1/4.', '2/8 = 1/4.', '2/8 = 1/4.')] },
    make: probScale(),
  },
  '5P-M-31': {
    explain: [T('Cuando no sabemos la probabilidad, podemos experimentar: repetimos muchas veces y calculamos la frecuencia relativa (veces que pasa ÷ intentos).', 'Quan no sabem la probabilitat, podem experimentar: repetim moltes vegades i calculem la freqüència relativa (vegades que passa ÷ intents).', 'When we do not know the probability, we can experiment: repeat many times and work out the relative frequency (times it happens ÷ tries).'),
      T('Cuantos más intentos, más se acerca a la probabilidad real.', 'Com més intents, més s’acosta a la probabilitat real.', 'The more tries, the closer it gets to the real probability.')],
    example: { q: T('Lanzo un tapón 50 veces y cae de pie 15. ¿Frecuencia relativa?', 'Llance un tap 50 vegades i cau dret 15. Freqüència relativa?', 'I drop a bottle top 50 times and it lands upright 15 times. Relative frequency?'),
      steps: [T('15 de 50: 15/50.', '15 de 50: 15/50.', '15 out of 50: 15/50.'), T('Simplifico: 3/10.', 'Simplifique: 3/10.', 'Simplify: 3/10.')] },
    make: relFreq(),
  },
  '5P-M-32': {
    explain: [T('Para recoger datos: haz una pregunta clara, pregunta a todos, anota con marcas de recuento y cuenta. Comprueba que el total coincide con el número de personas.', 'Per a recollir dades: fes una pregunta clara, pregunta a tots, anota amb marques de recompte i compta. Comprova que el total coincidix amb el nombre de persones.', 'To collect data: ask a clear question, ask everyone, record with tally marks and count. Check the total matches the number of people.')],
    example: { q: T('He anotado 🍎 7, 🍌 5, 🍓 8. ¿A cuántas personas he preguntado?', 'He anotat 🍎 7, 🍌 5, 🍓 8. A quantes persones he preguntat?', 'I recorded 🍎 7, 🍌 5, 🍓 8. How many people did I ask?'),
      steps: [T('Sumo todas las frecuencias.', 'Sume totes les freqüències.', 'I add all the frequencies.'), T('7 + 5 + 8 = 20 personas.', '7 + 5 + 8 = 20 persones.', '7 + 5 + 8 = 20 people.')] },
    make: tally(26),
  },
  '5P-M-33': {
    explain: [T('Un diagrama de sectores muestra qué parte del total es cada dato. El círculo entero es el total (100 %).', 'Un diagrama de sectors mostra quina part del total és cada dada. El cercle sencer és el total (100 %).', 'A pie chart shows what part of the whole each item is. The whole circle is the total (100%).'),
      T('Medio círculo es la mitad; un cuarto de círculo, la cuarta parte.', 'Mig cercle és la meitat; un quart de cercle, la quarta part.', 'Half the circle is half; a quarter of the circle is a quarter.')],
    example: { q: T('El sector «natación» es 1/4 del círculo y votaron 40. ¿Cuántos eligieron natación?', 'El sector «natació» és 1/4 del cercle i van votar 40. Quants van triar natació?', 'The "swimming" slice is 1/4 of the circle and 40 voted. How many chose swimming?'), visual: { type: 'frac', n: 1, d: 4, shape: 'circle' },
      steps: [T('1/4 de 40 = 40 ÷ 4.', '1/4 de 40 = 40 ÷ 4.', '1/4 of 40 = 40 ÷ 4.'), T('10 personas.', '10 persones.', '10 people.')] },
    make: pieChart(),
  },
  '5P-M-34': {
    explain: [T('Media: suma y divide. Mediana: ordena y toma el del centro (si hay dos en el centro, su media). Moda: el que más se repite.', 'Mitjana: suma i dividix. Mediana: ordena i pren la del centre (si n’hi ha dues en el centre, la seua mitjana). Moda: la que més es repetix.', 'Mean: add and divide. Median: order and take the middle (if two are in the middle, their mean). Mode: the most common.')],
    example: { q: T('Notas: 6, 8, 5, 9. ¿Cuál es la mediana?', 'Notes: 6, 8, 5, 9. Quina és la mediana?', 'Marks: 6, 8, 5, 9. What is the median?'),
      steps: [T('Ordeno: 5, 6, 8, 9. En el centro están 6 y 8.', 'Ordene: 5, 6, 8, 9. En el centre hi ha 6 i 8.', 'In order: 5, 6, 8, 9. In the middle are 6 and 8.'), T('(6 + 8) ÷ 2 = 7.', '(6 + 8) ÷ 2 = 7.', '(6 + 8) ÷ 2 = 7.')] },
    make: mix(averages(['mean', 'median', 'mode'], 5, 20), averages(['median'], 4, 20)),
  },
  '5P-M-35': {
    explain: [T('El rango mide la dispersión: cuánto se separan los datos. Rango = dato mayor − dato menor.', 'El rang mesura la dispersió: quant se separen les dades. Rang = dada major − dada menor.', 'The range measures spread: how far apart the data are. Range = biggest − smallest.'),
      T('Dos grupos pueden tener la misma media y rangos muy distintos.', 'Dos grups poden tindre la mateixa mitjana i rangs molt diferents.', 'Two groups can have the same mean but very different ranges.')],
    example: { q: T('Temperaturas: 12, 18, 15, 9, 20 °C. ¿Rango?', 'Temperatures: 12, 18, 15, 9, 20 °C. Rang?', 'Temperatures: 12, 18, 15, 9, 20 °C. Range?'),
      steps: [T('Mayor: 20. Menor: 9.', 'Major: 20. Menor: 9.', 'Biggest: 20. Smallest: 9.'), T('20 − 9 = 11 °C.', '20 − 9 = 11 °C.', '20 − 9 = 11 °C.')] },
    make: averages(['range'], 6, 60),
  },
  '5P-M-36': {
    explain: [T('Una sucesión sigue una regla. Si suma siempre lo mismo, es aritmética; si multiplica siempre por lo mismo, es geométrica.', 'Una successió seguix una regla. Si suma sempre el mateix, és aritmètica; si multiplica sempre pel mateix, és geomètrica.', 'A sequence follows a rule. If it always adds the same amount, it is arithmetic; if it always multiplies by the same number, it is geometric.')],
    example: { q: S('2, 6, 18, 54, ?'),
      steps: [T('Cada término es el anterior × 3.', 'Cada terme és l’anterior × 3.', 'Each term is the one before × 3.'), T('54 × 3 = 162.', '54 × 3 = 162.', '54 × 3 = 162.')] },
    make: sequence(500, [6, 7, 8, 9, 11, 12, 15, 25, 125], true),
  },
  '5P-M-37': {
    explain: [T('Un valor desconocido se puede escribir con una letra o un símbolo. Para encontrarlo, deshaz las operaciones con las contrarias.', 'Un valor desconegut es pot escriure amb una lletra o un símbol. Per a trobar-lo, desfés les operacions amb les contràries.', 'An unknown value can be written as a letter or symbol. To find it, undo the operations with their opposites.')],
    example: { q: S('? × 7 = 84'), visual: { type: 'balance', left: '? × 7', right: '84' },
      steps: [T('Lo contrario de × 7 es ÷ 7.', 'El contrari de × 7 és ÷ 7.', 'The opposite of × 7 is ÷ 7.'), T('84 ÷ 7 = 12.', '84 ÷ 7 = 12.', '84 ÷ 7 = 12.')] },
    make: gapEquation(500, ['+', '−', '×', '÷']),
  },
  '5P-M-38': {
    explain: [T('Un algoritmo es una secuencia ordenada de pasos para resolver un problema. Puede tener bucles (repetir) y decisiones («si… entonces…»).', 'Un algorisme és una seqüència ordenada de passos per a resoldre un problema. Pot tindre bucles (repetir) i decisions («si… aleshores…»).', 'An algorithm is an ordered sequence of steps to solve a problem. It can have loops (repeat) and decisions ("if… then…").')],
    example: { q: T('Algoritmo: «Empieza en 1. Repite 4 veces: multiplica por 2». ¿Resultado?', 'Algorisme: «Comença en 1. Repetix 4 vegades: multiplica per 2». Resultat?', 'Algorithm: "Start at 1. Repeat 4 times: multiply by 2". Result?'),
      steps: [T('1 → 2 → 4 → 8 → 16.', '1 → 2 → 4 → 8 → 16.', '1 → 2 → 4 → 8 → 16.'), T('El resultado es 16.', 'El resultat és 16.', 'The result is 16.')] },
    make: mix(loops(), (r) => {
      const s = int(r, 1, 5), m = int(r, 2, 3), n = int(r, 2, 4), a = s * m ** n;
      return q(X((l) => [`Algoritmo: «Empieza en ${s}. Repite ${n} veces: multiplica por ${m}». ¿Qué número sale?`, `Algorisme: «Comença en ${s}. Repetix ${n} vegades: multiplica per ${m}». Quin nombre ix?`, `Algorithm: "Start at ${s}. Repeat ${n} times: multiply by ${m}". What number do you get?`][l]), a, [s * m * n, s + m * n, s * m ** (n - 1)].filter((x) => x !== a), T('Haz cada repetición por turno y apunta el resultado.', 'Fes cada repetició per torn i apunta el resultat.', 'Do each repeat in turn and write down the result.'));
    }),
  },
  '5P-M-39': {
    explain: [T('En una hoja de cálculo, cada celda tiene un nombre: columna (letra) y fila (número), como B2. Las fórmulas empiezan por = y usan esos nombres: =A1+B1.', 'En un full de càlcul, cada cel·la té un nom: columna (lletra) i fila (nombre), com B2. Les fórmules comencen per = i usen eixos noms: =A1+B1.', 'In a spreadsheet each cell has a name: column (letter) and row (number), such as B2. Formulae start with = and use those names: =A1+B1.'),
      T('En programación por bloques, encajamos bloques de órdenes como piezas de puzle.', 'En programació per blocs, encaixem blocs d’ordres com peces de trencaclosques.', 'In block programming, we snap instruction blocks together like jigsaw pieces.')],
    example: { q: T('A1 = 5 y B1 = 3. ¿Qué muestra la celda con =A1*B1?', 'A1 = 5 i B1 = 3. Què mostra la cel·la amb =A1*B1?', 'A1 = 5 and B1 = 3. What does a cell with =A1*B1 show?'),
      steps: [T('* significa multiplicar.', '* significa multiplicar.', '* means multiply.'), T('5 × 3 = 15.', '5 × 3 = 15.', '5 × 3 = 15.')] },
    make: spreadsheet(),
  },
  '5P-M-40': {
    explain: [T('En los juegos de estrategia, busca posiciones ganadoras: si dejas al otro en ellas, gane lo que gane después, al final ganas tú.', 'En els jocs d’estratègia, busca posicions guanyadores: si deixes l’altre en elles, faça el que faça després, al final guanyes tu.', 'In strategy games, look for winning positions: if you leave the other player in one, whatever they do, you win in the end.')],
    example: { q: T('Cada uno quita de 1 a 3 fichas. ¿Qué cantidades conviene dejar al otro?', 'Cadascú lleva d’1 a 3 fitxes. Quines quantitats convé deixar a l’altre?', 'Each player removes 1 to 3 counters. Which numbers should you leave the other player?'),
      steps: [T('Si le dejo 4, quite lo que quite (1, 2 o 3), yo me llevo el resto.', 'Si li’n deixe 4, en lleve les que en lleve (1, 2 o 3), jo m’emporte la resta.', 'If I leave 4, whatever they take (1, 2 or 3), I take the rest.'), T('Conviene dejar 4, 8, 12…: múltiplos de 4.', 'Convé deixar 4, 8, 12…: múltiples de 4.', 'Leave 4, 8, 12…: multiples of 4.')] },
    make: nim(25),
  },
};
export default P;
