const TONES = {
  neutral: "border-lp-line bg-lp-paper-soft text-lp-muted",
  positive: "border-emerald-200 bg-emerald-50 text-emerald-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  negative: "border-rose-200 bg-rose-50 text-rose-700",
} as const;

export function StatusBadge({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: keyof typeof TONES;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[11px] tracking-wide uppercase ${TONES[tone]}`}
    >
      {label}
    </span>
  );
}
