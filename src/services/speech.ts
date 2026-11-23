import type { Lang } from '@/engine/types';
import { HTML_LANG, speakable } from '@/i18n';
import { playClip, stopClip } from './clips';
import { Capacitor } from '@capacitor/core';
import { TextToSpeech, QueueStrategy } from '@capacitor-community/text-to-speech';

// The Android app's WebView has no Web Speech API: there the device's voice is reached through a plugin.
const NATIVE = Capacitor.isNativePlatform();
const TTS_TAG: Record<Lang, string> = { es: 'es-ES', ca: 'ca-ES', en: 'en-GB' };

// The natural voice when there is a clip for the text, otherwise the device's voice. Several parts are read one
// after another (each part can have its own clip: "Nearly. Look at the hint…" + the hint).
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

async function nativeDevice(lang: Lang, text: string): Promise<void> {
  const limit = Math.max(8000, text.length * 200);
  await Promise.race([
    TextToSpeech.speak({ text: speakable(lang, text), lang: TTS_TAG[lang], rate: 0.9, pitch: 1, volume: 1, category: 'playback', queueStrategy: QueueStrategy.Flush }).catch(() => {}),
    new Promise((r) => setTimeout(r, limit)),
  ]);
}

function device(lang: Lang, text: string): Promise<void> {
  if (NATIVE) return nativeDevice(lang, text);
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return resolve();
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

let run = 0;
export async function speak(lang: Lang, text: string | string[]): Promise<void> {
  const my = ++run;
  stopSpeech(false);
  for (const part of Array.isArray(text) ? text : [text]) {
    if (my !== run || !part.trim()) continue;
    const played = await playClip(lang, part);
    if (!played && my === run) await device(lang, part);
  }
}
export function stopSpeech(bump = true) {
  if (bump) run++;
  stopClip();
  if (NATIVE) void TextToSpeech.stop().catch(() => {});
  else if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
}
