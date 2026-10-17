/* =========================================================================
   Undangan Nisa & Rio  —  main.js
   Isi:
     1. isi teks seko config.js            5. lentera WebGL (efek opsi 1)
     2. timeline scroll + fly in / fly out  6. countdown, musik, tombol
     3. parallax background                 7. slideshow section 1 + 7
     4. flow buka undangan                  8. doa & ucapan (Firestore REST)
   Navigasi PAGING: saben gesture (swipe / roda mouse / keyboard) = pindah SIJI section
   lan mandeg neng bentuk final-e. Dokumen ora discroll; posisi virtual (sy) dianimasi JS,
   #stage tetep (fixed) lan digambar ulang manut posisi iku.
   ========================================================================= */
(function () {
  'use strict';

  var C = window.INVITATION_CONFIG || {};
  var T = C.teks || {};
  var doc = document, root = doc.documentElement;
  var $ = function (s, r) { return (r || doc).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); };
  var clamp = function (x, a, b) { a = a === undefined ? 0 : a; b = b === undefined ? 1 : b; return x < a ? a : x > b ? b : x; };
  var ss = function (a, b, x) { x = clamp((x - a) / (b - a)); return x * x * (3 - 2 * x); };
  var easeOut = function (x) { return 1 - Math.pow(1 - x, 3); };
  var RM = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  var query = new URLSearchParams(location.search);

  try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch (e) {}
  window.scrollTo(0, 0);

  /* ======================================================================
     1. TEKS SEKO CONFIG
     ====================================================================== */
  function getPath(path) {
    return path.split('.').reduce(function (o, k) { return o && o[k] !== undefined ? o[k] : undefined; }, T);
  }
  function setLines(el, txt) {
    el.textContent = '';
    String(txt).split('\n').forEach(function (l) {
      var s = doc.createElement('span'); s.className = 'ln'; s.textContent = l; el.appendChild(s);
    });
  }
  $$('[data-t]').forEach(function (el) {
    var v = getPath(el.getAttribute('data-t'));
    if (v === undefined) return;
    if (el.classList.contains('p') || String(v).indexOf('\n') > -1) setLines(el, v); else el.textContent = v;
  });

  /* nama tamu seko link: ?to=Nama+Tamu */
  var guestEl = $('#guest');
  var guestName = query.get('to') || query.get('kepada') || query.get('u') || ((T.cover || {}).tamuDefault) || 'Nama Tamu Undangan';
  setLines(guestEl, guestName);

  /* link-link */
  var ig = C.instagram || {};
  $('#igW').href = ig.wanita || '#';
  $('#igP').href = ig.pria || '#';
  $('#mapBtn').href = (C.event && C.event.mapsUrl) || '#';
  var liveEl = $('#live');
  var liveUrl = (C.event && C.event.liveUrl) || ig.live || '';
  if (liveUrl) liveEl.href = liveUrl;
  else liveEl.addEventListener('click', function (e) { e.preventDefault(); });

  /* kartu tanda kasih */
  (function buildCards() {
    var box = $('#cards'), list = (C.rekening || []).slice(0, 3), tk = T.tandaKasih || {};
    list.forEach(function (r, i) {
      var c = doc.createElement('div');
      c.className = 'card fx hit'; c.setAttribute('data-fx', 'up');
      c.style.setProperty('--y', (122.1 + i * 57.3).toFixed(2));
      var a = doc.createElement('span'); a.className = 'c1'; a.textContent = r.bank || '';
      var b = doc.createElement('span'); b.className = 'c2'; b.textContent = r.nomor || '';
      var d = doc.createElement('span'); d.className = 'c3'; d.textContent = 'a.n. ' + (r.an || '');
      var btn = doc.createElement('button'); btn.type = 'button'; btn.textContent = tk.salin || 'SALIN';
      btn.setAttribute('aria-label', 'Salin nomor rekening ' + (r.bank || '') + ' ' + (r.an || ''));
      btn.addEventListener('click', function () {
        copyText(String(r.nomor || ''));
        btn.textContent = tk.tersalin || 'TERSALIN'; btn.classList.add('ok');
        clearTimeout(btn._t);
        btn._t = setTimeout(function () { btn.textContent = tk.salin || 'SALIN'; btn.classList.remove('ok'); }, 1800);
      });
      c.appendChild(a); c.appendChild(b); c.appendChild(d); c.appendChild(btn);
      box.appendChild(c);
    });
  })();
  function copyText(t) {
    function fallback() {
      var ta = doc.createElement('textarea'); ta.value = t; ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;font-size:16px';
      doc.body.appendChild(ta); ta.select(); ta.setSelectionRange(0, 99999);
      try { doc.execCommand('copy'); } catch (e) {}
      doc.body.removeChild(ta);
    }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(t).catch(fallback); else fallback();
  }

  /* ======================================================================
     2. REGISTRASI ITEM ANIMASI (fly in / fly out)
     ====================================================================== */
  var frame = $('#frame'), ruler = $('#ruler');
  var CH = [];
  $$('.ch').forEach(function (el, i) {
    CH.push({ i: i, el: el, bg: $('.bgw', el), items: [], alpha: 0, v: false });
  });
  var C1 = { items: [] };   // teks halaman 1 (kunci), animasi manut waktu

  function collect(layer, out) {
    var list = [];
    $$('.fx', layer).forEach(function (el) {
      var type = el.getAttribute('data-fx') || 'up';
      var lines = $$('.ln', el).filter(function (n) { return n.parentNode === el; });
      if (lines.length > 1 && !el.classList.contains('cdc')) lines.forEach(function (n) { list.push({ el: n, type: type, grp: el }); });
      else list.push({ el: el, type: type, grp: el });
    });
    list.forEach(function (it, i) {
      it.d = list.length > 1 ? i / (list.length - 1) : 0;
      it.z = it.type === 'zoom' ? 1.25 : 1;
      it.key = '';
      out.push(it);
    });
  }
  collect($('#lay-c1'), C1.items);
  collect($('#lay-c2'), CH[0].items);
  CH.forEach(function (c) {
    if (c.i === 0) return;
    $$('.fxl', c.el).forEach(function (l) { collect(l, c.items); });
    // renumber delay across the whole chapter (urutan DOM = urutan baca)
    c.items.forEach(function (it, i) { it.d = c.items.length > 1 ? i / (c.items.length - 1) : 0; });
  });

  /* ----------------------------------------------------------------------
     CHOREOGRAPHY TEKS (basis WEKTU, ora manut posisi swipe)
       IN  : elemen metu siji-siji, alon (IN_DUR saben elemen, jeda EL_STEP antar elemen,
             LINE_STEP antar baris neng siji paragraf)
       OUT : kabeh elemen ilang cepet (OUT_DUR) -> layar resik -> lagi background pindah
     ---------------------------------------------------------------------- */
  var IN_DUR = 1300, EL_STEP = 600, LINE_STEP = 220, CDC_STEP = 300, MAX_STAG = 6200;
  var OUT_DUR = 380, OUT_SPREAD = 140, OUT_SAFE = 60, IN_GAP = 180;
  function schedule(c) {
    var items = c.items, n = items.length, t = 0, prev = null, k, i;
    for (i = 0; i < n; i++) {
      if (i > 0) t += items[i].grp === prev ? LINE_STEP : (items[i].grp.classList.contains('cdc') ? CDC_STEP : EL_STEP);
      items[i].dl = t; prev = items[i].grp;
    }
    k = t > MAX_STAG ? MAX_STAG / t : 1;
    for (i = 0; i < n; i++) { items[i].dl *= k; items[i].od = n > 1 ? i / (n - 1) * OUT_SPREAD : 0; items[i].a0 = 0; }
    c.inLen = t * k + IN_DUR; c.outLen = (n > 1 ? OUT_SPREAD : 0) + OUT_DUR;
    c.tin = 0; c.tout = 0; c.began = false;
  }
  CH.forEach(schedule);

  /* ======================================================================
     3. UKURAN + TIMELINE SCROLL
     ====================================================================== */
  var FWpx = 360, U = 360 / 216, L = 800, TL = 0, FINAL = 0;
  var SNAP = [], pg = 0, anim = null, PAGE_MS = 1000, pageT = 0;   // titik mandeg saben section, section aktif, animasi paging
  var HOLD = [0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2];          // jeda cilik sak durung transisi metu (x tinggi layar); paging ora butuh "tahan" dowo
  var TR = 0.8;                                                 // dowo transisi antar section (x tinggi layar)

  function buildTimeline() {
    TL = TR * L;
    CH.forEach(function (c, i) {
      if (i === 0) { c.bg0 = -1e9; c.bg1 = 0; c.inStart = -1e9; c.inEnd = 0; c.holdStart = 0; }
      else {
        var x = CH[i - 1].outStart;
        c.bg0 = x + 0.15 * TL; c.bg1 = x + 0.85 * TL;
        c.inStart = x + 0.5 * TL; c.inEnd = x + TL; c.holdStart = x + TL;
      }
      var last = i === CH.length - 1;
      c.outStart = last ? Infinity : c.holdStart + (HOLD[i] || 0.3) * L;
      c.outEnd = last ? Infinity : c.outStart + 0.4 * TL;
      if (last) FINAL = c.holdStart + (HOLD[i] || 0.3) * L;
    });
    CH.forEach(function (c, i) {
      var nx = CH[i + 1];
      c.lifeA = i === 0 ? 0 : c.bg0;
      c.lifeB = nx ? nx.bg1 : FINAL + L;
    });
    SNAP = CH.map(function (c, i) { return i === 0 ? 0 : c.holdStart + 0.5 * (HOLD[i] || 0.2) * L; });
  }

  var frozen = false;
  function measure() {
    if (frozen) return;
    FWpx = frame.clientWidth || 360;
    U = FWpx / 216;
    L = ruler.offsetHeight || window.innerHeight || 800;
    buildTimeline();
    if (anim) anim.to = SNAP[pg]; else { sy = SNAP[pg]; ys = sy; }
    layoutLantern();
    resizeGL();
    fitGuest();
    dirty = true;
  }
  function fitGuest() {
    var ln = $('.ln', guestEl); if (!ln) return;
    guestEl.style.fontSize = '';
    var avail = FWpx - 28 * U, w = ln.getBoundingClientRect().width || 0;
    if (w > avail && w > 0) {
      var fs = parseFloat(getComputedStyle(guestEl).fontSize) * avail / w;
      guestEl.style.fontSize = Math.max(fs, 9) + 'px';
    }
  }

  /* ======================================================================
     4. LENTERA WEBGL  (efek opsi 1: intensitas, hukum 1/jarak^2)
     ====================================================================== */
  var glc = $('#gl'), gl = null, prog = null, UN = {}, texReady = 0, imgOff = null, imgOn = null;
  var IW = 900, IH = 1610;
  var FL = [0.501, 0.552];                      // posisi geni (pecahan gambar)
  var BOX = [0.32, 0.29, 0.68, 0.70];           // area sentuh lentera
  var GEO = { ox: 0, oy: 0, dw: 1, dh: 1, W: 1, H: 1 };
  var fbOn = null;                              // fallback tanpa WebGL
  var lastI = -1;

  var VS = 'attribute vec2 a;varying vec2 v;void main(){v=a*.5+.5;gl_Position=vec4(a,0.,1.);}';
  var FS = '#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\n' +
    'varying vec2 v;uniform sampler2D uD,uL;uniform vec4 uB;uniform vec2 uR,uF;uniform float uI,uT;' +
    'void main(){vec2 p=vec2(v.x*uR.x,(1.-v.y)*uR.y);vec2 uv=(p-uB.xy)/uB.zw;' +
    'float d=length((uv-uF)*uB.zw/uB.w);' +
    'vec3 D=texture2D(uD,uv).rgb,L=texture2D(uL,uv).rgb;' +
    'float fl=1.+.03*sin(uT*9.);float fall=1./(1.+pow(d/.2,2.));' +
    'float w=clamp(uI*fall*fl*2.2,0.,1.);w=max(w,smoothstep(.8,1.,uI));' +
    'gl_FragColor=vec4(mix(D,L,w),1.);}';

  function initGL(offImg, onImg) {
    imgOff = offImg; imgOn = onImg; IW = onImg.naturalWidth || 900; IH = onImg.naturalHeight || 1610;
    try { gl = glc.getContext('webgl', { antialias: false, alpha: false, preserveDrawingBuffer: true }) || glc.getContext('experimental-webgl'); } catch (e) { gl = null; }
    if (gl) {
      try {
        var sh = function (t, s) { var o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; };
        prog = gl.createProgram();
        gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
        gl.linkProgram(prog); gl.useProgram(prog);
        var bf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, bf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
        var a = gl.getAttribLocation(prog, 'a'); gl.enableVertexAttribArray(a); gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
        ['uD', 'uL', 'uB', 'uR', 'uF', 'uI', 'uT'].forEach(function (k) { UN[k] = gl.getUniformLocation(prog, k); });
        [[offImg, 0, 'uD'], [onImg, 1, 'uL']].forEach(function (x) {
          var tx = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + x[1]); gl.bindTexture(gl.TEXTURE_2D, tx);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, x[0]);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.uniform1i(UN[x[2]], x[1]);
        });
        glc.addEventListener('webglcontextlost', function (e) { e.preventDefault(); gl = null; useFallback(); }, false);
        return;
      } catch (err) { gl = null; }
    }
    useFallback();
  }
  function useFallback() {
    glc.style.display = 'none';
    if (fbOn) return;
    var bg = $('#bg0');
    var a = doc.createElement('img'); a.src = imgOff.src; a.alt = ''; bg.insertBefore(a, bg.firstChild);
    fbOn = doc.createElement('img'); fbOn.src = imgOn.src; fbOn.alt = ''; fbOn.style.opacity = '0';
    bg.insertBefore(fbOn, a.nextSibling);
    lastI = -1;
  }
  function resizeGL() {
    var W = frame.clientWidth, H = L;
    var sc = Math.max(W / IW, H / IH), dw = IW * sc, dh = IH * sc;
    GEO = { ox: (W - dw) / 2, oy: (H - dh) / 2, dw: dw, dh: dh, W: W, H: H };
    if (gl) {
      var r = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(2.6e6 / (W * H)));
      glc.width = Math.round(W * r); glc.height = Math.round(H * r);
      gl.viewport(0, 0, glc.width, glc.height);
      lastI = -1;
    }
  }
  function drawLight(I, t) {
    if (gl && UN.uI) {
      gl.uniform4f(UN.uB, GEO.ox, GEO.oy, GEO.dw, GEO.dh);
      gl.uniform2f(UN.uR, GEO.W, GEO.H);
      gl.uniform2f(UN.uF, FL[0], FL[1]);
      gl.uniform1f(UN.uI, I); gl.uniform1f(UN.uT, t || 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    } else if (fbOn) {
      fbOn.style.opacity = String(clamp(I * 1.15));
    }
  }
  function layoutLantern() {
    var h = $('#lhit'), em = $('#ember');
    h.style.left = (GEO.ox + BOX[0] * GEO.dw) + 'px';
    h.style.top = (GEO.oy + BOX[1] * GEO.dh) + 'px';
    h.style.width = ((BOX[2] - BOX[0]) * GEO.dw) + 'px';
    h.style.height = ((BOX[3] - BOX[1]) * GEO.dh) + 'px';
    em.style.left = (GEO.ox + FL[0] * GEO.dw) + 'px';
    em.style.top = (GEO.oy + FL[1] * GEO.dh) + 'px';
  }

  /* ======================================================================
     5. FLOW  (siap -> nyentuh lentera -> urip -> scroll)
     ====================================================================== */
  var state = 'loading';       // loading -> idle -> lighting -> open
  var tReady = 0, tIg = 0, locked = true, cueReady = 0;
  var DUR = 5600;              // lama lentera urip (ms)
  var dirty = true;
  var audio = $('#bgm'), musBtn = $('#mus'), musOk = false;

  function ignite(instant) {
    if (state !== 'idle' && !(instant && state !== 'lighting' && state !== 'open')) return;
    state = 'lighting';
    var now = performance.now();
    tIg = instant ? now - 20000 : now;
    $('#ember').classList.remove('on'); $('#ember').style.display = 'none';
    $('#lhit').style.display = 'none';
    if (C.musik) playMusic();
    dirty = true;
  }
  $('#lhit').addEventListener('click', function () { ignite(); });

  function unlock() {
    locked = false; state = 'open';
    root.classList.remove('lock');
    window.scrollTo(0, 0);
  }

  /* ----------------------------------------------------------------------
     PAGING: siji gesture = siji section, mandeg neng bentuk final
     ---------------------------------------------------------------------- */
  function goPage(n) {
    n = Math.max(0, Math.min(CH.length - 1, n));
    if (n === pg) return;
    pg = n;
    var ae = doc.activeElement;
    if (ae && /^(INPUT|TEXTAREA)$/.test(ae.tagName)) ae.blur();
    var from = sy, to = SNAP[n];
    var dur = RM ? 500 : clamp(Math.abs(to - from) / (0.95 * L), 0.45, 1.3) * PAGE_MS;
    var now = performance.now(), wait = 0;
    CH.forEach(function (c) { startOut(c, now); });                     // teks section sing ditinggal: metu kabeh, cepet
    CH.forEach(function (c) { if (c.tout) wait = Math.max(wait, c.tout + c.outLen - now); });
    if (wait > 0) wait += OUT_SAFE;                                     // layar kudu resik sek, lagi background pindah
    pageT = now;
    anim = { from: from, to: to, t0: now + wait, dur: dur };
    dirty = true;
  }
  var textUntil = 0;                 // render kudu tetep mlaku nganti wektu iki (animasi teks)
  function startIn(c, now) {
    var first = c.i === 0 && !c.began;
    c.began = true;
    c.tin = first ? tIg + 1300 : now + IN_GAP; c.tout = 0;
    textUntil = Math.max(textUntil, c.tin + c.inLen + 150);
    dirty = true;
  }
  function startOut(c, now) {
    if (!c.tin || c.tout) return;
    c.tout = now;
    c.items.forEach(function (it) { it.a0 = clamp((now - c.tin - it.dl) / IN_DUR); });   // kunci progres IN sing wis kelakon
    textUntil = Math.max(textUntil, now + c.outLen + 150);
    dirty = true;
  }
  /* list / textarea isa discroll neng arah iki ora? (dir: 1 = isi munggah/nyusuri, -1 = bali) */
  function canScroll(el, dir) {
    var max = el.scrollHeight - el.clientHeight;
    if (max <= 1) return false;
    return dir > 0 ? el.scrollTop < max - 1 : el.scrollTop > 1;
  }
  function inDialog(t) { return !!(t && t.closest && t.closest('.dlg')); }
  function scroller(t) { return t && t.closest ? t.closest('.wl, textarea') : null; }

  /* roda mouse / trackpad */
  var wT = 0, wLast = 0, wListT = 0;
  doc.addEventListener('wheel', function (e) {
    if (e.ctrlKey || inDialog(e.target)) return;
    var dy = e.deltaY; if (e.deltaMode === 1) dy *= 16;
    if (Math.abs(e.deltaX) > Math.abs(dy)) { e.preventDefault(); return; }
    var now = performance.now(), sc = scroller(e.target);
    if (sc && !locked && canScroll(sc, dy > 0 ? 1 : -1)) { wListT = now; return; }     // list muter dhewe
    e.preventDefault();
    if (locked) return;
    var ad = Math.abs(dy), gap = now - wT; wT = now;
    var last = wLast; wLast = ad;
    if (now - wListT < 350) { wListT = now; return; }       // buntut gesture list: aja langsung pindah section
    if (ad < 4) return;
    /* gesture anyar = wis ono jeda >110 ms, utawa deltane tambah banter. Buntut inersia (cilik-cilik terus) diabaikan */
    var fresh = gap >= 110 || ad > last * 1.4 + 2;
    if (!fresh) { dbgLog('wheel ' + Math.round(dy) + ' buntut (diabaikan)'); return; }
    if (anim && now - pageT < 380) return;                  // lagi wiwit pindah: aja kedobelan; sakwise iku swipe anyar langsung ditampa
    dbgLog('wheel ' + Math.round(dy) + ' -> section ' + (pg + (dy > 0 ? 1 : -1)));
    goPage(pg + (dy > 0 ? 1 : -1));
  }, { passive: false });

  /* swipe layar sentuh */
  var gesture = null;
  function swipeDir(g) {            // arah section sing dituju saka gerakan jempol (0 = durung cukup)
    var ay = Math.abs(g.dy), ax = Math.abs(g.dx);
    return ay >= 16 && ay >= ax * 0.7 ? (g.dy < 0 ? 1 : -1) : 0;
  }
  doc.addEventListener('touchstart', function (e) {
    if (e.touches.length !== 1) { gesture = null; return; }
    var t = e.touches[0];
    gesture = { x: t.clientX, y: t.clientY, dx: 0, dy: 0, t0: performance.now(), mode: '', done: false,
      sc: scroller(e.target), dlg: inDialog(e.target) };
  }, { passive: true });
  doc.addEventListener('touchmove', function (e) {
    if (locked) { e.preventDefault(); return; }
    var g = gesture;
    if (!g || g.dlg || e.touches.length !== 1) return;
    var t = e.touches[0]; g.dx = t.clientX - g.x; g.dy = t.clientY - g.y;
    if (!g.mode) {
      if (Math.abs(g.dy) < 2) return;
      g.mode = (g.sc && canScroll(g.sc, g.dy < 0 ? 1 : -1)) ? 'list' : 'page';
    }
    if (g.mode === 'list') return;                          // list muter dhewe (native); section ora pindah
    e.preventDefault();
    var d = g.done ? 0 : swipeDir(g);
    if (d) { g.done = true; dbgLog('touch move dy=' + Math.round(g.dy) + ' -> section ' + (pg + d)); goPage(pg + d); }
  }, { passive: false });
  /* touchend / touchcancel: nek browser nyolong gesture sakdurunge kebacut, tetep diitung */
  function endGesture(e, cancelled) {
    var g = gesture; gesture = null;
    if (!g || g.dlg || g.done || g.mode === 'list' || locked) return;
    if (e && e.changedTouches && e.changedTouches.length) { g.dx = e.changedTouches[0].clientX - g.x; g.dy = e.changedTouches[0].clientY - g.y; }
    var d = swipeDir(g);
    if (!d && !cancelled && performance.now() - g.t0 < 300 && Math.abs(g.dy) >= 10 && Math.abs(g.dy) > Math.abs(g.dx)) d = g.dy < 0 ? 1 : -1;
    dbgLog((cancelled ? 'touchcancel' : 'touchend') + ' dy=' + Math.round(g.dy) + ' dx=' + Math.round(g.dx) + (d ? ' -> section ' + (pg + d) : ' (kurang adoh)'));
    if (d) goPage(pg + d);
  }
  doc.addEventListener('touchend', function (e) { endGesture(e, false); }, { passive: true });
  doc.addEventListener('touchcancel', function (e) { endGesture(e, true); }, { passive: true });

  /* panel debug (?debug=1): ketok pg + hasil gesture terakhir, kanggo ngecek neng HP asli */
  var dbgEl = null;
  function dbgLog(t) {
    if (!query.get('debug')) return;
    if (!dbgEl) {
      dbgEl = doc.createElement('div');
      dbgEl.style.cssText = 'position:fixed;left:0;top:0;z-index:999;max-width:100%;padding:4px 6px;font:11px/1.35 monospace;color:#7CFC00;background:rgba(0,0,0,.75);pointer-events:none;white-space:pre-wrap';
      doc.body.appendChild(dbgEl);
    }
    dbgEl.textContent = 'section ' + pg + ' | ' + t;
  }

  /* keyboard (desktop) */
  doc.addEventListener('keydown', function (e) {
    if (locked || e.altKey || e.ctrlKey || e.metaKey) return;
    var tag = (e.target && e.target.tagName) || '';
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(tag) || doc.querySelector('.dlg')) return;
    var k = e.key, d = 0;
    if (k === 'ArrowDown' || k === 'PageDown' || (k === ' ' && !e.shiftKey && tag !== 'BUTTON' && tag !== 'A')) d = 1;
    else if (k === 'ArrowUp' || k === 'PageUp' || (k === ' ' && e.shiftKey)) d = -1;
    else if (k === 'Home') { e.preventDefault(); goPage(0); return; }
    else if (k === 'End') { e.preventDefault(); goPage(CH.length - 1); return; }
    if (!d) return;
    e.preventDefault();
    if (!e.repeat) goPage(pg + d);
  });

  /* kolom input: freeze progres scroll sak durung keyboard iOS mbukak */
  doc.addEventListener('focusin', function (e) {
    if (e.target && /^(INPUT|TEXTAREA)$/.test(e.target.tagName)) { frozen = true; }
  });
  doc.addEventListener('focusout', function (e) {
    if (e.target && /^(INPUT|TEXTAREA)$/.test(e.target.tagName)) {
      setTimeout(function () {
        var ae = doc.activeElement;
        if (ae && /^(INPUT|TEXTAREA)$/.test(ae.tagName)) return;
        window.scrollTo(0, 0); frozen = false; measure();
      }, 320);
    }
  });

  /* ======================================================================
     6. LOOP RENDER
     ====================================================================== */
  var sy = 0, ys = 0, lastNow = 0, lastPainted = -1e9;

  function paintItem(it, a, b, fl) {
    var e = easeOut(a), o = b * b, rm = RM ? 0.25 : 1, z = it.z;
    var op = e * (1 - clamp(o * 1.1));
    var tx = 0, ty = 0, sc = 1, tf = '';
    switch (it.type) {
      case 'zoom':
        sc = 1 + (1 - e) * 0.42 * rm + o * 0.16 * rm; ty = (1 - e) * 5 * U * rm - o * 11 * U * rm; break;
      case 'left':
        tx = -(1 - e) * 36 * U * rm + o * 22 * U * rm; ty = (1 - e) * 4 * U * rm; break;
      case 'right':
        tx = (1 - e) * 36 * U * rm - o * 22 * U * rm; ty = (1 - e) * 4 * U * rm; break;
      case 'rise':
        ty = (1 - e) * 11 * U * rm - o * 9 * U * rm; break;
      case 'fade': break;
      case 'grow':
        sc = e * (1 - o); op = e * (1 - clamp(o * 1.1)); break;
      default:
        ty = (1 - e) * 19 * U * rm - o * 15 * U * rm; sc = 1 + (1 - e) * 0.035 * rm + o * 0.025 * rm;
    }
    if (it.type !== 'grow' && it.type !== 'fade') ty += -fl * 3 * U * z * rm;
    if (it.type === 'grow') tf = 'scaleY(' + sc.toFixed(4) + ')';
    else if (tx || ty || sc !== 1) tf = 'translate3d(' + tx.toFixed(2) + 'px,' + ty.toFixed(2) + 'px,0) scale(' + sc.toFixed(4) + ')';
    var key = tf + '|' + op.toFixed(3);
    if (key === it.key) return;
    it.key = key;
    var s = it.el.style;
    s.transform = tf; s.opacity = op.toFixed(3);
    var mv = (a > 0 && a < 1) || (b > 0 && b < 1);
    if (mv !== it.mv) { it.mv = mv; it.el.classList.toggle('mv', mv); }
  }

    function render(now) {
    requestAnimationFrame(render);
    var dt = lastNow ? Math.min(now - lastNow, 64) : 16; lastNow = now;

    var timeAnim = state === 'loading' || (tReady && now - tReady < 3500) || (tIg && now - tIg < DUR + 900) || now < textUntil;
    if (anim) {                                   // animasi pindah section (ease-out)
      var q = clamp((now - anim.t0) / anim.dur);
      sy = anim.from + (anim.to - anim.from) * (1 - Math.pow(1 - q, 3));
      if (q >= 1) { sy = anim.to; anim = null; }
      dirty = true;
    }
    /* background wis rampung pindah -> teks section iki wiwit mlebu siji-siji */
    var cp = CH[pg];
    if (!anim && tIg && cp && (!cp.tin || cp.tout)) startIn(cp, now);
    ys = sy;
    var moving = Math.abs(ys - lastPainted) > 0.02;
    if (!moving && !timeAnim && !dirty) return;
    dirty = false; lastPainted = ys;
    var y = ys;

    /* --- lentera --- */
    if (state === 'lighting' || state === 'open') {
      var p = clamp((now - tIg) / DUR), e = 1 - Math.pow(1 - p, 3);
      var st = p < 0.001 ? 0 : (0.45 + 0.55 * Math.abs(Math.sin(now * 0.022))) * (1 - ss(0.1, 0.22, p)) + ss(0.1, 0.22, p);
      var I = p >= 1 ? 1 : e * st;
      if (I !== lastI) { drawLight(I, (now - tIg) / 1000); lastI = I; }
    } else if (lastI !== 0) { drawLight(0, 0); lastI = 0; }

    if (state === 'lighting' && locked && now - tIg > 2600) unlock();
    if (state === 'open' || state === 'lighting') cueReady = clamp((now - tIg - 4200) / 1000);

    /* --- teks halaman 1 (waktu) --- */
    var ready = state !== 'loading';
    C1.items.forEach(function (it) {
      var a = ready ? clamp((now - tReady - 250 - it.d * 900) / 1300) : 0;
      var b = tIg ? clamp((now - tIg - it.d * 380) / 900) : 0;
      paintItem(it, a, b, 0);
    });

    /* --- background: alpha + parallax --- */
    var Lh = L;
    CH.forEach(function (c) {
      c.alpha = c.i === 0 ? 1 : ss(0, 1, (y - c.bg0) / (c.bg1 - c.bg0));
    });
    CH.forEach(function (c) {
      var nx = CH[c.i + 1];
      var covered = nx && nx.alpha >= 0.999;
      var vis = c.alpha > 0.001 && !covered;
      if (vis !== c.v) { c.v = vis; c.el.classList.toggle('v', vis); var sh = shows[c.i]; if (sh) vis ? sh.start() : sh.stop(); }
      if (!vis) return;
      var pk = clamp((y - c.lifeA) / (c.lifeB - c.lifeA));
      var sc, ty;
      if (c.i === 0) { sc = 1 + 0.06 * pk; ty = -pk * 0.025 * Lh; }
      else { sc = 1 + 0.08 * (1 - pk); ty = (0.5 - pk) * 0.05 * Lh * ((sc - 1) / 0.08); }
      if (RM) { sc = 1; ty = 0; }
      var s = c.bg.style;
      s.opacity = c.alpha.toFixed(3);
      s.transform = 'translate3d(0,' + ty.toFixed(1) + 'px,0) scale(' + sc.toFixed(4) + ')';
    });

    /* --- teks per section (basis wektu: IN alon siji-siji, OUT cepet kabeh) --- */
    CH.forEach(function (c) {
      if (!c.v) return;
      var items = c.items, n = items.length, i, it, a, bq;
      for (i = 0; i < n; i++) {
        it = items[i];
        if (c.tout) { a = it.a0; bq = Math.sqrt(clamp((now - c.tout - it.od) / OUT_DUR)); }
        else if (c.tin) { a = clamp((now - c.tin - it.dl) / IN_DUR); bq = 0; }
        else { a = 0; bq = 0; }
        paintItem(it, a, bq, 0);
      }
    });
    CH.forEach(function (c) {
      var on = c.i > 0 && c.i === pg && !anim && c.tin > 0 && !c.tout && now >= c.tin;
      if (on !== c.act) { c.act = on; c.el.classList.toggle('act', on); if (c.i === 5 && on) pollWishes(true); }
    });

    /* --- petunjuk scroll --- */
    var lastC = CH[CH.length - 1];
    var cueA = cueReady * (1 - ss(lastC.inStart, lastC.inEnd, y));
    var cueEl = $('#cue'); var cs = cueA.toFixed(3);
    if (cueEl._v !== cs) { cueEl._v = cs; cueEl.style.opacity = cs; }
  }

  /* ======================================================================
     7. SLIDESHOW  (section 1 = ayat, section 7 = penutup)
     ====================================================================== */
  var shows = {};   // nomer section -> slideshow
  function makeShow(boxSel, barSel, cfg) {
    var box = $(boxSel), bar = $(barSel), cur = -1, timer = null;
    if (!box) return null;
    (cfg.gambar || []).forEach(function (f) {
      var im = new Image(); im.className = 'slide'; im.alt = ''; im.decoding = 'async'; im.draggable = false;
      im.src = (cfg.folder || 'assets/img/') + f; box.appendChild(im);
    });
    var list = $$('.slide', box);
    function setBar() { if (bar && list.length) bar.style.setProperty('--p', ((cur + 1) / list.length).toFixed(4)); }
    function go(i) {
      var n = list.length; if (!n) return;
      var next = ((i % n) + n) % n; if (next === cur && n > 1) return;
      var old = list[cur];
      if (old && old !== list[next]) {
        old.classList.remove('on'); old.classList.add('out');
        setTimeout(function () { old.classList.remove('out'); }, 2000);
      }
      var s = list[next]; s.classList.remove('out'); void s.offsetWidth; s.classList.add('on'); cur = next;
      setBar();
    }
    function stop() { clearInterval(timer); timer = null; }
    function start() {
      if (!list.length) return;
      if (cur < 0) go(0);
      clearInterval(timer);
      timer = setInterval(function () { go(cur + 1); }, cfg.jedaMs || 5200);
    }
    return { slides: list, start: start, stop: stop };
  }
  shows[1] = makeShow('#slides', '#pbar', C.slideshow || {});
  shows[7] = makeShow('#slides7', '#pbar7', C.slideshowPenutup || C.slideshow || {});
  function eachShow(fn) { Object.keys(shows).forEach(function (k) { if (shows[k]) fn(shows[k], +k); }); }
  doc.addEventListener('visibilitychange', function () {
    if (doc.hidden) { eachShow(function (sh) { sh.stop(); }); if (!audio.paused) { audio._wasOn = true; audio.pause(); } }
    else { eachShow(function (sh, k) { if (CH[k] && CH[k].v) sh.start(); }); if (audio._wasOn) { audio._wasOn = false; playMusic(); } }
  });

  /* ======================================================================
     8. COUNTDOWN
     ====================================================================== */
  (function countdown() {
    var target = new Date((C.event && C.event.akad) || '').getTime();
    var els = { d: $('#cdD'), h: $('#cdH'), m: $('#cdM'), s: $('#cdS') };
    function pad(n) { return n < 10 ? '0' + n : String(n); }
    function tick() {
      var diff = isNaN(target) ? 0 : Math.max(0, target - Date.now());
      var s = Math.floor(diff / 1000);
      els.d.textContent = pad(Math.floor(s / 86400));
      els.h.textContent = pad(Math.floor(s % 86400 / 3600));
      els.m.textContent = pad(Math.floor(s % 3600 / 60));
      els.s.textContent = pad(s % 60);
    }
    tick(); setInterval(tick, 1000);
  })();

  /* ======================================================================
     9. MUSIK
     ====================================================================== */
  function playMusic() {
    var pr = audio.play();
    if (pr && pr.then) pr.then(function () { musOk = true; showMus(); musBtn.classList.remove('muted'); }).catch(function () {});
    else { musOk = true; showMus(); musBtn.classList.remove('muted'); }
  }
  function showMus() { if (!musBtn.hidden && musBtn.classList.contains('show')) return; musBtn.hidden = false; setTimeout(function () { musBtn.classList.add('show'); }, 50); }
  (function initMusic() {
    if (!C.musik) return;
    audio.preload = 'none'; audio.src = C.musik;
    audio.addEventListener('error', function () { musOk = false; musBtn.hidden = true; });
    musBtn.addEventListener('click', function () {
      if (audio.paused) playMusic(); else { audio.pause(); musBtn.classList.add('muted'); }
    });
  })();

  /* ======================================================================
     10. DOA & UCAPAN  (Firestore REST, tanpa SDK)
     ====================================================================== */
  var wList = $('#wList'), wEmpty = $('#wEmpty'), wName = $('#wName'), wMsg = $('#wMsg'), wSend = $('#wSend');
  var FB = C.firebase || {}, SLUG = C.slug || 'undangan';
  var FSBASE = 'https://firestore.googleapis.com/v1/projects/' + FB.projectId + '/databases/(default)/documents';
  var WPATH = FSBASE + '/invitations/' + encodeURIComponent(SLUG) + '/wishes';   // sesuai firestore.rules
  var wishes = [], wishesAt = 0, sending = false, sendLabel = (T.doa || {}).tombol || 'KIRIM DOA';

  var dbg = !!query.get('debug');
  function fsFetch(url, opts) { return fetch(url, opts); }
  function fail(where, err) {
    var m = (err && err.message) || String(err);
    if (window.console) console.error('[doa:' + where + ']', m);
    if (dbg) window.alert('[' + where + '] ' + m);
  }
  /* dialog password kanggo mbusak ucapan (password = adminSecret neng config.js) */
  function askPassword(name, onOk) {
    var ov = doc.createElement('div'); ov.className = 'dlg';
    var bx = doc.createElement('div'); bx.className = 'dlg-box'; bx.setAttribute('role', 'dialog'); bx.setAttribute('aria-modal', 'true');
    var t = doc.createElement('p'); t.className = 'dlg-t'; t.textContent = 'Hapus ucapan dari ' + name + '?';
    var inp = doc.createElement('input'); inp.type = 'password'; inp.className = 'dlg-i'; inp.placeholder = 'Password';
    inp.autocomplete = 'off'; inp.maxLength = 40; inp.setAttribute('enterkeyhint', 'done'); inp.setAttribute('aria-label', 'Password');
    var er = doc.createElement('p'); er.className = 'dlg-e'; er.setAttribute('role', 'alert');
    var row = doc.createElement('div'); row.className = 'dlg-r';
    var no = doc.createElement('button'); no.type = 'button'; no.className = 'dlg-b'; no.textContent = 'BATAL';
    var ok = doc.createElement('button'); ok.type = 'button'; ok.className = 'dlg-b ok'; ok.textContent = 'HAPUS';
    row.appendChild(no); row.appendChild(ok);
    bx.appendChild(t); bx.appendChild(inp); bx.appendChild(er); bx.appendChild(row); ov.appendChild(bx);
    function close() {
      doc.removeEventListener('keydown', onKey);
      inp.blur();
      if (ov.parentNode) ov.parentNode.removeChild(ov);
    }
    function submit() {
      var sec = String(C.adminSecret || '');
      if (!sec || inp.value !== sec) { er.textContent = 'Password salah'; inp.value = ''; inp.focus(); return; }
      close(); onOk();
    }
    function onKey(e) { if (e.key === 'Escape') close(); }
    doc.addEventListener('keydown', onKey);
    no.addEventListener('click', close);
    ok.addEventListener('click', submit);
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); submit(); } });
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    doc.body.appendChild(ov);
    inp.focus();
  }
  function str(f) { return f && f.stringValue !== undefined ? f.stringValue : ''; }
  function renderWishes() {
    wList.textContent = '';
    if (!wishes.length) { wList.appendChild(wEmpty); return; }
    wishes.forEach(function (w) {
      var d = doc.createElement('div'); d.className = 'wi';
      var b = doc.createElement('b'); b.textContent = w.name;
      var p = doc.createElement('p'); p.textContent = w.msg;
      d.appendChild(b); d.appendChild(p);
      if (w.id) {
        var x = doc.createElement('button'); x.className = 'wx'; x.type = 'button'; x.textContent = '×'; x.setAttribute('aria-label', 'Hapus ucapan');
        x.addEventListener('click', function () {
          askPassword(w.name, function () {
            fsFetch('https://firestore.googleapis.com/v1/' + w.id + '?key=' + encodeURIComponent(FB.apiKey), { method: 'DELETE' })
              .then(function (r) { if (!r.ok) throw 0; wishes = wishes.filter(function (z) { return z !== w; }); renderWishes(); })
              .catch(function () { window.alert('Gagal mbusak.'); });
          });
        });
        d.appendChild(x);
      }
      wList.appendChild(d);
    });
  }
  function pollWishes(force) {
    if (!FB.projectId || !FB.apiKey) return;
    var t = Date.now(); if (!force && t - wishesAt < 25000) return; if (force && t - wishesAt < 4000) return;
    wishesAt = t;
    fsFetch(WPATH + '?pageSize=300&orderBy=' + encodeURIComponent('createdAt desc') + '&key=' + encodeURIComponent(FB.apiKey), { method: 'GET' })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (d && d.error) throw new Error(JSON.stringify(d.error));
        var out = [];
        (d.documents || []).forEach(function (doc_) {
          var f = doc_.fields || {};
          out.push({ id: doc_.name, name: str(f.name), msg: str(f.message),
            ts: (f.createdAt && f.createdAt.timestampValue) || '' });
        });
        wishes = out; renderWishes();
      })
      .catch(function (e) { fail('baca', e); });
  }
  setInterval(function () { if (CH[5] && CH[5].act && !doc.hidden) pollWishes(false); }, 30000);

  function flashBtn(txt) {
    wSend.firstChild.textContent = txt;
    setTimeout(function () { wSend.firstChild.textContent = sendLabel; wSend.disabled = false; sending = false; }, 1700);
  }
  wSend.addEventListener('click', function () {
    if (sending) return;
    var n = wName.value.trim().slice(0, 79), m = wMsg.value.trim().slice(0, 499);
    if (!n || !m) { sending = true; wSend.disabled = true; flashBtn(!n ? 'ISI NAMA' : 'ISI DOA'); return; }
    sending = true; wSend.disabled = true; wSend.firstChild.textContent = '...';
    var nowIso = new Date().toISOString();
    var body = { fields: { name: { stringValue: n }, message: { stringValue: m }, createdAt: { timestampValue: nowIso } } };
    fsFetch(WPATH + '?key=' + encodeURIComponent(FB.apiKey), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (!d || !d.name) throw new Error(JSON.stringify((d && d.error) || d));
        wishes.unshift({ id: d.name, name: n, msg: m, ts: nowIso }); renderWishes();
        wMsg.value = ''; wMsg.blur(); wName.blur();
        flashBtn('TERKIRIM');
      })
      .catch(function (e) { fail('kirim', e); flashBtn('GAGAL'); });
  });

  /* ======================================================================
     11. START
     ====================================================================== */
  var tLoad = performance.now();
  function loadImg(src) {
    return new Promise(function (res) {
      var im = new Image();
      im.onload = function () { (im.decode ? im.decode() : Promise.resolve()).then(function () { res(im); }, function () { res(im); }); };
      im.onerror = function () { res(null); };
      im.src = src;
    });
  }
  window.addEventListener('resize', (function () { var t; return function () { clearTimeout(t); t = setTimeout(measure, 120); }; })());
  window.addEventListener('orientationchange', function () { setTimeout(measure, 300); });

  measure();
  requestAnimationFrame(render);

  if (doc.fonts && doc.fonts.load) {
    ['400 16px "Playfair Display"', '500 16px "Playfair Display"', '700 16px "Playfair Display"'].forEach(function (f) { doc.fonts.load(f); });
  }
  var fontsReady = (doc.fonts && doc.fonts.ready) ? doc.fonts.ready : Promise.resolve();
  var others = {};
  var allSlides = [];
  eachShow(function (sh) { allSlides = allSlides.concat(sh.slides); });
  $$('.bgw>img').concat(allSlides).forEach(function (im) { others[im.getAttribute('src')] = 1; });
  var assetsAll = Promise.all([
    fontsReady,
    loadImg('assets/img/lentera_off.webp'),
    loadImg('assets/img/lentera_on.webp'),
    Promise.all(Object.keys(others).map(loadImg))
  ]);
  var capped = new Promise(function (res) { setTimeout(function () { res('cap'); }, 6000); });
  Promise.race([assetsAll, capped]).then(function (r) {
    var off = Array.isArray(r) ? r[1] : null, on = Array.isArray(r) ? r[2] : null;
    if (!off || !on) {
      off = new Image(); on = new Image();
      off.src = 'assets/img/lentera_off.webp'; on.src = 'assets/img/lentera_on.webp';
    }
    initGL(off, on);
    measure();
    drawLight(0, 0); lastI = 0;
    var wait = Math.max(0, 450 - (performance.now() - tLoad));      // splash minimal 0,45 detik, ben ora kedhep
    setTimeout(function () {
      state = 'idle'; tReady = performance.now();
      $('#ember').classList.add('on');
      var sp = $('#splash'); sp.classList.add('hide');
      setTimeout(function () { if (sp.parentNode) sp.parentNode.removeChild(sp); }, 900);
      pollWishes(true);
      dirty = true;
    }, wait);
  });

  /* kanggo tes / debug: ?skip=1 langsung mbukak, window.__INV.goto(i) mlumpat neng section */
  window.__INV = {
    open: function () { ignite(true); unlock(); },
    goto: function (i) { pg = Math.max(0, Math.min(CH.length - 1, i)); anim = null; sy = ys = SNAP[pg]; CH.forEach(function (c) { c.tin = 0; c.tout = 0; }); dirty = true; },
    next: function () { goPage(pg + 1); },
    prev: function () { goPage(pg - 1); },
    page: function () { return pg; },
    state: function () { return { pg: pg, sy: sy, anim: !!anim, snap: SNAP }; },
    CH: CH
  };
  if (query.get('skip') === '1') { var wt = setInterval(function () { if (state === 'idle') { clearInterval(wt); window.__INV.open(); } }, 50); }
})();
