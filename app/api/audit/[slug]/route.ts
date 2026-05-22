import { NextResponse } from "next/server";
import { getAuditBySlug } from "@/backend/lib/audits";

type RouteContext = { params: { slug: string } };

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = context.params;
  const audit = await getAuditBySlug(slug);

  if (!audit) {
    return NextResponse.json({ error: "Audit not found" }, { status: 404 });
  }

  return NextResponse.json({
    slug: audit.slug,
    result: audit.result,
    summary: audit.summary,
    teamSize: audit.teamSize,
    useCase: audit.useCase,
    toolCount: audit.toolCount,
  });
}
