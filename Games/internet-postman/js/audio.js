/* Synthesized sound effects (Web Audio API, no audio files). */
const Sound = (() => {
  let ctx = null;
  let muted = false;

  function ac() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function tone(freq, start, dur, type = "sine", vol = 0.18, slideTo = null) {
    const c = ac(); if (!c || muted) return;
    const t = c.currentTime + start;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(c.destination);
    o.start(t); o.stop(t + dur + 0.05);
  }

  function noise(start, dur, vol = 0.12, freq = 1200) {
    const c = ac(); if (!c || muted) return;
    const t = c.currentTime + start;
    const len = Math.floor(c.sampleRate * dur);
    const buf = c.createBuffer(1, len, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = c.createBufferSource(); src.buffer = buf;
    const f = c.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = freq;
    const g = c.createGain(); g.gain.value = vol;
    src.connect(f); f.connect(g); g.connect(c.destination);
    src.start(t);
  }

  return {
    unlock() { ac(); },
    get muted() { return muted; },
    toggle() { muted = !muted; return muted; },
    tap()    { tone(660, 0, 0.06, "triangle", 0.12); },
    pick()   { tone(520, 0, 0.08, "triangle", 0.12, 700); },
    drop()   { tone(380, 0, 0.08, "triangle", 0.14); },
    good()   { tone(660, 0, 0.12, "triangle"); tone(990, 0.1, 0.18, "triangle"); },
    bad()    { tone(220, 0, 0.18, "square", 0.08, 160); },
    knock()  { noise(0, 0.07, 0.3, 400); noise(0.14, 0.07, 0.3, 400); },
    whoosh() { noise(0, 0.35, 0.18, 1800); },
    stamp()  { noise(0, 0.08, 0.35, 250); tone(140, 0, 0.12, "sine", 0.2); },
    shield() { [523, 659, 784].forEach((f, i) => tone(f, i * 0.08, 0.16, "triangle", 0.15)); },
    win()    { [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.12, 0.25, "triangle", 0.16)); },
    load()   { tone(300, 0, 0.6, "sine", 0.05, 900); }
  };
})();
