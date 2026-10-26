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
| v2.8.2 | 2026-10-26 | Email tab: built-in templates for the first live session notice and a session reminder with a session picker that fills date, time and topic (Arabic and English). |
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
