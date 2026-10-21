/* Inside the Machine | levels/badge.js
   Completion certificate (reached after all 5 levels; the all-complete fanfare plays on the overlay before this). */
function badge(sig){
  const nm=store.name.trim()||'Technician';
  stage.innerHTML=`<section class="level"><div class="intro">
    <div class="badge-card"><div class="badge-top"><span>ICT360 Computer Lab</span><i></i></div>
      <div class="badge-body">${AVATAR}<p class="bname">${esc(nm)}</p><p class="role">Certified computer technician</p><div class="mini-leds">${LEVELS.map(()=>'<span class="on"></span>').join('')}</div></div></div>
    <div class="intro-text"><h2>Congratulations, ${esc(nm)}!</h2><p>You earned your badge. Today you found out that:</p>
      <ul class="learned">
        <li>Phones, tablets and smartwatches are computers because they have computer chips inside.</li>
        <li>A desktop computer has a monitor, system unit, keyboard, mouse and speakers.</li>
        <li>Inside the system unit are the motherboard, RAM, power supply, hard disk, cooling fan and graphics card.</li>
        <li>Laptops and phones have parts like a webcam, touchpad, charging port and microphone.</li>
        <li>Devices can be sorted into input, output and networking.</li>
      </ul>
      <button class="go" type="button" id="again">Play again</button></div>
  </div></section>`;
  Sound.play('reveal');
  $('#again').addEventListener('click',()=>{Sound.play('tap');store.done=[];save();go(1)},{signal:sig});
}
