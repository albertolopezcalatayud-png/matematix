import { describe, expect, test } from 'vitest';
import { STATIONS, isRight } from '../../src/data/stations';
import { rng } from '../../src/engine/rng';
import { translate } from '../../src/i18n/index';
import { MESSAGES } from '../../src/i18n/messages';
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
        checkMsg(it.prompt); checkMsg(it.hint); checkVisual(it.visual);
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
      // guided and independent versions use the same numbers (the support picture matches the exercise)
      const g = st.make(rng(seed), true), i = st.make(rng(seed), false);
      if (st.id !== 'A6') expect(answerOf(g)).toBe(answerOf(i));
    }
  });
});

test('every message has the three languages and the same {placeholders}', () => {
  for (const [k, row] of Object.entries(MESSAGES)) {
    expect(row.length, k).toBe(3);
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
