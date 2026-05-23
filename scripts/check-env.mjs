import { readFileSync } from "fs";
import { resolve } from "path";

const envPath = resolve(process.cwd(), ".env.local");
const lines = readFileSync(envPath, "utf8").split("\n");
const required = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "META_API_KEY",
];

let ok = true;
for (const key of required) {
  const line = lines.find((l) => l.startsWith(`${key}=`));
  const value = line?.split("=").slice(1).join("=").trim() ?? "";
  const status = value.length > 3 ? "SET" : "MISSING";
  console.log(`${key}: ${status}`);
  if (status === "MISSING") ok = false;
}

process.exit(ok ? 0 : 1);
