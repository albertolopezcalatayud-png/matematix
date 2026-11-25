import type { Lang } from '@/engine/types';
import { Capacitor } from '@capacitor/core';
import { create } from 'zustand';

/**
 * The app's own voice: a neural voice (Piper) that runs on the device, so every text — also exercises with numbers
 * that change every time — is read by the same voice. One female and one male voice per language. The voice is
 * downloaded the first time 🔊 is pressed (from <site>/tts/, branch "tts") and kept on the device: after that it
 * works without internet. Nothing is sent anywhere: the text is turned into sound on the device.
 */
export type Sex = 'f' | 'm';
interface VoiceDef { file: string; name: string; credit: string; sid?: number }
export const VOICES: Record<Lang, Record<Sex, VoiceDef>> = {
  es: {
    f: { file: 'es/sharvard', name: 'Sharvard', sid: 1, credit: 'Voz «sharvard» (hablante F) de Piper (rhasspy/piper-voices), corpus Sharvard, CC BY 3.0' },
    m: { file: 'es/davefx', name: 'Davefx', credit: 'Voz «davefx» de Piper (rhasspy/piper-voices), CC0' },
  },
  ca: {
    f: { file: 'ca/ona', name: 'Ona', credit: 'Veu «upc_ona» de Piper (rhasspy/piper-voices), corpus FestCat (UPC), CC BY-SA 3.0 ES' },
    m: { file: 'ca/pau', name: 'Pau', credit: 'Veu «upc_pau» de Piper (rhasspy/piper-voices), corpus FestCat (UPC), CC BY-SA 3.0 ES' },
  },
  en: {
    f: { file: 'en/alba', name: 'Alba', credit: 'Voice «alba» from Piper (rhasspy/piper-voices), dataset CC BY 4.0' },
    m: { file: 'en/alan', name: 'Alan', credit: 'Voice «alan» from Piper (rhasspy/piper-voices), dataset «apope» from Mycroft mimic3-voices (see its licence)' },
  },
};

const NATIVE = Capacitor.isNativePlatform();
const REMOTE = 'https://albertolopezcalatayud-png.github.io/matematix/tts/';
export const ttsBase = () => (!NATIVE && (location.hostname.endsWith('github.io') || location.hostname === 'localhost') ? `${import.meta.env.BASE_URL}tts/` : REMOTE);
const CACHE = 'mx-tts-1';

/** What the screen shows while a voice is being prepared the first time. */
export const useTts = create<{ loading: number | null; error: boolean }>(() => ({ loading: null, error: false }));

/** A file from the voice store: from this device if it was already downloaded, else from the network (and kept). */
async function getFile(path: string, progress?: (f: number) => void): Promise<ArrayBuffer> {
  const url = ttsBase() + path;
  const cache = 'caches' in window ? await caches.open(CACHE).catch(() => null) : null;
  const kept = await cache?.match(url).catch(() => undefined);
  if (kept) return kept.arrayBuffer();
  const r = await fetch(url);
  if (!r.ok || !r.body) throw new Error(`tts ${r.status} ${path}`);
  const total = Number(r.headers.get('content-length') ?? 0);
  const reader = r.body.getReader();
  const parts: BlobPart[] = [];
  let got = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    parts.push(value); got += value.length;
    if (progress && total) progress(got / total);
  }
  const blob = new Blob(parts);
  await cache?.put(url, new Response(blob, { headers: { 'content-type': 'application/octet-stream' } })).catch(() => {});
  return blob.arrayBuffer();
}

// ---- phonemes (espeak-ng compiled to WebAssembly, from piper-phonemize) ----
type PhonemizeModule = { callMain: (args: string[]) => void; FS: unknown };
type Factory = (opts: Record<string, unknown>) => Promise<PhonemizeModule>;
let factory: Promise<Factory> | null = null;
let phonemeData: Promise<[ArrayBuffer, ArrayBuffer]> | null = null;
function loadFactory(): Promise<Factory> {
  factory ??= new Promise<Factory>((resolve, reject) => {
    const w = window as unknown as { createPiperPhonemize?: Factory };
    if (w.createPiperPhonemize) return resolve(w.createPiperPhonemize);
    const s = document.createElement('script');
    s.src = ttsBase() + 'lib/piper_phonemize.js';
    s.onload = () => (w.createPiperPhonemize ? resolve(w.createPiperPhonemize) : reject(new Error('phonemizer')));
    s.onerror = () => { factory = null; reject(new Error('phonemizer')); };
    document.head.appendChild(s);
  });
  return factory;
}
async function phonemize(espeakVoice: string, text: string): Promise<number[]> {
  const make = await loadFactory();
  phonemeData ??= Promise.all([getFile('lib/piper_phonemize.wasm'), getFile('lib/piper_phonemize.data')]);
  const [wasm, data] = await phonemeData;
  return new Promise<number[]>((resolve, reject) => {
    let done = false;
    void make({
      wasmBinary: wasm,
      getPreloadedPackage: () => data,
      print: (line: string) => { if (!done) { done = true; try { resolve(JSON.parse(line).phoneme_ids as number[]); } catch (e) { reject(e); } } },
      printErr: () => {},
      locateFile: (f: string) => ttsBase() + 'lib/' + f,
    }).then((m) => {
      m.callMain(['-l', espeakVoice, '--input', JSON.stringify([{ text }]), '--espeak_data', '/espeak-ng-data']);
      if (!done) reject(new Error('no phonemes'));
    }, reject);
  });
}

// ---- the neural voice (ONNX Runtime Web, one thread: works without special server headers) ----
type Ort = typeof import('onnxruntime-web');
let ortP: Promise<Ort> | null = null;
function ort(): Promise<Ort> {
  ortP ??= import('onnxruntime-web').then((o) => {
    o.env.wasm.numThreads = 1;
    o.env.wasm.proxy = false;
    o.env.wasm.wasmPaths = ttsBase() + 'lib/';
    return o;
  });
  return ortP;
}
interface Loaded { session: import('onnxruntime-web').InferenceSession; cfg: PiperConfig }
interface PiperConfig { audio: { sample_rate: number }; espeak: { voice: string }; inference: { noise_scale: number; length_scale: number; noise_w: number }; speaker_id_map?: Record<string, number> }
const loaded = new Map<string, Promise<Loaded>>();

/** Gets a voice ready (downloading it the first time, with progress on screen). */
export function loadVoice(lang: Lang, sex: Sex): Promise<Loaded> {
  const v = VOICES[lang][sex];
  if (!loaded.has(v.file)) {
    const p = (async () => {
      useTts.setState({ loading: 0, error: false });
      try {
        const o = await ort();
        const cfg = JSON.parse(new TextDecoder().decode(await getFile(`${v.file}.onnx.json`))) as PiperConfig;
        await loadFactory();
        const model = await getFile(`${v.file}.onnx`, (f) => useTts.setState({ loading: f }));
        const session = await o.InferenceSession.create(model, { executionProviders: ['wasm'] });
        return { session, cfg };
      } finally { useTts.setState({ loading: null }); }
    })();
    p.catch(() => { loaded.delete(v.file); useTts.setState({ error: true }); });
    loaded.set(v.file, p);
  }
  return loaded.get(v.file)!;
}

/** Is this voice already on the device (no download needed)? */
export async function voiceReady(lang: Lang, sex: Sex): Promise<boolean> {
  if (!('caches' in window)) return false;
  const c = await caches.open(CACHE).catch(() => null);
  return !!(await c?.match(ttsBase() + VOICES[lang][sex].file + '.onnx').catch(() => undefined));
}

/** Text → WAV, read by the chosen voice. */
export async function synth(lang: Lang, sex: Sex, text: string): Promise<Blob> {
  const { session, cfg } = await loadVoice(lang, sex);
  const sid = VOICES[lang][sex].sid ?? 0;
  const o = await ort();
  const ids = await phonemize(cfg.espeak.voice, text);
  const inf = cfg.inference;
  const feeds: Record<string, import('onnxruntime-web').Tensor> = {
    input: new o.Tensor('int64', BigInt64Array.from(ids.map(BigInt)), [1, ids.length]),
    input_lengths: new o.Tensor('int64', BigInt64Array.from([BigInt(ids.length)]), [1]),
    scales: new o.Tensor('float32', Float32Array.from([inf.noise_scale, inf.length_scale * 1.08, inf.noise_w]), [3]),
  };
  if (cfg.speaker_id_map && Object.keys(cfg.speaker_id_map).length) feeds.sid = new o.Tensor('int64', BigInt64Array.from([BigInt(sid)]), [1]);
  const out = await session.run(feeds);
  return wav(out.output.data as Float32Array, cfg.audio.sample_rate);
}

function wav(pcm: Float32Array, rate: number): Blob {
  const b = new DataView(new ArrayBuffer(44 + pcm.length * 2));
  const s = (o: number, t: string) => { for (let i = 0; i < t.length; i++) b.setUint8(o + i, t.charCodeAt(i)); };
  s(0, 'RIFF'); b.setUint32(4, 36 + pcm.length * 2, true); s(8, 'WAVE'); s(12, 'fmt ');
  b.setUint32(16, 16, true); b.setUint16(20, 1, true); b.setUint16(22, 1, true); b.setUint32(24, rate, true);
  b.setUint32(28, rate * 2, true); b.setUint16(32, 2, true); b.setUint16(34, 16, true); s(36, 'data'); b.setUint32(40, pcm.length * 2, true);
  for (let i = 0; i < pcm.length; i++) b.setInt16(44 + i * 2, Math.max(-1, Math.min(1, pcm[i])) * 0x7fff, true);
  return new Blob([b.buffer], { type: 'audio/wav' });
}
