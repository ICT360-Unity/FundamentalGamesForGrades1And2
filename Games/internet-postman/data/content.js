/* =========================================================
   Internet Postman — game content
   Grade 3 · Lesson 4 · Browser
   Edit text here; no JS changes needed for wording.
   Loaded as a script (not JSON) so the game also runs
   straight from the file system without a server.
   ========================================================= */
window.POSTMAN_DATA = {

  title: "Internet Postman",
  subtitle: "Deliver parcels across Internet City",

  /* Short teaching line shown on each round's intro card */
  rounds: [
    { id: 1, name: "Address Workshop",
      teach: "Every website has its own special address, like www.kiddle.co.",
      task: "Build the website address for each parcel." },
    { id: 2, name: "Open the Right Door",
      teach: "A browser is like a doorway to the internet. You cannot visit a website without one.",
      task: "Connect to the internet, pick a browser door, then put the address in the address bar." },
    { id: 3, name: "Secret Doors",
      teach: "A link is like a secret door. Click it and it takes you to a new page.",
      task: "Click the blue links to find the page each friend needs." },
    { id: 4, name: "Sorting Office",
      teach: "Internet, browser, website and link: each word means something different.",
      task: "Sort each card into the right bin." }
  ],

  /* ---------------- ROUND 1 ---------------- */
  round1: {
    parcels: [
      { use: "School project", to: "Kiddle",
        address: ["www", "kiddle", ".co"],
        tiles: ["www", "kiddle", ".co", "kidle", ".cm"],
        showSlotNames: true },
      { use: "Talking to family", to: "Family Chat",
        address: ["www", "familychat", ".com"],
        tiles: ["www", "familychat", ".com", "ww", "famliychat", ".con"],
        showSlotNames: true },
      { use: "Videos and music", to: "Tune Town",
        address: ["www", "tunetown", ".org"],
        tiles: ["www", "tunetown", ".org", "w.w.w", "tune town", ".com", "org"],
        showSlotNames: false }
    ],
    slotNames: ["start", "name", "ending"],
    feedback: {
      startWrong: "Website addresses start with www.",
      endingInMiddle: "That's an ending. Endings like .com, .co and .org go last!",
      wwwElsewhere: "www goes at the start of the address.",
      spelling: "Look closely at the address. Check the spelling!",
      wrongEnding: "Check the address. Which ending does it have?"
    }
  },

  /* ---------------- ROUND 2 ---------------- */
  round2: {
    connectIntro: "This computer is not connected to the internet yet. Drag the cable to connect it.",
    connected: "Connected! Now a browser can open websites.",
    doors: [
      { id: "chrome", name: "Chrome", kind: "browser", icon: "icon-browser-1", color: "#2E9E6B" },
      { id: "edge", name: "Edge", kind: "browser", icon: "icon-browser-2", color: "#1F7BC2" },
      { id: "safari", name: "Safari", kind: "browser", icon: "icon-browser-3", color: "#3A8FD9" },
      { id: "paint", name: "Paint", kind: "app", icon: "icon-paint", color: "#E2843B",
        msg: "Paint is for drawing pictures. It cannot open websites." },
      { id: "calc", name: "Calculator", kind: "app", icon: "icon-calc", color: "#7A6BC9",
        msg: "Calculator is for doing sums. It cannot open websites." },
      { id: "google", name: "Google", kind: "website", icon: "icon-website", color: "#C2473A",
        msg: "Google is a website, not a browser! Open a browser first, then you can visit Google." }
    ],
    /* uses the three addresses built in Round 1 */
    parcels: [
      { address: "www.kiddle.co", site: "Kiddle", use: "School project" },
      { address: "www.familychat.com", site: "Family Chat", use: "Talking to family" },
      { address: "www.tunetown.org", site: "Tune Town", use: "Videos and music" }
    ],
    rightDoor: "is a browser! Now tell it where to go."
  },

  /* ---------------- ROUND 3 ---------------- */
  round3: {
    searchSite: "Search Street",
    /* order of play: missions and safety stops */
    sequence: [
      { mission: 0 }, { stop: "form" },
      { mission: 1 }, { stop: "newsite" },
      { mission: 2 }, { stop: "stranger" }, { stop: "kidfriendly" }
    ],
    boldNotLink: "That's bold text, not a link. Links are blue and underlined.",
    plainNotLink: "That's plain text, not a link. Links are blue and underlined.",
    missions: [
      {
        goal: "Riya needs elephant facts for her school project. Find the Elephants page.",
        found: "Found it! Riya can read about elephants now.",
        start: "lions", target: "elephants",
        pages: {
          lions: {
            url: "www.animalclub.org/lions", site: "Animal Club", title: "Lions",
            blocks: [
              { t: "p", text: "Lions are big cats. They live in groups called prides." },
              { t: "bold", text: "Lions can sleep for 20 hours a day!" },
              { t: "p", text: "Lions live in grasslands where they can see far." },
              { t: "link", text: "Click here to learn about elephants", go: "elephants" }
            ]
          },
          elephants: {
            url: "www.animalclub.org/elephants", site: "Animal Club", title: "Elephants",
            blocks: [
              { t: "p", text: "Elephants are the biggest animals on land." },
              { t: "p", text: "An elephant uses its trunk to drink water, like a straw." }
            ]
          }
        }
      },
      {
        goal: "Aarav wants to learn about planets. Find the Planets page.",
        found: "Found it! Aarav can read about planets now.",
        wrongPage: "This is {title}. Try another link to find Planets.",
        start: "home", target: "planets",
        chapters: [ { text: "The Sun", go: "sun" }, { text: "The Moon", go: "moon" }, { text: "Planets", go: "planets" } ],
        pages: {
          home: {
            url: "www.spacekids.org", site: "Space for Kids", title: "Welcome to space!",
            blocks: [
              { t: "p", text: "The links at the top take you to other pages of this website, like chapters in a book." },
              { t: "bold", text: "Astronauts float in space!" }
            ]
          },
          sun: {
            url: "www.spacekids.org/sun", site: "Space for Kids", title: "The Sun",
            blocks: [ { t: "p", text: "The Sun is a star. It gives Earth light and heat." } ]
          },
          moon: {
            url: "www.spacekids.org/moon", site: "Space for Kids", title: "The Moon",
            blocks: [ { t: "p", text: "The Moon goes around the Earth. People have walked on it!" } ]
          },
          planets: {
            url: "www.spacekids.org/planets", site: "Space for Kids", title: "Planets",
            blocks: [ { t: "p", text: "There are 8 planets in our solar system. Jupiter is the biggest." } ]
          }
        }
      },
      {
        goal: "Meera loves dinosaurs. Find the Dino Facts for Kids website.",
        found: "Found it! Meera can read about dinosaurs now.",
        wrongPage: "This is {title}. Press the back button ‹ and try another link.",
        start: "results", search: "dinosaurs", target: "dino",
        results: [
          { title: "Pizza at Home", url: "www.pizzapal.com", snippet: "Make your own pizza.", go: "pizza" },
          { title: "Dino Facts for Kids", url: "www.dinofacts.org", snippet: "Big dinosaurs, small dinosaurs, horned dinosaurs.", go: "dino" },
          { title: "Rainbow Colours", url: "www.rainbowfun.org", snippet: "Learn the seven colours of a rainbow.", go: "rainbow" }
        ],
        pages: {
          dino: {
            url: "www.dinofacts.org", site: "Dino Facts for Kids", title: "Dinosaurs",
            blocks: [ { t: "p", text: "Dinosaurs lived a very long time ago. Triceratops had three horns on its face." } ]
          },
          pizza: {
            url: "www.pizzapal.com", site: "Pizza Pal", title: "Pizza at Home",
            blocks: [ { t: "p", text: "Spread the sauce, add cheese and bake." } ]
          },
          rainbow: {
            url: "www.rainbowfun.org", site: "Rainbow Fun", title: "Rainbow Colours",
            blocks: [ { t: "p", text: "A rainbow has seven colours." } ]
          }
        }
      }
    ],

    /* Safety stops — one for each Tip for Safe Browsing */
    checkpoints: {
      form: {
        tip: "Do not share personal information",
        kind: "form",
        heading: "Join the Lion Club!",
        prompt: "A website asks you to type your name and home address to see more lions.",
        choices: [
          { text: "Type my name and address", ok: false, fb: "Stop! Never give out your name, address or other personal details online without permission from an adult." },
          { text: "Don't share. Ask an adult first.", ok: true, fb: "Well done! Personal information stays private unless an adult says it's okay." }
        ]
      },
      newsite: {
        tip: "Always ask an adult",
        kind: "popup",
        heading: "Mystery Games Zone",
        prompt: "A new website you have never seen wants you to visit it!",
        choices: [
          { text: "Visit it right away", ok: false, fb: "Before visiting a new website, always ask a parent or guardian if it is safe." },
          { text: "Ask an adult first", ok: true, fb: "Great choice! Adults know which websites are good to visit." }
        ]
      },
      stranger: {
        tip: "Be cautious with online friends",
        kind: "chat",
        heading: "New message from star_kid_99",
        prompt: "Hi! I'm your new friend. Where do you live?",
        choices: [
          { text: "Tell them where I live", ok: false, fb: "Be careful! Just like in real life, don't talk to strangers on the internet." },
          { text: "Don't reply. Tell an adult.", ok: true, fb: "Smart move! Telling an adult keeps you safe." }
        ]
      },
      kidfriendly: {
        tip: "Stick to kid-friendly sites",
        kind: "choice",
        heading: "Two websites",
        prompt: "Which website is made for kids?",
        choices: [
          { text: "Scary Monster Clips (not for kids)", ok: false, fb: "That site is not for kids. Use websites designed for children that are educational and fun." },
          { text: "Dino Facts for Kids", ok: true, fb: "Yes! Kid-friendly sites are educational and fun." }
        ]
      }
    }
  },

  /* ---------------- ROUND 4 ---------------- */
  round4: {
    bins: [
      { id: "internet", name: "Internet", color: "#1B4F9C" },
      { id: "browser", name: "Browser", color: "#2E9E6B" },
      { id: "website", name: "Website", color: "#D7263D" },
      { id: "link", name: "Link", color: "#7A4FC2" }
    ],
    cards: [
      { text: "Chrome", bin: "browser" },
      { text: "A huge, invisible network that connects computers all over the world", bin: "internet" },
      { text: "Kiddle", bin: "website", hint: "Kiddle is a website made for kids. You visit it using a browser." },
      { text: "Click here to learn about elephants", bin: "link", hint: "You can click these words to go to another page. That makes it a link." },
      { text: "Edge", bin: "browser" },
      { text: "Like a digital book on the internet, with pages of information", bin: "website" },
      { text: "Google", bin: "website", hint: "Google is a website, not a browser. You open a browser like Chrome, then visit Google." },
      { text: "The software used to connect to the internet", bin: "browser" },
      { text: "A word that can be clicked to go to another page or website", bin: "link" },
      { text: "Safari", bin: "browser" },
      { text: "Connects homes, schools, libraries and businesses", bin: "internet" }
    ],
    hints: {
      internet: "The internet is the giant network that connects computers everywhere.",
      browser: "A browser is the tool you open to visit websites.",
      website: "A website is a place on the internet with pages of information.",
      link: "A link is a word or sentence you click to go to another page."
    }
  }
};
