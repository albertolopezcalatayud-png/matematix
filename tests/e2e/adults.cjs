// The adults' area: role screen with a 3-second hold, PT with several pupils (progress kept apart), worksheets with QR
// and answers, wall display, whiteboard, certificate, guide and family materials — in the 3 languages.
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://localhost:4174/matematix/';
const SHOTS = process.env.SHOTS || '/tmp/mx-shots';
(async () => {
  const b = await chromium.launch(); let fails = 0; const errs = [];
  const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
  const hold = async (p, id, ms = 3300) => { const el = p.getByTestId(id); await el.hover(); await p.mouse.down(); await p.waitForTimeout(ms); await p.mouse.up(); await p.waitForTimeout(250); };
  const frame = async (p) => { await p.waitForTimeout(700); return p.evaluate(() => document.getElementById('print-frame')?.contentDocument?.body?.innerHTML ?? ''); };
  for (const code of ['es', 'ca', 'en']) {
    const c = await b.newContext({ viewport: { width: 390, height: 844 } });
    await c.addInitScript(() => { window.print = () => {}; Object.defineProperty(window, 'speechSynthesis', { value: { speak: (u) => setTimeout(() => u.onend && u.onend(), 5), cancel() {}, getVoices: () => [], addEventListener() {} } }); });
    const p = await c.newPage(); p.on('pageerror', (e) => errs.push(`${code}: ${e.message}`));
    p.on('frameattached', (f) => f.page().evaluate(() => { const fr = document.getElementById('print-frame'); if (fr && fr.contentWindow) fr.contentWindow.print = () => {}; }).catch(() => {}));
    await p.goto(BASE); if (code !== 'es') { await p.getByTestId('change-lang').click(); await p.getByTestId(`lang-${code}`).click(); } await p.waitForTimeout(300);
    // a short press does nothing
    await hold(p, 'who-pt', 800);
    ok(/#\/quien/.test(p.url()), `${code}: a short press does not open the adults' area`);
    await hold(p, 'who-pt');
    ok(/#\/adultos$/.test(p.url()), `${code}: holding 3 s opens the adults' area`);
    ok(await p.getByTestId('hub-pupils').isVisible(), `${code}: PT sees "my pupils" first`);
    await p.screenshot({ path: `${SHOTS}/${code}-a-hub.png`, fullPage: true });

    // two pupils, progress kept apart
    await p.getByTestId('hub-pupils').click(); await p.waitForTimeout(300);
    await p.getByTestId('alias').fill('Lince'); await p.getByTestId('add-pupil').click();
    await p.evaluate(() => { const s = JSON.parse(localStorage.getItem('matematix')); s.state.progress = { A1: { goodDays: ['2026-11-20', '2026-11-21'], best: 5, sessions: 2 } }; s.state.minutes = { [new Date().toLocaleDateString('sv-SE')]: 9 }; localStorage.setItem('matematix', JSON.stringify(s)); });
    await p.reload(); await p.waitForTimeout(400);
    await p.getByTestId('alias').fill('Nube'); await p.getByTestId('add-pupil').click(); await p.waitForTimeout(200);
    const st = await p.evaluate(() => JSON.parse(localStorage.getItem('matematix')).state);
    const ids = Object.keys(st.pupils).filter((k) => k !== '_me');
    ok(ids.length === 2 && Object.keys(st.progress).length === 0, `${code}: the second pupil starts from scratch`);
    const lince = ids.find((k) => st.pupils[k].alias === 'Lince');
    ok(st.pupils[lince].data.progress.A1 && !JSON.stringify(st).includes('"name"'), `${code}: the first pupil keeps their progress (nickname only)`);
    await p.getByTestId('set-help').check();
    await p.getByTestId(`pupil-${lince}`).click(); await p.waitForTimeout(200);
    const st2 = await p.evaluate(() => JSON.parse(localStorage.getItem('matematix')).state);
    ok(st2.progress.A1 && st2.help === 'normal', `${code}: switching back brings their progress and their own settings`);
    await p.getByTestId('print-session').click();
    const ss = await frame(p);
    ok(ss.includes('Lince') && ss.includes('PAP') || ss.includes('Lince') && code === 'en', `${code}: printable session sheet for the support plan`);
    await p.screenshot({ path: `${SHOTS}/${code}-a-pupils.png`, fullPage: true });
    await p.goto(BASE); await p.waitForTimeout(300);
    ok((await p.getByTestId('who-now').innerText()).includes('Lince'), `${code}: the child's home shows who is using it`);
    ok((await p.getByTestId('carry-on').count()) === 1, `${code}: and their own "carry on"`);
    await p.getByTestId('nav-settings').click(); await p.waitForTimeout(200);
    await hold(p, 'to-adults');
    ok(/#\/adultos$/.test(p.url()), `${code}: adults get back in from the home screen by holding`);

    // worksheets
    await p.getByTestId('hub-sheets').click(); await p.waitForTimeout(300);
    await p.getByTestId('sheet-station').selectOption('C4');
    await p.getByTestId('print-sheet').click();
    const ws = await frame(p);
    const items = (ws.match(/class="no-break"/g) || []).length;
    ok(items === 8 && ws.includes('<svg') && ws.includes('#/estacion/C4') === false && /<path[^>]+d="M/.test(ws), `${code}: worksheet with 8 exercises, drawings and a QR (${items})`);
    ok((ws.match(/<li /g) || []).length === 8, `${code}: separate answer sheet`);
    await p.getByTestId('sheet-station').selectOption('A3');
    await p.getByTestId('print-sheet').click();
    const ws2 = await frame(p);
    ok(ws2 !== ws && (ws2.match(/class="no-break"/g) || []).length === 8, `${code}: a number-line worksheet too, different each time`);
    await p.getByTestId('print-mural').click();
    ok(((await frame(p)).match(/class="pg"/g) || []).length === 5, `${code}: wall display in 5 pages`);
    await p.screenshot({ path: `${SHOTS}/${code}-a-sheets.png`, fullPage: true });

    // whiteboard
    await p.goto(BASE + '#/adultos/pizarra'); await p.waitForTimeout(400);
    const box = await p.locator('[data-testid="board"] svg').boundingBox();
    await p.mouse.click(box.x + box.width * (40 + (7 / 20) * 920) / 1000, box.y + box.height * 0.6); await p.waitForTimeout(150);
    ok((await p.getByTestId('board-value').innerText()).trim() === '7', `${code}: tapping the whiteboard line marks 7`);
    await p.getByRole('button', { name: '+1' }).click();
    ok((await p.getByTestId('board-value').innerText()).trim() === '8', `${code}: jumps move along the line`);
    await p.getByTestId('model-station').selectOption('D2');
    ok((await p.getByTestId('model-step').innerText()).length > 10, `${code}: a station's worked example in large print`);
    await p.screenshot({ path: `${SHOTS}/${code}-a-board.png`, fullPage: true });

    // certificate, guide, family
    await p.goto(BASE + '#/adultos/certificado'); await p.waitForTimeout(400);
    await p.getByTestId('cert-name').fill('Ana'); await p.getByTestId('print-cert').click();
    const cert = await frame(p);
    ok(cert.includes('Ana') && !(await p.evaluate(() => localStorage.getItem('matematix'))).includes('Ana'), `${code}: certificate printed, the name is never stored`);
    await p.goto(BASE + '#/adultos/guia'); await p.waitForTimeout(400);
    ok((await p.getByTestId('guide').locator('li').count()) >= 30, `${code}: guide with signs, steps, classroom measures and hands-on ideas`);
    await p.screenshot({ path: `${SHOTS}/${code}-a-guide.png`, fullPage: true });
    await p.goto(BASE + '#/adultos/casa'); await p.waitForTimeout(400);
    await p.getByTestId('print-race').click(); ok(((await frame(p)).match(/<rect/g) || []).length === 31, `${code}: race board 0–30`);
    await p.getByTestId('print-ten').click(); ok(((await frame(p)).match(/font-size:34pt/g) || []).length === 12, `${code}: make-10 cards`);
    await p.getByTestId('print-week').click(); ok((await frame(p)).length > 100, `${code}: weekly card`);
    await p.screenshot({ path: `${SHOTS}/${code}-a-family.png`, fullPage: true });
    ok(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${code}: no sideways scroll`);
    await c.close();
  }
  ok(errs.length === 0, 'no page errors ' + errs.join(' | '));
  await b.close(); console.log(fails ? `${fails} FAILED` : 'ALL PASSED');
})();
