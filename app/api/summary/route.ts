import { NextResponse } from "next/server";
import { runAudit } from "@/lib/audit-engine";
import { generateAuditSummary } from "@/backend/lib/summary";
import { auditInputSchema } from "@/lib/validators";

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

    const enabled = parsed.data.tools.filter((t) => t.enabled);
    if (enabled.length === 0) {
      return NextResponse.json(
        { error: "Enable at least one tool" },
        { status: 400 }
      );
    }

    const input = {
      ...parsed.data,
      tools: enabled,
    };
    const result = runAudit(input);
    const summary = await generateAuditSummary(input, result);

    return NextResponse.json({ summary, result });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}
