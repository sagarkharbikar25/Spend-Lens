export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div
      className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground"
      role="status"
      aria-live="polite"
    >
      <span className="size-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
      {label}
    </div>
  );
}
