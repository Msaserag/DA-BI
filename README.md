# AI-Powered Data Analytics & BI Diploma

Mahmoud Serag | Turning Data Into Decisions

Live site: https://da-bi-diploma.vercel.app (main) · mirror: https://msaserag.github.io/DA-BI/

- `index.html`: diploma landing page (registration opens the Google Form, Trainee login opens the portal)
- `portal.html`: learner portal. Sign-in is checked live by the Google Apps Script backend.
- `admin.html`: admin dashboard (trainee performance, approvals, announcements). Protected by the admin password.
- `analytics.js`: Google Analytics 4, Vercel Web Analytics (Vercel only), optional Microsoft Clarity.

To connect the portal, set `API_URL` near the top of the script in `portal.html` to the Apps Script Web app URL (ends with `/exec`).

## Versions

Each release is tagged in git (for example `v2.2.0`). The Apps Script backend carries the same number
(`VERSION` at the top of the code, shown in the admin dashboard header).

| Version | Date | Changes |
|---|---|---|
| v2.2.0 | 2026-10-07 | Dashboard shows backend version and an "Open Sheet" button. Backend: WhatsApp login message fix, date cohorts, Vercel as main site, `afterUpdate()`. |
| v2.1.1 | 2026-10-04 | Vercel Web Analytics on the Vercel deployment. |
| v2.1.0 | 2026-10-01 | Admin dashboard, announcements, new-content notifications, GA4. |
| v2.0.0 | 2026-10-01 | Portal connected to the Apps Script backend (live login, approvals, progress). |
| v1 | 2026-09-30 | Static portal built from Excel (retired). |
