// Exports every illustration in the game as a standalone .svg file
// (for worksheets, slides, posters or re-use in other tools).
//   npm run export-assets   →   writes to /assets
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { mkdirSync, writeFileSync } from 'node:fs';
import Scene from '../src/components/Scene.jsx';
import Student from '../src/components/Student.jsx';
import { HabitGlyph } from '../src/components/HabitBadge.jsx';
import Logo from '../src/components/Logo.jsx';
import { LEVELS, STUDENTS, HABITS } from '../src/data/levels.js';

const out = (dir) => { mkdirSync(dir, { recursive: true }); return dir; };
const save = (path, el) => writeFileSync(path, '<?xml version="1.0" encoding="UTF-8"?>\n' + renderToStaticMarkup(el));

const scenes = out('assets/scenes');
LEVELS.forEach((lvl, i) => {
  const n = String(i + 1).padStart(2, '0');
  save(`${scenes}/ticket-${n}-${lvl.id}-problem.svg`, <Scene scene={lvl.scene} />);
  const fixed = lvl.scene.screen === 'printing' ? { screen: 'printed', printer: 'ok' } : { screen: 'desktop' };
  save(`${scenes}/ticket-${n}-${lvl.id}-solved.svg`, <Scene scene={fixed} solved />);
  // teacher answer-key version with the clue markers showing
  const spots = Object.fromEntries(lvl.clues.map((c) => [c.spot, c.key ? 'key' : 'plain']));
  save(`${scenes}/ticket-${n}-${lvl.id}-answer-key.svg`, <Scene scene={lvl.scene} spots={spots} />);
});

const students = out('assets/students');
Object.entries(STUDENTS).forEach(([id, s]) => {
  ['worried', 'thinking', 'happy'].forEach((mood) => save(`${students}/${id}-${mood}.svg`, <Student student={s} mood={mood} size={240} />));
});

const badges = out('assets/badges');
Object.keys(HABITS).forEach((h) => {
  save(`${badges}/${h}.svg`, <HabitGlyph habit={h} size={256} />);
  save(`${badges}/${h}-locked.svg`, <HabitGlyph habit={h} size={256} earned={false} />);
});

save('assets/logo.svg', <Logo size={256} />);
console.log('Assets exported to /assets');
