// 从上游 pangu-cli-theme 的 art.json 提取几何数据，生成浏览器端可直接用的 art.data.js。
// 只保留渲染需要的字段：花瓣/字标多边形、包围盒、渐变、原点、像素标语位图。
// 运行： node build/gen-art.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const here = import.meta.dirname;
const root = resolve(here, '..');
const src = join(root, '..', 'pangu', 'pangu', 'assets', 'art.json');
const art = JSON.parse(readFileSync(src, 'utf8'));

const out = {
  source: art.source,
  petals: art.petals,
  word: art.word,
  logo_bbox: art.logo_bbox,
  word_bbox: art.word_bbox,
  origin: art.origin,
  gradient: art.gradient,
  // 上游的两套像素标语位图（3~6 行四档）。桌面端直接复用，省掉字体依赖。
  slogans: {
    codex: art.slogans.codex,
    claude: art.slogans.claude,
  },
};

const body = JSON.stringify(out);
const file = `// 由 build/gen-art.mjs 从 pangu-cli-theme/pangu/assets/art.json 生成，请勿手改。
const ART = ${body};
`;
writeFileSync(join(root, 'shared', 'art.data.js'), file, 'utf8');
console.log('art.data.js bytes =', file.length, '| petals =', out.petals.length, '| word polys =', out.word.length);
