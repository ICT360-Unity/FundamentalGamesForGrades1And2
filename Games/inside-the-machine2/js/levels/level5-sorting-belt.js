/* Inside the Machine | levels/level5-sorting-belt.js
   Devices ride a conveyor belt; sort each into Input, Output or Networking.
   Sounds: pickup, drop, correct / wrong. */
function lvl5(sig){
  const queue=shuffle(L5); let i=0, drag=null, lastDrag=0; const counts={input:0,output:0,network:0};
  setTask('Level 5: Sorting belt','Devices are riding the belt. Drag each one into the right bin, or tap the bin while the device is on the belt.');
  stage.innerHTML=`<section class="level l5">
    <div class="bins">${CATS.map(c=>`<button type="button" class="bin ${c.k}" data-cat="${c.k}"><strong>${c.name}</strong><span>${c.desc}</span><em data-c="${c.k}">0</em></button>`).join('')}</div>
    <div class="belt" id="belt"></div></section>`;
  const belt=$('#belt');
  function next(){
    if(i>=queue.length){belt.innerHTML='<p class="empty">The belt is empty. Every device is sorted!</p>';setTally(`Sorted ${queue.length} of ${queue.length}`);
      say('Brilliant sorting! Input puts information in, output gives it out, and networking connects computers together.','ok');complete(5);return}
    const it=queue[i];
    belt.innerHTML=`<div class="parcel" id="parcel" role="img" aria-label="On the belt: ${it.name}">${ico(it.k)}<span>${it.name}</span></div>`;
    setTally(`Device ${i+1} of ${queue.length}`);
  }
  function sortTo(cat,bin){
    const it=queue[i]; if(!it)return;
    Sound.play('drop'); Sound.result(it.cat===cat);
    if(it.cat===cat){counts[cat]++;$(`[data-c="${cat}"]`,stage).textContent=counts[cat];flash(bin,'good');say(`Yes! ${it.name}: ${it.why}`,'ok');i++;next()}
    else{flash(bin,'nope');say(`Not quite. ${it.name}: ${it.why} Which bin fits that?`,'no')}
  }
  $$('.bin',stage).forEach(b=>b.addEventListener('click',()=>{if(Date.now()-lastDrag<350)return;sortTo(b.dataset.cat,b)},{signal:sig}));
  belt.addEventListener('pointerdown',e=>{
    const p=e.target.closest('.parcel'); if(!p||e.button>0)return;
    p.classList.add('paused'); drag={p,x:e.clientX,y:e.clientY,ghost:null,over:null};
  },{signal:sig});
  addEventListener('pointermove',e=>{
    if(!drag)return;
    if(!drag.ghost){if(Math.hypot(e.clientX-drag.x,e.clientY-drag.y)<8)return;
      Sound.play('pickup');
      const g=drag.p.cloneNode(true);g.classList.add('ghost');g.style.animation='none';g.style.bottom='auto';document.body.appendChild(g);drag.ghost=g;drag.p.style.visibility='hidden'}
    drag.ghost.style.left=e.clientX+'px';drag.ghost.style.top=e.clientY+'px';
    const el=document.elementFromPoint(e.clientX,e.clientY), b=el&&el.closest('.bin');
    if(drag.over!==b){drag.over&&drag.over.classList.remove('hover');b&&b.classList.add('hover');drag.over=b}
  },{signal:sig});
  const end=()=>{
    if(!drag)return; const d=drag; drag=null;
    if(!d.ghost){Sound.play('pickup');say('Belt paused. Tap the bin where this device belongs.');return}
    d.ghost.remove(); d.p.style.visibility=''; d.over&&d.over.classList.remove('hover'); lastDrag=Date.now();
    if(d.over)sortTo(d.over.dataset.cat,d.over);
    if(d.p.isConnected)d.p.classList.remove('paused');
  };
  addEventListener('pointerup',end,{signal:sig});
  addEventListener('pointercancel',end,{signal:sig});
  next();
  say('Input devices put information in. Output devices give it out. Networking devices connect computers together.');
}
