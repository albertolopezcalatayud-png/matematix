import type { Visual } from '@/engine/types';

const ACC = 'var(--color-accent)', FG = 'var(--color-fg)', MUTED = 'var(--color-muted)', PEACH = 'var(--color-peach)';
type V<K extends Visual['type']> = Extract<Visual, { type: K }>;

/** Objects in rows (counting, comparing, sorting): big emoji, never smaller than a fingertip. */
export function EmojiView({ v, describe }: { v: V<'emoji'>; describe: string }) {
  return (
    <div role="img" aria-label={describe} className="rounded-2xl bg-[var(--isl-pale,var(--color-card))] p-3 text-center space-y-1" data-testid="emoji">
      {v.rows.map((r, i) => <p key={i} className={`${v.big ? 'text-5xl' : 'text-3xl'} leading-snug tracking-wider break-words`}>{r}</p>)}
    </div>
  );
}

export function ClockView({ v, describe }: { v: V<'clock'>; describe: string }) {
  const R = 70, c = 80;
  const hand = (angle: number, len: number) => [c + len * Math.sin(angle), c - len * Math.cos(angle)];
  const [hx, hy] = hand(((v.h % 12) + v.m / 60) * (Math.PI / 6), R * 0.5);
  const [mx, my] = hand(v.m * (Math.PI / 30), R * 0.8);
  return (
    <svg viewBox="0 0 160 160" className="w-44 mx-auto block" role="img" aria-label={describe} data-testid="clock">
      <circle cx={c} cy={c} r={R} fill="var(--color-card)" stroke={ACC} strokeWidth={4} />
      {Array.from({ length: 60 }, (_, i) => { const [x1, y1] = hand(i * Math.PI / 30, R - (i % 5 ? 4 : 9)); const [x2, y2] = hand(i * Math.PI / 30, R - 1); return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={MUTED} strokeWidth={i % 5 ? 1 : 2.5} />; })}
      {Array.from({ length: 12 }, (_, i) => { const [x, y] = hand((i + 1) * Math.PI / 6, R - 20); return <text key={i} x={x} y={y + 5} textAnchor="middle" fontSize="14" fontWeight={800} fill={FG}>{i + 1}</text>; })}
      <line x1={c} y1={c} x2={hx} y2={hy} stroke={FG} strokeWidth={6} strokeLinecap="round" />
      <line x1={c} y1={c} x2={mx} y2={my} stroke={PEACH} strokeWidth={4} strokeLinecap="round" />
      <circle cx={c} cy={c} r={5} fill={FG} />
    </svg>
  );
}

export function ShapeView({ v, describe }: { v: V<'shape'>; describe: string }) {
  const c = 80, R = 58;
  let pts: [number, number][] = [];
  if (v.pts) {
    const xs = v.pts.map((p) => p[0]), ys = v.pts.map((p) => p[1]);
    const w = Math.max(...xs) - Math.min(...xs) || 1, h = Math.max(...ys) - Math.min(...ys) || 1, k = 120 / Math.max(w, h);
    pts = v.pts.map(([x, y]) => [20 + (x - Math.min(...xs)) * k + (120 - w * k) / 2, 140 - (y - Math.min(...ys)) * k - (120 - h * k) / 2]);
  } else if (v.sides) {
    pts = Array.from({ length: v.sides }, (_, i) => { const a = (i / v.sides!) * 2 * Math.PI - Math.PI / 2 + (v.sides === 4 ? Math.PI / 4 : 0); return [c + R * Math.cos(a), c + R * Math.sin(a)] as [number, number]; });
  }
  const fill = 'color-mix(in srgb, var(--isl, var(--color-accent)) 22%, transparent)';
  return (
    <svg viewBox="0 0 160 160" className="w-44 mx-auto block" role="img" aria-label={describe} data-testid="shape">
      {pts.length === 0
        ? <circle cx={c} cy={c} r={R} fill={fill} stroke={ACC} strokeWidth={3} strokeDasharray={v.dash ? '6 5' : undefined} />
        : <polygon points={pts.map((p) => p.join(',')).join(' ')} fill={fill} stroke={ACC} strokeWidth={3} strokeLinejoin="round" strokeDasharray={v.dash ? '6 5' : undefined} />}
      {v.labels && pts.map((p, i) => {
        const q = pts[(i + 1) % pts.length]; if (!v.labels![i]) return null;
        const mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2, dx = mx - c, dy = my - c, d = Math.hypot(dx, dy) || 1;
        return <text key={i} x={mx + (dx / d) * 14} y={my + (dy / d) * 14 + 5} textAnchor="middle" fontSize="13" fontWeight={800} fill={FG}>{v.labels![i]}</text>;
      })}
    </svg>
  );
}

export function FracView({ v, describe }: { v: V<'frac'>; describe: string }) {
  const wholes = v.wholes ?? Math.max(1, Math.ceil(v.n / v.d));
  const fill = 'var(--isl, var(--color-accent))', empty = 'var(--color-card)';
  if (v.shape === 'circle') {
    const r = 46;
    return (
      <svg viewBox={`0 0 ${wholes * 110} 104`} className="w-full max-w-xs mx-auto block" role="img" aria-label={describe} data-testid="frac">
        {Array.from({ length: wholes }, (_, w) => Array.from({ length: v.d }, (_, i) => {
          const k = w * v.d + i, a0 = (i / v.d) * 2 * Math.PI - Math.PI / 2, a1 = ((i + 1) / v.d) * 2 * Math.PI - Math.PI / 2, cx = 55 + w * 110, cy = 52;
          const p = v.d === 1 ? `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.01} ${cy - r} Z` : `M ${cx} ${cy} L ${cx + r * Math.cos(a0)} ${cy + r * Math.sin(a0)} A ${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${cx + r * Math.cos(a1)} ${cy + r * Math.sin(a1)} Z`;
          return <path key={`${w}-${i}`} d={p} fill={k < v.n ? fill : empty} stroke={FG} strokeWidth={2} />;
        }))}
      </svg>
    );
  }
  const W = 300, h = 40, gap = 10;
  return (
    <svg viewBox={`0 0 ${W + 4} ${wholes * (h + gap) + 4}`} className="w-full max-w-sm mx-auto block" role="img" aria-label={describe} data-testid="frac">
      {Array.from({ length: wholes }, (_, w) => Array.from({ length: v.d }, (_, i) => (
        <rect key={`${w}-${i}`} x={2 + (i * W) / v.d} y={2 + w * (h + gap)} width={W / v.d} height={h} fill={w * v.d + i < v.n ? fill : empty} stroke={FG} strokeWidth={2} />
      )))}
    </svg>
  );
}

export function GridView({ v, describe }: { v: V<'grid'>; describe: string }) {
  const cell = 28, pad = v.axes ? 26 : 8;
  const x0 = v.neg ? -v.w : 0, y0 = v.neg ? -v.h : 0, W = (v.neg ? 2 * v.w : v.w), H = (v.neg ? 2 * v.h : v.h);
  const X = (x: number) => pad + (x - x0) * cell, Y = (y: number) => pad / 2 + (H - (y - y0)) * cell;
  return (
    <svg viewBox={`0 0 ${W * cell + pad + 12} ${H * cell + pad + 10}`} className="w-full max-w-sm mx-auto block" role="img" aria-label={describe} data-testid="grid">
      {Array.from({ length: W + 1 }, (_, i) => <line key={`v${i}`} x1={X(x0 + i)} y1={Y(y0)} x2={X(x0 + i)} y2={Y(y0 + H)} stroke={MUTED} strokeOpacity={0.35} />)}
      {Array.from({ length: H + 1 }, (_, i) => <line key={`h${i}`} x1={X(x0)} y1={Y(y0 + i)} x2={X(x0 + W)} y2={Y(y0 + i)} stroke={MUTED} strokeOpacity={0.35} />)}
      {v.axes && <>
        <line x1={X(x0)} y1={Y(0)} x2={X(x0 + W)} y2={Y(0)} stroke={FG} strokeWidth={2} />
        <line x1={X(0)} y1={Y(y0)} x2={X(0)} y2={Y(y0 + H)} stroke={FG} strokeWidth={2} />
        {Array.from({ length: W + 1 }, (_, i) => <text key={`xl${i}`} x={X(x0 + i)} y={Y(0) + 16} textAnchor="middle" fontSize="11" fill={FG}>{x0 + i}</text>)}
        {Array.from({ length: H + 1 }, (_, i) => (y0 + i) !== 0 && <text key={`yl${i}`} x={X(0) - 8} y={Y(y0 + i) + 4} textAnchor="end" fontSize="11" fill={FG}>{y0 + i}</text>)}
      </>}
      {v.path && <polyline points={v.path.map(([x, y]) => `${X(x)},${Y(y)}`).join(' ')} fill="none" stroke={PEACH} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />}
      {v.pts?.map((p, i) => (
        <g key={i}><circle cx={X(p.x)} cy={Y(p.y)} r={7} fill={ACC} /><text x={X(p.x) + 9} y={Y(p.y) - 8} fontSize="14" fontWeight={800} fill={FG}>{p.label}</text></g>
      ))}
    </svg>
  );
}
