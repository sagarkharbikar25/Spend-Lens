"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import type { AuditInput, ToolId, ToolInput, UseCase } from "@/types";
import { PLAN_OPTIONS, TOOL_IDS, TOOL_LABELS } from "@/types";

const STORAGE_KEY = "spendlens-form-v1";

function defaultTool(toolId: ToolId): ToolInput {
  const plans = PLAN_OPTIONS[toolId];
  return {
    toolId,
    enabled: false,
    plan: plans[0] ?? "unknown",
    monthlySpend: 0,
    seats: 1,
  };
}

function defaultFormState(): AuditInput {
  return {
    tools: TOOL_IDS.map(defaultTool),
    teamSize: 5,
    useCase: "coding",
  };
}

const USE_CASES: { value: UseCase; label: string }[] = [
  { value: "coding", label: "Coding" },
  { value: "writing", label: "Writing" },
  { value: "data", label: "Data" },
  { value: "research", label: "Research" },
  { value: "mixed", label: "Mixed" },
];

type Props = {
  onSubmit: (input: AuditInput) => void | Promise<void>;
  loading?: boolean;
};

export function SpendForm({ onSubmit, loading = false }: Props) {
  const [form, setForm] = useState<AuditInput>(defaultFormState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AuditInput;
        setForm(parsed);
      }
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
  }, [form, hydrated]);

  const updateTool = useCallback(
    (toolId: ToolId, patch: Partial<ToolInput>) => {
      setForm((prev) => ({
        ...prev,
        tools: prev.tools.map((t) =>
          t.toolId === toolId ? { ...t, ...patch } : t
        ),
      }));
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const enabled = form.tools.filter((t) => t.enabled);
    if (enabled.length === 0) return;
    await onSubmit({ ...form, tools: enabled });
  };

  if (!hydrated) {
    return (
      <p className="text-sm text-muted-foreground">Loading your saved inputs…</p>
    );
  }

  const enabledCount = form.tools.filter((t) => t.enabled).length;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Your team</CardTitle>
          <CardDescription>
            Team size and primary use case shape plan recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="teamSize">Team size</Label>
            <Input
              id="teamSize"
              type="number"
              min={1}
              value={form.teamSize}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  teamSize: Math.max(1, Number(e.target.value) || 1),
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="useCase">Primary use case</Label>
            <Select
              value={form.useCase}
              onValueChange={(value) => {
                if (!value) return;
                setForm((prev) => ({
                  ...prev,
                  useCase: value as UseCase,
                }));
              }}
            >
              <SelectTrigger id="useCase" className="w-full">
                <SelectValue placeholder="Select use case" />
              </SelectTrigger>
              <SelectContent>
                {USE_CASES.map((uc) => (
                  <SelectItem key={uc.value} value={uc.value}>
                    {uc.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">AI tools</h2>
          <p className="text-sm text-muted-foreground">
            Enable each tool you pay for and enter current plan and spend.
          </p>
        </div>

        {form.tools.map((tool) => (
          <Card key={tool.toolId}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Checkbox
                  id={`enabled-${tool.toolId}`}
                  checked={tool.enabled}
                  onCheckedChange={(checked) =>
                    updateTool(tool.toolId, { enabled: checked === true })
                  }
                />
                <Label
                  htmlFor={`enabled-${tool.toolId}`}
                  className="text-base font-medium"
                >
                  {TOOL_LABELS[tool.toolId]}
                </Label>
              </div>
            </CardHeader>
            {tool.enabled && (
              <CardContent className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Plan</Label>
                  <Select
                    value={tool.plan}
                    onValueChange={(value) => {
                      if (value) updateTool(tool.toolId, { plan: value });
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Plan" />
                    </SelectTrigger>
                    <SelectContent>
                      {PLAN_OPTIONS[tool.toolId].map((plan) => (
                        <SelectItem key={plan} value={plan}>
                          {plan}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`spend-${tool.toolId}`}>
                    Monthly spend (USD)
                  </Label>
                  <Input
                    id={`spend-${tool.toolId}`}
                    type="number"
                    min={0}
                    step={1}
                    value={tool.monthlySpend || ""}
                    onChange={(e) =>
                      updateTool(tool.toolId, {
                        monthlySpend: Math.max(0, Number(e.target.value) || 0),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`seats-${tool.toolId}`}>Seats</Label>
                  <Input
                    id={`seats-${tool.toolId}`}
                    type="number"
                    min={1}
                    value={tool.seats}
                    onChange={(e) =>
                      updateTool(tool.toolId, {
                        seats: Math.max(1, Number(e.target.value) || 1),
                      })
                    }
                  />
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      <Separator />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {enabledCount === 0
            ? "Enable at least one tool to run an audit."
            : `${enabledCount} tool${enabledCount === 1 ? "" : "s"} ready to audit.`}
        </p>
        <Button type="submit" disabled={enabledCount === 0 || loading}>
          {loading ? "Auditing…" : "Audit Now"}
        </Button>
      </div>
    </form>
  );
}
