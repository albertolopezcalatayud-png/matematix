import { describe, expect, test } from 'vitest';
import { STATIONS, isRight } from '../../src/data/stations';
import { rng } from '../../src/engine/rng';
import { translate } from '../../src/i18n/index';
import { MESSAGES } from '../../src/i18n/messages';
import { ADULT } from '../../src/i18n/adults';
import type { Item, Msg, Visual } from '../../src/engine/types';

const LANGS = ['es', 'ca', 'en'] as const;
const N = 10000;

function checkMsg(msg: Msg) {
  expect(MESSAGES, `missing key ${msg.key}`).toHaveProperty(msg.key);
  for (const l of LANGS) expect(translate(l, msg.key, msg.vars), `${l}:${msg.key}`).not.toMatch(/\{\w+\}/);
}
function checkVisual(v?: Visual) {
  if (!v) return;
  if (v.type === 'line') {
    expect(v.min).toBeLessThan(v.max);
    for (const x of [...v.marks, ...v.labels, ...(v.point != null ? [v.point] : []), ...(v.jumps ?? []).flat()]) { expect(x).toBeGreaterThanOrEqual(v.min); expect(x).toBeLessThanOrEqual(v.max); }
  }
  if (v.type === 'dots') v.groups.forEach((g) => { expect(g).toBeGreaterThanOrEqual(0); expect(g).toBeLessThanOrEqual(10); });
  if (v.type === 'frame') { expect(v.filled).toBeGreaterThanOrEqual(1); expect(v.filled).toBeLessThanOrEqual(9); }
  if (v.type === 'tens') { expect(v.tens).toBeGreaterThanOrEqual(1); expect(v.ones).toBeLessThanOrEqual(9); }
}
const answerOf = (it: Item) => (it.kind === 'place' ? it.target : it.answer);

describe.each(STATIONS.map((s) => [s.id, s] as const))('station %s', (_id, st) => {
  test('worked example texts exist in the three languages', () => {
    const md = st.model(rng(1));
    expect(md.steps.length).toBeGreaterThan(0);
    md.steps.forEach((s) => { checkMsg(s.say); checkVisual(s.visual); });
    checkMsg(st.title);
  });
  test(`${N} generated exercises are valid (guided and independent)`, () => {
    for (let seed = 0; seed < N; seed++) {
      for (const guided of [true, false]) {
        const it = st.make(rng(seed), guided);
        checkMsg(it.prompt); checkMsg(it.hint); checkVisual(it.visual); checkVisual(it.aid);
        // the strategy pictures never land on the answer of a typed exercise (the child makes the last step)
        if (it.kind === 'number' && it.prompt.key !== 'qHowManyJumps') for (const v of [it.visual, it.aid]) if (v?.type === 'line' && v.jumps?.length) expect(v.jumps.at(-1)![1], `${st.id} ${JSON.stringify(it.prompt)}`).not.toBe(it.answer);
        if (it.kind === 'number' && it.thread) {
          const th = it.thread;
          expect(th.start).toBeGreaterThanOrEqual(th.min); expect(th.start).toBeLessThanOrEqual(th.max);
          expect(it.answer, `${st.id} thread answer inside the line`).toBeGreaterThanOrEqual(th.min); expect(it.answer).toBeLessThanOrEqual(th.max);
          expect(it.answer).not.toBe(th.start);
          expect(Number.isInteger((it.answer - th.start) / th.step), `${st.id} reachable in whole jumps`).toBe(true);
          expect(th.max - th.min, 'short enough to drag with a finger').toBeLessThanOrEqual(30 * th.step);
        }
        if (it.kind === 'place' && it.aidMarks) { expect(it.aidMarks.length).toBeGreaterThan(it.marks.length); }
        const a = answerOf(it);
        expect(Number.isInteger(a)).toBe(true);
        expect(a).toBeGreaterThanOrEqual(0);
        expect(isRight(it, a)).toBe(true);
        if (it.kind === 'choice') {
          expect(it.options).toContain(it.answer);
          expect(new Set(it.options).size).toBe(it.options.length);
          it.options.filter((o) => o !== it.answer).forEach((o) => expect(isRight(it, o)).toBe(false));
          it.options.forEach((o) => expect(o).toBeGreaterThanOrEqual(0));
        }
        if (it.kind === 'place') {
          expect(it.target).toBeGreaterThan(it.min); expect(it.target).toBeLessThan(it.max);
          // the line labels never give the target away on their own
          expect(it.labels.includes(it.target) && it.marks.length <= 3).toBe(false);
        }
      }
    }
  });
});

test('every message has the three languages and the same {placeholders}', () => {
  for (const [k, row] of Object.entries({ ...MESSAGES, ...ADULT })) {
    expect(row.length, k).toBe(3);
    expect(MESSAGES, `duplicate key ${k}`).not.toHaveProperty(k in ADULT ? k : '__none__');
    if (row[0].includes('|')) { expect(row[1].split('|').length, `ca ${k}`).toBe(row[0].split('|').length); expect(row[2].split('|').length, `en ${k}`).toBe(row[0].split('|').length); }
    const ph = (s: string) => [...new Set(s.match(/\{\w+\}/g) ?? [])].sort().join();
    expect(ph(row[1]), `ca ${k}`).toBe(ph(row[0]));
    expect(ph(row[2]), `en ${k}`).toBe(ph(row[0]));
    row.forEach((s) => expect(s.trim().length, k).toBeGreaterThan(0));
  }
});

test('the voice reads symbols as words', async () => {
  const { speakable } = await import('../../src/i18n/index');
  expect(speakable('es', '8 + 5 = ?')).toBe('8 más 5 es igual a cuánto');
  expect(speakable('ca', '7 − 1 = ?')).toBe('7 menys 1 és igual a quant');
  expect(speakable('en', '3 × 5 = ?')).toBe('3 times 5 equals what');
});

import { itemKey } from '../../src/data/stations';
test('each station has many different exercises (so they are not repeated)', () => {
  const counts: Record<string, number> = {};
  for (const st of STATIONS) {
    const keys = new Set<string>();
    for (let seed = 0; seed < 200000; seed++) keys.add(itemKey(st.make(rng(seed), false)));
    counts[st.id] = keys.size;
  }
  console.log('VARIANTS ' + JSON.stringify(counts) + ' TOTAL ' + Object.values(counts).reduce((a, b) => a + b, 0));
  for (const [id, n] of Object.entries(counts)) expect(n, id).toBeGreaterThanOrEqual(100);
});

import { pickItems } from '../../src/engine/session';
import { SEEN_MAX } from '../../src/stores/app';
test('a child practising every day does not meet the same exercise again until the station runs out of new ones', () => {
  const report: string[] = [];
  for (const st of STATIONS) {
    let seen: string[] = [];
    let firstRepeatSession = 0;
    for (let session = 1; session <= 400 && !firstRepeatSession; session++) {
      const items = pickItems(st, session * 99991, new Set(seen));
      const keys = items.filter((x) => !x.guided).map((x) => itemKey(x.item));
      if (keys.some((k) => seen.includes(k))) firstRepeatSession = session;
      seen = [...seen, ...items.map((x) => itemKey(x.item))].slice(-SEEN_MAX);
    }
    report.push(`${st.id}:${firstRepeatSession || '>400'}`);
    // at least 15 sessions (3 weeks of daily practice) with no repeated exercise in any station
    expect(firstRepeatSession === 0 || firstRepeatSession > 15, `${st.id} repeats at session ${firstRepeatSession}`).toBe(true);
  }
  console.log('FIRST_REPEAT ' + report.join(' '));
});

import { answerPlacement, startPlacement } from '../../src/engine/placement';
import { ORDER } from '../../src/data/world';
test('the starting point lands exactly where a child stops knowing, in few questions', () => {
  const asked: number[] = [];
  for (let k = 0; k <= ORDER.length; k++) {
    // a child who can do the first k stations of the route and none after
    let p = startPlacement();
    while (!p.done) p = answerPlacement(p, p.at < k);
    expect(p.done, `child who knows ${k}`).toBe(ORDER[Math.min(k, ORDER.length - 1)]);
    expect(p.allRight).toBe(k === ORDER.length);
    asked.push(p.asked);
  }
  console.log('PLACEMENT_QUESTIONS ' + asked.join(','));
  expect(Math.max(...asked)).toBeLessThanOrEqual(10);
});
