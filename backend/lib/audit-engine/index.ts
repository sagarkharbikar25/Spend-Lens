import type { AuditInput, AuditResult, ToolId } from "@/types";
import { evaluateAnthropicApi } from "./rules/anthropic-api";
import { evaluateChatGPT } from "./rules/chatgpt";
import { evaluateClaude } from "./rules/claude";
import { evaluateCursor } from "./rules/cursor";
import { evaluateGemini } from "./rules/gemini";
import { evaluateGitHubCopilot } from "./rules/github-copilot";
import { evaluateOpenAIApi } from "./rules/openai-api";
import { evaluateWindsurf } from "./rules/windsurf";
import type { RuleContext, ToolRule } from "./types";

const EVALUATORS: Record<ToolId, ToolRule> = {
  cursor: evaluateCursor,
  "github-copilot": evaluateGitHubCopilot,
  claude: evaluateClaude,
  chatgpt: evaluateChatGPT,
  "anthropic-api": evaluateAnthropicApi,
  "openai-api": evaluateOpenAIApi,
  gemini: evaluateGemini,
  windsurf: evaluateWindsurf,
};

export function runAudit(input: AuditInput): AuditResult {
  const ctx: RuleContext = {
    teamSize: input.teamSize,
    useCase: input.useCase,
  };

  const enabled = input.tools.filter((t) => t.enabled);
  const recommendations = [];

  for (const tool of enabled) {
    const rec = EVALUATORS[tool.toolId](tool, ctx);
    if (rec) recommendations.push(rec);
  }

  const recommendedIds = new Set(recommendations.map((r) => r.toolId));
  const alreadyOptimal: ToolId[] = enabled
    .filter((t) => !recommendedIds.has(t.toolId))
    .map((t) => t.toolId);

  const totalMonthlySavings = recommendations.reduce(
    (sum, r) => sum + r.monthlySavings,
    0
  );
  const totalAnnualSavings = totalMonthlySavings * 12;

  return {
    recommendations,
    totalMonthlySavings,
    totalAnnualSavings,
    alreadyOptimal,
    isHighValue: totalMonthlySavings > 500,
  };
}
