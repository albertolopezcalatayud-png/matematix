import { useRef, useState } from 'react';
import { useT, fmtNum } from '@/i18n';
import { TopBar } from '@/components/Layout';
import { LessonExample, LessonPicker } from '@/components/LessonPicker';
import { useApp } from '@/stores/app';
import { tone } from '@/services/sound';

const W = 1000, PAD = 40, Y = 150;
const PRESETS: [number, number][] = [[0, 10], [0, 20], [0, 100], [0, 1000], [-10, 10]];

/** Whiteboard mode: any lesson's explanation and worked example in large print, and one big number line as a visual aid
 *  (tap to mark, jump with the buttons; each jump sounds, every ten an octave higher). */
export default function Board() {
  const { t, lang } = useT();
  const [[min, max], setRange] = useState<[number, number]>([0, 20]);
  const [at, setAt] = useState<number | null>(null);
  const [jumps, setJumps] = useState<[number, number][]>([]);
  const [lesson, setLesson] = useState<string | null>(useApp.getState().lastLesson);
  const course = useApp((s) => s.course);
  const box = useRef<HTMLDivElement>(null);
  const span = max - min;
  const x = (v: number) => PAD + ((v - min) / span) * (W - 2 * PAD);
  const tick = span <= 20 ? 1 : span <= 100 ? (span <= 40 ? 1 : 5) : span <= 1000 ? 50 : Math.ceil(span / 20);
  const label = span <= 20 ? 1 : span <= 100 ? 10 : span <= 1000 ? 100 : tick * 5;
  const ticks: number[] = []; for (let v = Math.ceil(min / tick) * tick; v <= max; v += tick) ticks.push(v);
  const go = (to: number) => { const v = Math.max(min, Math.min(max, to)); if (at != null && v !== at) setJumps((j) => [...j, [at, v]]); setAt(v); tone(v, { span: Math.max(20, span) }); };
  const tap = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const v = Math.round(min + ((((e.clientX - r.left) / r.width) * W - PAD) / (W - 2 * PAD)) * span);
    setJumps([]); setAt(Math.max(min, Math.min(max, v))); tone(v, { span: Math.max(20, span) });
  };
  const steps = span <= 20 ? [1] : span <= 100 ? [1, 10] : [10, 100];
  return (
    <div className="min-h-dvh pb-10">
      <TopBar title={t('sec_board')} back="/adultos" />
      <main className="max-w-5xl mx-auto px-4 space-y-4">
        <p className="rounded-2xl p-3 bg-[var(--color-sky-pale)] text-base">{t('b_intro')}</p>
        <section className="card space-y-3" data-testid="board-lesson">
          <h2 className="font-extrabold">{t('b_example')}</h2>
          <LessonPicker value={lesson} onChange={setLesson} startCourse={course} testId="board-pick" />
          <LessonExample id={lesson} big />
        </section>
        <div ref={box} className="card space-y-3 bg-[var(--color-card)]" data-testid="board">
          <div className="flex flex-wrap gap-2 items-center">
            {PRESETS.map(([a, b]) => <button key={`${a}-${b}`} className={`btn ${a === min && b === max ? 'btn-primary' : 'btn-ghost'} !min-h-10`} onClick={() => { setRange([a, b]); setAt(null); setJumps([]); }}>{fmtNum(lang, a)}–{fmtNum(lang, b)}</button>)}
            <span className="flex-1" />
            <button className="btn btn-ghost !min-h-10" onClick={() => void (document.fullscreenElement ? document.exitFullscreen() : box.current?.requestFullscreen?.())}>⛶ {t('b_full')}</button>
          </div>
          <p className="text-center text-7xl font-extrabold min-h-24 text-[var(--color-accent)]" aria-live="polite" data-testid="board-value">{at == null ? '·' : fmtNum(lang, at)}</p>
          <svg viewBox={`0 0 ${W} 230`} className="w-full touch-none cursor-pointer select-none" onPointerDown={tap} role="img" aria-label={`${fmtNum(lang, min)}–${fmtNum(lang, max)}`}>
            {ticks.filter((v) => v % 10 === 0 && span <= 100).map((v) => <rect key={`g${v}`} x={x(v) - 9} y={Y - 30} width={18} height={60} rx={6} fill="#FFC861" opacity={0.35} />)}
            <line x1={PAD - 15} y1={Y} x2={W - PAD + 15} y2={Y} stroke="var(--color-fg)" strokeWidth={5} strokeLinecap="round" />
            {ticks.map((v) => <g key={v}><line x1={x(v)} y1={Y - (v % label === 0 ? 24 : 13)} x2={x(v)} y2={Y + (v % label === 0 ? 24 : 13)} stroke="var(--color-fg)" strokeWidth={v % label === 0 ? 4 : 2} />
              {v % label === 0 && <text x={x(v)} y={Y + 62} fontSize={span <= 20 ? 34 : 28} fontWeight={800} textAnchor="middle" fill="var(--color-fg)">{fmtNum(lang, v)}</text>}</g>)}
            {jumps.map(([a, b], i) => { const h = Math.min(110, 20 + Math.abs(x(b) - x(a)) * 0.45); return <path key={i} d={`M ${x(a)} ${Y - 8} Q ${(x(a) + x(b)) / 2} ${Y - 8 - h} ${x(b)} ${Y - 8}`} fill="none" stroke="var(--color-mint)" strokeWidth={5} strokeLinecap="round" />; })}
            {at != null && <circle cx={x(at)} cy={Y} r={16} fill="var(--color-accent)" stroke="var(--color-card)" strokeWidth={4} />}
          </svg>
          <div className="flex flex-wrap gap-2 justify-center">
            {steps.map((s) => <button key={`m${s}`} className="btn btn-ghost !text-2xl !min-h-14 !px-5" disabled={at == null} onClick={() => go((at ?? 0) - s)}>−{s}</button>)}
            {steps.map((s) => <button key={`p${s}`} className="btn btn-ghost !text-2xl !min-h-14 !px-5" disabled={at == null} onClick={() => go((at ?? 0) + s)}>+{s}</button>)}
            <button className="btn btn-ghost !min-h-14" onClick={() => { setAt(null); setJumps([]); }}>{t('b_clear')}</button>
          </div>
        </div>
      </main>
    </div>
  );
}
