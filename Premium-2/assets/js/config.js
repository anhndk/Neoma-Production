/* ==========================================================================
   CONFIG.JS — Edit everything about the invitation here
   ==========================================================================
   This is the ONLY file most people need to touch. Change names, dates,
   texts, images, colors, and links below. Nothing else in the site needs
   to be edited for normal customization.

   Images: put your own files in the assets/images/ subfolders and just
   change the path strings below to point at them (keep the same folder
   structure, or update the paths to match whatever you use).
   ========================================================================== */

const CONFIG = {

  // ---- Browser tab title & meta ------------------------------------------
  pageTitle: "The Wedding of Siska & Johan",

  // ---- Splash / loading screen --------------------------------------------
  // Shown for a moment while the page loads. Set splashLogoImage to a path
  // (e.g. "assets/images/logo/splash-logo.png") to use your own logo/crest
  // image instead of the initials below.
  splashLogoImage: "assets/images/logo/splash.png",       // e.g. "assets/images/logo/splash-logo.png"
  splashInitials: "",   // fallback shown if no splashLogoImage is set

  // ---- The couple ----------------------------------------------------------
  // Which name reveal appears FIRST while scrolling through the animated
  // cover: "groom-first" (default) or "bride-first". This is the ONLY
  // change needed to reorder it — engine.js reads this flag and swaps the
  // two name reveals' animation timing automatically. (The couple photo's
  // own pan/zoom in scenes.js was choreographed to match whichever name is
  // currently showing, so after swapping you may want to nudge the
  // "couple" keyframes in scenes.js to re-sync the photo motion — everything
  // else needs no manual editing.)
  coupleRevealOrder: "groom-first", // "groom-first" | "bride-first"

  brideFirstName: "Siska",
  brideFullName: "Fransiska Aulia Padma",
  brideParents: "Bapak Wijaya Gunawan &amp;<br>Ibu Suci Kusmiyati",
  brideInstagram: "siska.aup",              // without the @
  brideInstagramUrl: "https://instagram.com/neomaprod",

  groomFirstName: "Johan",
  groomFullName: "Johan Arifin Sujatmiko",
  groomParents: "Bapak Budi Sujatmiko &amp;<br>Ibu Tika Pangesti",
  groomInstagram: "hanjohan21",
  groomInstagramUrl: "https://instagram.com/neomaprod",

  // ---- Cover screen ----------------------------------------------------------
  coverImage: "assets/images/photos/cover-photo.jpg",
  coupleCutoutImage: "assets/images/photos/couple-cutout.png",
  weddingDateDisplay: "Saturday, October 10, 2026",

  // ---- Countdown & calendar -------------------------------------------------
  // ISO date/time used for the live countdown timer. Must match weddingDateDisplay.
  weddingDateISO: "2026-10-10T13:00:00+07:00",
  googleCalendarUrl:
    "https://www.google.com/calendar/render?action=TEMPLATE&text=The%20Wedding%20of%20Vincent%20%26%20Natasha&dates=20260425/20260425&location=",

  // ---- A short quote shown while scrolling -----------------------------------
  quoteText: "\u201cThe great marriages are partnerships. It can\u2019t be a great marriage without being a partnership.\u201d \u2014 Helen Mirren",
  verseText: "\u201cDi antara tanda-tanda (kebesaran)-Nya ialah bahwa Dia menciptakan pasangan-pasangan untukmu dari (jenis) dirimu sendiri agar kamu merasa tenteram kepadanya. Dia menjadikan di antaramu rasa cinta dan kasih sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir..\u201d",
  verseSource: "Ar Rum : 21",

  // ---- Events ------------------------------------------------------------
  events: [
    {
      title: "Akad Nikah",
      date: "Saturday, October 10, 2026",
      time: "10.00 - 11.00 WIB",
      venue: "Taman Jiwo Venue",
      address: "Jl. Jambu No.2, Jetak I, Sidokarto, Godean, Sleman",
      mapUrl: "https://maps.app.goo.gl/SfewgSDUMt2KJyDx8",
    },
    {
      title: "Resepsi",
      date: "Saturday, October 10, 2026",
      time: "13.00 - 15.00 WIB",
      venue: "Taman Jiwo Venue",
      address: "Jl. Jambu No.2, Jetak I, Sidokarto, Godean, Sleman",
      mapUrl: "https://maps.app.goo.gl/SfewgSDUMt2KJyDx8",
    },
  ],
  liveStreamNote: "For guests who are unable to attend, you can watch the event through the link below.",
  liveStreamUrl: "https://youtube.com/",

  // ---- Dress code ----------------------------------------------------------
  dresscodeText: "We would love for our guests to wear these colors on our special day.",
  dresscodeColors: ["#ad9078", "#ffffff"], // hex codes for the little color dots

  // ---- Photo gallery ---------------------------------------------------------
  // Add/remove entries freely. Point each "src" at your own photo.
  gallery: [
    "assets/images/photos/gallery-1.jpg",
    "assets/images/photos/gallery-2.jpg",
    "assets/images/photos/gallery-3.jpg",
    "assets/images/photos/gallery-4.jpg",
    "assets/images/photos/gallery-5.jpg",
    "assets/images/photos/gallery-6.jpg",
    "assets/images/photos/gallery-7.jpg",
  ],

  // ---- Background music --------------------------------------------------
  // Put an mp3 in assets/audio/ and set the path below. The vinyl button
  // (top-right) is always visible and spins when tapped/opened either way —
  // leaving this empty just means it spins silently (no audio to play).
  musicSrc: "", // e.g. "assets/audio/our-song.mp3"

  // ---- Wedding gift / bank transfer -----------------------------------------
  giftIntro: "We're so grateful for your love and support, any gift you share means the world to us.",
  bankAccounts: [
    { bankLogo: "assets/images/payment/bank-bca.png", accountNumber: "123456789", accountName: "Johan Arifin Sujatmiko" },
    { bankLogo: "assets/images/payment/bank-mandiri.png", accountNumber: "123456789", accountName: "Fransiska Aulia Padma" },
  ],
  physicalGift: {
    recipientLine: "Johan (0812341234)",
    address: "Jl. Arcadia Raya No. 9, Bantulan 55524",
  },

  // ---- RSVP -----------------------------------------------------------------
  rsvpPrompt: "Tell us you\u2019re coming and leave a few words\u2014we\u2019d love to hear from you!",
  // GitHub Pages has no server, so RSVP entries are saved only in each
  // visitor's own browser (localStorage) unless you set formActionUrl to a
  // form backend of your choice (e.g. Formspree, Getform) that accepts a
  // normal POST with fields: name, message, attendance.
  formActionUrl: "", // e.g. "https://formspree.io/f/xxxxxxx"
  // Placeholder wishes shown ONLY if you want example entries in the list.
  // Leave this as an empty array ( [] ) to show nothing until real guests
  // submit the form — an array with empty-string entries still renders one
  // (blank-looking) row + separator line per entry, which is why this must
  // be genuinely empty, not filled with empty strings.
  sampleWishes: [],

  // ---- Closing / footer -------------------------------------------------
  closingHeading: "Johan &amp; Siska",
  closingText: "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan do\u2019a restu kepada kami .",
  whatsappNumber: "", // digits only, country code first, no +
  whatsappDisplay: "",
  brandLogo: "assets/images/logo/splash.png", // e.g. "assets/images/logo/footer-logo.png" (leave "" to hide)
  copyrightText: "\u00a9 2026 Neoma Production. All rights reserved.",

  // ---- Colors & fonts are set in assets/css/style.css under :root -------
};
