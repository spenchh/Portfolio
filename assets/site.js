(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- cursor glow + particle trail ----------
     Fine pointers only. The native cursor is left alone; this layers
     underneath it, the way the reference site does. */
  if (!reduce && window.matchMedia('(pointer: fine)').matches) {
    var glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);

    var gx = window.innerWidth / 2, gy = window.innerHeight / 2;
    var tx = gx, ty = gy;
    var moving = false, lastDot = 0;

    window.addEventListener('pointermove', function (e) {
      tx = e.clientX;
      ty = e.clientY;
      if (!moving) { moving = true; glow.classList.add('is-on'); }

      var now = e.timeStamp || Date.now();
      if (now - lastDot > 55) {
        lastDot = now;
        var dot = document.createElement('div');
        dot.className = 'trail-dot';
        var size = 4 + Math.random() * 5;
        dot.style.width = size + 'px';
        dot.style.height = size + 'px';
        dot.style.left = tx + 'px';
        dot.style.top = ty + 'px';
        dot.style.setProperty('--tx', ((Math.random() - 0.5) * 26).toFixed(1) + 'px');
        dot.style.setProperty('--ty', (10 + Math.random() * 18).toFixed(1) + 'px');
        document.body.appendChild(dot);
        setTimeout(function () { dot.remove(); }, 850);
      }
    }, { passive: true });

    document.addEventListener('pointerleave', function () { glow.classList.remove('is-on'); });
    document.addEventListener('pointerenter', function () { glow.classList.add('is-on'); });

    (function follow() {
      /* ease toward the pointer so the glow lags slightly behind it */
      gx += (tx - gx) * 0.12;
      gy += (ty - gy) * 0.12;
      glow.style.transform = 'translate3d(' + gx.toFixed(1) + 'px,' + gy.toFixed(1) + 'px,0)';
      window.requestAnimationFrame(follow);
    })();
  }

  /* ---------- scroll progress + header hairline ---------- */
  var bar = document.getElementById('bar');
  var railFill = document.getElementById('rail-fill');
  var head = document.getElementById('head');
  var tick = false;
  function onScroll() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    var p = h > 0 ? window.scrollY / h : 0;
    if (bar) bar.style.width = (p * 100) + '%';
    if (railFill) railFill.style.transform = 'scaleY(' + p.toFixed(4) + ')';
    if (head) head.classList.toggle('on', window.scrollY > 8);
    tick = false;
  }
  window.addEventListener('scroll', function () {
    if (!tick) { tick = true; window.requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* ---------- name: split to characters, spring each up ---------- */
  var name = document.querySelector('.name');
  if (name) {
    var d = 0;
    Array.prototype.forEach.call(name.querySelectorAll('.ln > span'), function (line) {
      var text = line.textContent;
      line.textContent = '';
      for (var c = 0; c < text.length; c++) {
        var ch = document.createElement('span');
        ch.className = 'ch';
        ch.textContent = text[c];
        ch.style.transitionDelay = (d * 42) + 'ms';
        line.appendChild(ch);
        d++;
      }
      d += 1;
    });
    if (reduce) name.classList.add('go');
    else requestAnimationFrame(function () {
      requestAnimationFrame(function () { name.classList.add('go'); });
    });
  }

  /* ---------- rotating display word ----------
     The container is width-locked to the widest phrase so the band never
     reflows. Measurement must happen AFTER the webfont loads, otherwise it
     is taken against fallback metrics and the last glyph gets clipped. */
  var rot = document.querySelector('.rot');
  if (rot) {
    var inner = rot.querySelector('.rot-i');
    var words = inner.children;
    var idx = 0;

    function measure() {
      rot.style.width = 'auto';
      var widest = 0;
      for (var w = 0; w < words.length; w++) {
        widest = Math.max(widest, words[w].getBoundingClientRect().width);
      }
      /* +2px guards against sub-pixel rounding shaving the final letter */
      rot.style.width = (Math.ceil(widest) + 2) + 'px';
    }

    if (reduce) {
      rot.style.width = 'auto';
      words[0].removeAttribute('data-off');
    } else {
      measure();
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(measure);
      }
      window.addEventListener('resize', measure);

      words[0].removeAttribute('data-off');
      setInterval(function () {
        words[idx].setAttribute('data-off', '');
        idx = (idx + 1) % words.length;
        inner.style.transform = 'translateY(-' + (idx * 1.28) + 'em)';
        words[idx].removeAttribute('data-off');
      }, 2900);
    }
  }

  /* ---------- split marked paragraphs into words ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('.wr'), function (el) {
    var words = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    words.forEach(function (word, n) {
      var sp = document.createElement('span');
      sp.textContent = word;
      sp.style.transitionDelay = Math.min(n * 16, 400) + 'ms';
      el.appendChild(sp);
      el.appendChild(document.createTextNode(' '));
    });
  });

  /* ---------- draw section rules on arrival ---------- */
  var heads = document.querySelectorAll('.sec-head');
  if ('IntersectionObserver' in window) {
    var ho = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); ho.unobserve(e.target); }
      });
    }, { threshold: 0.4 });
    Array.prototype.forEach.call(heads, function (h) { ho.observe(h); });
  } else {
    Array.prototype.forEach.call(heads, function (h) { h.classList.add('in'); });
  }

  /* ---------- reveal ---------- */
  var items = document.querySelectorAll('.rv, .wr');
  if (reduce || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(items, function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
    Array.prototype.forEach.call(items, function (el) { io.observe(el); });
  }

  /* ---------- active section in header ---------- */
  var links = Array.prototype.slice.call(
    document.querySelectorAll('.head nav a[href^="#"], .rail a[href^="#"]')
  );
  var secs = links
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(function (el, i, arr) { return el && arr.indexOf(el) === i; });
  if ('IntersectionObserver' in window && secs.length) {
    var vis = {};
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (e) { vis[e.target.id] = e.isIntersecting ? e.intersectionRatio : 0; });
      var best = null, top = 0;
      Object.keys(vis).forEach(function (id) { if (vis[id] > top) { top = vis[id]; best = id; } });
      links.forEach(function (a) {
        a.setAttribute('aria-current', String(best !== null && a.getAttribute('href') === '#' + best));
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.3, 0.7, 1] });
    secs.forEach(function (s) { so.observe(s); });
  }
})();
