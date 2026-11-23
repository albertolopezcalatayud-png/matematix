import { renderToStaticMarkup } from 'react-dom/server';
import QRCode from 'qrcode';
import type { Item, Lang, Msg, Station } from '@/engine/types';
import { fmtScaled, translate } from '@/i18n';
import { NumberLine, VisualView } from './Visuals';
import { pickItems } from '@/engine/session';
import { itemKey } from '@/data/stations';
import { esc } from '@/services/print';
import { SITE } from '@/config';

const tm = (lang: Lang, msg: Msg) => translate(lang, msg.key, msg.vars);

function answerText(lang: Lang, item: Item): string {
  if (item.kind === 'place') return fmtScaled(lang, item.target, item.scale ?? 1, item.frac);
  if (item.kind === 'choice' && item.optionLabels) return tm(lang, item.optionLabels[item.options.indexOf(item.answer)]);
  return String(item.answer);
}

/** One exercise drawn for paper: the same visual models as in the app, with a place to answer by hand. */
function paperItem(lang: Lang, item: Item, guided: boolean, n: number): string {
  const t = (k: string, v?: Record<string, string | number>) => translate(lang, k, v);
  let draw = '';
  if (item.kind === 'place') {
    draw = renderToStaticMarkup(<NumberLine v={{ type: 'line', min: item.min, max: item.max, marks: [...new Set([...item.marks, ...(guided ? item.aidMarks ?? [] : [])])], labels: [...new Set([...item.labels, ...(guided ? item.aidLabels ?? [] : [])])], scale: item.scale, frac: item.frac }} describe="" />);
  } else {
    if (item.visual) draw = renderToStaticMarkup(<VisualView v={item.visual} describe="" />);
    if (item.kind === 'number' && item.thread && !item.visual) {
      const { min, max, step } = item.thread;
      const every = (max - min) / step > 40 ? step * 10 : step;
      const marks: number[] = []; for (let v = min; v <= max; v += every) marks.push(v);
      const labels = marks.filter((v) => v % (every * 5) === 0 || v === min || v === max);
      draw = renderToStaticMarkup(<NumberLine v={{ type: 'line', min, max, marks, labels }} describe="" />);
    }
  }
  const answer = item.kind === 'choice'
    ? `<div>${item.options.map((o, k) => `<span class="opt">${esc(item.optionLabels ? tm(lang, item.optionLabels[k]) : String(o))}</span>`).join('')}</div>`
    : item.kind === 'number' ? `<div style="text-align:right"><span class="box"></span></div>` : '';
  const hint = guided && item.hint ? `<p class="small">💡 ${t('f_hint')}: ${esc(tm(lang, item.hint))}</p>` : '';
  return `<div class="no-break" style="padding:2mm 0 3mm;border-bottom:1px dashed #ccc"><p style="margin:0 0 1mm;font-weight:700"><span style="color:#5B4BC4">${n}.</span> ${esc(tm(lang, item.prompt))}</p>
    ${draw ? `<div style="max-width:${item.kind === 'place' || (item.kind === 'number' && item.thread && !item.visual) ? 125 : 150}mm">${draw}</div>` : ''}${answer}${hint}</div>`;
}

/** A worksheet (page 1) and its answers (page 2). Different exercises every time (another seed). */
export async function worksheetHtml(lang: Lang, st: Station, seed: number, count: number, guided: boolean): Promise<string> {
  const t = (k: string, v?: Record<string, string | number>) => translate(lang, k, v);
  const all: { item: Item; guided: boolean }[] = [];
  const used = new Set<string>();
  for (let k = 0; all.length < count && k < 8; k++)
    for (const x of pickItems(st, (seed + k * 99991) >>> 0, used, guided && k === 0 ? 2 : 0)) {
      const key = itemKey(x.item);
      if (!used.has(key) && all.length < count) { used.add(key); all.push(x); }
    }
  const url = `${SITE}#/estacion/${st.id}`;
  const qr = await QRCode.toString(url, { type: 'svg', margin: 1, errorCorrectionLevel: 'M', color: { dark: '#22203A', light: '#FFFFFF' } });
  const title = tm(lang, st.title);
  const head = `<div style="display:flex;gap:6mm;align-items:flex-start"><div style="flex:1"><h1>${esc(title)}</h1>
    <p><b>${t('f_name')}:</b> ____________________________ &nbsp; <b>${translate(lang, 'ss_date')}:</b> ___________</p></div>
    <div style="width:26mm;text-align:center">${qr.replace('<svg', '<svg width="26mm" height="26mm"')}<p class="small" style="margin:0;font-size:7pt">${t('f_qr')}</p></div></div>`;
  const body = all.map((x, i) => paperItem(lang, x.item, x.guided, i + 1)).join('');
  const sol = all.map((x, i) => `<li style="margin:1.5mm 0"><b>${i + 1}.</b> ${esc(tm(lang, x.item.prompt))} → <b style="color:#2E8B6F">${esc(answerText(lang, x.item))}</b></li>`).join('');
  return `<div class="pg">${head}${body}<p class="small">${t('f_paper_first')}</p></div>
    <div class="pg"><h1>${t('f_solutions')} · ${esc(title)}</h1><ol style="list-style:none;padding:0">${sol}</ol></div>`;
}
