import { Building2, Database, Leaf, Sprout } from "lucide-react";
import { requireSession } from "@/lib/auth/require-session";
import { getEmpresa, getResumoDashboard } from "@/lib/queries/dashboard";
import { listAlertas } from "@/lib/queries/alertas";
import { StatCard } from "@/components/ui/stat-card";
import { FormError } from "@/components/ui/form-error";
import { StatusBadge } from "@/components/ui/status-badge";
import { ActionLink } from "@/components/ui/action-button";

const TONE = { critico: "negative", atencao: "warning", info: "neutral" } as const;
const LABEL = { critico: "Crítico", atencao: "Atenção", info: "Info" } as const;

const ATALHOS = [
  { href: "/organizacao", label: "Organização", desc: "Usinas, fazendas e safras", icon: Building2 },
  { href: "/data-hub", label: "Data Hub", desc: "Registros agrícolas, industriais e logísticos", icon: Database },
  { href: "/renovabio", label: "RenovaBio / CBIO", desc: "NEEA, fator e quantidade de CBIO", icon: Leaf },
  { href: "/bonsucro", label: "Bonsucro", desc: "Produtividade, água e compliance", icon: Sprout },
];

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const session = await requireSession();
  const { erro } = await searchParams;
  const [empresa, resumo, alertas] = await Promise.all([
    getEmpresa(session.empresaId),
    getResumoDashboard(session.empresaId),
    listAlertas(session.empresaId),
  ]);
  const alertasTopo = alertas.slice(0, 5);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-medium tracking-tight text-lp-ink">
          Olá, {empresa?.nome ?? "bem-vindo(a)"}
        </h1>
        <p className="mt-1 text-lp-muted">Carbon &amp; Compliance OS — RenovaBio/CBIO e Bonsucro em um só lugar.</p>
      </div>

      <FormError code={erro} />

      {alertasTopo.length > 0 && (
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-xs tracking-wide text-lp-muted uppercase">
              Alertas ({alertas.length})
            </h2>
            {alertas.length > 5 && (
              <ActionLink href="/alertas">Ver todos →</ActionLink>
            )}
          </div>
          <div className="flex flex-col gap-2">
            {alertasTopo.map((a) => (
              <a
                key={a.id}
                href={a.href}
                className="flex items-center gap-3 rounded-2xl border border-lp-line bg-white p-4 transition-colors hover:border-lp-pink"
              >
                <StatusBadge label={LABEL[a.severidade]} tone={TONE[a.severidade]} />
                <p className="text-sm text-lp-ink">{a.titulo}</p>
              </a>
            ))}
          </div>
        </section>
      )}

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
