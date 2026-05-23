/**
 * Day 3 smoke test — run with dev server: npm run dev
 * Usage: node scripts/verify-day3.mjs
 */
const BASE = process.env.BASE_URL ?? "http://localhost:3000";

const auditPayload = {
  teamSize: 5,
  useCase: "coding",
  tools: [
    {
      toolId: "chatgpt",
      enabled: true,
      plan: "team",
      monthlySpend: 50,
      seats: 2,
    },
  ],
};

async function main() {
  let passed = 0;
  let failed = 0;

  const check = (name, ok) => {
    console.log(`${ok ? "✓" : "✗"} ${name}`);
    ok ? passed++ : failed++;
  };

  const home = await fetch(BASE);
  check("GET / returns 200", home.status === 200);

  const auditRes = await fetch(`${BASE}/api/audit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(auditPayload),
  });
  const audit = await auditRes.json();
  check("POST /api/audit returns 200", auditRes.status === 200);
  check(
    "Audit has savings recommendation",
    audit.result?.totalMonthlySavings === 10
  );
  check("Audit has summary text", typeof audit.summary === "string" && audit.summary.length > 20);

  const leadRes = await fetch(`${BASE}/api/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: `test-${Date.now()}@example.com`,
      audit_id: audit.id ?? undefined,
      company: "Test Co",
    }),
  });
  const lead = await leadRes.json();
  check("POST /api/leads returns 200", leadRes.status === 200);
  check("Lead success flag", lead.success === true);

  const spamRes = await fetch(`${BASE}/api/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "spam@test.com",
      honeypot: "bot-fill",
    }),
  });
  check("Honeypot returns fake success", spamRes.status === 200);

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e.message);
  console.error("Is dev server running? npm run dev");
  process.exit(1);
});
