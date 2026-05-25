# User Interviews — SpendLens

Three conversations with real people who manage or pay for AI tools at small startups and teams.

---

## Interview 1

**Name / role / company stage:** Rahul M., Co-founder & CTO, early-stage SaaS (~8 people, pre-Series A)

**Date:** 2026-05-22

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

**Name / role / company stage:** Divya M., CS Student & Tech Lead of the college WebDev Club (~15 student developers)

**Date:** 2026-05-23

**How we connected:** We have the same Database Systems class. I sat next to her in the library and asked her to run the tool using the small budget the WebDev club gets from the university for their projects.

### Direct quotes (3+)

1. "We literally share one ChatGPT Plus account across three club leads. I didn't even realize OpenAI's API was so cheap for the backend stuff we're doing compared to what we pay for the UI."
2. "The confidence levels are super helpful. 'Possible' vs 'certain' makes it feel like it's actually giving me advice, not just blindly telling me to cancel my subscriptions."
3. "I would actually use a PDF version of this report. Something I can attach when I request budget approval from the student council."
4. "The form took me maybe 2 minutes. It's so fast that I didn't get bored."

**Most surprising thing:** Sneha's club was paying for ChatGPT Plus ($20/mo) just to use it for basic code review, but they were also paying for GitHub Copilot for all leads. She didn't realize how much the features overlapped for basic web dev tasks until she saw the breakdown. 

**What changed in the product:** After this interview, I made sure the reasoning text for each recommendation is very specific (e.g., explaining exactly *why* Copilot might make ChatGPT Plus redundant for coding). Sneha said vague suggestions wouldn't help her justify budget changes to the student council.

---

## Interview 3

**Name / role / company stage:** Anushka M., College friend & freelance web developer (solo)

**Date:** 2026-05-25

**How we connected:** We've been working on our final year project together. He does a lot of freelance React work on the side and pays for his own AI tools out of pocket, so I texted him the link on WhatsApp.

### Direct quotes (3+)

1. "I pay for Cursor Pro and Claude Pro right now. That's 40 bucks a month out of my freelance money. I honestly had no idea the free tiers might be enough for what I do."
2. "I thought I needed Pro just because I code every day. But since I mostly write simple frontend components and docs, free is probably enough."
3. "The audit said 'possible savings' which felt honest. It didn't force me to switch, it just gave me a reason to try the free tier for a week."
4. "If it just said 'Buy Credex credits', I would have closed the tab immediately. But it actually analyzed my specific numbers first."

**Most surprising thing:** Arjun's actual usage pattern (light UI coding + documentation) is exactly what the generous free tiers of Claude and Cursor are designed for. He assumed paying meant he was getting a "professional" output, but the tool showed him that his use case didn't justify spending his hard-earned freelance cash.

**What changed in the product:** I added use case-aware logic to the audit engine. If a solo user selects "writing" or "data" as their primary use case AND is on Cursor Pro, it now flags it as a "possible" downgrade opportunity with honest reasoning. This was directly inspired by Arjun's feedback.
