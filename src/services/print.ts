import { HTML_LANG } from '@/i18n';
import type { Lang } from '@/engine/types';
import { APP_NAME } from '@/config';
import { Capacitor, registerPlugin } from '@capacitor/core';

const Printer = Capacitor.isNativePlatform() ? registerPlugin<{ printHtml(o: { html: string; title: string; landscape: boolean }): Promise<void> }>('Printer') : null;

/**
 * Prints an A4 page made in the app (worksheets, certificates, games, session sheets). It goes through a hidden
 * frame with the app's own styles (Lexend, colours, Tailwind), always in light colours, so it works in the installed
 * app too (no pop-up windows). Nothing is uploaded: the page is built and printed on this device.
 */
export function printPage(lang: Lang, title: string, body: string, opts: { landscape?: boolean; css?: string } = {}) {
  // the app's own CSS, copied in as text: the page prints right away and also works offline
  const css = [...document.styleSheets].map((ss) => { try { return [...ss.cssRules].map((r) => r.cssText).join('\n'); } catch { return ''; } }).join('\n');
  const styles = `<style>${css}</style>`;
  const html = `<!doctype html><html lang="${HTML_LANG[lang]}" data-theme="light"><head><meta charset="utf-8"><base href="${document.baseURI}"><title>${APP_NAME} · ${title}</title>${styles}
<style>@page{size:A4 ${opts.landscape ? 'landscape' : 'portrait'};margin:12mm}
html,body{background:#fff!important;color:#22203A;font-size:12pt}
.pg{break-after:page}.pg:last-child{break-after:auto}
.no-break{break-inside:avoid}
h1{font-size:20pt;font-weight:800;color:#5B4BC4;margin:0 0 3mm}h2{font-size:14pt;font-weight:800;margin:4mm 0 2mm}
.line{border-bottom:1px solid #999;height:9mm}
.box{display:inline-block;min-width:22mm;height:11mm;border:1.5px solid #555;border-radius:3mm;vertical-align:middle}
.opt{display:inline-block;min-width:14mm;padding:1.5mm 3mm;margin:1mm 2mm 1mm 0;border:1.2px solid #999;border-radius:3mm;text-align:center;font-weight:700}
.small{font-size:9.5pt;color:#555}
${opts.css ?? ''}</style></head><body>${body}</body></html>`;
  if (Printer) { void Printer.printHtml({ html, title: `${APP_NAME} · ${title}`, landscape: !!opts.landscape }); return; }
  document.getElementById('print-frame')?.remove();
  const f = document.createElement('iframe');
  f.id = 'print-frame';
  f.setAttribute('aria-hidden', 'true');
  f.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden';
  document.body.appendChild(f);
  const doc = f.contentDocument!;
  doc.open();
  doc.write(html);
  doc.close();
  const go = () => { f.contentWindow?.focus(); f.contentWindow?.print(); };
  // wait for the fonts, then print
  void (doc.fonts?.ready ?? Promise.resolve()).then(() => setTimeout(go, 150));
}

export const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
