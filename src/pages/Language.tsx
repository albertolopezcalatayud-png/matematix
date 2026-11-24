import { useNavigate } from 'react-router-dom';
import { useT } from '@/i18n';
import { useApp } from '@/stores/app';
import { speak } from '@/services/speech';
import { TopBar } from '@/components/Layout';
import type { Lang } from '@/engine/types';

const OPTS: { lang: Lang; name: string; hello: string }[] = [
  { lang: 'es', name: 'Castellano', hello: 'Hola. Vamos a practicar números.' },
  { lang: 'ca', name: 'Valencià', hello: 'Hola. Anem a practicar nombres.' },
  { lang: 'en', name: 'English (UK)', hello: "Hello. Let's practise numbers." },
];

/** Changing the language (from Settings or the first screen). The app always starts in castellano. */
export default function Language() {
  const { t } = useT();
  const set = useApp((s) => s.set);
  const current = useApp((s) => s.lang) ?? 'es';
  const nav = useNavigate();
  return (
    <div className="min-h-dvh pb-10">
      <TopBar title={`🌐 ${t('lang_title')}`} back="/ajustes" />
      <main className="max-w-md mx-auto px-5 space-y-3">
        {OPTS.map((o) => (
          <div key={o.lang} className="flex gap-2">
            <button className={`btn flex-1 text-lg ${current === o.lang ? 'btn-primary' : 'btn-ghost'}`} data-testid={`lang-${o.lang}`} aria-pressed={current === o.lang}
              onClick={() => { set({ lang: o.lang }); nav(-1); }}>{current === o.lang ? '✓ ' : ''}{o.name}</button>
            <button className="btn btn-ghost" aria-label={`${o.name}: ${o.hello}`} onClick={() => void speak(o.lang, o.hello)}>🔊</button>
          </div>
        ))}
      </main>
    </div>
  );
}
