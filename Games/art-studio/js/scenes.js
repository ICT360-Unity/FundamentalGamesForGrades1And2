/* Scene geometry: the starter outlines on each card, the regions you click,
   and the zones you drag across. Logical canvas size is 540 x 360.
   Line specs: a name ("ground"), a number (150) or { line: "ground", dy: -30 }. */
window.WSW = window.WSW || {};
(function () {
  function poly(points) {
    return function (x) {
      for (var i = 0; i < points.length - 1; i++) {
        var a = points[i], b = points[i + 1];
        if (x <= b[0]) return a[1] + (b[1] - a[1]) * ((x - a[0]) / (b[0] - a[0]));
      }
      return points[points.length - 1][1];
    };
  }
  var OUTLINE = "#B8C9D8";

  WSW.Scenes = {
    winter: {
      lines: {
        ground: function (x) { return 262 + 9 * Math.sin(x * 0.011 + 0.4) + 5 * Math.sin(x * 0.029 + 1.7); },
        ridge: poly([[0, 196], [50, 160], [105, 182], [175, 104], [235, 168], [285, 140], [355, 78], [425, 158], [470, 128], [540, 172]])
      },
      outlines: [{ line: "ground", color: OUTLINE }],
      regions: {
        sky: { bottom: "ground" },
        skyHigh: { bottom: "ground", margin: 20 },
        ground: { top: "ground" }
      },
      zones: {
        ridge: { top: "ridge", bottom: { line: "ground", dy: 4 }, clip: "sky", near: [45, 8], guide: "topline", brush: 9 },
        snowline: { top: { line: "ground", dy: -30 }, bottom: { line: "ground", dy: 12 }, line: "ground", near: [8, 8], guide: "band", brush: 13 }
      }
    },

    sea: {
      lines: {
        sand: function (x) { return 284 + 7 * Math.sin(x * 0.021 + 0.5) + 4 * Math.sin(x * 0.05); }
      },
      outlines: [{ line: "sand", color: "#D7C79C" }],
      regions: {
        water: { bottom: "sand" },
        waterSafe: { bottom: "sand", margin: 22 }
      },
      zones: {
        sand: { top: { line: "sand", dy: -4 }, bottom: 360, near: [30, 10], guide: "band", brush: 11 }
      }
    },

    night: {
      lines: {
        hill: function (x) { return 270 - 30 * Math.exp(-Math.pow((x - 170) / 120, 2)) - 16 * Math.exp(-Math.pow((x - 440) / 90, 2)); }
      },
      outlines: [{ line: "hill", color: OUTLINE }],
      regions: {
        sky: { bottom: "hill" },
        skyHigh: { bottom: "hill", margin: 14 },
        moonZone: { bottom: "hill", margin: 34 },
        hillText: { top: { line: "hill", dy: 14 }, bottom: 352 }
      },
      zones: {}
    },

    garden: {
      lines: {
        wallTop: function () { return 150; },
        ground: function (x) { return 262 + 4 * Math.sin(x * 0.02); }
      },
      outlines: [{ line: "wallTop", color: OUTLINE }, { line: "ground", color: OUTLINE }],
      regions: {
        sky: { bottom: "wallTop" },
        lawn: { top: "ground", margin: 10 }
      },
      zones: {
        wall: { top: "wallTop", bottom: "ground", near: [6, 6], guide: "band", brush: 11 },
        lawn: { top: "ground", bottom: 360, near: [12, 10], guide: "band", brush: 11 }
      },
      scribble: [[296, 46], [318, 98], [336, 40], [352, 104], [372, 44], [388, 110], [410, 52], [426, 102], [446, 58]]
    }
  };
})();
