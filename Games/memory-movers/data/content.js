/* Memory Movers | data/content.js
   Every word and number in the game. Edit freely; no other file needs to change.
   Loaded as a plain script (works from file:// and on any server). */
window.MM_CONTENT = (function () {
const LEVELS = [
  { title:"Desk vs Shelf",
    intro:"A computer has a desk and a shelf. The desk is RAM: it holds what you are using right now. The shelf is storage: it keeps saved things, even when the computer is off.",
    takeaway:"RAM is like a desk: fast, but it is cleared when the power goes off. Storage is like a shelf: it keeps your saved work." },
  { title:"Unit Ladder",
    intro:"Computers measure memory in units. Build a ladder from the smallest unit to the biggest, then work out which size fits each thing.",
    takeaway:"Byte, Kilobyte, Megabyte, Gigabyte, Terabyte. Each step is about 1,024 times bigger than the one before." },
  { title:"Pack the Pendrive",
    intro:"A pendrive can only hold so much. Tap files to pack them, watch the space bar, and eject the drive when the mission is done.",
    takeaway:"Every storage device has a capacity. When it is full, there is no room left until you remove something." },
  { title:"Inside or Outside?",
    intro:"Some memory lives inside the computer. Some you can plug in and carry around. Sort each device before it rolls off the belt.",
    takeaway:"Internal memory (RAM, ROM, hard disk, SSD) stays inside. External memory (pendrive, memory card, CD, external hard disk) is portable." },
];
const DESK_CARDS = [
  ["The story you are typing right now","icon_story",true,"You are working on it right now, so it is on the desk (RAM)."],
  ["Photos from last year's trip","icon_photo",false,"Saved photos are kept on the shelf (storage)."],
  ["The game you are playing now","icon_game",true,"A game you are playing is in use, so it is on the desk (RAM)."],
  ["Songs you downloaded last week","icon_song",false,"Downloaded songs are saved, so they live on the shelf (storage)."],
  ["A drawing you are colouring now","icon_drawing",true,"You are still colouring it, so it is on the desk (RAM)."],
  ["Your saved homework folder","icon_folder",false,"Saved files stay on the shelf (storage)."],
  ["The website open on your screen","icon_browser",true,"An open website is in use right now, so it is on the desk (RAM)."],
  ["Apps installed on the computer","icon_calculator",false,"Installed apps are stored on the shelf until you open them."],
].map(([text,icon,isDesk,why]) => ({text,icon,isDesk,why}));
const POWER_CUT_SECONDS = 8;
const UNITS = [
  ["Byte","B","tiny box","unit_byte"],["Kilobyte","KB","bigger box","unit_kb"],["Megabyte","MB","suitcase","unit_mb"],
  ["Gigabyte","GB","storage room","unit_gb"],["Terabyte","TB","building","unit_tb"],
].map(([name,short,metaphor,icon]) => ({name,short,metaphor,icon}));
const SIZE_ITEMS = [
  ['The word "cat"',"icon_word",0,"3 bytes",'Each letter takes 1 byte, so "cat" is 3 bytes.'],
  ["A one-page story","icon_story",1,"about 2 KB","A page of typing is a few kilobytes."],
  ["A 1-minute song","icon_song",2,"about 1 MB","One minute of music is about 1 megabyte."],
  ["A holiday photo","icon_photo",2,"about 3 MB","A phone photo is a few megabytes."],
  ["A full movie","icon_movie",3,"about 1 GB","A whole movie is about 1 gigabyte."],
  ["1,000 movies","icon_library",4,"about 1 TB","A thousand movies need about 1 terabyte."],
].map(([text,icon,unit,size,why]) => ({text,icon,unit,size,why}));
const F = (name,icon,gb,required=false) => ({name,icon,gb,required});
const PACK_ROUNDS = [
  { capacity:4, target:4, mission:"Fill the 4 GB pendrive all the way up. No space left over!",
    files:[F("Movie","icon_movie",2),F("Songs","icon_song",1),F("Photos","icon_photo",1),F("Game","icon_game",3)] },
  { capacity:8, target:7, mission:"Pack the starred file, then fill at least 7 GB.",
    files:[F("Science project","icon_project",2,true),F("Cartoon","icon_cartoon",5),F("Game","icon_game",3),F("Movie","icon_movie",4),F("Songs","icon_song",1)] },
  { capacity:16, target:15, mission:"Pack both starred files, then fill at least 15 GB.",
    files:[F("Class video","icon_movie",6,true),F("Slides","icon_slides",1,true),F("Big game","icon_game",10),F("Cartoon","icon_cartoon",5),F("Photos","icon_photo",3),F("Songs","icon_song",2),F("Stories","icon_story",1)] },
];
const DEVICES = [
  ["RAM","dev_ram",true,"RAM is fixed inside, on the computer's main board."],
  ["Pen drive","dev_pendrive",false,"A pen drive plugs in and goes anywhere with you."],
  ["Hard disk","dev_hdd",true,"This hard disk is fitted inside the computer."],
  ["Memory card","dev_sdcard",false,"Memory cards move between cameras, phones and computers."],
  ["ROM","dev_rom",true,"ROM is a chip that stays inside the computer."],
  ["CD / DVD","dev_cd",false,"You can carry a CD or DVD and play it on another computer."],
  ["SSD","dev_ssd",true,"This SSD is fitted inside the computer."],
  ["External hard disk","dev_exthdd",false,"An external hard disk connects with a cable and is portable."],
].map(([name,icon,internal,why]) => ({name,icon,internal,why}));
const BELT_START = 9, BELT_MIN = 6, BELT_SPEEDUP = 0.4;
const RECAP = ["RAM is the desk: fast, and cleared when power goes off.","Storage is the shelf: it keeps saved work.","Byte, KB, MB, GB, TB: each step is about 1,024 times bigger."];


  return { LEVELS, DESK_CARDS, POWER_CUT_SECONDS, UNITS, SIZE_ITEMS, PACK_ROUNDS, DEVICES,
           BELT_START, BELT_MIN, BELT_SPEEDUP, RECAP };
})();
