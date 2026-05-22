# Backend

Server-side logic and API routes.

| Path | Purpose |
|------|---------|
| `lib/audit-engine/` | Deterministic savings rules (Day 2) |
| `lib/validators.ts` | Zod schemas for API input |
| `lib/supabase.ts` | Supabase server + browser clients |

**API routes** (Next.js, repo root):

| Route | Day |
|-------|-----|
| `app/api/audit` | 2 |
| `app/api/summary` | 2 (uses `META_API_KEY` or Anthropic) |
| `app/api/leads` | 3 |

**Middleware** (`middleware.ts` at repo root): rate limits `POST /api/leads` (5/hour per IP).

**Secrets:** only in `.env.local` at repo root — never commit.
