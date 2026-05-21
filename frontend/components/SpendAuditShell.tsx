"use client";

import { useState } from "react";
import { AuditResults } from "@/components/AuditResults";
import { SpendForm } from "@/components/SpendForm";
import { LoadingState } from "@/components/LoadingState";
import type { AuditInput, AuditResult } from "@/types";

type AuditResponse = {
  id: string | null;
  slug: string | null;
  result: AuditResult;
  summary: string;
};

export function SpendAuditShell() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audit, setAudit] = useState<AuditResponse | null>(null);

  const handleAudit = async (input: AuditInput) => {
    setLoading(true);
    setError(null);
    setAudit(null);

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Audit failed");
        return;
      }
      setAudit(data as AuditResponse);
      requestAnimationFrame(() => {
        document.getElementById("audit-results")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    } catch {
      setError("Network error — try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <SpendForm onSubmit={handleAudit} loading={loading} />
      {loading && <LoadingState label="Running audit…" />}
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      {audit && (
        <div id="audit-results">
          <AuditResults
            result={audit.result}
            summary={audit.summary}
            slug={audit.slug}
            auditId={audit.id}
          />
        </div>
      )}
    </div>
  );
}
