import { useApp } from '@/stores/app';

// The number line can be heard and felt: every number has a note (bigger = higher) and every ten is one octave up,
// so 10 sounds like 0 "one floor up". On Android each jump also gives a tiny vibration. Both can be turned off.
let ctx: AudioContext | null = null;
const audio = () => {
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
};

/** The pitch of a number: 196 Hz (a G) at 0, one octave higher every 10, kept inside a comfortable range. */
export function pitchOf(v: number, span = 20): number {
  const tens = span > 200 ? v / (span / 2) : v / 10; // on long lines, the octave is half the line
  return 196 * Math.pow(2, Math.max(-1.5, Math.min(2.6, tens)));
}

export function tone(v: number, { chord = false, dur = 0.14, span = 20 } = {}) {
  if (!useApp.getState().sound) return;
  try {
    const a = audio(); if (!a) return;
    const t = a.currentTime, f = pitchOf(v, span);
    (chord ? [1, 1.26, 1.5] : [1]).forEach((m) => {
      const o = a.createOscillator(), g = a.createGain();
      o.type = 'sine'; o.frequency.value = f * m;
      const peak = (chord ? 0.07 : 0.1);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + dur + (chord ? 0.25 : 0));
      o.connect(g).connect(a.destination); o.start(t); o.stop(t + dur + 0.3);
    });
  } catch { /* no audio on this device */ }
}

export function buzz(ms = 8) {
  if (!useApp.getState().sound) return;
  try { navigator.vibrate?.(ms); } catch { /* not supported */ }
}
