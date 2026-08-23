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
      <h1 className="text-2xl font-medium tracking-tight text-whiteout">{title}</h1>
      <p className="mt-1 text-ash">{description}</p>

      <div className="mt-8 flex min-h-72 flex-col items-center justify-center gap-2 rounded-ui border border-dashed border-graphite-light p-12 text-center">
        <p className="font-mono text-xs uppercase tracking-wide text-neon-glow">
          Em construção
        </p>
        <p className="max-w-md text-sm text-pewter">
          Esta área ainda não foi implementada. Ver escopo em{" "}
          <code className="rounded bg-graphite px-1.5 py-0.5 font-mono text-xs text-cloud">
            {docRef}
          </code>
          .
        </p>
      </div>
    </div>
  );
}
