import { NextResponse } from "next/server";
import { runAudit } from "@/lib/audit-engine";
import { generateAuditSummary } from "@/backend/lib/summary";
import { createServerClient } from "@/lib/supabase";
import { auditInputSchema } from "@/lib/validators";
import type { AuditInput } from "@/types";

function normalizeInput(data: AuditInput): AuditInput {
  const enabled = data.tools.filter((t) => t.enabled);
  return { ...data, tools: enabled };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = auditInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    if (!parsed.data.tools.some((t) => t.enabled)) {
      return NextResponse.json(
        { error: "Enable at least one tool" },
        { status: 400 }
      );
    }

    const input = normalizeInput(parsed.data as AuditInput);
    const result = runAudit(input);

    const summary = await generateAuditSummary(input, result);
    let slug: string | null = null;
    let auditId: string | null = null;

    try {
      const supabase = createServerClient();
      const { data, error } = await supabase
        .from("audits")
        .insert({
          input,
          result,
          ai_summary: summary,
        })
        .select("id, slug")
        .single();

      if (error) {
        console.error("Supabase insert failed:", error.message);
      } else {
        slug = data.slug;
        auditId = data.id;
      }
    } catch (err) {
      console.error("Supabase unavailable:", err);
    }

    return NextResponse.json({
      id: auditId,
      slug,
      result,
      summary,
    });
  } catch (err) {
    console.error("Audit failed:", err);
    return NextResponse.json({ error: "Audit failed" }, { status: 500 });
  }
}
