# Art Studio (Lesson 6: Creative Art, Tux Paint)

**Grade 3 · HTML5 · Stage 1130 × 502**

Hazel the snow hare runs an art studio. Kids pick a picture from a menu, see what they will make,
then build it step by step. Each instruction names an *effect*; the player works out the *tool*,
its *type* and the *color*, then uses it on the card. The canvas really performs every effect.

## Flow
Title → **Pick a picture** (menu with finished previews, stars once done) → **What you'll make**
(preview + numbered instructions + "OK, let's paint!") → **Paint** → **Done** (stars + tool recap).

## Scenes
| Scene | Steps (tool → type, color) |
|---|---|
| Winter Card | Fill → Linear (dark blue) · Paint → Blotchy (purple) · Magic → Smudge · Stamp → Snowman · Stamp → Snowflake ×4 · Save |
| Under the Sea | Fill → Radial (dark blue) · Paint → Spray (yellow) · Stamp → Fish ×3 · Shapes → Circle (white) ×3 · Save |
| Night Sky | Fill → Solid (black) · Paint → Sparkle (yellow) ×10 · Shapes → Filled circle (white) · Text (dark blue) · Save |
| Garden Wall | Eraser · Fill → Solid (light blue) · Magic → Bricks (red) · Magic → Grass (green) · Stamp → Flower ×3 · Save |

Between them the scenes cover Fill (all 3 gradient types), Paint (4 brushes), Magic (3 effects),
Stamp, Shapes (outline vs filled), Text, Eraser and Save.

## Play screen
- **Left:** numbered instructions; current step highlighted, finished steps ticked.
- **Toolbar:** all 16 Tux Paint tools, each with a hover/focus tooltip.
- **Choices drawer:** opens beside the toolbar only when the right tool is picked.
- **Right / wrong marks:** the clicked tool, choice or color shows a ✓ or ✕ on the button itself.
- **Hazel + tracker:** one fixed spot above the card. The tracker shows `Tool › Type › Color › Use it`,
  with the next thing to do in red; the drawer, palette or card glows when it's next.
- Two wrong tries → the right button gently bounces. Some tools get special notes
  (e.g. Undo/New on the scribble step, Label on the text step).

## Folder structure
```
assets/   icons/ · options/ (fills, brushes, magic, shapes) · stamps/ · characters/ (Hazel ×3 moods)
css/      style.css        ← colors and fonts are variables at the top
data/     game-data.js     ← ALL text, tools, choices, colors and the 4 scenes (edit content here)
js/       audio.js         ← synthesised sounds, no audio files
          scenes.js        ← each scene's starter outlines, click regions and drag zones
          painter.js       ← canvas effects (fills, brushes, smudge, bricks, grass, stamps, shapes, text, eraser)
          game.js          ← menu, brief, step flow, tracker, feedback, finale
dist/     index.html       ← single self-contained build
build.py  bundles everything into dist/index.html
```
Build with `python build.py`. Keep asset paths in `game-data.js` as full literal strings.

## Adding a scene
Add its geometry to `js/scenes.js` (lines, regions, zones) and its instructions to `data/game-data.js`.
Action types: `fill`, `columns` (blotchy / spray / smudge / bricks / grass), `stamp`, `shape`,
`sparkle`, `text`, `erase`, `save`. The menu thumbnail and preview are painted automatically from the `auto` spots.

## Notes
Stars per scene are remembered in the browser (localStorage). Keyboard players can press Enter on the
card to use the selected tool. Reduced motion is respected; sound can be muted.
