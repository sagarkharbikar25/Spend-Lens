import { TOOL_LABELS, type ToolInput } from "@/types";
import { PRICING } from "../pricing-data";
import { buildRecommendation, type RuleContext } from "../types";

export function evaluateCursor(tool: ToolInput, ctx: RuleContext) {
  if (!tool.enabled) return null;

  const name = TOOL_LABELS.cursor;
  const { proPerUser, businessPerUser } = PRICING.cursor;

  if (tool.plan === "business" && tool.seats >= 6) {
    return null;
  }

  if (tool.plan === "business" && tool.seats <= 3) {
    const saving = tool.seats * (businessPerUser - proPerUser);
    return buildRecommendation(
      tool,
      name,
      `Switch to ${tool.seats} × Cursor Pro`,
      `Business ($${businessPerUser}/user) adds org billing and policies. At ${tool.seats} seats without those needs, Pro ($${proPerUser}/user) saves $${saving}/mo.`,
      saving,
      "likely"
    );
  }

  if (tool.plan === "pro" && tool.seats === 1 && ctx.useCase === "writing") {
    return buildRecommendation(
      tool,
      name,
      "Evaluate if Hobby/Free tier covers your usage",
      "Cursor Free includes daily limits. For light writing assists (not heavy code completion), free may suffice.",
      proPerUser,
      "possible"
    );
  }

  return null;
}
