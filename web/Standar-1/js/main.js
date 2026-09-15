/* ============================================================
   UNDANGAN — Arka & Ditha — main.js
   ============================================================ */
(function () {
  "use strict";

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  /* ------------------------------------------------------------
     Guest name from ?to= query param
     contoh link: undangan.html?to=Bapak%20Budi%20Santoso
     ------------------------------------------------------------ */
  (function initGuestName() {
    try {
      const params = new URLSearchParams(location.search);
      const to = params.get("to");
      if (to && to.trim()) {
        $("#guest-name").textContent = decodeURIComponent(to.replace(/\+/g, " "));
      }
    } catch (err) { /* param ora valid — ora masalah, tetep nganggo default */ }
  })();

  /* ------------------------------------------------------------
     Viewport height fix (mobile browser chrome resize)
     ------------------------------------------------------------ */
  function setVH() {
    document.documentElement.style.setProperty("--vh", window.innerHeight * 0.01 + "px");
  }
  setVH();
  window.addEventListener("resize", setVH);

  /* ------------------------------------------------------------
     Scroll / Swipe Cue Auto-show & Auto-hide Logic
     ------------------------------------------------------------ */
  function initScrollCue() {
    const cue = $(".scroll-cue");
    const openBtn = $(".open-btn");

    if (!cue) return;

    // Supaya aman yen durung diklik
    cue.style.display = "none";

    function showCue() {
      cue.style.display = "flex";
      cue.style.opacity = "0.8";
      cue.style.transition = "opacity 0.4s ease";
    }

    // Ngunci tombol buka undangan yen diklik langsung nampilke Scroll Cue
    if (openBtn) {
      openBtn.addEventListener("click", () => {
        setTimeout(showCue, 300); // Metu rada alus sawise tombol diklik
      });
    }

    // Otomatis ndelikke cue yen wis nyedhaki section 6 / paling ngisor
    window.addEventListener("scroll", () => {
      if (cue.style.display === "none") return;
      
      const scrollPos = window.scrollY + window.innerHeight;
      const totalHeight = document.documentElement.scrollHeight;

      if (totalHeight - scrollPos < 150) {
        cue.style.opacity = "0";
      } else {
        cue.style.opacity = "0.8";
      }
    }, { passive: true });
  }

  /* ================================================================
     SCROLL-STORY (section 1–6) — kabeh mlebu try/catch. Yen GSAP utawa
     ScrollTrigger gagal dimuat / error, kelas "no-scrollstory" ditambahke
     menyang  lan CSS njupuk alih nampilke kabeh konten statis
     ================================================================ */
  /* isWideStage kudu mung TRUE ing desktop tenanan. Yen mung dicek nganggo
     "(min-aspect-ratio: 9/16)" wae, iki gampang keliru ing iPhone Safari:
     pas kaca lagi kebuka, chrome Safari (address bar + tab bar) during
     kanthi lengkap during ndelik, dadi window.innerHeight during cendhek
     banget — ratio width/height iPhone bisa "katon" >= 9/16 sanajan HP-e
     jelas dhuwur/portrait. Nek kedadeyan, #stage kejiret dadi mode
     "letterbox desktop" (transform + box-shadow) ing HP normal, sing
     nyebabke: (1) max-width #stage dietung soko svh sing during cilik ->
     katon black-bar kiwa-tengen, (2) #stage dadi containing block kanggo
     kabeh anak position:fixed (kalebu .scroll-cue) -> "bottom" saiki
     ngetung soko dhuwure #stage SAK KABEHE (ewon px), dudu soko ngisor
     layar, dadi scroll-cue "ilang"/ketutupan.
     Tambahan "(pointer: fine)" ndadekke kondisi mung kanggo perangkat sing
     nganggo mouse tenanan (desktop/laptop) — HP/tablet layar-sentuh (sing
     "pointer"-e "coarse") ora bakal tau kejiret mode iki, sepiro wae
     aspect-ratio-ne pas kebuka. */
  const isWideStage = window.matchMedia("(min-aspect-ratio: 9/16) and (pointer: fine)").matches;
  function stagePinType() {
    return isWideStage ? "transform" : undefined;
  }

  function buildSection1() {
    const groomPanel = "#s1-panel-groom";
    const bridePanel = "#s1-panel-bride";
    const groomTexts = $$("#s1-panel-groom .s1-first-name, #s1-panel-groom .s1-full-name, #s1-panel-groom .s1-rule, #s1-panel-groom .s1-parents, #s1-panel-groom .s1-address, #s1-panel-groom .s1-ig");
    const brideTexts = $$("#s1-panel-bride .s1-first-name, #s1-panel-bride .s1-full-name, #s1-panel-bride .s1-rule, #s1-panel-bride .s1-parents, #s1-panel-bride .s1-address, #s1-panel-bride .s1-ig");

    gsap.set(groomPanel, { xPercent: -100 });
    gsap.set(bridePanel, { xPercent: 100 });
    gsap.set("#wipe-bar-2", { yPercent: 100 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#pin-spacer-1",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        pin: "#section1",
        pinSpacing: false,
        pinType: stagePinType(),
        anticipatePin: 1
      }
    });

    tl.to("#s1-verse", { opacity: 1, duration: 1, ease: "power1.out" })
      .to("#s1-verse", { opacity: 1, duration: 0.6 })
      .to("#s1-verse", { opacity: 0, duration: 1, ease: "power1.in" })
      .to(groomPanel, { xPercent: 0, opacity: 1, duration: 1.3, ease: "power2.out" })
      .to(groomTexts, { opacity: 1, y: 0, duration: 0.85, stagger: 0.3, ease: "power2.out" })
      .to(groomTexts, { opacity: 1, duration: 0.7 })
      .to(groomTexts, { opacity: 0, duration: 0.5, ease: "power1.in" })
      .to(groomPanel, { xPercent: -100, opacity: 0, duration: 1.1, ease: "power2.in" })
      .to(bridePanel, { xPercent: 0, opacity: 1, duration: 1.3, ease: "power2.out" })
      .to(brideTexts, { opacity: 1, y: 0, duration: 0.85, stagger: 0.3, ease: "power2.out" })
      .to(brideTexts, { opacity: 1, duration: 0.7 })
      .to(brideTexts, { opacity: 0, duration: 0.5, ease: "power1.in" })
      .to(bridePanel, { xPercent: 100, opacity: 0, duration: 1.1, ease: "power2.in" })
      .to("#wipe-bar-2", { yPercent: 0, duration: 1.2, ease: "power2.inOut" });
  }

  function buildSection2() {
    gsap.set("#wipe-bar-3", { yPercent: 100 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#pin-spacer-2",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        pin: "#section2",
        pinSpacing: false,
        pinType: stagePinType(),
        anticipatePin: 1
      }
    });

    tl.to("#s2-block-blessing", { opacity: 1, y: 0, duration: 1.1, ease: "power2.out" })
      .to("#s2-block-blessing", { opacity: 1, duration: 0.9 })
      .to("#s2-block-reception", { opacity: 1, y: 0, duration: 1.1, ease: "power2.out" })
      .to("#s2-block-reception", { opacity: 1, duration: 1.1 })
      .to("#wipe-bar-3", { yPercent: 0, duration: 1.2, ease: "power2.inOut" });
  }

  function buildSection3() {
    const items = $$(".s3-item");
    const dots = $$(".s3-dot");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#pin-spacer-3",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        pin: "#section3",
        pinSpacing: false,
        pinType: stagePinType(),
        anticipatePin: 1
      }
    });

    tl.to(".s3-title", { opacity: 1, y: 0, duration: 1, ease: "power2.out" })
      .to("#s3-line", { scaleY: 1, duration: 4.2, ease: "none" }, "story")
      .to(items, { opacity: 1, duration: 0.6, stagger: 0.62, ease: "power1.out" }, "story+=0.25")
      .to(dots, { scale: 1, duration: 0.4, stagger: 0.62, ease: "back.out(2)" }, "story+=0.25")
      .to(items, { opacity: 1, duration: 0.8 });
  }

  function buildSection4Reveal() {
    gsap.set("#wipe-bar-5", { yPercent: 100 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#pin-spacer-4",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        pin: "#section4",
        pinSpacing: false,
        pinType: stagePinType(),
        anticipatePin: 1,
        onUpdate: (self) => {
          if (self.progress > 0.12) window.dispatchEvent(new CustomEvent("s4:reveal"));
        }
      }
    });

    tl.to("#s4-title", { opacity: 1, y: 0, duration: 1, ease: "power2.out" })
      .to("#s4-carousel-wrap", { opacity: 1, y: 0, duration: 1.1, ease: "power2.out" }, "-=0.5")
      .to("#s4-carousel-wrap", { opacity: 1, duration: 1.5 })
      .to("#wipe-bar-5", { yPercent: 0, duration: 1.2, ease: "power2.inOut" });
  }

  function buildSection5Reveal() {
    gsap.set("#wipe-bar-6", { yPercent: 100 });
    // Kaloro pane numpuk pas ing panggonan sing padha (position:absolute;
    // inset:0). Yen mung ngatur opacity, pane sing lagi ora katon
    // (#s5-pane-gift) tetep "kejiret" ing ndhuwur ing DOM sakwise
    // #s5-pane-doa, dadi tetep nampa klik/tap senajan transparan — iki
    // sing gawe kolom nama & pesen ing form do'a ora iso diisi. Kudu
    // dijaga nganggo pointer-events, dudu opacity thok.
    gsap.set(["#s5-pane-doa", "#s5-pane-gift"], { pointerEvents: "none" });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#pin-spacer-5",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        pin: "#section5",
        pinSpacing: false,
        pinType: stagePinType(),
        anticipatePin: 1
      }
    });

    tl.to("#s5-pane-doa", { opacity: 1, duration: 1, ease: "power1.out" })
      .set("#s5-pane-doa", { pointerEvents: "auto" })
      .to("#s5-pane-doa", { opacity: 1, duration: 1.6 })
      .to("#s5-pane-doa", { opacity: 0, duration: 0.9, ease: "power1.in" })
      .set("#s5-pane-doa", { pointerEvents: "none" })
      .to("#s5-pane-gift", { opacity: 1, duration: 1, ease: "power1.out" }, "<")
      .set("#s5-pane-gift", { pointerEvents: "auto" })
      .to("#s5-pane-gift", { opacity: 1, duration: 1.4 })
      .to("#wipe-bar-6", { yPercent: 0, duration: 1.2, ease: "power2.inOut" });
  }

  const FLOWER_ORDER = [0, 1, 16, 17, 2, 15, 3, 4, 14, 12, 5, 7, 11, 10, 6, 13, 9, 8];

  function buildSection6() {
    const paths = $$("#s6-flower path");
    const orderedPaths = FLOWER_ORDER.map((i) => paths.find((p) => p.getAttribute("data-i") === String(i))).filter(Boolean);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#pin-spacer-6",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        pin: "#section6",
        pinSpacing: false,
        pinType: stagePinType(),
        anticipatePin: 1
      }
    });

    tl.to(orderedPaths, { opacity: 1, duration: 0.5, stagger: 0.22, ease: "power1.out" })
      .to(".s6-title", { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, "+=0.2")
      .to(".s6-text", { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, "-=0.5")
      .to(".s6-signature", { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, "-=0.5")
      .to(".s6-signature", { opacity: 1, duration: 1 });
  }

  /* ================================================================
     Bagean PLAIN JS: carousel, map button, form, copy button
     ================================================================ */
  function initMapButton() {
    const mapBtn = $("#s2-map-btn");
    if (!mapBtn) return;
    mapBtn.addEventListener("click", () => {
      const q = encodeURIComponent("PURI MATARAM Resto & Wahana Wisata, Jl. PJKA, Drono, Tridadi, Sleman");
      window.open("https://www.google.com/maps/search/?api=1&query=" + q, "_blank", "noopener");
    });
  }

  function initCarousel() {
    const slides = $$("#section4 .s4-slide");
    const dots = $$("#section4 .s4-dots span");
    const track = $("#s4-track");
    if (!track || !slides.length) return;

    let active = 0;
    let autoplayId = null;

    function goTo(i) {
      active = (i + slides.length) % slides.length;
      slides.forEach((s, idx) => s.classList.toggle("is-active", idx === active));
      dots.forEach((d, idx) => d.classList.toggle("is-active", idx === active));
    }
    function next() { goTo(active + 1); }
    function prev() { goTo(active - 1); }
    function startAutoplay() { stopAutoplay(); autoplayId = setInterval(next, 3200); }
    function stopAutoplay() { if (autoplayId) clearInterval(autoplayId); autoplayId = null; }

    let startX = 0, deltaX = 0, dragging = false;
    track.addEventListener("touchstart", (e) => {
      dragging = true; startX = e.touches[0].clientX; deltaX = 0; stopAutoplay();
    }, { passive: true });
    track.addEventListener("touchmove", (e) => {
      if (!dragging) return;
      deltaX = e.touches[0].clientX - startX;
    }, { passive: true });
    track.addEventListener("touchend", () => {
      if (!dragging) return;
      dragging = false;
      if (deltaX > 40) prev(); else if (deltaX < -40) next();
      startAutoplay();
    });
    track.addEventListener("mousedown", (e) => { dragging = true; startX = e.clientX; deltaX = 0; stopAutoplay(); });
    window.addEventListener("mouseup", () => {
      if (!dragging) return;
      dragging = false;
      if (deltaX > 40) prev(); else if (deltaX < -40) next();
      startAutoplay();
    });
    window.addEventListener("mousemove", (e) => { if (dragging) deltaX = e.clientX - startX; });

    window.addEventListener("s4:reveal", () => { if (!autoplayId) startAutoplay(); });
    if (document.documentElement.classList.contains("no-scrollstory")) startAutoplay();
  }

  function initSection5Interactions() {
    $$(".s5-copy-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        let text = btn.getAttribute("data-copy") || "";

        // Kanggo kartu rekening ("digits"): salin mung angka-angkane wae,
        // senajan sacara ora sengaja ana spasi/titik kesilip ing atribut
        // data-copy. Kanggo kartu alamat ("text"): salin apa anane.
        if (btn.getAttribute("data-copy-type") === "digits") {
          text = text.replace(/\D/g, "");
        }

        const done = () => {
          const original = btn.textContent;
          btn.textContent = "Tersalin";
          btn.classList.add("is-copied");
          setTimeout(() => { btn.textContent = original; btn.classList.remove("is-copied"); }, 1500);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done).catch(done);
        } else {
          done();
        }
      });
    });
  }

  /* ================================================================
     DO'A & UCAPAN — kirim & tampil kanggo kabeh tamu (Firebase
     Firestore), tiba mode cadangan localStorage yen firebase-config
     durung diisi / gagal dimuat. Slug & adminSecret diatur ing
     assets/js/firebase-config.js (kapisah, ben gampang diganti).
     ================================================================ */
  function initWishes() {
    const form = $("#s5-form");
    const nameInput = $("#s5-name");
    const msgInput = $("#s5-message");
    const list = $("#s5-wish-list");
    const empty = $("#s5-wish-empty");

    if (!form || !list) return;

    function escapeHTML(str) {
      const div = document.createElement("div");
      div.textContent = str;
      return div.innerHTML;
    }

    function renderItem(item) {
      const el = document.createElement("div");
      el.className = "s5-wish-item";
      el.innerHTML =
        '<div class="s5-wish-item__top">' +
          '<p class="s5-wish-item__name">' + escapeHTML(item.name) + '</p>' +
          '<button type="button" class="s5-wish-item__delete" aria-label="Hapus ucapan">&#10005;</button>' +
        '</div>' +
        '<p class="s5-wish-item__msg">' + escapeHTML(item.message) + '</p>';
      el.querySelector(".s5-wish-item__delete").addEventListener("click", () => {
        handleDeleteRequest(item.id);
      });
      return el;
    }

    function renderList(items) {
      $$(".s5-wish-item", list).forEach((el) => el.remove());
      if (!items.length) {
        if (empty) empty.style.display = "";
        return;
      }
      if (empty) empty.style.display = "none";
      items.forEach((item) => list.appendChild(renderItem(item)));
    }

    const hasFirebaseConfig =
      typeof INVITATION_CONFIG !== "undefined" &&
      typeof firebase !== "undefined" &&
      INVITATION_CONFIG.firebase &&
      INVITATION_CONFIG.firebase.apiKey;

    let wishStore;

    if (hasFirebaseConfig) {
      try {
        if (!firebase.apps || !firebase.apps.length) {
          firebase.initializeApp(INVITATION_CONFIG.firebase);
        }
        const db = firebase.firestore();
        const wishesCol = db
          .collection("invitations")
          .doc(INVITATION_CONFIG.slug)
          .collection("wishes");

        wishesCol.orderBy("createdAt", "desc").onSnapshot(
          (snapshot) => {
            const items = snapshot.docs.map((doc) => {
              const d = doc.data();
              return { id: doc.id, name: d.name, message: d.message };
            });
            renderList(items);
          },
          (err) => console.error("Firestore error:", err)
        );

        wishStore = {
          add: (name, message) =>
            wishesCol.add({
              name,
              message,
              createdAt: firebase.firestore.FieldValue.serverTimestamp()
            }),
          remove: (id) => wishesCol.doc(id).delete()
        };
      } catch (err) {
        console.error("Firebase gagal disetel, fallback ke localStorage:", err);
        wishStore = null;
      }
    }

    if (!wishStore) {
      console.warn("Firebase durung dikonfigurasi — ucapan mung kesimpen lokal ing HP iki.");
      const STORAGE_KEY = "undangan-arka-ditha-wishes";
      const loadLocal = () => {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
        catch (e) { return []; }
      };
      const saveLocal = (l) => {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(l)); }
        catch (e) { /* noop */ }
      };

      renderList(loadLocal().slice().reverse());

      wishStore = {
        add: (name, message) => {
          const l = loadLocal();
          l.push({ id: "local-" + Date.now(), name, message });
          saveLocal(l);
          renderList(l.slice().reverse());
          return Promise.resolve();
        },
        remove: (id) => {
          const l = loadLocal().filter((w) => w.id !== id);
          saveLocal(l);
          renderList(l.slice().reverse());
          return Promise.resolve();
        }
      };
    }

    function handleDeleteRequest(id) {
      const code = window.prompt("Masukkan kode rahasia untuk menghapus ucapan ini:");
      if (code === null) return;
      const secret = (typeof INVITATION_CONFIG !== "undefined" && INVITATION_CONFIG.adminSecret) || "";
      if (code !== secret) {
        window.alert("Kode salah, ucapan tidak dihapus.");
        return;
      }
      wishStore.remove(id);
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = nameInput.value.trim();
      const message = msgInput.value.trim();
      if (!name || !message) return;

      wishStore.add(name, message).catch((err) => {
        console.error("Gagal mengirim ucapan:", err);
        window.alert("Maaf, ucapan gagal terkirim. Coba lagi, ya.");
      });

      form.reset();
    });
  }

  /* ================================================================
     BOOT
     ================================================================ */
  window.addEventListener("DOMContentLoaded", () => {
    initMapButton();
    initCarousel();
    initSection5Interactions();
    initWishes();
    initScrollCue();

    let scrollStoryOk = false;
    try {
      if (window.gsap && window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
        ScrollTrigger.config({ ignoreMobileResize: true });

        try { /* ScrollTrigger.normalizeScroll(true); */ } catch (err) { /* noop */ }
        // ^ dipateni: normalizeScroll ngambil-alih native scroll nganggo
        // transform JS, iku sing nyebabke Safari ora gelem ndelikke
        // address bar pas discroll (beda karo undangan pembanding sing
        // scroll native/sticky, bar-e gelem ndelik normal).

        buildSection1();
        buildSection2();
        buildSection3();
        buildSection4Reveal();
        buildSection5Reveal();
        buildSection6();
        scrollStoryOk = true;
      }
    } catch (err) {
      console.error("Scroll-story animation gagal diinisialisasi, fallback ke tampilan statis:", err);
    }

    if (!scrollStoryOk) {
      document.documentElement.classList.add("no-scrollstory");
    }

    window.addEventListener("load", () => {
      if (window.ScrollTrigger) {
        try { ScrollTrigger.refresh(); } catch (err) { /* noop */ }
      }
    });
  });
})();
