import { ORDER } from './world';

/**
 * School years (Comunitat Valenciana: 6 de Primaria + 4 de ESO) as starting points on the route. Choosing a year only
 * says where to begin: from there the app moves down (a station that is hard on two different days sends you to the
 * one it builds on) or up ("I can already do this", or the child/adult pressing "harder"). Nobody is stuck in a year.
 * Each start is the first station whose content belongs to that year in the curriculum (LOMLOE, Decreto 106/2022 and
 * 107/2022 CV); ESO years start lower on purpose, because pupils with dyscalculia often need to firm up the base first.
 */
export const COURSES = [
  { id: 'p1', start: 'A1' }, // compare, 0–10, number bonds, doubles
  { id: 'p2', start: 'B4' }, // near doubles, bridging 10, change problems, tens and ones
  { id: 'p3', start: 'A5' }, // 0–100, problem types, equal jumps, equal groups
  { id: 'p4', start: 'D1' }, // equal parts, fractions on the line
  { id: 'p5', start: 'D3' }, // comparing fractions, decimals, two-step problems
  { id: 'p6', start: 'D5' }, // percentages, units
  { id: 's1', start: 'E2' }, // charts, proportion
  { id: 's2', start: 'D6' }, // proportion, motion graphs
  { id: 's3', start: 'E4' }, // equations with the balance
  { id: 's4', start: 'E5' }, // density, concentration, powers of 10
] as const;
export type CourseId = (typeof COURSES)[number]['id'];

export const courseById = (id: string | null | undefined) => COURSES.find((c) => c.id === id);
/** The year a station belongs to (the last year whose start is at or before it). */
export function courseOfStation(station: string): (typeof COURSES)[number] {
  const i = ORDER.indexOf(station);
  return [...COURSES].reverse().find((c) => ORDER.indexOf(c.start) <= i) ?? COURSES[0];
}
export function neighbourCourse(id: string, step: -1 | 1) {
  const i = COURSES.findIndex((c) => c.id === id);
  return COURSES[i + step];
}
