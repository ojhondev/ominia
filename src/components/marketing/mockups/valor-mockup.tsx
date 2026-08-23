import { CountUp } from "../count-up";

const bars = [
  { label: "T1", height: 32 },
  { label: "T2", height: 48 },
  { label: "T3", height: 40 },
  { label: "T4", height: 72 },
  { label: "T5", height: 100 },
];

export function ValorMockup() {
  return (
    <div className="rounded-ui border border-graphite-light bg-graphite-deep p-6 shadow-lg">
      <div className="flex items-center justify-between border-b border-graphite-light pb-4">
        <span className="font-mono text-xs uppercase tracking-wide text-ash">
          pilar_valor.trimestre
        </span>
        <span className="font-mono text-[10px] uppercase text-neon-glow">+18% vs. T4</span>
      </div>

      <div className="mt-6">
        <p className="font-mono text-xs uppercase tracking-wide text-ash">
          Valor financeiro gerado
        </p>
        <p className="mt-2 text-4xl font-medium tracking-tight text-whiteout">
          <CountUp to={340000} prefix="R$ " />
        </p>
        <p className="mt-1 text-xs text-pewter">
          crédito verde elegível + economia em conformidade
        </p>
      </div>

      <div className="mt-8 flex h-28 items-end gap-3">
        {bars.map((bar, i) => (
          <div key={bar.label} className="flex flex-1 flex-col items-center gap-2">
            <div
              className="grow-bar w-full rounded-t-sm bg-neon-muted"
              style={{
                height: `${bar.height}%`,
                animationDelay: `${i * 100}ms`,
              }}
            />
            <span className="font-mono text-[10px] text-pewter">{bar.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
