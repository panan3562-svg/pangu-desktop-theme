// 盘古开屏 · DSH 插件（Node 端）
// 只做一件事：把开关配置持久化到 <DSH_HOME>/data/pangu-theme/config.json，
// 并给浏览器端一个读写路由。动画本身完全在客户端跑（lib/client.js）。
import { readFileSync, writeFileSync, mkdirSync, renameSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';

export const name = 'dsh-pangu-theme';

// 必须声明依赖：否则插件会在 webServer 注册之前加载，ctx.get('webServer') 拿到
// undefined，路由就永远注册不上（实测就是这样静默失败的）。
export const inject = ['webServer'];

/** 路由单一来源：客户端 bundle 里引用同一组路径。 */
export const CONFIG_PATH = '/pangu-theme/config';

const DSH_HOME = process.env.DSH_HOME ?? resolve(import.meta.dirname, '../../..');
const CONFIG_FILE = join(DSH_HOME, 'data', 'pangu-theme', 'config.json');

/** 加载探针：排查「插件到底有没有被加载」时看这个文件。 */
function probe(entry) {
  try {
    const dir = join(DSH_HOME, 'data', 'pangu-theme');
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'load.log'), `${new Date().toISOString()} ${JSON.stringify(entry)}\n`, { flag: 'a' });
  } catch { /* 探针失败不影响插件 */ }
}

probe({ event: 'module-imported', pid: process.pid, argv: process.argv.slice(0, 2) });

const DEFAULTS = {
  /** 开屏动画总开关 */
  enabled: true,
  /** 是否每次启动都播放（false = 只在这一版里第一次启动时播放） */
  everyLaunch: true,
  /** 动画速度倍率：1 = 原速（约 3.2 秒） */
  speed: 1,
};

function loadConfig() {
  try {
    const raw = JSON.parse(readFileSync(CONFIG_FILE, 'utf8'));
    const out = { ...DEFAULTS };
    if (typeof raw?.enabled === 'boolean') out.enabled = raw.enabled;
    if (typeof raw?.everyLaunch === 'boolean') out.everyLaunch = raw.everyLaunch;
    if (typeof raw?.speed === 'number' && raw.speed >= 0.5 && raw.speed <= 3) out.speed = raw.speed;
    return out;
  } catch {
    return { ...DEFAULTS };
  }
}

function saveConfig(next) {
  const out = { ...DEFAULTS, ...next };
  mkdirSync(dirname(CONFIG_FILE), { recursive: true });
  const tmp = `${CONFIG_FILE}.tmp`;
  writeFileSync(tmp, `${JSON.stringify(out, null, 2)}\n`, 'utf8');
  renameSync(tmp, CONFIG_FILE);
  return out;
}

function json(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
  res.end(JSON.stringify(body));
}

function sameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true;
  try {
    return new URL(origin).host === req.headers.host;
  } catch {
    return false;
  }
}

async function readBody(req, limit = 2048) {
  let data = '';
  for await (const chunk of req) {
    data += chunk;
    if (data.length > limit) return null;
  }
  return data;
}

export function apply(ctx) {
  const webServer = ctx.webServer ?? (typeof ctx.get === 'function' ? ctx.get('webServer') : undefined);
  probe({ event: 'apply', hasWebServer: webServer !== undefined, keys: Object.keys(ctx).slice(0, 40) });
  if (webServer === undefined) return;

  const disposers = [
    webServer.register({
      kind: 'exact',
      path: CONFIG_PATH,
      handler: async (req, res) => {
        try {
          if (req.method === 'GET' || req.method === 'HEAD') {
            json(res, 200, loadConfig());
            return;
          }
          if (req.method !== 'POST') {
            json(res, 405, { error: 'method not allowed' });
            return;
          }
          if (!sameOrigin(req)) {
            json(res, 403, { error: 'cross-origin request rejected' });
            return;
          }
          const raw = await readBody(req);
          if (raw === null) {
            json(res, 413, { error: 'body too large' });
            return;
          }
          let patch;
          try {
            patch = JSON.parse(raw || '{}');
          } catch {
            json(res, 400, { error: 'invalid JSON' });
            return;
          }
          if (patch === null || typeof patch !== 'object' || Array.isArray(patch)) {
            json(res, 400, { error: 'body must be an object' });
            return;
          }
          json(res, 200, saveConfig({ ...loadConfig(), ...patch }));
        } catch (error) {
          json(res, 500, { error: error instanceof Error ? error.message : String(error) });
        }
      },
    }),
  ];

  ctx.effect(() => () => {
    for (const dispose of disposers) dispose();
  }, 'pangu-theme: config route');
}
