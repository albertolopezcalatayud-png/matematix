/**
 * Chispa: an original little glow-bug that lights up the number line (that is what "encender" means in the app).
 * Moods: happy (default), cheer (got it right), think (let's look again), wave (hello). Decorative: aria-hidden;
 * whatever she "says" is always written next to her too.
 */
export type Mood = 'happy' | 'cheer' | 'think' | 'wave';

export function Mascot({ mood = 'happy', size = 96, className = '' }: { mood?: Mood; size?: number; className?: string }) {
  const armsUp = mood === 'cheer';
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} aria-hidden className={`mascot mascot-${mood} ${className}`}>
      <defs>
        <radialGradient id="mx-glow" cx="50%" cy="55%" r="50%">
          <stop offset="0%" stopColor="#FFE9A8" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FFE9A8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="mx-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFDA80" />
          <stop offset="100%" stopColor="#FFB547" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="66" r="54" fill="url(#mx-glow)" className="mascot-glow" />
      {/* wings */}
      <ellipse cx="34" cy="50" rx="17" ry="11" fill="#C9C0FF" opacity=".75" transform="rotate(-28 34 50)" className="mascot-wing" />
      <ellipse cx="86" cy="50" rx="17" ry="11" fill="#C9C0FF" opacity=".75" transform="rotate(28 86 50)" className="mascot-wing" />
      {/* antennae with tiny stars */}
      <path d="M50 34 Q44 20 38 16" stroke="#5B4BC4" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M70 34 Q76 20 82 16" stroke="#5B4BC4" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M38 10 l2 4 4.5 .5-3.3 3 1 4.4-4.2-2.3-4.2 2.3 1-4.4-3.3-3 4.5-.5z" fill="#FFC861" stroke="#E69A1E" strokeWidth="1" />
      <path d="M82 10 l2 4 4.5 .5-3.3 3 1 4.4-4.2-2.3-4.2 2.3 1-4.4-3.3-3 4.5-.5z" fill="#FFC861" stroke="#E69A1E" strokeWidth="1" />
      {/* arms */}
      {armsUp ? (
        <>
          <path d="M33 70 Q20 58 22 44" stroke="#F29E2E" strokeWidth="7" fill="none" strokeLinecap="round" />
          <path d="M87 70 Q100 58 98 44" stroke="#F29E2E" strokeWidth="7" fill="none" strokeLinecap="round" />
        </>
      ) : mood === 'wave' ? (
        <>
          <path d="M33 74 Q24 82 26 90" stroke="#F29E2E" strokeWidth="7" fill="none" strokeLinecap="round" />
          <path d="M87 70 Q100 60 100 46" stroke="#F29E2E" strokeWidth="7" fill="none" strokeLinecap="round" className="mascot-wave" />
        </>
      ) : mood === 'think' ? (
        <>
          <path d="M33 74 Q24 82 26 90" stroke="#F29E2E" strokeWidth="7" fill="none" strokeLinecap="round" />
          <path d="M87 74 Q84 88 72 86" stroke="#F29E2E" strokeWidth="7" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M33 74 Q24 82 26 90" stroke="#F29E2E" strokeWidth="7" fill="none" strokeLinecap="round" />
          <path d="M87 74 Q96 82 94 90" stroke="#F29E2E" strokeWidth="7" fill="none" strokeLinecap="round" />
        </>
      )}
      {/* body */}
      <ellipse cx="60" cy="70" rx="30" ry="33" fill="url(#mx-body)" stroke="#E69A1E" strokeWidth="2" />
      <ellipse cx="60" cy="86" rx="16" ry="11" fill="#FFF1C9" />
      {/* the little number line on her belly */}
      <path d="M50 89 H70 M52 86.5 V91.5 M60 87 V91 M68 86.5 V91.5" stroke="#8A7DF0" strokeWidth="1.8" strokeLinecap="round" /><circle cx="64" cy="89" r="2" fill="#5B4BC4" />
      {/* face */}
      {mood === 'think' ? (
        <>
          <circle cx="50" cy="60" r="4" fill="#262A40" />
          <circle cx="70" cy="60" r="4" fill="#262A40" />
          <path d="M45 52 l8 -2" stroke="#262A40" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="60" cy="70" r="3" fill="#262A40" />
        </>
      ) : (
        <>
          <ellipse cx="50" cy="59" rx="4" ry={mood === 'cheer' ? 2.5 : 4.5} fill="#262A40" />
          <ellipse cx="70" cy="59" rx="4" ry={mood === 'cheer' ? 2.5 : 4.5} fill="#262A40" />
          <circle cx="51.4" cy="57.4" r="1.3" fill="#fff" />
          <circle cx="71.4" cy="57.4" r="1.3" fill="#fff" />
          {mood === 'cheer' ? <path d="M51 67 Q60 77 69 67 Z" fill="#7A3B12" /> : <path d="M52 67 Q60 73 68 67" stroke="#262A40" strokeWidth="2.4" fill="none" strokeLinecap="round" />}
        </>
      )}
      <ellipse cx="43" cy="67" rx="4.5" ry="2.8" fill="#FFB98A" opacity=".8" />
      <ellipse cx="77" cy="67" rx="4.5" ry="2.8" fill="#FFB98A" opacity=".8" />
      {mood === 'cheer' && (
        <g className="mascot-sparks" fill="#FFC861">
          <path d="M14 30 l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" />
          <path d="M104 26 l1.6 4 4 1.6-4 1.6-1.6 4-1.6-4-4-1.6 4-1.6z" />
          <path d="M108 70 l1.4 3.5 3.5 1.4-3.5 1.4-1.4 3.5-1.4-3.5-3.5-1.4 3.5-1.4z" />
        </g>
      )}
    </svg>
  );
}

/** Chispa with a speech bubble. The text is real text (read by screen readers); the drawing is decoration. */
export function MascotSays({ mood = 'happy', children, size = 76, testId }: { mood?: Mood; children: React.ReactNode; size?: number; testId?: string }) {
  return (
    <div className="flex items-end gap-2" data-testid={testId}>
      <Mascot mood={mood} size={size} className="shrink-0 kid-only" />
      <div className="bubble flex-1">{children}</div>
    </div>
  );
}
