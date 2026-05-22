import { TOOL_LABELS, type ToolInput } from "@/types";
import { PRICING } from "../pricing-data";
import { buildRecommendation, type RuleContext } from "../types";

export function evaluateAnthropicApi(tool: ToolInput, ctx: RuleContext) {
  if (!tool.enabled) return null;

  const name = TOOL_LABELS["anthropic-api"];

  if (
    tool.monthlySpend > PRICING.api.heavySpendThreshold &&
    ctx.useCase !== "data"
  ) {
    return buildRecommendation(
      tool,
      name,
      "Review Claude Pro/Team vs direct API spend",
      `At $${tool.monthlySpend}/mo on API, a Claude subscription ($${PRICING.claude.proPerUser}–$${PRICING.claude.teamPerUser}/user) may include predictable caps vs variable API billing.`,
      Math.min(tool.monthlySpend * 0.15, 150),
      "possible"
    );
  }

  if (tool.monthlySpend < PRICING.api.lightSpendThreshold) {
    return null;
  }

  return null;
}
