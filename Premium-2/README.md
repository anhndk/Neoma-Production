# Vincent & Natasha — Wedding Invitation (static rebuild)

A scroll-driven wedding invitation: as the guest scrolls, the page zooms
and pans through the cover photo, then reveals the guest's name, the
couple, event details, dress code, and a verse — before scrolling normally
into countdown, RSVP, gallery, gift, and footer sections. Pure HTML/CSS/JS,
no build step — works directly on GitHub Pages.

## Folder structure

```
index.html                  ← page structure (edit sparingly)
assets/
  css/style.css              ← colors & fonts at the top, layout below
  js/
    config.js                 ← EDIT THIS for names, dates, texts, links
    scenes.js                  ← animation keyframes (advanced — optional)
    engine.js                   ← scroll animation engine (don't edit)
    app.js                       ← wires config.js into the page (don't edit)
  images/
    backgrounds/                ← hero background/decoration art
    photos/                      ← cover photo, couple cutout, gallery
    payment/                      ← bank logos, card chip, gift icon
    logo/                          ← put your splash-screen logo here
```

## The only file you usually need: `assets/js/config.js`

Open it and change the values — names, dates, addresses, quotes, bank
accounts, WhatsApp number, links, gallery photo list, etc. Every field has
a short comment explaining what it does. Save, refresh the page.

To swap a photo: drop your image into the matching `assets/images/...`
folder and update the path in `config.js` (or just overwrite the existing
file with the same name).

## Splash-screen logo

Set `splashLogoImage` in `config.js` to a path like
`"assets/images/logo/splash-logo.png"`. Leave it as `""` and it shows the
`splashInitials` text instead (e.g. "V & N").

## Colors & fonts

Open `assets/css/style.css` — the very first block (`:root { ... }`)
controls the accent color, text color, background, and the three fonts
used across the site. Change a value there and it applies everywhere.

## Copyright / footer

`copyrightText`, `brandLogo`, `whatsappNumber` and `whatsappDisplay` in
`config.js` control the footer.

## Background music

GitHub Pages has no backend, so this rebuild uses a simple looping
`<audio>` tag instead of a YouTube embed. Put an mp3 in `assets/audio/`
(create the folder) and point `musicSrc` in `config.js` at it. Leave it
empty to hide the music button.

## RSVP

Also static: entries are saved in each visitor's own browser
(`localStorage`), so you (the couple) won't see them centrally by
default. To collect real RSVPs, sign up for a free form backend (e.g.
Formspree, Getform) and paste its endpoint into `formActionUrl` in
`config.js` — submissions will also be POSTed there.

## Hosting on GitHub Pages

1. Push this whole folder to a GitHub repository.
2. Repo Settings → Pages → Source: deploy from the `main` branch, root folder.
3. Your invitation will be live at `https://<username>.github.io/<repo>/`.
4. Personalized links: add `?to=Guest+Name` to the URL, e.g.
   `.../?to=Budi+%26+Keluarga` to greet a specific guest by name.

## Notes on what changed from the original saved page

- The scroll/zoom/fade animation engine and its exact keyframe data were
  extracted and rewritten in plain, readable JavaScript — behavior is
  the same.
- The WordPress-backed RSVP form, YouTube music/video embeds, and the
  photo-gallery plugin were replaced with self-contained equivalents
  (see above) since a GitHub Pages site has no server to talk to.
- The decorative script/cursive font ("Margharita") isn't publicly
  available, so it's replaced with the free Google Font "Alex Brush" —
  change `--font-script` in `style.css` to any other Google Font if you
  prefer a different look.

## Recent additions (revision notes)

**Bottom white gradient** — now appears only behind the bride & groom name
reveal (fades in as groom appears, holds through the bride crossfade, fades
out as the event details begin). It's gone from the cover-quote and
events/dresscode/quotes screens. Edit its look in `assets/css/style.css`
under `.bottom-gradient` (size = `min-height`, transparency = the `rgba(...)`
alpha values in the gradient stops). Edit *when* it appears in
`assets/js/scenes.js` under each scene's `"bottomGradient"` keyframes.

**Cloud backgrounds on Events/Dresscode** — now use `background-size: cover`
(fills the screen, cropping if needed) instead of `contain` (which shrank
it). Change back to `contain` in `.text-container2` in `style.css` if you'd
rather see the whole cloud with empty space than have it cropped.

**Countdown reveal** — the countdown section now fades/slides in once
scrolled into view, via the `.reveal-on-scroll` class (see `style.css`) and
an `IntersectionObserver` in `app.js`. Add the same class to any other
`<div class="section">` to reuse the effect.

**Gallery lightbox** — now has a close (×) button and prev/next arrows,
styled in `style.css` under `.lightbox-close` / `.lightbox-nav`.

**Music trigger** — a spinning vinyl icon, top-right (`#music-button` in
`index.html` / `style.css`). It appears and starts spinning + playing when
the guest opens the invitation, and pauses on tap. Edit size, position, and
color in `style.css` under `#music-button` — the full explanation is in the
comment right above it (the icon is recolored white via a CSS `filter`,
since the source PNG is black).

**Events entrance timing** — "Detil Acara" no longer fades/flies in *while*
you're actively scrolling through the bride→events transition (which used
to crop the cloud oddly mid-motion). Now that whole scroll stretch stays
empty, and the cloud + text only fade in — already in their final position,
no flying/scaling — right after you land on the events/dresscode scene.
Adjust how quick that fade-in is via the `"events"` keyframes in the
events/dresscode scene of `scenes.js` (the `0.12` progress value = how far
into the scene it takes to fully appear; smaller = faster/snappier).

**Events no longer feel skipped (update)** — the cloud + "Detil Acara" now
fade in during the *last 45% of the bride scene* (see the `"events"`
keyframes in the bride scene in `scenes.js`, progress `0.55` → `1`), so they
appear gradually as part of the same scroll motion that carries you away
from the bride's name, instead of popping in only once you land on the next
scene. In the events/dresscode scene right after, "Detil Acara" now stays
fully visible through the first ~55% of that scene (plenty of time to read
it) before crossfading into "Dresscode" over the remaining ~45%. Tune the
`0.55` / `0.45` progress values in both scenes' `"events"` / `"dresscode"`
keyframes to make it linger longer/shorter or crossfade faster/slower.

**Curtain reveal into the countdown** — scrolling from the last animated
scene into the countdown section now shows a plain, transparent panel
rising from the bottom like a curtain until it fully covers the screen;
only once it's fully risen do the countdown digits and "Save the Date"
button fade in on top of it. This replaces the old plain fade/slide on
that section. Edit the color, transparency, and speed in `style.css` under
the "CURTAIN REVEAL" comment block (`.curtain-panel` / `.curtain-content`)
— full instructions are there. The section markup lives in `index.html`
under `.curtain-section` / `.curtain-panel` / `.curtain-content`.

**Countdown moved up + reveals one item at a time** — the countdown now
sits near the top of the screen (was vertically centered) and is a little
smaller/more compact. Its digits and the "Save the Date" button no longer
pop in all at once alongside the rising curtain panel — each one now fades/
rises in on its own turn, right after the curtain finishes rising. Edit
position via `padding-top` on `.curtain-section`, size via `.countdown-*`
rules, and the one-by-one timing via the "COUNTDOWN REVEAL TIMING" comment
block — all in `style.css`.

**All buttons are now fully oval/pill-shaped** — `border-radius: 999px` on
`.elementor-button`, `.button1`, and `.copy-btn` in `style.css` (see the
"BUTTON SHAPE" comment there). Lower that number for a softer-but-still-
squared look instead.

**RSVP & Wishes title redesigned** — now a left-aligned script-font heading
("RSVP<br>& Wishes") with a decorative PNG bleeding off the right edge of
the screen next to it (currently a placeholder flower graphic — swap it for
your own "ilalang"/reeds PNG whenever you have it, see the comment above
`.rsvp-header` in `index.html`). The title floats in from the left and the
PNG floats in from the right, nearly together — reusing the existing
`.reveal-on-scroll` fade-in mechanism with two new `reveal-left` /
`reveal-right` variants (`style.css`).

**Empty sample wishes no longer leave stray separator lines** — `config.js`'s
`sampleWishes` is now a genuinely empty array (`[]`) by default. (An array
with blank-string entries still rendered one empty-looking row + separator
line per entry — that was the bug.) Real wishes rows (from Firebase or the
sample list) now fade in one at a time as the RSVP section scrolls into
view — see the "wish row stagger" comment in `app.js`.

**Our Love Story section removed** — per request; the corresponding HTML,
CSS (`.love-story-chapter`), JS (`renderLoveStory`), and `config.js` data
(`loveStory`) were all deleted together.

**Our Moments gallery is now an auto-advancing carousel** — one photo at a
time, sliding to the next automatically every 2 seconds (pauses while the
lightbox is open, resumes after closing it). Change the interval via
`CAROUSEL_INTERVAL_MS` in `app.js` (see the "GALLERY" comment block there).
The "Our Moments" heading is now the site's script font and fades in on
scroll, same as other reveal-on-scroll elements. Tapping any slide still
opens the full lightbox with prev/next/close controls, unchanged.

**Countdown/RSVP/gallery/gift now share one panel background** — instead
of four separate solid-white rectangles stacked on top of each other, they
now sit inside a single translucent panel with rounded top corners (see
the "UNIFIED PANEL BACKGROUND" comment in `style.css`, on `#lastContainer`
and the `--panel-bg` variable at the top of the file). The footer keeps its
own solid dark background, unchanged.

**Bride/groom reveal order is now a one-line config change** — set
`coupleRevealOrder` in `config.js` to `"bride-first"` to have the bride's
name reveal first instead of the groom's while scrolling through the
animated cover (default is `"groom-first"`). See the comment above that
field in `config.js`, and `applyCoupleRevealOrder()` in `engine.js` if
you're curious how it works under the hood — you don't need to read or
edit scenes.js at all for this.

**RSVP guestbook now uses Firebase** — wishes submitted through the RSVP
form are saved to a shared Firestore database (see `firebase-config.js`)
instead of only the visitor's own browser, so every guest sees the same
guestbook in real time and it survives across devices. Each real (non-
sample) wish gets a small 🗑 delete button that asks for an admin code
before deleting — see `assets/js/firebase-config.js` for the code, the
Firebase project it points at, and an honest note on the security
trade-offs of storing that code client-side. `firestore.rules` (repo root)
is the security-rules file that should be published in the Firebase
console's Firestore "Rules" tab; see `SETUP-FIREBASE.md` for the full
walkthrough. If you fork this template for another couple's invitation and
want a separate guestbook, either point `firebase-config.js` at your own
Firebase project, or (if reusing the same project across several
invitations) just give each one a different `slug`.
