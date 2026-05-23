# Day 1 — test checklist

Day 1 is **scaffold only** (no real audit yet). Use this before committing.

## Automated checks

From repo root:

```bash
npm run lint
npm run test
npm run build
```

All three should pass with no errors.

## Manual UI test

1. Start dev server:

   ```bash
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000).

3. **Form**
   - Set team size and use case.
   - Enable **ChatGPT** (or any tool).
   - Pick a plan, enter monthly spend (e.g. `50`), seats (e.g. `2`).

4. **localStorage persistence**
   - Refresh the page (F5).
   - Confirm your selections and numbers are still there.

5. **Run audit button**
   - With at least one tool enabled, click **Run audit**.
   - Open browser DevTools → **Console** — you should see `Audit input ready` with your JSON (API ships Day 2).

6. **Mobile reload** (optional, Credex cares)
   - On phone or narrow window, fill form → reload → data still present.

## Environment (optional today)

- `.env.local` can stay empty for Day 1 UI tests.
- Supabase keys only needed from Day 2 when saving audits.
- Paste `META_API_KEY` when we wire the summary API (Day 2).

## What is NOT expected on Day 1

- No savings results page yet
- No email gate
- API routes return `501` if called directly

## Day 1 done?

- [x] `npm run lint` passes
- [x] `npm run test` passes
- [x] `npm run build` passes
- [x] Form persists after reload (verified in browser)
- [x] `.env.local` — Supabase + `META_API_KEY` configured
- [ ] Git commit with today’s date ← **you still need this**
- [ ] `DEVLOG.md` Day 1 hours filled in

Then **pause** — Day 2 is audit engine + APIs.
