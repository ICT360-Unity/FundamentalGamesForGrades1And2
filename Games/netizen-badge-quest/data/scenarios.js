/* =========================================================
   Netizen Badge Quest — scenario data (L5 Digital Citizenship)
   Edit this file to change rules, wording, choices or order.
   Each scenario = one app on the tablet = one badge.
   choices[].ok  -> true for the good choice
   choices[].why -> short reason shown in the soft nudge
   ========================================================= */
window.NBQ_DATA = {
  title: "Netizen Badge Quest",
  lesson: "Lesson 5 · Digital Citizenship",
  scenarios: [
    {
      id: "popup", n: 1, app: "Game Zone", icon: "assets/icons/game.svg", color: "#D93A50",
      rule: "Don't click flashy pop-ups", badge: "Pop-up Spotter", type: "popup",
      question: "A pop-up says you won a prize! What do you do?",
      choices: [
        { text: "Tap CLAIM NOW to get my prize", ok: false,
          why: "Prizes in pop-ups are usually tricks. Tapping can bring viruses or ask for private info." },
        { text: "Close it and tell a grown-up if it comes back", ok: true },
        { text: "Type my name and address to claim it", ok: false,
          why: "Never type your details into a pop-up. Real prizes don't arrive this way." }
      ],
      success: "Flashy pop-ups are often tricks. Closing them keeps you and your tablet safe."
    },
    {
      id: "stranger", n: 2, app: "Chat Room", icon: "assets/icons/chat.svg", color: "#2E7BD9",
      rule: "Don't share with strangers online", badge: "Stranger Safe", type: "chat",
      chat: {
        name: "StarPlayer_99", sub: "Not in your contacts", avatar: "?", color: "#8A94A6",
        msgs: [
          { text: "hi!! im 9 too 😊" },
          { text: "which school do u go to?", key: true },
          { text: "send me a pic of u!", key: true }
        ]
      },
      question: "Someone you don't know is asking questions. What do you do?",
      choices: [
        { text: "Tell them my school's name", ok: false,
          why: "Your school is personal info. People online may not be who they say they are." },
        { text: "Don't reply, and show a trusted adult", ok: true },
        { text: "Send a photo so we can be friends", ok: false,
          why: "Photos of you are private. Never send them to someone you don't know in real life." }
      ],
      success: "People online may not be who they say. Telling a trusted adult is the smart move."
    },
    {
      id: "art", n: 3, app: "Art Studio", icon: "assets/icons/art.svg", color: "#D54BA0",
      rule: "Ask before sharing others' work", badge: "Credit Keeper", type: "art",
      question: "Kabir wants to post Riya's drawing. What do you say?",
      choices: [
        { text: "Sure, let's say we drew it!", ok: false,
          why: "Taking credit for someone else's work isn't fair. Riya made it!" },
        { text: "Let's ask Riya first, and say she drew it", ok: true },
        { text: "Post it now. She won't mind", ok: false,
          why: "We can't know until we ask. Riya gets to decide where her art goes." }
      ],
      success: "Other people's work belongs to them. Ask first, and always give credit."
    },
    {
      id: "timer", n: 4, app: "Play Timer", icon: "assets/icons/timer.svg", color: "#E59A0E",
      rule: "Balance your screen time", badge: "Time Balancer", type: "timer",
      question: "Your play time is up, but your level isn't finished. What now?",
      choices: [
        { text: "Turn off the timer and keep playing", ok: false,
          why: "Timers give your eyes, body and brain a rest. Switching them off isn't the answer." },
        { text: "Save my game, then go play outside or read", ok: true },
        { text: "Play 'just one more' level… again and again", ok: false,
          why: "'Just one more' can turn into hours. Stop when time's up. Your game will wait!" }
      ],
      success: "Screens are fun, and so are breaks! Balance keeps you healthy and happy."
    },
    {
      id: "photo", n: 5, app: "Photos", icon: "assets/icons/photo.svg", color: "#13A08F",
      rule: "Keep personal info private", badge: "Privacy Pro", type: "photo",
      question: "You want to post this photo online. Look closely! What should you do?",
      choices: [
        { text: "Post it. It's a nice photo!", ok: false,
          why: "Look again: the house number and street sign show where you live." },
        { text: "Pick a photo that doesn't show where I live", ok: true },
        { text: "Post it and add my address in the caption", ok: false,
          why: "Your address is private info. Never share it online." }
      ],
      success: "You spotted it! House numbers, street names and school names are private."
    },
    {
      id: "password", n: 6, app: "Password Lab", icon: "assets/icons/lock.svg", color: "#7A4FE0",
      rule: "Make strong passwords", badge: "Password Builder", type: "password",
      success: "Strong passwords mix fun words, numbers and symbols, and never use your name or birthday."
    },
    {
      id: "secret", n: 7, app: "Messages", icon: "assets/icons/mail.svg", color: "#2E9E4F",
      rule: "Keep passwords secret", badge: "Secret Keeper", type: "chat",
      chat: {
        name: "Aarav", sub: "Best friend", avatar: "A", color: "#F2643C",
        msgs: [
          { text: "hey!! can u tell me ur game password?", key: true },
          { text: "i just want to collect coins for u 😁" },
          { text: "promise i won't tell anyone" }
        ]
      },
      question: "Your best friend asks for your password. What do you say?",
      choices: [
        { text: "Okay, because you're my best friend", ok: false,
          why: "Even best friends shouldn't know your password. Only you and your parents should." },
        { text: "Sorry! Passwords are private, even with friends", ok: true },
        { text: "I'll give you a hint so you can guess it", ok: false,
          why: "A hint makes your password easy to guess. Keep all of it secret." }
      ],
      success: "A password is like a toothbrush: don't share it! Only you and your grown-ups should know it."
    },
    {
      id: "kind", n: 8, app: "Class Videos", icon: "assets/icons/video.svg", color: "#F2643C",
      rule: "Be kind online", badge: "Kindness Star", type: "video",
      question: "Meera posted her first dance video. Which comment will you post?",
      choices: [
        { text: "LOL that's so bad 😂", ok: false,
          why: "That could really hurt Meera. Words online can sting just like words in person." },
        { text: "Great moves, Meera! Brave of you to share 🌟", ok: true },
        { text: "Share it so everyone can laugh", ok: false,
          why: "Spreading something to laugh at someone is unkind. Treat others how you'd like to be treated." }
      ],
      success: "Kind words online make the internet a happier place for everyone."
    },
    {
      id: "speakup", n: 9, app: "Class Group", icon: "assets/icons/group.svg", color: "#56657A",
      rule: "Tell a trusted adult", badge: "Speak-Up Hero", type: "chat",
      chat: {
        name: "Class 3B Gamers", sub: "6 members", avatar: "3B", color: "#56657A", group: true,
        msgs: [
          { from: "Ishaan", text: "who's playing tonight? 🎮" },
          { from: "You", text: "me!!", mine: true },
          { from: "unknown_kid", text: "nobody wants u here. LEAVE.", mean: true, key: true }
        ]
      },
      question: "Someone sent you a mean message, and it makes you feel bad. What do you do?",
      choices: [
        { text: "Send an even meaner message back", ok: false,
          why: "Being mean back can make things worse. You don't have to fight it alone." },
        { text: "Don't reply. Save it and tell a trusted adult", ok: true },
        { text: "Keep it a secret and feel sad alone", ok: false,
          why: "You don't have to handle this alone. A trusted adult can help make it stop." }
      ],
      success: "Speaking up is brave. Grown-ups can help when something online feels wrong."
    },
    {
      id: "store", n: 10, app: "App Store", icon: "assets/icons/store.svg", color: "#0A8FB0",
      rule: "Ask before you download", badge: "Smart Downloader", type: "store",
      question: "A free game wants your camera, contacts and location. What do you do?",
      choices: [
        { text: "Tap GET right away. It's free!", ok: false,
          why: "Free apps can still collect your info or ask for money later. Check first." },
        { text: "Ask a parent or teacher before downloading", ok: true },
        { text: "Download it and tap 'Allow' on everything", ok: false,
          why: "'Allow' on everything lets an app see private things. A grown-up can help you choose." }
      ],
      success: "Asking before you download keeps you, your info and your tablet safe."
    }
  ],

  /* Password Lab tiles. trap:true tiles are easy-to-guess on purpose. */
  passwordTiles: {
    word: [
      { t: "Mango" }, { t: "Rocket" }, { t: "Purple" }, { t: "Tiger" },
      { t: "password", trap: true, warn: "\"password\" is one of the first words people guess. Tap it in the box to take it out." }
    ],
    num: [
      { t: "7" }, { t: "42" }, { t: "315" },
      { t: "123", trap: true, warn: "\"123\" is super easy to guess. Pick a different number." }
    ],
    sym: [ { t: "!" }, { t: "#" }, { t: "@" }, { t: "*" } ]
  },
  passwordMaxTiles: 6
};
