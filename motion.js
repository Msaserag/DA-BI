/* Serag motion layer: scroll reveal, hover lift, CTA shine, scroll progress, WhatsApp pulse.
   One small file for every page. Respects "reduce motion", never hides content if scripts fail. */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  if (window.__sMotion) return; window.__sMotion = true;
  var reduce = false;
  try { reduce = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  if (reduce) return;

  var css = [
    'html{scroll-behavior:smooth}',
    '.m-ready .m-rv{opacity:0;transform:translateY(26px) scale(.985);will-change:opacity,transform;',
    'transition:opacity .75s cubic-bezier(.2,.7,.2,1) var(--md,0ms),transform .75s cubic-bezier(.2,.7,.2,1) var(--md,0ms)}',
    '.m-ready .m-rv.m-in{opacity:1;transform:none}',
    '.m-ready .m-rv.m-done{transition:transform .28s cubic-bezier(.2,.7,.2,1),box-shadow .28s ease,border-color .28s ease,background-color .28s ease,opacity .2s}',
    '.m-ready .m-card.m-done:hover{transform:translateY(-5px);box-shadow:0 18px 40px rgba(0,0,0,.22)}',

    'a.m-shine,button.m-shine{position:relative;overflow:hidden;transition:transform .2s ease,box-shadow .25s ease}',
    'a.m-shine:hover,button.m-shine:hover{transform:translateY(-2px);box-shadow:0 10px 26px rgba(0,201,167,.35)}',
    'a.m-shine:active,button.m-shine:active{transform:scale(.97)}',
    'a.m-shine::after,button.m-shine::after{content:"";position:absolute;top:0;bottom:0;left:-60%;width:40%;',
    'background:linear-gradient(100deg,transparent,rgba(255,255,255,.38),transparent);transform:skewX(-20deg);transition:left .7s ease;pointer-events:none}',
    'a.m-shine:hover::after,button.m-shine:hover::after{left:130%}',
    '.m-wa{animation:m-ring 2.6s ease-out infinite}',
    '@keyframes m-ring{0%{box-shadow:0 0 0 0 rgba(37,211,102,.55)}70%{box-shadow:0 0 0 16px rgba(37,211,102,0)}100%{box-shadow:0 0 0 0 rgba(37,211,102,0)}}',
    '#m-bar{position:fixed;top:0;left:0;right:0;height:3px;z-index:99999;pointer-events:none;transform-origin:0 50%;transform:scaleX(0);',
    'background:linear-gradient(90deg,#00C9A7,#3AA0FF,#FFB800)}',
    '@media (prefers-reduced-motion:reduce){.m-ready .m-rv{opacity:1!important;transform:none!important;transition:none!important}}'
  ].join('');
  var st = doc.createElement('style'); st.setAttribute('data-motion', ''); st.textContent = css; (doc.head || root).appendChild(st);

  var seen = (typeof WeakSet === 'function') ? new WeakSet() : null;
  var io = null, pending = [];
  function reveal(el) {
    if (el.classList.contains('m-in')) return;
    el.classList.add('m-in');
    setTimeout(function () { el.classList.add('m-done'); el.style.removeProperty('--md'); }, 1000);
  }
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  }

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
  function scan() {
    var i, n;
    var list = doc.querySelectorAll(CARD_SEL);
    for (i = 0; i < list.length; i++) consider(list[i], true);
    list = doc.querySelectorAll(HEAD_SEL);
    for (i = 0; i < list.length; i++) consider(list[i], false);
    // inline-styled cards (the main site): large rounded boxes inside sections
    var secs = doc.querySelectorAll('section');
    for (i = 0; i < secs.length; i++) {
      var ds = secs[i].querySelectorAll('div,a,figure,img');
      for (n = 0; n < ds.length; n++) {
        var d = ds[n]; if (seen && seen.has(d)) continue;
        if (d.closest('.m-rv') && d.closest('.m-rv') !== d) continue;
        var r = d.getAttribute('style') || '';
        if (!/border-radius:\s*(1[4-9]|[2-9]\d)px/.test(r) && d.tagName !== 'IMG') continue;
        if (d.offsetWidth < 160 || d.offsetHeight < 70) continue;
        consider(d, d.tagName !== 'IMG');
      }
    }
    var btns = doc.querySelectorAll('a,button');
    for (i = 0; i < btns.length; i++) {
      var b = btns[i]; if (b.__mS) continue;
      var bg = getComputedStyle(b).backgroundColor;
      if (/^rgb\(0,\s*201,\s*167\)$/.test(bg) || b.classList.contains('btn') || (b.classList.contains('watch') && b.classList.contains('go'))) { b.__mS = 1; b.classList.add('m-shine'); }
    }
    var was = doc.querySelectorAll('.wa,a[aria-label="WhatsApp"]');
    for (i = 0; i < was.length; i++) was[i].classList.add('m-wa');
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
    // failsafe: never leave content hidden
    setTimeout(function () { var l = doc.querySelectorAll('.m-rv:not(.m-in)'); for (var i = 0; i < l.length; i++) { var r = l[i].getBoundingClientRect(); if (r.top < innerHeight * 1.2) reveal(l[i]); } }, 2500);
    if (!io) pending.forEach(reveal);
  }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', start); else start();
  addEventListener('load', function () { setTimeout(scan, 400); setTimeout(scan, 1600); });
})();
