import { Link } from 'react-router-dom';
import { useT } from '@/i18n';
import { lessonStatus, useApp } from '@/stores/app';
import { courseOf, lessonsOf, SUBJ_COLOUR, SUBJ_EMOJI, tr } from '@/course';
import { lastDays } from '@/course/progress';
import { courseKey } from '@/components/CoursePicker';
import { TopBar } from '@/components/Layout';
import { BottomNav } from '@/components/BottomNav';
import { esc, printPage } from '@/services/print';
import { APP_NAME } from '@/config';

/** "My progress": only the child sees it, on this device. The WWC recommends pupils chart their own progress.
 *  No marks and no comparisons: lessons complete and under way in each subject, and minutes practised. */
export default function Progress() {
  const { t, lang } = useT();
  const lessons = useApp((s) => s.lessons);
  const minutes = useApp((s) => s.minutes);
  const course = courseOf(useApp((s) => s.course));
  const days = lastDays(7);
  const week = days.reduce((a, d) => a + (minutes[d] ?? 0), 0);

  const printDone = () => {
    if (!course) return;
    const parts = course.subjects.map((s) => {
      const done = lessonsOf(s).filter((l) => lessonStatus(lessons[l.id]) === 'done');
      return done.length ? `<h2>${SUBJ_EMOJI[s.code] ?? ''} ${esc(tr(lang, s.title))}</h2><ul style="font-size:13pt;line-height:1.6">${done.map((l) => `<li>${esc(tr(lang, l.title))}</li>`).join('')}</ul>` : '';
    }).join('');
    printPage(lang, t('pr_print'), `<div style="border:2.5mm solid #FFE3A3;border-radius:8mm;padding:10mm;max-width:170mm;margin:auto">
      <h1>✦ ${t('h_week_title')}</h1><p>${esc(t(courseKey(course.id)))}</p>${parts || `<p style="font-size:14pt">${t('pr_none')}</p>`}<p class="small">${APP_NAME}</p></div>`);
  };

  return (
    <div className="min-h-dvh has-nav">
      <TopBar title={t('lit_title')} back="/" gear={false} />
      <main className="max-w-xl mx-auto px-4 space-y-4">
        <p className="rounded-2xl p-3 bg-[var(--color-mint-pale)]">🔒 {t('pr_intro')}</p>

        <div className="grid grid-cols-2 gap-2">
          <div className="card text-center"><p className="text-3xl font-extrabold">{minutes[days[0]] ?? 0}</p><p className="text-sm">{t('pr_today', { m: minutes[days[0]] ?? 0 })}</p></div>
          <div className="card text-center"><p className="text-3xl font-extrabold">{week}</p><p className="text-sm">{t('pr_week', { m: week })}</p></div>
        </div>

        {!course ? (
          <Link to="/curso" className="btn btn-primary w-full">{t('change_course')}</Link>
        ) : (
          <>
            <h2 className="text-lg font-extrabold">{t(courseKey(course.id))}</h2>
            {course.subjects.map((s) => {
              const all = lessonsOf(s); const st = all.map((l) => lessonStatus(lessons[l.id]));
              const d = st.filter((x) => x === 'done').length, g = st.filter((x) => x === 'doing').length;
              return (
                <section key={s.code} className="card space-y-2" data-island={SUBJ_COLOUR[s.code]} data-testid={`progress-${s.code}`}>
                  <h3 className="font-extrabold flex items-center gap-2"><span aria-hidden>{SUBJ_EMOJI[s.code]}</span><span className="flex-1">{tr(lang, s.title)}</span>
                    <span className="text-sm font-semibold">{t('pr_counts', { d, n: all.length })}</span></h3>
                  <div className="h-3 rounded-full bg-[var(--color-accent-pale)] overflow-hidden" role="img" aria-label={t('pr_counts', { d, n: all.length })}>
                    <i className="block h-full rounded-full" style={{ width: `${(d / all.length) * 100}%`, background: 'var(--isl)' }} />
                  </div>
                  {d + g > 0 && (
                    <ul className="space-y-1">
                      {all.filter((l) => lessonStatus(lessons[l.id]) !== 'todo').map((l) => {
                        const x = lessonStatus(lessons[l.id]);
                        return (
                          <li key={l.id}><Link to={`/leccion/${l.id}`} className="flex items-center gap-2 text-base">
                            <span className="flex-1">{tr(lang, l.title)}</span>
                            <span className={`text-xs font-semibold rounded-full px-2 py-1 ${x === 'done' ? 'bg-[#FFE7B0]' : 'bg-[var(--color-accent-pale)]'}`}>{x === 'done' ? '★ ' : ''}{t(`status_${x}`)}</span>
                          </Link></li>
                        );
                      })}
                    </ul>
                  )}
                </section>
              );
            })}
            <button className="btn btn-primary w-full" onClick={printDone} data-testid="print-done">🖨️ {t('pr_print')}</button>
          </>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
