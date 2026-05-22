import { NextResponse } from "next/server";
import { sendAuditConfirmationEmail } from "@/backend/lib/email";
import { createServerClient } from "@/lib/supabase";
import { leadInputSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.honeypot) {
      return NextResponse.json({ success: true });
    }

    const parsed = leadInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { email, company, role, team_size, audit_id } = parsed.data;

    let monthlySavings = 0;
    let isHighValue = false;
    let slug: string | null = null;

    try {
      const supabase = createServerClient();

      if (audit_id) {
        const { data: audit } = await supabase
          .from("audits")
          .select("slug, result")
          .eq("id", audit_id)
          .single();

        if (audit?.result) {
          const result = audit.result as {
            totalMonthlySavings?: number;
            isHighValue?: boolean;
          };
          monthlySavings = result.totalMonthlySavings ?? 0;
          isHighValue = result.isHighValue ?? false;
          slug = audit.slug ?? null;
        }
      }

      const { error: insertError } = await supabase.from("leads").insert({
        audit_id: audit_id ?? null,
        email,
        company: company ?? null,
        role: role ?? null,
        team_size: team_size ?? null,
        honeypot: null,
        source: "audit_gate",
      });

      if (insertError) {
        console.error("Lead insert failed:", insertError.message);
        const needsSchema =
          insertError.message.includes("relation") ||
          insertError.code === "PGRST205";
        return NextResponse.json(
          {
            error: needsSchema
              ? "Database tables missing — run database/supabase/schema.sql in Supabase"
              : "Could not save lead",
          },
          { status: needsSchema ? 503 : 500 }
        );
      }
    } catch (err) {
      console.error("Supabase lead error:", err);
      return NextResponse.json(
        { error: "Database unavailable" },
        { status: 503 }
      );
    }

    const emailResult = await sendAuditConfirmationEmail({
      to: email,
      monthlySavings,
      isHighValue,
      slug,
    });

    return NextResponse.json({
      success: true,
      emailSent: emailResult.sent,
    });
  } catch (err) {
    console.error("Leads API error:", err);
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}
