import { renderToStaticMarkup } from 'react-dom/server';
import QRCode from 'qrcode';
import type { Lang } from '@/engine/types';
import { translate } from '@/i18n';
import { VisualView } from './Visuals';
import { findLesson, isTypeable, optionsFor, pickQs, showAns, tr } from '@/course';
import type { LessonContent, Q } from '@/course/types';
import { rng } from '@/engine/rng';
import { esc } from '@/services/print';
import { SITE } from '@/config';

/** One exercise drawn for paper: the same visual as in the app, options (guided, or when the answer is not a number)
 *  or a box to write the answer by hand. */
function paperItem(lang: Lang, qq: Q, guided: boolean, n: number, r: () => number): string {
  const t = (k: string) => translate(lang, k);
  const draw = qq.visual ? `<div style="max-width:140mm">${renderToStaticMarkup(<VisualView v={qq.visual} describe="" />)}</div>` : '';
  const choices = guided || qq.mc || !isTypeable(qq.a);
  const answer = choices
    ? `<div>${optionsFor(qq, guided ? 2 : 3, r).map((o) => `<span class="opt">${esc(showAns(lang, o))}</span>`).join('')}</div>`
    : `<div style="text-align:right"><span class="box"></span></div>`;
  const hint = guided ? `<p class="small">💡 ${t('f_hint')}: ${esc(tr(lang, qq.hint))}</p>` : '';
  return `<div class="no-break" style="padding:2mm 0 3mm;border-bottom:1px dashed #ccc"><p style="margin:0 0 1mm;font-weight:700"><span style="color:#5B4BC4">${n}.</span> ${esc(tr(lang, qq.q))}</p>${draw}${answer}${hint}</div>`;
}

/** A worksheet (page 1) and its answers (page 2) for one lesson. Different exercises every time (another seed). */
export async function worksheetHtml(lang: Lang, lessonId: string, content: LessonContent, seed: number, count: number, guided: boolean): Promise<string> {
  const t = (k: string) => translate(lang, k);
  const qs = pickQs(content, seed, new Set(), count);
  const r = rng(seed ^ 0x5bd1e995);
  const found = findLesson(lessonId);
  const title = found ? tr(lang, found.lesson.title) : lessonId;
  const sub = found ? `${tr(lang, found.subject.title)} · ${tr(lang, found.block.title)}` : '';
  const url = `${SITE}#/leccion/${lessonId}`;
  const qr = await QRCode.toString(url, { type: 'svg', margin: 1, errorCorrectionLevel: 'M', color: { dark: '#22203A', light: '#FFFFFF' } });
  const head = `<div style="display:flex;gap:6mm;align-items:flex-start"><div style="flex:1"><p class="small" style="margin:0">${esc(sub)}</p><h1>${esc(title)}</h1>
    <p><b>${t('f_name')}:</b> ____________________________ &nbsp; <b>${t('ss_date')}:</b> ___________</p></div>
    <div style="width:26mm;text-align:center">${qr.replace('<svg', '<svg width="26mm" height="26mm"')}<p class="small" style="margin:0;font-size:7pt">${t('f_qr')}</p></div></div>`;
  const idea = guided ? `<div style="background:#EEF6FF;border-radius:3mm;padding:2mm 3mm;margin:0 0 3mm">${content.explain.map((e) => `<p style="margin:0 0 1mm">${esc(tr(lang, e))}</p>`).join('')}</div>` : '';
  const body = qs.map((qq, i) => paperItem(lang, qq, guided, i + 1, r)).join('');
  const sol = qs.map((qq, i) => `<li style="margin:1.5mm 0"><b>${i + 1}.</b> ${esc(tr(lang, qq.q))} → <b style="color:#2E8B6F">${esc(showAns(lang, qq.a))}</b></li>`).join('');
  return `<div class="pg">${head}${idea}${body}<p class="small">${t('f_paper_first')}</p></div>
    <div class="pg"><h1>${t('f_solutions')} · ${esc(title)}</h1><ol style="list-style:none;padding:0">${sol}</ol></div>`;
}
