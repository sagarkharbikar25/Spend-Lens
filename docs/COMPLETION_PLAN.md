# SpendLens Completion Plan

## Current status
- Core audit flow exists: `SpendForm`, `runAudit`, results view, shareable `/audit/[slug]` page.
- Summary generation via Meta Llama API with fallback is implemented in `backend/lib/summary.ts`.
- Lead capture UI, honeypot spam protection, Supabase storage, and transactional email are present.
- The main known runtime issue is `/api/leads` failing with 500 in the browser screenshot.
- Required docs exist in many places, but `REFLECTION.md` is missing and `USER_INTERVIEWS.md` still contains placeholders.

## Development tasks (complete before deployment)
1. Validate local environment
   - Ensure `.env.local` has `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `META_API_KEY`, `RESEND_API_KEY`, and `NEXT_PUBLIC_APP_URL`.
   - Confirm Supabase schema is applied using `database/supabase/schema.sql`.
2. Fix lead capture / email flow
   - Reproduce `/api/leads` 500 error and inspect logs.
   - Confirm `createServerClient()` is connecting and that the `leads`/`audits` tables exist.
   - Confirm `RESEND_API_KEY` is configured; add stronger fallback messaging when email sending is unavailable.
3. Hardening and UX polish
   - Verify `auditId` is passed through from `/api/audit` to `EmailGate`.
   - Improve error messages for lead save failures and unavailable backend.
   - Confirm share link generation, copy button, and public page UX.
4. Expand automated tests
   - Add tests for summary fallback behavior.
   - Add tests for `/api/leads` validation and audit ID linking.
   - Add end-to-end manual checklist in `TESTS.md` if missing.
5. Final feature check
   - Confirm page reload persistence for form state.
   - Confirm public audit page renders without private PII or email gate.
   - Confirm OG metadata is generated correctly in `audit/[slug]/page.tsx`.

## Testing plan (after development)
1. Run automated verification
   - `npm run lint`
   - `npm run test`
   - `npm run build`
2. Manual flow testing
   - Run the audit form, verify savings output and summary.
   - Submit lead capture and verify success or graceful fallback.
   - Open public `/audit/{slug}` share link in a new window/incognito.
   - Validate no email gate appears, and share metadata is correct.
3. Production validation
   - Once deployed, test the live URL.
   - Verify OG preview using `opengraph.xyz` or Twitter card validator.
   - Verify email delivery if `RESEND_API_KEY` is configured.

## Documentation tasks
- Complete or verify the following markdown files:
  - `README.md`
  - `ARCHITECTURE.md`
  - `GTM.md`
  - `ECONOMICS.md`
  - `LANDING_COPY.md`
  - `METRICS.md`
  - `PRICING_DATA.md`
  - `PROMPTS.md`
  - `TESTS.md`
  - `DEVLOG.md`
  - `USER_INTERVIEWS.md`
  - `REFLECTION.md`
  - `docs/DEPLOY.md`
- Add this plan to `docs/COMPLETION_PLAN.md` for a tracked development roadmap.
- Ensure `README.md` includes the deployment URL after production launch.

## Deployment order
1. Finish all development tasks and local verification.
2. Run the full manual checklist end to end.
3. Deploy to Vercel only after the system is stable.
4. Validate public audit share page and OG previews.
5. Add the final deployed URL to `README.md` and `docs/DEPLOY.md` if needed.

## Bonus items (after MVP)
- PDF export of the audit report.
- Embeddable widget version (`<script>` drop-in).
- Benchmark mode: spend per developer vs. company average.
- Referral codes / sharing incentives.
