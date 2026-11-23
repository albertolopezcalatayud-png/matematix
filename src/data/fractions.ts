import type { Item, Msg, Station, Visual } from '@/engine/types';
import { int, shuffle } from '@/engine/rng';

/* Island D: fractions, decimals, percentages and proportion, all on the same number line and bar model.
 * Evidence: the number line is the recommended representation for fractions (IES Practice Guide on fractions;
 * Siegler et al.); "bigger denominator, bigger fraction" and "count the unshaded part" are the classic errors,
 * so they are the distractors. Fractions are read aloud as words ("3 cuartos"). */

const lit = (x: string): Msg => ({ key: 'lit', vars: { x } });
const range = (a: number, b: number, s = 1) => { const o: number[] = []; for (let v = a; v <= b; v += s) o.push(v); return o; };
const pick = <T,>(r: () => number, xs: T[]) => xs[int(r, 0, xs.length - 1)];
const fr = (a: number, b: number) => `${a}/${b}`;
const strip = (n: number, k: number, labels = false): Visual => ({ type: 'bars', rows: [{ parts: Array.from({ length: n }, (_, i) => ({ v: 1, label: labels ? `1/${n}` : '', shade: i < k })) }] });
/** Options shown as words or fractions: the numbers 1..n are only positions, the label is what the child sees. */
function labelled(r: () => number, correct: string, wrong: string[]): { options: number[]; answer: number; optionLabels: Msg[] } {
  const all = shuffle(r, [correct, ...[...new Set(wrong)].filter((w) => w !== correct).slice(0, 2)]);
  return { options: all.map((_, i) => i + 1), answer: all.indexOf(correct) + 1, optionLabels: all.map(lit) };
}

const D1: Station = {
  id: 'D1', island: 'D', title: { key: 'st_D1' },
  model: () => ({ steps: [
    { say: { key: 'mD1_1' }, visual: strip(4, 0) },
    { say: { key: 'mD1_2' }, visual: strip(4, 3) },
    { say: { key: 'mD1_3' }, visual: strip(4, 3, true) },
  ] }),
  make: (r, guided): Item => {
    const n = guided ? pick(r, [2, 3, 4]) : int(r, 2, 10), k = int(r, 1, n - 1);
    // classic mistakes: counting the white parts, or comparing part to part
    const wrong = [fr(n - k, n), fr(k, n - k === k ? n + 1 : n - k), fr(n, k), fr(k, n + 1)];
    return { kind: 'choice', ...labelled(r, fr(k, n), wrong), prompt: { key: 'qD1' }, hint: { key: 'hD1', vars: { n } }, visual: strip(n, k), aid: strip(n, k, true) };
  },
};

const D2: Station = {
  id: 'D2', island: 'D', title: { key: 'st_D2' },
  model: () => ({ steps: [
    { say: { key: 'mD2_1' }, visual: { type: 'line', min: 0, max: 4, marks: [0, 4], labels: [0, 4], scale: 4, frac: true } },
    { say: { key: 'mD2_2' }, visual: { type: 'line', min: 0, max: 4, marks: range(0, 4), labels: [0, 4], scale: 4, frac: true } },
    { say: { key: 'mD2_3' }, visual: { type: 'line', min: 0, max: 4, marks: range(0, 4), labels: [0, 4], scale: 4, frac: true, point: 3, jumps: [[0, 1], [1, 2], [2, 3]] } },
  ] }),
  make: (r, guided): Item => {
    const n = guided ? pick(r, [2, 3, 4]) : int(r, 2, 12), beyond = !guided && r() < 0.25; // sometimes beyond 1 (5/4)
    const max = beyond ? 2 * n : n, k = beyond ? int(r, n + 1, 2 * n - 1) : int(r, 1, n - 1);
    const ends = beyond ? [0, n, 2 * n] : [0, n];
    return { kind: 'place', min: 0, max, scale: n, frac: true, target: k, tol: guided ? 0 : 0.5,
      marks: guided ? range(0, max) : ends, labels: ends, ...(guided ? {} : { aidMarks: range(0, max), aidLabels: ends }),
      prompt: { key: 'qPlace', vars: { n: fr(k, n) } }, hint: { key: 'hD2', vars: { n, k } } };
  },
};

const D3: Station = {
  id: 'D3', island: 'D', title: { key: 'st_D3' },
  model: () => ({ steps: [
    { say: { key: 'mD3_1' }, visual: { type: 'bars', rows: [{ parts: [{ v: 1, label: '1/2', shade: true }, { v: 1, label: '', shade: false }] }, { parts: [{ v: 1, label: '1/4', shade: true }, { v: 1, label: '', shade: false }, { v: 1, label: '', shade: false }, { v: 1, label: '', shade: false }].map((p) => ({ ...p, v: 0.5 })) }] } },
    { say: { key: 'mD3_2' } },
  ] }),
  make: (r, guided): Item => {
    const sameDen = guided || r() < 0.5;
    let a: [number, number], b: [number, number];
    if (sameDen) { const n = int(r, 3, guided ? 6 : 12); const x = int(r, 1, n - 1); let y = int(r, 1, n - 1); while (y === x) y = int(r, 1, n - 1); a = [x, n]; b = [y, n]; }
    else { const k = guided ? 1 : int(r, 1, 3); const p = int(r, k + 1, 8); let q = int(r, k + 1, 10); while (q === p) q = int(r, k + 1, 10); a = [k, p]; b = [k, q]; }
    const big = a[0] / a[1] > b[0] / b[1] ? a : b;
    const bar = (f: [number, number]) => ({ parts: Array.from({ length: f[1] }, (_, i) => ({ v: 1 / f[1], label: '', shade: i < f[0] })) });
    const pic: Visual = { type: 'bars', rows: [bar(a), bar(b)] };
    const opts = [fr(...a), fr(...b)];
    return { kind: 'choice', options: [1, 2], answer: opts.indexOf(fr(...big)) + 1, optionLabels: opts.map(lit),
      prompt: { key: 'qD3' }, hint: { key: sameDen ? 'hD3same' : 'hD3num' }, visual: guided ? pic : undefined, aid: pic };
  },
};

const D4: Station = {
  id: 'D4', island: 'D', title: { key: 'st_D4' },
  model: () => ({ steps: [
    { say: { key: 'mD4_1' }, visual: { type: 'line', min: 0, max: 10, marks: range(0, 10), labels: [0, 10], scale: 10 } },
    { say: { key: 'mD4_2' }, visual: { type: 'line', min: 0, max: 10, marks: range(0, 10), labels: [0, 5, 10], scale: 10, point: 7 } },
  ] }),
  make: (r, guided): Item => {
    const two = !guided && r() < 0.35, max = two ? 20 : 10;
    let t = int(r, 1, max - 1); if (t % 5 === 0) t += 1; // never on a labelled mark
    const f = guided ? 0 : int(r, 0, 1);
    if (f === 0) return { kind: 'place', min: 0, max, scale: 10, target: t, tol: guided ? 0 : 0.5,
      marks: guided ? range(0, max) : range(0, max, 5), labels: range(0, max, max === 10 ? 5 : 10), ...(guided ? {} : { aidMarks: range(0, max), aidLabels: range(0, max, 5) }),
      prompt: { key: 'qPlace', vars: { n: `#${t / 10}` } }, hint: { key: 'hD4' } };
    // which decimal is the arrow pointing to?
    const L: Visual = { type: 'line', min: 0, max, marks: range(0, max), labels: range(0, max, 5), scale: 10, point: t };
    const near = [t - 1, t + 1, t + 2, t - 2].filter((x) => x > 0 && x < max && x !== t);
    // the classic misreading: 0,7 read as 7 tenths of something else, or 0,07
    const wrong = [`#${near[0] / 10}`, `#${near[1] / 10}`, `#${t / 100}`];
    const lab = labelled(r, `#${t / 10}`, wrong);
    return { kind: 'choice', ...lab, prompt: { key: 'qA6' }, hint: { key: 'hD4read' }, visual: L, aid: L };
  },
};

const D5: Station = {
  id: 'D5', island: 'D', title: { key: 'st_D5' },
  model: () => ({ steps: [
    { say: { key: 'mD5_1' }, visual: { type: 'bars', rows: [{ parts: [{ v: 1, label: '100 %' }] }] } },
    { say: { key: 'mD5_2' }, visual: { type: 'bars', rows: [{ parts: [{ v: 1, label: '50 %', shade: true }, { v: 1, label: '50 %', shade: false }] }] } },
    { say: { key: 'mD5_3' }, visual: { type: 'bars', rows: [{ parts: [0, 1, 2, 3].map((i) => ({ v: 1, label: '25 %', shade: i === 0 })) }] } },
  ] }),
  make: (r, guided): Item => {
    const f = guided ? 0 : int(r, 0, 2);
    if (f === 0) { // how much of the bar is coloured?
      const n = pick(r, [2, 4, 10]), k = int(r, 1, n - 1), pct = (100 / n) * k;
      const wrong = [`${100 - pct} %`, `${k} %`, `${k * 10 === pct ? pct + 5 : k * 10} %`];
      return { kind: 'choice', ...labelled(r, `${pct} %`, wrong), prompt: { key: 'qD5bar' }, hint: { key: 'hD5bar', vars: { n, p: 100 / n } }, visual: strip(n, k), aid: strip(n, k) };
    }
    // p % of a number: 50 % is half, 25 % a quarter, 10 % a tenth, 75 % three quarters, 20 % a fifth
    const p = pick(r, [50, 25, 10, 75, 20]), parts = 100 / ((p === 75 ? 25 : p)), unit = int(r, 1, guided ? 5 : 20), N = parts * unit;
    const answer = (N * p) / 100;
    const pic: Visual = { type: 'bars', rows: [{ parts: Array.from({ length: parts }, (_, i) => ({ v: 1, label: String(unit), shade: i < (p === 75 ? 3 : 1) })) }], total: String(N) };
    return { kind: 'number', answer, prompt: { key: 'qD5of', vars: { p, n: N } }, hint: { key: `hD5_${p}` }, visual: f === 1 && !guided ? undefined : pic, aid: pic };
  },
};

const D6: Station = {
  id: 'D6', island: 'D', title: { key: 'st_D6' },
  model: () => ({ steps: [
    { say: { key: 'mD6_1' } },
    { say: { key: 'mD6_2' }, visual: { type: 'bars', rows: [{ parts: [{ v: 1, label: '3' }, { v: 1, label: '3' }], name: { key: 'lit', vars: { x: '🧁' } } }, { parts: [{ v: 1, label: '6 €' }, { v: 1, label: '?' }], name: { key: 'lit', vars: { x: '€' } } }] } },
    { say: { key: 'mD6_3' }, visual: { type: 'bars', rows: [{ parts: [{ v: 1, label: '3' }, { v: 1, label: '3' }], name: { key: 'lit', vars: { x: '🧁' } } }, { parts: [{ v: 1, label: '6 €' }, { v: 1, label: '6 €' }], name: { key: 'lit', vars: { x: '€' } } }] } },
  ] }),
  make: (r, guided): Item => {
    const o = int(r, 0, 5), a = int(r, 2, guided ? 4 : 9), b = int(r, 1, guided ? 5 : 12), k = int(r, 2, guided ? 3 : 6);
    const groups = (top: (i: number) => string, bottom: (i: number) => string): Visual => ({ type: 'bars', groups: true, rows: [
      { parts: Array.from({ length: k }, (_, i) => ({ v: 1, label: top(i) })), name: { key: `ob_${o}` } },
      { parts: Array.from({ length: k }, (_, i) => ({ v: 1, label: bottom(i) })), name: { key: 'lit', vars: { x: '€' } } }] });
    if (guided || r() < 0.6) return { kind: 'number', answer: b * k, prompt: { key: 'qD6', vars: { a, obj: `$ob_${o}`, b, c: a * k } }, hint: { key: 'hD6', vars: { k } },
      visual: guided ? groups(() => String(a), (i) => (i === 0 ? `${b} €` : '?')) : undefined, aid: groups(() => String(a), (i) => (i === 0 ? `${b} €` : '?')) };
    // backwards: from the bigger amount to the smaller
    return { kind: 'number', answer: b, prompt: { key: 'qD6back', vars: { c: a * k, obj: `$ob_${o}`, m: b * k, a } }, hint: { key: 'hD6back', vars: { k, c: a * k, a } },
      aid: groups(() => String(a), (i) => (i === 0 ? '?' : '')) };
  },
};

export const FRACTION_STATIONS: Station[] = [D1, D2, D3, D4, D5, D6];
