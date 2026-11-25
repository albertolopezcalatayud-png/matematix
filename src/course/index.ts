import type { Lang } from '@/engine/types';
import { fmtNum } from '@/i18n';
import { int, rng, shuffle } from '@/engine/rng';
import { CATALOG } from './catalog';
import type { Ans, Block, ContentPack, Course, Lesson, LessonContent, Q, Subject, T3 } from './types';

export { CATALOG };
export const LI: Record<Lang, 0 | 1 | 2> = { es: 0, ca: 1, en: 2 };
export const tr = (lang: Lang, t: T3) => t[LI[lang]];

export const COURSE_IDS = CATALOG.map((c) => c.id);
/** Colour of each subject (reuses the four island colours): maths lilac, life sciences green, physics blue, technology orange. */
export const SUBJ_COLOUR: Record<string, string> = { M: 'A', MA: 'A', MB: 'A', CM: 'B', BG: 'B', FQ: 'C', TD: 'D', TC: 'D', DG: 'D' };
export const SUBJ_EMOJI: Record<string, string> = { M: '🔢', MA: '🔢', MB: '📐', CM: '🌱', BG: '🧬', FQ: '⚗️', TD: '🛠️', TC: '⚙️', DG: '💻' };

export const courseOf = (id: string | null | undefined): Course | undefined => CATALOG.find((c) => c.id === id);
export function findLesson(id: string): { course: Course; subject: Subject; block: Block; lesson: Lesson; index: number; all: Lesson[] } | undefined {
  const [c, s] = id.split('-');
  const course = courseOf(c); const subject = course?.subjects.find((x) => x.code === s);
  if (!course || !subject) return undefined;
  const all = subject.blocks.flatMap((b) => b.lessons);
  const index = all.findIndex((l) => l.id === id);
  if (index < 0) return undefined;
  return { course, subject, block: subject.blocks.find((b) => b.lessons.some((l) => l.id === id))!, lesson: all[index], index, all };
}
export const lessonsOf = (subject: Subject) => subject.blocks.flatMap((b) => b.lessons);

/* ───── Content: one file per course and subject, loaded only when it is opened ───── */
const FILES = import.meta.glob<{ default: ContentPack }>('./content/*.ts');
const cache: Record<string, ContentPack> = {};
export async function loadPack(courseId: string, code: string): Promise<ContentPack> {
  const key = `${courseId}-${code}`;
  if (cache[key]) return cache[key];
  const f = FILES[`./content/${key}.ts`];
  cache[key] = f ? (await f()).default : {};
  return cache[key];
}
export async function loadLesson(id: string): Promise<LessonContent | undefined> {
  const [c, s] = id.split('-');
  return (await loadPack(c, s))[id];
}

/* ───── Answers ───── */
export const isText = (a: Ans): a is T3 => Array.isArray(a);
/** A number or a fraction like "-3/4": these can be typed on the keypad. */
export const isTypeable = (a: Ans) => typeof a === 'number' || (typeof a === 'string' && /^-?\d+(\/\d+)?$/.test(a));
/** A number as each language writes it: 0,5 / 0.5; groups of three from 10 000 (es, ca) or 1,000 (en). */
export function num(lang: Lang, v: number): string {
  const neg = v < 0; const s = fmtNum(lang, Math.abs(v)); const [i, d] = s.split(/[.,]/);
  const sep = lang === 'en' ? ',' : '\u00A0'; const min = lang === 'en' ? 4 : 5;
  const ii = i.length >= min ? i.replace(/\B(?=(\d{3})+(?!\d))/g, sep) : i;
  return (neg ? '−' : '') + ii + (d !== undefined ? (lang === 'en' ? '.' : ',') + d : '');
}
export function showAns(lang: Lang, a: Ans): string {
  if (typeof a === 'number') return num(lang, a);
  if (typeof a === 'string') return a.replace(/-/g, '−');
  return tr(lang, a);
}
const keyOf = (a: Ans) => (typeof a === 'number' ? `n${a}` : typeof a === 'string' ? `s${a}` : `t${a[0]}`);
/** Is the typed text the right answer? Decimals with comma or point; a fraction must be written exactly as asked. */
export function typedIsRight(a: Ans, typed: string): boolean {
  const s = typed.trim().replace(/−/g, '-').replace(',', '.');
  if (s === '' || s === '-') return false;
  if (typeof a === 'number') return Math.abs(Number(s) - a) < 1e-9;
  if (typeof a === 'string') return s === a;
  return false;
}

/* ───── Sessions ───── */
export type Level = 1 | 2 | 3;
export const PER_LEVEL = 5;
/** The options for one exercise at one level: level 1 has 3 options, levels 2 and 3 have 4. */
export function optionsFor(qq: Q, level: Level, r: () => number): Ans[] {
  const seen = new Set([keyOf(qq.a)]);
  const wrong = shuffle(r, qq.wrong).filter((w) => { const k = keyOf(w); if (seen.has(k)) return false; seen.add(k); return true; });
  const out = [qq.a, ...wrong.slice(0, level === 1 ? 2 : 3)];
  // numbers in order (easier to read); texts mixed
  return out.every((x) => typeof x === 'number') ? (out as number[]).sort((a, b) => a - b) : shuffle(r, out);
}
export const qKey = (qq: Q) => `${qq.q[0]}|${keyOf(qq.a)}|${qq.visual ? JSON.stringify(qq.visual).slice(0, 120) : ''}`;
/** The 5 exercises of a session: no repeats inside it, and preferably none seen recently. */
export function pickQs(content: LessonContent, seed: number, recent: Set<string>, n = PER_LEVEL): Q[] {
  const r = rng(seed);
  const out: Q[] = []; const used = new Set<string>();
  const bank = shuffle(r, content.bank ?? []);
  const fromBank = content.make ? (bank.length ? Math.min(bank.length, int(r, 1, 2)) : 0) : n;
  for (const qq of [...bank.filter((x) => !recent.has(qKey(x))), ...bank.filter((x) => recent.has(qKey(x)))]) {
    if (out.length >= fromBank) break;
    if (!used.has(qKey(qq))) { used.add(qKey(qq)); out.push(qq); }
  }
  if (content.make) {
    let guard = 0;
    while (out.length < n && guard++ < 400) {
      const qq = content.make(rng((seed + guard * 7907) >>> 0));
      const k = qKey(qq);
      if (used.has(k) || (recent.has(k) && guard < 300)) continue;
      used.add(k); out.push(qq);
    }
  }
  // a short bank: repeat in another order rather than leave the session short
  for (let i = 0; out.length < n && bank.length; i++) out.push(bank[i % bank.length]);
  return shuffle(r, out);
}
