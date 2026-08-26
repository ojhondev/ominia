import { Building2, Database, Leaf, Sprout } from "lucide-react";
import { requireSession } from "@/lib/auth/require-session";
import { getEmpresa, getResumoDashboard } from "@/lib/queries/dashboard";
import { StatCard } from "@/components/ui/stat-card";

const ATALHOS = [
  { href: "/organizacao", label: "Organização", desc: "Usinas, fazendas e safras", icon: Building2 },
  { href: "/data-hub", label: "Data Hub", desc: "Registros agrícolas, industriais e logísticos", icon: Database },
  { href: "/renovabio", label: "RenovaBio / CBIO", desc: "NEEA, fator e quantidade de CBIO", icon: Leaf },
  { href: "/bonsucro", label: "Bonsucro", desc: "Produtividade, água e compliance", icon: Sprout },
];

export default async function DashboardPage() {
  const session = await requireSession();
  const [empresa, resumo] = await Promise.all([
    getEmpresa(session.empresaId),
    getResumoDashboard(session.empresaId),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-medium tracking-tight text-lp-ink">
          Olá, {empresa?.nome ?? "bem-vindo(a)"}
        </h1>
        <p className="mt-1 text-lp-muted">Carbon &amp; Compliance OS — RenovaBio/CBIO e Bonsucro em um só lugar.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {ATALHOS.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.href}
              href={item.href}
              className="flex items-start gap-3 rounded-2xl border border-lp-line bg-white p-5 transition-colors hover:border-lp-pink"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-lp-paper-soft text-lp-pink">
                <Icon className="size-4.5" strokeWidth={2} />
              </span>
              <span>
                <p className="font-medium text-lp-ink">{item.label}</p>
                <p className="mt-1 text-xs text-lp-muted">{item.desc}</p>
              </span>
            </a>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Usinas" value={String(resumo.totalUsinas)} sublabel="cadastradas na organização" />
        <StatCard label="Safras abertas" value={String(resumo.totalSafrasAbertas)} sublabel="em andamento" />
        <StatCard
          label="Emissões (GHG)"
          value={resumo.emissaoTotal.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}
          sublabel="soma bruta dos cálculos — unidade varia por fator (ver Motor GHG)"
        />
        <StatCard
          label="CBIO estimado"
          value={resumo.cbioEstimado.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}
          sublabel="soma dos cálculos RenovaBio"
        />
        <StatCard
          label="Score Bonsucro"
          value={resumo.bonsucroScoreMedio !== null ? `${resumo.bonsucroScoreMedio}%` : "—"}
          sublabel="médio entre usinas avaliadas"
        />
        <StatCard
          label="Requisitos sem dados"
          value={String(resumo.requisitosPendentes)}
          sublabel="pendentes de avaliação em Auditoria"
        />
      </div>
    </div>
  );
}
