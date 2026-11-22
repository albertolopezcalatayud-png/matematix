import type { Item, Station } from './types';
import { rng } from './rng';
import { itemKey } from '@/data/stations';

export const GUIDED = 2, INDEPENDENT = 5;

/** The 7 exercises of a session. None is the same as another in the session, and none is one the child has already
 *  seen in this station (the fingerprints in `recent`), until every variant has been used. */
export function pickItems(station: Station, seed: number, recent: Set<string>): { item: Item; guided: boolean }[] {
  const out: { item: Item; guided: boolean }[] = [];
  const used = new Set<string>();
  for (let i = 0; i < GUIDED + INDEPENDENT; i++) {
    const guided = i < GUIDED;
    let best: Item | null = null;
    for (let tryN = 0; tryN < 200; tryN++) {
      const cand = station.make(rng((seed + i * 1013 + tryN * 7907) >>> 0), guided);
      const k = itemKey(cand);
      if (!used.has(k) && !recent.has(k)) { best = cand; break; }
      if (!best && !used.has(k)) best = cand;
    }
    best ??= station.make(rng((seed + i) >>> 0), guided);
    used.add(itemKey(best));
    out.push({ item: best, guided });
  }
  return out;
}
