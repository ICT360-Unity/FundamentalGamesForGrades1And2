/* Tiny Web Audio sound kit — every sound is synthesised, so there are no audio files to load. */
window.WSW = window.WSW || {};
WSW.Audio = {
  ctx: null,
  muted: false,
  lastDab: 0,

  unlock: function () {
    if (!this.ctx) {
      try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { this.ctx = null; }
    }
    if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
  },

  tone: function (freq, dur, type, vol, delay, slideTo) {
    var c = this.ctx;
    if (!c) return;
    var t = c.currentTime + (delay || 0);
    var o = c.createOscillator();
    var g = c.createGain();
    o.type = type || "sine";
    o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol || 0.06, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(c.destination);
    o.start(t); o.stop(t + dur + 0.02);
  },

  play: function (name) {
    if (this.muted || !this.ctx) return;
    switch (name) {
      case "click": this.tone(700, 0.05, "triangle", 0.04); break;
      case "good":  this.tone(660, 0.1, "triangle", 0.06); this.tone(990, 0.14, "triangle", 0.06, 0.08); break;
      case "oops":  this.tone(260, 0.16, "sine", 0.07, 0, 200); break;
      case "pour":  this.tone(240, 0.9, "sine", 0.05, 0, 760); break;
      case "stamp": this.tone(150, 0.09, "square", 0.035); this.tone(520, 0.06, "triangle", 0.04, 0.05); break;
      case "save":  this.tone(784, 0.1, "triangle", 0.06); this.tone(1175, 0.18, "triangle", 0.06, 0.09); break;
      case "dab":
        var now = performance.now();
        if (now - this.lastDab < 70) return;
        this.lastDab = now;
        this.tone(320 + Math.random() * 160, 0.05, "triangle", 0.025);
        break;
      case "done":
        var notes = [523, 659, 784, 1047];
        for (var i = 0; i < notes.length; i++) this.tone(notes[i], 0.18, "triangle", 0.06, i * 0.09);
        break;
    }
  }
};
