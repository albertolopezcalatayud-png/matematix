import { Link, Navigate, useNavigate } from 'react-router-dom';
import { HoldButton } from '@/components/HoldButton';
import { useT } from '@/i18n';
import { useApp } from '@/stores/app';
import { stationById } from '@/data/stations';
import { nextStation } from '@/data/world';
import { APP_NAME } from '@/config';

/** One clear thing to do: a big button that opens the next station. The number line is there to explore, not a menu to decode. */
export default function Home() {
  const { t, m } = useT();
  const lang = useApp((s) => s.lang);
  const last = useApp((s) => s.last);
  const suggested = useApp((s) => s.suggested);
  const progress = useApp((s) => s.progress);
  const role = useApp((s) => s.role);
  const active = useApp((s) => s.active);
  const pupil = useApp((s) => (s.active ? s.pupils[s.active] : undefined));
  const nav = useNavigate();
  if (!lang) return <Navigate to="/idioma" replace />;
  if (!role) return <Navigate to="/quien" replace />;
  const fresh = !last && !suggested && Object.keys(progress).length === 0;
  const next = stationById(nextStation(progress, suggested, last))!;
  return (
    <main className="min-h-dvh flex flex-col max-w-md mx-auto px-5 py-8 gap-4 world-bg">
      <div className="text-center space-y-2 py-6">
        <img src="./favicon.svg" alt="" className="w-16 h-16 mx-auto" />
        <h1 className="text-4xl font-extrabold">{APP_NAME}</h1>
        {active && pupil && <p className="chip inline-block !text-base" data-testid="who-now">{pupil.emoji} {pupil.alias}</p>}
        <p className="text-lg">{t('tagline')}</p>
      </div>
      {fresh ? (
        <Link to="/punto-de-partida" className="btn btn-primary !text-2xl !min-h-20 !rounded-3xl" data-testid="start">{t('start')} ▶</Link>
      ) : (
        <Link to={`/estacion/${next.id}`} className="btn btn-primary !min-h-24 !rounded-3xl flex-col !gap-0" data-testid="carry-on">
          <span className="text-2xl font-extrabold">{t('carry_on')} ▶</span>
          <span className="text-base font-semibold opacity-90">{t('next_is', { s: m(next.title) })}</span>
        </Link>
      )}
      <div className="grid grid-cols-2 gap-2">
        <Link to="/mapa" className="btn btn-ghost !min-h-16 flex-col !gap-0" data-testid="to-world"><span aria-hidden className="text-xl">📏</span>{t('my_line')}</Link>
        <Link to="/progreso" className="btn btn-ghost !min-h-16 flex-col !gap-0"><span aria-hidden className="text-xl">✦</span>{t('lit_title')}</Link>
      </div>
      <div className="flex-1" />
      <nav className="flex justify-center gap-4 text-sm">
        <Link to="/ajustes" className="underline">{t('settings')}</Link>
        <Link to="/privacidad" className="underline">{t('privacy')}</Link>
      </nav>
      <HoldButton onDone={() => nav('/adultos')} className="btn-ghost !min-h-10 text-sm mx-auto" testId="to-adults">🔑 {t('adults')} · {t('hold_open')}</HoldButton>
    </main>
  );
}
