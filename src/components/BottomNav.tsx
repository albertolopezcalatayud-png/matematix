import { NavLink, useLocation } from 'react-router-dom';
import { useT } from '@/i18n';

/** The four places of the app, always at the bottom (like most apps children already know). */
export function BottomNav() {
  const { t } = useT();
  const { pathname } = useLocation();
  const items = [
    { to: '/', icon: '🏠', label: t('nav_home'), id: 'home' },
    { to: '/temas', icon: '📚', label: t('nav_topics'), id: 'topics' },
    { to: '/progreso', icon: '⭐', label: t('lit_title'), id: 'progress' },
    { to: '/ajustes', icon: '⚙️', label: t('settings'), id: 'settings' },
  ];
  return (
    <nav className="bottom-nav" aria-label="Matematix">
      {items.map((x) => (
        <NavLink key={x.to} to={x.to} end={x.to === '/'} data-testid={`nav-${x.id}`} className={({ isActive }) => (isActive || (x.id === 'topics' && pathname.startsWith('/tema')) ? 'on' : '')}>
          <span aria-hidden className="text-xl leading-none">{x.icon}</span>
          <span>{x.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
