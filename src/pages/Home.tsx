import { Link, Navigate } from 'react-router-dom';
import { useT } from '@/i18n';
import { useApp } from '@/stores/app';
import { APP_NAME } from '@/config';

export default function Home() {
  const { t } = useT();
  const lang = useApp((s) => s.lang);
  const last = useApp((s) => s.last);
  if (!lang) return <Navigate to="/idioma" replace />;
  return (
    <main className="min-h-dvh flex flex-col max-w-md mx-auto px-5 py-8 gap-4">
      <div className="card text-center space-y-2 !bg-[var(--color-accent-pale)] !border-0 py-8">
        <img src="./favicon.svg" alt="" className="w-16 h-16 mx-auto" />
        <h1 className="text-4xl font-extrabold">{APP_NAME}</h1>
        <p className="text-lg">{t('tagline')}</p>
      </div>
      <Link to={last ? '/mapa' : '/punto-de-partida'} className="btn btn-primary text-lg" data-testid="start">{t('start')}</Link>
      {last && <Link to={`/estacion/${last}`} className="btn btn-ghost">{t('keep_going')}</Link>}
      <Link to="/progreso" className="btn btn-ghost">{t('my_progress')}</Link>
      <div className="flex-1" />
      <nav className="flex justify-center gap-4 text-sm">
        <Link to="/ajustes" className="underline">{t('settings')}</Link>
        <Link to="/privacidad" className="underline">{t('privacy')}</Link>
      </nav>
    </main>
  );
}
