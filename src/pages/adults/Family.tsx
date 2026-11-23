import { useT } from '@/i18n';
import { STATIONS } from '@/data/stations';
import { useApp } from '@/stores/app';
import { TopBar } from '@/components/Layout';
import { Bullets } from '@/components/Bullets';
import { ModelSteps } from '@/components/ModelSteps';
import { esc, printPage } from '@/services/print';
import { APP_NAME } from '@/config';

const days7 = () => [...Array(7)].map((_, i) => new Date(Date.now() - i * 864e5).toLocaleDateString('sv-SE'));
const frame = (n: number, x: number, y: number, c = 4.2) => {
  let s = '';
  for (let i = 0; i < 10; i++) {
    const cx = x + (i % 5) * c, cy = y + Math.floor(i / 5) * c;
    s += `<rect x="${cx}" y="${cy}" width="${c}" height="${c}" fill="none" stroke="#888" stroke-width=".3"/>`;
    if (i < n) s += `<circle cx="${cx + c / 2}" cy="${cy + c / 2}" r="${c * 0.33}" fill="#5B4BC4"/>`;
  }
  return s;
};

/** For families: 10-minute challenges with everyday things, two printable games, how it is explained at school,
 *  and a weekly "what I can do" card with no marks. Paper and conversation first. */
export default function Family() {
  const { t, m, lang } = useT();
  const progress = useApp((s) => s.progress);
  const minutes = useApp((s) => s.minutes);

  const race = () => {
    // a winding 0–30 track: three rows of 11 squares, gold on 5, 15, 25 (jump to the next ten)
    let g = '';
    for (let v = 0; v <= 30; v++) {
      const row = Math.floor(v / 11), col = row % 2 ? 10 - (v % 11) : v % 11;
      const x = 8 + col * 24, y = 10 + row * 34;
      const gold = v % 10 === 5;
      g += `<rect x="${x}" y="${y}" width="22" height="22" rx="4" fill="${v === 0 || v === 30 ? '#E3F6EF' : gold ? '#FFE3A3' : '#fff'}" stroke="#5B4BC4" stroke-width=".8"/><text x="${x + 11}" y="${y + 15}" font-size="${v % 10 === 0 ? 10 : 8}" font-weight="${v % 10 === 0 ? 800 : 600}" text-anchor="middle">${v}</text>${gold ? `<text x="${x + 11}" y="${y + 21}" font-size="4.5" text-anchor="middle">→${v + 5}</text>` : ''}`;
    }
    printPage(lang, t('h_race'), `<h1>🎲 ${t('h_race')}</h1><p>${t('h_race_rules')}</p><svg viewBox="0 0 280 112" width="100%">${g}</svg><p class="small">${APP_NAME}</p>`, { landscape: true });
  };

  const tenCards = () => {
    const cards = [0, 1, 2, 3, 4, 5, 5, 6, 7, 8, 9, 10].map((n) => `<div style="border:1.2px dashed #999;border-radius:4mm;height:52mm;display:flex;flex-direction:column;align-items:center;justify-content:center">
      <span style="font-size:34pt;font-weight:800;color:#5B4BC4">${n}</span><svg viewBox="0 0 22 9" width="38mm">${frame(n, 0.5, 0.2)}</svg></div>`).join('');
    printPage(lang, t('h_ten'), `<h1>🃏 ${t('h_ten')}</h1><p>${t('h_ten_rules')}</p><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:4mm">${cards}</div>`);
  };

  const week = () => {
    const d = new Set(days7());
    const lit = STATIONS.filter((s) => progress[s.id]?.goodDays.some((x) => d.has(x)));
    const mins = days7().reduce((a, x) => a + (minutes[x] ?? 0), 0);
    printPage(lang, t('h_week_title'), `<div style="border:2.5mm solid #FFE3A3;border-radius:8mm;padding:10mm;max-width:150mm;margin:auto">
      <h1>✦ ${t('h_week_title')}</h1>${lit.length ? `<ul style="font-size:15pt;line-height:1.7">${lit.map((s) => `<li>${esc(m(s.title))}</li>`).join('')}</ul>` : `<p style="font-size:14pt">${t('h_week_none')}</p>`}
      <p>${t('h_week_min', { m: mins })}</p><h2>${t('h_week_wish')}</h2><div class="line"></div><div class="line"></div><p class="small">${APP_NAME}</p></div>`);
  };

  return (
    <div className="min-h-dvh pb-10">
      <TopBar title={t('sec_home')} back="/adultos" />
      <main className="max-w-xl mx-auto px-4 space-y-4" data-testid="family">
        <p className="rounded-2xl p-3 bg-[var(--color-mint-pale)] text-base">{t('h_intro')}</p>
        <section className="card space-y-2"><h2 className="font-extrabold">⏱️ {t('h_challenges')}</h2><Bullets text={t('h_ch')} /></section>
        <section className="card space-y-3"><h2 className="font-extrabold">🎲 {t('h_games')}</h2>
          <div><p className="font-bold">{t('h_race')}</p><p className="text-sm">{t('h_race_rules')}</p><button className="btn btn-ghost w-full mt-2" onClick={race} data-testid="print-race">🖨️ {t('h_print')}</button></div>
          <div><p className="font-bold">{t('h_ten')}</p><p className="text-sm">{t('h_ten_rules')}</p><button className="btn btn-ghost w-full mt-2" onClick={tenCards} data-testid="print-ten">🖨️ {t('h_print')}</button></div>
        </section>
        <section className="card space-y-2"><h2 className="font-extrabold">✦ {t('h_week')}</h2><p className="text-base">{t('h_week_d')}</p>
          <button className="btn btn-primary w-full" onClick={week} data-testid="print-week">🖨️ {t('h_print')}</button>
          <p className="text-sm text-[var(--color-muted)]">{t('h_fridge')}</p></section>
        <section className="card space-y-3"><h2 className="font-extrabold">🪜 {t('sec_explain')}</h2><p className="text-base">{t('h_explain_d')}</p><ModelSteps /></section>
      </main>
    </div>
  );
}
