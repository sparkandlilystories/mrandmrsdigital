/* =========================================================
   BRAND FILE — the only file you edit for a new demo.
   Mr & Mrs Digital demo template v1 (built from the GraCha demo)
   ---------------------------------------------------------
   COLOUR RULE: two calm base colours + ONE accent.
   The accent is used sparingly: one word per headline, the
   glow on the photos, the map pin. Never on big areas.

   Accent switch for filming:
     ?accent=off      page opens without the accent
     ?switch          shows a small on/off pill (bottom left)
     ?switch&accent=off   start "before", tap pill -> "after"
   Photo glow: the accent light sits on the HERO only by default.
   Add  glow:true  to at most one more item if it needs it.
   ========================================================= */
window.BRAND = {
  name: "Larkrise",
  logo: "LARKRISE",
  ribbon: "Fictional bakery · concept site by Mr & Mrs Digital",
  footerLine: "Up with the lark · Norwich",

  colors: {
    base1: "#f5ede1",   /* paper / background */
    base2: "#2b1d15",   /* ink / text, buttons, dark bands */
    accent: "#e8702a"   /* the pop: complementary to the cool blue-brown base */
  },
  accent: "on",          /* "on" | "off" — default state */

  fonts: {
    css: "https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=Instrument+Serif:ital@0;1&display=swap",
    display: '"Archivo","Arial Narrow",Arial,sans-serif',
    serif: '"Instrument Serif",Georgia,serif',
    body: '"Archivo",system-ui,-apple-system,Arial,sans-serif'
  },

  /* main call to action, used in nav, hero and sticky bar */
  cta: { label: "Order for pickup", url: "#find" },
  nav: [ ["Bakes", "#menu"], ["Classes", "#workshops"], ["Find us", "#find"] ],

  /* ---- SECTIONS: set on:false to hide a block ---- */
  sections: {
    hero: {
      on: true,
      title: "Up with<br>the lark.",
      accentLine: "baked before sunrise",
      text: "A small neighbourhood bakery in Norwich. The ovens go on at four, the door opens at seven, and the croissants are usually gone by noon.",
      image: "img/hero.jpg",          /* neutral photo */
      imageAccent: "img/hero-accent.jpg",   /* same photo WITH the accent light; empty = CSS glow */
      icon: "croissant",
      buttons: [ ["Order for pickup", "#find"], ["See today's bakes", "#menu"] ]
    },

    intro: {
      on: true,
      title: ["Butter", "first,", "*patience*", "second."],   /* *word* = accent word */
      text: "Larkrise is two bakers and one very old deck oven. Every dough rests overnight, every croissant is laminated by hand, and nothing on the counter was made yesterday."
    },

    menu: {
      on: true,
      title: "Today's <em>bakes</em>",
      text: "Baked this morning, on the counter from seven. Order ahead and we'll keep yours aside.",
      orderLabel: "Reserve",
      items: [
        { n: "Butter Croissant",  p: "£3.40", d: "Seventy-two layers, a shatter you can hear across the room.", img: "img/croissant.jpg",   icon: "croissant" },
        { n: "Pain au Chocolat",  p: "£3.80", d: "Two batons of dark chocolate, one very flaky jacket.",        img: "img/pain-choc.jpg",   icon: "croissant" },
        { n: "Cardamom Knot",     p: "£3.60", d: "Swedish-style, twisted by hand, rolled in cardamom sugar.",    img: "img/cardamom.jpg",    icon: "bun" },
        { n: "Orange Morning Bun",p: "£3.90", d: "Croissant dough, orange zest, a crunchy sugar crust.",         img: "img/morning-bun.jpg", icon: "bun" },
        { n: "Country Sourdough", p: "£5.50", d: "Thirty-six hours from starter to slice. Dark crust, open crumb.", img: "img/sourdough.jpg", icon: "loaf" },
        { n: "Almond Croissant",  p: "£3.95", d: "Yesterday's croissant? Never. Filled with frangipane, baked twice.", img: "img/almond.jpg", icon: "croissant" }
      ]
    },

    band: {
      on: true,
      words: ["Out of the oven at seven", "*gone by*", "noon ·"],   /* scrolling marquee */
      text: "The best time to visit is early. The second best time is to order ahead."
    },

    sweets: {
      on: true,
      eyebrow: "Something sweeter",
      title: "Cake, <em>by the slice</em>",
      items: [
        { n: "Burnt Basque Cheesecake", p: "£5.20", img: "img/cheesecake.jpg", icon: "cake" },
        { n: "Orange & Almond Cake",    p: "£4.80", img: "img/orange-cake.jpg", icon: "cake" }
      ]
    },

    workshop: {
      on: true,
      eyebrow: "Classes",
      title: "Bake <em>with us</em>",
      image: "img/class.jpg", icon: "loaf",
      bullets: [
        "Saturday sourdough class: starter, shaping and scoring",
        "Take home your own loaf and a jar of our starter",
        "Six people per class, coffee and croissants included"
      ],
      button: ["Ask about the next date", "#find"]
    },

    evening: {
      on: false,   /* example of a block switched off */
      eyebrow: "Coming soon",
      title: "Friday <em>pizza night</em>",
      text: "Sourdough pizza from the bread oven, every Friday from six."
    },

    reviews: {
      on: false,   /* RULE: only real, word-for-word Google reviews. Fictional brand = no reviews. */
      score: "", count: "",
      items: [ /* { q: "...", who: "..." } */ ]
    },

    find: {
      on: true,
      eyebrow: "Find us",
      title: "Lark <em>Yard</em>",
      facts: [
        ["Address", "Lark Yard, Norwich (fictional)"],
        ["Hours", "Wed – Sun, 7:00 – 14:00"],
        ["Order", "Order ahead by 18:00 the day before"]
      ],
      buttons: [ ["Order for pickup", "#top"], ["Follow us", "#top"] ],
      mapStreet: "LARK YARD",
      mapRiver: "RIVER WENSUM"
    }
  }
};
