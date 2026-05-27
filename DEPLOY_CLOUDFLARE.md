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

## After First Deploy

Update `siteConfig.siteUrl` in `src/lib/site-config.ts` to the final Cloudflare production URL or custom domain, then redeploy. This controls canonical URLs, Open Graph URLs, `robots.txt`, and `sitemap.xml`.

If you use a custom domain, configure it in Cloudflare after the first successful deploy and then use that domain as `siteConfig.siteUrl`.

## Notes

- `public/resume.pdf`, icons, Open Graph image, `robots.txt`, and `sitemap.xml` are static assets.
- `/setup`, `/login`, `/reset-password`, and `/admin` are page-level `noindex,nofollow,noarchive`.
- Do not commit `.env`, `.env.local`, `.dev.vars`, or any file containing `SUPABASE_SERVICE_ROLE_KEY`.
