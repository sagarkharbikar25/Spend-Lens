import { TOOL_LABELS, type ToolInput } from "@/types";
import { PRICING } from "../pricing-data";
import { buildRecommendation, type RuleContext } from "../types";

export function evaluateChatGPT(tool: ToolInput, _ctx: RuleContext) {
  if (!tool.enabled) return null;

  const name = TOOL_LABELS.chatgpt;
  const { plusPerUser, teamPerUser } = PRICING.chatgpt;

  if (tool.plan === "team" && tool.seats === 2) {
    const teamCost = tool.seats * teamPerUser;
    const plusCost = tool.seats * plusPerUser;
    const saving = teamCost - plusCost;
    return buildRecommendation(
      tool,
      name,
      "Switch to 2 × ChatGPT Plus (individual)",
      `Team adds admin and analytics at $${teamPerUser}/user vs Plus at $${plusPerUser}/user. For 2 users without those needs, Plus saves $${saving}/mo.`,
      saving,
      "certain"
    );
  }

  if (tool.plan === "team" && tool.seats === 1) {
    const saving = teamPerUser - plusPerUser;
    return buildRecommendation(
      tool,
      name,
      "Switch to ChatGPT Plus (individual)",
      `A solo user on Team ($${teamPerUser}/mo) pays $${saving} more than Plus ($${plusPerUser}/mo) without team benefits.`,
      saving,
      "certain"
    );
  }

  return null;
}
