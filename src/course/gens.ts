// Reusable exercise generators with parameters, shared by several school years
// (the same kind of exercise with bigger numbers, more steps or less help).
import type { Visual } from '@/engine/types';
import type { Q, T3 } from './types';
import { addQ, compareQ, DAYS, gcd, int, mc, N, NAMES, near, pick, pickN, q, round, rowsOf, S, subQ, T, THINGS, thing, X, type Li, type R } from './lib';

export type Gen = (r: R) => Q;
export const line = (min: number, max: number, step: number, labelStep = step, point?: number): Visual => {
  const marks: number[] = []; for (let v = min; v <= max + 1e-9; v = round(v + step, 6)) marks.push(v);
  return { type: 'line', min, max, marks, labels: marks.filter((v) => Math.abs(Math.round(v / labelStep) * labelStep - v) < 1e-9), ...(point != null ? { point } : {}) };
};
export const tens = (n: number): Visual => ({ type: 'tens', tens: Math.floor(n / 10), ones: n % 10 });

/* ───────────── Place value ───────────── */
const PLACE: T3[] = [T('unidades', 'unitats', 'ones'), T('decenas', 'desenes', 'tens'), T('centenas', 'centenes', 'hundreds'), T('unidades de millar', 'unitats de miler', 'thousands'), T('decenas de millar', 'desenes de miler', 'ten thousands'), T('centenas de millar', 'centenes de miler', 'hundred thousands'), T('unidades de millón', 'unitats de milió', 'millions')];
/** Place value up to `digits` digits: which digit is in a place, what a digit is worth, build from parts. */
export const placeValue = (digits: number): Gen => (r) => {
  const n = int(r, 10 ** (digits - 1), 10 ** digits - 1); const s = String(n);
  const p = int(r, 0, digits - 1); const d = Number(s[s.length - 1 - p]); const k = int(r, 0, 2);
  if (k === 0) return q(X((l) => [`En el ${N(l, n)}, ¿qué cifra está en las ${PLACE[p][0]}?`, `En el ${N(l, n)}, quina xifra està en les ${PLACE[p][1]}?`, `In ${N(l, n)}, which digit is in the ${PLACE[p][2]} place?`][l]), d,
    near(r, d, { min: 0, max: 9, also: [...new Set(s.split('').map(Number))].filter((x) => x !== d) }), T('Empieza a contar por la derecha: unidades, decenas, centenas…', 'Comença a comptar per la dreta: unitats, desenes, centenes…', 'Count from the right: ones, tens, hundreds…'), { mc: true });
  if (k === 1 && d > 0) { const v = d * 10 ** p; return q(X((l) => [`¿Cuánto vale el ${d} en el número ${N(l, n)}?`, `Quant val el ${d} en el nombre ${N(l, n)}?`, `What is the ${d} worth in ${N(l, n)}?`][l]), v,
    near(r, v, { also: [d, v * 10, v / 10].filter((x) => Number.isInteger(x) && x !== v && x > 0) }), T('Mira en qué lugar está: si está en las centenas, vale ese número de cientos.', 'Mira en quin lloc està: si està en les centenes, val eixe nombre de centenars.', 'Look at its place: in the hundreds place it is worth that many hundreds.')); }
  const parts = s.split('').map((c, i) => Number(c) * 10 ** (s.length - 1 - i)).filter((x) => x > 0);
  const swapped = Number(s.split('').reverse().join(''));
  return q(X((l) => `${parts.map((x) => N(l, x)).join(' + ')} = ?`), n, near(r, n, { also: [swapped, n + 10 ** p, n - 10 ** p].filter((x) => x > 0 && x !== n) }),
    T('Cada sumando dice cuánto hay en cada lugar. Escríbelos uno al lado del otro.', 'Cada sumand diu quant hi ha en cada lloc. Escriu-los un al costat de l’altre.', 'Each part tells you how much is in each place. Write them side by side.'));
};
/** Compare or order numbers up to max. */
export const compareOrder = (max: number, min = 10): Gen => (r) => {
  const a = int(r, min, max); const k = int(r, 0, 2);
  if (k === 0) { let b = Number(String(a).split('').reverse().join('')); if (b === a || b < min) b = a + pick(r, [1, 10, 100].filter((x) => a + x <= max)) ; return compareQ(r, [a, b, ...(r() < 0.5 ? [int(r, min, max)] : [])].filter((x, i, arr) => arr.indexOf(x) === i), r() < 0.5, T('Compara cifra a cifra empezando por la izquierda: gana la primera que sea mayor.', 'Compara xifra a xifra començant per l’esquerra: guanya la primera que siga major.', 'Compare digit by digit from the left: the first bigger digit wins.')); }
  if (k === 1) {
    const ns = [...new Set([a, int(r, min, max), int(r, min, max), int(r, min, max)])]; const sorted = [...ns].sort((x, y) => x - y);
    const ans = sorted[1]; return q(X((l) => [`Ordena de menor a mayor: ${ns.map((x) => N(l, x)).join(', ')}. ¿Cuál va en segundo lugar?`, `Ordena de menor a major: ${ns.map((x) => N(l, x)).join(', ')}. Quin va en segon lloc?`, `Order from smallest to biggest: ${ns.map((x) => N(l, x)).join(', ')}. Which comes second?`][l]),
      ans, ns.filter((x) => x !== ans), T('Busca primero el más pequeño; el siguiente más pequeño va en segundo lugar.', 'Busca primer el més xicotet; el següent més xicotet va en segon lloc.', 'Find the smallest first; the next smallest comes second.'), { mc: true });
  }
  const st = pick(r, [1, 10, 100].filter((x) => x * 3 < max)); const after = r() < 0.5; const ans = after ? a + st : a - st;
  return q(X((l) => after ? [`¿Qué número es ${N(l, st)} más que ${N(l, a)}?`, `Quin nombre és ${N(l, st)} més que ${N(l, a)}?`, `Which number is ${N(l, st)} more than ${N(l, a)}?`][l] : [`¿Qué número es ${N(l, st)} menos que ${N(l, a)}?`, `Quin nombre és ${N(l, st)} menys que ${N(l, a)}?`, `Which number is ${N(l, st)} less than ${N(l, a)}?`][l]),
    ans, near(r, ans, { also: [after ? a - st : a + st, a + (after ? 1 : -1) * (st === 1 ? 10 : 1)], min: 0 }), T('Cambia solo la cifra de ese lugar (si pasa de 9, se lleva una al lugar siguiente).', 'Canvia només la xifra d’eixe lloc (si passa de 9, se’n porta una al lloc següent).', 'Change only the digit in that place (if it goes past 9, carry one to the next place).'));
};

/* ───────────── Operations ───────────── */
/** Addition with carrying: `digits`-digit numbers, at least one carry most of the time. */
export const addCarry = (digits: number, terms = 2): Gen => (r) => {
  const lo = 10 ** (digits - 1), hi = 10 ** digits - 1;
  const xs = Array.from({ length: terms }, () => int(r, lo, Math.floor(hi * 0.6)));
  if (terms === 2) return addQ(r, xs[0], xs[1], { aid: digits === 2 ? undefined : undefined });
  const s = xs.reduce((a, b) => a + b, 0);
  return q(X((l) => `${xs.map((x) => N(l, x)).join(' + ')} = ?`), s, near(r, s, { also: [s + 10, s - 10, s + 100], spread: 2 }), T('Colócalos en columna: unidades debajo de unidades. Suma cada columna y lleva lo que pase de 9.', 'Col·loca’ls en columna: unitats davall d’unitats. Suma cada columna i porta el que passe de 9.', 'Write them in columns, ones under ones. Add each column and carry anything over 9.'));
};
/** Subtraction with exchanging. */
export const subBorrow = (digits: number): Gen => (r) => {
  const lo = 10 ** (digits - 1), hi = 10 ** digits - 1;
  const a = int(r, Math.max(lo * 2, 20), hi); const b = int(r, Math.max(1, lo), a - 1);
  return subQ(r, a, b);
};
export const mulTable = (tables: number[], maxFactor = 10): Gen => (r) => { const a = pick(r, tables), b = int(r, 1, maxFactor); return r() < 0.5 ? mulQ2(r, a, b) : mulQ2(r, b, a); };
function mulQ2(r: R, a: number, b: number): Q {
  const p = a * b;
  return q(X((l) => `${N(l, a)} × ${N(l, b)} = ?`), p, near(r, p, { also: [p + a, p - a, p + b, p - b, a + b].filter((x) => x > 0 && x !== p) }),
    X((l) => [`Son ${b} grupos de ${a}. Si sabes ${a} × ${Math.max(1, b - 1)}, súmale ${a}.`, `Són ${b} grups de ${a}. Si saps ${a} × ${Math.max(1, b - 1)}, suma-li ${a}.`, `It is ${b} groups of ${a}. If you know ${a} × ${Math.max(1, b - 1)}, add ${a}.`][l]));
}
/** a × b with a of `da` digits and b of `db` digits. */
export const mulDigits = (da: number, db: number): Gen => (r) => {
  const a = int(r, 10 ** (da - 1) + (da === 1 ? 1 : 0), 10 ** da - 1), b = int(r, Math.max(2, 10 ** (db - 1)), 10 ** db - 1), p = a * b;
  return q(X((l) => `${N(l, a)} × ${N(l, b)} = ?`), p, near(r, p, { also: [p + a, p - a, p + 10 * a, a * (b % 10)].filter((x) => x > 0 && x !== p), spread: 3 }),
    db === 1 ? X((l) => [`Multiplica ${b} por cada cifra empezando por las unidades y lleva lo que pase de 9.`, `Multiplica ${b} per cada xifra començant per les unitats i porta el que passe de 9.`, `Multiply each digit by ${b}, starting with the ones, and carry anything over 9.`][l])
      : T('Multiplica primero por las unidades y luego por las decenas (deja un hueco a la derecha). Suma las dos filas.', 'Multiplica primer per les unitats i després per les desenes (deixa un buit a la dreta). Suma les dues files.', 'Multiply by the ones first, then by the tens (leave a space on the right). Add the two rows.'));
};
/** Division by a one- or two-digit divisor: exact or with a remainder (then the question asks for quotient or remainder). */
export const divide = (maxQuot: number, divisors: number[], remainder = false): Gen => (r) => {
  const d = pick(r, divisors), c = int(r, 2, maxQuot), rest = remainder ? int(r, 0, d - 1) : 0, D = d * c + rest;
  if (!remainder || rest === 0 || r() < 0.5) return q(X((l) => rest ? [`${N(l, D)} ÷ ${N(l, d)}: ¿cuál es el cociente?`, `${N(l, D)} ÷ ${N(l, d)}: quin és el quocient?`, `${N(l, D)} ÷ ${N(l, d)}: what is the quotient?`][l] : `${N(l, D)} ÷ ${N(l, d)} = ?`), c,
    near(r, c, { min: 1, also: [c + 1, c - 1, D - d] .filter((x) => x > 0 && x !== c) }), X((l) => [`Busca qué número por ${d} se acerca más a ${D} sin pasarse.`, `Busca quin nombre per ${d} s’acosta més a ${D} sense passar-se’n.`, `Find which number times ${d} gets closest to ${D} without going over.`][l]));
  return q(X((l) => [`${N(l, D)} ÷ ${N(l, d)}: ¿cuál es el resto?`, `${N(l, D)} ÷ ${N(l, d)}: quin és el residu?`, `${N(l, D)} ÷ ${N(l, d)}: what is the remainder?`][l]), rest, near(r, rest, { min: 0, max: d + 2, also: [c, d - rest] }),
    X((l) => [`${d} × ${c} = ${d * c}. Lo que falta hasta ${D} es el resto. Siempre es menor que ${d}.`, `${d} × ${c} = ${d * c}. El que falta fins a ${D} és el residu. Sempre és menor que ${d}.`, `${d} × ${c} = ${d * c}. What is left up to ${D} is the remainder. It is always less than ${d}.`][l]), { mc: false });
};
/** Mental adding/subtracting 10, 100 or 1000. */
export const mentalPowers = (steps: number[], max: number): Gen => (r) => {
  const st = pick(r, steps), add = r() < 0.5, a = add ? int(r, 1, max - st) : int(r, st, max), ans = add ? a + st : a - st;
  return q(X((l) => `${N(l, a)} ${add ? '+' : '−'} ${N(l, st)} = ?`), ans, near(r, ans, { also: [a + (add ? 1 : -1) * st / 10, add ? a - st : a + st].filter((x) => Number.isInteger(x) && x >= 0) }),
    X((l) => [`Al sumar o restar ${N(l, st)}, solo cambia la cifra de las ${st === 10 ? 'decenas' : st === 100 ? 'centenas' : 'unidades de millar'} (salvo si pasa de 9).`, `En sumar o restar ${N(l, st)}, només canvia la xifra de les ${st === 10 ? 'desenes' : st === 100 ? 'centenes' : 'unitats de miler'} (llevat que passe de 9).`, `Adding or subtracting ${N(l, st)} changes only the ${st === 10 ? 'tens' : st === 100 ? 'hundreds' : 'thousands'} digit (unless it goes past 9).`][l]));
};
/** Doubles and halves. */
export const doublesHalves = (max: number): Gen => (r) => {
  const n = int(r, 2, max), dbl = r() < 0.5;
  if (dbl) return q(X((l) => [`¿Cuál es el doble de ${N(l, n)}?`, `Quin és el doble de ${N(l, n)}?`, `What is double ${N(l, n)}?`][l]), 2 * n, near(r, 2 * n, { also: [n + 2, n * 3, n / 2].filter((x) => Number.isInteger(x)), min: 1 }), T('El doble es sumar el número consigo mismo.', 'El doble és sumar el nombre amb ell mateix.', 'Double means adding the number to itself.'));
  const m = 2 * n; return q(X((l) => [`¿Cuál es la mitad de ${N(l, m)}?`, `Quina és la meitat de ${N(l, m)}?`, `What is half of ${N(l, m)}?`][l]), n, near(r, n, { also: [m * 2, m - 2, n + 1], min: 1 }), T('La mitad es repartir en dos partes iguales.', 'La meitat és repartir en dues parts iguals.', 'Half means sharing into two equal parts.'), { aid: m <= 20 ? { type: 'emoji', rows: [ '🟣'.repeat(n), '🟣'.repeat(n)] } : undefined });
};
/** Multiplication as equal groups (pictures). */
export const equalGroups = (maxGroups: number, maxEach: number): Gen => (r) => {
  const g = int(r, 2, maxGroups), e = int(r, 2, maxEach), t = pick(r, THINGS), p = g * e;
  if (r() < 0.5) return q(X((l) => [`Hay ${g} grupos de ${thing(l, t, e)}. ¿Cuántas hay en total?`, `Hi ha ${g} grups de ${thing(l, t, e)}. Quantes n’hi ha en total?`, `There are ${g} groups of ${thing(l, t, e)}. How many altogether?`][l]), p,
    near(r, p, { also: [g + e, p + e, p - e].filter((x) => x > 0) }), X((l) => [`Suma ${e} tantas veces como grupos hay: ${Array(g).fill(e).join(' + ')}. Es ${g} × ${e}.`, `Suma ${e} tantes vegades com grups hi ha: ${Array(g).fill(e).join(' + ')}. És ${g} × ${e}.`, `Add ${e} once for each group: ${Array(g).fill(e).join(' + ')}. That is ${g} × ${e}.`][l]), { visual: { type: 'emoji', rows: Array(g).fill(t.e.repeat(e)) } });
  return mc(X((l) => `${Array(g).fill(N(l, e)).join(' + ')} = ?`), X(() => `${g} × ${e}`), [X(() => `${e} + ${g}`), X(() => `${g + e} × ${g}`), X(() => `${g} × ${g}`)].filter((x) => x[0] !== `${g} × ${e}`),
    T('Cuenta cuántas veces se repite el mismo número: esas son las veces que multiplicas.', 'Compta quantes vegades es repetix el mateix nombre: eixes són les vegades que multipliques.', 'Count how many times the same number repeats: that is how many times you multiply.'));
};
/** Sharing equally (division as sharing). */
export const share = (maxEach: number, people: number[]): Gen => (r) => {
  const p = pick(r, people), e = int(r, 1, maxEach), t = pick(r, THINGS), n = p * e, who = pick(r, NAMES);
  return q(X((l) => [`${who} reparte ${thing(l, t, n)} entre ${p} amigos a partes iguales. ¿Cuántas le tocan a cada uno?`, `${who} reparteix ${thing(l, t, n)} entre ${p} amics a parts iguals. Quantes li’n toquen a cadascun?`, `${who} shares ${thing(l, t, n)} equally between ${p} friends. How many does each get?`][l]), e,
    near(r, e, { min: 1, also: [n - p, p, e + 1] }), X((l) => [`Da una a cada uno por turnos hasta que se acaben, o piensa: ¿qué número por ${p} da ${n}?`, `Dona’n una a cadascun per torns fins que s’acaben, o pensa: quin nombre per ${p} dona ${n}?`, `Give one to each in turn until they run out, or think: what number times ${p} makes ${n}?`][l]), { visual: { type: 'emoji', rows: rowsOf(t.e, n, Math.max(p, 5)) } });
};
/** Missing number in an equality (a + ? = c, a − ? = c, ? × b = c…). */
export const gapEquation = (max: number, ops: ('+' | '−' | '×' | '÷')[]): Gen => (r) => {
  const op = pick(r, ops);
  if (op === '+') { const c = int(r, 5, max), a = int(r, 1, c - 1); return q(X((l) => `${N(l, a)} + ? = ${N(l, c)}`), c - a, near(r, c - a, { also: [c + a, c] }), T('¿Cuánto le falta al primer número para llegar al resultado? Resta.', 'Quant li falta al primer nombre per a arribar al resultat? Resta.', 'How much does the first number need to reach the result? Subtract.'), { aid: { type: 'balance', left: `${a} + ?`, right: String(c) } }); }
  if (op === '−') { const a = int(r, 5, max), c = int(r, 0, a - 1); return q(X((l) => `${N(l, a)} − ? = ${N(l, c)}`), a - c, near(r, a - c, { also: [a + c, c] }), T('¿Cuánto hay que quitar para bajar hasta el resultado? Resta los dos números.', 'Quant cal llevar per a baixar fins al resultat? Resta els dos nombres.', 'How much must you take away to get down to the result? Subtract the two numbers.'), { aid: { type: 'balance', left: `${a} − ?`, right: String(c) } }); }
  if (op === '×') { const b = int(r, 2, 10), x = int(r, 2, 10); return q(X((l) => `? × ${N(l, b)} = ${N(l, b * x)}`), x, near(r, x, { min: 1, also: [b * x - b, b] }), T('Es una división: ¿qué número por ese da el resultado?', 'És una divisió: quin nombre per eixe dona el resultat?', 'It is a division: what number times that one gives the result?'), { aid: { type: 'balance', left: `? × ${b}`, right: String(b * x) } }); }
  const b = int(r, 2, 10), x = int(r, 2, 10); return q(X((l) => `? ÷ ${N(l, b)} = ${N(l, x)}`), b * x, near(r, b * x, { also: [b + x, x] }), T('Hazlo al revés: multiplica.', 'Fes-ho a l’inrevés: multiplica.', 'Do it the other way round: multiply.'), { aid: { type: 'balance', left: `? ÷ ${b}`, right: String(x) } });
};
/** Number sequences: find the next term (step can be + or −, or ×2). */
export const sequence = (maxStart: number, steps: number[], mult = false): Gen => (r) => {
  const useMul = mult && r() < 0.3;
  if (useMul) { const s = int(r, 1, 5), f = pick(r, [2, 3]); const seq = [s, s * f, s * f * f, s * f ** 3]; const a = s * f ** 4; return q(X((l) => `${seq.map((x) => N(l, x)).join(', ')}, ?`), a, near(r, a, { also: [seq[3] + (seq[3] - seq[2]), seq[3] * 2 === a ? seq[3] * 3 : seq[3] * 2] }), T('Mira por cuánto se multiplica cada número para dar el siguiente.', 'Mira per quant es multiplica cada nombre per a donar el següent.', 'See what each number is multiplied by to give the next.')); }
  const st = pick(r, steps), down = r() < 0.35, s = down ? int(r, st * 5, maxStart + st * 5) : int(r, 0, maxStart);
  const seq = [0, 1, 2, 3].map((i) => s + (down ? -1 : 1) * i * st), a = s + (down ? -1 : 1) * 4 * st;
  return q(X((l) => `${seq.map((x) => N(l, x)).join(', ')}, ?`), a, near(r, a, { also: [a + st, a - st, seq[3] + 1].filter((x) => x >= 0), min: 0 }),
    T('Calcula cuánto cambia de un número al siguiente y aplica ese mismo cambio.', 'Calcula quant canvia d’un nombre al següent i aplica el mateix canvi.', 'Work out how much it changes from one number to the next and apply the same change.'));
};
/** Two-step word problems (add/subtract, or with multiplication). */
export const twoStep = (max: number, withMul = false): Gen => (r) => {
  const who = pick(r, NAMES), t = pick(r, THINGS);
  if (withMul && r() < 0.5) {
    const g = int(r, 2, 6), e = int(r, 2, 10), x = int(r, 1, g * e - 1), ans = g * e - x;
    return q(X((l) => [`${who} compra ${g} paquetes de ${thing(l, t, e)} y regala ${N(l, x)}. ¿Cuántas le quedan?`, `${who} compra ${g} paquets de ${thing(l, t, e)} i en regala ${N(l, x)}. Quantes li’n queden?`, `${who} buys ${g} packs of ${thing(l, t, e)} and gives away ${N(l, x)}. How many are left?`][l]), ans,
      near(r, ans, { also: [g * e + x, g + e - x, g * e].filter((v) => v >= 0) }), X((l) => [`Primero: ${g} × ${e} = ${g * e}. Después resta lo que regala.`, `Primer: ${g} × ${e} = ${g * e}. Després resta el que regala.`, `First: ${g} × ${e} = ${g * e}. Then subtract what is given away.`][l]));
  }
  const a = int(r, 10, max), b = int(r, 2, Math.floor(max / 3)), c = int(r, 1, a + b - 1), ans = a + b - c;
  return q(X((l) => [`${who} tiene ${thing(l, t, a)}. Le dan ${N(l, b)} y después pierde ${N(l, c)}. ¿Cuántas tiene ahora?`, `${who} té ${thing(l, t, a)}. Li’n donen ${N(l, b)} i després en perd ${N(l, c)}. Quantes en té ara?`, `${who} has ${thing(l, t, a)}. ${who} is given ${N(l, b)} and then loses ${N(l, c)}. How many now?`][l]), ans,
    near(r, ans, { also: [a + b + c, a - b + c, a + b].filter((v) => v >= 0 && v !== ans) }), X((l) => [`Paso 1: ${a} + ${b} = ${a + b}. Paso 2: quita ${c}.`, `Pas 1: ${a} + ${b} = ${a + b}. Pas 2: lleva ${c}.`, `Step 1: ${a} + ${b} = ${a + b}. Step 2: take away ${c}.`][l]),
    { visual: { type: 'bars', rows: [{ parts: [{ v: a, label: String(a) }, { v: b, label: `+${b}`, shade: true }] }, { parts: [{ v: ans, label: '?' }, { v: c, label: `−${c}`, shade: true }] }] } });
};

/* ───────────── Fractions and decimals ───────────── */
export const fracName = (n: number, d: number) => `${n}/${d}`;
/** Which fraction is shaded / fraction of an amount / compare (same denominator or numerator). */
export const fractions = (kinds: ('read' | 'of' | 'compare' | 'equiv' | 'addsame' | 'parts')[], maxD = 10): Gen => (r) => {
  const k = pick(r, kinds); const d = int(r, 2, maxD), n = int(r, 1, d - 1);
  if (k === 'read') return q(T('¿Qué fracción está coloreada?', 'Quina fracció està acolorida?', 'Which fraction is shaded?'), `${n}/${d}`, [`${d - n}/${d}`, `${d}/${n}`, `${n}/${d + 1}`, `${n + 1}/${d}`].filter((x) => x !== `${n}/${d}`),
    T('El de abajo (denominador) dice en cuántas partes iguales se divide; el de arriba (numerador), cuántas se colorean.', 'El de baix (denominador) diu en quantes parts iguals es dividix; el de dalt (numerador), quantes s’acoloreixen.', 'The bottom number (denominator) says how many equal parts; the top number (numerator) says how many are shaded.'), { visual: { type: 'frac', n, d, shape: r() < 0.5 ? 'circle' : 'bar' }, mc: true });
  if (k === 'parts') return q(X((l) => [`En la fracción ${n}/${d}, ¿en cuántas partes iguales se divide la unidad?`, `En la fracció ${n}/${d}, en quantes parts iguals es dividix la unitat?`, `In the fraction ${n}/${d}, into how many equal parts is the whole divided?`][l]), d, near(r, d, { also: [n, d + n], min: 1 }), T('Lo dice el número de abajo, el denominador.', 'Ho diu el nombre de baix, el denominador.', 'The bottom number, the denominator, tells you.'));
  if (k === 'of') { const dd = pick(r, [2, 3, 4, 5, 10].filter((x) => x <= maxD)), nn = int(r, 1, dd - 1), each = int(r, 2, 10), tot = dd * each, ans = nn * each;
    return q(X((l) => [`¿Cuánto es ${nn}/${dd} de ${N(l, tot)}?`, `Quant és ${nn}/${dd} de ${N(l, tot)}?`, `What is ${nn}/${dd} of ${N(l, tot)}?`][l]), ans, near(r, ans, { also: [each, tot - ans, tot / nn].filter((x) => Number.isInteger(x) && x > 0) }),
      X((l) => [`Divide ${tot} entre ${dd} (sale ${each}) y multiplica por ${nn}.`, `Dividix ${tot} entre ${dd} (ix ${each}) i multiplica per ${nn}.`, `Divide ${tot} by ${dd} (that is ${each}) and multiply by ${nn}.`][l]), { aid: { type: 'frac', n: nn, d: dd, shape: 'bar' } }); }
  if (k === 'compare') { const sameD = r() < 0.5; const a1 = sameD ? n : 1, b1 = sameD ? d : int(r, 2, maxD); let a2 = sameD ? int(r, 1, d - 1) : 1, b2 = sameD ? d : int(r, 2, maxD); if (sameD && a2 === a1) a2 = a1 === 1 ? 2 : a1 - 1; if (!sameD && b2 === b1) b2 = b1 + 1;
    const big = a1 / b1 > a2 / b2 ? `${a1}/${b1}` : `${a2}/${b2}`, small = big === `${a1}/${b1}` ? `${a2}/${b2}` : `${a1}/${b1}`;
    return q(T('¿Qué fracción es mayor?', 'Quina fracció és major?', 'Which fraction is bigger?'), big, [small], sameD ? T('Con el mismo denominador, es mayor la que tiene el numerador mayor.', 'Amb el mateix denominador, és major la que té el numerador major.', 'With the same denominator, the one with the bigger numerator is bigger.') : T('Con numerador 1, cuantas más partes, más pequeña es cada una.', 'Amb numerador 1, com més parts, més xicoteta és cadascuna.', 'With a numerator of 1, the more parts, the smaller each one is.'), { mc: true }); }
  if (k === 'equiv') { const f = int(r, 2, 5), a = `${n * f}/${d * f}`; return q(X((l) => [`¿Qué fracción es equivalente a ${n}/${d}?`, `Quina fracció és equivalent a ${n}/${d}?`, `Which fraction is equivalent to ${n}/${d}?`][l]), a, [`${n + f}/${d + f}`, `${n * f}/${d}`, `${n}/${d * f}`].filter((x) => x !== a),
    X((l) => [`Multiplica arriba y abajo por el mismo número: ×${f}.`, `Multiplica dalt i baix pel mateix nombre: ×${f}.`, `Multiply top and bottom by the same number: ×${f}.`][l]), { mc: true }); }
  // addsame: a/d + b/d
  const a = int(r, 1, d - 1), b = int(r, 1, Math.max(1, d - a)); const s = `${a + b}/${d}`;
  return q(X(() => `${a}/${d} + ${b}/${d} = ?`), s, [`${a + b}/${d + d}`, `${a * b}/${d}`, `${Math.abs(a - b)}/${d}`].filter((x) => x !== s && !x.startsWith('0/')).concat([`${a + b + 1}/${d}`]),
    T('Con el mismo denominador, se suman los numeradores y el denominador se queda igual.', 'Amb el mateix denominador, se sumen els numeradors i el denominador es queda igual.', 'With the same denominator, add the numerators and keep the denominator.'));
};
/** Decimals: read the place, compare, add/subtract, × and ÷ by 10, 100, 1000, round. */
export const decimals = (kinds: ('place' | 'compare' | 'add' | 'sub' | 'mul10' | 'round' | 'mul' | 'div')[], places = 2): Gen => (r) => {
  const k = pick(r, kinds); const f = 10 ** places;
  const rnd = (lo: number, hi: number) => round(int(r, Math.round(lo * f), Math.round(hi * f)) / f, places);
  if (k === 'place') { const v = rnd(1, 99); const s = v.toFixed(places); const tenths = Number(s.split('.')[1][0]); return q(X((l) => [`En el número ${N(l, v)}, ¿qué cifra está en las décimas?`, `En el nombre ${N(l, v)}, quina xifra està en les dècimes?`, `In ${N(l, v)}, which digit is in the tenths place?`][l]), tenths, near(r, tenths, { min: 0, max: 9, also: s.replace('.', '').split('').map(Number) }), T('Las décimas son la primera cifra después de la coma.', 'Les dècimes són la primera xifra després de la coma.', 'Tenths are the first digit after the decimal point.'), { mc: true }); }
  if (k === 'compare') { const a = rnd(0, 9); let b = round(Math.floor(a) + Number(('' + a.toFixed(places)).split('.')[1].split('').reverse().join('')) / f, places); if (b === a) b = round(a + 1 / f * int(r, 1, 9), places); return compareQ(r, [a, b], r() < 0.5, T('Compara primero la parte entera; si es igual, las décimas; luego las centésimas.', 'Compara primer la part entera; si és igual, les dècimes; després les centèsimes.', 'Compare the whole part first; if equal, the tenths; then the hundredths.'), { visual: undefined, q: T('¿Cuál es mayor?', 'Quin és major?', 'Which is bigger?') }); }
  if (k === 'add' || k === 'sub') { const a = rnd(1, 50), b = rnd(0.1, k === 'sub' ? a : 50), ans = round(k === 'add' ? a + b : a - b, places);
    return q(X((l) => `${N(l, a)} ${k === 'add' ? '+' : '−'} ${N(l, b)} = ?`), ans, near(r, ans, { step: 1 / f, spread: 9, also: [round(ans + 1, places), round(ans - 0.1, places)], min: 0 }), T('Coloca las comas una debajo de otra y opera como siempre.', 'Col·loca les comes una davall de l’altra i opera com sempre.', 'Line up the decimal points and work as usual.')); }
  if (k === 'mul10') { const v = rnd(0.1, 99), m = pick(r, [10, 100, 1000]), mul = r() < 0.5, ans = round(mul ? v * m : v / m, 6);
    return q(X((l) => `${N(l, v)} ${mul ? '×' : '÷'} ${N(l, m)} = ?`), ans, near(r, ans, { also: [round(mul ? v / m : v * m, 6), round(mul ? v * m * 10 : v / m / 10, 6), round(mul ? v * m / 10 : v / m * 10, 6)], step: ans / 10 || 1 }),
      X((l) => [`${mul ? 'Multiplicar' : 'Dividir'} por ${N(l, m)} mueve la coma ${String(m).length - 1} lugares a la ${mul ? 'derecha' : 'izquierda'}.`, `${mul ? 'Multiplicar' : 'Dividir'} per ${N(l, m)} mou la coma ${String(m).length - 1} llocs a la ${mul ? 'dreta' : 'esquerra'}.`, `${mul ? 'Multiplying' : 'Dividing'} by ${N(l, m)} moves the decimal point ${String(m).length - 1} places to the ${mul ? 'right' : 'left'}.`][l])); }
  if (k === 'round') { const v = rnd(1, 99); const to = pick(r, [0, 1].filter((x) => x < places)); const ans = round(v, to);
    return q(X((l) => to === 0 ? [`Redondea ${N(l, v)} a las unidades.`, `Arredonix ${N(l, v)} a les unitats.`, `Round ${N(l, v)} to the nearest whole number.`][l] : [`Redondea ${N(l, v)} a las décimas.`, `Arredonix ${N(l, v)} a les dècimes.`, `Round ${N(l, v)} to the nearest tenth.`][l]), ans,
      near(r, ans, { step: 10 ** -to, also: [Math.floor(v * 10 ** to) / 10 ** to, Math.ceil(v * 10 ** to) / 10 ** to].map((x) => round(x, to)) }), T('Mira la cifra siguiente: si es 5 o más, sube; si es menos de 5, se queda.', 'Mira la xifra següent: si és 5 o més, puja; si és menys de 5, es queda.', 'Look at the next digit: 5 or more rounds up; less than 5 stays.')); }
  if (k === 'mul') { const a = rnd(0.1, 20), b = int(r, 2, 9), ans = round(a * b, places); return q(X((l) => `${N(l, a)} × ${N(l, b)} = ?`), ans, near(r, ans, { step: 1 / f, spread: 9, also: [round(ans * 10, places), round(ans / 10, places + 1)] }), T('Multiplica sin la coma y después pon tantos decimales como tenía el número.', 'Multiplica sense la coma i després posa tants decimals com tenia el nombre.', 'Multiply without the decimal point, then give the answer as many decimal places as the number had.')); }
  const b = int(r, 2, 9), c = rnd(0.1, 20), a = round(b * c, places + 1);
  return q(X((l) => `${N(l, a)} ÷ ${N(l, b)} = ?`), c, near(r, c, { step: 1 / f, spread: 9, also: [round(c * 10, places), round(c / 10, places + 1)] }), T('Divide como siempre y pon la coma en el cociente cuando la bajes del dividendo.', 'Dividix com sempre i posa la coma en el quocient quan la baixes del dividend.', 'Divide as usual and put the decimal point in the answer when you reach it in the number.'));
};

/* ───────────── Measurement ───────────── */
type Unit = { s: string; f: number };
export const LEN: Unit[] = [{ s: 'km', f: 1000 }, { s: 'hm', f: 100 }, { s: 'dam', f: 10 }, { s: 'm', f: 1 }, { s: 'dm', f: 0.1 }, { s: 'cm', f: 0.01 }, { s: 'mm', f: 0.001 }];
export const MASS: Unit[] = [{ s: 'kg', f: 1000 }, { s: 'hg', f: 100 }, { s: 'dag', f: 10 }, { s: 'g', f: 1 }, { s: 'dg', f: 0.1 }, { s: 'cg', f: 0.01 }, { s: 'mg', f: 0.001 }];
export const CAP: Unit[] = [{ s: 'kL', f: 1000 }, { s: 'hL', f: 100 }, { s: 'daL', f: 10 }, { s: 'L', f: 1 }, { s: 'dL', f: 0.1 }, { s: 'cL', f: 0.01 }, { s: 'mL', f: 0.001 }];
/** Convert between units of the same scale; only the pairs listed. */
export const convert = (units: Unit[], pairs: [string, string][], ints = true): Gen => (r) => {
  const [a, b] = pick(r, pairs), ua = units.find((u) => u.s === a)!, ub = units.find((u) => u.s === b)!, factor = ua.f / ub.f;
  const v = factor >= 1 ? int(r, 1, 30) * (ints ? 1 : 1) : int(r, 1, 30) / factor * (ints ? 1 : 1);
  const vv = ints ? v : round(v / int(r, 1, 4), 2); const ans = round(vv * factor, 6);
  const i = units.indexOf(ua), j = units.indexOf(ub), steps = Math.abs(j - i);
  return q(X((l) => `${N(l, vv)} ${a} = ? ${b}`), ans, near(r, ans, { also: [round(ans * 10, 6), round(ans / 10, 6), round(vv / factor, 6)].filter((x) => x !== ans), step: ans || 1 }),
    X((l) => [`De ${a} a ${b} hay ${steps} ${steps === 1 ? 'escalón' : 'escalones'}: ${factor > 1 ? 'multiplica' : 'divide'} por ${N(l, Math.max(factor, 1 / factor))}.`, `De ${a} a ${b} hi ha ${steps} ${steps === 1 ? 'graó' : 'graons'}: ${factor > 1 ? 'multiplica' : 'dividix'} per ${N(l, Math.max(factor, 1 / factor))}.`, `From ${a} to ${b} is ${steps} ${steps === 1 ? 'step' : 'steps'}: ${factor > 1 ? 'multiply' : 'divide'} by ${N(l, Math.max(factor, 1 / factor))}.`][l]),
    { aid: { type: 'ladder', units: units.map((u) => u.s), from: i, to: j } });
};
/** Reading clocks: minute steps of 60 (o'clock), 30, 15, 5 or 1. */
export const clockRead = (step: number): Gen => (r) => {
  const h = int(r, 1, 12), m = step >= 60 ? 0 : int(r, 0, 60 / step - 1) * step;
  const words = (l: Li, hh: number, mm: number) => mm === 0 ? [`las ${hh} en punto`, `les ${hh} en punt`, `${hh} o’clock`][l]
    : mm === 30 ? [`las ${hh} y media`, `les ${hh} i mitja`, `half past ${hh}`][l]
      : mm === 15 ? [`las ${hh} y cuarto`, `les ${hh} i quart`, `quarter past ${hh}`][l]
        : mm === 45 ? [`las ${hh % 12 + 1} menos cuarto`, `les ${hh % 12 + 1} menys quart`, `quarter to ${hh % 12 + 1}`][l]
          : `${hh}:${String(mm).padStart(2, '0')}`;
  const right = X((l) => words(l, h, m));
  const wrongs = [X((l) => words(l, (h % 12) + 1, m)), X((l) => words(l, h, (m + 30) % 60)), X((l) => words(l, h === 1 ? 12 : h - 1, m)), X((l) => words(l, m === 0 ? 12 : Math.min(12, Math.round(m / 5)) || 12, (h * 5) % 60))]
    .filter((w) => w[0] !== right[0]);
  return mc(T('¿Qué hora marca el reloj?', 'Quina hora marca el rellotge?', 'What time does the clock show?'), right, wrongs,
    T('La aguja corta marca la hora; la larga, los minutos (cada número son 5 minutos).', 'L’agulla curta marca l’hora; la llarga, els minuts (cada nombre són 5 minuts).', 'The short hand shows the hour; the long hand the minutes (each number is 5 minutes).'), { visual: { type: 'clock', h, m } });
};
/** Durations: start time + minutes, or time between two times. */
export const durations = (maxMin: number): Gen => (r) => {
  const h = int(r, 8, 18), m = int(r, 0, 11) * 5, d = int(r, 1, Math.floor(maxMin / 5)) * 5, end = h * 60 + m + d;
  const fmt = (t: number) => `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
  if (r() < 0.5) return mc(X((l) => [`Una actividad empieza a las ${fmt(h * 60 + m)} y dura ${d} minutos. ¿A qué hora acaba?`, `Una activitat comença a les ${fmt(h * 60 + m)} i dura ${d} minuts. A quina hora acaba?`, `An activity starts at ${fmt(h * 60 + m)} and lasts ${d} minutes. What time does it end?`][l]), S(fmt(end)), [S(fmt(end + 10)), S(fmt(end - 5)), S(fmt(h * 60 + m + d * 2 > 23 * 60 ? end + 60 : h * 60 + m + 100 > end ? end + 60 : end - 60))].filter((x) => x[0] !== fmt(end)),
    T('Suma primero los minutos hasta la hora en punto y después el resto.', 'Suma primer els minuts fins a l’hora en punt i després la resta.', 'Add the minutes up to the next o’clock first, then the rest.'));
  return q(X((l) => [`Una película empieza a las ${fmt(h * 60 + m)} y acaba a las ${fmt(end)}. ¿Cuántos minutos dura?`, `Una pel·lícula comença a les ${fmt(h * 60 + m)} i acaba a les ${fmt(end)}. Quants minuts dura?`, `A film starts at ${fmt(h * 60 + m)} and ends at ${fmt(end)}. How many minutes does it last?`][l]), d,
    near(r, d, { step: 5, also: [d + 40, d - 40, d + 60].filter((x) => x > 0), min: 5 }), T('Cuenta los minutos hasta la siguiente hora en punto y súmale los que faltan.', 'Compta els minuts fins a la següent hora en punt i suma-li els que falten.', 'Count the minutes to the next o’clock, then add the rest.'));
};
/** Money: pay and get change; total of a few prices (euros with cents when `cents`). */
export const money = (max: number, cents: boolean): Gen => (r) => {
  const ITEMS: T3[] = [T('un cuaderno', 'un quadern', 'a notebook'), T('un bocadillo', 'un entrepà', 'a sandwich'), T('un zumo', 'un suc', 'a juice'), T('una goma', 'una goma', 'a rubber'), T('un cómic', 'un còmic', 'a comic'), T('una entrada', 'una entrada', 'a ticket')];
  const price = () => cents ? round(int(r, 50, max * 100) / 100 / 0.05) * 0.05 : int(r, 1, max);
  const p1 = round(price(), 2), p2 = round(price(), 2); const [i1, i2] = pickN(r, ITEMS, 2);
  if (r() < 0.5) { const tot = round(p1 + p2, 2); return q(X((l) => [`Compras ${i1[0]} por ${N(l, p1)} € y ${i2[0]} por ${N(l, p2)} €. ¿Cuánto pagas en total?`, `Compres ${i1[1]} per ${N(l, p1)} € i ${i2[1]} per ${N(l, p2)} €. Quant pagues en total?`, `You buy ${i1[2]} for €${N(l, p1)} and ${i2[2]} for €${N(l, p2)}. How much do you pay altogether?`][l]), tot,
    near(r, tot, { step: cents ? 0.1 : 1, also: [round(tot + 1, 2), round(Math.abs(p1 - p2), 2)] }), T('Suma los euros con los euros y los céntimos con los céntimos.', 'Suma els euros amb els euros i els cèntims amb els cèntims.', 'Add euros to euros and cents to cents.')); }
  const bill = [5, 10, 20, 50].find((b) => b > p1) ?? 50; const ch = round(bill - p1, 2);
  return q(X((l) => [`${cap(i1[0])} cuesta ${N(l, p1)} €. Pagas con ${bill} €. ¿Cuánto te devuelven?`, `${cap(i1[1])} costa ${N(l, p1)} €. Pagues amb ${bill} €. Quant et tornen?`, `${cap(i1[2])} costs €${N(l, p1)}. You pay with €${bill}. How much change do you get?`][l]), ch,
    near(r, ch, { step: cents ? 0.1 : 1, also: [round(ch + 1, 2), round(bill + p1, 2)], min: 0 }), T('Cuenta desde el precio hasta lo que has pagado (como hacen en las tiendas).', 'Compta des del preu fins al que has pagat (com fan a les botigues).', 'Count up from the price to what you paid (like shopkeepers do).'));
};
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/* ───────────── Geometry ───────────── */
const POLY: Record<number, T3> = { 3: T('triángulo', 'triangle', 'triangle'), 4: T('cuadrilátero', 'quadrilàter', 'quadrilateral'), 5: T('pentágono', 'pentàgon', 'pentagon'), 6: T('hexágono', 'hexàgon', 'hexagon'), 7: T('heptágono', 'heptàgon', 'heptagon'), 8: T('octógono', 'octògon', 'octagon') };
export const polygons = (maxSides = 8): Gen => (r) => {
  const n = int(r, 3, maxSides);
  if (r() < 0.5) return q(T('¿Cuántos vértices tiene este polígono?', 'Quants vèrtexs té este polígon?', 'How many vertices does this polygon have?'), n, near(r, n, { min: 3, max: 10 }), T('Un polígono tiene tantos vértices (esquinas) como lados.', 'Un polígon té tants vèrtexs (cantons) com costats.', 'A polygon has as many vertices (corners) as sides.'), { visual: { type: 'shape', sides: n } });
  return mc(T('¿Cómo se llama este polígono?', 'Com es diu este polígon?', 'What is this polygon called?'), POLY[n], Object.entries(POLY).filter(([k]) => Number(k) !== n && Number(k) <= maxSides).map(([, v]) => v),
    T('Cuenta los lados: 3 triángulo, 4 cuadrilátero, 5 pentágono, 6 hexágono, 7 heptágono, 8 octógono.', 'Compta els costats: 3 triangle, 4 quadrilàter, 5 pentàgon, 6 hexàgon, 7 heptàgon, 8 octògon.', 'Count the sides: 3 triangle, 4 quadrilateral, 5 pentagon, 6 hexagon, 7 heptagon, 8 octagon.'), { visual: { type: 'shape', sides: n } });
};
/** Perimeter of polygons (regular, rectangles, or with all sides given). */
export const perimeter = (maxSide: number, unit = 'cm'): Gen => (r) => {
  const k = int(r, 0, 2);
  if (k === 0) { const w = int(r, 2, maxSide), h = int(r, 1, maxSide); const p = 2 * (w + h); return q(X((l) => [`Un rectángulo mide ${N(l, w)} ${unit} de largo y ${N(l, h)} ${unit} de ancho. ¿Cuál es su perímetro en ${unit}?`, `Un rectangle mesura ${N(l, w)} ${unit} de llarg i ${N(l, h)} ${unit} d’ample. Quin és el seu perímetre en ${unit}?`, `A rectangle is ${N(l, w)} ${unit} long and ${N(l, h)} ${unit} wide. What is its perimeter in ${unit}?`][l]), p,
    near(r, p, { also: [w + h, w * h, p + 2] }), T('El perímetro es la suma de todos los lados: el rectángulo tiene dos largos y dos anchos.', 'El perímetre és la suma de tots els costats: el rectangle té dos llargs i dos amples.', 'The perimeter is all the sides added up: a rectangle has two lengths and two widths.'), { visual: { type: 'shape', pts: [[0, 0], [w, 0], [w, h], [0, h]], labels: [`${w}`, `${h}`, '', ''] } }); }
  if (k === 1) { const n = int(r, 3, 8), s = int(r, 2, maxSide), p = n * s; return q(X((l) => [`Un ${POLY[n][0]} regular tiene lados de ${N(l, s)} ${unit}. ¿Cuál es su perímetro?`, `Un ${POLY[n][1]} regular té costats de ${N(l, s)} ${unit}. Quin és el seu perímetre?`, `A regular ${POLY[n][2]} has sides of ${N(l, s)} ${unit}. What is its perimeter?`][l]), p,
    near(r, p, { also: [n + s, p - s, p + s] }), X((l) => [`Todos los lados son iguales: ${n} × ${s}.`, `Tots els costats són iguals: ${n} × ${s}.`, `All the sides are equal: ${n} × ${s}.`][l]), { visual: { type: 'shape', sides: n, labels: [String(s)] } }); }
  const a = int(r, 2, maxSide), b = int(r, 2, maxSide), c = int(r, Math.abs(a - b) + 1, a + b - 1), p = a + b + c;
  return q(X((l) => [`Un triángulo tiene lados de ${N(l, a)}, ${N(l, b)} y ${N(l, c)} ${unit}. ¿Cuál es su perímetro?`, `Un triangle té costats de ${N(l, a)}, ${N(l, b)} i ${N(l, c)} ${unit}. Quin és el seu perímetre?`, `A triangle has sides of ${N(l, a)}, ${N(l, b)} and ${N(l, c)} ${unit}. What is its perimeter?`][l]), p,
    near(r, p, { also: [a + b, a * b, p + 1] }), T('Suma los tres lados.', 'Suma els tres costats.', 'Add the three sides.'));
};
/** Area of rectangles/squares/triangles; counting squares when `count`. */
export const area = (maxSide: number, kinds: ('count' | 'rect' | 'tri' | 'square')[], unit = 'cm'): Gen => (r) => {
  const k = pick(r, kinds), w = int(r, 2, maxSide), h = int(r, 2, maxSide);
  if (k === 'count') return q(T('¿Cuántos cuadraditos ocupa la figura? Esa es su área.', 'Quants quadradets ocupa la figura? Eixa és la seua àrea.', 'How many little squares does the shape cover? That is its area.'), w * h, near(r, w * h, { also: [2 * (w + h), w + h] }),
    X((l) => [`Cuenta una fila (${w}) y multiplica por el número de filas (${h}).`, `Compta una fila (${w}) i multiplica pel nombre de files (${h}).`, `Count one row (${w}) and multiply by the number of rows (${h}).`][l]), { visual: { type: 'emoji', rows: Array(h).fill('🟪'.repeat(w)) } });
  if (k === 'square') return q(X((l) => [`¿Cuál es el área de un cuadrado de ${N(l, w)} ${unit} de lado?`, `Quina és l’àrea d’un quadrat de ${N(l, w)} ${unit} de costat?`, `What is the area of a square with sides of ${N(l, w)} ${unit}?`][l]), w * w, near(r, w * w, { also: [4 * w, 2 * w] }), T('Área del cuadrado: lado × lado.', 'Àrea del quadrat: costat × costat.', 'Area of a square: side × side.'), { visual: { type: 'shape', pts: [[0, 0], [w, 0], [w, w], [0, w]], labels: [String(w), String(w), '', ''] } });
  if (k === 'tri') { const b = w % 2 ? w + 1 : w; return q(X((l) => [`Un triángulo tiene ${N(l, b)} ${unit} de base y ${N(l, h)} ${unit} de altura. ¿Cuál es su área?`, `Un triangle té ${N(l, b)} ${unit} de base i ${N(l, h)} ${unit} d’altura. Quina és la seua àrea?`, `A triangle has a base of ${N(l, b)} ${unit} and a height of ${N(l, h)} ${unit}. What is its area?`][l]), (b * h) / 2, near(r, (b * h) / 2, { also: [b * h, b + h] }), T('Área del triángulo: base × altura ÷ 2 (es la mitad de un rectángulo).', 'Àrea del triangle: base × altura ÷ 2 (és la meitat d’un rectangle).', 'Area of a triangle: base × height ÷ 2 (half a rectangle).'), { visual: { type: 'shape', pts: [[0, 0], [b, 0], [b / 2, h]], labels: [String(b), '', ''] } }); }
  return q(X((l) => [`¿Cuál es el área de un rectángulo de ${N(l, w)} ${unit} por ${N(l, h)} ${unit}?`, `Quina és l’àrea d’un rectangle de ${N(l, w)} ${unit} per ${N(l, h)} ${unit}?`, `What is the area of a ${N(l, w)} ${unit} by ${N(l, h)} ${unit} rectangle?`][l]), w * h, near(r, w * h, { also: [2 * (w + h), w + h] }), T('Área del rectángulo: largo × ancho.', 'Àrea del rectangle: llarg × ample.', 'Area of a rectangle: length × width.'), { visual: { type: 'shape', pts: [[0, 0], [w, 0], [w, h], [0, h]], labels: [String(w), String(h), '', ''] } });
};
/** Points on a grid: read coordinates, or move with instructions. */
export const gridPoints = (size: number, moves: boolean, neg = false): Gen => (r) => {
  const x = int(r, neg ? -size : 0, size), y = int(r, neg ? -size : 0, size); const L = pick(r, ['A', 'B', 'C', 'P', 'M']);
  if (!moves) { const right = `(${x}, ${y})`; return mc(X((l) => [`¿Cuáles son las coordenadas del punto ${L}?`, `Quines són les coordenades del punt ${L}?`, `What are the coordinates of point ${L}?`][l]), S(right), [`(${y}, ${x})`, `(${x + 1}, ${y})`, `(${x}, ${y - 1})`, `(${-x}, ${y})`].filter((s) => s !== right).map(S),
    T('Primero cuenta hacia la derecha (x) y después hacia arriba (y).', 'Primer compta cap a la dreta (x) i després cap amunt (y).', 'First count across (x), then up (y).'), { visual: { type: 'grid', w: size, h: size, pts: [{ x, y, label: L }], axes: true, neg } }); }
  const dx = int(r, -3, 3), dy = int(r, -3, 3); const ex = Math.min(size, Math.max(0, x + dx)), ey = Math.min(size, Math.max(0, y + dy)); const mdx = ex - x, mdy = ey - y;
  const dir = (l: Li, d: number, h: boolean) => d === 0 ? '' : h ? [`${Math.abs(d)} a la ${d > 0 ? 'derecha' : 'izquierda'}`, `${Math.abs(d)} a la ${d > 0 ? 'dreta' : 'esquerra'}`, `${Math.abs(d)} ${d > 0 ? 'right' : 'left'}`][l] : [`${Math.abs(d)} hacia ${d > 0 ? 'arriba' : 'abajo'}`, `${Math.abs(d)} cap ${d > 0 ? 'amunt' : 'avall'}`, `${Math.abs(d)} ${d > 0 ? 'up' : 'down'}`][l];
  const right = `(${ex}, ${ey})`;
  return mc(X((l) => [`Desde ${L} (${x}, ${y}) me muevo ${[dir(l, mdx, true), dir(l, mdy, false)].filter(Boolean).join(' y ') || '0'}. ¿Dónde llego?`, `Des de ${L} (${x}, ${y}) em moc ${[dir(l, mdx, true), dir(l, mdy, false)].filter(Boolean).join(' i ') || '0'}. On arribe?`, `From ${L} (${x}, ${y}) I move ${[dir(l, mdx, true), dir(l, mdy, false)].filter(Boolean).join(' and ') || '0'}. Where do I end up?`][l]),
    S(right), [`(${ey}, ${ex})`, `(${x - mdx}, ${y + mdy})`, `(${x + mdx}, ${y - mdy})`, `(${ex + 1}, ${ey})`].filter((s) => s !== right).map(S),
    T('A la derecha suma a la x; arriba suma a la y. A la izquierda y abajo, resta.', 'A la dreta suma a la x; amunt suma a la y. A l’esquerra i avall, resta.', 'Right adds to x; up adds to y. Left and down subtract.'), { visual: { type: 'grid', w: size, h: size, pts: [{ x, y, label: L }], axes: true } });
};
/** Angles: classify (acute/right/obtuse/straight) or find the missing angle. */
export const angles = (kinds: ('classify' | 'missing' | 'tri')[]): Gen => (r) => {
  const k = pick(r, kinds);
  if (k === 'classify') { const a = pick(r, [int(r, 10, 85), 90, int(r, 95, 175), 180]); const N3 = { acu: T('agudo', 'agut', 'acute'), rec: T('recto', 'recte', 'right'), obt: T('obtuso', 'obtús', 'obtuse'), lla: T('llano', 'pla', 'straight') };
    const ans = a < 90 ? N3.acu : a === 90 ? N3.rec : a < 180 ? N3.obt : N3.lla; return mc(X((l) => [`Un ángulo de ${a}°, ¿cómo es?`, `Un angle de ${a}°, com és?`, `What kind of angle is ${a}°?`][l]), ans, Object.values(N3).filter((x) => x !== ans), T('Menos de 90° agudo; 90° recto; entre 90° y 180° obtuso; 180° llano.', 'Menys de 90° agut; 90° recte; entre 90° i 180° obtús; 180° pla.', 'Less than 90° acute; 90° right; between 90° and 180° obtuse; 180° straight.')); }
  if (k === 'missing') { const a = int(r, 10, 80), whole = pick(r, [90, 180]); return q(X((l) => [`Dos ángulos juntos forman ${whole}°. Uno mide ${a}°. ¿Cuánto mide el otro?`, `Dos angles junts formen ${whole}°. Un mesura ${a}°. Quant mesura l’altre?`, `Two angles together make ${whole}°. One is ${a}°. What is the other?`][l]), whole - a, near(r, whole - a, { also: [180 - a, 90 - a, a].filter((x) => x > 0 && x !== whole - a) }), X((l) => [`Resta: ${whole} − ${a}.`, `Resta: ${whole} − ${a}.`, `Subtract: ${whole} − ${a}.`][l])); }
  const a = int(r, 20, 90), b = int(r, 20, 160 - a); return q(X((l) => [`Un triángulo tiene ángulos de ${a}° y ${b}°. ¿Cuánto mide el tercero?`, `Un triangle té angles de ${a}° i ${b}°. Quant mesura el tercer?`, `A triangle has angles of ${a}° and ${b}°. What is the third angle?`][l]), 180 - a - b, near(r, 180 - a - b, { also: [360 - a - b, 90 - a].filter((x) => x > 0) }), T('Los tres ángulos de un triángulo suman siempre 180°.', 'Els tres angles d’un triangle sumen sempre 180°.', 'The three angles of a triangle always add up to 180°.'));
};

/* ───────────── Data and chance ───────────── */
const CAT: [string, T3][] = [['🍎', T('manzana', 'poma', 'apple')], ['🍌', T('plátano', 'plàtan', 'banana')], ['🍓', T('fresa', 'maduixa', 'strawberry')], ['🍊', T('naranja', 'taronja', 'orange')], ['🍐', T('pera', 'pera', 'pear')]];
/** A bar chart of votes: read a bar, the biggest, a difference or the total. */
export const barChart = (maxV: number, n = 4): Gen => (r) => {
  const cats = pickN(r, CAT, n); const ys = cats.map(() => int(r, 1, maxV)); while (new Set(ys).size < n) ys[int(r, 0, n - 1)] = int(r, 1, maxV);
  const step = maxV > 20 ? 5 : maxV > 10 ? 2 : 1; const v: Visual = { type: 'chart', kind: 'bar', x: cats.map((c) => c[0]), y: ys, yMax: Math.ceil(maxV / step) * step, yStep: step };
  const k = int(r, 0, 3), i = int(r, 0, n - 1);
  if (k === 0) return q(X((l) => [`¿Cuántos votos tiene la ${cats[i][1][0]}?`, `Quants vots té la ${cats[i][1][1]}?`, `How many votes did ${cats[i][1][2]} get?`][l]), ys[i], near(r, ys[i], { min: 0, also: ys.filter((y) => y !== ys[i]) }), T('Sube por la barra hasta arriba y mira el número del eje.', 'Puja per la barra fins a dalt i mira el nombre de l’eix.', 'Go up to the top of the bar and read across to the axis.'), { visual: v, mc: false });
  if (k === 1) { const m = ys.indexOf(Math.max(...ys)); return mc(T('¿Qué fruta tiene más votos?', 'Quina fruita té més vots?', 'Which fruit has the most votes?'), cats[m][1], cats.filter((_, j) => j !== m).map((c) => c[1]), T('Busca la barra más alta.', 'Busca la barra més alta.', 'Find the tallest bar.'), { visual: v }); }
  if (k === 2) { const j = (i + 1) % n, d = Math.abs(ys[i] - ys[j]), [a, b] = ys[i] > ys[j] ? [i, j] : [j, i]; return q(X((l) => [`¿Cuántos votos más tiene la ${cats[a][1][0]} que la ${cats[b][1][0]}?`, `Quants vots més té la ${cats[a][1][1]} que la ${cats[b][1][1]}?`, `How many more votes did ${cats[a][1][2]} get than ${cats[b][1][2]}?`][l]), d, near(r, d, { min: 0, also: [ys[i] + ys[j]] }), T('Lee las dos barras y resta.', 'Llig les dues barres i resta.', 'Read both bars and subtract.'), { visual: v }); }
  const tot = ys.reduce((a, b) => a + b, 0); return q(T('¿Cuántas personas han votado en total?', 'Quantes persones han votat en total?', 'How many people voted altogether?'), tot, near(r, tot, { also: [tot - ys[0], Math.max(...ys)] }), T('Suma lo que mide cada barra.', 'Suma el que mesura cada barra.', 'Add up the heights of all the bars.'), { visual: v });
};
/** Tally / frequency table from a list of answers. */
export const tally = (count: number): Gen => (r) => {
  const cats = pickN(r, CAT, 3); const list = Array.from({ length: count }, () => pick(r, cats)); const i = int(r, 0, 2); const f = list.filter((c) => c === cats[i]).length;
  return q(X((l) => [`Estas son las frutas favoritas de un grupo. ¿Cuántas veces aparece la ${cats[i][1][0]}?`, `Estes són les fruites preferides d’un grup. Quantes vegades apareix la ${cats[i][1][1]}?`, `These are a group's favourite fruits. How many times does ${cats[i][1][2]} appear?`][l]), f,
    near(r, f, { min: 0, also: cats.map((c) => list.filter((x) => x === c).length) }), T('Haz una marca por cada una que encuentres y cuenta las marcas (de 5 en 5).', 'Fes una marca per cada una que trobes i compta les marques (de 5 en 5).', 'Make a tally mark for each one you find and count the marks (in fives).'), { visual: { type: 'emoji', rows: rowsOf('', 0).concat(chunk(list.map((c) => c[0]), 8).map((x) => x.join(''))) } });
};
const chunk = <V,>(xs: V[], n: number) => Array.from({ length: Math.ceil(xs.length / n) }, (_, i) => xs.slice(i * n, i * n + n));
/** Mean, median, mode or range of a small list. */
export const averages = (kinds: ('mean' | 'median' | 'mode' | 'range')[], n = 5, max = 20): Gen => (r) => {
  const k = pick(r, kinds);
  let xs = Array.from({ length: n }, () => int(r, 1, max));
  if (k === 'mean') { const m = int(r, 2, max - 2); xs = xs.slice(0, n - 1).map((x) => Math.min(x, m * 2)); const last = m * n - xs.reduce((a, b) => a + b, 0); if (last < 0 || last > max * 2) { xs = Array(n - 1).fill(m); xs.push(m); } else xs.push(last); }
  if (k === 'mode') { xs[1] = xs[0]; xs[2] = xs[0]; }
  const sorted = [...xs].sort((a, b) => a - b);
  const val = k === 'mean' ? xs.reduce((a, b) => a + b, 0) / n : k === 'median' ? (n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2) : k === 'mode' ? xs[0] : sorted[n - 1] - sorted[0];
  const NAMES3: Record<string, T3> = { mean: T('la media', 'la mitjana', 'the mean'), median: T('la mediana', 'la mediana', 'the median'), mode: T('la moda', 'la moda', 'the mode'), range: T('el rango', 'el rang', 'the range') };
  const HINT: Record<string, T3> = { mean: T('Suma todos los datos y divide entre cuántos hay.', 'Suma totes les dades i dividix entre quantes n’hi ha.', 'Add all the values and divide by how many there are.'), median: T('Ordena los datos de menor a mayor: la mediana es el del centro.', 'Ordena les dades de menor a major: la mediana és la del centre.', 'Put the values in order: the median is the middle one.'), mode: T('La moda es el dato que más se repite.', 'La moda és la dada que més es repetix.', 'The mode is the value that appears most often.'), range: T('Rango = el mayor menos el menor.', 'Rang = el major menys el menor.', 'Range = biggest minus smallest.') };
  const others = [xs.reduce((a, b) => a + b, 0) / n, sorted[Math.floor(n / 2)], sorted[n - 1] - sorted[0], xs[Math.floor(n / 2)], sorted[n - 1]].map((x) => round(x, 2)).filter((x) => x !== round(val, 2));
  return q(X((l) => [`Datos: ${xs.map((x) => N(l, x)).join(', ')}. ¿Cuál es ${NAMES3[k][0]}?`, `Dades: ${xs.map((x) => N(l, x)).join(', ')}. Quina és ${NAMES3[k][1]}?`, `Data: ${xs.map((x) => N(l, x)).join(', ')}. What is ${NAMES3[k][2]}?`][l]), round(val, 2), [...new Set(others)].length >= 2 ? [...new Set(others)] : near(r, round(val, 2), { min: 0 }), HINT[k]);
};
/** Likelihood and simple probability with bags of balls. */
export const chance = (kinds: ('likely' | 'laplace' | 'space')[]): Gen => (r) => {
  const k = pick(r, kinds); const C: [string, T3][] = [['🔴', T('roja', 'roja', 'red')], ['🔵', T('azul', 'blava', 'blue')], ['🟢', T('verde', 'verda', 'green')], ['🟡', T('amarilla', 'groga', 'yellow')]];
  const cols = pickN(r, C, 3); const ns = cols.map(() => int(r, 1, 6)); while (new Set(ns).size < 3) ns[int(r, 0, 2)] = int(r, 1, 7);
  const bag = cols.map((c, i) => c[0].repeat(ns[i])).join(''); const tot = ns.reduce((a, b) => a + b, 0);
  if (k === 'likely') { const m = ns.indexOf(Math.max(...ns)); return mc(T('Saco una bola sin mirar. ¿De qué color es más probable que salga?', 'Trac una bola sense mirar. De quin color és més probable que isca?', 'I take a ball without looking. Which colour is most likely?'), cols[m][1], cols.filter((_, i) => i !== m).map((c) => c[1]).concat([T('Todos igual', 'Tots igual', 'All the same')]), T('Es más probable el color del que hay más bolas.', 'És més probable el color del qual hi ha més boles.', 'The colour with the most balls is the most likely.'), { visual: { type: 'emoji', rows: [bag] } }); }
  if (k === 'space') return q(T('Lanzo un dado normal. ¿Cuántos resultados distintos pueden salir?', 'Llance un dau normal. Quants resultats diferents poden eixir?', 'I roll an ordinary dice. How many different results are possible?'), 6, [1, 2, 12], T('Cuenta las caras del dado.', 'Compta les cares del dau.', 'Count the faces of the dice.'), { visual: { type: 'emoji', rows: ['🎲'], big: true } });
  const i = int(r, 0, 2), g = gcd(ns[i], tot), ans = `${ns[i] / g}/${tot / g}`;
  return q(X((l) => [`Saco una bola sin mirar. ¿Cuál es la probabilidad de que sea ${cols[i][1][0]}? (fracción simplificada)`, `Trac una bola sense mirar. Quina és la probabilitat que siga ${cols[i][1][1]}? (fracció simplificada)`, `I take a ball without looking. What is the probability it is ${cols[i][1][2]}? (simplest form)`][l]), ans,
    [`${ns[i]}/${tot - ns[i]}`, `1/${tot}`, `${tot - ns[i]}/${tot}`, `${ns[i]}/${tot}`].filter((x) => x !== ans), X((l) => [`Casos favorables entre casos posibles: ${ns[i]}/${tot}. Después simplifica.`, `Casos favorables entre casos possibles: ${ns[i]}/${tot}. Després simplifica.`, `Favourable outcomes over possible outcomes: ${ns[i]}/${tot}. Then simplify.`][l]), { visual: { type: 'emoji', rows: [bag] } });
};

/* ───────────── Logic ───────────── */
/** Take-away game: leave the other player a multiple of (m + 1). */
export const nim = (maxN: number): Gen => (r) => {
  const m = pick(r, [2, 3]); let n = int(r, m + 2, maxN); if (n % (m + 1) === 0) n += 1; const a = n % (m + 1);
  return q(X((l) => [`Hay ${n} fichas. Por turnos, cada jugador quita de 1 a ${m}. Gana quien quita la última. Te toca: ¿cuántas quitas?`, `Hi ha ${n} fitxes. Per torns, cada jugador en lleva d’1 a ${m}. Guanya qui lleva l’última. Et toca: quantes en lleves?`, `There are ${n} counters. Taking turns, each player removes 1 to ${m}. Whoever takes the last one wins. Your turn: how many do you take?`][l]), a,
    Array.from({ length: m }, (_, i) => i + 1).filter((x) => x !== a), X((l) => [`Deja al otro un número de fichas que sea múltiplo de ${m + 1}.`, `Deixa a l’altre un nombre de fitxes que siga múltiple de ${m + 1}.`, `Leave the other player a multiple of ${m + 1} counters.`][l]), { mc: true, visual: { type: 'emoji', rows: rowsOf('🟣', n, 10) } });
};
/** Robot on a grid following instructions (forward/turn). */
export const robot = (size: number): Gen => (r) => {
  const x = int(r, 0, 2), y = int(r, 0, 2); const steps: ('R' | 'U' | 'L' | 'D')[] = Array.from({ length: int(r, 2, 4) }, () => pick(r, ['R', 'U', 'R', 'U', 'L', 'D'] as const));
  let ex = x, ey = y; for (const s of steps) { if (s === 'R' && ex < size) ex++; if (s === 'L' && ex > 0) ex--; if (s === 'U' && ey < size) ey++; if (s === 'D' && ey > 0) ey--; }
  const ar = { R: '➡️', U: '⬆️', L: '⬅️', D: '⬇️' };
  const right = `(${ex}, ${ey})`;
  return mc(X((l) => [`El robot está en (${x}, ${y}) y sigue estas órdenes: ${steps.map((s) => ar[s]).join(' ')}. ¿Dónde acaba?`, `El robot està en (${x}, ${y}) i seguix estes ordres: ${steps.map((s) => ar[s]).join(' ')}. On acaba?`, `The robot is at (${x}, ${y}) and follows these instructions: ${steps.map((s) => ar[s]).join(' ')}. Where does it end?`][l]),
    S(right), [`(${ey}, ${ex})`, `(${ex + 1}, ${ey})`, `(${ex}, ${ey + 1})`, `(${x}, ${y})`].filter((s) => s !== right).map(S), T('Haz las órdenes de una en una, en orden, con el dedo en la cuadrícula.', 'Fes les ordres d’una en una, en ordre, amb el dit en la quadrícula.', 'Follow the instructions one at a time, in order, with your finger on the grid.'), { visual: { type: 'grid', w: size, h: size, pts: [{ x, y, label: '🤖' }], axes: true } });
};
export { DAYS, compareQ };
