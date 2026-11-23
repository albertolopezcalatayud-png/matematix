// Draws the launcher icons, splash screens and the Play Store icon from the app's own artwork (public/favicon.svg).
const { chromium } = require('playwright');
const fs = require('fs');
const RES = 'android/app/src/main/res';
const ART = (s) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${s}" height="${s}"><line x1="10" y1="40" x2="54" y2="40" stroke="#fff" stroke-width="4" stroke-linecap="round"/><g stroke="#fff" stroke-width="3" stroke-linecap="round"><line x1="12" y1="34" x2="12" y2="46"/><line x1="32" y1="35" x2="32" y2="45"/><line x1="52" y1="34" x2="52" y2="46"/></g><path d="M40 16 l6 10 h-12z" fill="#FFD27A"/></svg>`;
const FULL = (s, round) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${s}" height="${s}">${round ? '<circle cx="32" cy="32" r="32" fill="#5B4BC4"/>' : '<rect width="64" height="64" rx="14" fill="#5B4BC4"/>'}<g transform="translate(0,-3)">${ART(64).replace(/^<svg[^>]*>|<\/svg>$/g, '')}</g></svg>`;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  const shot = async (html, w, h, out, transparent = false) => {
    await p.setViewportSize({ width: w, height: h });
    await p.setContent(`<html><body style="margin:0;background:${transparent ? 'transparent' : '#FBF8FF'}">${html}</body></html>`);
    await p.screenshot({ path: out, omitBackground: transparent });
  };
  const dens = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };
  for (const [d, k] of Object.entries(dens)) {
    const s = 48 * k, f = 108 * k;
    await shot(FULL(s, false), s, s, `${RES}/mipmap-${d}/ic_launcher.png`, true);
    await shot(FULL(s, true), s, s, `${RES}/mipmap-${d}/ic_launcher_round.png`, true);
    // adaptive foreground: artwork inside the central safe zone (66 of 108 dp)
    await shot(`<div style="width:${f}px;height:${f}px;display:grid;place-items:center">${ART(Math.round(f * 0.62))}</div>`, f, f, `${RES}/mipmap-${d}/ic_launcher_foreground.png`, true);
  }
  // splash screens: the icon in the middle of the app's background colour
  for (const dir of fs.readdirSync(RES).filter((x) => x.startsWith('drawable'))) {
    const file = `${RES}/${dir}/splash.png`; if (!fs.existsSync(file)) continue;
    const { execSync } = require('child_process');
    const [w, h] = execSync(`python3 -c "from PIL import Image;print(*Image.open('${file}').size)"`).toString().trim().split(' ').map(Number);
    const s = Math.round(Math.min(w, h) * 0.28);
    await shot(`<div style="width:${w}px;height:${h}px;display:grid;place-items:center">${FULL(s, false)}</div>`, w, h, file);
  }
  await shot(FULL(512, false).replace('rx="14"', 'rx="0"'), 512, 512, 'store/icon-512.png');
  await b.close(); console.log('done');
})();
