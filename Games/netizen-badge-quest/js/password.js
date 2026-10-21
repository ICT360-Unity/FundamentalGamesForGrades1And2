/* Netizen Badge Quest — Password Lab (rule 6)
   Players build a password from word / number / symbol tiles.
   Nothing is ever typed. A strength meter fills as checks are met. */
window.NBQPassword = (function () {
  var OWL = "assets/mascot-owl.svg";

  var CHECKS = [
    { k: "words", label: "Two fun words" },
    { k: "num",   label: "A number" },
    { k: "sym",   label: "A symbol" },
    { k: "easy",  label: "Nothing easy to guess" }
  ];
  var LEVELS = [
    { label: "Empty",          color: "#E25563" },
    { label: "Weak",           color: "#E25563" },
    { label: "Okay",           color: "#F0A020" },
    { label: "Getting there",  color: "#8BC34A" },
    { label: "Strong!",        color: "#1E9E63" }
  ];

  function render(body, s, data, api) {
    var tiles = [];          // { t, kind, trap, warn, key }
    var max = data.passwordMaxTiles || 6;
    var T = data.passwordTiles;

    function row(kind, label) {
      return '<div class="tile-row"><span class="tile-row-label">' + label + '</span>' +
        T[kind].map(function (x, i) {
          return '<button class="tile ' + kind + '" data-kind="' + kind + '" data-i="' + i + '">' + x.t + '</button>';
        }).join("") + '</div>';
    }

    body.innerHTML =
      '<div class="pw-main">' +
        '<p class="pw-lead">Tap tiles to build a password. Tap one in the box to remove it.</p>' +
        '<div class="pw-box" aria-live="polite" aria-label="Your password"><span class="pw-placeholder">Your password appears here</span></div>' +
        '<div class="meter" role="meter" aria-label="Password strength" aria-valuemin="0" aria-valuemax="4" aria-valuenow="0"><div class="meter-fill"></div></div>' +
        '<p class="meter-label">Strength: Empty</p>' +
        row("word", "Words") + row("num", "Numbers") + row("sym", "Symbols") +
        '<p class="pw-note">Practice only. Make your real passwords at home with a grown-up.</p>' +
      '</div>' +
      '<aside class="panel pw-panel">' +
        window.NBQAskCard('Make it strong! Never use your name or birthday.') +
        '<ul class="checks">' + CHECKS.map(function (c) { return '<li data-k="' + c.k + '">' + c.label + '</li>'; }).join("") + '</ul>' +
        '<div class="feedback" aria-live="polite"></div>' +
        '<button class="btn-primary pw-check" disabled>Lock it in</button>' +
      '</aside>';

    var box = body.querySelector(".pw-box");
    var fill = body.querySelector(".meter-fill");
    var meter = body.querySelector(".meter");
    var mLabel = body.querySelector(".meter-label");
    var fb = body.querySelector(".feedback");
    var btn = body.querySelector(".pw-check");
    var panel = body.querySelector(".pw-panel");

    function evaluate() {
      var goodWords = tiles.filter(function (x) { return x.kind === "word" && !x.trap; }).length;
      var res = {
        words: goodWords >= 2,
        num: tiles.some(function (x) { return x.kind === "num" && !x.trap; }),
        sym: tiles.some(function (x) { return x.kind === "sym"; }),
        easy: tiles.length > 0 && !tiles.some(function (x) { return x.trap; })
      };
      var score = (res.words ? 1 : 0) + (res.num ? 1 : 0) + (res.sym ? 1 : 0) + (res.easy ? 1 : 0);
      var trapped = tiles.some(function (x) { return x.trap; });
      if (tiles.length === 0) score = 0;
      if (trapped) score = Math.min(score, 1);
      return { res: res, score: score, trapped: trapped };
    }

    function update(lastAdded) {
      box.innerHTML = tiles.length
        ? tiles.map(function (x, i) { return '<button class="tile ' + x.kind + '" data-slot="' + i + '" aria-label="Remove ' + x.t + '">' + x.t + '</button>'; }).join("")
        : '<span class="pw-placeholder">Your password appears here</span>';

      body.querySelectorAll(".tile-row .tile").forEach(function (b) {
        var key = b.dataset.kind + b.dataset.i;
        b.disabled = tiles.length >= max || tiles.some(function (x) { return x.key === key; });
      });

      var e = evaluate();
      CHECKS.forEach(function (c) {
        var li = body.querySelector('.checks li[data-k="' + c.k + '"]');
        li.classList.toggle("met", !!e.res[c.k]);
        li.classList.toggle("bad", c.k === "easy" && e.trapped);
      });
      var lvl = e.trapped ? { label: "Easy to guess", color: "#E25563" } : LEVELS[e.score];
      fill.style.width = (e.score / 4 * 100) + "%";
      fill.style.backgroundColor = lvl.color;
      meter.setAttribute("aria-valuenow", e.score);
      mLabel.textContent = "Strength: " + lvl.label;
      btn.disabled = e.score < 4;

      if (lastAdded && lastAdded.trap) {
        api.sound.nudge();
        fb.innerHTML = '<div class="nudge"><strong>Hmm, think again.</strong>' + lastAdded.warn + '</div>';
      } else if (!e.trapped) {
        fb.innerHTML = tiles.length >= max && e.score < 4
          ? '<div class="nudge"><strong>The box is full.</strong>Tap a tile in the box to swap it out.</div>'
          : "";
      }
    }

    body.addEventListener("click", function (ev) {
      var b = ev.target.closest(".tile");
      if (!b || b.disabled) return;
      if (b.dataset.slot !== undefined) {
        tiles.splice(+b.dataset.slot, 1);
        api.sound.tap();
        update();
        return;
      }
      var src = T[b.dataset.kind][+b.dataset.i];
      var t = { t: src.t, kind: b.dataset.kind, trap: !!src.trap, warn: src.warn, key: b.dataset.kind + b.dataset.i };
      tiles.push(t);
      if (!t.trap) api.sound.tap();
      update(t);
    });

    btn.addEventListener("click", function () {
      if (evaluate().score < 4) return;
      body.querySelectorAll(".tile").forEach(function (b) { b.disabled = true; });
      api.win(panel);
    });
  }

  return { render: render };
})();
