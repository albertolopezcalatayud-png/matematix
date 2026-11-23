import { useEffect, useRef, useState, type ReactNode } from 'react';

/** Opens only after being held down for `ms` (3 s): enough to keep young children out of the adults' area, with no
 *  password and no account. Works with touch, mouse and keyboard (hold Enter or Space). */
export function HoldButton({ onDone, children, ms = 3000, className = '', testId }: { onDone: () => void; children: ReactNode; ms?: number; className?: string; testId?: string }) {
  const [p, setP] = useState(0);
  const start = useRef<number | null>(null);
  const raf = useRef(0);
  const tick = () => {
    if (start.current == null) return;
    const v = Math.min(1, (performance.now() - start.current) / ms);
    setP(v);
    if (v >= 1) { start.current = null; setP(0); onDone(); return; }
    raf.current = requestAnimationFrame(tick);
  };
  const down = () => { if (start.current != null) return; start.current = performance.now(); raf.current = requestAnimationFrame(tick); };
  const up = () => { start.current = null; cancelAnimationFrame(raf.current); setP(0); };
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  return (
    <button type="button" className={`btn relative overflow-hidden select-none touch-none ${className}`} data-testid={testId}
      onPointerDown={down} onPointerUp={up} onPointerLeave={up} onPointerCancel={up} onContextMenu={(e) => e.preventDefault()}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); down(); } }} onKeyUp={up} onBlur={up}>
      <span aria-hidden className="absolute inset-y-0 left-0 bg-[var(--color-accent)] opacity-25" style={{ width: `${p * 100}%` }} />
      <span className="relative">{children}</span>
    </button>
  );
}
