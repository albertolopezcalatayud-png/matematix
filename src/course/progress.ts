// Progress summaries for the new structure (course → subject → block → lesson).
import { CATALOG, courseOf, lessonsOf } from './index';
import { lessonStatus, type LessonProgress } from '@/stores/app';
import type { Lesson, Subject } from './types';

export type Lessons = Record<string, LessonProgress>;

/** How many lessons are complete and how many are started, in one course or in all of them. */
export function counts(lessons: Lessons, courseId?: string | null) {
  const courses = courseId ? [courseOf(courseId)].filter(Boolean) : CATALOG;
  let d = 0, g = 0;
  for (const c of courses) for (const s of c!.subjects) for (const l of lessonsOf(s)) {
    const st = lessonStatus(lessons[l.id]);
    if (st === 'done') d++; else if (st === 'doing') g++;
  }
  return { d, g };
}

/** Lessons that are not "to do", grouped by subject, in catalogue order. */
export function startedBySubject(lessons: Lessons, courseId?: string | null): { course: string; subject: Subject; items: { lesson: Lesson; p: LessonProgress }[] }[] {
  const out: { course: string; subject: Subject; items: { lesson: Lesson; p: LessonProgress }[] }[] = [];
  for (const c of CATALOG) {
    if (courseId && c.id !== courseId) continue;
    for (const s of c.subjects) {
      const items = lessonsOf(s).filter((l) => lessonStatus(lessons[l.id]) !== 'todo').map((l) => ({ lesson: l, p: lessons[l.id] }));
      if (items.length) out.push({ course: c.id, subject: s, items });
    }
  }
  return out;
}

/** The last n days as YYYY-MM-DD, today first. */
export const lastDays = (n: number) => [...Array(n)].map((_, i) => new Date(Date.now() - i * 864e5).toLocaleDateString('sv-SE'));

/** Lessons practised on any of the given days. */
export function practisedOn(lessons: Lessons, days: string[]): string[] {
  const set = new Set(days);
  return Object.entries(lessons).filter(([, p]) => p.days?.some((d) => set.has(d))).map(([id]) => id);
}
