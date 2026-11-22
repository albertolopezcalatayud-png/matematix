import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import type { Visual } from '@/engine/types';

const W = 360, PAD = 22;
const ACC = 'var(--color-accent)', FG = 'var(--color-fg)', MUTED = 'var(--color-muted)', PEACH = 'var(--color-peach)', MINT = 'var(--color-mint)';

type LineV = Extract<Visual, { type: 'line' }>;
const xOf = (v: number, min: number, max: number) => PAD + ((v - min) / (max - min)) * (W - 2 * PAD);

/** The number line: the one visual model used everywhere (numbers, later fractions, scales and graph axes). */
export function NumberLine({ v, placed, good, describe }: { v: LineV; placed?: number | null; good?: boolean | null; describe: string }) {
  const { min, max } = v;
  const y = 70;
  return (
    <svg viewBox={`0 0 ${W} 110`} className="w-full max-w-xl mx-auto block" role="img" aria-label={describe}>
      {v.jumps?.map(([a, b], i) => {
        const x1 = xOf(a, min, max), x2 = xOf(b, min, max), h = Math.min(34, 10 + Math.abs(x2 - x1) * 0.35);
        return <path key={i} d={`M ${x1} ${y - 4} Q ${(x1 + x2) / 2} ${y - 4 - h * 2} ${x2} ${y - 4}`} fill="none" stroke={MINT} strokeWidth={2.5} markerEnd="url(#arr)" />;
      })}
      <defs><marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill={MINT} /></marker></defs>
      <line x1={PAD} y1={y} x2={W - PAD} y2={y} stroke={FG} strokeWidth={3} strokeLinecap="round" />
      {v.marks.map((m) => {
        const big = v.labels.includes(m);
        return <line key={m} x1={xOf(m, min, max)} x2={xOf(m, min, max)} y1={y - (big ? 10 : 6)} y2={y + (big ? 10 : 6)} stroke={FG} strokeWidth={big ? 2.5 : 1.5} />;
      })}
      {v.labels.map((l) => <text key={l} x={xOf(l, min, max)} y={y + 30} textAnchor="middle" fontSize="15" fontWeight={700} fill={FG}>{l}</text>)}
      {v.point != null && <path d={`M ${xOf(v.point, min, max)} ${y - 8} l -8 -14 h 16 z`} fill={PEACH} />}
      {placed != null && (
        <g>
          <circle cx={xOf(placed, min, max)} cy={y} r={9} fill={good == null ? ACC : good ? MINT : PEACH} stroke="var(--color-card)" strokeWidth={3} />
        </g>
      )}
    </svg>
  );
}

/** Tap (or use the arrow keys) to put a number on the line. Snaps to whole numbers. */
export function PlaceOnLine({ v, value, onChange, locked, good, label }: { v: LineV; value: number | null; onChange: (n: number) => void; locked: boolean; good: boolean | null; label: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const [focus, setFocus] = useState(false);
  const { min, max } = v;
  const fromEvent = (e: PointerEvent) => {
    const box = ref.current!.getBoundingClientRect();
    const sx = ((e.clientX - box.left) / box.width) * W;
    const val = Math.round(min + ((sx - PAD) / (W - 2 * PAD)) * (max - min));
    return Math.max(min, Math.min(max, val));
  };
  const key = (e: KeyboardEvent) => {
    if (locked) return;
    const step = e.shiftKey ? Math.max(1, Math.round((max - min) / 10)) : 1;
    const cur = value ?? Math.round((min + max) / 2);
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { onChange(Math.min(max, (value == null ? cur : cur + step))); e.preventDefault(); }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { onChange(Math.max(min, (value == null ? cur : cur - step))); e.preventDefault(); }
  };
  return (
    <div className={`rounded-3xl p-2 ${focus ? 'ring-2 ring-[var(--color-accent)]' : ''}`}>
      <svg
        ref={ref} viewBox={`0 0 ${W} 110`} className="w-full max-w-xl mx-auto block touch-none select-none cursor-pointer"
        role="slider" tabIndex={0} aria-label={label} aria-valuemin={min} aria-valuemax={max} aria-valuenow={value ?? undefined} aria-valuetext={value == null ? '—' : String(value)}
        data-testid="line-input" data-min={min} data-max={max}
        onPointerDown={(e) => { if (!locked) { (e.target as Element).setPointerCapture?.(e.pointerId); onChange(fromEvent(e)); } }}
        onPointerMove={(e) => { if (!locked && e.buttons) onChange(fromEvent(e)); }}
        onKeyDown={key} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
      >
        <rect x={0} y={30} width={W} height={70} fill="transparent" />
        <line x1={PAD} y1={70} x2={W - PAD} y2={70} stroke={FG} strokeWidth={4} strokeLinecap="round" />
        {v.marks.map((m) => { const big = v.labels.includes(m); return <line key={m} x1={xOf(m, min, max)} x2={xOf(m, min, max)} y1={70 - (big ? 11 : 6)} y2={70 + (big ? 11 : 6)} stroke={FG} strokeWidth={big ? 2.5 : 1.5} />; })}
        {v.labels.map((l) => <text key={l} x={xOf(l, min, max)} y={100} textAnchor="middle" fontSize="15" fontWeight={700} fill={FG}>{l}</text>)}
        {value != null && (
          <g>
            <circle cx={xOf(value, min, max)} cy={70} r={11} fill={good == null ? ACC : good ? MINT : PEACH} stroke="var(--color-card)" strokeWidth={3} />
            <text x={xOf(value, min, max)} y={44} textAnchor="middle" fontSize="16" fontWeight={800} fill={good == null ? ACC : good ? MINT : PEACH}>{value}</text>
          </g>
        )}
      </svg>
    </div>
  );
}

function TenFrame({ n, x, y, cell = 22, empty = true }: { n: number; x: number; y: number; cell?: number; empty?: boolean }) {
  const out = [];
  for (let i = 0; i < 10; i++) {
    const cx = x + (i % 5) * cell + cell / 2, cy = y + Math.floor(i / 5) * cell + cell / 2;
    out.push(<rect key={`r${i}`} x={cx - cell / 2} y={cy - cell / 2} width={cell} height={cell} fill="none" stroke={MUTED} strokeWidth={1.2} rx={3} />);
    if (i < n) out.push(<circle key={`c${i}`} cx={cx} cy={cy} r={cell * 0.34} fill={ACC} />);
    else if (empty) out.push(null);
  }
  return <g>{out}</g>;
}

export function VisualView({ v, describe }: { v: Visual; describe: string }) {
  if (v.type === 'line') return <NumberLine v={v} describe={describe} />;
  if (v.type === 'dots') {
    const cell = 22, gw = cell * 5 + 24;
    const w = v.groups.length * gw;
    return (
      <svg viewBox={`0 0 ${w} ${cell * 2 + 34}`} className="w-full max-w-sm mx-auto block" role="img" aria-label={describe}>
        {v.groups.map((n, gi) => (
          <g key={gi}>
            <TenFrame n={n} x={gi * gw + 12} y={4} cell={cell} />
            <text x={gi * gw + 12 + cell * 2.5} y={cell * 2 + 28} textAnchor="middle" fontSize="16" fontWeight={800} fill={FG}>{n}</text>
          </g>
        ))}
      </svg>
    );
  }
  if (v.type === 'frame') {
    return (
      <svg viewBox="0 0 150 64" className="w-full max-w-xs mx-auto block" role="img" aria-label={describe}>
        <TenFrame n={v.filled} x={10} y={4} cell={26} />
      </svg>
    );
  }
  // tens rods and ones cubes
  const c = 12;
  const w = Math.max(1, v.tens) * (c + 10) + 30 + Math.ceil(v.ones / 5) * (c + 4) + 10;
  return (
    <svg viewBox={`0 0 ${w} ${c * 10 + 12}`} className="w-full max-w-xs mx-auto block" role="img" aria-label={describe}>
      {Array.from({ length: v.tens }, (_, t) => (
        <g key={t}>{Array.from({ length: 10 }, (_, k) => <rect key={k} x={6 + t * (c + 10)} y={6 + k * c} width={c} height={c} fill="var(--color-accent-pale)" stroke={ACC} strokeWidth={1.3} rx={2} />)}</g>
      ))}
      {Array.from({ length: v.ones }, (_, k) => (
        <rect key={k} x={6 + v.tens * (c + 10) + 20 + Math.floor(k / 5) * (c + 4)} y={6 + (9 - (k % 5)) * c} width={c} height={c} fill="var(--color-yellow-pale)" stroke={PEACH} strokeWidth={1.3} rx={2} />
      ))}
    </svg>
  );
}
