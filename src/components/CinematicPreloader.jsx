import React, { useEffect, useRef, useState } from "react";

const TAU = Math.PI * 2;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
const easeIO = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const rnd = (a, b) => a + Math.random() * (b - a);
const mk = (w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; };

/* Бездивергентное curl-поле для физики закручивания дыма */
const psi = (x, y, t) =>
  Math.sin(x * 2.3 + t * 0.55 + Math.sin(y * 1.6 - t * 0.3) * 1.4) * Math.cos(y * 2.0 - t * 0.42) +
  0.55 * Math.sin(x * 4.6 - t * 0.8 + 1.3) * Math.sin(y * 3.7 + t * 0.6);
const flow = (x, y, t, o) => {
  const e = 0.01;
  o.x = (psi(x, y + e, t) - psi(x, y - e, t)) / (2 * e);
  o.y = -(psi(x + e, y, t) - psi(x - e, y, t)) / (2 * e);
};

/* Спрайты дыма и теплого тления в темной гамме */
function buildSprites() {
  const createSmokeSprite = (rgb, baseAlpha = 0.22) => {
    const S = 256, c = mk(S, S), g = c.getContext("2d");
    for (let i = 0; i < 20; i++) {
      const r = rnd(36, 76), ang = rnd(0, TAU), d = rnd(0, 115 - r) * 0.9;
      const x = S / 2 + Math.cos(ang) * d, y = S / 2 + Math.sin(ang) * d;
      const gr = g.createRadialGradient(x, y, 0, x, y, r);
      gr.addColorStop(0, `rgba(${rgb},${baseAlpha})`);
      gr.addColorStop(0.5, `rgba(${rgb},${baseAlpha * 0.45})`);
      gr.addColorStop(1, `rgba(${rgb},0)`);
      g.fillStyle = gr; g.fillRect(0, 0, S, S);
    }
    return c;
  };

  // Мягкое тлеющее микро-свечение для единичных угольков
  const emberGlow = mk(64, 64), eg = emberGlow.getContext("2d");
  const egr = eg.createRadialGradient(32, 32, 0, 32, 32, 32);
  egr.addColorStop(0, "rgba(245,158,11,0.85)");
  egr.addColorStop(0.25, "rgba(180,83,9,0.35)");
  egr.addColorStop(1, "rgba(20,10,5,0)");
  eg.fillStyle = egr; eg.fillRect(0, 0, 64, 64);

  // Мягкий рассеянный луч света
  const beam = mk(64, 512), bg = beam.getContext("2d");
  const bh = bg.createLinearGradient(0, 0, 64, 0);
  for (let i = 0; i <= 10; i++) bh.addColorStop(i / 10, `rgba(180,100,30,${(0.4 * Math.exp(-(((i / 10 - 0.5) / 0.2) ** 2))).toFixed(3)})`);
  bg.fillStyle = bh; bg.fillRect(0, 0, 64, 512);
  bg.globalCompositeOperation = "destination-in";
  const bv = bg.createLinearGradient(0, 0, 0, 512);
  bv.addColorStop(0, "rgba(0,0,0,0)"); bv.addColorStop(0.5, "rgba(0,0,0,0.25)"); bv.addColorStop(1, "rgba(0,0,0,0.8)");
  bg.fillStyle = bv; bg.fillRect(0, 0, 64, 512);

  const noise = mk(160, 160), ng = noise.getContext("2d"), id = ng.createImageData(160, 160);
  for (let i = 0; i < id.data.length; i += 4) {
    const v = 128 + (Math.random() + Math.random() + Math.random() - 1.5) * 80;
    id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255;
  }
  ng.putImageData(id, 0, 0);

  return { 
    smokeDark: createSmokeSprite("12,9,8", 0.40),       // Бархатный угольно-трюфельный дым
    smokeAmber: createSmokeSprite("130,70,20", 0.22),   // Теплый коньячный отблеск
    smokeHaze: createSmokeSprite("26,20,18", 0.32),     // Плотная сизая завеса
    emberGlow, 
    beam, 
    noise 
  };
}

/* Отрисовка клоша */
const domePath = (c, a, H, ry) => {
  c.beginPath();
  for (let i = 0; i <= 72; i++) {
    const th = Math.PI - (i / 72) * Math.PI, co = Math.cos(th), si = Math.sin(th);
    const x = a * Math.sign(co) * Math.abs(co) ** 0.8, y = -H * Math.abs(si) ** 0.8;
    i ? c.lineTo(x, y) : c.moveTo(x, y);
  }
  c.ellipse(0, 0, a, ry, 0, 0, Math.PI);
  c.closePath();
};
const arcPath = (c, a, H, s, t0, t1) => {
  c.beginPath();
  for (let i = 0; i <= 28; i++) {
    const th = t0 + ((t1 - t0) * i) / 28, co = Math.cos(th), si = Math.sin(th);
    const x = a * s * Math.sign(co) * Math.abs(co) ** 0.8, y = -H * s * Math.abs(si) ** 0.8;
    i ? c.lineTo(x, y) : c.moveTo(x, y);
  }
};

function drawCloche(c, a, H, ry, lift, glow) {
  c.save();
  c.translate(0, -lift);

  const body = c.createLinearGradient(-a, 0, a, 0);
  [[0, "#0e0802"], [0.06, "#382306"], [0.18, "#7a5312"], [0.28, "#c4983b"], [0.34, "#e0b85c"], [0.42, "#b58428"],
   [0.58, "#7a5312"], [0.78, "#422807"], [0.9, "#825a1b"], [0.96, "#472c08"], [1, "#120a02"]].forEach(([o, col]) => body.addColorStop(o, col));
  domePath(c, a, H, ry); c.fillStyle = body; c.fill();

  c.save();
  domePath(c, a, H, ry); c.clip();
  const v = c.createLinearGradient(0, -H, 0, ry);
  v.addColorStop(0, "rgba(220,170,90,0.18)"); v.addColorStop(0.32, "rgba(180,120,40,0)");
  v.addColorStop(0.72, "rgba(25,10,0,0.35)"); v.addColorStop(1, "rgba(0,0,0,0.75)");
  c.fillStyle = v; c.fillRect(-a, -H - 4, a * 2, H + ry + 8);
  
  // Теплый рассеянный свет из-под кромки
  const ug = c.createRadialGradient(0, ry * 0.5, 0, 0, ry * 0.5, a * 1.15);
  ug.addColorStop(0, `rgba(217,119,6,${0.5 * glow})`); 
  ug.addColorStop(0.4, `rgba(146,64,14,${0.25 * glow})`); 
  ug.addColorStop(1, "rgba(20,10,5,0)");
  c.fillStyle = ug; c.fillRect(-a, -H - 4, a * 2, H + ry + 8);
  c.restore();

  domePath(c, a, H, ry);
  c.lineWidth = Math.max(1, a * 0.006); c.strokeStyle = "rgba(217,119,6,0.22)"; c.stroke();

  // Деликатный блик на куполе
  c.save();
  c.globalCompositeOperation = "lighter"; c.lineCap = "round";
  arcPath(c, a, H, 0.9, 2.62, 1.92);
  c.strokeStyle = "rgba(245,158,11,0.45)"; c.lineWidth = a * 0.011; c.stroke();
  c.restore();

  // Нижняя кромка
  const lip = c.createLinearGradient(-a, 0, a, 0);
  [[0, "#2b1904"], [0.25, "#8c651e"], [0.35, "#c49a3c"], [0.5, "#966c1e"], [0.8, "#57370a"], [1, "#2b1904"]].forEach(([o, col]) => lip.addColorStop(o, col));
  c.beginPath(); c.ellipse(0, 0, a, ry, 0, 0, Math.PI);
  c.lineWidth = a * 0.026; c.strokeStyle = lip; c.stroke();

  // Ручка-шар
  const kr = a * 0.085, ky = -H - kr * 1.25;
  const col = c.createRadialGradient(0, -H, 0, 0, -H, a * 0.13);
  col.addColorStop(0, "#5a360a"); col.addColorStop(1, "#180d05");
  c.fillStyle = col; c.beginPath(); c.ellipse(0, -H + a * 0.004, a * 0.12, a * 0.03, 0, 0, TAU); c.fill();
  const neck = c.createLinearGradient(-a * 0.04, 0, a * 0.04, 0);
  neck.addColorStop(0, "#331f04"); neck.addColorStop(0.4, "#ab8028"); neck.addColorStop(1, "#422806");
  c.fillStyle = neck; c.beginPath();
  c.moveTo(-a * 0.045, -H); c.lineTo(-a * 0.026, ky + kr * 0.5); c.lineTo(a * 0.026, ky + kr * 0.5); c.lineTo(a * 0.045, -H); c.closePath(); c.fill();
  const ball = c.createRadialGradient(-kr * 0.35, ky - kr * 0.4, kr * 0.05, 0, ky, kr * 1.1);
  [[0, "#e8be66"], [0.28, "#ab7c20"], [0.65, "#613e09"], [1, "#180c02"]].forEach(([o, cc]) => ball.addColorStop(o, cc));
  c.fillStyle = ball; c.beginPath(); c.arc(0, ky, kr, 0, TAU); c.fill();

  c.restore();
}

const T_END = 8.6;

export default function CinematicPreloader({ children, onComplete, duration = 8600 }) {
  const [done, setDone] = useState(false);
  const siteRef = useRef(null);
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const cbRef = useRef(onComplete);
  const durRef = useRef(duration);
  cbRef.current = onComplete;
  durRef.current = duration;

  useEffect(() => { if (done && cbRef.current) cbRef.current(); }, [done]);

  const handleSkip = (e) => {
    e?.stopPropagation();
    if (siteRef.current) {
      siteRef.current.style.transform = "";
      siteRef.current.style.filter = "";
      siteRef.current.style.willChange = "";
    }
    document.body.style.overflow = "";
    setDone(true);
  };

  useEffect(() => {
    const wrap = wrapRef.current, canvas = canvasRef.current, site = siteRef.current;
    if (!wrap || !canvas || !site) return;
    const ctx = canvas.getContext("2d");
    const spr = buildSprites();
    const reduce = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const L = {};
    const slatePat = ctx.createPattern(spr.noise, "repeat");
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    site.style.willChange = "transform, opacity";

    const resize = () => {
      const r = wrap.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(2, Math.round(r.width * dpr)), h = Math.max(2, Math.round(r.height * dpr));
      canvas.width = w; canvas.height = h;
      const Wc = Math.min(w * 0.52, h * 0.52, 600 * dpr);
      Object.assign(L, { w, h, dpr, cx: w / 2, gy: h * 0.64, Wc, a: Wc / 2, H: Wc * 0.48, ry: (Wc / 2) * 0.13 });
      L.q = clamp((w * h) / (dpr * dpr) / (1920 * 1080), 0.5, 1) * (reduce ? 0.5 : 1);
      
      const vg = ctx.createRadialGradient(w / 2, h * 0.55, Math.min(w, h) * 0.22, w / 2, h * 0.55, Math.hypot(w, h) * 0.6);
      vg.addColorStop(0, "rgba(6,5,5,0)"); 
      vg.addColorStop(1, "rgba(6,5,5,0.96)");
      L.vig = vg;
    };
    resize();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    ro && ro.observe(wrap);
    window.addEventListener("resize", resize);

    /* Пулы частиц дыма и мягких тлеющих угольков */
    const smokes = [], embers = [], fv = { x: 0, y: 0 }, P = { x: 0, y: 0 };
    const acc = { smoke: 0, ember: 0 };
    let curGap = 0, curZs = 1;

    const spawnSmoke = () => {
      const sx = Math.random() + Math.random() - 1;
      const typeRoll = Math.random();
      const img = typeRoll < 0.55 ? spr.smokeDark : typeRoll < 0.85 ? spr.smokeHaze : spr.smokeAmber;
      smokes.push({
        x: L.cx + sx * L.a * 0.85 * curZs, 
        y: L.gy - curGap * 0.45 + rnd(-L.ry * 0.2, L.ry * 0.9) * curZs,
        vx: sx * L.Wc * rnd(0.06, 0.18), 
        vy: -L.Wc * rnd(0.03, 0.10), 
        rise: rnd(0.12, 0.30),
        rot: rnd(0, TAU), 
        rv: rnd(-0.20, 0.20), 
        age: 0, 
        life: rnd(2.6, 4.0),
        s0: L.Wc * rnd(0.24, 0.36), 
        s1: L.Wc * rnd(0.70, 1.25), 
        a: rnd(0.20, 0.42),
        seed: rnd(0, 100), 
        img
      });
    };

    const spawnEmber = () => {
      const sx = rnd(-1, 1) * 0.75;
      embers.push({
        x: L.cx + sx * L.a * curZs, 
        y: L.gy - curGap * 0.35 + rnd(-L.ry * 0.2, L.ry * 0.6) * curZs,
        vx: sx * L.Wc * rnd(0.05, 0.15) + rnd(-0.08, 0.08) * L.Wc, 
        vy: -L.Wc * rnd(0.12, 0.35),
        sz: rnd(1.2, 3.2) * L.dpr, 
        age: 0, 
        life: rnd(1.8, 3.2), 
        ph: rnd(0, TAU), 
        seed: rnd(0, 100)
      });
    };

    let raf = 0, start = null, last = 0, dead = false;

    const frame = (now) => {
      if (dead) return;
      if (start === null) { start = last = now; }
      const el = (now - start) / 1000, dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const D = durRef.current / 1000, tt = el * (T_END / D);
      const { w, h, cx, gy, Wc, a, H, ry } = L;

      const m = smooth(0, 0.7, tt);
      const p1 = easeIO(clamp((tt - 0.45) / 1.85));
      const rise = easeIO(clamp((tt - 2.3) / 2.1));
      const lift = p1 * H * 0.17 + rise * H * 3.4;
      const gap = Math.min(lift, H * 0.17);
      const open = smooth(2.5, 4.2, tt);
      
      // Благородный, медленный dolly-in (максимум в 1.65 раза, без взрывного расширения)
      const e = easeIO(clamp((tt - 3.0) / 3.4));
      const Z = Math.exp(Math.log(1.65) * e);
      const roll = reduce ? 0 : 0.03 * e;
      const Fx = cx, Fy = (gy - H * 0.45) + ((gy - ry * 0.3) - (gy - H * 0.45)) * e;
      
      const flick = 0.94 + 0.04 * Math.sin(el * 9.2) + 0.02 * Math.sin(el * 18.1);
      const gl = smooth(0.04, 0.6, p1) * flick * (1 + 0.3 * open);
      const glc = Math.min(gl, 1.0);
      
      // Усиленная эмиссия клубящегося дыма
      const emit = smooth(0.1, 0.5, p1) * (1 - smooth(5.8, 7.2, tt));
      curGap = gap; curZs = 1 / Math.pow(Z, 0.6);

      const cams = (d) => { const s = Math.pow(Z, d), an = roll * d; return { s, an, c: Math.cos(an) * s, sn: Math.sin(an) * s }; };
      const useCam = (cm) => ctx.setTransform(cm.c, cm.sn, -cm.sn, cm.c, Fx - cm.c * Fx + cm.sn * Fy, Fy - cm.sn * Fx - cm.c * Fy);
      const proj = (cm, x, y) => { P.x = Fx + cm.c * (x - Fx) - cm.sn * (y - Fy); P.y = Fy + cm.sn * (x - Fx) + cm.c * (y - Fy); };
      const c1 = cams(1);

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";

      // Темный фон строго под цвет сайта
      ctx.fillStyle = "#060505"; 
      ctx.fillRect(0, 0, w, h);

      /* 1 ─ Приглушенное световое пятно на плите */
      const R = Wc * 1.8;
      ctx.save(); useCam(c1);
      ctx.save();
      ctx.translate(cx, gy + ry * 0.5); ctx.scale(1, 0.2);
      const pool = ctx.createRadialGradient(0, 0, 0, 0, 0, R);
      pool.addColorStop(0, `rgba(180,83,9,${0.35 * gl * m})`); 
      pool.addColorStop(0.3, `rgba(120,53,15,${0.18 * gl * m})`); 
      pool.addColorStop(1, "rgba(6,5,5,0)");
      ctx.globalCompositeOperation = "lighter"; ctx.fillStyle = pool; ctx.fillRect(-R, -R, R * 2, R * 2);
      ctx.restore();
      if (gl > 0.01 && Z < 3) {
        ctx.save();
        ctx.beginPath(); ctx.ellipse(cx, gy + ry * 0.5, R, R * 0.2, 0, 0, TAU); ctx.clip();
        ctx.globalCompositeOperation = "overlay"; ctx.globalAlpha = 0.45;
        ctx.scale(2.2, 2.2); ctx.fillStyle = slatePat;
        ctx.fillRect((cx - R) / 2.2, (gy - R * 0.2) / 2.2, (R * 2) / 2.2, (R * 0.5) / 2.2);
        ctx.restore();
      }
      ctx.restore();

      /* 2 ─ Отражение клоша в полумраке плиты */
      if (m > 0.01 && lift < H * 2.2) {
        ctx.save(); useCam(cams(1.2));
        ctx.beginPath(); ctx.rect(-w, gy, w * 3, h * 3); ctx.clip();
        ctx.globalAlpha = 0.12 * m * (0.5 + 0.5 * glc);
        ctx.translate(cx, gy); ctx.scale(1, -0.3);
        drawCloche(ctx, a, H, ry, lift, glc);
        ctx.restore();
      }

      /* 3 ─ Смягченные лучи сквозь дым */
      if (gl > 0.01) {
        ctx.save(); useCam(c1);
        ctx.globalCompositeOperation = "screen";
        for (let s = -1; s <= 1; s += 2) {
          for (let i = 0; i < 4; i++) {
            const ang = s * (0.26 + i * 0.2 + Math.sin(el * 0.4 + i) * 0.03);
            const len = Wc * (0.9 + 0.25 * ((i * 5) % 3)), wd = Wc * (0.24 + 0.05 * i);
            ctx.save();
            ctx.translate(cx + s * a * 0.8, gy - gap * 0.4); ctx.rotate(ang);
            ctx.globalAlpha = clamp(gl * m * 0.14 * (0.6 + 0.4 * Math.sin(el * 1.2 + i * 1.7 + s)), 0, 1);
            ctx.drawImage(spr.beam, -wd / 2, -len, wd, len);
            ctx.restore();
          }
        }
        ctx.restore();
      }

      /* 4 ─ Тень и теплое свечение под клошем (без слепящего белого пятна) */
      ctx.save(); useCam(c1);
      ctx.translate(cx, gy); ctx.scale(1, ry / a);
      if (open < 0.99) {
        ctx.globalAlpha = m * (1 - open);
        const sh = ctx.createRadialGradient(0, 0, 0, 0, 0, a * 1.12);
        sh.addColorStop(0, "rgba(0,0,0,0.92)"); sh.addColorStop(0.8, "rgba(0,0,0,0.75)"); sh.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = sh; ctx.beginPath(); ctx.arc(0, 0, a * 1.12, 0, TAU); ctx.fill();
      }
      if (gl > 0.01) {
        ctx.globalAlpha = 1; ctx.globalCompositeOperation = "screen";
        const er = a * (1 + 0.25 * open);
        const em = ctx.createRadialGradient(0, 0, 0, 0, 0, er);
        em.addColorStop(0, `rgba(217,119,6,${0.65 * gl})`); 
        em.addColorStop(0.45, `rgba(146,64,14,${0.35 * gl})`); 
        em.addColorStop(1, "rgba(20,10,5,0)");
        ctx.fillStyle = em; ctx.beginPath(); ctx.arc(0, 0, er, 0, TAU); ctx.fill();
      }
      ctx.restore();

      /* 5 ─ Клош */
      if (lift < H * 3.3) {
        ctx.save(); useCam(cams(1.2));
        ctx.translate(cx, gy); ctx.rotate(smooth(2.6, 4.4, tt) * 0.06);
        ctx.globalAlpha = m * (0.6 + 0.4 * smooth(0, 0.6, p1));
        drawCloche(ctx, a, H, ry, lift, glc);
        ctx.restore();
      }

      /* 6 ─ Генерация клубов дыма */
      const q = L.q;
      acc.smoke += 36 * q * emit * dt; 
      acc.ember += 14 * q * emit * dt;
      while (acc.smoke >= 1) { acc.smoke--; if (smokes.length < 90 * q + 15) spawnSmoke(); }
      while (acc.ember >= 1) { acc.ember--; if (embers.length < 40 * q) spawnEmber(); }

      /* 7 ─ Отрисовка дыма (глубокие темные слои) */
      const cs = cams(1.1), maxSz = Math.max(w, h) * 2.2;
      ctx.globalCompositeOperation = "source-over"; // Дым плотный, физичный, затеняющий сцену
      for (let i = smokes.length - 1; i >= 0; i--) {
        const s = smokes[i];
        s.age += dt;
        if (s.age >= s.life) { smokes[i] = smokes[smokes.length - 1]; smokes.pop(); continue; }
        flow(s.x / Wc, s.y / Wc, el + s.seed, fv);
        const k = 1 - Math.exp(-dt * 1.1);
        s.vx += (fv.x * Wc * 0.05 - s.vx) * k; 
        s.vy += (fv.y * Wc * 0.05 - Wc * s.rise - s.vy) * k;
        s.x += s.vx * dt; s.y += s.vy * dt; s.rot += s.rv * dt;
        const u = s.age / s.life, sz = (s.s0 + (s.s1 - s.s0) * Math.sqrt(u)) * cs.s;
        proj(cs, s.x, s.y);
        const hs = sz / 2;
        if (sz > maxSz || P.x + hs < 0 || P.x - hs > w || P.y + hs < 0 || P.y - hs > h) continue;
        
        ctx.globalAlpha = clamp(Math.pow(Math.sin(Math.PI * u), 1.2) * s.a * m, 0, 0.85);
        const an = s.rot + cs.an, cr = Math.cos(an), sr = Math.sin(an);
        ctx.setTransform(cr, sr, -sr, cr, P.x, P.y);
        ctx.drawImage(s.img, -hs, -hs, sz, sz);
      }
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      /* 8 ─ Редкие мягкие тлеющие угольки вместо агрессивных искр */
      const ce = cams(1.3);
      ctx.globalCompositeOperation = "screen";
      for (let i = embers.length - 1; i >= 0; i--) {
        const emb = embers[i];
        emb.age += dt;
        if (emb.age >= emb.life) { embers[i] = embers[embers.length - 1]; embers.pop(); continue; }
        flow(emb.x / Wc, emb.y / Wc, el * 0.8 + emb.seed, fv);
        const k = 1 - Math.exp(-dt * 1.3);
        emb.vx += (fv.x * Wc * 0.04 - emb.vx) * k; 
        emb.vy += (fv.y * Wc * 0.04 - Wc * 0.08 - emb.vy) * k;
        emb.x += emb.vx * dt; emb.y += emb.vy * dt;
        proj(ce, emb.x, emb.y);
        const sz = emb.sz * ce.s, hs = sz / 2;
        if (sz > w || P.x + hs < 0 || P.x - hs > w || P.y + hs < 0 || P.y - hs > h) continue;
        const u = emb.age / emb.life;
        ctx.globalAlpha = clamp(Math.sin(Math.PI * u) * 0.45 * (0.7 + 0.3 * Math.sin(emb.age * 5 + emb.ph)) * m, 0, 1);
        ctx.drawImage(spr.emberGlow, P.x - hs, P.y - hs, sz, sz);
      }

      /* 9 ─ Глубокая кино-виньетка по краям */
      ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
      ctx.fillStyle = L.vig; ctx.fillRect(0, 0, w, h);

      /* Пленочное зерно */
      ctx.save();
      ctx.globalCompositeOperation = "overlay"; ctx.globalAlpha = 0.12;
      ctx.translate((Math.random() * 160) | 0, (Math.random() * 160) | 0);
      ctx.fillStyle = slatePat; ctx.fillRect(-160, -160, w + 160, h + 160);
      ctx.restore();

      /* 10 ─ ФИНАЛ: Мягкое бесшовное растворение дыма в темный сайт (Smooth Dissolve) */
      const dissolveStart = 5.8;
      const dissolveDuration = 2.4;
      const fadeProgress = clamp((tt - dissolveStart) / dissolveDuration);

      if (fadeProgress > 0) {
        const easeFade = easeIO(fadeProgress);
        // Плавно уменьшаем непрозрачность оверлея
        wrap.style.opacity = `${1 - easeFade}`;
        // Сайт плавно встает в свой естественный масштаб
        site.style.transform = `scale(${1.03 - 0.03 * easeFade})`;
      } else {
        wrap.style.opacity = "1";
        site.style.transform = "scale(1.03)";
      }

      if (el >= D) {
        dead = true;
        site.style.transform = ""; 
        site.style.willChange = ""; 
        document.body.style.overflow = prevOverflow;
        setDone(true);
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => {
      dead = true;
      cancelAnimationFrame(raf);
      ro && ro.disconnect();
      window.removeEventListener("resize", resize);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  return (
    <>
      <div 
        ref={siteRef} 
        aria-hidden={!done}
        className="w-full h-full"
      >
        {children}
      </div>

      {!done && (
        <div
          ref={wrapRef}
          role="status"
          aria-label="Loading"
          style={{ 
            position: "fixed", 
            inset: 0, 
            zIndex: 9999, 
            overflow: "hidden", 
            background: "#060505",
            transition: "opacity 0.2s ease-out"
          }}
        >
          <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
          
          <button
            type="button"
            onClick={handleSkip}
            className="cursor-pointer absolute top-6 right-6 z-50 px-3.5 py-1.5 rounded-full bg-[#0d0a08]/70 hover:bg-[#1c140e] border border-amber-900/40 hover:border-amber-500/50 text-[10px] tracking-[0.25em] uppercase font-sans font-bold text-amber-200/60 hover:text-amber-100 backdrop-blur-md transition-all active:scale-95 shadow-xl"
          >
            Skip ✕
          </button>
        </div>
      )}
    </>
  );
}