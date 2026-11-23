import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Lang } from '@/engine/types';

export interface StationProgress {
  /** Days (YYYY-MM-DD) with a session of at least 4 out of 5 right first time. */
  goodDays: string[];
  best: number;
  sessions: number;
  /** Passed with "I can already do this": 4 out of 5 with no help. */
  passed?: boolean;
}

interface AppState {
  lang: Lang | null;
  voice: boolean;
  large: boolean;
  theme: 'auto' | 'light' | 'dark';
  motion: 'auto' | 'reduce';
  rest: boolean;
  /** Notes and vibration on the number line. */
  sound: boolean;
  /** Real-world numbers found on the line (only the numbers). */
  found: number[];
  /** How far the line has opened so far (the furthest number reachable). */
  reach: number;
  /** The short first-time tour of the number line has been shown. */
  toured: boolean;
  /** Natural voice chosen per language ('device' = the device's own voice). */
  voices: Partial<Record<Lang, string>>;
  find: (v: number) => void;
  pass: (station: string) => void;
  suggested: string | null;
  last: string | null;
  progress: Record<string, StationProgress>;
  /** Minutes of practice per day (YYYY-MM-DD). Only numbers, nothing about the child. */
  minutes: Record<string, number>;
  /** Fingerprints (numbers only) of the exercises already shown in each station, so they are not repeated. */
  seen: Record<string, string[]>;
  markSeen: (station: string, keys: string[]) => void;
  set: (p: Partial<AppState>) => void;
  record: (station: string, rightFirst: number, total: number) => void;
  addMinutes: (m: number) => void;
  reset: () => void;
}

export const today = () => new Date().toLocaleDateString('sv-SE');
const MASTER_RIGHT = 4;
/** How many past exercises per station are remembered (about 120 sessions). */
export const SEEN_MAX = 600;

export const useApp = create<AppState>()(
  persist(
    (set) => ({
      lang: null, voice: true, large: false, theme: 'auto', motion: 'auto', rest: true, sound: true, found: [], reach: 20, toured: false, voices: {}, suggested: null, last: null, progress: {}, minutes: {}, seen: {},
      set: (p) => set(p),
      pass: (station) => set((s) => ({ last: station, progress: { ...s.progress, [station]: { ...(s.progress[station] ?? { goodDays: [], best: 0, sessions: 0 }), sessions: (s.progress[station]?.sessions ?? 0) + 1, passed: true } } })),
      find: (v) => set((s) => (s.found.includes(v) ? s : { found: [...s.found, v] })),
      record: (station, rightFirst, total) => set((s) => {
        const cur = s.progress[station] ?? { goodDays: [], best: 0, sessions: 0 };
        const d = today();
        const good = rightFirst >= Math.min(MASTER_RIGHT, total) && !cur.goodDays.includes(d) ? [...cur.goodDays, d] : cur.goodDays;
        return { last: station, progress: { ...s.progress, [station]: { goodDays: good, best: Math.max(cur.best, rightFirst), sessions: cur.sessions + 1 } } };
      }),
      addMinutes: (m) => set((s) => ({ minutes: { ...s.minutes, [today()]: (s.minutes[today()] ?? 0) + m } })),
      markSeen: (station, keys) => set((s) => {
        const fresh = new Set(keys);
        return { seen: { ...s.seen, [station]: [...(s.seen[station] ?? []).filter((k) => !fresh.has(k)), ...keys].slice(-SEEN_MAX) } };
      }),
      reset: () => set({ suggested: null, last: null, progress: {}, minutes: {}, seen: {}, found: [], reach: 20 }),
    }),
    { name: 'matematix', version: 1, merge: (persisted, current) => ({ ...current, ...(persisted as object) }) },
  ),
);

export type Status = 'todo' | 'doing' | 'done';
/** Mastered = 4 out of 5 right first time on two different days (spaced practice). Never 100 %. */
export function statusOf(p?: StationProgress): Status {
  if (!p || p.sessions === 0) return 'todo';
  return p.passed || p.goodDays.length >= 2 ? 'done' : 'doing';
}
