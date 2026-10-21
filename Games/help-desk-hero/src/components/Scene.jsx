import React from 'react';

// ─────────────────────────────────────────────────────────────
//  Scene: one illustrated computer desk, drawn entirely in SVG.
//  Its look is driven by a small "scene" object from levels.js,
//  so nine different problems reuse one illustration.
//
//  scene = {
//    screen: 'desktop' | 'music' | 'noSignal' | 'off' | 'frozen'
//          | 'caps' | 'noNet' | 'printing' | 'loading' | 'printed',
//    muted, capsLight, busyLight: boolean,
//    monitorCable: 'ok' | 'loose',
//    mouseCable:   'ok' | 'unplugged',
//    powerStrip:   'on' | 'off',
//    wifi:         'ok' | 'off',
//    printer:      'ok' | 'empty',
//  }
// ─────────────────────────────────────────────────────────────

export const VIEWBOX = { w: 800, h: 520 };

// Clickable regions. `dot` is where the "?" marker sits.
export const SPOTS = {
  screen:       { label: 'the screen',            shape: { x: 237, y: 77, w: 326, h: 180 }, dot: { x: 548, y: 96 } },
  speakerIcon:  { label: 'the speaker icon',      shape: { cx: 514, cy: 269, r: 13 },       dot: { x: 518, y: 244 } },
  wifiIcon:     { label: 'the Wi-Fi icon',        shape: { cx: 484, cy: 269, r: 13 },       dot: { x: 480, y: 244 } },
  speakers:     { label: 'the speakers',          shape: { x: 146, y: 236, w: 68, h: 158 }, dot: { x: 180, y: 222 } },
  monitorCable: { label: 'the monitor cable',     shape: { x: 556, y: 296, w: 64, h: 62 },  dot: { x: 586, y: 312 } },
  tower:        { label: 'the computer box',      shape: { x: 622, y: 178, w: 110, h: 214 },dot: { x: 677, y: 170 } },
  keyboard:     { label: 'the keyboard',          shape: { x: 250, y: 402, w: 240, h: 46 }, dot: { x: 300, y: 396 } },
  capsLight:    { label: 'the keyboard lights',   shape: { cx: 506, cy: 410, r: 12 },       dot: { x: 506, y: 386 } },
  mouse:        { label: 'the mouse',             shape: { x: 556, y: 408, w: 40, h: 52 },  dot: { x: 558, y: 470 } },
  mouseCable:   { label: 'the mouse wire',        shape: { x: 590, y: 362, w: 34, h: 46 },  dot: { x: 640, y: 402 } },
  powerStrip:   { label: 'the power strip',       shape: { x: 648, y: 428, w: 130, h: 34 }, dot: { x: 712, y: 480 } },
  printer:      { label: 'the printer',           shape: { x: 22, y: 322, w: 116, h: 68 },  dot: { x: 80, y: 402 } },
  printerTray:  { label: 'the printer paper tray',shape: { x: 34, y: 280, w: 92, h: 40 },   dot: { x: 138, y: 292 } },
};

const C = {
  wall: '#D7E9F4', wallDeep: '#C3DCEB', wood: '#D59E6A', woodEdge: '#B7804E', woodLine: '#C58E5C',
  bezel: '#2C3A4B', bezelHi: '#3A4B5F', plastic: '#E8EDF2', plasticShade: '#C8D2DC', ink: '#1F3550',
  cable: '#2A2F36', green: '#3FD37A', red: '#E24B3B', amber: '#F2A93B', blue: '#4FA3E0',
};

const SCENE_STYLE = `
  .hdh-spin { transform-origin: 400px 168px; animation: hdh-spin 1s linear infinite; }
  .hdh-blink { animation: hdh-blink .5s steps(2, start) infinite; }
  .hdh-blink-slow { animation: hdh-blink 1.2s steps(2, start) infinite; }
  .hdh-bar { animation: hdh-bar 6s linear infinite; }
  @keyframes hdh-spin { to { transform: rotate(360deg); } }
  @keyframes hdh-blink { to { visibility: hidden; } }
  @keyframes hdh-bar { from { width: 20px; } to { width: 200px; } }
  @media (prefers-reduced-motion: reduce) {
    .hdh-spin, .hdh-blink, .hdh-blink-slow, .hdh-bar { animation: none; }
  }
`;

/* ---------- small drawing helpers ---------- */

function Pointer({ x, y }) {
  return <path d={`M${x},${y} l0,18 l5,-5 l4,9 l3,-1.5 l-4,-9 l7,0 z`} fill="#fff" stroke="#111" strokeWidth="1.3" strokeLinejoin="round" />;
}

function Window({ x, y, w, h, title, children, dim }) {
  return (
    <g>
      <rect x={x + 3} y={y + 4} width={w} height={h} rx="6" fill="#0003" />
      <rect x={x} y={y} width={w} height={h} rx="6" fill="#fff" />
      <rect x={x} y={y} width={w} height="18" rx="6" fill={dim ? '#B9C2CC' : '#4F7DB8'} />
      <rect x={x} y={y + 10} width={w} height="8" fill={dim ? '#B9C2CC' : '#4F7DB8'} />
      <text x={x + 8} y={y + 13} fontSize="9.5" fontFamily="Atkinson Hyperlegible, Arial, sans-serif" fill="#fff" fontWeight="700">{title}</text>
      <circle cx={x + w - 10} cy={y + 9} r="4" fill="#fff8" />
      {children}
    </g>
  );
}

function Hourglass({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <path d="M-7,-10 h14 M-7,10 h14 M-5,-10 C-5,-3 5,-3 5,0 C5,3 -5,3 -5,10 M5,-10 C5,-3 -5,-3 -5,0 C-5,3 5,3 5,10" fill="none" stroke="#4F7DB8" strokeWidth="2" strokeLinecap="round" />
      <path d="M-3,7 h6 l-3,-4 z" fill="#F2A93B" />
    </g>
  );
}

/* ---------- screen contents ---------- */

function Wallpaper() {
  return (
    <g>
      <rect x="237" y="77" width="326" height="202" fill="url(#hdh-sky)" />
      <circle cx="505" cy="112" r="18" fill="#FFE27A" />
      <path d="M237,230 C300,190 350,215 400,200 C460,182 520,205 563,195 L563,279 L237,279 Z" fill="#7CCB8E" />
      <path d="M237,250 C300,230 380,248 440,236 C500,226 540,240 563,236 L563,279 L237,279 Z" fill="#5DB47A" />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(252, ${92 + i * 44})`}>
          <rect width="22" height="18" rx="3" fill={['#F2A93B', '#E86A5F', '#9B7BD1'][i]} />
          <rect y="22" width="22" height="4" rx="2" fill="#fff9" />
        </g>
      ))}
    </g>
  );
}

function ScreenContent({ screen }) {
  switch (screen) {
    case 'off':
      return <rect x="237" y="77" width="326" height="202" fill="#050607" />;
    case 'noSignal':
      return (
        <g>
          <rect x="237" y="77" width="326" height="202" fill="#050607" />
          <rect x="340" y="152" width="120" height="34" rx="4" fill="none" stroke="#7FA7C9" strokeWidth="1.5" />
          <text x="400" y="174" textAnchor="middle" fontSize="14" fontFamily="Atkinson Hyperlegible, Arial, sans-serif" fill="#A9C6DE">No signal</text>
        </g>
      );
    case 'music':
      return (
        <g>
          <Wallpaper />
          <Window x={270} y={90} w={260} h={150} title="Class Music Video">
            <rect x="276" y="112" width="248" height="100" fill="#1E2A3A" />
            <g fill="#FFD166">
              <path d="M370,190 v-44 l30,-8 v44" fill="none" stroke="#FFD166" strokeWidth="4" />
              <circle cx="364" cy="190" r="8" /><circle cx="394" cy="182" r="8" />
            </g>
            <g fill="#7FD1AE"><circle cx="440" cy="150" r="5" /><rect x="444" y="126" width="3" height="24" /></g>
            <rect x="286" y="222" width="228" height="6" rx="3" fill="#D5DDE6" />
            <rect className="hdh-bar" x="286" y="222" width="110" height="6" rx="3" fill="#E86A5F" />
          </Window>
        </g>
      );
    case 'frozen':
      return (
        <g>
          <Wallpaper />
          <Window x={262} y={86} w={276} h={160} title="Paint (Not responding)" dim>
            <rect x="268" y="108" width="264" height="132" fill="#FAFAF7" />
            <circle cx="320" cy="140" r="16" fill="#FFD166" />
            <path d="M350,225 v-40 l35,-25 l35,25 v40 z" fill="#E86A5F" />
            <path d="M428,225 v-40 l30,-20" fill="none" stroke="#bbb" strokeWidth="3" strokeDasharray="4 4" />
            <rect x="268" y="108" width="264" height="132" fill="#ffffff66" />
          </Window>
          <g className="hdh-spin">
            <circle cx="400" cy="168" r="18" fill="none" stroke="#C7D3E0" strokeWidth="6" />
            <path d="M400,150 a18,18 0 0 1 18,18" fill="none" stroke="#2F6DB5" strokeWidth="6" strokeLinecap="round" />
          </g>
        </g>
      );
    case 'caps':
      return (
        <g>
          <Wallpaper />
          <Window x={262} y={86} w={276} h={160} title="My Story.doc">
            <g fontFamily="Atkinson Hyperlegible, Arial, sans-serif" fontSize="13" fill="#1F3550" fontWeight="700">
              <text x="276" y="128">MY NAME IS SANA.</text>
              <text x="276" y="150">I LIKE DRAWING CATS.</text>
              <text x="276" y="172">WHY IS IT ALL BIG?</text>
            </g>
            <rect className="hdh-blink-slow" x="416" y="161" width="2" height="14" fill="#1F3550" />
          </Window>
        </g>
      );
    case 'noNet':
      return (
        <g>
          <Wallpaper />
          <Window x={262} y={86} w={276} h={160} title="Web Browser">
            <rect x="270" y="110" width="260" height="14" rx="7" fill="#EEF2F6" />
            <text x="280" y="120.5" fontSize="8.5" fontFamily="Atkinson Hyperlegible, Arial, sans-serif" fill="#6A7B8E">www.ict360-learn.example</text>
            <circle cx="400" cy="170" r="22" fill="none" stroke="#9AAABB" strokeWidth="3" />
            <path d="M378,170 h44 M400,148 c-12,14 -12,30 0,44 M400,148 c12,14 12,30 0,44" fill="none" stroke="#9AAABB" strokeWidth="2.5" />
            <path d="M382,152 l36,36" stroke={C.red} strokeWidth="4" strokeLinecap="round" />
            <text x="400" y="222" textAnchor="middle" fontSize="11.5" fontFamily="Atkinson Hyperlegible, Arial, sans-serif" fill="#1F3550" fontWeight="700">No internet connection</text>
          </Window>
        </g>
      );
    case 'printing':
      return (
        <g>
          <Wallpaper />
          <Window x={262} y={86} w={276} h={160} title="Science Poster.doc">
            {[0, 1, 2, 3].map((i) => <rect key={i} x="276" y={116 + i * 16} width={i === 3 ? 140 : 240} height="7" rx="3" fill="#D5DDE6" />)}
          </Window>
          <g>
            <rect x="330" y="150" width="140" height="62" rx="6" fill="#fff" stroke="#4F7DB8" strokeWidth="2" />
            <rect x="344" y="166" width="26" height="18" rx="3" fill="#E3E8EE" stroke="#6A7B8E" />
            <circle className="hdh-blink-slow" cx="366" cy="164" r="6" fill={C.amber} />
            <text x="364.5" y="167.5" textAnchor="middle" fontSize="8" fontWeight="700" fill="#fff" fontFamily="Arial">!</text>
            <text x="380" y="173" fontSize="10.5" fontFamily="Atkinson Hyperlegible, Arial, sans-serif" fill="#1F3550" fontWeight="700">Printer:</text>
            <text x="380" y="188" fontSize="10.5" fontFamily="Atkinson Hyperlegible, Arial, sans-serif" fill="#1F3550">waiting…</text>
          </g>
        </g>
      );
    case 'loading':
      return (
        <g>
          <Wallpaper />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Window key={i} x={264 + i * 16} y={86 + i * 12} w={190} h={96} title="Space Game" dim={i < 5}>
              <text x={264 + i * 16 + 95} y={86 + i * 12 + 66} textAnchor="middle" fontSize="11" fontFamily="Atkinson Hyperlegible, Arial, sans-serif" fill="#1F3550">Opening…</text>
              <Hourglass x={264 + i * 16 + 95} y={86 + i * 12 + 40} s={0.9} />
            </Window>
          ))}
        </g>
      );
    case 'printed':
    case 'desktop':
    default:
      return <Wallpaper />;
  }
}

function Taskbar({ muted, wifi }) {
  return (
    <g>
      <rect x="237" y="259" width="326" height="20" fill="#1F3550E6" />
      <circle cx="250" cy="269" r="6" fill="#7FD1AE" />
      {[0, 1, 2].map((i) => <rect key={i} x={266 + i * 20} y="263" width="13" height="12" rx="2" fill="#ffffff55" />)}
      {/* Wi-Fi */}
      <g transform="translate(484,273)">
        <path d="M-8,-6 a11,11 0 0 1 16,0 M-5,-3 a7,7 0 0 1 10,0" fill="none" stroke={wifi === 'off' ? '#8A99AA' : '#fff'} strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="0" cy="0.5" r="1.8" fill={wifi === 'off' ? '#8A99AA' : '#fff'} />
        {wifi === 'off' && <path d="M3,-9 l7,7 M10,-9 l-7,7" stroke={C.red} strokeWidth="2.2" strokeLinecap="round" />}
      </g>
      {/* Speaker */}
      <g transform="translate(506,269)">
        <path d="M0,-3 h3 l5,-4 v14 l-5,-4 h-3 z" fill="#fff" />
        {muted ? (
          <path d="M10,-4 l7,7 M17,-4 l-7,7" stroke={C.red} strokeWidth="2.2" strokeLinecap="round" />
        ) : (
          <path d="M10,-3 a5,5 0 0 1 0,6 M13,-6 a9,9 0 0 1 0,12" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
        )}
      </g>
      <text x="558" y="273" textAnchor="end" fontSize="9" fill="#fff" fontFamily="Atkinson Hyperlegible, Arial, sans-serif">10:30</text>
    </g>
  );
}

/* ---------- the room ---------- */

function Room() {
  return (
    <g>
      <rect width="800" height="520" fill={C.wall} />
      <rect y="0" width="800" height="36" fill={C.wallDeep} />
      {/* class poster */}
      <g transform="translate(40,70)">
        <rect width="120" height="150" rx="4" fill="#fff" />
        <rect width="120" height="26" rx="4" fill="#F2A93B" />
        <rect y="18" width="120" height="8" fill="#F2A93B" />
        <text x="60" y="18" textAnchor="middle" fontSize="12" fontWeight="800" fill="#1F3550" fontFamily="'Baloo 2', Arial, sans-serif">Safety First</text>
        {['#4FA3E0', '#F2A93B', '#E86A5F', '#5DBB8A'].map((c, i) => (
          <g key={c} transform={`translate(14, ${40 + i * 27})`}>
            <circle cx="8" cy="8" r="8" fill={c} />
            <rect x="24" y="4" width={[70, 60, 76, 58][i]} height="7" rx="3.5" fill="#D8E1EA" />
          </g>
        ))}
      </g>
      {/* window */}
      <g transform="translate(640,60)">
        <rect width="120" height="90" rx="6" fill="#fff" />
        <rect x="6" y="6" width="108" height="78" rx="3" fill="#BFE6FA" />
        <circle cx="88" cy="30" r="10" fill="#FFE27A" />
        <path d="M6,70 C30,55 60,66 114,52 V84 H6 Z" fill="#9ED6A9" />
        <rect x="58" y="6" width="4" height="78" fill="#fff" />
      </g>
      {/* desk */}
      <rect x="0" y="390" width="800" height="82" fill={C.wood} />
      <path d="M0,420 C200,414 600,428 800,418" stroke={C.woodLine} strokeWidth="2" fill="none" />
      <path d="M0,448 C220,442 560,454 800,446" stroke={C.woodLine} strokeWidth="2" fill="none" />
      <rect x="0" y="470" width="800" height="50" fill={C.woodEdge} />
      <rect x="0" y="470" width="800" height="5" fill="#A87244" />
    </g>
  );
}

function Printer({ state, solved, powered }) {
  const empty = state === 'empty';
  return (
    <g>
      {/* input tray at the back */}
      <path d="M40,322 L48,292 H112 L120,322 Z" fill={C.plasticShade} />
      {!empty && <rect x="54" y="282" width="52" height="34" fill="#fff" stroke="#D5DDE6" />}
      <rect x="24" y="318" width="112" height="70" rx="9" fill={C.plastic} />
      <rect x="24" y="360" width="112" height="28" rx="0" fill={C.plasticShade} />
      <rect x="36" y="366" width="88" height="6" rx="3" fill="#8C9AAA" />
      {solved && <path d="M42,369 H118 L124,392 H36 Z" fill="#fff" stroke="#D5DDE6" />}
      <circle cx="122" cy="336" r="4" className={empty ? 'hdh-blink-slow' : undefined} fill={!powered ? '#9AA6B2' : empty ? C.amber : C.green} />
      <rect x="36" y="332" width="40" height="8" rx="4" fill="#C8D2DC" />
    </g>
  );
}

function Speakers({ powered }) {
  return (
    <g>
      <rect x="150" y="240" width="60" height="150" rx="10" fill="#3B4756" />
      <circle cx="180" cy="282" r="15" fill="#26303C" /><circle cx="180" cy="282" r="6" fill="#4C5A6A" />
      <circle cx="180" cy="340" r="22" fill="#26303C" /><circle cx="180" cy="340" r="9" fill="#4C5A6A" />
      <circle cx="180" cy="378" r="3" fill={powered ? C.green : '#6A7684'} />
    </g>
  );
}

function Monitor({ scene }) {
  const powered = scene.powerStrip !== 'off';
  const showTaskbar = !['off', 'noSignal'].includes(scene.screen);
  return (
    <g>
      <rect x="385" y="296" width="30" height="66" fill="#3A4B5F" />
      <ellipse cx="400" cy="386" rx="72" ry="9" fill="#00000022" />
      <rect x="330" y="362" width="140" height="22" rx="8" fill="#3A4B5F" />
      <rect x="222" y="62" width="356" height="236" rx="14" fill={C.bezel} />
      <rect x="226" y="66" width="348" height="4" rx="2" fill={C.bezelHi} />
      <clipPath id="hdh-screen-clip"><rect x="237" y="77" width="326" height="202" rx="3" /></clipPath>
      <g clipPath="url(#hdh-screen-clip)">
        <ScreenContent screen={scene.screen} />
        {showTaskbar && <Taskbar muted={scene.muted} wifi={scene.wifi} />}
        {showTaskbar && scene.screen !== 'frozen' && <Pointer x={scene.screen === 'desktop' && scene.mouseCable === 'unplugged' ? 360 : 440} y={200} />}
      </g>
      <circle cx="565" cy="289" r="3" fill={powered ? C.green : '#4A5666'} />
    </g>
  );
}

function Tower({ scene }) {
  const powered = scene.powerStrip !== 'off';
  return (
    <g>
      <rect x="622" y="178" width="110" height="214" rx="10" fill={C.plastic} />
      <rect x="712" y="178" width="20" height="214" rx="0" fill={C.plasticShade} />
      <rect x="712" y="178" width="20" height="214" rx="10" fill={C.plasticShade} />
      <circle cx="677" cy="212" r="12" fill="#D2DAE3" stroke="#AEBBC8" strokeWidth="2" />
      <path d="M673,207 a6,6 0 1 0 8,0 M677,203 v7" fill="none" stroke="#6A7B8E" strokeWidth="2" strokeLinecap="round" />
      <circle cx="702" cy="212" r="4" className={scene.busyLight ? 'hdh-blink' : undefined} fill={powered ? C.green : '#8C9AAA'} />
      <rect x="638" y="242" width="66" height="9" rx="3" fill="#C8D2DC" />
      {[0, 1, 2, 3, 4].map((i) => <rect key={i} x="642" y={292 + i * 14} width="58" height="4" rx="2" fill="#C8D2DC" />)}
      {/* ports on the side */}
      <rect x="614" y="314" width="9" height="14" rx="2" fill="#39424D" />
      <rect x="614" y="371" width="9" height="12" rx="2" fill="#39424D" />
    </g>
  );
}

function Cables({ scene }) {
  const loose = scene.monitorCable === 'loose';
  const unplugged = scene.mouseCable === 'unplugged';
  return (
    <g fill="none" stroke={C.cable} strokeWidth="5" strokeLinecap="round">
      {/* monitor → tower */}
      {loose ? (
        <g>
          <path d="M548,298 C556,344 574,352 592,352" />
          <rect x="588" y="345" width="16" height="12" rx="2" fill="#4A5361" stroke="none" transform="rotate(12 596 351)" />
        </g>
      ) : (
        <g>
          <path d="M548,298 C560,336 588,322 606,321" />
          <rect x="603" y="315" width="13" height="12" rx="2" fill="#4A5361" stroke="none" />
        </g>
      )}
      {/* mouse → tower */}
      {unplugged ? (
        <g>
          <path d="M576,410 C578,396 594,398 602,402" strokeWidth="3.5" />
          <rect x="600" y="396" width="12" height="8" rx="2" fill="#4A5361" stroke="none" transform="rotate(-18 606 400)" />
        </g>
      ) : (
        <g>
          <path d="M576,410 C576,390 596,378 606,377" strokeWidth="3.5" />
          <rect x="604" y="372" width="11" height="9" rx="2" fill="#4A5361" stroke="none" />
        </g>
      )}
      {/* tower → power strip → wall */}
      <path d="M700,392 C700,410 684,418 676,432" strokeWidth="4" />
      <path d="M776,446 C790,446 796,440 804,440" strokeWidth="4" />
    </g>
  );
}

function PowerStrip({ state }) {
  const on = state !== 'off';
  return (
    <g>
      <rect x="650" y="432" width="126" height="26" rx="7" fill="#F4F6F8" stroke="#C8D2DC" strokeWidth="1.5" />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${668 + i * 26}, 445)`}>
          <circle r="7" fill="#E1E7ED" /><circle cx="-2.5" r="1.3" fill="#6A7B8E" /><circle cx="2.5" r="1.3" fill="#6A7B8E" />
        </g>
      ))}
      <rect x="750" y="437" width="18" height="16" rx="3" fill={on ? C.red : '#9AA6B2'} />
      {on && <rect x="750" y="437" width="18" height="16" rx="3" fill="none" stroke="#FF9A8F" strokeWidth="2" />}
      <text x="759" y="449" textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff" fontFamily="Arial">{on ? 'I' : 'O'}</text>
    </g>
  );
}

function Keyboard({ capsLight }) {
  return (
    <g>
      <rect x="250" y="402" width="270" height="46" rx="7" fill={C.plastic} stroke={C.plasticShade} strokeWidth="1.5" />
      {[0, 1, 2].map((r) =>
        Array.from({ length: 12 }).map((_, k) => (
          <rect key={`${r}-${k}`} x={258 + k * 19 + (r === 1 ? 5 : r === 2 ? 10 : 0)} y={408 + r * 12} width="15" height="9" rx="2" fill="#fff" stroke="#D5DDE6" />
        ))
      )}
      <rect x="258" y="408" width="15" height="9" rx="2" fill="#fff" />
      <circle cx="506" cy="410" r="3.6" fill={capsLight ? C.green : '#AEBBC8'} />
      {capsLight && <circle cx="506" cy="410" r="6.5" fill="none" stroke="#3FD37A66" strokeWidth="2" />}
      <circle cx="506" cy="422" r="2.4" fill="#AEBBC8" />
    </g>
  );
}

function Mouse() {
  return (
    <g>
      <ellipse cx="576" cy="436" rx="17" ry="23" fill="#EEF2F6" stroke={C.plasticShade} strokeWidth="1.5" />
      <path d="M576,413 v14 M559,428 h34" stroke={C.plasticShade} strokeWidth="1.5" />
    </g>
  );
}

/* ---------- hotspots ---------- */

function Hotspot({ id, state, onInspect, flash }) {
  const spot = SPOTS[id];
  if (!spot) return null;
  const s = spot.shape;
  const found = state === 'key' || state === 'plain';
  // Presentation attributes are fallbacks for exported SVGs; styles.css overrides them in the game.
  const areaAttrs = { fill: 'transparent', stroke: state === 'key' ? '#FFC93C' : 'transparent', strokeWidth: 3 };
  const shape = 'r' in s
    ? <circle cx={s.cx} cy={s.cy} r={s.r} {...areaAttrs} />
    : <rect x={s.x} y={s.y} width={s.w} height={s.h} rx="8" {...areaAttrs} />;

  const activate = () => onInspect && onInspect(id);
  return (
    <g
      className={`spot ${found ? 'spot--found' : ''} ${state === 'key' ? 'spot--key' : ''} ${flash ? 'spot--flash' : ''}`}
      role="button"
      tabIndex={onInspect ? 0 : -1}
      aria-label={found ? `Checked ${spot.label}` : `Inspect ${spot.label}`}
      onClick={activate}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); } }}
    >
      <g className="spot__area">{shape}</g>
      <g transform={`translate(${spot.dot.x},${spot.dot.y})`}>
      <g className="spot__dot-size">
      <g className="spot__dot">
        <circle r="11" fill={state === 'plain' ? '#fff' : '#FFC93C'} stroke={state === 'plain' ? '#9AAABB' : '#1F3550'} strokeWidth="2.5" />
        {state === 'key' ? (
          <path d="M0,-6 l1.8,3.9 4.2,.5 -3.1,2.9 .8,4.2 -3.7,-2.1 -3.7,2.1 .8,-4.2 -3.1,-2.9 4.2,-.5 z" fill="#1F3550" />
        ) : state === 'plain' ? (
          <path d="M-5,0 l3.5,3.5 6.5,-7" fill="none" stroke="#6A7B8E" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <text y="4.5" textAnchor="middle" fontSize="15" fontWeight="800" fill="#1F3550" fontFamily="'Baloo 2', Arial, sans-serif">?</text>
        )}
      </g>
      </g>
      </g>
    </g>
  );
}

/**
 * @param {object}   scene       visual state (see header)
 * @param {object}   spots       { spotId: 'unseen' | 'plain' | 'key' } – which hotspots are active
 * @param {function} onInspect   called with spotId when a hotspot is chosen
 * @param {string}   flashSpot   spot to briefly highlight (hint)
 * @param {boolean}  solved      draw the fixed version (e.g. printed page)
 */
export default function Scene({ scene = {}, spots = {}, onInspect, flashSpot, solved = false, title }) {
  const s = { screen: 'desktop', monitorCable: 'ok', mouseCable: 'ok', powerStrip: 'on', wifi: 'ok', printer: 'ok', ...scene };
  return (
    <svg
      viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}
      xmlns="http://www.w3.org/2000/svg"
      className="scene"
      role="img"
      aria-label={title || 'A computer desk in the school computer lab'}
    >
      <style>{SCENE_STYLE}</style>
      <defs>
        <linearGradient id="hdh-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#86CDF1" />
          <stop offset="1" stopColor="#DDF3FF" />
        </linearGradient>
      </defs>
      <Room />
      <Printer state={s.printer} solved={solved && s.screen === 'printed'} powered={s.powerStrip !== 'off'} />
      <Speakers powered={s.powerStrip !== 'off'} />
      <Monitor scene={s} />
      <Tower scene={s} />
      <Cables scene={s} />
      <PowerStrip state={s.powerStrip} />
      <Keyboard capsLight={s.capsLight} />
      <Mouse />
      {/* big spots first, small spots on top so they stay clickable */}
      {!solved && Object.keys(spots)
        .sort((a, b) => ('r' in SPOTS[a].shape ? 1 : 0) - ('r' in SPOTS[b].shape ? 1 : 0))
        .map((id) => (
          <Hotspot key={id} id={id} state={spots[id]} onInspect={solved ? null : onInspect} flash={flashSpot === id} />
        ))}
    </svg>
  );
}
