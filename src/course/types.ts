import type { Visual } from '@/engine/types';

/** A text in the three languages of the app: castellano, valencià (AVL) and British English. */
export type T3 = readonly [string, string, string];

/** An answer: a number (written as each language writes it), an exact token such as a fraction "3/4", or a text. */
export type Ans = number | string | T3;

/** One exercise: a short statement and a single question. */
export interface Q {
  q: T3;
  a: Ans;
  /** Wrong options: at least 3 (level 1 shows 2 of them, levels 2 and 3 show 3). */
  wrong: Ans[];
  /** The strategy in words: shown in level 1 and after a mistake. */
  hint: T3;
  /** Picture always shown with the question. */
  visual?: Visual;
  /** Picture of the strategy, shown with the hint. */
  aid?: Visual;
  /** Always choose from options, even when the answer is a number (e.g. "which is bigger?"). */
  mc?: boolean;
}

export interface LessonContent {
  /** The idea of the lesson, in 1 to 3 short sentences. */
  explain: T3[];
  /** A worked example: a question and the steps to solve it. */
  example: { q: T3; steps: T3[]; visual?: Visual };
  /** Exercise generator (numbers change each time). */
  make?: (r: () => number) => Q;
  /** Written exercises. */
  bank?: Q[];
}
export type ContentPack = Record<string, LessonContent>;

export interface Lesson { id: string; title: T3; sab: string[] }
export interface Block { title: T3; lessons: Lesson[] }
export interface Subject { code: string; title: T3; blocks: Block[] }
export interface Course { id: string; subjects: Subject[] }
export type Catalog = Course[];
