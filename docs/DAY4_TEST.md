# Day 4 — test checklist

## Prerequisites

- Supabase schema applied (`database/supabase/schema.sql`)
- `NEXT_PUBLIC_APP_URL=http://localhost:3000` in `.env.local` (for OG URLs)

## Automated

```bash
npm run lint
npm run test
npm run build
```

With dev server running:

```bash
node scripts/verify-day4.mjs
```

## Manual — shareable flow

1. `npm run dev` → http://localhost:3000
2. Run an audit (e.g. ChatGPT team, 2 seats)
3. Confirm a **slug** appears (link to `/audit/xxxxx`)
4. Open the share URL in a **new incognito tab**
5. Confirm:
   - Savings + per-tool breakdown visible
   - **No** email gate on public page
   - "Run your own audit" links home
6. Click **Copy share link** — paste in Notes; URL should match

## OG / Twitter preview

1. Deploy or use a tunnel (ngrok) so URL is public, **or** test after Day 5 deploy
2. Paste share URL into:
   - https://www.opengraph.xyz/
   - https://cards-dev.twitter.com/validator
3. Expect: title with savings amount, description from summary, preview image

## User interviews

- Complete 3 entries in `USER_INTERVIEWS.md` with real quotes (not templates)
