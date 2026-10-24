// 盘古 · Codex 启动器安装脚本
//   node install-codex.mjs            创建无窗口启动器 + 桌面/开始菜单快捷方式
//   node install-codex.mjs --uninstall 移除快捷方式
import { writeFileSync, existsSync, rmSync, mkdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { homedir } from 'node:os';
import { execFileSync } from 'node:child_process';

const root = resolve(import.meta.dirname);
const codexDir = join(root, 'codex');
const vbsPath = join(codexDir, 'pangu.vbs');
const uninstall = process.argv.includes('--uninstall');

const desktop = join(homedir(), 'Desktop');
const startMenu = join(process.env.APPDATA || join(homedir(), 'AppData', 'Roaming'), 'Microsoft', 'Windows', 'Start Menu', 'Programs');
const links = [join(desktop, '盘古 · Codex.lnk'), join(startMenu, '盘古 · Codex.lnk')];

function log(...a) { console.log('[pangu]', ...a); }

function resolveNode() {
  try {
    const out = execFileSync('where', ['node'], { encoding: 'utf8', windowsHide: true });
    const first = out.split(/\r?\n/).map((s) => s.trim()).filter(Boolean)[0];
    if (first && existsSync(first)) return first;
  } catch { /* 忽略 */ }
  return process.execPath;
}

if (uninstall) {
  for (const lnk of links) {
    if (existsSync(lnk)) { rmSync(lnk, { force: true }); log('已删除', lnk); }
  }
  if (existsSync(vbsPath)) { rmSync(vbsPath, { force: true }); log('已删除', vbsPath); }
  process.exit(0);
}

const node = resolveNode();
const vbs = `Option Explicit
' 盘古 · Codex 启动器（由 install-codex.mjs 生成）
' 作用：以隐藏窗口方式运行 launcher.mjs；launcher 会用调试端口启动 ChatGPT 并注入开屏脚本。
Dim fso, sh, dir, code
Set fso = CreateObject("Scripting.FileSystemObject")
Set sh = CreateObject("WScript.Shell")
dir = fso.GetParentFolderName(WScript.ScriptFullName)
sh.CurrentDirectory = dir
code = sh.Run("""" & "${node}" & """ """ & dir & "\\launcher.mjs""", 0, True)
If code = 2 Then
  MsgBox "ChatGPT 已经在运行。" & vbCrLf & vbCrLf & "请先完全退出它（包括托盘图标），再用「盘古 · Codex」打开。", 48, "盘古 · 开屏"
ElseIf code = 3 Then
  MsgBox "没找到 ChatGPT 桌面版（OpenAI.Codex 商店包）。", 48, "盘古 · 开屏"
ElseIf code = 4 Then
  MsgBox "ChatGPT 启动后没能连上调试端口，开屏未加载。" & vbCrLf & vbCrLf & "日志：%LOCALAPPDATA%\\pangu-theme\\codex-launcher.log", 48, "盘古 · 开屏"
End If
`;
// WSH 按 ANSI 读取 .vbs：UTF-8 无 BOM 会让中文注释吃掉换行/引号（实测踩过）。
// 写成 UTF-16LE + BOM 才能安全包含中文。
writeFileSync(vbsPath, `\uFEFF${vbs}`, 'utf16le');
log('已写入', vbsPath);

/** 用 PowerShell 建 .lnk；路径全部走环境变量，避免中文在命令行里被 GBK 弄坏。 */
function makeShortcut(lnkPath, iconPath) {
  const ps = `
$sh = New-Object -ComObject WScript.Shell
$lnk = $sh.CreateShortcut($env:PANGU_LNK)
$lnk.TargetPath = $env:PANGU_TARGET
$lnk.Arguments = $env:PANGU_ARGS
$lnk.WorkingDirectory = $env:PANGU_WORKDIR
$lnk.Description = 'Pangu intro for Codex'
if ($env:PANGU_ICON -and (Test-Path $env:PANGU_ICON)) { $lnk.IconLocation = $env:PANGU_ICON + ',0' }
$lnk.Save()
`;
  execFileSync('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', ps], {
    windowsHide: true,
    env: {
      ...process.env,
      PANGU_LNK: lnkPath,
      PANGU_TARGET: join(process.env.SystemRoot || 'C:\\Windows', 'System32', 'wscript.exe'),
      PANGU_ARGS: `"${vbsPath}"`,
      PANGU_WORKDIR: codexDir,
      PANGU_ICON: iconPath,
    },
  });
}

// 图标借用 ChatGPT 自己的 exe（从注册表找包根目录）
let icon = '';
try {
  const { findCodexExe } = await import('./codex/find-app.mjs');
  icon = findCodexExe() || '';
} catch { /* 忽略 */ }

for (const lnk of links) {
  mkdirSync(dirname(lnk), { recursive: true });
  try {
    makeShortcut(lnk, icon);
    log('已创建快捷方式', lnk);
  } catch (error) {
    log('创建失败：', lnk, error.message);
  }
}

log('完成。双击「盘古 · Codex」即可带开屏启动；应用内左下角小花是开关。');
