import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isRight, stationById } from '@/data/stations';
import { rng } from '@/engine/rng';
import { useT } from '@/i18n';
import { useApp } from '@/stores/app';
import { speak } from '@/services/speech';
import { PlaceOnLine, VisualView } from '@/components/Visuals';
import { describe } from '@/components/describe';
import { TopBar } from '@/components/Layout';

/** "Find your starting point": a short check with no clock, no marks and no right/wrong shown. Rule-based, never a diagnosis,
 *  and the result is only a suggested station on the map. */
const PROBE = ['A1', 'A2', 'A4', 'A5', 'B2', 'B3', 'B5', 'B6'];

export default function StartPoint() {
  const { t, m, lang } = useT();
  const nav = useNavigate();
  const set = useApp((s) => s.set);
  const voice = useApp((s) => s.voice);
  const seed = useMemo(() => Date.now() >>> 0, []);
  const items = useMemo(() => PROBE.map((id, i) => ({ id, item: stationById(id)!.make(rng(seed + i * 31), false) })), [seed]);
  const [i, setI] = useState(0);
  const [value, setValue] = useState<number | null>(null);
  const [typed, setTyped] = useState('');
  const [found, setFound] = useState<string | null>(null);

  const finish = (id: string) => { set({ suggested: id }); setFound(id); };
  const answer = (v: number) => {
    const { id, item } = items[i];
    if (!isRight(item, v)) return finish(id);
    if (i + 1 >= items.length) return finish('B6');
    setI(i + 1); setValue(null); setTyped('');
  };

  if (found) {
    const st = stationById(found)!;
    return (
      <div className="min-h-dvh"><TopBar title={t('find_start')} back="/" />
        <main className="max-w-xl mx-auto px-4">
          <section className="card text-center space-y-4" data-testid="sp-result">
            <p>{t('sp_result')}</p>
            <p className="text-2xl font-extrabold">{m(st.title)}</p>
            <button className="btn btn-primary w-full" onClick={() => nav(`/estacion/${found}`)}>{t('sp_go')}</button>
            <button className="btn btn-ghost w-full" onClick={() => nav('/mapa')}>{t('sp_map')}</button>
          </section>
        </main>
      </div>
    );
  }

  const { item } = items[i];
  const prompt = m(item.prompt);
  return (
    <div className="min-h-dvh pb-10"><TopBar title={t('find_start')} back="/" />
      <main className="max-w-xl mx-auto px-4 space-y-4">
        <p className="rounded-2xl p-3 bg-[var(--color-mint-pale)]">{t('sp_intro')}</p>
        <section className="card space-y-4" key={i} data-testid="exercise" data-kind={item.kind} data-answer={item.kind === 'place' ? item.target : item.answer}>
          <div className="flex items-start gap-2">
            <h2 className="text-2xl font-extrabold flex-1" data-testid="prompt">{prompt}</h2>
            <button className="btn btn-ghost !min-h-11 !px-3" onClick={() => voice && void speak(lang, prompt)} aria-label={t('listen')}>🔊</button>
          </div>
          {item.kind !== 'place' && item.visual && <VisualView v={item.visual} describe={describe(t, item.visual)} />}
          {item.kind === 'place' && <PlaceOnLine v={{ type: 'line', min: item.min, max: item.max, marks: item.marks, labels: item.labels }} value={value} onChange={setValue} locked={false} good={null} label={prompt} />}
          {item.kind === 'choice' && (
            <div className={`grid gap-2 ${item.options.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`} data-testid="choices">
              {item.options.map((o) => <button key={o} data-value={o} className="btn btn-ghost !text-2xl !font-extrabold !min-h-16" onClick={() => answer(o)}>{o}</button>)}
            </div>
          )}
          {item.kind === 'number' && (
            <div className="space-y-2">
              <div className="text-center text-4xl font-extrabold rounded-2xl border-2 border-[var(--color-border)] min-h-16 flex items-center justify-center" data-testid="typed">{typed || '?'}</div>
              <div className="grid grid-cols-5 gap-2" data-testid="keypad">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d) => <button key={d} className="btn btn-ghost !text-2xl !font-extrabold !px-0" onClick={() => setTyped((s) => (s.length < 4 ? s + d : s))}>{d}</button>)}
                <button className="btn btn-ghost col-span-5" onClick={() => setTyped((s) => s.slice(0, -1))}>⌫ {t('delete')}</button>
              </div>
            </div>
          )}
          {item.kind !== 'choice' && (
            <button className="btn btn-primary w-full" data-testid="check" disabled={item.kind === 'place' ? value == null : typed === ''} onClick={() => answer(item.kind === 'place' ? value! : Number(typed))}>{t('next')}</button>
          )}
        </section>
        <button className="btn btn-ghost w-full" onClick={() => finish('A1')}>{t('sp_skip')}</button>
      </main>
    </div>
  );
}
