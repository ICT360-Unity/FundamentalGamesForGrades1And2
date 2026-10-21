/* Art Studio — game flow.
   Title → Pick a picture → Instructions (what you'll make) → Paint, step by step → Finished card.
   Each step: pick the TOOL → pick its TYPE (if any) → pick the COLOR (if needed) → USE it on the card. */
(function () {
  var D = window.WSW_DATA, P = WSW.Painter, A = WSW.Audio;
  function $(s) { return document.querySelector(s); }
  function $$(s) { return Array.prototype.slice.call(document.querySelectorAll(s)); }
  function rnd(a, b) { return a + Math.random() * (b - a); }

  var painter, scene, state = {}, previews = {}, progress = loadProgress();

  /* ---------- lookups ---------- */
  function step() { return scene.steps[state.step]; }
  function toolById(id) { return D.tools.filter(function (t) { return t.id === id; })[0]; }
  function optionsFor(id) { return D.options[id] || null; }
  function optionById(toolId, id) { var o = optionsFor(toolId); return o ? o.items.filter(function (i) { return i.id === id; })[0] : null; }
  function colorById(id) { return D.colors.filter(function (c) { return c.id === id; })[0]; }
  function sceneById(id) { return D.scenes.filter(function (s) { return s.id === id; })[0]; }
  function stepHex(s) { return s.color ? colorById(s.color).hex : (state.color ? colorById(state.color).hex : "#2B4C9B"); }

  /* ---------- progress (kept in this browser only) ---------- */
  function loadProgress() { try { return JSON.parse(localStorage.getItem("artstudio-progress") || "{}") || {}; } catch (e) { return {}; } }
  function saveProgress() { try { localStorage.setItem("artstudio-progress", JSON.stringify(progress)); } catch (e) {} }

  /* ---------- layout ---------- */
  function fit() {
    var s = Math.min(window.innerWidth / 1130, window.innerHeight / 502);
    $("#stage").style.transform = "scale(" + s + ")";
  }
  function show(name) { $$(".screen").forEach(function (el) { el.classList.toggle("is-active", el.id === "screen-" + name); }); }

  /* ---------- Placing things (shared by play, keyboard and previews) ---------- */
  function placeStamp(p, a, x, y) {
    if (a.anchor === "bottom") {
      var bottom = Math.min(y + 10, P.H - 4), cx = Math.max(a.w / 2 + 4, Math.min(P.W - a.w / 2 - 4, x));
      p.stamp(a.stamp, cx, bottom - a.h / 2, a.w, a.h, 0, false);
    } else {
      var w = a.size ? rnd(a.size[0], a.size[1]) : a.w, h = a.size ? w : a.h;
      p.stamp(a.stamp, x, y, w, h, a.rotate ? rnd(0, Math.PI) : 0, a.flip ? Math.random() < 0.5 : false);
    }
  }
  function placeShape(p, a, x, y, hex) {
    var r = rnd(a.r[0], a.r[1]);
    x = Math.max(r + 4, Math.min(P.W - r - 4, x));
    p.shape(a.shape, x, Math.max(r + 4, y), r, hex);
  }

  /* Paint a finished copy of a scene instantly (menu thumbnails + "what you'll make") */
  function paintFinished(p, sc) {
    p.setScene(sc.id);
    sc.steps.forEach(function (s) {
      var a = s.action, hex = s.color ? colorById(s.color).hex : "#2B4C9B";
      if (a.do === "fill") p.fill(a.region, a.mode, hex, null, true);
      else if (a.do === "columns") p.finishColumns(a.effect, a.zone, hex, null, true);
      else if (a.do === "stamp") a.auto.forEach(function (q) { placeStamp(p, a, q[0], q[1]); });
      else if (a.do === "shape") a.auto.forEach(function (q) { placeShape(p, a, q[0], q[1], hex); });
      else if (a.do === "sparkle") a.auto.forEach(function (q) { p.sparkle(q[0], q[1], hex, 8); });
      else if (a.do === "text") p.text(a.text, a.auto[0][0], a.auto[0][1], hex);
      else if (a.do === "erase") p.eraseRest();
    });
  }
  function buildPreviews() {
    var c = document.createElement("canvas"), p = new P(c, null);
    D.scenes.forEach(function (sc) {
      paintFinished(p, sc);
      var copy = document.createElement("canvas");
      p.copyTo(copy);
      previews[sc.id] = copy;
    });
  }
  function drawPreview(target, id) {
    var src = previews[id]; if (!src) return;
    target.width = src.width; target.height = src.height;
    target.getContext("2d").drawImage(src, 0, 0);
  }

  /* ---------- MENU ---------- */
  function renderMenu() {
    var grid = $("#scene-grid"); grid.innerHTML = "";
    D.scenes.forEach(function (sc) {
      var best = progress[sc.id] || 0;
      var b = document.createElement("button");
      b.type = "button"; b.className = "scene-card" + (best ? " is-done" : "");
      b.innerHTML =
        '<canvas class="scene-thumb" aria-hidden="true"></canvas>' +
        '<span class="scene-name">' + sc.name + "</span>" +
        '<span class="scene-line">' + sc.thumbLine + "</span>" +
        '<span class="scene-meta"><span>' + sc.steps.length + " steps</span>" +
        (best ? '<span class="mini-stars" aria-label="' + best + ' of 3 stars">' + "★★★".slice(0, best) + '<i>' + "★★★".slice(best) + "</i></span>" : '<span class="new-tag">New</span>') +
        "</span>";
      b.addEventListener("click", function () { A.play("click"); openBrief(sc.id); });
      grid.appendChild(b);
      drawPreview(b.querySelector("canvas"), sc.id);
    });
    show("menu");
  }

  /* ---------- BRIEF: what you'll make ---------- */
  function openBrief(id) {
    scene = sceneById(id);
    drawPreview($("#brief-preview"), id);
    $("#brief-name").textContent = scene.name;
    $("#brief-goal").textContent = scene.goal;
    $("#brief-hazel").textContent = scene.brief;
    var ol = $("#brief-steps"); ol.innerHTML = "";
    scene.steps.forEach(function (s) { var li = document.createElement("li"); li.textContent = s.instruction; ol.appendChild(li); });
    show("brief");
    $("#btn-go").focus();
  }

  /* ---------- GAME: build UI ---------- */
  function buildToolbar() {
    var tb = $("#toolbar");
    D.tools.forEach(function (t) {
      var b = document.createElement("button");
      b.className = "tool"; b.type = "button"; b.dataset.tool = t.id;
      b.setAttribute("aria-label", t.label + ". " + t.desc);
      b.innerHTML = '<img src="' + t.icon + '" alt=""><span class="tool-name">' + t.label + '</span><span class="mark" aria-hidden="true"></span>' +
        '<span class="tip" role="tooltip"><b>' + t.label + "</b>" + t.desc.replace(t.label + " ", "") + "</span>";
      b.addEventListener("click", function () { onTool(t.id); });
      tb.appendChild(b);
    });
  }
  function buildPalette() {
    var p = $("#palette");
    D.colors.forEach(function (c) {
      var b = document.createElement("button");
      b.className = "swatch"; b.type = "button"; b.dataset.color = c.id;
      b.style.setProperty("--swatch", c.hex);
      b.setAttribute("aria-label", c.name); b.title = c.name;
      b.innerHTML = '<span class="mark" aria-hidden="true"></span>';
      b.addEventListener("click", function () { onColor(c.id); });
      p.appendChild(b);
    });
  }
  function buildSteps() {
    var ol = $("#steps"); ol.innerHTML = "";
    scene.steps.forEach(function (s, i) {
      var li = document.createElement("li");
      li.dataset.index = i;
      li.innerHTML = '<span class="num" aria-hidden="true">' + (i + 1) + '</span><span class="what">' + s.instruction + "</span>";
      ol.appendChild(li);
    });
    $("#scene-chip").textContent = scene.name;
  }

  /* ---------- Hazel ---------- */
  function say(text, mood) {
    var b = $("#bubble");
    b.textContent = text;
    $("#coach").className = "coach" + (mood ? " is-" + mood : "");
    var bub = $("#coach-bubble"); bub.classList.remove("pop"); void bub.offsetWidth; bub.classList.add("pop");
    $("#hazel").src = mood === "good" ? D.customer.art.happy : mood === "oops" ? D.customer.art.think : D.customer.art.normal;
  }

  /* ---------- Tracker: Tool → Type → Color → Use it ---------- */
  function readiness() {
    var s = step();
    return {
      tool: state.tool === s.tool,
      option: !s.option || state.option === s.option,
      color: !s.color || state.color === s.color
    };
  }
  function nextSlot() {
    var r = readiness(), s = step();
    if (!r.tool) return "tool";
    if (s.option && !r.option) return "option";
    if (s.color && !r.color) return "color";
    return "use";
  }
  function renderTracker() {
    var s = step(), r = readiness(), cur = nextSlot(), slots = [];
    slots.push({ key: "tool", label: "Tool", value: r.tool ? toolById(s.tool).label : "" });
    if (s.option) slots.push({ key: "option", label: optionsFor(s.tool).noun, value: r.option && r.tool ? optionById(s.tool, s.option).label : "" });
    if (s.color) slots.push({ key: "color", label: "Color", value: r.color ? colorById(s.color).name : "" });
    if (s.action.do !== "save") slots.push({ key: "use", label: "Use it", value: "" });
    var html = slots.map(function (sl) {
      var done = sl.key !== "use" && !!sl.value && (sl.key !== "option" || r.tool);
      var cls = done ? "is-done" : sl.key === cur ? "is-current" : "";
      return '<li class="slot ' + cls + '"><span class="slot-label">' + sl.label + "</span>" +
        (done ? '<span class="slot-value">' + sl.value + "</span>" : sl.key === cur && sl.key !== "use" ? '<span class="slot-value">?</span>' : "") + "</li>";
    }).join("");
    $("#tracker").innerHTML = html;
    // point the eye at the next place to click
    $("#drawer").classList.toggle("is-next", cur === "option");
    $("#palette").classList.toggle("is-next", cur === "color");
  }

  /* ---------- Drawer of choices beside the toolbar ---------- */
  function renderDrawer() {
    var s = step(), body = $("#drawer-body"), title = $("#drawer-title"), t = toolById(state.tool), o = optionsFor(state.tool);
    body.innerHTML = ""; body.className = "drawer-body";
    $("#drawer").classList.toggle("is-open", !!(t && state.tool === s.tool && o));
    if (!t) { title.textContent = "Choices"; body.innerHTML = '<p class="drawer-note">' + D.text.drawerEmpty + "</p>"; return; }
    if (state.tool !== s.tool) { title.textContent = "Choices"; body.innerHTML = '<p class="drawer-note is-wrong">' + D.text.drawerWrongTool + "</p>"; return; }
    if (!o) { title.textContent = t.label; body.innerHTML = '<p class="drawer-note">' + t.label + " " + D.text.drawerNoOptions + "</p>"; return; }
    title.textContent = o.title;
    if (state.tool === "stamp") body.classList.add("is-stamps");
    o.items.forEach(function (it) {
      var b = document.createElement("button");
      b.className = "option"; b.type = "button"; b.dataset.option = it.id;
      b.innerHTML = '<img src="' + it.img + '" alt=""><span>' + it.label + '</span><span class="mark" aria-hidden="true"></span>';
      b.addEventListener("click", function () { onOption(it.id); });
      body.appendChild(b);
    });
  }

  /* ---------- Right / wrong marks on the buttons themselves ---------- */
  function mark(selector, attr, value, ok) {
    $$(selector).forEach(function (el) {
      var me = el.dataset[attr] === value;
      el.classList.toggle("is-on", me);
      el.classList.toggle("is-right", me && ok === true);
      el.classList.toggle("is-wrong", me && ok === false);
      el.setAttribute("aria-pressed", me);
    });
  }
  function clearMarks(selector) { $$(selector).forEach(function (el) { el.classList.remove("is-on", "is-right", "is-wrong"); el.setAttribute("aria-pressed", "false"); }); }
  function clearHints() { $$(".is-hint").forEach(function (el) { el.classList.remove("is-hint"); }); }
  function hint(selector) { var el = $(selector); if (el) el.classList.add("is-hint"); }

  function updateSteps() {
    $("#step-count").textContent = "Step " + Math.min(state.step + 1, scene.steps.length) + " of " + scene.steps.length;
    $$("#steps li").forEach(function (li) {
      var i = +li.dataset.index;
      li.classList.toggle("is-done", i < state.step);
      li.classList.toggle("is-current", i === state.step);
      li.querySelector(".num").textContent = i < state.step ? "✓" : i + 1;
    });
  }
  function miss(key) { var k = state.step + ":" + key; if (!state.missed[k]) { state.missed[k] = true; state.mistakes++; } }

  /* ---------- Step flow ---------- */
  function startScene() {
    state = { step: 0, tool: null, option: null, color: null, armed: false, busy: false, mistakes: 0, missed: {}, toolMiss: 0, optMiss: 0, count: 0, down: false, pointer: null, last: null };
    painter.setScene(scene.id);
    buildSteps();
    clearMarks(".swatch");
    $("#saved-chip").classList.remove("go");
    show("game");
    startStep();
  }

  function startStep() {
    var s = step();
    state.tool = null; state.option = null; state.toolMiss = 0; state.optMiss = 0; state.count = 0; state.last = null;
    if (s.color) { state.color = null; clearMarks(".swatch"); }
    disarm(); clearHints(); clearMarks(".tool");
    renderDrawer(); updateSteps(); renderTracker();
    say(s.intro, "neutral");
    state.busy = false;
  }

  function refresh() {
    var cur = nextSlot();
    if (cur === "use" && step().action.do !== "save") arm(); else disarm();
    renderTracker();
    return cur;
  }
  function guideTarget() {
    var a = step().action;
    if (a.do === "columns") return { zone: a.zone, brush: painter.g.zones[a.zone].brush };
    if (a.do === "erase") return { scribble: true, brush: 14 };
    return { region: a.region, brush: a.do === "sparkle" ? 8 : 6 };
  }
  function arm() { state.armed = true; $("#easel").classList.add("is-armed"); painter.drawGuide(guideTarget(), state.pointer); }
  function disarm() { state.armed = false; $("#easel").classList.remove("is-armed"); if (painter) painter.clearGuide(); }

  function promptFor(cur) {
    var s = step();
    if (cur === "option") return "";
    if (cur === "color") return s.colorPrompt || "";
    if (cur === "use") return s.doPrompt || "";
    return "";
  }

  function onTool(id) {
    if (state.busy) return;
    A.play("click");
    var s = step(), t = toolById(id);
    state.tool = id; state.option = null;
    clearHints();
    if (id === s.tool) {
      mark(".tool", "tool", id, true);
      renderDrawer();
      if (s.action.do === "save") { doSave(); return; }
      var cur = refresh();
      A.play("good");
      say(s.toolRight + (cur !== "option" ? " " + promptFor(cur) : ""), "good");
    } else {
      mark(".tool", "tool", id, false);
      renderDrawer(); disarm(); renderTracker();
      var note = s.toolNotes && s.toolNotes[id];
      if (!note) { miss("tool:" + id); state.toolMiss++; }
      A.play("oops");
      say(note || (t.desc + " " + s.nudge), "oops");
      if (state.toolMiss >= 2) hint('.tool[data-tool="' + s.tool + '"]');
    }
  }

  function onOption(id) {
    if (state.busy) return;
    A.play("click");
    var s = step(), o = optionById(state.tool, id);
    state.option = id;
    clearHints();
    if (id === s.option) {
      mark(".option", "option", id, true);
      var cur = refresh();
      A.play("good");
      say(s.optionRight + " " + promptFor(cur), "good");
    } else {
      mark(".option", "option", id, false);
      disarm(); renderTracker();
      miss("opt:" + id); state.optMiss++;
      A.play("oops");
      say(o.desc + " " + s.optionNudge, "oops");
      if (state.optMiss >= 2) hint('.option[data-option="' + s.option + '"]');
    }
  }

  function onColor(id) {
    if (state.busy) return;
    A.play("click");
    var s = step(), c = colorById(id);
    state.color = id;
    $$(".swatch.is-hint").forEach(function (el) { el.classList.remove("is-hint"); });
    if (!s.color) {
      mark(".swatch", "color", id, null);
      var cur0 = refresh();
      say("You picked " + c.name + ". " + D.text.colorNotNeeded + (cur0 === "use" ? " " + s.doPrompt : ""), "neutral");
      return;
    }
    if (id === s.color) {
      mark(".swatch", "color", id, true);
      var cur = refresh();
      A.play("good");
      var next = cur === "use" ? s.doPrompt : cur === "tool" ? "Now find the right tool." : "Now pick the right " + optionsFor(s.tool).noun.toLowerCase() + ".";
      say("Good, " + c.name + "! " + next, "good");
    } else {
      mark(".swatch", "color", id, false);
      disarm(); renderTracker();
      miss("col:" + id);
      A.play("oops");
      say("That's " + c.name + ". This step needs " + colorById(s.color).name + ".", "oops");
      if (state.tool === s.tool) hint('.swatch[data-color="' + s.color + '"]');
    }
  }

  function completeStep() {
    var s = step();
    state.busy = true; disarm();
    A.play("done");
    say(s.success, "good");
    state.step++;
    updateSteps();
    $("#tracker").innerHTML = '<li class="slot is-done is-all"><span class="slot-label">Step done!</span></li>';
    $("#drawer").classList.remove("is-next"); $("#palette").classList.remove("is-next");
    setTimeout(function () { if (state.step < scene.steps.length) startStep(); else showFinale(); }, 1500);
  }

  function doSave() {
    state.busy = true; disarm();
    A.play("save");
    var f = $("#flash"); f.classList.remove("go"); void f.offsetWidth; f.classList.add("go");
    $("#saved-chip").classList.add("go");
    completeStep();
  }

  /* ---------- Using the tool on the card ---------- */
  function toCanvas(e) {
    var r = $("#guide").getBoundingClientRect();
    return { x: (e.clientX - r.left) / r.width * P.W, y: (e.clientY - r.top) / r.height * P.H };
  }

  function act(x, y, phase) {
    var s = step(), a = s.action, hex = stepHex(s), i, left;
    switch (a.do) {
      case "fill":
        if (phase !== "down") return;
        if (!painter.inRegion(a.region, x, y)) { A.play("oops"); say(s.missPrompt, "oops"); return; }
        state.busy = true; disarm(); A.play("pour");
        painter.fill(a.region, a.mode, hex, completeStep);
        break;

      case "columns":
        if (!painter.nearZone(a.zone, x, y)) { if (phase === "down") say(s.missPrompt, "neutral"); return; }
        var col = Math.floor(x / P.COLW);
        for (i = col - 1; i <= col + 1; i++) {
          if (Math.abs(i * P.COLW + P.COLW / 2 - x) <= 16 && painter.column(a.effect, a.zone, i, hex)) A.play("dab");
        }
        painter.drawGuide(guideTarget(), state.pointer);
        if (painter.colCount(a.effect, a.zone) / P.COLS >= 0.8) {
          state.busy = true; disarm();
          painter.finishColumns(a.effect, a.zone, hex, completeStep);
        }
        break;

      case "stamp":
      case "shape":
        if (phase !== "down") return;
        if (!painter.inRegion(a.region, x, y)) { A.play("oops"); say(s.missPrompt, "oops"); return; }
        A.play("stamp");
        if (a.do === "stamp") placeStamp(painter, a, x, y); else placeShape(painter, a, x, y, hex);
        state.count++;
        left = (a.count || 1) - state.count;
        if (left <= 0) completeStep(); else say(left === 1 ? "One more!" : left + " more to go!", "good");
        break;

      case "sparkle":
        if (!painter.inRegion(a.region, x, y)) { if (phase === "down") say(s.missPrompt, "neutral"); return; }
        var far = painter.sparkles.every(function (q) { return Math.hypot(q[0] - x, q[1] - y) > 24; });
        if (!far) return;
        painter.sparkle(x, y, hex, rnd(6, 10));
        A.play("dab");
        state.count++;
        left = a.count - state.count;
        if (left <= 0) completeStep(); else if (left <= 3) say(left === 1 ? "One more star!" : left + " more stars!", "good");
        break;

      case "text":
        if (phase !== "down") return;
        if (!painter.inRegion(a.region, x, y)) { A.play("oops"); say(s.missPrompt, "oops"); return; }
        A.play("stamp");
        painter.text(a.text, x, y, hex);
        completeStep();
        break;

      case "erase":
        var hits = painter.eraseAt(x, y);
        if (hits) A.play("dab");
        else if (phase === "down") say(s.missPrompt, "neutral");
        if (painter.erasedCount / painter.scribbleSamples().length >= 0.85) {
          painter.eraseRest();
          completeStep();
        } else painter.drawGuide(guideTarget(), state.pointer);
        break;
    }
  }

  /* Keyboard players: Enter or Space on the card uses the tool at a sensible spot */
  function actByKeyboard() {
    if (!state.armed || state.busy) return;
    var a = step().action, i;
    if (a.do === "columns") {
      var z = painter.zone(a.zone);
      for (i = 0; i < P.COLS; i++) if (!painter.colDone(a.effect, a.zone, i)) {
        var x = i * P.COLW + P.COLW / 2; act(x, (z.top(x) + Math.min(z.bottom(x), P.H - 10)) / 2, "down"); return;
      }
    } else if (a.do === "erase") {
      var smp = painter.scribbleSamples();
      for (i = 0; i < smp.length; i++) if (!painter.erased[i]) { act(smp[i][0], smp[i][1], "down"); return; }
    } else if (a.do === "fill") {
      var r = painter.region(a.region); act(P.W / 2, (r.top(P.W / 2) + r.bottom(P.W / 2)) / 2, "down");
    } else if (a.auto) {
      var q = a.auto[state.count % a.auto.length]; act(q[0], q[1], "down");
    }
  }

  function bindCanvas() {
    var cv = $("#guide");
    cv.addEventListener("pointerdown", function (e) {
      if (!state.armed || state.busy) {
        if (!state.busy) { A.play("oops"); say(step().action.do === "save" ? step().intro : D.text.canvasNotReady, "neutral"); }
        return;
      }
      state.down = true;
      try { cv.setPointerCapture(e.pointerId); } catch (err) {}
      var p = toCanvas(e); state.pointer = p;
      act(p.x, p.y, "down");
    });
    cv.addEventListener("pointermove", function (e) {
      var p = toCanvas(e); state.pointer = p;
      if (!state.armed || state.busy) return;
      if (state.down) act(p.x, p.y, "move");
      if (state.armed) painter.drawGuide(guideTarget(), p);
    });
    function up() { state.down = false; }
    cv.addEventListener("pointerup", up);
    cv.addEventListener("pointercancel", up);
    cv.addEventListener("pointerleave", function () { state.pointer = null; if (state.armed) painter.drawGuide(guideTarget(), null); });
    cv.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); actByKeyboard(); } });
  }

  /* ---------- Finished ---------- */
  function showFinale() {
    painter.copyTo($("#final-card"));
    var stars = state.mistakes <= 2 ? 3 : state.mistakes <= 5 ? 2 : 1;
    progress[scene.id] = Math.max(progress[scene.id] || 0, stars); saveProgress();
    $$("#stars .star").forEach(function (el, i) { el.classList.toggle("is-on", i < stars); });
    $("#stars").setAttribute("aria-label", stars + " of 3 stars");
    $("#final-note").textContent = D.text["stars" + stars];
    $("#final-hazel-line").textContent = D.text.finalHazel;
    $("#final-title").textContent = scene.name + ": done!";
    var gr = $("#greeting"); gr.textContent = scene.greeting || ""; gr.hidden = !scene.greeting;
    var list = $("#recap"); list.innerHTML = "";
    scene.steps.forEach(function (s) {
      var t = toolById(s.tool), o = s.option ? optionById(s.tool, s.option) : null;
      var li = document.createElement("li");
      li.innerHTML = '<img src="' + t.icon + '" alt=""><span class="effect">' + s.instruction + '</span><span class="tool-used">' + t.label + (o ? " → " + o.label : "") + "</span>";
      list.appendChild(li);
    });
    show("final");
  }

  /* ---------- Boot ---------- */
  function init() {
    painter = new P($("#art"), $("#guide"));
    painter.setScene(D.scenes[0].id);
    buildToolbar(); buildPalette(); bindCanvas();
    $("#welcome-line").textContent = D.text.welcome;
    $("#menu-title").textContent = D.text.menuTitle;
    $("#menu-sub").textContent = D.text.menuSub;

    var imgs = {};
    D.options.stamp.items.forEach(function (it) { imgs[it.id] = it.img; });
    var fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    Promise.all([WSW.loadImages(imgs), fontsReady]).then(buildPreviews);

    $("#btn-start").addEventListener("click", function () { A.unlock(); A.play("good"); renderMenu(); });
    $("#btn-go").addEventListener("click", function () { A.unlock(); A.play("good"); startScene(); });
    $("#btn-brief-back").addEventListener("click", function () { A.play("click"); renderMenu(); });
    $("#btn-menu").addEventListener("click", function () { A.play("click"); disarm(); state.busy = true; renderMenu(); });
    $("#btn-again").addEventListener("click", function () { A.play("click"); openBrief(scene.id); });
    $("#btn-pick").addEventListener("click", function () { A.play("click"); renderMenu(); });
    $$(".btn-sound").forEach(function (b) {
      b.addEventListener("click", function () {
        A.unlock(); A.muted = !A.muted;
        $$(".btn-sound").forEach(function (x) { x.setAttribute("aria-pressed", A.muted); x.textContent = A.muted ? "Sound off" : "Sound on"; });
      });
    });
    window.addEventListener("resize", fit);
    fit();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
