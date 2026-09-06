# Firebase Setup — RSVP Guestbook Visible to Every Guest

This only needs to be done **once** per Firebase project. If you're just
duplicating this invitation for a new couple who'll share the *same*
Firebase project, skip to "For a New Invitation (reusing the backend)"
below.

## A. One-time setup

1. **Create a Google account** — a normal Gmail account works.
2. **Create a Firebase project** at [firebase.google.com/console](https://firebase.google.com/console)
   → **Add project**. The free **Spark** plan is more than enough for a
   wedding invitation site.
3. **Enable Firestore**: left menu → **Firestore Database** → **Create
   database** → pick the region closest to your guests → **production**
   mode.
4. **Publish the security rules**: in Firestore, open the **Rules** tab,
   paste in the contents of `firestore.rules` (repo root, next to this
   file), replacing the default rules, then **Publish**.
5. **Register a web app**: **Project Settings** (gear icon) → scroll to
   **Your apps** → click **`</>`** (Web) → give it any name (Firebase
   Hosting not needed) → copy the `firebaseConfig` object it gives you.
6. Paste those values into `assets/js/firebase-config.js`, inside the
   `firebase: { ... }` block.

## B. For a New Invitation (reusing the backend)

If you're forking this template for a different couple but want to keep
using the same Firebase project (so you don't have to repeat step A):

1. Duplicate this project folder.
2. Open `assets/js/firebase-config.js` and change **only these two
   fields**:
   - `slug` — a unique id for this invitation (e.g. `"budi-sinta"`). It
     MUST be different from every other invitation sharing this Firebase
     project, or their guestbooks will mix together.
   - `adminSecret` — a new password; share it with the couple (privately)
     so they can delete spam wishes.
3. Leave `firebase: { ... }` unchanged — it stays the same for every
   invitation on this backend.
4. Deploy/host as usual.

The couple doesn't need to create any account — just tell them their
admin code, and they can delete unwanted wishes from the 🗑 button next to
each guestbook entry, directly on the live site.

## Security note (the honest version)

The admin code lives in a JavaScript file that ships to every visitor's
browser, so someone who specifically opens DevTools/"View Source" could
read it. For a guestbook — non-sensitive data, worst case is a deleted
wish — that's an acceptable trade-off. If you ever need stronger
protection (e.g. for anything involving payments or private data), that
would require adding Firebase Authentication or a Cloud Function that
checks the code server-side instead — happy to help with that if it's ever
needed, but it isn't required for this.
