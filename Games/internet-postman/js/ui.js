/* Small DOM helpers shared by all rounds. */
const UI = (() => {
  function h(tag, props, ...kids) {
    const el = document.createElement(tag);
    if (props) {
      for (const [k, v] of Object.entries(props)) {
        if (v == null || v === false) continue;
        if (k === "class") el.className = v;
        else if (k === "text") el.textContent = v;
        else if (k === "html") el.innerHTML = v;
        else if (k === "style") el.style.cssText = v;
        else if (k.startsWith("on") && typeof v === "function") el.addEventListener(k.slice(2).toLowerCase(), v);
        else el.setAttribute(k, v === true ? "" : v);
      }
    }
    for (const kid of kids.flat()) {
      if (kid == null || kid === false) continue;
      el.appendChild(typeof kid === "string" || typeof kid === "number" ? document.createTextNode(kid) : kid);
    }
    return el;
  }

  function img(name, cls, alt = "") {
    return h("img", { src: A(name), class: cls, alt, draggable: "false" });
  }

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function replay(el, cls) {
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
  }

  function toast(stage, text, bad = false) {
    const t = h("div", { class: "toast" + (bad ? " bad" : "") }, text);
    stage.appendChild(t);
    setTimeout(() => t.remove(), 1700);
  }

  /* Shows a modal and resolves when close() is called. */
  function modal(stage, content) {
    const wrap = h("div", { class: "modal-wrap" }, h("div", { class: "modal" }, content));
    stage.appendChild(wrap);
    return () => wrap.remove();
  }

  return { h, img, wait, shuffle, replay, toast, modal };
})();
