import { ISLANDS, STATIONS } from '@/data/stations';
import { HTML_LANG, useT } from '@/i18n';
import { statusOf, useApp } from '@/stores/app';
import { TopBar } from '@/components/Layout';
import { APP_NAME } from '@/config';

/** Only the child sees this, on this device. The WWC recommends that pupils chart their own progress; no teacher dashboard. */
export default function Progress() {
  const { t, m, lang } = useT();
  const progress = useApp((s) => s.progress);
  const minutes = useApp((s) => s.minutes);
  const days = [...Array(7)].map((_, i) => new Date(Date.now() - i * 864e5).toLocaleDateString('sv-SE'));
  const week = days.reduce((a, d) => a + (minutes[d] ?? 0), 0);
  const todayMin = minutes[days[0]] ?? 0;

  const printSheet = () => {
    const rows = STATIONS.map((s) => `<tr><td>${s.id}</td><td>${m(s.title)}</td>${'<td></td>'.repeat(6)}</tr>`).join('');
    const html = `<!doctype html><html lang="${HTML_LANG[lang]}"><head><meta charset="utf-8"><title>${APP_NAME}</title><style>
      @page{size:A4;margin:12mm}body{font-family:system-ui,sans-serif;color:#222}h1{font-size:18pt;color:#5B4BC4}
      table{width:100%;border-collapse:collapse;font-size:12pt}td,th{border:1px solid #999;padding:7px;height:28px}th{background:#EDEAFF}</style></head>
      <body><h1>${APP_NAME} · ${t('my_progress')}</h1><p>${t('pr_intro')}</p>
      <table><tr><th></th><th></th>${[1, 2, 3, 4, 5, 6].map(() => '<th>__/__</th>').join('')}</tr>${rows}</table></body></html>`;
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(html); w.document.close(); w.focus(); setTimeout(() => w.print(), 300);
  };

  return (
    <div className="min-h-dvh pb-10">
      <TopBar title={t('my_progress')} back="/" />
      <main className="max-w-xl mx-auto px-4 space-y-4">
        <p className="rounded-2xl p-3 bg-[var(--color-mint-pale)]">🔒 {t('pr_intro')}</p>
        <div className="grid grid-cols-2 gap-2">
          <div className="card text-center"><p className="text-3xl font-extrabold">{todayMin}</p><p className="text-sm">{t('pr_today', { m: todayMin })}</p></div>
          <div className="card text-center"><p className="text-3xl font-extrabold">{week}</p><p className="text-sm">{t('pr_week', { m: week })}</p></div>
        </div>
        <div className="card" aria-hidden>
          <div className="flex items-end gap-2 h-24">
            {days.slice().reverse().map((d) => (
              <div key={d} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t-lg bg-[var(--color-accent)]" style={{ height: `${Math.min(100, ((minutes[d] ?? 0) / 20) * 100)}%`, minHeight: 2 }} />
                <span className="text-[10px] text-[var(--color-muted)]">{d.slice(8)}</span>
              </div>
            ))}
          </div>
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
                    {p && <span className="text-sm text-[var(--color-muted)]">{t('pr_best', { a: p.best, b: 5 })}</span>}
                    <span className="text-xs font-semibold rounded-full px-2 py-1 bg-[var(--color-accent-pale)]">{t(`status_${st}`)}</span>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
        <button className="btn btn-ghost w-full" onClick={printSheet}>🖨️ {t('pr_print')}</button>
      </main>
    </div>
  );
}
