import type { ContentPack, T3 } from '../types';
import { int, mc, q, S, T, X } from '../lib';
import { averages, barChart, CAP, chance, circle, combos, compositeArea, convert, decimals, durations, fracAddSub, fracMul, gridPoints, histogram, LEN, lcmGcd, lineGraph, MASS, negatives, nim, orderOps, percent, placeValue, polyhedra, powers, probScale, proportion, scale, sequence, simpleEq, simplify, spreadsheet, twoStep, volume, area } from '../gens';

type G = (r: () => number) => ReturnType<ReturnType<typeof placeValue>>;
const mix = (...gs: G[]): G => (r) => gs[int(r, 0, gs.length - 1)](r);

const P: ContentPack = {
  '6P-M-1': {
    explain: [T('Los números negativos son menores que cero y llevan el signo −. Los usamos para temperaturas bajo cero, plantas bajo tierra o deudas.', 'Els nombres negatius són menors que zero i porten el signe −. Els usem per a temperatures sota zero, plantes davall de terra o deutes.', 'Negative numbers are less than zero and have a − sign. We use them for temperatures below zero, basement floors or debts.'),
      T('En la recta, cuanto más a la izquierda, menor: −8 < −3 < 0 < 2.', 'En la recta, com més a l’esquerra, menor: −8 < −3 < 0 < 2.', 'On the number line, further left means smaller: −8 < −3 < 0 < 2.')],
    example: { q: T('Hace −3 °C y la temperatura baja 4 grados. ¿Qué temperatura hace?', 'Fa −3 °C i la temperatura baixa 4 graus. Quina temperatura fa?', 'It is −3 °C and the temperature falls 4 degrees. What is it now?'), visual: { type: 'line', min: -10, max: 5, marks: Array.from({ length: 16 }, (_, i) => i - 10), labels: [-10, -5, 0, 5], point: -3 },
      steps: [T('Bajar es ir hacia la izquierda en la recta.', 'Baixar és anar cap a l’esquerra en la recta.', 'Falling means moving left on the line.'), T('Desde −3, 4 pasos a la izquierda: −7 °C.', 'Des de −3, 4 passos a l’esquerra: −7 °C.', 'From −3, 4 steps left: −7 °C.')] },
    make: negatives(),
  },
  '6P-M-2': {
    explain: [T('Las potencias de 10 son un 1 seguido de ceros: 10² = 100, 10³ = 1 000, 10⁶ = 1 000 000. El exponente dice cuántos ceros.', 'Les potències de 10 són un 1 seguit de zeros: 10² = 100, 10³ = 1 000, 10⁶ = 1 000 000. L’exponent diu quants zeros.', 'Powers of 10 are a 1 followed by zeros: 10² = 100, 10³ = 1,000, 10⁶ = 1,000,000. The exponent tells you how many zeros.'),
      T('Sirven para escribir números grandes de forma corta: 5 000 = 5 × 10³.', 'Servixen per a escriure nombres grans de manera curta: 5 000 = 5 × 10³.', 'They let us write big numbers briefly: 5,000 = 5 × 10³.')],
    example: { q: T('¿Cómo se escribe 70 000 con una potencia de 10?', 'Com s’escriu 70 000 amb una potència de 10?', 'How do you write 70,000 using a power of 10?'),
      steps: [T('70 000 = 7 × 10 000.', '70 000 = 7 × 10 000.', '70,000 = 7 × 10,000.'), T('10 000 tiene 4 ceros: 7 × 10⁴.', '10 000 té 4 zeros: 7 × 10⁴.', '10,000 has 4 zeros: 7 × 10⁴.')] },
    make: mix(powers(['p10', 'sq', 'root']), (r) => { const a = int(r, 2, 9), e = int(r, 2, 6), v = a * 10 ** e; const sup = '⁰¹²³⁴⁵⁶⁷⁸⁹';
      return mc(X((l) => [`¿Cómo se escribe ${l === 2 ? v.toLocaleString('en-GB') : v.toLocaleString('es-ES').replace(/\./g, ' ')} con una potencia de 10?`, `Com s’escriu ${v.toLocaleString('es-ES').replace(/\./g, ' ')} amb una potència de 10?`, `How do you write ${v.toLocaleString('en-GB')} using a power of 10?`][l]), S(`${a} × 10${sup[e]}`), [S(`${a} × 10${sup[e + 1]}`), S(`${a} × 10${sup[e - 1]}`), S(`${e} × 10${sup[a]}`)].filter((x) => x[0] !== `${a} × 10${sup[e]}`), T('Cuenta los ceros que hay después de la primera cifra.', 'Compta els zeros que hi ha després de la primera xifra.', 'Count the zeros after the first digit.')); }),
  },
  '6P-M-3': {
    explain: [T('El mínimo común múltiplo (m.c.m.) es el número más pequeño que es múltiplo de los dos. Sirve para sumar fracciones o para saber cuándo coinciden dos cosas que se repiten.', 'El mínim comú múltiple (m.c.m.) és el nombre més xicotet que és múltiple dels dos. Servix per a sumar fraccions o per a saber quan coincidixen dues coses que es repetixen.', 'The lowest common multiple (LCM) is the smallest number that is a multiple of both. It helps to add fractions or find when two repeating things coincide.'),
      T('El máximo común divisor (m.c.d.) es el número más grande que divide a los dos. Sirve para repartir en grupos iguales lo más grandes posible.', 'El màxim comú divisor (m.c.d.) és el nombre més gran que dividix els dos. Servix per a repartir en grups iguals tan grans com siga possible.', 'The highest common factor (HCF) is the biggest number that divides both. It helps to share into the biggest possible equal groups.')],
    example: { q: S('m.c.m. (4, 6) = ?'),
      steps: [T('Múltiplos de 4: 4, 8, 12, 16… Múltiplos de 6: 6, 12, 18…', 'Múltiples de 4: 4, 8, 12, 16… Múltiples de 6: 6, 12, 18…', 'Multiples of 4: 4, 8, 12, 16… Multiples of 6: 6, 12, 18…'), T('El primero que coincide es 12.', 'El primer que coincidix és 12.', 'The first one they share is 12.')] },
    make: lcmGcd(),
  },
  '6P-M-4': {
    explain: [T('Una misma cantidad se puede escribir de tres formas: fracción, decimal y porcentaje. 1/4 = 0,25 = 25 %.', 'Una mateixa quantitat es pot escriure de tres maneres: fracció, decimal i percentatge. 1/4 = 0,25 = 25 %.', 'The same amount can be written three ways: fraction, decimal and percentage. 1/4 = 0.25 = 25%.'),
      T('Porcentaje significa «de cada 100»: 25 % = 25/100.', 'Percentatge significa «de cada 100»: 25 % = 25/100.', 'Per cent means "out of 100": 25% = 25/100.')],
    example: { q: T('Escribe 3/5 como porcentaje.', 'Escriu 3/5 com a percentatge.', 'Write 3/5 as a percentage.'),
      steps: [T('Busco denominador 100: 3/5 = 60/100.', 'Busque denominador 100: 3/5 = 60/100.', 'I make the denominator 100: 3/5 = 60/100.'), T('60/100 = 60 %.', '60/100 = 60 %.', '60/100 = 60%.')] },
    make: percent(['convert', 'whatpct']),
  },
  '6P-M-5': {
    explain: [T('Para calcular el x % de una cantidad, multiplica por x y divide entre 100. El 10 % es dividir entre 10; el 50 %, la mitad; el 25 %, la cuarta parte.', 'Per a calcular l’x % d’una quantitat, multiplica per x i dividix entre 100. El 10 % és dividir entre 10; el 50 %, la meitat; el 25 %, la quarta part.', 'To find x% of an amount, multiply by x and divide by 100. 10% means divide by 10; 50% is half; 25% is a quarter.'),
      T('Un descuento se resta del precio; un aumento se suma.', 'Un descompte es resta del preu; un augment se suma.', 'A discount is taken off the price; an increase is added on.')],
    example: { q: T('Un abrigo de 80 € tiene un 25 % de descuento. ¿Cuánto cuesta?', 'Un abric de 80 € té un 25 % de descompte. Quant costa?', 'An €80 coat has 25% off. How much is it?'),
      steps: [T('25 % de 80 = 80 ÷ 4 = 20 €.', '25 % de 80 = 80 ÷ 4 = 20 €.', '25% of 80 = 80 ÷ 4 = €20.'), T('80 − 20 = 60 €.', '80 − 20 = 60 €.', '80 − 20 = €60.')] },
    make: percent(['of', 'discount', 'increase']),
  },
  '6P-M-6': {
    explain: [T('Dos magnitudes son directamente proporcionales si, al multiplicar una por un número, la otra se multiplica por el mismo número: el doble de kilos, el doble de precio.', 'Dues magnituds són directament proporcionals si, en multiplicar-ne una per un nombre, l’altra es multiplica pel mateix nombre: el doble de quilos, el doble de preu.', 'Two quantities are directly proportional if, when you multiply one by a number, the other is multiplied by the same number: double the kilos, double the price.'),
      T('En una tabla de proporcionalidad, dividir un valor entre su pareja da siempre el mismo número.', 'En una taula de proporcionalitat, dividir un valor entre la seua parella dona sempre el mateix nombre.', 'In a proportion table, dividing one value by its partner always gives the same number.')],
    example: { q: T('3 kg de naranjas cuestan 6 €. ¿Cuánto cuestan 5 kg?', '3 kg de taronges costen 6 €. Quant costen 5 kg?', '3 kg of oranges cost €6. How much do 5 kg cost?'),
      steps: [T('1 kg cuesta 6 ÷ 3 = 2 €.', '1 kg costa 6 ÷ 3 = 2 €.', '1 kg costs 6 ÷ 3 = €2.'), T('5 kg cuestan 5 × 2 = 10 €.', '5 kg costen 5 × 2 = 10 €.', '5 kg cost 5 × 2 = €10.')] },
    make: proportion(),
  },
  '6P-M-7': {
    explain: [T('La regla de tres resuelve problemas de proporcionalidad: si a corresponde a b, ¿qué corresponde a c? Se calcula b × c ÷ a.', 'La regla de tres resol problemes de proporcionalitat: si a correspon a b, què correspon a c? Es calcula b × c ÷ a.', 'The rule of three solves proportion problems: if a goes with b, what goes with c? Work out b × c ÷ a.'),
      T('Antes, comprueba que es proporcional: si una cantidad sube, ¿la otra sube igual?', 'Abans, comprova que és proporcional: si una quantitat puja, l’altra puja igual?', 'First check it is proportional: if one amount goes up, does the other go up in the same way?')],
    example: { q: T('Con 4 huevos hago 12 crepes. ¿Cuántas con 6 huevos?', 'Amb 4 ous faig 12 creps. Quantes amb 6 ous?', 'With 4 eggs I make 12 pancakes. How many with 6 eggs?'),
      steps: [T('4 → 12 y 6 → ?', '4 → 12 i 6 → ?', '4 → 12 and 6 → ?'), T('12 × 6 ÷ 4 = 18 crepes.', '12 × 6 ÷ 4 = 18 creps.', '12 × 6 ÷ 4 = 18 pancakes.')] },
    make: mix(proportion(), (r) => { const a = int(r, 2, 6), k = int(r, 2, 6), c = int(r, 2, 12); if (c === a) return proportion()(r); const b = a * k;
      return q(X((l) => [`Con ${a} huevos hago ${b} crepes. ¿Cuántas crepes hago con ${c} huevos?`, `Amb ${a} ous faig ${b} creps. Quantes creps faig amb ${c} ous?`, `With ${a} eggs I make ${b} pancakes. How many pancakes with ${c} eggs?`][l]), k * c, [b + c - a, b * c, k + c].filter((x) => x !== k * c), X((l) => [`${b} × ${c} ÷ ${a}, o primero las crepes por huevo: ${k}.`, `${b} × ${c} ÷ ${a}, o primer les creps per ou: ${k}.`, `${b} × ${c} ÷ ${a}, or first the pancakes per egg: ${k}.`][l])); }),
  },
  '6P-M-8': {
    explain: [T('Sumar y restar: con denominador común. Multiplicar: numerador por numerador y denominador por denominador. Al final, simplifica.', 'Sumar i restar: amb denominador comú. Multiplicar: numerador per numerador i denominador per denominador. Al final, simplifica.', 'Adding and subtracting: with a common denominator. Multiplying: numerator times numerator and denominator times denominator. Simplify at the end.')],
    example: { q: S('2/3 × 3/4 = ?'),
      steps: [T('2 × 3 = 6 y 3 × 4 = 12: 6/12.', '2 × 3 = 6 i 3 × 4 = 12: 6/12.', '2 × 3 = 6 and 3 × 4 = 12: 6/12.'), T('Simplifico: 6/12 = 1/2.', 'Simplifique: 6/12 = 1/2.', 'Simplify: 6/12 = 1/2.')] },
    make: mix(fracAddSub(), fracMul(), simplify()),
  },
  '6P-M-9': {
    explain: [T('Sumar y restar decimales: comas en columna. Multiplicar: sin coma, y luego tantos decimales como los factores. Dividir entre un entero: la coma del cociente al bajar los decimales.', 'Sumar i restar decimals: comes en columna. Multiplicar: sense coma, i després tants decimals com els factors. Dividir entre un enter: la coma del quocient en baixar els decimals.', 'Adding and subtracting decimals: line up the points. Multiplying: ignore the points, then give as many decimal places as the factors. Dividing by a whole number: put the point in when you bring down the decimals.')],
    example: { q: S('7,5 ÷ 3 = ?'),
      steps: [T('7 ÷ 3 = 2 y sobra 1. Bajo el 5 y pongo la coma: 15 ÷ 3 = 5.', '7 ÷ 3 = 2 i sobra 1. Baixe el 5 i pose la coma: 15 ÷ 3 = 5.', '7 ÷ 3 = 2 remainder 1. I bring down the 5 and put the point: 15 ÷ 3 = 5.'), T('Resultado: 2,5.', 'Resultat: 2,5.', 'Answer: 2.5.')] },
    make: decimals(['add', 'sub', 'mul', 'div', 'round'], 2),
  },
  '6P-M-10': {
    explain: [T('En los problemas de varias operaciones, escribe cada paso con una frase: «primero calculo…, después…». Respeta el orden de las operaciones.', 'En els problemes de diverses operacions, escriu cada pas amb una frase: «primer calcule…, després…». Respecta l’ordre de les operacions.', 'In multi-step problems, write each step as a sentence: "first I work out…, then…". Follow the order of operations.')],
    example: { q: T('Compro 3 libretas a 2 € y un bolígrafo de 1,50 €. Pago con 10 €. ¿Cuánto me devuelven?', 'Compre 3 llibretes a 2 € i un bolígraf d’1,50 €. Pague amb 10 €. Quant em tornen?', 'I buy 3 notebooks at €2 and a pen for €1.50. I pay with €10. How much change?'),
      steps: [T('Libretas: 3 × 2 = 6 €. Total: 6 + 1,50 = 7,50 €.', 'Llibretes: 3 × 2 = 6 €. Total: 6 + 1,50 = 7,50 €.', 'Notebooks: 3 × 2 = €6. Total: 6 + 1.50 = €7.50.'), T('Cambio: 10 − 7,50 = 2,50 €.', 'Canvi: 10 − 7,50 = 2,50 €.', 'Change: 10 − 7.50 = €2.50.')] },
    make: mix(twoStep(500, true), orderOps(12)),
  },
  '6P-M-11': {
    explain: [T('Para convertir unidades, cuenta los escalones entre ellas. Longitud, masa y capacidad: ×10 por escalón. Superficie: ×100. Volumen: ×1 000.', 'Per a convertir unitats, compta els graons entre elles. Longitud, massa i capacitat: ×10 per graó. Superfície: ×100. Volum: ×1 000.', 'To convert units, count the steps between them. Length, mass and capacity: ×10 per step. Area: ×100. Volume: ×1,000.')],
    example: { q: S('4 500 mL = ? L'), visual: { type: 'ladder', units: ['L', 'dL', 'cL', 'mL'], from: 3, to: 0 },
      steps: [T('De mL a L subo 3 escalones: ÷ 1 000.', 'De mL a L puge 3 graons: ÷ 1 000.', 'From mL to L is 3 steps up: ÷ 1,000.'), T('4 500 ÷ 1 000 = 4,5 L.', '4 500 ÷ 1 000 = 4,5 L.', '4,500 ÷ 1,000 = 4.5 L.')] },
    make: mix(convert(LEN, [['km', 'm'], ['m', 'km'], ['cm', 'm'], ['mm', 'cm'], ['hm', 'm']]), convert(MASS, [['kg', 'g'], ['g', 'kg'], ['mg', 'g']]), convert(CAP, [['L', 'mL'], ['mL', 'L'], ['cL', 'L']])),
  },
  '6P-M-12': {
    explain: [T('El volumen es el espacio que ocupa un cuerpo. Se mide en unidades cúbicas: cm³, dm³, m³. Volumen de un ortoedro = largo × ancho × alto.', 'El volum és l’espai que ocupa un cos. Es mesura en unitats cúbiques: cm³, dm³, m³. Volum d’un ortoedre = llarg × ample × alt.', 'Volume is the space a solid takes up. It is measured in cubic units: cm³, dm³, m³. Volume of a cuboid = length × width × height.'),
      T('Relación con la capacidad: 1 dm³ = 1 L y 1 cm³ = 1 mL.', 'Relació amb la capacitat: 1 dm³ = 1 L i 1 cm³ = 1 mL.', 'Link with capacity: 1 dm³ = 1 L and 1 cm³ = 1 mL.')],
    example: { q: T('Un brik mide 10 cm × 6 cm × 20 cm. ¿Cuántos mL caben?', 'Un brik mesura 10 cm × 6 cm × 20 cm. Quants mL hi caben?', 'A carton measures 10 cm × 6 cm × 20 cm. How many mL does it hold?'),
      steps: [T('10 × 6 × 20 = 1 200 cm³.', '10 × 6 × 20 = 1 200 cm³.', '10 × 6 × 20 = 1,200 cm³.'), T('1 cm³ = 1 mL: caben 1 200 mL.', '1 cm³ = 1 mL: hi caben 1 200 mL.', '1 cm³ = 1 mL: it holds 1,200 mL.')] },
    make: volume(),
  },
  '6P-M-13': {
    explain: [T('Para sumar tiempos, suma por separado horas y minutos; si los minutos pasan de 60, conviértelos en una hora más.', 'Per a sumar temps, suma per separat hores i minuts; si els minuts passen de 60, convertix-los en una hora més.', 'To add times, add hours and minutes separately; if the minutes go over 60, turn them into an extra hour.')],
    example: { q: T('Salgo a las 17:45 y tardo 1 h 30 min. ¿A qué hora llego?', 'Isc a les 17:45 i tarde 1 h 30 min. A quina hora arribe?', 'I leave at 17:45 and the journey takes 1 h 30 min. When do I arrive?'),
      steps: [T('17:45 + 1 h = 18:45.', '17:45 + 1 h = 18:45.', '17:45 + 1 h = 18:45.'), T('18:45 + 30 min = 19:15.', '18:45 + 30 min = 19:15.', '18:45 + 30 min = 19:15.')] },
    make: durations(300),
  },
  '6P-M-14': {
    explain: [T('Ninguna medida es perfecta: siempre hay un pequeño error. Para medir con precisión, usa el instrumento adecuado, mira de frente la escala y repite la medida varias veces.', 'Cap mesura és perfecta: sempre hi ha un xicotet error. Per a mesurar amb precisió, usa l’instrument adequat, mira de cara l’escala i repetix la mesura diverses vegades.', 'No measurement is perfect: there is always a small error. To measure accurately, use the right tool, look straight at the scale and repeat the measurement several times.'),
      T('Si mides varias veces, la media de las medidas suele ser el mejor valor.', 'Si mesures diverses vegades, la mitjana de les mesures sol ser el millor valor.', 'If you measure several times, the mean of the measurements is usually the best value.')],
    example: { q: T('Mido tres veces un lápiz: 14,2; 14,4 y 14,3 cm. ¿Qué valor doy?', 'Mesure tres vegades un llapis: 14,2; 14,4 i 14,3 cm. Quin valor done?', 'I measure a pencil three times: 14.2, 14.4 and 14.3 cm. What value should I give?'),
      steps: [T('Calculo la media: (14,2 + 14,4 + 14,3) ÷ 3.', 'Calcule la mitjana: (14,2 + 14,4 + 14,3) ÷ 3.', 'I work out the mean: (14.2 + 14.4 + 14.3) ÷ 3.'), T('42,9 ÷ 3 = 14,3 cm.', '42,9 ÷ 3 = 14,3 cm.', '42.9 ÷ 3 = 14.3 cm.')] },
    bank: [
      mc(T('¿Cómo se debe mirar la escala de una probeta para leer bien el volumen?', 'Com s’ha de mirar l’escala d’una proveta per a llegir bé el volum?', 'How should you look at a measuring cylinder to read the volume correctly?'), T('Con los ojos a la altura del líquido', 'Amb els ulls a l’altura del líquid', 'With your eyes level with the liquid'), [T('Desde arriba', 'Des de dalt', 'From above'), T('Desde abajo', 'Des de baix', 'From below'), T('Con un solo ojo cerrado', 'Amb un sol ull tancat', 'With one eye shut')], T('Mirar torcido hace que leas un número equivocado.', 'Mirar tort fa que llegisques un nombre equivocat.', 'Looking at an angle makes you read the wrong number.')),
      q(T('Mido una mesa cuatro veces: 120, 121, 119 y 120 cm. ¿Cuál es la media?', 'Mesure una taula quatre vegades: 120, 121, 119 i 120 cm. Quina és la mitjana?', 'I measure a table four times: 120, 121, 119 and 120 cm. What is the mean?'), 120, [121, 119, 480], T('Suma las cuatro medidas y divide entre 4.', 'Suma les quatre mesures i dividix entre 4.', 'Add the four measurements and divide by 4.')),
      mc(T('¿Qué instrumento es más preciso para medir el grosor de un cable?', 'Quin instrument és més precís per a mesurar el gruix d’un cable?', 'Which tool is most precise for measuring the thickness of a wire?'), T('un calibre', 'un calibre', 'calipers'), [T('una cinta métrica', 'una cinta mètrica', 'a tape measure'), T('una regla de 1 m', 'un regle d’1 m', 'a metre rule'), T('un cuentakilómetros', 'un comptaquilòmetres', 'an odometer')], T('El calibre mide décimas de milímetro.', 'El calibre mesura dècimes de mil·límetre.', 'Calipers measure tenths of a millimetre.')),
      mc(T('Una báscula marca 0,2 kg sin nada encima. ¿Qué debes hacer?', 'Una bàscula marca 0,2 kg sense res damunt. Què has de fer?', 'Scales show 0.2 kg with nothing on them. What should you do?'), T('Ponerla a cero antes de pesar', 'Posar-la a zero abans de pesar', 'Set them to zero before weighing'), [T('Sumar 0,2 a cada medida', 'Sumar 0,2 a cada mesura', 'Add 0.2 to every reading'), T('Usarla igual', 'Usar-la igual', 'Use them anyway'), T('Pesar dos veces lo mismo', 'Pesar dues vegades el mateix', 'Weigh the same thing twice')], T('Si no empieza en cero, todas las medidas salen mal.', 'Si no comença en zero, totes les mesures ixen malament.', 'If it does not start at zero, every reading is wrong.')),
      mc(T('Para medir 2,5 g de sal en un experimento, ¿qué báscula usarías?', 'Per a mesurar 2,5 g de sal en un experiment, quina bàscula usaries?', 'To measure 2.5 g of salt for an experiment, which scales would you use?'), T('Una que marque décimas de gramo', 'Una que marque dècimes de gram', 'One that shows tenths of a gram'), [T('Una báscula de baño', 'Una bàscula de bany', 'Bathroom scales'), T('Una que marque kilos', 'Una que marque quilos', 'One that shows kilograms'), T('Una balanza de fruta', 'Una balança de fruita', 'Fruit scales')], T('La precisión del instrumento debe ser menor que lo que mides.', 'La precisió de l’instrument ha de ser menor que el que mesures.', 'The tool’s precision must be finer than what you measure.')),
      q(T('Con una regla que marca milímetros, ¿cuál es el error máximo aproximado al medir? (en mm)', 'Amb un regle que marca mil·límetres, quin és l’error màxim aproximat en mesurar? (en mm)', 'With a ruler marked in millimetres, what is the approximate maximum error? (in mm)'), 1, [10, 0, 5], T('No puedes ver nada más pequeño que la marca más pequeña.', 'No pots veure res més xicotet que la marca més xicoteta.', 'You cannot see anything smaller than the smallest mark.')),
    ],
  },
  '6P-M-15': {
    explain: [T('Para calcular el área de un polígono complicado, divídelo en figuras conocidas (rectángulos y triángulos), calcula cada una y súmalas. O calcula una figura grande y resta lo que sobra.', 'Per a calcular l’àrea d’un polígon complicat, dividix-lo en figures conegudes (rectangles i triangles), calcula cadascuna i suma-les. O calcula una figura gran i resta el que sobra.', 'To find the area of a complicated polygon, split it into known shapes (rectangles and triangles), work out each and add them. Or work out one big shape and subtract what is extra.')],
    example: { q: T('Una figura en forma de L: un rectángulo de 6 × 4 cm al que le falta un trozo de 3 × 2 cm. ¿Área?', 'Una figura en forma de L: un rectangle de 6 × 4 cm al qual li falta un tros de 3 × 2 cm. Àrea?', 'An L-shape: a 6 × 4 cm rectangle with a 3 × 2 cm piece missing. Area?'), visual: { type: 'shape', pts: [[0, 0], [6, 0], [6, 2], [3, 2], [3, 4], [0, 4]] },
      steps: [T('Rectángulo grande: 6 × 4 = 24 cm².', 'Rectangle gran: 6 × 4 = 24 cm².', 'Big rectangle: 6 × 4 = 24 cm².'), T('Le quito el trozo: 24 − 6 = 18 cm².', 'Li lleve el tros: 24 − 6 = 18 cm².', 'Take away the piece: 24 − 6 = 18 cm².')] },
    make: mix(compositeArea(), area(14, ['tri', 'rect'])),
  },
  '6P-M-16': {
    explain: [T('Si divides la longitud de cualquier circunferencia entre su diámetro, siempre sale el mismo número: π (pi), que vale aproximadamente 3,14.', 'Si dividixes la longitud de qualsevol circumferència entre el seu diàmetre, sempre ix el mateix nombre: π (pi), que val aproximadament 3,14.', 'If you divide the circumference of any circle by its diameter, you always get the same number: π (pi), about 3.14.'),
      T('Longitud de la circunferencia = π × diámetro = 2 × π × radio.', 'Longitud de la circumferència = π × diàmetre = 2 × π × radi.', 'Circumference = π × diameter = 2 × π × radius.')],
    example: { q: T('Una rueda tiene 50 cm de diámetro. ¿Cuánto avanza en una vuelta?', 'Una roda té 50 cm de diàmetre. Quant avança en una volta?', 'A wheel is 50 cm across. How far does it go in one turn?'),
      steps: [T('Una vuelta es la longitud de la circunferencia.', 'Una volta és la longitud de la circumferència.', 'One turn is the circumference.'), T('3,14 × 50 = 157 cm.', '3,14 × 50 = 157 cm.', '3.14 × 50 = 157 cm.')] },
    make: circle(['len']),
  },
  '6P-M-17': {
    explain: [T('El área del círculo es π × radio × radio (π × r²). Fíjate: se usa el radio, no el diámetro.', 'L’àrea del cercle és π × radi × radi (π × r²). Fixa’t: s’usa el radi, no el diàmetre.', 'The area of a circle is π × radius × radius (π × r²). Note: use the radius, not the diameter.')],
    example: { q: T('¿Cuál es el área de un círculo de 3 cm de radio?', 'Quina és l’àrea d’un cercle de 3 cm de radi?', 'What is the area of a circle with a 3 cm radius?'),
      steps: [T('r² = 3 × 3 = 9.', 'r² = 3 × 3 = 9.', 'r² = 3 × 3 = 9.'), T('3,14 × 9 = 28,26 cm².', '3,14 × 9 = 28,26 cm².', '3.14 × 9 = 28.26 cm².')] },
    make: circle(['area', 'len']),
  },
  '6P-M-18': {
    explain: [T('La escala de un plano o un mapa dice cuántas veces es más grande la realidad. 1:100 significa que 1 cm del plano son 100 cm (1 m) de verdad.', 'L’escala d’un plànol o un mapa diu quantes vegades és més gran la realitat. 1:100 significa que 1 cm del plànol són 100 cm (1 m) de veritat.', 'The scale of a plan or map tells you how many times bigger real life is. 1:100 means 1 cm on the plan is 100 cm (1 m) in reality.')],
    example: { q: T('En un mapa 1:50 000, dos pueblos están a 6 cm. ¿A cuántos km están?', 'En un mapa 1:50 000, dos pobles estan a 6 cm. A quants km estan?', 'On a 1:50,000 map, two villages are 6 cm apart. How many km apart are they?'),
      steps: [T('6 × 50 000 = 300 000 cm.', '6 × 50 000 = 300 000 cm.', '6 × 50,000 = 300,000 cm.'), T('300 000 cm = 3 km.', '300 000 cm = 3 km.', '300,000 cm = 3 km.')] },
    make: scale(),
  },
  '6P-M-19': {
    explain: [T('Las transformaciones geométricas cambian la posición de una figura: traslación (desliza), giro (rota) y simetría (refleja). La figura conserva su forma y su tamaño.', 'Les transformacions geomètriques canvien la posició d’una figura: translació (llisca), gir (rota) i simetria (reflectix). La figura conserva la forma i la grandària.', 'Geometric transformations change a shape’s position: translation (slides), rotation (turns) and reflection (flips). The shape keeps its form and size.'),
      T('En una traslación, todos los puntos se mueven lo mismo: por ejemplo, 3 a la derecha y 2 arriba.', 'En una translació, tots els punts es mouen el mateix: per exemple, 3 a la dreta i 2 amunt.', 'In a translation every point moves the same amount: for example, 3 right and 2 up.')],
    example: { q: T('Traslado el punto (1, 2) 3 a la derecha y 1 arriba. ¿Dónde queda?', 'Trasllade el punt (1, 2) 3 a la dreta i 1 amunt. On queda?', 'I translate the point (1, 2) 3 right and 1 up. Where does it end up?'), visual: { type: 'grid', w: 6, h: 5, pts: [{ x: 1, y: 2, label: 'A' }, { x: 4, y: 3, label: 'A′' }], axes: true },
      steps: [T('x: 1 + 3 = 4.', 'x: 1 + 3 = 4.', 'x: 1 + 3 = 4.'), T('y: 2 + 1 = 3. Queda en (4, 3).', 'y: 2 + 1 = 3. Queda en (4, 3).', 'y: 2 + 1 = 3. It ends at (4, 3).')] },
    make: mix(gridPoints(7, true), (r) => { const x = int(r, 1, 5), y = int(r, 1, 5); const right = `(${-x}, ${y})`;
      return mc(X((l) => [`Hago la simetría del punto (${x}, ${y}) respecto al eje Y. ¿Dónde queda?`, `Faig la simetria del punt (${x}, ${y}) respecte a l’eix Y. On queda?`, `I reflect the point (${x}, ${y}) in the y-axis. Where does it end up?`][l]), S(right), [S(`(${x}, ${-y})`), S(`(${-x}, ${-y})`), S(`(${y}, ${x})`)].filter((s) => s[0] !== right), T('Al reflejar en el eje Y, la x cambia de signo y la y se queda igual.', 'En reflectir en l’eix Y, la x canvia de signe i la y es queda igual.', 'Reflecting in the y-axis changes the sign of x and keeps y.'), { visual: { type: 'grid', w: 6, h: 6, pts: [{ x, y, label: 'P' }], axes: true, neg: true } }); }),
  },
  '6P-M-20': {
    explain: [T('Los poliedros tienen todas sus caras planas. Los cuerpos redondos tienen alguna superficie curva: el cilindro, el cono y la esfera.', 'Els poliedres tenen totes les cares planes. Els cossos rodons tenen alguna superfície corba: el cilindre, el con i l’esfera.', 'Polyhedra have only flat faces. Curved solids have a curved surface: cylinders, cones and spheres.'),
      T('En todos los poliedros convexos se cumple: caras + vértices = aristas + 2 (fórmula de Euler).', 'En tots els poliedres convexos es complix: cares + vèrtexs = arestes + 2 (fórmula d’Euler).', 'In every convex polyhedron: faces + vertices = edges + 2 (Euler’s formula).')],
    example: { q: T('Comprueba la fórmula de Euler en un cubo.', 'Comprova la fórmula d’Euler en un cub.', 'Check Euler’s formula for a cube.'),
      steps: [T('Caras 6, vértices 8, aristas 12.', 'Cares 6, vèrtexs 8, arestes 12.', 'Faces 6, vertices 8, edges 12.'), T('6 + 8 = 14 y 12 + 2 = 14. ✓', '6 + 8 = 14 i 12 + 2 = 14. ✓', '6 + 8 = 14 and 12 + 2 = 14. ✓')] },
    make: mix(polyhedra(), (r) => {
      const R: [T3, T3][] = [[T('Una lata de refresco', 'Una llanda de refresc', 'A drinks can'), T('cilindro', 'cilindre', 'cylinder')], [T('Un cucurucho de helado', 'Un cucurutxo de gelat', 'An ice-cream cone'), T('cono', 'con', 'cone')], [T('Una pelota', 'Una pilota', 'A ball'), T('esfera', 'esfera', 'sphere')], [T('Un rollo de papel', 'Un rotlle de paper', 'A kitchen roll'), T('cilindro', 'cilindre', 'cylinder')], [T('Un gorro de cumpleaños', 'Un barret d’aniversari', 'A party hat'), T('cono', 'con', 'cone')], [T('Una canica', 'Una bala', 'A marble'), T('esfera', 'esfera', 'sphere')]];
      const i = int(r, 0, R.length - 1); const opts = [T('cilindro', 'cilindre', 'cylinder'), T('cono', 'con', 'cone'), T('esfera', 'esfera', 'sphere'), T('prisma', 'prisma', 'prism')];
      return mc(X((l) => [`${R[i][0][0]}, ¿a qué cuerpo geométrico se parece?`, `${R[i][0][1]}, a quin cos geomètric s’assembla?`, `${R[i][0][2]}: which solid is it like?`][l]), R[i][1], opts.filter((o) => o[0] !== R[i][1][0]), T('Cilindro: dos bases redondas. Cono: una base redonda y una punta. Esfera: todo curvo.', 'Cilindre: dues bases redones. Con: una base redona i una punta. Esfera: tot corbat.', 'Cylinder: two round bases. Cone: one round base and a point. Sphere: curved all over.'));
    }),
  },
  '6P-M-21': {
    explain: [T('Regla de Laplace: si todos los resultados son igual de probables, probabilidad = casos favorables ÷ casos posibles.', 'Regla de Laplace: si tots els resultats són igual de probables, probabilitat = casos favorables ÷ casos possibles.', 'Laplace’s rule: if all outcomes are equally likely, probability = favourable outcomes ÷ possible outcomes.')],
    example: { q: T('Probabilidad de sacar un número mayor que 4 con un dado.', 'Probabilitat de traure un nombre major que 4 amb un dau.', 'Probability of rolling a number greater than 4.'),
      steps: [T('Favorables: 5 y 6 (2). Posibles: 6.', 'Favorables: 5 i 6 (2). Possibles: 6.', 'Favourable: 5 and 6 (2). Possible: 6.'), T('2/6 = 1/3.', '2/6 = 1/3.', '2/6 = 1/3.')] },
    make: mix(chance(['laplace']), probScale()),
  },
  '6P-M-22': {
    explain: [T('Un diagrama de árbol ayuda a contar todos los resultados de un experimento compuesto: de cada rama salen las siguientes. Una tabla de doble entrada hace lo mismo con filas y columnas.', 'Un diagrama d’arbre ajuda a comptar tots els resultats d’un experiment compost: de cada branca ixen les següents. Una taula de doble entrada fa el mateix amb files i columnes.', 'A tree diagram helps count all the outcomes of a combined experiment: each branch splits into the next ones. A two-way table does the same with rows and columns.'),
      T('El número total de resultados es la multiplicación de las opciones de cada paso.', 'El nombre total de resultats és la multiplicació de les opcions de cada pas.', 'The total number of outcomes is the product of the options at each step.')],
    example: { q: T('Menú: 3 primeros y 2 postres. ¿Cuántos menús distintos hay?', 'Menú: 3 primers i 2 postres. Quants menús diferents hi ha?', 'Menu: 3 starters and 2 desserts. How many different meals are there?'),
      steps: [T('De cada primero salen 2 ramas de postre.', 'De cada primer ixen 2 branques de postres.', 'Each starter has 2 dessert branches.'), T('3 × 2 = 6 menús.', '3 × 2 = 6 menús.', '3 × 2 = 6 meals.')] },
    make: combos(),
  },
  '6P-M-23': {
    explain: [T('La población es el grupo completo que queremos estudiar. Una muestra es una parte de la población que elegimos para preguntar, cuando preguntar a todos es imposible o muy caro.', 'La població és el grup complet que volem estudiar. Una mostra és una part de la població que triem per a preguntar, quan preguntar a tots és impossible o molt car.', 'The population is the whole group we want to study. A sample is part of the population that we choose to ask when asking everyone is impossible or too costly.'),
      T('Una buena muestra se parece a la población: tiene de todo un poco y se elige al azar.', 'Una bona mostra s’assembla a la població: té de tot un poc i es tria a l’atzar.', 'A good sample is like the population: a bit of everything, chosen at random.')],
    example: { q: T('Quiero saber el deporte favorito de los 600 alumnos del colegio y pregunto a 60. ¿Cuál es la muestra?', 'Vull saber l’esport preferit dels 600 alumnes de l’escola i pregunte a 60. Quina és la mostra?', 'I want to know the favourite sport of the school’s 600 pupils and I ask 60. What is the sample?'),
      steps: [T('La población son los 600 alumnos.', 'La població són els 600 alumnes.', 'The population is the 600 pupils.'), T('La muestra son los 60 a los que pregunto.', 'La mostra són els 60 als quals pregunte.', 'The sample is the 60 I ask.')] },
    bank: [
      mc(T('Quiero saber cuánto duermen los niños de 6.º de España. ¿Cuál es la población?', 'Vull saber quant dormen els xiquets de 6é d’Espanya. Quina és la població?', 'I want to know how long Year 6 children in Spain sleep. What is the population?'), T('Todos los niños de 6.º de España', 'Tots els xiquets de 6é d’Espanya', 'All Year 6 children in Spain'), [T('Los niños de mi clase', 'Els xiquets de la meua classe', 'The children in my class'), T('Los niños que duermen poco', 'Els xiquets que dormen poc', 'The children who sleep little'), T('Las horas de sueño', 'Les hores de son', 'The hours of sleep')], T('La población es el grupo entero que quieres estudiar.', 'La població és el grup sencer que vols estudiar.', 'The population is the whole group you want to study.')),
      mc(T('Para conocer la opinión de los vecinos de un barrio, ¿qué muestra es mejor?', 'Per a conéixer l’opinió dels veïns d’un barri, quina mostra és millor?', 'To find out what people in a neighbourhood think, which sample is best?'), T('100 vecinos elegidos al azar', '100 veïns triats a l’atzar', '100 residents chosen at random'), [T('Mis 5 amigos', 'Els meus 5 amics', 'My 5 friends'), T('Solo las personas mayores', 'Només les persones majors', 'Only older people'), T('Los que pasan por la puerta del gimnasio', 'Els que passen per la porta del gimnàs', 'People passing the gym door')], T('Una buena muestra es grande, variada y elegida al azar.', 'Una bona mostra és gran, variada i triada a l’atzar.', 'A good sample is large, varied and chosen at random.')),
      mc(T('¿Por qué a veces se usa una muestra en lugar de toda la población?', 'Per què a vegades s’usa una mostra en lloc de tota la població?', 'Why do we sometimes use a sample instead of the whole population?'), T('Porque preguntar a todos es imposible o muy caro', 'Perquè preguntar a tots és impossible o molt car', 'Because asking everyone is impossible or too costly'), [T('Porque así sale lo que queremos', 'Perquè així ix el que volem', 'Because then we get the answer we want'), T('Porque es más divertido', 'Perquè és més divertit', 'Because it is more fun'), T('Porque la población no importa', 'Perquè la població no importa', 'Because the population does not matter')], T('La muestra ahorra tiempo y dinero.', 'La mostra estalvia temps i diners.', 'A sample saves time and money.')),
      mc(T('Una fábrica prueba 50 bombillas de un lote de 10 000. ¿Qué son las 50 bombillas?', 'Una fàbrica prova 50 bombetes d’un lot de 10 000. Què són les 50 bombetes?', 'A factory tests 50 bulbs from a batch of 10,000. What are the 50 bulbs?'), T('la muestra', 'la mostra', 'the sample'), [T('la población', 'la població', 'the population'), T('la variable', 'la variable', 'the variable'), T('la frecuencia', 'la freqüència', 'the frequency')], T('Es una parte del total que se estudia.', 'És una part del total que s’estudia.', 'It is the part of the whole that is studied.')),
      mc(T('Pregunto solo a jugadores de baloncesto cuál es el deporte favorito del colegio. ¿Qué problema hay?', 'Pregunte només a jugadors de bàsquet quin és l’esport preferit de l’escola. Quin problema hi ha?', 'I ask only basketball players what the school’s favourite sport is. What is wrong?'), T('La muestra no representa a todos', 'La mostra no representa tothom', 'The sample does not represent everyone'), [T('Ninguno', 'Cap', 'Nothing'), T('La muestra es demasiado grande', 'La mostra és massa gran', 'The sample is too big'), T('Hay que preguntar a los profesores', 'Cal preguntar als professors', 'You should ask the teachers')], T('Si eliges a un grupo especial, el resultado sale torcido.', 'Si tries un grup especial, el resultat ix tort.', 'If you pick a special group, the result is biased.')),
      mc(T('Pesar todas las manzanas de un camión es la población; ¿qué sería una muestra?', 'Pesar totes les pomes d’un camió és la població; què seria una mostra?', 'All the apples on a lorry are the population; what would be a sample?'), T('Pesar 30 manzanas cogidas de distintas cajas', 'Pesar 30 pomes agafades de caixes diferents', 'Weighing 30 apples taken from different boxes'), [T('Pesar el camión', 'Pesar el camió', 'Weighing the lorry'), T('Pesar todas', 'Pesar-les totes', 'Weighing all of them'), T('Pesar solo las más grandes', 'Pesar només les més grans', 'Weighing only the biggest')], T('Muestra: una parte variada y elegida al azar.', 'Mostra: una part variada i triada a l’atzar.', 'Sample: a varied part chosen at random.')),
    ],
  },
  '6P-M-24': {
    explain: [T('Una variable es continua si puede tomar cualquier valor dentro de un intervalo (altura, peso, tiempo). Para representarla agrupamos los datos en intervalos y hacemos un histograma: barras pegadas, sin huecos.', 'Una variable és contínua si pot prendre qualsevol valor dins d’un interval (altura, pes, temps). Per a representar-la agrupem les dades en intervals i fem un histograma: barres apegades, sense buits.', 'A variable is continuous if it can take any value within a range (height, weight, time). To show it we group the data into intervals and draw a histogram: bars touching, no gaps.')],
    example: { q: T('La altura, ¿es una variable continua o discreta?', 'L’altura, és una variable contínua o discreta?', 'Is height a continuous or discrete variable?'),
      steps: [T('Una altura puede ser 142, 142,5, 142,57… cm.', 'Una altura pot ser 142, 142,5, 142,57… cm.', 'A height can be 142, 142.5, 142.57… cm.'), T('Puede tomar cualquier valor: es continua.', 'Pot prendre qualsevol valor: és contínua.', 'It can take any value: it is continuous.')] },
    make: mix(histogram(), (r) => {
      const V: [T3, boolean][] = [[T('el peso de una persona', 'el pes d’una persona', 'a person’s weight'), true], [T('el número de hermanos', 'el nombre de germans', 'the number of brothers and sisters'), false], [T('el tiempo en correr 100 m', 'el temps a córrer 100 m', 'the time to run 100 m'), true], [T('el número de goles de un partido', 'el nombre de gols d’un partit', 'the number of goals in a match'), false], [T('la temperatura', 'la temperatura', 'the temperature'), true], [T('los libros leídos en un mes', 'els llibres llegits en un mes', 'books read in a month'), false]];
      const [v, cont] = V[int(r, 0, V.length - 1)]; const C = T('continua', 'contínua', 'continuous'), D = T('discreta', 'discreta', 'discrete');
      return mc(X((l) => [`¿${v[0].charAt(0).toUpperCase() + v[0].slice(1)} es una variable continua o discreta?`, `${v[1].charAt(0).toUpperCase() + v[1].slice(1)} és una variable contínua o discreta?`, `Is ${v[2]} a continuous or discrete variable?`][l]), cont ? C : D, [cont ? D : C, T('cualitativa', 'qualitativa', 'qualitative')], T('Discreta: se cuenta (1, 2, 3…). Continua: se mide y puede tener decimales.', 'Discreta: es compta (1, 2, 3…). Contínua: es mesura i pot tindre decimals.', 'Discrete: you count it (1, 2, 3…). Continuous: you measure it and it can have decimals.'));
    }),
  },
  '6P-M-25': {
    explain: [T('Medidas de centralización: media, mediana y moda (dicen cuál es el valor «típico»). Medida de dispersión: el rango (dice si los datos están juntos o separados).', 'Mesures de centralització: mitjana, mediana i moda (diuen quin és el valor «típic»). Mesura de dispersió: el rang (diu si les dades estan juntes o separades).', 'Averages: mean, median and mode (they show the "typical" value). Spread: the range (shows whether the data are close together or spread out).')],
    example: { q: T('Datos: 3, 5, 5, 7, 10. Media, mediana, moda y rango.', 'Dades: 3, 5, 5, 7, 10. Mitjana, mediana, moda i rang.', 'Data: 3, 5, 5, 7, 10. Mean, median, mode and range.'),
      steps: [T('Media: 30 ÷ 5 = 6. Mediana: 5 (el del centro).', 'Mitjana: 30 ÷ 5 = 6. Mediana: 5 (la del centre).', 'Mean: 30 ÷ 5 = 6. Median: 5 (the middle one).'), T('Moda: 5. Rango: 10 − 3 = 7.', 'Moda: 5. Rang: 10 − 3 = 7.', 'Mode: 5. Range: 10 − 3 = 7.')] },
    make: averages(['mean', 'median', 'mode', 'range'], 6, 25),
  },
  '6P-M-26': {
    explain: [T('Antes de responder sobre un gráfico, lee el título, qué hay en cada eje y de cuánto en cuánto van los números.', 'Abans de respondre sobre un gràfic, llig el títol, què hi ha en cada eix i de quant en quant van els nombres.', 'Before answering about a graph, read the title, what each axis shows and what the numbers go up in.'),
      T('Cuidado con los gráficos que no empiezan en cero: pueden exagerar las diferencias.', 'Compte amb els gràfics que no comencen en zero: poden exagerar les diferències.', 'Beware of graphs that do not start at zero: they can exaggerate differences.')],
    example: { q: T('En un gráfico, el eje va de 5 en 5 y una barra llega a la mitad entre 20 y 25. ¿Cuánto vale?', 'En un gràfic, l’eix va de 5 en 5 i una barra arriba a la meitat entre 20 i 25. Quant val?', 'On a graph the axis goes up in 5s and a bar reaches halfway between 20 and 25. What is its value?'),
      steps: [T('La mitad de 5 es 2,5.', 'La meitat de 5 és 2,5.', 'Half of 5 is 2.5.'), T('20 + 2,5 = 22,5.', '20 + 2,5 = 22,5.', '20 + 2.5 = 22.5.')] },
    make: mix(barChart(50, 4), lineGraph()),
  },
  '6P-M-27': {
    explain: [T('En una sucesión aritmética, cada término es el anterior más una cantidad fija (la diferencia). Para calcular un término lejano: primero + diferencia × (posición − 1).', 'En una successió aritmètica, cada terme és l’anterior més una quantitat fixa (la diferència). Per a calcular un terme llunyà: primer + diferència × (posició − 1).', 'In an arithmetic sequence, each term is the one before plus a fixed amount (the difference). For a term far along: first + difference × (position − 1).')],
    example: { q: T('3, 7, 11, 15… ¿Cuál es el término 10?', '3, 7, 11, 15… Quin és el terme 10?', '3, 7, 11, 15… What is the 10th term?'),
      steps: [T('La diferencia es 4.', 'La diferència és 4.', 'The difference is 4.'), T('3 + 4 × 9 = 39.', '3 + 4 × 9 = 39.', '3 + 4 × 9 = 39.')] },
    make: mix(sequence(400, [3, 4, 6, 7, 8, 9, 11, 12, 15], true), (r) => { const a = int(r, 1, 9), d = int(r, 2, 9), n = int(r, 6, 20), v = a + d * (n - 1);
      return q(X((l) => [`${a}, ${a + d}, ${a + 2 * d}, ${a + 3 * d}… ¿Cuál es el término número ${n}?`, `${a}, ${a + d}, ${a + 2 * d}, ${a + 3 * d}… Quin és el terme número ${n}?`, `${a}, ${a + d}, ${a + 2 * d}, ${a + 3 * d}… What is term number ${n}?`][l]), v, [a + d * n, d * n, a * n].filter((x) => x !== v), X((l) => [`Primero + diferencia × (posición − 1): ${a} + ${d} × ${n - 1}.`, `Primer + diferència × (posició − 1): ${a} + ${d} × ${n - 1}.`, `First + difference × (position − 1): ${a} + ${d} × ${n - 1}.`][l])); }),
  },
  '6P-M-28': {
    explain: [T('Una ecuación es una igualdad con un valor desconocido, normalmente x. Resolverla es encontrar el valor de x que hace verdadera la igualdad.', 'Una equació és una igualtat amb un valor desconegut, normalment x. Resoldre-la és trobar el valor de x que fa vertadera la igualtat.', 'An equation is an equality with an unknown value, usually x. Solving it means finding the value of x that makes it true.'),
      T('Lo que hagas a un lado, hazlo también al otro, como en una balanza.', 'El que faces a un costat, fes-ho també a l’altre, com en una balança.', 'Whatever you do to one side, do to the other, like on a balance.')],
    example: { q: S('3x + 4 = 19'), visual: { type: 'balance', left: '3x + 4', right: '19' },
      steps: [T('Quito 4 a los dos lados: 3x = 15.', 'Lleve 4 als dos costats: 3x = 15.', 'Take 4 from both sides: 3x = 15.'), T('Divido entre 3: x = 5.', 'Dividisc entre 3: x = 5.', 'Divide by 3: x = 5.')] },
    make: simpleEq(false),
  },
  '6P-M-29': {
    explain: [T('Un diagrama de flujo dibuja un algoritmo: los óvalos marcan el inicio y el final, los rectángulos son acciones y los rombos son preguntas con dos salidas (sí / no).', 'Un diagrama de flux dibuixa un algorisme: els òvals marquen l’inici i el final, els rectangles són accions i els rombes són preguntes amb dues eixides (sí / no).', 'A flowchart draws an algorithm: ovals mark start and end, rectangles are actions and diamonds are questions with two exits (yes / no).')],
    example: { q: T('«Empieza en 1. Mientras sea menor que 20, multiplícalo por 3.» ¿Con qué número acaba?', '«Comença en 1. Mentre siga menor que 20, multiplica’l per 3.» Amb quin nombre acaba?', '"Start at 1. While it is less than 20, multiply by 3." What number does it end with?'),
      steps: [T('1 → 3 → 9 → 27.', '1 → 3 → 9 → 27.', '1 → 3 → 9 → 27.'), T('27 ya no es menor que 20: acaba en 27.', '27 ja no és menor que 20: acaba en 27.', '27 is no longer less than 20: it ends at 27.')] },
    make: (r) => {
      const s = int(r, 1, 5), m = pick2(r), lim = int(r, 20, 100); let v = s; while (v < lim) v *= m;
      const k = r() < 0.5;
      if (k) return q(X((l) => [`«Empieza en ${s}. Mientras sea menor que ${lim}, multiplícalo por ${m}.» ¿Con qué número acaba?`, `«Comença en ${s}. Mentre siga menor que ${lim}, multiplica’l per ${m}.» Amb quin nombre acaba?`, `"Start at ${s}. While it is less than ${lim}, multiply by ${m}." What number does it end with?`][l]), v, [v / m, v * m, lim].filter((x) => Number.isInteger(x) && x !== v), T('Haz la pregunta del rombo cada vez antes de multiplicar.', 'Fes la pregunta del rombe cada vegada abans de multiplicar.', 'Ask the diamond’s question each time before multiplying.'));
      const SH: [T3, T3][] = [[T('Empezar o terminar', 'Començar o acabar', 'Start or end'), T('óvalo', 'oval', 'oval')], [T('Una pregunta con respuesta sí o no', 'Una pregunta amb resposta sí o no', 'A yes/no question'), T('rombo', 'rombe', 'diamond')], [T('Una acción (calcular, mover…)', 'Una acció (calcular, moure…)', 'An action (calculate, move…)'), T('rectángulo', 'rectangle', 'rectangle')]];
      const i = int(r, 0, 2); return mc(X((l) => [`En un diagrama de flujo, «${SH[i][0][0]}», ¿con qué forma se dibuja?`, `En un diagrama de flux, «${SH[i][0][1]}», amb quina forma es dibuixa?`, `In a flowchart, what shape is used for "${SH[i][0][2]}"?`][l]), SH[i][1], SH.filter((_, j) => j !== i).map((x) => x[1]).concat([T('círculo', 'cercle', 'circle')]), T('Óvalo: inicio y fin. Rectángulo: acción. Rombo: pregunta.', 'Oval: inici i fi. Rectangle: acció. Rombe: pregunta.', 'Oval: start and end. Rectangle: action. Diamond: question.'));
    },
  },
  '6P-M-30': {
    explain: [T('En una hoja de cálculo, las fórmulas empiezan por =. Puedes usar operaciones (+ − * /) y funciones como =SUMA(A1:A5) o =PROMEDIO(A1:A5).', 'En un full de càlcul, les fórmules comencen per =. Pots usar operacions (+ − * /) i funcions com =SUMA(A1:A5) o =MITJANA(A1:A5).', 'In a spreadsheet, formulae start with =. You can use operations (+ − * /) and functions such as =SUM(A1:A5) or =AVERAGE(A1:A5).'),
      T('Si cambias un dato, la hoja recalcula sola todos los resultados.', 'Si canvies una dada, el full recalcula sol tots els resultats.', 'If you change a value, the sheet recalculates every result by itself.')],
    example: { q: T('A1 = 4, B1 = 6, C1 = 2. ¿Qué da =SUMA(A1:C1)?', 'A1 = 4, B1 = 6, C1 = 2. Què dona =SUMA(A1:C1)?', 'A1 = 4, B1 = 6, C1 = 2. What does =SUM(A1:C1) give?'),
      steps: [T('A1:C1 son las celdas de A1 a C1.', 'A1:C1 són les cel·les d’A1 a C1.', 'A1:C1 means the cells from A1 to C1.'), T('4 + 6 + 2 = 12.', '4 + 6 + 2 = 12.', '4 + 6 + 2 = 12.')] },
    make: spreadsheet(),
  },
  '6P-M-31': {
    explain: [T('En los juegos de estrategia sin azar, uno de los jugadores siempre puede ganar si juega bien. Descubrir cómo es encontrar la estrategia ganadora.', 'En els jocs d’estratègia sense atzar, un dels jugadors sempre pot guanyar si juga bé. Descobrir com és trobar l’estratègia guanyadora.', 'In strategy games without chance, one of the players can always win by playing well. Working out how is finding the winning strategy.')],
    example: { q: T('Cada uno quita de 1 a 4 fichas; gana quien quita la última. ¿Qué cantidades conviene dejar?', 'Cadascú lleva d’1 a 4 fitxes; guanya qui lleva l’última. Quines quantitats convé deixar?', 'Each player removes 1 to 4 counters; whoever takes the last wins. Which numbers should you leave?'),
      steps: [T('Si dejo 5, quite lo que quite el otro (1 a 4), yo me llevo el resto.', 'Si en deixe 5, en lleve les que en lleve l’altre (1 a 4), jo m’emporte la resta.', 'If I leave 5, whatever they take (1 to 4), I take the rest.'), T('Múltiplos de 5: 5, 10, 15…', 'Múltiples de 5: 5, 10, 15…', 'Multiples of 5: 5, 10, 15…')] },
    make: nim(30),
  },
};
export default P;
function pick2(r: () => number) { return r() < 0.5 ? 2 : 3; }

