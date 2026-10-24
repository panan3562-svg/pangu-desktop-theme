// 用临时 DSH_HOME 测 DSH 分发包里的 install.ps1（安装 / 卸载 / 幂等）
import { mkdirSync, writeFileSync, readFileSync, existsSync, lstatSync, rmSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

// 测试对象是 build/make-packages.mjs 生成的 dist/pangu-dsh
const PKG = join(resolve(import.meta.dirname, '..'), 'dist', 'pangu-dsh');
const HOME = join(process.env.TEMP, 'pangu-install-test');
rmSync(HOME, { recursive: true, force: true });

const prof = join(HOME, 'profiles', 'testapp');
mkdirSync(join(prof, 'node_modules'), { recursive: true });
writeFileSync(join(prof, 'package.json'), JSON.stringify({
  name: 'dsh-profile-testapp',
  private: true,
  dsh: { profile: { bundles: ['@deepseek-ai/dsh-base', '@deepseek-ai/dsh-web-app'] } },
}, null, 2));

// 模拟用户已有的补丁（含中文注释，验证编码不被破坏）
writeFileSync(join(prof, 'cordis.patch.yml'), '# 用户自己的补丁\n- id: some-plugin\n  config:\n    foo: bar\n', 'utf8');

// 备份 profile 不该被处理
const backup = join(HOME, 'profiles', 'desktop-0.1.1-backup-20261018');
mkdirSync(backup, { recursive: true });
writeFileSync(join(backup, 'package.json'), JSON.stringify({ dsh: { profile: { bundles: ['@deepseek-ai/dsh-web-app'] } } }));

function run(...extra) {
  return execFileSync('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', join(PKG, 'install.ps1'), '-DshHome', HOME, ...extra], {
    encoding: 'utf8', windowsHide: true,
  });
}

console.log('--- install ---');
console.log(run().trim().slice(0, 400));

const link = join(prof, 'node_modules', 'dsh-pangu-theme');
const st = lstatSync(link);
console.log('junction?', st.isSymbolicLink());
const patch = readFileSync(join(prof, 'cordis.patch.yml'), 'utf8');
console.log('has block:', patch.includes('pangu-theme'));
console.log('kept user content:', patch.includes('用户自己的补丁') && patch.includes('some-plugin'));
console.log('backup exists:', existsSync(join(prof, 'cordis.patch.yml.pangu-bak')));
console.log('backup profile untouched:', existsSync(join(backup, 'cordis.patch.yml')) === false);

console.log('--- install again (idempotent) ---');
console.log(run().trim().slice(0, 200));
const patch2 = readFileSync(join(prof, 'cordis.patch.yml'), 'utf8');
console.log('block count:', (patch2.match(/pangu-theme \(managed\) >>>/g) || []).length);

console.log('--- uninstall ---');
console.log(run('-Uninstall').trim().slice(0, 300));
// 用目录列举判断更可靠：Node 的 existsSync 对悬空目录联接可能给出过期结果
const entries = readdirSync(join(prof, 'node_modules'));
console.log('link gone:', !entries.includes('dsh-pangu-theme'));
const patch3 = readFileSync(join(prof, 'cordis.patch.yml'), 'utf8');
console.log('block gone:', !patch3.includes('pangu-theme (managed)'));
console.log('user content kept:', patch3.includes('some-plugin'));

// 插件源目录必须完好（卸载绝不能删到目标内容）
console.log('plugin source intact:', existsSync(join(PKG, 'dsh', 'lib', 'client.js')));
