/* Registration form on the main site (replaces the Google Form redirect).
   Opens as a dialog from any link to #join, posts to the Apps Script backend (action diploma_register),
   which writes the same Pending row in the Trainees sheet the Google Form used to create.
   Standalone: no framework, survives the page's language toggle and countdown re-renders. */
(function () {
  'use strict';
  var API_URL = 'https://script.google.com/macros/s/AKfycbxx-6Spvj33B1b49E4SHBuVDR1A-zDH3I9RSH2U-YB6JMHMIr9hI0F2txCsgmrFkTM20A/exec';
  var TS_KEY = '0x4AAAAAAFQCuD6m16_FLnIW';
  var WA = 'https://wa.me/201550888810';
  var q = new URLSearchParams(location.search);
  var cfId = null, cfToken = null, built = false, lastFocus = null;

  var COUNTRIES = [['Egypt', 'مصر', 'Egypt'], ['Saudi Arabia', 'السعودية', 'Saudi Arabia'], ['UAE', 'الإمارات', 'UAE'], ['Kuwait', 'الكويت', 'Kuwait'],
    ['Qatar', 'قطر', 'Qatar'], ['Bahrain', 'البحرين', 'Bahrain'], ['Oman', 'عُمان', 'Oman'], ['Jordan', 'الأردن', 'Jordan'], ['Other', 'دولة أخرى', 'Other']];
  var STARTS = [['now', 'فورًا', 'Immediately'], ['week', 'خلال أسبوع', 'Within a week'], ['month', 'خلال شهر', 'Within a month'], ['explore', 'بستكشف حاليًا', 'Just exploring']];
  var LEVELS = [['Beginner', 'مبتدئ', 'Beginner'], ['Intermediate', 'متوسط', 'Intermediate'], ['Advanced', 'متقدم', 'Advanced']];
  var LAPTOP = [['Yes', 'أيوه', 'Yes'], ['No', 'لأ', 'No'], ['Not sure', 'مش متأكد', 'Not sure']];

  var T = {
    ar: {
      title: 'سجّل في الدبلومة', sub: 'التسجيل بياخد دقيقتين، ومفيش التزام قبل ما نأكد معاك التفاصيل على واتساب.',
      nameEn: 'الاسم بالإنجليزي (زي ما هيظهر في الشهادة)', nameAr: 'الاسم بالعربي (اختياري)', email: 'بريد Google (Gmail) اللي بتستخدمه على YouTube',
      mobile: 'رقم الواتساب بكود الدولة', country: 'الدولة', start: 'ناوي تبدأ إمتى؟', job: 'المسمى الوظيفي', company: 'الشركة (اختياري)',
      excel: 'مستواك الحالي في Excel', laptop: 'عندك لابتوب Windows عليه Office 2019 أو أحدث؟', goals: 'عايز تحقق إيه من الدبلومة؟ (اختياري)',
      consent: 'أوافق على استخدام بريد Google الخاص بي لمنحي صلاحية الوصول لفيديوهات الدبلومة الخاصة، وعلى التواصل معي على واتساب أو البريد بخصوص الدبلومة.',
      pick: 'اختر', send: 'أرسل التسجيل', sending: 'جارٍ الإرسال...', close: 'إغلاق',
      okTitle: 'تم استلام تسجيلك', okTxt: 'هنتواصل معاك على واتساب لتأكيد الدفعة والدفع، وبعدها بتوصلك بيانات الدخول لبوابة المتدربين.',
      okTxt2: 'سجّلت قبل كده في الكراش كورس المجاني؟ تمام، حدّثنا بياناتك وهنفعّل حسابك الكامل بعد التأكيد.', wa: 'كلّمنا على واتساب',
      errs: {
        bad_input: 'راجع البيانات: الاسم بالإنجليزي، البريد، الواتساب، المسمى الوظيفي، والموافقة مطلوبين.',
        already_trainee: 'البريد ده مسجّل بالفعل في الدبلومة. ادخل من <a href="portal.html">بوابة المتدربين</a> أو كلّمنا على واتساب.',
        captcha_required: 'أكمل التحقق الأمني الأول.', captcha_failed: 'فشل التحقق الأمني. حدّث الصفحة وحاول تاني.',
        busy: 'الطلبات كتيرة دلوقتي. حاول بعد دقائق أو كلّمنا على واتساب.', network: 'تعذّر الاتصال. تحقق من الإنترنت وحاول تاني.',
        server_error: 'حصل خطأ مؤقت. حاول بعد شوية أو كلّمنا على واتساب.', bad_request: 'التسجيل قيد الإعداد حاليًا. كلّمنا على واتساب.'
      }
    },
    en: {
      title: 'Register for the diploma', sub: 'Registration takes two minutes, and there is no commitment until we confirm the details with you on WhatsApp.',
      nameEn: 'Full name in English (as it should appear on your certificate)', nameAr: 'Full name in Arabic (optional)', email: 'Google (Gmail) email you use on YouTube',
      mobile: 'WhatsApp number with country code', country: 'Country', start: 'When do you plan to start?', job: 'Job title', company: 'Company (optional)',
      excel: 'Your current Excel level', laptop: 'Do you have a Windows laptop with Microsoft Office 2019 or newer?', goals: 'What do you want to achieve from the diploma? (optional)',
      consent: 'I agree that my Google email will be used to give me access to the private course videos, and that I may be contacted on WhatsApp or email about the diploma.',
      pick: 'Select', send: 'Submit registration', sending: 'Sending...', close: 'Close',
      okTitle: 'Registration received', okTxt: 'We will contact you on WhatsApp to confirm the cohort and payment, then send your learner portal login.',
      okTxt2: 'You already joined the free crash course. Your details are updated and we will activate your full account after confirmation.', wa: 'Chat on WhatsApp',
      errs: {
        bad_input: 'Please check: English name, email, WhatsApp, job title and consent are required.',
        already_trainee: 'This email is already registered. <a href="portal.html">Sign in to the trainee portal</a> or message us on WhatsApp.',
        captcha_required: 'Please complete the security check first.', captcha_failed: 'Security check failed. Refresh the page and try again.',
        busy: 'Too many requests right now. Try again in a few minutes or message us on WhatsApp.', network: 'Could not connect. Check your internet and try again.',
        server_error: 'A temporary error occurred. Try again shortly or message us on WhatsApp.', bad_request: 'Registration is being set up. Please message us on WhatsApp.'
      }
    }
  };

  function lang() { return document.querySelector('div[lang="en"]') ? 'en' : 'ar'; }
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function track(n, p) { try { window.sgTrack && window.sgTrack(n, p); } catch (e) {} }
  function opts(list, i) { return list.map(function (o) { return '<option value="' + esc(o[0]) + '">' + esc(o[i]) + '</option>'; }).join(''); }

  var CSS = '#sgr{position:fixed;inset:0;z-index:100000;display:none;align-items:flex-start;justify-content:center;overflow:auto;padding:24px 14px;background:rgba(4,10,26,.72);backdrop-filter:blur(4px)}' +
    '#sgr.on{display:flex}#sgr .box{width:100%;max-width:640px;margin:auto;background:var(--solid,#12244C);color:var(--ink,#fff);border:1px solid var(--line-2,rgba(255,255,255,.18));border-radius:24px;padding:clamp(20px,3vw,32px);box-shadow:0 30px 80px rgba(0,0,0,.5);font-family:Cairo,Outfit,sans-serif;line-height:1.6}' +
    '#sgr h2{margin:0 0 6px;font-size:clamp(22px,3vw,28px);font-weight:900}#sgr .sub{margin:0 0 18px;font-size:14.5px;color:var(--ink-2,rgba(228,236,255,.76))}' +
    '#sgr .x{position:absolute;inset-inline-end:14px;top:12px;width:38px;height:38px;border-radius:50%;border:1px solid var(--line-2,rgba(255,255,255,.18));background:transparent;color:inherit;font-size:20px;cursor:pointer}' +
    '#sgr .bx{position:relative}#sgr .g{display:grid;grid-template-columns:1fr 1fr;gap:12px 14px}@media(max-width:560px){#sgr .g{grid-template-columns:1fr}}#sgr .f1{grid-column:1/-1}' +
    '#sgr label{display:block;font-size:13px;font-weight:700;margin:0 0 5px;color:var(--ink-2,rgba(228,236,255,.76))}' +
    '#sgr input,#sgr select,#sgr textarea{width:100%;box-sizing:border-box;padding:11px 13px;border-radius:12px;border:1px solid var(--line-2,rgba(255,255,255,.18));background:var(--surface,rgba(255,255,255,.06));color:inherit;font:inherit;font-size:15px}' +
    '#sgr select option{color:#0D1B3E}#sgr textarea{min-height:70px;resize:vertical}#sgr input:focus,#sgr select:focus,#sgr textarea:focus{outline:2px solid #00C9A7;outline-offset:1px}' +
    '#sgr .ck{display:flex;gap:10px;align-items:flex-start;font-size:13.5px;font-weight:500}#sgr .ck input{width:20px;height:20px;margin-top:3px;flex:none}' +
    '#sgr .go{width:100%;margin-top:6px;padding:15px;border:0;border-radius:999px;background:#00C9A7;color:#04201B;font:inherit;font-size:17px;font-weight:800;cursor:pointer}#sgr .go[disabled]{opacity:.6;cursor:progress}' +
    '#sgr .err{display:none;margin-top:12px;padding:11px 14px;border-radius:12px;background:rgba(255,90,90,.14);border:1px solid rgba(255,90,90,.4);font-size:14px}#sgr .err.on{display:block}#sgr .err a{color:inherit;font-weight:800}' +
    '#sgr .ok{display:none;text-align:center;padding:14px 4px}#sgr .ok.on{display:block}#sgr .ok b{display:block;font-size:22px;margin-bottom:8px}#sgr .ok p{margin:0 0 16px;color:var(--ink-2,rgba(228,236,255,.76))}' +
    '#sgr .ok a{display:inline-block;padding:13px 26px;border-radius:999px;background:#25D366;color:#fff;text-decoration:none;font-weight:800}';

  function build(L) {
    var t = T[L], i = L === 'ar' ? 1 : 2, dir = L === 'ar' ? 'rtl' : 'ltr';
    var st = document.getElementById('sgr-css');
    if (!st) { st = document.createElement('style'); st.id = 'sgr-css'; st.textContent = CSS; document.head.appendChild(st); }
    var old = $('sgr'); if (old) old.parentNode.removeChild(old);
    var d = document.createElement('div');
    d.id = 'sgr'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-modal', 'true'); d.setAttribute('aria-labelledby', 'sgr-t'); d.setAttribute('dir', dir); d.setAttribute('data-nomotion', '');
    d.innerHTML = '<div class="box"><div class="bx"><button type="button" class="x" id="sgr-x" aria-label="' + esc(t.close) + '">×</button>' +
      '<div id="sgr-form"><h2 id="sgr-t">' + esc(t.title) + '</h2><p class="sub">' + esc(t.sub) + '</p>' +
      '<form id="sgr-f" novalidate><div class="g">' +
      '<div><label for="sgr-n">' + esc(t.nameEn) + '</label><input id="sgr-n" autocomplete="name" dir="ltr" required></div>' +
      '<div><label for="sgr-na">' + esc(t.nameAr) + '</label><input id="sgr-na" dir="rtl"></div>' +
      '<div class="f1"><label for="sgr-e">' + esc(t.email) + '</label><input id="sgr-e" type="email" autocomplete="email" dir="ltr" required></div>' +
      '<div><label for="sgr-m">' + esc(t.mobile) + '</label><input id="sgr-m" type="tel" autocomplete="tel" dir="ltr" placeholder="+20 1xx xxx xxxx" required></div>' +
      '<div><label for="sgr-c">' + esc(t.country) + '</label><select id="sgr-c">' + opts(COUNTRIES, i) + '</select></div>' +
      '<div><label for="sgr-co">' + esc(t.start) + '</label><select id="sgr-co">' + opts(STARTS, i) + '</select></div>' +
      '<div><label for="sgr-j">' + esc(t.job) + '</label><input id="sgr-j" autocomplete="organization-title" required></div>' +
      '<div><label for="sgr-cm">' + esc(t.company) + '</label><input id="sgr-cm" autocomplete="organization"></div>' +
      '<div><label for="sgr-x1">' + esc(t.excel) + '</label><select id="sgr-x1">' + opts(LEVELS, i) + '</select></div>' +
      '<div><label for="sgr-l">' + esc(t.laptop) + '</label><select id="sgr-l">' + opts(LAPTOP, i) + '</select></div>' +
      '<div class="f1"><label for="sgr-g">' + esc(t.goals) + '</label><textarea id="sgr-g"></textarea></div>' +
      '<div class="f1"><label class="ck"><input type="checkbox" id="sgr-k"><span>' + esc(t.consent) + '</span></label></div>' +
      '<div class="f1" id="sgr-cf"></div></div>' +
      '<div class="err" id="sgr-err" role="alert"></div><button class="go" id="sgr-go" type="submit">' + esc(t.send) + '</button></form></div>' +
      '<div class="ok" id="sgr-ok" role="status"><b>' + esc(t.okTitle) + '</b><p id="sgr-okt"></p><a href="' + WA + '" target="_blank" rel="noopener">' + esc(t.wa) + '</a></div></div></div>';
    document.body.appendChild(d);
    d.addEventListener('mousedown', function (e) { if (e.target === d) close(); });
    $('sgr-x').addEventListener('click', close);
    $('sgr-f').addEventListener('submit', submit);
    cfId = null; cfToken = null;
  }

  function mountCF() {
    if (!window.turnstile) { setTimeout(mountCF, 400); return; }
    if (cfId !== null || !$('sgr-cf')) return;
    cfId = window.turnstile.render('#sgr-cf', { sitekey: TS_KEY, theme: 'dark', language: lang(),
      callback: function (t) { cfToken = t; }, 'expired-callback': function () { cfToken = null; }, 'error-callback': function () { cfToken = null; } });
  }
  function loadTurnstile() {
    if (window.turnstile || document.getElementById('sgr-ts')) return;
    var s = document.createElement('script'); s.id = 'sgr-ts'; s.async = true; s.defer = true;
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'; document.head.appendChild(s);
  }

  function open(ev) {
    if (ev) ev.preventDefault();
    lastFocus = document.activeElement;
    var L = lang(); build(L); loadTurnstile(); mountCF();
    $('sgr').classList.add('on'); document.documentElement.style.overflow = 'hidden';
    setTimeout(function () { var n = $('sgr-n'); if (n) n.focus(); }, 60);
    track('register_open', { lang: L });
    if (location.hash !== '#join') { try { history.replaceState(null, '', '#join'); } catch (e) {} }
  }
  function close() {
    var d = $('sgr'); if (d) d.classList.remove('on');
    document.documentElement.style.overflow = '';
    if (location.hash === '#join') { try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {} }
    if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) {} }
  }
  function showErr(L, code) { var e = $('sgr-err'); e.innerHTML = T[L].errs[code] || T[L].errs.server_error; e.classList.add('on'); }

  function submit(ev) {
    ev.preventDefault();
    var L = lang(), t = T[L]; $('sgr-err').classList.remove('on');
    var v = { nameEn: $('sgr-n').value.trim(), nameAr: $('sgr-na').value.trim(), email: $('sgr-e').value.trim(), mobile: $('sgr-m').value.trim(),
      country: $('sgr-c').value, start: $('sgr-co').value, job: $('sgr-j').value.trim(), company: $('sgr-cm').value.trim(),
      excel: $('sgr-x1').value, laptop: $('sgr-l').value, goals: $('sgr-g').value.trim(), consent: $('sgr-k').checked };
    if (!/^[A-Za-z][A-Za-z .'\-]{2,60}$/.test(v.nameEn) || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email) || v.mobile.replace(/\D/g, '').length < 8 || !v.job || !v.consent) { showErr(L, 'bad_input'); return; }
    var b = $('sgr-go'); b.disabled = true; b.textContent = t.sending;
    v.action = 'diploma_register'; v.cf = cfToken; v.src = q.get('utm_source') || (document.referrer ? hostOf(document.referrer) : 'direct'); v.camp = q.get('utm_campaign') || q.get('src') || '';
    fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(v) })
      .then(function (r) { return r.json(); }).catch(function () { return { ok: false, code: 'network' }; })
      .then(function (r) {
        b.disabled = false; b.textContent = t.send;
        if (window.turnstile && cfId !== null) { try { window.turnstile.reset(cfId); } catch (e) {} cfToken = null; }
        if (!r || !r.ok) { showErr(L, (r && r.code) || 'server_error'); track('register_error', { code: (r && r.code) || 'server_error' }); return; }
        track('diploma_register', { start: v.start, src: v.src });
        $('sgr-form').style.display = 'none'; $('sgr-okt').textContent = r.updated ? t.okTxt2 : t.okTxt; $('sgr-ok').classList.add('on');
      });
  }
  function hostOf(u) { try { return new URL(u).hostname; } catch (e) { return 'direct'; } }

  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href="#join"]') : null;
    if (a) open(e);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && $('sgr') && $('sgr').classList.contains('on')) close(); });
  window.addEventListener('hashchange', function () { if (location.hash === '#join' && !($('sgr') && $('sgr').classList.contains('on'))) open(); });
  if (location.hash === '#join') { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(open, 500); }); else setTimeout(open, 500); }
})();
