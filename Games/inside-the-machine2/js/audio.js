/* Inside the Machine | audio.js
   Sound effects. Files live in assets/audio/ (MP3 for the game, WAV masters in assets/audio/wav/).
   The single-file build sets window.SFX_DATA with embedded copies instead. */
const SFX={
  tap:{file:'tap',vol:.45},              // buttons, level track, tapping a device part
  pickup:{file:'pickup',vol:.55},        // picking up / selecting a label, part or device
  drop:{file:'drop',vol:.7},             // any drop onto a target (right or wrong)
  correct:{file:'correct',vol:.8},       // right answer
  wrong:{file:'wrong',vol:.65},          // wrong answer (gentle)
  scan:{file:'scan',vol:.45},            // Level 1 scanner sweep (0.8 s = scan time)
  noChip:{file:'no-chip',vol:.55},       // Level 1 object without a chip
  reveal:{file:'reveal',vol:.6},         // new spaces appear / next device arrives
  levelComplete:{file:'level-complete',vol:.85},
  allComplete:{file:'all-complete',vol:.9}
};
const Sound=(()=>{
  const base={};
  for(const [k,v] of Object.entries(SFX)){
    const src=(window.SFX_DATA&&window.SFX_DATA[v.file])||`assets/audio/${v.file}.mp3`;
    const a=new Audio(src); a.preload='auto'; base[k]=a;
  }
  function play(k,delay=0){
    if(!store.sound||!base[k])return null;
    const a=base[k].cloneNode(); a.volume=SFX[k].vol;
    const go=()=>{a.play().catch(()=>{})};
    delay?setTimeout(go,delay):go();
    return a;
  }
  function stop(a){if(a){a.pause();a.currentTime=0}}
  function result(ok){play(ok?'correct':'wrong',90)}   // after the drop sound
  return {play,stop,result};
})();
