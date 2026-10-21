/* Memory Movers | js/level1-desk-shelf.js
   Level 1: Desk vs Shelf */
"use strict";
// ================================================================== LEVEL 1: Desk vs Shelf
function Level1(root, index) {
  const DESK = { x: -350, y: -40 }, SHELF = { x: 350, y: -40 };
  const DESK_ITEM_Y = 52, SLOT_X = [-120, -40, 40, 120], SHELF_X = [-105, -35, 35, 105], SHELF_ROW = [30, -40, -111];
  let i = 0, mistakes = 0, locked = false, shelfSorted = 0, saved = 0, powerPhase = false, powerDone = false, remaining = 0;
  const deskItems = [], saveBtns = [], ticks = [];

  const dp = panel(root, DESK.x, 140, 300, 66, C.ram, "pill desk-pill");
  txt(dp, "Desk (RAM)", 0, 11, 280, 34, 26, C.white); txt(dp, "Using it right now", 0, -17, 280, 24, 16, C.white, "center", false);
  img(root, "desk", DESK.x, DESK.y, 380, 190);
  clickable(box(root, DESK.x, DESK.y + 20, 400, 260), () => choose(true)).setAttribute("aria-label", "Desk, RAM");
  const sp = panel(root, SHELF.x, 140, 300, 66, C.teal, "pill shelf-pill");
  txt(sp, "Shelf (Storage)", 0, 11, 280, 34, 26, C.white); txt(sp, "Saved to keep", 0, -17, 280, 24, 16, C.white, "center", false);
  img(root, "shelf", SHELF.x, SHELF.y, 330, 236);
  clickable(box(root, SHELF.x, SHELF.y + 20, 370, 300), () => choose(false)).setAttribute("aria-label", "Shelf, storage");

  const counter = txt(root, "", 0, 150, 340, 30, 18, C.muted);
  const card = panel(root, 0, -10, 280, 230, C.white, "card");
  const cardIcon = img(card, null, 0, 42, 104, 104);
  const cardText = txt(card, "", 0, -62, 250, 84, 22, C.ink);
  const hint = txt(root, "Tap the desk or the shelf", 0, -150, 340, 30, 18, C.muted, "center", false);
  showCard();

  function showCard() {
    const c = DESK_CARDS[i];
    counter.textContent = `Card ${i + 1} of ${DESK_CARDS.length}`;
    cardIcon.src = SPR[c.icon]; cardText.textContent = c.text;
    card.style.display = "block"; scaleT(card, 0.6, 1, 0.3); locked = false;
  }
  function choose(desk) {
    if (locked || powerPhase) return; locked = true;
    const c = DESK_CARDS[i];
    if (c.isDesk === desk) good(c.why); else { mistakes++; bad("Not quite. " + c.why); }
    const tx = c.isDesk ? DESK.x + SLOT_X[Math.min(deskItems.length, 3)] : SHELF.x + SHELF_X[shelfSorted % 4];
    const ty = c.isDesk ? DESK_ITEM_Y : SHELF_ROW[0];
    const fl = img(root, c.icon, card._x, card._y + 42, 104, 104);
    card.style.display = "none";
    scaleT(fl, 1, c.isDesk ? 0.6 : 0.54, 0.45, false); move(fl, tx, ty, 0.45);
    if (c.isDesk) deskItems.push(fl); else shelfSorted++;
    delay(1.8, () => { i++; if (i < DESK_CARDS.length) showCard(); else startPowerCut(); });
  }
  let banner, timerFill, timerText;
  function startPowerCut() {
    powerPhase = true; counter.textContent = "Storm alert!"; hint.textContent = ""; sfx("full");
    banner = panel(root, 0, -6, 330, 240, C.ink, "card power-banner");
    img(banner, "power_badge", 0, 70, 78, 78);
    const bt = txt(banner, "The power goes off soon!\nTap Save on your desk work.", 0, -6, 300, 70, 19, C.white); bt.classList.add("multiline");
    const tb = panel(banner, 0, -78, 270, 22, C.tealD, "timer-track");
    timerFill = box(tb, 0, 0, 270, 22, "timer-fill");
    timerText = txt(banner, "", 0, -102, 270, 24, 16, C.onDarkSoft, "center", false);
    scaleT(banner, 0.7, 1, 0.3);
    deskItems.forEach((item, k) => {
      const b = btn(root, item._x, -2, 74, 30, C.teal, "Save", 16, () => save(item, b));
      saveBtns.push(b);
    });
    remaining = POWER_CUT_SECONDS;
    const my = epoch; let last = performance.now();
    (function loop(now) {
      if (my !== epoch || powerDone) return;
      remaining -= (now - last) / 1000; last = now;
      timerFill.style.transform = `scaleX(${Math.max(0, remaining / POWER_CUT_SECONDS)})`;
      timerText.textContent = `${Math.ceil(Math.max(0, remaining))} seconds`;
      if (remaining <= 0) powerOff(); else requestAnimationFrame(loop);
    })(last);
  }
  function save(item, b) {
    if (powerDone || !b.parentNode) return;
    sfx("save"); b.remove(); saveBtns.splice(saveBtns.indexOf(b), 1);
    const cp = img(root, null, item._x, item._y, 104, 104); cp.src = item.src;
    cp.style.transform = item.style.transform;
    scaleT(cp, item._s || 0.6, 0.54, 0.5, false);
    move(cp, SHELF.x + SHELF_X[saved % 4], SHELF_ROW[1 + Math.floor(saved / 4)], 0.5);
    ticks.push(img(root, "icon_check", item._x + 26, item._y + 26, 30, 30));
    saved++;
    if (saved >= deskItems.length) remaining = Math.min(remaining, 0.8);
  }
  function powerOff() {
    powerDone = true; saveBtns.forEach(b => b.remove()); sfx("power_down");
    const bo = stretch(root); bo.classList.add("blackout"); bo.style.opacity = 0;
    img(bo, "power_badge", 0, 30, 150, 150); txt(bo, "Power off!", 0, -80, 500, 60, 46, C.white);
    fade(bo, 1, 0.35);
    delay(1.6, () => {
      sfx("whoosh");
      deskItems.forEach(it => scaleT(it, it._s || 0.6, 0, 0.3, false));
      ticks.forEach(t => t.remove());
      banner.remove();
      fade(bo, 0, 0.5, () => { bo.remove(); showResult(); });
    });
  }
  function showResult() {
    const lost = deskItems.length - saved;
    counter.textContent = "The power is back on";
    const p = panel(root, 0, -10, 340, 260, C.white, "card result-card");
    txt(p, "The desk is empty!", 0, 92, 310, 40, 26, C.ink);
    const body = lost === 0
      ? "You saved all your work, so it is safe on the shelf. RAM forgets everything when the power goes off."
      : `${lost} unsaved ${lost === 1 ? "thing was" : "things were"} lost. RAM forgets everything when the power goes off. Only saved work stays on the shelf.`;
    txt(p, body, 0, 2, 300, 130, 18, C.muted, "center", false);
    btn(p, 0, -94, 180, 52, C.teal, "Continue", 22, () => {
      const pts = (DESK_CARDS.length - mistakes) + saved;
      levelCompleted(index, pts >= 11 ? 3 : pts >= 8 ? 2 : 1);
    });
    scaleT(p, 0.7, 1, 0.3);
  }
  return {};
}


