import { Link, useNavigate } from 'react-router-dom';
import { useT } from '@/i18n';
import { useApp } from '@/stores/app';
import { TopBar } from '@/components/Layout';

const SECTIONS = {
  pupils: { to: '/adultos/alumnos', icon: '🧩' },
  sheets: { to: '/adultos/fichas', icon: '📝' },
  board: { to: '/adultos/pizarra', icon: '🧑‍🏫' },
  cert: { to: '/adultos/certificado', icon: '🏅' },
  guide: { to: '/adultos/guia', icon: '📘' },
  home: { to: '/adultos/casa', icon: '🏡' },
} as const;
type Sec = keyof typeof SECTIONS;
const ORDER: Record<string, Sec[]> = {
  teacher: ['sheets', 'board', 'cert', 'guide', 'pupils', 'home'],
  pt: ['pupils', 'sheets', 'guide', 'board', 'cert', 'home'],
  family: ['home', 'cert', 'sheets', 'guide', 'board', 'pupils'],
};

/** The adults' area: what each role needs first, everything else one tap further. No accounts and no data leaving the device. */
export default function Hub() {
  const { t } = useT();
  const nav = useNavigate();
  const role = useApp((s) => s.role) ?? 'teacher';
  const active = useApp((s) => s.active);
  const pupils = useApp((s) => s.pupils);
  const set = useApp((s) => s.set);
  const who = active && pupils[active] ? `${pupils[active].emoji} ${pupils[active].alias}` : null;
  return (
    <div className="min-h-dvh pb-10">
      <TopBar title={t('hub_title')} back="/" />
      <main className="max-w-xl mx-auto px-4 space-y-4">
        <p className="rounded-2xl p-3 bg-[var(--color-mint-pale)] text-base">🔒 {t('hub_note')}</p>
        <div className="grid gap-2" data-testid="hub">
          {(ORDER[role] ?? ORDER.teacher).map((k) => (
            <Link key={k} to={SECTIONS[k].to} className="card flex items-center gap-3 !py-4 hover:border-[var(--color-accent)]" data-testid={`hub-${k}`}>
              <span aria-hidden className="text-2xl">{SECTIONS[k].icon}</span><span className="font-bold flex-1">{t(`sec_${k}`)}</span><span aria-hidden>›</span>
            </Link>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button className="btn btn-primary" onClick={() => nav('/')} data-testid="to-child">{who ? t('p_back_child', { a: who }) : t('try_as_pupil')}</button>
          <button className="btn btn-ghost" onClick={() => { set({ role: null }); nav('/quien'); }}>{t('change_role')}</button>
        </div>
      </main>
    </div>
  );
}
