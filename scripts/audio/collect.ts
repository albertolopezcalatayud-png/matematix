/**
 * Every text Matematix reads aloud with a natural voice, per language: { lang: { key: spokenText } }.
 * Fixed texts (messages without blanks), and for every lesson: the idea, the worked example and its steps, the
 * written exercises and, for generated exercises, their statements and hints when they are a small finite set.
 * Statements with changing numbers (thousands of combinations) use the device's voice.
 * Run: npx vite-node scripts/audio/collect.ts > texts.json
 */
import { MESSAGES } from '../../src/i18n/messages';
import { speakable } from '../../src/i18n/index';
import { clipKey, clipText } from '../../src/services/clipKey';
import { rng } from '../../src/engine/rng';
import type { ContentPack, T3 } from '../../src/course/types';

type Lang = 'es' | 'ca' | 'en';
const LANGS: Lang[] = ['es', 'ca', 'en'];
const SEEDS = 400, MAX_PROMPTS = 60, MAX_HINTS = 12;
const out: Record<Lang, Record<string, string>> = { es: {}, ca: {}, en: {} };
const add = (lang: Lang, text: string) => {
  const t = clipText(text);
  if (!t || !/\p{L}|\d/u.test(t)) return;
  out[lang][clipKey(lang, t)] = speakable(lang, t);
};
const add3 = (t: T3) => LANGS.forEach((l, i) => add(l, t[i]));

for (const lang of LANGS) {
  for (const [k, row] of Object.entries(MESSAGES)) {
    if (/^(nm_|ob_|oq|mo|mos_|lit$|ax_|d_)/.test(k)) continue;
    const s = (row as readonly string[])[LANGS.indexOf(lang)];
    if (!/\{\w+\}/.test(s)) add(lang, s);
  }
}

const packs = import.meta.glob('../../src/course/content/*.ts', { eager: true }) as Record<string, { default: ContentPack }>;
const n0 = { lessons: 0, gen: 0 };
for (const m of Object.values(packs)) {
  for (const c of Object.values(m.default)) {
    n0.lessons++;
    c.explain.forEach(add3); add3(c.example.q); c.example.steps.forEach(add3);
    for (const q of c.bank ?? []) { add3(q.q); add3(q.hint); }
    if (c.make) {
      const prompts = new Map<string, T3>(), hints = new Map<string, T3>();
      for (let s = 0; s < SEEDS && prompts.size <= MAX_PROMPTS; s++) {
        try { const q = c.make(rng(s)); prompts.set(q.q[0], q.q); hints.set(q.hint[0], q.hint); } catch { /* generators are tested elsewhere */ }
      }
      if (prompts.size <= MAX_PROMPTS) { prompts.forEach(add3); n0.gen++; }
      if (hints.size <= MAX_HINTS) hints.forEach(add3);
    }
  }
}
console.error(`lessons ${n0.lessons}, generators with every statement voiced ${n0.gen}`, Object.fromEntries(LANGS.map((l) => [l, Object.keys(out[l]).length])));
process.stdout.write(JSON.stringify(out));
