import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '@/i18n';
import { useApp } from '@/stores/app';
import { TopBar } from '@/components/Layout';
import { APP_NAME, APP_VERSION } from '@/config';
import { VoiceCredits, VoicePicker } from '@/components/VoicePicker';

function Toggle({ label, value, onChange, id }: { label: string; value: boolean; onChange: (v: boolean) => void; id: string }) {
  return (
    <label className="flex items-center gap-3 py-2 cursor-pointer" htmlFor={id}>
      <span className="flex-1">{label}</span>
      <input id={id} type="checkbox" role="switch" className="w-6 h-6 accent-[var(--color-accent)]" checked={value} onChange={(e) => onChange(e.target.checked)} />
    </label>
  );
}

export default function Settings() {
  const { t } = useT();
  const s = useApp();
  const [confirm, setConfirm] = useState(false);
  return (
    <div className="min-h-dvh pb-10">
      <TopBar title={t('settings')} back="/" />
      <main className="max-w-xl mx-auto px-4 space-y-4">
        <section className="card">
          <div className="flex items-center gap-3 py-2">
            <span className="flex-1">{t('set_lang')}</span>
            <Link to="/idioma" className="btn btn-ghost !min-h-10">{s.lang === 'ca' ? 'Valencià' : s.lang === 'en' ? 'English (UK)' : 'Castellano'}</Link>
          </div>
          <Toggle id="voice" label={t('set_voice')} value={s.voice} onChange={(v) => s.set({ voice: v })} />
          {s.voice && <VoicePicker />}
          <Toggle id="size" label={t('set_size')} value={s.large} onChange={(v) => s.set({ large: v })} />
          <Toggle id="motion" label={t('set_motion')} value={s.motion === 'reduce'} onChange={(v) => s.set({ motion: v ? 'reduce' : 'auto' })} />
          <Toggle id="rest" label={t('set_rest')} value={s.rest} onChange={(v) => s.set({ rest: v })} />
          <div className="py-2 space-y-2">
            <span>{t('set_theme')}</span>
            <div className="grid grid-cols-3 gap-2">
              {(['auto', 'light', 'dark'] as const).map((th) => (
                <button key={th} className={`btn ${s.theme === th ? 'btn-primary' : 'btn-ghost'} !px-2 text-sm`} onClick={() => s.set({ theme: th })}>{t(`theme_${th}`)}</button>
              ))}
            </div>
          </div>
        </section>
        <section className="card space-y-2">
          <h2 className="font-extrabold">🔒 {t('privacy')}</h2>
          <p className="text-base">{t('privacy_text')}</p>
          {!confirm ? (
            <button className="btn btn-ghost w-full" onClick={() => setConfirm(true)}>{t('set_reset')}</button>
          ) : (
            <div className="space-y-2">
              <p className="font-semibold">{t('set_reset_confirm')}</p>
              <div className="grid grid-cols-2 gap-2">
                <button className="btn btn-ghost" onClick={() => setConfirm(false)}>{t('no')}</button>
                <button className="btn btn-primary" onClick={() => { s.reset(); setConfirm(false); }}>{t('yes')}</button>
              </div>
            </div>
          )}
        </section>
        <VoiceCredits />
        <p className="text-center text-xs text-[var(--color-muted)]">{APP_NAME} {APP_VERSION}</p>
      </main>
    </div>
  );
}
