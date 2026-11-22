import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { STATIONS, isRight, itemKey, stationById } from '@/data/stations';
import { rng } from '@/engine/rng';
import { GUIDED, INDEPENDENT, pickItems } from '@/engine/session';
import type { Item } from '@/engine/types';
import { useT } from '@/i18n';
import { statusOf, useApp } from '@/stores/app';
import { speak, stopSpeech } from '@/services/speech';
import { PlaceOnLine, VisualView } from '@/components/Visuals';
import { describe } from '@/components/describe';
import { TopBar, RestReminder } from '@/components/Layout';


/** One station: worked example, then 2 guided, then 5 on your own. The order never changes, so the child knows what comes next. */
export default function Lesson() {
  const { id = 'A1' } = useParams();
  const station = stationById(id) ?? STATIONS[0];
  const { t, m, lang } = useT();
  const nav = useNavigate();
  const voice = useApp((s) => s.voice);
  const record = useApp((s) => s.record);
  const progress = useApp((s) => s.progress[station.id]);
  const [run, setRun] = useState(0);
  const seed = useMemo(() => (Date.now() ^ (run * 7919)) >>> 0, [run, station.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const model = useMemo(() => station.model(rng(seed)), [station, seed]);
  const markSeen = useApp((s) => s.markSeen);
  const items = useMemo(() => pickItems(station, seed, new Set(useApp.getState().seen[station.id] ?? [])), [station, seed]);
  useEffect(() => { markSeen(station.id, items.map((x) => itemKey(x.item))); }, [items]); // eslint-disable-line react-hooks/exhaustive-deps

  const [stage, setStage] = useState<'model' | 'items' | 'end'>(progress && progress.sessions > 0 ? 'items' : 'model');
  const [step, setStep] = useState(0);
  const [idx, setIdx] = useState(0);
  const [rightFirst, setRightFirst] = useState(0);
  const saved = useRef(false);

  useEffect(() => () => stopSpeech(), []);
  useEffect(() => { if (stage === 'model' && voice) void speak(lang, m(model.steps[step].say)); }, [stage, step]); // eslint-disable-line react-hooks/exhaustive-deps

  const restart = () => { saved.current = false; setRun((r) => r + 1); setStage('items'); setIdx(0); setStep(0); setRightFirst(0); };
  const finishItem = (firstTry: boolean) => {
    const rf = rightFirst + (firstTry && !items[idx].guided ? 1 : 0);
    setRightFirst(rf);
    if (idx + 1 < items.length) setIdx(idx + 1);
    else {
      if (!saved.current) { record(station.id, rf, INDEPENDENT); saved.current = true; }
      setStage('end');
    }
  };

  const phase = stage === 'model' ? 'model' : idx < GUIDED ? 'guided' : 'independent';
  const sameIsland = STATIONS.filter((s) => s.island === station.island);
  const base = sameIsland[sameIsland.indexOf(station) - 1];

  return (
    <div className="min-h-dvh pb-10">
      <TopBar title={m(station.title)} />
      <RestReminder />
      <main className="max-w-xl mx-auto px-4 space-y-4">
        {stage !== 'end' && (
          <div className="flex items-center gap-3 text-sm font-semibold" aria-live="polite">
            <span className="rounded-full px-3 py-1 bg-[var(--color-accent)] text-[var(--color-bg)]" data-testid="phase">{t(`ph_${phase}`)}</span>
            <span className="flex gap-1" aria-hidden>
              {(['model', 'guided', 'independent'] as const).map((p, i) => (
                <span key={p} className={`w-2.5 h-2.5 rounded-full ${i <= ['model', 'guided', 'independent'].indexOf(phase) ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-border)]'}`} />
              ))}
            </span>
            {stage === 'items' && <span className="ml-auto text-[var(--color-muted)]" data-testid="counter">{t('phase_n', { a: idx + 1, b: items.length })}</span>}
          </div>
        )}

        {stage === 'model' && (
          <section className="card space-y-4 pop" key={step}>
            <p className="text-sm text-[var(--color-muted)]">{t('step_of', { a: step + 1, b: model.steps.length })}</p>
            {model.steps[step].visual && <VisualView v={model.steps[step].visual!} describe={describe(t, model.steps[step].visual!)} />}
            <p className="text-xl font-semibold" data-testid="model-text">{m(model.steps[step].say)}</p>
            <div className="flex gap-2">
              <button className="btn btn-ghost" onClick={() => void speak(lang, m(model.steps[step].say))} aria-label={t('listen')}>🔊</button>
              <button className="btn btn-primary flex-1" onClick={() => (step + 1 < model.steps.length ? setStep(step + 1) : setStage('items'))}>{t('next')}</button>
            </div>
          </section>
        )}

        {stage === 'items' && <Exercise key={`${seed}-${idx}`} entry={items[idx]} onDone={finishItem} />}

        {stage === 'end' && (
          <section className="card space-y-4 text-center pop" data-testid="end">
            <p className="text-4xl" aria-hidden>🌟</p>
            <h2 className="text-2xl font-extrabold">{t('end_title')}</h2>
            <p data-testid="end-score">{t('end_score', { a: rightFirst, b: INDEPENDENT })}</p>
            <p>{statusOf(useApp.getState().progress[station.id]) === 'done' ? t('end_done') : rightFirst >= 4 ? t('end_again_day') : t('end_more')}</p>
            {rightFirst < 3 && base && (
              <button className="btn btn-ghost w-full" onClick={() => nav(`/estacion/${base.id}`)}>{t('end_base')} · {m(base.title)}</button>
            )}
            <div className="grid grid-cols-2 gap-2">
              <button className="btn btn-ghost" onClick={restart}>{t('again')}</button>
              <button className="btn btn-primary" onClick={() => nav('/mapa')}>{t('to_map')}</button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function Exercise({ entry, onDone }: { entry: { item: Item; guided: boolean }; onDone: (firstTry: boolean) => void }) {
  const { t, m, lang } = useT();
  const voice = useApp((s) => s.voice);
  const { item, guided } = entry;
  const [value, setValue] = useState<number | null>(null);
  const [typed, setTyped] = useState('');
  const [tries, setTries] = useState(0);
  const [state, setState] = useState<'ask' | 'right' | 'wrong' | 'shown'>('ask');
  const okMsg = useMemo(() => `ok_${1 + Math.floor(Math.random() * 3)}`, []);
  const prompt = m(item.prompt);

  useEffect(() => { if (voice) void speak(lang, prompt); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const answerOf = () => (item.kind === 'place' ? item.target : item.answer);
  const current = item.kind === 'number' ? (typed === '' ? null : Number(typed)) : value;
  const check = (v = current) => {
    if (v == null) return;
    if (isRight(item, v)) { setState('right'); if (voice) void speak(lang, t(okMsg)); }
    else if (tries === 0) { setTries(1); setState('wrong'); if (voice) void speak(lang, t('try_again') + ' ' + m(item.hint)); }
    else { setState('shown'); if (voice) void speak(lang, t('answer_was', { n: answerOf() }) + ' ' + m(item.hint)); }
  };
  const locked = state === 'right' || state === 'shown';
  const showSupport = guided || state === 'wrong' || state === 'shown';
  const visual = showSupport ? item.aid ?? item.visual : item.visual;
  const good = state === 'right' ? true : state === 'wrong' || state === 'shown' ? false : null;

  return (
    <section className="card space-y-4 pop" data-testid="exercise" data-kind={item.kind} data-answer={answerOf()}>
      <div className="flex items-start gap-2">
        <h2 className="text-2xl font-extrabold flex-1" data-testid="prompt">{prompt}</h2>
        <button className="btn btn-ghost !min-h-11 !px-3" onClick={() => void speak(lang, prompt)} aria-label={t('listen')}>🔊</button>
      </div>

      {(guided || state !== 'ask') && (
        <p className={`rounded-2xl p-3 text-base ${state === 'ask' ? 'bg-[var(--color-sky-pale)]' : state === 'right' ? 'bg-[var(--color-mint-pale)]' : 'bg-[var(--color-peach-pale)]'}`} data-testid="feedback" aria-live="polite">
          {state === 'right' ? t(okMsg) : state === 'wrong' ? `${t('try_again')} ${m(item.hint)}` : state === 'shown' ? `${t('answer_was', { n: answerOf() })} ${m(item.hint)}` : `💡 ${m(item.hint)}`}
        </p>
      )}

      {item.kind !== 'place' && visual && <VisualView v={visual} describe={describe(t, visual)} />}

      {item.kind === 'place' && (
        <>
          <p className="text-sm text-[var(--color-muted)]">{t('tap_line')}</p>
          <PlaceOnLine
            v={{ type: 'line', min: item.min, max: item.max, marks: showSupport ? item.aidMarks ?? item.marks : item.marks, labels: showSupport ? item.aidLabels ?? item.labels : item.labels }}
            value={state === 'shown' ? item.target : value} onChange={(n) => { setValue(n); if (state === 'wrong') setState('ask'); }} locked={locked} good={good} label={prompt}
          />
        </>
      )}

      {item.kind === 'choice' && (
        <div className={`grid gap-2 ${item.options.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`} role="group" aria-label={t('pick_one')} data-testid="choices">
          {item.options.map((o) => {
            const chosen = value === o, isAns = o === item.answer;
            const cls = locked && isAns ? 'bg-[var(--color-mint-pale)] border-[var(--color-mint)]' : chosen && state === 'wrong' ? 'bg-[var(--color-peach-pale)] border-[var(--color-peach)]' : chosen ? 'border-[var(--color-accent)]' : '';
            return (
              <button key={o} disabled={locked} data-value={o} className={`btn btn-ghost !text-2xl !font-extrabold !min-h-16 ${cls}`} onClick={() => { setValue(o); check(o); }}>{o}</button>
            );
          })}
        </div>
      )}

      {item.kind === 'number' && (
        <div className="space-y-2">
          <div className="text-center text-4xl font-extrabold rounded-2xl border-2 border-[var(--color-border)] min-h-16 flex items-center justify-center" aria-live="polite" data-testid="typed" aria-label={t('type_answer')}>
            {state === 'shown' ? item.answer : typed || <span className="text-[var(--color-muted)] text-2xl">?</span>}
          </div>
          {!locked && (
            <div className="grid grid-cols-5 gap-2" data-testid="keypad">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d) => (
                <button key={d} className="btn btn-ghost !text-2xl !font-extrabold !px-0" onClick={() => { setTyped((s) => (s.length < 4 ? s + d : s)); if (state === 'wrong') setState('ask'); }}>{d}</button>
              ))}
              <button className="btn btn-ghost col-span-5" onClick={() => setTyped((s) => s.slice(0, -1))}>⌫ {t('delete')}</button>
            </div>
          )}
        </div>
      )}

      {!locked && item.kind !== 'choice' && (
        <button className="btn btn-primary w-full" disabled={current == null} onClick={() => check()} data-testid="check">{t('check')}</button>
      )}
      {locked && <button className="btn btn-primary w-full" onClick={() => onDone(tries === 0 && state === 'right')} data-testid="next" autoFocus>{t('next')}</button>}
    </section>
  );
}
