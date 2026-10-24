// 把 art.data.js + engine.js + ui.js + 各入口拼成两份可直接加载的脚本：
//   dsh/lib/client.js   → DSH 的 __ModuleLoader__ 客户端模块
//   codex/dist/inject.js → Codex/ChatGPT 桌面版 CDP 注入用的自执行脚本
// 运行： node build/build.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const read = (p) => readFileSync(join(root, p), 'utf8');

const art = read('shared/art.data.js');
const engine = read('shared/engine.js');
const ui = read('shared/ui.js');
const entryDsh = read('shared/entry-dsh.js');
const entryCodex = read('shared/entry-codex.js');

const banner = (what) => `/*! 盘古开屏 · ${what} | 由 build/build.mjs 生成，请改 shared/ 下的源码 */\n`;

const dsh = `${banner('DSH 客户端')}window.__ModuleLoader__.load({
  id: "dsh-pangu-theme",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
${art}
${engine}
${ui}
${entryDsh}
    exports.apply = apply;
    exports.inject = [];
    exports.name = "dsh-pangu-theme";
    return module.exports;
  }
});
`;

const codex = `${banner('Codex / ChatGPT CDP 注入')}(() => {
  if (window.top !== window) return;              // 只注入顶层页面
  if (window.__PANGU_INSTALLED__) return;         // 防重复注入
  const host = location.hostname;
  // 桌面版界面跑在本地 app:// 壳里；保留对 chatgpt.com / openai.com 的兼容。
  const allowed = location.protocol === 'app:'
    || host === 'chatgpt.com' || host === 'chat.openai.com' || host === 'openai.com' || host.endsWith('.chatgpt.com');
  if (!allowed) return;
  window.__PANGU_INSTALLED__ = true;
${art}
${engine}
${ui}
${entryCodex}
})();
`;

mkdirSync(join(root, 'dsh', 'lib'), { recursive: true });
mkdirSync(join(root, 'codex', 'dist'), { recursive: true });
writeFileSync(join(root, 'dsh', 'lib', 'client.js'), dsh, 'utf8');
writeFileSync(join(root, 'codex', 'dist', 'inject.js'), codex, 'utf8');

console.log('dsh/lib/client.js   ', dsh.length, 'bytes');
console.log('codex/dist/inject.js', codex.length, 'bytes');
