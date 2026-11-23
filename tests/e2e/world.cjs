// The living number line: zoom opens in stages, tap measures, discoveries, golden stretches, the thread recognises "make 10".
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://localhost:4174/matematix/';
const SHOTS = process.env.SHOTS || '/tmp/mx-shots';
(async () => {
  const b = await chromium.launch(); let fails = 0; const errs = [];
  const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
  const c = await b.newContext({ viewport: { width: 390, height: 844 }, locale: 'es-ES' });
  await c.addInitScript(() => { window.__tones = 0; Object.defineProperty(window, 'speechSynthesis', { value: { speak: (u) => setTimeout(() => u.onend && u.onend(), 5), cancel() {}, getVoices: () => [], addEventListener() {} } });
    const AC = window.AudioContext; window.AudioContext = class extends AC { createOscillator() { window.__tones++; return super.createOscillator(); } }; navigator.vibrate = () => { window.__buzz = (window.__buzz || 0) + 1; return true; }; });
  const p = await c.newPage(); p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(BASE); await p.getByTestId('lang-es').click(); await p.waitForTimeout(200);
  await p.goto(BASE + '#/mapa'); await p.waitForTimeout(500);
  ok((await p.getByTestId('tour').count()) === 1, 'first visit: guided tour');
  await p.screenshot({ path: `${SHOTS}/w-tour1.png` });
  await p.getByTestId('tour-next').click(); await p.waitForTimeout(200);
  const world = p.getByTestId('world'); const box = await world.boundingBox();
  await p.mouse.click(box.x + box.width * 0.4, box.y + box.height * 0.55); await p.waitForTimeout(300);
  ok((await p.getByText(/próxima estación/).count()) === 1, 'tapping the line moves the tour on to the next station');
  await p.screenshot({ path: `${SHOTS}/w-tour3.png` });
  await p.getByTestId('tour-next').click(); await p.waitForTimeout(200);
  ok(Number(await world.getAttribute('data-reach')) === 20, 'a new child: the line is open up to 20');
  // zoom out as far as allowed: stops near the open part
  for (let i = 0; i < 6; i++) { await p.getByTestId('zout').click(); await p.waitForTimeout(350); }
  await p.screenshot({ path: `${SHOTS}/w-out-new.png` });
  ok((await p.getByText('🔒 Por explorar').count()) === 1, 'beyond the open part it says "still to explore"');
  // tap to measure
  await p.getByTestId('zhome').click(); await p.waitForTimeout(500);
  const t0 = await p.evaluate(() => window.__tones);
  await p.mouse.click(box.x + box.width * 0.62, box.y + box.height * 0.55); await p.waitForTimeout(200);
  ok((await p.evaluate(() => window.__tones)) > t0, 'tapping the line plays the note of that number');
  await p.screenshot({ path: `${SHOTS}/w-measure.png` });
  // a discovery: the week (7)
  const wk = p.locator('[data-testid=mk-week]');
  ok(await wk.count() === 1, 'a hidden discovery (?) appears near 7');
  await wk.click(); await p.waitForTimeout(200);
  await p.screenshot({ path: `${SHOTS}/w-find-q.png` });
  await p.getByTestId('w-sheet').locator('button[data-value="5"]').click(); await p.waitForTimeout(100);
  ok((await p.getByText('Ese no.').count()) === 1, 'a wrong guess gets a gentle hint');
  await p.getByTestId('w-sheet').locator('button[data-value="7"]').click(); await p.waitForTimeout(200);
  ok((await p.getByText('¡Hallazgo encontrado!').count()) >= 1, 'the right number finds it');
  await p.screenshot({ path: `${SHOTS}/w-find-ok.png` });
  // a station marker opens the station
  await p.getByTestId('zhome').click(); await p.waitForTimeout(500);
  await p.locator('.mk-sugg').click(); await p.waitForTimeout(150);
  await p.getByTestId('w-go').click(); await p.waitForTimeout(400);
  ok(/estacion\/A1/.test(p.url()), 'the next station is on the line and opens');
  await p.goto(BASE + '#/estacion/B5'); await p.waitForTimeout(400);
  // the thread: 8 + 5, resting on 10 is recognised
  for (let s = 0; s < 6 && (await p.getByTestId('model-text').count()); s++) { await p.getByRole('button', { name: 'Siguiente' }).click(); await p.waitForTimeout(100); }
  await p.evaluate(() => { window.__buzz = 0; });
  let recognised = false;
  for (let k = 0; k < 7; k++) {
    const ex = p.getByTestId('exercise'); await ex.waitFor();
    const th = p.getByTestId('thread');
    if (await th.count()) {
      const ans = Number(await ex.getAttribute('data-answer')), start = Number(await th.getAttribute('data-start'));
      const ten = ans > start ? Math.ceil((start + 1) / 10) * 10 : Math.floor((start - 1) / 10) * 10;
      const dir = ans > start ? 'jump-more' : 'jump-back';
      let now = start; while (now !== ten) { await p.getByTestId(dir).click(); now = Number(await th.getAttribute('aria-valuenow')); }
      if (k === 0) await p.screenshot({ path: `${SHOTS}/w-thread-ten.png` });
      await p.waitForTimeout(500);
      while (now !== ans) { await p.getByTestId(dir).click(); now = Number(await th.getAttribute('aria-valuenow')); }
      await p.getByTestId('check').click(); await p.waitForTimeout(150);
      if (/el 10: ese es el truco|en el \d+0: ese es el truco/.test(await p.getByTestId('feedback').innerText())) recognised = true;
      if (k === 0) await p.screenshot({ path: `${SHOTS}/w-thread-ok.png` });
    } else {
      const ans = await ex.getAttribute('data-answer');
      for (const d of ans) await p.locator('[data-testid=keypad] button', { hasText: new RegExp(`^${d}$`) }).click();
      await p.getByTestId('check').click();
    }
    await p.getByTestId('next').click(); await p.waitForTimeout(120);
  }
  ok(recognised, 'resting on the ten is recognised as the strategy');
  ok((await p.evaluate(() => window.__buzz)) > 10, 'each jump vibrates (where the device can)');
  // progress
  await p.goto(BASE + '#/progreso'); await p.waitForTimeout(300);
  ok((await p.getByTestId('find-week').count()) === 1, 'the discovery is in "What I have lit up"');
  await p.screenshot({ path: `${SHOTS}/w-progress.png`, fullPage: true });
  // mastering stations opens the line further and lights it up
  await p.evaluate(() => { const s = JSON.parse(localStorage.getItem('matematix')); s.state.progress = { A3: { goodDays: ['2026-11-01', '2026-11-02'], best: 5, sessions: 2 }, B5: { goodDays: ['2026-11-01', '2026-11-03'], best: 5, sessions: 2 } }; localStorage.setItem('matematix', JSON.stringify(s)); });
  await p.reload(); await p.waitForTimeout(200); await p.goto(BASE + '#/mapa'); await p.waitForTimeout(600);
  ok(Number(await p.getByTestId('world').getAttribute('data-reach')) === 100, 'mastering A3 or B5 opens the line up to 100');
  ok((await p.getByText('¡Tu recta se ha abierto hasta el 100!').count()) === 1, 'and says so once');
  await p.screenshot({ path: `${SHOTS}/w-opened.png` });
  await p.getByRole('button', { name: 'Alejar' }).last().click(); await p.waitForTimeout(500);
  await p.screenshot({ path: `${SHOTS}/w-100.png` });
  await p.goto(BASE + '#/progreso'); await p.waitForTimeout(300);
  await p.screenshot({ path: `${SHOTS}/w-progress-lit.png` });
  // "I can already do this": 5 with no help, one try each; 4 right passes the station
  await p.goto(BASE + '#/estacion/A4'); await p.waitForTimeout(400);
  await p.getByTestId('know-it').click(); await p.waitForTimeout(200);
  ok((await p.getByTestId('test-intro').count()) === 1, '"I can already do this" explains the test');
  for (let k = 0; k < 5; k++) {
    const ex = p.getByTestId('exercise'); await ex.waitFor();
    const kind = await ex.getAttribute('data-kind'), ans = Number(await ex.getAttribute('data-answer'));
    const right = k !== 2; // one mistake on purpose: 4 out of 5 still passes
    if (kind === 'choice') { const btns = p.locator('[data-testid=choices] button'); const vals = await btns.evaluateAll((els) => els.map((e) => Number(e.dataset.value))); await btns.nth(vals.indexOf(right ? ans : vals.find((v) => v !== ans))).click(); }
    else { for (const d of String(right ? ans : ans + 1)) await p.locator('[data-testid=keypad] button', { hasText: new RegExp(`^${d}$`) }).click(); await p.getByTestId('check').click(); }
    await p.waitForTimeout(100);
    if (k === 2) ok((await p.getByTestId('feedback').innerText()).includes('La respuesta es'), 'in the test a mistake shows the answer at once (one try)');
    await p.getByTestId('next').click(); await p.waitForTimeout(100);
  }
  ok((await p.getByTestId('test-result').innerText()).startsWith('¡Superada!'), '4 out of 5 passes the station');
  ok((await p.getByTestId('end-next').count()) === 1, 'after passing, the big button carries on to the next station');
  await p.screenshot({ path: `${SHOTS}/w-passed.png` });
  await p.goto(BASE + '#/estaciones'); await p.waitForTimeout(300);
  ok((await p.getByTestId('station-A4').innerText()).includes('Dominada'), 'the passed station counts as mastered');
  await p.goto(BASE + '#/estacion/A4'); await p.waitForTimeout(300);
  ok((await p.getByTestId('know-it').count()) === 0, 'no "I can already do this" on a mastered station');
  // a strong child: the starting point jumps up and needs few questions
  await p.evaluate(() => { const s = JSON.parse(localStorage.getItem('matematix')); s.state.suggested = null; s.state.last = null; s.state.progress = {}; localStorage.setItem('matematix', JSON.stringify(s)); });
  await p.reload(); await p.goto(BASE + '#/punto-de-partida'); await p.waitForTimeout(400);
  let q = 0;
  while ((await p.getByTestId('sp-result').count()) === 0 && q < 12) {
    const ex = p.getByTestId('exercise'); const kind = await ex.getAttribute('data-kind'), ans = Number(await ex.getAttribute('data-answer'));
    if (kind === 'choice') { const btns = p.locator('[data-testid=choices] button'); const vals = await btns.evaluateAll((els) => els.map((e) => Number(e.dataset.value))); await btns.nth(vals.indexOf(ans)).click(); }
    else if (kind === 'number') { for (const d of String(ans)) await p.locator('[data-testid=keypad] button', { hasText: new RegExp(`^${d}$`) }).click(); await p.getByTestId('check').click(); }
    else { const line = p.getByTestId('line-input'); const box = await line.boundingBox(); const min = Number(await line.getAttribute('data-min')), max = Number(await line.getAttribute('data-max')); await p.mouse.click(box.x + ((22 + ((ans - min) / (max - min)) * 316) / 360) * box.width, box.y + box.height * 0.6); await p.getByTestId('check').click(); }
    await p.waitForTimeout(150); q++;
  }
  ok(q <= 10 && (await p.getByTestId('sp-all-right').count()) === 1, `a child who knows everything is placed at the end in ${q} questions and told about "I can already do this"`);
  await p.screenshot({ path: `${SHOTS}/w-sp-strong.png` });
  const noScroll = await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1);
  ok(noScroll, 'no sideways scroll');
  ok(errs.length === 0, 'no page errors ' + errs.join(' | '));
  await b.close(); console.log(fails ? `${fails} FAILED` : 'ALL PASSED');
})();
