import { ORDER } from '@/data/world';

/**
 * Adaptive starting point. It starts in the middle of the route and jumps up or down, like a teacher asking two or
 * three questions: two right in a row at a station moves up, one wrong moves down. It needs at most about 8 answers,
 * shows no marks, and the result is only a suggestion. It never labels or diagnoses.
 */
export interface Placement { lo: number; hi: number; at: number; streak: number; asked: number; done: string | null; allRight: boolean }

export function startPlacement(): Placement {
  const lo = 0, hi = ORDER.length - 1;
  return { lo, hi, at: Math.floor((lo + hi) / 2), streak: 0, asked: 0, done: null, allRight: false };
}

export function answerPlacement(p: Placement, right: boolean): Placement {
  const asked = p.asked + 1;
  let { lo, hi, streak } = p;
  if (right) {
    streak += 1;
    if (streak < 2) return { ...p, streak, asked };
    lo = p.at + 1;
  } else {
    hi = p.at - 1;
  }
  if (lo > hi) {
    const allRight = lo >= ORDER.length;
    return { ...p, lo, hi, streak: 0, asked, done: ORDER[Math.min(lo, ORDER.length - 1)], allRight };
  }
  return { lo, hi, at: Math.floor((lo + hi) / 2), streak: 0, asked, done: null, allRight: false };
}
