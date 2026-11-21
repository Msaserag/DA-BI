/* Black Friday offer, two real steps per visitor, only while the campaign window is open:
     1. FIRST:  50% off for the visitor's first 48 hours (one clock per visitor, stored in this browser)
     2. FINAL:  40% off from then until CAMPAIGN_END (the same real end date for everyone)
   After CAMPAIGN_END the regular price shows. Nothing restarts: each step ends for real.
   Shared by every page on the site. Change the constants below for the next campaign. */
(function () {
  "use strict";
  var CAMPAIGN_END = Date.parse("2026-11-30T23:59:59+02:00");   // last moment the offer can be shown to anyone
  var HOURS = 48;                                              // length of each visitor's first (50%) step
  var KEY = "sg-bf26-start", TAG = "bf26";
  var REG = 10000;
  var FIRST = { pct: 50, sale: 5000 };                         // first HOURS of each visitor's clock
  var FINAL = { pct: 40, sale: 6000 };                         // afterwards, until CAMPAIGN_END

  var now = Date.now(), start = 0;
  try { start = parseInt(localStorage.getItem(KEY), 10) || 0; } catch (e) {}
  if (!start && now < CAMPAIGN_END) {
    start = now;
    try { localStorage.setItem(KEY, String(start)); } catch (e) {}
  }
  function cur() {
    var n = Date.now();
    if (!start || n >= CAMPAIGN_END) return { phase: "", pct: 0, sale: REG, end: 0 };
    var firstEnd = Math.min(start + HOURS * 36e5, CAMPAIGN_END);
    if (n < firstEnd) return { phase: "first", pct: FIRST.pct, sale: FIRST.sale, end: firstEnd };
    return { phase: "final", pct: FINAL.pct, sale: FINAL.sale, end: CAMPAIGN_END };
  }
  /* live values: they move from "first" to "final" to "" on their own, so pages never go stale */
  var O = window.sgOffer = { tag: TAG, reg: REG, campaignEnd: CAMPAIGN_END, active: function () { return cur().phase !== ""; } };
  ["phase", "pct", "sale", "end"].forEach(function (k) { Object.defineProperty(O, k, { enumerable: true, get: function () { return cur()[k]; } }); });

  /* ribbon for pages that do not have their own (crash course pages and the course preview) */
  function lang() { var h = document.documentElement; return (h.getAttribute("data-lang") || h.getAttribute("lang") || "ar").slice(0, 2) === "en" ? "en" : "ar"; }
  function fmt(n) { return n < 10 ? "0" + n : "" + n; }
  function text(ms) {
    var s = Math.floor(ms / 1e3), d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60), sc = s % 60;
    var ce = d + (d === 1 ? " day " : " days ") + fmt(h) + " hours " + fmt(m) + " min " + fmt(sc) + " sec", ca = d + " يوم " + fmt(h) + " ساعة " + fmt(m) + " دقيقة " + fmt(sc) + " ثانية";
    var sm = window.innerWidth < 640, c = cur(), fin = c.phase === "final", sale = c.sale.toLocaleString("en-US");
    return lang() === "en"
      ? { msg: fin ? (sm ? "Final days · " + c.pct + "% off · " + sale + " EGP" : "Final days offer · " + c.pct + "% off the diploma · " + sale + " EGP instead of 10,000")
                   : (sm ? "Black Friday · " + c.pct + "% off · " + sale + " EGP" : "Black Friday offer · " + c.pct + "% off the diploma · " + sale + " EGP instead of 10,000"),
          cd: ce + " left", cta: sm ? "" : (fin ? "Book now" : "Claim it") }
      : { msg: fin ? (sm ? "الأيام الأخيرة · خصم " + c.pct + "% · " + sale + " ج.م" : "عرض الأيام الأخيرة · خصم " + c.pct + "% على الدبلومة · " + sale + " ج.م بدل 10,000")
                   : (sm ? "Black Friday · خصم " + c.pct + "% · " + sale + " ج.م" : "عرض Black Friday · خصم " + c.pct + "% على الدبلومة · " + sale + " ج.م بدل 10,000"),
          cd: "متبقي " + ca, cta: sm ? "" : (fin ? "احجز الآن" : "احجز بالخصم") };
  }
  function ribbon() {
    if (!O.active() || window.sgOfferOwn || document.querySelector("x-dc,script[data-dc-script],[data-sg-own-offer]")) return;
    var src = (document.currentScript && document.currentScript.src) || "";
    var el = document.createElement("a");
    el.id = "sg-offer"; el.href = (src ? new URL("./#join", src).href : "/#join");
    el.setAttribute("style", "display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:6px 14px;padding:7px 12px;background:#FFB800;color:#1A1200;text-decoration:none;font:700 14px/1.6 Cairo,Outfit,sans-serif;text-align:center;position:relative;z-index:90");
    el.innerHTML = '<span class="m"></span><span class="c" style="padding:1px 12px;border-radius:999px;background:#1A1200;color:#FFB800;font-size:13px;font-variant-numeric:tabular-nums;direction:ltr"></span><span class="g" style="text-decoration:underline"></span>';
    document.body.insertBefore(el, document.body.firstChild);
    function tick() {
      var ms = O.end - Date.now();
      if (ms <= 0) { el.remove(); clearInterval(iv); return; }
      var t = text(ms);
      el.querySelector(".m").textContent = t.msg; el.querySelector(".c").textContent = t.cd; el.querySelector(".g").textContent = t.cta;
    }
    var iv = setInterval(tick, 1000); tick();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ribbon); else ribbon();
})();
