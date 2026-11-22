import { useMemo } from 'react';
import { ISLANDS, STATIONS } from '@/data/stations';
import { FINDS, litOf, reachOf } from '@/data/world';
import { HTML_LANG, useT } from '@/i18n';
import { statusOf, useApp } from '@/stores/app';
import { TopBar } from '@/components/Layout';
import { APP_NAME } from '@/config';

const LOCALE = { es: 'es-ES', ca: 'ca-ES', en: 'en-GB' } as const;

/** "What I have lit up": only the child sees it, on this device. The WWC recommends pupils chart their own progress. */
export default function Progress() {
  const { t, m, lang } = useT();
  const progress = useApp((s) => s.progress);
  const minutes = useApp((s) => s.minutes);
  const found = useApp((s) => s.found);
  const suggested = useApp((s) => s.suggested);
  const reach = useMemo(() => reachOf(progress, suggested), [progress, suggested]);
  const lit = useMemo(() => litOf(progress), [progress]);
  const fmt = (v: number) => v.toLocaleString(LOCALE[lang]);
  const days = [...Array(7)].map((_, i) => new Date(Date.now() - i * 864e5).toLocaleDateString('sv-SE'));
  const week = days.reduce((a, d) => a + (minutes[d] ?? 0), 0);
  const top = Math.max(20, ...lit.map(([, r]) => r), Math.min(reach, 100));
  const marks = top <= 20 ? [0, 5, 10, 15, 20] : top <= 50 ? [0, 10, 20, 30, 40, 50] : [0, 20, 40, 60, 80, 100];

  /** The fridge line: an A4 strip to colour in by hand, the golden part already done. */
  const printFridge = () => {
    const W = 270, X = (v: number) => 15 + (v / top) * W;
    let ticks = '';
    for (let v = 0; v <= top; v++) {
      const major = v % (top <= 20 ? 5 : 10) === 0;
      if (top > 50 && !major && v % 2) continue;
      ticks += `<line x1="${X(v)}" y1="${major ? 42 : 47}" x2="${X(v)}" y2="${major ? 70 : 65}" stroke="#222" stroke-width="${major ? 1.1 : .5}"/>`;
      if (major) ticks += `<text x="${X(v)}" y="84" font-size="7" text-anchor="middle" font-weight="700">${v}</text>`;
    }
    const gold = lit.map(([l, r]) => `<rect x="${X(l)}" y="49" width="${X(Math.min(r, top)) - X(l)}" height="14" rx="3" fill="#FFC861" opacity=".6"/>`).join('');
    const boxes = Array.from({ length: Math.ceil(top / 10) }, (_, i) => `<rect x="${X(i * 10) + 1}" y="92" width="${X(10) - X(0) - 2}" height="10" rx="2" fill="none" stroke="#bbb" stroke-dasharray="2 2"/>`).join('');
    const finds = FINDS.filter((f) => found.includes(f.v)).map((f) => `${fmt(f.v)}${f.unit ? ' ' + f.unit : ''} · ${t(`fd_${f.id}`)}`).join(' &nbsp;·&nbsp; ');
    const html = `<!doctype html><html lang="${HTML_LANG[lang]}"><head><meta charset="utf-8"><title>${APP_NAME}</title><style>
      @page{size:A4 landscape;margin:10mm}body{font-family:Lexend,system-ui,sans-serif;color:#22203A}h1{font-size:22pt;margin:0 0 3mm;color:#5B4BC4}p{margin:0 0 3mm;font-size:12pt}</style></head>
      <body><h1>${APP_NAME} · ${t('w_title')}</h1><p>${t('fridge_text')}</p>
      <svg viewBox="0 0 300 110" width="100%"><line x1="15" y1="56" x2="${15 + W}" y2="56" stroke="#222" stroke-width="1.6" stroke-linecap="round"/>${gold}${ticks}${boxes}</svg>
      <p style="margin-top:5mm"><b>${t('fridge_finds')}</b> ${finds || '______________________________________________'}</p></body></html>`;
    const w = window.open('', '_blank'); if (!w) return;
    w.document.write(html); w.document.close(); w.focus(); setTimeout(() => w.print(), 300);
  };

  return (
    <div className="min-h-dvh pb-10">
      <TopBar title={t('lit_title')} back="/mapa" />
      <main className="max-w-xl mx-auto px-4 space-y-4">
        <p className="rounded-2xl p-3 bg-[var(--color-mint-pale)]">🔒 {t('pr_intro')}</p>

        <section className="card space-y-3" aria-labelledby="lit-h">
          <h2 id="lit-h" className="font-extrabold text-lg">{t('lit_intro')}</h2>
          <div className="relative h-14 rounded-2xl bg-[var(--color-accent-pale)] overflow-hidden" data-testid="lit-strip" role="img"
            aria-label={lit.length ? lit.map(([l, r]) => `${l}–${r}`).join(', ') : t('lit_none')}>
            {lit.map(([l, r], i) => (
              <i key={i} className="absolute top-0 bottom-0" style={{ left: `${(l / top) * 100}%`, width: `${((Math.min(r, top) - l) / top) * 100}%`, background: 'linear-gradient(90deg,#FFD27A,#FFB547)', boxShadow: 'inset 0 0 18px #FFB54788' }} />
            ))}
            {marks.map((v) => <span key={v} className="absolute top-1/2 -translate-y-1/2 text-xs font-extrabold" style={{ left: `calc(${(v / top) * 100}% ${v === 0 ? '+ 6px' : v === top ? '- 22px' : '- 8px'})` }}>{v}</span>)}
          </div>
          {!lit.length && <p className="text-sm text-[var(--color-muted)]">{t('lit_none')}</p>}
          <button className="btn btn-primary w-full" onClick={printFridge} data-testid="print-fridge">🖨️ {t('print_fridge')}</button>
        </section>

        <section className="card space-y-2" aria-labelledby="finds-h">
          <h2 id="finds-h" className="font-extrabold text-lg">✦ {t('finds')} · {found.length}/{FINDS.length}</h2>
          <p className="text-sm text-[var(--color-muted)]">{t('finds_intro')}</p>
          <div className="grid grid-cols-2 gap-2">
            {FINDS.map((f) => found.includes(f.v) ? (
              <div key={f.id} className="rounded-2xl p-3 bg-[var(--color-yellow-pale)]" data-testid={`find-${f.id}`}><b className="block text-xl">{fmt(f.v)}{f.unit ? ` ${f.unit}` : ''}</b><span className="text-sm">{t(`fd_${f.id}`)}</span></div>
            ) : (
              <div key={f.id} className="rounded-2xl p-3 border-2 border-dashed border-[var(--color-border)] text-[var(--color-muted)]"><b className="block text-xl">?</b><span className="text-sm">{t('find_unknown')}</span></div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-2 gap-2">
          <div className="card text-center"><p className="text-3xl font-extrabold">{minutes[days[0]] ?? 0}</p><p className="text-sm">{t('pr_today', { m: minutes[days[0]] ?? 0 })}</p></div>
          <div className="card text-center"><p className="text-3xl font-extrabold">{week}</p><p className="text-sm">{t('pr_week', { m: week })}</p></div>
        </div>

        {ISLANDS.map((isl) => (
          <section key={isl.id} className="card space-y-2">
            <h2 className="font-extrabold">{isl.emoji} {t(isl.title)}</h2>
            <ul className="space-y-1">
              {STATIONS.filter((s) => s.island === isl.id).map((s) => {
                const p = progress[s.id], st = statusOf(p);
                return (
                  <li key={s.id} className="flex items-center gap-2 text-base">
                    <span className="flex-1">{m(s.title)}</span>
                    <span className={`text-xs font-semibold rounded-full px-2 py-1 ${st === 'done' ? 'bg-[#FFE7B0]' : 'bg-[var(--color-accent-pale)]'}`}>{st === 'done' ? '★ ' : ''}{t(`status_${st}`)}</span>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </main>
    </div>
  );
}
