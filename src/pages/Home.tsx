import { Link, Navigate } from 'react-router-dom';
import { useT } from '@/i18n';
import { lessonStatus, useApp } from '@/stores/app';
import { courseOf, findLesson, lessonsOf, SUBJ_COLOUR, SUBJ_EMOJI, tr } from '@/course';
import type { Subject } from '@/course/types';
import { CoursePicker, courseKey } from '@/components/CoursePicker';
import { MascotSays } from '@/components/Mascot';
import { APP_NAME } from '@/config';
import { BottomNav } from '@/components/BottomNav';

/** The lesson to carry on with in a subject: the first one not yet complete. */
export function nextInSubject(subject: Subject, lessons: Record<string, { lv: number; runs: number } | undefined>) {
  const all = lessonsOf(subject);
  return all.find((l) => lessonStatus(lessons[l.id] as never) !== 'done') ?? all[all.length - 1];
}

/** The subjects of a course as big pastel tiles, each with how much is complete. */
export function SubjectTiles({ courseId }: { courseId: string }) {
  const { t, lang } = useT();
  const lessons = useApp((s) => s.lessons);
  const course = courseOf(courseId)!;
  return (
    <div className="grid grid-cols-1 gap-2">
      {course.subjects.map((s) => {
        const all = lessonsOf(s);
        const done = all.filter((l) => lessonStatus(lessons[l.id]) === 'done').length;
        return (
          <Link key={s.code} to={`/materia/${course.id}/${s.code}`} data-island={SUBJ_COLOUR[s.code]} className="tile flex items-center gap-3 !p-4" data-testid={`subject-${s.code}`}>
            <span className="text-4xl" aria-hidden>{SUBJ_EMOJI[s.code]}</span>
            <span className="flex-1 space-y-1">
              <span className="block text-lg font-extrabold leading-tight" style={{ color: 'var(--isl)' }}>{tr(lang, s.title)}</span>
              <span className="block text-sm">{t('lessons_done', { d: done, n: all.length })}</span>
              <span className="tile-bar block"><i style={{ width: `${(done / all.length) * 100}%` }} /></span>
            </span>
            <span aria-hidden className="text-2xl" style={{ color: 'var(--isl)' }}>›</span>
          </Link>
        );
      })}
    </div>
  );
}

/**
 * Home: the school year, one clear thing to do (carry on with the last lesson) and the subjects of that year.
 * A first-time pupil just chooses the school year.
 */
export default function Home() {
  const { t, lang } = useT();
  const s = useApp();
  if (!s.role) return <Navigate to="/quien" replace />;
  const pupil = s.active ? s.pupils[s.active] : undefined;
  const course = courseOf(s.course);

  const header = (
    <header className="flex items-center gap-3 pt-2">
      <img src="./favicon.svg" alt="" className="w-11 h-11" />
      <div className="flex-1">
        <h1 className="text-2xl font-extrabold leading-none">{APP_NAME}</h1>
        <p className="text-sm text-[var(--color-muted)]">{t('tagline')}</p>
      </div>
      {pupil && <span className="chip !text-base" data-testid="who-now">{pupil.emoji} {pupil.alias}</span>}
    </header>
  );

  if (!course) {
    return (
      <main className="min-h-dvh max-w-md mx-auto px-5 py-6 flex flex-col gap-4 world-bg has-nav">
        {header}
        <MascotSays mood="wave" size={84}><span className="text-lg">{t('mascot_hello')}</span></MascotSays>
        <section className="card space-y-3" data-testid="course-pick">
          <h2 className="text-xl font-extrabold text-center">{t('course_q')}</h2>
          <CoursePicker value={s.course} onPick={(id) => s.set({ course: id })} />
          <p className="text-sm text-[var(--color-muted)] text-center">{t('course_pick_note')}</p>
        </section>
        <BottomNav />
      </main>
    );
  }

  // carry on: the last lesson if it belongs to this year and is not complete; otherwise the first subject's next lesson
  const last = s.lastLesson ? findLesson(s.lastLesson) : undefined;
  const target = last && last.course.id === course.id
    ? (lessonStatus(s.lessons[last.lesson.id]) === 'done' ? nextInSubject(last.subject, s.lessons) : last.lesson)
    : nextInSubject(course.subjects[0], s.lessons);
  const where = findLesson(target.id)!;
  const fresh = Object.keys(s.lessons).length === 0;
  const lp = s.lessons[target.id];

  return (
    <main className="min-h-dvh max-w-md mx-auto px-5 py-6 flex flex-col gap-4 world-bg has-nav">
      {header}
      <MascotSays mood="happy" size={72}>{t('mascot_today')}</MascotSays>

      <Link to={`/leccion/${target.id}`} className="hero-card block" data-island={SUBJ_COLOUR[where.subject.code]} data-testid="carry-on">
        <p className="text-sm font-semibold opacity-90">{fresh ? t('first_lesson') : t('carry_on_with')} · {tr(lang, where.subject.title)} · {tr(lang, where.block.title)}</p>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-4xl" aria-hidden>{SUBJ_EMOJI[where.subject.code]}</span>
          <p className="flex-1 text-2xl font-extrabold leading-tight">{tr(lang, target.title)}</p>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg" aria-label={`${lp?.lv ?? 0}/3`}>{[1, 2, 3].map((n) => ((lp?.lv ?? 0) >= n ? '★' : '☆')).join('')}</span>
          <span className="rounded-full bg-white/90 text-[#262A40] px-5 py-2 text-xl font-extrabold">{lp ? t('carry_on') : t('start')} ▶</span>
        </div>
      </Link>

      <section className="space-y-2" aria-labelledby="h-subj">
        <div className="flex items-center justify-between gap-2">
          <h2 id="h-subj" className="text-lg font-extrabold">{t('subjects_of', { c: t(courseKey(course.id)) })}</h2>
          <Link to="/curso" className="text-sm font-bold text-[var(--color-accent)]" data-testid="change-course">{t('change_course')} ›</Link>
        </div>
        <SubjectTiles courseId={course.id} />
      </section>
      <BottomNav />
    </main>
  );
}
