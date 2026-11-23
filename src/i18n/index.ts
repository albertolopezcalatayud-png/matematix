import { MESSAGES, type MsgKey } from './messages';
import type { Lang, Msg } from '@/engine/types';
import { useApp } from '@/stores/app';

const IDX: Record<Lang, number> = { es: 0, ca: 1, en: 2 };
export const HTML_LANG: Record<Lang, string> = { es: 'es', ca: 'ca-ES-valencia', en: 'en-GB' };

export function translate(lang: Lang, key: string, vars?: Record<string, string | number>): string {
  const row = (MESSAGES as Record<string, readonly string[]>)[key];
  let s = row ? row[IDX[lang]] : key;
  // a value written as "$key" is itself a message (names and objects change with the language);
  // "#0.7" is a decimal number written the way each language writes it (0,7 in castellano and valencià)
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(typeof v === 'string' && v.startsWith('$') ? translate(lang, v.slice(1)) : typeof v === 'string' && v.startsWith('#') ? fmtNum(lang, Number(v.slice(1))) : String(v));
  return s;
}

export function fmtNum(lang: Lang, v: number): string {
  return v.toLocaleString(lang === 'en' ? 'en-GB' : lang === 'ca' ? 'ca-ES' : 'es-ES', { maximumFractionDigits: 3, useGrouping: false });
}

/** A value on a scaled line: decimals (0,7) or fractions (3/4) as each language writes them. */
export function fmtScaled(lang: Lang, v: number, scale = 1, frac = false): string {
  if (!frac || scale === 1) return fmtNum(lang, v / scale);
  if (v % scale === 0) return String(v / scale);
  return `${v}/${scale}`;
}

const FRAC = {
  es: { half: 'un medio', one: ['', '', 'medio', 'tercio', 'cuarto', 'quinto', 'sexto', 'séptimo', 'octavo', 'noveno', 'décimo', 'onceavo', 'doceavo'], many: ['', '', 'medios', 'tercios', 'cuartos', 'quintos', 'sextos', 'séptimos', 'octavos', 'novenos', 'décimos', 'onceavos', 'doceavos'], un: 'un' },
  ca: { half: 'un mig', one: ['', '', 'mig', 'terç', 'quart', 'cinqué', 'sisé', 'seté', 'vuité', 'nové', 'desé', 'onzé', 'dotzé'], many: ['', '', 'migs', 'terços', 'quarts', 'cinquens', 'sisens', 'setens', 'vuitens', 'novens', 'desens', 'onzens', 'dotzens'], un: 'un' },
  en: { half: 'one half', one: ['', '', 'half', 'third', 'quarter', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth'], many: ['', '', 'halves', 'thirds', 'quarters', 'fifths', 'sixths', 'sevenths', 'eighths', 'ninths', 'tenths', 'elevenths', 'twelfths'], un: 'one' },
};
/** "3/4" read aloud as "3 cuartos", "tres quarts", "3 quarters". */
function fractionWords(lang: Lang, a: number, b: number): string {
  const f = FRAC[lang];
  if (b < 2 || b > 12) return `${a} / ${b}`;
  if (a === 1) return b === 2 ? f.half : `${f.un} ${f.one[b]}`;
  return `${a} ${f.many[b]}`;
}

/** Turns symbols into words so the voice reads "8 más 5" and not "8 plus sign 5". */
export function speakable(lang: Lang, text: string): string {
  const w = { es: ['más', 'menos', 'por', 'es igual a', 'cuánto'], ca: ['més', 'menys', 'per', 'és igual a', 'quant'], en: ['plus', 'minus', 'times', 'equals', 'what'] }[lang];
  return text.replace(/(\d+)\/(\d+)/g, (_, a, b) => fractionWords(lang, Number(a), Number(b))).replace(/\+/g, ` ${w[0]} `).replace(/−/g, ` ${w[1]} `).replace(/×/g, ` ${w[2]} `).replace(/=/g, ` ${w[3]} `).replace(/(^|[\s=])\?(?=\s|$)/g, `$1 ${w[4]}`).replace(/\s+/g, ' ').trim();
}

export function useT() {
  const lang = useApp((s) => s.lang) ?? 'es';
  const t = (key: MsgKey | string, vars?: Record<string, string | number>) => translate(lang, key, vars);
  const m = (msg: Msg) => translate(lang, msg.key, msg.vars);
  return { t, m, lang };
}
