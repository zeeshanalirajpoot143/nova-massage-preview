# NOVA MASSAGE preview — Cloudflare setup

## Current architecture
- Static public site served by the Cloudflare Worker Assets binding.
- Existing Square Appointments link remains the live booking checkout and appointment system.
- Public customer reviews are submitted to the Worker API and remain pending until approved in the admin dashboard.
- Admin dashboard: `/admin.html`.
- Services and review moderation are stored in Cloudflare D1.
- Contact form email delivery remains on the existing FormSubmit route. Square booking confirmations/reminders remain controlled by the Square merchant account.

## Required Cloudflare setup before enabling the admin panel
1. Create a Cloudflare D1 database for Nova Massage.
2. In the D1 console, execute the full contents of `schema.sql`.
3. In the Worker settings, add a D1 database binding named exactly `DB` and select the database created above.
4. Add Worker secrets:
   - `ADMIN_PASSWORD`: a new, unique admin password chosen by the site owner.
   - `ADMIN_SESSION_SECRET`: a long random secret (at least 32 random bytes).
5. Ensure the Worker has an Assets binding named `ASSETS` pointing to the site files.
6. Deploy the preview branch and test `/api/health`, `/admin.html`, login, review submission and moderation.

## Important
- Do not commit passwords, API keys, Square credentials or session secrets to GitHub.
- Do not expose the admin route as production-ready until the D1 binding and both secrets are configured and tested.
- Square booking availability, tipping options, add-ons, customer appointment records, automated confirmations and reminders are configured in Square. The website does not fabricate or store Square appointment data.
- Email notifications for contact enquiries are currently delivered through the existing FormSubmit configuration. Appointment notifications come from Square according to the merchant's notification settings.
- The services editor stores service records in D1. Before replacing the existing live service cards with database-driven cards, map each existing service to its approved image and Square booking URL to avoid losing accurate treatment details or booking destinations.

7. To enable the 24/7 AI Concierge, add a Workers AI binding named exactly `AI` to the Worker. The assistant endpoint uses Cloudflare Workers AI model `@cf/meta/llama-3.1-8b-instruct`. Test the endpoint and review its answers before production.
8. The WhatsApp quick-contact button currently opens the existing studio phone number in WhatsApp. Confirm the number is registered with WhatsApp Business before launch.
9. Payment gateway expansion: Square remains the current booking destination. Do not display PayPal, Venmo, or card payment badges as enabled until the merchant account and a real payment/checkout flow have been configured and tested. Never store card details in this website.
