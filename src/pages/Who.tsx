import { useNavigate } from 'react-router-dom';
import { useT } from '@/i18n';
import { useApp, type Role } from '@/stores/app';
import { HoldButton } from '@/components/HoldButton';
import { APP_NAME } from '@/config';

/** First screen after the language: who is going to use the app on this device. Children go straight in;
 *  adults hold a button for 3 seconds. It can be changed later from the adults' area. */
export default function Who() {
  const { t } = useT();
  const nav = useNavigate();
  const set = useApp((s) => s.set);
  const choose = (role: Role) => { set({ role }); nav(role === 'pupil' ? '/' : '/adultos', { replace: true }); };
  const adult = (role: Role, icon: string) => (
    <HoldButton key={role} onDone={() => choose(role)} className="btn-ghost w-full !justify-start !text-left !min-h-20 !rounded-3xl" testId={`who-${role}`}>
      <span className="flex items-center gap-3"><span aria-hidden className="text-3xl">{icon}</span>
        <span><span className="block font-extrabold">{t(`who_${role}`)}</span><span className="block text-sm font-normal text-[var(--color-muted)]">{t(`who_${role}_d`)}</span></span></span>
    </HoldButton>
  );
  return (
    <main className="min-h-dvh max-w-md mx-auto px-5 py-8 space-y-4 world-bg">
      <div className="text-center py-4"><img src="./favicon.svg" alt="" className="w-14 h-14 mx-auto" /><h1 className="text-3xl font-extrabold mt-2">{APP_NAME}</h1></div>
      <h2 className="text-xl font-extrabold text-center">{t('who_title')}</h2>
      <button className="btn btn-primary w-full !justify-start !text-left !min-h-24 !rounded-3xl" onClick={() => choose('pupil')} data-testid="who-pupil">
        <span className="flex items-center gap-3"><span aria-hidden className="text-4xl">🧒</span>
          <span><span className="block text-xl font-extrabold">{t('who_pupil')}</span><span className="block text-sm font-normal opacity-90">{t('who_pupil_d')}</span></span></span>
      </button>
      <p className="text-sm text-center text-[var(--color-muted)]">{t('hold_why')}</p>
      {adult('teacher', '🍎')}{adult('pt', '🧩')}{adult('family', '🏡')}
    </main>
  );
}
