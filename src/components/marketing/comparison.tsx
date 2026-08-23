import { Check, X } from "lucide-react";
import { Reveal } from "./reveal";

const others = [
  "Você é o dado — o banco ou a seguradora é o cliente",
  "Cobra por fornecedor avaliado, penaliza rastrear a cadeia produtiva",
  "Entrega score de risco ou relatório de conformidade",
  "Termina no crédito — não cobre a gestão da agroindústria",
];

const ominia = [
  "Você é o cliente — o hub é seu, para gerir sua agroindústria",
  "Cobra por empresa, não por fornecedor rastreado",
  "Entrega Dados → Compliance → Valor, um fluxo único",
  "Traduz o ESG do seu agronegócio em reais: crédito e argumento comercial",
];

export function Comparison() {
  return (
    <section id="diferencial" className="border-b border-graphite-light py-24 sm:py-32">
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24">
        <Reveal className="max-w-2xl text-left">
          <span className="font-mono text-xs uppercase tracking-widest text-neon-glow">
            Por que Ominia
          </span>
          <h2 className="mt-4 text-3xl font-medium tracking-tight text-whiteout sm:text-4xl">
            Feita para quem opera. Não para quem financia.
          </h2>
          <p className="mt-5 text-base text-ash">
            A maioria das plataformas ESG do agronegócio vende seu dado de risco para
            bancos e seguradoras decidirem sobre você. A Ominia inverte isso.
          </p>
        </Reveal>

        <div className="mt-16 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
          <Reveal className="rounded-ui border border-graphite-light bg-depth p-8">
            <p className="font-mono text-xs uppercase tracking-widest text-pewter">
              Plataformas de risco tradicionais
            </p>
            <ul className="mt-6 flex flex-col gap-4">
              {others.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-ash">
                  <X className="mt-0.5 size-4 shrink-0 text-pewter" strokeWidth={1.75} />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal
            delay={100}
            className="rounded-ui border border-neon-muted bg-graphite-deep p-8"
          >
            <p className="font-mono text-xs uppercase tracking-widest text-neon-glow">
              Ominia
            </p>
            <ul className="mt-6 flex flex-col gap-4">
              {ominia.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-cloud">
                  <Check
                    className="mt-0.5 size-4 shrink-0 text-neon-glow"
                    strokeWidth={1.75}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
