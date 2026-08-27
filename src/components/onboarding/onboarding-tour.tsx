"use client";

import { useState, useTransition } from "react";
import { Building2, Flame, FileStack, BellRing, Rocket, type LucideIcon } from "lucide-react";
import { concluirOnboarding } from "@/app/(app)/onboarding-actions";

type Passo = {
  icon: LucideIcon;
  titulo: string;
  texto: string;
};

const PASSOS: Passo[] = [
  {
    icon: Rocket,
    titulo: "Bem-vindo à Ominia",
    texto:
      "Sua operação de RenovaBio, Bonsucro e GHG Protocol em um só lugar. Um tour rápido pelos módulos principais antes de começar.",
  },
  {
    icon: Building2,
    titulo: "Comece pela Organização",
    texto:
      "Cadastre suas usinas, fazendas e safras — depois registre dados agrícolas, industriais e logísticos no Data Hub. Tudo alimenta os motores de cálculo depois.",
  },
  {
    icon: Flame,
    titulo: "Calcule com fórmula oficial",
    texto:
      "Motor GHG, RenovaBio/CBIO e Bonsucro — cada um com a fórmula oficial da norma, versionada, nunca aproximada. Se a norma mudar, resultados antigos não mudam retroativamente.",
  },
  {
    icon: FileStack,
    titulo: "Guarde a prova de tudo",
    texto:
      "Anexe documentos reais no Evidence Hub, vincule a usinas e safras, e acompanhe a trilha de Auditoria completa — quem fez o quê e quando.",
  },
  {
    icon: BellRing,
    titulo: "A plataforma trabalha por você",
    texto:
      "Alertas avisam sobre prazo vencendo e requisito fora de conformidade. O Registro de Integridade publica um relatório verificável para o mercado, com selo e hash de integridade.",
  },
];

export function OnboardingTour() {
  const [passo, setPasso] = useState(0);
  const [escondido, setEscondido] = useState(false);
  const [, startTransition] = useTransition();

  if (escondido) return null;

  const atual = PASSOS[passo];
  const Icon = atual.icon;
  const ultimo = passo === PASSOS.length - 1;

  function concluir() {
    setEscondido(true);
    startTransition(() => {
      concluirOnboarding();
    });
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-lp-ink/60 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl">
        <div className="flex items-center justify-between">
          <span className="flex size-11 items-center justify-center rounded-full bg-lp-purple text-white">
            <Icon className="size-5" strokeWidth={2} />
          </span>
          <button type="button" onClick={concluir} className="text-xs text-lp-muted hover:text-lp-ink">
            Pular tour
          </button>
        </div>

        <h2 className="mt-5 text-xl font-medium text-lp-ink">{atual.titulo}</h2>
        <p className="mt-2 text-sm leading-relaxed text-lp-muted">{atual.texto}</p>

        <div className="mt-6 flex gap-1.5">
          {PASSOS.map((p, i) => (
            <span
              key={p.titulo}
              className={`h-1.5 flex-1 rounded-full transition-colors ${i <= passo ? "bg-lp-pink" : "bg-lp-line"}`}
            />
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            disabled={passo === 0}
            onClick={() => setPasso((p) => Math.max(0, p - 1))}
            className="text-sm text-lp-muted transition-colors hover:text-lp-ink disabled:cursor-not-allowed disabled:opacity-0"
          >
            Voltar
          </button>
          <button
            type="button"
            onClick={() => (ultimo ? concluir() : setPasso((p) => p + 1))}
            className="rounded-full bg-lp-pink px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            {ultimo ? "Começar a usar" : "Próximo"}
          </button>
        </div>
      </div>
    </div>
  );
}
