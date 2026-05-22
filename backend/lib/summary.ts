import type { AuditInput, AuditResult } from "@/types";
import { TOOL_LABELS } from "@/types";
import { formatCurrency } from "@/lib/utils";

const META_API_URL = "https://api.llama.com/v1/chat/completions";
const SUMMARY_TIMEOUT_MS = 8000;
const DEFAULT_MODEL = "Llama-3.3-70B-Instruct";

function fallbackSummary(input: AuditInput, result: AuditResult): string {
  const enabled = input.tools.filter((t) => t.enabled).map((t) => TOOL_LABELS[t.toolId]);
  if (result.totalMonthlySavings === 0) {
    return `Your stack (${enabled.join(", ")}) looks well-sized for a ${input.teamSize}-person team focused on ${input.useCase}. We did not find obvious plan downgrades — recheck when vendors change pricing or your seat count shifts.`;
  }
  const top = result.recommendations
    .slice()
    .sort((a, b) => b.monthlySavings - a.monthlySavings)[0];
  return `You could save about ${formatCurrency(result.totalMonthlySavings)}/month (${formatCurrency(result.totalAnnualSavings)}/year) across ${result.recommendations.length} recommendation(s). Biggest win: ${top.toolName} — ${top.recommendedAction}. ${result.isHighValue ? "High savings — worth exploring discounted AI credits." : "Incremental savings add up; validate usage before switching plans."}`;
}

export async function generateAuditSummary(
  input: AuditInput,
  result: AuditResult
): Promise<string> {
  const apiKey = process.env.META_API_KEY;
  if (!apiKey) {
    return fallbackSummary(input, result);
  }

  const enabledTools = input.tools
    .filter((t) => t.enabled)
    .map(
      (t) =>
        `${TOOL_LABELS[t.toolId]}: ${t.plan}, $${t.monthlySpend}/mo, ${t.seats} seats`
    )
    .join("; ");

  const recs = result.recommendations
    .map(
      (r) =>
        `${r.toolName}: ${r.recommendedAction} (save $${r.monthlySavings}/mo, ${r.confidence})`
    )
    .join("; ");

  const prompt = `Write a ~100-word personalized summary for a startup engineering leader based on this AI spend audit. Be direct, numeric, and honest. Do not invent savings not in the data.

Team: ${input.teamSize} people, primary use case: ${input.useCase}.
Tools: ${enabledTools || "none"}.
Total savings: $${result.totalMonthlySavings}/month ($${result.totalAnnualSavings}/year).
Recommendations: ${recs || "none — stack already optimal"}.
Already optimal tools: ${result.alreadyOptimal.join(", ") || "n/a"}.`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), SUMMARY_TIMEOUT_MS);

  try {
    const res = await fetch(META_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.META_MODEL ?? DEFAULT_MODEL,
        messages: [
          {
            role: "system",
            content:
              "You write concise finance-friendly audit summaries. No markdown, no bullet lists.",
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 200,
        temperature: 0.4,
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      return fallbackSummary(input, result);
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = data.choices?.[0]?.message?.content?.trim();
    return text && text.length > 20 ? text : fallbackSummary(input, result);
  } catch {
    return fallbackSummary(input, result);
  } finally {
    clearTimeout(timeout);
  }
}
