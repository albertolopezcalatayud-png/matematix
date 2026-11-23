import { Link, Navigate, useNavigate } from 'react-router-dom';
import { HoldButton } from '@/components/HoldButton';
import { useT } from '@/i18n';
import { statusOf, useApp } from '@/stores/app';
import { ISLANDS, STATIONS, stationById } from '@/data/stations';
import { nextStation } from '@/data/world';
import { courseById, courseOfStation, neighbourCourse } from '@/data/courses';
import { CoursePicker } from '@/components/CoursePicker';
import { Mascot, MascotSays } from '@/components/Mascot';
import { APP_NAME } from '@/config';

/**
 * Home: one clear thing to do (the big coloured card), the school year you are working at with "easier / harder",
 * and the five islands with how much of each is lit. A first-time pupil chooses their school year (or takes the short
 * check) instead of being dropped into a test.
 */
export default function Home() {
  const { t, m } = useT();
  const s = useApp();
  const nav = useNavigate();
  if (!s.lang) return <Navigate to="/idioma" replace />;
  if (!s.role) return <Navigate to="/quien" replace />;
  const fresh = !s.last && !s.suggested && Object.keys(s.progress).length === 0;
  const pupil = s.active ? s.pupils[s.active] : undefined;

  const goCourse = (id: string) => {
    const c = courseById(id)!;
    s.set({ course: id, suggested: c.start, last: null });
    return c.start;
  };

  const header = (
    <header className="flex items-center gap-3 pt-2">
      <img src="./favicon.svg" alt="" className="w-11 h-11" />
      <div className="flex-1">
        <h1 className="text-2xl font-extrabold leading-none">{APP_NAME}</h1>
        <p className="text-sm text-[var(--color-muted)]">{t('tagline')}</p>
      </div>
      {pupil && <span className="chip !text-base" data-testid="who-now">{pupil.emoji} {pupil.alias}</span>}
    </header>
  );

  const deco = (
    <>
      {['3', '7', '½', '10', '+', '×', '0,5', '='].map((c, i) => (
        <span key={i} className="floaty" aria-hidden style={{ left: `${(i * 37) % 90}%`, top: `${8 + ((i * 53) % 80)}%`, fontSize: `${28 + ((i * 11) % 30)}px`, transform: `rotate(${(i % 2 ? -1 : 1) * (8 + i * 3)}deg)` }}>{c}</span>
      ))}
    </>
  );

  const footer = (
    <>
      <nav className="flex justify-center gap-4 text-sm pt-2">
        <Link to="/ajustes" className="underline">{t('settings')}</Link>
        <Link to="/privacidad" className="underline">{t('privacy')}</Link>
      </nav>
      <HoldButton onDone={() => nav('/adultos')} className="btn-ghost !min-h-10 text-sm mx-auto" testId="to-adults">🔑 {t('adults')} · {t('hold_open')}</HoldButton>
    </>
  );

  if (fresh) {
    return (
      <main className="min-h-dvh max-w-md mx-auto px-5 py-6 flex flex-col gap-4 world-bg deco">
        {deco}{header}
        <MascotSays mood="wave" size={84}><span className="text-lg">{t('mascot_hello')}</span></MascotSays>
        <section className="card space-y-3" data-testid="course-pick">
          <h2 className="text-xl font-extrabold text-center">{t('course_q')}</h2>
          <CoursePicker value={s.course} onPick={(id) => nav(`/estacion/${goCourse(id)}`)} />
          <p className="text-sm text-[var(--color-muted)] text-center">{t('course_note')}</p>
          <Link to="/punto-de-partida" className="btn btn-ghost w-full !border-dashed" data-testid="start">🧭 {t('course_unsure')}</Link>
        </section>
        <div className="flex-1" />
        {footer}
      </main>
    );
  }

  const nextId = nextStation(s.progress, s.suggested, s.last);
  const next = stationById(nextId)!;
  const isl = ISLANDS.find((i) => i.id === next.island)!;
  const level = courseOfStation(nextId);
  const easier = neighbourCourse(level.id, -1);
  const harder = neighbourCourse(level.id, 1);
  const wentBack = !!s.wentBack && s.wentBack !== nextId;
  const days = Math.min(2, s.progress[nextId]?.goodDays.length ?? 0);

  return (
    <main className="min-h-dvh max-w-md mx-auto px-5 py-6 flex flex-col gap-4 world-bg deco">
      {deco}{header}
      <MascotSays mood={wentBack ? 'think' : 'happy'} size={72}>{wentBack ? t('went_back') : t('next_is', { s: m(next.title) })}</MascotSays>

      <Link to={`/estacion/${next.id}`} className="hero-card block" data-island={next.island} data-testid="carry-on">
        <div className="flex items-center gap-3">
          <span className="text-4xl" aria-hidden>{isl.emoji}</span>
          <div className="flex-1">
            <p className="text-sm font-semibold opacity-90">{t(isl.title)}</p>
            <p className="text-2xl font-extrabold leading-tight">{m(next.title)}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg" aria-label={`${days}/2`}>{days >= 1 ? '★' : '☆'}{days >= 2 ? '★' : '☆'}</span>
          <span className="rounded-full bg-white/90 text-[#262A40] px-5 py-2 text-xl font-extrabold">{t('carry_on')} ▶</span>
        </div>
      </Link>

      <section className="card !p-3 space-y-2" data-testid="level">
        <p className="text-center font-bold">{t('level_now', { c: t(`course_${level.id}`) })}</p>
        <div className="grid grid-cols-2 gap-2">
          <button className="btn btn-ghost !min-h-12" disabled={!easier} data-testid="easier" onClick={() => easier && nav(`/estacion/${goCourse(easier.id)}`)}>◀ {t('easier')}</button>
          <button className="btn btn-ghost !min-h-12" disabled={!harder} data-testid="harder" onClick={() => harder && nav(`/estacion/${goCourse(harder.id)}`)}>{t('harder')} ▶</button>
        </div>
      </section>

      <section className="grid grid-cols-5 gap-2" aria-label={t('lit_title')}>
        {ISLANDS.map((i) => {
          const st = STATIONS.filter((x) => x.island === i.id);
          const done = st.filter((x) => statusOf(s.progress[x.id]) === 'done').length;
          return (
            <Link key={i.id} to="/estaciones" data-island={i.id} className="tile !p-2 text-center flex flex-col items-center gap-1" aria-label={`${t(i.title)}: ${done}/${st.length}`}>
              <span className="text-2xl" aria-hidden>{i.emoji}</span>
              <span className="text-xs font-extrabold" style={{ color: 'var(--isl)' }}>{done}/{st.length}</span>
              <span className="tile-bar w-full"><i style={{ width: `${(done / st.length) * 100}%` }} /></span>
            </Link>
          );
        })}
      </section>

      <div className="grid grid-cols-2 gap-2">
        <Link to="/mapa" className="tile flex items-center gap-2 font-bold" data-island="A" data-testid="to-world"><span aria-hidden className="text-2xl">📏</span>{t('my_line')}</Link>
        <Link to="/progreso" className="tile flex items-center gap-2 font-bold" data-island="D"><Mascot size={30} /> {t('lit_title')}</Link>
      </div>
      <div className="flex-1" />
      {footer}
    </main>
  );
}
