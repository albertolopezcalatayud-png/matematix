import { useT } from '@/i18n';
import { ISLANDS } from '@/data/stations';
import { TopBar } from '@/components/Layout';
import { Bullets } from '@/components/Bullets';
import { ModelSteps } from '@/components/ModelSteps';

/** A short guide: what to watch for (never a diagnosis), what to do, classroom measures, screens in moderation,
 *  hands-on ideas per island and the worked example of every station. */
export default function Guide() {
  const { t } = useT();
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
          {ISLANDS.map((i) => <div key={i.id}><h3 className="font-bold">{i.emoji} {t(i.title)}</h3><Bullets text={t(`hands_${i.id}`)} /></div>)}
        </section>
        <section className="card space-y-3"><h2 className="font-extrabold">🪜 {t('sec_explain')}</h2><ModelSteps /></section>
      </main>
    </div>
  );
}
