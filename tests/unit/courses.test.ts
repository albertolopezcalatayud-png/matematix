import { describe, expect, it } from 'vitest';
import { COURSES, courseOfStation, neighbourCourse } from '../../src/data/courses';
import { ORDER, nextStation, stepBackFrom } from '../../src/data/world';

describe('school years', () => {
  it('start at stations that exist, in increasing order, from A1', () => {
    const idx = COURSES.map((c) => ORDER.indexOf(c.start));
    expect(idx.every((i) => i >= 0)).toBe(true);
    expect(idx[0]).toBe(0);
    for (let k = 1; k < idx.length; k++) expect(idx[k]).toBeGreaterThan(idx[k - 1]);
  });
  it('every station belongs to one year, and a year\'s start belongs to it', () => {
    for (const c of COURSES) expect(courseOfStation(c.start).id).toBe(c.id);
    expect(courseOfStation('E6').id).toBe('s4');
  });
  it('easier / harder move one year and stop at the ends', () => {
    expect(neighbourCourse('p3', -1)?.id).toBe('p2');
    expect(neighbourCourse('p3', 1)?.id).toBe('p4');
    expect(neighbourCourse('p1', -1)).toBeUndefined();
    expect(neighbourCourse('s4', 1)).toBeUndefined();
  });
  it('a station that was hard on two days points back to the closest earlier station not yet lit (max 3 back)', () => {
    const d = (n: number) => `2026-11-${10 + n}`;
    const back = stepBackFrom({ A5: { goodDays: [], best: 1, sessions: 2, hardDays: [d(1), d(2)] } }, 'A5');
    expect(ORDER.indexOf(back!)).toBe(ORDER.indexOf('A5') - 1);
    expect(stepBackFrom({ A5: { goodDays: [], best: 1, sessions: 1, hardDays: [d(1)] } }, 'A5')).toBeNull();
    // after the base is lit, the route comes back to the hard station
    const prev = ORDER[ORDER.indexOf('A5') - 1];
    expect(nextStation({ [prev]: { goodDays: [d(1), d(2)], best: 5, sessions: 2 }, A5: { goodDays: [], best: 1, sessions: 2 } }, prev, prev)).toBe('A5');
  });
});
