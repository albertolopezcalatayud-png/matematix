// Play Store feature graphic (1024 × 500) in the three languages.
const { chromium } = require('playwright');
const fs = require('fs');
const font = (w) => `@font-face{font-family:Lexend;font-weight:${w};src:url(data:font/woff2;base64,${fs.readFileSync(`node_modules/@fontsource/lexend/files/lexend-latin-${w}-normal.woff2`).toString('base64')}) format('woff2')}`;
const T = { es: ['Mates y ciencias paso a paso', 'sin prisas y sin cuentas'], ca: ['Mates i ciències pas a pas', 'sense presses i sense comptes'], en: ['Maths and science step by step', 'no rush, no accounts'] };
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1024, height: 500 } });
  for (const [l, [a, c]] of Object.entries(T)) {
    let ticks = ''; for (let v = 0; v <= 20; v++) { const x = 70 + v * 42; ticks += `<line x1="${x}" y1="${v % 10 ? 392 : 380}" x2="${x}" y2="${v % 10 ? 418 : 430}" stroke="#262A40" stroke-width="${v % 10 ? 3 : 5}" stroke-linecap="round"/>` + (v % 5 === 0 ? `<text x="${x}" y="462" font-size="22" font-weight="800" text-anchor="middle" fill="${v % 10 ? '#262A40' : '#5B4BC4'}">${v}</text>` : ''); }
    await p.setContent(`<html><head><style>${font(400)}${font(800)}</style></head><body style="margin:0;font-family:Lexend,sans-serif">
      <div style="width:1024px;height:500px;background:linear-gradient(160deg,#FFF7E8 0%,#EEF4FF 55%,#ECE8FF 100%);position:relative;overflow:hidden">
        <div style="position:absolute;left:70px;top:70px;display:flex;align-items:center;gap:26px">
          <svg viewBox="0 0 64 64" width="120" height="120"><rect width="64" height="64" rx="16" fill="#5B4BC4"/><line x1="10" y1="40" x2="54" y2="40" stroke="#fff" stroke-width="4" stroke-linecap="round"/><g stroke="#fff" stroke-width="3" stroke-linecap="round"><line x1="12" y1="34" x2="12" y2="46"/><line x1="32" y1="35" x2="32" y2="45"/><line x1="52" y1="34" x2="52" y2="46"/></g><path d="M40 16 l6 10 h-12z" fill="#FFD27A"/></svg>
          <div><div style="font-size:72px;font-weight:800;color:#262A40;line-height:1">Matematix</div>
          <div style="font-size:32px;color:#5B4BC4;font-weight:800;margin-top:12px">${a}</div><div style="font-size:26px;color:#5C6078;margin-top:2px">${c}</div></div>
        </div>
        <svg width="1024" height="500" style="position:absolute;left:0;top:0">
          <rect x="${70 + 10 * 42 - 14}" y="370" width="28" height="70" rx="10" fill="#FFC861" opacity=".5"/>
          <line x1="50" y1="405" x2="974" y2="405" stroke="#262A40" stroke-width="5" stroke-linecap="round"/>${ticks}
          <path d="M ${70 + 6 * 42} 392 Q ${70 + 8 * 42} 330 ${70 + 10 * 42} 392" fill="none" stroke="#2E8B6F" stroke-width="5" stroke-linecap="round"/>
          <path d="M ${70 + 10 * 42} 392 Q ${70 + 11.5 * 42} 345 ${70 + 13 * 42} 392" fill="none" stroke="#2E8B6F" stroke-width="5" stroke-linecap="round"/>
          <circle cx="${70 + 13 * 42}" cy="405" r="13" fill="#5B4BC4" stroke="#fff" stroke-width="4"/>
        </svg></div></body></html>`);
    await p.waitForTimeout(800);
    await p.screenshot({ path: `store/feature-${l}.png` });
  }
  await b.close();
})();
