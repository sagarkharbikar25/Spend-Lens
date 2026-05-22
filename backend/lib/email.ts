import { Resend } from "resend";
import { formatCurrency } from "@/lib/utils";

type AuditEmailParams = {
  to: string;
  monthlySavings: number;
  isHighValue: boolean;
  slug: string | null;
};

export async function sendAuditConfirmationEmail(
  params: AuditEmailParams
): Promise<{ sent: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { sent: false, error: "RESEND_API_KEY not configured" };
  }

  const from =
    process.env.RESEND_FROM_EMAIL ?? "SpendLens <onboarding@resend.dev>";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const shareLine = params.slug
    ? `<p>View your shareable report: <a href="${appUrl}/audit/${params.slug}">${appUrl}/audit/${params.slug}</a></p>`
    : "";

  const savingsLine =
    params.monthlySavings > 0
      ? `<p>We estimated about <strong>${formatCurrency(params.monthlySavings)}/month</strong> in potential savings from your audit.</p>`
      : `<p>Your stack looks well-sized for now — we'll notify you when new optimizations apply.</p>`;

  const credexLine = params.isHighValue
    ? `<p><strong>High savings detected.</strong> The Credex team may reach out about discounted AI infrastructure credits.</p>`
    : "";

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: params.to,
    subject: "Your SpendLens AI spend audit",
    html: `
      <h1>Thanks for using SpendLens</h1>
      ${savingsLine}
      ${credexLine}
      ${shareLine}
      <p style="color:#666;font-size:12px;">You received this because you requested a copy of your audit at SpendLens.</p>
    `,
  });

  if (error) {
    return { sent: false, error: error.message };
  }
  return { sent: true };
}
