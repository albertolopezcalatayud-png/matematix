import { describe, expect, test } from 'vitest';
import { CATALOG, lessonsOf, optionsFor, pickQs, qKey } from '../../src/course';
import { rng } from '../../src/engine/rng';
import type { Ans, ContentPack, LessonContent, Q, T3 } from '../../src/course/types';

// Every content file, loaded eagerly for the checks.
const FILES = import.meta.glob<{ default: ContentPack }>('../../src/course/content/*.ts', { eager: true });
const PACKS: Record<string, ContentPack> = Object.fromEntries(Object.entries(FILES).map(([k, v]) => [k.split('/').pop()!.replace('.ts', ''), v.default]));
const SEEDS = 300;

const key = (a: Ans) => (typeof a === 'number' ? `n${a}` : typeof a === 'string' ? `s${a}` : `t${a[0]}`);

/** A text in three languages: none empty, the right punctuation for each, no Castilian giveaways in valencià. */
function checkT3(t: T3, where: string) {
  expect(Array.isArray(t) && t.length === 3, `${where}: not a T3`).toBe(true);
  t.forEach((s, i) => expect(typeof s === 'string' && s.trim().length > 0, `${where}[${i}] empty`).toBe(true));
  const [es, ca, en] = t;
  for (const s of [es, ca, en]) expect(s, where).not.toMatch(/gratuit/i);
  expect(ca, `${where} (ca): ${ca}`).not.toMatch(/[¿¡ñ]|[a-záéíóú] y [a-záéíóú]|\b(pero|también|entonces|hay|muy|cuántos|cuántas|qué|cuál)\b/i);
  expect(en, `${where} (en): ${en}`).not.toMatch(/[¿¡ñ]/);
  // a written question in castellano opens with ¿ (not "5 + ? = 9")
  if (/[a-záéíóúñ)»] ?\?/i.test(es)) expect(es.includes('¿'), `${where} (es) opening ¿: ${es}`).toBe(true);
  expect(`${es}${ca}${en}`, where).not.toMatch(/undefined|NaN|\[object/);
}
function checkQ(qq: Q, where: string) {
  checkT3(qq.q, `${where}.q`); checkT3(qq.hint, `${where}.hint`);
  expect(qq.wrong.length, `${where}: needs at least one wrong option`).toBeGreaterThan(0);
  const ks = new Set(qq.wrong.map(key));
  expect(ks.has(key(qq.a)), `${where}: the answer is among the wrong options (${JSON.stringify(qq.a)})`).toBe(false);
  for (const a of [qq.a, ...qq.wrong]) {
    if (typeof a === 'number') expect(Number.isFinite(a), `${where}: ${a}`).toBe(true);
    else if (Array.isArray(a)) checkT3(a as T3, `${where}.option`);
  }
  // the options shown must be different from each other in every language
  for (const lv of [1, 2, 3] as const) {
    const opts = optionsFor(qq, lv, rng(7));
    for (const li of [0, 1, 2]) {
      const shown = opts.map((o) => (Array.isArray(o) ? o[li] : String(o)));
      expect(new Set(shown).size, `${where}: repeated option ${shown.join(' | ')}`).toBe(shown.length);
    }
  }
}

describe('catalog', () => {
  test('683 lessons with unique ids and three-language titles', () => {
    const all = CATALOG.flatMap((c) => c.subjects.flatMap(lessonsOf));
    expect(all.length).toBe(683);
    expect(new Set(all.map((l) => l.id)).size).toBe(all.length);
    for (const l of all) checkT3(l.title, l.id);
  });
});

describe('content', () => {
  for (const [file, pack] of Object.entries(PACKS)) {
    const [c, s] = file.split('-');
    const subject = CATALOG.find((x) => x.id === c)?.subjects.find((x) => x.code === s);
    test(`${file}: one entry for every lesson of the subject, and nothing else`, () => {
      expect(subject, file).toBeTruthy();
      const ids = lessonsOf(subject!).map((l) => l.id);
      expect(Object.keys(pack).sort()).toEqual([...ids].sort());
    });
    for (const [id, les] of Object.entries(pack) as [string, LessonContent][]) {
      test(`${id}`, () => {
        expect(les.explain.length).toBeGreaterThan(0);
        les.explain.forEach((x, i) => checkT3(x, `${id}.explain${i}`));
        checkT3(les.example.q, `${id}.example.q`); les.example.steps.forEach((x, i) => checkT3(x, `${id}.step${i}`));
        expect(les.make || les.bank, `${id}: no exercises`).toBeTruthy();
        (les.bank ?? []).forEach((qq, i) => checkQ(qq, `${id}.bank${i}`));
        if (!les.make) expect((les.bank ?? []).length, `${id}: a written bank needs at least 6 exercises`).toBeGreaterThanOrEqual(6);
        if (les.make) {
          const keys = new Set<string>();
          for (let sd = 1; sd <= SEEDS; sd++) { const qq = les.make(rng(sd * 2654435761)); checkQ(qq, `${id}#${sd}`); keys.add(qKey(qq)); }
          expect(keys.size + (les.bank?.length ?? 0), `${id}: too little variety (${keys.size})`).toBeGreaterThanOrEqual(6);
        }
        const qs = pickQs(les, 12345, new Set());
        expect(qs.length).toBe(5);
      });
    }
  }
});
