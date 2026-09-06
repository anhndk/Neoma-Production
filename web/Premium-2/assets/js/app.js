/* ==========================================================================
   APP.JS — Fills the page with CONFIG content and handles UI interactions
   (preloader, guest name, countdown, gallery, music button, gift copy,
   RSVP form). This runs before engine.js starts the scroll animation.
   ========================================================================== */

document.title = CONFIG.pageTitle;

/* ---- Splash / preloader -------------------------------------------------- */
(function setupSplash() {
  const logoWrap = document.getElementById("splashLogo");
  if (CONFIG.splashLogoImage) {
    logoWrap.innerHTML = `<img src="${CONFIG.splashLogoImage}" alt="logo">`;
  } else {
    logoWrap.textContent = CONFIG.splashInitials;
  }
})();

function hidePreloader() {
  const preloader = document.getElementById("preloader");
  if (!preloader) return;
  preloader.style.transition = "opacity 0.5s ease";
  preloader.style.opacity = "0";
  setTimeout(() => preloader.remove(), 500);
}

// Explicitly preload every image that is visible the moment the page opens
// (the "stage" images set directly in the HTML, plus the cover/couple photos
// that CONFIG fills in). We don't rely on window.load alone: some in-app
// browsers (WhatsApp/Instagram webview) fire "load" inconsistently, so we
// track each critical image's own load/error event and only reveal the
// invitation once every one of them is actually ready on screen.
function preloadCriticalImages() {
  const stage = document.getElementById("stage");
  const urls = new Set();
  if (stage) {
    stage.querySelectorAll("img[src]").forEach((img) => urls.add(img.src));
  }
  // fillImg() runs earlier in this file and may have set these already;
  // CONFIG paths are included too in case they haven't been applied yet.
  [CONFIG.coverImage, CONFIG.coupleCutoutImage].forEach((src) => {
    if (src) urls.add(new URL(src, document.baseURI).href);
  });

  const loaders = Array.from(urls).map(
    (src) =>
      new Promise((resolve) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = resolve; // don't let one broken image hang the whole page
        img.src = src;
      })
  );
  return Promise.all(loaders);
}

document.body.style.overflow = "hidden";

// Safety net only: if something genuinely stalls (dead link, offline asset),
// don't trap the guest on the splash screen forever. This should basically
// never fire under normal conditions since it's a fallback for the fallback.
const forceHidePreloader = setTimeout(hidePreloader, 20000);

Promise.all([
  preloadCriticalImages(),
  new Promise((resolve) => {
    if (document.readyState === "complete") resolve();
    else window.addEventListener("load", resolve);
  }),
]).then(() => {
  setTimeout(() => {
    clearTimeout(forceHidePreloader);
    hidePreloader();
    document.body.style.overflow = "visible";
  }, 400);
});

/* ---- Guest name from URL, e.g. invite.html?to=Budi+%26+Family -------------- */
function getGuestNameFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("to");
  if (!raw) return null;
  return decodeURIComponent(raw.replace(/\+/g, " "));
}
document.querySelectorAll(".guest-name").forEach((el) => {
  el.textContent = getGuestNameFromUrl() || "Our Beloved Guest";
});

/* ---- Fill in couple / cover / event content from CONFIG -------------------- */
function fillText(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = value;
}
function fillImg(id, src) {
  const el = document.getElementById(id);
  if (el && src) el.src = src;
}

fillText("coverBrideGroom", CONFIG.groomFirstName + " &amp; " + CONFIG.brideFirstName);
fillText("coverDate", CONFIG.weddingDateDisplay);
fillImg("coverImage", CONFIG.coverImage);
fillImg("couple", CONFIG.coupleCutoutImage); // id must stay "couple" — used by scenes.js

fillText("quoteText", CONFIG.quoteText);
fillText("verseText", CONFIG.verseText);
fillText("verseSource", CONFIG.verseSource);

fillText("brideName", CONFIG.brideFirstName);
fillText("brideFullName", CONFIG.brideFullName);
fillText("brideParents", CONFIG.brideParents);
fillText("brideInstagramHandle", CONFIG.brideInstagram);
document.getElementById("brideInstagramLink").href = CONFIG.brideInstagramUrl;

fillText("groomName", CONFIG.groomFirstName);
fillText("groomFullName", CONFIG.groomFullName);
fillText("groomParents", CONFIG.groomParents);
fillText("groomInstagramHandle", CONFIG.groomInstagram);
document.getElementById("groomInstagramLink").href = CONFIG.groomInstagramUrl;

(function renderEvents() {
  const wrap = document.getElementById("eventsWrap");
  wrap.innerHTML = CONFIG.events
    .map(
      (e) => `
      <div style="text-align:center;">
        <p class="h1" style="color:var(--main-color);font-size:clamp(22px, 8vw, 34px);word-break:break-word;">${e.title}</p>
        <p class="p3" style="margin-top:4px;font-weight:700">${e.date}</p>
        <p class="p3">${e.time}</p>
        <p class="p3" style="margin-top:4px;font-weight:700">${e.venue}</p>
        <p class="p3">${e.address}</p>
        <a href="${e.mapUrl}" target="_blank" rel="noopener noreferrer" class="button1 p3 clickable">Google Maps</a>
      </div>`
    )
    .join("") +
    `<div style="text-align:center;margin-top:-12px">
      <p class="p3" style="margin-top:12px">${CONFIG.liveStreamNote}</p>
      <a href="${CONFIG.liveStreamUrl}" target="_blank" rel="noopener noreferrer" class="button1 p3 clickable" style="width:120px;margin-top:12px;">Live Streaming</a>
    </div>`;
})();

fillText("dresscodeText", CONFIG.dresscodeText);
(function renderDresscode() {
  const wrap = document.getElementById("dresscodeColors");
  wrap.innerHTML = CONFIG.dresscodeColors
    .map((c) => `<div class="dc-item" style="background:${c}"></div>`)
    .join("");
})();

fillText("closingHeading", CONFIG.closingHeading);
fillText("closingText", CONFIG.closingText);
fillText("copyrightText", CONFIG.copyrightText);
document.getElementById("whatsappLink").href = "https://wa.me/" + CONFIG.whatsappNumber;
fillText("whatsappDisplay", CONFIG.whatsappDisplay);
if (CONFIG.brandLogo) {
  document.getElementById("brandLogo").src = CONFIG.brandLogo;
  document.getElementById("brandLogo").style.display = "inline";
}

/* ---- Countdown timer ------------------------------------------------------ */
(function countdown() {
  const target = new Date(CONFIG.weddingDateISO).getTime();
  const els = {
    days: document.getElementById("cdDays"),
    hours: document.getElementById("cdHours"),
    minutes: document.getElementById("cdMinutes"),
    seconds: document.getElementById("cdSeconds"),
  };
  if (!els.days) return;
  function tick() {
    const diff = Math.max(0, target - Date.now());
    const s = Math.floor(diff / 1000);
    els.days.textContent = String(Math.floor(s / 86400)).padStart(2, "0");
    els.hours.textContent = String(Math.floor((s % 86400) / 3600)).padStart(2, "0");
    els.minutes.textContent = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
    els.seconds.textContent = String(s % 60).padStart(2, "0");
  }
  tick();
  setInterval(tick, 1000);
})();
document.getElementById("saveTheDateBtn").href = CONFIG.googleCalendarUrl;

/* ---- Reveal-on-scroll: fades/slides in any .reveal-on-scroll element ------ */
(function setupScrollReveal() {
  const targets = document.querySelectorAll(".reveal-on-scroll");
  if (!targets.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.25 }
  );
  targets.forEach((el) => observer.observe(el));
})();

/* ==========================================================================
   GALLERY — auto-advancing carousel (one photo at a time) + lightbox with
   prev/next/close controls (tapping a slide opens the full lightbox).
   HOW TO EDIT:
   - CAROUSEL_INTERVAL_MS below = how long each slide stays before auto-
     advancing to the next one (currently 2000ms = 2 seconds).
   - Slide size/shape, transition speed, dot indicators: all in style.css
     under "Gallery: title + auto-advancing carousel".
   ========================================================================== */
(function renderGallery() {
  const CAROUSEL_INTERVAL_MS = 2000;

  const track = document.getElementById("galleryTrack");
  const carousel = document.getElementById("galleryCarousel");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  if (!track) return;

  track.innerHTML = CONFIG.gallery
    .map((src, i) => `<img src="${src}" alt="Gallery photo ${i + 1}" loading="lazy" data-index="${i}">`)
    .join("");

  const dotsWrap = document.createElement("div");
  dotsWrap.className = "gallery-dots";
  dotsWrap.innerHTML = CONFIG.gallery.map(() => "<span></span>").join("");
  carousel.after(dotsWrap);
  const dots = dotsWrap.querySelectorAll("span");

  let slideIndex = 0;
  function goToSlide(i) {
    slideIndex = (i + CONFIG.gallery.length) % CONFIG.gallery.length;
    track.style.transform = `translateX(-${slideIndex * 100}%)`;
    dots.forEach((d, di) => d.classList.toggle("active", di === slideIndex));
  }
  goToSlide(0);

  let autoAdvance = setInterval(() => goToSlide(slideIndex + 1), CAROUSEL_INTERVAL_MS);
  // Pause auto-advance while the guest is actively looking at the lightbox,
  // so the carousel doesn't keep changing underneath it.
  function pauseAutoAdvance() { clearInterval(autoAdvance); }
  function resumeAutoAdvance() {
    clearInterval(autoAdvance);
    autoAdvance = setInterval(() => goToSlide(slideIndex + 1), CAROUSEL_INTERVAL_MS);
  }

  function openAt(i) {
    pauseAutoAdvance();
    goToSlide(i);
    lightboxImg.src = CONFIG.gallery[slideIndex];
    lightbox.classList.add("open");
  }

  track.querySelectorAll("img").forEach((img, i) => {
    img.addEventListener("click", () => openAt(i));
  });

  document.getElementById("lightboxClose").addEventListener("click", () => {
    lightbox.classList.remove("open");
    resumeAutoAdvance();
  });
  document.getElementById("lightboxPrev").addEventListener("click", (e) => {
    e.stopPropagation();
    goToSlide(slideIndex - 1);
    lightboxImg.src = CONFIG.gallery[slideIndex];
  });
  document.getElementById("lightboxNext").addEventListener("click", (e) => {
    e.stopPropagation();
    goToSlide(slideIndex + 1);
    lightboxImg.src = CONFIG.gallery[slideIndex];
  });
  // Clicking the dark backdrop (not the image/buttons) also closes it.
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove("open");
      resumeAutoAdvance();
    }
  });
})();

/* ---- Background music: spinning vinyl button (HTML5 audio) ---------------- */
let audioEl = null;
function playBackgroundMusic() {
  const btn = document.getElementById("music-button");
  btn.classList.add("playing"); // spin the vinyl regardless of audio state
  if (!CONFIG.musicSrc) return; // no track configured yet — spins silently
  if (!audioEl) {
    audioEl = new Audio(CONFIG.musicSrc);
    audioEl.loop = true;
  }
  audioEl.play().catch(() => {});
}
document.getElementById("music-button").addEventListener("click", () => {
  const btn = document.getElementById("music-button");
  if (audioEl) {
    if (audioEl.paused) {
      audioEl.play();
      btn.classList.add("playing");
    } else {
      audioEl.pause();
      btn.classList.remove("playing");
    }
  } else {
    // No CONFIG.musicSrc set yet — just toggle the visual spin.
    btn.classList.toggle("playing");
  }
});


/* ---- Wedding gift: reveal + copy-to-clipboard ------------------------------ */
fillText("giftIntro", CONFIG.giftIntro);
(function renderGift() {
  const wrap = document.getElementById("bankAccountsWrap");
  wrap.innerHTML = CONFIG.bankAccounts
    .map(
      (b, i) => `
      <div class="bank-card">
        <img class="bank-logo" src="${b.bankLogo}" alt="bank logo">
        <img class="bank-chip" src="assets/images/payment/card-chip.png" alt="">
        <h2 class="elementor-heading-title elementor-size-default">${b.accountNumber}</h2>
        <h2 class="elementor-heading-title elementor-size-default">${b.accountName}</h2>
        <button type="button" class="elementor-button elementor-size-lg copy-btn" data-copy="${b.accountNumber}">Copy</button>
      </div>`
    )
    .join("") +
    `<div class="physical-gift">
        <img src="assets/images/payment/gift-icon.png" alt="">
        <p class="elementor-heading-title elementor-size-default">Send Gift</p>
        <p class="elementor-heading-title elementor-size-default">${CONFIG.physicalGift.recipientLine}</p>
        <p class="elementor-heading-title elementor-size-default">${CONFIG.physicalGift.address}</p>
      </div>`;

  document.getElementById("giftToggle").addEventListener("click", () => {
    wrap.classList.toggle("open");
  });
  wrap.querySelectorAll(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      navigator.clipboard.writeText(btn.dataset.copy);
      const original = btn.textContent;
      btn.textContent = "Copied";
      btn.style.backgroundColor = "#5cb85c";
      setTimeout(() => {
        btn.textContent = original;
        btn.style.backgroundColor = "";
      }, 3000);
    });
  });
})();

/* ---- RSVP form (shared Firestore guestbook — see firebase-config.js) ------
   Wishes are now stored centrally (invitations/{slug}/wishes in Firestore)
   instead of only in each visitor's own browser, so every guest sees the
   same guestbook and the couple can moderate it from any device. Falls
   back to showing only config.js's sampleWishes if Firebase didn't load. */
fillText("rsvpPrompt", CONFIG.rsvpPrompt);
(function setupRsvp() {
  const form = document.getElementById("rsvpForm");
  const wishesWrap = document.getElementById("wishesWrap");
  const successMsg = document.getElementById("rsvpSuccess");

  // Guards against name/message text (typed by guests) being interpreted
  // as HTML when inserted into the page.
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (ch) => (
      { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]
    ));
  }

  function renderWishes(liveWishes) {
    const combined = [
      ...liveWishes.map((w) => ({ id: w.id, name: w.name, text: w.message, live: true })),
      ...CONFIG.sampleWishes.map((w) => ({ name: w.name, text: w.text, live: false })),
    ];
    // wish row stagger: each row gets a slightly later animation-delay than
    // the one before it (0.12s apart) so they fade in one at a time instead
    // of all at once — the actual fade/rise animation + its "only once the
    // RSVP section is visible" trigger both live in style.css, under
    // ".section.is-visible .comment". Change the 0.12 multiplier below to
    // speed up/slow down the one-by-one stagger.
    wishesWrap.innerHTML = combined
      .map(
        (w, i) => `
        <div class="comment" style="animation-delay:${(i * 0.12).toFixed(2)}s">
          <span class="name">${escapeHtml(w.name)}</span>
          <span class="text">${escapeHtml(w.text)}</span>
          ${w.live ? `<button type="button" class="wish-delete clickable" data-id="${w.id}" aria-label="Delete this wish">&#128465;</button>` : ""}
        </div>`
      )
      .join("");

    // Deleting a wish requires the admin code from firebase-config.js
    // (INVITATION_CONFIG.adminSecret) — see the security note in that file.
    wishesWrap.querySelectorAll(".wish-delete").forEach((btn) => {
      btn.addEventListener("click", () => {
        const entered = window.prompt("Enter the admin code to delete this wish:");
        if (entered === null) return; // cancelled
        if (entered !== INVITATION_CONFIG.adminSecret) {
          alert("Incorrect code.");
          return;
        }
        wishesCollection
          .doc(btn.dataset.id)
          .delete()
          .catch((err) => {
            console.warn("Failed to delete wish:", err);
            alert("Could not delete — please check your connection and try again.");
          });
      });
    });
  }

  // Live-updating guestbook: new wishes and deletions appear for every
  // guest without needing to refresh the page.
  if (typeof wishesCollection !== "undefined") {
    wishesCollection.orderBy("createdAt", "desc").onSnapshot(
      (snapshot) => {
        const liveWishes = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        renderWishes(liveWishes);
      },
      (err) => {
        console.warn("Could not load wishes from Firebase:", err);
        renderWishes([]);
      }
    );
  } else {
    renderWishes([]);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = form.querySelector("[name=guestname]").value.trim();
    const message = form.querySelector("[name=message]").value.trim();
    const attendance = form.querySelector("[name=attendance]").value;
    if (!attendance) {
      alert("Please select your attendance");
      return;
    }

    if (CONFIG.formActionUrl) {
      try {
        await fetch(CONFIG.formActionUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, message, attendance }),
        });
      } catch (err) {
        console.warn("RSVP form submission failed:", err);
      }
    }

    if (typeof wishesCollection !== "undefined") {
      try {
        await wishesCollection.add({
          name,
          message,
          attendance,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
      } catch (err) {
        console.warn("Could not save RSVP to Firebase:", err);
      }
    }

    form.reset();
    form.style.display = "none";
    successMsg.style.display = "flex";
  });
})();

// ---- Reveal each content section (the shared countdown+RSVP overlay
// panel, gallery, gift, footer) one at a time as it scrolls into view,
// instead of having them all appear at once (see ".section.is-visible" and
// ".overlay-panel.is-visible" in style.css for what each one triggers).
(function initScrollReveal() {
  const sections = document.querySelectorAll("#lastContainer > .section");
  if (!sections.length) return;

  if (!("IntersectionObserver" in window)) {
    sections.forEach((s) => s.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
  );

  sections.forEach((section) => observer.observe(section));
})();
