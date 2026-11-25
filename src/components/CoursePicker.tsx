import { useT } from '@/i18n';
import { COURSE_IDS } from '@/course';

/** The message key of a school year's name (1P → course_p1, 1E → course_s1). */
export const courseKey = (id: string) => `course_${id.endsWith('P') ? 'p' : 's'}${id[0]}`;

/** School years in two columns (Primaria / ESO), big pastel buttons. */
export function CoursePicker({ value, onPick }: { value?: string | null; onPick: (id: string) => void }) {
  const { t } = useT();
  const col = (suffix: 'P' | 'E', label: string, island: string) => (
    <div className="space-y-2" data-island={island}>
      <p className="text-sm font-extrabold text-center" style={{ color: 'var(--isl)' }}>{label}</p>
      {COURSE_IDS.filter((c) => c.endsWith(suffix)).map((c) => (
        <button key={c} onClick={() => onPick(c)} data-testid={`course-${c}`} aria-pressed={value === c}
          className={`w-full min-h-14 rounded-2xl font-extrabold text-lg border-2 transition ${value === c ? 'text-white' : ''}`}
          style={value === c ? { background: 'var(--isl)', borderColor: 'var(--isl)' } : { background: 'var(--isl-pale)', borderColor: 'transparent', color: 'var(--isl)' }}>
          {t(courseKey(c))}
        </button>
      ))}
    </div>
  );
  return (
    <div className="grid grid-cols-2 gap-3" role="group" aria-label={t('course_q')}>
      {col('P', t('course_primary'), 'B')}
      {col('E', t('course_eso'), 'C')}
    </div>
  );
}
