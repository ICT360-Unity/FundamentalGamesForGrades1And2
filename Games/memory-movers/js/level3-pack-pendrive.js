/* Memory Movers | js/level3-pack-pendrive.js
   Level 3: Pack the Pendrive */
"use strict";
// ================================================================== LEVEL 3: Pack the Pendrive
function Level3(root, index) {
  const DRIVE = [-90, 100], BAR = [-127, 96], BW = 410, BH = 56;
  let r = 0, mistakes = 0, locked = false, round, rr, segs, barBg, usedTxt, eject, packed, tiles, ticks;
  const used = () => packed.reduce((s, p, i) => s + (p ? round.files[i].gb : 0), 0);
  const reqDone = () => packed.every((p, i) => p || !round.files[i].required);
  const ready = () => used() >= round.target && reqDone();
  buildRound();

  function buildRound() {
    round = PACK_ROUNDS[r]; packed = []; tiles = []; ticks = [];
    rr = stretch(root);
    img(rr, "pendrive_big", DRIVE[0], DRIVE[1], 560, 170);
    barBg = box(rr, BAR[0], BAR[1], BW, BH, "capacity-bar"); barBg.style.background = C.barBg;
    const gw = BW / round.capacity;
    for (let g = 1; g < round.capacity; g++) { box(barBg, -BW / 2 + g * gw, 0, 2, BH, "capacity-tick"); }
    segs = box(barBg, 0, 0, BW, BH);
    txt(rr, `${round.capacity} GB`, DRIVE[0] - 158, DRIVE[1] + 60, 120, 28, 20, C.white, "left");
    usedTxt = txt(rr, "", DRIVE[0], DRIVE[1] - 106, 560, 30, 22, C.ink);
    const ms = panel(rr, 395, 110, 290, 150, C.white, "card mission-card");
    txt(ms, `Round ${r + 1} of ${PACK_ROUNDS.length}`, 0, 46, 260, 30, 18, C.teal, "left");
    txt(ms, round.mission, 0, -16, 260, 90, 20, C.ink, "topleft", false);
    eject = btn(rr, 395, -6, 220, 56, C.ram, "Eject pendrive", 22, tryEject);
    const n = round.files.length, w = Math.min(190, (1090 - (n - 1) * 14) / n), sx = -((n - 1) * (w + 14)) / 2;
    round.files.forEach((f, i) => {
      const t = panel(rr, sx + i * (w + 14), -118, w, 132, C.white, "card file-tile");
      img(t, f.icon, 0, 28, 58, 58);
      txt(t, f.name, 0, -18, w - 10, 26, 16, C.ink);
      txt(t, `${f.gb} GB`, 0, -44, w - 10, 28, 22, C.teal);
      if (f.required) img(t, "star_full", -w / 2 + 20, 46, 30, 30);
      const tk = img(t, "icon_check", w / 2 - 20, 46, 30, 30); tk.style.display = "none";
      clickable(t, () => toggle(i)).setAttribute("aria-label", `${f.name}, ${f.gb} gigabytes${f.required ? ", must pack" : ""}`);
      packed.push(false); tiles.push(t); ticks.push(tk);
    });
    place(rr, 1130, 0, 1130, 502); move(rr, 0, 0, 0.45);
    refresh(); locked = false;
  }
  function toggle(i) {
    if (locked) return;
    const f = round.files[i];
    if (packed[i]) { packed[i] = false; sfx("click"); }
    else {
      const free = round.capacity - used();
      if (f.gb > free) {
        mistakes++; sfx("full");
        showToast(`Not enough space! ${f.name} needs ${f.gb} GB, but only ${free} GB is free.`, false);
        shake(tiles[i]); barBg.style.background = C.redL; setTimeout(() => barBg.style.background = C.barBg, 350);
        return;
      }
      packed[i] = true; sfx("save");
    }
    refresh();
  }
  function refresh() {
    clear(segs);
    const gw = BW / round.capacity; let x = -BW / 2, col = 0;
    packed.forEach((p, i) => {
      tiles[i].style.background = p ? C.tealL : C.white;
      ticks[i].style.display = p ? "block" : "none";
      if (!p) return;
      const f = round.files[i], w = f.gb * gw;
      const s = box(segs, x + w / 2, 0, w - 2, BH - 6); s.classList.add("capacity-seg"); s.style.background = SEG[col++ % SEG.length];
      if (w >= 54) txt(s, f.name, 0, 0, w - 6, BH - 8, w >= 90 ? 16 : 12, C.white);
      x += w;
    });
    const u = used();
    usedTxt.textContent = `${u} GB used, ${round.capacity - u} GB free`;
    eject.style.opacity = ready() ? 1 : 0.5;
  }
  function tryEject() {
    if (locked) return;
    if (!reqDone()) { showToast("Not yet! Pack every starred file first.", false); return; }
    if (used() < round.target) { showToast(`Not yet! Fill at least ${round.target} GB. You have ${used()} GB.`, false); return; }
    locked = true; sfx("eject"); showToast(`Packed! ${used()} GB of ${round.capacity} GB used.`, true);
    const old = rr;
    delay(1.4, () => {
      move(old, -1130, 0, 0.45, () => old.remove());
      r++;
      if (r < PACK_ROUNDS.length) buildRound(); else levelCompleted(index, starsFrom(mistakes, 1, 3));
    });
  }
  return {};
}


