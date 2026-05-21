"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  auditId: string | null;
  totalMonthlySavings: number;
};

export function EmailGate({ auditId, totalMonthlySavings }: Props) {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return;

    setStatus("loading");
    setMessage(null);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          company: company || undefined,
          role: role || undefined,
          team_size: teamSize ? Number(teamSize) : undefined,
          audit_id: auditId ?? undefined,
          honeypot: "",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong");
        return;
      }
      setStatus("success");
      setMessage(
        data.emailSent
          ? "Check your inbox — we sent a copy of your audit."
          : "Saved! Email delivery is pending (Resend not configured)."
      );
    } catch {
      setStatus("error");
      setMessage("Network error — try again.");
    }
  };

  const title =
    totalMonthlySavings < 100
      ? "Get notified when new optimizations apply"
      : "Email me this audit";

  const description =
    totalMonthlySavings < 100
      ? "You're spending well today. Leave your email and we'll ping you when pricing or plan rules change for your stack."
      : "We'll send your results and follow up if Credex can help you capture more savings.";

  if (status === "success") {
    return (
      <Card className="border-green-500/30 bg-green-500/5">
        <CardContent className="pt-6">
          <p className="text-sm font-medium text-foreground">{message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div
            className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
            aria-hidden
          >
            <label htmlFor="website">Website</label>
            <input
              id="website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lead-email">Work email *</Label>
            <Input
              id="lead-email"
              type="email"
              required
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="lead-company">Company</Label>
              <Input
                id="lead-company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead-role">Role</Label>
              <Input
                id="lead-role"
                placeholder="Engineering Manager"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead-team">Team size</Label>
              <Input
                id="lead-team"
                type="number"
                min={1}
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
              />
            </div>
          </div>

          {message && status === "error" && (
            <p className="text-sm text-destructive" role="alert">
              {message}
            </p>
          )}

          <Button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Sending…" : "Send my audit"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
