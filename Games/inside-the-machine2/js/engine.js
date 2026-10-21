/* Inside the Machine | engine.js
   Frame scaling, screen switching, LED level track, side panel, coach messages,
   level-complete overlay, sound toggle and the drag-or-tap helper. */
const W=1130, H=502;
const frame=$('#frame'), stage=$('#stage'), track=$('#track'), coach=$('#coach'), sayEl=$('#say'), taskEl=$('#task'), tallyEl=$('#tally'), muteBtn=$('#mute');
let current=0, ctl=null, SCALE=1;

/* ---------- fixed 1130 x 502 frame, scaled to fit ---------- */
function fit(){
  const vp=frame.parentElement, cw=vp.clientWidth, ch=vp.clientHeight;
  SCALE=Math.min(cw/W,ch/H);
  frame.style.transform=`translate(${(cw-W*SCALE)/2}px,${(ch-H*SCALE)/2}px) scale(${SCALE})`;
  document.documentElement.style.setProperty('--gs',SCALE);
}
addEventListener('resize',fit); fit();

/* ---------- side panel + coach ---------- */
function say(t,mood=''){sayEl.textContent=t;coach.className='coach '+mood}
function setTask(title,text){taskEl.innerHTML=`<h2 tabindex="-1">${title}</h2><p>${text}</p>`}
function setTally(t){tallyEl.textContent=t}
function flash(el,cls){el.classList.remove(cls);void el.offsetWidth;el.classList.add(cls);setTimeout(()=>el.classList.remove(cls),600)}

/* ---------- sound toggle ---------- */
const SPK_ON='<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9z" fill="#fff"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/></svg>';
const SPK_OFF='<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9z" fill="#fff"/><path d="M17 9l5 6M22 9l-5 6"/></svg>';
function renderMute(){muteBtn.innerHTML=store.sound?SPK_ON:SPK_OFF;muteBtn.setAttribute('aria-pressed',String(!store.sound));muteBtn.setAttribute('aria-label',store.sound?'Sound on. Turn sound off':'Sound off. Turn sound on')}
muteBtn.addEventListener('click',()=>{store.sound=!store.sound;save();renderMute();Sound.play('tap')});
renderMute();

/* ---------- navigation ---------- */
function renderTrack(){
  track.innerHTML=LEVELS.map((L,i)=>{const n=i+1,done=store.done.includes(n),cur=current===n;
    return `<button type="button" class="led${done?' lit':''}${cur?' cur':''}" data-go="${n}" aria-label="Level ${n}: ${L.short}${done?', complete':''}"${cur?' aria-current="step"':''}><span class="bulb">${n}</span><span class="lbl">${L.short}</span></button>`}).join('');
}
function go(n){
  if(ctl)ctl.abort(); ctl=new AbortController(); current=n; renderTrack();
  const sig=ctl.signal;
  frame.classList.toggle('full',n===0||n===6);
  setTally('');
  if(n===0)intro(sig); else if(n===6)badge(sig); else LEVELS[n-1].render(sig);
  const h=$('h2',taskEl); if(h&&n>0&&n<6)h.focus({preventScroll:true});
}
function complete(n){
  if(!store.done.includes(n)){store.done.push(n);save()}
  renderTrack();
  const all=LEVELS.every((_,i)=>store.done.includes(i+1));
  // Next button always moves forward one level; after level 5 it goes to the badge
  // if every level is done, otherwise back to the first level still to finish.
  const target=all?6:(n<5?n+1:LEVELS.map((_,i)=>i+1).find(k=>!store.done.includes(k)));
  const win=document.createElement('div'); win.className='win';
  win.innerHTML=`<div class="win-card" role="dialog" aria-label="${all?'All levels complete':'Level '+n+' complete'}">
    <div class="mini-leds">${LEVELS.map((_,i)=>`<span class="${store.done.includes(i+1)?'on':''}"></span>`).join('')}</div>
    <h3>${all?'All 5 levels complete!':'Level '+n+' complete!'}</h3>
    <p>${all?'You have finished every job in the lab. Time to collect your technician badge.':`${store.done.length} of 5 levels done. Keep going, technician!`}</p>
    <button class="go" type="button">${all?'Get your technician badge':'Go to level '+target}</button></div>`;
  setTimeout(()=>{
    if(!stage.contains($('.level',stage)))return;
    $('.level',stage).appendChild(win);
    Sound.play(all?'allComplete':'levelComplete');
    const b=$('button',win); b.onclick=()=>{Sound.play('tap');go(target)}; b.focus({preventScroll:true});
  },900);
}
track.addEventListener('click',e=>{const b=e.target.closest('[data-go]');if(b){Sound.play('tap');go(+b.dataset.go)}});
$('#home').addEventListener('click',()=>{Sound.play('tap');go(0)});

/* ---------- drag OR tap-then-tap (mouse, touch, keyboard) ---------- */
function dragTap({root,items,targets,onDrop,signal}){
  let selected=null,drag=null,lastDrag=0;
  const clear=()=>{if(selected)selected.classList.remove('selected');selected=null;root.classList.remove('carrying')};
  const drop=(it,tg)=>{Sound.play('drop');onDrop(it,tg)};
  root.addEventListener('click',e=>{
    if(Date.now()-lastDrag<350)return;
    const it=e.target.closest(items);
    if(it){const same=selected===it;clear();if(!same){selected=it;it.classList.add('selected');root.classList.add('carrying');Sound.play('pickup')}return}
    const tg=e.target.closest(targets);
    if(tg&&selected){const s=selected;clear();drop(s,tg)}
  },{signal});
  root.addEventListener('pointerdown',e=>{
    const it=e.target.closest(items); if(!it||e.button>0)return;
    drag={it,x:e.clientX,y:e.clientY,ghost:null,over:null};
  },{signal});
  addEventListener('pointermove',e=>{
    if(!drag)return;
    if(!drag.ghost){
      if(Math.hypot(e.clientX-drag.x,e.clientY-drag.y)<8)return;
      clear(); Sound.play('pickup');
      const g=drag.it.cloneNode(true); g.classList.add('ghost'); document.body.appendChild(g);
      drag.ghost=g; drag.it.classList.add('lifted'); root.classList.add('carrying');
    }
    drag.ghost.style.left=e.clientX+'px'; drag.ghost.style.top=e.clientY+'px';
    const el=document.elementFromPoint(e.clientX,e.clientY), tg=el&&el.closest(targets);
    if(drag.over!==tg){drag.over&&drag.over.classList.remove('hover');tg&&tg.classList.add('hover');drag.over=tg}
  },{signal});
  const end=cancel=>()=>{
    if(!drag)return; const d=drag; drag=null;
    if(!d.ghost)return;
    d.ghost.remove(); d.it.classList.remove('lifted'); root.classList.remove('carrying');
    d.over&&d.over.classList.remove('hover'); lastDrag=Date.now();
    if(!cancel&&d.over)drop(d.it,d.over);
  };
  addEventListener('pointerup',end(false),{signal});
  addEventListener('pointercancel',end(true),{signal});
}
