/* ROUND 4 — Sorting Office
   Drag each card into the Internet, Browser, Website or Link bin.
   The card stays full size on the belt and shrinks to fit when it is over a bin. */
const Round4 = (() => {
  const { h, replay } = UI;
  const MINI = 0.45;

  return {
    start(ctx) {
      return new Promise((resolve) => {
        const D = ctx.data.round4;
        const play = ctx.play;
        play.innerHTML = "";
        const counts = {};

        const belt = h("div", { class: "r4-belt" });
        const counter = h("div", { class: "r4-count" });
        const bins = D.bins.map((b) => {
          counts[b.id] = 0;
          const n = h("div", { class: "bin-n" }, "0 cards");
          const el = h("div", { class: "bin", "data-id": b.id },
            h("div", { class: "bin-mouth", style: `background:${b.color}; filter:brightness(.8)` }),
            h("div", { class: "bin-box", style: `background:${b.color}` },
              h("div", { class: "bin-name" }, b.name), n));
          el._n = n;
          return el;
        });
        play.append(belt, counter, h("div", { class: "r4-bins" }, bins));

        let i = 0;
        ctx.say("Drag each card into the bin where it belongs.");
        next();

        function next() {
          if (i >= D.cards.length) {
            ctx.setDots(D.cards.length, D.cards.length);
            ctx.feedback("The sorting office is all done!", "good", 0);
            setTimeout(resolve, 1400);
            return;
          }
          const c = D.cards[i];
          ctx.setDots(D.cards.length, i);
          counter.textContent = `Card ${i + 1} of ${D.cards.length}`;
          let firstTry = true;
          const card = h("div", { class: "r4-card arrive" + (c.text.length < 14 ? " short" : "") }, c.text);
          belt.appendChild(card);
          card.addEventListener("animationend", () => card.classList.remove("arrive"), { once: true });

          Drag.make(card, {
            targets: () => bins,
            onPick: ({ ox, oy }) => { card.style.transformOrigin = `${ox}px ${oy}px`; },
            onHover: (bin) => { card.style.scale = bin ? String(MINI) : "1"; },
            onDrop: (bin) => {
              const id = bin.dataset.id;
              const binName = D.bins.find((b) => b.id === id).name;
              if (id === c.bin) {
                card.dataset.locked = "1";
                card.style.scale = "0.1";
                card.style.opacity = "0";
                setTimeout(() => card.remove(), 220);
                counts[id]++;
                bin._n.textContent = counts[id] + (counts[id] === 1 ? " card" : " cards");
                replay(bin, "pop");
                Sound.good();
                ctx.record(firstTry);
                ctx.feedback(`Yes! That goes in ${binName}.`, "good", 1600);
                i++;
                setTimeout(next, 500);
                return true;
              }
              firstTry = false;
              Sound.bad();
              replay(bin, "shake");
              ctx.feedback(c.hint || `Not ${binName}. ${D.hints[id]}`, "bad", 3600);
              return false;
            }
          });
        }
      });
    }
  };
})();
