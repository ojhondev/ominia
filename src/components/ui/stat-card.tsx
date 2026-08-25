export function StatCard({
  label,
  value,
  sublabel,
}: {
  label: string;
  value: string;
  sublabel?: string;
}) {
  return (
    <div className="rounded-2xl border border-lp-line bg-white p-6 shadow-[0px_4px_16px_rgba(21,15,38,0.04)]">
      <p className="font-mono text-xs tracking-wide text-lp-muted uppercase">{label}</p>
      <p className="mt-3 text-3xl font-medium tracking-tight text-lp-ink">{value}</p>
      {sublabel && <p className="mt-2 text-xs text-lp-muted">{sublabel}</p>}
    </div>
  );
}
