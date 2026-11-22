import { MESSAGES, type MsgKey } from './messages';
import type { Lang, Msg } from '@/engine/types';
import { useApp } from '@/stores/app';

const IDX: Record<Lang, number> = { es: 0, ca: 1, en: 2 };
export const HTML_LANG: Record<Lang, string> = { es: 'es', ca: 'ca-ES-valencia', en: 'en-GB' };

export function translate(lang: Lang, key: string, vars?: Record<string, string | number>): string {
  const row = (MESSAGES as Record<string, readonly string[]>)[key];
  let s = row ? row[IDX[lang]] : key;
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(String(v));
  return s;
}

/** Turns symbols into words so the voice reads "8 más 5" and not "8 plus sign 5". */
export function speakable(lang: Lang, text: string): string {
  const w = { es: ['más', 'menos', 'por', 'es igual a', 'cuánto'], ca: ['més', 'menys', 'per', 'és igual a', 'quant'], en: ['plus', 'minus', 'times', 'equals', 'what'] }[lang];
  return text.replace(/\+/g, ` ${w[0]} `).replace(/−/g, ` ${w[1]} `).replace(/×/g, ` ${w[2]} `).replace(/=/g, ` ${w[3]} `).replace(/\?/g, ` ${w[4]}`).replace(/\s+/g, ' ').trim();
}

export function useT() {
  const lang = useApp((s) => s.lang) ?? 'es';
  const t = (key: MsgKey | string, vars?: Record<string, string | number>) => translate(lang, key, vars);
  const m = (msg: Msg) => translate(lang, msg.key, msg.vars);
  return { t, m, lang };
}
