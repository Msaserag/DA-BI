/* Black Friday offer: 50% off for 48 hours per visitor, only while the campaign window is open.
   One clock per visitor (stored in this browser), shared by every page on the site.
   Change the three constants below for the next campaign. */
(function () {
  "use strict";
  var CAMPAIGN_END = Date.parse("2026-11-30T23:59:59+02:00");   // last moment the offer can be shown to anyone
  var HOURS = 48;                                              // length of each visitor's personal offer
  var KEY = "sg-bf26-start", TAG = "bf26";
  var REG = 10000, SALE = 5000;

  var now = Date.now(), start = 0;
  try { start = parseInt(localStorage.getItem(KEY), 10) || 0; } catch (e) {}
  if (!start && now < CAMPAIGN_END) {
    start = now;
    try { localStorage.setItem(KEY, String(start)); } catch (e) {}
  }
  var end = start ? Math.min(start + HOURS * 36e5, CAMPAIGN_END) : 0;
  var O = window.sgOffer = {
    tag: TAG, reg: REG, sale: SALE, end: end,
    active: function () { return end > Date.now(); }
  };

  /* ribbon for pages that do not have their own (crash course pages and the course preview) */
  function lang() { var h = document.documentElement; return (h.getAttribute("data-lang") || h.getAttribute("lang") || "ar").slice(0, 2) === "en" ? "en" : "ar"; }
  function fmt(n) { return n < 10 ? "0" + n : "" + n; }
  function text(ms) {
    var s = Math.floor(ms / 1e3), c = fmt(Math.floor(s / 3600)) + ":" + fmt(Math.floor(s % 3600 / 60)) + ":" + fmt(s % 60);
    var sm = window.innerWidth < 640;
    return lang() === "en"
      ? { msg: sm ? "Black Friday · 50% off · 5,000 EGP" : "Black Friday offer · 50% off the diploma · 5,000 EGP instead of 10,000", cd: c + " left", cta: sm ? "" : "Claim it" }
      : { msg: sm ? "Black Friday · خصم 50% · 5,000 ج.م" : "عرض Black Friday · خصم 50% على الدبلومة · 5,000 ج.م بدل 10,000", cd: "متبقي " + c, cta: sm ? "" : "احجز بالخصم" };
  }
  function ribbon() {
    if (!O.active() || document.querySelector("x-dc,[data-sg-own-offer]")) return;
    var src = (document.currentScript && document.currentScript.src) || "";
    var el = document.createElement("a");
    el.id = "sg-offer"; el.href = (src ? new URL("./#join", src).href : "/#join");
    el.setAttribute("style", "display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:6px 14px;padding:7px 12px;background:#FFB800;color:#1A1200;text-decoration:none;font:700 14px/1.6 Cairo,Outfit,sans-serif;text-align:center;position:relative;z-index:90");
    el.innerHTML = '<span class="m"></span><span class="c" style="padding:1px 12px;border-radius:999px;background:#1A1200;color:#FFB800;font-size:13px;font-variant-numeric:tabular-nums;direction:ltr"></span><span class="g" style="text-decoration:underline"></span>';
    document.body.insertBefore(el, document.body.firstChild);
    function tick() {
      var ms = end - Date.now();
      if (ms <= 0) { el.remove(); clearInterval(iv); return; }
      var t = text(ms);
      el.querySelector(".m").textContent = t.msg; el.querySelector(".c").textContent = t.cd; el.querySelector(".g").textContent = t.cta;
    }
    var iv = setInterval(tick, 1000); tick();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ribbon); else ribbon();
})();
