export function PlaceholderPage({
  title,
  description,
  docRef,
}: {
  title: string;
  description: string;
  docRef: string;
}) {
  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-medium tracking-tight text-lp-ink">{title}</h1>
      <p className="mt-1 text-lp-muted">{description}</p>

      <div className="mt-8 flex min-h-72 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-lp-line p-12 text-center">
        <p className="font-mono text-xs tracking-wide text-lp-pink uppercase">
          Em construção
        </p>
        <p className="max-w-md text-sm text-lp-muted">
          Esta área ainda não foi implementada. Ver escopo em{" "}
          <code className="rounded bg-lp-paper-soft px-1.5 py-0.5 font-mono text-xs text-lp-ink">
            {docRef}
          </code>
          .
        </p>
      </div>
    </div>
  );
}
