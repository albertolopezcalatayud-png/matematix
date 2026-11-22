import { useNavigate } from 'react-router-dom';
import { translate } from '@/i18n';
import { useApp } from '@/stores/app';
import { speak } from '@/services/speech';
import type { Lang } from '@/engine/types';

const OPTS: { lang: Lang; name: string; hello: string }[] = [
  { lang: 'es', name: 'Castellano', hello: 'Hola. Vamos a practicar números.' },
  { lang: 'ca', name: 'Valencià', hello: 'Hola. Anem a practicar nombres.' },
  { lang: 'en', name: 'English (UK)', hello: "Hello. Let's practise numbers." },
];

export default function Language() {
  const set = useApp((s) => s.set);
  const current = useApp((s) => s.lang);
  const nav = useNavigate();
  return (
    <main className="min-h-dvh max-w-md mx-auto px-5 py-8 space-y-4">
      <h1 className="text-2xl font-extrabold text-center leading-snug">Elige el idioma · Tria l'idioma · Choose your language</h1>
      {OPTS.map((o) => (
        <div key={o.lang} className="flex gap-2">
          <button className={`btn flex-1 text-lg ${current === o.lang ? 'btn-primary' : 'btn-ghost'}`} data-testid={`lang-${o.lang}`}
            onClick={() => { set({ lang: o.lang }); if (current) nav(-1); else nav('/', { replace: true }); }}>{o.name}</button>
          <button className="btn btn-ghost" aria-label={`${o.name}: ${o.hello}`} onClick={() => void speak(o.lang, o.hello)}>🔊</button>
        </div>
      ))}
      <p className="text-center text-sm text-[var(--color-muted)]">{translate(current ?? 'es', 'lang_later')}</p>
    </main>
  );
}
