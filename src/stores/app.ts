import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Lang } from '@/engine/types';

export interface StationProgress {
  /** Days (YYYY-MM-DD) with a session of at least 4 out of 5 right first time. */
  goodDays: string[];
  best: number;
  sessions: number;
  /** Days with a hard session (2 or fewer right first time): two of them suggest going back a step. */
  hardDays?: string[];
  /** Passed with "I can already do this": 4 out of 5 with no help. */
  passed?: boolean;
}

export type Role = 'pupil' | 'teacher' | 'pt' | 'family';
/** What belongs to each child on a shared device (PT/AL with several pupils). Only an alias and an emoji, never a name. */
export const PUPIL_KEYS = ['course', 'lessons', 'qseen', 'lastLesson', 'wentBack', 'progress', 'seen', 'minutes', 'found', 'reach', 'toured', 'suggested', 'last', 'voice', 'large', 'sound', 'motion', 'help', 'voices'] as const;
type PupilKey = (typeof PUPIL_KEYS)[number];
export interface Pupil { alias: string; emoji: string; data: Partial<Pick<AppState, PupilKey>> }

/** A lesson: the highest level passed (0 none, 3 = complete) and the best first-time score in each level. */
export interface LessonProgress { lv: number; best: [number, number, number]; runs: number }

interface AppState {
  lang: Lang | null;
  /** New structure (course → subject → block → lesson). */
  lessons: Record<string, LessonProgress>;
  /** Fingerprints of the exercises already shown in each lesson. */
  qseen: Record<string, string[]>;
  lastLesson: string | null;
  /** One level of a lesson finished: rightFirst out of total. Passing needs 4. */
  finishLevel: (lesson: string, level: 1 | 2 | 3, rightFirst: number) => void;
  markQSeen: (lesson: string, keys: string[]) => void;
  /** Who uses the app on this device. Adults reach their area through a hold-to-open button (no account, no password). */
  role: Role | null;
  /** Children on a shared device (PT/AL, aula de apoyo). The active one's data is in the main fields. */
  pupils: Record<string, Pupil>;
  active: string | null;
  /** 'more': 4 guided exercises before the 5 on your own (instead of 2). */
  help: 'normal' | 'more';
  /** School year chosen as the starting point (p1…p6, s1…s4); null = not chosen. */
  course: string | null;
  /** The station that was hard on two days and sent the pupil back a step (shown once on the home screen). */
  wentBack: string | null;
  addPupil: (alias: string, emoji: string) => string;
  switchPupil: (id: string | null) => void;
  removePupil: (id: string) => void;
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

const fresh = (): Required<Pupil['data']> => ({ lessons: {}, qseen: {}, lastLesson: null, course: null, wentBack: null, progress: {}, seen: {}, minutes: {}, found: [], reach: 20, toured: false, suggested: null, last: null, voice: true, large: false, sound: true, motion: 'auto', help: 'normal', voices: {} });

const OLD_COURSE: Record<string, string> = { p1: '1P', p2: '2P', p3: '3P', p4: '4P', p5: '5P', p6: '6P', s1: '1E', s2: '2E', s3: '3E', s4: '4E' };

export const today = () => new Date().toLocaleDateString('sv-SE');
const MASTER_RIGHT = 4;
/** How many past exercises per station are remembered (about 120 sessions). */
export const SEEN_MAX = 600;

export const useApp = create<AppState>()(
  persist(
    (set) => ({
      lessons: {}, qseen: {}, lastLesson: null,
      lang: 'es', course: null, wentBack: null, role: null, pupils: {}, active: null, help: 'normal', voice: true, large: false, theme: 'auto', motion: 'auto', rest: true, sound: true, found: [], reach: 20, toured: false, voices: {}, suggested: null, last: null, progress: {}, minutes: {}, seen: {},
      set: (p) => set(p),
      finishLevel: (lesson, level, rightFirst) => set((s) => {
        const cur = s.lessons[lesson] ?? { lv: 0, best: [0, 0, 0] as [number, number, number], runs: 0 };
        const best = [...cur.best] as [number, number, number];
        best[level - 1] = Math.max(best[level - 1], rightFirst);
        const lv = rightFirst >= MASTER_RIGHT ? Math.max(cur.lv, level) : cur.lv;
        return { lastLesson: lesson, lessons: { ...s.lessons, [lesson]: { lv, best, runs: cur.runs + 1 } } };
      }),
      markQSeen: (lesson, keys) => set((s) => {
        const fresh = new Set(keys);
        return { qseen: { ...s.qseen, [lesson]: [...(s.qseen[lesson] ?? []).filter((k) => !fresh.has(k)), ...keys].slice(-120) } };
      }),
      addPupil: (alias, emoji) => {
        const id = Math.random().toString(36).slice(2, 8);
        set((s) => ({ pupils: { ...s.pupils, [id]: { alias, emoji, data: fresh() } } }));
        return id;
      },
      switchPupil: (id) => set((s) => {
        const snap = Object.fromEntries(PUPIL_KEYS.map((k) => [k, s[k]])) as Pupil['data'];
        const pupils = { ...s.pupils };
        if (s.active && pupils[s.active]) pupils[s.active] = { ...pupils[s.active], data: snap };
        else pupils['_me'] = { alias: '', emoji: '', data: snap };
        const next = id ? pupils[id]?.data : pupils['_me']?.data;
        return { pupils, active: id, ...fresh(), ...(next ?? {}) };
      }),
      removePupil: (id) => set((s) => {
        const pupils = { ...s.pupils }; delete pupils[id];
        return s.active === id ? { pupils, active: null, ...fresh(), ...(pupils['_me']?.data ?? {}) } : { pupils };
      }),
      pass: (station) => set((s) => ({ last: station, progress: { ...s.progress, [station]: { ...(s.progress[station] ?? { goodDays: [], best: 0, sessions: 0 }), sessions: (s.progress[station]?.sessions ?? 0) + 1, passed: true } } })),
      find: (v) => set((s) => (s.found.includes(v) ? s : { found: [...s.found, v] })),
      record: (station, rightFirst, total) => set((s) => {
        const cur = s.progress[station] ?? { goodDays: [], best: 0, sessions: 0 };
        const d = today();
        const good = rightFirst >= Math.min(MASTER_RIGHT, total) && !cur.goodDays.includes(d) ? [...cur.goodDays, d] : cur.goodDays;
        const hard = rightFirst <= 2 && total >= 5 && !(cur.hardDays ?? []).includes(d) ? [...(cur.hardDays ?? []), d] : cur.hardDays;
        return { last: station, progress: { ...s.progress, [station]: { ...cur, goodDays: good, best: Math.max(cur.best, rightFirst), sessions: cur.sessions + 1, ...(hard ? { hardDays: hard } : {}) } } };
      }),
      addMinutes: (m) => set((s) => ({ minutes: { ...s.minutes, [today()]: (s.minutes[today()] ?? 0) + m } })),
      markSeen: (station, keys) => set((s) => {
        const fresh = new Set(keys);
        return { seen: { ...s.seen, [station]: [...(s.seen[station] ?? []).filter((k) => !fresh.has(k)), ...keys].slice(-SEEN_MAX) } };
      }),
      reset: () => set({ lessons: {}, qseen: {}, lastLesson: null, course: null, suggested: null, last: null, progress: {}, minutes: {}, seen: {}, found: [], reach: 20 }),
    }),
    { name: 'matematix', version: 2,
      // version 2: school years are named 1P…6P and 1E…4E (they were p1…p6 and s1…s4)
      migrate: (old, v) => { const o = (old ?? {}) as Record<string, unknown>; if (v < 2 && typeof o.course === 'string') o.course = OLD_COURSE[o.course] ?? null; return o as unknown as AppState; },
      merge: (persisted, current) => ({ ...current, ...(persisted as object) }) },
  ),
);

export type Status = 'todo' | 'doing' | 'done';
/** Mastered = 4 out of 5 right first time on two different days (spaced practice). Never 100 %. */
export function statusOf(p?: StationProgress): Status {
  if (!p || p.sessions === 0) return 'todo';
  return p.passed || p.goodDays.length >= 2 ? 'done' : 'doing';
}

export type LessonStatus = 'todo' | 'doing' | 'done';
export const lessonStatus = (p?: LessonProgress): LessonStatus => (!p || p.runs === 0 ? 'todo' : p.lv >= 3 ? 'done' : 'doing');
