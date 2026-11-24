import { Link, Navigate, useParams } from 'react-router-dom';
import { ISLANDS, STATIONS } from '@/data/stations';
import { useT } from '@/i18n';
import { statusOf, useApp } from '@/stores/app';
import { nextStation } from '@/data/world';
import { TopBar } from '@/components/Layout';
import { BottomNav } from '@/components/BottomNav';

/** All topics, each with how many lessons are complete. */
export function TopicList() {
  const { t } = useT();
  const progress = useApp((s) => s.progress);
  return (
    <div className="min-h-dvh has-nav">
      <TopBar title={t('nav_topics')} back="/" gear={false} />
      <main className="max-w-xl mx-auto px-4 space-y-3">
        <p className="text-base">{t('topics_intro')}</p>
        {ISLANDS.map((i) => {
          const st = STATIONS.filter((x) => x.island === i.id);
          const done = st.filter((x) => statusOf(progress[x.id]) === 'done').length;
          return (
            <Link key={i.id} to={`/tema/${i.id}`} data-island={i.id} className="tile flex items-center gap-3 !p-4" data-testid={`topic-${i.id}`}>
              <span className="text-4xl" aria-hidden>{i.emoji}</span>
              <span className="flex-1 space-y-1">
                <span className="block text-lg font-extrabold" style={{ color: 'var(--isl)' }}>{t(i.title)}</span>
                <span className="block text-sm">{t('topic_count', { d: done, n: st.length })}</span>
                <span className="tile-bar block"><i style={{ width: `${(done / st.length) * 100}%` }} /></span>
              </span>
              <span aria-hidden className="text-2xl" style={{ color: 'var(--isl)' }}>›</span>
            </Link>
          );
        })}
        <Link to="/punto-de-partida" className="btn btn-ghost w-full">🧭 {t('find_start')}</Link>
      </main>
      <BottomNav />
    </div>
  );
}

/** One topic: its lessons in order, numbered, with where you are and what is complete. */
export function TopicPage() {
  const { id } = useParams();
  const { t, m } = useT();
  const s = useApp();
  const isl = ISLANDS.find((i) => i.id === id);
  if (!isl) return <Navigate to="/temas" replace />;
  const here = nextStation(s.progress, s.suggested, s.last);
  const list = STATIONS.filter((x) => x.island === isl.id);
  return (
    <div className="min-h-dvh has-nav lesson-bg" data-island={isl.id}>
      <TopBar title={t(isl.title)} back="/temas" gear={false} />
      <main className="max-w-xl mx-auto px-4 space-y-3">
        <p className="rounded-2xl p-3 bg-[var(--color-card)] text-sm">{t('how_works')}</p>
        <ol className="space-y-2">
          {list.map((x, n) => {
            const st = statusOf(s.progress[x.id]);
            const days = Math.min(2, s.progress[x.id]?.goodDays.length ?? 0);
            return (
              <li key={x.id}>
                <Link to={`/estacion/${x.id}`} className={`lesson-row ${x.id === here ? 'here' : ''} ${st === 'done' ? 'done' : ''}`} data-testid={`station-${x.id}`}>
                  <span className="lesson-num" aria-hidden>{st === 'done' ? '✓' : n + 1}</span>
                  <span className="flex-1">
                    <span className="block text-xs font-bold text-[var(--color-muted)]">{t('lesson_n', { n: n + 1 })}</span>
                    <span className="block font-extrabold leading-snug">{m(x.title)}</span>
                    <span className="block text-sm">
                      {x.id === here ? <b style={{ color: 'var(--isl)' }}>▶ {t('suggested')}</b> : t(`status_${st}`)}
                      {st !== 'todo' && <span aria-label={`${days}/2`}> · {days >= 1 ? '★' : '☆'}{days >= 2 ? '★' : '☆'}</span>}
                    </span>
                  </span>
                  <span className="btn btn-primary !min-h-10 !px-4 text-sm">{st === 'done' ? t('review') : st === 'doing' ? t('carry_on') : t('start')}</span>
                </Link>
              </li>
            );
          })}
        </ol>
      </main>
      <BottomNav />
    </div>
  );
}
