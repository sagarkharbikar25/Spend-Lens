const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Supabase env vars missing");
  process.exit(1);
}

const res = await fetch(`${url}/rest/v1/audits?select=id&limit=1`, {
  headers: {
    apikey: key,
    Authorization: `Bearer ${key}`,
  },
});

if (res.ok) {
  console.log("Supabase connection: OK (audits table reachable)");
  process.exit(0);
}

console.error(`Supabase connection: FAILED (${res.status})`);
if (res.status === 404 || res.status === 406) {
  console.error("Hint: run database/supabase/schema.sql in Supabase SQL Editor");
}
process.exit(1);
