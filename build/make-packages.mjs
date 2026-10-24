// 组装两个可以直接发给朋友的压缩包：
//   dist/pangu-dsh/    → DSH 插件 + PowerShell 安装器（不需要 Node）
//   dist/pangu-codex/  → Codex 启动器 + 注入脚本 + 便携 node.exe
// 运行： node build/make-packages.mjs
import { mkdirSync, copyFileSync, writeFileSync, rmSync, existsSync, cpSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const stage = join(root, 'dist');
const SRC_DSH = join(stage, 'pangu-dsh');
const SRC_CODEX = join(stage, 'pangu-codex');
const NODE_EXE = process.env.PANGU_NODE || 'C:\\Program Files\\nodejs\\node.exe';

rmSync(stage, { recursive: true, force: true });
mkdirSync(SRC_DSH, { recursive: true });
mkdirSync(SRC_CODEX, { recursive: true });

const writeUtf8Bom = (file, text) => writeFileSync(file, `\uFEFF${text}`, 'utf8');
const writeUtf16 = (file, text) => writeFileSync(file, `\uFEFF${text}`, 'utf16le');

// ───────────────────────── DSH 包 ─────────────────────────
cpSync(join(root, 'dsh'), join(SRC_DSH, 'dsh'), { recursive: true });

const installPs = String.raw`# 盘古开屏 · DeepSeek Harness 安装器
# 用法：安装.cmd（推荐）或 powershell -ExecutionPolicy Bypass -File install.ps1
#       卸载：install.ps1 -Uninstall
# 做的事：给每个 app 型 profile 建 node_modules 目录联接，并在 cordis.patch.yml 追加挂载段（原文件备份）。
param([switch]$Uninstall, [string]$DshHome)

$ErrorActionPreference = 'Stop'
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$pluginSrc = Join-Path $here 'dsh'
if (-not (Test-Path $pluginSrc)) { Write-Host "找不到 dsh 目录，请把压缩包完整解压后再运行。" -ForegroundColor Red; exit 1 }
if (-not $DshHome -or $DshHome -eq '') { $DshHome = Join-Path $env:USERPROFILE '.dsh' }

$profilesDir = Join-Path $DshHome 'profiles'
if (-not (Test-Path $profilesDir)) {
  Write-Host "没找到 $profilesDir" -ForegroundColor Red
  Write-Host "请先启动一次 DeepSeek Harness 桌面版，再运行本安装器。" -ForegroundColor Yellow
  exit 1
}

$nl = [char]10
$BEGIN = '# >>> pangu-theme (managed) >>>'
$END = '# <<< pangu-theme (managed) <<<'
$BLOCK = @"
$BEGIN
- insert:
    - id: pangu-theme
      name: dsh-pangu-theme
$END
"@
$UTF8NoBom = New-Object System.Text.UTF8Encoding($false)

# 找 app 型 profile：package.json 的 dsh.profile.bundles 含 @deepseek-ai/dsh-web-app
$targets = @()
Get-ChildItem $profilesDir -Directory | ForEach-Object {
  $name = $_.Name
  if ($name -match '-backup-\d{8}$') { return }
  if ($name -like 'omd*') { return }
  $pkg = Join-Path $_.FullName 'package.json'
  if (-not (Test-Path $pkg)) { return }
  try { $json = Get-Content $pkg -Raw -Encoding UTF8 | ConvertFrom-Json } catch { return }
  $bundles = @()
  if ($json.dsh -and $json.dsh.profile -and $json.dsh.profile.bundles) { $bundles = @($json.dsh.profile.bundles) }
  if ($bundles -contains '@deepseek-ai/dsh-web-app') { $targets += $_.FullName }
}

if ($targets.Count -eq 0) {
  Write-Host "没找到 app 型 profile（bundles 里没有 @deepseek-ai/dsh-web-app）。" -ForegroundColor Red
  Write-Host "请先启动一次 DeepSeek Harness 桌面版；若仍有问题，把 $profilesDir 下的目录名告诉作者。" -ForegroundColor Yellow
  exit 1
}

$names = ($targets | ForEach-Object { Split-Path $_ -Leaf }) -join ', '
if ($Uninstall) { Write-Host ("卸载：" + $names) } else { Write-Host ("安装：" + $names) }

foreach ($dir in $targets) {
  $leaf = Split-Path $dir -Leaf
  $nm = Join-Path $dir 'node_modules'
  if (-not (Test-Path $nm)) { New-Item -ItemType Directory -Path $nm | Out-Null }
  $link = Join-Path $nm 'dsh-pangu-theme'

  if ($Uninstall) {
    if (Test-Path $link) {
      # 只删目录联接本身，绝不触碰目标内容
      [System.IO.Directory]::Delete($link)
      Write-Host ("  " + $leaf + ": 已移除联接")
    }
  } else {
    if (-not (Test-Path $link)) {
      New-Item -ItemType Junction -Path $link -Target $pluginSrc | Out-Null
      Write-Host ("  " + $leaf + ": 已建立联接")
    }
  }

  $patch = Join-Path $dir 'cordis.patch.yml'
  if (Test-Path $patch) {
    $text = [System.IO.File]::ReadAllText($patch, [System.Text.Encoding]::UTF8)
    $pattern = "(?s)\r?\n?" + [regex]::Escape($BEGIN) + ".*?" + [regex]::Escape($END) + "\r?\n?"
    $cleaned = ([regex]::Replace($text, $pattern, [string]$nl)).TrimEnd() + [string]$nl
    Copy-Item $patch ($patch + '.pangu-bak') -Force
    if ($Uninstall) {
      [System.IO.File]::WriteAllText($patch, $cleaned, $UTF8NoBom)
      Write-Host ("  " + $leaf + ": 已移除挂载段（备份 .pangu-bak）")
    } else {
      [System.IO.File]::WriteAllText($patch, $cleaned + [string]$nl + $BLOCK, $UTF8NoBom)
      Write-Host ("  " + $leaf + ": 已写入挂载段")
    }
  } elseif (-not $Uninstall) {
    [System.IO.File]::WriteAllText($patch, $BLOCK, $UTF8NoBom)
    Write-Host ("  " + $leaf + ": 已新建 cordis.patch.yml")
  }
}

Write-Host ""
if ($Uninstall) {
  Write-Host "已卸载。完全退出 DeepSeek Harness 再启动即可恢复原样。" -ForegroundColor Green
} else {
  Write-Host "完成。" -ForegroundColor Green
  Write-Host "请【完全退出】DeepSeek Harness（托盘图标也要退出），再重新打开。" -ForegroundColor Yellow
  Write-Host "启动后左下角会出现一个半透明小花，点开就是开关。"
}
`;
writeUtf8Bom(join(SRC_DSH, 'install.ps1'), installPs);

const dshReadme = `盘古 · DeepSeek Harness 开屏动画
====================================

这是什么
  给 DeepSeek Harness 桌面版加一段华为风格的开屏动画（约 3.3 秒），
  并带一个可以关掉的开关。不修改应用本体，应用升级不会丢。

怎么装
  1) 把压缩包【完整解压】到任意目录（不要在压缩包里直接双击）
  2) 双击 安装.cmd
     如果提示没有权限，右键 安装.cmd → 以管理员身份运行
  3) 完成提示出现后，【完全退出】DeepSeek Harness（托盘图标也要退出），再打开

怎么关 / 怎么开
  - 开屏右下角：「跳过」「不再自动播放」
  - 应用左下角有一朵半透明小花（可以拖动，位置会记住），点开就是总开关：
      · 开屏动画
      · 每次启动都播放
      · 立即播放一次

怎么卸
  双击 卸载.cmd，然后完全退出应用再打开。

常见问题
  - 双击 安装.cmd 一闪而过：右键 → 在此处打开 PowerShell，手动运行
      powershell -ExecutionPolicy Bypass -File .\\install.ps1
  - 装完没反应：确认是「完全退出」应用（不是关窗口），托盘图标也要退出。
  - 需要 Windows + DeepSeek Harness 桌面版；不需要安装 Node。

来源
  动画设计与素材来自 pangu-cli-theme（MIT, Lightly20110815）：
  https://github.com/Lightly20110815/pangu-cli-theme
  桌面端移植：panan  https://github.com/panan3562-svg/pangu-desktop-theme
  HUAWEI 名称与花瓣标志是华为技术有限公司的商标，不在 MIT 许可范围内。
`;
writeUtf8Bom(join(SRC_DSH, '使用说明.txt'), dshReadme);

writeFileSync(join(SRC_DSH, '安装.cmd'), '@echo off\r\nchcp 65001 >nul\r\npowershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0install.ps1"\r\necho.\r\npause\r\n', 'utf8');
writeFileSync(join(SRC_DSH, '卸载.cmd'), '@echo off\r\nchcp 65001 >nul\r\npowershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0install.ps1" -Uninstall\r\necho.\r\npause\r\n', 'utf8');

// ───────────────────────── Codex 包 ─────────────────────────
copyFileSync(join(root, 'codex', 'launcher.mjs'), join(SRC_CODEX, 'launcher.mjs'));
copyFileSync(join(root, 'codex', 'find-app.mjs'), join(SRC_CODEX, 'find-app.mjs'));
cpSync(join(root, 'codex', 'dist'), join(SRC_CODEX, 'dist'), { recursive: true });
mkdirSync(join(SRC_CODEX, 'runtime'), { recursive: true });
if (existsSync(NODE_EXE)) {
  copyFileSync(NODE_EXE, join(SRC_CODEX, 'runtime', 'node.exe'));
  console.log('bundled node:', Math.round(statSync(NODE_EXE).size / 1048576), 'MB');
} else {
  console.warn('! 没找到 node.exe，Codex 包将依赖系统 Node');
}

const startVbs = `Option Explicit
' 盘古 · Codex 开屏动画启动器
' 以隐藏窗口运行 launcher.mjs：用调试端口启动 ChatGPT 并注入开屏脚本。
Dim fso, sh, dir, node, cmd, code
Set fso = CreateObject("Scripting.FileSystemObject")
Set sh = CreateObject("WScript.Shell")
dir = fso.GetParentFolderName(WScript.ScriptFullName)

node = dir & "\\runtime\\node.exe"
If Not fso.FileExists(node) Then
  node = "node.exe"
End If

sh.CurrentDirectory = dir
cmd = """" & node & """ """ & dir & "\\launcher.mjs"""
code = sh.Run(cmd, 0, True)

If code = 2 Then
  MsgBox "ChatGPT 已经在运行。" & vbCrLf & vbCrLf & "请先完全退出它（包括右下角托盘图标），再用此快捷方式打开。", 48, "盘古 · 开屏"
ElseIf code = 3 Then
  MsgBox "没找到 ChatGPT 桌面版（OpenAI.Codex 商店包）。" & vbCrLf & vbCrLf & "请先在微软商店安装 ChatGPT 桌面版。", 48, "盘古 · 开屏"
ElseIf code = 4 Then
  MsgBox "ChatGPT 启动后没能连上调试端口，开屏未加载。" & vbCrLf & vbCrLf & "日志：%LOCALAPPDATA%\\pangu-theme\\codex-launcher.log", 48, "盘古 · 开屏"
End If
`;
writeUtf16(join(SRC_CODEX, '启动.vbs'), startVbs);

const codexReadme = `盘古 · Codex / ChatGPT 桌面版开屏动画
====================================

这是什么
  给 ChatGPT 桌面版（微软商店包 OpenAI.Codex）加一段华为风格的开屏动画，
  并带一个可以关掉的开关。不修改应用安装目录里的任何文件。

怎么用
  1) 把压缩包【完整解压】到任意目录（不要在压缩包里直接双击）
  2) 先【完全退出】ChatGPT（右键托盘图标退出，不是关窗口）
  3) 双击 启动.vbs
  4) 想以后再开：给 启动.vbs 建个桌面快捷方式，用它启动

  ⚠ 只有从这个启动器打开才有动画。从开始菜单/原图标打开 = 原版，没有动画。

怎么关 / 怎么开
  - 开屏右下角：「跳过」「不再自动播放」
  - 应用右下角有一朵半透明小花（可以拖动，位置会记住），点开就是总开关。

怎么卸
  删除这个文件夹即可。应用本体没有任何改动。

常见问题
  - 提示「已经在运行」：先把 ChatGPT 完全退出（托盘图标右键退出）再开。
  - 没反应：看日志 %LOCALAPPDATA%\\pangu-theme\\codex-launcher.log
  - 需要 Windows 10/11 + 微软商店版 ChatGPT 桌面版；自带 Node 运行时，不用另装。

来源
  动画设计与素材来自 pangu-cli-theme（MIT, Lightly20110815）：
  https://github.com/Lightly20110815/pangu-cli-theme
  桌面端移植：panan  https://github.com/panan3562-svg/pangu-desktop-theme
  HUAWEI 名称与花瓣标志是华为技术有限公司的商标，不在 MIT 许可范围内。
`;
writeUtf8Bom(join(SRC_CODEX, '使用说明.txt'), codexReadme);

console.log('staged:', SRC_DSH, SRC_CODEX);
