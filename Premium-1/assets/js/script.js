/* =========================================================================
   UNDANGAN DEWI & BAGAS — script.js
   Scroll-driven "zoom via sticky canvas" experience.

   Cara kerja singkat:
   - #scrollTrack dibuat dhuwur banget (total vh seko PHASES ing ngisor
     iki + 100vh). #stage ing njerone position:sticky, dadi "kanvas"
     sing tetep katon nalika discroll.
   - Saben scroll, dihitung "scrolledVh" (piro vh sing wis kelewat),
     banjur dicocokke karo PHASES kanggo nemtokke scene endi sing lagi
     aktif lan progress transisi (0..1) kanggo animasi zoom/fade.
   ========================================================================= */
(function () {
  "use strict";

  /* ===================================================================
     0. SETUP VIEWPORT HEIGHT (dvh polyfill kanggo browser lawas/HP)
  =================================================================== */
  function setVH() {
    document.documentElement.style.setProperty("--vh100", window.innerHeight + "px");
  }
  setVH();
  window.addEventListener("resize", setVH);
  window.addEventListener("orientationchange", setVH);

  /* ===================================================================
     1. GUEST NAME seko URL ?to=
  =================================================================== */
  (function guestName() {
    var params = new URLSearchParams(window.location.search);
    var to = params.get("to");
    var el = document.getElementById("guestName");
    if (to && el) el.textContent = decodeURIComponent(to.replace(/\+/g, " "));
  })();

  /* ===================================================================
     2. LOADER — ilang pas kabeh gambar utama wis siap (utawa max 2.2s)
  =================================================================== */
  (function loader() {
    var loaderEl = document.getElementById("loader");
    if (!loaderEl) return;
    var hide = function () { loaderEl.classList.add("is-hidden"); };
    var imgs = document.querySelectorAll("#cover img, #scene1 img, #scene2 img");
    var total = imgs.length, loaded = 0, done = false;
    function check() {
      loaded++;
      if (loaded >= total && !done) { done = true; setTimeout(hide, 250); }
    }
    if (!total) { hide(); return; }
    imgs.forEach(function (img) {
      if (img.complete) check();
      else {
        img.addEventListener("load", check);
        img.addEventListener("error", check);
      }
    });
    setTimeout(function () { if (!done) { done = true; hide(); } }, 2200);
  })();

  /* ===================================================================
     3. COVER — buka pintu
  =================================================================== */
  var cover = document.getElementById("cover");
  var openBtn = document.getElementById("openInvitation");
  var bgm = document.getElementById("bgm");
  document.body.classList.add("lock-scroll");

  var coverOpened = false;

  if (openBtn) {
    openBtn.addEventListener("click", function () {
      if (cover.classList.contains("is-open")) return;
      cover.classList.add("is-closing");

      // musik mulai pas interaksi user (syarat autoplay browser)
      if (bgm) {
        bgm.volume = 0.85;
        bgm.play().then(function () {
          var btn = document.getElementById("musicBtn");
          if (btn) btn.classList.add("is-playing");
        }).catch(function () { /* dibiarke, user isih iso mencet tombol musik manual */ });
      }

      setTimeout(function () {
        cover.classList.add("is-open");
      }, 260);

      setTimeout(function () {
        document.body.classList.remove("lock-scroll");
        window.scrollTo(0, 0);
        coverOpened = true;
        if (typeof renderNow === "function") renderNow();
      }, 260 + 950);
    });
  }

  /* ===================================================================
     4. MUSIK — toggle play/pause + nada mengambang
  =================================================================== */
  var musicBtn = document.getElementById("musicBtn");
  var notesLayer = document.getElementById("notesLayer");
  var noteImgs = ["not-a", "not-b", "not-c", "not-d"];
  var noteTimer = null;

  function spawnNote() {
    if (!notesLayer) return;
    var note = document.createElement("img");
    var pick = noteImgs[Math.floor(Math.random() * noteImgs.length)];
    note.src = "assets/images/" + pick + ".webp";
    note.className = "note";
    note.alt = "";
    var offsetX = (Math.random() * 60 - 30).toFixed(1);
    var rot = (Math.random() * 30 - 15).toFixed(1);
    note.style.left = "calc(70.4% + " + offsetX + "px)";
    note.style.top = "68%";
    note.style.setProperty("--rot", rot + "deg");
    note.style.width = (16 + Math.random() * 12).toFixed(0) + "px";
    notesLayer.appendChild(note);
    setTimeout(function () { note.remove(); }, 2700);
  }

  function startNotes() {
    stopNotes();
    spawnNote();
    noteTimer = setInterval(spawnNote, 550);
  }
  function stopNotes() {
  if (noteTimer) { 
    clearInterval(noteTimer); 
    noteTimer = null; 
  }
  
  // Langsung resiki kabeh nada neng njero container
  if (notesLayer) {
    notesLayer.innerHTML = "";
  }
}

  if (musicBtn && bgm) {
    musicBtn.addEventListener("click", function () {
      if (bgm.paused) {
        bgm.play().catch(function () {});
      } else {
        bgm.pause();
      }
    });
    bgm.addEventListener("play", function () {
      musicBtn.classList.add("is-playing");
      startNotes();
    });
    bgm.addEventListener("pause", function () {
      musicBtn.classList.remove("is-playing");
      stopNotes();
    });
  }

  /* ===================================================================
     5. MEGA MENDUNG — awan batik ngambang random neng ndhuwur & ngisor
  =================================================================== */
  (function initClouds() {
    var top = document.getElementById("megaTop");
    var bottom = document.getElementById("megaBottom");
    if (!top || !bottom) return;

    function rand(min, max) { return Math.random() * (max - min) + min; }

    function fill(container, edge) {
      var count = 4;
      for (var i = 0; i < count; i++) {
        var img = document.createElement("img");
        img.src = "assets/images/mega-" + (Math.random() < 0.5 ? "1" : "2") + ".webp";
        img.alt = "";
        img.className = "cloud";
        var size = rand(260, 360);
        img.style.width = size + "px";
        img.style.left = rand(-15, 70) + "%";
        if (edge === "top") img.style.top = rand(-35, -25) + "%";
        else img.style.bottom = rand(-35, -25) + "%";
        img.style.setProperty("--rot", rand(-6, 6).toFixed(1) + "deg");
        img.style.setProperty("--sway", rand(8, 18).toFixed(0) + "px");
        img.style.animationDuration = rand(5, 8.5).toFixed(1) + "s";
        img.style.animationDelay = "-" + rand(0, 6).toFixed(1) + "s";
        img.style.opacity = rand(0.75, 1).toFixed(2);
        img.style.zIndex = Math.round(rand(1, 3));
        container.appendChild(img);
      }
    }
    fill(top, "top");
    fill(bottom, "bottom");
  })();

  /* ===================================================================
     6. COUNTDOWN
  =================================================================== */
  (function initCountdown() {
    var el = document.getElementById("countdown");
    if (!el) return;
    var target = new Date(el.getAttribute("data-target")).getTime();
    var dEl = document.getElementById("cdDays");
    var hEl = document.getElementById("cdHours");
    var mEl = document.getElementById("cdMinutes");
    var sEl = document.getElementById("cdSeconds");
    function pad(n) { return String(n).padStart(2, "0"); }
    function tick() {
      var diff = target - Date.now();
      if (diff < 0) diff = 0;
      var days = Math.floor(diff / 86400000);
      var hours = Math.floor((diff % 86400000) / 3600000);
      var mins = Math.floor((diff % 3600000) / 60000);
      var secs = Math.floor((diff % 60000) / 1000);
      if (dEl) dEl.textContent = pad(days);
      if (hEl) hEl.textContent = pad(hours);
      if (mEl) mEl.textContent = pad(mins);
      if (sEl) sEl.textContent = pad(secs);
    }
    tick();
    setInterval(tick, 1000);
  })();

  /* ===================================================================
     7. MAPS LINK — pastikan href = data-maps-url (gampang diedit HTML)
  =================================================================== */
  (function initMaps() {
    var link = document.getElementById("mapsLink");
    if (!link) return;
    var url = link.getAttribute("data-maps-url");
    if (url) link.setAttribute("href", url);
  })();

  /* ===================================================================
     8. CAROUSEL — panel 4
  =================================================================== */
  (function initCarousel() {
    var img = document.getElementById("carouselImg");
    var prev = document.getElementById("carPrev");
    var next = document.getElementById("carNext");
    var dotsWrap = document.getElementById("carDots");
    if (!img || !prev || !next) return;

    var total = 5;
    var index = 0;

    for (var i = 0; i < total; i++) {
      var dot = document.createElement("span");
      if (i === 0) dot.className = "is-active";
      dotsWrap.appendChild(dot);
    }
    var dots = dotsWrap.querySelectorAll("span");

    function render() {
      img.src = "assets/images/carousel-" + (index + 1) + ".webp";
      dots.forEach(function (d, i) { d.classList.toggle("is-active", i === index); });
    }
    prev.addEventListener("click", function () {
      index = (index - 1 + total) % total;
      render();
    });
    next.addEventListener("click", function () {
      index = (index + 1) % total;
      render();
    });

    // swipe kiri/kanan neng HP
    var startX = null;
    var frame = img.closest(".carousel");
    if (frame) {
      frame.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
      frame.addEventListener("touchend", function (e) {
        if (startX === null) return;
        var dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 40) { dx < 0 ? next.click() : prev.click(); }
        startX = null;
      }, { passive: true });
    }
  })();

  /* ===================================================================
     9. WISHES — kirim & tampil kanggo kabeh tamu (Firebase Firestore),
     tiba mode cadangan localStorage yen firebase-config durung diisi.
  =================================================================== */
  (function initWishes() {
    var wishForm = document.getElementById("wishForm");
    var wishList = document.getElementById("wishList");
    var wishEmpty = document.getElementById("wishEmpty");
    if (!wishForm || !wishList) return;

    function escapeHTML(str) {
      var div = document.createElement("div");
      div.textContent = str;
      return div.innerHTML;
    }

    function renderItem(item) {
      var el = document.createElement("div");
      el.className = "wish-item";
      el.innerHTML =
        '<div class="wish-item__top">' +
          '<p class="wish-item__name">' + escapeHTML(item.name) + '</p>' +
          '<button type="button" class="wish-item__delete" aria-label="Hapus ucapan">🗑</button>' +
        '</div>' +
        '<p class="wish-item__msg">' + escapeHTML(item.message) + '</p>';
      el.querySelector(".wish-item__delete").addEventListener("click", function () {
        handleDeleteRequest(item.id);
      });
      return el;
    }

    function renderList(items) {
      Array.prototype.slice.call(wishList.querySelectorAll(".wish-item")).forEach(function (el) { el.remove(); });
      if (!items.length) { if (wishEmpty) wishEmpty.style.display = ""; return; }
      if (wishEmpty) wishEmpty.style.display = "none";
      items.forEach(function (item) { wishList.appendChild(renderItem(item)); });
    }

    var hasFirebaseConfig =
      typeof INVITATION_CONFIG !== "undefined" &&
      typeof firebase !== "undefined" &&
      INVITATION_CONFIG.firebase &&
      INVITATION_CONFIG.firebase.apiKey;

    var wishStore;

    if (hasFirebaseConfig) {
      firebase.initializeApp(INVITATION_CONFIG.firebase);
      var db = firebase.firestore();
      var wishesCol = db.collection("invitations").doc(INVITATION_CONFIG.slug).collection("wishes");

      wishesCol.orderBy("createdAt", "desc").onSnapshot(
        function (snapshot) {
          var items = snapshot.docs.map(function (doc) {
            var d = doc.data();
            return { id: doc.id, name: d.name, message: d.message };
          });
          renderList(items);
        },
        function (err) { console.error("Firestore error:", err); }
      );

      wishStore = {
        add: function (name, message) {
          return wishesCol.add({
            name: name,
            message: message,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          });
        },
        remove: function (id) { return wishesCol.doc(id).delete(); }
      };
    } else {
      console.warn("Firebase durung dikonfigurasi — ucapan mung kesimpen lokal.");
      var STORAGE_KEY = "db-wedding-wishes";
      function loadLocal() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch (e) { return []; } }
      function saveLocal(list) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch (e) {} }
      renderList(loadLocal().slice().reverse());
      wishStore = {
        add: function (name, message) {
          var list = loadLocal();
          list.push({ id: "local-" + Date.now(), name: name, message: message });
          saveLocal(list);
          renderList(list.slice().reverse());
          return Promise.resolve();
        },
        remove: function (id) {
          var list = loadLocal().filter(function (w) { return w.id !== id; });
          saveLocal(list);
          renderList(list.slice().reverse());
          return Promise.resolve();
        }
      };
    }

    function handleDeleteRequest(id) {
      var code = window.prompt("Masukkan kode rahasia untuk menghapus ucapan ini:");
      if (code === null) return;
      var secret = (typeof INVITATION_CONFIG !== "undefined" && INVITATION_CONFIG.adminSecret) || "";
      if (code !== secret) { window.alert("Kode salah, ucapan tidak dihapus."); return; }
      wishStore.remove(id);
    }

    wishForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var nameInput = document.getElementById("wishName");
      var msgInput = document.getElementById("wishMessage");
      var name = nameInput.value.trim();
      var message = msgInput.value.trim();
      if (!name || !message) return;
      wishStore.add(name, message).catch(function (err) {
        console.error("Gagal mengirim ucapan:", err);
        window.alert("Maaf, ucapan gagal terkirim. Coba lagi, ya.");
      });
      wishForm.reset();
    });
  })();

  /* ===================================================================
     10. TUTUP UNDANGAN — mateni musik & bali neng cover (reload)
  =================================================================== */
  (function initClose() {
    var btn = document.getElementById("closeBox");
    if (!btn) return;
    btn.addEventListener("click", function () {
      if (bgm) bgm.pause();
      document.body.style.transition = "opacity .4s ease";
      document.body.style.opacity = "0";
      setTimeout(function () { window.location.reload(); }, 380);
    });
  })();

  /* ===================================================================
     11. SCROLL ENGINE — jantunge efek zoom-scroll
  =================================================================== */
  var PHASES = {
    s1Hold:   150,
    s1to2:    110,
    s2Hold:   150,
    s2to3:    110,
    s3Hold:   170,
    s3to4:    70,
    s4Hold:   140,
    s4to5:    70,
    s5Hold:   170,
    s5toClose:90,
    closeHold: 70
  };

  var a0 = 0;
  var a1 = a0 + PHASES.s1Hold;
  var a2 = a1 + PHASES.s1to2;
  var a3 = a2 + PHASES.s2Hold;
  var a4 = a3 + PHASES.s2to3;
  var a5 = a4 + PHASES.s3Hold;
  var a6 = a5 + PHASES.s3to4;
  var a7 = a6 + PHASES.s4Hold;
  var a8 = a7 + PHASES.s4to5;
  var a9 = a8 + PHASES.s5Hold;
  var a10 = a9 + PHASES.s5toClose;
  var a11 = a10 + PHASES.closeHold;
  var TOTAL_VH = a11;

  var scrollTrack = document.getElementById("scrollTrack");
  var scene1 = document.getElementById("scene1");
  var scene2 = document.getElementById("scene2");
  var batikZone = document.getElementById("batikZone");
  var panel3 = document.getElementById("panel3");
  var panel4 = document.getElementById("panel4");
  var panel5 = document.getElementById("panel5");
  var panelClose = document.getElementById("panelClose");
  var megaTop = document.getElementById("megaTop");
  var megaBottom = document.getElementById("megaBottom");

  var ayatBlock = document.getElementById("ayatBlock");
  var scene2Names = document.querySelector("#scene2 .scene2__names");
  var panel3Inner = document.getElementById("panel3Inner");
  var panel4Inner = document.getElementById("panel4Inner");
  var panel5Inner = document.getElementById("panel5Inner");
  var panelCloseInner = document.getElementById("panelCloseInner");

  var hint1 = document.getElementById("scrollHint1");
  var hint2 = document.getElementById("scrollHint2");
  var hint3 = document.getElementById("scrollHint3");
  var hint4 = document.getElementById("scrollHint4");
  var hint5 = document.getElementById("scrollHint5");

  function setTrackHeight() {
    scrollTrack.style.height = (TOTAL_VH + 100) + "vh";
  }
  setTrackHeight();
  window.addEventListener("resize", setTrackHeight);

  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function t(start, end, v) { return clamp01((v - start) / (end - start)); }

  function setPanel(el, opacity) {
    el.style.opacity = opacity;
    el.classList.toggle("is-active", opacity > 0.55);
  }

  /* Toggle .is-visible ing kabeh .reveal-seq njero container (utawa
     container dhewe yen dheweke pancen .reveal-seq) — dienggo kanggo
     animasi fade-in/out sing "resik" saben ganti scene. */
  function setGroupVisible(container, visible) {
    if (!container) return;
    var items = container.classList.contains("reveal-seq")
      ? [container]
      : container.querySelectorAll(".reveal-seq");
    for (var i = 0; i < items.length; i++) {
      items[i].classList.toggle("is-visible", visible);
    }
  }

  function setHintVisible(el, visible) {
    if (!el) return;
    el.classList.toggle("is-visible", visible);
  }

  var scene1TextWasVisible = false;

  function render(v) {

    /* ---- Scene 1 -> 2 (zoom neng figura foto) ---- */
    var t12 = t(a1, a2, v);
    var s1Scale = 1 + t12 * 3.6;
    var s1Opacity = t12 < 0.55 ? 1 : 1 - (t12 - 0.55) / 0.45;
    scene1.style.transform = "scale(" + s1Scale.toFixed(3) + ")";
    scene1.style.opacity = Math.max(0, s1Opacity).toFixed(3);

    var s2Scale = 1.32 - 0.32 * clamp01((t12 - 0.25) / 0.75);
    var s2Opacity = t12 < 0.35 ? 0 : (t12 - 0.35) / 0.65;
    scene2.style.transform = "scale(" + s2Scale.toFixed(3) + ")";
    scene2.style.opacity = clamp01(s2Opacity).toFixed(3);

    /* ---- Scene 2 -> batikZone (zoom neng tembok maroon) ---- */
    var t23 = t(a3, a4, v);
    if (v >= a2) {
      var s2ScaleOut = 1 + t23 * 2.8;
      var s2OpacityOut = t23 < 0.55 ? 1 : 1 - (t23 - 0.55) / 0.45;
      scene2.style.transform = "scale(" + s2ScaleOut.toFixed(3) + ")";
      scene2.style.opacity = Math.max(0, s2OpacityOut).toFixed(3);
    }

    var bzScale = 1.3 - 0.3 * clamp01((t23 - 0.25) / 0.75);
    var bzOpacity = v < a3 ? 0 : (t23 < 0.35 ? 0 : (t23 - 0.35) / 0.65);
    batikZone.style.transform = "scale(" + bzScale.toFixed(3) + ")";
    batikZone.style.opacity = clamp01(bzOpacity).toFixed(3);

    /* z-index safety: sembunyikake scene sing wis kliwat supaya ora
       nyegat klik/tap sing durung dibutuhke */
    scene1.style.pointerEvents = v < a2 ? "auto" : "none";
    scene2.style.pointerEvents = (v >= a1 && v < a4) ? "auto" : "none";

    /* ---- Panel 3 / 4 / 5 / penutup (fade dalam batikZone sing tetep) ---- */
    var t34 = t(a5, a6, v);
    var t45 = t(a7, a8, v);
    var t5c = t(a9, a10, v);

    var op3, op4, op5, opC;

    if (v < a3) op3 = 0;
    else if (v < a4) op3 = t23;
    else if (v < a5) op3 = 1;
    else if (v < a6) op3 = 1 - t34;
    else op3 = 0;

    if (v < a5) op4 = 0;
    else if (v < a6) op4 = t34;
    else if (v < a7) op4 = 1;
    else if (v < a8) op4 = 1 - t45;
    else op4 = 0;

    if (v < a7) op5 = 0;
    else if (v < a8) op5 = t45;
    else if (v < a9) op5 = 1;
    else if (v < a10) op5 = 1 - t5c;
    else op5 = 0;

    if (v < a9) opC = 0;
    else if (v < a10) opC = t5c;
    else opC = 1;

    setPanel(panel3, clamp01(op3));
    setPanel(panel4, clamp01(op4));
    setPanel(panel5, clamp01(op5));
    setPanel(panelClose, clamp01(opC));

    /* ---- Mega mendung fade + drift pas nutup ---- */
    var cloudOpacity = v < a4 ? 0 : (v <= a9 ? 1 : clamp01(1 - t5c));
    megaTop.style.opacity = cloudOpacity.toFixed(3);
    megaBottom.style.opacity = cloudOpacity.toFixed(3);
    megaTop.style.transform = "translateY(" + (-30 * (1 - cloudOpacity)).toFixed(1) + "px)";
    megaBottom.style.transform = "translateY(" + (30 * (1 - cloudOpacity)).toFixed(1) + "px)";

    /* =================================================================
       TEXT FADE IN/OUT — saben scene "kosong dhisik", teks muncul
       elegan, banjur ilang elegan sadurunge zoom/transisi sabanjure.
       Nganggo jendhela [enter, exit) supaya mlaku bener nalika discroll
       mundur (reverse) uga.
    ================================================================= */
    var scene1TextVisible = coverOpened && v >= a0 && v < (a1 - 34);
    setGroupVisible(ayatBlock, scene1TextVisible);

    if (scene1TextVisible && !scene1TextWasVisible) {
      if (bgm && !bgm.paused) startNotes();
    } else if (!scene1TextVisible && scene1TextWasVisible) {
      stopNotes();
    }
    scene1TextWasVisible = scene1TextVisible;

    var scene2TextVisible = v >= (a2 + 6) && v < (a3 - 26);
    setGroupVisible(scene2Names, scene2TextVisible);

    var panel3TextVisible = v >= (a4 + 18) && v < (a5 - 18);
    setGroupVisible(panel3Inner, panel3TextVisible);

    var panel4TextVisible = v >= (a6 + 12) && v < (a7 - 12);
    setGroupVisible(panel4Inner, panel4TextVisible);

    var panel5TextVisible = v >= (a8 + 18) && v < (a9 - 18);
    setGroupVisible(panel5Inner, panel5TextVisible);

    var panelCloseTextVisible = v >= (a10 + 10);
    setGroupVisible(panelCloseInner, panelCloseTextVisible);

    /* ---- petunjuk scroll (ikon mouse) ---- */
    setHintVisible(hint1, coverOpened && v >= a0 && v < (a1 - 10));
    setHintVisible(hint2, v >= (a2 + 4) && v < (a3 - 10));
    setHintVisible(hint3, v >= (a4 + 10) && v < (a5 - 10));
    setHintVisible(hint4, v >= (a6 + 6) && v < (a7 - 10));
    setHintVisible(hint5, v >= (a8 + 10) && v < (a9 - 10));
  }

  /* ---- rAF loop karo "lerp" supaya animasi zoom luwih alus (ora
     mentah 1:1 karo scroll, tapi nyusul kanthi easing) ---- */
  var currentVh = 0;
  var targetVh = 0;

  function computeTargetVh() {
    var trackTop = scrollTrack.offsetTop;
    var vhPx = window.innerHeight;
    var y = window.scrollY - trackTop;
    return clamp01(y / vhPx / (TOTAL_VH / 100)) * TOTAL_VH;
  }

  function loop() {
    targetVh = computeTargetVh();
    var diff = targetVh - currentVh;
    if (Math.abs(diff) > 0.015) {
      currentVh += diff * 0.15;
    } else {
      currentVh = targetVh;
    }
    render(currentVh);
    requestAnimationFrame(loop);
  }

  function renderNow() {
    currentVh = computeTargetVh();
    render(currentVh);
  }

  requestAnimationFrame(loop);
  render(0);

})();
