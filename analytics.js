/* Serag site analytics: Google Analytics 4 + Microsoft Clarity (both free).
   Paste your IDs below. Leave empty to keep tracking off. */
const SG_GA4_ID = "G-C9T3V3L3Z2";        // e.g. "G-ABC123XYZ9"  (analytics.google.com > Admin > Data streams)
const SG_CLARITY_ID = "";    // e.g. "abcd1234ef"    (clarity.microsoft.com > Settings > Overview)

(function () {
  "use strict";
  var page = location.pathname.split("/").pop() || "index.html";
  if (/^admin/i.test(page)) { window.sgTrack = function () {}; return; }   // never track the admin dashboard

  var queue = [];
  window.sgTrack = function (name, params) {
    try {
      if (window.gtag) window.gtag("event", name, params || {});
      else queue.push([name, params]);
      if (window.clarity) window.clarity("event", name);
    } catch (e) {}
  };

  if (SG_GA4_ID) {
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(SG_GA4_ID);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", SG_GA4_ID, { page_title: document.title });
    queue.forEach(function (q) { window.gtag("event", q[0], q[1] || {}); });
    queue = [];
  }

  if (SG_CLARITY_ID) {
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", SG_CLARITY_ID);
  }

  // Click events on the public pages
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a) return;
    var href = a.getAttribute("href") || "";
    if (/forms\.gle|docs\.google\.com\/forms/i.test(href)) window.sgTrack("register_click", { page: page });
    else if (/wa\.me|whatsapp/i.test(href)) window.sgTrack("whatsapp_click", { page: page });
    else if (/portal\.html/i.test(href) && !/portal/i.test(page)) window.sgTrack("portal_click", { page: page });
  }, true);
})();
