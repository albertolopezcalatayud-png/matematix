import { useRef, type KeyboardEvent, type PointerEvent } from 'react';
import type { Thread } from '@/engine/types';
import { buzz, tone } from '@/services/sound';

const W = 360, PAD = 20, Y = 92;

/**
 * Answer by stretching a thread along the number line: put a finger on the start number and pull, one jump at a time.
 * Every jump draws an arc, plays its note (each ten is an octave) and gives a tiny vibration. Buttons and arrow keys do
 * the same for anyone who finds dragging hard. The tens glow: stopping there is the strategy ("make 10 first").
 */
export function ThreadInput({ th, value, onChange, locked, good, showTen, label, moreLabel, backLabel, moreShort, backShort }: {
  th: Thread; value: number; onChange: (v: number) => void; locked: boolean; good: boolean | null; showTen: boolean;
  label: string; moreLabel: string; backLabel: string; moreShort: string; backShort: string;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);
  const { min, max, start, step } = th;
  const x = (v: number) => PAD + ((v - min) / (max - min)) * (W - 2 * PAD);
  const snap = (v: number) => Math.max(min, Math.min(max, start + Math.round((v - start) / step) * step));

  const go = (target: number) => {
    target = snap(target);
    if (locked || target === value) return;
    const dir = target > value ? step : -step;
    for (let k = value + dir; ; k += dir) { const ten = k % 10 === 0; tone(k, { chord: ten, span: max - min }); buzz(ten ? 22 : 8); if (k === target) break; }
    onChange(target);
  };
  const fromEvent = (e: PointerEvent) => {
    const box = ref.current!.getBoundingClientRect();
    return min + ((((e.clientX - box.left) / box.width) * W - PAD) / (W - 2 * PAD)) * (max - min);
  };
  const key = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { go(value + step); e.preventDefault(); }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { go(value - step); e.preventDefault(); }
  };

  const labelEvery = step > 1 ? step * (max - min > step * 12 ? 2 : 1) : max - min > 20 ? 10 : 5;
  const ticks: number[] = []; for (let v = min; v <= max; v += step === 1 ? 1 : step) ticks.push(v);
  const arcs: [number, number][] = [];
  if (value !== start) { const d = value > start ? step : -step; for (let v = start; v !== value; v += d) arcs.push([v, v + d]); }
  const tens = ticks.filter((v) => v % 10 === 0 && v > Math.min(start, value) - 1 && v !== start && showTen);
  // jumps up to the next ten in purple, the rest in green: the two steps of the strategy are visible
  const firstTen = value >= start ? Math.ceil((start + 1) / 10) * 10 : Math.floor((start - 1) / 10) * 10;
  const colour = good == null ? 'var(--color-accent)' : good ? 'var(--color-mint)' : 'var(--color-peach)';
  const n = (value - start) / step;

  return (
    <div className="space-y-2">
      <svg ref={ref} viewBox={`0 0 ${W} 140`} className="w-full block touch-none select-none cursor-pointer rounded-3xl bg-[var(--color-card)]"
        role="slider" tabIndex={0} aria-label={label} aria-valuemin={min} aria-valuemax={max} aria-valuenow={value} aria-valuetext={String(value)}
        data-testid="thread" data-min={min} data-max={max} data-start={start} data-step={step}
        onPointerDown={(e) => { if (locked) return; (e.target as Element).setPointerCapture?.(e.pointerId); dragging.current = true; go(fromEvent(e)); }}
        onPointerMove={(e) => { if (dragging.current) go(fromEvent(e)); }}
        onPointerUp={() => { dragging.current = false; }} onKeyDown={key}>
        {tens.map((v) => <circle key={`ten${v}`} cx={x(v)} cy={Y} r={18} fill="#FFD27A" opacity={0.5} />)}
        <line x1={PAD} y1={Y} x2={W - PAD} y2={Y} stroke="var(--color-fg)" strokeWidth={4} strokeLinecap="round" />
        {ticks.map((v) => { const big = v % labelEvery === 0 || v === start; return <line key={v} x1={x(v)} x2={x(v)} y1={Y - (big ? 11 : 6)} y2={Y + (big ? 11 : 6)} stroke="var(--color-fg)" strokeWidth={big ? 2.5 : 1.4} />; })}
        {ticks.filter((v) => v % labelEvery === 0 || v === start).map((v) => <text key={`l${v}`} x={x(v)} y={Y + 32} textAnchor="middle" fontSize="14" fontWeight={800} fill="var(--color-fg)">{v}</text>)}
        {arcs.map(([a, b], i) => {
          const x1 = x(a), x2 = x(b), h = Math.min(40, 12 + Math.abs(x2 - x1) * 0.5);
          return <path key={i} d={`M ${x1} ${Y - 4} Q ${(x1 + x2) / 2} ${Y - 4 - h * 1.5} ${x2} ${Y - 4}`} fill="none" stroke={(value >= start ? b <= firstTen : b >= firstTen) ? 'var(--color-accent)' : 'var(--color-mint)'} strokeWidth={3} strokeLinecap="round" />;
        })}
        <circle cx={x(start)} cy={Y} r={10} fill="var(--color-fg)" />
        {value !== start && (
          <g>
            <circle cx={x(value)} cy={Y} r={14} fill={colour} stroke="var(--color-card)" strokeWidth={3} />
            <text x={x(value)} y={Y + 5} textAnchor="middle" fontSize="12" fontWeight={900} fill="var(--color-bg)">{value}</text>
          </g>
        )}
      </svg>
      <div className="flex items-center gap-2">
        <button className="btn btn-ghost !px-4 whitespace-nowrap shrink-0" disabled={locked || value <= min} onClick={() => go(value - step)} aria-label={backLabel} data-testid="jump-back">◀ {backShort}</button>
        <span className="flex-1 text-center text-xl font-extrabold text-[var(--color-accent)] whitespace-nowrap" aria-live="polite" data-testid="jumps">
          {n === 0 ? '' : step === 1 ? `${start} ${n > 0 ? '+' : '−'} ${Math.abs(n)}` : `${Math.abs(n)} × ${step}`}
        </span>
        <button className="btn btn-ghost !px-4 whitespace-nowrap shrink-0" disabled={locked || value >= max} onClick={() => go(value + step)} aria-label={moreLabel} data-testid="jump-more">{moreShort} ▶</button>
      </div>
    </div>
  );
}
