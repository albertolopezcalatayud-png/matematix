import type { Item, Station, Visual } from '@/engine/types';
import { int, optionsAround } from '@/engine/rng';

const range = (a: number, b: number, step = 1) => { const out: number[] = []; for (let v = a; v <= b; v += step) out.push(v); return out; };
const line = (min: number, max: number, every: number, labelEvery: number, extra: Partial<Extract<Visual, { type: 'line' }>> = {}): Extract<Visual, { type: 'line' }> =>
  ({ type: 'line', min, max, marks: range(min, max, every), labels: range(min, max, labelEvery), ...extra });

/* ───────────── Island A: the number line and number sense ───────────── */

const A1: Station = {
  id: 'A1', island: 'A', title: { key: 'st_A1' },
  model: () => ({ steps: [
    { say: { key: 'mA1_1' }, visual: { type: 'dots', groups: [4, 7] } },
    { say: { key: 'mA1_2' }, visual: { type: 'dots', groups: [4, 7] } },
    { say: { key: 'mA1_3' }, visual: line(0, 10, 1, 1, { jumps: [[0, 4], [0, 7]] }) },
  ] }),
  make: (r, guided) => {
    const a = int(r, 0, 10); let b = int(r, 0, 10); while (b === a) b = int(r, 0, 10);
    return { kind: 'choice', options: [a, b], answer: Math.max(a, b), prompt: { key: 'qA1' }, hint: { key: 'hA1' },
      visual: guided ? { type: 'dots', groups: [a, b] } : undefined };
  },
};

const A2: Station = {
  id: 'A2', island: 'A', title: { key: 'st_A2' },
  model: () => ({ steps: [
    { say: { key: 'mA2_1' }, visual: line(0, 10, 1, 10) },
    { say: { key: 'mA2_2' }, visual: line(0, 10, 1, 5) },
    { say: { key: 'mA2_3' }, visual: line(0, 10, 1, 5, { point: 7, jumps: [[5, 7]] }) },
  ] }),
  make: (r, guided) => {
    const t = int(r, 1, 9);
    return guided
      ? { kind: 'place', min: 0, max: 10, marks: range(0, 10), labels: [0, 5, 10], target: t, tol: 0, prompt: { key: 'qPlace', vars: { n: t } }, hint: { key: 'hA2' } }
      : { kind: 'place', min: 0, max: 10, marks: [0, 10], labels: [0, 10], target: t, tol: 0.5, prompt: { key: 'qPlace', vars: { n: t } }, hint: { key: 'hA2' } };
  },
};

const A3: Station = {
  id: 'A3', island: 'A', title: { key: 'st_A3' },
  model: () => ({ steps: [
    { say: { key: 'mA3_1' }, visual: line(0, 20, 1, 10) },
    { say: { key: 'mA3_2' }, visual: line(0, 20, 1, 10, { point: 13, jumps: [[10, 13]] }) },
  ] }),
  make: (r, guided) => {
    let t = int(r, 1, 19); if (t === 10) t = 14;
    return { kind: 'place', min: 0, max: 20, marks: guided ? range(0, 20) : [0, 10, 20], labels: [0, 10, 20], target: t, tol: guided ? 0 : 1,
      prompt: { key: 'qPlace', vars: { n: t } }, hint: { key: 'hA3' } };
  },
};

const A4: Station = {
  id: 'A4', island: 'A', title: { key: 'st_A4' },
  model: () => ({ steps: [
    { say: { key: 'mA4_1' }, visual: { type: 'tens', tens: 3, ones: 0 } },
    { say: { key: 'mA4_2' }, visual: { type: 'tens', tens: 3, ones: 4 } },
    { say: { key: 'mA4_3' }, visual: { type: 'tens', tens: 3, ones: 4 } },
  ] }),
  make: (r, guided) => {
    const tens = int(r, 1, 9), ones = int(r, 0, 9), n = tens * 10 + ones, coin = r();
    if (guided || coin < 0.5) return { kind: 'number', answer: n, prompt: { key: 'qA4' }, hint: { key: 'hA4', vars: { t: tens, o: ones } }, visual: { type: 'tens', tens, ones } };
    // the classic trap: the digits swapped
    const swapped = ones * 10 + tens;
    const opts = new Set([n, swapped !== n ? swapped : n + 10, tens + ones]);
    for (let v = n + 1; opts.size < 3; v++) opts.add(v);
    return { kind: 'choice', options: [...opts].sort((x, y) => x - y), answer: n, prompt: { key: 'qA4' }, hint: { key: 'hA4', vars: { t: tens, o: ones } }, visual: { type: 'tens', tens, ones } };
  },
};

const A5: Station = {
  id: 'A5', island: 'A', title: { key: 'st_A5' },
  model: () => ({ steps: [
    { say: { key: 'mA5_1' }, visual: line(0, 100, 10, 50) },
    { say: { key: 'mA5_2' }, visual: line(0, 100, 10, 50, { point: 63, jumps: [[50, 60], [60, 63]] }) },
  ] }),
  make: (r, guided) => {
    let t = int(r, 3, 97); if (t % 10 === 0) t += 3;
    return { kind: 'place', min: 0, max: 100, marks: guided ? range(0, 100, 10) : [0, 50, 100], labels: guided ? range(0, 100, 10) : [0, 50, 100], target: t, tol: guided ? 2 : 5,
      prompt: { key: 'qPlace', vars: { n: t } }, hint: { key: 'hA5' } };
  },
};

const A6: Station = {
  id: 'A6', island: 'A', title: { key: 'st_A6' },
  model: () => ({ steps: [
    { say: { key: 'mA6_1' }, visual: line(0, 100, 10, 50, { point: 70 }) },
    { say: { key: 'mA6_2' }, visual: line(0, 100, 10, 50, { point: 70, jumps: [[50, 70]] }) },
  ] }),
  make: (r, guided) => {
    const u = int(r, 0, 9), t = int(r, 1, 9) * 10 + (guided ? 0 : u);
    const opts = optionsAround(r, t, guided ? 30 : 25, 3).map((v) => Math.min(v, 100));
    const uniq = [...new Set(opts)]; while (uniq.length < 3) uniq.push(uniq.length === 1 ? (t > 50 ? t - 30 : t + 30) : (t > 50 ? t - 45 : t + 45));
    return { kind: 'choice', options: uniq.sort((x, y) => x - y), answer: t, prompt: { key: 'qA6' }, hint: { key: 'hA6' },
      visual: line(0, 100, 10, guided ? 10 : 50, { point: t }) };
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
  make: (r, guided) => {
    const n = int(r, 1, 19), plus = r() < 0.5, ans = plus ? n + 1 : n - 1;
    return { kind: 'number', answer: ans, prompt: { key: plus ? 'qPlus1' : 'qMinus1', vars: { n } }, hint: { key: plus ? 'hPlus1' : 'hMinus1', vars: { n } },
      visual: guided ? line(0, 20, 1, 5, { point: n }) : undefined };
  },
};

const B2: Station = {
  id: 'B2', island: 'B', title: { key: 'st_B2' },
  model: () => ({ steps: [
    { say: { key: 'mB2_1' }, visual: { type: 'dots', groups: [6, 6] } },
    { say: { key: 'mB2_2' }, visual: { type: 'dots', groups: [6, 6] } },
  ] }),
  make: (r, guided) => {
    const a = int(r, 1, 10);
    return { kind: 'number', answer: 2 * a, prompt: { key: 'qAdd', vars: { a, b: a } }, hint: { key: 'hB2', vars: { a } },
      visual: guided ? { type: 'dots', groups: [a, a] } : undefined };
  },
};

const B3: Station = {
  id: 'B3', island: 'B', title: { key: 'st_B3' },
  model: () => ({ steps: [
    { say: { key: 'mB3_1' }, visual: { type: 'frame', filled: 7 } },
    { say: { key: 'mB3_2' }, visual: { type: 'frame', filled: 7 } },
  ] }),
  make: (r, guided) => {
    const a = int(r, 1, 9);
    return { kind: 'number', answer: 10 - a, prompt: { key: 'qFriend10', vars: { a } }, hint: { key: 'hB3', vars: { a } },
      visual: guided ? { type: 'frame', filled: a } : undefined };
  },
};

const B4: Station = {
  id: 'B4', island: 'B', title: { key: 'st_B4' },
  model: () => ({ steps: [
    { say: { key: 'mB4_1' }, visual: { type: 'dots', groups: [6, 7] } },
    { say: { key: 'mB4_2' }, visual: { type: 'dots', groups: [6, 7] } },
  ] }),
  make: (r, guided) => {
    const a = int(r, 2, 9), [x, y] = r() < 0.5 ? [a, a + 1] : [a + 1, a];
    return { kind: 'number', answer: x + y, prompt: { key: 'qAdd', vars: { a: x, b: y } }, hint: { key: 'hB4', vars: { a, d: 2 * a } },
      visual: guided ? { type: 'dots', groups: [x, y] } : undefined };
  },
};

const B5: Station = {
  id: 'B5', island: 'B', title: { key: 'st_B5' },
  model: () => ({ steps: [
    { say: { key: 'mB5_1' }, visual: line(0, 20, 1, 10, { point: 8 }) },
    { say: { key: 'mB5_2' }, visual: line(0, 20, 1, 10, { point: 10, jumps: [[8, 10]] }) },
    { say: { key: 'mB5_3' }, visual: line(0, 20, 1, 10, { point: 13, jumps: [[8, 10], [10, 13]] }) },
  ] }),
  make: (r, guided) => {
    const a = int(r, 6, 9), b = int(r, 11 - a, 9), up = 10 - a;
    return { kind: 'number', answer: a + b, prompt: { key: 'qAdd', vars: { a, b } }, hint: { key: 'hB5', vars: { a, up, rest: b - up } },
      visual: guided ? line(0, 20, 1, 10, { point: a, jumps: [[a, 10]] }) : undefined };
  },
};

const B6: Station = {
  id: 'B6', island: 'B', title: { key: 'st_B6' },
  model: () => ({ steps: [
    { say: { key: 'mB6_1' }, visual: line(0, 50, 5, 10, { jumps: [[0, 5], [5, 10], [10, 15]] }) },
    { say: { key: 'mB6_2' }, visual: line(0, 50, 5, 10, { point: 15, jumps: [[0, 5], [5, 10], [10, 15]] }) },
  ] }),
  make: (r, guided) => {
    const k = [2, 5, 10][int(r, 0, 2)], n = int(r, 1, 10), max = k * 10;
    // only the first jumps are drawn: the child makes the rest
    const jumps: [number, number][] = range(0, Math.min(2, n) - 1).map((i) => [i * k, (i + 1) * k]);
    return { kind: 'number', answer: n * k, prompt: { key: 'qTimes', vars: { n, k } }, hint: { key: 'hB6', vars: { n, k } },
      visual: guided ? line(0, max, k, k === 2 ? 4 : k === 5 ? 10 : 20, { jumps }) : undefined };
  },
};

export const STATIONS: Station[] = [A1, A2, A3, A4, A5, A6, B1, B2, B3, B4, B5, B6];
export const ISLANDS = [
  { id: 'A' as const, title: 'isl_A', emoji: '📏' },
  { id: 'B' as const, title: 'isl_B', emoji: '🧩' },
];
export const stationById = (id: string) => STATIONS.find((s) => s.id === id);

/** Is the answer right? Place items accept a margin, the others must be exact. */
export function isRight(item: Item, value: number): boolean {
  if (item.kind === 'place') return Math.abs(value - item.target) <= item.tol + 1e-9;
  return value === item.answer;
}
