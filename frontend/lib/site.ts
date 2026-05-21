export function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

export function auditShareUrl(slug: string): string {
  return `${getAppUrl()}/audit/${slug}`;
}

export function ogImageUrl(): string {
  return `${getAppUrl()}/og-image.svg`;
}
