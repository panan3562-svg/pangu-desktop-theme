// 盘古开屏 · DSH 自检
// 用法： node check-dsh.mjs
// 检查每个 app 型 profile：挂载点、补丁段、插件是否被真正 import、配置是否就绪。
// 注意：desktop profile 由 Electron 应用独占，CLI 无法 --dump-config 校验，只看加载探针。
import { existsSync, readFileSync, lstatSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { homedir } from 'node:os';
import { execFileSync } from 'node:child_process';

const DSH_HOME = process.env.DSH_HOME || join(homedir(), '.dsh');
const profilesDir = join(DSH_HOME, 'profiles');
const loadLog = join(DSH_HOME, 'data', 'pangu-theme', 'load.log');
const cfgFile = join(DSH_HOME, 'data', 'pangu-theme', 'config.json');
const ok = (b) => (b ? '✓' : '✗');

function appProfiles() {
  return readdirSync(profilesDir).filter((n) => {
    if (/-backup-\d{8}$/.test(n) || /^omd/.test(n)) return false;
    try {
      const pkg = JSON.parse(readFileSync(join(profilesDir, n, 'package.json'), 'utf8'));
      return (pkg?.dsh?.profile?.bundles ?? []).includes('@deepseek-ai/dsh-web-app');
    } catch { return false; }
  });
}

function dshBin() {
  const p = process.env.APPDATA ? join(process.env.APPDATA, 'npm', 'dsh.cmd') : '';
  return p && existsSync(p) ? p : 'dsh';
}

function dumpConfig(profile) {
  try {
    return { text: execFileSync(process.env.ComSpec || 'cmd.exe', ['/d', '/c', `${dshBin()} --profile ${profile} --dump-config`], { encoding: 'utf8', windowsHide: true, timeout: 90000 }) };
  } catch (error) {
    const text = String(error.stdout || '');
    const stderr = String(error.stderr || '');
    return { text, stderr, error: error.message };
  }
}

const profiles = appProfiles();
console.log(`app 型 profile：${profiles.join(', ') || '（无）'}\n`);

const summary = [];
for (const profile of profiles) {
  const dir = join(profilesDir, profile);
  const pkgDir = join(dir, 'node_modules', 'dsh-pangu-theme');
  const patchFile = join(dir, 'cordis.patch.yml');
  const patchText = existsSync(patchFile) ? readFileSync(patchFile, 'utf8') : '';
  const mounted = existsSync(join(pkgDir, 'package.json')) && patchText.includes('pangu-theme');

  let link = '无';
  try { link = lstatSync(pkgDir).isSymbolicLink() ? '目录联接' : '普通目录'; } catch { /* 忽略 */ }

  console.log(`── ${profile}`);
  console.log(`  ${ok(patchText.includes('pangu-theme'))} 补丁段 / ${ok(existsSync(join(pkgDir, 'package.json')))} 挂载（${link}）`);

  let inTree = null;
  const dump = dumpConfig(profile);
  if (/managed exclusively by the Electron application/.test(dump.stderr || '')) {
    console.log('  – 该 profile 由 Electron 独占，CLI 不能校验组合树（正常）');
  } else {
    inTree = dump.text.includes('name: dsh-pangu-theme');
    console.log(`  ${ok(inTree)} 进入组合树`);
  }
  summary.push({ profile, mounted, inTree });
}

// 加载探针
console.log('\n── 加载记录');
if (existsSync(loadLog)) {
  const lines = readFileSync(loadLog, 'utf8').trim().split(/\r?\n/).filter(Boolean).slice(-10);
  for (const l of lines) console.log('  ', l);
  const applied = lines.some((l) => l.includes('"apply"') && l.includes('"hasWebServer":true'));
  console.log(`  ${ok(applied)} 至少一次 apply 成功（webServer 可用）`);
  console.log('  提示：桌面端进程的 argv[0] 是 "DeepSeek Harness.exe"，CLI 的是 node/bin.js —— 用它区分。');
} else {
  console.log('  ✗ 没有 load.log —— 插件模块从未被 import 过');
}

console.log(`\n${ok(existsSync(cfgFile))} 配置文件：${cfgFile}（首次在面板里改开关后生成）`);

console.log('\n结论：');
const unmounted = summary.filter((s) => !s.mounted);
if (unmounted.length === summary.length) {
  console.log('所有 profile 都没挂载 —— 跑 node install-dsh.mjs，然后完全退出 DSH 再启动。');
} else if (!existsSync(loadLog)) {
  console.log('已挂载，但插件从未被 import —— 需要「完全退出」DSH（托盘也退）再启动。');
} else {
  console.log('已挂载且被加载过。仍看不到动画时：点左下角小花 →「立即播放一次」；');
  console.log('若小花也没有，说明客户端 bundle 没下发，把本文件输出发给维护者。');
}
