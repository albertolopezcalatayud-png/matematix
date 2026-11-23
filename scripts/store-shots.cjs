// Phone screenshots for the Play Store listing, in the three languages (1080 × 1920).
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://localhost:4174/matematix/';
const OUT = process.env.OUT || 'store';
const d = (n) => new Date(Date.now() - n * 864e5).toLocaleDateString('sv-SE');
(async () => {
  const b = await chromium.launch();
  for (const lang of ['es', 'ca', 'en']) {
    const c = await b.newContext({ viewport: { width: 360, height: 640 }, deviceScaleFactor: 3, colorScheme: 'light' });
    const progress = {}; for (const id of ['A1', 'A2', 'B1', 'B3', 'B2', 'A3']) progress[id] = { goodDays: [d(3), d(1)], best: 5, sessions: 3 };
    progress.C1 = { goodDays: [d(1)], best: 4, sessions: 1 };
    const state = { lang, role: 'pupil', toured: true, reach: 100, found: ['f_zero', 'f_ten'], suggested: 'A1', last: 'C1', progress, minutes: { [d(0)]: 8, [d(1)]: 10 }, seen: {}, pupils: {}, active: null, help: 'normal', voice: true, large: false, theme: 'light', motion: 'auto', rest: true, sound: true, voices: {} };
    await c.addInitScript((s) => { localStorage.setItem('matematix', JSON.stringify({ state: s, version: 1 })); window.speechSynthesis && (window.speechSynthesis.speak = () => {}); }, state);
    const p = await c.newPage();
    const go = async (route, n, act) => { await p.goto(BASE + route); await p.waitForTimeout(700); if (act) await act(); await p.waitForTimeout(400); await p.screenshot({ path: `${OUT}/${lang}-${n}.png` }); };
    await go('#/', 1);
    await go('#/mapa', 2);
    await go('#/estacion/A3', 3, async () => { let k = 0; while ((await p.getByTestId('model-text').count()) > 0 && k++ < 8) { await p.getByRole('button', { name: { es: 'Siguiente', ca: 'Següent', en: 'Next' }[lang] }).click(); await p.waitForTimeout(150); } });
    await go('#/estacion/C2', 4, async () => { let k = 0; while ((await p.getByTestId('model-text').count()) > 0 && k++ < 8) { await p.getByRole('button', { name: { es: 'Siguiente', ca: 'Següent', en: 'Next' }[lang] }).click(); await p.waitForTimeout(150); } });
    await go('#/estacion/E2', 5, async () => { let k = 0; while ((await p.getByTestId('model-text').count()) > 0 && k++ < 8) { await p.getByRole('button', { name: { es: 'Siguiente', ca: 'Següent', en: 'Next' }[lang] }).click(); await p.waitForTimeout(150); } });
    await go('#/progreso', 6);
    await go('#/adultos', 7);
    await go('#/adultos/fichas', 8);
    await c.close();
  }
  await b.close(); console.log('ok');
})();
