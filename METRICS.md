# Metrics — SpendLens

## North Star metric

**Audits completed** (unique successful `POST /api/audit` that return a result to the user)

**Why:** At this stage SpendLens is a **value-first lead-gen tool**, not a subscription product. Audits prove the wedge works before optimizing revenue. DAU would mislead—a CFO runs this once per quarter.

## Input metrics (drivers)

| Metric | Definition | Why it matters |
|--------|------------|----------------|
| **Form start rate** | Sessions with ≥1 tool enabled / landing sessions | Top-of-funnel friction |
| **Audit completion rate** | Audits / form submits | Engine + API health |
| **Email capture rate** | Leads / audits | Monetization proxy |
| **Share link rate** | Audits with slug / audits | Viral loop strength |
| **High-value audit rate** | Audits with savings > $500/mo / audits | Credex sales fit |

## Instrumentation (ship order)

1. **Server events** (Supabase columns or `events` table): `audit_completed`, `lead_captured`, `slug_created`, `is_high_value`
2. **Client:** UTM params on landing (`?ref=reddit`) stored in audit `input` JSON
3. **Dashboard:** Supabase SQL views — audits/day, median savings, capture rate
4. Later: PostHog or Plausible for funnel visualization

## Guardrail metrics

| Metric | Threshold | Action |
|--------|-----------|--------|
| API error rate | > 2% | Fix audit/summary routes |
| p95 audit latency | > 5s | Cache summary; optimize Meta timeout |
| Lead spam rate | honeypot trips spike | Tighten rate limit / add Turnstile |
| LLM fallback rate | > 30% | Fix Meta API key / model |

## Pivot triggers

| Signal | Trigger | Response |
|--------|---------|------------|
| Low savings prevalence | < **10%** audits with > $500/mo savings over 200 audits | Credex positioning weak—tighten ICP or add credit-specific CTA |
| No virality | Share rate < **5%** after 100 audits | Improve OG image + default share CTA copy |
| No leads | Email capture < **5%** | Move email value prop; test “send PDF” |
| Wrong audience | Qualitative interviews say “fun toy” | Narrow landing to EM / finance persona |

## What we will not optimize in month 1

- **DAU / MAU** — wrong for episodic tool
- **Time on site** — longer ≠ better
- **Total page views** — vanity

## Week-5 review checklist

- [ ] 200+ audits?
- [ ] Email capture ≥ 10%?
- [ ] High-value rate ≥ 10%?
- [ ] 3+ consultations attributed to tool?
