# Inside the Machine
ICT360 Grade-level computing game for **Lesson 1: Explore Computers**. Five levels plus a title screen and a technician badge.

## Game size
The game is a fixed **1130 x 502 px** frame. `engine.js` scales it uniformly to fit whatever window or iframe it is in, with letterboxing. In a 1130 x 502 iframe it shows at exactly 100%.

Layout inside the frame: top bar 58 px (title, LED level track, sound button), then a 260 px side panel (task, Volt's messages, progress count) and an 834 x 420 px play area. The title and badge screens use the full width.

## Run it
Open `index.html` in any modern browser (Chrome, Edge, Safari, Firefox). No build step and no server needed.
`dist/inside-the-machine.html` is the same game as a single self-contained file, for LMS uploads or sharing.

## Folder structure
```
index.html                  Page shell; loads the CSS and scripts in order
css/styles.css              All styling. Colour tokens (light + dark mode) at the top
js/core.js                  Helpers + saved progress (localStorage)
js/icons.js                 Icon paths and small UI graphics used in-game
js/audio.js                 Sound effects: which file plays for which event, and volumes
js/content.js               ALL TEXT AND DATA: objects, hints, clues, riddles, devices, bins
js/engine.js                Screen switching, LED level track, Volt's messages, drag-or-tap helper
js/levels/intro.js          Title screen with name badge
js/levels/level1-chip-scanner.js
js/levels/level2-desk-setup.js
js/levels/level3-xray.js
js/levels/level4-tap-the-part.js
js/levels/level5-sorting-belt.js
js/levels/badge.js          Completion certificate
js/main.js                  Starts the game
data/levels.json            All level content + coordinates, engine-neutral (for Unity or other builds)
assets/svg/                 Vector graphics (editable in Illustrator, Figma, Inkscape)
assets/png/                 High-resolution PNG exports of the same graphics
assets/audio/               Sound effects (MP3), with WAV masters in assets/audio/wav/
dist/                       Single-file build (CSS, JS and audio embedded)
build.py                    Rebuilds dist/ after you edit any file: python3 build.py
```
Scripts are plain (no modules) so the game also works when opened straight from disk. Keep the load order in `index.html`.

## Sound
| Sound | When it plays |
|---|---|
| tap | Buttons, level track, tapping a device part |
| pickup | Picking up or selecting a label, part or device |
| drop | Any drop onto a target, right or wrong |
| correct / wrong | Right or wrong answer, about 90 ms after the drop |
| scan | Level 1 scanner sweep (stops if the scanner moves off) |
| no-chip | Level 1 object without a chip |
| reveal | Level 3 new spaces appear, Level 4 phone arrives, badge screen |
| level-complete | A level is finished |
| all-complete | Fanfare when the fifth level is finished |

The speaker button in the top bar mutes all sound; the choice is remembered on that device. All sounds are original, generated for this project, so there are no licensing restrictions. To replace one, keep the same file name in `assets/audio/` and run `python3 build.py`.

## Editing content
All wording lives in `js/content.js`:
- `L1` Level 1 objects, whether they have a chip, and Volt's message for each
- `L2` Level 2 hint cards (swap in textbook wording here) and pin positions (% of scene)
- `L3` Level 3 clue cards, part names, success messages and slot rectangles (420 x 340 grid)
- `DEVICES` Level 4 riddles and part names for the laptop and phone
- `CATS`, `L5` Level 5 bins and the devices on the belt, with the "why" explanation

If you change content for a Unity build, update `data/levels.json` too (it mirrors content.js).

## Graphics
| Folder | Files | Notes |
|---|---|---|
| icons | 22 line icons (devices + computer parts) | 64 x 64 grid, PNG at 256 px |
| scenes | desk-setup, laptop, phone, xray-case-layout | Hotspot groups are named `hotspot-<part>` / `slot-<part>` inside the SVGs |
| ui | scanner, chip, logo-chip, volt-robot, technician-avatar | PNG at 4x |

PNGs use the light-mode palette. Palette hex values are listed in `data/levels.json` under `palette`.

## Notes for a Unity port
- Set the Canvas reference resolution to 1130 x 502 (Scale With Screen Size, match 0.5).
- Import PNGs as sprites, or import the SVGs with Unity's Vector Graphics package to keep them crisp.
- Hotspot and slot coordinates in `data/levels.json` are in each scene's viewBox units, origin top-left (Unity UI is bottom-left, so flip Y).
- Level 3 rule: RAM, cooling fan and graphics card slots (`sub: true`) appear only after the motherboard is placed.
- Level 1 scan dwell time is 0.8 s; Level 5 belt loop is 12 s; wrong answers never cost points, they explain.
- Audio events, file names and volumes are listed in `data/levels.json` under `audio`. Use the WAV masters for Unity.

## Fonts
Fredoka (SIL Open Font License, licence in `assets/fonts/OFL.txt`) is included in `assets/fonts/Fredoka.woff2` and embedded in the single-file build, so the game needs no internet connection and looks the same everywhere.
