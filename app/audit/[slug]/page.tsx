import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAuditBySlug } from "@/backend/lib/audits";
import { AuditResultsView } from "@/components/AuditResultsView";
import { ShareButton } from "@/components/ShareButton";
import { auditShareUrl, ogImageUrl } from "@/frontend/lib/site";
import { formatCurrency } from "@/lib/utils";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const audit = await getAuditBySlug(params.slug);
  if (!audit) {
    return { title: "Audit not found — SpendLens" };
  }

  const { totalMonthlySavings, totalAnnualSavings } = audit.result;
  const title =
    totalMonthlySavings > 0
      ? `Save ${formatCurrency(totalMonthlySavings)}/mo on AI tools`
      : "AI spend audit — stack looks optimal";
  const description =
    audit.summary.slice(0, 160) ||
    `SpendLens audit: ${formatCurrency(totalAnnualSavings)}/year potential across ${audit.toolCount} tools.`;
  const url = auditShareUrl(params.slug);

  return {
    title: `${title} — SpendLens`,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "SpendLens",
      type: "website",
      images: [{ url: ogImageUrl(), width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl()],
    },
  };
}

export default async function AuditSharePage({ params }: Props) {
  const audit = await getAuditBySlug(params.slug);
  if (!audit) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-4 px-4 py-6 sm:px-6">
          <div>
            <Link href="/" className="text-sm font-medium text-muted-foreground">
              ← SpendLens
            </Link>
            <p className="mt-1 text-xs text-muted-foreground">
              Public audit · {audit.toolCount} tools · team of {audit.teamSize}
            </p>
          </div>
          <ShareButton slug={audit.slug} />
        </div>
      </header>

      <main id="main" className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <p className="mb-6 text-sm text-muted-foreground">
          Shared report — no email or company name included.{" "}
          <Link href="/" className="font-medium text-foreground underline-offset-4 hover:underline">
            Run your own audit
          </Link>
        </p>
        <AuditResultsView
          result={audit.result}
          summary={audit.summary}
          slug={audit.slug}
          showShareActions={false}
        />
      </main>
    </div>
  );
}
