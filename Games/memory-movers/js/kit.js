/* Memory Movers | js/kit.js
   Palette hooks, asset loading, sound, element factory and tweens.
   Coordinates are centre-based on the 1130 x 502 stage, y goes UP. */
"use strict";
// Assets: loaded from assets/ normally; dist/index.html carries them inline (window.MM_ASSETS).
const SPR = new Proxy({}, { get: (_, n) => (window.MM_ASSETS && window.MM_ASSETS.images[n]) || `assets/images/${String(n)}.png` });
const SFX = new Proxy({}, { get: (_, n) => (window.MM_ASSETS && window.MM_ASSETS.audio[n]) || `assets/audio/${String(n)}.wav` });
const { LEVELS, DESK_CARDS, POWER_CUT_SECONDS, UNITS, SIZE_ITEMS, PACK_ROUNDS, DEVICES,
        BELT_START, BELT_MIN, BELT_SPEEDUP, RECAP } = window.MM_CONTENT;

// ------------------------------------------------------------------ palette
// Every colour lives in css/style.css (:root). JS only refers to the variables.
const C = { kraft:"var(--kraft)", teal:"var(--teal)", tealD:"var(--teal-d)", tealL:"var(--teal-l)", tape:"var(--tape)",
  ink:"var(--ink)", ram:"var(--ram)", sky:"var(--sky)", green:"var(--green)", greenL:"var(--green-l)", red:"var(--red)",
  redL:"var(--red-l)", white:"var(--white)", muted:"var(--muted)",
  onDark:"var(--text-on-dark)", onDarkSoft:"var(--text-on-dark-soft)", slotBg:"var(--slot-bg)", slotNum:"var(--slot-num)",
  barBg:"var(--bar-bg)", backdrop:"var(--backdrop)", blackout:"var(--blackout)", recapBg:"var(--recap-bg)" };
const SEG = [1,2,3,4,5,6,7].map(n => `var(--seg-${n})`);

// ------------------------------------------------------------------ audio
let muted = false;
const audioCache = {};
function sfx(name) {
  if (muted) return;
  try {
    let a = audioCache[name];
    if (!a || !a.paused) { a = new Audio(SFX[name]); audioCache[name] = a; }
    a.currentTime = 0; a.play().catch(()=>{});
  } catch (e) {}
}

// ------------------------------------------------------------------ UI kit (mirrors UIKit.cs)
const stage = document.getElementById("stage");
stage._w = 1130; stage._h = 502;
function place(el, x, y, w, h) {
  el._x = x; el._y = y; el._w = w; el._h = h;
  const p = el.parentNode || el._parent;
  el.style.left = (p._w / 2 + x - w / 2) + "px";
  el.style.top = (p._h / 2 - y - h / 2) + "px";
  el.style.width = w + "px"; el.style.height = h + "px";
}
function box(parent, x, y, w, h, cls = "") {
  const d = document.createElement("div");
  d.className = "abs " + cls; parent.appendChild(d); place(d, x, y, w, h); return d;
}
function stretch(parent) { return box(parent, 0, 0, parent._w, parent._h); }
function img(parent, name, x, y, w, h) {
  const i = document.createElement("img");
  i.className = "abs img"; i.alt = ""; i.draggable = false;
  if (name) i.src = SPR[name];
  parent.appendChild(i); place(i, x, y, w, h); return i;
}
function txt(parent, text, x, y, w, h, size, color, align = "center", bold = true) {
  const d = box(parent, x, y, w, h, "txt " + (align === "center" ? "" : align));
  d.style.fontSize = size + "px"; d.style.color = color; d.style.fontWeight = bold ? 800 : 500;
  d.textContent = text; return d;
}
function panel(parent, x, y, w, h, color, cls = "") { const d = box(parent, x, y, w, h, "panel " + cls); d.style.background = color; return d; }
function clickable(el, fn, sound = false) {
  el.classList.add("tap"); el.setAttribute("role", "button"); el.tabIndex = 0;
  el.style.pointerEvents = "auto";
  const go = (e) => { e.preventDefault(); if (sound) sfx("click"); fn(); };
  el.addEventListener("pointerdown", go);
  el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") go(e); });
  return el;
}
function btn(parent, x, y, w, h, color, label, size, fn, labelColor = C.white) {
  const b = panel(parent, x, y, w, h, color, "btn");
  if (label) { txt(b, label, 0, 0, w - 16, h - 6, size, labelColor); b.setAttribute("aria-label", label); }
  clickable(b, fn, true); return b;
}
function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); }
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

// ------------------------------------------------------------------ tweens (cancelled by epoch on level change)
let epoch = 0;
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const easeOut = k => 1 - Math.pow(1 - k, 3);
const easeBack = k => { const c = 1.7; k -= 1; return 1 + (c + 1) * k * k * k + c * k * k; };
function tween(dur, step, done) {
  const my = epoch, t0 = performance.now(); if (reduced) dur = Math.min(dur, 0.12);
  function f(now) {
    if (my !== epoch) return;
    const k = Math.min(1, (now - t0) / (dur * 1000)); step(k);
    if (k < 1) requestAnimationFrame(f); else if (done) done();
  }
  requestAnimationFrame(f);
}
function delay(sec, fn) { const my = epoch; setTimeout(() => { if (my === epoch) fn(); }, sec * 1000); }
function move(el, x, y, dur, done) {
  const fx = el._x, fy = el._y;
  tween(dur, k => { const e = easeOut(k); place(el, fx + (x - fx) * e, fy + (y - fy) * e, el._w, el._h); }, done);
}
function scaleT(el, from, to, dur, back = true, done) {
  tween(dur, k => { const s = from + (to - from) * (back ? easeBack(k) : easeOut(k)); el.style.transform = `scale(${s})`; el._s = s; }, done);
}
function fade(el, to, dur, done) {
  const from = parseFloat(el.style.opacity || 1);
  tween(dur, k => el.style.opacity = from + (to - from) * k, done);
}
function shake(el) {
  const hx = el._x, hy = el._y;
  tween(0.35, k => place(el, hx + Math.sin(k * 0.35 * 60) * 10 * (1 - k), hy, el._w, el._h), () => place(el, hx, hy, el._w, el._h));
}

