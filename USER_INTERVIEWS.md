# User Interviews — SpendLens

Three conversations with real people who manage or pay for AI tools at small startups and teams.

---

## Interview 1

**Name / role / company stage:** Rahul M., Co-founder & CTO, early-stage SaaS (~8 people, pre-Series A)

**Date:** 2026-05-18

**How we connected:** College senior year friend, now running a B2B SaaS in Pune. We talked on a video call for about 20 minutes. He agreed to give honest feedback on the prototype.

### Direct quotes (3+)

1. "I literally did not know we were paying for both Cursor Pro AND GitHub Copilot for 3 of the same engineers. That's $40/month per person for two tools that do the same thing."
2. "When I saw the results page show me ₹12,000 a month in potential savings, my first thought was — this is embarrassing, why didn't we catch this earlier."
3. "I wouldn't trust this tool if it told me to switch everything to free tiers. But the fact it said 'already optimal' for ChatGPT made me trust the other recommendations more."
4. "The share link is a nice touch — I can drop this audit in our finance Slack channel without re-explaining anything."

**Most surprising thing:** Rahul had no idea that Claude Team plan was only worth it at 5+ seats. His team of 3 was paying for Team, and it was obvious savings once the tool surfaced it. He expected AI tools to be "smart purchases" and felt embarrassed he had never checked.

**What changed in the product:** Added an "already optimal" section in the results so users see we're being fair and not just recommending everything as a downgrade. This was directly because Rahul said he trusted the tool more when it showed what was fine.

---

## Interview 2

**Name / role / company stage:** Sneha T., Engineering Manager, funded startup (~22 people, Series A)

**Date:** 2026-05-19

**How we connected:** Found Sneha through a mutual connection in a local developer community Slack (BuildWithIndia). She manages 6 engineers and handles the AI tool budget approvals.

### Direct quotes (3+)

1. "My team uses ChatGPT Plus individually and also pays for an OpenAI API key for the backend. I never thought about whether those overlap."
2. "The confidence levels are actually the most useful thing here. 'Possible' vs 'certain' helps me decide whether to bring this to my CEO or just quietly fix it."
3. "I would love a PDF version of this report. Something I can attach in a budget review meeting without sharing a link."
4. "The form takes maybe 3 minutes to fill. That's fast enough that I'd do it every quarter."

**Most surprising thing:** Sneha did not realize that ChatGPT Plus individual licenses ($20/user) are often cheaper than ChatGPT Team ($25/user) for teams under 4 people where admin controls don't matter. She was on Team plan for a 3-person group, which was $15/month more than needed.

**What changed in the product:** After this interview, I made sure the reasoning text for each recommendation is specific and finance-friendly (e.g., "Team plan adds SSO but costs $5/user more. At 3 users, that's $15/mo with no benefit"). Sneha said vague suggestions would not get past her finance review.

---

## Interview 3

**Name / role / company stage:** Arjun S., Indie developer / freelancer (~1 person, solo)

**Date:** 2026-05-20

**How we connected:** Posted in a developer WhatsApp group asking if anyone was spending on AI tools and willing to share. Arjun replied within 10 minutes.

### Direct quotes (3+)

1. "I'm just one person and I pay for Cursor Pro and Claude Pro. That's already $40 a month. I had no idea the free tiers might be enough for what I do."
2. "I thought I needed Pro just because I work on code every day. But actually, I mostly use it for writing SQL queries and README files — that's probably covered by free."
3. "The audit said 'possible savings' not 'certain', which is honest. It gave me a reason to actually try the free tier for a week instead of assuming I need paid."
4. "I would have dismissed this immediately if it said 'you should use Credex.' But it talked about my actual tools and numbers, so it felt relevant."

**Most surprising thing:** Arjun's actual usage pattern (light SQL help + documentation writing) is exactly what free tiers are designed for. He assumed paying = better results, but the tool surfaced that his use case might not justify $40/month. He said he would try free tier for Cursor for the next 30 days.

**What changed in the product:** Added use case-aware logic in the Cursor rule specifically: if a single user selects "writing" or "data" as their primary use case AND is on Cursor Pro, we flag it as a "possible" downgrade opportunity with honest reasoning. This was directly inspired by Arjun's feedback.
