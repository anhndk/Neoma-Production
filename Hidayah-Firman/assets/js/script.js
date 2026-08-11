(function () {
  "use strict";

  /* =====================================================
     ⚙️ KONFIGURASI GAMPANGAN — EDIT NENG KENE WAE

     fireflies.enabled : false = mateni efek kunang-kunang total
     reveal.enabled     : false = mateni animasi fade-in pas discroll
     reveal.repeat       : true  = animasi mbaleni saben elemen
                            mlebu-metu layar (default: sepisan wae,
                            luwih elegan lan ora ngganggu)
  ===================================================== */
  var CONFIG = {
    fireflies: {
      enabled: true,
      count: 22,          // jumlah kunang-kunang
      minSize: 2,          // px, ukuran paling cilik
      maxSize: 5,          // px, ukuran paling gedhe
      minDuration: 9,       // detik, siji putaran mabur paling cepet
      maxDuration: 18,      // detik, siji putaran mabur paling alon
      minOpacity: 0.45,
      maxOpacity: 0.9,
      driftRange: 70         // px, sepira adohe mabur seko titik awal
    },
    reveal: {
      enabled: true,
      repeat: false
    }
  };

  /* =====================================================
     1. GUEST NAME FROM LINK  (?to=Nama+Tamu)
  ===================================================== */
  var params = new URLSearchParams(window.location.search);
  var guestRaw = params.get("to") || params.get("kepada");
  var guestNameEl = document.getElementById("guestName");
  if (guestRaw && guestNameEl) {
    var cleaned = decodeURIComponent(guestRaw).replace(/\+/g, " ").trim();
    if (cleaned) guestNameEl.textContent = cleaned;
  }
  document.title = guestRaw
    ? "Undangan Pernikahan Hidayah & Firman - " + guestNameEl.textContent
    : document.title;

  /* =====================================================
     2. COVER REVEAL + MUSIC TRIGGER
  ===================================================== */
  var cover = document.getElementById("cover");
  var openBtn = document.getElementById("openBtn");
  var app = document.getElementById("app");
  var music = document.getElementById("bgMusic");
  var soundToggle = document.getElementById("soundToggle");

  function tryPlayMusic() {
    if (!music) return;
    var p = music.play();
    if (p && p.catch) {
      p.catch(function () {
        // Autoplay blocked or no audio file present yet — that's fine,
        // the sound toggle button lets the guest start it manually.
      });
    }
  }

  openBtn.addEventListener("click", function () {
    document.body.style.overflow = "";
    cover.classList.add("is-open");
    app.hidden = false;
    tryPlayMusic();
    window.scrollTo({ top: 0 });
    // Hero section langsung katon pas undangan dibukak, dadi elemen
    // "reveal" ing kono di-tampilke langsung — ora nunggu di-scroll.
    if (window.__revealHero) window.__revealHero();
    setTimeout(function () {
      cover.remove();
    }, 950);
  });

  soundToggle.addEventListener("click", function () {
    if (!music) return;
    if (music.paused) {
      tryPlayMusic();
      soundToggle.classList.remove("is-muted");
    } else {
      music.pause();
      soundToggle.classList.add("is-muted");
    }
  });

  /* lock scroll while cover is showing */
  document.body.style.overflow = "hidden";

  /* =====================================================
     3. COUNTDOWN
  ===================================================== */
  var countdownEl = document.getElementById("countdown");
  var targetRaw = (countdownEl && countdownEl.dataset.target) || "2026-09-06T07:00:00+07:00";
  var target = new Date(targetRaw).getTime();
  var elDays = document.getElementById("cd-days");
  var elHours = document.getElementById("cd-hours");
  var elMins = document.getElementById("cd-mins");
  var elSecs = document.getElementById("cd-secs");

  function pad(n) { return String(n).padStart(2, "0"); }

  function tickCountdown() {
    var diff = target - Date.now();
    if (diff <= 0) {
      elDays.textContent = elHours.textContent = elMins.textContent = elSecs.textContent = "00";
      return;
    }
    var d = Math.floor(diff / 86400000);
    var h = Math.floor((diff % 86400000) / 3600000);
    var m = Math.floor((diff % 3600000) / 60000);
    var s = Math.floor((diff % 60000) / 1000);
    elDays.textContent = pad(d);
    elHours.textContent = pad(h);
    elMins.textContent = pad(m);
    elSecs.textContent = pad(s);
  }
  if (elDays) {
    tickCountdown();
    setInterval(tickCountdown, 1000);
  }

  /* =====================================================
     4. GOOGLE MAPS LINK (search query, no embed needed)
  ===================================================== */
  var mapsLink = document.getElementById("mapsLink");
  if (mapsLink) {
    var mapsUrl = mapsLink.dataset.mapsUrl;
    var address = mapsLink.dataset.address || "";
    mapsLink.href = mapsUrl
      ? mapsUrl
      : "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(address);
  }

  /* =====================================================
     5. GALLERY CAROUSEL — autoplay every 2s, swipeable/draggable
  ===================================================== */
  var track = document.getElementById("carouselTrack");
  var dotsWrap = document.getElementById("carouselDots");
  var prevBtn = document.getElementById("carouselPrev");
  var nextBtn = document.getElementById("carouselNext");

  if (track) {
    var slides = Array.prototype.slice.call(track.children);
    var index = 0;
    var autoplayId = null;
    var AUTOPLAY_MS = 2000;

    slides.forEach(function (_, i) {
      var dot = document.createElement("span");
      if (i === 0) dot.classList.add("is-active");
      dot.addEventListener("click", function () { goTo(i); restartAutoplay(); });
      dotsWrap.appendChild(dot);
    });
    var dots = Array.prototype.slice.call(dotsWrap.children);

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      track.scrollTo({ left: track.clientWidth * index, behavior: "smooth" });
      dots.forEach(function (d, di) { d.classList.toggle("is-active", di === index); });
    }

    function startAutoplay() {
      autoplayId = setInterval(function () { goTo(index + 1); }, AUTOPLAY_MS);
    }
    function stopAutoplay() { clearInterval(autoplayId); }
    function restartAutoplay() { stopAutoplay(); startAutoplay(); }

    prevBtn.addEventListener("click", function () { goTo(index - 1); restartAutoplay(); });
    nextBtn.addEventListener("click", function () { goTo(index + 1); restartAutoplay(); });

    // update active dot on manual scroll/swipe
    var scrollTimeout;
    track.addEventListener("scroll", function () {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(function () {
        var i = Math.round(track.scrollLeft / track.clientWidth);
        index = i;
        dots.forEach(function (d, di) { d.classList.toggle("is-active", di === i); });
      }, 90);
    });

    // pause autoplay while the user is actively interacting
    track.addEventListener("pointerdown", stopAutoplay);
    track.addEventListener("pointerup", restartAutoplay);
    track.addEventListener("mouseenter", stopAutoplay);
    track.addEventListener("mouseleave", startAutoplay);

    window.addEventListener("resize", function () { goTo(index); });

    startAutoplay();
  }

  /* =====================================================
     6. WISHES — submit & render instantly, saved on this device
  ===================================================== */
  var wishForm = document.getElementById("wishForm");
  var wishList = document.getElementById("wishList");
  var wishEmpty = document.getElementById("wishEmpty");
  var STORAGE_KEY = "hf-wedding-wishes";

  function loadWishes() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) { return []; }
  }
  function saveWishes(list) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch (e) {}
  }
  function escapeHTML(str) {
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }
  function renderWish(item, prepend) {
    wishEmpty.style.display = "none";
    var el = document.createElement("div");
    el.className = "wish-item";
    el.innerHTML =
      '<p class="wish-item__name">' + escapeHTML(item.name) + '</p>' +
      '<p class="wish-item__msg">' + escapeHTML(item.message) + '</p>';
    if (prepend) wishList.insertBefore(el, wishList.firstChild);
    else wishList.appendChild(el);
  }

  var existingWishes = loadWishes();
  if (existingWishes.length) {
    existingWishes.slice().reverse().forEach(function (w) { renderWish(w, false); });
  }

  if (wishForm) {
    wishForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var nameInput = document.getElementById("wishName");
      var msgInput = document.getElementById("wishMessage");
      var name = nameInput.value.trim();
      var message = msgInput.value.trim();
      if (!name || !message) return;

      var item = { name: name, message: message, ts: Date.now() };
      var list = loadWishes();
      list.push(item);
      saveWishes(list);
      renderWish(item, true);

      wishForm.reset();
      nameInput.focus();
    });
  }

  /* =====================================================
     7. BOTTOM NAV — active state + scroll spy
  ===================================================== */
  var navItems = Array.prototype.slice.call(document.querySelectorAll(".nav-item"));
  var indicator = document.getElementById("navIndicator");
  var sections = navItems.map(function (item) {
    return document.getElementById(item.dataset.target);
  });

  function setActive(idx) {
    navItems.forEach(function (it, i) { it.classList.toggle("is-active", i === idx); });
    if (indicator) indicator.style.transform = "translateX(" + (idx * 100) + "%)";
  }

  navItems.forEach(function (item, i) {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      var target = sections[i];
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var idx = sections.indexOf(entry.target);
            if (idx > -1) setActive(idx);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (s) { if (s) observer.observe(s); });
  }

  setActive(0);

  /* =====================================================
     8. SCROLL REVEAL — fade-in elegan pas elemen mlebu layar
     (arah lan delay-e diatur langsung neng class HTML, tuku
     assets/css/style.css bagian "SCROLL REVEAL" kanggo daftar
     class sing kesedhiya)
  ===================================================== */
  (function initReveal() {
    var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
    if (!revealEls.length) return;

    // dimatèni lewat CONFIG, utawa browser ora support -> langsung
    // tampilke kabeh tanpa animasi (aman, ora ana konten sing ilang)
    if (!CONFIG.reveal.enabled || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            if (!CONFIG.reveal.repeat) observer.unobserve(entry.target);
          } else if (CONFIG.reveal.repeat) {
            entry.target.classList.remove("is-visible");
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el) { observer.observe(el); });

    // dipanggil seko tombol "Buka Undangan" (bagian 2 ing dhuwur),
    // sebab hero section wis langsung katon pas cover dibukak —
    // IntersectionObserver ora mesthi langsung nyekel elemen sing
    // sadurunge ndhelik jero <div hidden>.
    window.__revealHero = function () {
      document.querySelectorAll("#beranda .reveal").forEach(function (el) {
        el.classList.add("is-visible");
        if (!CONFIG.reveal.repeat) observer.unobserve(el);
      });
    };
  })();

  /* =====================================================
     9. KUNANG-KUNANG — efek partikel mabur alon neng background
  ===================================================== */
  (function initFireflies() {
    var c = CONFIG.fireflies;
    var holder = document.getElementById("fireflies");
    if (!c.enabled || !holder) return;

    function rand(min, max) { return Math.random() * (max - min) + min; }

    var frag = document.createDocumentFragment();
    for (var i = 0; i < c.count; i++) {
      var el = document.createElement("span");
      el.className = "firefly";
      var duration = rand(c.minDuration, c.maxDuration);
      el.style.setProperty("--fx", rand(0, 100) + "vw");
      el.style.setProperty("--fy", rand(0, 100) + "vh");
      el.style.setProperty("--fsize", rand(c.minSize, c.maxSize).toFixed(1) + "px");
      el.style.setProperty("--fduration", duration.toFixed(1) + "s");
      // delay negatif ben pas kaca dibukak kunang-kunange wis
      // ana sing ing tengah-tengah putaran (ora mencolot bareng)
      el.style.setProperty("--fdelay", (-rand(0, duration)).toFixed(1) + "s");
      el.style.setProperty("--fopacity", rand(c.minOpacity, c.maxOpacity).toFixed(2));
      el.style.setProperty("--fdrift-x", rand(-c.driftRange, c.driftRange).toFixed(0) + "px");
      el.style.setProperty("--fdrift-y", rand(c.driftRange * 0.4, c.driftRange).toFixed(0) + "px");
      frag.appendChild(el);
    }
    holder.appendChild(frag);
  })();
})();
