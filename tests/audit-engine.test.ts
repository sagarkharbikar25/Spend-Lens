import { describe, expect, it } from "vitest";
import { runAudit } from "../backend/lib/audit-engine";
import type { AuditInput } from "../shared/types";

describe("runAudit", () => {
  it("recommends ChatGPT Team downgrade at 2 users with certain confidence", () => {
    const input: AuditInput = {
      teamSize: 5,
      useCase: "coding",
      tools: [
        {
          toolId: "chatgpt",
          enabled: true,
          plan: "team",
          monthlySpend: 50,
          seats: 2,
        },
      ],
    };
    const result = runAudit(input);
    expect(result.recommendations).toHaveLength(1);
    expect(result.recommendations[0].monthlySavings).toBe(10);
    expect(result.recommendations[0].confidence).toBe("certain");
    expect(result.recommendations[0].recommendedAction).toContain("Plus");
  });

  it("marks Cursor Business at 6 users as already optimal", () => {
    const input: AuditInput = {
      teamSize: 8,
      useCase: "coding",
      tools: [
        {
          toolId: "cursor",
          enabled: true,
          plan: "business",
          monthlySpend: 240,
          seats: 6,
        },
      ],
    };
    const result = runAudit(input);
    expect(result.recommendations).toHaveLength(0);
    expect(result.alreadyOptimal).toContain("cursor");
    expect(result.totalMonthlySavings).toBe(0);
  });

  it("sets annual savings to 12 × monthly", () => {
    const input: AuditInput = {
      teamSize: 3,
      useCase: "coding",
      tools: [
        {
          toolId: "claude",
          enabled: true,
          plan: "team",
          monthlySpend: 75,
          seats: 3,
        },
      ],
    };
    const result = runAudit(input);
    expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12);
  });

  it("sums savings across multiple tools", () => {
    const input: AuditInput = {
      teamSize: 4,
      useCase: "coding",
      tools: [
        {
          toolId: "chatgpt",
          enabled: true,
          plan: "team",
          monthlySpend: 50,
          seats: 2,
        },
        {
          toolId: "claude",
          enabled: true,
          plan: "team",
          monthlySpend: 75,
          seats: 3,
        },
      ],
    };
    const result = runAudit(input);
    const expected = result.recommendations.reduce(
      (s, r) => s + r.monthlySavings,
      0
    );
    expect(result.totalMonthlySavings).toBe(expected);
    expect(result.recommendations.length).toBeGreaterThanOrEqual(2);
  });

  it("handles edge case: 1 user on Claude Team plan", () => {
    const input: AuditInput = {
      teamSize: 1,
      useCase: "writing",
      tools: [
        {
          toolId: "claude",
          enabled: true,
          plan: "team",
          monthlySpend: 25,
          seats: 1,
        },
      ],
    };
    const result = runAudit(input);
    expect(result.recommendations[0].monthlySavings).toBe(5);
    expect(result.recommendations[0].confidence).toBe("certain");
  });
});
