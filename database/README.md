# Database — Supabase

SpendLens stores audits and leads in **Supabase** (PostgreSQL).

## 1. Create a project

1. Go to [https://supabase.com](https://supabase.com) and sign in (free tier is fine).
2. Click **New project** → pick a name (e.g. `spendlens`), password, and region close to you.
3. Wait until the project status is **Active** (~2 minutes).

## 2. Run the schema

1. In the Supabase dashboard, open **SQL Editor**.
2. Click **New query**.
3. Copy everything from [`supabase/schema.sql`](./supabase/schema.sql) in this folder.
4. Click **Run**. You should see success for `audits` and `leads` tables.

## 3. Copy API keys into `.env.local`

1. In Supabase: **Project Settings** → **API**.
2. Paste into your repo root `.env.local`:

| Variable | Where to find it |
|----------|------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project base URL — do not include `/rest/v1/` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `anon` `public` key |
| `SUPABASE_SERVICE_ROLE_KEY` | `service_role` key (server only — never expose in browser) |

## 4. Row Level Security (RLS) — Day 2+

For Day 1 you only need tables created. Before going live:

1. **Authentication** → enable if you add auth later (not required for MVP).
2. **Table Editor** → `audits` / `leads` → enable **RLS**.
3. Add policies so anonymous users can **insert** audits/leads (rate-limited in app middleware), but cannot read other users’ emails.

Example policy (insert only for anon):

```sql
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_insert_audits" ON audits
  FOR INSERT TO anon WITH CHECK (true);
```

Adjust before production; exact policies depend on your API design.

## 5. Verify connection (after Day 2 API)

In SQL Editor:

```sql
SELECT count(*) FROM audits;
```

Should return `0` on a fresh project.

## Folder layout

```
database/
  README.md          ← you are here
  supabase/
    schema.sql       ← tables + indexes
```
