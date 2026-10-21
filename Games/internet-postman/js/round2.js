/* ROUND 2 — Open the Right Door
   Step 1 (once): connect the computer to the internet.
   Then for each parcel: choose a browser door, drop the address in the address bar, press Go. */
const Round2 = (() => {
  const { h, img, wait, shuffle, replay } = UI;

  function connect(ctx, D) {
    return new Promise((resolve) => {
      const play = ctx.play;
      play.innerHTML = "";
      const gap = h("div", { class: "r2-gap" });
      const cable = img("cable", "r2-cable", "Internet cable");
      const status = h("div", { class: "status" }, "No internet connection");
      play.appendChild(h("div", { class: "r2-connect pop" },
        status,
        h("div", { class: "r2-net" }, img("network-computer", "pc", "Computer"), gap, img("network-cloud", "cloud", "Internet")),
        cable));
      ctx.say(D.connectIntro);

      Drag.make(cable, {
        targets: () => [gap],
        onDrop: async () => {
          cable.dataset.locked = "1";
          cable.style.translate = "";
          gap.classList.add("fixed");
          gap.appendChild(cable);
          status.textContent = "Connected to the internet";
          status.classList.add("on");
          Sound.good();
          ctx.feedback(D.connected, "good", 0);
          await wait(2200);
          resolve();
          return true;
        }
      });
    });
  }

  function parcel(ctx, D, p, index) {
    return new Promise((resolve) => {
      const play = ctx.play;
      play.innerHTML = "";
      let wrongs = 0, chosen = false;

      const ticket = h("div", { class: "r2-ticket pop" }, `Parcel ${index + 1}:`, h("b", null, p.address));
      const street = h("div", { class: "r2-street" });

      shuffle(D.doors).forEach((d) => {
        const door = h("button", { class: "door", "aria-label": d.name },
          img(d.icon), h("div", { class: "door-name" }, d.name),
          h("span", { class: "knob" }), h("span", { class: "step" }));
        door.addEventListener("click", () => {
          if (chosen) return;
          Sound.knock();
          if (d.kind === "browser") {
            chosen = true;
            ctx.record(wrongs === 0);
            Sound.good();
            street.classList.add("away");
            ctx.feedback(`${d.name} ${D.rightDoor}`, "good", 2000);
            openBrowser(d);
          } else {
            wrongs++;
            Sound.bad();
            door.classList.add("nope");
            replay(door, "shake");
            ctx.feedback(d.msg, "bad", 3400);
          }
        });
        street.appendChild(door);
      });

      play.append(ticket, street);
      ctx.say(`Knock on a browser door to visit ${p.address}.`);

      function openBrowser(d) {
        ticket.style.display = "none";
        const tabLabel = h("span", null, "New tab");
        const addr = h("div", { class: "bw-addr empty" }, "Drop the address here");
        const go = h("button", { class: "bw-go", disabled: true }, "Go");
        const load = h("div", { class: "bw-load" });
        const body = h("div", { class: "bw-body" }, load,
          h("div", { class: "r2-newtab" }, img(d.icon), `${d.name} is open. Where should it take you?`));

        const win = h("div", { class: "bw pop", style: "left:115px; top:2px; width:900px; height:284px; z-index:5" },
          h("div", { class: "bw-tabs" }, h("div", { class: "bw-tab" }, img(d.icon), tabLabel)),
          h("div", { class: "bw-bar" },
            h("span", { class: "bw-nav", disabled: true }, "‹"),
            h("span", { class: "bw-nav", disabled: true }, "›"),
            h("span", { class: "bw-nav", disabled: true }, "↻"),
            addr, go),
          body);

        const card = h("div", { class: "r2-addrcard", style: "left:0; right:0; margin:0 auto; width:300px; top:300px; text-align:center; z-index:6" }, p.address);
        play.append(win, card);
        ctx.say("Drag the address into the address bar at the top.");

        Drag.make(card, {
          targets: () => [addr],
          onDrop: () => {
            card.remove();
            addr.classList.remove("empty");
            addr.textContent = p.address;
            Sound.drop();
            go.disabled = false;
            go.classList.add("pulse");
            ctx.say("Now press Go!");
            return true;
          }
        });

        go.addEventListener("click", async () => {
          go.disabled = true;
          go.classList.remove("pulse");
          Sound.load();
          replay(load, "run");
          await wait(950);
          [...body.children].forEach((c) => c !== load && c.remove());
          tabLabel.textContent = p.site;
          body.appendChild(h("div", { class: "r2-site" },
            h("div", { class: "r2-site-head" }, p.site),
            h("div", { class: "r2-site-body" }, h("div", { class: "delivered" }, "Delivered!"))));
          Sound.stamp();
          ctx.feedback(`${d.name} opened ${p.address}. Parcel delivered!`, "good", 0);
          await wait(1900);
          resolve();
        });
      }
    });
  }

  return {
    async start(ctx) {
      const D = ctx.data.round2;
      ctx.setDots(D.parcels.length, 0);
      await connect(ctx, D);
      for (let i = 0; i < D.parcels.length; i++) {
        ctx.setDots(D.parcels.length, i);
        await parcel(ctx, D, D.parcels[i], i);
      }
      ctx.setDots(D.parcels.length, D.parcels.length);
    }
  };
})();
