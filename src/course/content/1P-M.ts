import type { ContentPack } from '../types';
import { addQ, compareQ, DAYS, int, MONTHS, mc, N, NAMES, near, pick, pickN, q, rowsOf, S, subQ, T, THINGS, thing, thingWord, X } from '../lib';

const P: ContentPack = {
  // ── Números y operaciones ──
  '1P-M-1': {
    explain: [T('Para contar, toca cada objeto una sola vez y di un número para cada uno. El último número que dices es cuántos hay.', 'Per a comptar, toca cada objecte una sola vegada i digues un nombre per a cada un. L’últim nombre que dius és quants n’hi ha.', 'To count, touch each object once and say one number for each. The last number you say is how many there are.'),
      T('Si están en filas de 5, cuenta de 5 en 5 y después los que sobran.', 'Si estan en files de 5, compta de 5 en 5 i després els que sobren.', 'If they are in rows of 5, count in fives and then the ones left over.')],
    example: { q: T('¿Cuántas estrellas hay?', 'Quantes estreles hi ha?', 'How many stars are there?'), visual: { type: 'emoji', rows: ['⭐⭐⭐⭐⭐', '⭐⭐⭐'] },
      steps: [T('La primera fila tiene 5.', 'La primera fila en té 5.', 'The first row has 5.'), T('Sigo contando: 6, 7, 8.', 'Continue comptant: 6, 7, 8.', 'I carry on counting: 6, 7, 8.'), T('Hay 8 estrellas.', 'Hi ha 8 estreles.', 'There are 8 stars.')] },
    make: (r) => {
      const n = int(r, 3, 20), t = pick(r, THINGS);
      return q(X((l) => [`¿Cuántas cosas hay? (${thingWord(l, t)})`, `Quantes coses hi ha? (${thingWord(l, t)})`, `How many are there? (${thingWord(l, t)})`][l]), n, near(r, n, { min: 1, spread: 2 }),
        T('Cuenta de 5 en 5 las filas llenas y sigue con las que sobran.', 'Compta de 5 en 5 les files plenes i continua amb les que sobren.', 'Count the full rows in fives, then carry on with the rest.'), { visual: { type: 'emoji', rows: rowsOf(t.e, n) } });
    },
  },
  '1P-M-2': {
    explain: [T('Una decena son 10 unidades juntas. Con 10 cubitos formamos una barra.', 'Una desena són 10 unitats juntes. Amb 10 cubets formem una barra.', 'A ten is 10 ones together. With 10 cubes we make one rod.'),
      T('Los números del 11 al 19 son una decena y algunas unidades más: 14 es 10 y 4.', 'Els nombres de l’11 al 19 són una desena i algunes unitats més: 14 és 10 i 4.', 'The numbers 11 to 19 are one ten and some more ones: 14 is 10 and 4.')],
    example: { q: T('¿Qué número es 1 decena y 6 unidades?', 'Quin nombre és 1 desena i 6 unitats?', 'Which number is 1 ten and 6 ones?'), visual: { type: 'tens', tens: 1, ones: 6 },
      steps: [T('1 decena son 10.', '1 desena són 10.', '1 ten is 10.'), T('10 y 6 más son 16.', '10 i 6 més són 16.', '10 and 6 more is 16.')] },
    make: (r) => {
      const o = int(r, 0, 9), k = int(r, 0, 2);
      if (k === 0) return q(X((l) => [`¿Qué número es 1 decena y ${o} unidades?`, `Quin nombre és 1 desena i ${o} unitats?`, `Which number is 1 ten and ${o} ones?`][l]), 10 + o, near(r, 10 + o, { also: [o, 1 + o, 10 + o + 1] }),
        T('Una decena son 10. Suma las unidades a 10.', 'Una desena són 10. Suma les unitats a 10.', 'One ten is 10. Add the ones to 10.'), { aid: { type: 'tens', tens: 1, ones: o } });
      if (k === 1) return q(X((l) => [`¿Cuántas unidades sueltas tiene el ${10 + o}?`, `Quantes unitats soltes té el ${10 + o}?`, `How many loose ones does ${10 + o} have?`][l]), o, near(r, o, { also: [10 + o, 1], max: 19 }),
        T('Quita la decena (10). Lo que queda son las unidades.', 'Lleva la desena (10). El que queda són les unitats.', 'Take away the ten (10). What is left are the ones.'), { aid: { type: 'tens', tens: 1, ones: o } });
      const n = int(r, 1, 9);
      return q(X((l) => [`¿Cuánto le falta a ${n} para llegar a 10?`, `Quant li falta a ${n} per a arribar a 10?`, `How many more does ${n} need to make 10?`][l]), 10 - n, near(r, 10 - n, { max: 10, also: [n] }),
        T('Mira los huecos vacíos del marco de 10.', 'Mira els buits del marc de 10.', 'Look at the empty spaces in the ten frame.'), { aid: { type: 'frame', filled: n } });
    },
  },
  '1P-M-3': {
    explain: [T('En un número de dos cifras, la cifra de la izquierda dice las decenas y la de la derecha, las unidades.', 'En un nombre de dues xifres, la xifra de l’esquerra diu les desenes i la de la dreta, les unitats.', 'In a two-digit number, the left digit tells you the tens and the right digit the ones.'),
      T('47 son 4 decenas (40) y 7 unidades.', '47 són 4 desenes (40) i 7 unitats.', '47 is 4 tens (40) and 7 ones.')],
    example: { q: T('¿Qué número forman 3 decenas y 5 unidades?', 'Quin nombre formen 3 desenes i 5 unitats?', 'Which number do 3 tens and 5 ones make?'), visual: { type: 'tens', tens: 3, ones: 5 },
      steps: [T('3 decenas son 30.', '3 desenes són 30.', '3 tens are 30.'), T('30 y 5 son 35.', '30 i 5 són 35.', '30 and 5 make 35.')] },
    make: (r) => {
      const d = int(r, 1, 9), u = int(r, 0, 9), n = d * 10 + u, k = int(r, 0, 2);
      if (k === 0) return q(X((l) => [`¿Qué número forman ${d} decenas y ${u} unidades?`, `Quin nombre formen ${d} desenes i ${u} unitats?`, `Which number do ${d} tens and ${u} ones make?`][l]), n, near(r, n, { also: [u * 10 + d, d + u, n + 10].filter((x) => x <= 99) }),
        T('Las decenas van a la izquierda y las unidades a la derecha.', 'Les desenes van a l’esquerra i les unitats a la dreta.', 'Tens go on the left and ones on the right.'), { aid: { type: 'tens', tens: d, ones: u } });
      if (k === 1) return q(X((l) => [`¿Cuántas decenas tiene el ${n}?`, `Quantes desenes té el ${n}?`, `How many tens does ${n} have?`][l]), d, near(r, d, { also: [u, n], max: 99 }),
        T('Mira la cifra de la izquierda.', 'Mira la xifra de l’esquerra.', 'Look at the left digit.'), { aid: { type: 'tens', tens: d, ones: u } });
      return q(T('¿Qué número ves?', 'Quin nombre veus?', 'Which number can you see?'), n, near(r, n, { also: [u * 10 + d, n + 1, n - 1].filter((x) => x > 0 && x <= 99) }),
        T('Cuenta las barras de 10 en 10 y después los cubitos de 1 en 1.', 'Compta les barres de 10 en 10 i després els cubets d’1 en 1.', 'Count the rods in tens, then the cubes in ones.'), { visual: { type: 'tens', tens: d, ones: u } });
    },
  },
  '1P-M-4': {
    explain: [T('Para comparar dos números, mira primero las decenas: el que tiene más decenas es mayor.', 'Per a comparar dos nombres, mira primer les desenes: el que té més desenes és major.', 'To compare two numbers, look at the tens first: the one with more tens is bigger.'),
      T('Si tienen las mismas decenas, mira las unidades. Si todo es igual, los números son iguales.', 'Si tenen les mateixes desenes, mira les unitats. Si tot és igual, els nombres són iguals.', 'If the tens are the same, look at the ones. If everything is the same, the numbers are equal.')],
    example: { q: T('¿Cuál es mayor, 34 o 43?', 'Quin és major, 34 o 43?', 'Which is bigger, 34 or 43?'),
      steps: [T('34 tiene 3 decenas. 43 tiene 4 decenas.', '34 té 3 desenes. 43 té 4 desenes.', '34 has 3 tens. 43 has 4 tens.'), T('4 decenas son más que 3: el 43 es mayor.', '4 desenes són més que 3: el 43 és major.', '4 tens are more than 3: 43 is bigger.')] },
    make: (r) => {
      const a = int(r, 10, 99); let b = int(r, 10, 99); if (r() < 0.4) b = (a % 10) * 10 + Math.floor(a / 10); if (b === a || b < 10) b = a + (a < 99 ? 1 : -1);
      if (r() < 0.25) {
        const x = int(r, 10, 99), y = r() < 0.5 ? x : x + pick(r, [-1, 1, 10]);
        const sym = x === y ? '=' : x > y ? '>' : '<';
        return q(X((l) => [`¿Qué signo va entre ${x} y ${y}?`, `Quin signe va entre ${x} i ${y}?`, `Which sign goes between ${x} and ${y}?`][l]), S(sym), ['<', '>', '='].filter((s) => s !== sym).map(S).concat([S('+')]),
          T('La boca del cocodrilo (> o <) se abre hacia el número mayor. Si son iguales, =.', 'La boca del cocodril (> o <) s’obri cap al nombre major. Si són iguals, =.', 'The open side of > or < faces the bigger number. If they are the same, use =.'));
      }
      return compareQ(r, [a, b], r() < 0.6, T('Mira primero las decenas (la cifra de la izquierda).', 'Mira primer les desenes (la xifra de l’esquerra).', 'Look at the tens first (the left digit).'));
    },
  },
  '1P-M-5': {
    explain: [T('El número anterior es el que va justo antes: es uno menos. El posterior va justo después: es uno más.', 'El nombre anterior és el que va just abans: és un menys. El posterior va just després: és un més.', 'The number before is one less. The number after is one more.'),
      T('Después de un número acabado en 9 cambiamos de decena: después del 39 va el 40.', 'Després d’un nombre acabat en 9 canviem de desena: després del 39 va el 40.', 'After a number ending in 9 we move to the next ten: after 39 comes 40.')],
    example: { q: T('¿Qué número va justo después del 29?', 'Quin nombre va just després del 29?', 'Which number comes just after 29?'), visual: { type: 'line', min: 25, max: 32, marks: [25, 26, 27, 28, 29, 30, 31, 32], labels: [25, 26, 27, 28, 29, 30, 31, 32], point: 29 },
      steps: [T('Después es uno más: 29 + 1.', 'Després és un més: 29 + 1.', 'After means one more: 29 + 1.'), T('29 acaba en 9, así que pasamos a la decena siguiente: 30.', '29 acaba en 9, així que passem a la desena següent: 30.', '29 ends in 9, so we move to the next ten: 30.')] },
    make: (r) => {
      const n = r() < 0.35 ? int(r, 1, 9) * 10 + pick(r, [0, 9]) : int(r, 2, 98), after = r() < 0.55;
      const a = after ? n + 1 : n - 1;
      return q(X((l) => after ? [`¿Qué número va justo después del ${n}?`, `Quin nombre va just després del ${n}?`, `Which number comes just after ${n}?`][l] : [`¿Qué número va justo antes del ${n}?`, `Quin nombre va just abans del ${n}?`, `Which number comes just before ${n}?`][l]),
        a, near(r, a, { also: [after ? n - 1 : n + 1, n, a + 10, a - 10].filter((x) => x > 0 && x < 100), spread: 2 }),
        after ? T('Después es uno más. Si acaba en 9, cambia de decena.', 'Després és un més. Si acaba en 9, canvia de desena.', 'After means one more. If it ends in 9, move to the next ten.') : T('Antes es uno menos. Si acaba en 0, baja a la decena anterior y acaba en 9.', 'Abans és un menys. Si acaba en 0, baixa a la desena anterior i acaba en 9.', 'Before means one less. If it ends in 0, go down a ten and it ends in 9.'),
        { aid: { type: 'line', min: n - 3, max: n + 3, marks: [n - 3, n - 2, n - 1, n, n + 1, n + 2, n + 3], labels: [n - 3, n - 2, n - 1, n, n + 1, n + 2, n + 3], point: n } });
    },
  },
  '1P-M-6': {
    explain: [T('Un número es par si se puede repartir en parejas sin que sobre ninguno. Los pares acaban en 0, 2, 4, 6 u 8.', 'Un nombre és parell si es pot repartir en parelles sense que en sobre cap. Els parells acaben en 0, 2, 4, 6 o 8.', 'A number is even if it can be split into pairs with none left over. Even numbers end in 0, 2, 4, 6 or 8.'),
      T('Si sobra uno, es impar. Los impares acaban en 1, 3, 5, 7 o 9.', 'Si en sobra un, és imparell. Els imparells acaben en 1, 3, 5, 7 o 9.', 'If one is left over, it is odd. Odd numbers end in 1, 3, 5, 7 or 9.')],
    example: { q: T('¿El 7 es par o impar?', 'El 7 és parell o imparell?', 'Is 7 odd or even?'), visual: { type: 'emoji', rows: ['🧦🧦', '🧦🧦', '🧦🧦', '🧦'] },
      steps: [T('Hago parejas: 3 parejas.', 'Faig parelles: 3 parelles.', 'I make pairs: 3 pairs.'), T('Sobra 1 calcetín. El 7 es impar.', 'Sobra 1 calcetí. El 7 és imparell.', 'One sock is left over. 7 is odd.')] },
    make: (r) => {
      const EVEN = T('par', 'parell', 'even'), ODD = T('impar', 'imparell', 'odd');
      if (r() < 0.6) {
        const n = int(r, 1, 30), even = n % 2 === 0;
        return mc(X((l) => [`¿El ${n} es par o impar?`, `El ${n} és parell o imparell?`, `Is ${n} odd or even?`][l]), even ? EVEN : ODD, [even ? ODD : EVEN],
          T('Mira la última cifra: 0, 2, 4, 6, 8 es par; 1, 3, 5, 7, 9 es impar.', 'Mira l’última xifra: 0, 2, 4, 6, 8 és parell; 1, 3, 5, 7, 9 és imparell.', 'Look at the last digit: 0, 2, 4, 6, 8 is even; 1, 3, 5, 7, 9 is odd.'),
          n <= 12 ? { aid: { type: 'emoji', rows: rowsOf('🧦', n, 2) } } : {});
      }
      const wantEven = r() < 0.5; const base = int(r, 1, 40);
      const right = wantEven ? base * 2 % 50 || 2 : (base * 2 + 1) % 50;
      const wrong = pickN(r, Array.from({ length: 49 }, (_, i) => i + 1).filter((x) => x % 2 !== right % 2), 3);
      return q(X((l) => wantEven ? ['¿Cuál de estos números es par?', 'Quin d’aquests nombres és parell?', 'Which of these numbers is even?'][l] : ['¿Cuál de estos números es impar?', 'Quin d’aquests nombres és imparell?', 'Which of these numbers is odd?'][l]),
        right, wrong, T('Mira solo la última cifra de cada número.', 'Mira només l’última xifra de cada nombre.', 'Look only at the last digit of each number.'), { mc: true });
    },
  },
  '1P-M-7': {
    explain: [T('Un número se puede partir en dos partes de muchas maneras: 8 es 5 y 3, 6 y 2, 4 y 4…', 'Un nombre es pot partir en dues parts de moltes maneres: 8 és 5 i 3, 6 i 2, 4 i 4…', 'A number can be split into two parts in many ways: 8 is 5 and 3, 6 and 2, 4 and 4…'),
      T('Para encontrar la parte que falta, piensa cuánto le falta a la parte que tienes para llegar al total.', 'Per a trobar la part que falta, pensa quant li falta a la part que tens per a arribar al total.', 'To find the missing part, think how much the part you have needs to reach the total.')],
    example: { q: S('9 = 6 + ?'), visual: { type: 'dots', groups: [9] },
      steps: [T('Tengo 6 y quiero llegar a 9.', 'Tinc 6 i vull arribar a 9.', 'I have 6 and I want to reach 9.'), T('7, 8, 9: me faltan 3. Entonces 9 = 6 + 3.', '7, 8, 9: me’n falten 3. Aleshores 9 = 6 + 3.', '7, 8, 9: I need 3 more. So 9 = 6 + 3.')] },
    make: (r) => {
      const big = r() < 0.4, n = big ? int(r, 11, 19) : int(r, 4, 10), a = big ? 10 : int(r, 1, n - 1), b = n - a;
      return q(X((l) => `${N(l, n)} = ${N(l, a)} + ?`), b, near(r, b, { also: [n, n + a, b + 1], max: 20 }),
        big ? T('Los números del 11 al 19 son 10 y algo más.', 'Els nombres de l’11 al 19 són 10 i alguna cosa més.', 'Numbers from 11 to 19 are 10 and a bit more.') : X((l) => [`Cuenta desde ${a} hasta ${n}.`, `Compta des de ${a} fins a ${n}.`, `Count on from ${a} to ${n}.`][l]),
        { aid: { type: 'dots', groups: big ? [10, b] : [a, b] } });
    },
  },
  '1P-M-8': {
    explain: [T('Sumar es juntar. Empieza por el número mayor y cuenta hacia delante el pequeño.', 'Sumar és ajuntar. Comença pel nombre major i compta cap avant el xicotet.', 'Adding is putting together. Start from the bigger number and count on the smaller one.'),
      T('Truco: completa la decena. 8 + 5: el 8 necesita 2 para llegar a 10, y me quedan 3: 13.', 'Truc: completa la desena. 8 + 5: el 8 necessita 2 per a arribar a 10, i me’n queden 3: 13.', 'Trick: make ten. 8 + 5: 8 needs 2 to make 10, and 3 are left: 13.')],
    example: { q: S('8 + 5 = ?'), visual: { type: 'dots', groups: [8, 5] },
      steps: [T('Al 8 le faltan 2 para llegar a 10: 8 + 2 = 10.', 'Al 8 li’n falten 2 per a arribar a 10: 8 + 2 = 10.', '8 needs 2 to make 10: 8 + 2 = 10.'), T('Del 5 me quedan 3: 10 + 3 = 13.', 'Del 5 me’n queden 3: 10 + 3 = 13.', 'There are 3 left from the 5: 10 + 3 = 13.')] },
    make: (r) => { const a = int(r, 2, 9), b = int(r, 2, 9); return addQ(r, a, b, { aid: { type: 'dots', groups: [a, b] } }); },
  },
  '1P-M-9': {
    explain: [T('Restar es quitar o ver cuánto falta. Puedes contar hacia atrás desde el número grande.', 'Restar és llevar o veure quant falta. Pots comptar cap arrere des del nombre gran.', 'Subtracting is taking away or finding the difference. You can count back from the bigger number.'),
      T('Truco: baja primero hasta 10. 13 − 5: quito 3 y llego a 10; me quedan 2 por quitar: 8.', 'Truc: baixa primer fins a 10. 13 − 5: lleve 3 i arribe a 10; me’n queden 2 per llevar: 8.', 'Trick: go down to 10 first. 13 − 5: take away 3 to reach 10; 2 more to take away: 8.')],
    example: { q: S('13 − 5 = ?'), visual: { type: 'dots', groups: [10, 3] },
      steps: [T('Quito 3 y llego a 10.', 'Lleve 3 i arribe a 10.', 'I take away 3 and reach 10.'), T('Me faltan 2 por quitar: 10 − 2 = 8.', 'Me’n falten 2 per llevar: 10 − 2 = 8.', '2 more to take away: 10 − 2 = 8.')] },
    make: (r) => { const a = int(r, 5, 20), b = int(r, 1, Math.min(9, a - 1)); return subQ(r, a, b, { aid: { type: 'dots', groups: a > 10 ? [10, a - 10] : [a] } }); },
  },
  '1P-M-10': {
    explain: [T('Lee el problema y piensa: ¿se juntan cosas (suma) o se quitan (resta)?', 'Llig el problema i pensa: s’ajunten coses (suma) o se’n lleven (resta)?', 'Read the problem and think: are things put together (add) or taken away (subtract)?'),
      T('Palabras como «le dan», «gana» o «en total» suelen ser suma. «Pierde», «regala» o «quedan» suelen ser resta.', 'Paraules com «li donen», «guanya» o «en total» solen ser suma. «Perd», «regala» o «queden» solen ser resta.', 'Words like "is given", "wins" or "altogether" usually mean add. "Loses", "gives away" or "left" usually mean subtract.')],
    example: { q: T('Ana tiene 7 canicas y gana 5. ¿Cuántas tiene ahora?', 'Ana té 7 bales i en guanya 5. Quantes en té ara?', 'Ana has 7 marbles and wins 5. How many does she have now?'),
      steps: [T('Gana: tendrá más. Es una suma.', 'Guanya: en tindrà més. És una suma.', 'Wins: she will have more. It is an addition.'), T('7 + 5 = 12. Ana tiene 12 canicas.', '7 + 5 = 12. Ana té 12 bales.', '7 + 5 = 12. Ana has 12 marbles.')] },
    make: (r) => {
      const name = pick(r, NAMES), t = pick(r, THINGS), add = r() < 0.5;
      const a = int(r, 4, 12), b = add ? int(r, 2, 8) : int(r, 1, a - 1), ans = add ? a + b : a - b;
      const kind = int(r, 0, 1);
      const qq = add
        ? X((l) => kind ? [`${name} tiene ${thing(l, t, a)} y le dan ${N(l, b)} más. ¿Cuántas tiene ahora?`, `${name} té ${thing(l, t, a)} i li’n donen ${N(l, b)} més. Quantes en té ara?`, `${name} has ${thing(l, t, a)} and is given ${N(l, b)} more. How many now?`][l]
          : [`En una caja hay ${thing(l, t, a)} y en otra ${thing(l, t, b)}. ¿Cuántas hay en total?`, `En una caixa hi ha ${thing(l, t, a)} i en una altra ${thing(l, t, b)}. Quantes n’hi ha en total?`, `One box has ${thing(l, t, a)} and another has ${thing(l, t, b)}. How many altogether?`][l])
        : X((l) => kind ? [`${name} tiene ${thing(l, t, a)} y regala ${N(l, b)}. ¿Cuántas le quedan?`, `${name} té ${thing(l, t, a)} i en regala ${N(l, b)}. Quantes li’n queden?`, `${name} has ${thing(l, t, a)} and gives away ${N(l, b)}. How many are left?`][l]
          : [`Había ${thing(l, t, a)}. Se pierden ${N(l, b)}. ¿Cuántas quedan?`, `Hi havia ${thing(l, t, a)}. Se’n perden ${N(l, b)}. Quantes en queden?`, `There were ${thing(l, t, a)}. ${N(l, b)} get lost. How many are left?`][l]);
      return q(qq, ans, near(r, ans, { also: [add ? a - b : a + b, ans + 1].filter((x) => x >= 0) }),
        add ? T('Se juntan: es una suma.', 'S’ajunten: és una suma.', 'They are put together: add.') : T('Se quitan: es una resta.', 'Se’n lleven: és una resta.', 'Some are taken away: subtract.'),
        { aid: { type: 'emoji', rows: add ? [t.e.repeat(a), t.e.repeat(b)] : [t.e.repeat(a)] } });
    },
  },

  // ── Medida ──
  '1P-M-11': {
    explain: [T('Podemos medir con partes del cuerpo: el palmo (la mano abierta) o el paso. Contamos cuántos caben.', 'Podem mesurar amb parts del cos: el pam (la mà oberta) o el pas. Comptem quants hi caben.', 'We can measure with parts of the body: a hand span or a step. We count how many fit.'),
      T('Cuantos más palmos o pasos, más largo es. Pero un palmo grande y uno pequeño no miden igual.', 'Com més pams o passos, més llarg és. Però un pam gran i un de xicotet no mesuren igual.', 'The more spans or steps, the longer it is. But a big hand and a small hand are not the same.')],
    example: { q: T('La mesa mide 6 palmos y la pizarra 9 palmos. ¿Cuál es más larga?', 'La taula mesura 6 pams i la pissarra 9 pams. Quina és més llarga?', 'The table is 6 spans long and the board is 9 spans. Which is longer?'),
      steps: [T('Medimos las dos con la misma mano.', 'Les mesurem les dues amb la mateixa mà.', 'We measure both with the same hand.'), T('9 palmos son más que 6: la pizarra es más larga.', '9 pams són més que 6: la pissarra és més llarga.', '9 spans are more than 6: the board is longer.')] },
    make: (r) => {
      const OBJ = [T('la mesa', 'la taula', 'the table'), T('la puerta', 'la porta', 'the door'), T('la alfombra', 'la catifa', 'the rug'), T('el banco', 'el banc', 'the bench'), T('la estantería', 'la prestatgeria', 'the shelf')];
      const [o1, o2] = pickN(r, OBJ, 2); const a = int(r, 3, 12); let b = int(r, 3, 12); if (b === a) b = a + 2;
      const k = int(r, 0, 1);
      if (k === 0) return mc(X((l) => [`${cap(o1[0])} mide ${a} palmos y ${o2[0]} mide ${b} palmos. ¿Qué es más largo?`, `${cap(o1[1])} mesura ${a} pams i ${o2[1]} mesura ${b} pams. Què és més llarg?`, `${cap(o1[2])} is ${a} spans long and ${o2[2]} is ${b} spans. Which is longer?`][l]),
        a > b ? o1 : o2, [a > b ? o2 : o1, T('Miden igual', 'Mesuren igual', 'They are the same')], T('Más palmos quiere decir más largo.', 'Més pams vol dir més llarg.', 'More spans means longer.'));
      return q(X((l) => [`Un pasillo mide ${a} pasos y otro ${b} pasos. ¿Cuántos pasos más mide el largo?`, `Un corredor mesura ${a} passos i un altre ${b} passos. Quants passos més mesura el llarg?`, `One corridor is ${a} steps long and another is ${b} steps. How many more steps is the longer one?`][l]),
        Math.abs(a - b), near(r, Math.abs(a - b), { also: [a + b], min: 1 }), T('Resta el número pequeño al grande.', 'Resta el nombre xicotet al gran.', 'Take the smaller number from the bigger one.'));
    },
  },
  '1P-M-12': {
    explain: [T('Para saber qué es más largo, pon las dos cosas una al lado de la otra, empezando en el mismo sitio.', 'Per a saber què és més llarg, posa les dues coses una al costat de l’altra, començant en el mateix lloc.', 'To find which is longer, put the two things side by side, starting at the same place.'),
      T('Largo y corto se usa para lo que está tumbado; alto y bajo, para lo que está de pie.', 'Llarg i curt s’usa per al que està gitat; alt i baix, per al que està dret.', 'Long and short are for things lying down; tall and short are for things standing up.')],
    example: { q: T('¿Qué es más alto, una jirafa o un gato?', 'Què és més alt, una girafa o un gat?', 'Which is taller, a giraffe or a cat?'), visual: { type: 'emoji', rows: ['🦒   🐈'] },
      steps: [T('La jirafa tiene el cuello muy largo.', 'La girafa té el coll molt llarg.', 'A giraffe has a very long neck.'), T('La jirafa es más alta.', 'La girafa és més alta.', 'The giraffe is taller.')] },
    bank: lenBank(),
  },
  '1P-M-13': {
    explain: [T('Para saber qué pesa más, cógelo con las manos o usa una balanza: el plato que baja tiene lo que pesa más.', 'Per a saber què pesa més, agafa-ho amb les mans o usa una balança: el plat que baixa té el que pesa més.', 'To find which is heavier, hold the things or use a balance: the pan that goes down holds the heavier thing.'),
      T('Ser grande no siempre es pesar más: un globo es grande y pesa muy poco.', 'Ser gran no sempre és pesar més: un globus és gran i pesa molt poc.', 'Being big does not always mean heavy: a balloon is big but very light.')],
    example: { q: T('En la balanza, el lado de la sandía baja. ¿Qué pesa más?', 'En la balança, el costat de la síndria baixa. Què pesa més?', 'On the balance, the watermelon side goes down. Which is heavier?'), visual: { type: 'balance', left: '🍉', right: '🍓' },
      steps: [T('El plato que baja tiene lo más pesado.', 'El plat que baixa té el més pesat.', 'The pan that goes down holds the heavier thing.'), T('Pesa más la sandía.', 'Pesa més la síndria.', 'The watermelon is heavier.')] },
    bank: weightBank(),
  },
  '1P-M-14': {
    explain: [T('La capacidad es cuánto cabe dentro de un recipiente. Un recipiente lleno no admite más; uno vacío no tiene nada.', 'La capacitat és quant hi cap dins d’un recipient. Un recipient ple no n’admet més; un de buit no té res.', 'Capacity is how much fits inside a container. A full one cannot take any more; an empty one has nothing in it.'),
      T('Para comparar, contamos cuántos vasos caben en cada recipiente.', 'Per a comparar, comptem quants gots hi caben en cada recipient.', 'To compare, we count how many cups fit in each container.')],
    example: { q: T('En la jarra caben 4 vasos y en la botella 6. ¿Dónde cabe más?', 'En la gerra hi caben 4 gots i en la botella 6. On hi cap més?', 'The jug holds 4 cups and the bottle holds 6. Which holds more?'),
      steps: [T('6 vasos son más que 4.', '6 gots són més que 4.', '6 cups are more than 4.'), T('En la botella cabe más.', 'En la botella hi cap més.', 'The bottle holds more.')] },
    make: (r) => {
      const C = [T('la jarra', 'la gerra', 'the jug'), T('la botella', 'la botella', 'the bottle'), T('el cubo', 'el poal', 'the bucket'), T('la regadera', 'la regadora', 'the watering can'), T('la olla', 'l’olla', 'the pot')];
      const [c1, c2] = pickN(r, C, 2); const a = int(r, 2, 10); let b = int(r, 2, 10); if (a === b) b = a + 1;
      if (r() < 0.5) return mc(X((l) => [`En ${c1[0]} caben ${a} vasos y en ${c2[0]} caben ${b}. ¿Dónde cabe más?`, `En ${c1[1]} hi caben ${a} gots i en ${c2[1]} ${b}. On hi cap més?`, `${cap(c1[2])} holds ${a} cups and ${c2[2]} holds ${b}. Which holds more?`][l]),
        a > b ? c1 : c2, [a > b ? c2 : c1, T('En los dos igual', 'En els dos igual', 'Both the same')], T('Más vasos quiere decir que cabe más.', 'Més gots vol dir que hi cap més.', 'More cups means it holds more.'));
      const f = int(r, 1, a - 1 || 1), cap1 = Math.max(a, f + 1);
      return q(X((l) => [`En ${c1[0]} caben ${cap1} vasos. Ya tiene ${f}. ¿Cuántos vasos faltan para llenarla?`, `En ${c1[1]} hi caben ${cap1} gots. Ja en té ${f}. Quants gots falten per a omplir-la?`, `${cap(c1[2])} holds ${cap1} cups. It already has ${f}. How many more cups to fill it?`][l]),
        cap1 - f, near(r, cap1 - f, { also: [cap1 + f, cap1], min: 1 }), T('Cuenta desde lo que tiene hasta lo que cabe.', 'Compta des del que té fins al que hi cap.', 'Count on from what it has to what it holds.'));
    },
  },
  '1P-M-15': {
    explain: [T('La semana tiene 7 días: lunes, martes, miércoles, jueves, viernes, sábado y domingo.', 'La setmana té 7 dies: dilluns, dimarts, dimecres, dijous, divendres, dissabte i diumenge.', 'A week has 7 days: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday and Sunday.'),
      T('El año tiene 12 meses, de enero a diciembre. Después de diciembre vuelve enero.', 'L’any té 12 mesos, de gener a desembre. Després de desembre torna gener.', 'A year has 12 months, from January to December. After December comes January again.')],
    example: { q: T('Si hoy es viernes, ¿qué día será mañana?', 'Si hui és divendres, quin dia serà demà?', 'If today is Friday, what day will it be tomorrow?'),
      steps: [T('Mañana es el día siguiente.', 'Demà és el dia següent.', 'Tomorrow is the next day.'), T('Después del viernes va el sábado.', 'Després del divendres va el dissabte.', 'After Friday comes Saturday.')] },
    make: (r) => {
      const k = int(r, 0, 3);
      if (k === 0) { const i = int(r, 0, 6), a = DAYS[(i + 1) % 7]; return mc(X((l) => [`Si hoy es ${DAYS[i][0]}, ¿qué día será mañana?`, `Si hui és ${DAYS[i][1]}, quin dia serà demà?`, `If today is ${DAYS[i][2]}, what day will it be tomorrow?`][l]), a, [DAYS[(i + 6) % 7], DAYS[(i + 2) % 7], DAYS[i]], T('Mañana es el día que va después.', 'Demà és el dia que va després.', 'Tomorrow is the day after.')); }
      if (k === 1) { const i = int(r, 0, 6), a = DAYS[(i + 6) % 7]; return mc(X((l) => [`Si hoy es ${DAYS[i][0]}, ¿qué día fue ayer?`, `Si hui és ${DAYS[i][1]}, quin dia va ser ahir?`, `If today is ${DAYS[i][2]}, what day was it yesterday?`][l]), a, [DAYS[(i + 1) % 7], DAYS[(i + 5) % 7], DAYS[i]], T('Ayer es el día que va antes.', 'Ahir és el dia que va abans.', 'Yesterday is the day before.')); }
      if (k === 2) { const i = int(r, 0, 11), a = MONTHS[(i + 1) % 12]; return mc(X((l) => [`¿Qué mes va después de ${MONTHS[i][0]}?`, `Quin mes va després de ${MONTHS[i][1]}?`, `Which month comes after ${MONTHS[i][2]}?`][l]), a, [MONTHS[(i + 11) % 12], MONTHS[(i + 2) % 12], MONTHS[i]], T('Di los meses en orden desde enero.', 'Digues els mesos en ordre des de gener.', 'Say the months in order from January.')); }
      return pick(r, [
        q(T('¿Cuántos días tiene una semana?', 'Quants dies té una setmana?', 'How many days are there in a week?'), 7, [5, 6, 10, 12], T('Cuenta de lunes a domingo.', 'Compta de dilluns a diumenge.', 'Count from Monday to Sunday.')),
        q(T('¿Cuántos meses tiene un año?', 'Quants mesos té un any?', 'How many months are there in a year?'), 12, [7, 10, 11, 30], T('Cuenta de enero a diciembre.', 'Compta de gener a desembre.', 'Count from January to December.')),
        mc(T('¿Qué días no hay cole normalmente?', 'Quins dies no hi ha escola normalment?', 'Which days are usually school-free?'), T('sábado y domingo', 'dissabte i diumenge', 'Saturday and Sunday'), [T('lunes y martes', 'dilluns i dimarts', 'Monday and Tuesday'), T('jueves y viernes', 'dijous i divendres', 'Thursday and Friday'), T('miércoles y jueves', 'dimecres i dijous', 'Wednesday and Thursday')], T('Son los dos últimos días de la semana: el fin de semana.', 'Són els dos últims dies de la setmana: el cap de setmana.', 'They are the last two days of the week: the weekend.')),
      ]);
    },
  },
  '1P-M-16': {
    explain: [T('El reloj tiene dos agujas. La corta marca la hora y la larga, los minutos.', 'El rellotge té dues agulles. La curta marca l’hora i la llarga, els minuts.', 'A clock has two hands. The short one shows the hour and the long one the minutes.'),
      T('Cuando la aguja larga apunta al 12, es una hora en punto: la hora la dice la aguja corta.', 'Quan l’agulla llarga apunta al 12, és una hora en punt: l’hora la diu l’agulla curta.', 'When the long hand points to 12, it is o’clock: the short hand tells you the hour.')],
    example: { q: T('¿Qué hora marca el reloj?', 'Quina hora marca el rellotge?', 'What time does the clock show?'), visual: { type: 'clock', h: 3, m: 0 },
      steps: [T('La aguja larga está en el 12: es en punto.', 'L’agulla llarga està en el 12: és en punt.', 'The long hand is on 12: it is o’clock.'), T('La corta está en el 3: son las 3 en punto.', 'La curta està en el 3: són les 3 en punt.', 'The short hand is on 3: it is 3 o’clock.')] },
    make: (r) => {
      const h = int(r, 1, 12);
      return q(T('¿Qué hora en punto marca el reloj? Escribe el número de la hora.', 'Quina hora en punt marca el rellotge? Escriu el nombre de l’hora.', 'What o’clock time does the clock show? Write the hour.'), h,
        near(r, h, { min: 1, max: 12, also: [12, (h % 12) + 1] }), T('Mira a qué número apunta la aguja corta.', 'Mira a quin nombre apunta l’agulla curta.', 'Look at which number the short hand points to.'), { visual: { type: 'clock', h, m: 0 } });
    },
  },

  // ── Geometría ──
  '1P-M-17': {
    explain: [T('Usamos palabras para decir dónde están las cosas: dentro, fuera, encima, debajo, delante, detrás.', 'Usem paraules per a dir on estan les coses: dins, fora, damunt, davall, davant, darrere.', 'We use words to say where things are: inside, outside, above, below, in front of, behind.'),
      T('Lo que está encima está más arriba; lo que está debajo, más abajo.', 'El que està damunt està més amunt; el que està davall, més avall.', 'What is above is higher up; what is below is lower down.')],
    example: { q: T('El pájaro está arriba y el árbol abajo. ¿Dónde está el pájaro?', 'El pardal està dalt i l’arbre baix. On està el pardal?', 'The bird is at the top and the tree at the bottom. Where is the bird?'), visual: { type: 'emoji', rows: ['🐦', '🌳'], big: true },
      steps: [T('El pájaro está más arriba que el árbol.', 'El pardal està més amunt que l’arbre.', 'The bird is higher than the tree.'), T('El pájaro está encima del árbol.', 'El pardal està damunt de l’arbre.', 'The bird is above the tree.')] },
    make: (r) => {
      const UP = T('encima', 'damunt', 'above'), DOWN = T('debajo', 'davall', 'below');
      const PAIRS: [string, T3x, string, T3x][] = [['🐦', T('el pájaro', 'el pardal', 'the bird'), '🌳', T('el árbol', 'l’arbre', 'the tree')], ['☀️', T('el sol', 'el sol', 'the sun'), '🏠', T('la casa', 'la casa', 'the house')], ['🐱', T('el gato', 'el gat', 'the cat'), '📦', T('la caja', 'la caixa', 'the box')], ['🎈', T('el globo', 'el globus', 'the balloon'), '🧒', T('el niño', 'el xiquet', 'the child')]];
      const [e1, w1, e2, w2] = pick(r, PAIRS); const top = r() < 0.5;
      const rows = top ? [e1, e2] : [e2, e1];
      return mc(X((l) => [`¿Dónde está ${w1[0]} respecto a ${w2[0]}?`, `On està ${w1[1]} respecte a ${w2[1]}?`, `Where is ${w1[2]} compared with ${w2[2]}?`][l]), top ? UP : DOWN,
        [top ? DOWN : UP, T('dentro', 'dins', 'inside'), T('detrás', 'darrere', 'behind')], T('Mira qué dibujo está más arriba en la imagen.', 'Mira quin dibuix està més amunt en la imatge.', 'Look at which picture is higher up.'), { visual: { type: 'emoji', rows, big: true } });
    },
  },
  '1P-M-18': {
    explain: [T('La derecha y la izquierda dependen de hacia dónde miras. La mano con la que escribes casi todo el mundo es la derecha.', 'La dreta i l’esquerra depenen de cap a on mires. La mà amb què escriu quasi tothom és la dreta.', 'Right and left depend on which way you face. Most people write with their right hand.'),
      T('En una fila, a la derecha de algo está lo que va después hacia el lado de tu mano derecha.', 'En una fila, a la dreta d’alguna cosa està el que va després cap al costat de la teua mà dreta.', 'In a row, to the right of something is what comes next on your right-hand side.')],
    example: { q: T('¿Qué fruta está justo a la derecha del plátano?', 'Quina fruita està just a la dreta del plàtan?', 'Which fruit is just to the right of the banana?'), visual: { type: 'emoji', rows: ['🍎 🍌 🍇'], big: true },
      steps: [T('Busco el plátano: está en el medio.', 'Busque el plàtan: està en el mig.', 'I find the banana: it is in the middle.'), T('A su derecha están las uvas.', 'A la seua dreta hi ha el raïm.', 'To its right are the grapes.')] },
    make: (r) => {
      const F: [string, T3x][] = [['🍎', T('la manzana', 'la poma', 'the apple')], ['🍌', T('el plátano', 'el plàtan', 'the banana')], ['🍇', T('las uvas', 'el raïm', 'the grapes')], ['🍐', T('la pera', 'la pera', 'the pear')], ['🍊', T('la naranja', 'la taronja', 'the orange')], ['🍓', T('la fresa', 'la maduixa', 'the strawberry')]];
      const row = pickN(r, F, 4); const i = int(r, 1, 2); const right = r() < 0.5;
      const ans = row[right ? i + 1 : i - 1];
      return mc(X((l) => right ? [`¿Qué fruta está justo a la derecha de ${row[i][1][0]}?`, `Quina fruita està just a la dreta de ${row[i][1][1]}?`, `Which fruit is just to the right of ${row[i][1][2]}?`][l] : [`¿Qué fruta está justo a la izquierda de ${row[i][1][0]}?`, `Quina fruita està just a l’esquerra de ${row[i][1][1]}?`, `Which fruit is just to the left of ${row[i][1][2]}?`][l]),
        ans[1], row.filter((x) => x !== ans && x !== row[i]).map((x) => x[1]).concat([row[i][1]]),
        right ? T('La derecha es el lado de la mano con la que escribe casi todo el mundo.', 'La dreta és el costat de la mà amb què escriu quasi tothom.', 'Right is the side of the hand most people write with.') : T('La izquierda es el lado contrario a la derecha.', 'L’esquerra és el costat contrari a la dreta.', 'Left is the opposite side to right.'),
        { visual: { type: 'emoji', rows: [row.map((x) => x[0]).join(' ')], big: true } });
    },
  },
  '1P-M-19': {
    explain: [T('Una línea recta no se tuerce, como el borde de una regla. Una línea curva se dobla, como un arcoíris.', 'Una línia recta no es torça, com la vora d’un regle. Una línia corba es doblega, com un arc de Sant Martí.', 'A straight line does not bend, like the edge of a ruler. A curved line bends, like a rainbow.')],
    example: { q: T('¿El borde de una pelota es recto o curvo?', 'La vora d’una pilota és recta o corba?', 'Is the edge of a ball straight or curved?'), visual: { type: 'emoji', rows: ['⚽'], big: true },
      steps: [T('La pelota es redonda: su borde se dobla todo el rato.', 'La pilota és redona: la seua vora es doblega tota l’estona.', 'A ball is round: its edge bends all the way.'), T('Es curvo.', 'És corba.', 'It is curved.')] },
    bank: lineBank(),
  },
  '1P-M-20': {
    explain: [T('Las figuras planas tienen lados (las líneas del borde) y vértices (las esquinas).', 'Les figures planes tenen costats (les línies de la vora) i vèrtexs (els cantons).', 'Flat shapes have sides (the edges) and vertices (the corners).'),
      T('El triángulo tiene 3 lados, el cuadrado y el rectángulo 4, y el círculo no tiene lados rectos ni esquinas.', 'El triangle té 3 costats, el quadrat i el rectangle 4, i el cercle no té costats rectes ni cantons.', 'A triangle has 3 sides, a square and a rectangle have 4, and a circle has no straight sides or corners.')],
    example: { q: T('¿Cuántos lados tiene esta figura?', 'Quants costats té esta figura?', 'How many sides does this shape have?'), visual: { type: 'shape', sides: 3 },
      steps: [T('Cuento las líneas del borde: 1, 2, 3.', 'Compte les línies de la vora: 1, 2, 3.', 'I count the edges: 1, 2, 3.'), T('Tiene 3 lados: es un triángulo.', 'Té 3 costats: és un triangle.', 'It has 3 sides: it is a triangle.')] },
    make: (r) => {
      const NAMES_S: Record<number, T3x> = { 0: T('círculo', 'cercle', 'circle'), 3: T('triángulo', 'triangle', 'triangle'), 4: T('cuadrado', 'quadrat', 'square'), 5: T('pentágono', 'pentàgon', 'pentagon'), 6: T('hexágono', 'hexàgon', 'hexagon') };
      const n = pick(r, [0, 3, 4, 5, 6]);
      if (n > 0 && r() < 0.5) return q(T('¿Cuántos lados tiene esta figura?', 'Quants costats té esta figura?', 'How many sides does this shape have?'), n, near(r, n, { min: 3, max: 8 }),
        T('Cuenta las líneas del borde. Pon el dedo en una y da la vuelta.', 'Compta les línies de la vora. Posa el dit en una i fes la volta.', 'Count the edges. Put your finger on one and go all the way round.'), { visual: { type: 'shape', sides: n } });
      return mc(T('¿Cómo se llama esta figura?', 'Com es diu esta figura?', 'What is this shape called?'), NAMES_S[n], Object.entries(NAMES_S).filter(([k]) => Number(k) !== n).map(([, v]) => v),
        T('Cuenta los lados: 3 triángulo, 4 cuadrado, 5 pentágono, 6 hexágono. Sin lados rectos, círculo.', 'Compta els costats: 3 triangle, 4 quadrat, 5 pentàgon, 6 hexàgon. Sense costats rectes, cercle.', 'Count the sides: 3 triangle, 4 square, 5 pentagon, 6 hexagon. No straight sides: circle.'), { visual: { type: 'shape', sides: n } });
    },
  },
  '1P-M-21': {
    explain: [T('Juntando figuras salen otras nuevas. Dos triángulos iguales pueden formar un cuadrado.', 'Ajuntant figures n’ixen d’altres de noves. Dos triangles iguals poden formar un quadrat.', 'Putting shapes together makes new ones. Two equal triangles can make a square.'),
      T('Y al revés: una figura se puede partir en otras más pequeñas.', 'I a l’inrevés: una figura es pot partir en altres més xicotetes.', 'And the other way round: a shape can be split into smaller ones.')],
    example: { q: T('Si corto un cuadrado por la diagonal, ¿qué figuras salen?', 'Si talle un quadrat per la diagonal, quines figures n’ixen?', 'If I cut a square along the diagonal, which shapes do I get?'), visual: { type: 'shape', sides: 4 },
      steps: [T('La diagonal va de una esquina a la esquina de enfrente.', 'La diagonal va d’un cantó al cantó de davant.', 'The diagonal goes from one corner to the opposite corner.'), T('Salen 2 triángulos iguales.', 'N’ixen 2 triangles iguals.', 'I get 2 equal triangles.')] },
    bank: composeBank(),
  },

  // ── Estadística y probabilidad ──
  '1P-M-22': {
    explain: [T('Algo es seguro si pasa siempre, posible si a veces pasa y a veces no, e imposible si no puede pasar nunca.', 'Una cosa és segura si passa sempre, possible si a vegades passa i a vegades no, i impossible si no pot passar mai.', 'Something is certain if it always happens, possible if it sometimes happens, and impossible if it can never happen.')],
    example: { q: T('En una bolsa solo hay bolas rojas. Saco una sin mirar. ¿Que salga roja es seguro, posible o imposible?', 'En una bossa només hi ha boles roges. En trac una sense mirar. Que isca roja és segur, possible o impossible?', 'A bag has only red balls. I take one without looking. Is getting red certain, possible or impossible?'), visual: { type: 'emoji', rows: ['🔴🔴🔴🔴'] },
      steps: [T('Todas las bolas son rojas.', 'Totes les boles són roges.', 'All the balls are red.'), T('Siempre saldrá roja: es seguro.', 'Sempre eixirà roja: és segur.', 'It will always be red: it is certain.')] },
    make: (r) => {
      const SURE = T('seguro', 'segur', 'certain'), MAY = T('posible', 'possible', 'possible'), NOT = T('imposible', 'impossible', 'impossible');
      const BALLS: [string, T3x][] = [['🔴', T('roja', 'roja', 'red')], ['🔵', T('azul', 'blava', 'blue')], ['🟢', T('verde', 'verda', 'green')], ['🟡', T('amarilla', 'groga', 'yellow')]];
      const [c1, c2, c3] = pickN(r, BALLS, 3); const k = int(r, 0, 2);
      const bag = k === 0 ? c1[0].repeat(4) : c1[0].repeat(2) + c2[0].repeat(2);
      const ask = k === 2 ? c3 : c1; const ans = k === 0 ? SURE : k === 1 ? MAY : NOT;
      return mc(X((l) => [`Saco una bola sin mirar. ¿Que salga ${ask[1][0]} es seguro, posible o imposible?`, `Trac una bola sense mirar. Que isca ${ask[1][1]} és segur, possible o impossible?`, `I take a ball without looking. Is getting ${ask[1][2]} certain, possible or impossible?`][l]),
        ans, [SURE, MAY, NOT].filter((x) => x !== ans), T('Mira qué colores hay en la bolsa. Si solo hay ese color, es seguro; si no hay ninguno, imposible.', 'Mira quins colors hi ha en la bossa. Si només hi ha eixe color, és segur; si no n’hi ha cap, impossible.', 'Look at the colours in the bag. If there is only that colour, it is certain; if there are none, impossible.'),
        { visual: { type: 'emoji', rows: [bag] } });
    },
  },
  '1P-M-23': {
    explain: [T('Para saber qué prefiere la clase, preguntamos a cada uno y apuntamos su respuesta con una marca.', 'Per a saber què prefereix la classe, preguntem a cadascú i apuntem la seua resposta amb una marca.', 'To find out what the class likes best, we ask everyone and record each answer with a mark.'),
      T('Después contamos las marcas de cada respuesta.', 'Després comptem les marques de cada resposta.', 'Then we count the marks for each answer.')],
    example: { q: T('Cada niño eligió su fruta: 🍎🍌🍎🍎🍌. ¿Cuántos eligieron manzana?', 'Cada xiquet va triar la seua fruita: 🍎🍌🍎🍎🍌. Quants van triar poma?', 'Each child chose a fruit: 🍎🍌🍎🍎🍌. How many chose an apple?'),
      steps: [T('Cuento solo las manzanas: 1, 2, 3.', 'Compte només les pomes: 1, 2, 3.', 'I count only the apples: 1, 2, 3.'), T('3 niños eligieron manzana.', '3 xiquets van triar poma.', '3 children chose an apple.')] },
    make: (r) => {
      const opts: [string, T3x][] = [['🍎', T('manzana', 'poma', 'apple')], ['🍌', T('plátano', 'plàtan', 'banana')], ['🍓', T('fresa', 'maduixa', 'strawberry')]];
      const counts = opts.map(() => int(r, 1, 6)); const list = opts.flatMap((o, i) => Array(counts[i]).fill(o[0]));
      const shuffled = pickN(r, list, list.length); const i = int(r, 0, 2);
      if (r() < 0.6) return q(X((l) => [`Cada niño eligió una fruta. ¿Cuántos eligieron ${opts[i][1][0]}?`, `Cada xiquet va triar una fruita. Quants van triar ${opts[i][1][1]}?`, `Each child chose a fruit. How many chose ${opts[i][1][2]}?`][l]),
        counts[i], near(r, counts[i], { min: 0, also: counts.filter((c) => c !== counts[i]) }), T('Cuenta solo ese dibujo y tacha los que vas contando.', 'Compta només eixe dibuix i ratlla els que vas comptant.', 'Count only that picture and cross them off as you go.'), { visual: { type: 'emoji', rows: [shuffled.join('')] } });
      return q(T('¿Cuántos niños han contestado en total?', 'Quants xiquets han contestat en total?', 'How many children answered altogether?'), list.length, near(r, list.length, { min: 1 }),
        T('Cuenta todos los dibujos.', 'Compta tots els dibuixos.', 'Count all the pictures.'), { visual: { type: 'emoji', rows: [shuffled.join('')] } });
    },
  },
  '1P-M-24': {
    explain: [T('Un pictograma usa dibujos para mostrar cuántos hay de cada cosa. Cada dibujo vale uno.', 'Un pictograma usa dibuixos per a mostrar quants n’hi ha de cada cosa. Cada dibuix val un.', 'A pictogram uses pictures to show how many there are of each thing. Each picture counts as one.'),
      T('La fila más larga es la que tiene más.', 'La fila més llarga és la que en té més.', 'The longest row has the most.')],
    example: { q: T('¿Qué animal prefieren más niños?', 'Quin animal prefereixen més xiquets?', 'Which animal do most children like best?'), visual: { type: 'table', head: ['', ''], rows: [['🐶', '🙂🙂🙂🙂'], ['🐱', '🙂🙂']] },
      steps: [T('Perro: 4 caras. Gato: 2 caras.', 'Gos: 4 cares. Gat: 2 cares.', 'Dog: 4 faces. Cat: 2 faces.'), T('El perro tiene más: lo prefieren más niños.', 'El gos en té més: el prefereixen més xiquets.', 'The dog has more: more children like it best.')] },
    make: (r) => {
      const A: [string, T3x][] = [['🐶', T('el perro', 'el gos', 'the dog')], ['🐱', T('el gato', 'el gat', 'the cat')], ['🐰', T('el conejo', 'el conill', 'the rabbit')], ['🐢', T('la tortuga', 'la tortuga', 'the tortoise')]];
      const an = pickN(r, A, 3); const c = an.map(() => int(r, 1, 7)); while (new Set(c).size < 3) c[int(r, 0, 2)] = int(r, 1, 7);
      const vis = { type: 'table' as const, head: ['', ''], rows: an.map((a, i) => [a[0], '🙂'.repeat(c[i])]) };
      const k = int(r, 0, 2);
      if (k === 0) { const m = c.indexOf(Math.max(...c)); return mc(T('¿Qué animal ha recibido más votos?', 'Quin animal ha rebut més vots?', 'Which animal got the most votes?'), an[m][1], an.filter((_, i) => i !== m).map((a) => a[1]), T('Busca la fila más larga.', 'Busca la fila més llarga.', 'Find the longest row.'), { visual: vis }); }
      if (k === 1) { const i = int(r, 0, 2); return q(X((l) => [`¿Cuántos votos tiene ${an[i][1][0]}?`, `Quants vots té ${an[i][1][1]}?`, `How many votes did ${an[i][1][2]} get?`][l]), c[i], near(r, c[i], { min: 1, also: c.filter((x) => x !== c[i]) }), T('Cuenta las caras de esa fila.', 'Compta les cares d’eixa fila.', 'Count the faces in that row.'), { visual: vis }); }
      const i = 0, j = 1; const d = Math.abs(c[i] - c[j]);
      return q(X((l) => [`¿Cuántos votos más tiene ${(c[i] > c[j] ? an[i] : an[j])[1][0]} que ${(c[i] > c[j] ? an[j] : an[i])[1][0]}?`, `Quants vots més té ${(c[i] > c[j] ? an[i] : an[j])[1][1]} que ${(c[i] > c[j] ? an[j] : an[i])[1][1]}?`, `How many more votes did ${(c[i] > c[j] ? an[i] : an[j])[1][2]} get than ${(c[i] > c[j] ? an[j] : an[i])[1][2]}?`][l]),
        d, near(r, d, { min: 0, also: [c[i] + c[j]] }), T('Compara las dos filas: cuenta las caras que sobran en la larga.', 'Compara les dues files: compta les cares que sobren en la llarga.', 'Compare the two rows: count the extra faces in the longer one.'), { visual: vis });
    },
  },

  // ── Álgebra y pensamiento computacional ──
  '1P-M-25': {
    explain: [T('Una serie repite un patrón. Para seguirla, busca qué parte se repite.', 'Una sèrie repetix un patró. Per a continuar-la, busca quina part es repetix.', 'A pattern repeats. To carry it on, find the part that repeats.')],
    example: { q: T('¿Qué va después? 🔴🔵🔴🔵🔴 …', 'Què va després? 🔴🔵🔴🔵🔴 …', 'What comes next? 🔴🔵🔴🔵🔴 …'),
      steps: [T('Se repite rojo, azul.', 'Es repetix roig, blau.', 'Red, blue repeats.'), T('Después del rojo va el azul: 🔵.', 'Després del roig va el blau: 🔵.', 'After red comes blue: 🔵.')] },
    make: (r) => {
      const SET = ['🔴', '🔵', '🟢', '🟡', '⭐', '🌙', '🍎', '🍌'];
      const unit = pickN(r, SET, int(r, 2, 3)); if (r() < 0.3) unit.push(unit[0]);
      const len = unit.length * 2 + int(r, 0, unit.length - 1); const seq = Array.from({ length: len }, (_, i) => unit[i % unit.length]);
      const ans = unit[len % unit.length];
      return mc(T('¿Qué va después?', 'Què va després?', 'What comes next?'), S(ans), SET.filter((x) => x !== ans).slice(0, 3).map(S),
        T('Busca el trozo que se repite y di la serie en voz alta.', 'Busca el tros que es repetix i digues la sèrie en veu alta.', 'Find the part that repeats and say the pattern out loud.'), { visual: { type: 'emoji', rows: [seq.join('') + '❓'] } });
    },
  },
  '1P-M-26': {
    explain: [T('Una instrucción es una orden clara. Si sigues las instrucciones en orden, llegas siempre al mismo sitio.', 'Una instrucció és una ordre clara. Si seguixes les instruccions en ordre, arribes sempre al mateix lloc.', 'An instruction is a clear order. If you follow instructions in order, you always end up in the same place.')],
    example: { q: T('El robot está en la casilla 2. Avanza 3 casillas. ¿En qué casilla queda?', 'El robot està en la casella 2. Avança 3 caselles. En quina casella queda?', 'The robot is on square 2. It moves forward 3 squares. Which square does it end on?'), visual: { type: 'line', min: 0, max: 10, marks: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], point: 2 },
      steps: [T('Salgo del 2 y doy 3 pasos: 3, 4, 5.', 'Isc del 2 i faig 3 passos: 3, 4, 5.', 'I start at 2 and take 3 steps: 3, 4, 5.'), T('El robot queda en la casilla 5.', 'El robot queda en la casella 5.', 'The robot ends on square 5.')] },
    make: (r) => {
      const s = int(r, 0, 5), a = int(r, 1, 4), b = int(r, 1, Math.min(3, s + a)), two = r() < 0.5, end = two ? s + a - b : s + a;
      const L = { type: 'line' as const, min: 0, max: 10, marks: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], point: s };
      return q(X((l) => two ? [`El robot está en la casilla ${s}. Avanza ${a} y después retrocede ${b}. ¿Dónde queda?`, `El robot està en la casella ${s}. Avança ${a} i després retrocedix ${b}. On queda?`, `The robot is on square ${s}. It moves forward ${a} and then back ${b}. Where does it end?`][l] : [`El robot está en la casilla ${s}. Avanza ${a} casillas. ¿Dónde queda?`, `El robot està en la casella ${s}. Avança ${a} caselles. On queda?`, `The robot is on square ${s}. It moves forward ${a} squares. Where does it end?`][l]),
        end, near(r, end, { min: 0, max: 10, also: [s + a + b, s].filter((x) => x <= 10) }), T('Pon el dedo en la casilla de salida y haz cada orden por turno.', 'Posa el dit en la casella d’eixida i fes cada ordre per torn.', 'Put your finger on the start square and do each instruction in turn.'), { visual: L });
    },
  },
  '1P-M-27': {
    explain: [T('En una suma con hueco, piensa qué número falta para que los dos lados valgan lo mismo.', 'En una suma amb buit, pensa quin nombre falta perquè els dos costats valguen el mateix.', 'In an addition with a gap, think which number is missing so both sides are worth the same.')],
    example: { q: S('5 + ? = 9'), visual: { type: 'balance', left: '5 + ?', right: '9' },
      steps: [T('Tengo 5 y quiero llegar a 9.', 'Tinc 5 i vull arribar a 9.', 'I have 5 and want to reach 9.'), T('6, 7, 8, 9: faltan 4. Entonces 5 + 4 = 9.', '6, 7, 8, 9: en falten 4. Aleshores 5 + 4 = 9.', '6, 7, 8, 9: 4 are missing. So 5 + 4 = 9.')] },
    make: (r) => {
      const c = int(r, 4, 20), a = int(r, 1, c - 1), b = c - a, sub = r() < 0.3;
      if (sub) return q(X((l) => `${N(l, c)} − ? = ${N(l, a)}`), b, near(r, b, { also: [c + a], max: 30 }), T('¿Cuánto hay que quitar para bajar hasta ese número?', 'Quant cal llevar per a baixar fins a eixe nombre?', 'How many must you take away to get down to that number?'), { aid: { type: 'balance', left: `${c} − ?`, right: String(a) } });
      return q(X((l) => `${N(l, a)} + ? = ${N(l, c)}`), b, near(r, b, { also: [c + a, c], max: 40 }), X((l) => [`Cuenta desde ${a} hasta ${c}.`, `Compta des de ${a} fins a ${c}.`, `Count on from ${a} to ${c}.`][l]), { aid: { type: 'balance', left: `${a} + ?`, right: String(c) } });
    },
  },
  '1P-M-28': {
    explain: [T('En un juego de estrategia no hay suerte: gana quien piensa antes de mover.', 'En un joc d’estratègia no hi ha sort: guanya qui pensa abans de moure.', 'In a strategy game there is no luck: the one who thinks before moving wins.'),
      T('Piensa qué hará el otro jugador después de tu jugada.', 'Pensa què farà l’altre jugador després de la teua jugada.', 'Think what the other player will do after your move.')],
    example: { q: T('Hay 3 fichas. Por turnos, cada uno quita 1 o 2. Gana quien quita la última. Te toca. ¿Cuántas quitas?', 'Hi ha 3 fitxes. Per torns, cadascú en lleva 1 o 2. Guanya qui lleva l’última. Et toca. Quantes en lleves?', 'There are 3 counters. Taking turns, each player removes 1 or 2. Whoever takes the last one wins. Your turn. How many do you take?'), visual: { type: 'emoji', rows: ['🟣🟣🟣'] },
      steps: [T('Si quito 1, quedan 2 y el otro las quita y gana.', 'Si en lleve 1, en queden 2 i l’altre les lleva i guanya.', 'If I take 1, 2 are left and the other player takes them and wins.'), T('Si quito 2, queda 1… y también gana el otro. ¡Con 3 fichas, quien empieza pierde si el otro juega bien!', 'Si en lleve 2, en queda 1… i també guanya l’altre. Amb 3 fitxes, qui comença perd si l’altre juga bé!', 'If I take 2, 1 is left… and the other player wins again. With 3 counters, whoever starts loses if the other plays well!')] },
    make: (r) => {
      const m = pick(r, [2, 2, 3]); let n = int(r, 2, 11); if (n % (m + 1) === 0) n += 1; const a = n % (m + 1); // leave a multiple of m + 1 to the other player
      const opts = Array.from({ length: m }, (_, i) => i + 1).filter((x) => x !== a);
      return q(X((l) => [`Hay ${n} fichas. Cada jugador quita de 1 a ${m} por turno. Gana quien quita la última. Te toca: ¿cuántas quitas para ganar?`, `Hi ha ${n} fitxes. Cada jugador en lleva d’1 a ${m} per torn. Guanya qui lleva l’última. Et toca: quantes en lleves per a guanyar?`, `There are ${n} counters. Each player removes 1 to ${m} per turn. Whoever takes the last one wins. Your turn: how many do you take to win?`][l]),
        a, opts, X((l) => [`Intenta dejarle al otro ${m + 1} o ${2 * (m + 1)} fichas: así siempre ganarás tú.`, `Intenta deixar-li a l’altre ${m + 1} o ${2 * (m + 1)} fitxes: així sempre guanyaràs tu.`, `Try to leave the other player ${m + 1} or ${2 * (m + 1)} counters: then you will always win.`][l]), { mc: true, visual: { type: 'emoji', rows: ['🟣'.repeat(n)] } });
    },
  },
};
export default P;

type T3x = readonly [string, string, string];
function cap(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }

function lenBank() {
  const LONG = T('el autobús', 'l’autobús', 'the bus'), PEN = T('el lápiz', 'el llapis', 'the pencil');
  const H = (a: T3x, b: T3x, tall: boolean, e: string) => mc(X((l) => tall ? [`¿Qué es más alto, ${a[0]} o ${b[0]}?`, `Què és més alt, ${a[1]} o ${b[1]}?`, `Which is taller, ${a[2]} or ${b[2]}?`][l] : [`¿Qué es más largo, ${a[0]} o ${b[0]}?`, `Què és més llarg, ${a[1]} o ${b[1]}?`, `Which is longer, ${a[2]} or ${b[2]}?`][l]),
    a, [b, T('Son iguales', 'Són iguals', 'They are the same')], T('Imagina las dos cosas una al lado de la otra.', 'Imagina les dues coses una al costat de l’altra.', 'Imagine the two things side by side.'), { visual: { type: 'emoji', rows: [e], big: true } });
  return [
    H(LONG, PEN, false, '🚌 ✏️'), H(T('la jirafa', 'la girafa', 'the giraffe'), T('el perro', 'el gos', 'the dog'), true, '🦒 🐕'),
    H(T('el edificio', 'l’edifici', 'the building'), T('la casa pequeña', 'la caseta', 'the little house'), true, '🏢 🏠'), H(T('el tren', 'el tren', 'the train'), T('el coche', 'el cotxe', 'the car'), false, '🚆 🚗'),
    H(T('el árbol', 'l’arbre', 'the tree'), T('la flor', 'la flor', 'the flower'), true, '🌳 🌼'), H(T('la serpiente', 'la serp', 'the snake'), T('el gusano', 'el cuc', 'the worm'), false, '🐍 🪱'),
    mc(T('Para comparar dos lápices, ¿cómo los pongo?', 'Per a comparar dos llapis, com els pose?', 'To compare two pencils, how should I place them?'), T('Uno al lado del otro, empezando en el mismo sitio', 'Un al costat de l’altre, començant en el mateix lloc', 'Side by side, starting at the same place'),
      [T('Uno encima del otro, de cualquier manera', 'Un damunt de l’altre, de qualsevol manera', 'One on top of the other, any old way'), T('Uno en cada mesa', 'Un en cada taula', 'One on each table'), T('Mirando solo su color', 'Mirant només el seu color', 'Looking only at their colour')], T('Si no empiezan en el mismo sitio, la comparación engaña.', 'Si no comencen en el mateix lloc, la comparació enganya.', 'If they do not start at the same place, the comparison is misleading.')),
  ];
}
function weightBank() {
  const W = (a: T3x, b: T3x, e: string) => mc(X((l) => [`¿Qué pesa más, ${a[0]} o ${b[0]}?`, `Què pesa més, ${a[1]} o ${b[1]}?`, `Which is heavier, ${a[2]} or ${b[2]}?`][l]), a, [b, T('Pesan igual', 'Pesen igual', 'They weigh the same')],
    T('Piensa cuál costaría más levantar.', 'Pensa quin costaria més alçar.', 'Think which would be harder to lift.'), { visual: { type: 'emoji', rows: [e], big: true } });
  return [
    W(T('una sandía', 'una síndria', 'a watermelon'), T('una fresa', 'una maduixa', 'a strawberry'), '🍉 🍓'), W(T('un elefante', 'un elefant', 'an elephant'), T('un ratón', 'un ratolí', 'a mouse'), '🐘 🐁'),
    W(T('una mochila llena', 'una motxilla plena', 'a full rucksack'), T('una pluma', 'una ploma', 'a feather'), '🎒 🪶'), W(T('una piedra', 'una pedra', 'a stone'), T('un globo', 'un globus', 'a balloon'), '🪨 🎈'),
    mc(T('En la balanza, el plato de la izquierda baja. ¿Dónde está lo que pesa más?', 'En la balança, el plat de l’esquerra baixa. On està el que pesa més?', 'On the balance, the left pan goes down. Where is the heavier thing?'), T('En el plato de la izquierda', 'En el plat de l’esquerra', 'In the left pan'),
      [T('En el plato de la derecha', 'En el plat de la dreta', 'In the right pan'), T('Pesan igual', 'Pesen igual', 'They weigh the same')], T('El plato que baja tiene lo que pesa más.', 'El plat que baixa té el que pesa més.', 'The pan that goes down holds the heavier thing.'), { visual: { type: 'balance', left: '🍍', right: '🍒' } }),
    mc(T('Un globo grande y una canica pequeña. ¿Qué pesa más?', 'Un globus gran i una bala xicoteta. Què pesa més?', 'A big balloon and a small marble. Which is heavier?'), T('La canica', 'La bala', 'The marble'), [T('El globo', 'El globus', 'The balloon'), T('Pesan igual', 'Pesen igual', 'They weigh the same')],
      T('Ser grande no es pesar más: el globo lleva aire dentro.', 'Ser gran no és pesar més: el globus porta aire dins.', 'Big does not mean heavy: the balloon is full of air.'), { visual: { type: 'emoji', rows: ['🎈 🔵'], big: true } }),
  ];
}
function lineBank() {
  const R_ = T('recta', 'recta', 'straight'), C_ = T('curva', 'corba', 'curved');
  const L = (thing_: T3x, straight: boolean, e: string) => mc(X((l) => [`¿El borde de ${thing_[0]} es una línea recta o curva?`, `La vora de ${thing_[1]} és una línia recta o corba?`, `Is the edge of ${thing_[2]} a straight or a curved line?`][l]), straight ? R_ : C_, [straight ? C_ : R_],
    T('Recta: no se tuerce nada. Curva: se dobla.', 'Recta: no es torça gens. Corba: es doblega.', 'Straight: it does not bend at all. Curved: it bends.'), { visual: { type: 'emoji', rows: [e], big: true } });
  return [L(T('una regla', 'un regle', 'a ruler'), true, '📏'), L(T('una pelota', 'una pilota', 'a ball'), false, '⚽'), L(T('un libro', 'un llibre', 'a book'), true, '📕'), L(T('un plato', 'un plat', 'a plate'), false, '🍽️'),
    L(T('un arcoíris', 'un arc de Sant Martí', 'a rainbow'), false, '🌈'), L(T('una puerta', 'una porta', 'a door'), true, '🚪'), L(T('una moneda', 'una moneda', 'a coin'), false, '🪙'), L(T('una mesa cuadrada', 'una taula quadrada', 'a square table'), true, '⬛')];
}
function composeBank() {
  const SQ = T('un cuadrado', 'un quadrat', 'a square'), TR = T('un triángulo', 'un triangle', 'a triangle'), RE = T('un rectángulo', 'un rectangle', 'a rectangle'), CI = T('un círculo', 'un cercle', 'a circle');
  return [
    mc(T('Junto dos triángulos iguales por su lado largo. ¿Qué figura puede salir?', 'Ajunte dos triangles iguals pel costat llarg. Quina figura pot eixir?', 'I join two equal triangles along their long side. Which shape can I get?'), SQ, [CI, T('un pentágono', 'un pentàgon', 'a pentagon')], T('Piensa en un cuadrado cortado por la diagonal.', 'Pensa en un quadrat tallat per la diagonal.', 'Think of a square cut along its diagonal.')),
    mc(T('Junto dos cuadrados iguales, uno al lado del otro. ¿Qué figura sale?', 'Ajunte dos quadrats iguals, un al costat de l’altre. Quina figura n’ix?', 'I put two equal squares side by side. Which shape do I get?'), RE, [CI, TR], T('Sale una figura de 4 lados más larga que alta.', 'N’ix una figura de 4 costats més llarga que alta.', 'You get a 4-sided shape that is longer than it is tall.')),
    q(T('¿Cuántos triángulos salen si corto un cuadrado por sus dos diagonales?', 'Quants triangles n’ixen si talle un quadrat per les dues diagonals?', 'How many triangles do I get if I cut a square along both diagonals?'), 4, [2, 3, 8], T('Las dos diagonales se cruzan en el centro.', 'Les dues diagonals es creuen en el centre.', 'The two diagonals cross in the middle.')),
    q(T('Con 4 cuadrados pequeños formo uno grande. ¿Cuántos cuadrados pequeños hay en cada fila?', 'Amb 4 quadrats xicotets forme un de gran. Quants quadrats xicotets hi ha en cada fila?', 'I make a big square from 4 small squares. How many small squares are in each row?'), 2, [1, 3, 4], T('Dos filas de dos.', 'Dues files de dos.', 'Two rows of two.'), { visual: { type: 'emoji', rows: ['🟦🟦', '🟦🟦'], big: true } }),
    mc(T('¿Qué figura no se puede hacer juntando cuadrados?', 'Quina figura no es pot fer ajuntant quadrats?', 'Which shape cannot be made by joining squares?'), CI, [RE, SQ], T('Los cuadrados tienen lados rectos; ¿cuál no tiene ninguno?', 'Els quadrats tenen costats rectes; quina no en té cap?', 'Squares have straight sides; which shape has none?')),
    mc(T('Si corto un rectángulo por la mitad, ¿qué me puede salir?', 'Si talle un rectangle per la meitat, què em pot eixir?', 'If I cut a rectangle in half, what can I get?'), T('dos cuadrados o dos rectángulos', 'dos quadrats o dos rectangles', 'two squares or two rectangles'), [T('dos círculos', 'dos cercles', 'two circles'), T('un hexágono', 'un hexàgon', 'a hexagon')], T('Al cortar por la mitad, cada parte sigue teniendo 4 esquinas rectas.', 'En tallar per la meitat, cada part continua tenint 4 cantons rectes.', 'Cutting in half, each part still has 4 square corners.')),
  ];
}
