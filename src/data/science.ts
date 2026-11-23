import type { Item, Msg, Station, Visual } from '@/engine/types';
import { int, shuffle } from '@/engine/rng';

/* Island E: the maths science needs (Física y Química, Biología y Geología, Conocimiento del Medio).
 * Teachers' most repeated complaint: pupils know the science but fail the numbers (units, rearranging formulas,
 * reading graphs). Guidance followed: ASE/Nuffield "The Language of Mathematics in Science" (keep the unit with
 * the number; the same staircase for every conversion; x axis = independent variable; read the scale before the
 * value). Answers are whole numbers so the keypad works; decimals appear as choices. */

const pick = <T,>(r: () => number, xs: T[]) => xs[int(r, 0, xs.length - 1)];
const lit = (x: string): Msg => ({ key: 'lit', vars: { x } });
const MONTHS = (i: number): Msg => ({ key: `mos_${i}` }); // short names for the axis
const MONTH = (i: number): Msg => ({ key: `mo_${i}` });
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const sup = (n: number) => String(n).split('').map((d) => SUP[Number(d)]).join('');

const LENGTH = ['km', 'hm', 'dam', 'm', 'dm', 'cm', 'mm'];
const MASS = ['kg', 'hg', 'dag', 'g', 'dg', 'cg', 'mg'];
const VOLUME = ['L', 'dL', 'cL', 'mL'];

const E1: Station = {
  id: 'E1', island: 'E', title: { key: 'st_E1' },
  model: () => ({ steps: [
    { say: { key: 'mE1_1' }, visual: { type: 'ladder', units: LENGTH, from: 3, to: 3 } },
    { say: { key: 'mE1_2' }, visual: { type: 'ladder', units: LENGTH, from: 3, to: 5 } },
    { say: { key: 'mE1_3' }, visual: { type: 'ladder', units: LENGTH, from: 5, to: 3 } },
  ] }),
  make: (r, guided): Item => {
    if (!guided && r() < 0.3) {
      // the sensible unit: a feel for sizes (a door is 2 m, not 2 km)
      const i = int(r, 0, 7);
      const UNITS = [['m', 'cm', 'km'], ['cm', 'm', 'mm'], ['km', 'm', 'cm'], ['kg', 'g', 'mg'], ['g', 'kg', 'mg'], ['L', 'mL', 'kg'], ['mL', 'L', 'g'], ['mm', 'cm', 'm']][i];
      const opts = shuffle(r, UNITS);
      return { kind: 'choice', options: [1, 2, 3], answer: opts.indexOf(UNITS[0]) + 1, optionLabels: opts.map(lit), prompt: { key: `qUnit_${i}` }, hint: { key: 'hUnitSense' } };
    }
    const scale = guided ? LENGTH : pick(r, [LENGTH, LENGTH, MASS, VOLUME]);
    const k = guided ? 1 : int(r, 1, 3);
    const from = int(r, 0, scale.length - 1 - k), down = guided || r() < 0.6;
    const [a, b] = down ? [from, from + k] : [from + k, from];
    // going down multiplies; going up divides (only with numbers that divide exactly)
    const v = down ? int(r, 1, k === 3 ? 9 : 99) : int(r, 1, k === 3 ? 9 : 99) * 10 ** k;
    const ans = down ? v * 10 ** k : v / 10 ** k;
    const lad: Visual = { type: 'ladder', units: scale, from: a, to: b };
    return { kind: 'number', answer: ans, prompt: { key: 'qConvert', vars: { v, a: scale[a], b: scale[b] } }, hint: { key: down ? 'hConvertDown' : 'hConvertUp', vars: { k, p: 10 ** k } },
      visual: guided ? lad : undefined, aid: lad };
  },
};

const E2: Station = {
  id: 'E2', island: 'E', title: { key: 'st_E2' },
  model: () => ({ steps: [
    { say: { key: 'mE2_1' }, visual: { type: 'chart', kind: 'bar', x: [0, 1, 2, 3].map(MONTHS), y: [60, 40, 30, 50], yMax: 80, yStep: 10, yTitle: { key: 'ax_mm' } } },
    { say: { key: 'mE2_2' }, visual: { type: 'chart', kind: 'bar', x: [0, 1, 2, 3].map(MONTHS), y: [60, 40, 30, 50], yMax: 80, yStep: 10, yTitle: { key: 'ax_mm' }, mark: 1 } },
  ] }),
  make: (r, guided): Item => {
    const rain = guided || r() < 0.55, n = guided ? 4 : int(r, 4, 6), m0 = int(r, 0, 12 - n);
    const step = rain ? 10 : 2, yMax = rain ? 100 : 30;
    const y = Array.from({ length: n }, () => (rain ? int(r, 1, 10) * 10 : int(r, 2, 14) * 2));
    // no ties for the biggest, so "which month" has one answer
    const top = Math.max(...y); while (y.filter((q) => q === top).length > 1) y[y.lastIndexOf(top)] -= step;
    const chart = (mark?: number): Visual => ({ type: 'chart', kind: rain ? 'bar' : 'line', x: y.map((_, i) => MONTHS(m0 + i)), y, yMax, yStep: rain ? 10 : 2, yTitle: { key: rain ? 'ax_mm' : 'ax_c' }, mark });
    const f = guided ? 0 : int(r, 0, 2), i = int(r, 0, n - 1);
    if (f === 0) return { kind: 'number', answer: y[i], prompt: { key: rain ? 'qRainIn' : 'qTempIn', vars: { m: `$moin_${m0 + i}` } }, hint: { key: 'hReadBar' }, visual: chart(), aid: chart(i) };
    if (f === 1) {
      const best = y.indexOf(Math.max(...y)), cand = shuffle(r, [...new Set([best, i, (best + 1) % n])]).slice(0, 3);
      if (!cand.includes(best)) cand[0] = best;
      return { kind: 'choice', options: cand.map((_, k) => k + 1), answer: cand.indexOf(best) + 1, optionLabels: cand.map((c) => MONTH(m0 + c)),
        prompt: { key: rain ? 'qRainMost' : 'qTempMost' }, hint: { key: 'hTallest' }, visual: chart(), aid: chart(best) };
    }
    const j = (i + 1 + int(r, 0, n - 2)) % n; if (y[j] === y[i]) y[j] = y[j] + step <= yMax ? y[j] + step : y[j] - step;
    const [hi, lo] = y[i] > y[j] ? [i, j] : [j, i];
    return { kind: 'number', answer: y[hi] - y[lo], prompt: { key: rain ? 'qRainDiff' : 'qTempDiff', vars: { a: `$moin_${m0 + hi}`, b: `$moin_${m0 + lo}` } }, hint: { key: 'hDiffChart' }, visual: chart(), aid: chart(hi) };
  },
};

const E3: Station = {
  id: 'E3', island: 'E', title: { key: 'st_E3' },
  model: () => ({ steps: [
    { say: { key: 'mE3_1' }, visual: { type: 'chart', kind: 'line', x: ['0', '1', '2', '3', '4'], y: [0, 3, 6, 9, 12], yMax: 15, yStep: 3, xTitle: { key: 'ax_ts' }, yTitle: { key: 'ax_xm' } } },
    { say: { key: 'mE3_2' }, visual: { type: 'chart', kind: 'line', x: ['0', '1', '2', '3', '4'], y: [0, 3, 6, 9, 12], yMax: 15, yStep: 3, xTitle: { key: 'ax_ts' }, yTitle: { key: 'ax_xm' }, slope: true } },
  ] }),
  make: (r, guided): Item => {
    const v = int(r, 1, guided ? 5 : 10), x0 = guided ? 0 : pick(r, [0, 0, v, 2 * v, 3 * v]), T = int(r, 4, 6);
    const y = Array.from({ length: T + 1 }, (_, t) => x0 + v * t), yMax = Math.ceil(y[T] / (v * 2)) * v * 2 + v;
    const chart = (mark?: number, slope = false): Visual => ({ type: 'chart', kind: 'line', x: y.map((_, t) => String(t)), y, yMax, yStep: v, xTitle: { key: 'ax_ts' }, yTitle: { key: 'ax_xm' }, mark, slope });
    const f = guided ? 0 : int(r, 0, 2), t = int(r, 1, T);
    if (f === 0) return { kind: 'number', answer: y[t], prompt: { key: 'qWhereAt', vars: { t } }, hint: { key: 'hWhereAt', vars: { t, v, x0, T } }, visual: chart(), aid: chart(t) };
    if (f === 1) return { kind: 'number', answer: v, prompt: { key: 'qSpeed' }, hint: { key: 'hSpeed', vars: { v, x0, T } }, visual: chart(), aid: chart(undefined, true) };
    return { kind: 'number', answer: t, prompt: { key: 'qWhenAt', vars: { x: y[t] } }, hint: { key: 'hWhenAt', vars: { x: y[t], v, x0, T } }, visual: chart(), aid: chart(t) };
  },
};

const E4: Station = {
  id: 'E4', island: 'E', title: { key: 'st_E4' },
  model: () => ({ steps: [
    { say: { key: 'mE4_1' }, visual: { type: 'balance', left: 'x + 7', right: '15' } },
    { say: { key: 'mE4_2' }, visual: { type: 'balance', left: 'x + 7 − 7', right: '15 − 7' } },
    { say: { key: 'mE4_3' }, visual: { type: 'balance', left: 'x', right: '8' } },
  ] }),
  make: (r, guided): Item => {
    const f = guided ? int(r, 0, 1) : int(r, 0, 5);
    const L = pick(r, ['x', 'y', 'n', 'm']);
    if (f === 0) { const x = int(r, 1, guided ? 10 : 50), a = int(r, 1, guided ? 10 : 50); const b = x + a;
      return { kind: 'number', answer: x, prompt: { key: 'qEq', vars: { e: `${L} + ${a} = ${b}`, L } }, hint: { key: 'hEqAdd', vars: { a, L } }, visual: { type: 'balance', left: `${L} + ${a}`, right: String(b) }, aid: { type: 'balance', left: `${L} + ${a} − ${a}`, right: `${b} − ${a}` } }; }
    if (f === 1) { const x = int(r, 1, 10), a = int(r, 2, guided ? 5 : 10); const b = a * x;
      return { kind: 'number', answer: x, prompt: { key: 'qEq', vars: { e: `${a} · ${L} = ${b}`, L } }, hint: { key: 'hEqMul', vars: { a } }, visual: { type: 'balance', left: `${a} · ${L}`, right: String(b) }, aid: { type: 'balance', left: `${a} · ${L} ÷ ${a}`, right: `${b} ÷ ${a}` } }; }
    if (f === 2) { const x = int(r, 10, 60), a = int(r, 1, 9); const b = x - a;
      return { kind: 'number', answer: x, prompt: { key: 'qEq', vars: { e: `${L} − ${a} = ${b}`, L } }, hint: { key: 'hEqSub', vars: { a } }, visual: { type: 'balance', left: `${L} − ${a}`, right: String(b) }, aid: { type: 'balance', left: `${L} − ${a} + ${a}`, right: `${b} + ${a}` } }; }
    // d = v · t with words: the same balance, with a formula from physics
    const v = pick(r, [5, 10, 20, 30, 40, 50, 60, 80, 90, 100, 120]), t = int(r, 2, 5), d = v * t;
    if (f === 3) return { kind: 'number', answer: d, prompt: { key: 'qDist', vars: { v, t } }, hint: { key: 'hDist' }, aid: { type: 'balance', left: 'd', right: `${v} · ${t}` } };
    if (f === 4) return { kind: 'number', answer: v, prompt: { key: 'qVel', vars: { d, t } }, hint: { key: 'hVel', vars: { t } }, aid: { type: 'balance', left: `v · ${t}`, right: String(d) } };
    return { kind: 'number', answer: t, prompt: { key: 'qTime', vars: { d, v } }, hint: { key: 'hTime', vars: { v } }, aid: { type: 'balance', left: `${v} · t`, right: String(d) } };
  },
};

const E5: Station = {
  id: 'E5', island: 'E', title: { key: 'st_E5' },
  model: () => ({ steps: [
    { say: { key: 'mE5_1' } },
    { say: { key: 'mE5_2' }, visual: { type: 'bars', groups: true, rows: [{ parts: [{ v: 1, label: '10 g' }, { v: 1, label: '10 g' }] }], total: '20 g' } },
    { say: { key: 'mE5_3' } },
  ] }),
  make: (r, guided): Item => {
    const f = guided ? 0 : int(r, 0, 2);
    const per = int(r, 2, guided ? 10 : 50), V = int(r, 2, guided ? 4 : 8), m = per * V;
    const pic: Visual = { type: 'bars', groups: true, rows: [{ parts: Array.from({ length: V }, () => ({ v: 1, label: '?' })) }], total: f === 1 ? `${m} g` : `${m} g` };
    if (f === 0) return { kind: 'number', answer: per, prompt: { key: 'qConc', vars: { m, V } }, hint: { key: 'hConc', vars: { V } }, visual: guided ? pic : undefined, aid: pic };
    if (f === 1) { const d = int(r, 2, 11), vol = int(r, 2, 9);
      return { kind: 'number', answer: d, prompt: { key: 'qDens', vars: { m: d * vol, V: vol } }, hint: { key: 'hDens', vars: { V: vol } },
        aid: { type: 'bars', groups: true, rows: [{ parts: Array.from({ length: vol }, () => ({ v: 1, label: '?' })) }], total: `${d * vol} g` } }; }
    // floats or sinks? water is 1 g/cm³
    const d10 = pick(r, [2, 3, 5, 6, 7, 8, 9, 11, 12, 15, 19, 27, 79, 113]);
    const floats = d10 < 10;
    const opts = [{ key: 'yes_floats' }, { key: 'no_sinks' }];
    return { kind: 'choice', options: [1, 2], answer: floats ? 1 : 2, optionLabels: opts, prompt: { key: 'qFloat', vars: { d: `#${d10 / 10}` } }, hint: { key: 'hFloat' } };
  },
};

const E6: Station = {
  id: 'E6', island: 'E', title: { key: 'st_E6' },
  model: () => ({ steps: [
    { say: { key: 'mE6_1' } },
    { say: { key: 'mE6_2' } },
    { say: { key: 'mE6_3' } },
  ] }),
  make: (r, guided): Item => {
    const f = guided ? int(r, 0, 1) : int(r, 0, 5);
    if (f === 0) { const k = pick(r, [2, 5, 10, 20, 50]), c = int(r, 2, 9);
      return { kind: 'number', answer: k * c, prompt: { key: 'qMap', vars: { k, c } }, hint: { key: 'hMap', vars: { k } },
        aid: { type: 'bars', groups: true, rows: [{ parts: Array.from({ length: c }, () => ({ v: 1, label: `${k} km` })) }], total: '?' } }; }
    if (f === 1) { const k = pick(r, [2, 5, 10, 100]), s = int(r, 1, 9);
      return { kind: 'number', answer: k * s, prompt: { key: 'qLens', vars: { k, s } }, hint: { key: 'hLens', vars: { k } } }; }
    if (f === 2) { const k = pick(r, [2, 5, 10, 20, 50]), c = int(r, 2, 9);
      return { kind: 'number', answer: c, prompt: { key: 'qMapBack', vars: { k, d: k * c } }, hint: { key: 'hMapBack', vars: { k } },
        aid: { type: 'bars', groups: true, rows: [{ parts: Array.from({ length: c }, () => ({ v: 1, label: `${k} km` })) }], total: `${k * c} km` } }; }
    if (f === 3) { const a = int(r, 1, 9), n = int(r, 1, 3);
      return { kind: 'number', answer: a * 10 ** n, prompt: { key: 'qPow', vars: { a, p: `10${sup(n)}` } }, hint: { key: 'hPow', vars: { n } } }; }
    if (f === 4) { const n = int(r, 2, 6);
      return { kind: 'number', answer: n, prompt: { key: 'qZeros', vars: { p: `10${sup(n)}` } }, hint: { key: 'hZeros' } }; }
    const a = int(r, 1, 9), n = int(r, 2, 6), N = String(a) + '0'.repeat(n);
    return { kind: 'number', answer: n, prompt: { key: 'qSci', vars: { N: Number(N).toLocaleString('es-ES').replace(/\./g, ' '), a } }, hint: { key: 'hSci', vars: { a } } };
  },
};

export const SCIENCE_STATIONS: Station[] = [E1, E2, E3, E4, E5, E6];
