"use client";

import Link from "next/link";
import { AuditResultsView } from "@/components/AuditResultsView";
import { EmailGate } from "@/components/EmailGate";
import { Separator } from "@/components/ui/separator";
import type { AuditResult } from "@/types";

type Props = {
  result: AuditResult;
  summary: string;
  slug: string | null;
  auditId: string | null;
};

export function AuditResults({ result, summary, slug, auditId }: Props) {
  return (
    <div className="space-y-8">
      <AuditResultsView result={result} summary={summary} slug={slug} />

      {slug && (
        <p className="text-sm">
          <Link
            href={`/audit/${slug}`}
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Open public share page →
          </Link>
        </p>
      )}

      <Separator />

      <section>
        <p className="mb-4 text-sm text-muted-foreground">
          Results shown first — email is optional and only used to send your report.
        </p>
        <EmailGate
          auditId={auditId}
          totalMonthlySavings={result.totalMonthlySavings}
        />
      </section>
    </div>
  );
}
