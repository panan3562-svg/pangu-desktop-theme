// 把打好的两个 zip 复制到桌面（中文文件名）。
import { copyFileSync, existsSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const dist = join(resolve(import.meta.dirname, '..'), 'dist');
const desktop = join(process.env.USERPROFILE, 'Desktop');

const pairs = [
  ['pangu-dsh.zip', '盘古开屏-DeepSeek Harness.zip'],
  ['pangu-codex.zip', '盘古开屏-Codex.zip'],
];

for (const [src, dst] of pairs) {
  const from = join(dist, src);
  if (!existsSync(from)) { console.error('missing', from); process.exit(1); }
  const to = join(desktop, dst);
  copyFileSync(from, to);
  console.log(`${dst}  ${Math.round(statSync(to).size / 1048576 * 10) / 10} MB  -> ${to}`);
}
