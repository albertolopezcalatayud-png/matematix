import type { Lang } from '@/engine/types';
import { clipKey, clipText } from './clipKey';
import { useApp } from '@/stores/app';
import { Capacitor } from '@capacitor/core';

/**
 * Natural voices: pre-generated clips (scripts/audio, branch "audio", served at <site>/audio/). A clip is fetched the
 * first time it is needed and the service worker keeps it, so it then works offline; nobody downloads what they
 * never hear. If there is no clip for a text (word problems with names and numbers), the device's voice reads it.
 */
const REMOTE = 'https://albertolopezcalatayud-png.github.io/matematix/audio/';
const NATIVE = Capacitor.isNativePlatform();
const base = () => (!NATIVE && (location.hostname.endsWith('github.io') || location.hostname === 'localhost') ? `${import.meta.env.BASE_URL}audio/` : REMOTE);

/** Index files: from the network when there is one, else the last copy kept on this device. */
async function getJson<T>(url: string, empty: T): Promise<T> {
  const cache = 'caches' in window ? await caches.open('mx-audio-index').catch(() => null) : null;
  try {
    const r = await fetch(url, { cache: 'no-cache' });
    if (r.ok && (r.headers.get('content-type') ?? '').includes('json')) {
      const copy = r.clone();
      const data = (await r.json()) as T;
      void cache?.put(url, copy).catch(() => {});
      return data;
    }
  } catch { /* offline, or not there yet */ }
  try {
    const kept = await cache?.match(url);
    return kept ? ((await kept.json()) as T) : empty;
  } catch { return empty; }
}

/** A clip: kept on this device after the first time it is heard (the Android app has no service worker). */
async function clipSrc(url: string): Promise<string> {
  if (!NATIVE || !('caches' in window)) return url;
  try {
    const cache = await caches.open('mx-audio');
    let r = await cache.match(url);
    if (!r) { const f = await fetch(url); if (!f.ok) return url; await cache.put(url, f.clone()); r = f; }
    return URL.createObjectURL(await r.blob());
  } catch { return url; }
}

export interface VoiceInfo { id: string; name: string; license: string; credit: string }
let index: Promise<Record<Lang, VoiceInfo[]>> | null = null;
export function voicesIndex(): Promise<Record<Lang, VoiceInfo[]>> {
  index ??= getJson<Record<Lang, VoiceInfo[]>>(`${base()}voices.json`, { es: [], ca: [], en: [] });
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
  if (!manifests.has(k)) manifests.set(k, getJson<{ items?: Record<string, unknown> }>(`${base()}${k}/manifest.json`, {}).then((j) => new Set(Object.keys(j.items ?? {}))));
  return manifests.get(k)!;
}

let current: HTMLAudioElement | null = null;
export function stopClip() { if (current) { current.pause(); current.src = ''; current = null; } }

/** Plays the natural-voice clip of exactly this text. Resolves true when it played, false if there is none. */
export async function playClip(lang: Lang, text: string): Promise<boolean> {
  const voice = await voiceFor(lang); if (!voice) return false;
  const key = clipKey(lang, clipText(text));
  if (!(await manifest(lang, voice)).has(key)) return false;
  const src = await clipSrc(`${base()}${lang}/${voice}/${key}.mp3`);
  return new Promise((resolve) => {
    stopClip();
    const a = new Audio(src);
    current = a;
    a.onended = () => { if (current === a) current = null; if (src.startsWith('blob:')) URL.revokeObjectURL(src); resolve(true); };
    a.onerror = () => { if (current === a) current = null; resolve(false); };
    a.play().catch(() => resolve(false));
  });
}

export function sampleUrl(lang: Lang, voice: string) { return `${base()}${lang}/${voice}/sample.mp3`; }
