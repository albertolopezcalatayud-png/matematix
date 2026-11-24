import type { Item, Msg, Station, Visual } from '@/engine/types';
import { int, shuffle } from '@/engine/rng';

/* Topic F: maths for real life, in the style of the numeracy test for trainee teachers (QTS numeracy skills test):
 * mental arithmetic you hear (percentages and fractions of amounts, money, time), reading school data (tables and
 * charts, mean, median and range) and proportion (recipes, sharing, rates). Contexts from school and everyday life.
 * Differences from that test, on purpose: no timer (dyscalculia), the strategy is always shown, and answers are whole
 * numbers so the keypad works. Times and prices that are not whole numbers appear as choices. */

const pick = <T,>(r: () => number, xs: T[]) => xs[int(r, 0, xs.length - 1)];
const lit = (x: string): Msg => ({ key: 'lit', vars: { x } });
const hm = (min: number) => `${Math.floor(min / 60)}:${String(min % 60).padStart(2, '0')}`;
type Bars = Extract<Visual, { type: 'bars' }>;

/** A bar cut into equal parts with some of them shaded: the picture of "p % of a" or "n/d of a". */
function partsBar(total: number, parts: number, shaded: number, showValues: boolean): Bars {
  return { type: 'bars', groups: true, total: String(total),
    rows: [{ parts: Array.from({ length: parts }, (_, i) => ({ v: 1, label: showValues ? String(total / parts) : '', shade: i < shaded })) }] };
}
/** Three different options, the answer among them, in a random order (options are 1, 2, 3; labels carry the text). */
function choice3(r: () => number, right: Msg, wrong: Msg[]): Pick<Extract<Item, { kind: 'choice' }>, 'kind' | 'options' | 'answer' | 'optionLabels'> {
  const all = shuffle(r, [right, ...wrong.slice(0, 2)]);
  return { kind: 'choice', options: [1, 2, 3], answer: all.indexOf(right) + 1, optionLabels: all };
}

/* ───────── F1 Percentages and fractions of an amount ───────── */
const PCTS = [
  { p: 10, parts: 10, shade: 1, hint: 'hPct10' },
  { p: 50, parts: 2, shade: 1, hint: 'hPct50' },
  { p: 25, parts: 4, shade: 1, hint: 'hPct25' },
  { p: 20, parts: 10, shade: 2, hint: 'hPct20' },
  { p: 75, parts: 4, shade: 3, hint: 'hPct75' },
  { p: 30, parts: 10, shade: 3, hint: 'hPct30' },
  { p: 5, parts: 10, shade: 0, hint: 'hPct5' },
];
const F1: Station = {
  id: 'F1', island: 'F', title: { key: 'st_F1' },
  model: () => ({ steps: [
    { say: { key: 'mF1_1' }, visual: partsBar(240, 10, 0, true) },
    { say: { key: 'mF1_2' }, visual: partsBar(240, 10, 1, true) },
    { say: { key: 'mF1_3' }, visual: partsBar(240, 4, 1, true) },
  ] }),
  make: (r, guided): Item => {
    const f = guided ? 0 : int(r, 0, 3);
    if (f <= 1) {
      const P = guided ? pick(r, PCTS.slice(0, 3)) : pick(r, PCTS);
      const a = int(r, 2, guided ? 20 : 60) * 20; // a multiple of 20: every percentage here is a whole number
      const ctx = pick(r, ['qPctPlain', 'qPctBus', 'qPctLunch', 'qPctBooks']);
      const bar = partsBar(a, P.parts, P.shade, false); // no values on the parts: that would give the answer away
      return { kind: 'number', answer: (a * P.p) / 100, prompt: { key: ctx, vars: { p: P.p, a } }, hint: { key: P.hint, vars: { a } }, visual: guided ? bar : undefined, aid: bar };
    }
    if (f === 2) { // a mark as a percentage: 18 out of 20 → 90 %
      const t = pick(r, [10, 20, 25, 50]), s = int(r, 1, t - 1), k = 100 / t;
      return { kind: 'number', answer: s * k, prompt: { key: 'qMarkPct', vars: { s, t } }, hint: { key: 'hMarkPct', vars: { t, k } } };
    }
    const d = pick(r, [3, 4, 5, 8]), n = int(r, 1, d - 1), a = d * int(r, 2, 12);
    const bar = partsBar(a, d, n, false);
    return { kind: 'number', answer: (a / d) * n, prompt: { key: 'qFracOf', vars: { n, d, a } }, hint: { key: 'hFracOf', vars: { n, d } }, aid: bar };
  },
};

/* ───────── F2 Money: change, discounts, group costs, how many buses, best buy ───────── */
const F2: Station = {
  id: 'F2', island: 'F', title: { key: 'st_F2' },
  model: () => ({ steps: [
    { say: { key: 'mF2_1' }, visual: { type: 'bars', rows: [{ parts: [{ v: 37, label: '37 €' }, { v: 13, label: '?' }] }], total: '50 €' } },
    { say: { key: 'mF2_2' }, visual: { type: 'bars', rows: [{ parts: [{ v: 37, label: '37 €' }, { v: 3, label: '3' }, { v: 10, label: '10' }] }], total: '50 €' } },
    { say: { key: 'mF2_3' } },
  ] }),
  make: (r, guided): Item => {
    const f = guided ? int(r, 0, 1) : int(r, 0, 4);
    if (f === 0) { const b = pick(r, guided ? [10, 20] : [10, 20, 50]), c = int(r, 1, b - 1);
      return { kind: 'number', answer: b - c, prompt: { key: 'qChange', vars: { b, c } }, hint: { key: 'hChange', vars: { c, b } },
        aid: { type: 'bars', rows: [{ parts: [{ v: c, label: `${c} €` }, { v: b - c, label: '?' }] }], total: `${b} €` } }; }
    if (f === 1) { const p = pick(r, guided ? [10, 50] : [10, 20, 25, 50]), a = int(r, 2, guided ? 6 : 15) * 20, d = (a * p) / 100;
      return { kind: 'number', answer: a - d, prompt: { key: pick(r, ['qDiscShoes', 'qDiscBike', 'qDiscGame']), vars: { a, p } }, hint: { key: 'hDiscount', vars: { p, a } },
        aid: { type: 'bars', rows: [{ parts: [{ v: a - d, label: '?' }, { v: d, label: `${p} %`, shade: true }] }], total: `${a} €` } }; }
    if (f === 2) { const c = int(r, 3, 12), n = int(r, 18, 30);
      return { kind: 'number', answer: c * n, prompt: { key: 'qTripCost', vars: { c, n } }, hint: { key: 'hTripCost', vars: { n, c, t: Math.floor(n / 10) * 10, u: n % 10 } } }; }
    if (f === 3) { const k = pick(r, [12, 15, 20, 25, 30, 50, 55]); let n = int(r, k + 1, k * 5); if (n % k === 0) n += 1;
      const buses = Math.ceil(n / k);
      return { kind: 'number', answer: buses, prompt: { key: pick(r, ['qBuses', 'qTables']), vars: { n, k } }, hint: { key: 'hRoundUp', vars: { k } },
        aid: { type: 'bars', groups: true, rows: [{ parts: [...Array.from({ length: buses - 1 }, () => ({ v: k, label: String(k) })), { v: n - k * (buses - 1), label: String(n - k * (buses - 1)) }] }], total: String(n) } }; }
    // best buy: price of one in each pack (whole euros)
    let u1 = int(r, 1, 6), u2 = int(r, 1, 6); while (u2 === u1) u2 = int(r, 1, 6);
    const n1 = pick(r, [2, 3, 4]), n2 = pick(r, [5, 6, 8]);
    const A = { key: 'optPack', vars: { n: n1, p: n1 * u1 } }, B = { key: 'optPack', vars: { n: n2, p: n2 * u2 } };
    const first = r() < 0.5, opts = first ? [A, B] : [B, A], cheaper = u1 < u2 ? A : B;
    return { kind: 'choice', options: [1, 2], answer: opts.indexOf(cheaper) + 1, optionLabels: opts, prompt: { key: 'qBestBuy' }, hint: { key: 'hUnitPrice' } };
  },
};

/* ───────── F3 Time and timetables ───────── */
const CTX_DUR = ['qDurClass', 'qDurFilm', 'qDurTrip'];
const STOPS = ['stop_school', 'stop_square', 'stop_market', 'stop_station', 'stop_pool'];
const F3: Station = {
  id: 'F3', island: 'F', title: { key: 'st_F3' },
  model: () => ({ steps: [
    { say: { key: 'mF3_1' }, visual: { type: 'bars', rows: [{ parts: [{ v: 20, label: '9:40 → 10:00' }, { v: 35, label: '10:00 → 10:35' }] }], total: '?' } },
    { say: { key: 'mF3_2' }, visual: { type: 'bars', rows: [{ parts: [{ v: 20, label: '20 min' }, { v: 35, label: '35 min' }] }], total: '55 min' } },
    { say: { key: 'mF3_3' }, visual: { type: 'table', head: [{ key: 'tt_stop' }, lit('A'), lit('B')], rows: [[{ key: 'stop_school' }, lit('8:10'), lit('8:40')], [{ key: 'stop_square' }, lit('8:25'), lit('8:55')]], mark: [1, 1] } },
  ] }),
  make: (r, guided): Item => {
    const f = guided ? 0 : int(r, 0, 3);
    if (f === 0) { // how long: to the next o'clock, then the rest
      const a = int(r, 8 * 12, 17 * 12) * 5, d = int(r, 3, guided ? 15 : 30) * 5, b = a + d;
      const toHour = (60 - (a % 60)) % 60;
      const aid: Visual | undefined = toHour > 0 && toHour < d
        ? { type: 'bars', rows: [{ parts: [{ v: toHour, label: String(toHour) }, { v: d - toHour, label: '?' }] }], total: '? min' } : undefined;
      return { kind: 'number', answer: d, prompt: { key: pick(r, CTX_DUR), vars: { a: hm(a), b: hm(b) } }, hint: { key: 'hDur', vars: { a: hm(a) } }, aid };
    }
    if (f === 1) { // what time: as a choice (a time is not a whole number)
      const a = int(r, 8 * 12, 18 * 12) * 5, d = int(r, 5, 30) * 5, e = a + d;
      const wrong = [e + 60, e - 10, e + 10, e - 60].filter((w) => w !== e && w > a);
      return { ...choice3(r, lit(hm(e)), shuffle(r, wrong).map((w) => lit(hm(w)))), prompt: { key: 'qArrive', vars: { a: hm(a), d } }, hint: { key: 'hArrive' } };
    }
    if (f === 2) { // a bus timetable
      const stops = shuffle(r, STOPS).slice(0, 4), buses = 3;
      const gaps = stops.slice(1).map(() => int(r, 2, 5) * 5);
      const starts = Array.from({ length: buses }, (_, i) => (7 * 60 + int(r, 0, 5) * 5) + i * int(r, 4, 6) * 10);
      const time = (b: number, s: number) => starts[b] + gaps.slice(0, s).reduce((x, y) => x + y, 0);
      const bus = int(r, 0, buses - 1), s1 = int(r, 0, 2), s2 = int(r, s1 + 1, 3);
      const table: Visual = { type: 'table', head: [{ key: 'tt_stop' }, ...Array.from({ length: buses }, (_, b) => lit(String.fromCharCode(65 + b)))],
        rows: stops.map((s, si) => [{ key: s }, ...Array.from({ length: buses }, (_, b) => lit(hm(time(b, si))))]) };
      return { kind: 'number', answer: time(bus, s2) - time(bus, s1), prompt: { key: 'qTimetable', vars: { t: hm(time(bus, s1)), a: `$${stops[s1]}`, b: `$${stops[s2]}` } },
        hint: { key: 'hTimetable' }, visual: table, aid: { ...table, mark: [s2, bus + 1], mark2: [s1, bus + 1] } };
    }
    const h = int(r, 1, 3), m = int(r, 1, 11) * 5;
    return { kind: 'number', answer: h * 60 + m, prompt: { key: 'qToMinutes', vars: { h, m } }, hint: { key: 'hToMinutes', vars: { h } },
      aid: { type: 'bars', rows: [{ parts: [...Array.from({ length: h }, () => ({ v: 60, label: '60' })), { v: m, label: String(m) }] }], total: '?' } };
  },
};

/* ───────── F4 Reading school data: tables and charts ───────── */
const GRADES = [0, 1, 2, 3, 4].map((i): Msg => ({ key: `gr_${i}` }));
const SPORTS = [0, 1, 2, 3, 4].map((i): Msg => ({ key: `spo_${i}` }));
const F4: Station = {
  id: 'F4', island: 'F', title: { key: 'st_F4' },
  model: () => ({ steps: [
    { say: { key: 'mF4_1' }, visual: { type: 'table', head: [{ key: 'tt_grade' }, { key: 'tt_pupils' }], rows: [[GRADES[0], lit('3')], [GRADES[1], lit('5')], [GRADES[2], lit('6')], [GRADES[3], lit('4')], [GRADES[4], lit('2')]] } },
    { say: { key: 'mF4_2' }, visual: { type: 'table', head: [{ key: 'tt_grade' }, { key: 'tt_pupils' }], rows: [[GRADES[0], lit('3')], [GRADES[1], lit('5')], [GRADES[2], lit('6')], [GRADES[3], lit('4')], [GRADES[4], lit('2')]], mark: [3, 1], mark2: [4, 1] } },
    { say: { key: 'mF4_3' } },
  ] }),
  make: (r, guided): Item => {
    const f = guided ? int(r, 0, 1) : int(r, 0, 4);
    if (f <= 2) {
      // a class of 20 or 25 so that "what percentage" is a whole number
      const total = guided ? 20 : pick(r, [20, 25]);
      const c = [1, 1, 1, 1, 1]; for (let k = 5; k < total; k++) c[int(r, 0, 4)]++;
      const tab = (marks?: number[]): Visual => ({ type: 'table', head: [{ key: 'tt_grade' }, { key: 'tt_pupils' }], rows: GRADES.map((g, i) => [g, lit(String(c[i]))]),
        ...(marks ? { mark: [marks[0], 1] as [number, number], ...(marks[1] != null ? { mark2: [marks[1], 1] as [number, number] } : {}) } : {}) });
      if (f === 0) return { kind: 'number', answer: c[3] + c[4], prompt: { key: 'qGradeTop' }, hint: { key: 'hGradeTop' }, visual: tab(), aid: tab([3, 4]) };
      if (f === 1) { const i = int(r, 0, 4); return { kind: 'number', answer: total - c[i], prompt: { key: 'qGradeNot', vars: { g: `$gr_${i}`, n: total } }, hint: { key: 'hGradeNot', vars: { n: total } }, visual: tab(), aid: tab([i]) }; }
      const i = int(r, 0, 4);
      return { kind: 'number', answer: (c[i] * 100) / total, prompt: { key: 'qGradePct', vars: { g: `$gr_${i}`, n: total } }, hint: { key: 'hGradePct', vars: { n: total, k: 100 / total } }, visual: tab(), aid: tab([i]) };
    }
    const y = Array.from({ length: 5 }, () => int(r, 1, 12));
    const chart = (mark?: number): Visual => ({ type: 'chart', kind: 'bar', x: SPORTS, y, yMax: 14, yStep: 2, yTitle: { key: 'ax_pupils' }, mark });
    if (f === 3) { const i = int(r, 0, 4); let j = int(r, 0, 4); while (j === i || y[j] === y[i]) { j = (j + 1) % 5; if (j === i) { y[j] = y[j] < 12 ? y[j] + 1 : y[j] - 1; } }
      const [hi, lo] = y[i] > y[j] ? [i, j] : [j, i];
      return { kind: 'number', answer: y[hi] - y[lo], prompt: { key: 'qSportMore', vars: { a: `$spo_${hi}`, b: `$spo_${lo}` } }, hint: { key: 'hDiffChart' }, visual: chart(), aid: chart(hi) }; }
    return { kind: 'number', answer: y.reduce((a, b) => a + b, 0), prompt: { key: 'qSportTotal' }, hint: { key: 'hSportTotal' }, visual: chart(), aid: chart() };
  },
};

/* ───────── F5 Mean, median and range ───────── */
const LISTS = ['qListGoals', 'qListPoints', 'qListBooks', 'qListTemp'];
const F5: Station = {
  id: 'F5', island: 'F', title: { key: 'st_F5' },
  model: () => ({ steps: [
    { say: { key: 'mF5_1' }, visual: { type: 'chart', kind: 'bar', x: ['1', '2', '3', '4', '5'], y: [4, 6, 2, 7, 6], yMax: 8, yStep: 1 } },
    { say: { key: 'mF5_2' }, visual: { type: 'table', head: [lit('2'), lit('4'), lit('6'), lit('6'), lit('7')], rows: [], mark: [-1, 2] } },
    { say: { key: 'mF5_3' } },
  ] }),
  make: (r, guided): Item => {
    const f = guided ? int(r, 0, 1) : int(r, 0, 2);
    const n = f === 1 ? pick(r, [5, 7]) : pick(r, guided ? [3, 4, 5] : [4, 5, 6]);
    const v = Array.from({ length: n }, () => int(r, 1, 20));
    if (f === 0) { // make the total divisible by n so the mean is whole
      const extra = v.reduce((a, b) => a + b, 0) % n, top = v.indexOf(Math.max(...v));
      if (extra) v[top] = v[top] - extra >= 1 ? v[top] - extra : v[top] + (n - extra);
    }
    const sorted = [...v].sort((a, b) => a - b);
    const ctx = pick(r, LISTS), list = v.join(', ');
    const row = (vals: number[], mark?: number): Visual => ({ type: 'table', head: vals.map((x) => lit(String(x))), rows: [], ...(mark != null ? { mark: [-1, mark] as [number, number] } : {}) });
    if (f === 0) { const sum = v.reduce((a, b) => a + b, 0);
      const ch: Visual = { type: 'chart', kind: 'bar', x: v.map((_, i) => String(i + 1)), y: v, yMax: Math.max(...v) + 2, yStep: Math.max(...v) > 12 ? 2 : 1 };
      return { kind: 'number', answer: sum / n, prompt: { key: 'qMean', vars: { q: `$${ctx}`, l: list } }, hint: { key: 'hMean', vars: { n } }, visual: guided ? ch : undefined, aid: ch }; }
    if (f === 1) return { kind: 'number', answer: sorted[(n - 1) / 2], prompt: { key: 'qMedian', vars: { q: `$${ctx}`, l: list } }, hint: { key: 'hMedian' }, visual: guided ? row(v) : undefined, aid: row(sorted) };
    if (sorted[0] === sorted[n - 1]) v[0] = v[0] < 20 ? v[0] + 1 : v[0] - 1;
    const s2 = [...v].sort((a, b) => a - b);
    return { kind: 'number', answer: s2[n - 1] - s2[0], prompt: { key: 'qRange', vars: { q: `$${ctx}`, l: v.join(', ') } }, hint: { key: 'hRange' }, aid: row(s2) };
  },
};

/* ───────── F6 Proportion: recipes, sharing, rates ───────── */
const INGR = [{ k: 'ing_flour', u: 'g' }, { k: 'ing_milk', u: 'mL' }, { k: 'ing_pasta', u: 'g' }, { k: 'ing_sugar', u: 'g' }];
const F6: Station = {
  id: 'F6', island: 'F', title: { key: 'st_F6' },
  model: () => ({ steps: [
    { say: { key: 'mF6_1' }, visual: { type: 'bars', groups: true, rows: [{ parts: [1, 2, 3, 4].map(() => ({ v: 1, label: '50 g' })) }], total: '200 g' } },
    { say: { key: 'mF6_2' }, visual: { type: 'bars', groups: true, rows: [{ parts: [1, 2, 3, 4, 5, 6].map(() => ({ v: 1, label: '50 g' })) }], total: '?' } },
  ] }),
  make: (r, guided): Item => {
    const f = guided ? 0 : int(r, 0, 2);
    if (f === 0) { const I = pick(r, INGR), a = pick(r, [2, 4, 6]), per = pick(r, I.u === 'mL' ? [25, 50, 100] : [20, 25, 50, 75, 100]), q = per * a;
      let b = int(r, 1, 10); if (b === a) b += 1;
      return { kind: 'number', answer: per * b, prompt: { key: 'qRecipe', vars: { a, q, u: I.u, i: `$${I.k}`, b, w: `$un_${I.u}` } }, hint: { key: 'hRecipe', vars: { q, a } },
        aid: { type: 'bars', groups: true, rows: [{ parts: Array.from({ length: a }, () => ({ v: 1, label: `${per}` })) }], total: `${q} ${I.u}` } }; }
    if (f === 1) { const x = int(r, 1, 4), y = int(r, 1, 4), k = int(r, 2, 10), t = k * (x + y);
      return { kind: 'number', answer: k * x, prompt: { key: 'qShare', vars: { t, x, y } }, hint: { key: 'hShare', vars: { x, y, t } },
        aid: { type: 'bars', groups: true, rows: [{ parts: Array.from({ length: x }, () => ({ v: 1, label: '?' })) }, { parts: Array.from({ length: y }, () => ({ v: 1, label: '?' })) }] } }; }
    const p = int(r, 2, 9), m = pick(r, [5, 10, 15, 20]), times = int(r, 2, 6);
    return { kind: 'number', answer: p * times, prompt: { key: pick(r, ['qRatePages', 'qRateLaps']), vars: { p, m, M: m * times } }, hint: { key: 'hRate', vars: { m, M: m * times } },
      aid: { type: 'bars', groups: true, rows: [{ parts: Array.from({ length: times }, () => ({ v: 1, label: `${p}` })) }], total: '?' } };
  },
};

export const LIFE_STATIONS: Station[] = [F1, F2, F3, F4, F5, F6];
