/* Memory Movers | js/main.js
   Scales the 1130 x 502 stage to the window and starts the game. */
"use strict";
// ------------------------------------------------------------------ fit stage to window
function fit() {
  const s = Math.min(window.innerWidth / 1130, window.innerHeight / 502);
  stage.style.transform = `scale(${s})`;
}
window.addEventListener("resize", fit); fit();
showTitle();
