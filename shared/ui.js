// 盘古 · 共享 UI 层：开屏播放、常驻小入口、开关面板。
// 宿主差异（配置从哪来、存到哪）由 adapter 提供：
//   adapter = {
//     brand: 'codex' | 'dsh',
//     strings: { slogan?, tagline, platform },
//     pixelSlogan: boolean,
//     load(): Promise<config>,          // { enabled, everyLaunch }
//     save(patch): Promise<config>,
//     disabled?: boolean,               // 启动参数强制关闭（Codex 启动器用）
//   }

const PANGU_STORE_KEY = 'pangu-theme.played';

function panguLuma(hex) {
  const h = String(hex).replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255;
}

/** 跟随宿主界面深浅：优先读页面背景色，读不到再看系统偏好。 */
function panguDetectTheme() {
  try {
    const bg = getComputedStyle(document.body).backgroundColor || '';
    const m = bg.match(/rgba?\(([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/);
    if (m) {
      const l = (0.2126 * +m[1] + 0.7152 * +m[2] + 0.0722 * +m[3]) / 255;
      return l > 0.6 ? 'light' : 'dark';
    }
  } catch { /* 忽略 */ }
  return typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

/** 迷你花瓣图标：把 art.json 的多边形缩放到 20×20，不额外维护图标资源。 */
function panguChipIcon() {
  const lb = ART.logo_bbox;
  const w = lb[2] - lb[0], h = lb[3] - lb[1];
  const s = 20 / Math.max(w, h);
  const tx = (x) => ((x - lb[0] - (w - Math.max(w, h)) / 2) * s).toFixed(2);
  const ty = (y) => ((y - lb[1] - (h - Math.max(w, h)) / 2) * s).toFixed(2);
  const d = ART.petals.map((poly) => `M${poly.map(([x, y]) => `${tx(x)},${ty(y)}`).join('L')}Z`).join('');
  return `<svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true"><defs>
    <linearGradient id="pangu-chip-g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f29680"/><stop offset="0.55" stop-color="#d71718"/><stop offset="1" stop-color="#971e23"/>
    </linearGradient></defs><path d="${d}" fill="url(#pangu-chip-g)"/></svg>`;
}

function panguStyles() {
  if (document.getElementById('pangu-theme-style')) return;
  const style = document.createElement('style');
  style.id = 'pangu-theme-style';
  style.textContent = `
  [data-pangu-chip]{position:fixed;z-index:2147483000;width:28px;height:28px;border-radius:50%;
    display:grid;place-items:center;cursor:grab;opacity:.32;transition:opacity .18s ease,transform .18s ease,background .18s ease;
    border:1px solid rgba(255,255,255,.14);background:rgba(20,21,25,.66);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);
    touch-action:none;user-select:none}
  [data-pangu-chip]:hover{opacity:1;transform:scale(1.06)}
  [data-pangu-chip]:active{cursor:grabbing}
  [data-pangu-chip][data-light]{border-color:rgba(0,0,0,.14);background:rgba(255,255,255,.8)}
  [data-pangu-panel]{position:fixed;z-index:2147483001;width:250px;border-radius:12px;padding:12px 12px 10px;
    background:rgba(22,23,28,.97);color:#e9e4df;font:12px/1.5 "Segoe UI","Microsoft YaHei UI",system-ui,sans-serif;
    border:1px solid rgba(255,255,255,.12);box-shadow:0 18px 48px rgba(0,0,0,.45);backdrop-filter:blur(10px);}
  [data-pangu-panel][data-light]{background:rgba(252,252,252,.98);color:#262223;border-color:rgba(0,0,0,.12);box-shadow:0 18px 48px rgba(0,0,0,.18)}
  [data-pangu-panel] h4{margin:0 0 10px;font-size:12.5px;font-weight:600;letter-spacing:.02em;display:flex;align-items:center;gap:7px}
  [data-pangu-panel] h4 span.dot{width:7px;height:7px;border-radius:50%;background:#d71718;box-shadow:0 0 8px rgba(215,23,24,.8)}
  [data-pangu-panel] .row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:5px 0}
  [data-pangu-panel] .row small{opacity:.55;display:block;font-size:11px;line-height:1.35;margin-top:1px}
  [data-pangu-panel] button.act{appearance:none;border:1px solid currentColor;background:transparent;color:inherit;font:inherit;
    padding:4px 9px;border-radius:6px;cursor:pointer;opacity:.75}
  [data-pangu-panel] button.act:hover{opacity:1}
  [data-pangu-panel] .switch{position:relative;width:34px;height:19px;border-radius:999px;background:rgba(255,255,255,.18);
    border:0;cursor:pointer;flex:0 0 auto;transition:background .18s ease;padding:0}
  [data-pangu-panel][data-light] .switch{background:rgba(0,0,0,.16)}
  [data-pangu-panel] .switch i{position:absolute;top:2px;left:2px;width:15px;height:15px;border-radius:50%;background:#fff;
    transition:transform .18s ease;box-shadow:0 1px 3px rgba(0,0,0,.35)}
  [data-pangu-panel] .switch[aria-checked="true"]{background:#c7000b}
  [data-pangu-panel] .switch[aria-checked="true"] i{transform:translateX(15px)}
  [data-pangu-panel] .sep{height:1px;background:currentColor;opacity:.12;margin:7px 0}
  [data-pangu-panel] .foot{opacity:.45;font-size:10.5px;line-height:1.5}
  `;
  document.head.appendChild(style);
}

function panguCreateSwitch(checked, onChange) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'switch';
  btn.setAttribute('role', 'switch');
  btn.setAttribute('aria-checked', String(!!checked));
  btn.innerHTML = '<i></i>';
  btn.addEventListener('click', () => {
    const next = btn.getAttribute('aria-checked') !== 'true';
    btn.setAttribute('aria-checked', String(next));
    onChange(next);
  });
  return btn;
}

/**
 * 装配开屏主题。返回 { boot() }，宿主在 DOM 就绪后调用一次即可。
 */
function createPanguTheme(adapter) {
  const state = {
    config: { enabled: true, everyLaunch: true },
    booted: false,
    intro: null,
    chip: null,
    panel: null,
    theme: panguDetectTheme(),
  };

  const sync = () => {
    const { chip, panel, config, theme } = state;
    if (chip) {
      if (theme === 'light') chip.setAttribute('data-light', '');
      else chip.removeAttribute('data-light');
      chip.title = config.enabled ? '盘古开屏动画：开（点击设置）' : '盘古开屏动画：关（点击设置）';
      chip.style.opacity = config.enabled ? '.34' : '.18';
    }
    if (panel) {
      if (theme === 'light') panel.setAttribute('data-light', '');
      else panel.removeAttribute('data-light');
      const en = panel.querySelector('[data-k="enabled"] .switch');
      if (en) en.setAttribute('aria-checked', String(config.enabled));
      const ev = panel.querySelector('[data-k="everyLaunch"] .switch');
      if (ev) ev.setAttribute('aria-checked', String(config.everyLaunch));
      panel.querySelectorAll('[data-k="everyLaunch"]').forEach((r) => {
        r.style.opacity = config.enabled ? '1' : '.4';
      });
    }
  };

  const save = async (patch) => {
    state.config = { ...state.config, ...patch };
    try {
      const cfg = await adapter.save(patch);
      if (cfg) state.config = { ...state.config, ...cfg };
    } catch (error) {
      console.warn('[pangu-theme] 保存配置失败：', error);
    }
    state.theme = panguDetectTheme();
    sync();
    return state.config;
  };

  const closePanel = () => {
    if (!state.panel) return;
    state.panel.remove();
    state.panel = null;
    document.removeEventListener('mousedown', outside, true);
  };

  function outside(ev) {
    const p = state.panel;
    if (!p) return;
    if (p.contains(ev.target) || (state.chip && state.chip.contains(ev.target))) return;
    closePanel();
  }

  const openPanel = () => {
    if (state.panel) return;
    panguStyles();
    const panel = document.createElement('div');
    panel.setAttribute('data-pangu-panel', '');
    panel.style.visibility = 'hidden';

    const title = document.createElement('h4');
    title.innerHTML = '<span class="dot"></span>盘古 · 开屏动画';
    panel.appendChild(title);

    const mkRow = (key, label, hint, checked, onChange) => {
      const row = document.createElement('div');
      row.className = 'row';
      row.setAttribute('data-k', key);
      const text = document.createElement('div');
      text.innerHTML = `${label}${hint ? `<small>${hint}</small>` : ''}`;
      row.appendChild(text);
      row.appendChild(panguCreateSwitch(checked, onChange));
      panel.appendChild(row);
    };

    mkRow('enabled', '开屏动画', '启动时播放花瓣开屏', state.config.enabled, (v) => save({ enabled: v }));
    mkRow('everyLaunch', '每次启动都播放', '关掉后只播一次', state.config.everyLaunch, (v) => save({ everyLaunch: v }));

    const sep = document.createElement('div');
    sep.className = 'sep';
    panel.appendChild(sep);

    const row = document.createElement('div');
    row.className = 'row';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'act';
    btn.textContent = '立即播放一次';
    btn.addEventListener('click', () => play(true));
    row.appendChild(btn);
    const foot = document.createElement('div');
    foot.className = 'foot';
    foot.textContent = 'ESC / 空格 跳过';
    row.appendChild(foot);
    panel.appendChild(row);

    document.body.appendChild(panel);
    state.panel = panel;
    // 贴着小花放：优先在上方，放不下就落到下方；左右夹在视口内
    const r = state.chip ? state.chip.getBoundingClientRect() : { left: 14, top: innerHeight - 70, right: 42, bottom: innerHeight - 42 };
    const pw = panel.offsetWidth || 250;
    const ph = panel.offsetHeight || 190;
    let left = Math.round(r.left);
    if (left + pw > window.innerWidth - 8) left = window.innerWidth - pw - 8;
    left = Math.max(8, left);
    let top = Math.round(r.top - ph - 10);
    if (top < 8) top = Math.min(window.innerHeight - ph - 8, Math.round(r.bottom + 10));
    panel.style.left = `${left}px`;
    panel.style.top = `${Math.max(8, top)}px`;
    panel.style.visibility = '';
    sync();
    setTimeout(() => document.addEventListener('mousedown', outside, true), 0);
  };

  const CHIP_POS_KEY = 'pangu-theme.chip';

  const clampChip = (left, top) => {
    const w = state.chip ? state.chip.offsetWidth || 28 : 28;
    const h = state.chip ? state.chip.offsetHeight || 28 : 28;
    return {
      left: Math.min(Math.max(4, left), Math.max(4, window.innerWidth - w - 4)),
      top: Math.min(Math.max(4, top), Math.max(4, window.innerHeight - h - 4)),
    };
  };

  const placeChip = (left, top) => {
    const pos = clampChip(left, top);
    state.chip.style.left = `${pos.left}px`;
    state.chip.style.top = `${pos.top}px`;
    return pos;
  };

  const defaultChipPos = () => {
    const right = adapter.corner === 'right';
    const x = right ? window.innerWidth - 28 - 14 : 14;
    const y = window.innerHeight - 28 - 14;
    return { left: x, top: y };
  };

  const mountChip = () => {
    if (state.chip) return;
    panguStyles();
    const chip = document.createElement('div');
    chip.setAttribute('data-pangu-chip', '');
    chip.setAttribute('role', 'button');
    chip.setAttribute('tabindex', '0');
    chip.title = '盘古 · 点按开关，可拖动';
    chip.innerHTML = panguChipIcon();

    let saved = null;
    try { saved = JSON.parse(localStorage.getItem(CHIP_POS_KEY) || 'null'); } catch { /* 忽略 */ }
    state.chip = chip;
    document.body.appendChild(chip);
    const start = saved && Number.isFinite(saved.left) && Number.isFinite(saved.top) ? saved : defaultChipPos();
    placeChip(start.left, start.top);

    // 拖动 / 点击二选一：位移超过 4px 视为拖动，松开后不打开面板
    let drag = null;
    let lastDragEnd = 0;
    chip.addEventListener('pointerdown', (ev) => {
      if (ev.button !== 0) return;
      const rect = chip.getBoundingClientRect();
      drag = { x: ev.clientX, y: ev.clientY, left: rect.left, top: rect.top, moved: false };
      chip.setPointerCapture(ev.pointerId);
      ev.preventDefault();
    });
    chip.addEventListener('pointermove', (ev) => {
      if (!drag) return;
      const dx = ev.clientX - drag.x;
      const dy = ev.clientY - drag.y;
      if (!drag.moved && Math.hypot(dx, dy) < 4) return;
      drag.moved = true;
      placeChip(drag.left + dx, drag.top + dy);
    });
    chip.addEventListener('pointerup', () => {
      if (!drag) return;
      const moved = drag.moved;
      drag = null;
      if (moved) {
        lastDragEnd = Date.now();
        try {
          localStorage.setItem(CHIP_POS_KEY, JSON.stringify({ left: parseFloat(chip.style.left), top: parseFloat(chip.style.top) }));
        } catch { /* 忽略 */ }
      }
    });
    chip.addEventListener('pointercancel', () => { drag = null; });
    // 保留原生 click：无障碍工具（以及测试脚本的 .click()）走的都是这条
    chip.addEventListener('click', () => {
      if (Date.now() - lastDragEnd < 400) return; // 刚拖完，别把拖动当点击
      if (state.panel) closePanel();
      else openPanel();
    });
    chip.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        if (state.panel) closePanel();
        else openPanel();
      }
    });

    window.addEventListener('resize', () => {
      placeChip(parseFloat(chip.style.left) || 14, parseFloat(chip.style.top) || 14);
      if (state.panel) { closePanel(); }
    });

    sync();
  };

  const play = (force) => {
    if (state.intro) return;
    if (!force) {
      if (adapter.disabled || !state.config.enabled) return;
      if (!state.everyLaunch) {
        let played = false;
        try { played = sessionStorage.getItem(PANGU_STORE_KEY) === '1'; } catch { /* 忽略 */ }
        if (played) return;
      }
      // 30 秒冷静期：应用内刷新 / 插件热重载不应该再放一遍
      try {
        const last = Number(sessionStorage.getItem(`${PANGU_STORE_KEY}.at`) || 0);
        if (last && Date.now() - last < 30000) return;
      } catch { /* 忽略 */ }
    }
    state.theme = panguDetectTheme();
    const intro = createPangu({
      brand: adapter.brand,
      theme: state.theme,
      pixelSlogan: adapter.pixelSlogan,
      strings: adapter.strings,
      onDisable: () => save({ enabled: false }),
      onDone: () => {
        state.intro = null;
        try {
          sessionStorage.setItem(PANGU_STORE_KEY, '1');
          sessionStorage.setItem(`${PANGU_STORE_KEY}.at`, String(Date.now()));
        } catch { /* 忽略 */ }
        if (state.chip) state.chip.style.display = '';
        sync();
      },
    });
    state.intro = intro;
    if (state.chip) state.chip.style.display = 'none';
    closePanel();
    intro.start();
  };

  return {
    async boot() {
      if (state.booted) return;
      state.booted = true;
      // 模块可能被 HMR/重复加载多次，用全局标记保证只挂一份
      if (window.__PANGU_THEME_ACTIVE__) return;
      window.__PANGU_THEME_ACTIVE__ = true;
      try {
        const cfg = await adapter.load();
        if (cfg) state.config = { ...state.config, ...cfg };
      } catch (error) {
        console.warn('[pangu-theme] 读取配置失败，用默认值：', error);
      }
      state.theme = panguDetectTheme();
      const start = () => { mountChip(); play(false); };
      if (document.body) start();
      else document.addEventListener('DOMContentLoaded', start, { once: true });
    },
    play,
    get config() { return state.config; },
  };
}
