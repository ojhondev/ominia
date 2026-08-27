import { requireSession } from "@/lib/auth/require-session";
import { listUsinas } from "@/lib/queries/organizacao";
import { complianceScore } from "@/lib/queries/bonsucro";
import { listEvidencias } from "@/lib/queries/evidencias";
import { listLogsAuditoria } from "@/lib/queries/auditoria";
import { Table, THead, Th, Tr, Td } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { ActionLink } from "@/components/ui/action-button";

const ACAO_LABEL: Record<string, string> = {
  criou: "criou",
  atualizou: "atualizou",
  atualizou_status: "atualizou status",
  calculou: "calculou",
  validou: "validou",
  aprovou: "aprovou",
  rejeitou: "rejeitou",
  excluiu: "excluiu",
  encerrou: "encerrou",
  reabriu: "reabriu",
  convidou: "convidou",
  removeu: "removeu",
};

const ENTIDADE_LABEL: Record<string, string> = {
  usinas: "Usina",
  fazendas: "Fazenda",
  safras: "Safra",
  registros_atividade: "Registro de atividade",
  documentos: "Documento",
  evidencias: "Evidência",
  fatores_emissao: "Fator de emissão",
  calculos: "Cálculo",
  resultados_compliance: "Compliance",
  empresas: "Empresa",
  usuarios: "Usuário",
};

export default async function AuditoriaPage() {
  const session = await requireSession();
  const [usinasList, evidenciasList, logs] = await Promise.all([
    listUsinas(session.empresaId),
    listEvidencias(session.empresaId),
    listLogsAuditoria(session.empresaId),
  ]);

  const scores = await Promise.all(
    usinasList.map(async (u) => ({ usina: u, score: await complianceScore(session.empresaId, u.id) }))
  );

  const evidenciasPendentes = evidenciasList.filter((e) => e.status === "pendente");

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-medium tracking-tight text-lp-ink">Auditoria</h1>
        <p className="mt-1 text-lp-muted">
          Trilha transversal aos motores CBIO e Bonsucro. A ANP exige manutenção de documentação e registros por
          no mínimo cinco anos.
        </p>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="font-mono text-xs uppercase tracking-wide text-lp-muted">Compliance por usina (Bonsucro)</h2>
        {scores.length === 0 ? (
          <EmptyState title="Nenhuma usina cadastrada" description="Vá em Organização → Usinas." />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {scores.map(({ usina, score }) => (
              <div key={usina.id} className="rounded-2xl border border-lp-line bg-white p-5">
                <p className="font-medium text-lp-ink">{usina.nome}</p>
                <p className="mt-2 text-3xl font-medium tracking-tight text-lp-ink">
                  {score ? `${score.percentual}%` : "—"}
                </p>
                <p className="mt-1 text-xs text-lp-muted">
                  {score ? `${score.conformes} de ${score.total} requisitos conformes` : "sem avaliação ainda"}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <ActionLink href={`/bonsucro?usinaId=${usina.id}`} variant="primary">
                    Ver requisitos →
                  </ActionLink>
                  <ActionLink href={`/auditoria/${usina.id}/dossie`}>Gerar dossiê →</ActionLink>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-mono text-xs uppercase tracking-wide text-lp-muted">
          Evidências pendentes ({evidenciasPendentes.length})
        </h2>
        {evidenciasPendentes.length === 0 ? (
          <EmptyState title="Nenhuma pendência" description="Todas as evidências vinculadas já foram aprovadas ou rejeitadas." />
        ) : (
          <Table>
            <THead>
              <Th>Documento</Th>
              <Th>Vinculado a</Th>
              <Th>Responsável</Th>
              <Th />
            </THead>
            <tbody>
              {evidenciasPendentes.map((e) => (
                <Tr key={e.id}>
                  <Td className="font-medium text-lp-ink">{e.documentoNome}</Td>
                  <Td>{e.entidadeTipo}</Td>
                  <Td>{e.responsavel ?? "—"}</Td>
                  <Td>
                    <ActionLink href="/evidencias">Revisar →</ActionLink>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-mono text-xs uppercase tracking-wide text-lp-muted">Trilha de auditoria</h2>
        {logs.length === 0 ? (
          <EmptyState title="Nenhum evento ainda" description="Toda criação, cálculo, aprovação e mudança de status fica registrada aqui." />
        ) : (
          <Table>
            <THead>
              <Th>Quando</Th>
              <Th>Quem</Th>
              <Th>Ação</Th>
              <Th>Entidade</Th>
              <Th>Detalhes</Th>
            </THead>
            <tbody>
              {logs.map((log) => (
                <Tr key={log.id}>
                  <Td className="whitespace-nowrap">{new Date(log.criadoEm).toLocaleString("pt-BR")}</Td>
                  <Td>{log.usuarioNome ?? "—"}</Td>
                  <Td>
                    <StatusBadge label={ACAO_LABEL[log.acao] ?? log.acao} />
                  </Td>
                  <Td>{ENTIDADE_LABEL[log.entidade] ?? log.entidade}</Td>
                  <Td className="max-w-sm truncate font-mono text-xs text-lp-muted">
                    {log.detalhes ? JSON.stringify(log.detalhes) : "—"}
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
      </section>
    </div>
  );
}
