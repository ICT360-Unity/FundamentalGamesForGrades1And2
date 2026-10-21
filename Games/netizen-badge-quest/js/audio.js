/* Netizen Badge Quest — tiny Web Audio sound effects (no audio files needed) */
window.NBQSound = (function () {
  var ctx = null, muted = false;

  function ac() {
    if (!ctx) {
      var C = window.AudioContext || window.webkitAudioContext;
      if (!C) return null;
      ctx = new C();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function tone(freq, dur, type, delay, vol) {
    if (muted) return;
    var c = ac(); if (!c) return;
    var o = c.createOscillator(), g = c.createGain();
    var t = c.currentTime + (delay || 0);
    o.type = type || "sine";
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol || 0.12, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(c.destination);
    o.start(t); o.stop(t + dur + 0.05);
  }

  return {
    tap:     function () { tone(660, 0.08, "triangle", 0, 0.07); },
    nudge:   function () { tone(392, 0.18, "sine", 0, 0.11); tone(330, 0.26, "sine", 0.14, 0.11); },
    badge:   function () { [523, 659, 784, 1047].forEach(function (f, i) { tone(f, 0.22, "triangle", i * 0.09, 0.13); }); },
    fanfare: function () { [523, 659, 784, 659, 784, 1047].forEach(function (f, i) { tone(f, 0.3, "triangle", i * 0.13, 0.13); }); },
    setMuted: function (m) { muted = m; },
    isMuted:  function () { return muted; }
  };
})();
