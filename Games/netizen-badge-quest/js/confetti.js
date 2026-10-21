/* Netizen Badge Quest — confetti bursts
   NBQConfetti.burst(element, colour, options) shoots confetti and a shine ring
   out of the centre of `element`. Particles live in #stage, so they work
   wherever the badge is (win card, badge strip, certificate). */
window.NBQConfetti = (function () {
  var STAGE_W = 1130;
  var PALETTE = ["#FFE27A", "#FF4FA3", "#2E7BD9", "#1E9E63", "#F2643C", "#FFFFFF", "#7A4FE0"];

  function reduced() {
    return window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function burst(el, colour, opts) {
    if (!el || reduced()) return;
    opts = opts || {};
    var count = opts.count || 30;
    var spread = opts.spread || 110;      // how far pieces fly (px)
    var size = opts.size || 1;            // piece size multiplier
    var stage = document.getElementById("stage");
    var sr = stage.getBoundingClientRect();
    var scale = sr.width / STAGE_W;
    var r = el.getBoundingClientRect();
    var cx = (r.left + r.width / 2 - sr.left) / scale;
    var cy = (r.top + r.height / 2 - sr.top) / scale;

    // shine ring
    var ring = document.createElement("span");
    ring.className = "burst-ring";
    var d = Math.max(r.width, r.height) / scale;
    ring.style.cssText = "left:" + cx + "px;top:" + cy + "px;width:" + d + "px;height:" + d + "px;border-color:" + colour;
    stage.appendChild(ring);
    ring.animate(
      [{ transform: "translate(-50%,-50%) scale(1)", opacity: 0.9 },
       { transform: "translate(-50%,-50%) scale(2.4)", opacity: 0 }],
      { duration: 650, easing: "ease-out" }
    ).onfinish = function () { ring.remove(); };

    // confetti pieces
    var colours = [colour, colour].concat(PALETTE);
    for (var i = 0; i < count; i++) {
      var p = document.createElement("span");
      var round = Math.random() < 0.35;
      var w = (round ? 7 : 5 + Math.random() * 4) * size;
      var h = (round ? 7 : 9 + Math.random() * 5) * size;
      p.className = "confetti";
      p.style.cssText = "left:" + cx + "px;top:" + cy + "px;width:" + w + "px;height:" + h + "px;" +
        "background:" + colours[i % colours.length] + ";border-radius:" + (round ? "50%" : "2px");
      stage.appendChild(p);

      var ang = (i / count) * Math.PI * 2 + Math.random() * 0.5;
      var dist = spread * (0.55 + Math.random() * 0.6);
      var dx = Math.cos(ang) * dist;
      var dy = Math.sin(ang) * dist - spread * 0.25;   // a little upward lift
      var rot = (Math.random() * 720 - 360);
      var fall = 40 + Math.random() * 50;              // gravity at the end

      p.animate([
        { transform: "translate(-50%,-50%) translate(0,0) rotate(0deg) scale(.4)", opacity: 1 },
        { transform: "translate(-50%,-50%) translate(" + dx + "px," + dy + "px) rotate(" + rot / 2 + "deg) scale(1)", opacity: 1, offset: 0.45 },
        { transform: "translate(-50%,-50%) translate(" + dx * 1.15 + "px," + (dy + fall) + "px) rotate(" + rot + "deg) scale(.9)", opacity: 0 }
      ], {
        duration: 1100 + Math.random() * 500,
        delay: Math.random() * 80,
        easing: "cubic-bezier(.15,.7,.4,1)",
        fill: "forwards"
      }).onfinish = (function (node) { return function () { node.remove(); }; })(p);
    }
  }

  return { burst: burst };
})();
