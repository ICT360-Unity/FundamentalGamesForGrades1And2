import React from 'react';

// A friendly student avatar drawn in SVG. Colours and hairstyle come
// from STUDENTS in levels.js. `mood` changes the face.
export default function Student({ student, mood = 'worried', size = 120 }) {
  const { skin, hair, shirt, style } = student;
  const mouth = {
    worried: 'M-9,20 q9,-6 18,0',
    happy: 'M-10,16 q10,11 20,0',
    thinking: 'M-7,18 h14',
  }[mood];
  const brow = mood === 'worried'
    ? <g stroke={hair} strokeWidth="2.6" strokeLinecap="round"><path d="M-17,-8 l9,-3" /><path d="M17,-8 l-9,-3" /></g>
    : <g stroke={hair} strokeWidth="2.6" strokeLinecap="round"><path d="M-17,-10 q5,-3 9,0" /><path d="M17,-10 q-5,-3 -9,0" /></g>;

  return (
    <svg viewBox="-60 -64 120 128" width={size} height={size} role="img" aria-label={student.name} xmlns="http://www.w3.org/2000/svg">
      {/* back hair */}
      {style === 'long' && <path d="M-34,-6 C-40,30 -30,44 -22,48 H22 C30,44 40,30 34,-6 Z" fill={hair} />}
      {style === 'braids' && (<g fill={hair}><rect x="-38" y="-2" width="11" height="44" rx="5.5" /><rect x="27" y="-2" width="11" height="44" rx="5.5" /></g>)}
      {/* body */}
      <path d="M-40,64 C-40,38 -24,30 0,30 C24,30 40,38 40,64 Z" fill={shirt} />
      <path d="M-10,31 L0,42 L10,31" fill="none" stroke="#ffffff88" strokeWidth="3" strokeLinejoin="round" />
      <rect x="-7" y="22" width="14" height="12" fill={skin} />
      {/* head */}
      <circle cx="0" cy="0" r="30" fill={skin} />
      <circle cx="-30" cy="4" r="6" fill={skin} /><circle cx="30" cy="4" r="6" fill={skin} />
      {/* front hair */}
      {style === 'short' && <path d="M-31,-4 C-32,-30 -12,-38 2,-36 C20,-36 33,-26 31,-4 C24,-18 8,-22 -6,-20 C-16,-19 -24,-14 -31,-4 Z" fill={hair} />}
      {style === 'curly' && (<g fill={hair}>{[-26, -16, -5, 6, 17, 27].map((x, i) => <circle key={x} cx={x} cy={-22 + (i % 2) * 4 - (Math.abs(x) < 10 ? 6 : 0)} r="11" />)}</g>)}
      {(style === 'bun' || style === 'long' || style === 'braids') && <path d="M-31,-2 C-32,-30 -12,-36 0,-36 C12,-36 32,-30 31,-2 C26,-18 10,-24 0,-18 C-10,-24 -26,-18 -31,-2 Z" fill={hair} />}
      {style === 'bun' && <circle cx="0" cy="-40" r="12" fill={hair} />}
      {/* face */}
      {brow}
      <circle cx="-11" cy="3" r="3.6" fill="#1a120d" /><circle cx="11" cy="3" r="3.6" fill="#1a120d" />
      <circle cx="-10" cy="2" r="1.1" fill="#fff" /><circle cx="12" cy="2" r="1.1" fill="#fff" />
      <path d={mouth} fill="none" stroke="#5a2a1c" strokeWidth="2.8" strokeLinecap="round" />
      {mood === 'happy' && (<g fill="#ff8f8f55"><circle cx="-19" cy="13" r="5" /><circle cx="19" cy="13" r="5" /></g>)}
      {mood === 'worried' && <path d="M26,-18 q3,6 0,9 q-3,-3 0,-9 z" fill="#8FD0F5" />}
    </svg>
  );
}
