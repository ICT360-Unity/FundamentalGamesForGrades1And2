/* Game flow: title → 4 rounds (each with an intro card) → end screen. */
(() => {
  const D = window.POSTMAN_DATA;
  const stage = document.getElementById("stage");
  const { h, img, wait } = UI;
  const ROUNDS = [Round1, Round2, Round3, Round4];
  const TOTAL_SHIELDS = Object.keys(D.round3.checkpoints).length;
  let stats;

  /* ---------- scale the 1130 x 502 stage to fit ---------- */
  function fit() {
    const s = Math.min(window.innerWidth / 1130, window.innerHeight / 502);
    stage.style.transform = `scale(${s})`;
    Drag.setScale(s);
  }
  window.addEventListener("resize", fit);
  fit();

  function resetStats() { stats = { items: 0, first: 0, streak: 0, best: 0, shields: 0 }; }
  function clear() { stage.innerHTML = ""; }

  /* ---------- title ---------- */
  function title() {
    clear();
    stage.append(
      img("city", "bg-city"),
      img("pip", "title-pip", "Pip the Internet Postman"),
      img("parcel", "title-parcel"),
      h("div", { class: "title-card pop" },
        h("h1", null, h("span", null, "Internet"), "Postman"),
        h("p", null, D.subtitle),
        h("button", { class: "btn", onclick: () => { Sound.unlock(); Sound.tap(); run(); } }, "Start delivering")));
  }

  /* ---------- game shell (HUD + play area + Pip bar) ---------- */
  function shell(r) {
    clear();
    const dots = h("div", { class: "hud-dots" });
    const shieldN = h("span", null, `${stats.shields}/${TOTAL_SHIELDS}`);
    const mute = h("button", { class: "hud-btn", "aria-label": "Sound on or off" }, Sound.muted ? "🔇" : "🔊");
    mute.addEventListener("click", () => { mute.textContent = Sound.toggle() ? "🔇" : "🔊"; });
    const back = h("button", { class: "hud-btn", "aria-label": "Back" }, "←");
    back.addEventListener("click", () => window.history.back());

    const play = h("div", { class: "play" });
    const sayEl = h("div", { class: "say" });
    let base = "", timer = null;

    function show(text, mood, flash) {
      sayEl.className = "say" + (mood ? " " + mood : "");
      sayEl.innerHTML = "";
      if (mood) sayEl.appendChild(h("span", { class: "say-ic" }, mood === "good" ? "✓" : "✗"));
      sayEl.appendChild(document.createTextNode(text));
      if (flash) UI.replay(sayEl, "flash");
    }

    stage.append(
      img("city", "bg-city"), h("div", { class: "dim" }), play,
      h("div", { class: "hud" }, back,
        h("div", { class: "hud-title" }, D.title),
        h("div", { class: "hud-round" }, `Round ${r.id} of ${D.rounds.length}: ${r.name}`),
        h("div", { class: "hud-spacer" }), dots,
        h("div", { class: "hud-shields", title: "Safety shields" }, img("shield", "", "Safety shields"), shieldN),
        mute),
      h("div", { class: "guide" }, img("pip", "", "Pip"), sayEl));

    return {
      stage, play, data: D,
      /* the current instruction: stays on screen */
      say(text) {
        base = text;
        clearTimeout(timer);
        show(text, "", true);
      },
      /* green / red feedback that shows briefly, then returns to the instruction */
      feedback(text, mood = "good", ms = 2800) {
        clearTimeout(timer);
        show(text, mood, true);
        if (ms) timer = setTimeout(() => show(base, "", false), ms);
      },
      record(ok) {
        stats.items++;
        if (ok) { stats.first++; stats.streak++; stats.best = Math.max(stats.best, stats.streak); }
        else stats.streak = 0;
      },
      shield() {
        stats.shields++;
        shieldN.textContent = `${stats.shields}/${TOTAL_SHIELDS}`;
        UI.replay(shieldN.parentElement, "pop");
      },
      setDots(total, current) {
        dots.innerHTML = "";
        const w = total > 6 ? 16 : 26;
        for (let i = 0; i < total; i++) {
          dots.appendChild(h("i", { class: i < current ? "done" : i === current ? "now" : "", style: `width:${w}px` }));
        }
      }
    };
  }

  function intro(ctx, r) {
    return new Promise((resolve) => {
      const go = h("button", { class: "btn" }, "Let's go");
      const card = h("div", { class: "intro-card pop" },
        h("div", { class: "stamp" }, `Round ${r.id}`),
        h("h2", null, r.name),
        h("p", { class: "teach" }, r.teach),
        h("p", { class: "task" }, r.task),
        go);
      ctx.play.appendChild(card);
      ctx.say("Press Let's go to start the round.");
      go.focus();
      go.addEventListener("click", () => { Sound.tap(); card.remove(); resolve(); }, { once: true });
    });
  }

  async function run() {
    resetStats();
    for (let i = 0; i < ROUNDS.length; i++) {
      const ctx = shell(D.rounds[i]);
      await intro(ctx, D.rounds[i]);
      await ROUNDS[i].start(ctx);
      await wait(300);
    }
    end();
  }

  /* ---------- end screen ---------- */
  function end() {
    clear();
    const acc = stats.items ? stats.first / stats.items : 0;
    const stars = acc >= 0.9 ? 3 : acc >= 0.65 ? 2 : 1;
    const msg = ["Good try, Postman!", "Great delivering!", "Super Internet Postman!"][stars - 1];
    Sound.win();

    const again = h("button", { class: "btn" }, "Play again");
    again.addEventListener("click", () => { Sound.tap(); run(); });

    stage.append(
      img("city", "bg-city"),
      h("div", { class: "end-card" },
        h("h2", null, msg),
        h("div", { class: "end-stars" }, [0, 1, 2].map((i) => img(i < stars ? "star" : "star-empty", "", i < stars ? "Star earned" : "Star"))),
        h("div", { class: "end-stats" },
          h("div", { class: "end-stat" }, h("b", null, Math.round(acc * 100) + "%"), h("span", null, "First-try answers")),
          h("div", { class: "end-stat" }, h("b", null, String(stats.best)), h("span", null, "Best streak")),
          h("div", { class: "end-stat" }, h("b", null, `${stats.shields}/${TOTAL_SHIELDS}`), h("span", null, "Safety shields"))),
        h("div", { class: "end-btns" }, again)));
  }

  title();
})();
