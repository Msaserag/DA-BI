/* Offer, two real steps, the same for every visitor:
     1. WF:     White Friday, 67% off (3,333 EGP) until WF_END (a fixed 24-hour window)
     2. FINAL:  40% off (6,000 EGP) from then until CAMPAIGN_END, applied automatically
   After CAMPAIGN_END the regular price shows. Nothing restarts: each step ends for real.
   Shared by every page on the site. Change the constants below for the next campaign. */
(function () {
  "use strict";
  var CAMPAIGN_END = Date.parse("2026-11-30T23:59:59+02:00");   // last moment any offer can be shown
  var WF_END = Date.parse("2026-11-28T21:00:00+02:00");         // end of the 24-hour White Friday window
  var TAG = "wf26", REG = 10000;
  var WF = { pct: 67, sale: 3333 };                             // until WF_END
  var FINAL = { pct: 40, sale: 6000 };                          // afterwards, until CAMPAIGN_END

  function cur() {
    var n = Date.now();
    if (n >= CAMPAIGN_END) return { phase: "", pct: 0, sale: REG, end: 0 };
    if (n < WF_END) return { phase: "wf", pct: WF.pct, sale: WF.sale, end: WF_END };
    return { phase: "final", pct: FINAL.pct, sale: FINAL.sale, end: CAMPAIGN_END };
  }
  /* live values: they move from "wf" to "final" to "" on their own, so pages never go stale */
  var O = window.sgOffer = { tag: TAG, reg: REG, campaignEnd: CAMPAIGN_END, active: function () { return cur().phase !== ""; } };
  ["phase", "pct", "sale", "end"].forEach(function (k) { Object.defineProperty(O, k, { enumerable: true, get: function () { return cur()[k]; } }); });

  /* ribbon for pages that do not have their own (crash course pages and the course preview) */
  function lang() { var h = document.documentElement; return (h.getAttribute("data-lang") || h.getAttribute("lang") || "ar").slice(0, 2) === "en" ? "en" : "ar"; }
  function fmt(n) { return n < 10 ? "0" + n : "" + n; }
  function text(ms) {
    var s = Math.floor(ms / 1e3), d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60), sc = s % 60;
    var ce = d + (d === 1 ? " day " : " days ") + fmt(h) + " hours " + fmt(m) + " min " + fmt(sc) + " sec", ca = d + " يوم " + fmt(h) + " ساعة " + fmt(m) + " دقيقة " + fmt(sc) + " ثانية";
    var sm = window.innerWidth < 640, c = cur(), fin = c.phase === "final", wf = c.phase === "wf", sale = c.sale.toLocaleString("en-US");
    return lang() === "en"
      ? { msg: wf ? (sm ? "White Friday \u00b7 " + c.pct + "% off \u00b7 " + sale + " EGP" : "White Friday offer \u00b7 " + c.pct + "% off the diploma \u00b7 " + sale + " EGP instead of 10,000 \u00b7 24 hours only")
                 : fin ? (sm ? "Final days · " + c.pct + "% off · " + sale + " EGP" : "Final days offer · " + c.pct + "% off the diploma · " + sale + " EGP instead of 10,000")
                   : (sm ? "Black Friday · " + c.pct + "% off · " + sale + " EGP" : "Black Friday offer · " + c.pct + "% off the diploma · " + sale + " EGP instead of 10,000"),
          cd: ce + " left", cta: sm ? "" : (fin ? "Book now" : "Claim it") }
      : { msg: wf ? (sm ? "White Friday \u00b7 \u062e\u0635\u0645 " + c.pct + "% \u00b7 " + sale + " \u062c.\u0645" : "\u0639\u0631\u0636 White Friday \u00b7 \u062e\u0635\u0645 " + c.pct + "% \u0639\u0644\u0649 \u0627\u0644\u062f\u0628\u0644\u0648\u0645\u0629 \u00b7 " + sale + " \u062c.\u0645 \u0628\u062f\u0644 10,000 \u00b7 24 \u0633\u0627\u0639\u0629 \u0628\u0633")
                 : fin ? (sm ? "الأيام الأخيرة · خصم " + c.pct + "% · " + sale + " ج.م" : "عرض الأيام الأخيرة · خصم " + c.pct + "% على الدبلومة · " + sale + " ج.م بدل 10,000")
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
