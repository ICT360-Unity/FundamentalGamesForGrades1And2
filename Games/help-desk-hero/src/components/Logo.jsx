import React from 'react';

// Game logo: a help-desk bell with a lifebuoy ring.
export default function Logo({ size = 56 }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="30" r="26" fill="#FFC93C" />
      <circle cx="32" cy="30" r="26" fill="none" stroke="#1F3550" strokeWidth="3" />
      <g stroke="#fff" strokeWidth="8">
        <path d="M32,4 V14 M32,46 V56 M6,30 H16 M48,30 H58" />
      </g>
      <circle cx="32" cy="30" r="15" fill="#EAF4FB" stroke="#1F3550" strokeWidth="3" />
      <path d="M22,36 C22,26 26,22 32,22 C38,22 42,26 42,36 Z" fill="#E86A5F" stroke="#1F3550" strokeWidth="2.5" strokeLinejoin="round" />
      <rect x="19" y="36" width="26" height="4" rx="2" fill="#1F3550" />
      <circle cx="32" cy="20" r="2.5" fill="#1F3550" />
    </svg>
  );
}
