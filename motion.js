/* Serag motion layer v2
   Scroll reveal, count-up numbers, hero dashboard entrance, smooth accordions, logo marquee,
   countdown tick, offer ribbon sweep, hero mesh drift, hover lift, CTA shine, scroll progress, WhatsApp pulse.
   One small file for every page. Respects "reduce motion", never hides content if scripts fail.
   Safe with the DC/React runtime: it only adds classes, animates with transform/opacity, and
   updates existing text nodes in place. Keep the motion here so re-exports of the page never remove it. */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  if (window.__sMotion) return; window.__sMotion = true;
  var reduce = false;
  try { reduce = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  if (reduce) return;

  var css = [
    'html{scroll-behavior:smooth}',

    /* reveal */
    '.m-ready .m-rv{opacity:0;transform:translateY(26px) scale(.985);will-change:opacity,transform;',
    'transition:opacity .75s cubic-bezier(.2,.7,.2,1) var(--md,0ms),transform .75s cubic-bezier(.2,.7,.2,1) var(--md,0ms)}',
    '.m-ready .m-rv.m-in{opacity:1;transform:none}',
    '.m-ready .m-rv.m-done{transition:transform .28s cubic-bezier(.2,.7,.2,1),box-shadow .28s ease,border-color .28s ease,background-color .28s ease,opacity .2s;will-change:auto}',
    '.m-ready .m-card.m-done:hover{transform:translateY(-5px);box-shadow:0 18px 40px rgba(0,0,0,.22)}',

    /* CTA shine, WhatsApp pulse */
    'a.m-shine,button.m-shine{position:relative;overflow:hidden;transition:transform .2s ease,box-shadow .25s ease}',
    'a.m-shine:hover,button.m-shine:hover{transform:translateY(-2px);box-shadow:0 10px 26px rgba(0,201,167,.35)}',
    'a.m-shine:active,button.m-shine:active{transform:scale(.97)}',
    'a.m-shine::after,button.m-shine::after{content:"";position:absolute;top:0;bottom:0;left:-60%;width:40%;',
    'background:linear-gradient(100deg,transparent,rgba(255,255,255,.38),transparent);transform:skewX(-20deg);transition:left .7s ease;pointer-events:none}',
    'a.m-shine:hover::after,button.m-shine:hover::after{left:130%}',
    '.m-wa{animation:m-ring 2.6s ease-out infinite}',
    '@keyframes m-ring{0%{box-shadow:0 0 0 0 rgba(37,211,102,.55)}70%{box-shadow:0 0 0 16px rgba(37,211,102,0)}100%{box-shadow:0 0 0 0 rgba(37,211,102,0)}}',

    /* scroll progress */
    '#m-bar{position:fixed;top:0;left:0;right:0;height:3px;z-index:99999;pointer-events:none;transform-origin:0 50%;transform:scaleX(0);',
    'background:linear-gradient(90deg,#00C9A7,#3AA0FF,#FFB800)}',

    /* hero mesh drift (landing page only) */
    '.m-ready main#top>section:first-child{position:relative;isolation:isolate}',
    '.m-ready main#top>section:first-child::before{content:"";position:absolute;inset:-25% -10%;z-index:-1;pointer-events:none;',
    'background:radial-gradient(40% 40% at 20% 30%,rgba(0,87,255,.20),transparent 70%),radial-gradient(35% 35% at 80% 70%,rgba(0,201,167,.16),transparent 70%),radial-gradient(25% 25% at 60% 20%,rgba(255,184,0,.07),transparent 70%);',
    'animation:m-drift 22s ease-in-out infinite alternate}',
    '@keyframes m-drift{0%{transform:translate3d(-3%,-2%,0) scale(1)}100%{transform:translate3d(3%,3%,0) scale(1.08)}}',

    /* hero dashboard float (uses the independent translate property, so it never fights transform) */
    '.m-ready .m-float.m-done{animation:m-float 7s ease-in-out infinite}',
    '@keyframes m-float{0%,100%{translate:0 0}50%{translate:0 -8px}}',

    /* hero bars grow from the baseline */
    '.m-ready .m-bar-i{transform-origin:50% 100%;transform:scaleY(0);transition:transform .85s cubic-bezier(.2,.7,.2,1) calc(var(--i,0) * 55ms + 300ms)}',
    '.m-ready .m-bars-go .m-bar-i{transform:scaleY(1)}',

    /* accordion plus icon */
    '.m-plus{display:inline-block;transition:transform .3s cubic-bezier(.2,.7,.2,1)}',
    'details[open]>summary>.m-plus{transform:rotate(45deg)}',

    /* countdown tick and urgency pulse */
    '.m-tick{animation:m-tick .45s cubic-bezier(.2,.7,.2,1)}',
    '@keyframes m-tick{0%{transform:translateY(-6px);opacity:.35}100%{transform:none;opacity:1}}',
    '.m-urgent>div{animation:m-urgent 1.8s ease-in-out infinite}',
    '@keyframes m-urgent{0%,100%{box-shadow:0 0 0 0 rgba(255,184,0,0)}50%{box-shadow:0 0 0 4px rgba(255,184,0,.28);border-color:rgba(255,184,0,.7)}}',

    /* offer ribbon sweep */
    '.m-ribbon{position:relative;overflow:hidden}',
    '.m-ribbon::after{content:"";position:absolute;top:0;bottom:0;width:30%;left:-40%;pointer-events:none;',
    'background:linear-gradient(100deg,transparent,rgba(255,255,255,.55),transparent);animation:m-sweep 5.5s ease-in-out infinite}',
    '@keyframes m-sweep{0%,55%{left:-40%}100%{left:140%}}',

    '@media (prefers-reduced-motion:reduce){.m-ready .m-rv{opacity:1!important;transform:none!important;transition:none!important}.m-ready .m-bar-i{transform:none!important;transition:none!important}}'
  ].join('');
  var st = doc.createElement('style'); st.setAttribute('data-motion', ''); st.textContent = css; (doc.head || root).appendChild(st);

  var seen = (typeof WeakSet === 'function') ? new WeakSet() : null;
  var io = null, ioC = null, pending = [], pendingC = [];

  function reveal(el) {
    if (el.classList.contains('m-in')) return;
    el.classList.add('m-in');
    if (el.classList.contains('m-bars')) el.classList.add('m-bars-go');
    setTimeout(function () { el.classList.add('m-done'); el.style.removeProperty('--md'); }, 1000);
  }
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    ioC = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { countUp(e.target.__mC); ioC.unobserve(e.target); } });
    }, { threshold: 0.35 });
  }

  /* ---------- count-up numbers ---------- */
  var CD_LABELS = { 'يوم': 1, 'ساعة': 1, 'دقيقة': 1, 'ثانية': 1, 'days': 1, 'hours': 1, 'min': 1, 'sec': 1 };
  function fmtNum(v, dec, comma) {
    var s = v.toFixed(dec);
    return comma ? Number(s).toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }) : s;
  }
  function textNodeOf(el) {
    for (var n = el.firstChild; n; n = n.nextSibling) if (n.nodeType === 3 && n.nodeValue.trim()) return n;
    return null;
  }
  function hasDirectText(el) {
    for (var n = el.firstChild; n; n = n.nextSibling) if (n.nodeType === 3 && n.nodeValue.trim()) return true;
    return false;
  }
  function registerCounter(b) {
    if (b.__mC) return;
    var h = (b.children.length === 1 && b.firstElementChild.classList.contains('sc-interp')) ? b.firstElementChild : b;
    if (h.children.length) return;
    var t = (b.textContent || '').trim();
    var m = /^(\d[\d,]*(?:\.\d+)?)([A-Za-z%+]*)$/.exec(t);
    if (!m) return;
    var sib = b.nextElementSibling;
    if (sib && CD_LABELS[(sib.textContent || '').trim()]) return;          /* live countdown cells */
    if (b.closest('a,nav,header,button,summary,[data-nomotion]')) return;          /* ribbon, nav */
    var p = b.parentElement; if (!p || hasDirectText(p)) return;           /* inline numbers inside sentences */
    var node = textNodeOf(h); if (!node) return;
    var comma = m[1].indexOf(',') > -1, num = parseFloat(m[1].replace(/,/g, ''));
    var dec = (m[1].split('.')[1] || '').length;
    if (!isFinite(num) || num === 0 || /^0\d/.test(m[1])) return;      /* skip zero-padded labels like 01 */
    var c = { el: b, node: node, orig: node.nodeValue, target: num, dec: dec, comma: comma, suffix: m[2], ran: false };
    b.__mC = c;
    node.nodeValue = fmtNum(0, dec, comma) + m[2];
    if (ioC) ioC.observe(b); else pendingC.push(c);
    /* animate the whole stat cell in as well */
    if (p.parentElement && p.parentElement.children.length >= 3) consider(p, false);
  }
  function countUp(c) {
    if (!c || c.ran) return; c.ran = true;
    var t0 = null, dur = 1500;
    function done() { if (c.node.nodeValue !== c.orig) c.node.nodeValue = c.orig; }
    function step(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      c.node.nodeValue = fmtNum(c.target * e, c.dec, c.comma) + c.suffix;
      if (p < 1) requestAnimationFrame(step); else done();
    }
    requestAnimationFrame(step);
    setTimeout(done, dur + 1500);                                           /* failsafe */
  }

  /* ---------- reveal tagging ---------- */
  var CARD_SEL = '.blk,.fact,.card,article,details,.steps>*,.lessons>*,.lesson,.about,.final';
  var HEAD_SEL = 'section h1,section h2,section h3,.hero h1,.hero h2,.hero p,.hero .pill,.hero .btn,.sec-head,.lead';
  function consider(el, card) {
    if (seen && seen.has(el)) return;
    if (el.closest && el.closest('nav,header,[data-nomotion],#m-bar')) return;
    var pos = getComputedStyle(el).position;
    if (pos === 'fixed' || pos === 'sticky') return;
    if (seen) seen.add(el);
    el.classList.add('m-rv'); if (card) el.classList.add('m-card');
    var sib = 0, p = el.parentElement;
    if (p) { for (var c = p.firstElementChild; c && c !== el; c = c.nextElementSibling) if (c.classList.contains('m-rv')) sib++; }
    el.style.setProperty('--md', Math.min(sib, 6) * 80 + 'ms');
    if (io) io.observe(el); else pending.push(el);
  }

  /* hero bar chart: any flex-end row of 8+ children sized in percent */
  function tagBars(scope) {
    var rows = scope.querySelectorAll('div');
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i]; if (r.__mB || r.children.length < 8) continue;
      var f = r.firstElementChild; if (!f || f.style.height.indexOf('%') < 0) continue;
      var cs = getComputedStyle(r); if (cs.display !== 'flex' || cs.alignItems !== 'flex-end') continue;
      r.__mB = 1; r.classList.add('m-bars');
      for (var k = 0; k < r.children.length; k++) { r.children[k].classList.add('m-bar-i'); r.children[k].style.setProperty('--i', k); }
      if (io) io.observe(r); else pending.push(r);
    }
  }

  /* hero card gets a gentle float once it has appeared */
  function tagHeroFloat() {
    var s = doc.querySelector('main#top>section:first-child'); if (!s) return;
    var ds = s.querySelectorAll('div');
    for (var i = 0; i < ds.length; i++) {
      var d = ds[i]; if (d.__mF) continue;
      if (d.classList.contains('m-card') && parseFloat(getComputedStyle(d).borderTopLeftRadius) >= 24 && d.querySelector('.m-bars,.m-bar-i')) { d.__mF = 1; d.classList.add('m-float'); }
    }
  }

  /* smooth accordions */
  function initAccordions(scope) {
    var sums = scope.querySelectorAll('summary > span:last-child');
    for (var i = 0; i < sums.length; i++) if ((sums[i].textContent || '').trim() === '+') sums[i].classList.add('m-plus');
  }
  function animateDetails(d, s) {
    var opening = !d.open, from = d.offsetHeight, prevOv = d.style.overflow, to;
    if (opening) { d.open = true; to = d.offsetHeight; }
    else { to = s.offsetHeight + (d.offsetHeight - d.clientHeight); }
    d.__mAnim = true; d.style.overflow = 'hidden';
    var an;
    try { an = d.animate([{ height: from + 'px' }, { height: to + 'px' }], { duration: 340, easing: 'cubic-bezier(.2,.7,.2,1)' }); }
    catch (e) { d.__mAnim = false; d.style.overflow = prevOv; d.open = opening; return; }
    var fin = function () {
      if (!d.__mAnim) return; d.__mAnim = false;
      if (!opening) d.open = false;
      d.style.overflow = prevOv;
    };
    an.onfinish = fin; an.oncancel = fin;
  }
  doc.addEventListener('click', function (e) {
    var s = e.target && e.target.closest ? e.target.closest('summary') : null;
    if (!s) return;
    var d = s.parentElement;
    if (!d || d.tagName !== 'DETAILS' || !d.animate || d.closest('[data-nomotion]')) return;
    e.preventDefault();
    if (d.__mAnim) return;
    animateDetails(d, s);
  }, true);

  /* client logos as a seamless marquee */
  function initMarquee() {
    var img = doc.querySelector('img[src*="client-logos"]');
    if (!img || img.__mq || !img.parentElement || !img.animate) return;
    var p = img.parentElement, clone = img.cloneNode(false), anims = [];
    img.__mq = 1; clone.__mq = 1;
    img.setAttribute('data-nomotion', ''); clone.setAttribute('data-nomotion', '');
    clone.setAttribute('alt', ''); clone.setAttribute('aria-hidden', 'true');
    p.setAttribute('dir', 'ltr');
    p.style.display = 'flex'; p.style.overflow = 'hidden';
    function build() {
      anims.forEach(function (a) { try { a.cancel(); } catch (e) {} }); anims = [];
      var w = Math.max(280, Math.min(980, p.clientWidth - 36));
      [img, clone].forEach(function (im) {
        im.style.flex = '0 0 auto'; im.style.width = w + 'px'; im.style.maxWidth = 'none'; im.style.margin = '0';
        anims.push(im.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-' + w + 'px)' }], { duration: Math.round(w * 28), iterations: Infinity, easing: 'linear' }));
      });
    }
    p.appendChild(clone);
    build();
    p.addEventListener('mouseenter', function () { anims.forEach(function (a) { a.pause(); }); });
    p.addEventListener('mouseleave', function () { anims.forEach(function (a) { a.play(); }); });
    var rt; addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(build, 200); });
  }

  /* countdown: tick on change, gold pulse in the last 24 hours */
  function initCountdown() {
    var bs = doc.querySelectorAll('b');
    for (var i = 0; i < bs.length; i++) {
      var b = bs[i]; if (b.__mT) continue;
      var sib = b.nextElementSibling;
      if (!sib || !CD_LABELS[(sib.textContent || '').trim()]) continue;
      var grid = b.parentElement && b.parentElement.parentElement; if (!grid) continue;
      b.__mT = 1;
      (function (cell, grid) {
        try {
          new MutationObserver(function () {
            cell.classList.remove('m-tick'); void cell.offsetWidth; cell.classList.add('m-tick');
            var first = grid.querySelector('b');
            if (first && (first.textContent || '').trim() === '00') grid.classList.add('m-urgent'); else grid.classList.remove('m-urgent');
          }).observe(cell, { characterData: true, childList: true, subtree: true });
        } catch (e) {}
      })(b, grid);
    }
  }

  function scan() {
    var i, n;
    var list = doc.querySelectorAll(CARD_SEL);
    for (i = 0; i < list.length; i++) consider(list[i], true);
    list = doc.querySelectorAll(HEAD_SEL);
    for (i = 0; i < list.length; i++) consider(list[i], false);
    /* inline-styled cards (the main site): large rounded boxes inside sections, read from computed style */
    var secs = doc.querySelectorAll('section');
    for (i = 0; i < secs.length; i++) {
      var ds = secs[i].querySelectorAll('div,a,figure,img');
      for (n = 0; n < ds.length; n++) {
        var d = ds[n]; if (seen && seen.has(d)) continue;
        var anc = d.closest('.m-rv'); if (anc && anc !== d) continue;
        if (d.tagName !== 'IMG') {
          if (parseFloat(getComputedStyle(d).borderTopLeftRadius) < 14) continue;
        }
        if (d.offsetWidth < 160 || d.offsetHeight < 70) continue;
        consider(d, d.tagName !== 'IMG');
      }
    }
    tagBars(doc);
    var bs = doc.querySelectorAll('main b, section b');
    for (i = 0; i < bs.length; i++) registerCounter(bs[i]);
    tagHeroFloat();
    initAccordions(doc);
    initCountdown();
    initMarquee();
    tagButtons();
    var was = doc.querySelectorAll('.wa,a[aria-label="WhatsApp"]');
    for (i = 0; i < was.length; i++) was[i].classList.add('m-wa');
  }

  /* the runtime can reset class names when it re-renders, so button classes are re-applied from the class itself */
  function tagButtons() {
    var i, btns = doc.querySelectorAll('a,button');
    for (i = 0; i < btns.length; i++) {
      var b = btns[i]; if (b.classList.contains('m-shine') || b.classList.contains('m-ribbon')) continue;
      var bg = getComputedStyle(b).backgroundColor;
      if (/^rgb\(0,\s*201,\s*167\)$/.test(bg) || b.classList.contains('btn') || (b.classList.contains('watch') && b.classList.contains('go'))) { b.classList.add('m-shine'); }
      else if (/^rgb\(255,\s*184,\s*0\)$/.test(bg) && b.getAttribute('href') === '#register' && b.offsetWidth > 300) { b.classList.add('m-ribbon'); }
    }
    var was = doc.querySelectorAll('.wa,a[aria-label="WhatsApp"]');
    for (i = 0; i < was.length; i++) if (!was[i].classList.contains('m-wa')) was[i].classList.add('m-wa');
  }

  var timer = null;
  function later() { clearTimeout(timer); timer = setTimeout(scan, 140); }

  function bar() {
    var b = doc.createElement('div'); b.id = 'm-bar'; doc.body.appendChild(b);
    var tick = false;
    function upd() {
      tick = false;
      var h = root.scrollHeight - innerHeight;
      b.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, scrollY / h) : 0) + ')';
    }
    addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(upd); } }, { passive: true });
    upd();
  }

  function start() {
    root.classList.add('m-ready');
    scan(); bar();
    try { new MutationObserver(function (ms) {
      for (var i = 0; i < ms.length; i++) if (ms[i].addedNodes && ms[i].addedNodes.length) { later(); return; }
    }).observe(doc.body, { childList: true, subtree: true }); } catch (e) {}
    /* failsafe: never leave content hidden or numbers at zero */
    setTimeout(function () {
      var l = doc.querySelectorAll('.m-rv:not(.m-in),.m-bars:not(.m-bars-go)');
      for (var i = 0; i < l.length; i++) { var r = l[i].getBoundingClientRect(); if (r.top < innerHeight * 1.2) reveal(l[i]); }
    }, 2500);
    setTimeout(function () {
      var cs = doc.querySelectorAll('b');
      for (var i = 0; i < cs.length; i++) {
        var c = cs[i].__mC; if (!c || c.ran) continue;
        var r = cs[i].getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) countUp(c);
      }
    }, 3000);
    setInterval(tagButtons, 1500);
    if (!io) { pending.forEach(reveal); pendingC.forEach(countUp); }
  }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', start); else start();
  addEventListener('load', function () { setTimeout(scan, 400); setTimeout(scan, 1600); });
})();
