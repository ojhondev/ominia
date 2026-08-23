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
    <div className="rounded-ui border border-graphite-light bg-graphite-deep p-6">
      <p className="font-mono text-xs uppercase tracking-wide text-ash">{label}</p>
      <p className="mt-3 text-3xl font-medium tracking-tight text-whiteout">{value}</p>
      {sublabel && <p className="mt-2 text-xs text-pewter">{sublabel}</p>}
    </div>
  );
}
