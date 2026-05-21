# Frontend

UI for SpendLens (Next.js App Router).

| Path | Purpose |
|------|---------|
| `components/` | React components (`SpendForm`, shadcn `ui/`, etc.) |
| `lib/utils.ts` | Tailwind `cn()` helper (shadcn) |

**Routes** live in the repo root `app/` (Next.js requirement):

- `/` — home + spend form
- `/audit/[slug]` — shareable results (Day 4)

Run the app from the **repo root**:

```bash
npm run dev
```
