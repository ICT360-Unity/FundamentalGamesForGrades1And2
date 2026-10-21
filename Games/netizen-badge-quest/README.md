# Netizen Badge Quest — L5 Digital Citizenship (Grade 3)

Players use a simulated kid's tablet. Each of the 10 apps holds one scenario
for one lesson rule. A good choice earns that rule's badge on the felt badge strip across the top;
a wrong choice gets a soft nudge with a short reason and the child tries again.
All 10 badges unlock a "Super Netizen" certificate that recaps the rules.

Stage size: **1130 × 502** (scaled to fit the window, aspect kept).
Layout: badge strip across the top (10 badges in a row), tablet below; inside each
app the question panel is on the left and the scenario on the right.

## Folder structure
```
assets/        mascot-owl.svg, icons/ (10 app + badge glyphs), scenes/ (game, drawing, house photo, dance video)
css/style.css  all styling; colour + font tokens are at the top in :root
data/          scenarios.js — every rule, question, choice, nudge and password tile
js/            audio.js (Web Audio beeps, no files) · password.js (Password Lab) · confetti.js (badge bursts) · game.js (engine)
dist/          index.html — single self-contained build (all CSS/JS/SVG inlined)
build.py       rebuilds dist/index.html
index.html     dev entry point (loads the split files)
```

## Build
```
python build.py
```
Run it after any change to css/, js/, data/ or assets/. Fonts (Fredoka,
Atkinson Hyperlegible) load from Google Fonts and fall back to system fonts offline.

## The 10 scenarios (data/scenarios.js)
| # | App | Rule | Badge |
|---|-----|------|-------|
| 1 | Game Zone | Don't click flashy pop-ups ("YOU WON!") | Pop-up Spotter |
| 2 | Chat Room | Don't share with strangers online | Stranger Safe |
| 3 | Art Studio | Ask before sharing others' work (classmate's drawing) | Credit Keeper |
| 4 | Play Timer | Balance your screen time | Time Balancer |
| 5 | Photos | Keep personal info private (house number + street sign) | Privacy Pro |
| 6 | Password Lab | Make strong passwords (tile builder + strength meter) | Password Builder |
| 7 | Messages | Keep passwords secret (even from a best friend) | Secret Keeper |
| 8 | Class Videos | Be kind online | Kindness Star |
| 9 | Class Group | Tell a trusted adult (mean message) | Speak-Up Hero |
| 10 | App Store | Ask before you download | Smart Downloader |

To match the lesson PDF wording exactly, edit `rule`, `question`, `choices` and
`success` in data/scenarios.js — no engine changes needed. Choice order is
shuffled each visit, so the right answer never sits in a fixed spot.

## Design notes
- **Laptop frame:** every scenario is shown on a laptop screen (bezel, camera,
  keyboard base) on the right of the app. Password Lab keeps its open builder.
- **Badge celebration:** when a badge is earned, a shine ring and confetti burst
  out of the big badge, then out of its patch on the top strip. The certificate
  sets off a burst from each of the 10 badges in turn. Skipped for reduced motion.
- **Scene first, then question:** each app plays its scene while Nettie says
  "Watch the screen…". Then the detail the question is about is outlined in the
  app's colour, the question appears in a matching card whose tail points right at the
  scene (question panel on the left, scene on the right), and the choices slide in. Tapping anywhere skips the wait. Mark a chat
  message with `key: true` in data/scenarios.js to choose what gets outlined.
- **Password Lab:** children only tap word / number / symbol tiles; nothing is
  typed. "password" and "123" are deliberate trap tiles that trigger a nudge.
  Checks: two fun words, a number, a symbol, nothing easy to guess.
- **Pop-up "flash":** a slow 1.4 s pulse, well under the 3-flashes-per-second
  photosensitivity limit.
- **Accessibility:** all controls are buttons with visible keyboard focus,
  feedback is announced via aria-live, scene images have alt text, and
  `prefers-reduced-motion` turns animations off.
- **No data stored:** progress lives in memory only; nothing is saved or sent.
- **Names used:** Riya, Kabir, Aarav, Meera, Ishaan (fictional classmates).
