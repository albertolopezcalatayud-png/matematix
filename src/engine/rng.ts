/** Small seeded random generator (mulberry32): the same seed always gives the same exercises, so tests can check thousands. */
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Whole number from lo to hi, both included. */
export const int = (r: () => number, lo: number, hi: number) => lo + Math.floor(r() * (hi - lo + 1));

export function shuffle<T>(r: () => number, xs: T[]): T[] {
  const a = xs.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

/** Distinct options around the answer, never negative, answer included, in random order. */
export function optionsAround(r: () => number, answer: number, spread: number, n = 3, min = 0): number[] {
  const set = new Set<number>([answer]);
  let guard = 0;
  while (set.size < n && guard++ < 100) {
    const d = int(r, 1, spread) * (r() < 0.5 ? -1 : 1);
    const v = answer + d;
    if (v >= min) set.add(v);
  }
  for (let v = answer + 1; set.size < n; v++) set.add(v);
  return shuffle(r, [...set]);
}
