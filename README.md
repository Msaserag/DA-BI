# AI-Powered Data Analytics & BI Diploma

Mahmoud Serag | Turning Data Into Decisions

Live site: https://da-bi-diploma.vercel.app (main) · mirror: https://msaserag.github.io/DA-BI/

- `index.html`: diploma landing page (registration opens the Google Form, Trainee login opens the portal)
- `portal.html`: learner portal. Sign-in is checked live by the Google Apps Script backend.
- `admin.html`: admin dashboard (trainee performance, approvals, announcements, email center). Protected by the admin password.
- `analytics.js`: Google Analytics 4, Vercel Web Analytics (Vercel only), optional Microsoft Clarity.

To connect the portal, set `API_URL` near the top of the script in `portal.html` to the Apps Script Web app URL (ends with `/exec`).

## Versions

Each release is tagged in git (for example `v2.2.0`). The Apps Script backend carries the same number
(`VERSION` at the top of the code, shown in the admin dashboard header).

| Version | Date | Changes |
|---|---|---|
| v2.15.1 | 2026-11-10 | Portal header tidy-up: buttons grouped (Tour and Rate us, then language, theme and announcements, then the trainee name, then Password and Sign out), labels never wrap, all controls one height. Labels collapse to icons below 1180px; on phones the name and avatar are hidden so everything fits on one row. No backend change. |
| v2.17.0 | 2026-11-12 | Black Friday offer: 50% off (5,000 EGP) for 48 hours per visitor, only until 30 Nov 2026 23:59 Cairo. New `offer.js` keeps one clock per visitor in the browser (shared by all pages), drives the landing page ribbon/price, and adds a ribbon on both crash course pages and the test course page. Registrations made while the offer is active get `camp = bf26` (unless a utm campaign is set). Change the constants at the top of `offer.js` for the next campaign. |
| v2.16.0-test | 2026-11-12 | A/B test pages published next to the current site (nothing existing changed): `course.html` (public course preview, datascience365/Almentor style) and `portal-v2.html` (course cards + lesson sidebar beside the player). Both are noindex and use the same backend. `portal-v2.html` is generated from `portal.html` by `python3 tools/build_portal_v2.py`; re-run it after every portal change to keep the versions in sync. |
| v2.15.0 | 2026-11-10 | Portal **learning streak and goals**. New row under the Continue panel: streak card (day streak, XP total, Monday to Sunday week strip, weekly Goal trophy) and Goals & objectives card (weekly objective: complete 5 lectures for 10 bonus XP, plus 7 milestones behind See more: first lecture, 3 and 7 day streaks, a full chapter, 25%, 50% and 100%). Opening or ticking a lecture counts as a study day. Lecture XP and progress milestones follow the account; study days and the weekly count are stored per browser. New tour step. Arabic and English. No backend change. |
| v2.14.0 | 2026-11-08 | Messages tab: **Recently contacted** list with Send again (last 14 days), **WhatsApp groups** panel (save invite links, post a Group message: text is copied and the group opens, logged in the Message Log), 3 group templates (G1 live reminder, G2 new content, G3 weekly check-in). **Open with** switch (WhatsApp or WhatsApp Business) in the composer; saved per device and applied to every WhatsApp button in the admin (phones only). Needs backend v2.14.0 (new WA Groups sheet; falls back to browser storage on older backends). |
| v2.13.0 | 2026-11-08 | Portal guided tour. Shows once on a trainee's first sign-in (per browser), then replays from the new Tour button in the header. Welcome card plus 9 spotlight steps (progress ring, Continue panel, live sessions, search and filters, chapters, watch and tick, announcements, language and theme, support). Arabic and English, keyboard friendly (Esc, arrows), phone layout as a bottom card. No backend change. |
| v2.12.0 | 2026-11-08 | Testimonials. Admin **Feedback** tab (owner only): scores summary, review each response, edit shown name, role and quote, then Show on site / Hide. Landing page gets a "Trainee voices" section (`testimonials.js`) with approved quotes and the average rating once there are 5+ answers; it stays hidden until something is approved. Only responses with "OK to publish" can be shown. Needs backend v2.12.0 (`admin_survey_data`, `admin_survey_set`, public `testimonials`, four new Survey columns). |
| v2.11.0 | 2026-11-08 | Admin portal **Messages** tab: all 15 WhatsApp/contact templates with auto-fill from the trainee record, a due-now follow-up list, copy / WhatsApp buttons that log automatically, and a Message Log with outcome and notes. Needs backend v2.11.0 (`admin_msg_log_*`, new Message Log sheet). |
| v2.10.0 | 2026-11-08 | Trainee feedback survey in the portal (training and platform experience, recommend score, comments). Shows once automatically after the first interaction, then through the "Rate us" button until submitted; gone for good after submission. Saves to a new Survey sheet. Needs backend v2.10.0 (`survey_status`, `survey_submit`). |
| v2.9.2 | 2026-11-07 | Motion on every page (`motion.js`, no backend change): crash course page gets count-up facts, animated headline underline, hero glow and staggered reveal; trainee portal gets growing chapter bars (the progress percentage stays fixed, no animation), notification badge pulse and a done-tick pop (chapter lists never replay on re-render); the free resources hub now loads the motion layer. Client logos are re-laid as two evenly spaced marquee rows moving in opposite directions (`assets/logos-row1.jpg`, `assets/logos-row2.jpg`, built from the original collage, which stays as the fallback). |
| v2.9.1 | 2026-11-07 | Motion layer v2 (`motion.js`, no backend change): count-up stats and KPIs, hero dashboard bars grow in with a gentle float and drifting mesh, smooth accordions with a rotating plus, client logos marquee, countdown tick with a gold pulse in the last 24 hours, offer ribbon sweep. Cards, stats band and price card now reveal on scroll. Respects reduced motion. |
| v2.9.0 | 2026-10-26 | Email tab: send a live session as a Google Calendar invitation and see who accepted, declined, said maybe or has not replied. Needs backend v2.9.0, then run authorizeCalendar and afterUpdate once. |
| v2.8.2 | 2026-10-26 | Email tab: built-in templates for the first live session notice and a session reminder with a session picker that fills date and time (Arabic and English). |
| v2.8.1 | 2026-10-25 | Email tab: built-in "Last hours: 50% ends tonight + extra 10%" template (Arabic and English) for webinar registrants, skipping active trainees. No backend change needed. |
| v2.8.0 | 2026-10-22 | Email tab in the admin dashboard (owner only): send templates or custom messages to active trainees, pending registrations, webinar registrants or pasted emails, with preview, test send, send log and opt-out list. Needs backend v2.8.0, then run afterUpdate once. |
| v2.7.0 | 2026-10-21 | Trainees choose their own password at first sign-in and can change it any time (portal Password button). Login email stays automatic, WhatsApp is the manual backup. Needs backend v2.7.0. |
| v2.6.0 | 2026-10-21 | Admin dashboard: new Tools tab with links to the sheet, form, Apps Script, YouTube Studio, GitHub, Vercel, Cloudflare and analytics (owner only). |
| v2.5.0 | 2026-10-07 | Team member access on the dashboard (view and follow up). Backend: login emailed on approval, daily reminders and summary. |
| v2.4.0 | 2026-10-07 | Cloudflare Turnstile bot check on admin sign-in (always) and trainee sign-in (after 3 wrong tries). |
| v2.3.0 | 2026-10-07 | Backend: access lasts 6 months from approval instead of a fixed end date. |
| v2.2.0 | 2026-10-07 | Dashboard shows backend version and an "Open Sheet" button. Backend: WhatsApp login message fix, date cohorts, Vercel as main site, `afterUpdate()`. |
| v2.1.1 | 2026-10-04 | Vercel Web Analytics on the Vercel deployment. |
| v2.1.0 | 2026-10-01 | Admin dashboard, announcements, new-content notifications, GA4. |
| v2.0.0 | 2026-10-01 | Portal connected to the Apps Script backend (live login, approvals, progress). |
| v1 | 2026-09-30 | Static portal built from Excel (retired). |
