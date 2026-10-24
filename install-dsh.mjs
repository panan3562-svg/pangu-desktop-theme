// 盘古开屏 · DSH 安装/卸载
//   安装： node install-dsh.mjs                     # 装到所有 app 型 profile（含 dsh-web-app 的）
//   安装： node install-dsh.mjs --profile desktop   # 只装指定 profile
//   卸载： node install-dsh.mjs --uninstall [--profile X]
// 做的事（每个 profile）：
//   1) 在 node_modules 下建指向本仓库 dsh/ 的目录联接（junction）
//   2) 在 cordis.patch.yml 末尾追加一段带标记的 insert（先备份）
// 不碰 app.asar，不装依赖，不改 DSH 自身配置。
//
// 为什么默认装到「所有 app 型 profile」：桌面端到底启动哪个 profile 没有可靠的持久记录
// （%APPDATA%\DSH Desktop\profile-selection\state.json 可能是几个月前的旧文件，实测就踩了这个坑）。
// 多装一个 profile 的代价只是多一个 junction，反而能覆盖用户切换 profile 的情况。
import {
  readFileSync, writeFileSync, existsSync, mkdirSync, symlinkSync, lstatSync,
  unlinkSync, copyFileSync, readdirSync, statSync,
} from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { homedir } from 'node:os';

const root = resolve(import.meta.dirname);
const args = process.argv.slice(2);
const uninstall = args.includes('--uninstall');
const profileArg = args.includes('--profile') ? args[args.indexOf('--profile') + 1] : null;
const DSH_HOME = process.env.DSH_HOME || join(homedir(), '.dsh');
const profilesDir = join(DSH_HOME, 'profiles');

const BEGIN = '# >>> pangu-theme (managed) >>>';
const END = '# <<< pangu-theme (managed) <<<';
const BLOCK = `${BEGIN}
- insert:
    - id: pangu-theme
      name: dsh-pangu-theme
${END}
`;

const log = (...a) => console.log('[pangu]', ...a);

/** 一个 profile 是否是「应用型」：bundles 里含 @deepseek-ai/dsh-web-app。 */
function isAppProfile(name) {
  try {
    const pkg = JSON.parse(readFileSync(join(profilesDir, name, 'package.json'), 'utf8'));
    const bundles = pkg?.dsh?.profile?.bundles ?? [];
    return Array.isArray(bundles) && bundles.includes('@deepseek-ai/dsh-web-app');
  } catch {
    return false;
  }
}

function targetProfiles() {
  if (profileArg) return [profileArg];
  let names = [];
  try {
    names = readdirSync(profilesDir).filter((n) => existsSync(join(profilesDir, n, 'package.json')));
  } catch { /* 忽略 */ }
  // 排除备份目录与实验性 profile：只动真正会被应用启动的
  const apps = names.filter((n) => isAppProfile(n) && !/-backup-\d{8}$/.test(n) && !/^omd/.test(n));
  return apps.length > 0 ? apps : ['worktable'];
}

function patchProfile(profile) {
  const profileDir = join(profilesDir, profile);
  if (!existsSync(profileDir)) {
    log(`跳过 ${profile}：目录不存在`);
    return false;
  }
  const linkPath = join(profileDir, 'node_modules', 'dsh-pangu-theme');
  const patchFile = join(profileDir, 'cordis.patch.yml');

  if (uninstall) {
    try { if (existsSync(linkPath)) unlinkSync(linkPath); } catch (e) { log(`移除 junction 失败（${profile}）：`, e.message); }
  } else {
    mkdirSync(dirname(linkPath), { recursive: true });
    if (!existsSync(linkPath)) {
      try {
        symlinkSync(join(root, 'dsh'), linkPath, 'junction');
        log(`${profile}：已建立 junction`);
      } catch (e) {
        log(`${profile}：junction 失败 ——`, e.message);
        return false;
      }
    }
  }

  if (!existsSync(patchFile)) {
    if (!uninstall) { writeFileSync(patchFile, BLOCK, 'utf8'); log(`${profile}：已新建 cordis.patch.yml`); }
    return true;
  }
  const text = readFileSync(patchFile, 'utf8');
  const cleaned = text.replace(new RegExp(`\\n?${BEGIN}[\\s\\S]*?${END}\\n?`, 'g'), '\n').replace(/\n{3,}$/, '\n\n');
  if (uninstall) {
    copyFileSync(patchFile, `${patchFile}.pangu-bak`);
    writeFileSync(patchFile, cleaned, 'utf8');
    log(`${profile}：已移除挂载段（备份 .pangu-bak）`);
  } else {
    copyFileSync(patchFile, `${patchFile}.pangu-bak`);
    writeFileSync(patchFile, `${cleaned.replace(/\s*$/, '')}\n\n${BLOCK}`, 'utf8');
    log(`${profile}：已写入挂载段`);
  }
  return true;
}

const targets = targetProfiles();
log(uninstall ? `卸载：${targets.join(', ')}` : `安装：${targets.join(', ')}`);
const done = targets.filter(patchProfile);

if (!uninstall) {
  log(`完成（${done.length} 个 profile）。`);
  log('⚠ 必须「完全退出」DeepSeek Harness（托盘图标也要退）再启动，关窗口不算。');
  log('自检：node check-dsh.mjs');
}
