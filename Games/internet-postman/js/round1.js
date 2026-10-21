/* ROUND 1 — Address Workshop
   Drag tiles into the start / name / ending slots to build a website address. */
const Round1 = (() => {
  const { h, wait, shuffle, replay } = UI;

  function feedbackFor(D, p, slotIdx, tile) {
    const F = D.feedback;
    if (slotIdx === 0) return /w/.test(tile) ? F.spelling : F.startWrong;
    if (tile === p.address[0]) return F.wwwElsewhere;
    if (slotIdx === 1 && tile.startsWith(".")) return F.endingInMiddle;
    if (slotIdx === 2 && tile.startsWith(".")) return F.wrongEnding;
    return F.spelling;
  }

  function parcel(ctx, D, p, index) {
    return new Promise((resolve) => {
      const play = ctx.play;
      play.innerHTML = "";
      let mistakes = 0, filled = 0;
      const full = p.address[0] + "." + p.address[1] + p.address[2];

      const target = h("div", { class: "r1-target pop" }, "Address to build:", h("b", null, full));

      const slots = p.address.map((_, i) => {
        const s = h("div", { class: "r1-slot" + (i === 1 ? " wide" : ""), "data-i": i });
        if (p.showSlotNames) s.appendChild(h("span", { class: "slot-name" }, D.slotNames[i]));
        return s;
      });
      const strip = h("div", { class: "r1-strip" },
        h("div", { class: "r1-strip-title" }, "Website address"),
        slots[0], h("div", { class: "r1-dot" }, "."), slots[1], slots[2]);

      const tray = h("div", { class: "r1-tray" });
      shuffle(p.tiles).forEach((text) => {
        const tile = h("div", { class: "tile" }, text);
        tray.appendChild(tile);
        Drag.make(tile, {
          targets: () => slots.filter((s) => !s.classList.contains("filled")),
          onDrop: (slot) => {
            const i = +slot.dataset.i;
            if (text === p.address[i]) {
              slot.classList.add("filled");
              slot.insertBefore(document.createTextNode(text), slot.firstChild);
              tile.remove();
              Sound.good();
              filled++;
              if (filled === slots.length) finish();
              else ctx.feedback("Yes! Keep building the address.", "good", 1800);
              return true;
            }
            mistakes++;
            Sound.bad();
            replay(slot, "shake");
            ctx.feedback(feedbackFor(D, p, i, text), "bad");
            return false;
          }
        });
      });

      play.append(target, strip, tray);
      ctx.say(`Drag the tiles to build the website address for ${p.to}.`);

      async function finish() {
        ctx.record(mistakes === 0);
        tray.innerHTML = "";
        tray.appendChild(h("div", { class: "delivered" }, "Address ready!"));
        Sound.stamp();
        ctx.feedback(`${full} is ready!`, "good", 0);
        await wait(1700);
        resolve();
      }
    });
  }

  return {
    async start(ctx) {
      const D = ctx.data.round1;
      for (let i = 0; i < D.parcels.length; i++) {
        ctx.setDots(D.parcels.length, i);
        await parcel(ctx, D, D.parcels[i], i);
      }
      ctx.setDots(D.parcels.length, D.parcels.length);
    }
  };
})();
