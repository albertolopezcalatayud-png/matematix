import { useEffect, useState } from 'react';
import { useT } from '@/i18n';
import { CATALOG, courseOf, findLesson, lessonsOf, loadLesson, tr } from '@/course';
import type { LessonContent } from '@/course/types';
import { courseKey } from './CoursePicker';
import { VisualView } from './Visuals';
import { describe } from './describe';

const SEL = 'w-full rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-card)] px-3 min-h-12';

/** Choose a lesson: school year → subject → lesson (grouped by block). Starts from the given lesson or year. */
export function LessonPicker({ value, onChange, startCourse, testId }: { value: string | null; onChange: (id: string) => void; startCourse?: string | null; testId?: string }) {
  const { t, lang } = useT();
  const found = value ? findLesson(value) : undefined;
  const [course, setCourse] = useState(found?.course.id ?? startCourse ?? CATALOG[0].id);
  const c = courseOf(course) ?? CATALOG[0];
  const [subj, setSubj] = useState(found?.subject.code ?? c.subjects[0].code);
  const s = c.subjects.find((x) => x.code === subj) ?? c.subjects[0];
  useEffect(() => { if (!value || findLesson(value)?.subject !== s) onChange(lessonsOf(s)[0].id); }, [course, subj]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="grid gap-2" data-testid={testId}>
      <label className="block"><span className="text-sm">{t('lp_course')}</span>
        <select className={SEL} value={course} onChange={(e) => { const nc = courseOf(e.target.value)!; setCourse(nc.id); setSubj(nc.subjects[0].code); }} data-testid={testId && `${testId}-course`}>
          {CATALOG.map((x) => <option key={x.id} value={x.id}>{t(courseKey(x.id))}</option>)}
        </select></label>
      <label className="block"><span className="text-sm">{t('lp_subject')}</span>
        <select className={SEL} value={s.code} onChange={(e) => setSubj(e.target.value)} data-testid={testId && `${testId}-subject`}>
          {c.subjects.map((x) => <option key={x.code} value={x.code}>{tr(lang, x.title)}</option>)}
        </select></label>
      <label className="block"><span className="text-sm">{t('lp_lesson')}</span>
        <select className={SEL} value={value ?? ''} onChange={(e) => onChange(e.target.value)} data-testid={testId && `${testId}-lesson`}>
          {s.blocks.map((b, i) => <optgroup key={i} label={tr(lang, b.title)}>{b.lessons.map((l) => <option key={l.id} value={l.id}>{tr(lang, l.title)}</option>)}</optgroup>)}
        </select></label>
    </div>
  );
}

/** Loads a lesson's content (explanation, worked example, exercises). */
export function useLessonContent(id: string | null) {
  const [content, setContent] = useState<LessonContent | undefined>();
  useEffect(() => { let on = true; setContent(undefined); if (id) void loadLesson(id).then((c) => on && setContent(c)); return () => { on = false; }; }, [id]);
  return content;
}

/** The idea of a lesson and its worked example, step by step (large print for the whiteboard). */
export function LessonExample({ id, big = false }: { id: string | null; big?: boolean }) {
  const { t, lang } = useT();
  const content = useLessonContent(id);
  if (!id || !content) return <p className="text-[var(--color-muted)]">…</p>;
  const size = big ? 'text-2xl' : 'text-base';
  return (
    <div className="space-y-3" data-testid="lesson-example">
      {content.explain.map((e, i) => <p key={i} className={`${size} leading-relaxed`}>{tr(lang, e)}</p>)}
      <div className="rounded-2xl p-3 bg-[var(--color-sky-pale)] space-y-2">
        <p className={`${size} font-extrabold`}>{tr(lang, content.example.q)}</p>
        {content.example.visual && <div className={big ? 'max-w-2xl' : 'max-w-md'}><VisualView v={content.example.visual} describe={describe(t, content.example.visual)} /></div>}
        <ol className="space-y-2">
          {content.example.steps.map((st, i) => (
            <li key={i} className={`flex gap-3 items-start ${size}`}>
              <span className="shrink-0 w-8 h-8 rounded-full bg-[var(--color-accent)] text-white font-extrabold grid place-items-center text-base" aria-hidden>{i + 1}</span>
              <span>{tr(lang, st)}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
