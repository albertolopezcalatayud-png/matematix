import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import type { Msg, Visual } from '@/engine/types';
import { fmtScaled, useT } from '@/i18n';
import { ClockView, EmojiView, FracView, GridView, ShapeView } from './VisualsMore';

const W = 360, PAD = 22;
const ACC = 'var(--color-accent)', FG = 'var(--color-fg)', MUTED = 'var(--color-muted)', PEACH = 'var(--color-peach)', MINT = 'var(--color-mint)';

type LineV = Extract<Visual, { type: 'line' }>;
const xOf = (v: number, min: number, max: number) => PAD + ((v - min) / (max - min)) * (W - 2 * PAD);

/** The number line: the one visual model used everywhere (numbers, later fractions, scales and graph axes). */
export function NumberLine({ v, placed, good, describe }: { v: LineV; placed?: number | null; good?: boolean | null; describe: string }) {
  const { min, max } = v;
  const { lang } = useT();
  const f = (n: number) => fmtScaled(lang, n, v.scale ?? 1, v.frac);
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
      {v.labels.map((l) => <text key={l} x={xOf(l, min, max)} y={y + 30} textAnchor="middle" fontSize="15" fontWeight={700} fill={FG}>{f(l)}</text>)}
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
  const { lang } = useT();
  const f = (n: number) => fmtScaled(lang, n, v.scale ?? 1, v.frac);
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
        role="slider" tabIndex={0} aria-label={label} aria-valuemin={min} aria-valuemax={max} aria-valuenow={value ?? undefined} aria-valuetext={value == null ? '—' : f(value)}
        data-testid="line-input" data-min={min} data-max={max}
        onPointerDown={(e) => { if (!locked) { (e.target as Element).setPointerCapture?.(e.pointerId); onChange(fromEvent(e)); } }}
        onPointerMove={(e) => { if (!locked && e.buttons) onChange(fromEvent(e)); }}
        onKeyDown={key} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
      >
        <rect x={0} y={30} width={W} height={70} fill="transparent" />
        <line x1={PAD} y1={70} x2={W - PAD} y2={70} stroke={FG} strokeWidth={4} strokeLinecap="round" />
        {v.marks.map((m) => { const big = v.labels.includes(m); return <line key={m} x1={xOf(m, min, max)} x2={xOf(m, min, max)} y1={70 - (big ? 11 : 6)} y2={70 + (big ? 11 : 6)} stroke={FG} strokeWidth={big ? 2.5 : 1.5} />; })}
        {v.labels.map((l) => <text key={l} x={xOf(l, min, max)} y={100} textAnchor="middle" fontSize="15" fontWeight={700} fill={FG}>{f(l)}</text>)}
        {value != null && (
          <g>
            <circle cx={xOf(value, min, max)} cy={70} r={11} fill={good == null ? ACC : good ? MINT : PEACH} stroke="var(--color-card)" strokeWidth={3} />
            <text x={xOf(value, min, max)} y={44} textAnchor="middle" fontSize="16" fontWeight={800} fill={good == null ? ACC : good ? MINT : PEACH}>{f(value)}</text>
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

type BarsV = Extract<Visual, { type: 'bars' }>;
const PART_COLOURS = ['var(--color-accent-pale)', 'var(--color-mint-pale)', 'var(--color-yellow-pale)', 'var(--color-sky-pale)'];

/** The bar model: every quantity is a bar whose length is its size; the unknown is a "?" part. Same idea as the number line. */
function BarsView({ v, describe }: { v: BarsV; describe: string }) {
  const { m } = useT();
  const named = v.rows.some((r) => r.name);
  const L = named ? 74 : 8, R = 340, rowH = 40, gap = 20, top = v.total || v.diff ? 34 : 8;
  const max = Math.max(...v.rows.map((r) => r.parts.reduce((a, p) => a + p.v, 0)));
  const sx = (n: number) => (n / max) * (R - L);
  const h = top + v.rows.length * (rowH + gap) + (v.diff ? 4 : 0);
  const rowEnd = (i: number) => L + sx(v.rows[i].parts.reduce((a, p) => a + p.v, 0));
  return (
    <svg viewBox={`0 0 360 ${h}`} className="w-full max-w-xl mx-auto block" role="img" aria-label={describe} data-testid="bars">
      {v.total && (() => { const x2 = rowEnd(0); return (
        <g>
          <path d={`M ${L} ${top - 6} v -8 H ${x2} v 8`} fill="none" stroke="var(--color-fg)" strokeWidth={2} />
          <text x={(L + x2) / 2} y={top - 18} textAnchor="middle" fontSize="16" fontWeight={900} fill={v.total === '?' ? 'var(--color-peach)' : 'var(--color-fg)'}>{v.total}</text>
        </g>); })()}
      {v.rows.map((row, i) => {
        let x = L; const y = top + i * (rowH + gap);
        return (
          <g key={i}>
            {row.name && <text x={4} y={y + rowH / 2 + 5} fontSize="13" fontWeight={700} fill="var(--color-fg)">{m(row.name).slice(0, 9)}</text>}
            {row.parts.map((p, j) => {
              const w = sx(p.v), unk = p.label === '?';
              const el = (
                <g key={j}>
                  <rect x={x} y={y} width={Math.max(4, w - 2)} height={rowH} rx={8} fill={unk ? 'var(--color-peach-pale)' : p.shade === true ? '#B9AEFF' : p.shade === false ? 'var(--color-card)' : PART_COLOURS[(v.groups ? 0 : j) % 4]} stroke={unk ? 'var(--color-peach)' : 'var(--color-accent)'} strokeWidth={2} strokeDasharray={unk ? '5 4' : undefined} />
                  <text x={x + w / 2} y={y + rowH / 2 + 6} textAnchor="middle" fontSize="16" fontWeight={900} fill={unk ? 'var(--color-peach)' : 'var(--color-fg)'}>{p.label}</text>
                </g>);
              x += w; return el;
            })}
          </g>
        );
      })}
      {v.diff && v.rows.length === 2 && (() => {
        // the difference is the extra piece at the end of the LONGER bar
        const a = rowEnd(0), b = rowEnd(1), longer = a > b ? 0 : 1, y = top + longer * (rowH + gap) + rowH / 2;
        const x1 = Math.min(a, b), x2 = Math.max(a, b);
        return (
          <g>
            <line x1={x1} y1={top} x2={x1} y2={top + 2 * rowH + gap} stroke="var(--color-muted)" strokeDasharray="3 3" />
            {x2 - x1 > 4 && <rect x={x1} y={y - rowH / 2} width={x2 - x1 - 2} height={rowH} rx={8} fill="var(--color-peach-pale)" stroke="var(--color-peach)" strokeWidth={2} strokeDasharray="5 4" />}
            <text x={Math.min(340, (x1 + x2) / 2)} y={x2 - x1 < 34 ? y - rowH / 2 - 5 : y + 6} textAnchor="middle" fontSize="16" fontWeight={900} fill="var(--color-peach)">{v.diff}</text>
          </g>);
      })()}
    </svg>
  );
}

/** The unit staircase: going down a step multiplies by 10, going up divides by 10. */
function LadderView({ v, describe }: { v: Extract<Visual, { type: 'ladder' }>; describe: string }) {
  const n = v.units.length, sw = 340 / n, sh = 22, lo = Math.min(v.from, v.to), hi = Math.max(v.from, v.to), down = v.to > v.from;
  return (
    <svg viewBox={`0 0 360 ${n * sh + 40}`} className="w-full max-w-xl mx-auto block" role="img" aria-label={describe} data-testid="ladder">
      {v.units.map((u, i) => {
        const x = 10 + i * sw, y = 10 + i * sh, on = i >= lo && i <= hi, end = i === v.from || i === v.to;
        return (
          <g key={u}>
            <rect x={x} y={y} width={sw - 4} height={n * sh + 20 - i * sh} rx={8} fill={end ? (i === v.from ? 'var(--color-accent-pale)' : 'var(--color-mint-pale)') : on ? 'var(--color-yellow-pale)' : 'var(--color-card)'} stroke={end || on ? 'var(--color-accent)' : 'var(--color-border)'} strokeWidth={end ? 2.5 : 1.5} />
            <text x={x + (sw - 4) / 2} y={y + 18} textAnchor="middle" fontSize="15" fontWeight={900} fill="var(--color-fg)">{u}</text>
          </g>
        );
      })}
      {/* the ×10 labels go on top of every step so none is hidden */}
      {v.units.map((u, i) => {
        if (!(i < n - 1 && i >= lo && i < hi)) return null;
        const x = 10 + i * sw, y = 10 + i * sh;
        return (
          <g key={`f${u}`}>
            <rect x={x + sw - 22} y={y + sh + 22} width={40} height={20} rx={10} fill="var(--color-card)" stroke="var(--color-peach)" strokeWidth={1.5} />
            <text x={x + sw - 2} y={y + sh + 37} textAnchor="middle" fontSize="13" fontWeight={900} fill="var(--color-peach)">{down ? '×' : '÷'}{v.factor ?? 10}</text>
          </g>
        );
      })}
    </svg>
  );
}

/** Bar or line chart with a labelled grid: reading charts is the skill (rain, temperature, position–time). */
function ChartView({ v, describe }: { v: Extract<Visual, { type: 'chart' }>; describe: string }) {
  const { m } = useT();
  const L = 44, R = 350, T = 30, B = 200, n = v.x.length;
  const X = (i: number) => L + ((i + 0.5) / n) * (R - L), Y = (y: number) => B - (y / v.yMax) * (B - T);
  const xl = (x: string | Msg) => (typeof x === 'string' ? x : m(x));
  const grid: number[] = []; for (let y = 0; y <= v.yMax; y += v.yStep) grid.push(y);
  const labelEvery = grid.length > 8 ? 2 : 1;
  return (
    <svg viewBox="0 0 360 236" className="w-full max-w-xl mx-auto block" role="img" aria-label={describe} data-testid="chart">
      {grid.map((y, i) => (
        <g key={y}>
          <line x1={L} x2={R} y1={Y(y)} y2={Y(y)} stroke="var(--color-border)" strokeWidth={1} />
          {i % labelEvery === 0 && <text x={L - 6} y={Y(y) + 4} textAnchor="end" fontSize="11" fontWeight={700} fill="var(--color-fg)">{y}</text>}
        </g>
      ))}
      <line x1={L} x2={L} y1={T} y2={B} stroke="var(--color-fg)" strokeWidth={2} />
      <line x1={L} x2={R} y1={B} y2={B} stroke="var(--color-fg)" strokeWidth={2} />
      {v.kind === 'bar' && v.y.map((y, i) => <rect key={i} x={X(i) - (R - L) / n * 0.32} y={Y(y)} width={(R - L) / n * 0.64} height={B - Y(y)} rx={4} fill={v.mark === i ? 'var(--color-peach)' : 'var(--color-accent)'} opacity={0.85} />)}
      {v.kind === 'line' && <polyline points={v.y.map((y, i) => `${X(i)},${Y(y)}`).join(' ')} fill="none" stroke="var(--color-accent)" strokeWidth={3} strokeLinejoin="round" />}
      {v.kind === 'line' && v.y.map((y, i) => <circle key={i} cx={X(i)} cy={Y(y)} r={v.mark === i ? 6 : 4} fill={v.mark === i ? 'var(--color-peach)' : 'var(--color-accent)'} />)}
      {v.kind === 'line' && v.slope && v.y.length > 2 && (
        <g stroke="var(--color-mint)" strokeWidth={2.5} fill="none">
          <path d={`M ${X(1)} ${Y(v.y[1])} H ${X(2)} V ${Y(v.y[2])}`} strokeDasharray="4 3" />
        </g>
      )}
      {v.x.map((x, i) => { const w = xl(x); return <text key={i} x={X(i)} y={B + 16} textAnchor="middle" fontSize={Math.min(11, ((R - L) / n) / (Math.max(...v.x.map((q) => xl(q).length)) * 0.62))} fontWeight={700} fill="var(--color-fg)">{w}</text>; })}
      {v.xTitle && <text x={R} y={B + 32} textAnchor="end" fontSize="11" fill="var(--color-muted)">{m(v.xTitle)}</text>}
      {v.yTitle && <text x={L - 36} y={12} fontSize="12" fontWeight={700} fill="var(--color-muted)">{m(v.yTitle)}</text>}
    </svg>
  );
}

/** The balance: whatever you do to one pan, you do to the other. */
function BalanceView({ v, describe }: { v: Extract<Visual, { type: 'balance' }>; describe: string }) {
  return (
    <svg viewBox="0 0 360 150" className="w-full max-w-md mx-auto block" role="img" aria-label={describe} data-testid="balance">
      <path d="M 180 40 L 165 140 H 195 Z" fill="var(--color-border)" />
      <line x1={50} y1={40} x2={310} y2={40} stroke="var(--color-fg)" strokeWidth={4} strokeLinecap="round" />
      <circle cx={180} cy={40} r={6} fill="var(--color-fg)" />
      {[[90, v.left], [270, v.right]].map(([x, txt]) => (
        <g key={x as number}>
          <line x1={(x as number) - 50} y1={40} x2={(x as number) - 60} y2={92} stroke="var(--color-muted)" strokeWidth={1.5} />
          <line x1={(x as number) + 50} y1={40} x2={(x as number) + 60} y2={92} stroke="var(--color-muted)" strokeWidth={1.5} />
          <rect x={(x as number) - 72} y={86} width={144} height={34} rx={12} fill="var(--color-accent-pale)" stroke="var(--color-accent)" strokeWidth={2} />
          <text x={x as number} y={109} textAnchor="middle" fontSize="18" fontWeight={900} fill="var(--color-fg)">{txt as string}</text>
        </g>
      ))}
    </svg>
  );
}

/** A data table (timetable, class marks, a list put in order). Real table markup so screen readers can move through it. */
function TableView({ v, describe }: { v: Extract<Visual, { type: 'table' }>; describe: string }) {
  const { m } = useT();
  const txt = (x: string | Msg) => (typeof x === 'string' ? x : m(x));
  const on = (r: number, c: number) => (v.mark && v.mark[0] === r && v.mark[1] === c) || (v.mark2 && v.mark2[0] === r && v.mark2[1] === c);
  const cell = (r: number, c: number, head: boolean): React.CSSProperties => ({
    padding: '6px 10px', border: '1.5px solid var(--color-border)', textAlign: c === 0 && v.rows.length ? 'left' : 'center',
    fontWeight: head || c === 0 ? 800 : 600, fontSize: 17,
    background: on(r, c) ? 'var(--color-peach-pale)' : head ? 'var(--color-accent-pale)' : 'var(--color-card)',
    outline: on(r, c) ? '3px solid var(--color-peach)' : undefined, outlineOffset: -3,
  });
  return (
    <div className="overflow-x-auto" data-testid="table">
      <table aria-label={describe} style={{ borderCollapse: 'collapse', margin: '0 auto', color: 'var(--color-fg)', borderRadius: 12 }}>
        <thead><tr>{v.head.map((h, c) => <th key={c} scope="col" style={cell(-1, c, true)}>{txt(h)}</th>)}</tr></thead>
        {v.rows.length > 0 && <tbody>{v.rows.map((row, r) => <tr key={r}>{row.map((x, c) => c === 0 ? <th key={c} scope="row" style={cell(r, c, false)}>{txt(x)}</th> : <td key={c} style={cell(r, c, false)}>{txt(x)}</td>)}</tr>)}</tbody>}
      </table>
    </div>
  );
}

export function VisualView({ v, describe }: { v: Visual; describe: string }) {
  if (v.type === 'table') return <TableView v={v} describe={describe} />;
  if (v.type === 'emoji') return <EmojiView v={v} describe={describe} />;
  if (v.type === 'clock') return <ClockView v={v} describe={describe} />;
  if (v.type === 'shape') return <ShapeView v={v} describe={describe} />;
  if (v.type === 'frac') return <FracView v={v} describe={describe} />;
  if (v.type === 'grid') return <GridView v={v} describe={describe} />;
  if (v.type === 'line') return <NumberLine v={v} describe={describe} />;
  if (v.type === 'bars') return <BarsView v={v} describe={describe} />;
  if (v.type === 'ladder') return <LadderView v={v} describe={describe} />;
  if (v.type === 'chart') return <ChartView v={v} describe={describe} />;
  if (v.type === 'balance') return <BalanceView v={v} describe={describe} />;
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
