/* Memory Movers | js/level4-device-sort.js
   Level 4: Inside or Outside? */
"use strict";
// ================================================================== LEVEL 4: Inside or Outside?
function Level4(root, index) {
  const BELT_Y = 66, ITEM_Y = 128, START_X = 640, END_X = -640;
  const queue = shuffle(DEVICES.slice());
  let cur = -1, item = null, speed = 0, moving = false, locked = false, mistakes = 0;
  txt(root, "Where does it belong? Tap before it rolls away!", -40, 176, 800, 34, 22, C.ink);
  const counter = txt(root, "", 470, 176, 140, 30, 16, C.muted, "right", false);
  const belt = img(root, "conveyor", 0, BELT_Y, 1130, 70); belt.classList.add("bg");
  const inside = bin(-270, "bin_computer", "Inside the computer", "Internal memory", C.teal, true);
  const outside = bin(270, "bin_backpack", "Carry it around", "External / portable", C.ram, false);
  delay(0.4, nextDevice);

  function bin(x, spr, title, sub, color, isIn) {
    const b = btn(root, x, -122, 400, 140, color, null, 0, () => choose(isIn)); b.classList.add("bin", isIn ? "bin-inside" : "bin-outside");
    b.setAttribute("aria-label", title);
    img(b, spr, -122, 0, 120, 120);
    txt(b, title, 62, 16, 250, 40, 26, C.white, "left");
    txt(b, sub, 62, -20, 250, 30, 18, C.onDarkSoft, "left", false);
    return b;
  }
  function nextDevice() {
    cur++;
    if (cur >= queue.length) { levelCompleted(index, starsFrom(mistakes, 1, 3)); return; }
    const d = queue[cur];
    counter.textContent = `${cur + 1} of ${queue.length}`;
    item = box(root, START_X, ITEM_Y, 120, 120);
    img(item, d.icon, 0, 0, 116, 116);
    item._label = txt(item, d.name, 0, BELT_Y - ITEM_Y, 220, 30, 19, C.white);
    speed = (START_X - END_X) / Math.max(BELT_MIN, BELT_START - cur * BELT_SPEEDUP);
    moving = true; locked = false;
    const my = epoch; let last = performance.now();
    (function loop(now) {
      if (my !== epoch || !moving) return;
      const x = item._x - speed * (now - last) / 1000; last = now;
      place(item, x, ITEM_Y, 120, 120);
      if (x <= END_X) missed(); else requestAnimationFrame(loop);
    })(last);
  }
  function choose(isIn) {
    if (locked || !moving || !item) return;
    locked = true; moving = false;
    const d = queue[cur];
    if (d.internal === isIn) good(d.why); else { mistakes++; bad("Oops! " + d.why); }
    toBin(d);
  }
  function missed() {
    if (locked) return; locked = true; moving = false; mistakes++;
    const d = queue[cur]; bad("Too slow! " + d.why);
    place(item, 0, ITEM_Y, 120, 120); toBin(d);
  }
  function toBin(d) {
    const b = d.internal ? inside : outside, fl = item;
    fl._label.remove();
    move(fl, b._x - 122, b._y, 0.5);
    scaleT(fl, 1, 0.2, 0.5, false, () => fl.remove());
    scaleT(b, 1.08, 1, 0.4);
    delay(2.3, nextDevice);
  }
  return {};
}

