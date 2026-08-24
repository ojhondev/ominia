import { ArrowRight } from "lucide-react";
import { Reveal } from "./reveal";

const solucoes = [
  { id: "emissoes", titulo: "Inventário de Emissões GEE" },
  { id: "bonsucro", titulo: "Certificação Bonsucro" },
  { id: "cbios", titulo: "Créditos CBios (RenovaBio)" },
  { id: "auditoria", titulo: "Trilha de Auditoria e Evidências" },
  { id: "score", titulo: "Score ESG de Fornecedores" },
];

export function SolutionsRow() {
  return (
    <section id="time" className="px-4 py-16 sm:px-6 lg:px-10">
      <Reveal>
        <h2 className="max-w-2xl text-3xl leading-tight font-medium tracking-tight text-lp-ink sm:text-4xl">
          Conheça as frentes que já estamos construindo
        </h2>
      </Reveal>

      <div className="mt-10 flex gap-4 overflow-x-auto pb-2">
        {solucoes.map((solucao, i) => {
          const dark = i % 2 === 0;
          return (
            <Reveal key={solucao.id} delay={i * 60} className="shrink-0">
              <div
                id={solucao.id}
                className={`flex h-72 w-56 flex-col justify-between rounded-2xl p-6 ${
                  dark ? "bg-lp-purple" : "bg-lp-maroon-deep"
                }`}
              >
                <p className="text-base leading-snug font-medium text-white">
                  {solucao.titulo}
                </p>
                <span className="flex size-9 items-center justify-center rounded-full bg-lp-pink text-white">
                  <ArrowRight className="size-4" strokeWidth={2} />
                </span>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
