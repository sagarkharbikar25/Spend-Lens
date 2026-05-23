/**
 * Day 4 smoke test — requires dev server + Supabase schema
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

  const auditRes = await fetch(`${BASE}/api/audit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(auditPayload),
  });
  const audit = await auditRes.json();
  check("POST /api/audit returns 200", auditRes.status === 200);
  check("Audit returns slug", Boolean(audit.slug));

  if (!audit.slug) {
    console.log("\nNo slug — run database/supabase/schema.sql first");
    process.exit(1);
  }

  const getRes = await fetch(`${BASE}/api/audit/${audit.slug}`);
  const publicAudit = await getRes.json();
  check("GET /api/audit/[slug] returns 200", getRes.status === 200);
  check("Public API has result + summary", Boolean(publicAudit.result && publicAudit.summary));
  check(
    "Public API omits email fields",
    !("email" in publicAudit) && !("company" in publicAudit)
  );

  const pageRes = await fetch(`${BASE}/audit/${audit.slug}`);
  const html = await pageRes.text();
  check("Share page returns 200", pageRes.status === 200);
  check("Share page shows savings", html.includes("10") || html.includes("save"));
  check("Share page has no email gate copy", !html.includes("Send my audit"));

  const ogRes = await fetch(`${BASE}/og-image.svg`);
  check("OG image asset available", ogRes.status === 200);

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e.message);
  console.error("Start dev server: npm run dev");
  process.exit(1);
});
