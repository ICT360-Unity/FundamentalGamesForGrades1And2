// Read-aloud support for early readers, using the browser's built-in voice.
export const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window;

export function speak(text) {
  if (!canSpeak || !text) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text.replace(/["“”]/g, ''));
  u.rate = 0.92;
  u.pitch = 1.05;
  const voices = window.speechSynthesis.getVoices();
  const v = voices.find((x) => /en-IN/i.test(x.lang)) || voices.find((x) => /^en/i.test(x.lang));
  if (v) u.voice = v;
  window.speechSynthesis.speak(u);
}

export function stopSpeaking() { if (canSpeak) window.speechSynthesis.cancel(); }
