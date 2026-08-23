import { Factory, Truck, Gauge } from "lucide-react";
import { CountUp } from "../count-up";

const rows = [
  { icon: Factory, label: "Unidades cadastradas", value: 12 },
  { icon: Truck, label: "Fornecedores rastreados", value: 340 },
  { icon: Gauge, label: "Indicadores no catálogo", value: 128 },
];

export function DadosMockup() {
  return (
    <div className="rounded-ui border border-graphite-light bg-graphite-deep p-6 shadow-lg">
      <div className="flex items-center justify-between border-b border-graphite-light pb-4">
        <span className="font-mono text-xs uppercase tracking-wide text-ash">
          base_esg.consolidada
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase text-neon-glow">
          <span className="h-1.5 w-1.5 rounded-full bg-neon-glow pulse-dot" aria-hidden />
          sincronizado
        </span>
      </div>

      <div className="mt-5 flex flex-col divide-y divide-graphite-light">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <row.icon className="size-4 text-pewter" strokeWidth={1.75} />
              <span className="text-sm text-cloud">{row.label}</span>
            </div>
            <span className="font-mono text-lg text-whiteout">
              <CountUp to={row.value} />
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-ui border border-graphite-light bg-depth px-4 py-3">
        <p className="font-mono text-[11px] text-ash">
          <span className="text-neon-glow">+</span> 3 novos registros importados de
          planilha há 2 min — sem retrabalho manual
        </p>
      </div>
    </div>
  );
}
