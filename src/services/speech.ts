import type { Lang } from '@/engine/types';
import { speakable } from '@/i18n';
import { useApp } from '@/stores/app';
import { synth, type Sex } from './tts';

/** Reading aloud happens only when 🔊 is pressed, always with the same voice (the chosen female or male voice),
 *  never with the device's own voice. Long texts are read sentence by sentence: the next sentence is prepared
 *  while the current one plays, so the first words are heard soon. */
export const sexFor = (lang: Lang): Sex => (useApp.getState().voices?.[lang] === 'm' ? 'm' : 'f');

function sentences(text: string): string[] {
  // Short pieces: the first one is ready sooner, so the voice starts quickly even on a modest phone.
  return text.split(/(?<=[.!?…:;])\s+(?=\S)/u)
    .flatMap((x) => (x.length > 70 ? x.split(/(?<=,)\s+(?=\S)/u) : [x]))
    .map((x) => x.trim()).filter((x) => /[\p{L}\d]/u.test(x));
}

let run = 0;
let current: HTMLAudioElement | null = null;

function play(blob: Blob, my: number): Promise<void> {
  return new Promise((resolve) => {
    if (my !== run) return resolve();
    const url = URL.createObjectURL(blob);
    const a = new Audio(url);
    current = a;
    const end = () => { if (current === a) current = null; URL.revokeObjectURL(url); resolve(); };
    a.onended = end; a.onerror = end; a.onpause = () => { if (my !== run) end(); };
    a.play().catch(end);
  });
}

export async function speak(lang: Lang, text: string | string[], sex: Sex = sexFor(lang)): Promise<void> {
  const my = ++run;
  stopAudio();
  const parts = (Array.isArray(text) ? text : [text]).flatMap((t) => sentences(speakable(lang, t)));
  let next: Promise<Blob | null> | null = parts.length ? synth(lang, sex, parts[0]).catch(() => null) : null;
  for (let i = 0; i < parts.length && my === run; i++) {
    const blob = await next;
    next = i + 1 < parts.length ? synth(lang, sex, parts[i + 1]).catch(() => null) : null;
    if (blob && my === run) await play(blob, my);
  }
}

function stopAudio() { if (current) { current.pause(); current.src = ''; current = null; } }
export function stopSpeech() { run++; stopAudio(); }
