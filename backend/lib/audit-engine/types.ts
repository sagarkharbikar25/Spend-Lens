import type { ToolInput, ToolRecommendation, UseCase } from "@/types";

export interface RuleContext {
  teamSize: number;
  useCase: UseCase;
}

export type ToolRule = (
  tool: ToolInput,
  ctx: RuleContext
) => ToolRecommendation | null;

export function buildRecommendation(
  tool: ToolInput,
  toolName: string,
  recommendedAction: string,
  reason: string,
  monthlySavings: number,
  confidence: ToolRecommendation["confidence"]
): ToolRecommendation {
  return {
    toolId: tool.toolId,
    toolName,
    currentSpend: tool.monthlySpend,
    recommendedAction,
    reason,
    monthlySavings,
    confidence,
  };
}
