/* Trainee testimonials on the main site.
   Shows approved quotes only (the owner approves each one in the admin dashboard > Feedback tab, and the trainee
   must have ticked "OK to publish"). If nothing is approved yet the section is simply not added.
   Standalone: re-adds itself after the page re-renders (language toggle, countdown), so nothing breaks. */
(function () {
  'use strict';
  var API_URL = 'https://script.google.com/macros/s/AKfycbxx-6Spvj33B1b49E4SHBuVDR1A-zDH3I9RSH2U-YB6JMHMIr9hI0F2txCsgmrFkTM20A/exec';
  var KEY = 'serag-voices', TTL = 10 * 60 * 1000;
  var data = null, timer = null;

  var T = {
    ar: { eyebrow: 'آراء المتدربين', title: 'اللي قالوه بعد ما جرّبوا', avg: 'متوسط التقييم', rec: 'قيّموا التجربة 4 أو 5', of: 'من', trainees: 'متدرب' },
    en: { eyebrow: 'Trainee voices', title: 'What trainees say', avg: 'average rating', rec: 'rate it 4 or 5', of: 'from', trainees: 'trainees' }
  };

  function el(tag, css, text) {
    var e = document.createElement(tag);
    if (css) e.style.cssText = css;
    if (text != null) e.textContent = text;
    return e;
  }
  function stars(n) { n = Math.max(0, Math.min(5, Math.round(n))); return '★★★★★'.slice(0, n) + '☆☆☆☆☆'.slice(0, 5 - n); }

  function build(lang) {
    var t = T[lang], sec = el('section', 'padding:clamp(56px,8vw,88px) 0;border-top:1px solid var(--line,rgba(255,255,255,.09))');
    sec.id = 'voices';
    var wrap = el('div', 'max-width:1160px;margin:0 auto;padding-inline:clamp(16px,4vw,24px)');
    wrap.appendChild(el('div', 'font-size:13px;font-weight:800;color:var(--teal-2,#00E5C3);margin-bottom:12px', t.eyebrow));
    wrap.appendChild(el('h2', 'font-size:clamp(28px,3.8vw,44px);font-weight:900;line-height:1.3;margin:0 0 28px', t.title));

    if (data.n >= 5) {
      var st = el('div', 'display:flex;flex-wrap:wrap;gap:12px 28px;align-items:baseline;margin:0 0 28px;color:var(--ink-2,rgba(228,236,255,.76));font-size:15px');
      var a = el('span', 'font-family:Outfit,sans-serif');
      a.appendChild(el('b', 'font-size:30px;color:var(--ink,#fff);margin-inline-end:6px', String(data.avg)));
      a.appendChild(document.createTextNode('/ 5 ' + t.avg));
      st.appendChild(a);
      st.appendChild(el('span', '', data.rec + '% ' + t.rec));
      st.appendChild(el('span', 'color:var(--ink-3,#8C9CC0)', t.of + ' ' + data.n + ' ' + t.trainees));
      wrap.appendChild(st);
    }

    var grid = el('div', 'display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:16px');
    data.items.forEach(function (it) {
      var c = el('figure', 'margin:0;padding:24px;border-radius:18px;background:var(--surface,rgba(255,255,255,.045));border:1px solid var(--line,rgba(255,255,255,.09));display:flex;flex-direction:column;gap:14px');
      c.appendChild(el('div', 'color:#FFC24B;letter-spacing:2px;font-size:16px;direction:ltr;text-align:start', stars(it.s)));
      var q = el('blockquote', 'margin:0;font-size:16px;line-height:1.75;color:var(--ink,#fff)', '“' + it.q + '”');
      q.setAttribute('dir', 'auto');
      c.appendChild(q);
      var cap = el('figcaption', 'margin-top:auto;font-size:14px');
      cap.appendChild(el('b', 'display:block', it.n));
      if (it.r) cap.appendChild(el('span', 'color:var(--ink-3,#8C9CC0)', it.r));
      c.appendChild(cap);
      grid.appendChild(c);
    });
    wrap.appendChild(grid);
    sec.appendChild(wrap);
    return sec;
  }

  function place() {
    if (!data || !data.items || !data.items.length) return;
    var reg = document.getElementById('register');
    if (!reg || !reg.parentNode) return;
    var root = reg.closest('[lang]'), lang = root && root.getAttribute('lang') === 'en' ? 'en' : 'ar';
    var old = document.getElementById('voices');
    if (old && old.getAttribute('data-lang') === lang && old.nextElementSibling === reg) return;
    if (old) old.remove();
    var sec = build(lang); sec.setAttribute('data-lang', lang);
    reg.parentNode.insertBefore(sec, reg);
  }
  function schedule() { clearTimeout(timer); timer = setTimeout(place, 120); }

  function load() {
    try {
      var c = JSON.parse(sessionStorage.getItem(KEY) || 'null');
      if (c && Date.now() - c.t < TTL) { data = c.d; place(); return; }
    } catch (e) {}
    fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ action: 'testimonials' }) })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (!d || !d.ok || !Array.isArray(d.items)) return;
        data = d; try { sessionStorage.setItem(KEY, JSON.stringify({ t: Date.now(), d: d })); } catch (e) {}
        place();
      }).catch(function () {});
  }

  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
  load();
})();
