/* Inside the Machine | levels/level4-tap-the-part.js
   Riddles on a laptop, then a phone: tap the part each riddle describes.
   Sounds: tap, correct / wrong, reveal (phone arrives). */
function lvl4(sig){
  let d=0,r=0,busy=false,found=[];
  setTask('Level 4: Tap the part','Read each riddle, then tap the part of the device it describes. First a laptop, then a phone.');
  stage.innerHTML=`<section class="level l4"><div class="device-wrap" id="dev"></div>
      <div><div class="riddle"><p class="rn" id="rn"></p><p class="rq" id="rq"></p></div><p class="found" id="found"></p></div></section>`;
  const dev=$('#dev'), total=DEVICES.reduce((a,D)=>a+D.riddles.length,0); let solved=0;
  function load(){const D=DEVICES[d];dev.innerHTML=D.svg;dev.className='device-wrap '+D.title;found=[];$('#found').textContent='';ask();busy=false}
  function ask(){const D=DEVICES[d];$('#rn').textContent=`${cap(D.title)}: riddle ${r+1} of ${D.riddles.length}`;$('#rq').textContent=D.riddles[r].q}
  function pick(h){
    const D=DEVICES[d], part=h.dataset.part, want=D.riddles[r].part;
    Sound.play('tap');
    if(part!==want){Sound.result(false);flash(h,'miss');say(`That is the ${D.names[part]}. Read the riddle again and try another part.`,'no');return}
    Sound.result(true);
    h.classList.add('found'); found.push(D.names[part]); $('#found').textContent='Found: '+found.join(', ');
    solved++; setTally(`Riddles solved: ${solved} of ${total}`);
    say(`Yes! That is the ${D.names[part]}.`,'ok'); r++;
    if(r<D.riddles.length){ask();return}
    busy=true;
    if(d===0){say('Laptop done! Now let us look at a phone.','ok');
      setTimeout(()=>{if(sig.aborted)return;d=1;r=0;load();Sound.play('reveal')},1500)}
    else{$('#rn').textContent='All riddles solved';$('#rq').textContent='You know the parts of a laptop and a phone.';complete(4)}
  }
  dev.addEventListener('click',e=>{const h=e.target.closest('.hot');if(h&&!busy)pick(h)},{signal:sig});
  dev.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){const h=e.target.closest('.hot');if(h&&!busy){e.preventDefault();pick(h)}}},{signal:sig});
  load(); setTally(`Riddles solved: 0 of ${total}`);
  say('Riddle time! Each riddle describes one part. Tap the part you think it is.');
}
