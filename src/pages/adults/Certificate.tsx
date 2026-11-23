import { useState } from 'react';
import { useT } from '@/i18n';
import { ISLANDS, STATIONS } from '@/data/stations';
import { statusOf, today, useApp } from '@/stores/app';
import { TopBar } from '@/components/Layout';
import { esc, printPage } from '@/services/print';
import { APP_NAME } from '@/config';

/** A printable certificate of the stations mastered on this device (for the active child). The name is typed only
 *  for printing and never stored. Effort, not marks. */
export default function Certificate() {
  const { t, m, lang } = useT();
  const progress = useApp((s) => s.progress);
  const [name, setName] = useState('');
  const done = STATIONS.filter((s) => statusOf(progress[s.id]) === 'done');
  const print = () => {
    const list = ISLANDS.map((i) => {
      const st = done.filter((s) => s.island === i.id);
      return st.length ? `<p style="margin:1.5mm 0"><b>${i.emoji} ${esc(t(i.title))}:</b> ${st.map((s) => esc(m(s.title))).join(' · ')}</p>` : '';
    }).join('');
    printPage(lang, t('c_title'), `<div style="border:3mm solid #EDEAFF;border-radius:8mm;padding:14mm;text-align:center;min-height:150mm">
      <p style="font-size:30pt;margin:0">🌟</p><h1 style="font-size:28pt">${t('c_title')}</h1>
      <p style="font-size:24pt;font-weight:800;margin:6mm 0;border-bottom:1px solid #999;display:inline-block;min-width:120mm">${esc(name) || '&nbsp;'}</p>
      <p style="font-size:14pt">${t('c_text')}</p><div style="text-align:left;margin:6mm auto;max-width:200mm">${list || `<p>${t('c_none')}</p>`}</div>
      <p style="margin-top:12mm;display:flex;justify-content:space-between"><span>${today().split('-').reverse().join('/')}</span><span>${t('c_sign')}: ____________________</span></p>
      <p class="small">${APP_NAME}</p></div>`, { landscape: true });
  };
  return (
    <div className="min-h-dvh pb-10">
      <TopBar title={t('sec_cert')} back="/adultos" />
      <main className="max-w-xl mx-auto px-4 space-y-4">
        <section className="card space-y-3">
          <p className="text-base">{t('c_intro')}</p>
          <label className="block"><span className="text-sm">{t('c_name')}</span>
            <input className="mt-1 w-full rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-card)] px-3 min-h-12" value={name} maxLength={40} onChange={(e) => setName(e.target.value)} autoComplete="off" data-testid="cert-name" /></label>
          <ul className="text-sm space-y-1">{done.length ? done.map((s) => <li key={s.id}>✦ {m(s.title)}</li>) : <li>{t('c_none')}</li>}</ul>
          <button className="btn btn-primary w-full" onClick={print} data-testid="print-cert">🖨️ {t('c_print')}</button>
        </section>
      </main>
    </div>
  );
}
