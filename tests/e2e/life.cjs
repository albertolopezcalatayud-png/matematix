// Real-life maths (topic F): every lesson in the three languages, with tables and charts, on a phone screen.
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://localhost:4174/matematix/';
const SHOTS = process.env.SHOTS || '/tmp/mx-shots';
require('fs').mkdirSync(SHOTS, { recursive: true });
(async () => {
  const b = await chromium.launch();
  let fails = 0; const errs = [];
  const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
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
  for (const code of ['es', 'ca', 'en']) {
    const c = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
    await c.addInitScript(() => { Object.defineProperty(window, 'speechSynthesis', { value: { speak: (u) => setTimeout(() => u.onend && u.onend(), 5), cancel() {}, getVoices: () => [], addEventListener() {} } }); });
    const p = await c.newPage(); p.on('pageerror', (e) => errs.push(`${code}: ${e.message}`)); p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
    await p.goto(BASE); await p.waitForTimeout(400);
    if (code !== 'es') { await p.getByTestId('change-lang').click(); await p.getByTestId(`lang-${code}`).click(); }
    await p.getByTestId('who-pupil').click(); await p.waitForTimeout(300);
    await p.goto(BASE + '#/tema/F'); await p.waitForTimeout(400);
    ok((await p.locator('[data-testid^=station-F]').count()) === 6, `${code}: the real-life topic has 6 lessons`);
    await p.screenshot({ path: `${SHOTS}/${code}-F-topic.png`, fullPage: true });
    let sawTable = false, sawChart = false;
    for (const id of ['F1', 'F2', 'F3', 'F4', 'F5', 'F6']) {
      await p.goto(BASE + '#/estacion/' + id); await p.waitForTimeout(400);
      let steps = 0;
      while ((await p.getByTestId('model-text').count()) > 0 && steps < 6) { await p.screenshot({ path: `${SHOTS}/${code}-${id}-model${steps}.png` }); await p.getByRole('button', { name: { es: 'Siguiente', ca: 'Següent', en: 'Next' }[code] }).click(); await p.waitForTimeout(120); steps++; }
      ok(steps >= 2, `${code} ${id}: worked example (${steps} steps)`);
      for (let k = 0; k < 7; k++) {
        await p.getByTestId('exercise').waitFor();
        if (await p.getByTestId('table').count()) sawTable = true;
        if (await p.getByTestId('chart').count()) sawChart = true;
        if (k < 2 || k === 4) await p.screenshot({ path: `${SHOTS}/${code}-${id}-ex${k}.png` });
        await answer(p, true); await p.waitForTimeout(120);
        ok(await p.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `${code} ${id} ${k}: no sideways scroll`);
        await p.getByTestId('next').click(); await p.waitForTimeout(120);
      }
      ok((await p.getByTestId('end').count()) === 1 && /5/.test(await p.getByTestId('end-score').innerText()), `${code} ${id}: all right counts 5 out of 5`);
    }
    ok(sawTable && sawChart, `${code}: tables and charts appear`);
    // a mistake shows the strategy in a timetable lesson
    await c.close();
  }
  ok(errs.length === 0, 'no page errors ' + errs.slice(0, 3).join(' | '));
  await b.close();
  console.log(fails ? `${fails} FAILED` : 'ALL PASSED');
  process.exit(fails ? 1 : 0);
})();
