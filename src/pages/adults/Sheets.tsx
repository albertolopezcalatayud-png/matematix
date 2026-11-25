import { useState } from 'react';
import { useT } from '@/i18n';
import { useApp } from '@/stores/app';
import { TopBar } from '@/components/Layout';
import { LessonPicker, useLessonContent } from '@/components/LessonPicker';
import { printPage } from '@/services/print';
import { worksheetHtml } from '@/components/printItems';
import { APP_NAME } from '@/config';

/** Paper first: worksheets with new exercises every time + answers + a QR back to the lesson (one way only),
 *  and a 0–100 number-line display for the classroom wall. */
export default function Sheets() {
  const { t, lang } = useT();
  const last = useApp((s) => s.lastLesson);
  const course = useApp((s) => s.course);
  const [id, setId] = useState<string | null>(last);
  const content = useLessonContent(id);
  const [count, setCount] = useState(8);
  const [guided, setGuided] = useState(true);
  const [busy, setBusy] = useState(false);

  const print = async () => {
    if (!id || !content) return;
    setBusy(true);
    try { printPage(lang, t('sec_sheets'), await worksheetHtml(lang, id, content, (Date.now() ^ (Math.random() * 1e9)) >>> 0, count, guided)); }
    finally { setBusy(false); }
  };

  const mural = () => {
    const pages = [0, 20, 40, 60, 80].map((from, p) => {
      const X = (v: number) => 12 + ((v - from) / 20) * 246;
      let g = `<line x1="8" y1="60" x2="262" y2="60" stroke="#22203A" stroke-width="1.6" stroke-linecap="round"/>`;
      for (let v = from; v <= from + 20; v++) {
        const ten = v % 10 === 0, five = v % 5 === 0;
        if (ten) g += `<rect x="${X(v) - 5}" y="36" width="10" height="48" rx="3" fill="#FFC861" opacity=".45"/>`;
        g += `<line x1="${X(v)}" y1="${ten ? 44 : five ? 49 : 53}" x2="${X(v)}" y2="${ten ? 76 : five ? 71 : 67}" stroke="#22203A" stroke-width="${ten ? 1.4 : .8}"/>`;
        g += `<text x="${X(v)}" y="${ten ? 98 : 92}" font-size="${ten ? 11 : 7.5}" text-anchor="middle" font-weight="${ten ? 800 : 600}" fill="${ten ? '#5B4BC4' : '#22203A'}">${v}</text>`;
      }
      return `<div class="pg"><p class="small">${APP_NAME} · ${t('sec_mural')} · ${p + 1}/5</p><svg viewBox="0 0 270 120" width="100%">${g}</svg>${p < 4 ? `<p class="small" style="text-align:right">${t('mu_tape')}</p>` : ''}</div>`;
    }).join('');
    printPage(lang, t('sec_mural'), pages, { landscape: true });
  };

  return (
    <div className="min-h-dvh pb-10">
      <TopBar title={t('sec_sheets')} back="/adultos" />
      <main className="max-w-xl mx-auto px-4 space-y-4">
        <p className="rounded-2xl p-3 bg-[var(--color-sky-pale)] text-base">{t('f_intro')}</p>
        <section className="card space-y-3">
          <LessonPicker value={id} onChange={setId} startCourse={course} testId="sheet-lesson" />
          <div className="flex items-center gap-2"><span className="flex-1">{t('f_count')}</span>
            {[6, 8, 10].map((n) => <button key={n} className={`btn ${count === n ? 'btn-primary' : 'btn-ghost'} !min-h-10 !px-4`} onClick={() => setCount(n)}>{n}</button>)}
          </div>
          <label className="flex items-center gap-3 cursor-pointer"><span className="flex-1">{t('f_guided')}</span>
            <input type="checkbox" role="switch" className="w-6 h-6 accent-[var(--color-accent)]" checked={guided} onChange={(e) => setGuided(e.target.checked)} /></label>
          <button className="btn btn-primary w-full" onClick={() => void print()} disabled={busy || !content} data-testid="print-sheet">🖨️ {t('f_print')}</button>
          <p className="text-sm text-[var(--color-muted)]">{t('f_paper_first')}</p>
        </section>
        <section className="card space-y-3">
          <h2 className="font-extrabold">📏 {t('sec_mural')}</h2>
          <p className="text-base">{t('mu_intro')}</p>
          <button className="btn btn-ghost w-full" onClick={mural} data-testid="print-mural">🖨️ {t('mu_print')}</button>
        </section>
      </main>
    </div>
  );
}
