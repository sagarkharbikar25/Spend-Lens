# SpendLens

Free AI spend audit for startup engineering teams — find overspend on Cursor, Claude, ChatGPT, and more. Built for the [Credex](https://credex.rocks) Web Developer intern assignment (Round 1).

**Live URL:** [https://spendlens-9erjjg6ph-sagar-kharbikar-s-projects.vercel.app](https://spendlens-9erjjg6ph-sagar-kharbikar-s-projects.vercel.app)

**Demo video:** [Watch Demo](https://drive.google.com/drive/folders/17Ks4SX_kr31yOrd_KO_dxCNPuTYyYfES?usp=drive_link)

## What it does

1. User enters AI tools, plans, spend, and team size (no login).
2. Deterministic **audit engine** returns savings with confidence levels.
3. **Meta Llama** writes a short personalized summary (with fallback).
4. Optional **email capture** after results; **shareable** `/audit/[slug]` link.

## Quick start

```bash
npm install
cp .env.example .env.local
# Fill Supabase, META_API_KEY, RESEND_API_KEY — see database/README.md
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run lint
npm run test
npm run build
```

## Project layout

```
spendlens/
├── app/                 # Next.js routes + API
├── frontend/            # UI components
├── backend/             # Audit engine, email, validators
├── database/            # Supabase schema
├── shared/types/        # TypeScript types
└── docs/                # Deploy + test checklists
```

## Environment variables

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server inserts (never expose client-side) |
| `META_API_KEY` | Llama API for audit summary |
| `RESEND_API_KEY` | Lead confirmation email |
| `NEXT_PUBLIC_APP_URL` | Canonical URL for OG tags (required in prod) |

## Decisions (5 trade-offs)

1. **Hardcoded audit rules, not AI** — Finance teams can verify math; LLM only for the summary paragraph. Trust beats hallucinated “switch to X” advice.

2. **In-memory rate limiting** — Middleware `Map` for `/api/leads` (5/hour/IP). Simple on Vercel MVP; Redis (Upstash) when scaling multi-region.

3. **Email gate after results** — Value before ask; higher capture than gating the audit itself.

4. **Short slug URLs** — `/audit/abc12345` instead of UUIDs in the URL. Better sharing; UUID stays internal in Supabase.

5. **Supabase over Firebase** — Postgres + JSONB for audit payloads, SQL for analytics, clean server client on Vercel.

## Assignment docs

| File | Contents |
|------|----------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | System diagram, data flow, scaling |
| [GTM.md](GTM.md) | Go-to-market plan |
| [ECONOMICS.md](ECONOMICS.md) | Unit economics |
| [LANDING_COPY.md](LANDING_COPY.md) | Hero, FAQ, CTAs |
| [METRICS.md](METRICS.md) | North Star + pivot triggers |
| [PRICING_DATA.md](PRICING_DATA.md) | Verified pricing sources |
| [PROMPTS.md](PROMPTS.md) | LLM prompt documentation |
| [TESTS.md](TESTS.md) | How to run tests |
| [DEVLOG.md](DEVLOG.md) | Daily build log |
| [USER_INTERVIEWS.md](USER_INTERVIEWS.md) | 3 real interviews *(required)* |
| [REFLECTION.md](REFLECTION.md) | Post-build reflection |

## Status

- **Day 1:** ✅ Product MVP (form, audit engine, UI scaffolding)
- **Day 2:** ✅ Results page, email capture, and shareable URLs
- **Day 3:** ✅ Documentation completion, UI/a11y polish, and bug fixes
- **Day 4:** ⏳ Pending: Production deployment + final submission (Tomorrow)

## Deploy

Deployed on Vercel. Ensure all environment variables from `.env.example` are configured in your Vercel project settings.
