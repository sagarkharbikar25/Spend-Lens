export const TOOL_IDS = [
  "cursor",
  "github-copilot",
  "claude",
  "chatgpt",
  "anthropic-api",
  "openai-api",
  "gemini",
  "windsurf",
] as const;

export type ToolId = (typeof TOOL_IDS)[number];

export type UseCase =
  | "coding"
  | "writing"
  | "data"
  | "research"
  | "mixed";

export type Confidence = "certain" | "likely" | "possible";

export interface ToolInput {
  toolId: ToolId;
  enabled: boolean;
  plan: string;
  monthlySpend: number;
  seats: number;
}

export interface AuditInput {
  tools: ToolInput[];
  teamSize: number;
  useCase: UseCase;
}

export interface ToolRecommendation {
  toolId: ToolId;
  toolName: string;
  currentSpend: number;
  recommendedAction: string;
  reason: string;
  monthlySavings: number;
  confidence: Confidence;
}

export interface AuditResult {
  recommendations: ToolRecommendation[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  alreadyOptimal: ToolId[];
  isHighValue: boolean;
}

export interface AuditRecord {
  slug: string;
  result: AuditResult;
  summary?: string;
}

export interface LeadInput {
  email: string;
  company?: string;
  role?: string;
  team_size?: number;
  audit_id?: string;
  honeypot?: string;
}

export const TOOL_LABELS: Record<ToolId, string> = {
  cursor: "Cursor",
  "github-copilot": "GitHub Copilot",
  claude: "Claude",
  chatgpt: "ChatGPT",
  "anthropic-api": "Anthropic API",
  "openai-api": "OpenAI API",
  gemini: "Gemini",
  windsurf: "Windsurf",
};

export const PLAN_OPTIONS: Record<ToolId, string[]> = {
  cursor: ["hobby", "pro", "business", "enterprise"],
  "github-copilot": ["individual", "business", "enterprise"],
  claude: ["free", "pro", "max", "team", "enterprise", "api"],
  chatgpt: ["plus", "team", "enterprise", "api"],
  "anthropic-api": ["pay-as-you-go"],
  "openai-api": ["pay-as-you-go"],
  gemini: ["pro", "ultra", "api"],
  windsurf: ["free", "pro", "teams", "enterprise"],
};
