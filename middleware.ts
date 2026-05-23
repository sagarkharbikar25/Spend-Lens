import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

type Bucket = { count: number; resetAt: number };

const globalStore = globalThis as typeof globalThis & {
  __spendlensLeadBuckets?: Map<string, Bucket>;
};

function getBuckets() {
  if (!globalStore.__spendlensLeadBuckets) {
    globalStore.__spendlensLeadBuckets = new Map();
  }
  return globalStore.__spendlensLeadBuckets;
}

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isRateLimited(ip: string): boolean {
  const buckets = getBuckets();
  const now = Date.now();
  const bucket = buckets.get(ip);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (bucket.count >= RATE_LIMIT_MAX) {
    return true;
  }

  bucket.count += 1;
  return false;
}

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname !== "/api/leads") {
    return NextResponse.next();
  }

  if (request.method !== "POST") {
    return NextResponse.next();
  }

  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Try again in an hour." },
      { status: 429 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/leads"],
};
