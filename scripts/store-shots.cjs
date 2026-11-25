// Phone screenshots for the Play Store listing, in the three languages (1080 × 1920).
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://localhost:4174/matematix/';
const OUT = process.env.OUT || 'store';
const d = (n) => new Date(Date.now() - n * 864e5).toLocaleDateString('sv-SE');
(async () => {
  const b = await chromium.launch();
  for (const lang of ['es', 'ca', 'en']) {
    const c = await b.newContext({ viewport: { width: 360, height: 640 }, deviceScaleFactor: 3, colorScheme: 'light' });
    const lessons = {};
    for (let i = 1; i <= 9; i++) lessons[`3P-M-${i}`] = { lv: 3, days: [d(3), d(1)] };
    lessons['3P-M-10'] = { lv: 1, days: [d(0)] };
    for (let i = 1; i <= 4; i++) lessons[`3P-CM-${i}`] = { lv: 3, days: [d(2)] };
    const state = { lang, role: 'pupil', course: '3P', toured: true, lessons, lastLesson: '3P-M-10', minutes: { [d(0)]: 8, [d(1)]: 10 }, pupils: {}, active: null, help: 'normal', voice: true, large: false, theme: 'light', motion: 'auto', rest: true, sound: true, voices: {} };
    await c.addInitScript((s) => { if (!localStorage.getItem('shots')) { localStorage.setItem('shots', '1'); localStorage.setItem('matematix', JSON.stringify({ state: s, version: 2 })); } window.speechSynthesis && (window.speechSynthesis.speak = () => {}); }, state);
    const p = await c.newPage();
    const shot = (n) => p.screenshot({ path: `${OUT}/${lang}-${n}.png` });
    const go = async (route, n, act) => { await p.goto(BASE + route); await p.waitForTimeout(700); if (act) await act(); await p.waitForTimeout(500); await shot(n); };
    const steps = async () => { let k = 0; while ((await p.getByTestId('next-step').count()) && k++ < 8) { await p.getByTestId('next-step').click(); await p.waitForTimeout(150); } };
    const level = (l) => async () => { if (!(await p.getByTestId('levels').count())) { await steps(); await p.getByTestId('to-levels').click(); } await p.getByTestId(`level-${l}`).click(); await p.waitForTimeout(400); };
    await go('#/', 1);
    await go('#/materia/3P/M', 2);
    await go('#/leccion/3P-M-12', 3, steps);
    await go('#/leccion/3P-M-10', 4, level(1));
    await p.evaluate(() => { const s = JSON.parse(localStorage.getItem('matematix')); s.state.lessons['2P-M-20'] = { lv: 1, days: [] }; localStorage.setItem('matematix', JSON.stringify(s)); }); await p.reload();
    await go('#/leccion/2P-M-20', 5, level(2));
    await p.evaluate(() => { const s = JSON.parse(localStorage.getItem('matematix')); s.state.course = '3E'; localStorage.setItem('matematix', JSON.stringify(s)); }); await p.reload();
    await go('#/leccion/3E-FQ-8', 6, steps);
    await p.evaluate(() => { const s = JSON.parse(localStorage.getItem('matematix')); s.state.course = '3P'; localStorage.setItem('matematix', JSON.stringify(s)); }); await p.reload();
    await go('#/progreso', 7, () => p.evaluate(() => window.scrollTo(0, 0)));
    await go('#/adultos/fichas', 8);
    await c.close();
  }
  await b.close(); console.log('ok');
})();
