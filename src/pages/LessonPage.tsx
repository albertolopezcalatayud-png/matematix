import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useT } from '@/i18n';
import { useApp } from '@/stores/app';
import { findLesson, isText, isTypeable, loadLesson, optionsFor, pickQs, PER_LEVEL, qKey, showAns, SUBJ_COLOUR, SUBJ_EMOJI, tr, typedIsRight, type Level } from '@/course';
import type { Ans, LessonContent, Q } from '@/course/types';
import { rng } from '@/engine/rng';
import { speak, stopSpeech } from '@/services/speech';
import { VisualView } from '@/components/Visuals';
import { describe } from '@/components/describe';
import { Mascot } from '@/components/Mascot';
import { TopBar, RestReminder } from '@/components/Layout';

type Stage = 'idea' | 'levels' | 'run' | 'end';

/**
 * One lesson: the idea and a worked example, then three levels of exercises.
 * Level 1: choose from 3 with the hint on show. Level 2: type the answer (or choose from 4). Level 3: one try, no hints.
 * 4 out of 5 right first time passes a level; passing level 3 completes the lesson.
 */
export default function LessonPage() {
  const { id = '' } = useParams();
  const where = findLesson(id);
  const [content, setContent] = useState<LessonContent | null | undefined>(undefined);
  useEffect(() => { let on = true; setContent(undefined); void loadLesson(id).then((c) => on && setContent(c ?? null)); return () => { on = false; }; }, [id]);
  if (!where) return <Navigate to="/materias" replace />;
  return <LessonBody key={id} id={id} where={where} content={content} />;
}

function LessonBody({ id, where, content }: { id: string; where: NonNullable<ReturnType<typeof findLesson>>; content: LessonContent | null | undefined }) {
  const { t, lang } = useT();
  const nav = useNavigate();
  const voice = useApp((s) => s.voice);
  const progress = useApp((s) => s.lessons[id]);
  const finishLevel = useApp((s) => s.finishLevel);
  const markQSeen = useApp((s) => s.markQSeen);
  const [stage, setStage] = useState<Stage>(progress ? 'levels' : 'idea');
  const [level, setLevel] = useState<Level>(1);
  const [run, setRun] = useState(0);
  const [idx, setIdx] = useState(0);
  const [rightFirst, setRightFirst] = useState(0);
  const [step, setStep] = useState(0);
  const saved = useRef(false);
  const lv = progress?.lv ?? 0;

  const qs = useMemo(() => (content && stage === 'run' ? pickQs(content, (Date.now() ^ (run * 7919)) >>> 0, new Set(useApp.getState().qseen[id] ?? [])) : []), [content, run, stage === 'run']); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (qs.length) markQSeen(id, qs.map(qKey)); }, [qs]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => stopSpeech(), []);

  const start = (l: Level) => { saved.current = false; setLevel(l); setIdx(0); setRightFirst(0); setRun((r) => r + 1); setStage('run'); };
  const done = (firstTry: boolean) => {
    const rf = rightFirst + (firstTry ? 1 : 0);
    setRightFirst(rf);
    if (idx + 1 < qs.length) { setIdx(idx + 1); return; }
    if (!saved.current) { finishLevel(id, level, rf); saved.current = true; }
    setStage('end');
  };

  const title = tr(lang, where.lesson.title);
  const next = where.all[where.index + 1];
  const island = SUBJ_COLOUR[where.subject.code];
  const ex = content?.example;

  return (
    <div className="min-h-dvh pb-10 lesson-bg" data-island={island}>
      <TopBar title={title} back={`/materia/${where.course.id}/${where.subject.code}`} />
      <RestReminder />
      <main className="max-w-xl mx-auto px-4 space-y-4">
        <p className="isl-badge" data-testid="where"><span aria-hidden>{SUBJ_EMOJI[where.subject.code]}</span>{tr(lang, where.block.title)} · {t('lesson_word', { n: where.index + 1 })}</p>

        {content === undefined && <p className="card text-center">{t('loading')}</p>}

        {content && stage === 'idea' && (
          <>
            <section className="card isl-top space-y-3 pop" data-testid="idea">
              <div className="flex items-start gap-2">
                <h2 className="text-xl font-extrabold flex-1">💡 {t('explain_title')}</h2>
                <button className="btn btn-ghost !min-h-10 !px-3" onClick={() => void speak(lang, content.explain.map((x) => tr(lang, x)))} aria-label={t('listen')}>🔊</button>
              </div>
              {content.explain.map((x, i) => <p key={i} className="text-lg leading-relaxed" data-testid="idea-text">{tr(lang, x)}</p>)}
            </section>
            {ex && (
              <section className="card space-y-3" data-testid="example">
                <h2 className="text-lg font-extrabold">✏️ {t('example_title')}</h2>
                <p className="text-lg font-bold" data-testid="example-q">{tr(lang, ex.q)}</p>
                {ex.visual && <VisualView v={ex.visual} describe={describe(t, ex.visual)} />}
                <ol className="space-y-2">
                  {ex.steps.slice(0, step + 1).map((s, i) => (
                    <li key={i} className="rounded-2xl p-3 bg-[var(--isl-pale)] pop" data-testid="example-step">
                      <span className="block text-xs font-bold" style={{ color: 'var(--isl)' }}>{t('example_step', { n: i + 1 })}</span>
                      <span className="text-lg">{tr(lang, s)}</span>
                    </li>
                  ))}
                </ol>
                <div className="flex gap-2">
                  <button className="btn btn-ghost !px-3" onClick={() => void speak(lang, [tr(lang, ex.q), ...ex.steps.slice(0, step + 1).map((s) => tr(lang, s))])} aria-label={t('listen')}>🔊</button>
                  {step + 1 < ex.steps.length
                    ? <button className="btn btn-primary flex-1" data-testid="next-step" onClick={() => { setStep(step + 1); if (voice) void speak(lang, tr(lang, ex.steps[step + 1])); }}>{t('show_next_step')} ▶</button>
                    : <button className="btn btn-primary flex-1" data-testid="to-levels" onClick={() => setStage('levels')}>{t('to_practice')} ▶</button>}
                </div>
              </section>
            )}
          </>
        )}

        {content && stage === 'levels' && (
          <section className="space-y-3" data-testid="levels">
            {([1, 2, 3] as const).map((l) => {
              const open = l === 1 || lv >= l - 1;
              const passed = lv >= l;
              return (
                <button key={l} disabled={!open} onClick={() => start(l)} data-testid={`level-${l}`}
                  className={`w-full text-left card !p-4 flex items-center gap-3 ${open ? 'isl-top' : 'opacity-60'}`}>
                  <span className="lesson-num text-xl" aria-hidden>{passed ? '★' : open ? l : '🔒'}</span>
                  <span className="flex-1">
                    <span className="block text-lg font-extrabold">{t(`lv_name_${l}`)}</span>
                    <span className="block text-sm">{open ? t(`lv_desc_${l}`) : t('lv_locked', { n: l - 1 })}</span>
                    {passed && <span className="block text-sm font-bold" style={{ color: 'var(--isl)' }}>✓ {t('lv_passed')}</span>}
                  </span>
                  {open && <span aria-hidden className="text-2xl" style={{ color: 'var(--isl)' }}>▶</span>}
                </button>
              );
            })}
            <button className="btn btn-ghost w-full" data-testid="see-idea" onClick={() => { setStep(0); setStage('idea'); }}>💡 {t('see_idea')}</button>
          </section>
        )}

        {content && stage === 'run' && qs[idx] && (
          <>
            <div className="flex items-center gap-3 text-sm font-semibold" aria-live="polite">
              <span className="isl-badge" data-testid="phase">{t(`lv_name_${level}`)}</span>
              <span className="step-dots" aria-hidden>{qs.map((_, i) => <i key={i} className={i <= idx ? 'on' : ''} />)}</span>
              <span className="ml-auto text-[var(--color-muted)]" data-testid="counter">{t('phase_n', { a: idx + 1, b: qs.length })}</span>
            </div>
            <QExercise key={`${run}-${idx}`} qq={qs[idx]} level={level} seed={run * 31 + idx} onDone={done} keys={keysFor(qs)} />
          </>
        )}

        {content && stage === 'end' && (
          <section className="card space-y-4 text-center pop" data-testid="end">
            <Mascot mood={rightFirst >= 4 ? 'cheer' : 'happy'} size={110} className="mx-auto" />
            <h2 className="text-2xl font-extrabold">{rightFirst >= 4 && level === 3 ? t('lesson_complete') : t(`lv_name_${level}`)}</h2>
            <p data-testid="end-score">{rightFirst >= 4 ? t('lv_end_pass', { a: rightFirst, b: PER_LEVEL }) : t('lv_end_more', { a: rightFirst, b: PER_LEVEL })}</p>
            {rightFirst >= 4 && level < 3 && (
              <button className="btn btn-primary w-full !min-h-14 text-lg" data-testid="end-next-level" onClick={() => start((level + 1) as Level)}>{t('next_level', { n: level + 1 })} ▶</button>
            )}
            {rightFirst >= 4 && level === 3 && next && (
              <button className="btn btn-primary w-full !min-h-14 text-lg" data-testid="end-next" onClick={() => nav(`/leccion/${next.id}`)}>{t('next_lesson')} ▶ · {tr(lang, next.title)}</button>
            )}
            <div className="grid grid-cols-2 gap-2">
              <button className={`btn ${rightFirst >= 4 ? 'btn-ghost' : 'btn-primary'}`} data-testid="again" onClick={() => start(level)}>{t('again')}</button>
              <button className="btn btn-ghost" onClick={() => setStage('levels')}>{t('to_lessons')}</button>
            </div>
            {rightFirst < 3 && <button className="btn btn-ghost w-full" onClick={() => { setStep(0); setStage('idea'); }}>💡 {t('see_idea')}</button>}
          </section>
        )}

        {content === null && (
          <section className="card text-center space-y-3" data-testid="no-content">
            <p>{t('loading')}</p>
            <Link className="btn btn-ghost" to={`/materia/${where.course.id}/${where.subject.code}`}>{t('back')}</Link>
          </section>
        )}
      </main>
    </div>
  );
}

/** Which extra keys the keypad needs for the answers of this session (comma, minus, fraction bar). */
function keysFor(qs: Q[]) {
  const a = qs.filter((q) => !q.mc).map((q) => q.a);
  return {
    comma: a.some((x) => typeof x === 'number' && !Number.isInteger(x)),
    minus: a.some((x) => (typeof x === 'number' && x < 0) || (typeof x === 'string' && x.startsWith('-'))),
    frac: a.some((x) => typeof x === 'string' && x.includes('/')),
  };
}

const SPAN: Record<number, string> = { 2: 'col-span-2', 3: 'col-span-3', 4: 'col-span-4', 5: 'col-span-5' };
const ansKey = (a: Ans) => (typeof a === 'number' ? `n${a}` : typeof a === 'string' ? `s${a}` : `t${a[0]}`);

function QExercise({ qq, level, seed, onDone, keys }: { qq: Q; level: Level; seed: number; onDone: (firstTry: boolean) => void; keys: { comma: boolean; minus: boolean; frac: boolean } }) {
  const { t, lang } = useT();
  const voice = useApp((s) => s.voice);
  const typed = level > 1 && !qq.mc && isTypeable(qq.a);
  const options = useMemo(() => optionsFor(qq, level, rng(seed + 17)), [qq, level, seed]);
  const [value, setValue] = useState<Ans | null>(null);
  const [text, setText] = useState('');
  const [tries, setTries] = useState(0);
  const [state, setState] = useState<'ask' | 'right' | 'wrong' | 'shown'>('ask');
  const okMsg = useMemo(() => `ok_${1 + Math.floor(Math.random() * 3)}`, []);
  const prompt = tr(lang, qq.q);
  const hint = tr(lang, qq.hint);
  const oneTry = level === 3;
  useEffect(() => { if (voice) void speak(lang, prompt); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const answer = showAns(lang, qq.a);
  const check = (v: Ans | string) => {
    const ok = typeof v === 'string' && typed ? typedIsRight(qq.a, v) : ansKey(v as Ans) === ansKey(qq.a);
    if (ok) { setState('right'); if (voice) void speak(lang, t(okMsg)); }
    else if (tries === 0 && !oneTry) { setTries(1); setState('wrong'); if (voice) void speak(lang, [t('try_again'), hint]); }
    else { setState('shown'); if (voice) void speak(lang, [t('answer_was', { n: answer }), hint]); }
  };
  const locked = state === 'right' || state === 'shown';
  const showHint = level === 1 || state === 'wrong' || state === 'shown';
  const visual = showHint ? qq.aid ?? qq.visual : qq.visual;
  const long = options.some((o) => isText(o) && tr(lang, o).length > 18);

  return (
    <section className={`card isl-top space-y-4 pop ${state === 'right' ? 'burst' : ''}`} data-testid="exercise" data-answer={answer} data-typed={typed ? '1' : '0'}>
      <div className="flex items-start gap-2">
        <h2 className={`${prompt.length > 80 ? 'text-xl' : 'text-2xl'} font-extrabold flex-1 leading-snug`} data-testid="prompt">{prompt}</h2>
        <button className="btn btn-ghost !min-h-11 !px-3" onClick={() => void speak(lang, prompt)} aria-label={t('listen')}>🔊</button>
      </div>

      {(showHint || state !== 'ask') && (
        <div className="flex items-end gap-2">
          {state !== 'ask' && <Mascot mood={state === 'right' ? 'cheer' : 'think'} size={52} className="shrink-0 kid-only" />}
          <p className={`flex-1 rounded-2xl p-3 text-base ${state === 'ask' ? 'bg-[var(--color-sky-pale)]' : state === 'right' ? 'bg-[var(--color-mint-pale)]' : 'bg-[var(--color-peach-pale)]'}`} data-testid="feedback" aria-live="polite">
            {state === 'right' ? t(okMsg) : state === 'wrong' ? `${t('try_again')} ${hint}` : state === 'shown' ? `${t('answer_was', { n: answer })} ${hint}` : `💡 ${hint}`}
          </p>
        </div>
      )}

      {visual && <VisualView v={visual} describe={describe(t, visual)} />}

      {!typed && (
        <div className={`grid gap-2 ${long ? 'grid-cols-1' : options.length === 4 ? 'grid-cols-2' : 'grid-cols-3'}`} role="group" aria-label={t('pick_one')} data-testid="choices">
          {options.map((o) => {
            const k = ansKey(o); const chosen = value != null && ansKey(value) === k; const isAns = k === ansKey(qq.a);
            const cls = locked && isAns ? 'bg-[var(--color-mint-pale)] border-[var(--color-mint)]' : chosen && state !== 'ask' && !isAns ? 'bg-[var(--color-peach-pale)] border-[var(--color-peach)]' : chosen ? 'border-[var(--color-accent)]' : '';
            const lab = showAns(lang, o);
            return (
              <button key={k} disabled={locked} data-value={lab} data-right={isAns ? '1' : '0'} className={`btn btn-ghost ${isText(o) ? '!text-base !font-bold' : '!text-2xl !font-extrabold'} !min-h-16 ${cls}`}
                onClick={() => { setValue(o); check(o); }}>{lab}</button>
            );
          })}
        </div>
      )}

      {typed && (
        <div className="space-y-2">
          <div className="text-center text-4xl font-extrabold rounded-2xl border-2 border-[var(--color-border)] min-h-16 flex items-center justify-center" aria-live="polite" data-testid="typed" aria-label={t('type_answer')}>
            {state === 'shown' ? answer : text.replace(/-/g, '−').replace('.', lang === 'en' ? '.' : ',') || <span className="text-[var(--color-muted)] text-2xl">?</span>}
          </div>
          {!locked && (
            <div className="grid grid-cols-5 gap-2" data-testid="keypad">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d) => (
                <button key={d} className="btn btn-ghost !text-2xl !font-extrabold !px-0" onClick={() => { setText((s) => (s.length < 9 ? s + d : s)); if (state === 'wrong') setState('ask'); }}>{d}</button>
              ))}
              {keys.comma && <button className="btn btn-ghost !text-2xl !font-extrabold !px-0" aria-label={t('keypad_comma')} onClick={() => setText((s) => (s.includes('.') ? s : s + '.'))}>{lang === 'en' ? '.' : ','}</button>}
              {keys.minus && <button className="btn btn-ghost !text-2xl !font-extrabold !px-0" aria-label={t('keypad_minus')} onClick={() => setText((s) => (s.startsWith('-') ? s.slice(1) : '-' + s))}>−</button>}
              {keys.frac && <button className="btn btn-ghost !text-2xl !font-extrabold !px-0" aria-label={t('keypad_frac')} onClick={() => setText((s) => (s.includes('/') ? s : s + '/'))}>/</button>}
              <button className={`btn btn-ghost ${SPAN[5 - [keys.comma, keys.minus, keys.frac].filter(Boolean).length]}`} onClick={() => setText((s) => s.slice(0, -1))}>⌫ {t('delete')}</button>
            </div>
          )}
          {!locked && <button className="btn btn-primary w-full" disabled={text === '' || text === '-'} onClick={() => check(text)} data-testid="check">{t('check')}</button>}
        </div>
      )}

      {locked && <button className="btn btn-primary w-full" onClick={() => onDone(tries === 0 && state === 'right')} data-testid="next" autoFocus>{t('next')}</button>}
    </section>
  );
}
