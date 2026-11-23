/**
 * Every text Matematix reads aloud with a natural voice, per language: { lang: { key: spokenText } }.
 * Fixed texts (messages without blanks, worked examples) and every exercise text of the stations whose texts are a
 * small finite set. Word problems with names and numbers (hundreds of thousands) use the device's voice.
 * Run: npx tsx --tsconfig tsconfig.app.json scripts/audio/collect.ts > texts.json
 */
import { MESSAGES } from '../../src/i18n/messages';
import { STATIONS } from '../../src/data/stations';
import { rng } from '../../src/engine/rng';
import { translate, speakable } from '../../src/i18n/index';
import { clipKey, clipText } from '../../src/services/clipKey';
import { FINDS } from '../../src/data/world';

type Lang = 'es' | 'ca' | 'en';
const LANGS: Lang[] = ['es', 'ca', 'en'];
const MAX_PER_STATION = 3000, SEEDS = 60000;
const out: Record<Lang, Record<string, string>> = { es: {}, ca: {}, en: {} };
const add = (lang: Lang, text: string) => {
  const t = clipText(text);
  if (!t || !/\p{L}|\d/u.test(t)) return;
  out[lang][clipKey(lang, t)] = speakable(lang, t);
};

for (const lang of LANGS) {
  // all fixed messages (UI, hints without numbers, worked examples, problem-type texts)
  for (const [k, row] of Object.entries(MESSAGES)) {
    if (/^(nm_|ob_|oq|mo|mos_|lit$|ax_|d_)/.test(k)) continue;
    const s = (row as readonly string[])[LANGS.indexOf(lang)];
    if (!/\{\w+\}/.test(s)) add(lang, s);
  }
  for (const f of FINDS) add(lang, translate(lang, `ff_${f.id}`, { n: f.v.toLocaleString(lang === 'en' ? 'en-GB' : lang === 'ca' ? 'ca-ES' : 'es-ES') }));
  for (const st of STATIONS) {
    for (const s of st.model(rng(1)).steps) add(lang, translate(lang, s.say.key, s.say.vars));
    const texts = new Set<string>();
    for (let seed = 0; seed < SEEDS && texts.size <= MAX_PER_STATION; seed++) for (const g of [true, false]) {
      const it = st.make(rng(seed), g);
      texts.add(translate(lang, it.prompt.key, it.prompt.vars));
      texts.add(translate(lang, it.hint.key, it.hint.vars));
    }
    if (texts.size <= MAX_PER_STATION) texts.forEach((t) => add(lang, t));
  }
}
process.stdout.write(JSON.stringify(out));
