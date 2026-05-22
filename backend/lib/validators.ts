import { z } from "zod";
import { TOOL_IDS, type UseCase } from "@/types";

const useCaseSchema = z.enum([
  "coding",
  "writing",
  "data",
  "research",
  "mixed",
]) satisfies z.ZodType<UseCase>;

export const toolInputSchema = z.object({
  toolId: z.enum(TOOL_IDS),
  enabled: z.boolean(),
  plan: z.string().min(1),
  monthlySpend: z.number().min(0),
  seats: z.number().int().min(1),
});

export const auditInputSchema = z.object({
  tools: z.array(toolInputSchema).min(1),
  teamSize: z.number().int().min(1).max(10000),
  useCase: useCaseSchema,
});

export const leadInputSchema = z.object({
  email: z.string().email(),
  company: z.string().max(200).optional(),
  role: z.string().max(100).optional(),
  team_size: z.number().int().min(1).max(10000).optional(),
  audit_id: z.string().uuid().optional(),
  honeypot: z.string().optional(),
});

export type AuditInputParsed = z.infer<typeof auditInputSchema>;
export type LeadInputParsed = z.infer<typeof leadInputSchema>;
