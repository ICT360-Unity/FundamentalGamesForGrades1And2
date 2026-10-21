/* Inside the Machine | levels/level1-chip-scanner.js
   Sweep the scanner over objects; anything with a computer chip lights up.
   Sounds: scan (while scanning), correct (chip found), noChip (no chip). */
function lvl1(sig){
  const objs=shuffle(L1);
  setTask('Level 1: Chip scanner','Move the blue scanner over each object and hold it still. Anything with a computer chip inside will light up. You can also tap an object to scan it.');
  stage.innerHTML=`<section class="level">
    <div class="lab" id="lab"><div class="shelf">${objs.map((o,i)=>`<button type="button" class="obj" data-i="${i}" aria-label="Scan the ${o.name.toLowerCase()}"><span class="ico">${ico(o.k)}</span><span class="nm">${o.name}</span><span class="res"></span><span class="bar"></span></button>`).join('')}</div>
      <div class="scanner" id="scanner">${SCANNER}</div></div></section>`;
  say('Some of these objects are secretly computers. Use the scanner to find the computer chips.');
  const lab=$('#lab'), sc=$('#scanner'); let cur=null,timer=null,hum=null,count=0;
  setTally(`Scanned 0 of ${objs.length}`);
  const place=(x,y)=>{sc.style.transform=`translate(${x-34}px,${y-34}px)`};
  place(lab.clientWidth-70,lab.clientHeight-50);
  const stop=()=>{clearTimeout(timer);Sound.stop(hum);hum=null;if(cur)cur.classList.remove('scanning');cur=null};
  sig.addEventListener('abort',stop);
  lab.addEventListener('pointermove',e=>{
    const r=lab.getBoundingClientRect(); place((e.clientX-r.left)/SCALE,(e.clientY-r.top)/SCALE);
    const el=document.elementFromPoint(e.clientX,e.clientY), o=el&&el.closest('.obj');
    if(o===cur)return; stop();
    if(o&&!o.classList.contains('scanned')){cur=o;o.classList.add('scanning');hum=Sound.play('scan');timer=setTimeout(()=>{hum=null;stop();reveal(o)},800)}
  },{signal:sig});
  lab.addEventListener('pointerleave',stop,{signal:sig});
  lab.addEventListener('click',e=>{const o=e.target.closest('.obj');if(o&&!o.classList.contains('scanned')){stop();reveal(o)}},{signal:sig});
  function reveal(o){
    const d=objs[+o.dataset.i];
    o.classList.add('scanned',d.chip?'chip':'nochip');
    $('.res',o).innerHTML=d.chip?`${CHIP} Chip found`:'No chip';
    o.setAttribute('aria-label',`${d.name}: ${d.chip?'computer chip found':'no chip'}`);
    Sound.play(d.chip?'correct':'noChip');
    count++; setTally(`Scanned ${count} of ${objs.length}`);
    say(d.msg,d.chip?'ok':'');
    if(count===objs.length)setTimeout(()=>{if(sig.aborted)return;
      say('Scan complete! The tablet, smartwatch and phone all have computer chips. Surprise: phones and tablets are computers too!','ok');complete(1)},900);
  }
}
