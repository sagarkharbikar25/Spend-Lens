import { TOOL_LABELS, type ToolInput } from "@/types";
import { PRICING } from "../pricing-data";
import { buildRecommendation, type RuleContext } from "../types";

export function evaluateGemini(tool: ToolInput, ctx: RuleContext) {
  if (!tool.enabled) return null;

  const name = TOOL_LABELS.gemini;

  if (tool.plan === "ultra" && tool.seats <= 2 && ctx.useCase !== "research") {
    const saving = Math.round(PRICING.gemini.ultra - PRICING.gemini.pro);
    return buildRecommendation(
      tool,
      name,
      "Downgrade to Gemini Pro",
      `Ultra ($${PRICING.gemini.ultra}/mo) targets deep research workloads. For ${ctx.useCase}, Pro (~$${PRICING.gemini.pro}/mo) is usually enough — save ~$${saving}/mo.`,
      saving,
      "likely"
    );
  }

  return null;
}
