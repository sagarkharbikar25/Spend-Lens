# Deploy to Vercel

## 1. Push to GitHub

Ensure the repo is public and pushed to `main`.

## 2. Import in Vercel

1. [vercel.com/new](https://vercel.com/new) → Import Git repository
2. Framework: **Next.js** (auto-detected)
3. Root directory: `.` (default)

## 3. Environment variables

Add in **Project → Settings → Environment Variables** (Production + Preview):

| Variable | Required |
|----------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes |
| `META_API_KEY` | Yes |
| `RESEND_API_KEY` | Yes (for lead emails) |
| `NEXT_PUBLIC_APP_URL` | Yes — `https://your-app.vercel.app` |
| `RESEND_FROM_EMAIL` | Optional — `SpendLens <onboarding@resend.dev>` |

## 4. Deploy

```bash
npm i -g vercel
vercel login
vercel --prod
```

Or use **Deploy** button in Vercel dashboard.

## 5. Post-deploy checks

1. Run audit on live URL (form → results → email)
2. Open `/audit/{slug}` from a saved audit
3. Paste share URL in [opengraph.xyz](https://www.opengraph.xyz/)
4. Lighthouse mobile on home page (targets: Perf ≥85, A11y ≥90, BP ≥90)
5. Update `README.md` **Live URL** with production domain

## 6. Supabase

- Run `database/supabase/schema.sql` if not done
- Allow Vercel IPs or use default Supabase cloud (no IP restrict for MVP)
