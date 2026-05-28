# Cloudflare Deployment

This app is configured for Cloudflare Workers with static assets through the Cloudflare Vite plugin. Cloudflare serves the built client assets and runs the TanStack Start server entry as a Worker.

## Local Checks

Before deploying:

```sh
npm run check:deploy
```

That runs lint and production build.

## Required Variables

Set these as Cloudflare runtime variables/secrets:

```txt
SUPABASE_URL
SUPABASE_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY
```

Set these as Cloudflare build-time variables so Vite can compile the browser bundle:

```txt
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
```

Use the same Supabase project URL for `SUPABASE_URL` and `VITE_SUPABASE_URL`.
Use the same publishable key for `SUPABASE_PUBLISHABLE_KEY` and `VITE_SUPABASE_PUBLISHABLE_KEY`.
Keep `SUPABASE_SERVICE_ROLE_KEY` server-only. Never expose it as a `VITE_` variable.

Cloudflare has separate places for build-time variables and runtime Worker variables. The Git build/deploy wizard variables are not enough for `/setup`; add the runtime values under the deployed Worker:

Workers & Pages > me > Settings > Variables and Secrets

Add them to the Production environment. Use raw values with no quotes.

`wrangler.jsonc` sets `keep_vars: true` so `npx wrangler deploy` preserves runtime variables configured in the Cloudflare dashboard.

## Cloudflare Dashboard Setup

1. Push this repo to GitHub.
2. In Cloudflare, create a new Workers application from a Git repository.
3. Connect the GitHub repo and select the production branch.
4. Use:
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy`
   - Root directory: repo root
5. Add the build-time `VITE_*` variables.
6. Add the runtime Supabase variables/secrets.
7. Deploy.

## Custom Domain

The production domain is `https://wxl3.com`.

After the Worker deploys successfully:

1. Add `wxl3.com` to Cloudflare as a website/zone.
2. Copy the Cloudflare nameservers assigned to the zone.
3. In GoDaddy, replace the domain's nameservers with the Cloudflare nameservers.
4. In Cloudflare, add `wxl3.com` as a Worker custom domain.
5. Optional: also add `www.wxl3.com` and redirect it to `https://wxl3.com`.

`siteConfig.siteUrl`, `robots.txt`, and `sitemap.xml` already use `https://wxl3.com`.

## GoDaddy DNS Setup

Do not add semicolon-separated DNS records in GoDaddy, and do not create manual A/CNAME records in GoDaddy for the Worker. For a Cloudflare Worker custom domain, delegate DNS to Cloudflare by changing the domain's nameservers at GoDaddy.

Before changing nameservers, copy any existing email-related records from GoDaddy into the Cloudflare DNS zone:

- MX records
- SPF TXT record
- DKIM TXT/CNAME records
- DMARC TXT record
- Any verification TXT records

Then update GoDaddy:

1. Sign in to GoDaddy.
2. Open the Domain Portfolio.
3. Select `wxl3.com`.
4. Go to DNS > Nameservers.
5. Choose the option to use your own/custom nameservers.
6. Paste the two Cloudflare nameservers assigned to `wxl3.com`.
7. Save and approve any verification prompts.

After propagation, DNS records for `wxl3.com` are managed in Cloudflare, not GoDaddy.

## Notes

- `public/resume.pdf`, icons, Open Graph image, `robots.txt`, and `sitemap.xml` are static assets.
- `/setup`, `/login`, `/reset-password`, and `/admin` are page-level `noindex,nofollow,noarchive`.
- Do not commit `.env`, `.env.local`, `.dev.vars`, or any file containing `SUPABASE_SERVICE_ROLE_KEY`.
