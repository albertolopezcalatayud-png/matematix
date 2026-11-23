"""
Natural-voice audio for Matematix (free voices, no accounts, runs in GitHub Actions).
  python scripts/audio/generate.py <texts.json> <voices-dir> <out-dir>
Writes <out>/<lang>/<voice>/<key>.mp3 + manifest.json, and <out>/voices.json (voices ready to use).
Only missing clips are generated, so it can run again after content changes and carry on after a time-out.
Engines: Piper (castellano), Matxa (valencià, Projecte AINA), Kokoro (British English). Adapted from Lectorix.
"""
import json, os, re, sys, time
import numpy as np
import lameenc
from piper import PiperVoice, SynthesisConfig

texts_file, voices_dir, out_dir = sys.argv[1:4]
TEXTS = json.load(open(texts_file, encoding='utf-8'))
VOICES = json.load(open(os.path.join(os.path.dirname(__file__), 'voices.json'), encoding='utf-8'))
DEADLINE = time.time() + float(os.environ.get('MAX_MINUTES', '320')) * 60
LENGTH_SCALE = 1.08      # a touch slower than the model's default: clearer for children
GAP_S = 0.3              # pause between sentences
PAD_S = 0.12             # a little silence before and after: the first sound is never cut

def encode_mp3(samples: np.ndarray, rate: int) -> bytes:
    enc = lameenc.Encoder(); enc.set_bit_rate(32); enc.set_in_sample_rate(rate); enc.set_channels(1); enc.set_quality(2)
    pad = np.zeros(int(PAD_S * rate), dtype=np.float32)
    pcm = (np.clip(np.concatenate([pad, samples, pad]), -1, 1) * 32767).astype(np.int16).tobytes()
    return enc.encode(pcm) + enc.flush()

# ── Matxa multispeaker (Projecte AINA / BSC, GPL-3.0; data FestCat + OpenSLR69, CC BY-SA) ──
# Valencian voices: the model reads espeak-ng 'ca-va' (Valencian) phonemes. Only the generated audio goes
# into the app, never the model. One ONNX file (Matcha-TTS + HiFi-GAN): matcha_hifigan_simply.onnx.
MATXA_ONNX = os.environ.get('MATXA_ONNX', os.path.join(voices_dir, 'matxa_hifigan_simply.onnx'))
SENT_SPLIT = re.compile(r'(?<=[.!?…:;])\s+')

class MatxaVoice:
    _sess = None; _esp = None
    SYM = ['_'] + list(';:,.!?¡¿—…"«»“” ') + list('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz') + list("ɑɐɒæɓʙβɔɕçɗɖðʤəɘɚɛɜɝɞɟʄɡɠɢʛɦɧħɥʜɨɪʝɭɬɫɮʟɱɯɰŋɳɲɴøɵɸθœɶʘɹɺɾɻʀʁɽʂʃʈʧʉʊʋⱱʌɣɤʍχʎʏʑʐʒʔʡʕʢǀǁǂǃˈˌːˑʼʴʰʱʲʷˠˤ˞↓↑→↗↘'̩'ᵻ")
    RATE = 22050
    def __init__(self, spk, espeak='ca-va'):
        import onnxruntime as ort
        from piper.phonemize_espeak import EspeakPhonemizer
        if MatxaVoice._sess is None:
            MatxaVoice._sess = ort.InferenceSession(MATXA_ONNX)
            MatxaVoice._esp = EspeakPhonemizer()
        self.spk = spk; self.espeak = espeak; self.sid = {c: i for i, c in enumerate(self.SYM)}
    @staticmethod
    def fold(ph):
        # the voices never heard /v/ (their recordings are Central Catalan, which has none)
        return [('b' if (i == 0 or ph[i - 1] in (' ', 'm', 'n')) else 'β') if c == 'v' else c for i, c in enumerate(ph)]
    def phonemes(self, text):
        return ' '.join(''.join(self.fold(s)) for s in MatxaVoice._esp.phonemize(self.espeak, text)).strip()
    def audio(self, text, scale):
        seq = [self.sid[c] for c in self.phonemes(text) if c in self.sid]
        if not seq: return np.zeros(0, dtype=np.float32)
        x = [0] * (len(seq) * 2 + 1); x[1::2] = seq
        feed = {'x': np.array([x], dtype=np.int64), 'x_lengths': np.array([len(x)], dtype=np.int64),
                'scales': np.array([0.667, scale], dtype=np.float32), 'spks': np.array([self.spk], dtype=np.int64)}
        outs = [o.name for o in MatxaVoice._sess.get_outputs()]
        a = np.asarray(dict(zip(outs, MatxaVoice._sess.run(None, feed)))['hfaudio']).squeeze().astype(np.float32)
        return a / max(1e-4, float(np.abs(a).max())) * 0.9
    def sentences(self, text, scale):
        """[(char offset, sentence, audio)], one sentence at a time, as Piper does"""
        out, pos = [], 0
        for part in SENT_SPLIT.split(text.strip()):
            if not part.strip(): continue
            off = text.find(part, pos); pos = off + len(part)
            out.append((off, part, self.audio(part, scale)))
        return out

class KokoroVoice:
    """Kokoro-82M (Apache-2.0), natural British English voices (bf_*, bm_*). kokoro-onnx; files in voices_dir."""
    _k = None; _esp = None
    RATE = 24000
    def __init__(self, name, lang='en-gb'):
        from kokoro_onnx import Kokoro
        from piper.phonemize_espeak import EspeakPhonemizer
        if KokoroVoice._k is None:
            KokoroVoice._k = Kokoro(os.path.join(voices_dir, 'kokoro-v1.0.onnx'), os.path.join(voices_dir, 'voices-v1.0.bin'))
            KokoroVoice._esp = EspeakPhonemizer()
        self.name = name; self.lang = lang
    def phonemes(self, text):
        # only to weigh how long each word sounds (word timings)
        return ' '.join(''.join(s) for s in KokoroVoice._esp.phonemize('en-gb-x-rp' if self.lang == 'en-gb' else 'en-us', text)).strip()
    def audio(self, text, scale):
        a, sr = KokoroVoice._k.create(text, voice=self.name, speed=1.0 / scale, lang=self.lang)
        a = np.asarray(a, dtype=np.float32)
        return a / max(1e-4, float(np.abs(a).max())) * 0.9
    def sentences(self, text, scale):
        out, pos = [], 0
        for part in SENT_SPLIT.split(text.strip()):
            if not part.strip(): continue
            off = text.find(part, pos); pos = off + len(part)
            out.append((off, part, self.audio(part, scale)))
        return out


def synth(voice, v, text):
    if isinstance(voice, (MatxaVoice, KokoroVoice)):
        parts = voice.sentences(text, LENGTH_SCALE * v.get('scale', 1.0))
        gap = np.zeros(int(GAP_S * voice.RATE), dtype=np.float32)
        body = [x for _, _, a in parts for x in (a, gap)][:-1]
        return (np.concatenate(body) if body else np.zeros(0, dtype=np.float32)), voice.RATE
    ch = list(voice.synthesize(text, syn_config=SynthesisConfig(speaker_id=v['speaker'], length_scale=LENGTH_SCALE)))
    if not ch: return np.zeros(0, dtype=np.float32), 22050
    gap = np.zeros(int(GAP_S * ch[0].sample_rate), dtype=np.float32)
    return np.concatenate([x for c in ch for x in (c.audio_float_array, gap)][:-1]), ch[0].sample_rate

SAMPLE = {
    'es': 'Hola. Vamos a practicar números paso a paso, sin prisas.',
    'ca': 'Hola. Anem a practicar nombres pas a pas, sense presses.',
    'en': "Hello. Let's practise numbers step by step, with no rush.",
}
made = failed = 0; stop = ''
index = {}
for lang, voices in VOICES.items():
    index[lang] = []
    for v in voices:
        if time.time() > DEADLINE: stop = 'time'; break
        if v.get('engine') == 'matxa': voice = MatxaVoice(v['speaker'], v.get('espeak', 'ca-va'))
        elif v.get('engine') == 'kokoro': voice = KokoroVoice(v['speaker'])
        else:
            base = os.path.join(voices_dir, os.path.basename(v['model']))
            voice = PiperVoice.load(base + '.onnx', base + '.onnx.json')
        d = os.path.join(out_dir, lang, v['id']); os.makedirs(d, exist_ok=True)
        smp = os.path.join(d, 'sample.mp3')
        if not os.path.exists(smp):
            a, rate = synth(voice, v, SAMPLE[lang]); open(smp, 'wb').write(encode_mp3(a, rate))
        mf = os.path.join(d, 'manifest.json')
        manifest = json.load(open(mf)) if os.path.exists(mf) else {'voice': v['id'], 'items': {}}
        wanted = TEXTS.get(lang, {})
        manifest['items'] = {k: 1 for k in manifest['items'] if k in wanted and os.path.exists(os.path.join(d, k + '.mp3'))}
        todo = [(k, t) for k, t in wanted.items() if k not in manifest['items']]
        print(f'{lang}/{v["id"]}: {len(manifest["items"])} done, {len(todo)} to do', flush=True)
        for n, (k, text) in enumerate(todo):
            if time.time() > DEADLINE: stop = 'time'; break
            try:
                audio, rate = synth(voice, v, text)
                if not len(audio): raise RuntimeError('no audio')
                open(os.path.join(d, k + '.mp3'), 'wb').write(encode_mp3(audio, rate))
                manifest['items'][k] = 1; made += 1
            except Exception as e:
                failed += 1; print('  failed', repr(text[:40]), e, flush=True)
                if failed > 200: stop = 'too many errors'; break
            if n % 500 == 499: json.dump(manifest, open(mf, 'w')); print(f'  {n + 1} clips', flush=True)
        json.dump(manifest, open(mf, 'w'))
        if len(manifest['items']) >= 0.97 * len(wanted):
            index[lang].append({k: v[k] for k in ('id', 'name', 'license', 'credit')})
        if stop: break
    if stop: break
old_index = os.path.join(out_dir, 'voices.json')
prev = json.load(open(old_index)) if os.path.exists(old_index) else {}
for lang in VOICES:
    if not index.get(lang): index[lang] = prev.get(lang, [])
json.dump(index, open(old_index, 'w'), ensure_ascii=False)
if stop: open(os.environ.get('STOP_FILE', '/tmp/audio-stop'), 'w').write(stop)
print(f'made {made}, failed {failed}' + (f', stopped: {stop}' if stop else ''))
