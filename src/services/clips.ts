import type { Lang } from '@/engine/types';
import { clipKey, clipText } from './clipKey';
import { useApp } from '@/stores/app';

/**
 * Natural voices: pre-generated clips (scripts/audio, branch "audio", served at <site>/audio/). A clip is fetched the
 * first time it is needed and the service worker keeps it, so it then works offline; nobody downloads what they
 * never hear. If there is no clip for a text (word problems with names and numbers), the device's voice reads it.
 */
const REMOTE = 'https://albertolopezcalatayud-png.github.io/matematix/audio/';
const base = () => (location.hostname.endsWith('github.io') || location.hostname === 'localhost' ? `${import.meta.env.BASE_URL}audio/` : REMOTE);

export interface VoiceInfo { id: string; name: string; license: string; credit: string }
let index: Promise<Record<Lang, VoiceInfo[]>> | null = null;
export function voicesIndex(): Promise<Record<Lang, VoiceInfo[]>> {
  index ??= fetch(`${base()}voices.json`).then((r) => (r.ok ? r.json() : { es: [], ca: [], en: [] })).catch(() => ({ es: [], ca: [], en: [] }));
  return index;
}

/** The voice in use for a language: the child's choice, else the first one ready; null = the device's voice. */
export async function voiceFor(lang: Lang): Promise<string | null> {
  const chosen = useApp.getState().voices?.[lang];
  if (chosen === 'device') return null;
  const list = (await voicesIndex())[lang] ?? [];
  return list.find((v) => v.id === chosen)?.id ?? list[0]?.id ?? null;
}

const manifests = new Map<string, Promise<Set<string>>>();
function manifest(lang: Lang, voice: string): Promise<Set<string>> {
  const k = `${lang}/${voice}`;
  if (!manifests.has(k)) manifests.set(k, fetch(`${base()}${k}/manifest.json`).then(async (r) => new Set(r.ok ? Object.keys((await r.json()).items ?? {}) : [])).catch(() => new Set<string>()));
  return manifests.get(k)!;
}

let current: HTMLAudioElement | null = null;
export function stopClip() { if (current) { current.pause(); current.src = ''; current = null; } }

/** Plays the natural-voice clip of exactly this text. Resolves true when it played, false if there is none. */
export async function playClip(lang: Lang, text: string): Promise<boolean> {
  const voice = await voiceFor(lang); if (!voice) return false;
  const key = clipKey(lang, clipText(text));
  if (!(await manifest(lang, voice)).has(key)) return false;
  return new Promise((resolve) => {
    stopClip();
    const a = new Audio(`${base()}${lang}/${voice}/${key}.mp3`);
    current = a;
    a.onended = () => { if (current === a) current = null; resolve(true); };
    a.onerror = () => { if (current === a) current = null; resolve(false); };
    a.play().catch(() => resolve(false));
  });
}

export function sampleUrl(lang: Lang, voice: string) { return `${base()}${lang}/${voice}/sample.mp3`; }
