/* Inside the Machine | levels/level3-xray.js
   X-ray view of the system unit: drag parts into lettered spaces using the clue cards.
   RAM, fan and graphics card spaces appear only after the motherboard is in.
   Sounds: pickup, drop, correct / wrong, reveal (new spaces appear). */
function lvl3(sig){
  setTask('Level 3: X-ray the system unit','This is an X-ray view inside the system unit. Each empty space has a letter. Read the clue card with that letter, then drag the right part into the space.');
  stage.innerHTML=`<section class="level l3">
      <div class="case">${L3.map(p=>`<button type="button" class="slot${p.k==='mb'?' mb':''}${p.sub?' sub':''}" data-k="${p.k}" style="left:${(p.x/4.2).toFixed(2)}%;top:${(p.y/3.4).toFixed(2)}%;width:${(p.w/4.2).toFixed(2)}%;height:${(p.h/3.4).toFixed(2)}%"${p.sub?' hidden':''} aria-label="Space ${p.letter}">${p.letter}</button>`).join('')}</div>
      <ol class="hints clues">${L3.map(p=>`<li><b>${p.letter}</b><span>${p.clue}</span></li>`).join('')}</ol>
      <div class="tray">${shuffle(L3).map(p=>`<button type="button" class="tag" data-k="${p.k}">${ico(p.k)}${p.name}</button>`).join('')}</div>
    </section>`;
  say('Some spaces stay hidden until one big part goes in. Can you work out which part?');
  let placed=0, mbIn=false; setTally(`Parts fitted: 0 of ${L3.length}`);
  dragTap({root:$('.level',stage),items:'.tag',targets:'.slot:not(.filled)',signal:sig,onDrop(tag,slot){
    const part=L3.find(p=>p.k===tag.dataset.k), sp=L3.find(p=>p.k===slot.dataset.k), ok=part.k===sp.k;
    Sound.result(ok);
    if(ok){
      slot.classList.add('filled');slot.disabled=true;slot.setAttribute('aria-label',`Space ${sp.letter}: ${part.short}`);
      slot.innerHTML=part.k==='mb'?`<small>${part.short}</small>`:`${ico(part.k)}<small>${part.short}</small>`;
      tag.remove();placed++;setTally(`Parts fitted: ${placed} of ${L3.length}`);
      if(part.k==='mb'){mbIn=true;$$('.slot.sub',stage).forEach(s=>s.hidden=false);Sound.play('reveal',500)}
      say(part.yay,'ok');
      if(placed===L3.length){say('The system unit is complete. You built the inside of a computer!','ok');complete(3)}
    }else if(part.sub&&sp.k==='mb'&&!mbIn){flash(slot,'nope');say(`The ${part.short.toLowerCase()} plugs into the motherboard. Put the motherboard in first!`,'no')}
    else{flash(slot,'nope');say(`That part does not match clue ${sp.letter}. Read clue ${sp.letter} again.`,'no')}
  }});
}
