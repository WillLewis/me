
## What we're building

A personal portfolio for an AI/ML Product Manager. The homepage drops visitors straight into a grid of project cards (no long hero, no "trusted by" filler). Each card holds a looping GIF/video, title, tagline, and tag chips. Clicking a card opens a dedicated project page with the media, write-up, and external links. A lightweight admin area lets you add, edit, and delete projects without touching code.

## Visual direction — "Friendly"

- Warm, approachable palette: soft cream background (#FAF7F2), ink-charcoal text, a warm coral accent, and a calm sage secondary. Generous whitespace, soft shadows, rounded corners (~16px).
- Typography pair: **Instrument Serif** for titles (gives a human, editorial feel) + **Inter** for body and UI.
- Cards are tactile: subtle lift on hover, GIF/video plays on hover (paused thumbnail otherwise to keep the grid calm).
- No animated fade-ins on every element, no generic stock icons, no marketing-page filler. Content first.

## Pages

1. `/` — Portfolio grid
   - Compact header: your name, one-line role, optional tag filter chips (LLM, RAG, CV, Agents, etc.).
   - Responsive grid (1 / 2 / 3 columns). 6 seeded projects on first load.
2. `/projects/$slug` — Project detail
   - Large media (GIF or MP4), title, tagline, tags, long-form description (markdown-rendered), and the external links (Demo / Write-up / Repo).
   - Back link to the grid.
3. `/admin` — Password-protected CMS
   - Email/password login (one account: you).
   - Table of projects with Edit / Delete.
   - "New project" form: title, slug, tagline, tags (comma-separated), media upload (GIF / MP4 / image up to ~20MB), description (markdown), and up to 3 links with labels.
4. `/login` — Sign in for admin.

## Card fields (confirmed)

Title + tagline, tech/model tag chips, and links (demo, write-up, repo) shown on the detail page.

## Data model (Lovable Cloud)

- `projects` table: `id`, `slug` (unique), `title`, `tagline`, `description` (markdown), `tags` (text[]), `media_url`, `media_type` ('gif' | 'mp4' | 'image'), `poster_url` (optional still frame), `order_index`, `created_at`, `updated_at`.
- `project_links` table: `id`, `project_id`, `label`, `url`, `kind` ('demo' | 'writeup' | 'repo' | 'other').
- `user_roles` table + `has_role()` security-definer function so only an admin can write. Public read on projects/links via RLS.
- Storage bucket `project-media` (public read, admin-only write) for GIFs/MP4s/images.

## Seed content

Six placeholder projects pre-loaded so the site looks alive on first visit (you'll edit titles/media in the admin). Each gets a tasteful generated still as the poster; you swap in real GIFs through the CMS.

## Technical notes

- TanStack Start routes: `index.tsx`, `projects.$slug.tsx`, `admin.tsx`, `admin.new.tsx`, `admin.$id.edit.tsx`, `login.tsx`, plus `_authenticated.tsx` layout guarding `/admin/*`.
- Data fetched via `createServerFn`; public reads use a public server fn with `supabaseAdmin` scoped to published projects; admin writes use `requireSupabaseAuth` + `has_role('admin')` check.
- Markdown rendered with `react-markdown`.
- Media: `<video autoplay loop muted playsinline>` for MP4, `<img>` for GIF/image. Hover-to-play on cards via play/pause toggle.
- Per-route SEO meta (title, description, og:image from the project's media on detail pages).
- Lovable Cloud will be enabled as part of the build.

## What I'll need from you after build

- Create your admin account on `/login` (first sign-up), then I'll mark it as `admin` via a one-time SQL insert. I'll show you the exact step in chat.
- Replace seeded projects with your real ones via `/admin`.

## Out of scope (for now)

- Public comments, analytics dashboards, multi-user roles, draft/publish workflow, image optimization pipeline. Easy to add later.
