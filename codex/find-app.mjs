// 定位 ChatGPT/Codex 桌面版的可执行文件。
// WindowsApps 目录本身不可列（KnownFolder 权限），但注册表里有 PackageRootFolder，
// 已知路径下的文件是可读/可执行的。
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const REG_KEY = 'HKCU\\Software\\Classes\\Local Settings\\Software\\Microsoft\\Windows\\CurrentVersion\\AppModel\\Repository\\Packages';

function regLines(args) {
  try {
    return execFileSync('reg', args, { encoding: 'utf8', windowsHide: true }).split(/\r?\n/);
  } catch {
    return [];
  }
}

/** 返回所有已安装版本的包根目录（按版本号从新到旧）。 */
export function codexPackageRoots() {
  const roots = [];
  for (const line of regLines(['query', REG_KEY, '/f', 'OpenAI.Codex', '/k'])) {
    const m = line.match(/^(HKEY_[^\r\n]+OpenAI\.Codex_[^\r\n]+)$/);
    if (!m) continue;
    const key = m[1];
    for (const vline of regLines(['query', key, '/v', 'PackageRootFolder'])) {
      const vm = vline.match(/PackageRootFolder\s+REG_\w+\s+(.+?)\s*$/);
      if (vm) roots.push(vm[1].trim());
    }
  }
  const versionOf = (p) => (p.match(/OpenAI\.Codex_([\d.]+)_/) || [, '0'])[1];
  return [...new Set(roots)].sort((a, b) => versionOf(b).localeCompare(versionOf(a), undefined, { numeric: true }));
}

/** 找到 ChatGPT.exe 的完整路径；找不到返回 null。 */
export function findCodexExe() {
  if (process.env.PANGU_CODEX_EXE && existsSync(process.env.PANGU_CODEX_EXE)) return process.env.PANGU_CODEX_EXE;
  for (const root of codexPackageRoots()) {
    for (const exe of ['ChatGPT.exe', 'Codex.exe']) {
      const p = join(root, 'app', exe);
      if (existsSync(p)) return p;
    }
  }
  return null;
}
