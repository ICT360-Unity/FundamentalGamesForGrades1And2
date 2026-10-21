# Internet Postman

Grade 3 · Lesson 4 · Browser
HTML5 game, fixed 1130 × 502 stage (scales to fit the window).

Pip the postman delivers parcels across Internet City. Four rounds, played in one continuous run:

| Round | Name | What the child does | Lesson link |
|---|---|---|---|
| 1 | Address Workshop | Drags `www` / name / ending tiles to build 3 website addresses (`.co`, `.com`, `.org`). The address to build is shown at the top | Every website has its own address |
| 2 | Open the Right Door | First connects the computer to the internet (once). Then for each parcel picks a browser door (Chrome, Edge, Safari) over Paint, Calculator and Google, drops the address into the address bar and presses Go | A browser needs an internet connection; browser is a doorway |
| 3 | Secret Doors | Helps a classmate find a page by clicking links: a link to another page, chapter links within one website, and choosing from search results. Safety stops come between missions | Links as secret doors; Tips for Safe Browsing |
| 4 | Sorting Office | Sorts 11 cards into Internet / Browser / Website / Link bins. Cards shrink to fit when held over a bin. Google and Kiddle go in Website | Tech Flash definitions; fixes the "Google is a browser" mix-up |

Safety stops in Round 3 (one per tip): personal-info form, new unknown website, stranger message, kid-friendly site choice. Picking the safe answer first time earns a shield. The order of missions and stops is set by `round3.sequence` in `data/content.js`.

Pip's instruction sits at the top of the screen, above the activity. Feedback appears in the same place, green for correct and red for try again, then returns to the instruction.

## Folder structure

```
internet-postman/
├── assets/      SVG graphics (Pip, parcel, door icons, network pieces, shield, stars, city background)
├── css/         style.css (all colours and fonts are tokens at the top, in :root)
├── data/        content.js (every piece of on-screen text and round content)
├── dist/        index.html (single self-contained build, made by build.py)
├── js/          assets.js, audio.js, ui.js, drag.js, round1-4.js, main.js
├── build.py
├── index.html
└── README.md
```

## Running

Open `index.html` in a browser. No server needed: content is loaded as a script, not fetched as JSON, so it also works from the file system.

For deployment, use either the folder as it is (`Games/internet-postman/index.html`) or the single file `dist/index.html`.

## Editing

- **Wording and content:** `data/content.js`. Parcels, doors, search topics, web pages, checkpoint text and sort cards all live here.
- **Look:** `css/style.css`. Change the tokens in `:root` (colours, font, radii). Round-specific styles are grouped under ROUND 1–4 headings.
- **Graphics:** replace any SVG in `assets/` with a file of the same name.

After any change, rebuild the single-file version:

```
python3 build.py
```

This inlines the CSS, all scripts and every SVG into `dist/index.html`.

## Technical notes

- Plain HTML/CSS/JS, no libraries, no build step needed for the folder version.
- Drag and drop uses Pointer Events, so it works with mouse and touch, and accounts for the stage scaling.
- Sounds are synthesized with the Web Audio API (no audio files). Mute toggle in the top bar.
- Back buttons call `window.history.back()`.
- Font: Baloo 2 from Google Fonts, falling back to system fonts if blocked.
- Mistakes are retried in place (no lives). The end screen shows stars from first-try accuracy, best streak and safety shields.
- Browser names appear as text with generic globe/compass icons. Real browser logos are not used.
