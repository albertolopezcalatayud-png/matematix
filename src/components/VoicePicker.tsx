import { useEffect, useRef, useState } from 'react';
import { useT } from '@/i18n';
import { useApp } from '@/stores/app';
import { sampleUrl, voicesIndex, type VoiceInfo } from '@/services/clips';
import { speak } from '@/services/speech';

/** Two natural voices per language + the device's own voice; each with a "listen" sample. Credits below (licences). */
export function VoicePicker() {
  const { t, lang } = useT();
  const voices = useApp((s) => s.voices);
  const set = useApp((s) => s.set);
  const [list, setList] = useState<VoiceInfo[] | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  useEffect(() => { void voicesIndex().then((ix) => setList(ix[lang] ?? [])); }, [lang]);
  const chosen = voices?.[lang] ?? (list?.[0]?.id ?? 'device');
  const choose = (id: string) => set({ voices: { ...voices, [lang]: id } });
  const listen = (id: string) => {
    audio.current?.pause();
    if (id === 'device') { void speak(lang, t('voice_sample')); return; }
    audio.current = new Audio(sampleUrl(lang, id)); void audio.current.play().catch(() => {});
  };
  const opts = [...(list ?? []).map((v) => ({ id: v.id, name: v.name })), { id: 'device', name: t('voice_device') }];
  return (
    <div className="py-2 space-y-2" data-testid="voice-picker">
      <span>{t('voice_pick')}</span>
      {list === null ? <p className="text-sm text-[var(--color-muted)]">…</p> : (
        <div className="space-y-2">
          {opts.map((o) => (
            <div key={o.id} className="flex gap-2">
              <button className={`btn flex-1 ${chosen === o.id ? 'btn-primary' : 'btn-ghost'}`} aria-pressed={chosen === o.id} onClick={() => choose(o.id)}>{o.name}</button>
              <button className="btn btn-ghost !px-3" aria-label={`${t('listen')}: ${o.name}`} onClick={() => listen(o.id)}>🔊</button>
            </div>
          ))}
          {list.length === 0 && <p className="text-sm text-[var(--color-muted)]">{t('voice_soon')}</p>}
        </div>
      )}
    </div>
  );
}

export function VoiceCredits() {
  const { t } = useT();
  const [all, setAll] = useState<VoiceInfo[]>([]);
  useEffect(() => { void voicesIndex().then((ix) => setAll([...(ix.es ?? []), ...(ix.ca ?? []), ...(ix.en ?? [])])); }, []);
  return (
    <details className="card">
      <summary className="font-extrabold cursor-pointer">📜 {t('credits')}</summary>
      <ul className="mt-2 space-y-1 text-sm">
        <li>{t('credits_font')}</li>
        {all.map((v) => <li key={v.id}>{v.credit}</li>)}
        <li>{t('credits_device')}</li>
      </ul>
    </details>
  );
}
