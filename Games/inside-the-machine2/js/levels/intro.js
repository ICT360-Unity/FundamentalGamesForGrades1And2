/* Inside the Machine | levels/intro.js
   Title screen with the technician name badge. */
function intro(sig){
  stage.innerHTML=`<section class="level"><div class="intro">
    <div class="badge-card"><div class="badge-top"><span>ICT360 Computer Lab</span><i></i></div>
      <div class="badge-body">${AVATAR}
        <label>Write your name on your badge<input id="nm" maxlength="20" autocomplete="off" value="${esc(store.name)}"></label>
        <p class="role">Technician in training</p></div></div>
    <div class="intro-text"><h2>Welcome to the computer lab</h2>
      <p>You are the newest technician. Your job is to find the computers hiding in the lab, set one up, and learn what is inside it.</p>
      <p>Volt the lab robot will help you. Finish all 5 levels to earn your technician badge.</p>
      <button class="go" type="button" id="start">Start level 1</button></div>
  </div></section>`;
  $('#nm').addEventListener('input',e=>{store.name=e.target.value;save()},{signal:sig});
  $('#start').addEventListener('click',()=>{Sound.play('tap');go(1)},{signal:sig});
}
