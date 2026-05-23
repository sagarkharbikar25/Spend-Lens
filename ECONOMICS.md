# Economics — SpendLens as Credex lead-gen

## Unit value (assumptions)

| Variable | Estimate | Reasoning |
|----------|----------|-----------|
| Average Credex order | **$500** | Mid-market credit bundle |
| Gross margin | **30%** | Marketplace / procurement cut |
| **LTV per converted customer** | **$150** | $500 × 30%; conservative vs repeat buys |

## Funnel (audit → money)

| Stage | Rate (assumed) | Notes |
|-------|----------------|-------|
| Audit completed | 100% | Top of funnel |
| Email captured | 15% | After value shown |
| Credex consultation booked | 8% of emails | High-intent subset |
| Credit purchase | 40% of consultations | Sales-assisted |
| **Audit → purchase** | **0.48%** | 0.15 × 0.08 × 0.40 |

Rounded **0.5% audit-to-purchase** for planning.

## CAC by channel (organic)

| Channel | CAC |
|---------|-----|
| Reddit / Slack / DM | **$0** cash (founder time only) |
| SEO (month 3+) | **$0** marginal |
| Credex email list | **~$0** (owned audience) |

Blended **CAC ≈ $0–$5** if we ignore founder hours.

## Break-even per audit

Expected value per audit:

`EV = 0.005 × $150 LTV = $0.75`

Hosting + email cost per audit ≈ **$0.02–$0.05** (Vercel + Supabase + Resend at low volume).

**Profitable at funnel level** once conversion holds and LTV ≥ $150.

## Path to $1M ARR (18 months)

Credex needs **credit purchase revenue**, not audit revenue.

| Step | Math |
|------|------|
| Target gross profit | $1,000,000 |
| At $150 LTV per customer | **6,667 customers** |
| Per year | 6,667 ÷ 18 mo × 12 ≈ **4,444 customers/year** |
| Per month | ~370 customers |
| Per day (30-day month) | ~12 purchases/day |

Working backward with **0.5% audit → purchase**:

`12 ÷ 0.005 = 2,400 audits/day` needed at steady state.

That is aggressive for month 1 but plausible with:

- One strong launch week (HN / Reddit) → 2–5k audits
- Credex list email to 5k qualified accounts
- Ongoing SEO on “[tool] pricing small team” pages

## Sensitivity

| If audit → purchase is… | Audits/day for 12 sales |
|-------------------------|-------------------------|
| 0.25% | 4,800 |
| 0.5% | 2,400 |
| 1.0% | 1,200 |

Improving **consultation booking** (high-savings UX + Credex CTA) doubles effective conversion without more traffic.

## Risks

- **Low savings rate** (< 10% audits > $500/mo) → weak Credex story; pivot messaging
- **LLM cost** at scale → keep summary capped; cache by result hash
- **Lead quality** — gate consultations to `is_high_value` audits only

## Bottom line

SpendLens is viable as **cheap acquisition infrastructure** if Credex closes **~0.5%** of audits and LTV holds at **$150+**. The tool does not need to charge users; it needs to **surface overspend** credibly and route high-value leads to sales.
