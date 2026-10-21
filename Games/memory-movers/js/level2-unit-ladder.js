/* Memory Movers | js/level2-unit-ladder.js
   Level 2: Unit Ladder */
"use strict";
// ================================================================== LEVEL 2: Unit Ladder
function Level2(root, index) {
  const CW = 200, CH = 100;
  const slotPos = i => [-440 + i * 220, -40 + i * 38];
  let mistakes = 0, locked = false, next = 0, partB = false, item = 0;
  const cards = [];
  const instr = txt(root, "Build the ladder: tap the units from smallest to biggest.", -290, 150, 500, 70, 22, C.ink, "left");
  for (let i = 0; i < 5; i++) {
    const [x, y] = slotPos(i);
    const s = panel(root, x, y, CW, CH, C.slotBg, "ladder-slot");
    txt(s, String(i + 1), 0, 0, CW, CH, 44, C.slotNum);
  }
  let order; do { order = shuffle([0, 1, 2, 3, 4]); } while (order[0] === 0 && order[1] === 1);
  order.forEach((u, k) => {
    const U = UNITS[u];
    const c = panel(root, -440 + k * 220, -170, CW, CH, C.white, "card unit-card");
    img(c, U.icon, -58, 0, 76, 76);
    txt(c, U.name, 38, 18, 122, 32, 21, C.ink, "left");
    txt(c, `(${U.short}) ${U.metaphor}`, 38, -16, 122, 40, 15, C.muted, "topleft", false);
    clickable(c, () => tapUnit(u)).setAttribute("aria-label", `${U.name}, ${U.metaphor}`);
    cards[u] = c;
  });
  function tapUnit(u) {
    if (locked) return;
    if (partB) { tapStep(u); return; }
    if (u < next) return;
    const c = cards[u];
    if (u === next) {
      sfx("correct"); root.appendChild(c); const [x, y] = slotPos(u); move(c, x, y, 0.4); next++;
      if (next === 5) { locked = true; good("Great ladder! Each step is about 1,024 times bigger than the one before."); delay(2.6, startB); }
    } else { mistakes++; shake(c); bad(`Something smaller comes first. Look for the ${UNITS[next].metaphor}.`); }
  }
  let ic, iIcon, iTitle, iSub, iCount;
  function startB() {
    partB = true; instr.remove();
    ic = panel(root, -310, 150, 440, 92, C.white, "card item-card");
    iIcon = img(ic, null, -170, 0, 72, 72);
    iTitle = txt(ic, "", 40, 16, 320, 36, 26, C.ink, "left");
    iSub = txt(ic, "", 40, -20, 320, 30, 18, C.teal, "left");
    iCount = txt(root, "", -310, 92, 440, 24, 16, C.muted, "left", false);
    showItem();
  }
  function showItem() {
    const it = SIZE_ITEMS[item];
    iIcon.src = SPR[it.icon]; iTitle.textContent = it.text;
    iSub.textContent = "Which size fits? Tap its step on the ladder.";
    iCount.textContent = `Item ${item + 1} of ${SIZE_ITEMS.length}`;
    scaleT(ic, 0.7, 1, 0.3); locked = false;
  }
  function tapStep(u) {
    const it = SIZE_ITEMS[item], step = cards[u];
    if (u === it.unit) {
      locked = true; good(it.why); iSub.textContent = `${it.text} is ${it.size}.`;
      const fl = img(root, it.icon, ic._x - 170, ic._y, 72, 72);
      move(fl, step._x + 70, step._y + 34, 0.45); scaleT(fl, 1, 0.45, 0.45, false);
      delay(2.2, () => { item++; if (item < SIZE_ITEMS.length) showItem(); else levelCompleted(index, starsFrom(mistakes, 1, 4)); });
    } else { mistakes++; shake(step); bad(u < it.unit ? "Too small! It needs a bigger step." : "Too big! Try a smaller step."); }
  }
  return {};
}


