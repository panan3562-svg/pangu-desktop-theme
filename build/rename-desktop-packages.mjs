// 给桌面上的分发包改个不带空格的名字，方便转发（有些聊天工具会把空格转义）。
import { renameSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const desktop = join(process.env.USERPROFILE, 'Desktop');
const pairs = [
  ['盘古开屏-DeepSeek Harness.zip', '盘古开屏-DeepSeekHarness.zip'],
  ['盘古开屏-Codex.zip', '盘古开屏-Codex.zip'],
];

for (const [from, to] of pairs) {
  const src = join(desktop, from);
  const dst = join(desktop, to);
  if (!existsSync(src)) { console.log('skip (missing):', from); continue; }
  if (src === dst) { console.log('already ok:', to); continue; }
  renameSync(src, dst);
  console.log('renamed ->', to);
}
