/* Pointer-based drag and drop that works with mouse and touch,
   and accounts for the stage being scaled to fit the screen.
   Movement uses the CSS `translate` property, so `scale` can be
   changed independently (Round 4 cards shrink over a bin). */
const Drag = (() => {
  let scale = 1;
  function setScale(s) { scale = s; }

  function hit(el, x, y) {
    const r = el.getBoundingClientRect();
    return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  }

  /*
    make(el, {
      targets: () => [elements],
      onDrop:  (target, el) => true | false   // true = handled, don't return
      onPick:  ({ ox, oy }) => void           // grab point inside el, stage px
      onHover: (target | null) => void
      enabled: () => boolean
    })
  */
  function make(el, opts) {
    let sx = 0, sy = 0, dragging = false, hover = null, pid = null;

    function setHover(t) {
      if (t === hover) return;
      if (hover) hover.classList.remove("drop-hover");
      hover = t;
      if (t) t.classList.add("drop-hover");
      if (opts.onHover) opts.onHover(t);
    }

    el.addEventListener("pointerdown", (e) => {
      if (el.dataset.locked === "1" || (opts.enabled && !opts.enabled())) return;
      e.preventDefault();
      pid = e.pointerId;
      el.setPointerCapture(pid);
      dragging = true;
      sx = e.clientX; sy = e.clientY;
      el.classList.remove("returning");
      el.classList.add("dragging");
      const r = el.getBoundingClientRect();
      if (opts.onPick) opts.onPick({ ox: (e.clientX - r.left) / scale, oy: (e.clientY - r.top) / scale });
      Sound.pick();
    });

    el.addEventListener("pointermove", (e) => {
      if (!dragging || e.pointerId !== pid) return;
      el.style.translate = `${(e.clientX - sx) / scale}px ${(e.clientY - sy) / scale}px`;
      setHover(opts.targets().find((t) => hit(t, e.clientX, e.clientY)) || null);
    });

    function end(e) {
      if (!dragging || e.pointerId !== pid) return;
      dragging = false;
      el.classList.remove("dragging");
      const target = hover;
      if (hover) hover.classList.remove("drop-hover");
      hover = null;
      const kept = target ? opts.onDrop(target, el) : false;
      if (!kept) {
        if (opts.onHover) opts.onHover(null);
        el.classList.add("returning");
        el.style.translate = "0px 0px";
      }
    }
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
  }

  return { make, setScale };
})();
