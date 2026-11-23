import type { Item, Msg, Station, Visual } from '@/engine/types';
import { int, optionsAround, shuffle } from '@/engine/rng';
import { PROBLEM_STATIONS } from './problems';

const range = (a: number, b: number, step = 1) => { const out: number[] = []; for (let v = a; v <= b; v += step) out.push(v); return out; };
type LineV = Extract<Visual, { type: 'line' }>;
const line = (min: number, max: number, every: number, labelEvery: number, extra: Partial<LineV> = {}): LineV =>
  ({ type: 'line', min, max, marks: range(min, max, every), labels: range(min, max, labelEvery), ...extra });
const pick = <T,>(r: () => number, xs: T[]): T => xs[int(r, 0, xs.length - 1)];

/** Three different options near the answer, inside [lo, hi], in order. */
function opts3(r: () => number, answer: number, spread: number, lo: number, hi: number, step = 1): number[] {
  const set = new Set<number>([answer]);
  let guard = 0;
  while (set.size < 3 && guard++ < 200) {
    const v = answer + int(r, 1, spread) * step * (r() < 0.5 ? -1 : 1);
    if (v >= lo && v <= hi) set.add(v);
  }
  for (let v = lo; set.size < 3; v += step) set.add(v);
  return [...set].sort((a, b) => a - b);
}

/* Common question shapes used by several stations (the number line is the same model every time) */

/** "Put n on the line": the guided version shows every mark; on your own only the ends (and the middle on long lines). */
function place(L: LineV, t: number, tol: number, hint: Msg, guided: boolean, sparse: number[]): Item {
  return guided
    ? { kind: 'place', min: L.min, max: L.max, marks: L.marks, labels: L.labels, target: t, tol: 0, prompt: { key: 'qPlace', vars: { n: t } }, hint }
    : { kind: 'place', min: L.min, max: L.max, marks: sparse, labels: sparse, target: t, tol, aidMarks: L.marks, aidLabels: L.labels, prompt: { key: 'qPlace', vars: { n: t } }, hint };
}
/** "Which number is the arrow pointing to?" */
function read(r: () => number, L: LineV, t: number, step: number, guided: boolean): Item {
  const shown = guided ? L : { ...L, labels: [L.min, (L.min + L.max) / 2, L.max] };
  return { kind: 'choice', options: opts3(r, t, 3, L.min + step, L.max - step, step), answer: t, prompt: { key: 'qA6' }, hint: { key: 'hRead' },
    visual: { ...shown, point: t }, aid: { ...L, point: t } };
}
/** "Which number comes between a and b?" */
function between(t: number, L: LineV, guided: boolean): Item {
  return { kind: 'number', answer: t, prompt: { key: 'qBetween', vars: { a: t - 1, b: t + 1 } }, hint: { key: 'hBetween', vars: { a: t - 1 } },
    visual: guided ? { ...L, point: t - 1 } : undefined, aid: { ...L, point: t - 1 } };
}
/** "Is n closer to a or to b?" */
function closer(n: number, a: number, b: number, L: LineV): Item {
  return { kind: 'choice', options: [a, b], answer: Math.abs(n - a) < Math.abs(n - b) ? a : b, prompt: { key: 'qCloser', vars: { n, a, b } }, hint: { key: 'hCloser', vars: { n } },
    aid: { ...L, point: n } };
}

/** "From a, make b jumps to the right/left. Where do you land?" */
function jumpOn(r: () => number, L: LineV): Item {
  const right = r() < 0.5, b = int(r, 1, Math.min(5, (L.max - L.min) / 2));
  const a = right ? int(r, L.min, L.max - b) : int(r, L.min + b, L.max);
  return { kind: 'number', answer: right ? a + b : a - b, prompt: { key: right ? 'qJumpR' : 'qJumpL', vars: { a, b } }, hint: { key: right ? 'hJumpR' : 'hJumpL' },
    aid: { ...L, point: a }, thread: { min: L.min, max: L.max, start: a, step: 1 } };
}

/* ───────────── Island A: the number line and number sense ───────────── */

const A1: Station = {
  id: 'A1', island: 'A', title: { key: 'st_A1' },
  model: () => ({ steps: [
    { say: { key: 'mA1_1' }, visual: { type: 'dots', groups: [4, 7] } },
    { say: { key: 'mA1_2' }, visual: { type: 'dots', groups: [4, 7] } },
    { say: { key: 'mA1_3' }, visual: line(0, 10, 1, 1, { jumps: [[0, 4], [0, 7]] }) },
  ] }),
  make: (r, guided): Item => {
    const max = guided ? 10 : pick(r, [10, 20, 20, 50, 100]);
    const n = guided ? 2 : pick(r, [2, 2, 3]);
    const small = r() < 0.4;
    const set = new Set<number>(); while (set.size < n) set.add(int(r, 0, max));
    const nums = shuffle(r, [...set]);
    const answer = small ? Math.min(...nums) : Math.max(...nums);
    const L = max <= 20 ? line(0, max, 1, max === 10 ? 5 : 10) : line(0, max, max / 10, max / 2);
    return { kind: 'choice', options: nums, answer, prompt: { key: small ? 'qA1s' : 'qA1' }, hint: { key: small ? 'hA1s' : 'hA1' },
      visual: guided ? { type: 'dots', groups: nums } : undefined, aid: max <= 10 ? { type: 'dots', groups: nums } : { ...L, jumps: nums.filter((x) => x > 0).map((x) => [0, x] as [number, number]) } };
  },
};

const A2: Station = {
  id: 'A2', island: 'A', title: { key: 'st_A2' },
  model: () => ({ steps: [
    { say: { key: 'mA2_1' }, visual: line(0, 10, 1, 10) },
    { say: { key: 'mA2_2' }, visual: line(0, 10, 1, 5) },
    { say: { key: 'mA2_3' }, visual: line(0, 10, 1, 5, { point: 7, jumps: [[5, 7]] }) },
  ] }),
  make: (r, guided): Item => {
    const L = line(0, 10, 1, 5), f = guided ? 0 : int(r, 0, 5), t = int(r, 1, 9);
    if (f === 5) return jumpOn(r, L);
    if (f <= 1) return place(L, t, 0.5, { key: 'hA2' }, guided, [0, 10]);
    if (f === 2) return read(r, L, t, 1, guided);
    if (f === 3) return between(t, L, guided);
    return closer(t === 5 ? 3 : t, 0, 10, L);
  },
};

const A3: Station = {
  id: 'A3', island: 'A', title: { key: 'st_A3' },
  model: () => ({ steps: [
    { say: { key: 'mA3_1' }, visual: line(0, 20, 1, 10) },
    { say: { key: 'mA3_2' }, visual: line(0, 20, 1, 10, { point: 13, jumps: [[10, 13]] }) },
  ] }),
  make: (r, guided): Item => {
    const L = line(0, 20, 1, 10), f = guided ? 0 : int(r, 0, 5);
    let t = int(r, 1, 19); if (t === 10) t = 14;
    if (f === 5) return jumpOn(r, L);
    if (f <= 1) return place(L, t, 1, { key: 'hA3' }, guided, [0, 10, 20]);
    if (f === 2) return read(r, L, t, 1, guided);
    if (f === 3) return between(t, L, guided);
    const near = t === 5 || t === 15 ? t + 1 : t;
    return near < 10 ? closer(near, 0, 10, L) : closer(near, 10, 20, L);
  },
};

const A4: Station = {
  id: 'A4', island: 'A', title: { key: 'st_A4' },
  model: () => ({ steps: [
    { say: { key: 'mA4_1' }, visual: { type: 'tens', tens: 3, ones: 0 } },
    { say: { key: 'mA4_2' }, visual: { type: 'tens', tens: 3, ones: 4 } },
    { say: { key: 'mA4_3' }, visual: { type: 'tens', tens: 3, ones: 4 } },
  ] }),
  make: (r, guided): Item => {
    const tens = int(r, 1, 9), ones = int(r, 0, 9), n = tens * 10 + ones, f = guided ? 0 : int(r, 0, 4);
    const pic: Visual = { type: 'tens', tens, ones };
    const hint: Msg = { key: 'hA4', vars: { t: tens, o: ones } };
    if (f === 0) return { kind: 'number', answer: n, prompt: { key: 'qA4' }, hint, visual: pic };
    if (f === 1) {
      // the classic trap: the digits swapped
      const o = new Set([n, ones * 10 + tens, tens + ones]); for (let v = n + 1; o.size < 3; v++) o.add(v);
      return { kind: 'choice', options: [...o].sort((a, b) => a - b), answer: n, prompt: { key: 'qA4' }, hint, visual: pic };
    }
    if (f === 2) return { kind: 'number', answer: n, prompt: { key: 'qTensOnes', vars: { t: tens, o: ones } }, hint, aid: pic };
    if (f === 3) return { kind: 'number', answer: tens, prompt: { key: 'qHowManyTens', vars: { n } }, hint: { key: 'hTensDigit', vars: { n } }, aid: pic };
    return { kind: 'number', answer: ones, prompt: { key: 'qHowManyOnes', vars: { n } }, hint: { key: 'hOnesDigit', vars: { n } }, aid: pic };
  },
};

const A5: Station = {
  id: 'A5', island: 'A', title: { key: 'st_A5' },
  model: () => ({ steps: [
    { say: { key: 'mA5_1' }, visual: line(0, 100, 10, 50) },
    { say: { key: 'mA5_2' }, visual: line(0, 100, 10, 50, { point: 63, jumps: [[50, 60], [60, 63]] }) },
  ] }),
  make: (r, guided): Item => {
    const L = line(0, 100, 10, 10), f = guided ? 0 : int(r, 0, 3);
    let t = int(r, 3, 97); if (t % 10 === 0) t += 3;
    if (f <= 1) return guided
      ? { kind: 'place', min: 0, max: 100, marks: L.marks, labels: L.labels, target: t, tol: 2, prompt: { key: 'qPlace', vars: { n: t } }, hint: { key: 'hA5' } }
      : place(L, t, 5, { key: 'hA5' }, false, [0, 50, 100]);
    if (f === 2) return between(t, L, guided);
    const d = Math.floor(t / 10) * 10;
    return closer(t % 10 === 5 ? t + 1 : t, d, d + 10, L);
  },
};

const A6: Station = {
  id: 'A6', island: 'A', title: { key: 'st_A6' },
  model: () => ({ steps: [
    { say: { key: 'mA6_1' }, visual: line(0, 100, 10, 50, { point: 70 }) },
    { say: { key: 'mA6_2' }, visual: line(0, 100, 10, 50, { point: 70, jumps: [[50, 70]] }) },
  ] }),
  make: (r, guided): Item => {
    // lines of different lengths: the same skill, reading a scale (it comes back in science graphs)
    const kind = guided ? 0 : int(r, 0, 4);
    const [min, max, step] = ([[0, 100, 10], [0, 20, 1], [100, 200, 10], [0, 1000, 100], [0, 50, 5]] as const)[kind];
    const L = line(min, max, step, step === 1 ? 5 : step === 5 ? 10 : step);
    const t = guided ? int(r, 1, 9) * 10 : min + int(r, 1, (max - min) / step - 1) * step;
    return read(r, L, t, step, guided);
  },
};

/* ───────────── Island B: number facts, strategy first, never against the clock ───────────── */

const B1: Station = {
  id: 'B1', island: 'B', title: { key: 'st_B1' },
  model: () => ({ steps: [
    { say: { key: 'mB1_1' }, visual: line(0, 20, 1, 5, { point: 8 }) },
    { say: { key: 'mB1_2' }, visual: line(0, 20, 1, 5, { point: 9, jumps: [[8, 9]] }) },
    { say: { key: 'mB1_3' }, visual: line(0, 20, 1, 5, { point: 7, jumps: [[8, 7]] }) },
  ] }),
  make: (r, guided): Item => {
    const n = guided ? int(r, 1, 19) : int(r, 1, 99), f = int(r, 0, guided ? 1 : 4);
    const lo = Math.max(0, Math.floor((n - 1) / 10) * 10), L = line(lo, lo + 20, 1, 5, { point: n });
    const th = { min: lo, max: lo + 20, start: n, step: 1 };
    if (f === 0) return { kind: 'number', answer: n + 1, prompt: { key: 'qPlus1', vars: { n } }, hint: { key: 'hPlus1', vars: { n } }, aid: L, thread: th };
    if (f === 1) return { kind: 'number', answer: n - 1, prompt: { key: 'qMinus1', vars: { n } }, hint: { key: 'hMinus1', vars: { n } }, aid: L, thread: th };
    if (f === 2) return { kind: 'number', answer: n + 1, prompt: { key: 'qAfter', vars: { n } }, hint: { key: 'hPlus1', vars: { n } }, aid: L, thread: th };
    if (f === 3) return { kind: 'number', answer: n - 1, prompt: { key: 'qBefore', vars: { n } }, hint: { key: 'hMinus1', vars: { n } }, aid: L, thread: th };
    return { kind: 'number', answer: n - 1, prompt: { key: 'qMissingFirst', vars: { b: 1, c: n } }, hint: { key: 'hMinus1', vars: { n } }, aid: L };
  },
};

const B2: Station = {
  id: 'B2', island: 'B', title: { key: 'st_B2' },
  model: () => ({ steps: [
    { say: { key: 'mB2_1' }, visual: { type: 'dots', groups: [6, 6] } },
    { say: { key: 'mB2_2' }, visual: { type: 'dots', groups: [6, 6] } },
  ] }),
  make: (r, guided): Item => {
    const a = guided ? int(r, 1, 10) : r() < 0.2 ? int(r, 1, 5) * 10 : int(r, 1, 20), d = 2 * a, f = guided ? 0 : int(r, 0, 4);
    // the picture never lands on the answer: two equal groups, or the first jump only
    const aid: Visual = a <= 10 ? { type: 'dots', groups: [a, a] } : line(0, Math.ceil(d / 10) * 10, a % 10 === 0 ? 10 : 1, 10, f >= 2 ? { point: d } : { jumps: [[0, a]] });
    const hint: Msg = { key: 'hB2', vars: { a } };
    const visual = guided ? aid : undefined;
    if (f === 0) return { kind: 'number', answer: d, prompt: { key: 'qAdd', vars: { a, b: a } }, hint, visual, aid };
    if (f === 1) return { kind: 'number', answer: d, prompt: { key: 'qDouble', vars: { a } }, hint, aid };
    if (f === 2) return { kind: 'number', answer: a, prompt: { key: 'qHalf', vars: { n: d } }, hint: { key: 'hHalf', vars: { n: d } }, aid };
    if (f === 3) return { kind: 'number', answer: a, prompt: { key: 'qMissing', vars: { a, c: d } }, hint, aid };
    return { kind: 'number', answer: a, prompt: { key: 'qMissingFirst', vars: { b: a, c: d } }, hint, aid };
  },
};

const B3: Station = {
  id: 'B3', island: 'B', title: { key: 'st_B3' },
  model: () => ({ steps: [
    { say: { key: 'mB3_1' }, visual: { type: 'frame', filled: 7 } },
    { say: { key: 'mB3_2' }, visual: { type: 'frame', filled: 7 } },
  ] }),
  make: (r, guided): Item => {
    const T = guided ? 10 : pick(r, [10, 10, 10, 20, 20, 100, 1000]);
    const a = T === 10 ? int(r, 1, 9) : T === 20 ? int(r, 1, 19) : T === 100 ? int(r, 1, 9) * 10 : int(r, 1, 9) * 100;
    const f = guided ? 0 : int(r, 0, 2);
    const aid: Visual = T === 10 ? { type: 'frame', filled: a } : T === 20 ? line(0, 20, 1, 10, { point: a }) : line(0, T, T / 10, T / 2, { point: a });
    const hint: Msg = { key: 'hB3', vars: { a, t: T } };
    if (f === 0) return { kind: 'number', answer: T - a, prompt: { key: 'qMissing', vars: { a, c: T } }, hint, visual: guided ? aid : undefined, aid };
    if (f === 1) return { kind: 'number', answer: T - a, prompt: { key: 'qMissingFirst', vars: { b: a, c: T } }, hint, aid };
    return { kind: 'number', answer: T - a, prompt: { key: 'qSub', vars: { a: T, b: a } }, hint: { key: 'hBondSub', vars: { a, t: T } }, aid };
  },
};

const B4: Station = {
  id: 'B4', island: 'B', title: { key: 'st_B4' },
  model: () => ({ steps: [
    { say: { key: 'mB4_1' }, visual: { type: 'dots', groups: [6, 7] } },
    { say: { key: 'mB4_2' }, visual: { type: 'dots', groups: [6, 7] } },
  ] }),
  make: (r, guided): Item => {
    const tensCase = !guided && r() < 0.2;
    const a = tensCase ? int(r, 1, 9) * 10 : guided ? int(r, 2, 9) : int(r, 2, 25), k = tensCase ? 10 : 1;
    const [x, y] = r() < 0.5 ? [a, a + k] : [a + k, a];
    const aid: Visual = a + k <= 10 ? { type: 'dots', groups: [x, y] } : line(0, Math.ceil((x + y) / 10) * 10, tensCase ? 10 : 1, 10, { jumps: [[0, a], [a, 2 * a]] });
    if (!guided && r() < 0.3) {
      // the subtraction that goes with it: 13 − 6 = 7 because 6 + 7 = 13
      const total = 2 * a + k;
      return { kind: 'number', answer: total - x, prompt: { key: 'qSub', vars: { a: total, b: x } }, hint: { key: 'hB4s', vars: { a, d: 2 * a, k, c: total } },
        aid: line(0, Math.ceil(total / 10) * 10, tensCase ? 10 : 1, 10, { point: total }) };
    }
    const lo4 = Math.floor(x / 10) * 10;
    return { kind: 'number', answer: x + y, prompt: { key: 'qAdd', vars: { a: x, b: y } }, hint: { key: 'hB4', vars: { a, d: 2 * a, k } },
      visual: guided ? aid : undefined, aid, thread: !tensCase && y <= 10 ? { min: lo4, max: lo4 + 30, start: x, step: 1 } : undefined };
  },
};

const B5: Station = {
  id: 'B5', island: 'B', title: { key: 'st_B5' },
  model: () => ({ steps: [
    { say: { key: 'mB5_1' }, visual: line(0, 20, 1, 10, { point: 8 }) },
    { say: { key: 'mB5_2' }, visual: line(0, 20, 1, 10, { point: 10, jumps: [[8, 10]] }) },
    { say: { key: 'mB5_3' }, visual: line(0, 20, 1, 10, { point: 13, jumps: [[8, 10], [10, 13]] }) },
  ] }),
  make: (r, guided): Item => {
    const t = guided ? 0 : pick(r, [0, 0, 1, 2, 3, 4, 5, 6, 7, 8]);
    const down = !guided && r() < 0.35;
    if (!down) {
      const u = int(r, 6, 9), a = 10 * t + u, b = int(r, 11 - u, 9), up = 10 - u, ten = 10 * t + 10;
      // only the first jump is drawn: the child makes the second one
      return { kind: 'number', answer: a + b, prompt: { key: 'qAdd', vars: { a, b } }, hint: { key: 'hB5', vars: { a, up, rest: b - up, ten } },
        aid: line(10 * t, 10 * t + 20, 1, 10, { point: a, jumps: [[a, ten]] }), thread: { min: 10 * t, max: 10 * t + 20, start: a, step: 1 } };
    }
    const u = int(r, 1, 5), c = 10 * (t + 1) + u, b = int(r, u + 1, 9), ten = 10 * (t + 1);
    return { kind: 'number', answer: c - b, prompt: { key: 'qSub', vars: { a: c, b } }, hint: { key: 'hB5s', vars: { c, u, ten, rest: b - u } },
      aid: line(10 * t, 10 * t + 20, 1, 10, { point: c, jumps: [[c, ten]] }), thread: { min: 10 * t, max: 10 * t + 20, start: c, step: 1 } };
  },
};

const B6: Station = {
  id: 'B6', island: 'B', title: { key: 'st_B6' },
  model: () => ({ steps: [
    { say: { key: 'mB6_1' }, visual: line(0, 50, 5, 10, { jumps: [[0, 5], [5, 10], [10, 15]] }) },
    { say: { key: 'mB6_2' }, visual: line(0, 50, 5, 10, { point: 15, jumps: [[0, 5], [5, 10], [10, 15]] }) },
  ] }),
  make: (r, guided): Item => {
    const k = guided ? pick(r, [2, 5, 10]) : pick(r, [2, 2, 3, 4, 5, 5, 10, 10]), n = int(r, 1, 10), m = n * k, f = guided ? 0 : int(r, 0, 3);
    const L = line(0, k * 10, k, k === 2 ? 4 : k === 3 ? 6 : k === 4 ? 8 : k === 5 ? 10 : 20);
    // only the first jumps are drawn: the child makes the rest
    const aid: Visual = { ...L, jumps: range(0, Math.min(2, n - 1) - 1).map((i) => [i * k, (i + 1) * k] as [number, number]) };
    const th6 = { min: 0, max: k * 10, start: 0, step: k };
    if (f === 0) return { kind: 'number', answer: m, prompt: { key: 'qTimes', vars: { n, k } }, hint: { key: 'hB6', vars: { n, k } }, aid, thread: th6 };
    if (f === 1) return { kind: 'number', answer: m, prompt: { key: 'qTimes', vars: { n: k, k: n } }, hint: { key: 'hB6', vars: { n, k } }, aid, thread: th6 };
    if (f === 2) return { kind: 'number', answer: n, prompt: { key: 'qHowManyJumps', vars: { k, m } }, hint: { key: 'hJumps', vars: { k, m } }, aid };
    const start = int(r, 0, 6) * k, s = [start, start + k, start + 2 * k].join(', ');
    return { kind: 'number', answer: start + 3 * k, prompt: { key: 'qSeq', vars: { k, s } }, hint: { key: 'hSeq', vars: { k } },
      aid: line(0, Math.max(k * 10, start + 4 * k), k, k === 2 ? 4 : k === 3 ? 6 : k === 4 ? 8 : k === 5 ? 10 : 20, { jumps: [[start, start + k], [start + k, start + 2 * k]] }) };
  },
};

export const STATIONS: Station[] = [A1, A2, A3, A4, A5, A6, B1, B2, B3, B4, B5, B6, ...PROBLEM_STATIONS];
export const ISLANDS = [
  { id: 'A' as const, title: 'isl_A', emoji: '📏' },
  { id: 'B' as const, title: 'isl_B', emoji: '🧩' },
  { id: 'C' as const, title: 'isl_C', emoji: '🧠' },
];
export const stationById = (id: string) => STATIONS.find((s) => s.id === id);

/** Is the answer right? Place items accept a margin, the others must be exact. */
export function isRight(item: Item, value: number): boolean {
  if (item.kind === 'place') return Math.abs(value - item.target) <= item.tol + 1e-9;
  return value === item.answer;
}

/** A short fingerprint of an exercise (only numbers and the question type), so the app can avoid repeating it. */
export function itemKey(item: Item): string {
  const v = item.prompt.vars ? Object.values(item.prompt.vars).join('.') : '';
  const extra = item.kind === 'choice' ? item.options.join('.') : item.kind === 'place' ? `${item.min}-${item.max}` : '';
  return `${item.prompt.key}:${v}:${extra}`;
}

export { optionsAround };
