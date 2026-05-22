import { TOOL_LABELS, type ToolInput } from "@/types";
import { PRICING } from "../pricing-data";
import { buildRecommendation, type RuleContext } from "../types";

export function evaluateWindsurf(tool: ToolInput, _ctx: RuleContext) {
  if (!tool.enabled) return null;

  const name = TOOL_LABELS.windsurf;
  const { pro, teamsPerUser } = PRICING.windsurf;

  if (tool.plan === "teams" && tool.seats <= 2) {
    const teamsCost = tool.seats * teamsPerUser;
    const proCost = pro;
    const saving = teamsCost - proCost;
    if (saving <= 0) return null;
    return buildRecommendation(
      tool,
      name,
      tool.seats === 1 ? "Switch to Windsurf Pro" : "Use Pro for solo / pair dev",
      `Teams ($${teamsPerUser}/user) fits larger orgs. At ${tool.seats} seat(s), Pro ($${pro}/mo) saves $${saving}/mo if you do not need team admin.`,
      saving,
      "likely"
    );
  }

  return null;
}
