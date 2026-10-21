// Tiny Web Audio sound effects: no audio files needed.
let ctx = null;
let enabled = true;

export function setSoundEnabled(v) { enabled = v; }
export function isSoundEnabled() { return enabled; }

function tone(freq, start, dur, type = 'sine', gain = 0.12) {
  if (!ctx) return;
  const t = ctx.currentTime + start;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(ctx.destination);
  o.start(t);
  o.stop(t + dur + 0.05);
}

export function play(name) {
  if (!enabled) return;
  try {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
  } catch { return; }
  switch (name) {
    case 'tap':    tone(660, 0, 0.08, 'triangle', 0.08); break;
    case 'clue':   tone(520, 0, 0.1, 'triangle'); tone(780, 0.08, 0.14, 'triangle'); break;
    case 'key':    tone(523, 0, 0.12, 'triangle'); tone(659, 0.1, 0.12, 'triangle'); tone(784, 0.2, 0.22, 'triangle'); break;
    case 'right':  tone(587, 0, 0.12); tone(880, 0.1, 0.25); break;
    case 'oops':   tone(300, 0, 0.16, 'sine', 0.1); tone(240, 0.12, 0.22, 'sine', 0.1); break;
    case 'stamp':  tone(110, 0, 0.18, 'square', 0.06); tone(523, 0.15, 0.1); tone(659, 0.25, 0.1); tone(1047, 0.35, 0.35); break;
    case 'badge':  tone(988, 0, 0.1, 'triangle'); tone(1319, 0.08, 0.25, 'triangle'); break;
    default: break;
  }
}
