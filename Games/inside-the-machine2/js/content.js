/* Inside the Machine | content.js
   ALL GAME TEXT AND DATA. Edit hints, clues, riddles and devices here. */
/* ---------- content ---------- */
const LEVELS=[
 {short:'Chip scanner',render:s=>lvl1(s)},
 {short:'Desk setup',render:s=>lvl2(s)},
 {short:'X-ray',render:s=>lvl3(s)},
 {short:'Tap the part',render:s=>lvl4(s)},
 {short:'Sorting belt',render:s=>lvl5(s)}
];
const L1=[
 {k:'tablet',name:'Tablet',chip:true,msg:'Chip found! A tablet is a computer you can hold in your hands.'},
 {k:'watch',name:'Smartwatch',chip:true,msg:'Chip found! A smartwatch is a tiny computer you wear.'},
 {k:'toaster',name:'Pop-up toaster',chip:false,msg:'No chip. This pop-up toaster just uses heat to make toast.'},
 {k:'book',name:'Book',chip:false,msg:'No chip. A book is made of paper, not computer parts.'},
 {k:'phone',name:'Phone',chip:true,msg:'Chip found! A phone is a computer that fits in your pocket.'}
];
const L2=[
 {n:1,label:'Monitor',hint:'I show words, pictures and videos. I look like a small TV.',x:50,y:30.7},
 {n:2,label:'System unit',hint:'I am the box that holds the brain of the computer.',x:85.8,y:57.3},
 {n:3,label:'Keyboard',hint:'I have lots of keys. Press them to type letters and numbers.',x:47.9,y:78.7},
 {n:4,label:'Mouse',hint:'Move me to point at things on the screen, then click to choose.',x:74.4,y:78.3},
 {n:5,label:'Speakers',hint:'I let you hear music and sounds.',x:15.4,y:65.3}
];
const L3=[
 {k:'psu',letter:'A',name:'Power supply (PSU)',short:'Power supply',clue:'I take electricity from the wall socket and give power to every part.',yay:'Power supply is in! It gives power to every part.',x:24,y:24,w:140,h:70},
 {k:'mb',letter:'B',name:'Motherboard',short:'Motherboard',clue:'I am the big main board. All the other parts plug into me.',yay:'Motherboard is in! Look, new spaces appeared on it. Other parts plug into the motherboard.',x:180,y:24,w:216,h:292},
 {k:'ram',letter:'C',name:'RAM',short:'RAM',clue:'I hold what you are working on right now. I forget it all when the power goes off.',yay:'RAM is in! It holds what you are working on right now.',x:326,y:44,w:54,h:100,sub:true},
 {k:'fan',letter:'D',name:'Cooling fan',short:'Fan',clue:'I spin round and round to stop the computer from getting too hot.',yay:'Cooling fan is in! It keeps the computer from getting too hot.',x:212,y:46,w:96,h:96,sub:true},
 {k:'hdd',letter:'E',name:'Hard disk (HDD)',short:'Hard disk',clue:'I keep your files and photos safe, even when the computer is switched off.',yay:'Hard disk is in! It stores your files even when the power is off.',x:24,y:222,w:140,h:94},
 {k:'gpu',letter:'F',name:'Graphics card',short:'Graphics card',clue:'I help draw pictures, videos and games on the monitor.',yay:'Graphics card is in! It helps show pictures and games.',x:198,y:190,w:184,h:60,sub:true}
];
const hot=(part,inner,n)=>`<g class="hot" data-part="${part}" tabindex="0" role="button" aria-label="Part ${n}">${inner}</g>`;
const LAPTOP=`<svg class="device" viewBox="0 0 400 270" aria-label="A laptop">
 <rect x="60" y="4" width="280" height="182" rx="14" class="hw"/>
 <path d="M22 192H378L396 250Q398 262 386 262H14Q2 262 4 250Z" class="hw"/>
 ${hot('screen','<rect x="74" y="30" width="252" height="144" rx="4" class="scr"/><rect x="74" y="30" width="252" height="144" rx="4" class="hit"/>',1)}
 ${hot('webcam','<circle cx="200" cy="17" r="12" class="hit"/><circle cx="200" cy="17" r="4.5" class="lens"/>',2)}
 ${hot('keyboard','<rect x="76" y="200" width="248" height="30" rx="4" class="kb"/><path d="M84 207h232M84 215h232M84 223h232" class="keys"/><rect x="76" y="200" width="248" height="30" rx="4" class="hit"/>',3)}
 ${hot('touchpad','<rect x="164" y="236" width="72" height="20" rx="4" class="pad"/><rect x="160" y="233" width="80" height="26" rx="5" class="hit"/>',4)}
 ${hot('speaker','<path d="M40 207h0M48 207h0M56 207h0M64 207h0M40 215h0M48 215h0M56 215h0M64 215h0M40 223h0M48 223h0M56 223h0M64 223h0M336 207h0M344 207h0M352 207h0M360 207h0M336 215h0M344 215h0M352 215h0M360 215h0M336 223h0M344 223h0M352 223h0M360 223h0" class="dots"/><rect x="33" y="200" width="38" height="30" rx="4" class="hit"/><rect x="329" y="200" width="38" height="30" rx="4" class="hit"/>',5)}
 ${hot('usb','<rect x="3" y="216" width="27" height="28" rx="4" class="hit"/><rect x="10" y="226" width="15" height="8" rx="1.5" class="port"/>',6)}
</svg>`;
const PHONE=`<svg class="device" viewBox="0 0 240 370" aria-label="A phone">
 <rect x="60" y="10" width="120" height="346" rx="22" class="hw"/>
 ${hot('touchscreen','<rect x="70" y="44" width="100" height="276" rx="6" class="scr"/><rect x="70" y="44" width="100" height="276" rx="6" class="hit"/>',1)}
 ${hot('earpiece','<rect x="92" y="18" width="38" height="20" rx="4" class="hit"/><rect x="99" y="25" width="24" height="5" rx="2.5" class="port"/>',2)}
 ${hot('camera','<circle cx="148" cy="28" r="11" class="hit"/><circle cx="148" cy="28" r="4.5" class="lens"/>',3)}
 ${hot('power','<rect x="178" y="84" width="24" height="56" rx="4" class="hit"/><rect x="180" y="92" width="7" height="40" rx="3" class="btn"/>',4)}
 ${hot('volume','<rect x="38" y="76" width="24" height="84" rx="4" class="hit"/><rect x="53" y="82" width="7" height="30" rx="3" class="btn"/><rect x="53" y="120" width="7" height="30" rx="3" class="btn"/>',5)}
 ${hot('port','<rect x="100" y="326" width="40" height="28" rx="4" class="hit"/><rect x="108" y="341" width="24" height="7" rx="3" class="port"/>',6)}
 ${hot('mic','<rect x="146" y="326" width="28" height="28" rx="4" class="hit"/><circle cx="155" cy="344" r="2.5" class="port"/><circle cx="163" cy="344" r="2.5" class="port"/>',7)}
</svg>`;
const DEVICES=[
 {title:'laptop',svg:LAPTOP,
  names:{screen:'screen',webcam:'webcam',keyboard:'keyboard',touchpad:'touchpad',speaker:'speaker',usb:'USB port'},
  riddles:[
   {part:'webcam',q:'I am a tiny camera above the screen. I see you in video calls. What am I?'},
   {part:'touchpad',q:'Slide your finger on me to move the pointer. What am I?'},
   {part:'usb',q:'Plug a pen drive into me to save your work. What am I?'},
   {part:'speaker',q:'Music and sounds come out of my tiny holes. What am I?'}
  ]},
 {title:'phone',svg:PHONE,
  names:{touchscreen:'touchscreen',earpiece:'earpiece speaker',camera:'front camera',power:'power button',volume:'volume buttons',port:'charging port',mic:'microphone'},
  riddles:[
   {part:'power',q:'Press me to switch the phone on or off. What am I?'},
   {part:'port',q:'Plug the charger into me when the battery is low. What am I?'},
   {part:'camera',q:'Smile! I take selfies. What am I?'},
   {part:'mic',q:'Say hello! I listen to your voice during a call. What am I?'}
  ]}
];
const CATS=[
 {k:'input',name:'Input',desc:'Puts information into the computer'},
 {k:'output',name:'Output',desc:'Gives information out to you'},
 {k:'network',name:'Networking',desc:'Connects computers together'}
];
const L5=[
 {k:'keyboard',name:'Keyboard',cat:'input',why:'You type on it to put letters into the computer.'},
 {k:'mouse',name:'Mouse',cat:'input',why:'You move and click it to give the computer instructions.'},
 {k:'mic',name:'Microphone',cat:'input',why:'It takes your voice into the computer.'},
 {k:'webcam',name:'Webcam',cat:'input',why:'It sends pictures of you into the computer.'},
 {k:'monitor',name:'Monitor',cat:'output',why:'It shows you what the computer is doing.'},
 {k:'printer',name:'Printer',cat:'output',why:'It puts your work out onto paper.'},
 {k:'speakers',name:'Speakers',cat:'output',why:'Sound comes out of them for everyone to hear.'},
 {k:'headphones',name:'Headphones',cat:'output',why:'Sound comes out of them just for you.'},
 {k:'router',name:'Wi-Fi router',cat:'network',why:'It shares the internet with devices using Wi-Fi.'},
 {k:'cable',name:'Network cable',cat:'network',why:'It joins a computer to a network.'},
 {k:'modem',name:'Modem',cat:'network',why:'It brings the internet into a building.'}
];
const DESK=`<svg viewBox="0 0 480 300" role="img" aria-label="A desktop computer on a desk, with five numbered parts">
 <rect x="0" y="252" width="480" height="14" rx="3" class="desk"/><rect x="30" y="266" width="14" height="34" class="desk"/><rect x="436" y="266" width="14" height="34" class="desk"/>
 <rect x="50" y="140" width="48" height="112" rx="8" class="hw"/><circle cx="74" cy="168" r="10" class="hw"/><circle cx="74" cy="216" r="17" class="hw"/>
 <rect x="228" y="155" width="24" height="58" class="hw"/><rect x="196" y="210" width="88" height="10" rx="5" class="hw"/>
 <rect x="150" y="30" width="180" height="125" rx="8" class="hw"/><rect x="162" y="42" width="156" height="101" rx="3" class="scr"/>
 <rect x="140" y="222" width="180" height="28" rx="5" class="hw"/><path d="M150 231h160M150 241h160" class="keys"/>
 <path d="M357 218c0-20 10-30 19-40" class="inkline"/><rect x="345" y="218" width="24" height="34" rx="12" class="hw"/>
 <rect x="376" y="92" width="72" height="160" rx="6" class="hw"/><circle cx="412" cy="112" r="7" class="hw"/><path d="M390 136h44M390 146h44" class="inkline"/>
</svg>`;
