import { Database, ShieldCheck, TrendingUp } from "lucide-react";
import { Reveal } from "./reveal";

const pillars = [
  {
    icon: Database,
    label: "Dados",
    copy: "Unidades, fornecedores e indicadores em uma base única e rastreável.",
  },
  {
    icon: ShieldCheck,
    label: "Compliance",
    copy: "Cada dado vira evidência com trilha de auditoria — pronta antes de perguntarem.",
  },
  {
    icon: TrendingUp,
    label: "Valor",
    copy: "Traduzimos ESG em BRL: crédito, contrato comercial, economia real.",
  },
];

export function PillarBar() {
  return (
    <section className="border-y border-graphite-light bg-depth">
      <div className="mx-auto grid max-w-(--breakpoint-xl) grid-cols-1 divide-y divide-graphite-light sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {pillars.map((pillar, i) => (
          <Reveal key={pillar.label} delay={i * 100} className="px-8 py-10">
            <pillar.icon className="size-5 text-neon-glow" strokeWidth={1.75} />
            <p className="mt-4 font-mono text-xs uppercase tracking-widest text-whiteout">
              {pillar.label}
            </p>
            <p className="mt-2 text-sm text-ash">{pillar.copy}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
