import Link from "next/link";

export default function AuditNotFound() {
  return (
    <main className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="text-2xl font-bold">Audit not found</h1>
      <p className="mt-2 text-muted-foreground">
        This link may be expired or the audit was never saved.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block font-medium text-primary underline-offset-4 hover:underline"
      >
        Run a new audit
      </Link>
    </main>
  );
}
