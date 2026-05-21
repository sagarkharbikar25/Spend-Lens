import { ShareButton } from "@/components/ShareButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { TOOL_LABELS, type AuditResult, type ToolId } from "@/types";

type Props = {
  result: AuditResult;
  summary: string;
  slug?: string | null;
  showShareActions?: boolean;
};

export function AuditResultsView({
  result,
  summary,
  slug,
  showShareActions = true,
}: Props) {
  const { recommendations, alreadyOptimal, totalMonthlySavings, isHighValue } =
    result;
  const lowSavings = totalMonthlySavings < 100;

  return (
    <div className="space-y-8">
      <Card
        className={
          isHighValue
            ? "border-amber-500/40 bg-amber-500/10"
            : "border-primary/20 bg-primary/5"
        }
      >
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl">
            {totalMonthlySavings > 0
              ? `You could save ${formatCurrency(totalMonthlySavings)}/mo`
              : "You're spending well"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {totalMonthlySavings > 0 ? (
            <p className="text-xl font-medium text-foreground">
              {formatCurrency(result.totalAnnualSavings)}/year potential
            </p>
          ) : (
            <p className="text-muted-foreground">
              No obvious plan downgrades for this stack — spending looks reasonable
              for the inputs provided.
            </p>
          )}
          <p className="text-sm leading-relaxed text-muted-foreground">{summary}</p>
          {lowSavings && totalMonthlySavings > 0 && (
            <p className="text-sm text-muted-foreground">
              Savings are modest (&lt;$100/mo). Validate usage before switching
              plans.
            </p>
          )}
          {showShareActions && slug && (
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <ShareButton slug={slug} />
            </div>
          )}
        </CardContent>
      </Card>

      {isHighValue && (
        <Card className="border-amber-500/50 bg-gradient-to-br from-amber-500/15 to-transparent">
          <CardHeader>
            <CardTitle className="text-lg">High savings opportunity</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>
              This audit found {formatCurrency(totalMonthlySavings)}/mo in
              potential savings. Teams at this level often benefit from discounted
              AI infrastructure credits via Credex.
            </p>
          </CardContent>
        </Card>
      )}

      {recommendations.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight">
            Per-tool breakdown
          </h2>
          {recommendations.map((rec) => (
            <Card key={rec.toolId}>
              <CardHeader className="pb-2">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <CardTitle className="text-base">{rec.toolName}</CardTitle>
                  <span className="text-sm font-medium text-green-700 dark:text-green-400">
                    −{formatCurrency(rec.monthlySavings)}/mo
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>
                  <span className="text-muted-foreground">Current spend:</span>{" "}
                  {formatCurrency(rec.currentSpend)}/mo
                </p>
                <p>
                  <span className="font-medium text-foreground">Action:</span>{" "}
                  {rec.recommendedAction}
                </p>
                <p className="text-muted-foreground">{rec.reason}</p>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {rec.confidence} confidence
                </p>
              </CardContent>
            </Card>
          ))}
        </section>
      )}

      {alreadyOptimal.length > 0 && (
        <>
          <Separator />
          <section>
            <h2 className="text-lg font-semibold">Already optimal</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {alreadyOptimal.map((id) => TOOL_LABELS[id as ToolId]).join(", ")} —
              no clear downgrade for this setup.
            </p>
          </section>
        </>
      )}
    </div>
  );
}
