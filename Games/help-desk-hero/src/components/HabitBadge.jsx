import React from 'react';
import { HABITS } from '../data/levels.js';

// The four Safety First habit badges. Each has its own glyph so the
// badge is recognisable without relying on colour alone.
const GLYPHS = {
  // a calm face breathing out
  stayCalm: (
    <g fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round">
      <path d="M-9,-3 q3,-3 6,0 M3,-3 q3,-3 6,0" />
      <path d="M-7,7 q7,5 14,0" />
    </g>
  ),
  // a raised hand
  askHelp: (
    <g fill="#fff">
      <rect x="-9" y="-12" width="4.2" height="15" rx="2.1" />
      <rect x="-4" y="-15" width="4.2" height="18" rx="2.1" />
      <rect x="1" y="-14" width="4.2" height="17" rx="2.1" />
      <rect x="6" y="-10" width="4" height="13" rx="2" />
      <path d="M-10,0 H10 V6 C10,12 5,15 0,15 C-6,15 -10,11 -11,6 L-15,-1 C-16,-4 -12,-6 -10,-3 Z" />
    </g>
  ),
  // a plug with a no-touch slash
  dontTouch: (
    <g>
      <g fill="#fff"><rect x="-7" y="-6" width="14" height="12" rx="3" /><rect x="-4.5" y="-13" width="3" height="7" /><rect x="1.5" y="-13" width="3" height="7" /><rect x="-1.5" y="6" width="3" height="8" /></g>
      <path d="M-13,13 L13,-13" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" />
    </g>
  ),
  // an hourglass
  bePatient: (
    <g fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round">
      <path d="M-8,-13 h16 M-8,13 h16 M-6,-13 C-6,-4 6,-4 6,0 C6,4 -6,4 -6,13 M6,-13 C6,-4 -6,-4 -6,0 C-6,4 6,4 6,13" />
    </g>
  ),
};

export function HabitGlyph({ habit, size = 44, earned = true }) {
  const h = HABITS[habit];
  return (
    <svg viewBox="-24 -24 48 48" width={size} height={size} aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path d="M0,-22 L19,-11 V11 L0,22 L-19,11 V-11 Z" fill={earned ? h.color : '#C9D4DF'} />
      <path d="M0,-22 L19,-11 V11 L0,22 L-19,11 V-11 Z" fill="none" stroke="#1F355022" strokeWidth="2" />
      <g opacity={earned ? 1 : 0.7}>{GLYPHS[habit]}</g>
    </svg>
  );
}

export default function HabitBadge({ habit, count = 0, pop = false }) {
  const h = HABITS[habit];
  const earned = count > 0;
  return (
    <div className={`badge ${earned ? 'badge--earned' : ''} ${pop ? 'badge--pop' : ''}`} title={`${h.name}: ${h.tip}`}>
      <HabitGlyph habit={habit} earned={earned} size={34} />
      <span className="badge__label">{h.short}</span>
      {count > 1 && <span className="badge__count" aria-label={`earned ${count} times`}>×{count}</span>}
      <span className="sr-only">{earned ? `${h.name} badge earned` : `${h.name} badge not earned yet`}</span>
    </div>
  );
}
