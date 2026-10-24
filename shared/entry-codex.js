// 盘古开屏 · Codex / ChatGPT 桌面版入口。
// 由启动器通过 CDP 注入；配置存 localStorage（与应用同源，跨启动保留）。
const PANGU_CONFIG_KEY = 'pangu-theme.config';

const panguAdapter = {
  brand: 'codex',
  pixelSlogan: true,
  corner: 'right',
  strings: {
    tagline: 'CODE IT POSSIBLE',
    platform: '盘古大模型 · Codex',
  },
  disabled: typeof window !== 'undefined' && window.__PANGU_DISABLED__ === true,
  async load() {
    try {
      const raw = localStorage.getItem(PANGU_CONFIG_KEY);
      if (raw) {
        const cfg = JSON.parse(raw);
        if (cfg && typeof cfg === 'object') return cfg;
      }
    } catch { /* 忽略损坏数据 */ }
    return { enabled: true, everyLaunch: true };
  },
  async save(patch) {
    const next = { ...(await panguAdapter.load()), ...patch };
    try {
      localStorage.setItem(PANGU_CONFIG_KEY, JSON.stringify(next));
    } catch (error) {
      console.warn('[pangu-theme] 写入 localStorage 失败：', error);
    }
    return next;
  },
};

const panguTheme = createPanguTheme(panguAdapter);
panguTheme.boot();
