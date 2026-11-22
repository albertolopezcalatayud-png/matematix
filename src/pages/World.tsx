import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { STATIONS, stationById } from '@/data/stations';
import { FINDS, SPOT, litOf, reachOf, type Find } from '@/data/world';
import { useT } from '@/i18n';
import { statusOf, useApp } from '@/stores/app';
import { buzz, tone } from '@/services/sound';
import { speak } from '@/services/speech';
import { RestReminder } from '@/components/Layout';
import { APP_NAME } from '@/config';

const LOCALE = { es: 'es-ES', ca: 'ca-ES', en: 'en-GB' } as const;
const MIN_SPAN = 4; // decimals open later, with their own stations

type Sheet = { kind: 'station'; id: string } | { kind: 'find'; find: Find; tried: number[]; just?: boolean } | { kind: 'fog' } | { kind: 'opened'; n: number } | null;

/**
 * The home of the app: one number line you travel along. Drag to move, + and − (or pinch) to zoom, tap to measure.
 * Stations live where their numbers are; discoveries are real-world numbers hidden on the line;
 * the line opens further as the child masters stations, and what is mastered glows.
 */
export default function World() {
  const { t, m, lang } = useT();
  const nav = useNavigate();
  const progress = useApp((s) => s.progress);
  const suggested = useApp((s) => s.suggested);
  const found = useApp((s) => s.found);
  const sound = useApp((s) => s.sound);
  const storedReach = useApp((s) => s.reach);
  const set = useApp((s) => s.set);
  const find = useApp((s) => s.find);
  const reach = useMemo(() => reachOf(progress, suggested), [progress, suggested]);
  const lit = useMemo(() => litOf(progress), [progress]);

  const fmt = useCallback((v: number) => v.toLocaleString(LOCALE[lang]), [lang]);
  const cv = useRef<HTMLCanvasElement>(null);
  const [view, setView] = useState(() => {
    const focus = suggested ? SPOT[suggested] : useApp.getState().last ? SPOT[useApp.getState().last!] : 10;
    const span = focus > 20 ? 120 : 24;
    return { c: focus > 20 ? 50 : 10, s: span };
  });
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [probe, setProbe] = useState<number | null>(null);
  const [sheet, setSheet] = useState<Sheet>(null);

  // The line has opened further since last time: say so once
  useEffect(() => {
    if (reach <= storedReach) return;
    const mastered = Object.values(progress).some((p) => p.goodDays.length >= 2);
    if (mastered) { setSheet({ kind: 'opened', n: reach }); tone(reach, { chord: true, dur: 0.4, span: reach }); }
    set({ reach });
  }, [reach]); // eslint-disable-line react-hooks/exhaustive-deps

  const maxSpan = reach * 1.25 + 40;
  const clamp = useCallback((c: number, s: number) => {
    const span = Math.min(maxSpan, Math.max(MIN_SPAN, s));
    const left = -Math.min(30, span * 0.25); // a little room below 0, never a screen of nothing
    const right = reach * 1.2 + 10;
    const cc = Math.max(left + span / 2, Math.min(right - span / 2, c));
    return { c: span >= right - left ? (left + right) / 2 : cc, s: span };
  }, [maxSpan, reach]);

  const X = useCallback((v: number) => ((v - (view.c - view.s / 2)) / view.s) * size.w, [view, size.w]);
  const V = useCallback((x: number) => view.c - view.s / 2 + (x / size.w) * view.s, [view, size.w]);
  const lineY = size.h * 0.55;

  // ── drawing ──
  useEffect(() => {
    const el = cv.current; if (!el) return;
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el); return () => ro.disconnect();
  }, []);
  const step = useMemo(() => {
    if (!size.w) return 1;
    const raw = view.s / Math.max(4, size.w / 64), mag = Math.pow(10, Math.floor(Math.log10(raw))), n = raw / mag;
    return Math.max(1, (n < 1.5 ? 1 : n < 3.5 ? 2 : n < 7.5 ? 5 : 10) * mag);
  }, [view.s, size.w]);

  useEffect(() => {
    const el = cv.current; if (!el || !size.w) return;
    const dpr = window.devicePixelRatio || 1;
    el.width = size.w * dpr; el.height = size.h * dpr;
    const g = el.getContext('2d')!; g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, size.w, size.h);
    const css = getComputedStyle(document.documentElement);
    const ink = css.getPropertyValue('--color-fg').trim() || '#262A40';
    const y = lineY, a = view.c - view.s / 2, b = view.c + view.s / 2;
    // fog beyond what is open
    const xr = X(reach);
    if (xr < size.w) {
      g.save(); g.fillStyle = css.getPropertyValue('--color-accent-pale').trim() || '#EDEAFF'; g.globalAlpha = 0.75; g.fillRect(Math.max(0, xr), 0, size.w - Math.max(0, xr), size.h); g.restore();
    }
    // golden stretches already mastered
    for (const [l, r] of lit) {
      const x1 = Math.max(-20, X(l)), x2 = Math.min(size.w + 20, X(r));
      if (x2 > x1) { g.save(); g.shadowColor = '#FFB547'; g.shadowBlur = 18; g.strokeStyle = '#FFC861'; g.lineWidth = 14; g.lineCap = 'round'; g.beginPath(); g.moveTo(x1, y); g.lineTo(x2, y); g.stroke(); g.restore(); }
    }
    g.strokeStyle = ink; g.fillStyle = ink; g.lineCap = 'round';
    g.lineWidth = 4; g.beginPath(); g.moveTo(-10, y); g.lineTo(size.w + 10, y); g.stroke();
    // minor ticks every unit when there is room, then majors with labels
    const unit = step >= 10 ? step / 5 : step >= 2 ? 1 : 0;
    if (unit) { g.lineWidth = 1.5; for (let v = Math.ceil(a / unit) * unit; v <= b; v += unit) { const x = X(v); g.beginPath(); g.moveTo(x, y - 6); g.lineTo(x, y + 6); g.stroke(); } }
    g.font = '800 15px Lexend, system-ui, sans-serif'; g.textAlign = 'center'; g.lineWidth = 3;
    for (let v = Math.ceil(a / step) * step; v <= b; v += step) {
      const vv = Math.round(v) === 0 ? 0 : Math.round(v), x = X(vv);
      g.beginPath(); g.moveTo(x, y - 13); g.lineTo(x, y + 13); g.stroke();
      g.fillText(fmt(vv), x, y + 36);
    }
    // the probe: a bar from 0 to the number you touched (the number is a distance)
    if (probe != null) {
      const peach = css.getPropertyValue('--color-peach').trim() || '#B8573C';
      g.save(); g.strokeStyle = peach; g.fillStyle = peach; g.globalAlpha = 0.9; g.lineWidth = 8;
      g.beginPath(); g.moveTo(X(0), y + 58); g.lineTo(X(probe), y + 58); g.stroke();
      g.beginPath(); g.arc(X(probe), y, 10, 0, Math.PI * 2); g.fill();
      g.font = '900 22px Lexend, system-ui, sans-serif'; g.fillText(fmt(probe), X(probe), y - 24); g.restore();
    }
  }, [view, size, lineY, step, lit, reach, probe, X, fmt]);

  // ── gestures ──
  const ptrs = useRef(new Map<number, number>());
  const gesture = useRef({ moved: 0, pinch: 0 });
  const zoomAt = useCallback((px: number, f: number) => {
    setView((cur) => { const v0 = cur.c - cur.s / 2 + (px / (size.w || 1)) * cur.s; const s = cur.s * f; return clamp(v0 - (px / (size.w || 1) - 0.5) * s, s); });
  }, [clamp, size.w]);
  const glide = useCallback((to: { c: number; s: number }) => {
    const from = view, n = useApp.getState().motion === 'reduce' || matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 18; let k = 0;
    const id = window.setInterval(() => {
      k++; const e = 1 - Math.pow(1 - k / n, 3);
      setView(clamp(from.c + (to.c - from.c) * e, Math.exp(Math.log(from.s) + (Math.log(to.s) - Math.log(from.s)) * e)));
      if (k >= n) window.clearInterval(id);
    }, 16);
  }, [view, clamp]);
  useEffect(() => { setView((v) => clamp(v.c, v.s)); }, [clamp]);

  const onDown = (e: React.PointerEvent) => { (e.target as Element).setPointerCapture(e.pointerId); ptrs.current.set(e.pointerId, e.nativeEvent.offsetX); gesture.current = { moved: 0, pinch: 0 }; setSheet(null); };
  const onMove = (e: React.PointerEvent) => {
    const p = ptrs.current; if (!p.has(e.pointerId)) return;
    const prev = p.get(e.pointerId)!, x = e.nativeEvent.offsetX; p.set(e.pointerId, x);
    if (p.size === 1) { gesture.current.moved += Math.abs(x - prev); const dx = x - prev; setView((cur) => clamp(cur.c - (dx / (size.w || 1)) * cur.s, cur.s)); }
    else if (p.size === 2) { const xs = [...p.values()], d = Math.max(10, Math.abs(xs[0] - xs[1])); if (gesture.current.pinch) zoomAt((xs[0] + xs[1]) / 2, gesture.current.pinch / d); gesture.current.pinch = d; gesture.current.moved = 99; }
  };
  const onUp = (e: React.PointerEvent) => {
    const p = ptrs.current;
    if (p.size === 1 && gesture.current.moved < 6) {
      const v = Math.round(V(e.nativeEvent.offsetX));
      if (v > reach) { setSheet({ kind: 'fog' }); }
      else { setProbe(v); tone(v, { span: view.s }); buzz(); if (useApp.getState().voice) void speak(lang, v < 0 ? t('w_measure_neg', { n: fmt(v), m: fmt(-v) }) : t('w_measure', { n: fmt(v) })); }
    }
    p.delete(e.pointerId); if (p.size < 2) gesture.current.pinch = 0;
  };
  const onWheel = (e: React.WheelEvent) => zoomAt(e.nativeEvent.offsetX, Math.exp(e.deltaY * 0.0016));

  // ── markers (stations above the line, discoveries below), laid out in rows so they never overlap ──
  type Mk = { key: string; x: number; label: string; cls: string; onClick: () => void; side: 'up' | 'down' };
  const markers: Mk[] = [];
  const a = view.c - view.s / 2, b = view.c + view.s / 2;
  for (const s of STATIONS) {
    const v = SPOT[s.id]; if (v < a || v > b || view.s > Math.max(60, v * 12)) continue;
    const st = statusOf(progress[s.id]);
    markers.push({ key: s.id, x: X(v), side: 'up', label: `${st === 'done' ? '★ ' : ''}${m(s.title)}`,
      cls: `${s.island === 'A' ? 'mk-a' : 'mk-b'} ${st === 'done' ? 'mk-done' : ''} ${suggested === s.id ? 'mk-sugg' : ''} ${v > reach ? 'mk-fog' : ''}`,
      onClick: () => { setSheet({ kind: 'station', id: s.id }); tone(v, { chord: true, span: view.s }); } });
  }
  for (const f of FINDS) {
    if (f.v < a || f.v > b || f.v > reach || view.s > Math.max(40, Math.abs(f.v) * 8) || view.s < Math.abs(f.v) * 0.05) continue;
    const got = found.includes(f.v);
    markers.push({ key: f.id, x: X(f.v), side: 'down', label: got ? `✦ ${t(`fd_${f.id}`)}` : '?', cls: got ? 'mk-find' : 'mk-find mk-q',
      onClick: () => { setSheet({ kind: 'find', find: f, tried: [] }); tone(f.v, { span: view.s }); } });
  }
  /** Lay out markers in rows without overlaps. The most useful go first (suggested, last used, in progress);
   *  whatever does not fit is grouped into a "+N" bubble that zooms in on that spot. */
  const placed = (side: 'up' | 'down') => {
    const maxRows = side === 'up' ? 4 : 2;
    const rank = (k: Mk) => (k.key === suggested ? 0 : k.key === useApp.getState().last ? 1 : progress[k.key]?.sessions ? 2 : 3);
    const rows: [number, number][][] = Array.from({ length: maxRows }, () => []);
    const out: (Mk & { row: number; w: number })[] = [];
    const left: Mk[] = [];
    for (const k of markers.filter((q) => q.side === side).sort((p, q) => rank(p) - rank(q) || p.x - q.x)) {
      const w = Math.min(150, 26 + k.label.length * 7.2), lo = k.x - w / 2 - 4, hi = k.x + w / 2 + 4;
      const r = rows.findIndex((row) => row.every(([a2, b2]) => hi < a2 || lo > b2));
      if (r < 0) { left.push(k); continue; }
      rows[r].push([lo, hi]); out.push({ ...k, row: r, w });
    }
    // group the rest by proximity
    left.sort((p, q) => p.x - q.x);
    const groups: Mk[][] = [];
    for (const k of left) { const g = groups.at(-1); if (g && k.x - g.at(-1)!.x < 60) g.push(k); else groups.push([k]); }
    for (const g of groups) {
      const x = g.reduce((acc, k) => acc + k.x, 0) / g.length;
      out.push({ key: `more-${side}-${Math.round(x)}`, x, side, row: side === 'up' ? maxRows : maxRows, w: 46, label: `+${g.length}`, cls: 'mk-more',
        onClick: () => { setSheet(null); const v = V(x); glide(clamp(v, view.s / 2.5)); } });
    }
    return out;
  };

  const stSheet = sheet?.kind === 'station' ? stationById(sheet.id) : null;

  return (
    <div className="h-dvh flex flex-col world-bg overflow-hidden">
      <header className="px-4 pt-3 pb-1 flex items-center gap-2 z-10">
        <Link to="/" className="font-extrabold text-lg flex-1">{APP_NAME}</Link>
        <Link to="/progreso" className="ib" aria-label={t('lit_title')} data-testid="to-progress">✦</Link>
        <button className="ib" aria-label={sound ? t('w_sound_on') : t('w_sound_off')} aria-pressed={sound} onClick={() => set({ sound: !sound })}>{sound ? '🔊' : '🔈'}</button>
        <Link to="/estaciones" className="ib" aria-label={t('w_list')}>☰</Link>
      </header>
      <RestReminder />
      <div className="relative flex-1 min-h-0">
        <canvas ref={cv} className="absolute inset-0 w-full h-full touch-none" data-testid="world" data-reach={reach}
          role="img" aria-label={`${t('w_title')}: ${fmt(Math.round(a))} – ${fmt(Math.round(b))}. ${t('w_hint')}`}
          onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={(e) => ptrs.current.delete(e.pointerId)} onWheel={onWheel} />
        <div className="absolute inset-0 pointer-events-none">
          {(['up', 'down'] as const).flatMap((side) => placed(side).map((k) => (
            <button key={k.key} data-testid={`mk-${k.key}`} onClick={k.onClick}
              className={`mk ${k.cls} pointer-events-auto absolute`} style={{ left: Math.max(k.w / 2 + 4, Math.min(size.w - k.w / 2 - 4, k.x)), top: side === 'up' ? lineY - 26 - k.row * 42 : lineY + 64 + k.row * 40, maxWidth: k.w }}>
              {k.label}
            </button>
          )))}
          {X(reach) < size.w - 40 && (
            <span className="absolute text-sm font-semibold text-[var(--color-accent)]" style={{ left: Math.max(8, X(reach) + 10), top: lineY - 70 }}>🔒 {t('w_fog')}</span>
          )}
        </div>
        <div className="absolute right-3 top-2 flex flex-col gap-2 z-10">
          <button className="ib" aria-label={t('zoom_in')} data-testid="zin" onClick={() => { setSheet(null); glide(clamp(view.c, view.s / 2.5)); }}>＋</button>
          <button className="ib" aria-label={t('zoom_out')} data-testid="zout" onClick={() => { setSheet(null); glide(clamp(view.c, view.s * 2.5)); }}>－</button>
          <button className="ib" aria-label={t('w_home')} data-testid="zhome" onClick={() => { setSheet(null); const f = suggested ? SPOT[suggested] : 10; glide(clamp(f > 20 ? 50 : 10, f > 20 ? 120 : 24)); }}>⌂</button>
        </div>
        <p className="absolute left-4 right-4 bottom-3 text-center text-xs text-[var(--color-muted)]">{t('w_hint')}</p>

        {sheet && (
          <div className="absolute left-3 right-3 bottom-3 card shadow-xl z-20 space-y-2 pop" role="dialog" aria-live="polite" data-testid="w-sheet">
            {stSheet && (() => {
              const st = statusOf(progress[stSheet.id]);
              return (<>
                <p className="text-sm text-[var(--color-muted)]">{t('w_station')} · {t(`status_${st}`)}</p>
                <h2 className="text-xl font-extrabold">{m(stSheet.title)}</h2>
                {SPOT[stSheet.id] > reach && <p className="text-sm">{t('w_locked')}</p>}
                <button className="btn btn-primary w-full" data-testid="w-go" onClick={() => nav(`/estacion/${stSheet.id}`)}>{t('w_go')}</button>
              </>);
            })()}
            {sheet.kind === 'find' && (() => {
              const f = sheet.find, got = found.includes(f.v), fact = t(`ff_${f.id}`, { n: fmt(f.v) });
              if (got) return (<>{sheet.just ? <p className="text-lg font-extrabold text-[var(--color-mint)]">✨ {t('find_got')}</p> : <p className="text-sm text-[var(--color-muted)]">✦ {t('finds')}</p>}<h2 className="text-xl font-extrabold">{fmt(f.v)}{f.unit ? ` ${f.unit}` : ''} · {t(`fd_${f.id}`)}</h2><p>{fact}</p>
                <button className="btn btn-ghost w-full" onClick={() => setSheet(null)}>{t('close')}</button></>);
              return (<>
                <h2 className="text-xl font-extrabold">{t(`fd_${f.id}`)}</h2>
                <p>{t(`ff_${f.id}`, { n: '___' })}</p>
                <p className="text-sm text-[var(--color-muted)]">{sheet.tried.length ? t('find_no') : t('find_q')}</p>
                <div className="grid grid-cols-3 gap-2">
                  {f.options.map((o) => (
                    <button key={o} className={`btn btn-ghost !text-lg ${sheet.tried.includes(o) ? '!bg-[var(--color-peach-pale)]' : ''}`} data-value={o} disabled={sheet.tried.includes(o)}
                      onClick={() => {
                        if (o === f.v) { find(f.v); setSheet({ ...sheet, just: true }); tone(f.v, { chord: true, dur: 0.35, span: view.s }); buzz(30); if (useApp.getState().voice) void speak(lang, t('find_got') + ' ' + fact); }
                        else { setSheet({ ...sheet, tried: [...sheet.tried, o] }); tone(o, { span: view.s }); }
                      }}>{fmt(o)}</button>
                  ))}
                </div>
              </>);
            })()}
            {sheet.kind === 'fog' && (<><p>🔒 {t('w_locked')}</p><button className="btn btn-ghost w-full" onClick={() => setSheet(null)}>{t('rest_ok')}</button></>)}
            {sheet.kind === 'opened' && (<><p className="text-2xl" aria-hidden>✨</p><h2 className="text-xl font-extrabold">{t('w_opened', { n: fmt(sheet.n) })}</h2>
              <button className="btn btn-primary w-full" onClick={() => { setSheet(null); glide(clamp(sheet.n / 2, sheet.n * 1.15)); }}>{t('zoom_out')}</button></>)}
          </div>
        )}
      </div>
    </div>
  );
}
