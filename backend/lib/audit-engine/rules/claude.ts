import { TOOL_LABELS, type ToolInput } from "@/types";
import { PRICING } from "../pricing-data";
import { buildRecommendation, type RuleContext } from "../types";

export function evaluateClaude(tool: ToolInput, ctx: RuleContext) {
  if (!tool.enabled) return null;

  const name = TOOL_LABELS.claude;
  const { proPerUser, teamPerUser } = PRICING.claude;

  if (tool.plan === "team" && tool.seats <= 3) {
    const saving = tool.seats * (teamPerUser - proPerUser);
    return buildRecommendation(
      tool,
      name,
      `Switch to ${tool.seats} × Claude Pro (individual)`,
      `Team adds SSO and admin at $${teamPerUser}/user vs Pro at $${proPerUser}/user. At ${tool.seats} seats without compliance needs, individual Pro saves $${saving}/mo.`,
      saving,
      "certain"
    );
  }

  if (tool.plan === "max" && tool.seats === 1 && ctx.useCase !== "coding") {
    return buildRecommendation(
      tool,
      name,
      "Consider Claude Pro instead of Max",
      `Max ($${PRICING.claude.maxPerUser}/mo) targets power users. For ${ctx.useCase} workloads, Pro ($${proPerUser}/mo) often covers usage.`,
      PRICING.claude.maxPerUser - proPerUser,
      "likely"
    );
  }

  return null;
}
