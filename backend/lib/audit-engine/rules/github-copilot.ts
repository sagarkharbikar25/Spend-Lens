import { TOOL_LABELS, type ToolInput } from "@/types";
import { PRICING } from "../pricing-data";
import { buildRecommendation, type RuleContext } from "../types";

export function evaluateGitHubCopilot(tool: ToolInput, _ctx: RuleContext) {
  if (!tool.enabled) return null;

  const name = TOOL_LABELS["github-copilot"];
  const { individual, businessPerUser } = PRICING.githubCopilot;

  if (tool.plan === "business" && tool.seats <= 2) {
    const businessCost = tool.seats * businessPerUser;
    const individualCost = tool.seats * individual;
    const saving = businessCost - individualCost;
    return buildRecommendation(
      tool,
      name,
      tool.seats === 1
        ? "Switch to Copilot Individual"
        : `Switch to ${tool.seats} × Copilot Individual`,
      `Business ($${businessPerUser}/user) adds policy controls. At ${tool.seats} seat(s), Individual ($${individual}/user) saves $${saving}/mo if you do not need org-wide policy.`,
      saving,
      "certain"
    );
  }

  return null;
}
