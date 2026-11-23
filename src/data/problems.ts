import type { Item, Msg, Station, Visual } from '@/engine/types';
import { int, shuffle } from '@/engine/rng';

/* Island C: word problems by SCHEMA (join, change, compare, equal groups), always drawn as a bar model.
 * Evidence: schema-based instruction is one of the strongest findings for pupils with maths difficulties (WWC 2021);
 * "keyword" tricks ("altogether means add") are deliberately avoided. Names and objects are messages ($nm_*, $ob_*),
 * so each language has its own names and grammar. */

const NAMES = 10, OBJECTS = 6;
const pick2 = (r: () => number) => { const a = int(r, 0, NAMES - 1); let b = int(r, 0, NAMES - 1); while (b === a) b = int(r, 0, NAMES - 1); return [a, b]; };
const vars = (r: () => number) => { const [x, y] = pick2(r), o = int(r, 0, OBJECTS - 1); return { n1: `$nm_${x}`, n2: `$nm_${y}`, obj: `$ob_${o}`, Q: `$oq_${o}`, QM: `$oqm_${o}` }; };
const nameMsg = (v: string): Msg => ({ key: v.slice(1) });
/** Sizes grow with practice: small numbers in guided practice, up to 100 (and sometimes 1000) on your own. */
const size = (r: () => number, guided: boolean) => (guided ? 10 : [20, 50, 100, 100, 1000][int(r, 0, 4)]);
const bars = (rows: Extract<Visual, { type: 'bars' }>['rows'], extra: Partial<Extract<Visual, { type: 'bars' }>> = {}): Visual => ({ type: 'bars', rows, ...extra });

const C1: Station = {
  id: 'C1', island: 'C', title: { key: 'st_C1' },
  model: () => ({ steps: [
    { say: { key: 'mC1_1' } },
    { say: { key: 'mC1_2' }, visual: bars([{ parts: [{ v: 5, label: '5' }, { v: 3, label: '3' }] }], { total: '?' }) },
    { say: { key: 'mC1_3' }, visual: bars([{ parts: [{ v: 5, label: '5' }, { v: 3, label: '3' }] }], { total: '8' }) },
  ] }),
  make: (r, guided): Item => {
    const V = vars(r), N = size(r, guided), a = int(r, 1, Math.max(2, Math.floor(N * 0.6))), b = int(r, 1, Math.max(2, N - a)), c = a + b;
    if (guided || r() < 0.5) return { kind: 'number', answer: c, prompt: { key: 'pJoinTotal', vars: { ...V, a, b } }, hint: { key: 'hJoinTotal' },
      visual: guided ? bars([{ parts: [{ v: a, label: String(a) }, { v: b, label: String(b) }] }], { total: '?' }) : undefined,
      aid: bars([{ parts: [{ v: a, label: String(a) }, { v: b, label: String(b) }] }], { total: '?' }) };
    return { kind: 'number', answer: b, prompt: { key: 'pJoinPart', vars: { ...V, a, c } }, hint: { key: 'hJoinPart' },
      aid: bars([{ parts: [{ v: a, label: String(a) }, { v: b, label: '?' }] }], { total: String(c) }) };
  },
};

const C2: Station = {
  id: 'C2', island: 'C', title: { key: 'st_C2' },
  model: () => ({ steps: [
    { say: { key: 'mC2_1' } },
    { say: { key: 'mC2_2' }, visual: bars([{ parts: [{ v: 9, label: '9' }] }, { parts: [{ v: 6, label: '?' }, { v: 3, label: '3' }] }]) },
    { say: { key: 'mC2_3' }, visual: bars([{ parts: [{ v: 9, label: '9' }] }, { parts: [{ v: 6, label: '6' }, { v: 3, label: '3' }] }]) },
  ] }),
  make: (r, guided): Item => {
    const V = vars(r), N = size(r, guided), f = guided ? int(r, 0, 1) : int(r, 0, 3);
    const a = int(r, 2, Math.max(3, Math.floor(N * 0.7))), b = int(r, 1, Math.max(2, Math.floor(N * 0.4)));
    if (f === 0) { // gets more: result unknown
      const c = a + b;
      const pic = bars([{ parts: [{ v: a, label: String(a) }, { v: b, label: `+${b}` }] }], { total: '?' });
      return { kind: 'number', answer: c, prompt: { key: 'pChangeAdd', vars: { ...V, a, b } }, hint: { key: 'hChangeAdd' }, visual: guided ? pic : undefined, aid: pic };
    }
    if (f === 1) { // gives away: what is left
      const big = a + b; // so it never goes below zero
      const pic = bars([{ parts: [{ v: big, label: String(big) }] }, { parts: [{ v: a, label: '?' }, { v: b, label: `−${b}` }] }]);
      return { kind: 'number', answer: a, prompt: { key: 'pChangeSub', vars: { ...V, a: big, b } }, hint: { key: 'hChangeSub' }, visual: guided ? pic : undefined, aid: pic };
    }
    if (f === 2) { // the change is unknown
      const c = a + b;
      return { kind: 'number', answer: b, prompt: { key: 'pChangeHow', vars: { ...V, a, c } }, hint: { key: 'hChangeHow' },
        aid: bars([{ parts: [{ v: a, label: String(a) }, { v: b, label: '?' }] }], { total: String(c) }) };
    }
    const c = a + b; // the start is unknown
    return { kind: 'number', answer: a, prompt: { key: 'pChangeStart', vars: { ...V, b, c } }, hint: { key: 'hChangeStart' },
      aid: bars([{ parts: [{ v: a, label: '?' }, { v: b, label: `+${b}` }] }], { total: String(c) }) };
  },
};

const C3: Station = {
  id: 'C3', island: 'C', title: { key: 'st_C3' },
  model: () => ({ steps: [
    { say: { key: 'mC3_1' } },
    { say: { key: 'mC3_2' }, visual: bars([{ parts: [{ v: 7, label: '7' }] }, { parts: [{ v: 10, label: '10' }] }], { diff: '?' }) },
    { say: { key: 'mC3_3' }, visual: bars([{ parts: [{ v: 7, label: '7' }] }, { parts: [{ v: 10, label: '10' }] }], { diff: '3' }) },
  ] }),
  make: (r, guided): Item => {
    const V = vars(r), N = size(r, guided), f = guided ? 0 : int(r, 0, 2);
    const a = int(r, 2, Math.max(3, Math.floor(N * 0.6))), d = int(r, 1, Math.max(2, Math.floor(N * 0.4)));
    const rows = (x: number, y: number, lx: string, ly: string) => [{ parts: [{ v: x, label: lx }], name: nameMsg(V.n1) }, { parts: [{ v: y, label: ly }], name: nameMsg(V.n2) }];
    if (f === 0) { // the difference
      const c = a + d;
      const pic = bars(rows(a, c, String(a), String(c)), { diff: '?' });
      return { kind: 'number', answer: d, prompt: { key: 'pCompareDiff', vars: { ...V, a, c } }, hint: { key: 'hCompareDiff' }, visual: guided ? pic : undefined, aid: pic };
    }
    if (f === 1) { // n2 has d more
      return { kind: 'number', answer: a + d, prompt: { key: 'pCompareMore', vars: { ...V, a, b: d } }, hint: { key: 'hCompareMore' },
        aid: bars(rows(a, a + d, String(a), '?'), { diff: `+${d}` }) };
    }
    const big = a + d; // n2 has d fewer
    return { kind: 'number', answer: a, prompt: { key: 'pCompareLess', vars: { ...V, a: big, b: d } }, hint: { key: 'hCompareLess' },
      aid: bars(rows(big, a, String(big), '?'), { diff: `−${d}` }) };
  },
};

/** What kind of problem is it? Short texts with no numbers: recognising the schema is the skill, not the sum. */
const SCHEMAS = ['join', 'change', 'compare', 'groups'] as const;
const C4: Station = {
  id: 'C4', island: 'C', title: { key: 'st_C4' },
  model: () => ({ steps: [
    { say: { key: 'mC4_1' }, visual: bars([{ parts: [{ v: 4, label: 'A' }, { v: 3, label: 'B' }] }], { total: '?' }) },
    { say: { key: 'mC4_2' }, visual: bars([{ parts: [{ v: 6, label: '' }] }, { parts: [{ v: 4, label: '' }, { v: 2, label: '−' }] }]) },
    { say: { key: 'mC4_3' }, visual: bars([{ parts: [{ v: 5, label: '' }] }, { parts: [{ v: 8, label: '' }] }], { diff: '?' }) },
    { say: { key: 'mC4_4' }, visual: bars([{ parts: [{ v: 3, label: '' }, { v: 3, label: '' }, { v: 3, label: '' }] }], { total: '?', groups: true }) },
  ] }),
  make: (r, guided): Item => {
    if (!guided && r() < 0.5) {
      // Which operation? A real problem with numbers; choose add or take away (no keywords: think of the picture)
      const inner = [C1, C2, C3][int(r, 0, 2)].make(r, false) as Extract<Item, { kind: 'number' }>;
      const add = /pJoinTotal|pChangeAdd|pCompareMore/.test(inner.prompt.key);
      return { kind: 'choice', options: [1, 2], answer: add ? 1 : 2, optionLabels: [{ key: 'op_add' }, { key: 'op_sub' }],
        prompt: { key: 'pWhichOp', vars: { p: `$${inner.prompt.key}` , ...inner.prompt.vars } }, hint: { key: 'hWhichOp' }, aid: inner.aid };
    }
    const s = int(r, 0, 3), v = int(r, 0, 2);
    const opts = shuffle(r, [0, 1, 2, 3]).map((i) => i + 1);
    return { kind: 'choice', options: opts, answer: s + 1, optionLabels: opts.map((o) => ({ key: `sch_${SCHEMAS[o - 1]}` })),
      prompt: { key: 'pSchema', vars: { p: `$ps_${SCHEMAS[s]}_${v}` } }, hint: { key: 'hWhichSchema' } };
  },
};

const C5: Station = {
  id: 'C5', island: 'C', title: { key: 'st_C5' },
  model: () => ({ steps: [
    { say: { key: 'mC5_1' } },
    { say: { key: 'mC5_2' }, visual: bars([{ parts: [{ v: 5, label: '5' }, { v: 5, label: '5' }, { v: 5, label: '5' }] }], { total: '?', groups: true }) },
    { say: { key: 'mC5_3' }, visual: bars([{ parts: [{ v: 5, label: '5' }, { v: 5, label: '5' }, { v: 5, label: '5' }] }], { total: '15', groups: true }) },
  ] }),
  make: (r, guided): Item => {
    const V = vars(r), n = int(r, 2, guided ? 5 : 10), k = int(r, 2, guided ? 5 : 10), c = n * k, f = guided ? 0 : int(r, 0, 2);
    const boxes = (lab: (i: number) => string, total: string) => bars([{ parts: Array.from({ length: n }, (_, i) => ({ v: k, label: lab(i) })) }], { total, groups: true });
    if (f === 0) { const pic = boxes(() => String(k), '?'); return { kind: 'number', answer: c, prompt: { key: 'pGroupsTotal', vars: { ...V, a: n, b: k } }, hint: { key: 'hGroupsTotal' }, visual: guided ? pic : undefined, aid: pic }; }
    if (f === 1) return { kind: 'number', answer: k, prompt: { key: 'pGroupsShare', vars: { ...V, c, a: n } }, hint: { key: 'hGroupsShare' }, aid: boxes(() => '?', String(c)) };
    return { kind: 'number', answer: n, prompt: { key: 'pGroupsHowMany', vars: { ...V, b: k, c } }, hint: { key: 'hGroupsHowMany' }, aid: boxes(() => String(k), String(c)) };
  },
};

const C6: Station = {
  id: 'C6', island: 'C', title: { key: 'st_C6' },
  model: () => ({ steps: [
    { say: { key: 'mC6_1' } },
    { say: { key: 'mC6_2' }, visual: bars([{ parts: [{ v: 8, label: '8' }, { v: 5, label: '+5' }] }], { total: '13' }) },
    { say: { key: 'mC6_3' }, visual: bars([{ parts: [{ v: 13, label: '13' }] }, { parts: [{ v: 9, label: '?' }, { v: 4, label: '−4' }] }]) },
  ] }),
  make: (r, guided): Item => {
    const V = vars(r), N = guided ? 20 : [50, 100, 100, 1000][int(r, 0, 3)], f = int(r, 0, 1);
    if (f === 0) { // get some, then give some away
      const a = int(r, 3, Math.floor(N * 0.5)), b = int(r, 1, Math.floor(N * 0.3)), d = int(r, 1, a + b - 1);
      return { kind: 'number', answer: a + b - d, prompt: { key: 'pTwoStep1', vars: { ...V, a, b, d } }, hint: { key: 'hTwoStep1', vars: { a, b } },
        aid: bars([{ parts: [{ v: a, label: String(a) }, { v: b, label: `+${b}` }] }, { parts: [{ v: a + b - d, label: '?' }, { v: d, label: `−${d}` }] }]) };
    }
    const a = int(r, 2, Math.floor(N * 0.4)), d = int(r, 1, Math.floor(N * 0.3)); // n2 has d more; how many altogether?
    return { kind: 'number', answer: 2 * a + d, prompt: { key: 'pTwoStep2', vars: { ...V, a, b: d } }, hint: { key: 'hTwoStep2' },
      aid: bars([{ parts: [{ v: a, label: String(a) }], name: nameMsg(V.n1) }, { parts: [{ v: a, label: String(a) }, { v: d, label: `+${d}` }], name: nameMsg(V.n2) }], { }) };
  },
};

export const PROBLEM_STATIONS: Station[] = [C1, C2, C3, C4, C5, C6];
