// Full walk-through on a phone-sized screen: language, starting point, map, one station of each kind, progress, settings.
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://localhost:4174/matematix/';
const SHOTS = process.env.SHOTS || '/tmp/mx-shots';
require('fs').mkdirSync(SHOTS, { recursive: true });
(async () => {
  const b = await chromium.launch();
  let fails = 0;
  const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
  const errs = [];
  const stub = () => { Object.defineProperty(window, 'speechSynthesis', { value: { speak: (u) => { (window.__said ||= []).push(u.text); setTimeout(() => u.onend && u.onend(), 10); }, cancel() {}, getVoices: () => [], addEventListener() {} } }); };
  const page = async (locale) => { const c = await b.newContext({ viewport: { width: 390, height: 844 }, locale }); await c.addInitScript(stub); const p = await c.newPage(); p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => m.type() === 'error' && errs.push(m.text())); return p; };
  const noOverflow = async (p, what) => ok(await p.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `no sideways scroll: ${what}`);

  // Answer whatever exercise is on screen, right (or wrong on purpose)
  async function answer(p, right = true) {
    const ex = p.getByTestId('exercise');
    const kind = await ex.getAttribute('data-kind'), ans = Number(await ex.getAttribute('data-answer'));
    if (kind === 'choice') {
      const btns = p.locator('[data-testid=choices] button');
      const vals = await btns.evaluateAll((els) => els.map((e) => Number(e.dataset.value)));
      const target = right ? ans : vals.find((v) => v !== ans);
      await btns.nth(vals.indexOf(target)).click();
    } else if (kind === 'number' && await p.getByTestId('thread').count()) {
      // the thread: half the jumps dragging with the finger, the rest with the button (both ways must work)
      const th = p.getByTestId('thread');
      const start = Number(await th.getAttribute('data-start')), step = Number(await th.getAttribute('data-step'));
      const min = Number(await th.getAttribute('data-min')), max = Number(await th.getAttribute('data-max'));
      const target = right ? ans : (ans + step <= max ? ans + step : ans - step);
      const box = await th.boundingBox(), W = 360, PAD = 20;
      const xOf = (v) => box.x + ((PAD + ((v - min) / (max - min)) * (W - 2 * PAD)) / W) * box.width;
      const mid = start + Math.trunc((target - start) / step / 2) * step;
      await p.mouse.move(xOf(start), box.y + box.height * 0.66); await p.mouse.down(); await p.mouse.move(xOf(mid), box.y + box.height * 0.66, { steps: 6 }); await p.mouse.up();
      let now = Number(await th.getAttribute('aria-valuenow'));
      while (now !== target) { await p.getByTestId(target > now ? 'jump-more' : 'jump-back').click(); now = Number(await th.getAttribute('aria-valuenow')); }
      await p.getByTestId('check').click();
    } else if (kind === 'number') {
      const v = String(right ? ans : ans + 1);
      for (const d of v) await p.locator('[data-testid=keypad] button', { hasText: new RegExp(`^${d}$`) }).click();
      await p.getByTestId('check').click();
    } else {
      const line = p.getByTestId('line-input');
      const box = await line.boundingBox();
      const min = Number(await line.getAttribute('data-min')), max = Number(await line.getAttribute('data-max'));
      const v = right ? ans : (ans + (max - min) / 2) % (max - min);
      const W = 360, PAD = 22;
      const x = box.x + ((PAD + ((v - min) / (max - min)) * (W - 2 * PAD)) / W) * box.width;
      await p.mouse.click(x, box.y + box.height * 0.6);
      await p.getByTestId('check').click();
    }
  }

  for (const [loc, code, words] of [['es-ES', 'es', { start: 'Empezar', map: 'Tu ruta', end: 'Estación terminada' }], ['ca-ES', 'ca', { start: 'Començar', map: 'La teua ruta', end: 'Estació acabada' }], ['en-GB', 'en', { start: 'Start', map: 'Your route', end: 'Station finished' }]]) {
    const p = await page(loc);
    await p.goto(BASE); await p.waitForTimeout(600);
    ok(/#\/idioma/.test(p.url()), `${code}: first visit asks for the language`);
    await p.screenshot({ path: `${SHOTS}/${code}-0-lang.png` });
    await p.getByTestId(`lang-${code}`).click(); await p.waitForTimeout(300);
    ok((await p.getByTestId('start').innerText()).startsWith(words.start), `${code}: home in the chosen language`);
    ok(await p.evaluate(() => document.documentElement.lang) === { es: 'es', ca: 'ca-ES-valencia', en: 'en-GB' }[code], `${code}: page language set`);
    await p.screenshot({ path: `${SHOTS}/${code}-1-home.png` });

    // Starting point: answer the first two right, then one wrong -> suggestion is that station
    await p.getByTestId('start').click(); await p.waitForTimeout(400);
    await p.screenshot({ path: `${SHOTS}/${code}-2-start.png` });
    await answer(p, true); await p.waitForTimeout(200);
    await answer(p, true); await p.waitForTimeout(200);
    let extra = 0;
    while ((await p.getByTestId('sp-result').count()) === 0 && extra < 8) { await answer(p, false); await p.waitForTimeout(250); extra++; }
    ok(await p.getByTestId('sp-result').count() === 1 && extra <= 4, `${code}: the adaptive starting point gives a suggestion (no marks shown, ${2 + extra} questions)`);
    await p.screenshot({ path: `${SHOTS}/${code}-3-result.png` });
    await p.getByRole('button', { name: { es: 'Ver el mapa', ca: 'Veure el mapa', en: 'See the map' }[code] }).click(); await p.waitForTimeout(300);
    ok((await p.getByTestId('world').count()) === 1, `${code}: the map is the number line`);
    ok((await p.getByTestId('tour').count()) === 1, `${code}: the first visit to the line has a short guided tour`);
    await p.screenshot({ path: `${SHOTS}/${code}-4-tour.png` });
    for (let k = 0; k < 3; k++) await p.getByTestId('tour-next').click();
    ok((await p.getByTestId('tour').count()) === 0, `${code}: the tour ends and does not come back`);
    const nMk = await p.locator('[data-testid^=mk-]').count();
    ok(nMk >= 2 && nMk <= 5, `${code}: only a few things on the line at first (${nMk})`);
    ok((await p.locator('.mk-sugg').count()) === 1, `${code}: the suggested station is marked on the line`);
    await noOverflow(p, `${code} world`);
    await p.screenshot({ path: `${SHOTS}/${code}-4-world.png` });
    await p.goto(BASE + '#/estaciones'); await p.waitForTimeout(300);
    ok((await p.locator('[data-testid^=station-]').count()) === 30, `${code}: list with 30 stations`);
    await p.screenshot({ path: `${SHOTS}/${code}-4-list.png`, fullPage: true });

    // A station of each kind: place (A2), tens/number or choice (A4), number with keypad (B5)
    for (const id of code === 'es' ? ['A2', 'A4', 'B5', 'A1', 'A6', 'B3'] : ['A2', 'B5']) {
      await p.goto(BASE + '#/estacion/' + id); await p.waitForTimeout(400);
      // worked example
      let steps = 0;
      while ((await p.getByTestId('model-text').count()) > 0 && steps < 6) { if (steps === 0) await p.screenshot({ path: `${SHOTS}/${code}-${id}-model.png` }); await p.getByRole('button', { name: { es: 'Siguiente', ca: 'Següent', en: 'Next' }[code] }).click(); await p.waitForTimeout(150); steps++; }
      ok(steps >= 2, `${code} ${id}: worked example with ${steps} steps`);
      for (let k = 0; k < 7; k++) {
        await p.getByTestId('exercise').waitFor();
        if (k === 0) await p.screenshot({ path: `${SHOTS}/${code}-${id}-guided.png` });
        if (k === 2 && id === 'B5') {
          await answer(p, false); await p.waitForTimeout(150);
          ok((await p.getByTestId('feedback').innerText()).length > 20, `${code} ${id}: a mistake shows the strategy`);
          await p.screenshot({ path: `${SHOTS}/${code}-${id}-mistake.png` });
          // second wrong -> answer shown
          if (await p.getByTestId('keypad').count()) { await p.getByRole('button', { name: /⌫/ }).click(); await p.getByRole('button', { name: /⌫/ }).click(); await p.getByRole('button', { name: /⌫/ }).click(); }
          await answer(p, false); await p.waitForTimeout(150);
          await p.screenshot({ path: `${SHOTS}/${code}-${id}-shown.png` });
        } else {
          await answer(p, true); await p.waitForTimeout(150);
        }
        await noOverflow(p, `${code} ${id} item ${k}`);
        await p.getByTestId('next').click(); await p.waitForTimeout(150);
      }
      ok((await p.getByTestId('end').count()) === 1, `${code} ${id}: end screen`);
      const score = await p.getByTestId('end-score').innerText();
      ok(id === 'B5' ? /4/.test(score) : /5/.test(score), `${code} ${id}: score counts only first tries on your own (${score})`);
      if (id === 'B5') await p.screenshot({ path: `${SHOTS}/${code}-${id}-end.png` });
    }
    ok((await p.evaluate(() => window.__said || [])).some((s) => /\d/.test(s)), `${code}: the voice read the exercises`);
    // progress
    await p.goto(BASE + '#/progreso'); await p.waitForTimeout(300);
    ok((await p.getByText({ es: 'En camino', ca: 'En camí', en: 'On the way' }[code]).count()) >= 2, `${code}: progress shows the stations practised`);
    ok((await p.getByTestId('lit-strip').count()) === 1, `${code}: the lit-up strip is there`);
    await p.goto(BASE); await p.waitForTimeout(300);
    ok((await p.getByTestId('carry-on').count()) === 1, `${code}: home has one big "carry on" button`);
    await p.screenshot({ path: `${SHOTS}/${code}-7-home.png` });
    await p.screenshot({ path: `${SHOTS}/${code}-5-progress.png`, fullPage: true });
    await p.goto(BASE + '#/ajustes'); await p.waitForTimeout(300);
    await p.screenshot({ path: `${SHOTS}/${code}-6-settings.png`, fullPage: true });
    await p.context().close();
  }

  // Mastery needs two different days; nothing leaves the device
  const p = await page('es-ES');
  const requests = [];
  p.on('request', (r) => { if (!r.url().startsWith('http://localhost')) requests.push(r.url()); });
  await p.goto(BASE); await p.getByTestId('lang-es').click();
  await p.evaluate(() => { const s = JSON.parse(localStorage.getItem('matematix')); s.state.progress = { A2: { goodDays: ['2026-11-01'], best: 5, sessions: 1 } }; localStorage.setItem('matematix', JSON.stringify(s)); });
  await p.reload(); await p.waitForTimeout(300);
  await p.goto(BASE + '#/estacion/A2'); await p.waitForTimeout(400);
  for (let k = 0; k < 7; k++) { await answer(p, true); await p.waitForTimeout(100); await p.getByTestId('next').click(); await p.waitForTimeout(100); }
  ok((await p.getByText('Ya la dominas').count()) === 1, 'a second good day masters the station');
  const seen1 = await p.evaluate(() => JSON.parse(localStorage.getItem('matematix')).state.seen.A2.length);
  await p.getByRole('button', { name: 'Otra vez' }).click(); await p.waitForTimeout(400);
  const seen2 = await p.evaluate(() => JSON.parse(localStorage.getItem('matematix')).state.seen.A2);
  ok(seen1 === 7 && seen2.length === 14 && new Set(seen2).size === 14, `"Again" brings 7 exercises not seen before (${seen1} then ${seen2.length}, ${new Set(seen2).size} different)`);
  const stored = await p.evaluate(() => localStorage.getItem('matematix'));
  ok(!/name|nombre|email/i.test(stored), 'only numbers are stored');
  ok(requests.length === 0, `no request leaves the device (${requests.join(' ')})`);
  // dark mode screenshot
  await p.evaluate(() => { const s = JSON.parse(localStorage.getItem('matematix')); s.state.theme = 'dark'; localStorage.setItem('matematix', JSON.stringify(s)); });
  await p.reload(); await p.waitForTimeout(300);
  await p.goto(BASE + '#/estacion/B2'); await p.waitForTimeout(500);
  await p.screenshot({ path: `${SHOTS}/es-dark.png` });

  ok(errs.length === 0, 'no page errors ' + errs.join(' | '));
  await b.close();
  console.log(fails ? `${fails} FAILED` : 'ALL PASSED');
})();
