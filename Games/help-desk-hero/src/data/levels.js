// ─────────────────────────────────────────────────────────────
//  Help Desk Hero · level data
//  ICT360 · Lesson 2: Basic Troubleshooting
//
//  Every ticket is pure data, so teachers and curriculum writers
//  can add or edit problems without touching game code.
//
//  scene      – what the computer desk looks like (see Scene.jsx)
//  clues      – hotspots the player can inspect. `key: true` marks
//               the clue that unlocks the "Think" step.
//  causes     – possible causes; exactly one has `correct: true`
//  actions    – what to do next; exactly one has `correct: true`.
//               `habits` lists the Safety First badges it earns.
// ─────────────────────────────────────────────────────────────

export const HABITS = {
  stayCalm:  { name: 'Stay calm',          short: 'Calm',     color: '#4FA3E0', tip: 'Take a breath and check the simple things first.' },
  askHelp:   { name: 'Ask for help',       short: 'Ask',      color: '#F2A93B', tip: 'Tell a teacher exactly what you noticed.' },
  dontTouch: { name: "Don't touch wires",  short: 'No wires', color: '#E86A5F', tip: 'Cables, plugs and switches are for grown-ups.' },
  bePatient: { name: 'Be patient',         short: 'Patient',  color: '#5DBB8A', tip: 'A busy computer needs time. Wait before you click again.' },
};

export const STUDENTS = {
  riya:   { name: 'Riya',   skin: '#8D5A3B', hair: '#1E1410', shirt: '#E86A5F', style: 'bun' },
  kabir:  { name: 'Kabir',  skin: '#C68A5E', hair: '#2B1A10', shirt: '#4FA3E0', style: 'short' },
  meera:  { name: 'Meera',  skin: '#A86B45', hair: '#241712', shirt: '#9B7BD1', style: 'braids' },
  arjun:  { name: 'Arjun',  skin: '#6E4530', hair: '#140D09', shirt: '#5DBB8A', style: 'curly' },
  sana:   { name: 'Sana',   skin: '#D9A77F', hair: '#3A2418', shirt: '#F2A93B', style: 'long' },
  dev:    { name: 'Dev',    skin: '#9A6242', hair: '#1B120C', shirt: '#2F6DB5', style: 'short' },
  tanvi:  { name: 'Tanvi',  skin: '#B97C53', hair: '#2A1B12', shirt: '#E27FB0', style: 'bun' },
  rohan:  { name: 'Rohan',  skin: '#7B4D33', hair: '#110B08', shirt: '#E0B63B', style: 'curly' },
  ishaan: { name: 'Ishaan', skin: '#C9936A', hair: '#2E1D12', shirt: '#3FB6B0', style: 'short' },
};

export const LEVELS = [
  {
    id: 'no-sound',
    student: 'riya',
    problem: "I can't hear anything! My music video is playing but it's silent.",
    scene: { screen: 'music', muted: true },
    clues: [
      { spot: 'speakerIcon', key: true, text: 'The speaker icon has a red cross. The sound is switched off (muted).' },
      { spot: 'speakers', text: 'The speakers are plugged in and their little light is on.' },
      { spot: 'screen', text: 'The video is playing. The progress bar is moving.' },
      { spot: 'keyboard', text: 'The keyboard looks normal.' },
    ],
    hint: 'Look at the small icons in the bottom corner of the screen.',
    causes: [
      { text: 'The sound is muted', correct: true },
      { text: 'The speakers are broken', why: 'The speaker light is on, so they have power. Check the screen icons first.' },
      { text: 'The computer has no power', why: 'The video is playing, so the computer is definitely on.' },
    ],
    actions: [
      { text: 'Click the speaker icon to turn the sound back on', correct: true, habits: ['stayCalm'],
        why: 'Calm and smart! Clicking an icon on the screen is safe, and you checked the simple thing first.' },
      { text: 'Tap the speakers hard to wake them up', why: 'Hitting equipment can break it. Stay calm and look for simple causes.' },
      { text: 'Pull the speaker wire out and push it back in', why: 'Wires are for grown-ups. And the clue showed the problem is on the screen, not the wire.' },
    ],
    solved: 'Sound is switched back on.',
  },
  {
    id: 'dark-screen',
    student: 'kabir',
    problem: "My screen went dark! But the computer is still humming.",
    scene: { screen: 'noSignal', monitorCable: 'loose' },
    clues: [
      { spot: 'monitorCable', key: true, text: 'The cable from the screen to the computer is hanging loose!' },
      { spot: 'tower', text: 'The computer light is green. It is on and humming.' },
      { spot: 'screen', text: "The screen says 'No signal'. It is not getting pictures from the computer." },
      { spot: 'keyboard', text: 'The keyboard looks normal.' },
    ],
    hint: 'Follow the wires between the screen and the computer.',
    causes: [
      { text: 'The monitor cable is loose', correct: true },
      { text: 'The computer is switched off', why: 'The computer light is green and it is humming, so it is on.' },
      { text: 'The keyboard is broken', why: 'A keyboard problem would not make the whole screen go dark.' },
    ],
    actions: [
      { text: "Tell the teacher: \"The monitor cable looks loose.\"", correct: true, habits: ['askHelp', 'dontTouch'],
        why: 'Hero move! You found the cause and told a grown-up exactly what you saw, without touching any wires.' },
      { text: 'Push the cable back in yourself', why: 'Cables carry electricity. Even if you know the answer, a grown-up should touch them.' },
      { text: 'Switch the computer off and on again and again', why: 'That can lose work and will not fix a loose cable.' },
    ],
    solved: 'The teacher plugged the monitor cable back in.',
  },
  {
    id: 'frozen',
    student: 'meera',
    problem: "My painting program froze! There's a spinning circle and nothing works.",
    scene: { screen: 'frozen', busyLight: true },
    clues: [
      { spot: 'screen', key: true, text: 'A spinning circle means the computer is busy working. It needs a little time.' },
      { spot: 'tower', text: 'The computer light is blinking quickly. It is busy.' },
      { spot: 'mouse', text: 'The mouse is plugged in. The pointer moves, then turns into a spinner.' },
    ],
    hint: 'What is the spinning circle on the screen trying to tell you?',
    causes: [
      { text: 'The computer is busy and needs time', correct: true },
      { text: 'The mouse is broken', why: 'The pointer still moves, so the mouse is working.' },
      { text: 'The monitor cable is loose', why: 'We can still see the picture, so the cable is fine.' },
    ],
    actions: [
      { text: 'Wait calmly for a minute. If it is still stuck, tell the teacher', correct: true, habits: ['bePatient', 'stayCalm'],
        why: 'Patience pays! Most freezes clear up on their own when the computer catches up.' },
      { text: 'Click everywhere again and again', why: 'Every click gives the busy computer more work, so it stays frozen longer.' },
      { text: 'Press the power button to switch it off', why: 'Switching off suddenly can lose the painting. Wait first, then ask a teacher.' },
    ],
    solved: 'The spinner stopped and the painting is safe.',
  },
  {
    id: 'mouse',
    student: 'arjun',
    problem: "My mouse pointer won't move at all!",
    scene: { screen: 'desktop', mouseCable: 'unplugged' },
    clues: [
      { spot: 'mouseCable', key: true, text: 'The mouse wire has come out of the computer.' },
      { spot: 'mouse', text: 'The mouse looks clean. The button clicks, but nothing happens.' },
      { spot: 'screen', text: 'The pointer is stuck in one spot on the screen.' },
      { spot: 'keyboard', text: 'The keyboard looks normal.' },
    ],
    hint: 'Where does the mouse wire go?',
    causes: [
      { text: 'The mouse is unplugged', correct: true },
      { text: 'The internet is down', why: 'The mouse does not need the internet to move the pointer.' },
      { text: 'The sound is muted', why: 'Sound and the mouse are not connected to each other.' },
    ],
    actions: [
      { text: "Tell the teacher: \"The mouse wire has come out.\"", correct: true, habits: ['askHelp', 'dontTouch'],
        why: 'Great help desk report! Clear, specific and safe.' },
      { text: 'Crawl under the desk and plug it in', why: 'Under the desk there are plugs and power cables. That is a grown-up job.' },
      { text: 'Shake the mouse really hard', why: 'Shaking will not reconnect a wire and could break the mouse.' },
    ],
    solved: 'The teacher reconnected the mouse.',
  },
  {
    id: 'caps',
    student: 'sana',
    problem: 'EVERYTHING I TYPE COMES OUT IN BIG CAPITAL LETTERS!',
    scene: { screen: 'caps', capsLight: true },
    clues: [
      { spot: 'capsLight', key: true, text: 'The Caps Lock light is on. Caps Lock makes every letter a capital.' },
      { spot: 'keyboard', text: 'The keys are clean and nothing is stuck down.' },
      { spot: 'screen', text: 'Every letter typed is a CAPITAL.' },
      { spot: 'tower', text: 'The computer light is green. It is working normally.' },
    ],
    hint: 'Look for a tiny light on the keyboard.',
    causes: [
      { text: 'Caps Lock is switched on', correct: true },
      { text: 'The keyboard is broken', why: 'The letters are appearing, so the keyboard works. They are just all capitals.' },
      { text: 'The monitor cable is loose', why: 'The screen is showing everything clearly, so the cable is fine.' },
    ],
    actions: [
      { text: 'Press the Caps Lock key once to turn it off', correct: true, habits: ['stayCalm'],
        why: 'Calm and correct! Pressing one key is a safe fix you can do yourself.' },
      { text: 'Bang on the keyboard until it works', why: 'Banging can break keys, and it will not switch Caps Lock off.' },
      { text: 'Pull out the keyboard wire', why: 'Wires are for grown-ups, and the keyboard is not the problem.' },
    ],
    solved: 'Caps Lock is off. Letters look normal again.',
  },
  {
    id: 'no-power',
    student: 'dev',
    problem: "The computer won't turn on! I pressed the button three times.",
    scene: { screen: 'off', powerStrip: 'off' },
    clues: [
      { spot: 'powerStrip', key: true, text: 'The switch on the power strip is off. No electricity is reaching the computer.' },
      { spot: 'tower', text: 'The power button light is dark. The computer has no power.' },
      { spot: 'screen', text: 'The screen is completely dark, and its little light is off too.' },
    ],
    hint: 'Where does the electricity come from?',
    causes: [
      { text: 'The power strip is switched off', correct: true },
      { text: 'The computer is busy', why: 'A busy computer still has its lights on. These lights are all off.' },
      { text: 'Caps Lock is on', why: 'Caps Lock only changes letters. It cannot stop a computer turning on.' },
    ],
    actions: [
      { text: "Tell the teacher: \"I think the power strip is switched off.\"", correct: true, habits: ['askHelp', 'dontTouch'],
        why: 'Safe and smart! Power strips and plugs carry electricity, so a grown-up should switch them.' },
      { text: 'Flip the power strip switch yourself', why: 'Power strips carry electricity. Let a grown-up handle anything with plugs.' },
      { text: 'Keep pressing the power button harder', why: 'No power is reaching the computer, so pressing harder will not help.' },
    ],
    solved: 'The teacher switched the power strip on.',
  },
  {
    id: 'no-internet',
    student: 'tanvi',
    problem: "The website won't open. It says 'No internet'!",
    scene: { screen: 'noNet', wifi: 'off' },
    clues: [
      { spot: 'wifiIcon', key: true, text: 'The Wi-Fi icon has a cross. This computer is not connected to the internet.' },
      { spot: 'screen', text: "The browser says 'No internet connection'." },
      { spot: 'monitorCable', text: 'The monitor cable is plugged in properly.' },
      { spot: 'tower', text: 'The computer light is green. It is on.' },
    ],
    hint: 'Check the small icons next to the speaker icon.',
    causes: [
      { text: 'The internet connection is down', correct: true },
      { text: 'The mouse is unplugged', why: 'The mouse is working. The problem is the connection.' },
      { text: 'The speakers are off', why: 'Speakers only make sound. They do not affect websites.' },
    ],
    actions: [
      { text: "Tell the teacher: \"The Wi-Fi is not connecting.\"", correct: true, habits: ['askHelp'],
        why: 'Perfect report! The teacher can check the network for the whole class.' },
      { text: 'Change the computer settings until it works', why: 'Settings control important things. Changing them can cause new problems.' },
      { text: 'Click refresh twenty times', why: 'Refreshing will not bring the internet back and just wastes time.' },
    ],
    solved: 'The teacher reconnected the Wi-Fi.',
  },
  {
    id: 'printer',
    student: 'rohan',
    problem: 'I clicked Print, but nothing came out of the printer!',
    scene: { screen: 'printing', printer: 'empty' },
    clues: [
      { spot: 'printerTray', key: true, text: 'The paper tray is empty!' },
      { spot: 'printer', text: 'The orange light on the printer is blinking. It needs something.' },
      { spot: 'screen', text: "The screen says 'Printer: waiting…'" },
      { spot: 'keyboard', text: 'The keyboard looks normal.' },
    ],
    hint: 'What does a printer need to print on?',
    causes: [
      { text: 'The printer has no paper', correct: true },
      { text: 'Caps Lock is on', why: 'Caps Lock changes letters, not printing.' },
      { text: 'The internet is down', why: 'The Wi-Fi icon is fine. The printer is asking for something else.' },
    ],
    actions: [
      { text: "Tell the teacher: \"The printer is out of paper.\"", correct: true, habits: ['askHelp'],
        why: 'Clear and helpful! You told the teacher exactly what the printer needs.' },
      { text: 'Open the printer and reach inside', why: 'Printers have hot parts and rollers that can pinch fingers.' },
      { text: 'Click Print ten more times', why: 'All ten copies will print later and waste lots of paper.' },
    ],
    solved: 'The teacher loaded paper and the page printed.',
  },
  {
    id: 'too-many-clicks',
    student: 'ishaan',
    problem: 'My game is taking forever to open. I clicked it lots of times!',
    scene: { screen: 'loading', busyLight: true },
    clues: [
      { spot: 'screen', key: true, text: "Lots of windows say 'Opening…'. Every click asked the computer to open the game again." },
      { spot: 'tower', text: 'The busy light is flickering fast. The computer is working very hard.' },
      { spot: 'mouse', text: 'The mouse works fine.' },
    ],
    hint: 'Count the windows on the screen.',
    causes: [
      { text: 'Too many clicks made the computer extra busy', correct: true },
      { text: 'The printer has no paper', why: 'The printer is not needed to open a game.' },
      { text: 'The monitor cable is loose', why: 'We can see the screen clearly, so the cable is fine.' },
    ],
    actions: [
      { text: 'Stop clicking and wait patiently', correct: true, habits: ['bePatient'],
        why: 'Patience wins! Once the computer catches up, the game will open.' },
      { text: 'Click the game even more times', why: 'More clicks means even more windows to open. Slower, not faster.' },
      { text: 'Pull out the plug to restart it', why: 'Pulling plugs is unsafe and can damage the computer.' },
    ],
    solved: 'The game opened once the computer caught up.',
  },
];
