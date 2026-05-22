import { TOOL_LABELS, type ToolInput } from "@/types";
import { PRICING } from "../pricing-data";
import { buildRecommendation, type RuleContext } from "../types";

export function evaluateOpenAIApi(tool: ToolInput, ctx: RuleContext) {
  if (!tool.enabled) return null;

  const name = TOOL_LABELS["openai-api"];

  if (
    tool.monthlySpend > PRICING.api.heavySpendThreshold &&
    (ctx.useCase === "writing" || ctx.useCase === "mixed")
  ) {
    return buildRecommendation(
      tool,
      name,
      "Compare ChatGPT Plus/Team vs API metered spend",
      `API spend of $${tool.monthlySpend}/mo for ${ctx.useCase} may exceed ChatGPT Plus ($${PRICING.chatgpt.plusPerUser}/user) if usage is chat-heavy rather than embedding/batch.`,
      Math.min(tool.monthlySpend * 0.2, 200),
      "possible"
    );
  }

  return null;
}
