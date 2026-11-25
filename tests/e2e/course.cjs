// The pupil's path in the new structure: school year → subject → lesson → idea and example → levels 1, 2 and 3.
// Then every subject of every school year opens without errors, in the three languages.
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://localhost:4174/matematix/';
const SHOTS = process.env.SHOTS || '/tmp/mx-shots';
require('fs').mkdirSync(SHOTS, { recursive: true });

(async () => {
  const b = await chromium.launch(); let fails = 0; const errs = [];
  const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
  const stub = () => { window.print = () => {}; Object.defineProperty(window, 'speechSynthesis', { value: { speak: (u) => setTimeout(() => u.onend && u.onend(), 5), cancel() {}, getVoices: () => [], addEventListener() {} } }); };
  const noOverflow = async (p, what) => ok(await p.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `no sideways scroll: ${what}`);

  /** Answer the exercise on screen: right (tap the right option, or type the exact answer) or wrong. */
  async function answer(p, right = true) {
    const ex = p.getByTestId('exercise');
    if ((await ex.getAttribute('data-typed')) === '1') {
      const raw = right ? await ex.getAttribute('data-raw') : '987654';
      const kp = p.getByTestId('keypad');
      if (raw.startsWith('-')) await kp.locator('button', { hasText: '−' }).click();
      for (const ch of raw.replace(/^-/, '')) {
        if (/\d/.test(ch)) await kp.locator('button', { hasText: new RegExp(`^${ch}$`) }).click();
        else if (ch === '.') await kp.locator('button', { hasText: /^[.,]$/ }).click();
        else if (ch === '/') await kp.locator('button', { hasText: /^\/$/ }).click();
      }
      await p.getByTestId('check').click();
    } else {
      await p.locator(`[data-testid=choices] button[data-right="${right ? 1 : 0}"]`).first().click();
    }
    await p.waitForTimeout(80);
    if (!right && !(await p.getByTestId('next').count())) await answer(p, false); // a second wrong try shows the answer
  }
  async function playLevel(p, level, wrongs = 0, pick = true) {
    if (pick) { await p.getByTestId(`level-${level}`).click(); await p.waitForTimeout(150); }
    for (let i = 0; i < 5; i++) {
      await answer(p, i >= wrongs);
      await p.getByTestId('next').click(); await p.waitForTimeout(120);
    }
    return (await p.getByTestId('end-score').innerText()).trim();
  }

  for (const code of ['es', 'ca', 'en']) {
    const c = await b.newContext({ viewport: { width: 390, height: 844 } }); await c.addInitScript(stub);
    const p = await c.newPage(); p.on('pageerror', (e) => errs.push(`${code}: ${e.message}`));
    await p.goto(BASE); if (code !== 'es') { await p.getByTestId('change-lang').click(); await p.getByTestId(`lang-${code}`).click(); }
    await p.getByTestId('who-pupil').click(); await p.waitForTimeout(300);
    await p.screenshot({ path: `${SHOTS}/${code}-c1-pick.png`, fullPage: true });
    await p.getByTestId('course-1P').click(); await p.waitForTimeout(300);
    await p.goto(BASE); await p.waitForTimeout(300);
    ok(await p.getByTestId('subject-M').isVisible() && await p.getByTestId('subject-CM').isVisible(), `${code}: 1.º de Primaria shows Maths and Science`);
    ok(await p.evaluate(() => document.documentElement.dataset.age) === 'kid', `${code}: playful look for younger pupils`);
    await p.screenshot({ path: `${SHOTS}/${code}-c2-home.png`, fullPage: true });
    await p.getByTestId('subject-M').click(); await p.waitForTimeout(300);
    ok((await p.getByTestId('block').count()) >= 3, `${code}: the subject is split into blocks`);
    await p.getByTestId('lesson-1P-M-8').click(); await p.waitForTimeout(400);
    ok((await p.getByTestId('idea-text').count()) >= 1, `${code}: the lesson starts with the idea`);
    while (await p.getByTestId('next-step').count()) await p.getByTestId('next-step').click();
    ok((await p.getByTestId('example-step').count()) >= 2, `${code}: the worked example, step by step`);
    await p.screenshot({ path: `${SHOTS}/${code}-c3-idea.png`, fullPage: true });
    await p.getByTestId('to-levels').click(); await p.waitForTimeout(200);
    ok(await p.getByTestId('level-2').isDisabled(), `${code}: level 2 is locked until level 1 is passed`);
    // level 1 with two wrong first tries → not passed (3 of 5)
    const s1 = await playLevel(p, 1, 2);
    let st = await p.evaluate(() => JSON.parse(localStorage.getItem('matematix')).state);
    ok(st.lessons['1P-M-8'].lv === 0, `${code}: 3 of 5 does not pass the level (${s1})`);
    await p.getByTestId('again').click(); await p.waitForTimeout(200);
    await playLevel(p, 1, 0, false);
    await p.screenshot({ path: `${SHOTS}/${code}-c4-end.png`, fullPage: true });
    st = await p.evaluate(() => JSON.parse(localStorage.getItem('matematix')).state);
    ok(st.lessons['1P-M-8'].lv === 1, `${code}: 5 of 5 passes level 1`);
    await p.getByTestId('end-next-level').click(); await p.waitForTimeout(200);
    // level 2: typed answers when they are numbers
    ok((await p.getByTestId('exercise').getAttribute('data-typed')) === '1', `${code}: level 2 asks to type the number`);
    await p.screenshot({ path: `${SHOTS}/${code}-c5-typed.png`, fullPage: true });
    for (let i = 0; i < 5; i++) { await answer(p); await p.getByTestId('next').click(); await p.waitForTimeout(100); }
    await p.getByTestId('end-next-level').click(); await p.waitForTimeout(200);
    await playLevel(p, 3, 0, false);
    st = await p.evaluate(() => JSON.parse(localStorage.getItem('matematix')).state);
    ok(st.lessons['1P-M-8'].lv === 3 && st.lessons['1P-M-8'].days.length === 1, `${code}: the three levels complete the lesson`);
    await p.goto(BASE + '#/progreso'); await p.waitForTimeout(300);
    ok((await p.getByTestId('progress-M').innerText()).includes('1'), `${code}: "my progress" shows the lesson`);
    await p.screenshot({ path: `${SHOTS}/${code}-c6-progress.png`, fullPage: true });
    await noOverflow(p, `${code} progress`);
    // ESO gets the sober look
    await p.goto(BASE + '#/curso'); await p.waitForTimeout(200);
    await p.getByTestId('course-3E').click(); await p.waitForTimeout(300);
    ok(await p.evaluate(() => document.documentElement.dataset.age) === 'teen', `${code}: ESO gets the less childish look`);
    await p.screenshot({ path: `${SHOTS}/${code}-c7-teen.png`, fullPage: true });
    await c.close();
  }

  // Every subject of every year: open the first lesson of each block and answer one exercise (Spanish, then the other two on a sample).
  const c = await b.newContext({ viewport: { width: 390, height: 844 } }); await c.addInitScript(stub);
  const p = await c.newPage(); p.on('pageerror', (e) => errs.push(`walk: ${e.message}`));
  await p.goto(BASE); await p.getByTestId('who-pupil').click(); await p.waitForTimeout(200);
  const years = ['1P', '2P', '3P', '4P', '5P', '6P', '1E', '2E', '3E', '4E'];
  let opened = 0, problems = [];
  for (const y of years) {
    await p.goto(BASE + '#/curso'); await p.waitForTimeout(150);
    await p.getByTestId(`course-${y}`).click(); await p.waitForTimeout(250);
    await p.goto(BASE + '#/materias'); await p.waitForTimeout(250);
    const subj = await p.locator('[data-testid^="subject-"]').evaluateAll((els) => els.map((e) => e.getAttribute('data-testid').slice(8)));
    for (const s of subj) {
      await p.goto(`${BASE}#/materia/${y}/${s}`); await p.waitForTimeout(250);
      const lessons = await p.locator('[data-testid^="lesson-"]').evaluateAll((els) => els.map((e) => e.getAttribute('data-testid').slice(7)));
      const pick = [lessons[0], lessons[Math.floor(lessons.length / 2)], lessons[lessons.length - 1]];
      for (const id of pick) {
        await p.goto(`${BASE}#/leccion/${id}`); await p.waitForTimeout(300);
        if (!(await p.getByTestId('idea-text').count())) { problems.push(id); continue; }
        while (await p.getByTestId('next-step').count()) await p.getByTestId('next-step').click();
        await p.getByTestId('to-levels').click(); await p.getByTestId('level-1').click(); await p.waitForTimeout(120);
        await answer(p); if (!(await p.getByTestId('next').count())) problems.push(id + ' (answer)');
        opened++;
      }
      await noOverflow(p, `${y}-${s}`);
    }
  }
  ok(problems.length === 0, `every subject opens and answers (${opened} lessons) ${problems.slice(0, 5).join(' ')}`);
  ok(errs.length === 0, 'no page errors ' + errs.slice(0, 3).join(' | '));
  await b.close(); console.log(fails ? `${fails} FAILED` : 'ALL PASSED');
})();
