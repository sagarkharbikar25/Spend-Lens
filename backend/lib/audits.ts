import { createServerClient } from "@/lib/supabase";
import type { AuditInput, AuditResult } from "@/types";

export type PublicAudit = {
  slug: string;
  result: AuditResult;
  summary: string;
  teamSize: number;
  useCase: AuditInput["useCase"];
  toolCount: number;
};

type AuditRow = {
  slug: string;
  result: AuditResult;
  ai_summary: string | null;
  input: AuditInput;
};

export async function getAuditBySlug(slug: string): Promise<PublicAudit | null> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("audits")
      .select("slug, result, ai_summary, input")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      return null;
    }

    const row = data as AuditRow;
    const input = row.input;
    const result = row.result;

    return {
      slug: row.slug,
      result,
      summary: row.ai_summary ?? "",
      teamSize: input.teamSize,
      useCase: input.useCase,
      toolCount: input.tools?.length ?? 0,
    };
  } catch {
    return null;
  }
}
