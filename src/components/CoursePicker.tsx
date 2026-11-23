import { useT } from '@/i18n';
import { COURSES } from '@/data/courses';

/** School years in two columns (Primaria / ESO), big pastel buttons. */
export function CoursePicker({ value, onPick }: { value?: string | null; onPick: (id: string) => void }) {
  const { t } = useT();
  const col = (prefix: 'p' | 's', label: string, island: string) => (
    <div className="space-y-2" data-island={island}>
      <p className="text-sm font-extrabold text-center" style={{ color: 'var(--isl)' }}>{label}</p>
      {COURSES.filter((c) => c.id.startsWith(prefix)).map((c) => (
        <button key={c.id} onClick={() => onPick(c.id)} data-testid={`course-${c.id}`} aria-pressed={value === c.id}
          className={`w-full min-h-14 rounded-2xl font-extrabold text-lg border-2 transition ${value === c.id ? 'text-white' : ''}`}
          style={value === c.id ? { background: 'var(--isl)', borderColor: 'var(--isl)' } : { background: 'var(--isl-pale)', borderColor: 'transparent', color: 'var(--isl)' }}>
          {t(`course_${c.id}`)}
        </button>
      ))}
    </div>
  );
  return (
    <div className="grid grid-cols-2 gap-3" role="group" aria-label={t('course_q')}>
      {col('p', t('course_primary'), 'B')}
      {col('s', t('course_eso'), 'C')}
    </div>
  );
}
