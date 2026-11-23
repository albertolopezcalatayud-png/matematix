import { useMemo, useState } from 'react';
import { useT } from '@/i18n';
import { stationById } from '@/data/stations';
import { rng } from '@/engine/rng';
import { VisualView } from './Visuals';
import { describe } from './describe';
import { StationSelect } from './StationSelect';
import { speak } from '@/services/speech';

/** The worked example a child sees at the start of a station, step by step: the same words and the same drawing, so
 *  adults can explain it the same way. `big` = for the class whiteboard. */
export function ModelSteps({ big = false, initial = 'A1' }: { big?: boolean; initial?: string }) {
  const { t, m, lang } = useT();
  const [id, setId] = useState(initial);
  const [seed, setSeed] = useState(1);
  const [step, setStep] = useState(0);
  const model = useMemo(() => stationById(id)!.model(rng(seed)), [id, seed]);
  const s = model.steps[Math.min(step, model.steps.length - 1)];
  return (
    <div className="space-y-3">
      <StationSelect value={id} onChange={(v) => { setId(v); setStep(0); }} label={t('f_station')} testId="model-station" />
      <div className={`rounded-3xl border border-[var(--color-border)] p-3 space-y-3 ${big ? 'text-3xl' : ''}`} data-testid="model-step">
        <p className="text-sm text-[var(--color-muted)]">{t('step_of', { a: step + 1, b: model.steps.length })}</p>
        {s.visual && <VisualView v={s.visual} describe={describe(t, s.visual)} />}
        <p className={`${big ? 'text-3xl' : 'text-lg'} font-semibold`}>{m(s.say)}</p>
      </div>
      <div className="flex gap-2">
        <button className="btn btn-ghost" disabled={step === 0} onClick={() => setStep(step - 1)} aria-label={t('back')}>←</button>
        <button className="btn btn-ghost" onClick={() => void speak(lang, m(s.say))} aria-label={t('listen')}>🔊</button>
        <button className="btn btn-ghost" onClick={() => { setSeed(seed + 1); setStep(0); }} aria-label="↻">↻</button>
        <button className="btn btn-primary flex-1" disabled={step + 1 >= model.steps.length} onClick={() => setStep(step + 1)}>{t('next')}</button>
      </div>
    </div>
  );
}
