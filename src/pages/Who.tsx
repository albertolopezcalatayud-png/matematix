import { Link, useNavigate } from 'react-router-dom';
import { useT } from '@/i18n';
import { useApp, type Role } from '@/stores/app';
import { HoldButton } from '@/components/HoldButton';
import { MascotSays } from '@/components/Mascot';
import { APP_NAME } from '@/config';

const LANG_NAME = { es: 'Castellano', ca: 'Valencià', en: 'English' } as const;

/** First screen: who is going to use the app on this device. It opens in castellano; the language can be changed
 *  from the small button at the top or later in Settings. Children go straight in; adults hold a button for 3 seconds. */
export default function Who() {
  const { t } = useT();
  const nav = useNavigate();
  const set = useApp((s) => s.set);
  const lang = useApp((s) => s.lang) ?? 'es';
  const choose = (role: Role) => { set({ role }); nav(role === 'pupil' ? '/' : '/adultos', { replace: true }); };
  const adult = (role: Role, icon: string, island: string) => (
    <HoldButton key={role} onDone={() => choose(role)} className="tile w-full !justify-start !text-left !min-h-20" testId={`who-${role}`}>
      <span className="flex items-center gap-3" data-island={island}><span aria-hidden className="text-3xl">{icon}</span>
        <span><span className="block font-extrabold" style={{ color: 'var(--isl)' }}>{t(`who_${role}`)}</span><span className="block text-sm font-normal text-[var(--color-muted)]">{t(`who_${role}_d`)}</span></span></span>
    </HoldButton>
  );
  return (
    <main className="min-h-dvh max-w-md mx-auto px-5 py-6 flex flex-col gap-4 world-bg deco">
      {['3', '+', '½', '7', '×', '10'].map((c, i) => (
        <span key={i} className="floaty" aria-hidden style={{ left: `${(i * 41) % 88}%`, top: `${10 + ((i * 57) % 78)}%`, fontSize: `${30 + ((i * 13) % 28)}px` }}>{c}</span>
      ))}
      <header className="flex items-center gap-3">
        <img src="./favicon.svg" alt="" className="w-11 h-11" />
        <div className="flex-1"><h1 className="text-2xl font-extrabold leading-none">{APP_NAME}</h1><p className="text-sm text-[var(--color-muted)]">{t('tagline')}</p></div>
        <Link to="/idioma" className="chip !text-sm" data-testid="change-lang" aria-label={t('lang_title')}>🌐 {LANG_NAME[lang]}</Link>
      </header>
      <MascotSays mood="wave" size={92}><span className="text-lg">{t('who_hello')}</span></MascotSays>
      <h2 className="text-xl font-extrabold text-center mt-2">{t('who_title')}</h2>
      <button className="hero-card w-full text-left" data-island="A" onClick={() => choose('pupil')} data-testid="who-pupil">
        <span className="flex items-center gap-3"><span aria-hidden className="text-5xl">🧒</span>
          <span className="flex-1"><span className="block text-2xl font-extrabold">{t('who_pupil')}</span><span className="block text-sm opacity-90">{t('who_pupil_d')}</span></span>
          <span className="rounded-full bg-white/90 text-[#262A40] px-4 py-2 text-xl font-extrabold" aria-hidden>▶</span></span>
      </button>
      <section className="card !p-3 space-y-2" aria-labelledby="h-adults">
        <h3 id="h-adults" className="font-extrabold">🔑 {t('who_adults')}</h3>
        <p className="text-sm text-[var(--color-muted)]">{t('hold_why')}</p>
        {adult('teacher', '🍎', 'B')}{adult('pt', '🧩', 'C')}{adult('family', '🏡', 'D')}
      </section>
    </main>
  );
}
