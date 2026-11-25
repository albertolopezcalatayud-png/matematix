import type { ContentPack } from '../types';
import { int, mc, pick, q, S, T, X, N, near } from '../lib';
import { angles, area, averages, CAP, chance, convert, decimals, diceCoins, divide, fractions, gapEquation, LEN, lineGraph, loops, MASS, money, mulDigits, mulDiv10, multiples, nim, placeValue, polygons, polyhedra, roundWhole, sequence, tally, timeUnits, twoStep, compareOrder } from '../gens';

type G = (r: () => number) => ReturnType<ReturnType<typeof placeValue>>;
const mix = (...gs: G[]): G => (r) => gs[int(r, 0, gs.length - 1)](r);

const P: ContentPack = {
  '4P-M-1': {
    explain: [T('Mil millares forman un millón. Los números hasta 999 999 tienen centenas de millar, decenas de millar y unidades de millar, además de centenas, decenas y unidades.', 'Mil milers formen un milió. Els nombres fins a 999 999 tenen centenes de miler, desenes de miler i unitats de miler, a més de centenes, desenes i unitats.', 'A thousand thousands make a million. Numbers up to 999,999 have hundred thousands, ten thousands and thousands, as well as hundreds, tens and ones.'),
      T('Para leerlos, sepáralos en grupos de tres cifras desde la derecha: 245 380 se lee «doscientos cuarenta y cinco mil trescientos ochenta».', 'Per a llegir-los, separa’ls en grups de tres xifres des de la dreta: 245 380 es llig «dos-cents quaranta-cinc mil tres-cents huitanta».', 'To read them, split them into groups of three digits from the right: 245,380 is "two hundred and forty-five thousand, three hundred and eighty".')],
    example: { q: T('¿Cuánto vale el 7 en 372 104?', 'Quant val el 7 en 372 104?', 'What is the 7 worth in 372,104?'),
      steps: [T('Contando desde la derecha: unidades (4), decenas (0), centenas (1), unidades de millar (2), decenas de millar (7).', 'Comptant des de la dreta: unitats (4), desenes (0), centenes (1), unitats de miler (2), desenes de miler (7).', 'Counting from the right: ones (4), tens (0), hundreds (1), thousands (2), ten thousands (7).'), T('El 7 vale 70 000.', 'El 7 val 70 000.', 'The 7 is worth 70,000.')] },
    make: mix(placeValue(6), placeValue(5), compareOrder(999999, 10000)),
  },
  '4P-M-2': {
    explain: [T('Los múltiplos de un número son los resultados de su tabla: múltiplos de 4 son 4, 8, 12, 16…', 'Els múltiples d’un nombre són els resultats de la seua taula: múltiples de 4 són 4, 8, 12, 16…', 'The multiples of a number are the answers in its times table: multiples of 4 are 4, 8, 12, 16…'),
      T('Un divisor de un número lo divide sin que sobre nada: 3 es divisor de 12 porque 12 ÷ 3 = 4 exacto.', 'Un divisor d’un nombre el dividix sense que sobre res: 3 és divisor de 12 perquè 12 ÷ 3 = 4 exacte.', 'A factor of a number divides it with nothing left over: 3 is a factor of 12 because 12 ÷ 3 = 4 exactly.')],
    example: { q: T('¿Es 42 múltiplo de 6?', '42 és múltiple de 6?', 'Is 42 a multiple of 6?'),
      steps: [T('Busco en la tabla del 6: 6 × 7 = 42.', 'Busque en la taula del 6: 6 × 7 = 42.', 'I look in the 6 times table: 6 × 7 = 42.'), T('Sí, 42 es múltiplo de 6 (y 6 es divisor de 42).', 'Sí, 42 és múltiple de 6 (i 6 és divisor de 42).', 'Yes, 42 is a multiple of 6 (and 6 is a factor of 42).')] },
    make: multiples(['isMult', 'whichDiv', 'nextMult']),
  },
  '4P-M-3': {
    explain: [T('Para multiplicar por un número de dos cifras: multiplica primero por las unidades, después por las decenas (empezando una columna a la izquierda) y suma los dos resultados.', 'Per a multiplicar per un nombre de dues xifres: multiplica primer per les unitats, després per les desenes (començant una columna a l’esquerra) i suma els dos resultats.', 'To multiply by a two-digit number: multiply by the ones first, then by the tens (starting one column to the left) and add the two results.')],
    example: { q: S('34 × 25 = ?'),
      steps: [T('34 × 5 = 170.', '34 × 5 = 170.', '34 × 5 = 170.'), T('34 × 20 = 680.', '34 × 20 = 680.', '34 × 20 = 680.'), T('170 + 680 = 850.', '170 + 680 = 850.', '170 + 680 = 850.')] },
    make: mix(mulDigits(2, 2), mulDigits(3, 2)),
  },
  '4P-M-4': {
    explain: [T('A veces al dividir sobra algo: es el resto. El resto siempre es menor que el divisor.', 'A vegades en dividir sobra alguna cosa: és el residu. El residu sempre és menor que el divisor.', 'Sometimes something is left over when you divide: the remainder. The remainder is always smaller than the divisor.'),
      T('Prueba de la división: divisor × cociente + resto = dividendo.', 'Prova de la divisió: divisor × quocient + residu = dividend.', 'Check: divisor × quotient + remainder = dividend.')],
    example: { q: S('47 ÷ 6'),
      steps: [T('6 × 7 = 42 es lo más cerca de 47 sin pasarse: el cociente es 7.', '6 × 7 = 42 és el més prop de 47 sense passar-se’n: el quocient és 7.', '6 × 7 = 42 is the closest to 47 without going over: the quotient is 7.'), T('47 − 42 = 5: el resto es 5.', '47 − 42 = 5: el residu és 5.', '47 − 42 = 5: the remainder is 5.'), T('Prueba: 6 × 7 + 5 = 47. ✓', 'Prova: 6 × 7 + 5 = 47. ✓', 'Check: 6 × 7 + 5 = 47. ✓')] },
    make: (r) => {
      if (r() < 0.3) { const d = int(r, 3, 9), c = int(r, 5, 30), rest = int(r, 1, d - 1), D = d * c + rest; return q(X((l) => [`En una división, el divisor es ${d}, el cociente ${c} y el resto ${rest}. ¿Cuál es el dividendo?`, `En una divisió, el divisor és ${d}, el quocient ${c} i el residu ${rest}. Quin és el dividend?`, `In a division the divisor is ${d}, the quotient ${c} and the remainder ${rest}. What is the dividend?`][l]), D, near(r, D, { also: [d * c, d * c - rest, d + c + rest] }), X((l) => [`Prueba de la división: ${d} × ${c} + ${rest}.`, `Prova de la divisió: ${d} × ${c} + ${rest}.`, `Check: ${d} × ${c} + ${rest}.`][l])); }
      return divide(30, [3, 4, 5, 6, 7, 8, 9], true)(r);
    },
  },
  '4P-M-5': {
    explain: [T('En una fracción, el denominador (abajo) dice en cuántas partes iguales se divide la unidad, y el numerador (arriba), cuántas partes se toman.', 'En una fracció, el denominador (baix) diu en quantes parts iguals es dividix la unitat, i el numerador (dalt), quantes parts es prenen.', 'In a fraction, the denominator (bottom) tells you how many equal parts the whole is split into, and the numerator (top) how many parts are taken.'),
      T('3/5 se lee «tres quintos»: 5 partes iguales y tomamos 3.', '3/5 es llig «tres cinquens»: 5 parts iguals i en prenem 3.', '3/5 is read "three fifths": 5 equal parts and we take 3.')],
    example: { q: T('¿Qué fracción está coloreada?', 'Quina fracció està acolorida?', 'Which fraction is shaded?'), visual: { type: 'frac', n: 3, d: 5, shape: 'bar' },
      steps: [T('La barra tiene 5 partes iguales: denominador 5.', 'La barra té 5 parts iguals: denominador 5.', 'The bar has 5 equal parts: denominator 5.'), T('Hay 3 coloreadas: numerador 3. Es 3/5.', 'N’hi ha 3 acolorides: numerador 3. És 3/5.', '3 are shaded: numerator 3. It is 3/5.')] },
    make: fractions(['read', 'parts'], 10),
  },
  '4P-M-6': {
    explain: [T('Si dos fracciones tienen el mismo denominador, es mayor la que tiene mayor numerador: 5/8 > 3/8.', 'Si dues fraccions tenen el mateix denominador, és major la que té el numerador major: 5/8 > 3/8.', 'If two fractions have the same denominator, the one with the bigger numerator is bigger: 5/8 > 3/8.'),
      T('Si tienen el mismo numerador, es mayor la de menor denominador: 1/3 > 1/5, porque las partes son más grandes.', 'Si tenen el mateix numerador, és major la de menor denominador: 1/3 > 1/5, perquè les parts són més grans.', 'If they have the same numerator, the one with the smaller denominator is bigger: 1/3 > 1/5, because the parts are bigger.')],
    example: { q: T('¿Qué es mayor, 1/4 o 1/6 de una pizza?', 'Què és major, 1/4 o 1/6 d’una pizza?', 'Which is bigger, 1/4 or 1/6 of a pizza?'),
      steps: [T('Con 4 trozos, cada trozo es más grande que con 6.', 'Amb 4 trossos, cada tros és més gran que amb 6.', 'With 4 slices, each slice is bigger than with 6.'), T('1/4 es mayor que 1/6.', '1/4 és major que 1/6.', '1/4 is bigger than 1/6.')] },
    make: fractions(['compare'], 12),
  },
  '4P-M-7': {
    explain: [T('Para calcular una fracción de una cantidad, divide la cantidad entre el denominador y multiplica por el numerador.', 'Per a calcular una fracció d’una quantitat, dividix la quantitat entre el denominador i multiplica pel numerador.', 'To find a fraction of an amount, divide the amount by the denominator and multiply by the numerator.')],
    example: { q: T('¿Cuánto es 3/4 de 20?', 'Quant és 3/4 de 20?', 'What is 3/4 of 20?'), visual: { type: 'frac', n: 3, d: 4, shape: 'bar' },
      steps: [T('20 ÷ 4 = 5: cada cuarto vale 5.', '20 ÷ 4 = 5: cada quart val 5.', '20 ÷ 4 = 5: each quarter is 5.'), T('3 × 5 = 15.', '3 × 5 = 15.', '3 × 5 = 15.')] },
    make: fractions(['of'], 10),
  },
  '4P-M-8': {
    explain: [T('Las décimas y centésimas son partes de la unidad: 1 unidad = 10 décimas = 100 centésimas.', 'Les dècimes i centèsimes són parts de la unitat: 1 unitat = 10 dècimes = 100 centèsimes.', 'Tenths and hundredths are parts of one: 1 = 10 tenths = 100 hundredths.'),
      T('Se escriben después de la coma: 3,25 son 3 unidades, 2 décimas y 5 centésimas.', 'S’escriuen després de la coma: 3,25 són 3 unitats, 2 dècimes i 5 centèsimes.', 'They go after the decimal point: 3.25 is 3 ones, 2 tenths and 5 hundredths.')],
    example: { q: T('¿Qué es mayor, 0,7 o 0,65?', 'Què és major, 0,7 o 0,65?', 'Which is bigger, 0.7 or 0.65?'),
      steps: [T('Las dos tienen 0 unidades. Comparo las décimas: 7 y 6.', 'Les dues tenen 0 unitats. Compare les dècimes: 7 i 6.', 'Both have 0 ones. I compare the tenths: 7 and 6.'), T('7 décimas es más: 0,7 es mayor (aunque 0,65 tenga más cifras).', '7 dècimes és més: 0,7 és major (encara que 0,65 tinga més xifres).', '7 tenths is more: 0.7 is bigger (even though 0.65 has more digits).')] },
    make: decimals(['place', 'compare'], 2),
  },
  '4P-M-9': {
    explain: [T('Para sumar o restar decimales, coloca las comas una debajo de otra. Si un número tiene menos decimales, completa con ceros: 3,5 = 3,50.', 'Per a sumar o restar decimals, col·loca les comes una davall de l’altra. Si un nombre té menys decimals, completa amb zeros: 3,5 = 3,50.', 'To add or subtract decimals, line up the decimal points. If one number has fewer decimal places, fill in with zeros: 3.5 = 3.50.')],
    example: { q: S('4,25 + 3,8 = ?'),
      steps: [T('Escribo 3,8 como 3,80 y coloco las comas en columna.', 'Escric 3,8 com 3,80 i col·loque les comes en columna.', 'I write 3.8 as 3.80 and line up the points.'), T('4,25 + 3,80 = 8,05.', '4,25 + 3,80 = 8,05.', '4.25 + 3.80 = 8.05.')] },
    make: decimals(['add', 'sub'], 2),
  },
  '4P-M-10': {
    explain: [T('Multiplicar por 10, 100 o 1 000 añade 1, 2 o 3 ceros. Dividir por 10, 100 o 1 000 los quita (si el número acaba en ceros).', 'Multiplicar per 10, 100 o 1 000 afig 1, 2 o 3 zeros. Dividir per 10, 100 o 1 000 els lleva (si el nombre acaba en zeros).', 'Multiplying by 10, 100 or 1,000 adds 1, 2 or 3 zeros. Dividing by 10, 100 or 1,000 takes them away (if the number ends in zeros).')],
    example: { q: S('36 × 100 = ?'),
      steps: [T('100 tiene dos ceros.', '100 té dos zeros.', '100 has two zeros.'), T('Añado dos ceros a 36: 3 600.', 'Afig dos zeros a 36: 3 600.', 'I add two zeros to 36: 3,600.')] },
    make: mulDiv10(90000),
  },
  '4P-M-11': {
    explain: [T('Para calcular de cabeza, busca números redondos: 49 + 26 es casi 50 + 26 = 76, y quito 1: 75.', 'Per a calcular de cap, busca nombres rodons: 49 + 26 és quasi 50 + 26 = 76, i lleve 1: 75.', 'For mental maths, look for round numbers: 49 + 26 is nearly 50 + 26 = 76, then take 1 away: 75.'),
      T('Para estimar, redondea antes de operar: 398 + 207 es más o menos 400 + 200 = 600.', 'Per a estimar, arredonix abans d’operar: 398 + 207 és més o menys 400 + 200 = 600.', 'To estimate, round before you calculate: 398 + 207 is about 400 + 200 = 600.')],
    example: { q: T('Estima 512 + 289.', 'Estima 512 + 289.', 'Estimate 512 + 289.'),
      steps: [T('512 ≈ 500 y 289 ≈ 300.', '512 ≈ 500 i 289 ≈ 300.', '512 ≈ 500 and 289 ≈ 300.'), T('500 + 300 = 800.', '500 + 300 = 800.', '500 + 300 = 800.')] },
    make: (r) => {
      if (r() < 0.5) return roundWhole(99999, [10, 100, 1000])(r);
      const a = int(r, 101, 899), b = int(r, 101, 899), ra = Math.round(a / 100) * 100, rb = Math.round(b / 100) * 100, est = ra + rb;
      return q(X((l) => [`Estima redondeando a las centenas: ${N(l, a)} + ${N(l, b)} ≈ ?`, `Estima arredonint a les centenes: ${N(l, a)} + ${N(l, b)} ≈ ?`, `Estimate by rounding to the nearest hundred: ${N(l, a)} + ${N(l, b)} ≈ ?`][l]), est, [a + b, est + 100, est - 100].filter((x) => x !== est),
        X((l) => [`${a} ≈ ${ra} y ${b} ≈ ${rb}. Suma los números redondos.`, `${a} ≈ ${ra} i ${b} ≈ ${rb}. Suma els nombres rodons.`, `${a} ≈ ${ra} and ${b} ≈ ${rb}. Add the round numbers.`][l]));
    },
  },
  '4P-M-12': {
    explain: [T('Muchos problemas de la vida diaria usan decimales (precios) y fracciones (la mitad, un cuarto). Lee bien qué te preguntan antes de calcular.', 'Molts problemes de la vida diària usen decimals (preus) i fraccions (la meitat, un quart). Llig bé què et pregunten abans de calcular.', 'Many everyday problems use decimals (prices) and fractions (a half, a quarter). Read carefully what is being asked before you calculate.')],
    example: { q: T('Una camiseta cuesta 12 € y la rebajan 1/4. ¿Cuánto descuentan?', 'Una samarreta costa 12 € i la rebaixen 1/4. Quant descompten?', 'A T-shirt costs €12 and is reduced by 1/4. How much is taken off?'),
      steps: [T('1/4 de 12 = 12 ÷ 4 = 3.', '1/4 de 12 = 12 ÷ 4 = 3.', '1/4 of 12 = 12 ÷ 4 = 3.'), T('Descuentan 3 €.', 'Descompten 3 €.', '€3 is taken off.')] },
    make: mix(money(20, true), fractions(['of'], 10), twoStep(100, true)),
  },
  '4P-M-13': {
    explain: [T('Unidades de longitud de mayor a menor: km, hm, dam, m, dm, cm, mm. Cada escalón hacia abajo multiplica por 10; hacia arriba, divide por 10.', 'Unitats de longitud de major a menor: km, hm, dam, m, dm, cm, mm. Cada graó cap avall multiplica per 10; cap amunt, dividix per 10.', 'Units of length from largest to smallest: km, hm, dam, m, dm, cm, mm. Each step down multiplies by 10; each step up divides by 10.')],
    example: { q: S('3 km = ? m'), visual: { type: 'ladder', units: ['km', 'hm', 'dam', 'm', 'dm', 'cm', 'mm'], from: 0, to: 3 },
      steps: [T('De km a m bajo 3 escalones: × 1 000.', 'De km a m baixe 3 graons: × 1 000.', 'From km to m is 3 steps down: × 1,000.'), T('3 × 1 000 = 3 000 m.', '3 × 1 000 = 3 000 m.', '3 × 1,000 = 3,000 m.')] },
    make: convert(LEN, [['km', 'm'], ['m', 'cm'], ['m', 'mm'], ['cm', 'mm'], ['m', 'km'], ['cm', 'm'], ['dm', 'cm'], ['hm', 'm']]),
  },
  '4P-M-14': {
    explain: [T('Masa: kg, hg, dag, g, dg, cg, mg. Capacidad: kL, hL, daL, L, dL, cL, mL. Funcionan igual que la longitud: cada escalón es ×10 o ÷10.', 'Massa: kg, hg, dag, g, dg, cg, mg. Capacitat: kL, hL, daL, L, dL, cL, mL. Funcionen igual que la longitud: cada graó és ×10 o ÷10.', 'Mass: kg, hg, dag, g, dg, cg, mg. Capacity: kL, hL, daL, L, dL, cL, mL. They work like length: each step is ×10 or ÷10.')],
    example: { q: S('2 L = ? cL'), visual: { type: 'ladder', units: ['kL', 'hL', 'daL', 'L', 'dL', 'cL', 'mL'], from: 3, to: 5 },
      steps: [T('De L a cL bajo 2 escalones: × 100.', 'De L a cL baixe 2 graons: × 100.', 'From L to cL is 2 steps down: × 100.'), T('2 × 100 = 200 cL.', '2 × 100 = 200 cL.', '2 × 100 = 200 cL.')] },
    make: mix(convert(MASS, [['kg', 'g'], ['g', 'kg'], ['g', 'mg'], ['kg', 'hg']]), convert(CAP, [['L', 'mL'], ['L', 'cL'], ['L', 'dL'], ['mL', 'L'], ['hL', 'L']])),
  },
  '4P-M-15': {
    explain: [T('1 hora = 60 minutos y 1 minuto = 60 segundos. 1 día = 24 horas y 1 semana = 7 días.', '1 hora = 60 minuts i 1 minut = 60 segons. 1 dia = 24 hores i 1 setmana = 7 dies.', '1 hour = 60 minutes and 1 minute = 60 seconds. 1 day = 24 hours and 1 week = 7 days.'),
      T('Cuidado: el tiempo no va de 10 en 10. 1 h 30 min no son 130 minutos, sino 90.', 'Compte: el temps no va de 10 en 10. 1 h 30 min no són 130 minuts, sinó 90.', 'Careful: time does not go in tens. 1 h 30 min is not 130 minutes but 90.')],
    example: { q: T('¿Cuántos minutos son 2 h y 15 min?', 'Quants minuts són 2 h i 15 min?', 'How many minutes are 2 h 15 min?'),
      steps: [T('2 h = 2 × 60 = 120 min.', '2 h = 2 × 60 = 120 min.', '2 h = 2 × 60 = 120 min.'), T('120 + 15 = 135 min.', '120 + 15 = 135 min.', '120 + 15 = 135 min.')] },
    make: timeUnits(),
  },
  '4P-M-16': {
    explain: [T('Los ángulos se miden en grados (°). Un ángulo recto mide 90°; uno llano, 180°; una vuelta entera, 360°.', 'Els angles es mesuren en graus (°). Un angle recte mesura 90°; un pla, 180°; una volta sencera, 360°.', 'Angles are measured in degrees (°). A right angle is 90°; a straight angle 180°; a full turn 360°.'),
      T('Si dos ángulos juntos forman un ángulo recto, suman 90°; si forman uno llano, suman 180°.', 'Si dos angles junts formen un angle recte, sumen 90°; si en formen un de pla, sumen 180°.', 'If two angles together make a right angle, they add up to 90°; if they make a straight angle, 180°.')],
    example: { q: T('Dos ángulos forman un ángulo llano. Uno mide 130°. ¿Cuánto mide el otro?', 'Dos angles formen un angle pla. Un mesura 130°. Quant mesura l’altre?', 'Two angles make a straight angle. One is 130°. What is the other?'),
      steps: [T('Un ángulo llano mide 180°.', 'Un angle pla mesura 180°.', 'A straight angle is 180°.'), T('180 − 130 = 50°.', '180 − 130 = 50°.', '180 − 130 = 50°.')] },
    make: angles(['classify', 'missing']),
  },
  '4P-M-17': {
    explain: [T('El área es la superficie que ocupa una figura. Se puede medir contando cuántos cuadraditos iguales caben dentro.', 'L’àrea és la superfície que ocupa una figura. Es pot mesurar comptant quants quadradets iguals hi caben dins.', 'Area is the amount of surface a shape covers. You can measure it by counting how many equal little squares fit inside.'),
      T('En un rectángulo, cuenta una fila y multiplica por el número de filas.', 'En un rectangle, compta una fila i multiplica pel nombre de files.', 'In a rectangle, count one row and multiply by the number of rows.')],
    example: { q: T('¿Cuántos cuadraditos ocupa la figura?', 'Quants quadradets ocupa la figura?', 'How many little squares does the shape cover?'), visual: { type: 'emoji', rows: ['🟪🟪🟪🟪🟪', '🟪🟪🟪🟪🟪', '🟪🟪🟪🟪🟪'] },
      steps: [T('Cada fila tiene 5 cuadraditos y hay 3 filas.', 'Cada fila té 5 quadradets i hi ha 3 files.', 'Each row has 5 squares and there are 3 rows.'), T('5 × 3 = 15 cuadraditos.', '5 × 3 = 15 quadradets.', '5 × 3 = 15 squares.')] },
    make: area(7, ['count', 'count', 'rect']),
  },
  '4P-M-18': {
    explain: [T('Un polígono regular tiene todos sus lados iguales y todos sus ángulos iguales, como el cuadrado o el triángulo equilátero.', 'Un polígon regular té tots els costats iguals i tots els angles iguals, com el quadrat o el triangle equilàter.', 'A regular polygon has all sides equal and all angles equal, like a square or an equilateral triangle.'),
      T('Un rectángulo no es regular: sus ángulos son iguales, pero sus lados no.', 'Un rectangle no és regular: els seus angles són iguals, però els costats no.', 'A rectangle is not regular: its angles are equal but its sides are not.')],
    example: { q: T('¿Cuántos lados tiene un octógono regular?', 'Quants costats té un octògon regular?', 'How many sides does a regular octagon have?'), visual: { type: 'shape', sides: 8 },
      steps: [T('«Octo» quiere decir ocho, como en «octubre» en el calendario romano.', '«Octo» vol dir huit, com en «octubre» en el calendari romà.', '"Octo" means eight, as in "octopus" (eight legs).'), T('Tiene 8 lados iguales.', 'Té 8 costats iguals.', 'It has 8 equal sides.')] },
    make: (r) => {
      if (r() < 0.6) return polygons(8)(r);
      const items: [readonly [string, string, string], boolean][] = [[T('un cuadrado', 'un quadrat', 'a square'), true], [T('un rectángulo de 6 × 3', 'un rectangle de 6 × 3', 'a 6 × 3 rectangle'), false], [T('un triángulo equilátero', 'un triangle equilàter', 'an equilateral triangle'), true], [T('un rombo sin ángulos rectos', 'un rombe sense angles rectes', 'a rhombus without right angles'), false], [T('un hexágono con todos los lados y ángulos iguales', 'un hexàgon amb tots els costats i angles iguals', 'a hexagon with all sides and angles equal'), true], [T('un triángulo isósceles', 'un triangle isòsceles', 'an isosceles triangle'), false]];
      const [o, yes] = pick(r, items);
      return mc(X((l) => [`¿Es ${o[0]} un polígono regular?`, `És ${o[1]} un polígon regular?`, `Is ${o[2]} a regular polygon?`][l]), yes ? T('Sí', 'Sí', 'Yes') : T('No', 'No', 'No'), [yes ? T('No', 'No', 'No') : T('Sí', 'Sí', 'Yes')], T('Regular: todos los lados iguales y todos los ángulos iguales.', 'Regular: tots els costats iguals i tots els angles iguals.', 'Regular: all sides equal and all angles equal.'));
    },
  },
  '4P-M-19': {
    explain: [T('Un polígono se puede descomponer en triángulos trazando diagonales desde un vértice. Así podemos calcular su área o sus ángulos.', 'Un polígon es pot descompondre en triangles traçant diagonals des d’un vèrtex. Així podem calcular la seua àrea o els seus angles.', 'A polygon can be split into triangles by drawing diagonals from one vertex. This helps us work out its area or angles.'),
      T('Desde un vértice de un polígono de n lados salen n − 3 diagonales y se forman n − 2 triángulos.', 'Des d’un vèrtex d’un polígon de n costats ixen n − 3 diagonals i es formen n − 2 triangles.', 'From one vertex of an n-sided polygon you can draw n − 3 diagonals, making n − 2 triangles.')],
    example: { q: T('¿En cuántos triángulos se divide un hexágono trazando diagonales desde un vértice?', 'En quants triangles es dividix un hexàgon traçant diagonals des d’un vèrtex?', 'Into how many triangles is a hexagon split by diagonals from one vertex?'), visual: { type: 'shape', sides: 6 },
      steps: [T('El hexágono tiene 6 lados.', 'L’hexàgon té 6 costats.', 'A hexagon has 6 sides.'), T('6 − 2 = 4 triángulos.', '6 − 2 = 4 triangles.', '6 − 2 = 4 triangles.')] },
    make: (r) => {
      const n = int(r, 4, 8), tri = r() < 0.5;
      return q(X((l) => tri ? [`Desde un vértice de un polígono de ${n} lados trazo todas las diagonales. ¿Cuántos triángulos se forman?`, `Des d’un vèrtex d’un polígon de ${n} costats traço totes les diagonals. Quants triangles es formen?`, `From one vertex of a ${n}-sided polygon I draw all the diagonals. How many triangles are formed?`][l] : [`¿Cuántas diagonales salen de un vértice de un polígono de ${n} lados?`, `Quantes diagonals ixen d’un vèrtex d’un polígon de ${n} costats?`, `How many diagonals can be drawn from one vertex of a ${n}-sided polygon?`][l]),
        tri ? n - 2 : n - 3, near(r, tri ? n - 2 : n - 3, { min: 0, also: [n, n - 1] }), tri ? T('Se forman tantos triángulos como lados menos 2.', 'Es formen tants triangles com costats menys 2.', 'You get as many triangles as sides minus 2.') : T('No se puede unir con sí mismo ni con sus dos vecinos: lados menos 3.', 'No es pot unir amb ell mateix ni amb els dos veïns: costats menys 3.', 'It cannot join itself or its two neighbours: sides minus 3.'), { visual: { type: 'shape', sides: n } });
    },
  },
  '4P-M-20': {
    explain: [T('Un poliedro es un cuerpo con todas sus caras planas y poligonales. Tiene caras, aristas (donde se juntan dos caras) y vértices (las esquinas).', 'Un poliedre és un cos amb totes les cares planes i poligonals. Té cares, arestes (on s’ajunten dues cares) i vèrtexs (els cantons).', 'A polyhedron is a solid whose faces are all flat polygons. It has faces, edges (where two faces meet) and vertices (corners).'),
      T('Los prismas tienen dos bases iguales; las pirámides tienen una base y una punta.', 'Els prismes tenen dues bases iguals; les piràmides tenen una base i una punta.', 'Prisms have two equal bases; pyramids have one base and a point.')],
    example: { q: T('¿Cuántas caras tiene un cubo?', 'Quantes cares té un cub?', 'How many faces does a cube have?'), visual: { type: 'emoji', rows: ['🎲'], big: true },
      steps: [T('Como un dado: arriba, abajo y cuatro alrededor.', 'Com un dau: dalt, baix i quatre al voltant.', 'Like a dice: top, bottom and four around.'), T('6 caras.', '6 cares.', '6 faces.')] },
    make: polyhedra(),
  },
  '4P-M-21': {
    explain: [T('Una traslación desliza una figura sin girarla. Un giro la hace rotar alrededor de un punto. Una simetría la refleja como en un espejo.', 'Una translació llisca una figura sense girar-la. Un gir la fa rotar al voltant d’un punt. Una simetria la reflectix com en un espill.', 'A translation slides a shape without turning it. A rotation turns it around a point. A reflection flips it as in a mirror.'),
      T('En las tres, la figura no cambia de forma ni de tamaño.', 'En les tres, la figura no canvia de forma ni de grandària.', 'In all three, the shape keeps its form and size.')],
    example: { q: T('La letra A en un espejo, ¿se ve igual?', 'La lletra A en un espill, es veu igual?', 'Does the letter A look the same in a mirror?'), visual: { type: 'emoji', rows: ['A | A'], big: true },
      steps: [T('La A tiene un eje de simetría vertical: su mitad izquierda es igual que la derecha.', 'La A té un eix de simetria vertical: la meitat esquerra és igual que la dreta.', 'A has a vertical line of symmetry: its left half matches its right half.'), T('Sí, en el espejo se ve igual.', 'Sí, en l’espill es veu igual.', 'Yes, it looks the same in a mirror.')] },
    bank: (() => {
      const TR = T('traslación', 'translació', 'translation'), GI = T('giro', 'gir', 'rotation'), SI = T('simetría', 'simetria', 'reflection');
      const W = (qq: readonly [string, string, string], a: readonly [string, string, string]) => mc(qq, a, [TR, GI, SI].filter((x) => x !== a), T('Desliza: traslación. Gira: giro. Se refleja: simetría.', 'Llisca: translació. Gira: gir. Es reflectix: simetria.', 'Slides: translation. Turns: rotation. Flips: reflection.'));
      return [W(T('Una puerta que se abre, ¿qué movimiento hace?', 'Una porta que s’obri, quin moviment fa?', 'A door opening: what movement is it?'), GI), W(T('Un ascensor que sube, ¿qué movimiento hace?', 'Un ascensor que puja, quin moviment fa?', 'A lift going up: what movement is it?'), TR), W(T('Tu cara en un espejo, ¿qué movimiento es?', 'La teua cara en un espill, quin moviment és?', 'Your face in a mirror: what movement is it?'), SI), W(T('Las agujas de un reloj, ¿qué movimiento hacen?', 'Les agulles d’un rellotge, quin moviment fan?', 'The hands of a clock: what movement is it?'), GI), W(T('Una caja que empujas por el suelo sin girarla, ¿qué movimiento hace?', 'Una caixa que empentes pel terra sense girar-la, quin moviment fa?', 'A box you push across the floor without turning it: what movement is it?'), TR), W(T('Las dos alas de una mariposa, ¿qué relación tienen?', 'Les dues ales d’una papallona, quina relació tenen?', 'The two wings of a butterfly: how are they related?'), SI),
        q(T('¿Cuántos ejes de simetría tiene un cuadrado?', 'Quants eixos de simetria té un quadrat?', 'How many lines of symmetry does a square have?'), 4, [2, 1, 8], T('Dos que pasan por el medio de los lados y dos por las diagonales.', 'Dos que passen pel mig dels costats i dos per les diagonals.', 'Two through the middles of the sides and two along the diagonals.'), { visual: { type: 'shape', sides: 4 } }),
        q(T('¿Cuántos ejes de simetría tiene un rectángulo que no es cuadrado?', 'Quants eixos de simetria té un rectangle que no és quadrat?', 'How many lines of symmetry does a non-square rectangle have?'), 2, [4, 1, 0], T('Solo los que pasan por el medio de los lados; las diagonales no sirven.', 'Només els que passen pel mig dels costats; les diagonals no servixen.', 'Only the ones through the middles of the sides; the diagonals do not work.'), { visual: { type: 'shape', pts: [[0, 0], [6, 0], [6, 3], [0, 3]] } })];
    })(),
  },
  '4P-M-22': {
    explain: [T('Los puntos cardinales son norte (N), sur (S), este (E) y oeste (O). En casi todos los mapas, el norte está arriba.', 'Els punts cardinals són nord (N), sud (S), est (E) i oest (O). En quasi tots els mapes, el nord està dalt.', 'The compass points are north (N), south (S), east (E) and west (W). On almost every map, north is at the top.'),
      T('El sol sale por el este y se pone por el oeste.', 'El sol ix per l’est i es pon per l’oest.', 'The sun rises in the east and sets in the west.')],
    example: { q: T('En un mapa con el norte arriba, ¿qué hay a la derecha?', 'En un mapa amb el nord dalt, què hi ha a la dreta?', 'On a map with north at the top, what is on the right?'),
      steps: [T('Norte arriba, sur abajo.', 'Nord dalt, sud baix.', 'North at the top, south at the bottom.'), T('A la derecha está el este y a la izquierda, el oeste.', 'A la dreta està l’est i a l’esquerra, l’oest.', 'East is on the right and west on the left.')] },
    make: (r) => {
      const D: (readonly [string, string, string])[] = [T('norte', 'nord', 'north'), T('este', 'est', 'east'), T('sur', 'sud', 'south'), T('oeste', 'oest', 'west')];
      const k = int(r, 0, 2);
      if (k === 0) { const i = int(r, 0, 3); return mc(X((l) => [`Miro hacia el ${D[i][0]}. ¿Qué tengo a mi espalda?`, `Mire cap al ${D[i][1]}. Què tinc a l’esquena?`, `I face ${D[i][2]}. What is behind me?`][l]), D[(i + 2) % 4], D.filter((_, j) => j !== (i + 2) % 4), T('Detrás está el punto contrario: norte-sur, este-oeste.', 'Darrere està el punt contrari: nord-sud, est-oest.', 'Behind you is the opposite point: north-south, east-west.')); }
      if (k === 1) { const i = int(r, 0, 3); return mc(X((l) => [`Miro hacia el ${D[i][0]} y giro un cuarto de vuelta a la derecha. ¿Hacia dónde miro?`, `Mire cap al ${D[i][1]} i gire un quart de volta a la dreta. Cap a on mire?`, `I face ${D[i][2]} and make a quarter turn to the right. Which way am I facing now?`][l]), D[(i + 1) % 4], D.filter((_, j) => j !== (i + 1) % 4), T('Girando a la derecha: norte → este → sur → oeste → norte.', 'Girant a la dreta: nord → est → sud → oest → nord.', 'Turning right: north → east → south → west → north.')); }
      const x = int(r, 1, 4), y = int(r, 1, 4), dx = pick(r, [-2, -1, 1, 2]), dirE = dx > 0;
      return mc(X((l) => [`El colegio está en (${x}, ${y}) y el parque en (${x + dx}, ${y}). Con el norte arriba, ¿hacia dónde está el parque?`, `L’escola està en (${x}, ${y}) i el parc en (${x + dx}, ${y}). Amb el nord dalt, cap a on està el parc?`, `The school is at (${x}, ${y}) and the park at (${x + dx}, ${y}). With north at the top, which way is the park?`][l]), dirE ? D[1] : D[3], D.filter((d) => d !== (dirE ? D[1] : D[3])), T('Más x es hacia la derecha: el este. Menos x, el oeste.', 'Més x és cap a la dreta: l’est. Menys x, l’oest.', 'A bigger x is to the right: east. A smaller x is west.'), { visual: { type: 'grid', w: 6, h: 5, pts: [{ x, y, label: '🏫' }, { x: x + dx, y, label: '🌳' }], axes: true } });
    },
  },
  '4P-M-23': {
    explain: [T('Dos rectas en el plano pueden ser paralelas (no se cortan nunca) o secantes (se cortan en un punto). Si las secantes forman ángulos rectos, son perpendiculares.', 'Dues rectes en el pla poden ser paral·leles (no es tallen mai) o secants (es tallen en un punt). Si les secants formen angles rectes, són perpendiculars.', 'Two lines on a plane can be parallel (never meet) or intersecting (meet at one point). If they meet at right angles, they are perpendicular.')],
    example: { q: T('En un rectángulo, ¿cómo son dos lados de enfrente?', 'En un rectangle, com són dos costats de davant?', 'In a rectangle, what are two opposite sides?'), visual: { type: 'shape', pts: [[0, 0], [6, 0], [6, 3], [0, 3]] },
      steps: [T('Los lados de enfrente nunca se tocan aunque los alarguemos.', 'Els costats de davant mai es toquen encara que els allarguem.', 'Opposite sides never meet, even if we extend them.'), T('Son paralelos.', 'Són paral·lels.', 'They are parallel.')] },
    bank: (() => {
      const PA = T('paralelos', 'paral·lels', 'parallel'), PE = T('perpendiculares', 'perpendiculars', 'perpendicular'), SE = T('secantes no perpendiculares', 'secants no perpendiculars', 'intersecting, not perpendicular');
      const B = (qq: readonly [string, string, string], a: readonly [string, string, string], v?: [number, number][]) => mc(qq, a, [PA, PE, SE].filter((x) => x !== a), T('Paralelos: nunca se cortan. Perpendiculares: se cortan en ángulo recto (90°).', 'Paral·lels: mai es tallen. Perpendiculars: es tallen en angle recte (90°).', 'Parallel: never meet. Perpendicular: meet at a right angle (90°).'), v ? { visual: { type: 'shape', pts: v } } : {});
      return [B(T('En un rectángulo, ¿cómo son dos lados que se tocan?', 'En un rectangle, com són dos costats que es toquen?', 'In a rectangle, what are two sides that touch?'), PE, [[0, 0], [6, 0], [6, 3], [0, 3]]),
        B(T('En un rombo sin ángulos rectos, ¿cómo son dos lados que se tocan?', 'En un rombe sense angles rectes, com són dos costats que es toquen?', 'In a rhombus without right angles, what are two sides that touch?'), SE, [[0, 2], [3, 4], [6, 2], [3, 0]]),
        B(T('En un trapecio, ¿cómo son la base de arriba y la de abajo?', 'En un trapezi, com són la base de dalt i la de baix?', 'In a trapezium, what are the top and bottom sides?'), PA, [[0, 0], [6, 0], [4, 3], [1, 3]]),
        B(T('Las líneas del suelo y de la pared en una esquina de la clase, ¿cómo son?', 'Les línies del terra i de la paret en un cantó de la classe, com són?', 'The lines where the floor meets the wall in a corner of the classroom: what are they?'), PE),
        B(T('Dos calles que se cruzan formando una X estrecha, ¿cómo son?', 'Dos carrers que es creuen formant una X estreta, com són?', 'Two streets that cross like a narrow X: what are they?'), SE),
        B(T('Los dos raíles de una vía de tren, ¿cómo son?', 'Els dos rails d’una via de tren, com són?', 'The two rails of a railway track: what are they?'), PA),
        mc(T('Si dos rectas son perpendiculares, ¿cuánto mide cada ángulo que forman?', 'Si dues rectes són perpendiculars, quant mesura cada angle que formen?', 'If two lines are perpendicular, how big is each angle they make?'), T('90°', '90°', '90°'), [T('45°', '45°', '45°'), T('180°', '180°', '180°'), T('60°', '60°', '60°')], T('Forman cuatro ángulos rectos.', 'Formen quatre angles rectes.', 'They make four right angles.'))];
    })(),
  },
  '4P-M-24': {
    explain: [T('El espacio muestral es la lista de todos los resultados posibles de un experimento.', 'L’espai mostral és la llista de tots els resultats possibles d’un experiment.', 'The sample space is the list of all possible outcomes of an experiment.'),
      T('Lanzar una moneda: {cara, cruz}. Lanzar un dado: {1, 2, 3, 4, 5, 6}.', 'Llançar una moneda: {cara, creu}. Llançar un dau: {1, 2, 3, 4, 5, 6}.', 'Tossing a coin: {heads, tails}. Rolling a dice: {1, 2, 3, 4, 5, 6}.')],
    example: { q: T('Giro una ruleta con 3 colores: rojo, azul y verde. ¿Cuál es el espacio muestral?', 'Gire una ruleta amb 3 colors: roig, blau i verd. Quin és l’espai mostral?', 'I spin a spinner with 3 colours: red, blue and green. What is the sample space?'),
      steps: [T('Puede salir cualquiera de los 3 colores.', 'Pot eixir qualsevol dels 3 colors.', 'Any of the 3 colours can come up.'), T('{rojo, azul, verde}: 3 resultados.', '{roig, blau, verd}: 3 resultats.', '{red, blue, green}: 3 outcomes.')] },
    make: mix(diceCoins(), (r) => { const n = int(r, 3, 8); return q(X((l) => [`Una ruleta tiene ${n} sectores con números del 1 al ${n}. ¿Cuántos resultados tiene el espacio muestral?`, `Una ruleta té ${n} sectors amb nombres de l’1 al ${n}. Quants resultats té l’espai mostral?`, `A spinner has ${n} sections numbered 1 to ${n}. How many outcomes are in the sample space?`][l]), n, near(r, n, { min: 1, also: [n * 2] }), T('Un resultado por cada sector.', 'Un resultat per cada sector.', 'One outcome for each section.')); }),
  },
  '4P-M-25': {
    explain: [T('Para comparar probabilidades, cuenta cuántos resultados hacen que pase cada suceso. El que tiene más resultados favorables es más probable.', 'Per a comparar probabilitats, compta quants resultats fan que passe cada succés. El que té més resultats favorables és més probable.', 'To compare probabilities, count how many outcomes make each event happen. The one with more favourable outcomes is more likely.')],
    example: { q: T('Bolsa: 3 rojas, 5 azules, 1 verde. ¿Qué color es menos probable?', 'Bossa: 3 roges, 5 blaves, 1 verda. Quin color és menys probable?', 'Bag: 3 red, 5 blue, 1 green. Which colour is least likely?'), visual: { type: 'emoji', rows: ['🔴🔴🔴🔵🔵🔵🔵🔵🟢'] },
      steps: [T('Verde solo tiene 1 bola.', 'Verd només té 1 bola.', 'Green has only 1 ball.'), T('Verde es el menos probable.', 'Verd és el menys probable.', 'Green is the least likely.')] },
    make: mix(chance(['likely']), diceCoins()),
  },
  '4P-M-26': {
    explain: [T('Para hacer una encuesta: 1) piensa una pregunta clara; 2) pregunta a todas las personas del grupo; 3) apunta cada respuesta en una tabla de recuento; 4) cuenta las frecuencias.', 'Per a fer una enquesta: 1) pensa una pregunta clara; 2) pregunta a totes les persones del grup; 3) apunta cada resposta en una taula de recompte; 4) compta les freqüències.', 'To run a survey: 1) think of a clear question; 2) ask everyone in the group; 3) record each answer in a tally chart; 4) count the frequencies.')],
    example: { q: T('Si en la tabla hay ||||| |||, ¿cuántas respuestas son?', 'Si en la taula hi ha ||||| |||, quantes respostes són?', 'If the tally shows ||||| |||, how many answers is that?'),
      steps: [T('Un grupo de 5 (la marca cruzada) y 3 más.', 'Un grup de 5 (la marca creuada) i 3 més.', 'One group of 5 (the crossed one) and 3 more.'), T('5 + 3 = 8.', '5 + 3 = 8.', '5 + 3 = 8.')] },
    make: tally(22),
  },
  '4P-M-27': {
    explain: [T('Un gráfico de líneas muestra cómo cambia algo con el tiempo, por ejemplo la temperatura durante el día.', 'Un gràfic de línies mostra com canvia una cosa amb el temps, per exemple la temperatura durant el dia.', 'A line graph shows how something changes over time, for example the temperature during the day.'),
      T('Un gráfico de sectores es un círculo partido: cada trozo muestra qué parte del total es cada dato.', 'Un gràfic de sectors és un cercle partit: cada tros mostra quina part del total és cada dada.', 'A pie chart is a circle cut into slices: each slice shows what part of the whole each item is.')],
    example: { q: T('¿Qué temperatura había a las 12 h?', 'Quina temperatura feia a les 12 h?', 'What was the temperature at 12 h?'), visual: { type: 'chart', kind: 'line', x: ['8 h', '10 h', '12 h', '14 h'], y: [10, 14, 18, 20], yMax: 25, yStep: 5 },
      steps: [T('Busco las 12 h abajo y subo hasta el punto.', 'Busque les 12 h baix i puge fins al punt.', 'I find 12 h at the bottom and go up to the point.'), T('Miro a la izquierda: 18 °C.', 'Mire a l’esquerra: 18 °C.', 'I read across: 18 °C.')] },
    make: mix(lineGraph(), (r) => { const n = pick(r, [2, 4]); const d = n === 2 ? T('la mitad', 'la meitat', 'half') : T('una cuarta parte', 'una quarta part', 'a quarter'); const tot = int(r, 2, 10) * 4;
      return q(X((l) => [`En un gráfico de sectores, el sector de «fútbol» ocupa ${d[0]} del círculo. Si votaron ${tot} alumnos, ¿cuántos eligieron fútbol?`, `En un gràfic de sectors, el sector de «futbol» ocupa ${d[1]} del cercle. Si van votar ${tot} alumnes, quants van triar futbol?`, `In a pie chart, the "football" slice is ${d[2]} of the circle. If ${tot} pupils voted, how many chose football?`][l]), tot / n, near(r, tot / n, { also: [tot / (n === 2 ? 4 : 2), tot - tot / n], min: 1 }), X((l) => [`${d[0].charAt(0).toUpperCase() + d[0].slice(1)} de ${tot} es ${tot} ÷ ${n}.`, `${d[1].charAt(0).toUpperCase() + d[1].slice(1)} de ${tot} és ${tot} ÷ ${n}.`, `${d[2].charAt(0).toUpperCase() + d[2].slice(1)} of ${tot} is ${tot} ÷ ${n}.`][l]), { visual: { type: 'frac', n: 1, d: n, shape: 'circle' } }); }),
  },
  '4P-M-28': {
    explain: [T('La media es el reparto justo: suma todos los datos y divide entre cuántos hay. La mediana es el dato del centro cuando los ordenas. La moda es el que más se repite.', 'La mitjana és el repartiment just: suma totes les dades i dividix entre quantes n’hi ha. La mediana és la dada del centre quan les ordenes. La moda és la que més es repetix.', 'The mean is the fair share: add up all the values and divide by how many there are. The median is the middle value when they are in order. The mode is the most common.')],
    example: { q: T('Datos: 4, 7, 5, 4, 10. ¿Cuál es la media?', 'Dades: 4, 7, 5, 4, 10. Quina és la mitjana?', 'Data: 4, 7, 5, 4, 10. What is the mean?'),
      steps: [T('Suma: 4 + 7 + 5 + 4 + 10 = 30.', 'Suma: 4 + 7 + 5 + 4 + 10 = 30.', 'Sum: 4 + 7 + 5 + 4 + 10 = 30.'), T('Hay 5 datos: 30 ÷ 5 = 6.', 'Hi ha 5 dades: 30 ÷ 5 = 6.', 'There are 5 values: 30 ÷ 5 = 6.')] },
    make: averages(['mean', 'median', 'mode'], 5, 12),
  },
  '4P-M-29': {
    explain: [T('El rango dice cuánto se separan los datos: es el dato mayor menos el dato menor.', 'El rang diu quant se separen les dades: és la dada major menys la dada menor.', 'The range tells you how spread out the data are: the biggest value minus the smallest.')],
    example: { q: T('Alturas: 132, 128, 140, 135 cm. ¿Cuál es el rango?', 'Altures: 132, 128, 140, 135 cm. Quin és el rang?', 'Heights: 132, 128, 140, 135 cm. What is the range?'),
      steps: [T('Mayor: 140. Menor: 128.', 'Major: 140. Menor: 128.', 'Biggest: 140. Smallest: 128.'), T('140 − 128 = 12 cm.', '140 − 128 = 12 cm.', '140 − 128 = 12 cm.')] },
    make: averages(['range'], 6, 40),
  },
  '4P-M-30': {
    explain: [T('En una sucesión numérica cada término se obtiene del anterior con la misma regla. Puede ser sumar, restar o multiplicar.', 'En una successió numèrica cada terme s’obté de l’anterior amb la mateixa regla. Pot ser sumar, restar o multiplicar.', 'In a number sequence each term comes from the one before by the same rule. It might be adding, subtracting or multiplying.')],
    example: { q: S('3, 6, 12, 24, ?'),
      steps: [T('3 → 6 → 12 → 24: cada vez se multiplica por 2.', '3 → 6 → 12 → 24: cada vegada es multiplica per 2.', '3 → 6 → 12 → 24: it doubles each time.'), T('24 × 2 = 48.', '24 × 2 = 48.', '24 × 2 = 48.')] },
    make: sequence(300, [4, 6, 7, 8, 9, 12, 15, 25, 50], true),
  },
  '4P-M-31': {
    explain: [T('Un valor desconocido se puede escribir con un símbolo (? o □). Para hallarlo, usa la operación contraria.', 'Un valor desconegut es pot escriure amb un símbol (? o □). Per a trobar-lo, usa l’operació contrària.', 'An unknown value can be written with a symbol (? or □). To find it, use the opposite operation.')],
    example: { q: S('? ÷ 4 = 9'), visual: { type: 'balance', left: '? ÷ 4', right: '9' },
      steps: [T('Lo contrario de dividir entre 4 es multiplicar por 4.', 'El contrari de dividir entre 4 és multiplicar per 4.', 'The opposite of dividing by 4 is multiplying by 4.'), T('9 × 4 = 36. El valor es 36.', '9 × 4 = 36. El valor és 36.', '9 × 4 = 36. The value is 36.')] },
    make: gapEquation(200, ['+', '−', '×', '÷']),
  },
  '4P-M-32': {
    explain: [T('En la programación por bloques, cada bloque es una orden. Los bloques «repetir» hacen bucles: las órdenes de dentro se repiten las veces indicadas.', 'En la programació per blocs, cada bloc és una ordre. Els blocs «repetir» fan bucles: les ordres de dins es repetixen les vegades indicades.', 'In block programming, each block is an instruction. "Repeat" blocks make loops: the instructions inside are repeated the number of times shown.')],
    example: { q: T('Repetir 4 veces: «avanza 3». Si sale del 0, ¿dónde acaba?', 'Repetir 4 vegades: «avança 3». Si ix del 0, on acaba?', 'Repeat 4 times: "forward 3". Starting at 0, where does it end?'),
      steps: [T('Cada repetición avanza 3.', 'Cada repetició avança 3.', 'Each repeat moves forward 3.'), T('4 × 3 = 12. Acaba en el 12.', '4 × 3 = 12. Acaba en el 12.', '4 × 3 = 12. It ends at 12.')] },
    make: loops(),
  },
  '4P-M-33': {
    explain: [T('En los juegos de lógica se gana pensando, no por suerte. Busca la jugada que deja al otro sin buenas opciones.', 'En els jocs de lògica es guanya pensant, no per sort. Busca la jugada que deixa l’altre sense bones opcions.', 'In logic games you win by thinking, not by luck. Look for the move that leaves the other player without good options.')],
    example: { q: T('Hay 10 fichas y cada uno quita de 1 a 3. ¿Cuántas quitas para dejar al otro en un múltiplo de 4?', 'Hi ha 10 fitxes i cadascú en lleva d’1 a 3. Quantes en lleves per a deixar l’altre en un múltiple de 4?', 'There are 10 counters and each player removes 1 to 3. How many do you take to leave the other player a multiple of 4?'),
      steps: [T('El múltiplo de 4 más cercano por debajo de 10 es 8.', 'El múltiple de 4 més pròxim per davall de 10 és 8.', 'The nearest multiple of 4 below 10 is 8.'), T('10 − 8 = 2. Quito 2.', '10 − 8 = 2. En lleve 2.', '10 − 8 = 2. I take 2.')] },
    make: nim(21),
  },
};
export default P;
