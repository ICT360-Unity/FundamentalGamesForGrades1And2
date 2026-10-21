/* Inside the Machine | levels/level2-desk-setup.js
   Drag labels onto the numbered parts of a desktop setup using the hint cards.
   Sounds: pickup, drop, correct / wrong. */
function lvl2(sig){
  setTask('Level 2: Set up the desk','A new computer has arrived. Read the numbered hint cards, then drag each label onto the matching number. You can also tap a label, then tap a number.');
  stage.innerHTML=`<section class="level l2">
      <div class="scene">${DESK}${L2.map(p=>`<button type="button" class="pin" data-n="${p.n}" style="left:${p.x}%;top:${p.y}%" aria-label="Spot ${p.n}">${p.n}</button>`).join('')}</div>
      <div class="tray">${shuffle(L2).map(p=>`<button type="button" class="tag" data-label="${p.label}">${p.label}</button>`).join('')}</div>
      <ol class="hints">${L2.map(p=>`<li><b>${p.n}</b><span>${p.hint}</span></li>`).join('')}</ol>
    </section>`;
  say('Every part has a number. Read the hint card with the same number to work out its name.');
  let placed=0; setTally(`Labels placed: 0 of ${L2.length}`);
  dragTap({root:$('.level',stage),items:'.tag',targets:'.pin:not(.filled)',signal:sig,onDrop(tag,pin){
    const p=L2.find(q=>q.n==pin.dataset.n), ok=tag.dataset.label===p.label;
    Sound.result(ok);
    if(ok){
      pin.classList.add('filled');pin.textContent=p.label;pin.disabled=true;pin.setAttribute('aria-label',`Spot ${p.n}: ${p.label}`);
      tag.remove();placed++;setTally(`Labels placed: ${placed} of ${L2.length}`);say(`Yes! Number ${p.n} is the ${p.label.toLowerCase()}.`,'ok');
      if(placed===L2.length){say('The desk is set up and ready to switch on. Great work!','ok');complete(2)}
    }else{flash(pin,'nope');say(`Not quite. Read hint card ${p.n} again. Does it sound like the ${tag.dataset.label.toLowerCase()}?`,'no')}
  }});
}
