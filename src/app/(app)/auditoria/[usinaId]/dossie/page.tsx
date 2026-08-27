import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { requireSession } from "@/lib/auth/require-session";
import { getDossie } from "@/lib/queries/dossie";
import { PrintButton } from "@/components/ui/print-button";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { getSiteUrl } from "@/lib/site-url";

const STATUS_MAP = {
  conforme: { label: "Conforme", tone: "positive" as const },
  atencao: { label: "Atenção", tone: "warning" as const },
  nao_conforme: { label: "Não conforme", tone: "negative" as const },
  sem_dados: { label: "Sem dados", tone: "neutral" as const },
};

export default async function DossiePage({
  params,
}: {
  params: Promise<{ usinaId: string }>;
}) {
  const session = await requireSession();
  const { usinaId } = await params;
  const dossie = await getDossie(usinaId, session.empresaId);
  if (!dossie) notFound();

  const { usina, requisitosComStatus, score, safras, evidencias, calculos, relatoriosPublicados } = dossie;

  return (
    <div className="flex max-w-4xl flex-col gap-8">
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/auditoria" className="text-sm text-lp-muted hover:text-lp-ink">
            ← Auditoria
          </Link>
          <h1 className="mt-1 text-2xl font-medium tracking-tight text-lp-ink">Dossiê de auditoria — {usina.nome}</h1>
        </div>
        <PrintButton>Baixar PDF</PrintButton>
      </div>

      <article className="flex flex-col gap-10 rounded-2xl border border-lp-line bg-white p-8 print:rounded-none print:border-0 print:p-0">
        <div className="flex items-center justify-between border-b border-lp-line pb-4">
          <div>
            <p className="font-mono text-xs tracking-wide text-lp-muted uppercase">Ominia — Dossiê de Auditoria</p>
            <h2 className="mt-1 text-xl font-medium text-lp-ink">{usina.nome}</h2>
            <p className="mt-1 text-sm text-lp-muted">
              {usina.municipio ? `${usina.municipio}${usina.estado ? `/${usina.estado}` : ""} · ` : ""}
              Gerado em {new Date().toLocaleString("pt-BR")}
            </p>
          </div>
          <Image src="/brand/ominia-wordmark-dark.png" alt="Ominia" width={104} height={19} className="h-5 w-auto" />
        </div>

        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-xs tracking-wide text-lp-muted uppercase">Compliance Bonsucro</h3>
            {score && (
              <StatusBadge
                label={`${score.percentual}% (${score.conformes}/${score.total})`}
                tone={score.percentual >= 70 ? "positive" : "warning"}
              />
            )}
          </div>
          {requisitosComStatus.length === 0 ? (
            <EmptyState title="Sem requisitos avaliados" description="Nenhum requisito Bonsucro foi avaliado para esta usina ainda." />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-lp-line">
              <table className="w-full min-w-max border-collapse text-sm">
                <thead>
                  <tr className="border-b border-lp-line bg-lp-paper-soft">
                    <th className="px-4 py-2 text-left font-mono text-[11px] tracking-wide text-lp-muted uppercase">Requisito</th>
                    <th className="px-4 py-2 text-left font-mono text-[11px] tracking-wide text-lp-muted uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {requisitosComStatus.map(({ requisito, status }) => (
                    <tr key={requisito.id} className="border-b border-lp-line last:border-0">
                      <td className="px-4 py-2.5 text-lp-ink/85">
                        {requisito.codigo} — {requisito.nome}
                      </td>
                      <td className="px-4 py-2.5">
                        <StatusBadge label={STATUS_MAP[status].label} tone={STATUS_MAP[status].tone} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="flex flex-col gap-4">
          <h3 className="font-mono text-xs tracking-wide text-lp-muted uppercase">
            Evidências vinculadas ({evidencias.length})
          </h3>
          {evidencias.length === 0 ? (
            <EmptyState title="Nenhuma evidência vinculada" description="Documentos vinculados a esta usina ou às safras dela aparecem aqui." />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-lp-line">
              <table className="w-full min-w-max border-collapse text-sm">
                <thead>
                  <tr className="border-b border-lp-line bg-lp-paper-soft">
                    <th className="px-4 py-2 text-left font-mono text-[11px] tracking-wide text-lp-muted uppercase">Documento</th>
                    <th className="px-4 py-2 text-left font-mono text-[11px] tracking-wide text-lp-muted uppercase">Status</th>
                    <th className="px-4 py-2 text-left font-mono text-[11px] tracking-wide text-lp-muted uppercase">Validade</th>
                    <th className="px-4 py-2 text-left font-mono text-[11px] tracking-wide text-lp-muted uppercase">Responsável</th>
                  </tr>
                </thead>
                <tbody>
                  {evidencias.map((e) => (
                    <tr key={e.id} className="border-b border-lp-line last:border-0">
                      <td className="px-4 py-2.5 text-lp-ink/85">
                        {e.documentoUrl ? (
                          <a href={e.documentoUrl} target="_blank" rel="noreferrer" className="text-lp-pink-deep hover:underline">
                            {e.documentoNome ?? "—"}
                          </a>
                        ) : (
                          (e.documentoNome ?? "—")
                        )}
                      </td>
                      <td className="px-4 py-2.5">
                        <StatusBadge
                          label={e.status === "aprovado" ? "Aprovado" : e.status === "rejeitado" ? "Rejeitado" : "Pendente"}
                          tone={e.status === "aprovado" ? "positive" : e.status === "rejeitado" ? "negative" : "warning"}
                        />
                      </td>
                      <td className="px-4 py-2.5 text-lp-ink/85">
                        {e.documentoValidoAte ? new Date(e.documentoValidoAte).toLocaleDateString("pt-BR") : "—"}
                      </td>
                      <td className="px-4 py-2.5 text-lp-ink/85">{e.responsavel ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="flex flex-col gap-4">
          <h3 className="font-mono text-xs tracking-wide text-lp-muted uppercase">
            Histórico de cálculos ({calculos.length})
          </h3>
          {calculos.length === 0 ? (
            <EmptyState title="Nenhum cálculo ainda" description="Cálculos de GHG, RenovaBio e Bonsucro para esta usina aparecem aqui." />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-lp-line">
              <table className="w-full min-w-max border-collapse text-sm">
                <thead>
                  <tr className="border-b border-lp-line bg-lp-paper-soft">
                    <th className="px-4 py-2 text-left font-mono text-[11px] tracking-wide text-lp-muted uppercase">Indicador</th>
                    <th className="px-4 py-2 text-left font-mono text-[11px] tracking-wide text-lp-muted uppercase">Metodologia</th>
                    <th className="px-4 py-2 text-left font-mono text-[11px] tracking-wide text-lp-muted uppercase">Resultado</th>
                    <th className="px-4 py-2 text-left font-mono text-[11px] tracking-wide text-lp-muted uppercase">Calculado em</th>
                  </tr>
                </thead>
                <tbody>
                  {calculos.map((c) => (
                    <tr key={c.id} className="border-b border-lp-line last:border-0">
                      <td className="px-4 py-2.5 text-lp-ink/85">{c.indicadorNome}</td>
                      <td className="px-4 py-2.5 text-lp-ink/85">
                        {c.metodologiaNome} · v{c.versao}
                      </td>
                      <td className="px-4 py-2.5 text-lp-ink/85">
                        {Number(c.resultado).toLocaleString("pt-BR", { maximumFractionDigits: 4 })} {c.unidadeResultado}
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap text-lp-ink/85">
                        {new Date(c.calculadoEm).toLocaleString("pt-BR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="flex flex-col gap-4">
          <h3 className="font-mono text-xs tracking-wide text-lp-muted uppercase">
            Registros de Integridade publicados ({relatoriosPublicados.length})
          </h3>
          {relatoriosPublicados.length === 0 ? (
            <p className="text-sm text-lp-muted">Nenhum relatório publicado para esta usina ainda.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {relatoriosPublicados.map((r) => (
                <li key={r.id} className="flex flex-col gap-0.5 text-sm">
                  <span className="text-lp-ink">{r.titulo}</span>
                  <a href={`${getSiteUrl()}/registro/${r.slugPublico}`} target="_blank" rel="noreferrer" className="text-lp-pink-deep hover:underline">
                    {getSiteUrl().replace(/^https?:\/\//, "")}/registro/{r.slugPublico}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>

        <p className="border-t border-lp-line pt-4 text-xs text-lp-muted">
          Dossiê gerado automaticamente a partir dos dados cadastrados na Ominia — {safras.length} safra(s)
          considerada(s) para esta usina.
        </p>
      </article>
    </div>
  );
}
