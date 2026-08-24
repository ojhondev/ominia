"use client";

import { useState } from "react";
import { ArrowRight, Plus } from "lucide-react";
import { Reveal } from "./reveal";

const solucoes = [
  {
    id: "emissoes",
    titulo: "Inventário de Emissões GEE",
    descricao:
      "Levantamento completo de emissões Escopo 1, 2 e 3 seguindo o GHG Protocol, com trilha de auditoria pronta para bancos e certificadoras.",
  },
  {
    id: "bonsucro",
    titulo: "Certificação Bonsucro",
    descricao:
      "Estruturação do dossiê e das evidências para a certificação Bonsucro, do cadastro de fornecedores ao relatório final.",
  },
  {
    id: "cbios",
    titulo: "Créditos CBios (RenovaBio)",
    descricao:
      "Cálculo e organização dos dados necessários para a emissão de CBios dentro do RenovaBio, com rastreabilidade completa.",
  },
  {
    id: "auditoria",
    titulo: "Trilha de Auditoria e Evidências",
    descricao:
      "Cada número gerado já nasce com origem, responsável e data — pronto para qualquer auditoria externa.",
  },
  {
    id: "score",
    titulo: "Score ESG de Fornecedores",
    descricao:
      "Avaliação estruturada da sua cadeia de fornecedores, com critérios claros e evidência por trás de cada nota.",
  },
];

function SolutionCard({
  solucao,
  dark,
  open,
  hidden = false,
  onOpen,
  onClose,
  onToggle,
}: {
  solucao: (typeof solucoes)[number];
  dark: boolean;
  open: boolean;
  hidden?: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
}) {
  return (
    <div
      id={hidden ? undefined : solucao.id}
      aria-hidden={hidden}
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
      onClick={onToggle}
      role="button"
      tabIndex={hidden ? -1 : 0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onToggle();
      }}
      className={`flex w-72 shrink-0 cursor-pointer flex-col justify-between rounded-2xl p-6 transition-[min-height] duration-300 ease-out sm:w-80 ${
        dark ? "bg-lp-purple" : "bg-lp-maroon-deep"
      } ${open ? "min-h-96" : "min-h-80"}`}
    >
      <div>
        <p className="text-lg leading-snug font-medium text-white">
          {solucao.titulo}
        </p>
        <div
          className={`grid transition-all duration-300 ease-out ${
            open ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <p className="overflow-hidden text-sm leading-relaxed text-white/75">
            {solucao.descricao}
          </p>
        </div>
      </div>

      <span
        className={`flex size-9 shrink-0 items-center justify-center rounded-full bg-lp-pink text-white transition-transform duration-300 ${
          open ? "rotate-45" : ""
        }`}
      >
        {open ? <Plus className="size-4" strokeWidth={2} /> : <ArrowRight className="size-4" strokeWidth={2} />}
      </span>
    </div>
  );
}

export function SolutionsRow() {
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [clickedId, setClickedId] = useState<string | null>(null);
  const openId = clickedId ?? hoverId;
  const paused = openId !== null;

  const track = [...solucoes, ...solucoes];

  return (
    <section id="time" className="py-16">
      <div className="px-4 sm:px-6 lg:px-10">
        <Reveal>
          <h2 className="max-w-2xl text-3xl leading-tight font-medium tracking-tight text-lp-ink sm:text-4xl">
            Conheça as frentes que já estamos construindo
          </h2>
        </Reveal>
      </div>

      <div className="mt-10 overflow-hidden">
        <div
          className="marquee-track-slow flex w-max items-start gap-4 px-4 sm:px-6 lg:px-10"
          style={{ animationPlayState: paused ? "paused" : "running" }}
        >
          {track.map((solucao, i) => {
            const isDuplicate = i >= solucoes.length;
            return (
              <SolutionCard
                key={`${solucao.id}-${i}`}
                solucao={solucao}
                dark={i % 2 === 0}
                hidden={isDuplicate}
                open={openId === solucao.id}
                onOpen={() => setHoverId(solucao.id)}
                onClose={() => setHoverId((current) => (current === solucao.id ? null : current))}
                onToggle={() =>
                  setClickedId((current) => (current === solucao.id ? null : solucao.id))
                }
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
