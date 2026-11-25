// Helpers for writing lesson content: texts in three languages, numbers as each language writes them,
// wrong options that are typical mistakes, and small builders for common exercise shapes.
import type { Lang } from '@/engine/types';
import { int, shuffle } from '@/engine/rng';
import { num } from './index';
import type { Ans, Q, T3 } from './types';

export type Li = 0 | 1 | 2;
export type R = () => number;
const LANGS: Lang[] = ['es', 'ca', 'en'];
export { int, shuffle };

/** A text in castellano, valencià and English. */
export const T = (es: string, ca: string, en: string): T3 => [es, ca, en];
/** A text built for each language (numbers and words change with the language). */
export const X = (f: (l: Li) => string): T3 => [f(0), f(1), f(2)];
/** A number as language l writes it. */
export const N = (l: Li, v: number) => num(LANGS[l], v);
/** The same text (emoji, symbols, formulas) in the three languages. */
export const S = (s: string): T3 => [s, s, s];
export const pick = <V,>(r: R, xs: readonly V[]): V => xs[int(r, 0, xs.length - 1)];
/** Several different elements of a list. */
export const pickN = <V,>(r: R, xs: readonly V[], n: number): V[] => shuffle(r, [...xs]).slice(0, n);
export const round = (v: number, d = 2) => Math.round(v * 10 ** d) / 10 ** d;
export const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));
export const lcm = (a: number, b: number) => (a / gcd(a, b)) * b;

/** Wrong numbers near the answer (typical slips: ±1, ±2, ±10), all different, never equal to the answer. */
export function near(r: R, a: number, { spread = 3, min = 0, max = Infinity, step = 1, also = [] as number[], n = 3 } = {}): number[] {
  const out = new Set<number>();
  for (const v of also) if (v !== a && v >= min && v <= max && Number.isFinite(v)) out.add(round(v, 6));
  let guard = 0;
  while (out.size < n && guard++ < 200) {
    const v = round(a + int(r, 1, spread) * step * (r() < 0.5 ? -1 : 1), 6);
    if (v !== a && v >= min && v <= max) out.add(v);
  }
  for (let v = a + step; out.size < n; v = round(v + step, 6)) if (v !== a) out.add(v);
  return [...out];
}

/** Build an exercise. */
export const q = (qq: T3, a: Ans, wrong: Ans[], hint: T3, extra: Partial<Q> = {}): Q => ({ q: qq, a, wrong, hint, ...extra });

/** A written multiple-choice exercise: question, right answer, wrong answers, hint (all in three languages). */
export const mc = (qq: T3, a: T3, wrong: T3[], hint: T3, extra: Partial<Q> = {}): Q => ({ q: qq, a, wrong, hint, ...extra });

/** Yes/no-style answers used in many lessons. */
export const YES = T('Sí', 'Sí', 'Yes'), NO = T('No', 'No', 'No');
export const TRUE = T('Verdadero', 'Vertader', 'True'), FALSE = T('Falso', 'Fals', 'False');
/** True or false: the statement and whether it is true. The third option makes level 2 a little harder. */
export const tf = (statement: T3, isTrue: boolean, hint: T3): Q =>
  ({ q: X((l) => [`¿Verdadero o falso? ${statement[0]}`, `Vertader o fals? ${statement[1]}`, `True or false? ${statement[2]}`][l]), a: isTrue ? TRUE : FALSE, wrong: [isTrue ? FALSE : TRUE, T('No se puede saber', 'No es pot saber', "You can't tell"), T('Depende del día', 'Depén del dia', 'It depends on the day')], hint });

/* ───── Names and objects for word problems (short, everyday, mixed genders) ───── */
export const NAMES = ['Ana', 'Pau', 'Lucía', 'Marc', 'Sara', 'Hugo', 'Aina', 'Leo', 'Nora', 'Iker', 'Vera', 'Joel', 'Carla', 'Àlex', 'Emma', 'Ian'];
/** Countable objects (all feminine in castellano and valencià, so «¿cuántas?» / «quantes?» always agree): singular and plural in each language, and an emoji. */
export const THINGS: { w: [string, string, string, string, string, string]; e: string }[] = [
  { w: ['manzana', 'manzanas', 'poma', 'pomes', 'apple', 'apples'], e: '🍎' },
  { w: ['canica', 'canicas', 'bala', 'bales', 'marble', 'marbles'], e: '🔵' },
  { w: ['pegatina', 'pegatinas', 'enganxina', 'enganxines', 'sticker', 'stickers'], e: '⭐' },
  { w: ['cera', 'ceras', 'cera', 'ceres', 'crayon', 'crayons'], e: '🖍️' },
  { w: ['galleta', 'galletas', 'galeta', 'galetes', 'biscuit', 'biscuits'], e: '🍪' },
  { w: ['fresa', 'fresas', 'maduixa', 'maduixes', 'strawberry', 'strawberries'], e: '🍓' },
  { w: ['castaña', 'castañas', 'castanya', 'castanyes', 'chestnut', 'chestnuts'], e: '🌰' },
  { w: ['pelota', 'pelotas', 'pilota', 'pilotes', 'ball', 'balls'], e: '⚽' },
  { w: ['flor', 'flores', 'flor', 'flors', 'flower', 'flowers'], e: '🌼' },
  { w: ['concha', 'conchas', 'petxina', 'petxines', 'shell', 'shells'], e: '🐚' },
];
/** The word for n objects in language l ("1 manzana", "5 manzanas"). */
export const thing = (l: Li, t: (typeof THINGS)[number], n: number) => `${N(l, n)} ${t.w[l * 2 + (n === 1 ? 0 : 1)]}`;
export const thingWord = (l: Li, t: (typeof THINGS)[number], plural = true) => t.w[l * 2 + (plural ? 1 : 0)];
/** Emoji in rows of up to `per` (rows of 5 or 10 are easier to count). */
export const rowsOf = (e: string, n: number, per = 5) => Array.from({ length: Math.ceil(n / per) }, (_, i) => e.repeat(Math.min(per, n - i * per)));

/* ───── Common answers in three languages ───── */
export const DAYS: T3[] = [T('lunes', 'dilluns', 'Monday'), T('martes', 'dimarts', 'Tuesday'), T('miércoles', 'dimecres', 'Wednesday'), T('jueves', 'dijous', 'Thursday'), T('viernes', 'divendres', 'Friday'), T('sábado', 'dissabte', 'Saturday'), T('domingo', 'diumenge', 'Sunday')];
export const MONTHS: T3[] = [T('enero', 'gener', 'January'), T('febrero', 'febrer', 'February'), T('marzo', 'març', 'March'), T('abril', 'abril', 'April'), T('mayo', 'maig', 'May'), T('junio', 'juny', 'June'), T('julio', 'juliol', 'July'), T('agosto', 'agost', 'August'), T('septiembre', 'setembre', 'September'), T('octubre', 'octubre', 'October'), T('noviembre', 'novembre', 'November'), T('diciembre', 'desembre', 'December')];

/* ───── Builders for common number exercises ───── */

/** a + b with hint "make ten" or "add the tens, then the ones". */
export function addQ(r: R, a: number, b: number, extra: Partial<Q> = {}): Q {
  const s = a + b;
  const hint = a + b <= 20 && a < 10 && b < 10 && s > 10
    ? X((l) => [`Completa la decena: ${a} + ${10 - a} = 10, y te quedan ${b - (10 - a)}.`, `Completa la desena: ${a} + ${10 - a} = 10, i et queden ${b - (10 - a)}.`, `Make ten: ${a} + ${10 - a} = 10, and ${b - (10 - a)} more.`][l])
    : s < 20 ? X((l) => [`Empieza por el número mayor y cuenta ${Math.min(a, b)} hacia delante.`, `Comença pel nombre major i compta ${Math.min(a, b)} cap avant.`, `Start from the bigger number and count on ${Math.min(a, b)}.`][l])
      : X((l) => [`Suma primero las decenas y después las unidades.`, `Suma primer les desenes i després les unitats.`, `Add the tens first, then the ones.`][l]);
  return q(X((l) => `${N(l, a)} + ${N(l, b)} = ?`), s, near(r, s, { also: [s + 1, s - 1, s + 10, s - 10].filter((x) => x >= 0), spread: 2 }), hint, extra);
}
/** a − b with hint "count back" or "subtract tens then ones". */
export function subQ(r: R, a: number, b: number, extra: Partial<Q> = {}): Q {
  const d = a - b;
  const hint = a <= 20 && a > 10 && b < 10 && a - 10 < b
    ? X((l) => [`Baja primero hasta 10 (quita ${a - 10}) y luego quita ${b - (a - 10)} más.`, `Baixa primer fins a 10 (lleva ${a - 10}) i després lleva ${b - (a - 10)} més.`, `Go down to 10 first (take away ${a - 10}), then take away ${b - (a - 10)} more.`][l])
    : a <= 20 ? X((l) => [`Cuenta hacia atrás ${b} desde ${a}, o piensa: ¿cuánto le falta a ${b} para llegar a ${a}?`, `Compta cap arrere ${b} des de ${a}, o pensa: quant li falta a ${b} per a arribar a ${a}?`, `Count back ${b} from ${a}, or think: how far is it from ${b} up to ${a}?`][l])
      : X((l) => [`Resta primero las decenas y después las unidades. Si no puedes, cambia una decena por 10 unidades.`, `Resta primer les desenes i després les unitats. Si no pots, canvia una desena per 10 unitats.`, `Take away the tens first, then the ones. If you can't, exchange a ten for 10 ones.`][l]);
  return q(X((l) => `${N(l, a)} − ${N(l, b)} = ?`), d, near(r, d, { also: [d + 1, d - 1, d + 10, a + b].filter((x) => x >= 0), spread: 2 }), hint, extra);
}
export function mulQ(r: R, a: number, b: number, extra: Partial<Q> = {}): Q {
  const p = a * b;
  return q(X((l) => `${N(l, a)} × ${N(l, b)} = ?`), p, near(r, p, { also: [p + a, p - a, p + b, a + b].filter((x) => x > 0 && x !== p), spread: 3 }),
    X((l) => [`${a} × ${b} son ${b} grupos de ${a}. Si te sabes ${a} × ${b - 1}, súmale ${a}.`, `${a} × ${b} són ${b} grups de ${a}. Si saps ${a} × ${b - 1}, suma-li ${a}.`, `${a} × ${b} is ${b} groups of ${a}. If you know ${a} × ${b - 1}, add ${a}.`][l]), extra);
}
export function divQ(r: R, a: number, b: number, extra: Partial<Q> = {}): Q {
  const c = a / b;
  return q(X((l) => `${N(l, a)} ÷ ${N(l, b)} = ?`), c, near(r, c, { also: [c + 1, c - 1, b], min: 1, spread: 2 }),
    X((l) => [`Piensa en la multiplicación: ¿qué número por ${b} da ${a}?`, `Pensa en la multiplicació: quin nombre per ${b} dona ${a}?`, `Think of multiplication: what number times ${b} makes ${a}?`][l]), extra);
}
/** Which is bigger/smaller of some numbers (always multiple choice). */
export function compareQ(_r: R, nums: number[], bigger: boolean, hint: T3, extra: Partial<Q> = {}): Q {
  const a = bigger ? Math.max(...nums) : Math.min(...nums);
  return q(X((l) => [bigger ? '¿Cuál es el número mayor?' : '¿Cuál es el número menor?', bigger ? 'Quin és el nombre major?' : 'Quin és el nombre menor?', bigger ? 'Which number is the biggest?' : 'Which number is the smallest?'][l]),
    a, nums.filter((x) => x !== a), hint, { mc: true, visual: { type: 'emoji', rows: [nums.map((x) => String(x)).join('   ')] }, ...extra });
}
