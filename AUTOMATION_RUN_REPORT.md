# Automation Run Report

Unattended run, 25 Sept 2026, on branch `redeveloping-aaravya`. Covers the rest of Part 4 (admin QA) and Client Changes Round 1. Everything marked *verified* was checked against a local **production build** (`next build` standalone), not just the dev server. The public pages are statically prerendered in production, so only a production build shows whether an admin edit actually reaches visitors.

## Needs my input

Items I couldn't or shouldn't resolve alone. Details are in the sections below.

1. **Sign in to the admin again.** A QA helper of mine mistakenly submitted the sidebar "Sign Out" form, which ended the admin session. I don't enter passwords on your behalf, so the rest of the admin QA ran on an isolated QA copy with the auth check stubbed (see *How admin QA ran*). No data was affected.
2. *(more items are appended below as the run continues)*

---

## Part 4: Admin Panel QA

### How admin QA ran

- **Commits 1–4** (FAQs, Cost Rules, Locations + Site Settings, Appointments) were verified earlier on a production build with a real admin session.
- **Remaining six resources:** once the session ended, I copied the working tree to a throwaway folder outside the repo and stubbed `requireAdmin()` and the proxy there, gated on a `QA_AUTH_STUB=1` env var set only on that container. Then I ran a production build of the copy against the real Supabase database and storage.
- The stub never touched the repo, git, or any deploy: `grep QA_AUTH_STUB src` in the repo returns 0 matches.

### Resource results

| Resource | Result | Issues found and fixed |
|---|---|---|
| FAQs | ✅ Pass | Homepage FAQs and FAQs linked to a condition never refreshed in production (only `/faqs` was revalidated). No server-side validation. |
| Cost Rules | ✅ Pass *(later replaced by the new Cost Estimator)* | No min ≤ max check; `/cost` showed raw enum values (`CASHLESS`) in random order. |
| Locations | ✅ Pass | Several locations could be "primary" at once; the map embed URL (rendered as an iframe) wasn't validated; the primary location could be deleted, blanking the footer. |
| Site Settings | ✅ Pass | GTM/GA4 IDs were interpolated raw into inline scripts; a blank field stored `""`, which rendered empty `tel:`/`wa.me` links; 9 pages hardcoded the phone number. |
| Appointments | ✅ Pass | **Security:** booking emails put patient-supplied text into HTML unescaped, so the hospital's own mail server could be made to send phishing links to any address typed into the form. The inbox never showed the requested date/time/notes. Unvalidated dates and time slots were accepted. |
| Doctors | ✅ Pass | See the cross-cutting fixes below. |
| Conditions | ✅ Pass | **Deleting any real condition always failed** with a raw database error: all 21 have procedures (`ON DELETE RESTRICT`). Now it explains what's blocking the delete. |
| Procedures | ✅ Pass | Delete failed with a raw error when a cost rule referenced the procedure. Now it explains. Cost range and PDF URL validated. |
| Testimonials | ✅ Pass | YouTube ID and 1–5 rating were never validated. |
| Blog | ✅ Pass | None beyond the cross-cutting fixes. |
| Gallery | ✅ Pass | The "photo items need an image" error was invisible in production. |

**Checked per resource on the production build**, as scoped:
- one create → replace → delete cycle with a real image, including storage cleanup;
- site-wide propagation (e.g. a new doctor or condition appears in the nav on `/faqs`, `/gallery` and `/about`, not just its own page);
- visible error messages;
- deletion guards;
- duplicate-slug saves leaving no orphaned files.

All tables were returned to their baseline and all buckets were left empty afterwards.

### Cross-cutting fixes

- **Stale public site in production.** Every admin edit now calls `revalidatePublicSite()` (`revalidatePath("/", "layout")`). The header and footer on every page read conditions, doctors, the primary location and settings, so per-path lists kept missing pages. I first proved the bug on an unmodified production build.
- **Invisible errors.** Next.js hides thrown server-action messages in production, and the admin error screen never showed them anyway. Admins only ever saw "This page couldn't load". Actions now return `{ error }` for expected failures (validation, bad image, duplicate slug, blocked delete, already deleted), and `AdminForm` shows it inline without wiping what the admin typed.
- **Orphaned or broken images on a failed save.** The upload helper deleted the old image *before* the database write. So a failed edit (e.g. a duplicate slug) left the record pointing at a deleted image, and a failed create orphaned the new upload. `saveWithImage()` now deletes the old file only after the write succeeds, and removes the new one if the write fails. Both cases were verified on the production build.
- **Defence in depth.** Every admin action re-checks the Supabase session itself (`requireAdmin()`). A probe on the production build showed actions were already unreachable without a session (Next binds each action to the pages that use it, and the proxy gates `/admin`), but Next recommends checking inside the action.

### Decision: contact details have one source of truth

**Problem.** Phone, WhatsApp and email were stored twice, in Site Settings and on the primary Location. The header, footer and call buttons read Settings; `/contact` read the Location. Editing one silently left the site showing two different numbers.

**Decision.** The **primary Location** is now the single source of truth for phone, WhatsApp and email. **Site Settings** keeps only genuinely site-wide values: Instagram/Facebook links and the GA4/GTM IDs.

**Why.**
- These details belong to a physical location. If a second branch is ever added, it brings its own contact details; site-wide settings can't express that.
- The Location already has validated fields for all three.
- It's the smaller change: one admin screen to maintain instead of two that must be kept in sync.

**What changed.**
- `getContactDetails()` reads the primary Location, falling back to the original numbers if a field is blank.
- The phone/WhatsApp/email fields were removed from Site Settings, which now links to the Location for them.
- The Location form explains exactly where its fields appear.
- The old `phone`/`whatsapp`/`email` `SiteSetting` rows are no longer read but were left in place, because the old live build still reads them. They can be deleted after the new deploy.

**Verified.** Changing the Location phone on the production build updated the header, footer, `/contact`, `/cost` and the symptom-checker emergency button. Then it was restored.

### Development-environment notes (not bugs in the app)

- **Docker file-watch staleness.** This caused the recurring "stale module" problems since Part 2. Next's own docs say Docker Desktop on Windows "can delay or fail to propagate filesystem events" from a Windows-hosted bind mount. The fixes are environment choices: run `npm run dev` on the host, keep the project inside WSL 2, or use Docker Desktop synchronized file shares. Restarting the container is a workaround.
- **Corrupted `.next/dev/types/routes.d.ts`.** The dev server sometimes leaves this file corrupted, even on a fresh volume. Delete `.next/dev/types/{routes.d.ts,validator.ts}` and run `npx next typegen && npx tsc --noEmit`, the check Next 16 recommends. No volume reset is needed.
