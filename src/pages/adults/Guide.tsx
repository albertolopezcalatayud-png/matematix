import { useT } from '@/i18n';
import { TopBar } from '@/components/Layout';
import { Bullets } from '@/components/Bullets';
import { useState } from 'react';
import { useApp } from '@/stores/app';
import { LessonExample, LessonPicker } from '@/components/LessonPicker';

/** Hands-on ideas: maths topics, then science and technology. */
const HANDS: [string, string, string][] = [['isl_A', '📏', 'A'], ['isl_B', '🧩', 'B'], ['isl_C', '🧠', 'C'], ['isl_D', '🍕', 'D'], ['isl_E', '🔬', 'E'], ['isl_F', '🛒', 'F'], ['sub_science', '🧪', 'S'], ['sub_tech', '🛠️', 'T']];

/** A short guide: what to watch for (never a diagnosis), what to do, classroom measures, screens in moderation,
 *  hands-on ideas and the worked example of any lesson. */
export default function Guide() {
  const { t } = useT();
  const course = useApp((s) => s.course);
  const [lesson, setLesson] = useState<string | null>(useApp.getState().lastLesson);
  const sec = (h: string, body: string, icon: string) => (
    <section className="card space-y-2"><h2 className="font-extrabold">{icon} {t(h)}</h2><Bullets text={t(body)} /></section>
  );
  return (
    <div className="min-h-dvh pb-10">
      <TopBar title={t('sec_guide')} back="/adultos" />
      <main className="max-w-xl mx-auto px-4 space-y-4" data-testid="guide">
        {sec('g_alert_h', 'g_alert', '👀')}
        {sec('g_do_h', 'g_do', '🤝')}
        {sec('g_class_h', 'g_class', '🏫')}
        <section className="card space-y-2"><h2 className="font-extrabold">⏳ {t('g_screen_h')}</h2><p className="text-base">{t('g_screen')}</p></section>
        <section className="card space-y-3"><h2 className="font-extrabold">✋ {t('sec_hands')}</h2>
          {HANDS.map(([k, e, id]) => <div key={id}><h3 className="font-bold">{e} {t(k)}</h3><Bullets text={t(`hands_${id}`)} /></div>)}
        </section>
        <section className="card space-y-3"><h2 className="font-extrabold">🪜 {t('sec_explain')}</h2><LessonPicker value={lesson} onChange={setLesson} startCourse={course} testId="guide-pick" /><LessonExample id={lesson} /></section>
      </main>
    </div>
  );
}
