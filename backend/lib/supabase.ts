import { createClient } from "@supabase/supabase-js";

const rawSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function normalizeSupabaseUrl(url: string): string {
  return url.replace(/\/rest\/v1\/?$/i, "").replace(/\/$/, "");
}

function getSupabaseUrl(): string {
  if (!rawSupabaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable");
  }
  return normalizeSupabaseUrl(rawSupabaseUrl);
}

export function createBrowserClient() {
  const supabaseUrl = getSupabaseUrl();
  if (!supabaseAnonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable");
  }
  return createClient(supabaseUrl, supabaseAnonKey);
}

export function createServerClient() {
  const supabaseUrl = getSupabaseUrl();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable");
  }
  return createClient(supabaseUrl, serviceKey);
}
