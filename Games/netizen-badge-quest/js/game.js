/* =========================================================
   Netizen Badge Quest — game engine
   Screens: lock screen -> tablet home -> app scenario -> badge -> certificate
   ========================================================= */
(function () {
  "use strict";

  var DATA = window.NBQ_DATA;
  var S = DATA.scenarios;
  var SOUND = window.NBQSound;
  var OWL = "assets/mascot-owl.svg";
  var STAGE_W = 1130, STAGE_H = 502;

  var state = { earned: {}, count: 0, timers: [] };

  var stage = document.getElementById("stage");
  var sashGrid = document.getElementById("sash-grid");
  var sashCount = document.getElementById("sash-count");
  var body = document.getElementById("screen-body");
  var clock = document.getElementById("clock");
  var muteBtn = document.getElementById("mute");

  /* ---------- helpers ---------- */
  function byId(id) { for (var i = 0; i < S.length; i++) if (S[i].id === id) return S[i]; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function clearTimers() { state.timers.forEach(function (t) { clearInterval(t); clearTimeout(t); }); state.timers = []; }
  function timeStr() { var d = new Date(); return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }); }

  function fit() {
    var s = Math.min(window.innerWidth / STAGE_W, window.innerHeight / STAGE_H);
    stage.style.transform = "translate(-50%, -50%) scale(" + s + ")";
  }

  /* Move focus only for keyboard users, so mouse/touch players don't see focus rings jump around */
  var usingKeyboard = false;
  document.addEventListener("keydown", function (e) { if (e.key === "Tab" || e.key === "Enter" || e.key === " ") usingKeyboard = true; });
  document.addEventListener("pointerdown", function () { usingKeyboard = false; });

  function focusFirst(sel) {
    if (!usingKeyboard) return;
    var el = body.querySelector(sel);
    if (el) el.focus({ preventScroll: true });
  }

  /* ---------- badge sash ---------- */
  function renderSash(popId) {
    sashGrid.innerHTML = S.map(function (s) {
      var got = !!state.earned[s.id];
      return '<li class="patch' + (got ? " earned" : "") + (popId === s.id ? " pop" : "") + '" data-id="' + s.id + '" style="--c:' + s.color + '" ' +
        'aria-label="' + s.badge + (got ? ": earned" : ": not earned yet") + '">' +
        '<span class="patch-disc"><img src="' + s.icon + '" alt=""></span>' +
        '<span class="patch-name">' + s.badge + '</span></li>';
    }).join("");
    sashCount.textContent = state.count + " of " + S.length;
  }

  /* ---------- lock screen ---------- */
  function renderLock() {
    clearTimers();
    var d = new Date();
    body.innerHTML =
      '<div class="lock">' +
        '<p class="lock-time">' + timeStr() + '</p>' +
        '<p class="lock-date">' + d.toLocaleDateString([], { weekday: "long", day: "numeric", month: "long" }) + '</p>' +
        '<img class="lock-owl" src="' + OWL + '" alt="Nettie the owl">' +
        '<h1>' + DATA.title + '</h1>' +
        '<p class="lock-lead">Explore this tablet and make smart, safe choices. Each good choice earns a badge. Can you collect all ' + S.length + '?</p>' +
        '<button class="btn-primary" data-act="start">Start quest</button>' +
      '</div>';
    focusFirst("[data-act=start]");
  }

  /* ---------- home screen ---------- */
  function renderHome() {
    clearTimers();
    var left = S.length - state.count;
    var msg = state.count === 0
      ? "Hi, I'm Nettie! Tap an app. Make a smart choice to earn its badge."
      : left === 1 ? "Just one badge to go. You've got this!"
      : "Nice work! " + left + " badges to go. Pick another app.";
    body.innerHTML =
      '<div class="home">' +
        '<div class="home-top"><img class="home-owl" src="' + OWL + '" alt=""><p class="bubble">' + msg + '</p></div>' +
        '<div class="app-grid">' + S.map(function (s) {
          var done = !!state.earned[s.id];
          return '<button class="app" data-app="' + s.id + '" style="--c:' + s.color + '" aria-label="' + s.app + (done ? ", badge earned" : "") + '">' +
            '<span class="app-icon"><img src="' + s.icon + '" alt=""></span>' +
            '<span class="app-name">' + s.app + '</span>' +
            (done ? '<span class="app-done" aria-hidden="true">✓</span>' : "") + '</button>';
        }).join("") + '</div>' +
      '</div>';
    focusFirst(".app");
  }

  /* ---------- scenes ---------- */
  var SCENES = {
    popup: function () {
      return '<img class="fill" src="assets/scenes/game.svg" alt="A colourful platform game">' +
        '<div class="fake-popup key" role="img" aria-label="A pop-up says: You won! A free phone is waiting. Claim now.">' +
          '<div class="fp-bar"><span>Special offer</span><span class="fp-x">✕</span></div>' +
          '<p class="fp-big">YOU WON!</p>' +
          '<p class="fp-small">A FREE phone is waiting for you! 🎁</p>' +
          '<span class="fp-claim">CLAIM NOW</span>' +
          '<p class="fp-tiny">Offer ends in <span class="fp-count">00:09</span></p>' +
        '</div>';
    },
    chat: function (s) {
      var c = s.chat;
      return '<div class="sc-chat">' +
        '<div class="chat-head"><span class="avatar" style="--a:' + c.color + '">' + c.avatar + '</span><div><b>' + c.name + '</b><small>' + c.sub + '</small></div></div>' +
        '<div class="chat-log">' + c.msgs.map(function (m, i) {
          return '<p class="msg' + (m.mine ? " mine" : "") + (m.mean ? " mean" : "") + (m.key ? " key" : "") + '" style="animation-delay:' + (0.3 + i * 0.7) + 's">' +
            (c.group && !m.mine ? '<span class="from">' + m.from + '</span>' : "") + m.text + '</p>';
        }).join("") + '</div>' +
        '<div class="chat-input" aria-hidden="true">Type a message…</div>' +
      '</div>';
    },
    art: function () {
      return '<div class="sc-art">' +
        '<figure class="canvas"><img src="assets/scenes/riya-drawing.svg" alt="Riya\'s drawing of a rainbow, a smiling sun and a flower"><figcaption>by Riya, Class 3B</figcaption></figure>' +
        '<div class="art-msg"><span class="avatar" style="--a:#E86A92">K</span><p class="key"><b>Kabir</b>Riya\'s drawing is SO good! Let\'s post it on the class page and say we made it 😄</p></div>' +
      '</div>';
    },
    timer: function () {
      return '<div class="sc-timer">' +
        '<div class="ring key" role="img" aria-label="Timer at zero">' +
          '<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" fill="#fff" stroke="#F6DFAE" stroke-width="10"/><circle cx="60" cy="60" r="52" fill="none" stroke="#F2643C" stroke-width="10" stroke-dasharray="4 327" stroke-linecap="round" transform="rotate(-90 60 60)"/></svg>' +
          '<span class="ring-num">00:00</span></div>' +
        '<p class="timer-title">Play time is over! ⏰</p>' +
        '<p class="timer-sub">You played Candy Racer for 1 hour today.</p>' +
        '<p class="paused key">Paused on Level 7: almost finished!</p>' +
      '</div>';
    },
    photo: function () {
      return '<div class="sc-photo"><div class="post key">' +
        '<div class="post-head">New post <span>Post</span></div>' +
        '<div class="photo-wrap"><img src="assets/scenes/house-photo.svg" alt="A photo of you waving in front of your house. The house number 27 and a street sign that says Lotus Lane can be seen.">' +
          '<span class="hint-ring r1"></span><span class="hint-ring r2"></span></div>' +
        '<p class="post-cap">My house! 🏠 so happy today</p>' +
      '</div></div>';
    },
    video: function () {
      return '<div class="sc-video">' +
        '<div class="player"><img src="assets/scenes/dance-video.svg" alt="Meera dancing in her first dance video"><span class="play" aria-hidden="true">▶</span><div class="vbar"><span></span></div></div>' +
        '<div class="vmeta"><b>Meera\'s first dance video! 💃</b><small>Class 3B · 24 views</small></div>' +
        '<div class="comments"><p><b>Riya</b>So pretty!! 💖</p><p class="you key">Add your comment…</p></div>' +
      '</div>';
    },
    store: function () {
      return '<div class="sc-store">' +
        '<div class="store-card"><img class="store-thumb" src="assets/scenes/game.svg" alt="">' +
          '<div><h3>Super Candy Blast</h3><p class="store-meta">FREE · ⭐ 4.9 · Games</p><span class="store-get">GET</span></div></div>' +
        '<div class="perm key"><p class="perm-title">This app wants to use:</p>' +
          '<ul><li>📷 Your camera</li><li>📒 Your contacts</li><li>📍 Your location</li><li>💳 In-app purchases</li></ul></div>' +
      '</div>';
    }
  };

  /* ---------- app view ---------- */
  function openApp(id) {
    clearTimers();
    var s = byId(id);
    body.innerHTML =
      '<div class="app-view" style="--c:' + s.color + '">' +
        '<header class="app-bar"><button class="home-btn" data-act="home">⌂ Home</button>' +
          '<img src="' + s.icon + '" alt=""><h2>' + s.app + '</h2></header>' +
        '<div class="app-body"></div>' +
      '</div>';
    var appBody = body.querySelector(".app-body");

    if (s.type === "password") {
      window.NBQPassword.render(appBody, s, DATA, { sound: SOUND, win: function (panel) { win(s, panel); } });
      focusFirst(".tile");
      return;
    }

    var order = shuffle(s.choices.map(function (c, i) { return i; }));
    appBody.innerHTML =
      '<div class="scene"><div class="laptop">' +
        '<div class="lid"><span class="cam" aria-hidden="true"></span><div class="display">' + SCENES[s.type](s) + '</div></div>' +
        '<div class="base" aria-hidden="true"><span class="notch"></span></div>' +
      '</div></div>' +
      '<aside class="panel">' +
        askCard('<span class="watch">Watch the screen<span class="dots" aria-hidden="true"><i></i><i></i><i></i></span></span>') +
        '<div class="choices" role="group" aria-label="Choices">' + order.map(function (i) {
          return '<button class="choice" data-i="' + i + '">' + s.choices[i].text + '</button>';
        }).join("") + '</div>' +
        '<div class="feedback" aria-live="polite"></div>' +
      '</aside>';

    if (s.type === "popup") startPopupCountdown();

    var panel = appBody.querySelector(".panel");
    var fb = appBody.querySelector(".feedback");
    var scene = appBody.querySelector(".scene");
    var ready = false;

    /* Step 1: the scene plays. Step 2: the scene's key detail lights up in the
       app colour, the question appears in a matching card that points at it,
       then the choices slide in. Tapping anywhere skips the wait. */
    function reveal() {
      if (ready) return;
      ready = true;
      panel.querySelector(".ask-q").textContent = s.question;
      scene.classList.add("cue");
      panel.classList.add("ready");
      focusFirst(".choice");
    }
    state.timers.push(setTimeout(reveal, introDelay(s)));
    appBody.addEventListener("click", function () { if (!ready) reveal(); }, true);

    panel.addEventListener("click", function (ev) {
      if (!ready) return;
      var b = ev.target.closest(".choice");
      if (!b || b.classList.contains("tried")) return;
      var c = s.choices[+b.dataset.i];
      if (c.ok) {
        var sc = appBody.querySelector(".scene");
        if (sc) sc.classList.add("solved");
        win(s, panel);
      } else {
        SOUND.nudge();
        b.classList.add("tried");
        b.setAttribute("aria-disabled", "true");
        fb.innerHTML = '<div class="nudge"><strong>Hmm, think again.</strong>' + c.why + '</div>';
      }
    });
  }

  function askCard(inner) {
    return '<div class="ask" aria-live="polite">' +
      '<div class="ask-head"><img class="ask-owl" src="' + OWL + '" alt=""><span class="ask-who">Nettie asks</span></div>' +
      '<p class="ask-q">' + inner + '</p></div>';
  }

  /* How long the scene plays before the question shows (ms) */
  function introDelay(s) {
    if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return 0;
    if (s.type === "chat") return (0.3 + 0.7 * (s.chat.msgs.length - 1) + 0.35) * 1000 + 700;
    return 1300;
  }
  window.NBQAskCard = askCard;

  function startPopupCountdown() {
    var n = 9;
    state.timers.push(setInterval(function () {
      n = n <= 1 ? 9 : n - 1;
      var el = body.querySelector(".fp-count");
      if (el) el.textContent = "00:0" + n;
    }, 1000));
  }

  /* ---------- badge earned ---------- */
  function win(s, panel) {
    clearTimers();
    var isNew = !state.earned[s.id];
    if (isNew) { state.earned[s.id] = true; state.count++; }
    renderSash(isNew ? s.id : null);
    SOUND.badge();
    var allDone = state.count === S.length;
    panel.innerHTML =
      '<div class="win" style="--c:' + s.color + '">' +
        '<span class="win-patch"><img src="' + s.icon + '" alt=""></span>' +
        '<p class="win-label">' + (isNew ? "Badge earned!" : "Badge already earned") + '</p>' +
        '<h3>' + s.badge + '</h3>' +
        '<p class="win-rule">Rule ' + s.n + ': ' + s.rule + '</p>' +
        '<p class="win-text">' + s.success + '</p>' +
        '<button class="btn-primary" data-act="' + (allDone ? "cert" : "home") + '">' + (allDone ? "See my certificate" : "Back to home") + '</button>' +
      '</div>';
    var btn = panel.querySelector(".btn-primary");
    if (btn && usingKeyboard) btn.focus({ preventScroll: true });

    /* Confetti: first out of the big badge, then out of its patch on the strip */
    var C = window.NBQConfetti;
    state.timers.push(setTimeout(function () {
      C.burst(panel.querySelector(".win-patch"), s.color, { count: 34, spread: 120 });
    }, 180));
    if (isNew) state.timers.push(setTimeout(function () {
      C.burst(document.querySelector('.patch[data-id="' + s.id + '"] .patch-disc'), s.color, { count: 20, spread: 70, size: 0.8 });
    }, 520));
  }

  /* ---------- certificate ---------- */
  function renderCert() {
    clearTimers();
    SOUND.fanfare();
    body.innerHTML =
      '<div class="cert">' +
        '<div class="cert-badges" aria-hidden="true">' + S.map(function (s, i) {
          return '<span style="--c:' + s.color + ';animation-delay:' + (i * 0.08) + 's"><img src="' + s.icon + '" alt=""></span>';
        }).join("") + '</div>' +
        '<h2>You\'re a Super Netizen!</h2>' +
        '<p class="cert-lead">You earned all ' + S.length + ' badges. Here are the rules you now know:</p>' +
        '<ol class="cert-rules">' + S.map(function (s) { return '<li>' + s.rule + '</li>'; }).join("") + '</ol>' +
        '<button class="btn-primary" data-act="again">Play again</button>' +
      '</div>';
    focusFirst("[data-act=again]");
    /* Confetti out of every badge, one after another */
    body.querySelectorAll(".cert-badges span").forEach(function (el, i) {
      state.timers.push(setTimeout(function () {
        window.NBQConfetti.burst(el, S[i].color, { count: 14, spread: 80, size: 0.8 });
      }, 450 + i * 110));
    });
  }

  /* ---------- events ---------- */
  body.addEventListener("click", function (ev) {
    var app = ev.target.closest("[data-app]");
    if (app) { SOUND.tap(); openApp(app.dataset.app); return; }
    var act = ev.target.closest("[data-act]");
    if (!act) return;
    var a = act.dataset.act;
    if (a === "start") { SOUND.tap(); renderHome(); }
    else if (a === "home") { SOUND.tap(); renderHome(); }
    else if (a === "cert") { renderCert(); }
    else if (a === "again") { state.earned = {}; state.count = 0; renderSash(); renderHome(); }
  });

  muteBtn.addEventListener("click", function () {
    var m = !SOUND.isMuted();
    SOUND.setMuted(m);
    muteBtn.textContent = m ? "🔇" : "🔊";
    muteBtn.setAttribute("aria-label", m ? "Sound off. Turn sound on" : "Sound on. Turn sound off");
  });

  function tick() { clock.textContent = timeStr(); }

  /* ---------- boot ---------- */
  window.addEventListener("resize", fit);
  fit();
  tick(); setInterval(tick, 30000);
  renderSash();
  renderLock();
})();
