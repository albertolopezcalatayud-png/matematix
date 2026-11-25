import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useT } from '@/i18n';
import { lessonStatus, useApp } from '@/stores/app';
import { courseOf, SUBJ_COLOUR, SUBJ_EMOJI, tr } from '@/course';
import { CoursePicker, courseKey } from '@/components/CoursePicker';
import { TopBar } from '@/components/Layout';
import { BottomNav } from '@/components/BottomNav';
import { SubjectTiles, nextInSubject } from './Home';

/** Choose the school year (any year can be opened to go over it). */
export function CoursePage() {
  const { t } = useT();
  const s = useApp();
  const nav = useNavigate();
  return (
    <div className="min-h-dvh has-nav">
      <TopBar title={t('my_course')} back="/" gear={false} />
      <main className="max-w-xl mx-auto px-4 space-y-3">
        <section className="card space-y-3">
          <h2 className="text-xl font-extrabold text-center">{t('course_q')}</h2>
          <CoursePicker value={s.course} onPick={(id) => { s.set({ course: id }); nav('/materias'); }} />
          <p className="text-sm text-[var(--color-muted)] text-center">{t('course_pick_note')}</p>
        </section>
      </main>
      <BottomNav />
    </div>
  );
}

/** The subjects of the chosen school year. */
export function SubjectsPage() {
  const { t } = useT();
  const course = courseOf(useApp((s) => s.course));
  if (!course) return <Navigate to="/curso" replace />;
  return (
    <div className="min-h-dvh has-nav">
      <TopBar title={t('nav_subjects')} back="/" gear={false} />
      <main className="max-w-xl mx-auto px-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-extrabold">{t(courseKey(course.id))}</h2>
          <Link to="/curso" className="btn btn-ghost !min-h-10 text-sm" data-testid="change-course">{t('change_course')}</Link>
        </div>
        <SubjectTiles courseId={course.id} />
      </main>
      <BottomNav />
    </div>
  );
}

/** One subject: its blocks of contents, each with its lessons in order. */
export function SubjectPage() {
  const { c = '', s: code = '' } = useParams();
  const { t, lang } = useT();
  const lessons = useApp((st) => st.lessons);
  const course = courseOf(c);
  const subject = course?.subjects.find((x) => x.code === code);
  if (!course || !subject) return <Navigate to="/materias" replace />;
  const here = nextInSubject(subject, lessons).id;
  let n = 0;
  return (
    <div className="min-h-dvh has-nav lesson-bg" data-island={SUBJ_COLOUR[code]}>
      <TopBar title={`${SUBJ_EMOJI[code]} ${tr(lang, subject.title)} · ${t(courseKey(c))}`} back="/materias" gear={false} />
      <main className="max-w-xl mx-auto px-4 space-y-5">
        {subject.blocks.map((b, bi) => (
          <section key={bi} className="space-y-2" data-testid="block">
            <h2 className="text-lg font-extrabold flex items-center gap-2" style={{ color: 'var(--isl)' }}>
              <span className="lesson-num !w-8 !h-8 !rounded-xl text-sm" aria-hidden>{bi + 1}</span>{tr(lang, b.title)}
            </h2>
            <ol className="space-y-2">
              {b.lessons.map((l) => {
                n += 1;
                const p = lessons[l.id]; const st = lessonStatus(p);
                return (
                  <li key={l.id}>
                    <Link to={`/leccion/${l.id}`} className={`lesson-row ${l.id === here ? 'here' : ''} ${st === 'done' ? 'done' : ''}`} data-testid={`lesson-${l.id}`}>
                      <span className="lesson-num" aria-hidden>{st === 'done' ? '✓' : n}</span>
                      <span className="flex-1">
                        <span className="block font-extrabold leading-snug">{tr(lang, l.title)}</span>
                        <span className="block text-sm">
                          {l.id === here ? <b style={{ color: 'var(--isl)' }}>▶ {t('suggested')}</b> : t(`status_${st}`)}
                          {p && <span aria-label={`${p.lv}/3`}> · {[1, 2, 3].map((k) => (p.lv >= k ? '★' : '☆')).join('')}</span>}
                        </span>
                      </span>
                      <span aria-hidden className="text-xl" style={{ color: 'var(--isl)' }}>›</span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </main>
      <BottomNav />
    </div>
  );
}
