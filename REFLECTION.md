# Reflection — SpendLens

## 1. What was the biggest technical challenge, and how did I solve it?

The absolute hardest technical hurdle I encountered was resolving a persistent `500 Internal Server Error` during the lead capture submission on `/api/leads`. When testing the end-to-end user flow locally, submitting a user's email would result in a silent crash, even though our database schema had been successfully applied. 

My initial hypothesis was that the Supabase client inside the Next.js App Router API route was failing to establish a connection due to incorrect environmental credentials in `.env.local`. I began debugging by inserting detailed `console.error` logs inside the API route's `try/catch` block and executing standard integration scripts. The logs revealed a permission error (`PGRST116`) from PostgREST: the database was blocking the insertion of new records. 

Upon deeper investigation of `database/supabase/schema.sql`, I realized that Row Level Security (RLS) was enabled on the `leads` table, but we had not configured any public write policies. Thus, when our API route initiated a standard Supabase client using the public anonymous key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`), the query was blocked as unauthorized. 

To solve this securely without simply turning off RLS (which is a major security anti-pattern), I realized I needed a separation of privileges. Client-side database reads should remain restricted, but server-side API handlers should be trusted to insert validated data. I introduced a service role client in `backend/lib/supabase.ts` using `SUPABASE_SERVICE_ROLE_KEY`, which bypasses RLS on the server side. I refactored the `/api/leads` handler to use this admin client for record insertion while preserving the anonymous client for frontend operations. After this change, our automated validation test suite passed, and lead submissions successfully populated our tables, confirming a robust and secure connection.

---

## 2. What would I do differently with more time? (Decision Reversal)

Midway through the development on Day 4, I made a significant decision reversal regarding the Open Graph (OG) social sharing card implementation. Initially, my goal was to use Vercel’s dynamic image generation library (`@vercel/og`) to generate custom, on-the-fly preview cards for every unique public audit page (e.g., rendering a card that visually displays *"Rahul's team saved ₹12,000/month!"* on Slack or Twitter). 

However, during local compilation and running `npm run build`, the `@vercel/og` package ran into severe build conflicts on my local Windows machine due to nested paths in my OneDrive directory, causing the Yoga and Resvg WebAssembly engines to throw compiling errors and segfault. As a beginner developer, resolving low-level Node-gyp and WASM path binding bugs felt like a dangerous rabbit hole that could prevent me from meeting the deployment deadline.

I reversed my decision and opted for a highly polished, static SVG brand card (`public/og-image.svg`) in conjunction with rich, dynamically generated HTML Meta/OG tags in `/audit/[slug]/page.tsx` using Next.js’s `generateMetadata` function. While a fully dynamic image would have been a cool bonus, the combination of a beautiful static brand card and personalized, dynamic metadata (e.g., title: *"SpendLens Audit for Rahul's Team — ₹12,000 Saved"*) delivered 90% of the value with absolute reliability. This reversal kept the application lightweight, avoided build-breaking WASM compilation issues, and ensured a 100% stable deployment pipeline.

---

## 3. Week 2 build priorities

If I had a second week to build out SpendLens, I would prioritize the following three features to transition the product from a minimum viable prototype to an indispensable utility:

1. **PDF Export Engine:** A major theme from our user interviews—particularly from Sneha, our Series A Engineering Manager—was the need to download and print the audit results. In corporate environments, managers cannot always share public URLs with upper management due to internal security compliance. Building an elegant, professional PDF export feature using `@react-pdf/renderer` would allow users to generate beautiful, official-looking expense reports. These could be easily attached to email threads, inserted into board slides, or handed off directly to CFOs and finance teams.
2. **Start-Up Benchmarking Engine:** I would integrate aggregate industry spending data to show how a company’s AI spend compares to similarly sized teams. For example, if a 10-person team is spending $500/month on developer tooling, we could show a visual benchmark indicating that they spend 40% more than the industry average. This gamification element would create a powerful psychological trigger for lead conversion and viral sharing.
3. **Embeddable Diagnostic Widget:** I would create a lightweight, drop-in Javascript widget (e.g., `<script src="https://spendlens.ai/widget.js"></script>`) that other startup blogs, developer directories, or SaaS marketplaces could embed directly on their landing pages. This would act as a highly effective, organic distribution loop, driving continuous, low-cost lead generation back to SpendLens.

---

## 4. AI usage disclosure & critical correction

As a beginner developer, I utilized AI tools extensively throughout this project. I pair-programmed with Claude 3.5 Sonnet to scaffold the Next.js App Router files, format the Tailwind CSS styles, write the automated Vitest unit tests, and resolve TypeScript compiler warnings. In addition, our application itself utilizes AI: we integrated the Meta Llama 3 API via OpenRouter in `backend/lib/summary.ts` to analyze the raw financial numbers and generate a human-readable, qualitative summary for the user’s dashboard.

While the AI was incredibly helpful for accelerating my workflow, there was a specific instance where it provided an incorrect recommendation that I had to catch and manually override. On Day 2, while building the per-tool optimization logic in `backend/lib/audit-engine.ts`, I asked the AI to write the optimization rule for Claude subscription plans. The AI-generated code suggested that if a team of 3 users was on a Claude Team plan ($30/user/month, totaling $90/mo), they should downgrade to Claude Pro ($20/user/month, totaling $60/mo) to save $30. 

While the basic arithmetic was correct, the AI completely overlooked the operational reality: Claude Pro is strictly an *individual* license with no support for shared workspaces, centralized billing, or collaborative folders. Recommending a manager to dismantle their company's collaborative workspace and force developers to pay on separate personal credit cards is terrible operational advice. I caught this logical flaw during manual testing of our rules engine. I corrected the recommendation to advise switching to ChatGPT Team (which is only $25/user/month and retains full admin features) or staying on Claude Team only if they specifically require collaborative tools, adding a hardcoded safeguard to protect the organizational integrity of the user's setup.

---

## 5. Self-Rating (1-10)

* **Discipline: 9/10** — I strictly adhered to my structured daily devlog, followed a meticulous implementation plan, and refused to write core code without simultaneously writing corresponding automated unit tests.
* **Code Quality: 8/10** — The codebase is written in strongly-typed TypeScript, implements clean separation of concerns between UI components, deterministic logic, and API routes, and maintains a zero-warning linting status.
* **Design Sense: 8/10** — Leveraged shadcn/ui and custom CSS variables to craft a premium, cohesive, and fully responsive dark-mode dashboard that feels extremely polished and modern.
* **Problem Solving: 7/10** — Successfully navigated complex Next.js App Router hydration issues and Supabase permission traps, though I occasionally leaned on AI search suggestions rather than reading primary documentation first.
* **Entrepreneurial Thinking: 9/10** — Rather than building a generic calculator, I engineered a highly practical SaaS growth funnel, optimizing the value exchange with an email-gate for leads and an optimized share-link loop.
