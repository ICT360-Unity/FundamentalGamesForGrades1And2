/* Painter — draws a scene's card and produces each Tux Paint-style effect for real.
   Logical canvas: 540 x 360, rendered at 2x. Every effect has an instant mode
   so the game can paint a preview of the finished picture. */
window.WSW = window.WSW || {};
WSW.IMAGES = WSW.IMAGES || {};
(function () {
  var W = 540, H = 360, S = 2, COLW = 20, COLS = Math.ceil(W / COLW);

  function rnd(a, b) { return a + Math.random() * (b - a); }
  function hexToRgb(h) { h = h.replace("#", ""); return [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)]; }
  function mixRgb(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
  function scale(c, k) { return [Math.min(255, c[0] * k), Math.min(255, c[1] * k), Math.min(255, c[2] * k)]; }
  function rgbStr(c, al) { return "rgba(" + Math.round(c[0]) + "," + Math.round(c[1]) + "," + Math.round(c[2]) + "," + (al == null ? 1 : al) + ")"; }
  function hash(a, b) { var s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); }

  WSW.loadImages = function (map) {
    return Promise.all(Object.keys(map).map(function (k) {
      return new Promise(function (res) {
        if (WSW.IMAGES[k]) return res();
        var img = new Image();
        img.onload = function () { WSW.IMAGES[k] = img; res(); };
        img.onerror = function () { res(); };
        img.src = map[k];
      });
    }));
  };

  function Painter(art, guide) {
    this.art = art; this.guide = guide || null;
    art.width = W * S; art.height = H * S;
    this.ctx = art.getContext("2d");
    this.ctx.setTransform(S, 0, 0, S, 0, 0);
    if (guide) {
      guide.width = W * S; guide.height = H * S;
      this.gctx = guide.getContext("2d");
      this.gctx.setTransform(S, 0, 0, S, 0, 0);
    }
  }
  Painter.W = W; Painter.H = H; Painter.COLS = COLS; Painter.COLW = COLW;

  /* ---------- geometry helpers ---------- */
  Painter.prototype.fn = function (spec, fallback) {
    var g = this.g;
    if (spec == null) return function () { return fallback; };
    if (typeof spec === "number") return function () { return spec; };
    if (typeof spec === "string") return g.lines[spec];
    var f = g.lines[spec.line], dy = spec.dy || 0;
    return function (x) { return f(x) + dy; };
  };
  Painter.prototype.area = function (spec) {
    return { top: this.fn(spec.top, 0), bottom: this.fn(spec.bottom, H), margin: spec.margin || 0 };
  };
  Painter.prototype.region = function (name) { return this.area(this.g.regions[name]); };
  Painter.prototype.zone = function (name) {
    var z = this.g.zones[name], a = this.area(z);
    a.spec = z; a.line = z.line ? this.fn(z.line) : null;
    return a;
  };
  function tracePath(c, a, inset) {
    inset = inset || 0;
    c.beginPath();
    c.moveTo(0, a.top(0) + inset);
    for (var x = 0; x <= W; x += 4) c.lineTo(x, a.top(x) + inset);
    for (x = W; x >= 0; x -= 4) c.lineTo(x, a.bottom(x) - inset);
    c.closePath();
  }
  Painter.prototype.inRegion = function (name, x, y) {
    var a = this.region(name), m = a.margin;
    return x > 4 && x < W - 4 && y > a.top(x) + m && y < a.bottom(x) - m;
  };
  Painter.prototype.nearZone = function (name, x, y) {
    var z = this.zone(name), n = z.spec.near || [0, 0];
    return x >= 0 && x <= W && y > z.top(x) - n[0] && y < z.bottom(x) + n[1];
  };

  /* ---------- scene setup ---------- */
  Painter.prototype.setScene = function (id) { this.g = WSW.Scenes[id]; this._samples = null; this.reset(); };

  Painter.prototype.reset = function () {
    var c = this.ctx;
    c.fillStyle = "#ffffff"; c.fillRect(0, 0, W, H);
    this.drawOutlines();
    this.cols = {};
    this.sparkles = [];
    this.erased = {}; this.erasedCount = 0;
    if (this.g.scribble) this.drawScribble("#D9433B", 4);
    this.clearGuide();
  };

  Painter.prototype.drawOutlines = function () {
    var c = this.ctx, self = this;
    (this.g.outlines || []).forEach(function (o) {
      var f = self.fn(o.line);
      c.save(); c.strokeStyle = o.color; c.lineWidth = 2; c.lineJoin = "round";
      c.beginPath();
      for (var x = 0; x <= W; x += 4) { if (x === 0) c.moveTo(x, f(x)); else c.lineTo(x, f(x)); }
      c.stroke(); c.restore();
    });
  };

  Painter.prototype.drawScribble = function (color, width) {
    var c = this.ctx, p = this.g.scribble;
    c.save(); c.strokeStyle = color; c.lineWidth = width; c.lineCap = "round"; c.lineJoin = "round";
    c.beginPath(); c.moveTo(p[0][0], p[0][1]);
    for (var i = 1; i < p.length; i++) c.lineTo(p[i][0], p[i][1]);
    c.stroke(); c.restore();
  };

  /* ---------- Fill: solid, linear, radial ---------- */
  Painter.prototype.fill = function (regionName, mode, hex, done, instant) {
    var c = this.ctx, self = this, a = this.region(regionName);
    var y0 = H, y1 = 0;
    for (var x = 0; x <= W; x += 10) { y0 = Math.min(y0, a.top(x)); y1 = Math.max(y1, a.bottom(x)); }
    var col = hexToRgb(hex), light = mixRgb(col, [255, 255, 255], 0.8);
    function paint(e) {
      c.save(); tracePath(c, a); c.clip();
      if (mode === "radial") {
        var cx = W / 2, cy = y0 + 70, R = 330;
        var g = c.createRadialGradient(cx, cy, 0, cx, cy, R);
        g.addColorStop(0, rgbStr(light)); g.addColorStop(1, rgbStr(col));
        c.fillStyle = g;
        c.beginPath(); c.arc(cx, cy, 460 * e, 0, Math.PI * 2); c.fill();
      } else {
        if (mode === "linear") {
          var lg = c.createLinearGradient(0, y0, 0, y1);
          lg.addColorStop(0, rgbStr(col)); lg.addColorStop(1, rgbStr(light));
          c.fillStyle = lg;
        } else c.fillStyle = rgbStr(col);
        c.fillRect(0, y0, W, (y1 - y0 + 2) * e);
      }
      c.restore();
      self.drawOutlines();
    }
    if (instant) { paint(1); if (done) done(); return; }
    var start = performance.now(), dur = 900;
    (function frame(now) {
      var t = Math.min(1, ((now || performance.now()) - start) / dur);
      paint(1 - Math.pow(1 - t, 3));
      if (t < 1) requestAnimationFrame(frame); else if (done) done();
    })(start);
  };

  /* ---------- Column effects (drag across a zone) ---------- */
  Painter.prototype.colCount = function (effect, zoneName) {
    var s = this.cols[effect + ":" + zoneName]; return s ? s.n : 0;
  };
  Painter.prototype.colDone = function (effect, zoneName, i) {
    var s = this.cols[effect + ":" + zoneName]; return !!(s && s[i]);
  };
  Painter.prototype.column = function (effect, zoneName, i, hex) {
    var key = effect + ":" + zoneName, set = this.cols[key] || (this.cols[key] = { n: 0 });
    if (i < 0 || i >= COLS || set[i]) return false;
    set[i] = true; set.n++;
    this["fx_" + effect](this.zone(zoneName), i, hex);
    return true;
  };
  Painter.prototype.finishColumns = function (effect, zoneName, hex, done, instant) {
    var self = this, todo = [];
    for (var i = 0; i < COLS; i++) if (!this.colDone(effect, zoneName, i)) todo.push(i);
    if (instant) { todo.forEach(function (i) { self.column(effect, zoneName, i, hex); }); if (done) done(); return; }
    (function next() {
      if (!todo.length) { if (done) done(); return; }
      self.column(effect, zoneName, todo.shift(), hex);
      setTimeout(next, 30);
    })();
  };

  function blob(c, x, y, r, col) {
    c.fillStyle = rgbStr(col, 0.92);
    c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill();
    c.beginPath(); c.arc(x + rnd(-r, r) * 0.6, y + rnd(-r, r) * 0.6, r * rnd(0.45, 0.7), 0, Math.PI * 2); c.fill();
    c.beginPath(); c.arc(x + rnd(-r, r) * 0.7, y + rnd(-r, r) * 0.7, r * rnd(0.3, 0.5), 0, Math.PI * 2); c.fill();
  }

  Painter.prototype.fx_blotchy = function (z, i, hex) {
    var c = this.ctx, base = hexToRgb(hex);
    c.save();
    if (z.spec.clip) { tracePath(c, this.region(z.spec.clip)); c.clip(); }
    for (var x = i * COLW - 3; x <= i * COLW + COLW + 3; x += 5) {
      var top = z.top(x), bot = z.bottom(x);
      for (var y = top + 2; y <= bot; y += 6) {
        var f = (y - top) / Math.max(1, bot - top);
        blob(c, x + rnd(-3, 3), y + rnd(-3, 3), rnd(5, 8), scale(mixRgb(base, [255, 255, 255], 0.14 * f), rnd(0.88, 1.08)));
      }
      for (var k = 0; k < 2; k++) blob(c, x + rnd(-4, 4), top + rnd(-2, 4), rnd(3.5, 7), scale(base, rnd(0.82, 1)));
    }
    c.restore();
    this.drawOutlines();
  };

  Painter.prototype.fx_spray = function (z, i, hex) {
    var c = this.ctx, base = hexToRgb(hex);
    c.save(); tracePath(c, { top: function (x) { return z.top(x) - 4; }, bottom: z.bottom }); c.clip();
    for (var k = 0; k < 170; k++) {
      var x = i * COLW + rnd(-2, COLW + 2), y = rnd(z.top(x) - 3, z.bottom(x));
      c.fillStyle = rgbStr(scale(base, rnd(0.72, 1.08)), rnd(0.7, 1));
      c.beginPath(); c.arc(x, y, rnd(0.7, 1.9), 0, Math.PI * 2); c.fill();
    }
    c.restore();
  };

  Painter.prototype.fx_bricks = function (z, i, hex) {
    var c = this.ctx, base = hexToRgb(hex), BW = 30, BH = 14, x0 = i * COLW, x1 = x0 + COLW;
    c.save(); tracePath(c, z); c.clip();
    c.beginPath(); c.rect(x0, 0, COLW, H); c.clip();
    c.fillStyle = "#E7DED4"; c.fillRect(x0, 0, COLW, H);
    var top = z.top(0);
    for (var r = 0; top + r * BH < H; r++) {
      var off = (r % 2) * (BW / 2), y = top + r * BH;
      for (var k = -1; k * BW - off < W; k++) {
        var bx = k * BW - off;
        if (bx + BW < x0 || bx > x1) continue;
        c.fillStyle = rgbStr(scale(base, 0.82 + hash(r, k) * 0.3));
        c.fillRect(bx + 1.5, y + 1.5, BW - 3, BH - 3);
      }
    }
    c.restore();
    this.drawOutlines();
  };

  Painter.prototype.fx_grass = function (z, i, hex) {
    var c = this.ctx, base = hexToRgb(hex), x0 = i * COLW;
    c.save(); tracePath(c, z); c.clip();
    c.fillStyle = rgbStr(mixRgb(base, [255, 255, 255], 0.2)); c.fillRect(x0, 0, COLW, H);
    c.restore();
    c.save(); c.lineCap = "round"; c.lineWidth = 1.6;
    for (var x = x0 + 1; x < x0 + COLW; x += 3) {
      for (var y = z.top(x) + 3; y < H + 6; y += 9) {
        var bx = x + rnd(-1.5, 1.5);
        c.strokeStyle = rgbStr(scale(base, rnd(0.7, 1.12)));
        c.beginPath(); c.moveTo(bx, y + 6);
        c.quadraticCurveTo(bx + rnd(-2, 2), y - 2, bx + rnd(-4, 4), y - rnd(5, 12));
        c.stroke();
      }
    }
    c.restore();
  };

  /* Real pixel smudging: a carried patch of paint is dragged along each stroke */
  function smudgeStroke(img, pts, R, strength, pickup) {
    var w = img.width, h = img.height, d = img.data, size = 2 * R + 1;
    var patch = new Float32Array(size * size * 4), p0 = pts[0], dx, dy, sx, sy, si, pi, ch;
    for (dy = -R; dy <= R; dy++) for (dx = -R; dx <= R; dx++) {
      sx = Math.min(w - 1, Math.max(0, Math.round(p0[0]) + dx));
      sy = Math.min(h - 1, Math.max(0, Math.round(p0[1]) + dy));
      si = (sy * w + sx) * 4; pi = ((dy + R) * size + (dx + R)) * 4;
      for (ch = 0; ch < 3; ch++) patch[pi + ch] = d[si + ch];
    }
    for (var k = 1; k < pts.length; k++) {
      var a = pts[k - 1], b = pts[k], steps = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 3));
      for (var s = 1; s <= steps; s++) {
        var cx = Math.round(a[0] + (b[0] - a[0]) * s / steps), cy = Math.round(a[1] + (b[1] - a[1]) * s / steps);
        for (dy = -R; dy <= R; dy++) for (dx = -R; dx <= R; dx++) {
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > R) continue;
          sx = cx + dx; sy = cy + dy;
          if (sx < 0 || sy < 0 || sx >= w || sy >= h) continue;
          var f = 1 - dist / R, al = strength * f, bl = pickup * f;
          si = (sy * w + sx) * 4; pi = ((dy + R) * size + (dx + R)) * 4;
          for (ch = 0; ch < 3; ch++) {
            var pv = d[si + ch], cv = patch[pi + ch];
            d[si + ch] = pv + (cv - pv) * al;
            patch[pi + ch] = cv + (pv - cv) * bl;
          }
        }
      }
    }
  }
  Painter.prototype.fx_smudge = function (z, i) {
    var L = z.line, cx = i * COLW + COLW / 2, strokes = [];
    [-7, 1, 9].forEach(function (o) {
      var x = cx + o + rnd(-2, 2), g = L(x);
      strokes.push([[x, g + 16], [x + rnd(-2, 2), g - 8], [x + rnd(-3, 3), g - 34]]);
    });
    strokes.push([[cx - 14, L(cx - 14) - 2], [cx + 14, L(cx + 14) - 2]]);
    var R = 13, bx = Math.max(0, Math.floor((cx - 30 - R) * S)), by = Math.max(0, Math.floor((L(cx) - 60) * S));
    var bw = Math.min(W * S, Math.ceil((cx + 30 + R) * S)) - bx, bh = Math.min(H * S, Math.ceil((L(cx) + 40) * S)) - by;
    var img = this.ctx.getImageData(bx, by, bw, bh);
    strokes.forEach(function (st) {
      smudgeStroke(img, st.map(function (p) { return [p[0] * S - bx, p[1] * S - by]; }), R * S, 0.5, 0.06);
    });
    this.ctx.putImageData(img, bx, by);
  };

  /* ---------- Placed things ---------- */
  Painter.prototype.stamp = function (key, x, y, w, h, rot, flip) {
    var img = WSW.IMAGES[key]; if (!img) return;
    var c = this.ctx;
    c.save(); c.translate(x, y); c.rotate(rot || 0); if (flip) c.scale(-1, 1);
    c.drawImage(img, -w / 2, -h / 2, w, h);
    c.restore();
  };

  Painter.prototype.sparkle = function (x, y, hex, s) {
    var c = this.ctx;
    c.save(); c.fillStyle = hex; c.beginPath();
    for (var k = 0; k < 8; k++) {
      var ang = k * Math.PI / 4 - Math.PI / 2, r = k % 2 ? s * 0.3 : s;
      c.lineTo(x + Math.cos(ang) * r, y + Math.sin(ang) * r);
    }
    c.closePath(); c.fill();
    c.fillStyle = "rgba(255,255,255,.85)"; c.beginPath(); c.arc(x, y, s * 0.18, 0, Math.PI * 2); c.fill();
    c.restore();
    this.sparkles.push([x, y]);
  };

  Painter.prototype.shape = function (kind, x, y, r, hex) {
    var c = this.ctx, col = hexToRgb(hex);
    c.save();
    if (kind === "filled") {
      c.fillStyle = hex; c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill();
      c.fillStyle = rgbStr(scale(col, 0.88));
      [[-0.35, -0.2, 0.22], [0.3, 0.25, 0.16], [0.05, 0.45, 0.1]].forEach(function (k) {
        c.beginPath(); c.arc(x + k[0] * r, y + k[1] * r, k[2] * r, 0, Math.PI * 2); c.fill();
      });
    } else {
      c.strokeStyle = hex; c.lineWidth = 3;
      c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.stroke();
      c.lineWidth = 2; c.globalAlpha = 0.8;
      c.beginPath(); c.arc(x, y, r * 0.6, Math.PI * 1.1, Math.PI * 1.45); c.stroke();
    }
    c.restore();
  };

  Painter.prototype.text = function (str, x, y, hex) {
    var c = this.ctx;
    c.save();
    c.font = "800 30px Grandstander, 'Comic Sans MS', sans-serif";
    var w = c.measureText(str).width;
    x = Math.max(w / 2 + 10, Math.min(W - w / 2 - 10, x));
    c.fillStyle = hex; c.textAlign = "center"; c.textBaseline = "middle";
    c.fillText(str, x, y);
    c.restore();
  };

  /* ---------- Eraser ---------- */
  Painter.prototype.eraseAt = function (x, y) {
    var c = this.ctx, p = this.g.scribble, hit = 0;
    c.save(); c.fillStyle = "#ffffff"; c.beginPath(); c.arc(x, y, 14, 0, Math.PI * 2); c.fill(); c.restore();
    var samples = this.scribbleSamples();
    for (var i = 0; i < samples.length; i++) {
      if (!this.erased[i] && Math.hypot(samples[i][0] - x, samples[i][1] - y) < 16) { this.erased[i] = true; this.erasedCount++; hit++; }
    }
    return hit;
  };
  Painter.prototype.scribbleSamples = function () {
    if (this._samples) return this._samples;
    var p = this.g.scribble, out = [];
    for (var i = 0; i < p.length - 1; i++) for (var t = 0; t < 1; t += 0.2)
      out.push([p[i][0] + (p[i + 1][0] - p[i][0]) * t, p[i][1] + (p[i + 1][1] - p[i][1]) * t]);
    return (this._samples = out);
  };
  Painter.prototype.eraseRest = function () { this.drawScribble("#ffffff", 16); };

  /* ---------- Guide layer (never part of the artwork) ---------- */
  Painter.prototype.clearGuide = function () { if (this.gctx) this.gctx.clearRect(0, 0, W, H); };

  Painter.prototype.drawGuide = function (target, pointer) {
    var g = this.gctx; if (!g) return;
    g.clearRect(0, 0, W, H);
    var berry = "#C8384F", x, a;
    g.save(); g.lineCap = "round"; g.lineJoin = "round";
    if (target.region) {
      a = this.region(target.region);
      tracePath(g, a, 3); g.save(); g.clip();
      g.fillStyle = "rgba(200,56,79,0.07)"; g.fillRect(0, 0, W, H);
      g.setLineDash([8, 7]); g.strokeStyle = berry; g.lineWidth = 6; g.stroke();
      g.restore();
    } else if (target.zone) {
      a = this.zone(target.zone);
      if (a.spec.guide === "topline") {
        g.setLineDash([2, 8]); g.strokeStyle = berry; g.lineWidth = 3.5; g.beginPath();
        for (x = 0; x <= W; x += 3) {
          if (this.colDone("blotchy", target.zone, Math.floor(x / COLW))) { g.moveTo(x + 3, a.top(x + 3)); continue; }
          g.lineTo(x, a.top(x));
        }
        g.stroke();
      } else {
        tracePath(g, a);
        g.fillStyle = "rgba(244,198,78,0.30)"; g.fill();
        g.setLineDash([6, 6]); g.strokeStyle = berry; g.lineWidth = 2; g.stroke();
      }
    } else if (target.scribble) {
      var p = this.g.scribble, minX = 1e9, maxX = 0, minY = 1e9, maxY = 0;
      p.forEach(function (q) { minX = Math.min(minX, q[0]); maxX = Math.max(maxX, q[0]); minY = Math.min(minY, q[1]); maxY = Math.max(maxY, q[1]); });
      g.setLineDash([8, 7]); g.strokeStyle = berry; g.lineWidth = 2.5;
      g.beginPath(); g.ellipse((minX + maxX) / 2, (minY + maxY) / 2, (maxX - minX) / 2 + 26, (maxY - minY) / 2 + 24, 0, 0, Math.PI * 2); g.stroke();
    }
    g.restore();
    if (pointer) {
      var r = target.brush || 6;
      g.save();
      g.strokeStyle = "#1E2A4A"; g.lineWidth = 1.5;
      g.beginPath(); g.arc(pointer.x, pointer.y, r, 0, Math.PI * 2); g.stroke();
      g.strokeStyle = "#ffffff"; g.lineWidth = 1;
      g.beginPath(); g.arc(pointer.x, pointer.y, r + 1.5, 0, Math.PI * 2); g.stroke();
      g.restore();
    }
  };

  Painter.prototype.copyTo = function (target) {
    target.width = W * S; target.height = H * S;
    target.getContext("2d").drawImage(this.art, 0, 0);
  };

  WSW.Painter = Painter;
})();
