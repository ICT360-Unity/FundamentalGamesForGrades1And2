# Memory Movers
ICT360 Grade 3, Lesson 3: Computer Memory. HTML5 / vanilla JavaScript, 1130 x 502 stage. No frameworks, no build step needed to run.

## Folder structure
```
memory-movers/
  index.html                  entry point (links css/, data/, js/ and loads assets/)
  css/style.css               ALL colours, fonts, radii, shadows (CSS variables in :root)
  data/content.js             every word and number in the game (window.MM_CONTENT)
  js/kit.js                   asset loading, sound, element factory, tweens
  js/shell.js                 HUD, feedback toast, game state, screen flow, title/intro/complete/final screens
  js/level1-desk-shelf.js     Level 1: Desk vs Shelf
  js/level2-unit-ladder.js    Level 2: Unit Ladder
  js/level3-pack-pendrive.js  Level 3: Pack the Pendrive
  js/level4-device-sort.js    Level 4: Inside or Outside?
  js/main.js                  scales the stage to the window, starts the game
  assets/images/*.png         49 sprites (256 x 256 icons; backgrounds 1130 x 502)
  assets/audio/*.wav          10 sound effects
  build.py                    bundles everything into dist/index.html
  dist/index.html             single self-contained file (all of the above inlined)
```

`index.html` runs straight from the folder (double-click works; scripts are plain `<script>` tags, no modules or fetch).
`dist/index.html` is the one-file version for hand-off. Rebuild it after any change: `python build.py` (Python 3, standard library only).

## Styling (css/style.css)
- **Colours:** the JS never contains a colour value. It only references the `:root` variables (`--teal`, `--ram`, `--tape`, `--ink`, `--green-l`, `--red-l`, `--seg-1`...`--seg-7`, etc.), so changing a variable restyles every screen.
- **Fonts:** `--font`. The Baloo 2 web font is linked in `index.html`; remove that `<link>` to use system fonts only.
- **Shape:** `--radius-panel`, `--radius-btn`, `--shadow-card`, `--shadow-btn`, `--focus-ring`.
- **Class hooks** for targeted styling: `.hud`, `.hud-dot`, `.toast`, `.backdrop`, `.card`, `.btn`, `.pill`, `.game-title`, `.intro-card`, `.complete-card`, `.takeaway`, `.recap`, `.screen-title`, `.screen-final`, `.level`, `.level-1` to `.level-4`, `.desk-pill`, `.shelf-pill`, `.power-banner`, `.timer-track`, `.timer-fill`, `.blackout`, `.result-card`, `.ladder-slot`, `.unit-card`, `.item-card`, `.capacity-bar`, `.capacity-seg`, `.capacity-tick`, `.mission-card`, `.file-tile`, `.bin`, `.bin-inside`, `.bin-outside`.
- **Set inline by JS:** position and size (`left`, `top`, `width`, `height`, so the layout stays on the 1130 x 502 grid), font sizes, and animation transforms/opacity. To override a font size from CSS, use `!important`, e.g. `.toast .txt { font-size: 18px !important; }`.
- Sprite colours are baked into the PNGs in `assets/images/`. Replace a PNG with one of the same name to change the art.

## Levels
| Level | Mechanic | Stars |
|---|---|---|
| 1 Desk vs Shelf | Sort 8 tasks onto the desk (RAM) or shelf (storage); then 8 seconds to Save desk work before a power cut wipes the desk. | Correct sorts + items saved (max 12): 11+ = 3, 8+ = 2 |
| 2 Unit Ladder | Order tiny box > bigger box > suitcase > storage room > building (B to TB); then match 6 items to their size. | 0-1 mistakes = 3, 2-4 = 2 |
| 3 Pack the Pendrive | 3 rounds (4, 8, 16 GB): pack files into a capacity bar, required files starred, eject when the target is met. | Overflow attempts: 0-1 = 3, 2-3 = 2 |
| 4 Inside or Outside? | Devices ride a speeding conveyor; tap internal or portable before each rolls off. | 0-1 mistakes = 3, 2-3 = 2 |

## Notes for the backend team
- Entry point: `index.html` (or `dist/index.html` if a single file is preferred). Serve the folder as static files; no server code or API calls.
- The back arrow on the title screen calls `window.history.back()`; inside a level it returns to the title screen.
- No cookies, no localStorage, no network requests other than the optional Google Fonts stylesheet.
