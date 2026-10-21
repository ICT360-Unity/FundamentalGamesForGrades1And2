# Help Desk Hero

ICT360 · Lesson 2 · Basic Troubleshooting

Students come to the school help desk with computer problems. The player inspects the desk for clues, picks the most likely cause, then chooses the safest action. The winning move is usually telling the teacher exactly what they noticed, not fixing it themselves.

## Play it

Open `dist/index.html` in any modern browser. It is a single self-contained file (about 210 KB) and runs offline, from a USB stick, or uploaded to an LMS. The only online extras are the Google Fonts; without internet the game falls back to system fonts.

## Develop

```bash
npm install
npm run dev            # live-reloading dev server
npm run build          # rebuilds dist/index.html
npm run export-assets  # re-exports all SVG illustrations into /assets
```

Stack: React 18 + Vite 5, with `vite-plugin-singlefile` to inline everything into one HTML file. No images or audio files are needed: every illustration is SVG drawn in code, and sound effects are generated with the Web Audio API.

## Project structure

```
src/
  App.jsx                 game flow: title → Look / Think / Act × 9 → certificate
  data/levels.js          the nine tickets, students and Safety First habits (edit here)
  components/Scene.jsx    the computer desk illustration + clickable clue hotspots
  components/Student.jsx  student avatars (worried / thinking / happy)
  components/HabitBadge.jsx  the four Safety First badges
  components/Logo.jsx
  lib/sound.js            synthesised sound effects
  lib/speech.js           read-aloud using the browser's speech voice
  styles.css
scripts/export-assets.jsx exports every illustration to /assets
assets/                   exported SVGs (scenes, students, badges, logo)
docs/TEACHER_GUIDE.md     classroom guide, outcomes and discussion prompts
dist/index.html           playable build
```

## Adding or editing a ticket

Tickets are plain data in `src/data/levels.js`. Copy an existing entry and change:

- `scene` sets how the desk looks: `screen` (`desktop`, `music`, `noSignal`, `off`, `frozen`, `caps`, `noNet`, `printing`, `loading`) plus flags such as `muted`, `capsLight`, `busyLight`, `monitorCable: 'loose'`, `mouseCable: 'unplugged'`, `powerStrip: 'off'`, `wifi: 'off'`, `printer: 'empty'`.
- `clues` lists hotspots to inspect (`screen`, `speakerIcon`, `wifiIcon`, `speakers`, `monitorCable`, `tower`, `keyboard`, `capsLight`, `mouse`, `mouseCable`, `powerStrip`, `printer`, `printerTray`). Mark one with `key: true`; finding it unlocks the Think step.
- `causes` and `actions` each need exactly one `correct: true`. Wrong options carry a `why` that is shown as feedback. The correct action lists the `habits` it earns.

Answer order is shuffled with a fixed seed, so every student in a class sees the same layout.

## Scoring

Each ticket is worth up to 100 points: 20 for finding the key clue, then 40 / 20 / 10 for the cause and for the action depending on whether it is chosen on the first, second or later try. Stars per ticket are 3 minus the number of wrong choices (minimum 1). Ranks on the certificate: Help Desk Hero (800+), Help Desk Helper (600+), Help Desk Trainee.

## Accessibility

All hotspots and choices work with the keyboard (Tab, Enter or Space). Problems and feedback can be read aloud. Badges use distinct glyphs as well as colour. Reduced-motion settings are respected, and the layout adapts from phones to interactive panels.
