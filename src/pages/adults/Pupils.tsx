import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useT } from '@/i18n';
import { lessonStatus, today, useApp, type LessonProgress } from '@/stores/app';
import { TopBar } from '@/components/Layout';
import { courseKey } from '@/components/CoursePicker';
import { COURSE_IDS, SUBJ_EMOJI, tr } from '@/course';
import { counts as countLessons, startedBySubject } from '@/course/progress';
import { esc, printPage } from '@/services/print';

const EMOJI = ['🦊', '🐢', '🦉', '🐬', '🦁', '🐝', '🐙', '🦄', '🐸', '🐼', '🚀', '⭐', '🌈', '🍀', '⚽', '🎸'];
const weekMinutes = (minutes: Record<string, number>) => [...Array(7)].reduce((a: number, _, i) => a + (minutes[new Date(Date.now() - i * 864e5).toLocaleDateString('sv-SE')] ?? 0), 0);

/** PT / AL / refuerzo: several children on one device. Each one has a nickname + emoji (never a real name), their own
 *  progress and settings. The active child's data lives in the main store; switching swaps it. */
export default function Pupils() {
  const { t, lang } = useT();
  const nav = useNavigate();
  const s = useApp();
  const [alias, setAlias] = useState('');
  const [emoji, setEmoji] = useState(EMOJI[0]);
  const [confirm, setConfirm] = useState<string | null>(null);
  const list = Object.entries(s.pupils).filter(([id]) => id !== '_me');
  const name = (id: string | null) => (id && s.pupils[id] ? `${s.pupils[id].emoji} ${s.pupils[id].alias}` : t('p_me'));

  const add = () => { if (!alias.trim()) return; const id = s.addPupil(alias.trim().slice(0, 20), emoji); s.switchPupil(id); setAlias(''); setEmoji(EMOJI[(EMOJI.indexOf(emoji) + 1) % EMOJI.length]); };
  const counts = (lessons: Record<string, LessonProgress>) => countLessons(lessons);

  const printSheet = () => {
    const rows = startedBySubject(s.lessons).flatMap((g) => g.items.map((x) => `<tr><td>${SUBJ_EMOJI[g.subject.code] ?? ''} ${esc(tr(lang, g.subject.title))} (${esc(t(courseKey(g.course)))})</td><td>${esc(tr(lang, x.lesson.title))}</td><td>${t(`st_${lessonStatus(x.p)}`)}</td><td>${(x.p.days ?? []).slice(-6).map((d) => d.slice(5).split('-').reverse().join('/')).join(', ')}</td></tr>`)).join('');
    const box = (k: string) => `<h2>${t(k)}</h2><div class="line"></div><div class="line"></div>`;
    printPage(lang, t('ss_title'), `<div class="pg"><h1>${t('ss_title')}</h1><p class="small">${t('ss_note')}</p>
      <p><b>${t('ss_pupil')}:</b> ${esc(name(s.active))} &nbsp; <b>${t('ss_date')}:</b> ${today().split('-').reverse().join('/')}</p>
      <p>${t('ss_minutes', { m: weekMinutes(s.minutes) })}</p>
      <table style="width:100%;border-collapse:collapse;font-size:10.5pt" border="1" cellpadding="5"><tr><th align="left">${t('lp_subject')}</th><th align="left">${t('ss_station')}</th><th align="left">${t('ss_state')}</th><th align="left">${t('ss_days')}</th></tr>${rows || `<tr><td colspan="4">—</td></tr>`}</table>
      ${box('ss_strategies')}${box('ss_supports')}${box('ss_hands')}${box('ss_next')}</div>`);
  };

  const c = counts(s.lessons);
  return (
    <div className="min-h-dvh pb-10">
      <TopBar title={t('sec_pupils')} back="/adultos" />
      <main className="max-w-xl mx-auto px-4 space-y-4">
        <p className="rounded-2xl p-3 bg-[var(--color-sky-pale)] text-base">{t('p_intro')}</p>

        <section className="card space-y-2" data-testid="pupil-list">
          {list.length === 0 && <p className="text-[var(--color-muted)]">{t('p_none')}</p>}
          {[[null, null] as const, ...list].map(([id]) => {
            const on = s.active === id;
            const data = on ? s : id ? s.pupils[id].data : s.pupils['_me']?.data ?? (s.active ? {} : s);
            const k = counts((data.lessons ?? {}) as Record<string, LessonProgress>);
            return (
              <div key={id ?? 'me'} className={`flex items-center gap-2 rounded-2xl p-2 ${on ? 'bg-[var(--color-accent-pale)]' : ''}`}>
                <button className="flex-1 text-left" onClick={() => s.switchPupil(id)} data-testid={`pupil-${id ?? 'me'}`} aria-pressed={on}>
                  <span className="block font-bold">{name(id)}</span>
                  <span className="block text-xs text-[var(--color-muted)]">{t('p_progress', { d: k.d, g: k.g, m: weekMinutes((data.minutes ?? {}) as Record<string, number>) })}</span>
                </button>
                {id && (confirm === id
                  ? <><button className="btn btn-ghost !min-h-10 !px-2 text-sm" onClick={() => setConfirm(null)}>{t('no')}</button><button className="btn btn-primary !min-h-10 !px-2 text-sm" onClick={() => { s.removePupil(id); setConfirm(null); }}>{t('yes')}</button></>
                  : <button className="btn btn-ghost !min-h-10 !px-3 text-sm" onClick={() => setConfirm(id)} aria-label={t('p_remove_q', { a: name(id) })}>{t('p_remove')}</button>)}
              </div>
            );
          })}
        </section>

        <section className="card space-y-3">
          <h2 className="font-extrabold">{t('p_add')}</h2>
          <label className="block"><span className="text-sm">{t('p_alias')}</span>
            <input className="mt-1 w-full rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-card)] px-3 min-h-12" value={alias} maxLength={20} onChange={(e) => setAlias(e.target.value)} data-testid="alias" autoComplete="off" />
          </label>
          <div className="flex flex-wrap gap-1" role="radiogroup" aria-label="emoji">
            {EMOJI.map((e) => <button key={e} role="radio" aria-checked={emoji === e} className={`w-11 h-11 rounded-xl text-xl ${emoji === e ? 'bg-[var(--color-accent-pale)] ring-2 ring-[var(--color-accent)]' : ''}`} onClick={() => setEmoji(e)}>{e}</button>)}
          </div>
          <button className="btn btn-primary w-full" disabled={!alias.trim()} onClick={add} data-testid="add-pupil">{t('p_add')}</button>
        </section>

        <section className="card space-y-1" data-testid="pupil-settings">
          <h2 className="font-extrabold">{t('p_settings', { a: name(s.active) })}</h2>
          <p className="text-sm text-[var(--color-muted)]">{t('p_progress', { d: c.d, g: c.g, m: weekMinutes(s.minutes) })}</p>
          <label className="flex items-center gap-3 py-2"><span className="flex-1">{t('course_q')}</span>
            <select className="rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-card)] px-3 min-h-11" value={s.course ?? ''} data-testid="pupil-course"
              onChange={(e) => s.set({ course: COURSE_IDS.includes(e.target.value) ? e.target.value : null })}>
              <option value="">—</option>
              {COURSE_IDS.map((c) => <option key={c} value={c}>{t(courseKey(c))}</option>)}
            </select></label>
          {([['help', s.help === 'more', (v: boolean) => s.set({ help: v ? 'more' : 'normal' })], ['voice', s.voice, (v: boolean) => s.set({ voice: v })], ['sound', s.sound, (v: boolean) => s.set({ sound: v })],
            ['large', s.large, (v: boolean) => s.set({ large: v })], ['motion', s.motion === 'reduce', (v: boolean) => s.set({ motion: v ? 'reduce' : 'auto' })]] as const).map(([k, v, on]) => (
            <label key={k} className="flex items-center gap-3 py-2 cursor-pointer"><span className="flex-1">{t(`p_${k}`)}</span>
              <input type="checkbox" role="switch" className="w-6 h-6 accent-[var(--color-accent)]" checked={v} onChange={(e) => on(e.target.checked)} data-testid={`set-${k}`} /></label>
          ))}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button className="btn btn-ghost" onClick={printSheet} data-testid="print-session">🖨️ {t('p_sheet')}</button>
            <button className="btn btn-primary" onClick={() => nav('/')}>{t('p_back_child', { a: name(s.active) })}</button>
          </div>
        </section>
      </main>
    </div>
  );
}
