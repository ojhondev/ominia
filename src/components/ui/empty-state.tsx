export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-lp-line p-10 text-center">
      <p className="font-mono text-xs tracking-wide text-lp-muted uppercase">{title}</p>
      <p className="max-w-sm text-sm text-lp-muted">{description}</p>
    </div>
  );
}
