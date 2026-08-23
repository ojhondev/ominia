const checks = [
  { label: "EUDR — rastreabilidade de origem", status: "done" },
  { label: "CVM 244 — divulgação de risco climático", status: "done" },
  { label: "GEE Scope 1-3 — inventário do trimestre", status: "done" },
  { label: "Selo RenovaBio — em validação", status: "pending" },
] as const;

export function ComplianceMockup() {
  return (
    <div className="rounded-ui border border-graphite-light bg-graphite-deep p-6 shadow-lg">
      <div className="flex items-center justify-between border-b border-graphite-light pb-4">
        <span className="font-mono text-xs uppercase tracking-wide text-ash">
          trilha_de_auditoria.log
        </span>
        <div className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-graphite-light" />
          <span className="h-2.5 w-2.5 rounded-full bg-graphite-light" />
          <span className="h-2.5 w-2.5 rounded-full bg-neon-muted" />
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 font-mono text-sm">
        {checks.map((check, i) => (
          <div
            key={check.label}
            className="reveal reveal-in flex items-start gap-3"
            style={{ animationDelay: `${i * 220}ms` }}
          >
            <span
              className={
                check.status === "done"
                  ? "text-neon-glow"
                  : "text-pewter"
              }
            >
              {check.status === "done" ? "[✓]" : "[…]"}
            </span>
            <span className={check.status === "done" ? "text-cloud" : "text-pewter"}>
              {check.label}
            </span>
          </div>
        ))}
        <div className="flex items-center gap-1 text-pewter">
          <span>_</span>
          <span className="h-4 w-2 bg-neon-glow cursor-blink" aria-hidden />
        </div>
      </div>

      <div className="mt-5 rounded-ui border border-graphite-light bg-depth px-4 py-3">
        <p className="font-mono text-[11px] text-ash">
          Responsável, data e evidência anexados automaticamente — pronto para
          auditor, banco ou comprador perguntar.
        </p>
      </div>
    </div>
  );
}
