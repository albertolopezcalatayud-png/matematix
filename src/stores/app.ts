import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Lang } from '@/engine/types';

export interface StationProgress {
  /** Days (YYYY-MM-DD) with a session of at least 4 out of 5 right first time. */
  goodDays: string[];
  best: number;
  sessions: number;
}

interface AppState {
  lang: Lang | null;
  voice: boolean;
  large: boolean;
  theme: 'auto' | 'light' | 'dark';
  motion: 'auto' | 'reduce';
  rest: boolean;
  suggested: string | null;
  last: string | null;
  progress: Record<string, StationProgress>;
  /** Minutes of practice per day (YYYY-MM-DD). Only numbers, nothing about the child. */
  minutes: Record<string, number>;
  set: (p: Partial<AppState>) => void;
  record: (station: string, rightFirst: number, total: number) => void;
  addMinutes: (m: number) => void;
  reset: () => void;
}

export const today = () => new Date().toLocaleDateString('sv-SE');
const MASTER_RIGHT = 4;

export const useApp = create<AppState>()(
  persist(
    (set) => ({
      lang: null, voice: true, large: false, theme: 'auto', motion: 'auto', rest: true, suggested: null, last: null, progress: {}, minutes: {},
      set: (p) => set(p),
      record: (station, rightFirst, total) => set((s) => {
        const cur = s.progress[station] ?? { goodDays: [], best: 0, sessions: 0 };
        const d = today();
        const good = rightFirst >= Math.min(MASTER_RIGHT, total) && !cur.goodDays.includes(d) ? [...cur.goodDays, d] : cur.goodDays;
        return { last: station, progress: { ...s.progress, [station]: { goodDays: good, best: Math.max(cur.best, rightFirst), sessions: cur.sessions + 1 } } };
      }),
      addMinutes: (m) => set((s) => ({ minutes: { ...s.minutes, [today()]: (s.minutes[today()] ?? 0) + m } })),
      reset: () => set({ suggested: null, last: null, progress: {}, minutes: {} }),
    }),
    { name: 'matematix', version: 1 },
  ),
);

export type Status = 'todo' | 'doing' | 'done';
/** Mastered = 4 out of 5 right first time on two different days (spaced practice). Never 100 %. */
export function statusOf(p?: StationProgress): Status {
  if (!p || p.sessions === 0) return 'todo';
  return p.goodDays.length >= 2 ? 'done' : 'doing';
}
