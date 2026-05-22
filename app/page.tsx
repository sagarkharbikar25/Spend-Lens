import { SpendAuditShell } from "@/components/SpendAuditShell";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
          <p className="text-sm font-medium text-muted-foreground">SpendLens</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Audit Your AI Spend in 90 Seconds
          </h1>
          <p className="mt-3 max-w-xl text-foreground/80">
            Find where Claude, ChatGPT, and Cursor plans bleed money — free, no
            login.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            3,200+ startup stacks audited{" "}
            <span className="text-xs">(illustrative — MVP)</span>
          </p>
        </div>
      </header>
      <main id="main" className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <SpendAuditShell />
      </main>
    </div>
  );
}
