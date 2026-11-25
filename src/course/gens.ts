// Reusable exercise generators with parameters, shared by several school years
// (the same kind of exercise with bigger numbers, more steps or less help).
import type { Visual } from '@/engine/types';
import type { Q, T3 } from './types';
import { addQ, compareQ, DAYS, gcd, int, lcm, mc, N, NAMES, near, pick, pickN, q, round, rowsOf, S, subQ, T, THINGS, thing, X, type Li, type R } from './lib';

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
  const dd = Math.max(3, d), a = int(r, 1, dd - 2), b = int(r, 1, dd - 1 - a); const s = `${a + b}/${dd}`;
  return q(X(() => `${a}/${dd} + ${b}/${dd} = ?`), s, [`${a + b}/${dd + dd}`, `${a * b}/${dd}`, `${Math.abs(a - b)}/${dd}`].filter((x) => x !== s && !x.startsWith('0/')).concat([`${a + b + 1}/${dd}`]),
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
      X((l) => [`${mul ? 'Multiplicar' : 'Dividir'} por ${N(l, m)} mueve la coma ${String(m).length - 1} ${m === 10 ? 'lugar' : 'lugares'} a la ${mul ? 'derecha' : 'izquierda'}.`, `${mul ? 'Multiplicar' : 'Dividir'} per ${N(l, m)} mou la coma ${String(m).length - 1} ${m === 10 ? 'lloc' : 'llocs'} a la ${mul ? 'dreta' : 'esquerra'}.`, `${mul ? 'Multiplying' : 'Dividing'} by ${N(l, m)} moves the decimal point ${String(m).length - 1} ${m === 10 ? 'place' : 'places'} to the ${mul ? 'right' : 'left'}.`][l])); }
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
  const price = () => cents ? Math.round(int(r, 50, max * 100) / 5) * 5 / 100 : int(r, 1, max);
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
  if (Number.isInteger(val)) { const ints = others.filter((x) => Number.isInteger(x)); others.length = 0; others.push(...ints); }
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
    Array.from({ length: m }, (_, i) => i + 1).filter((x) => x !== a), X((l) => [`Intenta dejarle al otro ${m + 1}, ${2 * (m + 1)} o ${3 * (m + 1)} fichas: así ganas siempre.`, `Intenta deixar-li a l’altre ${m + 1}, ${2 * (m + 1)} o ${3 * (m + 1)} fitxes: així guanyes sempre.`, `Try to leave the other player ${m + 1}, ${2 * (m + 1)} or ${3 * (m + 1)} counters: then you always win.`][l]), { mc: true, visual: { type: 'emoji', rows: rowsOf('🟣', n, 10) } });
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

/* ───────────── More generators (3.º onwards) ───────────── */
/** Round whole numbers to the nearest 10, 100 or 1000. */
export const roundWhole = (max: number, tos: number[]): Gen => (r) => {
  const to = pick(r, tos), n = int(r, to + 1, max); const ans = Math.round(n / to) * to;
  const other = ans === Math.floor(n / to) * to ? Math.ceil(n / to) * to : Math.floor(n / to) * to;
  return q(X((l) => [`Redondea ${N(l, n)} a la ${to === 10 ? 'decena' : to === 100 ? 'centena' : 'unidad de millar'} más cercana.`, `Arredonix ${N(l, n)} a la ${to === 10 ? 'desena' : to === 100 ? 'centena' : 'unitat de miler'} més pròxima.`, `Round ${N(l, n)} to the nearest ${to === 10 ? 'ten' : to === 100 ? 'hundred' : 'thousand'}.`][l]), ans,
    [other, n, ans + to].filter((x, i, a) => x !== ans && a.indexOf(x) === i), T('Mira la cifra que va justo a la derecha: si es 5 o más, sube; si es menos, baja.', 'Mira la xifra que va just a la dreta: si és 5 o més, puja; si és menys, baixa.', 'Look at the digit just to the right: 5 or more rounds up; less rounds down.'),
    { aid: line(Math.floor(n / to) * to, Math.ceil(n / to) * to === Math.floor(n / to) * to ? Math.floor(n / to) * to + to : Math.ceil(n / to) * to, to / 10, to, n) });
};
/** Commutative, associative and distributive properties. */
export const properties = (kinds: ('comm' | 'assoc' | 'dist')[]): Gen => (r) => {
  const k = pick(r, kinds), a = int(r, 2, 9), b = int(r, 2, 9), c = int(r, 2, 9);
  if (k === 'comm') { const add = r() < 0.4; return q(X((l) => add ? `${N(l, a)} + ${N(l, b)} = ${N(l, b)} + ?` : `${N(l, a)} × ${N(l, b)} = ${N(l, b)} × ?`), a, near(r, a, { also: [b, add ? a + b : a * b] , min: 1 }), T('Si cambias el orden, el resultado no cambia (propiedad conmutativa).', 'Si canvies l’ordre, el resultat no canvia (propietat commutativa).', 'Changing the order does not change the result (commutative property).')); }
  if (k === 'assoc') return q(X((l) => `(${N(l, a)} × ${N(l, b)}) × ${N(l, c)} = ${N(l, a)} × (${N(l, b)} × ?)`), c, near(r, c, { also: [b, a, b * c], min: 1 }), T('Puedes agrupar como quieras: el resultado es el mismo (propiedad asociativa).', 'Pots agrupar com vulgues: el resultat és el mateix (propietat associativa).', 'You can group them any way: the result is the same (associative property).'));
  const t = int(r, 1, 9) * 10; return q(X((l) => `${N(l, a)} × ${N(l, t + c)} = ${N(l, a)} × ${N(l, t)} + ${N(l, a)} × ?`), c, near(r, c, { also: [t, a, t + c], min: 1 }), X((l) => [`Partimos ${t + c} en ${t} + ${c} y multiplicamos cada parte (propiedad distributiva).`, `Partim ${t + c} en ${t} + ${c} i multipliquem cada part (propietat distributiva).`, `Split ${t + c} into ${t} + ${c} and multiply each part (distributive property).`][l]));
};
/** Classify triangles by sides or by angles. */
export const triangles = (): Gen => (r) => {
  const bySides = r() < 0.5;
  if (bySides) { const kind = int(r, 0, 2); const a = int(r, 3, 9); const sides = kind === 0 ? [a, a, a] : kind === 1 ? [a, a, a + int(r, 1, 3)] : [a, a + 1, a + int(r, 2, 4)];
    const NM = [T('equilátero', 'equilàter', 'equilateral'), T('isósceles', 'isòsceles', 'isosceles'), T('escaleno', 'escalé', 'scalene')];
    return mc(X((l) => [`Un triángulo tiene lados de ${sides.map((x) => N(l, x)).join(', ')} cm. ¿Cómo es?`, `Un triangle té costats de ${sides.map((x) => N(l, x)).join(', ')} cm. Com és?`, `A triangle has sides of ${sides.map((x) => N(l, x)).join(', ')} cm. What type is it?`][l]), NM[kind], NM.filter((_, i) => i !== kind), T('3 lados iguales: equilátero. 2 iguales: isósceles. Todos distintos: escaleno.', '3 costats iguals: equilàter. 2 iguals: isòsceles. Tots diferents: escalé.', '3 equal sides: equilateral. 2 equal: isosceles. All different: scalene.')); }
  const kind = int(r, 0, 2); const big = kind === 0 ? int(r, 50, 80) : kind === 1 ? 90 : int(r, 100, 140); const b = int(r, 20, Math.min(80, 170 - big)); const angs = [big, b, 180 - big - b].sort(() => r() - 0.5);
  const NM = [T('acutángulo', 'acutangle', 'acute-angled'), T('rectángulo', 'rectangle', 'right-angled'), T('obtusángulo', 'obtusangle', 'obtuse-angled')];
  const real = Math.max(...angs) < 90 ? 0 : Math.max(...angs) === 90 ? 1 : 2;
  return mc(X((l) => [`Un triángulo tiene ángulos de ${angs.join('°, ')}°. ¿Cómo es según sus ángulos?`, `Un triangle té angles de ${angs.join('°, ')}°. Com és segons els seus angles?`, `A triangle has angles of ${angs.join('°, ')}°. What type is it by its angles?`][l]), NM[real], NM.filter((_, i) => i !== real), T('Mira el ángulo mayor: menos de 90° acutángulo; 90° rectángulo; más de 90° obtusángulo.', 'Mira l’angle major: menys de 90° acutangle; 90° rectangle; més de 90° obtusangle.', 'Look at the biggest angle: under 90° acute; 90° right; over 90° obtuse.'));
};
/** Radius and diameter. */
export const radiusDiameter = (max: number): Gen => (r) => {
  const rad = int(r, 1, max), toD = r() < 0.5;
  return q(X((l) => toD ? [`Una circunferencia tiene ${N(l, rad)} cm de radio. ¿Cuánto mide su diámetro?`, `Una circumferència té ${N(l, rad)} cm de radi. Quant mesura el seu diàmetre?`, `A circle has a radius of ${N(l, rad)} cm. What is its diameter?`][l] : [`Una circunferencia tiene ${N(l, rad * 2)} cm de diámetro. ¿Cuánto mide su radio?`, `Una circumferència té ${N(l, rad * 2)} cm de diàmetre. Quant mesura el seu radi?`, `A circle has a diameter of ${N(l, rad * 2)} cm. What is its radius?`][l]),
    toD ? rad * 2 : rad, near(r, toD ? rad * 2 : rad, { also: [toD ? rad : rad * 4, toD ? rad * 4 : rad * 2], min: 1 }), T('El diámetro cruza toda la circunferencia pasando por el centro: mide dos radios.', 'El diàmetre creua tota la circumferència passant pel centre: mesura dos radis.', 'The diameter goes right across through the centre: it is two radii long.'));
};
/** Dice and coins: outcomes, sample space, more/less likely. */
export const diceCoins = (): Gen => (r) => {
  const k = int(r, 0, 3);
  if (k === 0) { const n = int(r, 1, 6); const ev = pick(r, ['even', 'more', 'less'] as const); const cnt = ev === 'even' ? 3 : ev === 'more' ? 6 - n : n - 1;
    return q(X((l) => ev === 'even' ? ['Lanzo un dado. ¿En cuántos resultados sale un número par?', 'Llance un dau. En quants resultats ix un nombre parell?', 'I roll a dice. In how many outcomes is the number even?'][l] : ev === 'more' ? [`Lanzo un dado. ¿En cuántos resultados sale más de ${n}?`, `Llance un dau. En quants resultats ix més de ${n}?`, `I roll a dice. In how many outcomes is the number greater than ${n}?`][l] : [`Lanzo un dado. ¿En cuántos resultados sale menos de ${n}?`, `Llance un dau. En quants resultats ix menys de ${n}?`, `I roll a dice. In how many outcomes is the number less than ${n}?`][l]),
      cnt, near(r, cnt, { min: 0, max: 6, also: [6 - cnt, cnt + 1] }), T('Escribe los resultados 1, 2, 3, 4, 5, 6 y rodea los que cumplen la condición.', 'Escriu els resultats 1, 2, 3, 4, 5, 6 i encercla els que complixen la condició.', 'Write the outcomes 1 to 6 and circle the ones that match.'), { visual: { type: 'emoji', rows: ['⚀ ⚁ ⚂ ⚃ ⚄ ⚅'], big: true } }); }
  if (k === 1) return q(T('Lanzo dos monedas. ¿Cuántos resultados distintos hay? (cara-cara, cara-cruz…)', 'Llance dues monedes. Quants resultats diferents hi ha? (cara-cara, cara-creu…)', 'I toss two coins. How many different outcomes are there? (heads-heads, heads-tails…)'), 4, [2, 3, 6], T('Cara-cara, cara-cruz, cruz-cara y cruz-cruz.', 'Cara-cara, cara-creu, creu-cara i creu-creu.', 'HH, HT, TH and TT.'));
  if (k === 2) { const MORE = T('salga par', 'isca parell', 'an even number'), SIX = T('salga un 6', 'isca un 6', 'a 6'); return mc(T('Al lanzar un dado, ¿qué es más probable?', 'En llançar un dau, què és més probable?', 'When you roll a dice, which is more likely?'), MORE, [SIX, T('Los dos igual', 'Els dos igual', 'Both the same')], T('Par sale con 2, 4 o 6 (tres caras); el 6, solo con una cara.', 'Parell ix amb 2, 4 o 6 (tres cares); el 6, només amb una cara.', 'Even comes up with 2, 4 or 6 (three faces); a 6 with only one face.')); }
  return mc(T('Lanzo una moneda 10 veces y sale cara las 10. ¿Qué es más probable en la siguiente?', 'Llance una moneda 10 vegades i ix cara les 10. Què és més probable en la següent?', 'I toss a coin 10 times and get heads every time. Which is more likely next time?'), T('Cara y cruz igual de probables', 'Cara i creu igual de probables', 'Heads and tails equally likely'), [T('Cruz, porque le toca', 'Creu, perquè li toca', 'Tails, because it is due'), T('Cara, porque está en racha', 'Cara, perquè està en ratxa', 'Heads, because it is on a streak')], T('La moneda no recuerda lo que salió antes.', 'La moneda no recorda el que va eixir abans.', 'A coin does not remember what came before.'));
};
/** Loops: repeat a block of moves n times on a number line or grid. */
export const loops = (): Gen => (r) => {
  const st = int(r, 0, 5), times = int(r, 2, 5), fwd = int(r, 2, 4), back = r() < 0.5 ? int(r, 1, fwd - 1) : 0, end = st + times * (fwd - back);
  return q(X((l) => back ? [`El robot sale de la casilla ${st}. Repite ${times} veces: «avanza ${fwd}, retrocede ${back}». ¿Dónde acaba?`, `El robot ix de la casella ${st}. Repetix ${times} vegades: «avança ${fwd}, retrocedix ${back}». On acaba?`, `The robot starts on square ${st}. It repeats ${times} times: "forward ${fwd}, back ${back}". Where does it end?`][l]
    : [`El robot sale de la casilla ${st}. Repite ${times} veces: «avanza ${fwd}». ¿Dónde acaba?`, `El robot ix de la casella ${st}. Repetix ${times} vegades: «avança ${fwd}». On acaba?`, `The robot starts on square ${st}. It repeats ${times} times: "forward ${fwd}". Where does it end?`][l]),
    end, near(r, end, { also: [st + fwd * times, st + times * (fwd + back), end + fwd - back].filter((x) => x !== end), min: 0 }), X((l) => [`Cada repetición avanza ${fwd - back}. ${times} repeticiones: ${times} × ${fwd - back} = ${times * (fwd - back)}.`, `Cada repetició avança ${fwd - back}. ${times} repeticions: ${times} × ${fwd - back} = ${times * (fwd - back)}.`, `Each repeat moves ${fwd - back} forward. ${times} repeats: ${times} × ${fwd - back} = ${times * (fwd - back)}.`][l]));
};
/** Word problems with one operation chosen from the four. */
export const oneStep = (max: number): Gen => (r) => {
  const who = pick(r, NAMES), t = pick(r, THINGS), op = int(r, 0, 3);
  if (op === 0) { const a = int(r, 10, max), b = int(r, 10, max); return q(X((l) => [`${who} tiene ${thing(l, t, a)} y su hermana ${N(l, b)}. ¿Cuántas tienen entre los dos?`, `${who} té ${thing(l, t, a)} i la seua germana ${N(l, b)}. Quantes en tenen entre els dos?`, `${who} has ${thing(l, t, a)} and their sister has ${N(l, b)}. How many do they have between them?`][l]), a + b, near(r, a + b, { also: [Math.abs(a - b), a + b + 10] }), T('«Entre los dos» es juntar: suma.', '«Entre els dos» és ajuntar: suma.', '"Between them" means putting together: add.')); }
  if (op === 1) { const a = int(r, 20, max), b = int(r, 5, a - 1); return q(X((l) => [`${who} tenía ${thing(l, t, a)} y le quedan ${N(l, b)}. ¿Cuántas ha gastado?`, `${who} tenia ${thing(l, t, a)} i li’n queden ${N(l, b)}. Quantes n’ha gastat?`, `${who} had ${thing(l, t, a)} and has ${N(l, b)} left. How many were used up?`][l]), a - b, near(r, a - b, { also: [a + b] }), T('Lo que había menos lo que queda.', 'El que hi havia menys el que queda.', 'What there was minus what is left.')); }
  if (op === 2) { const g = int(r, 3, 9), e = int(r, 3, 12); return q(X((l) => [`En cada caja hay ${thing(l, t, e)}. ¿Cuántas hay en ${g} cajas?`, `En cada caixa hi ha ${thing(l, t, e)}. Quantes n’hi ha en ${g} caixes?`, `Each box has ${thing(l, t, e)}. How many are there in ${g} boxes?`][l]), g * e, near(r, g * e, { also: [g + e, g * e + e] }), T('Muchas veces lo mismo: multiplica.', 'Moltes vegades el mateix: multiplica.', 'The same amount many times: multiply.')); }
  const g = int(r, 2, 9), e = int(r, 2, 12); return q(X((l) => [`Se reparten ${thing(l, t, g * e)} en ${g} bolsas iguales. ¿Cuántas van en cada bolsa?`, `Es repartixen ${thing(l, t, g * e)} en ${g} bosses iguals. Quantes en van en cada bossa?`, `${thing(l, t, g * e)} are shared into ${g} equal bags. How many go in each bag?`][l]), e, near(r, e, { also: [g * e - g, g], min: 1 }), T('Repartir en partes iguales: divide.', 'Repartir en parts iguals: dividix.', 'Sharing equally: divide.'));
};

/** Multiples and divisors (factors): is it a multiple, which is a divisor, next multiple, how many divisors. */
export const multiples = (kinds: ('isMult' | 'whichDiv' | 'nextMult' | 'countDiv' | 'prime')[]): Gen => (r) => {
  const k = pick(r, kinds);
  if (k === 'isMult') { const b = int(r, 2, 9), a = r() < 0.5 ? b * int(r, 2, 12) : b * int(r, 2, 12) + int(r, 1, b - 1); const yes = a % b === 0;
    return mc(X((l) => [`¿Es ${N(l, a)} múltiplo de ${b}?`, `${N(l, a)} és múltiple de ${b}?`, `Is ${N(l, a)} a multiple of ${b}?`][l]), yes ? T('Sí', 'Sí', 'Yes') : T('No', 'No', 'No'), [yes ? T('No', 'No', 'No') : T('Sí', 'Sí', 'Yes')], X((l) => [`Es múltiplo si está en la tabla del ${b}: divide ${a} entre ${b} y mira si sobra algo.`, `És múltiple si està en la taula del ${b}: dividix ${a} entre ${b} i mira si sobra res.`, `It is a multiple if it is in the ${b} times table: divide ${a} by ${b} and see if anything is left over.`][l])); }
  if (k === 'whichDiv') { const n = pick(r, [12, 15, 18, 20, 24, 28, 30, 36, 40, 42, 45, 48]); const divs = Array.from({ length: n }, (_, i) => i + 1).filter((d) => n % d === 0 && d > 1 && d < n); const nd = Array.from({ length: 11 }, (_, i) => i + 2).filter((d) => n % d !== 0);
    const a = pick(r, divs); return q(X((l) => [`¿Cuál de estos números es divisor de ${N(l, n)}?`, `Quin d’estos nombres és divisor de ${N(l, n)}?`, `Which of these numbers is a factor of ${N(l, n)}?`][l]), a, pickN(r, nd, 3), X((l) => [`Un divisor de ${n} lo divide sin que sobre nada.`, `Un divisor de ${n} el dividix sense que sobre res.`, `A factor of ${n} divides it with nothing left over.`][l]), { mc: true }); }
  if (k === 'nextMult') { const b = int(r, 3, 12), a = int(r, 10, 90); const ans = Math.ceil((a + 1) / b) * b; return q(X((l) => [`¿Cuál es el primer múltiplo de ${b} mayor que ${N(l, a)}?`, `Quin és el primer múltiple de ${b} major que ${N(l, a)}?`, `What is the first multiple of ${b} greater than ${N(l, a)}?`][l]), ans, near(r, ans, { also: [ans + b, ans - b, a + b, a + 1].filter((x) => x > a && x !== ans) }), X((l) => [`Recorre la tabla del ${b} hasta pasar de ${a}.`, `Recorre la taula del ${b} fins a passar de ${a}.`, `Go up the ${b} times table until you pass ${a}.`][l])); }
  if (k === 'prime') { const P = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]; const C = [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 21, 22, 25, 27, 33, 35, 39, 49]; const a = pick(r, P);
    return q(T('¿Cuál de estos números es primo?', 'Quin d’estos nombres és primer?', 'Which of these numbers is prime?'), a, pickN(r, C, 3), T('Un número primo solo se puede dividir entre 1 y entre sí mismo.', 'Un nombre primer només es pot dividir entre 1 i entre ell mateix.', 'A prime number can only be divided by 1 and itself.'), { mc: true }); }
  const n = pick(r, [6, 8, 10, 12, 15, 16, 18, 20, 24, 30]); const c = Array.from({ length: n }, (_, i) => i + 1).filter((d) => n % d === 0).length;
  return q(X((l) => [`¿Cuántos divisores tiene ${N(l, n)}? (cuenta también el 1 y el ${n})`, `Quants divisors té ${N(l, n)}? (compta també l’1 i el ${n})`, `How many factors does ${N(l, n)} have? (count 1 and ${n} too)`][l]), c, near(r, c, { min: 2 }), T('Busca parejas que multiplicadas den el número: 1 × n, 2 × …', 'Busca parelles que multiplicades donen el nombre: 1 × n, 2 × …', 'Look for pairs that multiply to make the number: 1 × n, 2 × …'));
};
/** Whole numbers × or ÷ 10, 100, 1000 (exact). */
export const mulDiv10 = (max: number): Gen => (r) => {
  const m = pick(r, [10, 100, 1000]), mul = r() < 0.5, a = mul ? int(r, 2, Math.max(3, Math.floor(max / m))) : int(r, 2, Math.max(3, Math.floor(max / m))) * m, ans = mul ? a * m : a / m;
  return q(X((l) => `${N(l, a)} ${mul ? '×' : '÷'} ${N(l, m)} = ?`), ans, near(r, ans, { also: [mul ? ans * 10 : ans * 10, mul ? ans / 10 : ans / 10, mul ? a * m / 10 : a / m * 10].filter((x) => Number.isInteger(x) && x > 0 && x !== ans) }),
    X((l) => mul ? [`Multiplicar por ${N(l, m)} añade ${String(m).length - 1} ceros al final.`, `Multiplicar per ${N(l, m)} afig ${String(m).length - 1} zeros al final.`, `Multiplying by ${N(l, m)} adds ${String(m).length - 1} zeros to the end.`][l] : [`Dividir por ${N(l, m)} quita ${String(m).length - 1} ceros del final.`, `Dividir per ${N(l, m)} lleva ${String(m).length - 1} zeros del final.`, `Dividing by ${N(l, m)} removes ${String(m).length - 1} zeros from the end.`][l]));
};
/** Units of time: hours/minutes/seconds, days/weeks, years. */
export const timeUnits = (): Gen => (r) => {
  const k = int(r, 0, 4);
  if (k === 0) { const h = int(r, 1, 5); return q(X((l) => [`¿Cuántos minutos son ${h} ${h === 1 ? 'hora' : 'horas'}?`, `Quants minuts són ${h} ${h === 1 ? 'hora' : 'hores'}?`, `How many minutes are ${h} ${h === 1 ? 'hour' : 'hours'}?`][l]), h * 60, near(r, h * 60, { also: [h * 100, h * 30, h * 24], step: 10 }), T('1 hora = 60 minutos.', '1 hora = 60 minuts.', '1 hour = 60 minutes.')); }
  if (k === 1) { const m = int(r, 1, 5); return q(X((l) => [`¿Cuántos segundos son ${m} ${m === 1 ? 'minuto' : 'minutos'}?`, `Quants segons són ${m} ${m === 1 ? 'minut' : 'minuts'}?`, `How many seconds are ${m} ${m === 1 ? 'minute' : 'minutes'}?`][l]), m * 60, near(r, m * 60, { also: [m * 100, m * 30], step: 10 }), T('1 minuto = 60 segundos.', '1 minut = 60 segons.', '1 minute = 60 seconds.')); }
  if (k === 2) { const h = int(r, 1, 3), m = pick(r, [15, 20, 30, 45]); return q(X((l) => [`¿Cuántos minutos son ${h} h y ${m} min?`, `Quants minuts són ${h} h i ${m} min?`, `How many minutes are ${h} h ${m} min?`][l]), h * 60 + m, near(r, h * 60 + m, { also: [h * 100 + m, h + m], step: 5 }), X((l) => [`${h} × 60 = ${h * 60}, y súmale ${m}.`, `${h} × 60 = ${h * 60}, i suma-li ${m}.`, `${h} × 60 = ${h * 60}, then add ${m}.`][l])); }
  if (k === 3) { const w = int(r, 2, 8); return q(X((l) => [`¿Cuántos días son ${w} semanas?`, `Quants dies són ${w} setmanes?`, `How many days are ${w} weeks?`][l]), w * 7, near(r, w * 7, { also: [w * 5, w * 10] }), T('1 semana = 7 días.', '1 setmana = 7 dies.', '1 week = 7 days.')); }
  const d = pick(r, [120, 180, 90, 150, 240]); return q(X((l) => [`¿Cuántas horas son ${d} minutos? (pueden salir medias)`, `Quantes hores són ${d} minuts? (poden eixir mitges)`, `How many hours are ${d} minutes? (halves are fine)`][l]), d / 60, near(r, d / 60, { step: 0.5, also: [d / 100], min: 0.5 }), T('Divide entre 60. 30 minutos son media hora (0,5).', 'Dividix entre 60. 30 minuts són mitja hora (0,5).', 'Divide by 60. 30 minutes is half an hour (0.5).'));
};
/** Faces, edges and vertices of common solids. */
export const polyhedra = (): Gen => (r) => {
  const S3: [T3, number, number, number, string][] = [[T('un cubo', 'un cub', 'a cube'), 6, 12, 8, '🧊'], [T('un prisma triangular', 'un prisma triangular', 'a triangular prism'), 5, 9, 6, '🔺'], [T('una pirámide de base cuadrada', 'una piràmide de base quadrada', 'a square-based pyramid'), 5, 8, 5, '🔺'], [T('un tetraedro', 'un tetraedre', 'a tetrahedron'), 4, 6, 4, '🔺'], [T('un prisma de base pentagonal', 'un prisma de base pentagonal', 'a pentagonal prism'), 7, 15, 10, '⬟'], [T('un ortoedro (una caja)', 'un ortoedre (una caixa)', 'a cuboid (a box)'), 6, 12, 8, '📦']];
  const [nm, F, E, V] = pick(r, S3); const k = int(r, 0, 2); const what = [T('caras', 'cares', 'faces'), T('aristas', 'arestes', 'edges'), T('vértices', 'vèrtexs', 'vertices')][k]; const ans = [F, E, V][k];
  return q(X((l) => [`¿Cuántas ${what[0]} tiene ${nm[0]}?`, `Quantes ${what[1]} té ${nm[1]}?`, `How many ${what[2]} does ${nm[2]} have?`][l]).map((s, i) => i === 0 && k === 2 ? s.replace('¿Cuántas', '¿Cuántos') : i === 1 && k === 2 ? s.replace('Quantes', 'Quants') : s) as unknown as T3, ans,
    [F, E, V, ans + 1, ans - 1].filter((x, i, a) => x !== ans && x > 0 && a.indexOf(x) === i), T('Caras: las superficies planas. Aristas: donde se juntan dos caras. Vértices: las esquinas.', 'Cares: les superfícies planes. Arestes: on s’ajunten dues cares. Vèrtexs: els cantons.', 'Faces: the flat surfaces. Edges: where two faces meet. Vertices: the corners.'));
};
/** A line graph (temperature during the day): read a value, find the highest, or the change. */
export const lineGraph = (): Gen => (r) => {
  const hours = ['8 h', '10 h', '12 h', '14 h', '16 h', '18 h']; let t = int(r, 8, 14); const ys = hours.map((_, i) => { t += i < 3 ? int(r, 1, 4) : -int(r, 0, 3); return t; });
  const v: Visual = { type: 'chart', kind: 'line', x: hours, y: ys, yMax: Math.ceil((Math.max(...ys) + 2) / 5) * 5, yStep: 5, yTitle: { key: 'tt_temp' } };
  const k = int(r, 0, 2), i = int(r, 0, 5);
  if (k === 0) return q(X((l) => [`¿Qué temperatura (°C) había a las ${hours[i]}?`, `Quina temperatura (°C) feia a les ${hours[i]}?`, `What was the temperature (°C) at ${hours[i]}?`][l]), ys[i], near(r, ys[i], { also: ys.filter((y) => y !== ys[i]), min: 0 }), T('Busca la hora abajo, sube hasta el punto y mira a la izquierda.', 'Busca l’hora baix, puja fins al punt i mira a l’esquerra.', 'Find the time at the bottom, go up to the point and read across to the left.'), { visual: v });
  if (k === 1) { const m = ys.indexOf(Math.max(...ys)); return mc(T('¿A qué hora hizo más calor?', 'A quina hora va fer més calor?', 'At what time was it warmest?'), S(hours[m]), hours.filter((_, j) => j !== m).map(S), T('Busca el punto más alto de la línea.', 'Busca el punt més alt de la línia.', 'Find the highest point on the line.'), { visual: v }); }
  const d = ys[3] - ys[0]; return q(X((l) => [`¿Cuántos grados subió la temperatura de las 8 h a las 14 h?`, `Quants graus va pujar la temperatura de les 8 h a les 14 h?`, `By how many degrees did it warm up from 8 h to 14 h?`][l]), d, near(r, d, { also: [ys[3], ys[0]], min: 0 }), T('Lee los dos valores y resta.', 'Llig els dos valors i resta.', 'Read both values and subtract.'), { visual: v });
};

/* ───────────── Cycle 3 (5.º–6.º) ───────────── */
/** Squares, cubes and powers of 10; square roots of perfect squares. */
export const powers = (kinds: ('sq' | 'cube' | 'p10' | 'root' | 'read')[]): Gen => (r) => {
  const k = pick(r, kinds);
  if (k === 'sq') { const b = int(r, 2, 15); return q(X((l) => `${N(l, b)}² = ?`), b * b, near(r, b * b, { also: [2 * b, b + 2, b * b + b] }), X((l) => [`${b}² es ${b} × ${b}, no ${b} × 2.`, `${b}² és ${b} × ${b}, no ${b} × 2.`, `${b}² means ${b} × ${b}, not ${b} × 2.`][l])); }
  if (k === 'cube') { const b = int(r, 2, 6); return q(X((l) => `${N(l, b)}³ = ?`), b ** 3, near(r, b ** 3, { also: [3 * b, b * b, b ** 3 + b] }), X((l) => [`${b}³ es ${b} × ${b} × ${b}.`, `${b}³ és ${b} × ${b} × ${b}.`, `${b}³ means ${b} × ${b} × ${b}.`][l])); }
  if (k === 'p10') { const e = int(r, 2, 6); return q(S(`10${'⁰¹²³⁴⁵⁶⁷⁸⁹'[e]} = ?`), 10 ** e, [10 ** (e - 1), 10 ** (e + 1), 10 * e], X((l) => [`Es un 1 seguido de ${e} ceros.`, `És un 1 seguit de ${e} zeros.`, `It is a 1 followed by ${e} zeros.`][l])); }
  if (k === 'root') { const b = int(r, 2, 15); return q(X((l) => `√${N(l, b * b)} = ?`), b, near(r, b, { also: [b * b / 2, b + 1].filter(Number.isInteger), min: 1 }), X((l) => [`¿Qué número multiplicado por sí mismo da ${b * b}?`, `Quin nombre multiplicat per ell mateix dona ${b * b}?`, `What number times itself makes ${b * b}?`][l])); }
  const b = int(r, 2, 9), e = int(r, 2, 5); return mc(X((l) => [`¿Cómo se escribe ${Array(e).fill(b).join(' × ')} en forma de potencia?`, `Com s’escriu ${Array(e).fill(b).join(' × ')} en forma de potència?`, `How do you write ${Array(e).fill(b).join(' × ')} as a power?`][l]), S(`${b}${'⁰¹²³⁴⁵⁶⁷⁸⁹'[e]}`), [S(`${e}${'⁰¹²³⁴⁵⁶⁷⁸⁹'[b]}`), S(`${b} × ${e}`), S(`${b}${'⁰¹²³⁴⁵⁶⁷⁸⁹'[e + 1]}`)].filter((x) => x[0] !== `${b}${'⁰¹²³⁴⁵⁶⁷⁸⁹'[e]}`), T('La base es el número que se repite y el exponente, cuántas veces.', 'La base és el nombre que es repetix i l’exponent, quantes vegades.', 'The base is the number repeated and the exponent is how many times.'));
};
/** Add/subtract fractions with different denominators (one a multiple of the other, or small coprime ones). */
export const fracAddSub = (): Gen => (r) => {
  const d1 = pick(r, [2, 3, 4, 5, 6]), m = pick(r, [2, 3]), d2 = r() < 0.6 ? d1 * m : pick(r, [2, 3, 4, 5].filter((x) => x !== d1));
  const L = (d1 * d2) / gcd(d1, d2); const a = int(r, 1, d1 - 1 || 1), b = int(r, 1, d2 - 1 || 1); const add = r() < 0.6 || a / d1 <= b / d2;
  const numr = add ? a * (L / d1) + b * (L / d2) : a * (L / d1) - b * (L / d2); const g = gcd(Math.abs(numr), L);
  const ans = `${numr / g}/${L / g}`;
  const wrong = [`${add ? a + b : Math.abs(a - b)}/${d1 + d2}`, `${numr}/${L * 2}`, `${add ? a + b : Math.abs(a - b)}/${L}`, `${numr + 1}/${L}`].filter((x) => x !== ans && !x.startsWith('0/') && x !== `${numr}/${L}`);
  return q(X(() => `${a}/${d1} ${add ? '+' : '−'} ${b}/${d2} = ?`), ans, wrong, X((l) => [`Busca un denominador común (${L}), convierte las dos fracciones y después ${add ? 'suma' : 'resta'} los numeradores. Simplifica si puedes.`, `Busca un denominador comú (${L}), convertix les dues fraccions i després ${add ? 'suma' : 'resta'} els numeradors. Simplifica si pots.`, `Find a common denominator (${L}), convert both fractions, then ${add ? 'add' : 'subtract'} the numerators. Simplify if you can.`][l]));
};
/** Simplify a fraction. */
export const simplify = (): Gen => (r) => {
  const d = int(r, 2, 9), n = int(r, 1, d - 1); if (gcd(n, d) > 1) return simplify()(r); const f = int(r, 2, 6); const ans = `${n}/${d}`;
  return q(X((l) => [`Simplifica ${n * f}/${d * f} todo lo posible.`, `Simplifica ${n * f}/${d * f} tant com puguis.`, `Simplify ${n * f}/${d * f} as far as possible.`][l]).map((s, i) => (i === 1 ? s.replace('puguis', 'pugues') : s)) as unknown as T3, ans,
    [`${n * f}/${d}`, `${n}/${d * f}`, `${n + 1}/${d}`, `${n * 2}/${d * 2}`].filter((x) => x !== ans), X((l) => [`Divide arriba y abajo por el mismo número (aquí, ${f}).`, `Dividix dalt i baix pel mateix nombre (ací, ${f}).`, `Divide top and bottom by the same number (here, ${f}).`][l]));
};
/** Percentages: of an amount, discount, fraction ↔ percentage ↔ decimal. */
export const percent = (kinds: ('of' | 'discount' | 'convert' | 'increase' | 'whatpct')[]): Gen => (r) => {
  const k = pick(r, kinds);
  if (k === 'of') { const p = pick(r, [10, 20, 25, 50, 75, 5, 30, 40]), base = pick(r, [20, 40, 60, 80, 100, 120, 200, 300, 400]); const a = (p * base) / 100;
    return q(X((l) => [`¿Cuánto es el ${p} % de ${N(l, base)}?`, `Quant és el ${p} % de ${N(l, base)}?`, `What is ${p}% of ${N(l, base)}?`][l]), a, near(r, a, { also: [p, base - a, a * 10, base / p].filter((x) => Number.isInteger(x) && x !== a) }), X((l) => [`${p} % es ${p} de cada 100: ${base} × ${p} ÷ 100.`, `${p} % és ${p} de cada 100: ${base} × ${p} ÷ 100.`, `${p}% means ${p} out of every 100: ${base} × ${p} ÷ 100.`][l])); }
  if (k === 'discount') { const p = pick(r, [10, 20, 25, 50, 30]), price = pick(r, [20, 40, 60, 80, 100, 120, 150, 200]); const fin = price - (p * price) / 100;
    return q(X((l) => [`Unas zapatillas cuestan ${N(l, price)} € y tienen un descuento del ${p} %. ¿Cuánto pagas?`, `Unes sabatilles costen ${N(l, price)} € i tenen un descompte del ${p} %. Quant pagues?`, `Trainers cost €${N(l, price)} with a ${p}% discount. How much do you pay?`][l]), fin, near(r, fin, { also: [(p * price) / 100, price - p, price + (p * price) / 100] }), X((l) => [`Calcula el descuento (${p} % de ${price} = ${(p * price) / 100}) y réstalo del precio.`, `Calcula el descompte (${p} % de ${price} = ${(p * price) / 100}) i resta’l del preu.`, `Work out the discount (${p}% of ${price} = ${(p * price) / 100}) and subtract it from the price.`][l])); }
  if (k === 'increase') { const p = pick(r, [10, 20, 25, 50]), base = pick(r, [40, 80, 100, 200, 300]); const fin = base + (p * base) / 100;
    return q(X((l) => [`Un precio de ${N(l, base)} € sube un ${p} %. ¿Cuál es el nuevo precio?`, `Un preu de ${N(l, base)} € puja un ${p} %. Quin és el preu nou?`, `A price of €${N(l, base)} goes up by ${p}%. What is the new price?`][l]), fin, near(r, fin, { also: [base + p, (p * base) / 100, base - (p * base) / 100] }), T('Calcula el aumento y súmalo al precio.', 'Calcula l’augment i suma’l al preu.', 'Work out the increase and add it to the price.')); }
  if (k === 'whatpct') { const tot = pick(r, [20, 25, 40, 50]), part = int(r, 1, tot - 1), p = (part * 100) / tot; if (!Number.isInteger(p)) return percent(['of'])(r);
    return q(X((l) => [`En una clase de ${tot} alumnos, ${part} llevan gafas. ¿Qué porcentaje lleva gafas?`, `En una classe de ${tot} alumnes, ${part} porten ulleres. Quin percentatge porta ulleres?`, `In a class of ${tot} pupils, ${part} wear glasses. What percentage wear glasses?`][l]), p, near(r, p, { also: [part, 100 - p], step: 5, min: 1 }), X((l) => [`${part} de ${tot}: pásalo a «de cada 100» multiplicando arriba y abajo por ${100 / tot}.`, `${part} de ${tot}: passa-ho a «de cada 100» multiplicant dalt i baix per ${100 / tot}.`, `${part} out of ${tot}: turn it into "out of 100" by multiplying top and bottom by ${100 / tot}.`][l])); }
  const CV: [string, string, number][] = [['1/2', '50 %', 0.5], ['1/4', '25 %', 0.25], ['3/4', '75 %', 0.75], ['1/10', '10 %', 0.1], ['1/5', '20 %', 0.2], ['2/5', '40 %', 0.4]];
  const [f, p, d] = pick(r, CV); const others = CV.filter((x) => x[1] !== p);
  return r() < 0.5 ? mc(X((l) => [`¿Qué porcentaje es la fracción ${f}?`, `Quin percentatge és la fracció ${f}?`, `What percentage is the fraction ${f}?`][l]), S(p), pickN(r, others, 3).map((x) => S(x[1])), T('Busca una fracción equivalente con denominador 100.', 'Busca una fracció equivalent amb denominador 100.', 'Find an equivalent fraction with denominator 100.'))
    : q(X((l) => [`Escribe ${p} como número decimal.`, `Escriu ${p} com a nombre decimal.`, `Write ${p} as a decimal.`][l]), d, pickN(r, others, 3).map((x) => x[2]), T('Divide entre 100: mueve la coma dos lugares a la izquierda.', 'Dividix entre 100: mou la coma dos llocs a l’esquerra.', 'Divide by 100: move the decimal point two places left.'));
};
/** Direct proportion: rule of three, unit value, tables. */
export const proportion = (): Gen => (r) => {
  const ITEMS: [T3, T3][] = [[T('cuadernos', 'quaderns', 'exercise books'), T('€', '€', '€')], [T('kilos de naranjas', 'quilos de taronges', 'kilos of oranges'), T('€', '€', '€')], [T('entradas', 'entrades', 'tickets'), T('€', '€', '€')]];
  const [it] = pick(r, ITEMS); const unit = int(r, 2, 9), a = int(r, 2, 6), b = int(r, 3, 12); if (a === b) return proportion()(r);
  if (r() < 0.6) return q(X((l) => [`${a} ${it[0]} cuestan ${N(l, a * unit)} €. ¿Cuánto cuestan ${b}?`, `${a} ${it[1]} costen ${N(l, a * unit)} €. Quant en costen ${b}?`, `${a} ${it[2]} cost €${N(l, a * unit)}. How much do ${b} cost?`][l]), b * unit, near(r, b * unit, { also: [a * unit + b, b * a, (a * unit * a) / b].filter((x) => Number.isInteger(x) && x > 0) }),
    X((l) => [`Primero halla lo que cuesta 1: ${a * unit} ÷ ${a} = ${unit}. Después multiplica por ${b}.`, `Primer troba el que costa 1: ${a * unit} ÷ ${a} = ${unit}. Després multiplica per ${b}.`, `First find the cost of 1: ${a * unit} ÷ ${a} = ${unit}. Then multiply by ${b}.`][l]), { visual: { type: 'table', head: [it[LIFIX], '€'], rows: [[String(a), String(a * unit)], ['1', '?'], [String(b), '?']] } });
  const k = int(r, 2, 5), x = int(r, 2, 9); return q(X((l) => [`En una tabla de proporcionalidad, 1 → ${k}. ¿Qué corresponde a ${x}?`, `En una taula de proporcionalitat, 1 → ${k}. Què correspon a ${x}?`, `In a proportion table, 1 → ${k}. What goes with ${x}?`][l]), k * x, near(r, k * x, { also: [k + x, x] }), X((l) => [`Cada valor se multiplica por ${k}.`, `Cada valor es multiplica per ${k}.`, `Each value is multiplied by ${k}.`][l]));
};
const LIFIX = 0;
/** Negative numbers: compare, order, temperatures, positions on the line. */
export const negatives = (): Gen => (r) => {
  const k = int(r, 0, 2);
  if (k === 0) { const a = int(r, -15, 10), b = int(r, -15, 10); if (a === b) return negatives()(r); return compareQ(r, [a, b, int(r, -15, 10)].filter((x, i, arr) => arr.indexOf(x) === i), r() < 0.5, T('En la recta, más a la derecha es mayor: −2 es mayor que −7.', 'En la recta, més a la dreta és major: −2 és major que −7.', 'On the number line, further right is bigger: −2 is bigger than −7.'), { visual: line(-15, 10, 1, 5) }); }
  if (k === 1) { const t = int(r, -8, 6), d = int(r, 2, 12), up = r() < 0.5, ans = up ? t + d : t - d; return q(X((l) => [`Por la mañana hay ${N(l, t)} °C. ${up ? 'Sube' : 'Baja'} ${d} grados. ¿Qué temperatura hay ahora?`, `Pel matí fa ${N(l, t)} °C. ${up ? 'Puja' : 'Baixa'} ${d} graus. Quina temperatura fa ara?`, `In the morning it is ${N(l, t)} °C. It ${up ? 'rises' : 'falls'} ${d} degrees. What is the temperature now?`][l]), ans, near(r, ans, { min: -30, also: [-ans, up ? t - d : t + d] }), T('Muévete por la recta: subir es ir a la derecha; bajar, a la izquierda.', 'Mou-te per la recta: pujar és anar a la dreta; baixar, a l’esquerra.', 'Move along the line: rising is right; falling is left.'), { aid: line(-20, 20, 1, 5, t) }); }
  const v = int(r, -9, -1); return q(T('¿Qué número marca la flecha?', 'Quin nombre marca la fletxa?', 'Which number is the arrow pointing to?'), v, near(r, v, { min: -12, also: [-v, v + 1] }), T('A la izquierda del 0 los números son negativos: cuenta hacia la izquierda desde 0.', 'A l’esquerra del 0 els nombres són negatius: compta cap a l’esquerra des de 0.', 'Left of 0 the numbers are negative: count left from 0.'), { visual: line(-10, 5, 1, 5, v), mc: false });
};
/** LCM and HCF of two small numbers. */
export const lcmGcd = (): Gen => (r) => {
  const isL = r() < 0.5; const a = int(r, 2, 12), b = int(r, 2, 15); if (a === b) return lcmGcd()(r); const ans = isL ? lcm(a, b) : gcd(a, b);
  return q(X((l) => isL ? [`m.c.m. (${a}, ${b}) = ?`, `m.c.m. (${a}, ${b}) = ?`, `LCM of ${a} and ${b} = ?`][l] : [`m.c.d. (${a}, ${b}) = ?`, `m.c.d. (${a}, ${b}) = ?`, `HCF of ${a} and ${b} = ?`][l]), ans, near(r, ans, { min: 1, also: [a * b, gcd(a, b), lcm(a, b), Math.max(a, b)].filter((x) => x !== ans) }),
    isL ? T('El mínimo común múltiplo es el número más pequeño que está en las dos tablas.', 'El mínim comú múltiple és el nombre més xicotet que està en les dues taules.', 'The lowest common multiple is the smallest number in both times tables.') : T('El máximo común divisor es el número más grande que divide a los dos.', 'El màxim comú divisor és el nombre més gran que dividix els dos.', 'The highest common factor is the biggest number that divides both.'));
};
/** Order of operations (brackets, × ÷ before + −). */
export const orderOps = (max = 10): Gen => (r) => {
  const a = int(r, 2, max), b = int(r, 2, max), c = int(r, 2, max), k = int(r, 0, 2);
  if (k === 0) return q(X((l) => `${N(l, a)} + ${N(l, b)} × ${N(l, c)} = ?`), a + b * c, near(r, a + b * c, { also: [(a + b) * c] }), T('Primero se multiplica, después se suma.', 'Primer es multiplica, després se suma.', 'Multiply first, then add.'));
  if (k === 1) return q(X((l) => `(${N(l, a)} + ${N(l, b)}) × ${N(l, c)} = ?`), (a + b) * c, near(r, (a + b) * c, { also: [a + b * c] }), T('Primero lo que hay dentro del paréntesis.', 'Primer el que hi ha dins del parèntesi.', 'Brackets first.'));
  const big = a * b + c; return q(X((l) => `${N(l, big)} − ${N(l, a)} × ${N(l, b)} = ?`), c, near(r, c, { also: [(big - a) * b].filter((x) => x > 0), min: 0 }), T('La multiplicación va antes que la resta.', 'La multiplicació va abans que la resta.', 'Multiplication comes before subtraction.'));
};
/** Circle: circumference and area with π ≈ 3,14. */
export const circle = (kinds: ('len' | 'area')[]): Gen => (r) => {
  const k = pick(r, kinds), rad = int(r, 1, 10), useD = k === 'len' && r() < 0.5;
  if (k === 'len') { const L = round(2 * 3.14 * rad, 2); return q(X((l) => useD ? [`¿Cuánto mide la circunferencia de diámetro ${N(l, 2 * rad)} cm? (π ≈ ${N(l, 3.14)})`, `Quant mesura la circumferència de diàmetre ${N(l, 2 * rad)} cm? (π ≈ ${N(l, 3.14)})`, `What is the circumference of a circle with diameter ${N(l, 2 * rad)} cm? (π ≈ ${N(l, 3.14)})`][l] : [`¿Cuánto mide la circunferencia de radio ${N(l, rad)} cm? (π ≈ ${N(l, 3.14)})`, `Quant mesura la circumferència de radi ${N(l, rad)} cm? (π ≈ ${N(l, 3.14)})`, `What is the circumference of a circle with radius ${N(l, rad)} cm? (π ≈ ${N(l, 3.14)})`][l]), L,
    [round(3.14 * rad, 2), round(3.14 * rad * rad, 2), round(4 * 3.14 * rad, 2)].filter((x) => x !== L), T('Longitud = π × diámetro = 2 × π × radio.', 'Longitud = π × diàmetre = 2 × π × radi.', 'Circumference = π × diameter = 2 × π × radius.'), { mc: true }); }
  const A = round(3.14 * rad * rad, 2); return q(X((l) => [`¿Cuál es el área de un círculo de radio ${N(l, rad)} cm? (π ≈ ${N(l, 3.14)})`, `Quina és l’àrea d’un cercle de radi ${N(l, rad)} cm? (π ≈ ${N(l, 3.14)})`, `What is the area of a circle with radius ${N(l, rad)} cm? (π ≈ ${N(l, 3.14)})`][l]), A,
    [round(2 * 3.14 * rad, 2), round(3.14 * 2 * rad * 2 * rad, 2), round(3.14 * rad, 2)].filter((x) => x !== A), T('Área = π × radio × radio.', 'Àrea = π × radi × radi.', 'Area = π × radius × radius.'), { mc: true });
};
/** Volume of cuboids and unit conversions of volume/capacity. */
export const volume = (): Gen => (r) => {
  const a = int(r, 2, 8), b = int(r, 2, 8), c = int(r, 2, 8);
  if (r() < 0.6) return q(X((l) => [`¿Cuál es el volumen de una caja de ${a} cm × ${b} cm × ${c} cm (en cm³)?`, `Quin és el volum d’una caixa de ${a} cm × ${b} cm × ${c} cm (en cm³)?`, `What is the volume of a ${a} cm × ${b} cm × ${c} cm box (in cm³)?`][l]), a * b * c, near(r, a * b * c, { also: [a + b + c, a * b, 2 * (a * b + b * c + a * c)] }), T('Volumen = largo × ancho × alto.', 'Volum = llarg × ample × alt.', 'Volume = length × width × height.'));
  const L = int(r, 1, 9); return q(X((l) => [`Un acuario de ${L} dm³, ¿cuántos litros de agua caben?`, `Un aquari de ${L} dm³, quants litres d’aigua hi caben?`, `A ${L} dm³ fish tank: how many litres of water does it hold?`][l]), L, [L * 10, L * 1000, L * 100], T('1 dm³ = 1 litro.', '1 dm³ = 1 litre.', '1 dm³ = 1 litre.'));
};
/** Scales on maps and plans. */
export const scale = (): Gen => (r) => {
  const s = pick(r, [100, 200, 500, 1000, 50000, 100000]), cm = int(r, 2, 12); const realCm = cm * s;
  const unit = s >= 50000 ? 'km' : 'm', real = s >= 50000 ? realCm / 100000 : realCm / 100;
  return q(X((l) => [`En un ${s >= 50000 ? 'mapa' : 'plano'} a escala 1:${N(l, s)}, una distancia mide ${cm} cm. ¿Cuántos ${unit} mide en la realidad?`, `En un ${s >= 50000 ? 'mapa' : 'plànol'} a escala 1:${N(l, s)}, una distància mesura ${cm} cm. Quants ${unit} mesura en la realitat?`, `On a ${s >= 50000 ? 'map' : 'plan'} at a scale of 1:${N(l, s)}, a distance is ${cm} cm. How many ${unit} is it in real life?`][l]), real,
    near(r, real, { also: [real * 10, real / 10, cm * s], step: real || 1 }).filter((x) => x > 0), X((l) => [`Cada cm del ${s >= 50000 ? 'mapa' : 'plano'} son ${N(l, s)} cm reales. Multiplica y pasa a ${unit}.`, `Cada cm del ${s >= 50000 ? 'mapa' : 'plànol'} són ${N(l, s)} cm reals. Multiplica i passa a ${unit}.`, `Each cm on the ${s >= 50000 ? 'map' : 'plan'} is ${N(l, s)} cm in real life. Multiply and convert to ${unit}.`][l]));
};
/** Two-way tables and tree diagrams: count outcomes. */
export const combos = (): Gen => (r) => {
  const a = int(r, 2, 4), b = int(r, 2, 4);
  const opts: [T3, T3][] = [[T('camisetas', 'samarretes', 'T-shirts'), T('pantalones', 'pantalons', 'pairs of trousers')], [T('primeros platos', 'primers plats', 'starters'), T('postres', 'postres', 'desserts')], [T('sabores de helado', 'sabors de gelat', 'ice-cream flavours'), T('tipos de cucurucho', 'tipus de cucurutxo', 'kinds of cone')]];
  const [x, y] = pick(r, opts);
  return q(X((l) => [`Tengo ${a} ${x[0]} y ${b} ${y[0]}. ¿Cuántas combinaciones distintas puedo hacer con uno de cada?`, `Tinc ${a} ${x[1]} i ${b} ${y[1]}. Quantes combinacions diferents puc fer amb un de cada?`, `I have ${a} ${x[2]} and ${b} ${y[2]}. How many different combinations can I make with one of each?`][l]), a * b, near(r, a * b, { also: [a + b, a * b + 1] }),
    X((l) => [`Haz un diagrama de árbol: de cada una de las ${a} salen ${b} ramas. ${a} × ${b}.`, `Fes un diagrama d’arbre: de cadascuna de les ${a} ixen ${b} branques. ${a} × ${b}.`, `Draw a tree diagram: each of the ${a} has ${b} branches. ${a} × ${b}.`][l]),
    { visual: { type: 'table', head: ['', ...Array.from({ length: b }, (_, j) => String.fromCharCode(65 + j))], rows: Array.from({ length: a }, (_, i) => [String(i + 1), ...Array.from({ length: b }, (_, j) => `${i + 1}${String.fromCharCode(65 + j)}`)]) } });
};
/** Divisibility rules (2, 3, 5, 9, 10). */
export const divisibility = (): Gen => (r) => {
  const d = pick(r, [2, 3, 5, 9, 10]); const yes = r() < 0.5; let n = int(r, 100, 999); if (yes) n = n - (n % d); else if (n % d === 0) n += 1;
  const RULE: Record<number, T3> = { 2: T('Es divisible por 2 si acaba en cifra par.', 'És divisible per 2 si acaba en xifra parell.', 'It divides by 2 if it ends in an even digit.'), 3: T('Es divisible por 3 si la suma de sus cifras es múltiplo de 3.', 'És divisible per 3 si la suma de les xifres és múltiple de 3.', 'It divides by 3 if its digits add up to a multiple of 3.'), 5: T('Es divisible por 5 si acaba en 0 o en 5.', 'És divisible per 5 si acaba en 0 o en 5.', 'It divides by 5 if it ends in 0 or 5.'), 9: T('Es divisible por 9 si la suma de sus cifras es múltiplo de 9.', 'És divisible per 9 si la suma de les xifres és múltiple de 9.', 'It divides by 9 if its digits add up to a multiple of 9.'), 10: T('Es divisible por 10 si acaba en 0.', 'És divisible per 10 si acaba en 0.', 'It divides by 10 if it ends in 0.') };
  const ok = n % d === 0;
  return mc(X((l) => [`¿Es ${N(l, n)} divisible por ${d}?`, `${N(l, n)} és divisible per ${d}?`, `Is ${N(l, n)} divisible by ${d}?`][l]), ok ? T('Sí', 'Sí', 'Yes') : T('No', 'No', 'No'), [ok ? T('No', 'No', 'No') : T('Sí', 'Sí', 'Yes')], RULE[d]);
};
/** Area units: m², dm², cm² (each step ×100). */
export const areaUnits = (): Gen => (r) => {
  const P: [string, string, number][] = [['m²', 'dm²', 100], ['dm²', 'cm²', 100], ['m²', 'cm²', 10000], ['km²', 'hm²', 100], ['ha', 'm²', 10000]];
  const [a, b, f] = pick(r, P); const v = int(r, 1, 9), down = r() < 0.6;
  return down ? q(X((l) => `${N(l, v)} ${a} = ? ${b}`), v * f, [v * f / 10, v * f * 10, v * 10, v * 100].filter((x) => x !== v * f), X((l) => [`En superficie cada escalón es × 100. De ${a} a ${b}: × ${N(l, f)}.`, `En superfície cada graó és × 100. De ${a} a ${b}: × ${N(l, f)}.`, `For area each step is × 100. From ${a} to ${b}: × ${N(l, f)}.`][l]))
    : q(X((l) => `${N(l, v * f)} ${b} = ? ${a}`), v, [v * 10, v * 100, round(v / 10, 2)].filter((x) => x !== v), X((l) => [`En superficie cada escalón es ÷ 100. De ${b} a ${a}: ÷ ${N(l, f)}.`, `En superfície cada graó és ÷ 100. De ${b} a ${a}: ÷ ${N(l, f)}.`, `For area each step is ÷ 100. From ${b} to ${a}: ÷ ${N(l, f)}.`][l]));
};
/** Similar shapes: scale factor and missing side. */
export const similar = (): Gen => (r) => {
  const k = int(r, 2, 4), a = int(r, 2, 8), b = int(r, 2, 8);
  return q(X((l) => [`Un rectángulo de ${a} × ${b} cm se amplía al ${k === 2 ? 'doble' : k === 3 ? 'triple' : 'cuádruple'}. ¿Cuánto mide el lado que medía ${a} cm?`, `Un rectangle de ${a} × ${b} cm s’amplia al ${k === 2 ? 'doble' : k === 3 ? 'triple' : 'quàdruple'}. Quant mesura el costat que mesurava ${a} cm?`, `An ${a} × ${b} cm rectangle is enlarged ${k === 2 ? 'to double size' : k === 3 ? 'to three times the size' : 'to four times the size'}. How long is the side that was ${a} cm?`][l]), a * k, near(r, a * k, { also: [a + k, b * k, a * k * k] }),
    X((l) => [`En figuras semejantes todos los lados se multiplican por el mismo número (×${k}).`, `En figures semblants tots els costats es multipliquen pel mateix nombre (×${k}).`, `In similar shapes every side is multiplied by the same number (×${k}).`][l]), { visual: { type: 'shape', pts: [[0, 0], [a, 0], [a, b], [0, b]], labels: [String(a), String(b), '', ''] } });
};
/** Probability as a number from 0 to 1 (or as a fraction). */
export const probScale = (): Gen => (r) => {
  const n = int(r, 4, 10), f = int(r, 0, n); const g = gcd(f, n);
  const ans = f === 0 ? '0' : f === n ? '1' : `${f / g}/${n / g}`;
  return q(X((l) => [`En una bolsa hay ${n} bolas y ${f} son rojas. ¿Cuál es la probabilidad de sacar roja? (0, 1 o una fracción simplificada)`, `En una bossa hi ha ${n} boles i ${f} són roges. Quina és la probabilitat de traure roja? (0, 1 o una fracció simplificada)`, `A bag holds ${n} balls and ${f} are red. What is the probability of red? (0, 1 or a fraction in its simplest form)`][l]), ans,
    [`${n - f}/${n}`, `${f}/${n - f || 1}`, f === 0 ? '1' : '0', `1/${n}`].filter((x) => x !== ans && x !== `${f}/${n}`), T('Probabilidad = casos favorables ÷ casos posibles. Imposible = 0; seguro = 1.', 'Probabilitat = casos favorables ÷ casos possibles. Impossible = 0; segur = 1.', 'Probability = favourable outcomes ÷ possible outcomes. Impossible = 0; certain = 1.'), { visual: { type: 'emoji', rows: ['🔴'.repeat(f) + '⚪'.repeat(n - f)] } });
};
/** Relative frequency from an experiment. */
export const relFreq = (): Gen => (r) => {
  const n = pick(r, [10, 20, 50, 100]), h = int(r, 1, n - 1); const g = gcd(h, n);
  return q(X((l) => [`Lanzo una chincheta ${n} veces y cae con la punta hacia arriba ${h} veces. ¿Cuál es la frecuencia relativa de «punta arriba»? (fracción simplificada)`, `Llance una xinxeta ${n} vegades i cau amb la punta cap amunt ${h} vegades. Quina és la freqüència relativa de «punta amunt»? (fracció simplificada)`, `I drop a drawing pin ${n} times and it lands point up ${h} times. What is the relative frequency of "point up"? (simplest form)`][l]), `${h / g}/${n / g}`,
    [`${n - h}/${n}`, `${h}/${n - h}`, `1/${h}`].filter((x) => x !== `${h / g}/${n / g}`), T('Frecuencia relativa = veces que pasa ÷ veces que lo intento. Con muchas pruebas, se acerca a la probabilidad.', 'Freqüència relativa = vegades que passa ÷ vegades que ho intente. Amb moltes proves, s’acosta a la probabilitat.', 'Relative frequency = times it happens ÷ number of tries. With many tries it gets close to the probability.'));
};
/** Pie charts: what part of the whole, or how many people. */
export const pieChart = (): Gen => (r) => {
  const d = pick(r, [2, 4, 8, 10]), n = int(r, 1, d - 1), tot = d * int(r, 2, 10), ans = (tot / d) * n; const g = gcd(n, d);
  return q(X((l) => [`El sector coloreado es ${n / g}/${d / g} del círculo. Si respondieron ${tot} personas, ¿cuántas eligieron esa opción?`, `El sector acolorit és ${n / g}/${d / g} del cercle. Si van respondre ${tot} persones, quantes van triar eixa opció?`, `The shaded slice is ${n / g}/${d / g} of the circle. If ${tot} people answered, how many chose that option?`][l]), ans, near(r, ans, { also: [tot - ans, tot / d], min: 1 }),
    X((l) => [`${n / g}/${d / g} de ${tot}: divide ${tot} entre ${d / g} y multiplica por ${n / g}.`, `${n / g}/${d / g} de ${tot}: dividix ${tot} entre ${d / g} i multiplica per ${n / g}.`, `${n / g}/${d / g} of ${tot}: divide ${tot} by ${d / g} and multiply by ${n / g}.`][l]), { visual: { type: 'frac', n, d, shape: 'circle' } });
};
/** Spreadsheet formulas with cells. */
export const spreadsheet = (): Gen => (r) => {
  const a = int(r, 2, 20), b = int(r, 2, 20), c = int(r, 2, 9); const k = int(r, 0, 3);
  const v: Visual = { type: 'table', head: ['', 'A', 'B', 'C'], rows: [['1', String(a), String(b), String(c)]] };
  const F: [string, number][] = [['=A1+B1', a + b], ['=A1*C1', a * c], ['=SUMA(A1:C1)', a + b + c], ['=B1-C1', b - c]];
  const [f, ans] = F[k];
  return q(X((l) => [`En la hoja de cálculo, ¿qué número aparece en la celda con la fórmula ${l === 2 ? f.replace('SUMA', 'SUM') : l === 1 ? f : f}?`, `En el full de càlcul, quin nombre apareix en la cel·la amb la fórmula ${f}?`, `In the spreadsheet, what number appears in a cell with the formula ${f.replace('SUMA', 'SUM')}?`][l]), ans,
    near(r, ans, { also: [a + b + c, a * b, a + c].filter((x) => x !== ans), min: -20 }), T('Cada celda se nombra por su columna (letra) y su fila (número). Sustituye y calcula. * es multiplicar.', 'Cada cel·la es nomena per la columna (lletra) i la fila (nombre). Substituïx i calcula. * és multiplicar.', 'Each cell is named by its column (letter) and row (number). Substitute and calculate. * means multiply.'), { visual: v });
};
