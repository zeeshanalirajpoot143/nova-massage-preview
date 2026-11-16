# NOVA Massage — Project Backup & Resume Guide
**Backup snapshot:** 2026-11-17  
**Repository:** https://github.com/zeeshanalirajpoot143/nova-massage-preview  
**Branch:** `nova-client-preview-sync`  
**Snapshot commit:** `2294d6ba7bc8f17bb2ddc9da35f5271ad5a28f7e`  
**Client:** Nadia / NOVA Massage  
**Status:** Paused preview development; not approved as final production release.

## 1. Safety and source-of-truth
- This backup documents the preview branch only. Do not merge it into `main` or deploy it as the production site without Nadia's approval and a complete test.
- The GitHub repository contains the source tree at the snapshot commit. Download the branch ZIP from the repository's GitHub Code menu whenever a full source archive is needed.
- Never commit or include passwords, API keys, session secrets, Square tokens, customer data, or private account credentials. Recreate secrets securely in the owner's Cloudflare account.
- The current repository is public. Before adding any sensitive configuration or private client data, make it private or move secrets out of source control.

## 2. Files present in this snapshot
- Public website: `index.html`, `style.css`, `script.js`
- Admin UI: `admin.html`, `admin.css`, `admin.js`
- Booking page: `book.html`
- Worker/API and AI concierge: `worker.js`
- Cloudflare configuration: `wrangler.jsonc`
- Database schema: `schema.sql`
- Migration: `migrations/0002_callback_requests.sql`
- Setup notes: `ADMIN-SETUP.md`
- Site controls: `site-controls.js`
- Legal pages: `privacy_policy.html`, `t&c.html`
- SEO/support files: `robots.txt`, `nova-favicon.svg`
- Assets: `images/`, `videos/video.mp4`

## 3. Website and UX work recorded
- Premium spa-style responsive website structure and styling.
- Service content/cards, imagery, booking calls-to-action, customer review area, contact/callback flows, privacy and terms pages.
- Mobile heading typography and callback request visibility were adjusted in the latest known commit.
- The main phone contact is **+1 (708) 400-9333**. It is a phone number, not a WhatsApp number. Do not add WhatsApp claims or links unless Nadia separately verifies and authorizes them.
- Callback wording: **“Busy right now? Request a call back.”**
- AI health check is expected at `/api/health`.

## 4. Square booking and add-ons — previously configured/tested
- Square Appointments remains the actual customer booking/appointment system; website-side internal appointment records are not a replacement for Square appointments.
- A booking widget was embedded and the user tested selecting Deep Tissue and proceeding to time/contact details.
- Square modifier set: **Optional Treatment Add-ons**.
- Three optional modifiers applied to 17 main treatment services:
  - TMJ Add-on — $50
  - Head Heaven Add-on — $15
  - Pedi Pampering Add-on — $25
- Modifiers were configured as optional, multiple selections allowed, and not preselected. The user tested selecting all three in the appointment summary/edit flow.
- A channel named **Online Booking — NOVA Massage Booking** was enabled.
- Generic booking links were updated in 33 occurrences; approximately 15 per-service booking URLs were still noted as needing replacement/verification.
- Remaining Square checks: verify each service-specific URL, correct price/duration, complete customer checkout and total, availability/timezone, confirmation/reminders, cancellation/deposit/card-on-file/no-show rules, and mobile booking.
- Mobile service fee is $40; Nadia still needs to confirm whether it is per booking or per treatment. Address collection and fee display must not be claimed live until implemented and tested.
- Do not delete the standalone add-on services in Square. Exact service name “TMG + Upper Body Deep Tissues” should not be confused with “TMJ”.

## 5. AI Concierge
- `worker.js` contains the Cloudflare Workers AI integration and uses model `@cf/meta/llama-3.3-70b-instruct-fp8-fast`.
- `wrangler.jsonc` declares the Workers AI binding as `AI`.
- Worker health endpoint checks whether `env.AI` exists; AI binding must also be configured in the actual Cloudflare deployment.
- Prompt context includes service/pricing/add-on and booking guidance, phone contact, callback and review guidance, with caveats around mobile service and address.
- AI is an information concierge, not an autonomous website/admin operator. It cannot independently edit site data, access Nadia's accounts, or create/confirm/cancel Square appointments without additional authorized APIs.
- Test `/api/health` and real customer questions on preview and production before launch. Do not promise that AI is live merely because source code exists.

## 6. Admin Dashboard and database
- Admin entry page: `/admin.html`.
- Admin front end: `admin.html`, `admin.css`, `admin.js`; API and storage logic is in `worker.js`.
- D1 schema includes services, reviews, customers, internal appointments, invoices, service add-ons, site settings and callback requests.
- Reviews are designed to be moderated (pending/approved/hidden).
- Internal invoices are draft/admin records; they do not automatically charge a card or send a payment request.
- Internal appointments are not imported Square appointments unless a Square API sync is built and authorized.
- Before enabling admin for Nadia: create D1, execute `schema.sql`, apply migration `migrations/0002_callback_requests.sql` if needed, bind D1 as `DB`, set fresh `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` as Cloudflare secrets, verify Assets binding `ASSETS`, then test login and every admin action.
- Ensure the service editor maps each approved service to its correct image and Square booking URL before switching public service cards to database-driven data.

## 7. Cloudflare / deployment
- Cloudflare Pages/Worker preview project previously referenced: `nova-massage-preview`.
- The preview repository/branch is `zeeshanalirajpoot143/nova-massage-preview` / `nova-client-preview-sync`.
- `wrangler.jsonc` defines Worker entry `worker.js`, Assets binding `ASSETS`, and AI binding `AI`.
- Confirm actual Cloudflare project connection, D1 binding `DB`, AI binding `AI`, and secret values in the target account; source config alone does not prove the dashboard settings are active.
- Previous work mentioned failed/skipped deployment attempts and a “Fix Admin API Route” build marked Ready. The actual end-to-end deployment and API functionality were not conclusively verified in the saved project notes.
- Never assume a build is live just because a commit exists. Check the latest build logs and test the deployed preview URL.

## 8. SEO, content and launch tasks still to do
- Finalize SEO titles/descriptions, service-specific content/keywords, headings, image alt text, canonical URLs, sitemap and robots rules.
- Verify Google Search Console ownership and submit the sitemap after the final domain/URL is selected.
- Align local SEO and Google Business Profile details with Nadia's confirmed business information.
- Confirm the correct business address; do not publish an unverified/conflicting address.
- Test every navigation item, booking CTA, callback form, review submission/moderation, AI endpoint, admin CRUD, mobile layout and legal links.
- Preserve authentic existing reviews and service details.
- Confirm all final service names, descriptions, prices, durations and images against Nadia's approved Square catalogue.

## 9. Payment scope and third-party costs
- Square booking remains the current booking/payment route subject to Nadia's merchant account configuration.
- Do not show PayPal/Venmo or other gateways as enabled until the merchant account, API credentials, secure server-side handling and full checkout tests are complete.
- PayPal/Venmo integration and automatic payment reconciliation with Square are separate additional work unless explicitly agreed.
- Transaction fees are charged by payment providers. Custom domain registration/renewal, paid hosting/upgrades, AI usage beyond free allowances, storage and third-party subscriptions are separate from development fees and are paid by Nadia if required.
- Free Cloudflare Pages `pages.dev` hosting may be used within plan limits; a custom domain is separately purchased/renewed.

## 10. Known historical deployment issues to investigate
Before attempting another deployment, review the intent and changes behind these previously failed/uncertain build labels:
- “Add appointment invoice status”
- “Document expanded admin module”
- “Restore Nova site instructions end”
- “Align AI setup guide with configured”
Also re-check the previously reported “Fix Admin API Route” Ready build with a real API/admin test.

## 11. Resume sequence
1. Confirm Nadia wants to resume and agree the remaining scope/budget.
2. Confirm the latest source branch and snapshot commit; make a fresh backup before edits.
3. Review Cloudflare build history and the four failed/uncertain change sets listed above.
4. Verify Square catalogue, per-service links, modifiers, booking flow and mobile fee decision.
5. Configure D1, migrations, `DB`, `AI`, `ASSETS`, and admin secrets in the owner's Cloudflare account.
6. Test admin, AI, callback, reviews and public booking end-to-end on preview.
7. Finish SEO/Search Console, content accuracy, responsive QA and security review.
8. Obtain Nadia's approval before production deployment or any change to `main`.
9. Handover account ownership, admin login setup and a fresh source archive to Nadia.

## 12. Snapshot integrity
This document records the state and project knowledge available on 2026-11-17. It does not certify that all integrations are live, that every UI control is complete, or that the project is production-ready. Treat the repository at the snapshot commit as the source snapshot and this document as the resume checklist.
