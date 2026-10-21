/* ROUND 3 — Secret Doors
   Help a friend find a page by clicking links (secret doors).
   Safety stops come between the missions. */
const Round3 = (() => {
  const { h, img, wait, shuffle } = UI;

  /* ---------- safety stop ---------- */
  function safetyStop(ctx, cp) {
    return new Promise((resolve) => {
      ctx.play.innerHTML = "";
      let missed = false, done = false;
      const fb = h("div", { class: "cp-fb" });
      const cont = h("button", { class: "btn blue small", style: "visibility:hidden" }, "Continue");
      const choices = h("div", { class: "cp-choices" });

      let extra = null;
      if (cp.kind === "form") extra = h("div", { class: "cp-fake" }, h("div", null, "Your name"), h("div", null, "Home address"));
      if (cp.kind === "chat") extra = h("div", { class: "cp-bubble" }, cp.prompt);

      shuffle(cp.choices).forEach((c) => {
        const b = h("button", { class: "cp-choice" }, c.text);
        b.addEventListener("click", () => {
          if (done) return;
          fb.innerHTML = "";
          if (c.ok) {
            done = true;
            b.classList.add("ok");
            if (!missed) { ctx.shield(); Sound.shield(); fb.appendChild(img("shield", "", "Safety shield")); }
            else Sound.good();
            fb.appendChild(h("div", null,
              h("div", { class: "cp-tip" }, (missed ? "" : "Shield earned! ") + "Tip: " + cp.tip), c.fb));
            ctx.feedback(missed ? "That's the safe choice." : "Safe choice! You earned a shield.", "good", 0);
            cont.style.visibility = "visible";
            cont.focus();
          } else {
            missed = true;
            b.classList.add("no");
            Sound.bad();
            fb.appendChild(h("div", null, c.fb));
            ctx.feedback("Not safe. Try the other choice.", "bad", 0);
          }
        });
        choices.appendChild(b);
      });

      ctx.play.appendChild(h("div", { class: "cp-card pop" },
        h("div", { class: "cp-head " + cp.kind }, cp.heading, h("span", { class: "stamp-mini" }, "Safety stop")),
        h("div", { class: "cp-body" },
          cp.kind === "chat" ? null : h("div", { class: "cp-prompt" }, cp.prompt),
          extra, choices, fb, h("div", { class: "cp-foot" }, cont))));
      ctx.say("Safety stop! What is the safe thing to do?");
      cont.addEventListener("click", () => { Sound.tap(); resolve(); });
    });
  }

  /* ---------- one mission ---------- */
  function mission(ctx, D, m) {
    return new Promise((resolve) => {
      const play = ctx.play;
      play.innerHTML = "";
      let mistakes = 0, finished = false;
      const history = [];

      const addr = h("div", { class: "bw-addr" });
      const back = h("button", { class: "bw-nav", "aria-label": "Back" }, "‹");
      const tab = h("span");
      const body = h("div", { class: "bw-body" });
      play.appendChild(h("div", { class: "bw r3-browser pop" },
        h("div", { class: "bw-tabs" }, h("div", { class: "bw-tab" }, img("icon-browser-2"), tab)),
        h("div", { class: "bw-bar" }, back,
          h("span", { class: "bw-nav", disabled: true }, "›"),
          h("span", { class: "bw-nav", disabled: true }, "↻"), addr),
        body));

      ctx.say(m.goal);

      back.addEventListener("click", () => {
        if (history.length < 2 || finished) return;
        Sound.tap();
        history.pop();
        render(history[history.length - 1], false);
      });

      function go(id) { history.push(id); render(id, true); }

      function linkBtn(text, target) {
        const b = h("button", { class: "r3-link" }, text);
        b.addEventListener("click", () => { if (finished) return; Sound.tap(); go(target); });
        return b;
      }

      function render(id, fresh) {
        back.disabled = history.length < 2;
        body.innerHTML = "";
        if (id === "results") return renderResults();
        const pg = m.pages[id];
        tab.textContent = pg.site;
        addr.textContent = pg.url;

        const page = h("div", { class: "r3-page" },
          h("div", { class: "r3-sitehead" }, h("span", { class: "site" }, pg.site), h("h3", null, pg.title)));
        if (m.chapters) {
          const row = h("div", { class: "r3-chapters" });
          m.chapters.forEach((c) => row.appendChild(linkBtn(c.text, c.go)));
          page.appendChild(row);
        }
        pg.blocks.forEach((b) => {
          if (b.t === "link") { page.appendChild(h("div", { class: "r3-linkrow" }, linkBtn(b.text, b.go))); return; }
          const p = h("p", { class: "r3-p" }, b.t === "bold" ? h("span", { class: "r3-bold" }, b.text) : b.text);
          if (id !== m.target) {
            p.addEventListener("click", () => {
              if (finished) return;
              mistakes++;
              Sound.bad();
              ctx.feedback(b.t === "bold" ? D.boldNotLink : D.plainNotLink, "bad");
            });
          }
          page.appendChild(p);
        });
        body.appendChild(page);

        if (id === m.target) return found(page);
        if (fresh && id !== m.start && m.wrongPage) {
          mistakes++;
          Sound.bad();
          ctx.feedback(m.wrongPage.replace("{title}", pg.title), "bad", 3400);
        }
      }

      function renderResults() {
        tab.textContent = `${m.search} - ${D.searchSite}`;
        addr.textContent = "www.searchstreet.com";
        const page = h("div", { class: "r3-page" },
          h("div", { class: "r3-sbox" }, m.search),
          h("div", { class: "r3-results-head" }, `Websites about ${m.search}. Each one is shown as a link.`));
        m.results.forEach((r) => {
          page.appendChild(h("div", { class: "r3-result" }, linkBtn(r.title, r.go),
            h("div", { class: "snip" }, h("span", { class: "url" }, r.url), "  " + r.snippet)));
        });
        body.appendChild(page);
      }

      async function found(page) {
        finished = true;
        body.appendChild(h("div", { class: "delivered r3-found" }, "Found it!"));
        Sound.stamp();
        ctx.record(mistakes === 0);
        ctx.feedback(m.found, "good", 0);
        await wait(2300);
        resolve();
      }

      go(m.start);
    });
  }

  return {
    async start(ctx) {
      const D = ctx.data.round3;
      const total = D.missions.length;
      let done = 0;
      for (const step of D.sequence) {
        ctx.setDots(total, done);
        if (step.mission != null) { await mission(ctx, D, D.missions[step.mission]); done++; }
        else await safetyStop(ctx, D.checkpoints[step.stop]);
      }
      ctx.setDots(total, total);
    }
  };
})();
