/* =========================================================================
   UNDANGAN WEB — Promo 2
   Isi: viewport, builder SVG animasi (corner, gunungan, aksen, frame),
   scene manager (cover -> S1..S5), carousel, countdown, ucapan (Firebase), musik.
   Konfigurasi neng assets/js/config.js, SVG embed neng assets/js/art.js.
   ========================================================================= */
(function () {
  'use strict';

  var CFG = window.INVITATION_CONFIG || {};
  var ART = window.ART || {};
  var NS = 'http://www.w3.org/2000/svg';
  var REDUCED = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var GOLD = '#B89B54';
  var EASE = 'cubic-bezier(.22,.8,.24,1)';

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function clamp(v, a, b) { a = a === undefined ? 0 : a; b = b === undefined ? 1 : b; return Math.min(b, Math.max(a, v)); }
  function eio(u) { return .5 * (1 - Math.cos(Math.PI * clamp(u))); }
  function eout(u) { return 1 - Math.pow(1 - clamp(u), 3); }
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, REDUCED ? Math.min(ms, 20) : ms); }); }
  function dur(ms) { return REDUCED ? 1 : ms; }
  function mk(tag, attrs) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); return e; }
  function parseSvg(str) { return new DOMParser().parseFromString(str, 'image/svg+xml').documentElement; }
  function shapes(root, sel) { return Array.prototype.slice.call(root.querySelectorAll(sel || 'path,polygon')); }
  /* teks undangan dijupuk seko config.js (data-t="path.teks") */
  (function applyText() {
    var T = CFG.teks; if (!T) return;
    $$('[data-t]').forEach(function (el) {
      var v = el.getAttribute('data-t').split('.').reduce(function (o, k) { return o == null ? o : o[k]; }, T);
      if (typeof v !== 'string') return;
      el.textContent = '';
      v.split('\n').forEach(function (line, i) { if (i) el.appendChild(document.createElement('br')); el.appendChild(document.createTextNode(line)); });
    });
  })();
  var frameEl = $('#frame');
  function U() { return Math.min(frameEl.clientWidth, frameEl.clientHeight * .5625) / 100; }

  /* ---------- tinggi layar stabil (keyboard ora ngrusak layout) ---------- */
  var rootEl = document.documentElement;
  function typing() { var a = document.activeElement; return a && /^(INPUT|TEXTAREA)$/.test(a.tagName); }
  function setH() { if (typing()) return; rootEl.style.setProperty('--H', window.innerHeight + 'px'); }
  setH();
  window.addEventListener('resize', setH);
  window.addEventListener('orientationchange', function () { setTimeout(setH, 350); });
  document.addEventListener('focusout', function () { setTimeout(setH, 350); });

  /* =====================================================================
     1. BUILDER SVG
  ===================================================================== */
  var uid = 0;
  var cache = {};
  var meas = mk('svg', { style: 'position:absolute;left:0;top:0;width:10px;height:10px;visibility:hidden;pointer-events:none' });
  document.body.appendChild(meas);

  function softGrad(defs, id) {
    var rg = mk('radialGradient', { id: id, cx: .5, cy: .5, r: .5 });
    [[0, '#fff'], [.93, '#fff'], [1, '#000']].forEach(function (s) { rg.appendChild(mk('stop', { offset: s[0], 'stop-color': s[1] })); });
    defs.appendChild(rg);
  }

  /* ----- corner (draw dari pojok, podo corner_animasi.html) ----- */
  function cornerParams() {
    if (cache.cp) return cache.cp;
    var src = parseSvg(ART.corner), vb = src.getAttribute('viewBox').split(/\s+/).map(Number);
    var KX = vb[2], KY = 0, B_T0 = .3, B_D = 4.2, B_R = 17.6;
    function tB(d) { return B_T0 + B_D * Math.acos(1 - 2 * clamp(d / B_R)) / Math.PI; }
    var els = shapes(src), items = [], T = 0;
    els.forEach(function (el) {
      if (el.tagName === 'polygon') { items.push({ border: true }); return; }
      var c = el.cloneNode(true); meas.appendChild(c);
      var b = c.getBBox(), L = c.getTotalLength(), a = null, best = 1e9, i, q, d;
      for (i = 0; i <= 40; i++) { q = c.getPointAtLength(L * i / 40); d = Math.hypot(q.x - KX, q.y - KY); if (d < best) { best = d; a = q; } }
      var R = 0;
      [b.x, b.x + b.width].forEach(function (x) { [b.y, b.y + b.height].forEach(function (y) { R = Math.max(R, Math.hypot(x - a.x, y - a.y)); }); });
      R += .3;
      var start = tB(best) + .15, dd = 1.2 + R * .45;
      T = Math.max(T, start + dd);
      items.push({ ax: a.x, ay: a.y, R: R, start: start, dur: dd });
      meas.removeChild(c);
    });
    cache.cp = { vb: vb, KX: KX, KY: KY, B_T0: B_T0, B_D: B_D, B_R: B_R, items: items, T: T + .6, els: els, root: src };
    return cache.cp;
  }
  function buildCorner(color, animated) {
    var P = cornerParams(), svg = mk('svg', { viewBox: P.vb.join(' '), 'fill-rule': 'evenodd', 'clip-rule': 'evenodd' });
    var id = 'k' + (++uid), circles = [], defs;
    if (animated) { defs = mk('defs'); svg.appendChild(defs); }
    P.els.forEach(function (el, i) {
      var c = el.cloneNode(true); c.setAttribute('fill', color);
      if (animated) {
        var it = P.items[i], m = mk('clipPath', { id: 'm' + id + i });
        var ci = mk('circle', { cx: it.border ? P.KX : it.ax, cy: it.border ? P.KY : it.ay, r: .001 });
        m.appendChild(ci); defs.appendChild(m); c.setAttribute('clip-path', 'url(#m' + id + i + ')'); circles[i] = ci;
      }
      svg.appendChild(c);
    });
    var last = [];
    function update(t) {
      for (var i = 0; i < circles.length; i++) {
        var it = P.items[i], r = Math.max(.001, it.border ? P.B_R * eio((t - P.B_T0) / P.B_D) : eout((t - it.start) / it.dur) * it.R);
        if (last[i] !== undefined && Math.abs(r - last[i]) < .004) continue;
        last[i] = r; circles[i].setAttribute('r', r);
      }
    }
    return { svg: svg, update: update, T: P.T };
  }

  /* ----- gunungan (morph, podo gunungan_animasi.html) ----- */
  function gnParams() {
    if (cache.gp) return cache.gp;
    var src = parseSvg(ART.gunungan), els = shapes(src), CX = 4.81;
    var frame = els.filter(function (e) { return e.tagName === 'path'; })[0];
    var polys = els.filter(function (e) { return e.tagName === 'polygon'; });
    var pcs = els.filter(function (e) { return e.tagName === 'path' && e !== frame; });
    var STEM_T0 = 1.3, STEM_D = 3.8;
    function tStem(y) { var p = clamp((13.88 - y) / 13.5); return STEM_T0 + STEM_D * Math.acos(1 - 2 * p) / Math.PI; }
    var items = [], T = 0;
    pcs.forEach(function (el) {
      var c = el.cloneNode(true); meas.appendChild(c);
      var b = c.getBBox(), L = c.getTotalLength(), a = { x: 99, y: 0 }, i, q;
      for (i = 0; i <= 40; i++) { q = c.getPointAtLength(L * i / 40); if (Math.abs(q.x - CX) < Math.abs(a.x - CX)) a = q; }
      var R = 0;
      [b.x, b.x + b.width].forEach(function (x) { [b.y, b.y + b.height].forEach(function (y) { R = Math.max(R, Math.hypot(x - a.x, y - a.y)); }); });
      R += .3;
      var start = tStem(a.y) + .15 + .5 * Math.abs(a.x - CX), dd = 1.2 + R * .4;
      T = Math.max(T, start + dd);
      items.push({ ax: a.x, ay: a.y, R: R, start: start, dur: dd });
      meas.removeChild(c);
    });
    cache.gp = { vb: src.getAttribute('viewBox'), CX: CX, frame: frame, polys: polys, pcs: pcs, items: items, T: T + .6, STEM_T0: STEM_T0, STEM_D: STEM_D };
    return cache.gp;
  }
  function buildGunungan(color) {
    var P = gnParams(), svg = mk('svg', { viewBox: P.vb, 'fill-rule': 'evenodd' }), id = 'g' + (++uid), defs = mk('defs');
    svg.appendChild(defs);
    var mF = mk('clipPath', { id: 'mf' + id }), cF = mk('circle', { cx: P.CX, cy: 14.1, r: .001 });
    mF.appendChild(cF); defs.appendChild(mF);
    var mS = mk('clipPath', { id: 'ms' + id }), rS = mk('rect', { x: 4, y: 14, width: 2, height: 16 });
    mS.appendChild(rS); defs.appendChild(mS);
    var f = P.frame.cloneNode(true); f.setAttribute('fill', color); f.setAttribute('clip-path', 'url(#mf' + id + ')'); svg.appendChild(f);
    var g = mk('g', { 'clip-path': 'url(#ms' + id + ')' });
    P.polys.forEach(function (p) { var c = p.cloneNode(true); c.setAttribute('fill', color); g.appendChild(c); });
    svg.appendChild(g);
    var circles = P.pcs.map(function (el, i) {
      var c = el.cloneNode(true); c.setAttribute('fill', color);
      var m = mk('clipPath', { id: 'mp' + id + i }), ci = mk('circle', { cx: P.items[i].ax, cy: P.items[i].ay, r: .001 });
      m.appendChild(ci); defs.appendChild(m); c.setAttribute('clip-path', 'url(#mp' + id + i + ')'); svg.appendChild(c); return ci;
    });
    var last = [];
    function update(t) {
      cF.setAttribute('r', Math.max(.001, eio((t - .3) / 3.6) * 15.2));
      rS.setAttribute('y', 13.95 - 13.6 * eio((t - P.STEM_T0) / P.STEM_D));
      for (var i = 0; i < circles.length; i++) {
        var r = Math.max(.001, eout((t - P.items[i].start) / P.items[i].dur) * P.items[i].R);
        if (last[i] !== undefined && Math.abs(r - last[i]) < .004) continue;
        last[i] = r; circles[i].setAttribute('r', r);
      }
    }
    update(0);
    return { svg: svg, update: update, T: P.T };
  }

  /* ----- aksen / frame: garis digambar (stroke draw) ----- */
  function buildStroke(key) {
    var svg = document.importNode(parseSvg(ART[key]), true);
    var lines = shapes(svg, 'line'), paths = shapes(svg, 'path,polygon'), anims = [];
    function reset() {
      anims.forEach(function (a) { try { a.cancel(); } catch (e) { } }); anims = [];
      paths.forEach(function (p) { p.setAttribute('pathLength', '1'); p.style.strokeDasharray = '1'; p.style.strokeDashoffset = '1'; });
      lines.forEach(function (l) { l.style.transformBox = 'fill-box'; l.style.transformOrigin = 'center'; l.style.transform = 'scaleX(0)'; });
    }
    reset();
    function play(delay, set, speed) {
      speed = speed || 1; delay = delay || 0; var out = [];
      function reg(a, fin) { anims.push(a); out.push(a); if (set) set.add(a); a.finished.then(function () { fin(); a.cancel(); }).catch(function () { }); }
      lines.forEach(function (l, i) {
        reg(l.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: dur(1500 / speed), delay: delay + i * 250, easing: 'cubic-bezier(.3,.7,.2,1)', fill: 'both' }),
          function () { l.style.transform = 'none'; });
      });
      var n = paths.length;
      paths.forEach(function (p, i) {
        var border = key === 'frame' && i === n - 1;
        reg(p.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: dur((border ? 2600 : 1500) / speed), delay: delay + (border ? 0 : 350 + i * 160), easing: border ? 'cubic-bezier(.45,.05,.25,1)' : 'ease-in-out', fill: 'both' }),
          function () { p.style.strokeDashoffset = '0'; p.style.strokeDasharray = 'none'; });
      });
      return out;
    }
    return { svg: svg, play: play, reset: reset };
  }

  /* =====================================================================
     2. HELPER ANIMASI
  ===================================================================== */
  var enterSet = new Set(), enterFinishers = [];
  function rev(el, o, set) {
    o = o || {};
    var u = U(), y = (o.y === undefined ? 2 : o.y) * u, x = (o.x || 0) * u, s = o.s || 1;
    el.style.opacity = '0';
    var a = el.animate([
      { opacity: 0, transform: 'translate(' + x + 'px,' + y + 'px) scale(' + s + ')' },
      { opacity: 1, transform: 'translate(0,0) scale(1)' }
    ], { duration: dur(o.t || 600), delay: o.d || 0, easing: o.ease || 'cubic-bezier(.2,.8,.2,1)', fill: 'both' });
    (set || enterSet).add(a);
    a.finished.then(function () { el.style.opacity = ''; a.cancel(); }).catch(function () { });
    return a;
  }
  function hid(els, o) {
    o = o || {};
    var y = (o.y || 0) * U();
    return Promise.all(els.map(function (el) {
      var a = el.animate([
        { opacity: 1, transform: 'translate(0,0)' },
        { opacity: 0, transform: 'translate(0,' + y + 'px)' }
      ], { duration: dur(o.t || 380), easing: 'ease-in', fill: 'forwards' });
      return a.finished.then(function () { el.style.opacity = '0'; a.cancel(); }).catch(function () { });
    }));
  }
  function waitAll(set) {
    return Promise.all(Array.from(set).map(function (a) { return a.finished.catch(function () { }); }));
  }
  function raf(fn) { var id, stopped = false; function loop(now) { if (stopped) return; if (fn(now) !== false) id = requestAnimationFrame(loop); } id = requestAnimationFrame(loop); return function () { stopped = true; cancelAnimationFrame(id); }; }

  /* ---------- corner section (fly in / fly out) ---------- */
  var cornerEls = {}, cornerAnims = [];
  ['tl', 'tr', 'bl', 'br'].forEach(function (k) {
    var el = $('#corners .corner.' + k); cornerEls[k] = el;
    el.appendChild(buildCorner(GOLD, false).svg); el.style.opacity = '0';
  });
  function cornersFly(dir) {
    var off = 42 * U(), vec = { tl: [-1, -1], tr: [1, -1], bl: [-1, 1], br: [1, 1] }, lag = { tr: 0, tl: 40, br: 80, bl: 120 }, out = [];
    cornerAnims.forEach(function (a) { try { a.cancel(); } catch (e) { } }); cornerAnims = [];
    var isIn = dir === 'in';
    Object.keys(cornerEls).forEach(function (k) {
      var far = 'translate(' + vec[k][0] * off + 'px,' + vec[k][1] * off + 'px)', near = 'translate(0,0)';
      var a = cornerEls[k].animate(isIn ? [{ transform: far, opacity: 0 }, { transform: near, opacity: 1 }] : [{ transform: near, opacity: 1 }, { transform: far, opacity: 0 }],
        { duration: dur(isIn ? 850 : 400), delay: isIn ? lag[k] : 0, easing: isIn ? 'cubic-bezier(.16,1,.3,1)' : 'cubic-bezier(.5,0,.9,.5)', fill: 'both' });
      cornerAnims.push(a); out.push(a);
      if (isIn) enterSet.add(a);
    });
    return Promise.all(out.map(function (a) { return a.finished.catch(function () { }); }));
  }

  /* =====================================================================
     3. BACKGROUND, NAV, MUSIK
  ===================================================================== */
  var bgEl = $('#bg');
  function setBg(mode) { bgEl.classList.toggle('light', mode === 'light'); document.body.classList.toggle('dark', mode !== 'light'); }
  var tabs = $$('#nav .tab'), ind = $('#ind'), navI = -1, navT;
  function posI(i) { return 'calc(var(--pad) + ' + i + '*(var(--cell) + var(--gap)))'; }
  function setNav(n) {
    tabs.forEach(function (b, i) { b.classList.toggle('act', i + 1 === n); });
    var a = navI, i = n - 1; navI = i; clearTimeout(navT);
    if (a < 0) { ind.style.transition = 'none'; ind.style.left = posI(i); ind.style.width = 'var(--cell)'; void ind.offsetWidth; ind.style.transition = ''; return; }
    ind.style.width = 'calc(' + Math.abs(i - a) + '*(var(--cell) + var(--gap)) + var(--cell))';
    ind.style.left = posI(Math.min(i, a));
    navT = setTimeout(function () { ind.style.left = posI(i); ind.style.width = 'var(--cell)'; }, 140);
  }

  var audio = $('#bgm'), mtog = $('#mtog'), musicOn = true;
  function setM(on) { musicOn = !!on; mtog.classList.toggle('on', musicOn); }
  function tryPlay() {
    if (!CFG.musik) return;
    if (!audio.getAttribute('src')) audio.src = CFG.musik;
    var p = audio.play(); if (p && p.catch) p.catch(function () { });
  }
  function startMusic() { setM(true); tryPlay(); }
  mtog.addEventListener('click', function () {
    setM(!musicOn);
    if (musicOn) tryPlay(); else audio.pause();
  });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { if (!audio.paused) { audio.pause(); audio._res = true; } }
    else if (audio._res) { audio._res = false; if (musicOn) tryPlay(); }
  });
  function showMtog() { rev(mtog, { d: 300, t: 500, x: -2.5, y: 0 }); }

  /* =====================================================================
     4. SECTIONS
  ===================================================================== */
  var secEl = function (i) { return $('#s' + i); };

  /* ----- S1 : home ----- */
  var gnWrap = $('#gnWrap'), ayatP = $('#ayat'), gn = null;
  (function splitAyat() {
    var words = ayatP.textContent.trim().split(/\s+/);
    ayatP.textContent = '';
    words.forEach(function (w, i) {
      var s = document.createElement('span'); s.className = 'w'; s.textContent = w + (i < words.length - 1 ? ' ' : '');
      ayatP.appendChild(s);
    });
  })();
  var S1 = {
    el: secEl(1), bg: 'light', corners: true,
    items: function () { return [gnWrap, ayatP].concat($$('.rv', this.el)); },
    enter: function () {
      var rvs = $$('.rv', this.el), words = $$('.w', ayatP);
      cornersFly('in');
      gnWrap.style.opacity = ''; ayatP.style.opacity = '';
      if (!gn) { gn = buildGunungan(GOLD); gnWrap.appendChild(gn.svg); }
      gn.update(0);
      var t0 = performance.now() + 100, sp = CFG.gunungSpeed || 2, stop;
      stop = raf(function (now) { var t = Math.max(0, (now - t0) / 1000) * sp; gn.update(t); if (t >= gn.T) return false; });
      enterFinishers.push(function () { stop(); gn.update(gn.T + 1); });
      var base = 200;
      words.forEach(function (w, i) { rev(w, { d: base + i * 45, t: 600, y: 1.8 }); });
      var tail = base + words.length * 45;
      rvs.forEach(function (e, i) { rev(e, { d: tail + 100 + i * 150, t: 600, y: 1.8 }); });
      return waitAll(enterSet).then(function () { stop(); });
    },
    onExit: function () { }
  };

  /* ----- S2 : mempelai ----- */
  var S2 = {
    el: secEl(2), bg: 'light', corners: true,
    items: function () { return $$('.rv', this.el); },
    enter: function () {
      cornersFly('in');
      $$('.rv', this.el).forEach(function (e, i) { rev(e, { d: 200 + i * 140, t: 600, y: 2 }); });
      return waitAll(enterSet);
    }
  };

  /* ----- S3 : acara ----- */
  var sepT = buildStroke('aksen'), sepB = buildStroke('aksen');
  $('#sepT').appendChild(sepT.svg); $('#sepB').appendChild(sepB.svg);
  var cdTimer = null;
  function tickCd() {
    var target = new Date(CFG.event && CFG.event.resepsi || '2026-10-10T10:00:00+07:00').getTime();
    var s = Math.max(0, Math.floor((target - Date.now()) / 1000));
    var d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60), ss = s % 60;
    function f(n) { return String(n).padStart(2, '0'); }
    $('#cdD').textContent = f(d); $('#cdH').textContent = f(h); $('#cdM').textContent = f(m); $('#cdS').textContent = f(ss);
  }
  var S3 = {
    el: secEl(3), bg: 'dark', corners: false,
    items: function () { return $$('.rv', this.el).concat([$('#sepT'), $('#sepB')]); },
    enter: function (dir) {
      var rvs = $$('.rv', this.el), y = dir ? dir * 3 : 2, t = 150;
      sepT.reset(); sepB.reset(); $('#sepT').style.opacity = ''; $('#sepB').style.opacity = '';
      rvs.forEach(function (e, i) {
        rev(e, { d: t, t: 600, y: y }); t += 130;
        if (i === 1) { sepT.play(t, enterSet, 2); t += 120; }
      });
      sepB.play(t - 250, enterSet, 2);
      tickCd(); clearInterval(cdTimer); cdTimer = setInterval(tickCd, 1000);
      return waitAll(enterSet);
    },
    onExit: function () { clearInterval(cdTimer); }
  };

  /* ----- S4 : galeri ----- */
  var galFrame = buildStroke('frame');
  $('#galFrame').appendChild(galFrame.svg);
  var gal = (function () {
    var ph = $('#galPh'), G = CFG.galeri || [], imgs = Array.isArray(G) ? G : Array.apply(null, Array(G.jumlah || 0)).map(function (_, i) { return (G.folder || 'assets/img/') + (G.awalan || 'img') + (i + 1) + '.' + (G.ekstensi || 'webp'); }), n = imgs.length, slides = [], cur = 0, timer = null, drag = null, locked = false;
    imgs.forEach(function (src, i) {
      var d = document.createElement('div'); d.className = 'slide';
      var im = new Image(); im.src = src; im.alt = 'Foto ' + (i + 1); im.draggable = false; d.appendChild(im); ph.appendChild(d); slides.push(d);
    });
    function place(animate) {
      slides.forEach(function (s, i) {
        var off = (((i - cur + 1) % n) + n) % n - 1, prev = s._off, jump = prev === undefined || Math.abs(off - prev) > 1.5;
        s._off = off;
        s.style.transition = (animate && !jump) ? 'transform .85s ' + EASE : 'none';
        s.style.transform = 'translateX(' + off * 100 + '%)';
        s.style.visibility = (off >= -1 && off <= 1) ? 'visible' : 'hidden';
      });
    }
    function go(d) { if (n < 2) return; cur = ((cur + d) % n + n) % n; place(true); restart(); }
    function restart() { stop(); if (n > 1) timer = setInterval(function () { go(1); }, CFG.slideshowMs || 4800); }
    function stop() { clearInterval(timer); timer = null; }
    ph.addEventListener('pointerdown', function (e) { if (n < 2) return; drag = { x: e.clientX, t: performance.now(), dx: 0 }; ph.setPointerCapture(e.pointerId); stop(); });
    ph.addEventListener('pointermove', function (e) {
      if (!drag) return; drag.dx = e.clientX - drag.x;
      slides.forEach(function (s) { if (s._off >= -1 && s._off <= 1) { s.style.transition = 'none'; s.style.transform = 'translateX(calc(' + s._off * 100 + '% + ' + drag.dx + 'px))'; } });
    });
    function end() {
      if (!drag) return; var dx = drag.dx, v = Math.abs(dx) / Math.max(1, performance.now() - drag.t), w = ph.clientWidth; drag = null;
      if (Math.abs(dx) > w * .18 || (Math.abs(dx) > 28 && v > .5)) go(dx < 0 ? 1 : -1); else { place(true); restart(); }
    }
    ph.addEventListener('pointerup', end); ph.addEventListener('pointercancel', end);
    $('#galNext').addEventListener('click', function () { go(1); });
    $('#galPrev').addEventListener('click', function () { go(-1); });
    place(false);
    return { go: go, start: restart, stop: stop };
  })();
  var S4 = {
    el: secEl(4), bg: 'dark', corners: false,
    items: function () { return [$('#galFrame'), $('#galPh')].concat($$('.arw', this.el)); },
    enter: function (dir) {
      var y = dir ? dir * 3 : 0;
      galFrame.reset(); $('#galFrame').style.opacity = '';
      galFrame.play(50, enterSet, 2);
      rev($('#galPh'), { d: 200, t: 700, y: y, s: 1.04 });
      $$('.arw', this.el).forEach(function (a) { rev(a, { d: 700, t: 500, y: 0 }); });
      return waitAll(enterSet).then(function () { gal.start(); });
    },
    onExit: function () { gal.stop(); }
  };

  /* ----- S5 : doa, tanda kasih, penutup ----- */
  var scr5 = $('#scr5'), pgs = [$('#pg1'), $('#pg2'), $('#pg3')], pgDone = {}, io = null;
  function pgItems(i) { return $$('.rv', pgs[i]); }
  function revealPage(i, base) {
    if (pgDone[i]) return; pgDone[i] = true;
    pgItems(i).forEach(function (e, k) { rev(e, { d: (base || 0) + k * 140, t: 600, y: 2 }); });
  }
  scr5.addEventListener('scroll', function () { $('#cueI').classList.toggle('hide', scr5.scrollTop > scr5.clientHeight * 1.5); }, { passive: true });
  $('#cueI').addEventListener('click', function () { s5Page(1); });
  var S5 = {
    el: secEl(5), bg: 'light', corners: true,
    items: function () { return $$('.rv', this.el); },
    enter: function () {
      pgDone = {}; scr5.scrollTop = 0;
      cornersFly('in');
      revealPage(0, 200);
      $('#cueI').classList.remove('hide'); rev($('#cue'), { d: 900, t: 600, y: 1 });
      if ('IntersectionObserver' in window) {
        if (io) io.disconnect();
        io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting && en.intersectionRatio > .55) { var i = pgs.indexOf(en.target); if (i > 0) revealPage(i, 50); } }); }, { root: scr5, threshold: [.55, .8] });
        pgs.forEach(function (p) { io.observe(p); });
      } else { revealPage(1, 600); revealPage(2, 900); }
      return waitAll(enterSet);
    },
    onExit: function () { if (io) io.disconnect(); }
  };
  /* rekening */
  (function () {
    var tops = [52.5, 78.4, 104.4], box = $('#cards');
    (CFG.rekening || []).slice(0, 3).forEach(function (r, i) {
      var c = document.createElement('div'); c.className = 'card rv'; c.style.top = 'calc(var(--u)*' + tops[i] + ')';
      var txt;
      if (r.alamat) {
        c.innerHTML = '<div class="bk"></div><div class="ad"></div><button class="cp" type="button">SALIN</button>';
        $('.bk', c).textContent = r.judul || 'Alamat'; $('.ad', c).textContent = r.alamat;
        txt = r.salin || ((r.judul || 'Alamat') + '\n' + r.alamat);
      } else {
        c.innerHTML = '<div class="bk"></div><div class="an"></div><button class="cp" type="button">SALIN</button>';
        $('.bk', c).appendChild(document.createTextNode(r.bank)); $('.bk', c).appendChild(document.createElement('br')); $('.bk', c).appendChild(document.createTextNode(r.nomor));
        $('.an', c).textContent = 'a.n. ' + r.an;
        txt = String(r.nomor).replace(/\s+/g, '');
      }
      var b = $('.cp', c);
      b.addEventListener('click', function () {
        copyText(txt).then(function () { b.textContent = 'TERSALIN'; b.classList.add('ok'); setTimeout(function () { b.textContent = 'SALIN'; b.classList.remove('ok'); }, 1800); });
      });
      box.appendChild(c);
    });
  })();
  function copyText(t) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(t).catch(function () { return legacy(t); });
    return legacy(t);
    function legacy(x) { return new Promise(function (res) { var a = document.createElement('textarea'); a.value = x; a.style.position = 'fixed'; a.style.opacity = '0'; document.body.appendChild(a); a.select(); try { document.execCommand('copy'); } catch (e) { } a.remove(); res(); }); }
  }

  /* ----- ucapan (Firebase / cadangan localStorage) ----- */
  function initWishes() {
    var list = $('#wList'), empty = $('#wEmpty'), store;
    function esc(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
    function render(items) {
      $$('.wi', list).forEach(function (e) { e.remove(); });
      empty.style.display = items.length ? 'none' : '';
      items.forEach(function (it) {
        var el = document.createElement('div'); el.className = 'wi';
        el.innerHTML = '<b>' + esc(it.name) + '</b><p>' + esc(it.message) + '</p><button class="x" type="button" aria-label="Hapus ucapan"><svg viewBox="0 0 10 10" fill="none" stroke="#8a7b55" stroke-width="1.4" stroke-linecap="round"><path d="M1.5 1.5l7 7M8.5 1.5l-7 7"/></svg></button>';
        $('.x', el).addEventListener('click', function () {
          var code = window.prompt('Masukkan kode rahasia kanggo mbusak ucapan iki:');
          if (code === null) return;
          if (code !== String(CFG.adminSecret || '')) { window.alert('Kode salah, ucapan ora dibusak.'); return; }
          store.remove(it.id);
        });
        list.appendChild(el);
      });
    }
    var fb = window.firebase && CFG.firebase && CFG.firebase.apiKey && String(CFG.firebase.apiKey).indexOf('GANTI_') !== 0;
    if (fb) {
      try {
        if (!firebase.apps.length) firebase.initializeApp(CFG.firebase);
        var col = firebase.firestore().collection('invitations').doc(CFG.slug).collection('wishes');
        col.orderBy('createdAt', 'desc').onSnapshot(function (snap) {
          render(snap.docs.map(function (d) { var x = d.data(); return { id: d.id, name: x.name, message: x.message }; }));
        }, function (e) { console.error('Firestore:', e); });
        store = {
          add: function (n, m) { return col.add({ name: n, message: m, createdAt: firebase.firestore.FieldValue.serverTimestamp() }); },
          remove: function (id) { return col.doc(id).delete(); }
        };
      } catch (e) { fb = false; console.error(e); }
    }
    if (!fb) {
      var KEY = 'wishes-' + (CFG.slug || 'undangan');
      var load = function () { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } };
      var save = function (l) { try { localStorage.setItem(KEY, JSON.stringify(l)); } catch (e) { } };
      render(load().slice().reverse());
      store = {
        add: function (n, m) { var l = load(); l.push({ id: 'l' + Date.now(), name: n, message: m }); save(l); render(l.slice().reverse()); return Promise.resolve(); },
        remove: function (id) { var l = load().filter(function (w) { return w.id !== id; }); save(l); render(l.slice().reverse()); return Promise.resolve(); }
      };
    }
    var nm = $('#wName'), ms = $('#wMsg'), bt = $('#wSend');
    bt.addEventListener('click', function () {
      var n = nm.value.trim(), m = ms.value.trim();
      if (!n || !m) { (n ? ms : nm).focus(); return; }
      bt.disabled = true;
      store.add(n, m).then(function () { nm.value = ''; ms.value = ''; bt.textContent = 'terkirim'; setTimeout(function () { bt.textContent = 'kirim ucapan'; }, 1800); })
        .catch(function () { window.alert('Maaf, ucapan gagal terkirim. Coba maneh, ya.'); })
        .then(function () { bt.disabled = false; });
    });
  }
  /* firebase dimuat ing latar (ora ngalangi splash); nek gagal / alon > 8 detik -> mode cadangan */
  (function loadFirebase() {
    var urls = ['https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js', 'https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore-compat.js'], done = false;
    function fin() { if (done) return; done = true; initWishes(); }
    var timer = setTimeout(fin, 8000);
    (function next(k) {
      if (k >= urls.length) { clearTimeout(timer); return fin(); }
      var sc = document.createElement('script'); sc.src = urls[k]; sc.onload = function () { next(k + 1); }; sc.onerror = function () { clearTimeout(timer); fin(); };
      document.head.appendChild(sc);
    })(0);
  })();

  var SECS = [null, S1, S2, S3, S4, S5];
  $('#mapBtn').href = (CFG.event && CFG.event.mapsUrl) || '#';

  /* =====================================================================
     5. SCENE MANAGER
  ===================================================================== */
  var cur = 0, phase = 'idle', pending = null, tok = 0, chrome = false;
  function finishEnter() {
    enterSet.forEach(function (a) { try { a.finish(); } catch (e) { } });
    enterFinishers.forEach(function (f) { try { f(); } catch (e) { } });
    enterFinishers = [];
  }
  async function exitSection(sec, dir) {
    if (!sec) return;
    if (sec.onExit) sec.onExit();
    var ps = [hid(sec.items().concat([mtog]), { t: 380, y: -dir * 3.5 })];
    if (sec.corners) ps.push(cornersFly('out'));
    await Promise.all(ps);
    sec.el.classList.remove('on');
  }
  async function goTo(n, opts) {
    if (!chrome) return;
    opts = opts || {};
    if (opts.dir === undefined) opts.dir = Math.sign(n - cur);
    if (phase === 'exiting') { pending = [n, opts]; return; }
    if (phase === 'entering') finishEnter();
    var token = ++tok, from = SECS[cur];
    phase = 'exiting';
    var dir = opts.dir, to = SECS[n];
    setNav(n); setBg(to.bg);
    await exitSection(from, dir);
    if (pending) { n = pending[0]; opts = pending[1]; dir = opts.dir; to = SECS[n]; pending = null; setNav(n); setBg(to.bg); }
    cur = n;
    enterSet = new Set(); enterFinishers = [];
    phase = 'entering';
    to.el.classList.add('on');
    showMtog();
    var done = to.enter(dir);
    await done;
    if (tok === token && phase === 'entering') phase = 'idle';
  }
  tabs.forEach(function (b) { b.addEventListener('click', function () { goTo(+b.getAttribute('data-go')); }); });

  /* gesture: scroll / swipe mudun-munggah pindah section (kabeh section) */
  var gestureLock = 0, scr5El = $('#scr5');
  function gesture(down) {
    var now = Date.now(); if (now < gestureLock) return;
    var n = cur + (down ? 1 : -1);
    if (n < 1 || n > 5) return;
    gestureLock = now + 900; goTo(n, { dir: down ? 1 : -1 });
  }
  var pageLock = 0;
  function s5Page(d) {
    var now = Date.now(); if (now < pageLock) return;
    var H = scr5El.clientHeight, i = Math.round(scr5El.scrollTop / H), t = i + d;
    if (t < 0) { gesture(false); return; }
    if (t > 2) return;
    pageLock = now + 700; scr5El.scrollTo({ top: t * H, behavior: 'smooth' });
  }
  var wAcc = 0, wT = 0;
  window.addEventListener('wheel', function (e) {
    if (!chrome) return;
    var dy = e.deltaY * (e.deltaMode === 1 ? 32 : 1);
    if (cur === 5) {
      var wl = e.target.closest && e.target.closest('#wList');
      if (wl && ((dy > 0 && wl.scrollTop + wl.clientHeight < wl.scrollHeight - 1) || (dy < 0 && wl.scrollTop > 0))) return;
      e.preventDefault();
    }
    var now = performance.now(); if (now - wT > 250) wAcc = 0; wT = now; wAcc += dy;
    if (Math.abs(wAcc) > 40) { var d = wAcc > 0; wAcc = 0; if (cur === 5) s5Page(d ? 1 : -1); else gesture(d); }
  }, { passive: false });
  var ty = null, tx = null, t5 = 0;
  window.addEventListener('touchstart', function (e) { var t = e.touches[0]; ty = t.clientY; tx = t.clientX; t5 = scr5El.scrollTop; }, { passive: true });
  window.addEventListener('touchend', function (e) {
    if (ty === null || !chrome) return; var t = e.changedTouches[0], dy = ty - t.clientY, dx = tx - t.clientX; ty = null;
    if (Math.abs(dy) < 55 || Math.abs(dy) < Math.abs(dx) * 1.4) return;
    if (cur === 5) { if (dy < 0 && t5 <= 2 && scr5El.scrollTop <= 2) gesture(false); return; }
    gesture(dy > 0);
  }, { passive: true });
  window.addEventListener('keydown', function (e) {
    if (typing() || !chrome) return;
    if (e.key === 'ArrowDown' || e.key === 'PageDown') { if (cur === 5) s5Page(1); else gesture(true); }
    else if (e.key === 'ArrowUp' || e.key === 'PageUp') { if (cur === 5) s5Page(-1); else gesture(false); }
    else if (cur === 4 && e.key === 'ArrowRight') gal.go(1);
    else if (cur === 4 && e.key === 'ArrowLeft') gal.go(-1);
  });

  /* =====================================================================
     6. COVER, SPLASH, BUKA UNDANGAN
  ===================================================================== */
  var cover = $('#cover'), btnOpen = $('#btnOpen'), opened = false;
  var cvCorners = [], cvStop = null;
  var aksT = buildStroke('aksen'), aksB = buildStroke('aksen');
  $('#cvAksenT').appendChild(aksT.svg); $('#cvAksenB').appendChild(aksB.svg);
  var cvRv = ['#cvTitle', '#cvDate', '#cvYth', '#btnOpen'].map(function (s) { return $(s); });
  var bar = $('#cvBar'), barTxt = $('#guestName');
  cvRv.forEach(function (e) { e.style.opacity = '0'; });
  barTxt.style.opacity = '0';

  (function guest() {
    var p = new URLSearchParams(location.search), n = p.get('to') || p.get('kepada') || p.get('nama');
    if (n && n.trim()) { barTxt.textContent = n.trim().slice(0, 60); document.title = 'Undangan untuk ' + n.trim().slice(0, 40) + ' — Utari & Bagus'; }
  })();
  function fitGuest() {
    barTxt.style.fontSize = ''; var max = bar.clientWidth * .84, fs = parseFloat(getComputedStyle(barTxt).fontSize);
    while (barTxt.scrollWidth > max && fs > 10) { fs -= 1; barTxt.style.fontSize = fs + 'px'; }
  }
  ['tl', 'tr', 'bl', 'br'].forEach(function (k) {
    var o = buildCorner(GOLD, true); $('.cv-corners .corner.' + k).appendChild(o.svg); cvCorners.push(o);
  });
  var cvSet = new Set();
  function startCover() {
    fitGuest();
    var sp = CFG.cornerSpeed || 1.5, t0 = performance.now() + 250, T = cvCorners[0].T;
    cvStop = raf(function (now) {
      var t = Math.max(0, (now - t0) / 1000) * sp;
      cvCorners.forEach(function (c) { c.update(t); });
      if (t >= T) return false;
    });
    var cg = $('.cv-gn').animate([{ opacity: 0 }, { opacity: 1 }], { duration: dur(1200), easing: 'ease-out', fill: 'backwards' });
    $$('.cv-name').forEach(function (n) { n.animate([{ opacity: 0 }, { opacity: 1 }], { duration: dur(1300), easing: 'ease-out', fill: 'backwards' }); });
    rev(cvRv[0], { d: 500, t: 900, y: -1.8 }, cvSet);
    rev(cvRv[1], { d: 1000, t: 800, y: 1.4 }, cvSet);
    rev(cvRv[2], { d: 1400, t: 800, y: 1 }, cvSet);
    aksT.play(1200, cvSet, 1.4); aksB.play(1600, cvSet, 1.4);
    var barImg = $('img', bar);
    var a = barImg.animate([{ transform: 'scaleX(0)', opacity: 0 }, { transform: 'scaleX(1)', opacity: 1 }], { duration: dur(1100), delay: 1600, easing: 'cubic-bezier(.3,.7,.2,1)', fill: 'both' });
    a.finished.then(function () { barImg.style.opacity = '1'; a.cancel(); }).catch(function () { });
    var nb = barTxt.animate([{ opacity: 0, transform: 'translateY(' + 0.8 * U() + 'px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: dur(800), delay: 2200, easing: EASE, fill: 'both' });
    nb.finished.then(function () { barTxt.style.opacity = ''; nb.cancel(); }).catch(function () { });
    rev(cvRv[3], { d: 2600, t: 800, y: 2 }, cvSet);
  }
  async function openInvitation() {
    if (opened) return; opened = true;
    btnOpen.disabled = true;
    startMusic();
    if (cvStop) cvStop();
    cvSet.forEach(function (a) { try { a.finish(); } catch (e) { } });
    setBg('light');
    document.body.classList.remove('on-cover');
    watchFps();
    var lite = document.body.classList.contains('no-glow');   // HP lemah: zoom tanpa blur (blur layar penuh abot)
    cover.animate(lite ? [
      { transform: 'scale(1)', opacity: 1 },
      { transform: 'scale(1.7)', opacity: 0 }
    ] : [
      { transform: 'scale(1)', filter: 'blur(0px)', opacity: 1 },
      { transform: 'scale(1.7)', filter: 'blur(18px)', opacity: 0 }
    ], { duration: dur(1000), easing: 'cubic-bezier(.7,0,.25,1)', fill: 'forwards' });
    await sleep(700);
    cover.classList.add('gone');
    document.body.classList.add('ready');
    $('#nav').classList.add('show');
    chrome = true; cur = 0;
    setNav(1);
    cur = 1; phase = 'entering';
    enterSet = new Set(); enterFinishers = [];
    S1.el.classList.add('on');
    showMtog();
    var tk = ++tok;
    await S1.enter(0);
    if (tok === tk && phase === 'entering') phase = 'idle';
  }
  btnOpen.addEventListener('click', openInvitation);

  /* hide semua item section nganti dienter */
  SECS.forEach(function (s) { if (s) s.items().forEach(function (e) { e.style.opacity = '0'; }); });
  mtog.style.opacity = '0';
  $('#sepT').style.opacity = '0'; $('#sepB').style.opacity = '0';

  /* ---------- preload: kabeh gambar + font kudu siap SAKDURUNG animasi mlaku ---------- */
  function imgReady(im) {
    return new Promise(function (res) {
      function done() { (im.decode ? im.decode() : Promise.resolve()).then(res, res); }
      if (im.complete) { if (im.naturalWidth || !im.getAttribute('src')) return done(); return res(); }
      im.addEventListener('load', done, { once: true }); im.addEventListener('error', function () { res(); }, { once: true });
    });
  }
  function loadImg(src) { var i = new Image(); i.src = src; return imgReady(i); }

  /* ---------- ambient glow: pateni otomatis neng HP jadul / seret ---------- */
  function disableGlow(why) {
    if (document.body.classList.contains('no-glow')) return;
    document.body.classList.add('no-glow');
    try { console.info('[undangan] ambient glow dipateni:', why); } catch (e) { }
  }
  function weakDevice() {
    var m = navigator.deviceMemory, c = navigator.hardwareConcurrency, sd = navigator.connection && navigator.connection.saveData;
    if (sd) return 'save-data';
    if (m && m <= 2) return 'RAM ' + m + 'GB';
    if (c && c <= 2) return 'CPU ' + c + ' core';
    return '';
  }
  function probeFps(ms) {          // median ms/frame sajrone ms milidetik
    return new Promise(function (res) {
      var d = [], last = 0, t0 = 0;
      requestAnimationFrame(function f(n) {
        if (!t0) t0 = n; else d.push(n - last);
        last = n;
        if (n - t0 < ms) requestAnimationFrame(f);
        else { d.sort(function (a, b) { return a - b; }); res(d.length ? d[d.length >> 1] : 0); }
      });
    });
  }
  function watchFps() {            // pantau saka buka undangan: seret terus-terusan -> glow mati
    var bad = 0, d = [], last = 0, tStart = performance.now(), tWin = tStart;
    requestAnimationFrame(function f(n) {
      if (document.body.classList.contains('no-glow')) return;
      if (last) d.push(n - last); last = n;
      if (n - tWin > 1500) {
        d.sort(function (a, b) { return a - b; });
        var p75 = d[Math.floor(d.length * .75)] || 0;
        bad = p75 > 34 ? bad + 1 : 0;
        if (bad >= 2) return disableGlow('FPS kurang (p75 ' + Math.round(p75) + 'ms)');
        d = []; tWin = n;
      }
      if (performance.now() - tStart < 25000) requestAnimationFrame(f);
    });
  }
  window.__watchFps = watchFps;

  async function boot() {
    var t0 = performance.now();
    var weak = weakDevice(); if (weak) disableGlow(weak);
    var waits = [loadImg('assets/img/gunungan cover.png')];
    /* kabeh <img> neng kaca (logo, ikon nav, bg tamu, foto galeri pertama) */
    $$('img').forEach(function (im) {
      if (im.closest('#galPh') && im.closest('.slide') !== $('.slide')) return;   // foto galeri liyane: mlayu neng latar
      waits.push(imgReady(im));
    });
    if (document.fonts && document.fonts.load) {
      ['1em Upakarti', '1em HighEmpathy', '400 1em Lato', '700 1em Lato'].forEach(function (f) { waits.push(document.fonts.load(f).catch(function () { })); });
      if (document.fonts.ready) waits.push(document.fonts.ready.catch(function () { }));
    }
    try { if (!gn) { gn = buildGunungan(GOLD); gnWrap.appendChild(gn.svg); } } catch (e) { }
    await Promise.race([Promise.all(waits), new Promise(function (r) { setTimeout(r, 15000); })]);
    var left = 900 - (performance.now() - t0);      // splash minimal 0,9 detik (logo kudu sempat ketok)
    var probe = document.body.classList.contains('no-glow') ? Promise.resolve(0) : probeFps(450);
    var wait = left > 0 ? sleep(left) : Promise.resolve();
    var med = (await Promise.all([probe, wait]))[0];     // tes FPS mlaku bareng karo nunggu, ora nambah suwe
    if (med > 26) disableGlow('FPS median ' + Math.round(med) + 'ms');
    $('#splash').classList.add('out');
    setTimeout(function () { var s = $('#splash'); if (s) s.remove(); }, 800);
    startCover();
  }
  boot();   // script defer: DOM wis siap, aset ditunggu neng njero boot()

  /* debug kecil: ?s=3 mlumpat langsung (kanggo tes) */
  window.__undangan = { goTo: goTo, open: openInvitation };
})();
