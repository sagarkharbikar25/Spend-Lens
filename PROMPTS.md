# LLM prompts — SpendLens

## Summary generation (Meta Llama API)

**Endpoint:** `POST https://api.llama.com/v1/chat/completions`  
**Model:** `Llama-3.3-70B-Instruct` (override with `META_MODEL` in `.env.local`)  
**Timeout:** 8 seconds, then templated fallback in `backend/lib/summary.ts`

### System message

```
You write concise finance-friendly audit summaries. No markdown, no bullet lists.
```

### User message (template)

```
Write a ~100-word personalized summary for a startup engineering leader based on this AI spend audit. Be direct, numeric, and honest. Do not invent savings not in the data.

Team: {teamSize} people, primary use case: {useCase}.
Tools: {enabled tools with plan, spend, seats}.
Total savings: ${monthly}/month (${annual}/year).
Recommendations: {each rec with savings and confidence}.
Already optimal tools: {ids or n/a}.
```

### Why this structure

- System prompt keeps output plain text (easy to render, no broken markdown).
- User prompt injects **only audit engine numbers** so the model cannot hallucinate savings.
- Low temperature (0.4) for consistent tone.

### What did not work (early experiments)

- Letting the model invent alternative tools (“switch to Claude Code”) — rejected; audit math stays in code.
- Long prompts with full pricing tables — noisy; pricing lives in `pricing-data.ts` instead.
- No timeout — hung requests on slow API; added `AbortController` + fallback paragraph.
