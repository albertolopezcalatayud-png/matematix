import { STATIONS } from './stations';
import { statusOf, type StationProgress } from '@/stores/app';

/** Where each station lives on the number line (a number it works with). */
export const SPOT: Record<string, number> = { A1: 4, A2: 8, A3: 15, A4: 34, A5: 63, A6: 80, B1: 9, B2: 12, B3: 10, B4: 13, B5: 17, B6: 30 };

/** Real-world numbers to discover on the line. The text is in messages (fd_<id> = name, ff_<id> = fact with {n}). */
export interface Find { id: string; v: number; unit?: string; options: number[] }
export const FINDS: Find[] = [
  { id: 'freezer', v: -18, unit: '°C', options: [-18, 18, -2] },
  { id: 'week', v: 7, options: [5, 7, 10] },
  { id: 'spider', v: 8, options: [4, 6, 8] },
  { id: 'months', v: 12, options: [10, 12, 30] },
  { id: 'teeth', v: 20, options: [10, 20, 32] },
  { id: 'hours', v: 24, options: [12, 24, 60] },
  { id: 'body', v: 37, unit: '°C', options: [20, 37, 50] },
  { id: 'boil', v: 100, unit: '°C', options: [50, 100, 200] },
  { id: 'bones', v: 206, options: [20, 206, 2000] },
  { id: 'year', v: 365, options: [100, 300, 365] },
  { id: 'km', v: 1000, unit: 'm', options: [100, 1000, 10000] },
];

/** How far the line is open: it grows with what the child has mastered (and always reaches the stations in use). */
export function reachOf(progress: Record<string, StationProgress>, suggested: string | null): number {
  const st = (id: string) => statusOf(progress[id]);
  let r = 20;
  if (st('A3') === 'done' || st('B5') === 'done') r = 100;
  if (st('A5') === 'done' || st('A6') === 'done') r = 1000;
  if (['A1', 'A2', 'A3', 'A4', 'A5', 'A6'].every((id) => st(id) === 'done')) r = 10000;
  for (const s of STATIONS) {
    const used = (progress[s.id]?.sessions ?? 0) > 0 || suggested === s.id;
    if (used) r = Math.max(r, SPOT[s.id] <= 20 ? 20 : SPOT[s.id] <= 100 ? 100 : 1000);
  }
  return r;
}

/** Stretches of the line that glow: the part of the line each mastered station works with. */
export function litOf(progress: Record<string, StationProgress>): [number, number][] {
  const out: [number, number][] = [];
  const add = (id: string, a: number, b: number) => { if (statusOf(progress[id]) === 'done') out.push([a, b]); };
  add('A1', 0, 10); add('A2', 0, 10); add('A3', 0, 20); add('A4', 0, 100); add('A5', 0, 100); add('A6', 0, 100);
  add('B1', 0, 20); add('B2', 0, 20); add('B3', 0, 10); add('B4', 0, 20); add('B5', 0, 20); add('B6', 0, 50);
  return out;
}
