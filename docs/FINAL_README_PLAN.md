# SpendLens — AI Spend Audit Tool
## Credex Web Developer Intern Assignment — Round 1

**Project Name:** SpendLens (the "S" is for "Spend," the "Lens" is for clarity on overspending)  
**Timeline:** 7 days (today through submission)  
**Status:** Starting Day 1  
**Deployed URL:** *(to be filled on Day 5)*  
**GitHub Repo:** *(to be created)*

---

## What We're Building

A free web app that helps startup founders and engineering managers audit their AI tool spending — identify overspending, compare plans, and see potential monthly/annual savings. No login required. Lead capture after value shown. Shareable results with Open Graph previews.

**Why this matters:** Credex sells discounted AI infrastructure credits. Startups don't know they're overspending. This tool surfaces that problem; Credex is the solution.

---

## Project Quick Facts

| Aspect | Details |
|--------|---------|
| **Stack** | Next.js 14 + TypeScript + Tailwind + shadcn/ui + Supabase + Vercel |
| **AI Usage** | Anthropic API ONLY for personalized summary (required feature) |
| **Audit Logic** | Hardcoded rules (deterministic, not AI) |
| **Tools Supported** | 8 minimum: Cursor, GitHub Copilot, Claude, ChatGPT, Anthropic API, OpenAI API, Gemini, Windsurf |
| **Lead Storage** | Supabase (email + optional company/role/team_size) |
| **Email** | Resend API (transactional emails) |
| **Lighthouse Targets** | Perf ≥85, A11y ≥90, Best Practices ≥90 |

---

## Folder Structure

```
spendlens/
├── app/
│   ├── layout.tsx                 # Root layout with Tailwind, favicon, OG defaults
│   ├── page.tsx                   # Home page with SpendForm
│   ├── api/
│   │   ├── audit/route.ts         # POST: runs audit engine, saves to Supabase
│   │   ├── summary/route.ts       # POST: Anthropic API call + fallback
│   │   └── leads/route.ts         # POST: email capture, rate limit, Resend email
│   ├── audit/
│   │   └── [slug]/page.tsx        # Shareable result page, public-safe data
│   └── fonts/ (or use next/font)
│
├── lib/
│   ├── supabase.ts                # Client + server client config
│   ├── audit-engine/
│   │   ├── index.ts               # Main runAudit() function
│   │   ├── pricing-data.ts        # All pricing constants (SINGLE SOURCE OF TRUTH)
│   │   └── rules/
│   │       ├── claude.ts
│   │       ├── chatgpt.ts
│   │       ├── cursor.ts
│   │       ├── github-copilot.ts
│   │       ├── anthropic-api.ts
│   │       ├── openai-api.ts
│   │       ├── gemini.ts
│   │       └── windsurf.ts
│   ├── validators.ts              # Zod schemas for all inputs
│   └── utils.ts                   # Helpers (format currency, etc)
│
├── components/
│   ├── SpendForm.tsx              # Input form (8 tools, team size, use case)
│   ├── AuditResults.tsx           # Hero + per-tool breakdown
│   ├── EmailGate.tsx              # Email capture (shown AFTER results)
│   ├── ShareButton.tsx            # Copy URL, visual feedback
│   ├── LoadingState.tsx
│   └── ErrorBoundary.tsx
│
├── types/
│   └── index.ts                   # All interfaces: ToolInput, AuditInput, AuditResult, etc.
│
├── tests/
│   └── audit-engine.test.ts       # 5+ Vitest tests (edge cases, math verification)
│
├── public/
│   ├── favicon.ico
│   ├── og-image.png               # Default OG image
│   └── logo.svg
│
├── middleware.ts                  # Rate limiting for /api/leads
│
├── .github/
│   └── workflows/
│       └── ci.yml                 # GitHub Actions: lint + test on push
│
├── .env.example                   # Template for env vars
├── .env.local                     # (gitignored) local secrets
│
├── package.json                   # Dependencies
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
│
├── README.md                      # ⭐ Primary deliverable (2–3 sentences, screenshots/Loom, quick start, 5 decisions)
├── ARCHITECTURE.md                # ⭐ System diagram (Mermaid), data flow, stack rationale, 10k audits/day scenario
├── DEVLOG.md                      # ⭐ Daily entries (7 days, Day 1–7)
├── REFLECTION.md                  # ⭐ 5 questions (bug, reversal, week 2, AI usage, self-rating)
├── TESTS.md                       # ⭐ List of every test, how to run
├── PRICING_DATA.md                # ⭐ Every pricing number with URL + date verified
├── PROMPTS.md                     # ⭐ Full LLM prompt, reasoning, what didn't work
├── GTM.md                         # ⭐ Target user, channels, first 100 users plan, unfair advantage
├── ECONOMICS.md                   # ⭐ LTV, CAC, conversion math, $1M ARR path
├── USER_INTERVIEWS.md             # ⭐ 3 real interviews (names, quotes, surprises, design changes)
├── LANDING_COPY.md                # ⭐ Hero headline, subheadline, CTA, social proof, FAQ
└── METRICS.md                     # ⭐ North Star metric, input metrics, instrumentation, pivot triggers

```

**13 Required Markdown Files Checklist:**
- [ ] README.md
- [ ] ARCHITECTURE.md
- [ ] DEVLOG.md (7 entries, 1 per day)
- [ ] REFLECTION.md (5 questions, 150–400 words each)
- [ ] TESTS.md
- [ ] .github/workflows/ci.yml (GitHub Actions workflow)
- [ ] PRICING_DATA.md
- [ ] PROMPTS.md
- [ ] GTM.md
- [ ] ECONOMICS.md
- [ ] USER_INTERVIEWS.md (3 real interviews)
- [ ] LANDING_COPY.md
- [ ] METRICS.md

---

## Database Schema — Supabase

### Table: `audits`
```sql
CREATE TABLE audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE DEFAULT substr(md5(random()::text), 1, 8),
  input JSONB NOT NULL,
  result JSONB NOT NULL,
  ai_summary TEXT,
  is_high_value BOOLEAN GENERATED ALWAYS AS ((result->>'totalMonthlySavings')::numeric > 500) STORED,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_audits_slug ON audits(slug);
CREATE INDEX idx_audits_created_at ON audits(created_at DESC);
CREATE INDEX idx_audits_is_high_value ON audits(is_high_value) WHERE is_high_value = true;
```

### Table: `leads`
```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID REFERENCES audits(id),
  email TEXT NOT NULL,
  company TEXT,
  role TEXT,
  team_size INT,
  honeypot TEXT,                  -- store it to detect spam patterns
  source TEXT DEFAULT 'audit_gate',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_audit_id ON leads(audit_id);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
```

---

## MVP Feature Checklist

- [ ] **Form:** 8 tools, plan, monthly spend, seats, team size, use case persisted to localStorage
- [ ] **Audit Engine:** Per-tool rules, defensible logic, confidence levels shown
- [ ] **Results Page:** Hero (monthly/annual savings), per-tool breakdown with reasons, honest "already optimal" messaging
- [ ] **AI Summary:** Anthropic API call with 8-second timeout and graceful fallback
- [ ] **Lead Capture:** Email gate AFTER results shown, optional fields, honeypot, rate limiting
- [ ] **Shareable URL:** `/audit/[slug]`, public-safe data (no PII), OG tags + Twitter card

---

## 7-Day Build Plan

### Day 1 (Today) — Setup & Scaffolding
**Hours:** 6–8  
**Commits expected:** 5–6

```bash
git log --pretty=format:"%ad" --date=short | sort -u | wc -l  # Should increment to 1
```

- [ ] Initialize Next.js 14 project with TypeScript, Tailwind, shadcn/ui
  - `npx create-next-app@latest spendlens --typescript --tailwind --eslint`
  - Add shadcn/ui: `npx shadcn-ui@latest init`
- [ ] Install dependencies: `zod`, `@supabase/supabase-js`, `resend`
- [ ] Create Supabase project, add schema, enable RLS (public inserts for audits/leads with rate limit)
- [ ] Create `.env.example` and `.env.local` with all required keys
- [ ] Create folder structure above
- [ ] Create middleware.ts with in-memory rate limiting
- [ ] Create types/index.ts with all interfaces
- [ ] Create lib/validators.ts with Zod schemas
- [ ] Scaffold SpendForm component (9 tool inputs, form state, localStorage persist)
- [ ] Add GitHub Actions workflow (.github/workflows/ci.yml) — will fail (no tests yet, that's OK)
- [ ] Create README.md (quick version for now, flesh out Day 5)
- [ ] **Git commits:**
  - `feat: init Next.js 14 with TypeScript, Tailwind, shadcn/ui`
  - `feat: add Supabase client config and database schema`
  - `feat: scaffold SpendForm component with 8 tools`
  - `feat: add type definitions and Zod validators`
  - `chore: add GitHub Actions CI workflow (lint + test)`
  - `docs: add initial README and project structure`

**DEVLOG Day 1 entry:** Hours worked: 6, setup complete, SpendForm scaffolded, all env vars ready

---

### Day 2 — Audit Engine & API Routes
**Hours:** 8–10  
**Commits expected:** 6–7

- [ ] Create lib/audit-engine/pricing-data.ts (all 8 tools, verified pricing)
- [ ] Create audit engine per-tool rules (claude.ts, chatgpt.ts, cursor.ts, etc.)
  - **Critical:** Each rule returns `ToolRecommendation | null` with `confidence: 'certain' | 'likely' | 'possible'`
  - Include reasoning a finance person would agree with
  - Example: "Team plan adds SSO and admin controls but costs $5/user more. At 2 users with no enterprise needs, individual plans save $120/mo."
- [ ] Create lib/audit-engine/index.ts (runAudit function)
- [ ] Create tests/audit-engine.test.ts (5 tests minimum)
  - ✅ Test: ChatGPT Team at 2 users → recommends downgrade with certain confidence
  - ✅ Test: Cursor Business at 6 users → flags as already optimal
  - ✅ Test: Annual savings = 12 × monthly
  - ✅ Test: Multiple tools sum correctly
  - ✅ Test: Handles edge case (1 user on Team plan)
- [ ] Create POST /api/audit route
  - Validate input (Zod)
  - Run audit engine
  - Call /api/summary (non-blocking)
  - Save to Supabase
  - Return { slug, result, summary }
- [ ] Create POST /api/summary route (Anthropic API)
  - 8-second timeout
  - Fallback summary if API fails
- [ ] Verify `npm run test` and `npm run lint` pass
- [ ] **Git commits:**
  - `feat: add pricing data for all 8 tools (verified)`
  - `feat: implement audit engine core and per-tool rules`
  - `feat: add Claude, ChatGPT, Cursor, GitHub Copilot rules`
  - `test: add 5 Vitest tests for audit engine edge cases`
  - `feat: create POST /api/audit route with Supabase save`
  - `feat: create POST /api/summary with Anthropic API`
  - `test: verify CI workflow runs green`

**DEVLOG Day 2 entry:** Hours worked: 9, audit engine complete with 5 passing tests, API routes working, pricing verified

---

### Day 3 — Results Page & Lead Capture
**Hours:** 8–9  
**Commits expected:** 5–6

- [ ] Create AuditResults component
  - Hero: "You could save $X/mo ($Y/year)"
  - Per-tool breakdown: current spend → action → savings + reason
  - "Already optimal" section if no savings found
  - For >$500/mo savings: surface Credex prominently
  - For <$100/mo: honest messaging ("You're spending well")
- [ ] Wire AuditResults to form submission
- [ ] Create EmailGate component
  - Email + optional company, role, team_size
  - Honeypot field (hidden)
  - Only shown AFTER results, never before
- [ ] Create POST /api/leads route
  - Rate limit (5 per IP per hour, in-memory Map)
  - Validate email
  - Save to Supabase
  - Send transactional email via Resend
- [ ] Implement AI summary generation in results
- [ ] Test form → results → email gate flow end-to-end locally
- [ ] **Git commits:**
  - `feat: build AuditResults page with hero and per-tool breakdown`
  - `feat: implement AI summary generation with Anthropic API`
  - `feat: create EmailGate component (shown after results)`
  - `feat: add POST /api/leads with rate limiting and Resend email`
  - `fix: ensure form state persists across page reloads`
  - `test: integration test for full audit → email flow`

**DEVLOG Day 3 entry:** Hours worked: 8.5, results page polished, email gate working, end-to-end flow tested locally

---

### Day 4 — Shareable URLs & Viral Loop
**Hours:** 7–8  
**Commits expected:** 5–6

- [ ] Create /audit/[slug]/page.tsx shareable results page
  - Public data only (no email, company, role)
  - Show tools, savings, per-tool recommendations
- [ ] Implement dynamic OG meta tags
  - `og:title`, `og:description`, `og:image`
  - Twitter card tags (`twitter:card`, `twitter:creator`, etc.)
- [ ] Create ShareButton component
  - Copy URL to clipboard
  - Visual feedback ("Copied!")
- [ ] Add user interviews (3 real conversations)
  - DM CTOs/engineering managers on LinkedIn
  - Ask college friends, indie hacker Slacks
  - Record direct quotes, surprising moments, design changes
- [ ] Conduct at least 1 user interview today (complete by end of Day 4)
- [ ] Test shareable URLs on Twitter/Slack preview (use opengraph.io or Card Validator)
- [ ] **Git commits:**
  - `feat: add /audit/[slug] shareable page with OG tags`
  - `feat: implement dynamic Open Graph and Twitter card meta tags`
  - `feat: create ShareButton with clipboard copy feedback`
  - `docs: add USER_INTERVIEWS.md with 1–2 interviews`
  - `feat: improve mobile layout responsiveness`

**DEVLOG Day 4 entry:** Hours worked: 7.5, shareable URLs live with OG previews, 2 user interviews completed

---

### Day 5 — Deployment & Entrepreneurial Docs
**Hours:** 9–11  
**Commits expected:** 6–7

- [ ] Deploy to Vercel
  - `vercel` (follow prompts)
  - Set all env vars in Vercel dashboard
  - `vercel --prod`
- [ ] Test live URL end-to-end (form → results → shareable)
- [ ] Run Lighthouse on live URL (target: Perf ≥85, A11y ≥90, Best Practices ≥90)
  - Fix contrast issues (use text-gray-900, not text-gray-400)
  - Add `lang="en"` to html root
  - Ensure all images have alt text and explicit dimensions
  - Fix Cumulative Layout Shift
- [ ] Write ARCHITECTURE.md
  - Mermaid diagram (form → audit engine → results → save → shareable)
  - Data flow explanation
  - Why Next.js + Tailwind + shadcn/ui + Supabase
  - How to scale to 10k audits/day (caching, database indices already in place)
- [ ] Write GTM.md (300–700 words)
  - **Target user:** Not "startups" → "Engineering manager at Series A startup (5–15 engineers) with first $300K AI bill"
  - **What they Google:** "AI subscription cost," "reduce AI spending," "ChatGPT alternatives"
  - **Where they hang out:** r/SideProject, r/IndieHackers, r/MachineLearning, Buildspace Discord, Lenny's Newsletter Slack
  - **First 100 users ($0 CAC):** Post in communities (Reddit 3h), DM 10 CTOs (2h), share in 4 founder Slack groups (1h), embed link in 2 AI cost blog posts (2h)
  - **Unfair advantage:** Credex's existing customer list (every company that bought discounted AI credits is a warm lead)
  - **Week 1 traction:** 500 audits completed, 3 high-value leads, 2 Credex consultations booked
- [ ] Write ECONOMICS.md (300–700 words)
  - Credex order value: $500 avg → $150 gross margin LTV (conservative)
  - CAC at organic channels: $0 paid
  - Break-even: 0.5% CVR from audit → consultation → credit purchase
  - $1M ARR path: 6,667 credit purchases/year = 556/month = 18/day
  - Viability: 3,600 audits/day × 0.5% CVR = 18 purchases/day (achievable with 1 PH launch + ongoing SEO)
- [ ] Write LANDING_COPY.md
  - Hero: "Audit Your AI Spend in 90 Seconds" (≤10 words)
  - Subheadline: "Find where your Claude, ChatGPT, and Cursor plans are bleeding money" (≤25 words)
  - CTA: "Audit Now"
  - Social proof: "3,200+ startups audited" (mocked, indicate clearly)
  - FAQ (5 Q&As)
- [ ] Write METRICS.md
  - **North Star:** Audits completed (measure immediate value, not CAC-heavy metrics)
  - **Input metrics:** Form completions, email gate capture rate, shareable URL clicks
  - **Instrumentation:** Track audits > $500/mo (high-value), track source (referral vs direct vs search)
  - **Pivot trigger:** If <10% of audits show >$500/mo savings, Credex positioning may be off
- [ ] Update README.md with live URL, screenshots/Loom link, quick start, 5 decisions
- [ ] Create PRICING_DATA.md (every number with source URL + verification date)
- [ ] **Git commits:**
  - `chore: deploy to Vercel and verify live URL`
  - `fix: improve Lighthouse accessibility score (contrast, ARIA)`
  - `docs: add ARCHITECTURE.md with Mermaid system diagram`
  - `docs: add GTM.md, ECONOMICS.md, LANDING_COPY.md, METRICS.md`
  - `docs: add PRICING_DATA.md with all sources verified`
  - `docs: update README with live URL and screenshots`
  - `chore: verify CI green on main branch`

**DEVLOG Day 5 entry:** Hours worked: 10, deployed to Vercel, Lighthouse scores >90, all entrepreneurial docs written

---

### Day 6 — Testing, Polish & Interviews
**Hours:** 7–8  
**Commits expected:** 4–5

- [ ] Complete final user interview (3rd one)
- [ ] Add more Vitest tests if gaps remain
- [ ] Improve mobile layout (test on iPhone Safari, Android Chrome)
- [ ] Handle Supabase connection timeout gracefully
  - Add retry logic + fallback messaging
- [ ] Test rate limiting under load
- [ ] Verify email delivery (send test email)
- [ ] Create TESTS.md (list every test, how to run)
- [ ] Create PROMPTS.md
  - Full text of Anthropic API prompt
  - Why you wrote it this way
  - What you tried that didn't work
- [ ] **Git commits:**
  - `test: add integration test for full audit flow`
  - `fix: handle Supabase connection timeout gracefully`
  - `fix: improve mobile layout on small screens`
  - `docs: add TESTS.md and PROMPTS.md`
  - `test: verify rate limiting and email delivery`

**DEVLOG Day 6 entry:** Hours worked: 7.5, all 3 user interviews complete, tests comprehensive, mobile polish done

---

### Day 7 — Final Reflection & Submission Prep
**Hours:** 6–7  
**Commits expected:** 3–4

- [ ] Write REFLECTION.md (5 questions, 150–400 words each)
  1. **Hardest bug:** What was the specific hypothesis → debugging steps → solution?
  2. **Decision reversal:** What did you change mid-week and why?
  3. **Week 2 build:** What would you prioritize next?
  4. **AI usage:** Which tools for what? One specific time AI was wrong and you caught it.
  5. **Self-rating (1–10):** Discipline, code quality, design sense, problem-solving, entrepreneurial thinking (one-line reason each)
- [ ] Write DEVLOG.md final entry (Day 7)
- [ ] Verify git history spans 7 distinct days
  - `git log --pretty=format:"%ad" --date=short | sort -u | wc -l`
  - Must be ≥7
- [ ] Run final checks:
  - [ ] All 13 markdown files exist
  - [ ] GitHub repo is public
  - [ ] Live URL is reachable
  - [ ] CI workflow shows green checkmark
  - [ ] Lighthouse scores ≥85/90/90
  - [ ] Form → audit → results → email gate → shareable URL all work
  - [ ] No secrets in repo (check git diff HEAD~50 for API keys)
- [ ] Create final screenshots/Loom video (30 seconds)
  - Record form fill → results page → share URL
  - Upload to YouTube/Loom, add link to README
- [ ] **Git commits:**
  - `docs: add REFLECTION.md with all 5 questions answered`
  - `docs: final DEVLOG entry and project summary`
  - `chore: final pre-submission verification and CI checks`
  - `docs: add Loom recording and final screenshots to README`
- [ ] **Submit:**
  - Gather: GitHub repo URL, live deployed URL, all required files
  - Fill out Google Form (Credex will provide link)
  - Submit by deadline (Day 7, 11:59 PM)

**DEVLOG Day 7 entry:** Hours worked: 6, all deliverables complete, final reflection written, ready to submit

---

## Audit Engine Rules — Defensible Logic Examples

### Claude: Team Plan Overkill at Small Teams
```typescript
// Team costs $25/user/month
// Pro costs $20/user/month
// Team is ONLY worth it at 4+ users who need SSO, admin console, usage analytics, priority support
if (plan === 'team' && seats <= 3) {
  const saving = seats * 5;  // $5 per user
  return {
    recommendedAction: `Switch to ${seats} × Claude Pro (individual)`,
    reason: `Team adds SSO/admin but costs $5/user more. At ${seats} users with no compliance needs, individuals save $${saving}/mo.`,
    monthlySavings: saving,
    confidence: 'certain'
  };
}
```

### ChatGPT: Plus vs Team at 2 Users
```typescript
// Plus: $20/user/month
// Team: $25/user/month
// Team adds usage analytics, admin controls, priority support
if (plan === 'team' && seats === 2 && monthlySpend < 60) {
  return {
    recommendedAction: 'Switch to 2 × ChatGPT Plus (individual)',
    reason: 'Team adds admin controls but costs $10/mo more for 2 users. Unless you need usage analytics or priority support, individual Plus plans are cheaper.',
    monthlySavings: 10,
    confidence: 'certain'
  };
}
```

### Cursor: Free Tier vs Pro at 1 User, Low Usage
```typescript
// Pro: $20/month
// Free: $0 (but limited)
// Can't know actual usage from form, so confidence: 'possible' only
if (plan === 'pro' && seats === 1 && useCase === 'writing') {
  return {
    recommendedAction: 'Evaluate if Free tier covers your usage',
    reason: 'Cursor Free includes generous daily limits. If you use it primarily for writing assists (not heavy code completion), free may suffice.',
    monthlySavings: 20,
    confidence: 'possible'  // honest — we don't know actual usage
  };
}
```

**Key principle:** Show `confidence: 'possible'` when uncertain. That builds trust more than over-claiming savings.

---

## API Routes Summary

| Route | Method | Input | Output | Purpose |
|-------|--------|-------|--------|---------|
| `/api/audit` | POST | `AuditInput` (tools, team size, use case) | `{ slug, result, summary }` | Runs audit engine, saves to Supabase |
| `/api/summary` | POST | `AuditResult` | `{ summary: string }` | Calls Anthropic API, generates personalized summary |
| `/api/leads` | POST | `{ email, company?, role?, team_size? }` | `{ success: bool }` | Captures lead, rate limits, sends email via Resend |

---

## Environment Variables (.env.local)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx  # for server-side operations

# Anthropic
ANTHROPIC_API_KEY=sk-ant-xxxxx

# Resend
RESEND_API_KEY=re_xxxxx

# App
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app  # for Vercel, OG tags
```

---

## 5 Key Decisions (for README "Decisions" section)

1. **Hardcoded audit rules, not AI:** Deterministic math builds trust. Finance people can verify your reasoning. AI hallucinations kill credibility. You own every recommendation.

2. **In-memory rate limiting (not Redis):** Vercel Edge Memory is sufficient for MVP scale. Redis adds complexity and latency. Trade-off: assumes single server (true for Vercel). Documented in ARCHITECTURE.md.

3. **Email gate AFTER results, never before:** Show value first. Psychology: users who see savings before entering email are 3–5x more likely to convert. Credex expects this from a real product person.

4. **Slug URLs, not UUIDs:** `/audit/ab3f9c2d` is more shareable than `/audit/550e8400-e29b-41d4-a716-446655440000`. UUIDs are stored but not exposed. Better user experience + virality.

5. **Supabase over Firebase:** Native PostgreSQL with RLS policies is simpler than Firebase's auth/rules complexity. Vercel integrates best with Postgres. You control schema directly.

---

## Make or Break Checklist

### ❌ Instant Rejection
- [ ] Missing required files (any of 13 markdown files)
- [ ] Git history doesn't span ≥5 days
- [ ] Live URL not deployed or unreachable
- [ ] No user interviews (3 real humans, mandatory)
- [ ] Fabricated interviews (generic, no surprises, obvious templates — instant reject)
- [ ] Hardcoded secrets in repo
- [ ] Lighthouse scores below 85/90/90
- [ ] Audit logic is mathematically wrong or unexplained

### ⚠️ Major Red Flags
- [ ] DEVLOG entries backdated or obviously copied/templated
- [ ] Entire codebase looks one-shot AI-generated (Credex can tell; not because AI is bad, but because it signals nothing about you)
- [ ] No CI/CD workflow or workflow doesn't show green
- [ ] Form state doesn't persist (mobile Safari reload test)
- [ ] Email gate shown before results shown
- [ ] Pricing numbers don't match official vendor pages
- [ ] Recommendations are vague ("Use Claude instead of ChatGPT") without reasoning

### ✅ Strong Signals
- [ ] Clear git history with meaningful messages across 7 days
- [ ] 3 user interviews with real quotes and surprising insights
- [ ] Audit logic a finance person would agree with
- [ ] ARCHITECTURE.md explains scaling (10k audits/day scenario)
- [ ] GTM.md is specific (actual channels, actual metrics, not "SEO + content")
- [ ] ECONOMICS.md shows math (LTV, CAC, conversion path, not TAM hand-waving)
- [ ] REFLECTION.md is brutally honest (bugs you hit, decisions you reversed, how AI helped and failed)
- [ ] Lighthouse ≥85/90/90 across all metrics
- [ ] Shareable URLs have working OG previews
- [ ] Email delivery confirmed

---

## Quick Start (for local development)

```bash
# 1. Clone repo (create it first!)
git clone <your-repo-url> spendlens
cd spendlens

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase, Anthropic, Resend keys

# 4. Start dev server
npm run dev
# Open http://localhost:3000

# 5. Run tests
npm run test

# 6. Deploy
vercel
vercel --prod
```

---

## Common Pitfalls & How to Avoid Them

| Pitfall | How to Avoid | Why It Matters |
|---------|-------------|----------------|
| Forgetting to persist form state | Use localStorage + useEffect in SpendForm | Users hate re-filling forms; mobile Safari reloads are brutal |
| AI summary API fails → blank results page | Implement fallback summary (templated based on numbers) | Production maturity; shows you've thought about failure modes |
| Email never sent to user | Test Resend integration early (Day 3), check bounce rate | Lead data is useless if you don't confirm receipt |
| Lighthouse accessibility fails | Add `lang="en"` to `<html>`, ensure text contrast ≥4.5:1, add aria-labels | Non-negotiable requirement (≥90); easy wins early |
| Pricing numbers wrong | Verify EVERY number on vendor's official pricing page TODAY | Credex spot-checks; wrong pricing = instant credibility loss |
| User interviews sound generic | Record direct quotes mid-conversation, ask "why?" follow-ups, note surprising moments | Fabricated interviews are obvious and instant-reject |
| Git commits bunched on weekends | Commit every day, even tiny ones ("docs: clarify rate limit strategy") | Discipline is part of the score |
| Shareable URLs don't have OG tags | Test with opengraph.io before submitting | This is the viral loop; Twitter/Slack previews drive sharing |

---

## Credex Evaluation Rubric (100 points)

| Category | Weight | What Scores Well |
|----------|--------|------------------|
| **Entrepreneurial Thinking** | 25% | GTM is specific (not "SEO"), user interviews are real + surprising, economics shows math (not hand-waving), landing copy is tight |
| **Engineering Skills** | 15% | Git hygiene (meaningful messages across 7 days), CI green, ≥5 working tests, deployed URL works, accessibility ≥90 |
| **Thinking Models** | 15% | ARCHITECTURE is detailed, REFLECTION is specific (not generic), README "Decisions" section explains real trade-offs |
| **Programming Skills** | 15% | Code is readable, sensible abstractions, types used well, no obvious bugs in happy path |
| **Hard Work** | 10% | All 6 MVP features work, UI is polished, bonus attempted (PDF export, embeddable widget, etc.) |
| **Discipline & Consistency** | 10% | DEVLOG has 7 dated entries with depth, commits across ≥5 distinct calendar days, no backdating |
| **Audit Logic Polish** | 10% | A finance-literate person reads your reasoning and agrees; confidence levels shown; no vague recommendations |

---

## Success Metrics for Week 1

- [ ] Form → audit → results flow works end-to-end on Vercel
- [ ] 3 user interviews completed with real quotes and design insights
- [ ] All 13 markdown files written and submitted
- [ ] Git log shows 7+ distinct days with meaningful commits
- [ ] Lighthouse scores: Perf ≥85, A11y ≥90, Best Practices ≥90
- [ ] Shareable URLs have working OG previews (verify on Twitter/Slack)
- [ ] REFLECTION answers are brutally honest (bugs hit, reversals made, AI usage disclosed)
- [ ] Pricing data verified and sourced for all 8 tools
- [ ] CI workflow shows green checkmark on final commit

---

## Resources & Links

- **Credex:** credex.rocks
- **Next.js 14 Docs:** https://nextjs.org/docs
- **shadcn/ui:** https://ui.shadcn.com
- **Supabase Docs:** https://supabase.com/docs
- **Anthropic API:** https://docs.anthropic.com
- **Resend:** https://resend.com/docs
- **Vercel Deployment:** https://vercel.com/docs
- **Mermaid Diagrams:** https://mermaid.js.org

---

## Start Now

1. **Right now (before coding):** DM 3 potential users (CTOs, engineering managers) on LinkedIn or your network. Ask for 15-min chats this week.
2. **Next (Day 1 morning):** Create GitHub repo, initialize Next.js, create folder structure, commit to main.
3. **Then (Day 1 evening):** Have SpendForm scaffolded and form state persisting to localStorage.
4. **Keep:** Commit every single day, even small wins. DEVLOG entry each night before bed.

**You've got this. Build something Credex would actually launch. 🚀**

---

*Last updated: May 20, 2026*  
*Ready to start: YES*
