import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useT } from '@/i18n';
import { today, useApp } from '@/stores/app';

export function TopBar({ title, back = '/mapa', gear = true }: { title: string; back?: string; gear?: boolean }) {
  const { t } = useT();
  const nav = useNavigate();
  return (
    <header className="sticky top-0 z-10 bg-[var(--color-bg)]/95 backdrop-blur border-b border-[var(--color-border)] mb-4">
      <div className="max-w-xl mx-auto px-4 h-14 flex items-center gap-2">
        <button className="btn btn-ghost !min-h-10 !px-3" onClick={() => nav(back)} aria-label={t('back')}>←</button>
        <h1 className="flex-1 text-lg font-extrabold truncate">{title}</h1>
        {gear && <Link to="/ajustes" className="btn btn-ghost !min-h-10 !px-3" aria-label={t('settings')}>⚙️</Link>}
      </div>
    </header>
  );
}

/** Counts practice minutes while the screen is visible and offers a break every 15 minutes (can be turned off). */
export function RestReminder() {
  const { t } = useT();
  const add = useApp((s) => s.addMinutes);
  const on = useApp((s) => s.rest);
  const mins = useApp((s) => s.minutes[today()] ?? 0);
  const [dismissedAt, setDismissedAt] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => { if (document.visibilityState === 'visible') add(1); }, 60_000);
    return () => window.clearInterval(id);
  }, [add]);
  const due = on && mins >= 15 && Math.floor(mins / 15) * 15 > dismissedAt;
  if (!due) return null;
  return (
    <div className="max-w-xl mx-auto px-4 mb-3" role="status">
      <div className="card !bg-[var(--color-yellow-pale)] flex items-center gap-3">
        <span aria-hidden className="text-2xl">🌿</span>
        <p className="flex-1 text-base">{t('rest', { m: Math.floor(mins / 15) * 15 })}</p>
        <button className="btn btn-ghost !min-h-10" onClick={() => setDismissedAt(Math.floor(mins / 15) * 15)}>{t('rest_ok')}</button>
      </div>
    </div>
  );
}
