import { Database, ShieldCheck, TrendingUp } from "lucide-react";
import { Reveal } from "./reveal";

const pillars = [
  {
    icon: Database,
    label: "Dados",
    copy: "Unidades, fornecedores e indicadores da sua cadeia produtiva em uma base única e rastreável.",
  },
  {
    icon: ShieldCheck,
    label: "Compliance",
    copy: "Cada dado vira evidência com trilha de auditoria — pronta antes de perguntarem.",
  },
  {
    icon: TrendingUp,
    label: "Valor",
    copy: "Traduzimos o ESG do seu agronegócio em BRL: crédito, contrato comercial, economia real.",
  },
];

export function PillarBar() {
  return (
    <section className="border-y border-graphite-light bg-depth">
      <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-6 px-6 py-6 sm:grid sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-graphite-light sm:overflow-visible sm:scroll-px-0 sm:px-10 sm:py-0 lg:px-16 xl:px-24">
        {pillars.map((pillar, i) => (
          <Reveal
            key={pillar.label}
            delay={i * 100}
            className="w-[80%] shrink-0 snap-center rounded-ui border border-graphite-light bg-graphite-deep p-6 sm:w-auto sm:shrink sm:snap-none sm:rounded-none sm:border-0 sm:bg-transparent sm:px-8 sm:py-10"
          >
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
