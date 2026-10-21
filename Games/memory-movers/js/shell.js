/* Memory Movers | js/shell.js
   Layers, game state, HUD, feedback toast, screen flow and the four full-screen panels. */
"use strict";
// ------------------------------------------------------------------ layers
const bg = img(stage, "bg_game", 0, 0, 1130, 502); bg.classList.add("bg");
const levelLayer = stretch(stage); levelLayer.classList.add("level-layer");
const hud = box(stage, 0, 225, 1130, 52, "hud");
const toastLayer = stretch(stage); toastLayer.classList.add("toast-layer");
const screenLayer = stretch(stage); screenLayer.classList.add("screen-layer");

// ------------------------------------------------------------------ state (mirrors GameManager)
const G = { level: -1, stars: [0, 0, 0, 0] };
let activeLevel = null;

// ------------------------------------------------------------------ HUD
let hudTitle, hudDots = [], muteIcon;
(function buildHud() {
  const back = btn(hud, -537, 0, 44, 40, C.tealD, null, 0, goBack); back.setAttribute("aria-label", "Back");
  img(back, "icon_back", 0, 0, 26, 26);
  hudTitle = txt(hud, "", -260, 0, 500, 44, 24, C.white, "left");
  txt(hud, "Levels", 262, 0, 100, 40, 16, C.onDarkSoft, "right", false);
  for (let i = 0; i < 4; i++) { const d = panel(hud, 334 + i * 34, 0, 22, 22, C.tealD, "hud-dot"); hudDots.push(d); }
  const m = btn(hud, 537, 0, 44, 40, C.tealD, null, 0, () => { muted = !muted; muteIcon.src = SPR[muted ? "icon_sound_off" : "icon_sound_on"]; });
  m.setAttribute("aria-label", "Sound on or off");
  muteIcon = img(m, "icon_sound_on", 0, 0, 28, 28);
})();
function hudVisible(v) { hud.style.display = v ? "block" : "none"; }
function hudLevel(i) {
  hudTitle.textContent = `Level ${i + 1}: ${LEVELS[i].title}`;
  hudDots.forEach((d, k) => d.style.background = k === i ? C.tape : (G.stars[k] > 0 ? C.green : C.tealD));
}

// ------------------------------------------------------------------ Toast
const toast = panel(toastLayer, 0, -216, 860, 54, C.greenL, "toast"); toast.style.opacity = 0;
const toastIcon = img(toast, "icon_check", -398, 0, 36, 36);
const toastText = txt(toast, "", 24, 0, 780, 50, 20, C.ink, "left");
let toastTimer = null;
function showToast(msg, good, sec = 2.4) {
  toast.style.background = good ? C.greenL : C.redL;
  toastIcon.src = SPR[good ? "icon_check" : "icon_cross"];
  toastText.textContent = msg; toast.style.opacity = 1;
  scaleT(toast, 0.9, 1, 0.2);
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { toast.style.opacity = 0; }, sec * 1000);
}
function hideToast() { clearTimeout(toastTimer); toast.style.opacity = 0; }
const good = m => { sfx("correct"); showToast(m, true); };
const bad = m => { sfx("wrong"); showToast(m, false); };
const starsFrom = (m, three = 1, two = 3) => m <= three ? 3 : m <= two ? 2 : 1;

// ------------------------------------------------------------------ flow
function clearScreens() { clear(screenLayer); screenLayer.style.pointerEvents = "none"; }
function clearLevel() { epoch++; clear(levelLayer); activeLevel = null; hideToast(); }
function showTitle() { clearLevel(); clearScreens(); G.level = -1; hudVisible(false); titleScreen(); }
function startGame() { G.stars = [0, 0, 0, 0]; loadLevel(0); }
function loadLevel(i) {
  clearLevel(); clearScreens(); G.level = i; hudVisible(true); hudLevel(i);
  introScreen(i, () => beginLevel(i));
}
function beginLevel(i) {
  clearScreens();
  const root = stretch(levelLayer); root.classList.add("level", "level-" + (i + 1));
  activeLevel = [Level1, Level2, Level3, Level4][i](root, i);
}
function levelCompleted(i, stars) {
  G.stars[i] = Math.max(G.stars[i], Math.min(3, Math.max(1, stars)));
  delay(0.5, () => {
    const last = i >= LEVELS.length - 1;
    completeScreen(i, G.stars[i], last, () => last ? finalScreen() : loadLevel(i + 1));
  });
}
function goBack() {
  if (G.level >= 0) showTitle();
  else { try { window.history.back(); } catch (e) {} }
}

// ------------------------------------------------------------------ screens (mirror Screens.cs)
function backdrop(name, dim) {
  screenLayer.style.pointerEvents = "auto";
  const r = stretch(screenLayer); r.classList.add("backdrop", "screen-" + name); return r;
}
function starRow(parent, cx, cy, earned, size, animate) {
  for (let i = 0; i < 3; i++) {
    const x = cx + (i - 1) * (size + 14), y = cy + (i === 1 ? 12 : 0);
    img(parent, "star_empty", x, y, size, size);
    if (i >= earned) continue;
    const s = img(parent, "star_full", x, y, size, size);
    if (!animate) continue;
    s.style.transform = "scale(0)";
    delay(0.25 + i * 0.3, () => { sfx("star"); scaleT(s, 0, 1, 0.35); });
  }
}
function titleScreen() {
  screenLayer.style.pointerEvents = "auto";
  const r = stretch(screenLayer); r.classList.add("screen-title");
  const b = img(r, "bg_title", 0, 0, 1130, 502); b.classList.add("bg");
  const back = btn(r, -531, 216, 48, 44, C.tealD, null, 0, goBack); back.setAttribute("aria-label", "Back");
  img(back, "icon_back", 0, 0, 28, 28);
  img(r, "unit_kb", -470, -150, 150, 150); img(r, "unit_byte", -400, -168, 110, 110); img(r, "dev_pendrive", -230, -170, 120, 120);
  const m = img(r, "mascot", -330, -10, 250, 284); scaleT(m, 0.6, 1, 0.55);
  const t = txt(r, "Memory Movers", 170, 70, 700, 100, 82, C.white); t.classList.add("game-title");
  txt(r, "Lesson 3: Computer Memory", 170, 4, 700, 40, 28, C.tape);
  txt(r, "Help Max the Mover put every file in the right place.", 170, -38, 700, 36, 20, C.onDarkSoft, "center", false);
  btn(r, 170, -112, 240, 68, C.tape, "Play", 34, startGame, C.ink);
}
function introScreen(i, onStart) {
  const r = backdrop("intro", 0.55);
  const card = panel(r, 0, -16, 820, 340, C.white, "card intro-card");
  img(card, "mascot", -300, -10, 190, 216);
  txt(card, `Level ${i + 1} of ${LEVELS.length}`, 110, 122, 560, 30, 20, C.teal, "left");
  txt(card, LEVELS[i].title, 110, 82, 560, 54, 42, C.ink, "left");
  txt(card, LEVELS[i].intro, 110, -10, 560, 130, 21, C.muted, "topleft", false);
  btn(card, 250, -122, 200, 60, C.teal, "Start", 28, onStart);
  scaleT(card, 0.85, 1, 0.35);
}
function completeScreen(i, stars, last, onNext) {
  const r = backdrop("complete", 0.6); sfx("win");
  const card = panel(r, 0, -16, 720, 380, C.white, "card complete-card");
  txt(card, "Level complete!", 0, 146, 640, 54, 40, C.ink);
  starRow(card, 0, 66, stars, 86, true);
  const note = panel(card, 0, -60, 640, 104, C.tealL, "takeaway");
  txt(note, LEVELS[i].takeaway, 0, 0, 600, 96, 20, C.tealD, "center", false);
  btn(card, -130, -150, 200, 56, C.sky, "Play again", 22, () => loadLevel(i), C.teal);
  btn(card, 130, -150, 220, 56, C.teal, last ? "See my results" : "Next level", 24, onNext);
  scaleT(card, 0.85, 1, 0.35);
}
function finalScreen() {
  clearLevel(); clearScreens(); hudVisible(false);
  screenLayer.style.pointerEvents = "auto";
  const r = stretch(screenLayer); r.classList.add("screen-final");
  const b = img(r, "bg_title", 0, 0, 1130, 502); b.classList.add("bg");
  sfx("win");
  const total = G.stars.reduce((a, b) => a + b, 0);
  const m = img(r, "mascot", -420, -20, 240, 272); scaleT(m, 0.6, 1, 0.5);
  txt(r, "You're a Memory Mover!", 130, 178, 760, 60, 48, C.white);
  txt(r, `${total} of ${G.stars.length * 3} stars`, 130, 130, 760, 36, 26, C.tape);
  G.stars.forEach((s, i) => {
    const y = 70 - i * 42;
    txt(r, LEVELS[i].title, 30, y, 280, 36, 21, C.white, "right");
    for (let k = 0; k < 3; k++) img(r, k < s ? "star_full" : "star_empty", 210 + k * 38, y, 34, 34);
  });
  const recap = panel(r, 130, -128, 760, 92, C.recapBg, "recap");
  const rt = txt(recap, RECAP.join("\n"), 0, 0, 720, 86, 18, C.white, "center", false); rt.classList.add("multiline");
  btn(r, 130, -212, 200, 48, C.tape, "Play again", 22, showTitle, C.ink);
}

