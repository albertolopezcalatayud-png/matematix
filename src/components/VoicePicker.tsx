import { useT } from '@/i18n';
import { useApp } from '@/stores/app';
import { speak, sexFor } from '@/services/speech';
import { useTts, VOICES, type Sex } from '@/services/tts';

/** One female and one male voice per language, each with a "listen" button. The same voice reads everything. */
export function VoicePicker() {
  const { t, lang } = useT();
  const voices = useApp((s) => s.voices);
  const set = useApp((s) => s.set);
  const chosen = voices?.[lang] === 'm' ? 'm' : sexFor(lang);
  const choose = (x: Sex) => set({ voices: { ...voices, [lang]: x } });
  return (
    <div className="py-2 space-y-2" data-testid="voice-picker">
      <span>{t('voice_pick')}</span>
      {(['f', 'm'] as Sex[]).map((x) => (
        <div key={x} className="flex gap-2">
          <button className={`btn flex-1 ${chosen === x ? 'btn-primary' : 'btn-ghost'}`} aria-pressed={chosen === x} onClick={() => choose(x)} data-testid={`voice-${x}`}>
            {t(`voice_${x}`)} · {VOICES[lang][x].name}
          </button>
          <button className="btn btn-ghost !px-3" aria-label={`${t('listen')}: ${t(`voice_${x}`)}`} onClick={() => void speak(lang, t('voice_sample'), x)}>🔊</button>
        </div>
      ))}
      <p className="text-sm text-[var(--color-muted)]">{t('voice_note')}</p>
    </div>
  );
}

/** Shown while a voice downloads the first time, or if it could not be downloaded. */
export function VoiceStatus() {
  const { t } = useT();
  const { loading, error } = useTts();
  if (loading === null && !error) return null;
  return (
    <div role="status" aria-live="polite" className="fixed left-1/2 -translate-x-1/2 bottom-24 z-50 card !py-2 !px-4 text-sm font-semibold shadow-lg max-w-[90vw] text-center" data-testid="voice-status">
      {loading !== null ? t('tts_loading', { p: Math.round(loading * 100) }) : t('tts_error')}
      {error && <button className="ml-3 underline" onClick={() => useTts.setState({ error: false })} aria-label="OK">✕</button>}
    </div>
  );
}

export function VoiceCredits() {
  const { t } = useT();
  const all = (['es', 'ca', 'en'] as const).flatMap((l) => [VOICES[l].f, VOICES[l].m]);
  return (
    <details className="card">
      <summary className="font-extrabold cursor-pointer">📜 {t('credits')}</summary>
      <ul className="mt-2 space-y-1 text-sm">
        <li>{t('credits_font')}</li>
        {all.map((v) => <li key={v.file}>{v.credit}</li>)}
        <li>ONNX Runtime Web (Microsoft), MIT · piper-phonemize / espeak-ng, GPL-3.0</li>
        <li>{t('credits_device')}</li>
      </ul>
    </details>
  );
}
