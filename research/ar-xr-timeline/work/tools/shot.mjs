import { chromium } from 'playwright';
import fs from 'node:fs';
const src = process.argv[2], outPrefix = process.argv[3];
const body = fs.readFileSync(src, 'utf8');
const wrap = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui;background:#f8f8f6}img{max-width:100%}[hidden]{display:none!important}</style></head><body>${body}</body></html>`;
const tmp = src.replace(/\.html$/, '.wrapped.html'); fs.writeFileSync(tmp, wrap);
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', headless: true, args: ['--no-sandbox'] });
const errs = [];
for (const [name, vp, scheme] of [['desktop-light', { width: 1400, height: 1000 }, 'light'], ['desktop-dark', { width: 1400, height: 1000 }, 'dark'], ['phone-light', { width: 400, height: 900 }, 'light']]) {
  const ctx = await browser.newContext({ viewport: vp, colorScheme: scheme });
  const page = await ctx.newPage();
  page.on('console', m => { if (m.type() === 'error') errs.push(name + ': ' + m.text()); });
  page.on('pageerror', e => errs.push(name + ': PAGEERROR ' + e.message));
  await page.goto('file://' + tmp, { waitUntil: 'load' });
  await page.waitForTimeout(800);
  const sw = await page.evaluate(() => ({ docW: document.documentElement.scrollWidth, winW: window.innerWidth, bodyScrollW: document.body.scrollWidth }));
  console.log(name, JSON.stringify(sw), sw.docW > sw.winW ? 'HORIZONTAL OVERFLOW!' : 'ok');
  await page.screenshot({ path: `${outPrefix}-${name}.png`, fullPage: true });
  await ctx.close();
}
await browser.close();
console.log('errors:', errs.length ? errs.join('\n') : 'none');
