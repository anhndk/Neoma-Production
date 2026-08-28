/* ==========================================================================
   FIREBASE-CONFIG.JS — RSVP guestbook backend
   ==========================================================================
   Loaded BEFORE app.js (see index.html) so app.js's RSVP section can read
   and write wishes to Firestore instead of only saving them in each
   visitor's own browser.

   - slug:        a unique id for THIS invitation, used as the document path
                   (invitations/{slug}/wishes). If you ever reuse this same
                   Firebase project for another invitation, give it a
                   DIFFERENT slug or the two guestbooks will mix together.
   - adminSecret: the code the couple types in before they're allowed to
                   delete a spam/unwanted wish (the small trash button next
                   to each guestbook entry — see setupRsvp() in app.js).

   HONEST SECURITY NOTE: adminSecret lives in this file, which ships to
   every visitor's browser as plain JavaScript — anyone who opens
   DevTools/"View Source" can read it. For a wedding guestbook (low-value,
   non-sensitive data; worst case someone deletes a wish) that's a
   reasonable trade-off, and matches firestore.rules (also in this project),
   which intentionally allows delete at the database level and relies on
   this code-side prompt instead. It is NOT enough protection for anything
   sensitive (payments, private data) — that would need Firebase
   Authentication or a Cloud Function checking the code server-side.
   ========================================================================== */

var INVITATION_CONFIG = {
  slug: "vincent-natasha",
  adminSecret: "123456",

  // Firebase project credentials, from Firebase Console > Project Settings
  // > Your apps > SDK setup and configuration. Shared across every
  // invitation that uses this same backend — leave as-is unless you're
  // pointing this site at a different Firebase project entirely.
  firebase: {
    apiKey: "AIzaSyC89017s4DzcsGDROhp5oqH_leuO9W9WI",
    authDomain: "neoma-query.firebaseapp.com",
    projectId: "neoma-query",
    storageBucket: "neoma-query.firebasestorage.app",
    messagingSenderId: "34923299362",
    appId: "1:34923299362:web:980168a766bbdec873807b",
  },
};

/* Sets up `wishesCollection`, a Firestore reference to this invitation's
   guestbook at invitations/{slug}/wishes, matching firestore.rules. app.js
   reads/writes/deletes through this variable.

   If the Firebase SDK scripts (loaded right before this file in index.html)
   fail to load — offline, blocked, wrong project id, etc. — this is
   skipped and `wishesCollection` stays undefined; app.js checks for that
   and falls back to showing only the sample wishes from config.js instead
   of breaking the page. */
var wishesCollection;
try {
  firebase.initializeApp(INVITATION_CONFIG.firebase);
  wishesCollection = firebase
    .firestore()
    .collection("invitations")
    .doc(INVITATION_CONFIG.slug)
    .collection("wishes");
} catch (err) {
  console.warn("Firebase guestbook unavailable, falling back to sample wishes only:", err);
}
