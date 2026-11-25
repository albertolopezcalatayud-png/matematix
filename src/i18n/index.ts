import { MESSAGES, type MsgKey } from './messages';
import { ADULT } from './adults';

const ALL: Record<string, readonly string[]> = { ...MESSAGES, ...ADULT };
import type { Lang, Msg } from '@/engine/types';
import { useApp } from '@/stores/app';

const IDX: Record<Lang, number> = { es: 0, ca: 1, en: 2 };
export const HTML_LANG: Record<Lang, string> = { es: 'es', ca: 'ca-ES-valencia', en: 'en-GB' };

export function translate(lang: Lang, key: string, vars?: Record<string, string | number>): string {
  const row = ALL[key];
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
/** Unit symbols said as words, so a voice never spells them letter by letter ("cm" → "centímetros").
 *  Units of two or more letters anywhere as a whole word; one-letter units (m, g, L, h, s, N, J, W, V) only after a
 *  number or in "de m a cm" / "from m to cm", so a variable such as "m" in "y = mx" or "la pendiente m" is left alone. */
const UNITS: Record<string, [string, string, string]> = {
  km: ['kilómetros', 'quilòmetres', 'kilometres'], hm: ['hectómetros', 'hectòmetres', 'hectometres'], dam: ['decámetros', 'decàmetres', 'decametres'],
  dm: ['decímetros', 'decímetres', 'decimetres'], cm: ['centímetros', 'centímetres', 'centimetres'], mm: ['milímetros', 'mil·límetres', 'millimetres'],
  kg: ['kilos', 'quilos', 'kilograms'], hg: ['hectogramos', 'hectograms', 'hectograms'], dag: ['decagramos', 'decagrams', 'decagrams'], dg: ['decigramos', 'decigrams', 'decigrams'],
  cg: ['centigramos', 'centigrams', 'centigrams'], mg: ['miligramos', 'mil·ligrams', 'milligrams'],
  kL: ['kilolitros', 'quilolitres', 'kilolitres'], hL: ['hectolitros', 'hectolitres', 'hectolitres'], daL: ['decalitros', 'decalitres', 'decalitres'],
  dL: ['decilitros', 'decilitres', 'decilitres'], cL: ['centilitros', 'centilitres', 'centilitres'], mL: ['mililitros', 'mil·lilitres', 'millilitres'],
  ml: ['mililitros', 'mil·lilitres', 'millilitres'], cl: ['centilitros', 'centilitres', 'centilitres'], dl: ['decilitros', 'decilitres', 'decilitres'],
  km2: ['kilómetros cuadrados', 'quilòmetres quadrats', 'square kilometres'], min: ['minutos', 'minuts', 'minutes'], ms: ['milisegundos', 'mil·lisegons', 'milliseconds'],
  kWh: ['kilovatios hora', 'quilowatts hora', 'kilowatt hours'], kW: ['kilovatios', 'quilowatts', 'kilowatts'], kJ: ['kilojulios', 'quilojoules', 'kilojoules'],
  kPa: ['kilopascales', 'quilopascals', 'kilopascals'], Pa: ['pascales', 'pascals', 'pascals'], atm: ['atmósferas', 'atmosferes', 'atmospheres'],
  mol: ['moles', 'mols', 'moles'], Hz: ['hercios', 'hertzs', 'hertz'], kHz: ['kilohercios', 'quilohertzs', 'kilohertz'], mA: ['miliamperios', 'mil·liampers', 'milliamps'],
  GB: ['gigas', 'gigues', 'gigabytes'], MB: ['megas', 'megues', 'megabytes'], KB: ['kilobytes', 'quilobytes', 'kilobytes'], kB: ['kilobytes', 'quilobytes', 'kilobytes'],
};
const UNIT1: Record<string, [string, string, string]> = {
  m: ['metros', 'metres', 'metres'], g: ['gramos', 'grams', 'grams'], L: ['litros', 'litres', 'litres'], l: ['litros', 'litres', 'litres'],
  h: ['horas', 'hores', 'hours'], s: ['segundos', 'segons', 'seconds'], N: ['newtons', 'newtons', 'newtons'], J: ['julios', 'joules', 'joules'],
  W: ['vatios', 'watts', 'watts'], V: ['voltios', 'volts', 'volts'], A: ['amperios', 'ampers', 'amps'],
};
const SQ: [string, string, string][] = [['cuadrados', 'quadrats', 'square'], ['cúbicos', 'cúbics', 'cubic']];
function unitWords(lang: Lang, text: string): string {
  const i = lang === 'es' ? 0 : lang === 'ca' ? 1 : 2;
  const say = (w: [string, string, string], pow?: string) => {
    if (!pow) return w[i];
    const p = SQ[pow === '²' ? 0 : 1][i];
    return lang === 'en' ? `${p} ${w[i]}` : `${w[i]} ${p}`;
  };
  const many = Object.keys(UNITS).sort((a, b) => b.length - a.length).join('|');
  text = text.replace(new RegExp(`(?<![\\p{L}\\d])(${many})([²³])?(?![\\p{L}])`, 'gu'), (_, u: string, pw?: string) => say(UNITS[u], pw));
  const one = Object.keys(UNIT1).join('|');
  text = text.replace(new RegExp(`(\\d)\\s(${one})([²³])?(?![\\p{L}\\d])`, 'gu'), (_, d: string, u: string, pw?: string) => `${d} ${say(UNIT1[u], pw)}`);
  const from = { es: '(?:de|en)', ca: '(?:de|en)', en: '(?:from|in|to)' }[lang];
  const to = { es: '(?:a|en)', ca: '(?:a|en)', en: '(?:to|into)' }[lang];
  text = text.replace(new RegExp(`(^|\\s)(${from}) (m|g|L|l)(?= ${to}\\s)`, 'giu'), (_, a: string, b: string, u: string) => `${a}${b} ${UNIT1[u][i]}`);
  text = text.replace(new RegExp(`(^|\\s)(${to}) (m|g|L|l)(?=[\\s.,;:?!)]|$)`, 'giu'), (_, a: string, b: string, u: string) => `${a}${b} ${UNIT1[u][i]}`);
  text = text.replace(/(\d)\s?Ω/g, (_, d: string) => `${d} ${['ohmios', 'ohms', 'ohms'][i]}`);
  return text;
}

/** Numbers before a noun said as a person would: «un metro», «una hora», «veintiún metros», «mil milímetros»
 *  (not «uno metro» or «uno cero cero cero»); and a unit after 1 in the singular («1 m» → «un metro»). */
const PLURAL_ONE: Record<'es' | 'ca' | 'en', Record<string, string>> = {
  es: { horas: 'hora', toneladas: 'tonelada', kilómetros: 'kilómetro', metros: 'metro', decímetros: 'decímetro', centímetros: 'centímetro', milímetros: 'milímetro', hectómetros: 'hectómetro', decámetros: 'decámetro', kilos: 'kilo', gramos: 'gramo', miligramos: 'miligramo', litros: 'litro', mililitros: 'mililitro', centilitros: 'centilitro', decilitros: 'decilitro', segundos: 'segundo', minutos: 'minuto', grados: 'grado', euros: 'euro', céntimos: 'céntimo', días: 'día', semanas: 'semana', meses: 'mes', años: 'año', vatios: 'vatio', voltios: 'voltio', amperios: 'amperio', julios: 'julio', ohmios: 'ohmio', moles: 'mol', newtons: 'newton', cuadrados: 'cuadrado', cúbicos: 'cúbico', unidades: 'unidad', decenas: 'decena', centenas: 'centena' },
  ca: { hores: 'hora', tones: 'tona', quilòmetres: 'quilòmetre', metres: 'metre', decímetres: 'decímetre', centímetres: 'centímetre', 'mil·límetres': 'mil·límetre', quilos: 'quilo', grams: 'gram', 'mil·ligrams': 'mil·ligram', litres: 'litre', 'mil·lilitres': 'mil·lilitre', centilitres: 'centilitre', segons: 'segon', minuts: 'minut', graus: 'grau', euros: 'euro', cèntims: 'cèntim', dies: 'dia', setmanes: 'setmana', mesos: 'mes', anys: 'any', watts: 'watt', volts: 'volt', ampers: 'amper', joules: 'joule', ohms: 'ohm', mols: 'mol', newtons: 'newton', quadrats: 'quadrat', cúbics: 'cúbic', unitats: 'unitat', desenes: 'desena', centenes: 'centena' },
  en: { hours: 'hour', tonnes: 'tonne', kilometres: 'kilometre', metres: 'metre', decimetres: 'decimetre', centimetres: 'centimetre', millimetres: 'millimetre', kilograms: 'kilogram', grams: 'gram', milligrams: 'milligram', litres: 'litre', millilitres: 'millilitre', centilitres: 'centilitre', seconds: 'second', minutes: 'minute', degrees: 'degree', euros: 'euro', days: 'day', weeks: 'week', months: 'month', years: 'year', watts: 'watt', volts: 'volt', amps: 'amp', joules: 'joule', ohms: 'ohm', moles: 'mole', newtons: 'newton', units: 'unit', tens: 'ten', hundreds: 'hundred' },
};
const MASC_A = /^(día|dia|mapa|problema|tema|sistema|planeta|idioma|clima|programa|diagrama|esquema|kilogramo|telegrama|pijama|sofá|sofà)$/i;
function feminine(lang: 'es' | 'ca', word: string): boolean {
  const w = word.toLowerCase();
  if (MASC_A.test(w)) return false;
  if (lang === 'es') return /(a|as|ción|sión|dad|tad|tud|umbre|ciones|siones|dades)$/.test(w);
  if (/(txes|xes|sses|jes|ges|ços)$/.test(w)) return false;
  return /(a|es|ció|sió|tat|tats|cions)$/.test(w) && !/^(metres|centímetres|decímetres|quilòmetres|mil·límetres|litres|mil·lilitres|centilitres|joules|euros|quilos)$/.test(w);
}
const NOT_NOUN = /^(es|y|o|u|e|ni|más|menos|por|entre|de|del|a|al|en|con|sin|son|que|se|no|lo|la|el|los|las|le|les|és|i|més|menys|per|amb|sense|són|o|un|una|veces|vegades|cop|cops|pas|paso|pasos|passos)$/i;
const TENS_ES = ['', '', 'veinti', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
const TENS_CA = ['', '', 'vint', 'trenta', 'quaranta', 'cinquanta', 'seixanta', 'setanta', 'vuitanta', 'noranta'];
function numberAgreement(lang: Lang, text: string): string {
  // thousands written with a space: «1 000» → «1000», so it is said «mil»
  text = text.replace(/(?<![\d.,])(\d{1,3})(?:[\u00A0\u202F ](\d{3}))+(?![\d])/g, (m) => m.replace(/[\u00A0\u202F ]/g, ''));
  // «= ? cm» → «cuántos centímetros», not «cuánto centímetros»
  if (lang === 'es') text = text.replace(/\bcuánto ([\p{L}]+s)\b/gu, (_m, w: string) => `${feminine('es', w) ? 'cuántas' : 'cuántos'} ${w}`);
  if (lang === 'ca') text = text.replace(/\bquant ([\p{L}·]+s)\b/gu, (_m, w: string) => `${feminine('ca', w) ? 'quantes' : 'quants'} ${w}`);
  if (lang === 'en') text = text.replace(/\bwhat ([\p{L}]+s)\b/gu, (_m, w: string) => `how many ${w}`);
  if (lang === 'en') return text.replace(/(?<![\d.,])1 ([\p{L}]+)/gu, (_m, w: string) => `1 ${PLURAL_ONE.en[w] ?? w}`);
  const L = lang;
  const sing = PLURAL_ONE[L];
  return text.replace(/(?<![\d.,−-])(\d{1,2}) ([\p{L}·]+)((?: (?:cuadrados|cúbicos|quadrats|cúbics))?)/gu, (m, n: string, w: string, rest: string) => {
    const v = Number(n);
    if (v % 10 !== 1 || v === 11 || NOT_NOUN.test(w)) return m;
    const word = v === 1 ? sing[w] ?? w : w;
    const adj = v === 1 ? rest.replace(/ (\S+)$/, (_x, a: string) => ` ${sing[a] ?? a}`) : rest;
    const fem = feminine(L, word);
    const one = L === 'es' ? (fem ? 'una' : 'un') : (fem ? 'una' : 'un');
    let said: string;
    if (v === 1) said = one;
    else if (L === 'es') said = v === 21 ? (fem ? 'veintiuna' : 'veintiún') : `${TENS_ES[Math.floor(v / 10)]} y ${one}`;
    else said = v === 21 ? `vint-i-${one}` : `${TENS_CA[Math.floor(v / 10)]}-${one}`;
    return `${said} ${word}${adj}`;
  });
}

export function speakable(lang: Lang, text: string): string {
  // A symbol in brackets after its name is not read: «1 metro (m)» is said «1 metro», not «1 metro metros».
  text = text.replace(/\s*\((?:[^()\s\d]{1,5}|°C|[a-zA-Z]{1,3}[²³])\)/gu, '');
  const w = { es: ['más', 'menos', 'por', 'es igual a', 'cuánto'], ca: ['més', 'menys', 'per', 'és igual a', 'quant'], en: ['plus', 'minus', 'times', 'equals', 'what'] }[lang];
  const sup = (x: string) => x.split('').map((c) => '⁰¹²³⁴⁵⁶⁷⁸⁹'.indexOf(c)).join('');
  const pw = { es: ['elevado a', 'por', 'entre'], ca: ['elevat a', 'per', 'entre'], en: ['to the power of', 'times', 'divided by'] }[lang];
  text = text.replace(/10([⁰¹²³⁴⁵⁶⁷⁸⁹]+)/g, (_, e) => `10 ${pw[0]} ${sup(e)}`).replace(/10ⁿ/g, `10 ${pw[0]} n`).replace(/(?<=[\d\s)])·(?=[\s\d(])/g, ` ${pw[1]} `).replace(/÷/g, ` ${pw[2]} `);
  const U: Record<string, [string, string, string]> = { 'km/h': ['kilómetros por hora', 'quilòmetres per hora', 'kilometres per hour'], 'g/cm³': ['gramos por centímetro cúbico', 'grams per centímetre cúbic', 'grams per cubic centimetre'], 'g/L': ['gramos por litro', 'grams per litre', 'grams per litre'], 'cm³': ['centímetros cúbicos', 'centímetres cúbics', 'cubic centimetres'], '°C': ['grados', 'graus', 'degrees'] };
  for (const [u, w3] of Object.entries(U)) text = text.split(u).join(w3[lang === 'es' ? 0 : lang === 'ca' ? 1 : 2]);
  text = unitWords(lang, text);
  text = text.replace(/(\d+)\/(\d+)/g, (_, a, b) => fractionWords(lang, Number(a), Number(b))).replace(/\+/g, ` ${w[0]} `).replace(/−/g, ` ${w[1]} `).replace(/×/g, ` ${w[2]} `).replace(/=/g, ` ${w[3]} `).replace(/(^|[\s=])\?(?=\s|$)/g, `$1 ${w[4]}`);
  return numberAgreement(lang, text).replace(/\s+/g, ' ').trim();
}

export function useT() {
  const lang = useApp((s) => s.lang) ?? 'es';
  const t = (key: MsgKey | string, vars?: Record<string, string | number>) => translate(lang, key, vars);
  const m = (msg: Msg) => translate(lang, msg.key, msg.vars);
  return { t, m, lang };
}
