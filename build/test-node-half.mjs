// 用假宿主测 DSH Node 端：路由注册、GET 默认值、POST 落盘。
// 运行： node build/test-node-half.mjs
import { mkdtempSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const home = mkdtempSync(join(tmpdir(), 'pangu-dsh-home-'));
process.env.DSH_HOME = home;

const mod = await import('../dsh/lib/index.mjs');
console.log('exports =', Object.keys(mod));

const routes = new Map();
const fakeWebServer = {
  register(entry) {
    routes.set(`${entry.kind}:${entry.path}`, entry.handler);
    return () => routes.delete(`${entry.kind}:${entry.path}`);
  },
};
const ctx = {
  get: (name) => (name === 'webServer' ? fakeWebServer : undefined),
  effect: (fn) => { fn(); },
};

mod.apply(ctx);
console.log('routes =', [...routes.keys()]);

function mockRes() {
  return {
    status: 0, headers: null, body: '',
    writeHead(status, headers) { this.status = status; this.headers = headers; },
    end(data) { this.body += data || ''; },
  };
}

async function call(method, body) {
  const handler = routes.get('exact:/pangu-theme/config');
  const req = { method, headers: { host: '127.0.0.1:1234' }, [Symbol.asyncIterator]: async function* () { if (body) yield body; } };
  const res = mockRes();
  await handler(req, res);
  return { status: res.status, json: res.body ? JSON.parse(res.body) : null };
}

console.log('GET  =', await call('GET'));
console.log('POST =', await call('POST', JSON.stringify({ enabled: false })));

const file = join(home, 'data', 'pangu-theme', 'config.json');
console.log('file exists =', existsSync(file));
if (existsSync(file)) console.log('file =', readFileSync(file, 'utf8').trim());

console.log('GET after POST =', await call('GET'));
console.log('bad method =', (await call('DELETE')).status);
