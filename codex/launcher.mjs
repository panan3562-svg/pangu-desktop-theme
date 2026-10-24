// 盘古 · Codex / ChatGPT 桌面版启动器
// ---------------------------------------------------------------
// 商店版 ChatGPT 装在 C:\Program Files\WindowsApps（只读、有签名），不能改文件。
// 这里改用 Chromium 自带的调试端口：以 --remote-debugging-port 启动应用，
// 连上 CDP 后把开屏脚本注入页面。安装目录一个字节都不动。
//
// 用法： node codex/launcher.mjs [--off] [--port 9223]
//   --off        这一次不打开动画（设置仍保留）
// 说明：必须从这个启动器打开应用才生效；从开始菜单直接打开不会有动画。
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { homedir } from 'node:os';
import { findCodexExe } from './find-app.mjs';

const here = import.meta.dirname;
const INJECT = join(here, 'dist', 'inject.js');
const LOG_DIR = join(process.env.LOCALAPPDATA || homedir(), 'pangu-theme');
const LOG_FILE = join(LOG_DIR, 'codex-launcher.log');

const argv = process.argv.slice(2);
const FORCE_OFF = argv.includes('--off');
const PORT = Number(argv.includes('--port') ? argv[argv.indexOf('--port') + 1] : 9223);

mkdirSync(LOG_DIR, { recursive: true });
function log(...args) {
  const line = `${new Date().toISOString()} ${args.join(' ')}`;
  try { writeFileSync(LOG_FILE, `${line}\n`, { flag: 'a' }); } catch { /* 忽略 */ }
}

/** 在 WindowsApps 里找最新版本的 ChatGPT.exe（也认 Codex.exe）。 */
function findChatGptExe() {
  const exe = findCodexExe();
  if (!exe) log('注册表里没找到 OpenAI.Codex 包');
  return exe;
}

/** 应用是否已经在跑（此时新进程会把参数转给旧进程，注入不了）。 */
function runningAppProcesses() {
  // 不用 WMI（沙箱下可能不可用），用 tasklist 的稳定输出。
  return new Promise((resolveP) => {
    const child = spawn('tasklist', ['/FI', 'IMAGENAME eq ChatGPT.exe', '/FO', 'CSV', '/NH'], { windowsHide: true });
    let out = '';
    child.stdout.on('data', (d) => { out += d; });
    child.on('close', () => {
      const count = (out.match(/ChatGPT\.exe/gi) || []).length;
      resolveP(count);
    });
    child.on('error', () => resolveP(0));
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchJson(url, timeoutMs = 1200) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** 极简 CDP 客户端：只需要 send() 和事件回调。 */
class Cdp {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    this.handlers = new Map();
    ws.addEventListener('message', (ev) => {
      let msg;
      try { msg = JSON.parse(ev.data); } catch { return; }
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve: res, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message || JSON.stringify(msg.error)));
        else res(msg.result);
        return;
      }
      if (msg.method) {
        const h = this.handlers.get(msg.method);
        if (h) h(msg.params);
      }
    });
  }

  static connect(url) {
    return new Promise((res, rej) => {
      const ws = new WebSocket(url);
      ws.addEventListener('open', () => res(new Cdp(ws)));
      ws.addEventListener('error', (e) => rej(new Error(`WebSocket 连接失败：${e?.message || 'error'}`)));
    });
  }

  on(method, fn) { this.handlers.set(method, fn); }

  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((res, rej) => {
      this.pending.set(id, { resolve: res, reject: rej });
      this.ws.send(JSON.stringify({ id, method, params }));
      setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id);
          rej(new Error(`CDP 超时：${method}`));
        }
      }, 5000);
    });
  }

  close() { try { this.ws.close(); } catch { /* 忽略 */ } }
}

/** 目标打分：主窗口是 app://-/index.html（浮层能盖住内嵌 webview）；
 *  detached-window / 沙箱 webview 都不能要，避免把动画打到看不见的窗口里。 */
function scoreTarget(t) {
  const u = t.url || '';
  if (!t.webSocketDebuggerUrl) return -100;
  if (u.includes('detached-window')) return -90;
  if (u.includes('web-sandbox')) return -90;
  let s = 0;
  if (t.type === 'page' && u.includes('index.html')) s += 40;
  else if (t.type === 'page' && u.startsWith('app://')) s += 10;
  if (u.includes('chatgpt.com')) s += 6;
  if (t.type === 'webview') s += 2;
  return s;
}

function pickTarget(list) {
  const ranked = (list || [])
    .map((t) => ({ t, s: scoreTarget(t) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s);
  return ranked.length ? ranked[0].t : null;
}

async function main() {
  if (!existsSync(INJECT)) {
    console.error('找不到注入脚本 codex/dist/inject.js，请先运行 node build/build.mjs');
    process.exit(1);
  }
  const source = readFileSync(INJECT, 'utf8');

  const running = await runningAppProcesses();
  if (running > 0) {
    // 可能上一次是盘古启动的、调试端口还开着：先试着复用
    const existing = await fetchJson(`http://127.0.0.1:${PORT}/json/list`);
    const target = pickTarget(existing);
    if (target) {
      log('应用已在运行且调试端口可用，直接复用');
      await attach(target.webSocketDebuggerUrl, source, () => {});
      return;
    }
    console.error('ChatGPT 已经在运行。请先完全退出它，再用盘古启动器打开。');
    log('已在运行，退出，进程数 =', running);
    process.exit(2);
  }

  const exe = findChatGptExe();
  if (!exe) {
    console.error('没找到 ChatGPT.exe（OpenAI.Codex 商店包）。可用 PANGU_CODEX_EXE 指定路径。');
    process.exit(3);
  }
  log('启动', exe, 'port', PORT, 'off', FORCE_OFF);

  const args = [
    `--remote-debugging-port=${PORT}`,
    // 允许 CDP 的 WebSocket 握手（Chromium 对 Origin 校验较严）
    '--remote-allow-origins=*',
  ];
  if (FORCE_OFF) args.push('--pangu-off');

  const child = spawn(exe, args, {
    cwd: join(exe, '..'),
    detached: false,
    stdio: 'ignore',
    windowsHide: false,
  });
  child.on('exit', (code) => {
    log('应用进程退出，code =', code);
    process.exit(0); // 应用关掉就收工，别留孤儿进程
  });

  // 等调试端点起来
  let list = null;
  for (let i = 0; i < 120; i++) {
    list = await fetchJson(`http://127.0.0.1:${PORT}/json/list`);
    if (pickTarget(list)) break;
    await sleep(250);
  }
  const target = pickTarget(list);
  if (!target) {
    console.error('等不到调试端口（可能应用没接受启动参数）。详见日志：' + LOG_FILE);
    log('等不到目标页面', JSON.stringify(list || null));
    process.exit(4);
  }
  log('目标页面', target.url);

  await attach(target.webSocketDebuggerUrl, source, () => {
    if (!child.killed) child.kill();
  });
}

async function attach(wsUrl, source, onClose) {
  let cdp;
  try {
    cdp = await Cdp.connect(wsUrl);
  } catch (error) {
    console.error('连不上调试端口：' + error.message);
    log('连接失败', error.message);
    process.exit(5);
  }
  cdp.on('Inspector.detached', () => log('调试会话断开'));
  cdp.ws.addEventListener('close', () => {
    log('调试连接关闭，启动器退出');
    setTimeout(() => process.exit(0), 1000);
  });
  try {
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    // 后续导航（含刷新）都在文档开始前注入
    await cdp.send('Page.addScriptToEvaluateOnNewDocument', { source });
    // 当前文档也立刻注入一次
    await cdp.send('Runtime.evaluate', { expression: source, awaitPromise: false });
    log('注入完成');
  } catch (error) {
    log('注入失败', error.message);
    console.error('注入失败：' + error.message);
  }
  // 常驻：跟随应用生命周期，保持导航注入有效
  const keepAlive = setInterval(async () => {
    try {
      await cdp.send('Runtime.evaluate', { expression: '1', returnByValue: true });
    } catch {
      /* 页面关闭/切换时会失败，忽略 */
    }
  }, 20000);
  process.on('SIGINT', () => { clearInterval(keepAlive); cdp.close(); onClose(); process.exit(0); });
}

main().catch((error) => {
  console.error(error);
  log('未捕获异常', error?.stack || String(error));
  process.exit(1);
});
