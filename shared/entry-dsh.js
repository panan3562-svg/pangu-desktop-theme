// 盘古开屏 · DSH 入口：配置走 Node 端路由（跨端口/跨重启都稳定）。
const PANGU_CONFIG_URL = '/pangu-theme/config';

const panguAdapter = {
  brand: 'dsh',
  pixelSlogan: false,
  corner: 'left',
  strings: {
    slogan: '让想法，即刻成形',
    tagline: 'MAKE IT REAL',
    platform: '盘古大模型 · DeepSeek Harness',
  },
  async load() {
    const res = await fetch(PANGU_CONFIG_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },
  async save(patch) {
    const res = await fetch(PANGU_CONFIG_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(patch),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },
};

const panguTheme = createPanguTheme(panguAdapter);

function apply() {
  panguTheme.boot();
}

// 兜底：万一客户端模块运行器没有调用 apply，也要起得来（boot 幂等）。
setTimeout(() => panguTheme.boot(), 500);
