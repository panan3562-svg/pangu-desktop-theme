# 归属与来源声明

本项目的**动画设计与美术素材全部来自上游项目**，本仓库只做「桌面端接入 + 渲染重写」。

## 上游

| 项 | 内容 |
|---|---|
| 项目 | [pangu-cli-theme](https://github.com/Lightly20110815/pangu-cli-theme) |
| 作者 | Lightly20110815 |
| 许可 | MIT（Copyright (c) 2026 Lightly20110815，全文见上游仓库 LICENSE） |
| 定位 | 给 **终端里的** Codex CLI / Claude Code 加华为风格开屏动画 |

## 本项目复用了什么

| 文件 / 内容 | 来源 | 说明 |
|---|---|---|
| 花瓣多边形、HUAWEI 字标多边形 | 上游 `pangu/assets/art.json` | 由 `build/gen-art.mjs` 原样提取，未改动坐标 |
| 径向渐变参数（中心、半径、色标） | 上游 `art.json` 的 `gradient` | 与上游 SVG 同一套参数 |
| 像素标语位图（「让想法，码上成真」） | 上游 `art.json` 的 `slogans.codex` | 逐位渲染 |
| 动画编排（光标闪动 → 花瓣展开 → 字标解码 → 光扫） | 上游 `pangu/intro.py` | 时间轴与节奏参照上游，重写为 Canvas 实现 |
| 标语 / 副标语 / 平台行的文案结构 | 上游 README 与 `art.py` | Codex 沿用上游；DSH 一行是新写的 |

## 本项目新写的部分

- `shared/engine.js`：把上游的终端字符动画（Unicode 方块 + 子像素栅格化）**重写为 Canvas 2D 动画**，包含新的花瓣生长曲线、边缘代码字符、字标解遮罩、光扫合成。
- `shared/ui.js`、`shared/entry-*.js`：应用内的常驻入口、开关面板、拖动与位置记忆、深浅色跟随。
- `dsh/`：DeepSeek Harness 插件（Node 端配置路由 + 客户端 `__ModuleLoader__` 模块）。
- `codex/`：Codex/ChatGPT 桌面版启动器（Chromium 调试端口 + CDP 注入）。
- 全部接入代码、构建脚本、自测脚本。

## 商标

`HUAWEI` 名称、华为花瓣标志与 HUAWEI 字标是**华为技术有限公司的商标**，不在本项目 MIT 许可范围内，也不在上游 MIT 许可范围内。本项目是非官方爱好者作品，与华为、OpenAI、DeepSeek 均无关系。

如果你要二次分发，请保留本文件与上游署名。
