import { Link } from 'react-router-dom';
import { ISLANDS, STATIONS } from '@/data/stations';
import { useT } from '@/i18n';
import { statusOf, useApp } from '@/stores/app';
import { TopBar } from '@/components/Layout';

const CHIP = { todo: 'bg-[var(--color-accent-pale)]', doing: 'bg-[var(--color-yellow-pale)]', done: 'bg-[var(--color-mint-pale)]' };
const ICON = { todo: '○', doing: '◐', done: '●' };

export default function MapPage() {
  const { t, m } = useT();
  const progress = useApp((s) => s.progress);
  const suggested = useApp((s) => s.suggested);
  return (
    <div className="min-h-dvh pb-10">
      <TopBar title={t('map_title')} back="/" />
      <main className="max-w-xl mx-auto px-4 space-y-5">
        <p className="text-base">{t('map_intro')}</p>
        <Link to="/punto-de-partida" className="btn btn-ghost w-full">🧭 {t('find_start')}</Link>
        {ISLANDS.map((isl) => (
          <section key={isl.id} className="card space-y-3" aria-labelledby={`isl-${isl.id}`}>
            <h2 id={`isl-${isl.id}`} className="text-xl font-extrabold flex items-center gap-2"><span aria-hidden>{isl.emoji}</span>{t(isl.title)}</h2>
            <ol className="space-y-2">
              {STATIONS.filter((s) => s.island === isl.id).map((s, i) => {
                const st = statusOf(progress[s.id]);
                return (
                  <li key={s.id}>
                    <Link to={`/estacion/${s.id}`} data-testid={`station-${s.id}`} className={`flex items-center gap-3 rounded-2xl border-2 p-3 ${suggested === s.id ? 'border-[var(--color-accent)]' : 'border-[var(--color-border)]'} bg-[var(--color-card)]`}>
                      <span className="w-9 h-9 rounded-full bg-[var(--color-accent-pale)] flex items-center justify-center font-extrabold" aria-hidden>{i + 1}</span>
                      <span className="flex-1">
                        <span className="block font-semibold">{m(s.title)}</span>
                        {suggested === s.id && <span className="block text-sm text-[var(--color-accent)] font-semibold">★ {t('suggested')}</span>}
                      </span>
                      <span className={`text-xs font-semibold rounded-full px-2 py-1 whitespace-nowrap ${CHIP[st]}`}><span aria-hidden>{ICON[st]} </span>{t(`status_${st}`)}</span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </main>
    </div>
  );
}
