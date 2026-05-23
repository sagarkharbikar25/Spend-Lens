import { describe, expect, it } from "vitest";
import { leadInputSchema } from "../backend/lib/validators";

describe("leadInputSchema", () => {
  it("accepts valid lead payload", () => {
    const parsed = leadInputSchema.safeParse({
      email: "founder@startup.com",
      company: "Acme",
      role: "CTO",
      team_size: 8,
    });
    expect(parsed.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const parsed = leadInputSchema.safeParse({
      email: "not-an-email",
    });
    expect(parsed.success).toBe(false);
  });
});
