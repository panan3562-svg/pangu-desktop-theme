// 用无头 Chrome + CDP 验证某个页面里的盘古开屏（默认针对 CLI 起的 web 实例）。
// 用法： node build/verify-web.mjs "http://127.0.0.1:3080/?token=..."
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { spawn } from 'node:child_process';

const URL_ = process.argv[2];
if (!URL_) { console.error('usage: node build/verify-web.mjs <url>'); process.exit(1); }
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9555;
const OUT = join(import.meta.dirname, 'shots');
mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const chrome = spawn(CHROME, [
  '--headless=new', '--no-sandbox', '--disable-gpu', '--no-first-run',
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${join(process.env.TEMP, 'pangu-web-verify')}`,
  '--window-size=1440,900', URL_,
], { stdio: 'ignore' });

async function list() {
  try {
    const r = await fetch(`http://127.0.0.1:${PORT}/json/list`, { signal: AbortSignal.timeout(1000) });
    return r.ok ? r.json() : null;
  } catch { return null; }
}
let targets = null;
for (let i = 0; i < 60; i++) { targets = await list(); if ((targets || []).some((t) => t.type === 'page')) break; await sleep(300); }
const page = (targets || []).find((t) => t.type === 'page');
if (!page) { console.error('no page'); chrome.kill(); process.exit(1); }

const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((res, rej) => { ws.addEventListener('open', res); ws.addEventListener('error', rej); });
let id = 0; const pending = new Map();
ws.addEventListener('message', (ev) => {
  const m = JSON.parse(ev.data);
  if (m.id && pending.has(m.id)) { const { r, j } = pending.get(m.id); pending.delete(m.id); m.error ? j(new Error(m.error.message)) : r(m.result); }
});
const send = (method, params = {}) => new Promise((r, j) => {
  const n = ++id; pending.set(n, { r, j });
  ws.send(JSON.stringify({ id: n, method, params }));
  setTimeout(() => { if (pending.delete(n)) j(new Error('timeout ' + method)); }, 8000);
});
const ev = async (expression) => {
  const res = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (res.exceptionDetails) return { error: res.exceptionDetails.exception?.description || 'eval error' };
  return res.result?.value;
};
const shot = async (name) => {
  const res = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync(join(OUT, name), Buffer.from(res.data, 'base64'));
  console.log('shot ->', name);
};

await send('Page.enable'); await send('Runtime.enable');
await sleep(1200);
console.log('state =', await ev(`JSON.stringify({
  active: !!window.__PANGU_THEME_ACTIVE__,
  overlay: !!document.querySelector('[data-pangu-intro]'),
  chip: !!document.querySelector('[data-pangu-chip]'),
  chipPos: (() => { const c = document.querySelector('[data-pangu-chip]'); return c ? [c.style.left, c.style.top] : null; })(),
  cfg: localStorage.getItem('pangu-theme.config')
})`));
await shot('web-1-intro.png');
await sleep(2600);
console.log('after =', await ev(`JSON.stringify({ overlay: !!document.querySelector('[data-pangu-intro]'), chip: !!document.querySelector('[data-pangu-chip]') })`));
await shot('web-2-idle.png');
await ev(`document.querySelector('[data-pangu-chip]')?.click(); 'clicked'`);
await sleep(500);
await shot('web-3-panel.png');
console.log('panel =', await ev(`!!document.querySelector('[data-pangu-panel]')`));
ws.close();
chrome.kill();
