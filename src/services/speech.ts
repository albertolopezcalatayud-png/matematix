import type { Lang } from '@/engine/types';
import { HTML_LANG, speakable } from '@/i18n';

// For 0.1 the device voice. The natural pre-recorded voices (as in Lectorix) come later; the call stays the same.
let voices: SpeechSynthesisVoice[] = [];
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  const load = () => { voices = window.speechSynthesis.getVoices(); };
  load();
  window.speechSynthesis.addEventListener?.('voiceschanged', load);
}

function pick(lang: Lang): SpeechSynthesisVoice | undefined {
  const want = { es: ['es-ES', 'es'], ca: ['ca-ES', 'ca', 'es-ES'], en: ['en-GB', 'en'] }[lang];
  for (const w of want) { const v = voices.find((x) => x.lang.replace('_', '-').toLowerCase().startsWith(w.toLowerCase())); if (v) return v; }
  return undefined;
}

export function speak(lang: Lang, text: string): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return resolve();
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(speakable(lang, text));
    const v = pick(lang);
    if (v) u.voice = v;
    u.lang = v?.lang ?? HTML_LANG[lang];
    u.rate = 0.9;
    u.onend = () => resolve();
    u.onerror = () => resolve();
    window.speechSynthesis.speak(u);
  });
}
export const stopSpeech = () => { if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel(); };
