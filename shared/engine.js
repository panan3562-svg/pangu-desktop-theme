// 盘古 · 桌面开屏动画引擎（DSH 与 Codex 共用）
// ---------------------------------------------------------------
// 把上游 pangu-cli-theme 的终端字符动画，重画成 Canvas 版本：
//   1) 光标闪两下 → 代码字符向中心收拢
//   2) 八片花瓣从交汇点长出、先内后外展开，边缘闪过代码字符，内部是华为红渐变
//   3) HUAWEI 字标从左到右「解码」出来
//   4) 一道光扫过整个标志
//   5) 标语 / 副标语 / 平台行淡入，整层淡出交还界面
// 依赖：ART（art.data.js，由 build/gen-art.mjs 生成）
// 导出：createPangu(options) → 控制器 { start, skip, destroy, renderAt, el }

const THEMES = {
  dark: {
    bg: '#0e0f12', ink: '#eee9e4', soft: '#c4bdb8', muted: '#807977',
    red: '#e8343c', rule: '#5c262b', chipBg: 'rgba(20,21,25,.92)',
    chipLine: 'rgba(255,255,255,.14)', chipText: '#e8e3de', hover: 'rgba(255,255,255,.10)',
  },
  light: {
    bg: '#fafafa', ink: '#1e1a1b', soft: '#464040', muted: '#7a7472',
    red: '#c7000b', rule: '#e6bec0', chipBg: 'rgba(255,255,255,.94)',
    chipLine: 'rgba(0,0,0,.12)', chipText: '#2a2526', hover: 'rgba(0,0,0,.06)',
  },
};

const CODE = '0101010110{}<>/=;+*#';
const PETAL_BBOX = { x: 4.537, y: 3.32, w: 58.246, h: 43.895 };
const WORD_BBOX = { x: 4.63, y: 52.92, w: 58.18, h: 9.93 };
const LOCK = { x: 4.537, y: 3.32, w: 58.273, h: 59.53 };

const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const easeOutCubic = (t) => 1 - Math.pow(1 - clamp(t), 3);
const easeInOut = (t) => { t = clamp(t); return t * t * (3 - 2 * t); };
const easeOutBack = (t, s = 1.22) => { t = clamp(t) - 1; return t * t * ((s + 1) * t + s) + 1; };

/** 上游时间轴（毫秒）。改这里就能整体变速。 */
const T = {
  cursor: [0, 300],
  particles: [40, 430],
  petals: [280, 1180],
  word: [1120, 1900],
  sweep: [1900, 2480],
  subtitles: [2200, 2840],
  fadeOut: [2900, 3320],
};

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function rgba(rgb, a) {
  return `rgba(${rgb[0] | 0},${rgb[1] | 0},${rgb[2] | 0},${a})`;
}
function mix(a, b, t) {
  t = clamp(t);
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

/** 花瓣几何：质心、到交汇点的距离、方位角、内外顺序。 */
function petalGeometry() {
  const [ox, oy] = ART.origin;
  const out = ART.petals.map((poly) => {
    let mx = 0, my = 0;
    for (const p of poly) { mx += p[0]; my += p[1]; }
    mx /= poly.length; my /= poly.length;
    const dx = mx - ox, dy = my - oy;
    return {
      poly, cx: mx, cy: my,
      dist: Math.hypot(dx, dy),
      angle: Math.atan2(dx, -dy), // 从正上方起算，顺时针为正
    };
  });
  // 内圈先长：按到交汇点的距离排序；绘制顺序外圈在前、内圈压在上层
  const order = out.map((_, i) => i).sort((a, b) => out[a].dist - out[b].dist);
  order.forEach((idx, rank) => { out[idx].rank = rank; });
  return { petals: out, order };
}

function pathPoly(ctx, poly) {
  ctx.beginPath();
  ctx.moveTo(poly[0][0], poly[0][1]);
  for (let i = 1; i < poly.length; i++) ctx.lineTo(poly[i][0], poly[i][1]);
  ctx.closePath();
}

/** 把一个多边形追加进已有 Path2D（不做 beginPath，用于求并集）。 */
function addPoly(path, poly) {
  path.moveTo(poly[0][0], poly[0][1]);
  for (let i = 1; i < poly.length; i++) path.lineTo(poly[i][0], poly[i][1]);
  path.closePath();
}

function pickSloganSize(sizes, targetRows) {
  if (!sizes || !sizes.length) return null;
  let best = sizes[0];
  let bestD = Infinity;
  for (const s of sizes) {
    const d = Math.abs(s.rows - targetRows);
    if (d < bestD) { bestD = d; best = s; }
  }
  return best;
}

/**
 * 创建一次开屏播放。
 * options:
 *   brand      'codex' | 'dsh'      决定标语位图与文案
 *   theme      'dark' | 'light'
 *   strings    { slogan, tagline, platform }
 *   pixelSlogan boolean             是否用上游像素位图（Codex）还是文字（DSH）
 *   onSkip     () => void
 *   onDisable  () => void|Promise   用户点了「不再自动播放」
 *   onDone     () => void           播放结束 / 被跳过后
 */
function createPangu(options) {
  const opts = options || {};
  const pal = THEMES[opts.theme === 'light' ? 'light' : 'dark'];
  const strings = opts.strings || {};
  const petalGeo = petalGeometry();

  let host = null;
  let canvas = null;
  let ctx2d = null;
  let raf = 0;
  let startTs = 0;
  let finished = false;
  let skipRequested = false;
  let fadeStart = -1;
  let layout = null;
  let controls = null;

  const isReduced = () =>
    typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- 布局：把 SVG 坐标系映射到屏幕 ----
  function computeLayout() {
    const vw = host ? host.clientWidth : window.innerWidth;
    const vh = host ? host.clientHeight : window.innerHeight;
    const k = Math.min((vw * 0.55) / LOCK.w, (vh * 0.46) / LOCK.h);
    const lockW = LOCK.w * k;
    const lockH = LOCK.h * k;
    const left = (vw - lockW) / 2;
    const top = Math.max(24, (vh - lockH) / 2 - Math.min(56, vh * 0.06));
    return { vw, vh, k, lockW, lockH, left, top };
  }

  function setSvgTransform() {
    const { k, left, top } = layout;
    const dpr = ctx2d.__dpr || 1;
    ctx2d.setTransform(dpr * k, 0, 0, dpr * k, dpr * (left - LOCK.x * k), dpr * (top - LOCK.y * k));
  }
  function setCssTransform() {
    const dpr = ctx2d.__dpr || 1;
    ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // ---- 元素绘制 ----
  function drawParticles(t) {
    const [t0, t1] = T.particles;
    const p = clamp((t - t0) / (t1 - t0));
    if (p <= 0 || p >= 1) return;
    const [ox, oy] = ART.origin;
    setCssTransform();
    const { k, left, top } = layout;
    const cx = left + (ox - LOCK.x) * k;
    const cy = top + (oy - LOCK.y) * k;
    const n = 18;
    // 字号按屏幕像素恒定（否则大窗口下会随 k 放大成巨字）
    const fs = Math.min(22, Math.max(10, 9 + k * 1.1));
    ctx2d.font = `${fs}px ui-monospace, "Cascadia Mono", "Consolas", monospace`;
    ctx2d.textAlign = 'center';
    ctx2d.textBaseline = 'middle';
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + i * 0.7;
      const r = (1 - p) * (40 + ((i * 37) % 90)) * Math.min(1.4, k * 1.2);
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r * 0.8;
      const ch = CODE[(i * 7 + Math.floor(t / 90)) % CODE.length];
      ctx2d.fillStyle = rgba(mix(hexToRgb(pal.red), [255, 255, 255], 0.35), 0.55 * (1 - p));
      ctx2d.fillText(ch, x, y);
    }
  }

  function drawCursor(t) {
    const [t0, t1] = T.cursor;
    if (t < t0 || t > t1 + 80) return;
    const phase = (t - t0) % 140;
    const on = phase < 84;
    if (!on) return;
    const [ox, oy] = ART.origin;
    const { k, left, top } = layout;
    const x = left + (ox - LOCK.x) * k;
    const y = top + (oy - LOCK.y) * k;
    const w = Math.max(2, 3 * Math.min(1.6, k));
    const h = Math.max(12, 22 * Math.min(1.5, k));
    setCssTransform();
    const g = ctx2d.createRadialGradient(x, y, 0, x, y, h * 1.6);
    g.addColorStop(0, rgba(hexToRgb(pal.red), 0.55));
    g.addColorStop(1, rgba(hexToRgb(pal.red), 0));
    ctx2d.fillStyle = g;
    ctx2d.fillRect(x - h * 1.6, y - h * 1.6, h * 3.2, h * 3.2);
    ctx2d.fillStyle = pal.red;
    ctx2d.fillRect(x - w / 2, y - h / 2, w, h);
  }

  function petalTiming(i) {
    const { petals } = petalGeo;
    const inner = petals[i].rank <= 1;
    return { start: T.petals[0] + (inner ? 0 : 80) + petals[i].rank * 52, dur: 520 };
  }

  /** 单片的生长过程：位置从交汇点外推、绕自身质心旋转、由小到大。 */
  function drawPetal(i, t, opts2) {
    const { petals } = petalGeo;
    const petal = petals[i];
    const { start, dur } = petalTiming(i);
    const p = clamp((t - start) / dur);
    if (p <= 0) return;
    const e = easeOutBack(p, 1.18);
    const grow = clamp(lerp(0.04, 1, e), 0, 1.35);
    const [ox, oy] = ART.origin;
    const px = lerp(ox, petal.cx, easeOutCubic(p));
    const py = lerp(oy, petal.cy, easeOutCubic(p));
    const rot = petal.angle * (1 - easeOutCubic(p)) * 1.05;

    setSvgTransform();
    ctx2d.save();
    ctx2d.translate(px, py);
    ctx2d.rotate(rot);
    ctx2d.scale(grow, grow);
    ctx2d.translate(-petal.cx, -petal.cy);

    // 内部渐变（与上游 SVG 同一个径向渐变）
    const gd = ART.gradient;
    const grad = ctx2d.createRadialGradient(gd.cx, gd.cy, 0, gd.cx, gd.cy, gd.r);
    for (const [stop, c] of gd.stops) {
      grad.addColorStop(stop, `rgb(${c[0]},${c[1]},${c[2]})`);
    }
    pathPoly(ctx2d, petal.poly);
    ctx2d.fillStyle = grad;
    ctx2d.globalAlpha = clamp(p * 2.2);
    ctx2d.fill();
    ctx2d.globalAlpha = 1;

    // 边缘代码字符：随填充固化而消退
    const shimmer = 1 - clamp((p - 0.42) / 0.4);
    if (shimmer > 0.02) {
      const step = Math.max(2, Math.floor(petal.poly.length / 14));
      const spread = Math.min(1.06, 0.55 + grow * 0.5);
      // SVG 空间里的字号要除以 (k * grow)，屏幕上才恒为 ~11px
      ctx2d.font = `${(11 / Math.max(0.001, layout.k * Math.max(0.2, grow))).toFixed(2)}px ui-monospace, "Cascadia Mono", "Consolas", monospace`;
      ctx2d.textAlign = 'center';
      ctx2d.textBaseline = 'middle';
      for (let k2 = 0; k2 < petal.poly.length; k2 += step) {
        const [x0, y0] = petal.poly[k2];
        const ch = CODE[(k2 * 13 + Math.floor(t / 70)) % CODE.length];
        ctx2d.save();
        ctx2d.translate((x0 - petal.cx) * spread + petal.cx, (y0 - petal.cy) * spread + petal.cy);
        ctx2d.rotate(-rot);
        ctx2d.fillStyle = rgba(mix([255, 255, 255], hexToRgb(pal.red), 0.35), 0.85 * shimmer);
        ctx2d.fillText(ch, 0, 0);
        ctx2d.restore();
      }
    }
    ctx2d.restore();
  }

  function drawWord(t) {
    const [t0, t1] = T.word;
    if (t < t0) return;
    const p = clamp((t - t0) / (t1 - t0));
    const e = easeInOut(p);
    const revealX = lerp(WORD_BBOX.x - 2, WORD_BBOX.x + WORD_BBOX.w + 2, e);
    setSvgTransform();
    ctx2d.save();
    ctx2d.beginPath();
    ctx2d.rect(WORD_BBOX.x - 4, WORD_BBOX.y - 6, revealX - WORD_BBOX.x + 4, WORD_BBOX.h + 12);
    ctx2d.clip();
    ctx2d.fillStyle = pal.ink;
    for (const poly of ART.word) { pathPoly(ctx2d, poly); ctx2d.fill(); }
    // 解码前沿：一串随机字符
    if (p < 1) {
      // 解码前沿的字符同样按屏幕像素恒定
      ctx2d.font = `${(12 / layout.k).toFixed(2)}px ui-monospace, "Cascadia Mono", "Consolas", monospace`;
      ctx2d.textAlign = 'center';
      ctx2d.textBaseline = 'middle';
      for (let i = 0; i < 16; i++) {
        const x = revealX - 4 - i * 3.2;
        if (x < WORD_BBOX.x - 4) break;
        const ch = CODE[(i * 11 + Math.floor(t / 45)) % CODE.length];
        ctx2d.fillStyle = rgba(hexToRgb(pal.red), 0.85 * (1 - i / 16));
        ctx2d.fillText(ch, x, WORD_BBOX.y + WORD_BBOX.h / 2 + ((i % 3) - 1) * 2.2);
      }
    }
    ctx2d.restore();
  }

  function drawSweep(t) {
    const [t0, t1] = T.sweep;
    if (t < t0 || t > t1) return;
    const p = clamp((t - t0) / (t1 - t0));
    const e = easeInOut(p);
    setSvgTransform();
    ctx2d.save();
    // 只在标志 + 字标范围内扫过（Path2D 求并集；pathPoly 会重置路径，不能直接复用）
    const clip = new Path2D();
    for (const poly of ART.petals) addPoly(clip, poly);
    for (const poly of ART.word) addPoly(clip, poly);
    ctx2d.clip(clip);
    const bandW = 18;
    const x = lerp(LOCK.x - bandW, LOCK.x + LOCK.w + bandW, e);
    const g = ctx2d.createLinearGradient(x - bandW, LOCK.y, x + bandW, LOCK.y + LOCK.h);
    g.addColorStop(0, 'rgba(255,255,255,0)');
    g.addColorStop(0.42, 'rgba(255,255,255,0.10)');
    g.addColorStop(0.5, 'rgba(255,236,226,0.62)');
    g.addColorStop(0.58, 'rgba(255,255,255,0.10)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx2d.fillStyle = g;
    ctx2d.fillRect(x - bandW, LOCK.y, bandW * 2, LOCK.h);
    ctx2d.restore();
  }

  /** 取十六进制串第 x 位（x 从最低位算起）。逐字符取半字节，避免超出 53 位精度。 */
  function bitAt(hex, x) {
    const idx = hex.length - 1 - (x >> 2);
    if (idx < 0) return 0;
    const nibble = parseInt(hex[idx], 16);
    return (nibble >> (x & 3)) & 1;
  }

  function drawPixelSlogan(size, centerX, topY, targetW, alpha) {
    if (!size || alpha <= 0) return null;
    setCssTransform();
    const bits = size.bits;
    const cols = size.cols * 2;
    const s = Math.min(targetW / cols, 5.2);
    const w = cols * s;
    const x0 = centerX - w / 2;
    ctx2d.fillStyle = rgba(hexToRgb(pal.soft), alpha);
    for (let r = 0; r < bits.length; r++) {
      for (let c = 0; c < cols; c++) {
        if (bitAt(bits[r], c)) ctx2d.fillRect(x0 + c * s, topY + r * s, s - 0.35, s - 0.35);
      }
    }
    return { w, h: bits.length * s };
  }

  function drawSubtitles(t) {
    const [t0] = T.subtitles;
    if (t < t0) return;
    setCssTransform();
    const cx = layout.vw / 2;
    let y = layout.top + layout.lockH + Math.max(18, 26 * Math.min(1.4, layout.k * 1.3));

    // 标语
    const sp = clamp((t - t0) / 420);
    if (sp > 0) {
      const targetW = Math.min(layout.lockW * 0.95, 640);
      if (opts.pixelSlogan) {
        const slogan = ART.slogans && ART.slogans[opts.brand || 'codex'];
        // 高分屏用 6 行位图（笔画更细）；窗口窄到格子小于 1.7px 时退回 4 行。
        const sixCells = targetW / ((slogan && slogan.sizes.find((s) => s.rows === 6)?.cols * 2) || 1);
        const size = pickSloganSize(slogan && slogan.sizes, sixCells >= 1.7 ? 6 : 4);
        const box = drawPixelSlogan(size, cx, y, targetW, Math.min(1, sp * 1.15));
        if (box) y += box.h + 16;
      } else if (strings.slogan) {
        const fs = Math.max(17, Math.min(30, layout.lockW * 0.075));
        ctx2d.font = `300 ${fs}px "Segoe UI", "Microsoft YaHei UI", system-ui, sans-serif`;
        ctx2d.textAlign = 'center';
        ctx2d.textBaseline = 'alphabetic';
        const chars = Array.from(strings.slogan);
        const spacing = fs * 0.16;
        const widths = chars.map((c) => ctx2d.measureText(c).width);
        const total = widths.reduce((a, b) => a + b, 0) + spacing * (chars.length - 1);
        let x = cx - total / 2;
        ctx2d.fillStyle = rgba(hexToRgb(pal.soft), sp * 0.95);
        for (let i = 0; i < chars.length; i++) {
          const ca = clamp((t - t0 - i * 18) / 320);
          if (ca > 0) {
            ctx2d.globalAlpha = ca * 0.95;
            ctx2d.fillText(chars[i], x, y + fs);
          }
          x += widths[i] + spacing;
        }
        ctx2d.globalAlpha = 1;
        y += fs + 16;
      }
    }

    // 副标语（字距拉开的大写英文）
    const tp = clamp((t - t0 - 160) / 300);
    if (tp > 0 && strings.tagline) {
      const fs = Math.max(11, Math.min(13, layout.lockW * 0.028));
      ctx2d.font = `400 ${fs}px "Segoe UI", system-ui, sans-serif`;
      ctx2d.textAlign = 'left';
      ctx2d.textBaseline = 'alphabetic';
      const text = String(strings.tagline).toUpperCase();
      const spacing = fs * 0.42;
      const widths = Array.from(text).map((c) => ctx2d.measureText(c).width);
      const total = widths.reduce((a, b) => a + b, 0) + spacing * (text.length - 1);
      let x = cx - total / 2;
      ctx2d.fillStyle = rgba(hexToRgb(pal.muted), tp * 0.9);
      for (let i = 0; i < text.length; i++) {
        ctx2d.fillText(text[i], x, y);
        x += widths[i] + spacing;
      }
      y += 22;
    }

    // 平台行：——  盘古大模型 · …  ——
    const pp = clamp((t - t0 - 260) / 340);
    if (pp > 0 && strings.platform) {
      const fs = Math.max(11, Math.min(14, layout.lockW * 0.03));
      ctx2d.font = `400 ${fs}px "Segoe UI", "Microsoft YaHei UI", system-ui, sans-serif`;
      ctx2d.textAlign = 'center';
      ctx2d.textBaseline = 'alphabetic';
      const line = strings.platform;
      const w = ctx2d.measureText(line).width;
      ctx2d.fillStyle = rgba(hexToRgb(pal.rule), pp * 0.9);
      ctx2d.fillText('────', cx - w / 2 - 26, y);
      ctx2d.fillText('────', cx + w / 2 + 26, y);
      ctx2d.fillStyle = rgba(hexToRgb(pal.red), pp * 0.92);
      ctx2d.fillText(line, cx, y);
    }
  }

  function drawStatic() {
    // 减少动态：直接画终态
    setSvgTransform();
    ctx2d.fillStyle = pal.ink;
    for (const i of petalGeo.order) {
      const petal = petalGeo.petals[i];
      const gd = ART.gradient;
      const grad = ctx2d.createRadialGradient(gd.cx, gd.cy, 0, gd.cx, gd.cy, gd.r);
      for (const [stop, c] of gd.stops) grad.addColorStop(stop, `rgb(${c[0]},${c[1]},${c[2]})`);
      pathPoly(ctx2d, petal.poly);
      ctx2d.fillStyle = grad;
      ctx2d.fill();
    }
    ctx2d.fillStyle = pal.ink;
    for (const poly of ART.word) { pathPoly(ctx2d, poly); ctx2d.fill(); }
    drawSubtitles(T.subtitles[1]);
  }

  function frame(ts) {
    if (!startTs) startTs = ts;
    const t = ts - startTs;
    render(t);
    if (finished) return;
    if (t >= T.fadeOut[1]) { finish(); return; }
    raf = requestAnimationFrame(frame);
  }

  function render(t) {
    if (!ctx2d) return;
    const dpr = ctx2d.__dpr || 1;
    setCssTransform();
    ctx2d.clearRect(0, 0, layout.vw, layout.vh);
    ctx2d.fillStyle = pal.bg;
    ctx2d.fillRect(0, 0, layout.vw, layout.vh);
    ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);

    drawCursor(t);
    drawParticles(t);
    // 外圈先画、内圈后画（内圈压在上面，接缝更自然）
    const order = petalGeo.order.slice().sort((a, b) => petalGeo.petals[b].rank - petalGeo.petals[a].rank);
    for (const i of order) drawPetal(i, t);
    drawWord(t);
    drawSweep(t);
    drawSubtitles(t);

    // 淡出
    const [f0, f1] = T.fadeOut;
    if (t > f0) {
      const a = clamp((t - f0) / (f1 - f0));
      if (host) host.style.opacity = String(1 - a);
    }
  }

  // ---- 覆盖层与控件 ----
  function buildHost() {
    host = document.createElement('div');
    host.setAttribute('data-pangu-intro', '');
    Object.assign(host.style, {
      position: 'fixed', inset: '0', zIndex: '2147483000',
      background: pal.bg, opacity: '1', transition: 'none',
      display: 'block', pointerEvents: 'auto',
    });
    canvas = document.createElement('canvas');
    Object.assign(canvas.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', display: 'block' });
    host.appendChild(canvas);
    ctx2d = canvas.getContext('2d');

    // 底部右侧：跳过 / 不再自动播放
    controls = document.createElement('div');
    Object.assign(controls.style, {
      position: 'absolute', right: '20px', bottom: '18px', display: 'flex', gap: '8px',
      alignItems: 'center', font: '12px/1.4 "Segoe UI", "Microsoft YaHei UI", system-ui, sans-serif',
      color: pal.muted, opacity: '0', transition: 'opacity .35s ease',
    });
    const mkBtn = (label) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = label;
      Object.assign(b.style, {
        appearance: 'none', border: `1px solid ${pal.chipLine}`, background: 'transparent',
        color: pal.chipText, font: 'inherit', padding: '5px 10px', borderRadius: '6px',
        cursor: 'pointer', opacity: '0.85', transition: 'background .15s ease, opacity .15s ease',
      });
      b.addEventListener('mouseenter', () => { b.style.background = pal.hover; b.style.opacity = '1'; });
      b.addEventListener('mouseleave', () => { b.style.background = 'transparent'; b.style.opacity = '0.85'; });
      return b;
    };
    const skipBtn = mkBtn('跳过');
    const neverBtn = mkBtn('不再自动播放');
    skipBtn.addEventListener('click', (e) => { e.stopPropagation(); requestSkip(); });
    neverBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      try { await opts.onDisable?.(); } catch { /* 忽略 */ }
      requestSkip();
    });
    controls.appendChild(skipBtn);
    controls.appendChild(neverBtn);
    host.appendChild(controls);

    host.addEventListener('dblclick', requestSkip);
    requestAnimationFrame(() => { if (controls) controls.style.opacity = '1'; });
  }

  function onKey(ev) {
    if (ev.key === 'Escape' || ev.key === ' ' || ev.key === 'Enter') {
      ev.preventDefault();
      ev.stopPropagation();
      requestSkip();
    }
  }

  function requestSkip() {
    if (finished || skipRequested) return;
    skipRequested = true;
    if (isReduced()) { finish(); return; }
    // 立刻进入淡出
    const now = performance.now();
    const t = Math.max(now - startTs, 0);
    if (t >= T.fadeOut[0]) { finish(); return; }
    cancelAnimationFrame(raf);
    const from = t;
    const dur = 260;
    const tick = (ts) => {
      const p = clamp((ts - now) / dur);
      render(from + p * (T.fadeOut[0] - from) + p * 0.001);
      if (host) host.style.opacity = String(1 - p);
      if (p < 1) requestAnimationFrame(tick); else finish();
    };
    requestAnimationFrame(tick);
  }

  function finish() {
    if (finished) return;
    finished = true;
    cancelAnimationFrame(raf);
    window.removeEventListener('keydown', onKey, true);
    if (host) {
      host.style.transition = 'opacity .18s ease';
      host.style.opacity = '0';
      const el = host;
      setTimeout(() => { try { el.remove(); } catch { /* 已移除 */ } }, 200);
    }
    try { opts.onDone?.(); } catch { /* 宿主回调异常不影响收尾 */ }
  }

  function resize() {
    if (!host || !ctx2d) return;
    layout = computeLayout();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    ctx2d.__dpr = dpr;
    canvas.width = Math.round(layout.vw * dpr);
    canvas.height = Math.round(layout.vh * dpr);
    canvas.style.width = `${layout.vw}px`;
    canvas.style.height = `${layout.vh}px`;
  }

  return {
    /** 挂载并开始播放。传 reduced=true 时只画终态。 */
    start() {
      if (host) return;
      buildHost();
      document.body.appendChild(host);
      resize();
      window.addEventListener('resize', resize);
      window.addEventListener('keydown', onKey, true);
      if (isReduced()) {
        render(T.subtitles[1]);
        setTimeout(finish, 900);
        return;
      }
      raf = requestAnimationFrame(frame);
    },
    skip: requestSkip,
    /** 预览/测试：按毫秒静态渲染一帧（不启动 rAF）。 */
    renderAt(t) {
      if (!host) {
        buildHost();
        document.body.appendChild(host);
        resize();
      }
      render(t);
    },
    destroy() {
      finished = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', onKey, true);
      if (host) host.remove();
      host = null;
    },
    get el() { return host; },
  };
}

if (typeof window !== 'undefined') window.createPangu = createPangu;
