// Choosing a school year, moving easier / harder, and stepping back after two hard days.
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://localhost:4174/matematix/';
const SHOTS = process.env.SHOTS || '/tmp/mx-shots';
(async () => {
  const b = await chromium.launch(); let fails = 0; const errs = [];
  const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
  for (const code of ['es', 'ca', 'en']) {
    const c = await b.newContext({ viewport: { width: 390, height: 844 } });
    const p = await c.newPage(); p.on('pageerror', (e) => errs.push(`${code}: ${e.message}`));
    await p.goto(BASE); await p.getByTestId(`lang-${code}`).click(); await p.getByTestId('who-pupil').click(); await p.waitForTimeout(300);
    await p.screenshot({ path: `${SHOTS}/${code}-L1-course.png`, fullPage: true });
    await p.getByTestId('course-p3').click(); await p.waitForTimeout(400);
    ok(/estacion\/A5/.test(p.url()), `${code}: 3.º de Primaria starts at its first station (A5)`);
    await p.goto(BASE); await p.waitForTimeout(300);
    const lvl = await p.getByTestId('level').innerText();
    ok(/3/.test(lvl), `${code}: home shows the year being worked on`);
    ok(await p.evaluate(() => document.documentElement.dataset.age) === 'kid', `${code}: playful look for younger pupils`);
    await p.screenshot({ path: `${SHOTS}/${code}-L2-home.png`, fullPage: true });
    await p.getByTestId('harder').click(); await p.waitForTimeout(300);
    ok(/estacion\/D1/.test(p.url()), `${code}: "harder" goes to the next year's start`);
    await p.goto(BASE); await p.waitForTimeout(300);
    await p.getByTestId('easier').click(); await p.waitForTimeout(300);
    ok(/estacion\/A5/.test(p.url()), `${code}: "easier" goes back a year`);
    // two hard days on A5 → next time, the station before it
    await p.evaluate(() => { const s = JSON.parse(localStorage.getItem('matematix')); s.state.progress = { A5: { goodDays: [], best: 1, sessions: 1, hardDays: ['2026-11-01'] } }; s.state.last = 'A5'; localStorage.setItem('matematix', JSON.stringify(s)); });
    await p.goto(BASE + '#/estacion/A5'); await p.reload(); await p.waitForTimeout(500);
    // play a session answering wrong: skip the model, then fail every exercise with "show answer" flow
    for (let k = 0; k < 8 && await p.getByTestId('model-text').count(); k++) await p.getByRole('button', { name: { es: 'Siguiente', ca: 'Següent', en: 'Next' }[code] }).click();
    for (let n = 0; n < 12 && !(await p.getByTestId('end').count()); n++) {
      const ex = p.getByTestId('exercise'); const kind = await ex.getAttribute('data-kind'); const ans = Number(await ex.getAttribute('data-answer'));
      for (let tries = 0; tries < 3 && await p.getByTestId('exercise').count() && !(await p.getByTestId('end').count()); tries++) {
        if (kind === 'choice') { const opts = await p.getByTestId('choices').locator('button:not([disabled])').all(); for (const o of opts) { if (Number(await o.getAttribute('data-value')) !== ans) { await o.click(); break; } } }
        else if (kind === 'place') { const box = await p.locator('[data-testid="exercise"] svg').first().boundingBox(); await p.mouse.click(box.x + box.width * 0.97, box.y + box.height * 0.6); await p.getByTestId('check').click(); }
        else { const kp = p.getByTestId('keypad'); if (await kp.count()) { await kp.getByRole('button', { name: '9' }).click(); } await p.getByTestId('check').click().catch(() => {}); }
        await p.waitForTimeout(150);
        const nextBtn = p.getByTestId('next'); if (await nextBtn.count()) { await nextBtn.click(); await p.waitForTimeout(150); break; }
      }
    }
    const st = await p.evaluate(() => JSON.parse(localStorage.getItem('matematix')).state);
    ok(st.wentBack === 'A5' && st.suggested && st.suggested !== 'A5', `${code}: after a second hard day, the next station is the one it builds on (${st.suggested})`);
    await p.goto(BASE); await p.waitForTimeout(300);
    await p.screenshot({ path: `${SHOTS}/${code}-L3-back.png`, fullPage: true });
    ok(!(await p.getByTestId('carry-on').getAttribute('href')).includes('A5'), `${code}: home sends there, with a note`);
    // older pupils get the sober look
    await p.evaluate(() => { const s = JSON.parse(localStorage.getItem('matematix')); s.state.course = 's2'; localStorage.setItem('matematix', JSON.stringify(s)); });
    await p.reload(); await p.waitForTimeout(300);
    ok(await p.evaluate(() => document.documentElement.dataset.age) === 'teen', `${code}: ESO gets the less childish look`);
    await p.screenshot({ path: `${SHOTS}/${code}-L4-teen.png`, fullPage: true });
    await c.close();
  }
  ok(errs.length === 0, 'no page errors ' + errs.slice(0, 3).join(' | '));
  await b.close(); console.log(fails ? `${fails} FAILED` : 'ALL PASSED');
})();
