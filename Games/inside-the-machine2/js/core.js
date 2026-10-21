/* Inside the Machine | core.js
   Helpers and game state. Progress and name last for one play session only (classroom devices are shared);
   only the sound on/off choice is remembered on the device. */
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cap=s=>s[0].toUpperCase()+s.slice(1);

/* ---------- progress (per-viewer convenience only) ---------- */
const KEY='inside-the-machine-sound';
let store={done:[],name:'',sound:true};
try{store.sound=localStorage.getItem(KEY)!=='off'}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,store.sound?'on':'off')}catch(e){}};
