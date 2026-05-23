# Tests

## Run all tests

```bash
npm run test
```

## Audit engine (`tests/audit-engine.test.ts`)

| Test | Covers |
|------|--------|
| ChatGPT Team @ 2 users | Downgrade to Plus, $10/mo, certain confidence |
| Cursor Business @ 6 users | Already optimal, zero savings |
| Annual savings | `totalAnnualSavings === 12 × monthly` |
| Multiple tools | Savings sum across recommendations |
| Claude Team @ 1 user | Edge case, $5 savings |

## Leads validator (`tests/leads.test.ts`)

| Test | Covers |
|------|--------|
| Valid payload | Email + optional fields |
| Invalid email | Zod rejection |

## CI

GitHub Actions runs `npm run lint` and `npm run test` on push (`.github/workflows/ci.yml`).
