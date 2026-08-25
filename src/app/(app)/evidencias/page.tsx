import { requireSession } from "@/lib/auth/require-session";
import { listDocumentos, listEvidencias } from "@/lib/queries/evidencias";
import { listUsinas, listFazendas, listSafras } from "@/lib/queries/organizacao";
import { criarDocumento, criarEvidencia, atualizarStatusEvidencia } from "./actions";
import { Field, Input, Select } from "@/components/ui/field";
import { Table, THead, Th, Tr, Td } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";

const STATUS_TONE = {
  pendente: "warning",
  aprovado: "positive",
  rejeitado: "negative",
} as const;

const STATUS_LABEL: Record<string, string> = {
  pendente: "Pendente",
  aprovado: "Aprovado",
  rejeitado: "Rejeitado",
};

const ENTIDADE_LABEL: Record<string, string> = {
  usina: "Usina",
  fazenda: "Fazenda",
  safra: "Safra",
};

export default async function EvidenciasPage() {
  const session = await requireSession();
  const [documentosList, evidenciasList, usinasList, fazendasList, safrasList] = await Promise.all([
    listDocumentos(session.empresaId),
    listEvidencias(session.empresaId),
    listUsinas(session.empresaId),
    listFazendas(session.empresaId),
    listSafras(session.empresaId),
  ]);

  const alvos = [
    ...usinasList.map((u) => ({ value: `usina:${u.id}`, label: `Usina — ${u.nome}` })),
    ...fazendasList.map((f) => ({ value: `fazenda:${f.id}`, label: `Fazenda — ${f.propriedade}` })),
    ...safrasList.map((s) => ({ value: `safra:${s.id}`, label: `Safra — ${s.nome}` })),
  ];

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-medium tracking-tight text-lp-ink">Evidence Hub</h1>
        <p className="mt-1 text-lp-muted">
          Todo número precisa responder &ldquo;qual documento comprova isso?&rdquo;. A ANP exige arquivamento de
          documentação comprobatória por no mínimo cinco anos.
        </p>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="font-mono text-xs uppercase tracking-wide text-lp-muted">Documentos</h2>
        <form
          action={criarDocumento}
          className="grid grid-cols-2 gap-4 rounded-2xl border border-lp-line bg-white p-6 md:grid-cols-4"
        >
          <Field label="Nome do documento" htmlFor="nome">
            <Input id="nome" name="nome" required placeholder="Laudo de análise de solo — Fazenda Boa Vista" />
          </Field>
          <Field label="Tipo" htmlFor="tipo">
            <Input id="tipo" name="tipo" required placeholder="laudo, nota fiscal, certificado, contrato..." />
          </Field>
          <Field label="Referência/link (opcional)" htmlFor="referenciaExterna">
            <Input id="referenciaExterna" name="referenciaExterna" placeholder="URL ou caminho do arquivo" />
          </Field>
          <Field label="Válido até (opcional)" htmlFor="validoAte">
            <Input id="validoAte" name="validoAte" type="date" />
          </Field>
          <div className="col-span-2 flex items-end md:col-span-4">
            <button
              type="submit"
              className="rounded-full bg-lp-pink px-7 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Adicionar documento
            </button>
          </div>
        </form>

        {documentosList.length === 0 ? (
          <EmptyState title="Nenhum documento" description="Upload binário real é um próximo passo — por ora, registre a referência do documento." />
        ) : (
          <Table>
            <THead>
              <Th>Nome</Th>
              <Th>Tipo</Th>
              <Th>Válido até</Th>
              <Th>Referência</Th>
            </THead>
            <tbody>
              {documentosList.map((d) => (
                <Tr key={d.id}>
                  <Td className="font-medium text-lp-ink">{d.nome}</Td>
                  <Td>{d.tipo}</Td>
                  <Td>{d.validoAte ?? "—"}</Td>
                  <Td className="max-w-xs truncate">{d.referenciaExterna ?? "—"}</Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-mono text-xs uppercase tracking-wide text-lp-muted">Evidências vinculadas</h2>

        {documentosList.length === 0 || alvos.length === 0 ? (
          <EmptyState
            title="Cadastre um documento e uma usina/fazenda/safra primeiro"
            description="Uma evidência vincula um documento a um indicador, safra, fazenda ou usina."
          />
        ) : (
          <form
            action={criarEvidencia}
            className="grid grid-cols-2 gap-4 rounded-2xl border border-lp-line bg-white p-6 md:grid-cols-4"
          >
            <Field label="Documento" htmlFor="documentoId">
              <Select id="documentoId" name="documentoId" required defaultValue="">
                <option value="" disabled>
                  Selecione
                </option>
                {documentosList.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nome}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Vincular a" htmlFor="alvo">
              <Select id="alvo" name="alvo" required defaultValue="">
                <option value="" disabled>
                  Selecione
                </option>
                {alvos.map((a) => (
                  <option key={a.value} value={a.value}>
                    {a.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Responsável (opcional)" htmlFor="responsavel">
              <Input id="responsavel" name="responsavel" placeholder="Nome do responsável" />
            </Field>
            <div className="col-span-2 flex items-end md:col-span-4">
              <button
                type="submit"
                className="rounded-full bg-lp-pink px-7 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                Vincular evidência
              </button>
            </div>
          </form>
        )}

        {evidenciasList.length === 0 ? (
          <EmptyState title="Nenhuma evidência vinculada" description="Vincule documentos às usinas, fazendas e safras para sustentar os cálculos e a auditoria." />
        ) : (
          <Table>
            <THead>
              <Th>Documento</Th>
              <Th>Vinculado a</Th>
              <Th>Responsável</Th>
              <Th>Versão</Th>
              <Th>Status</Th>
              <Th />
            </THead>
            <tbody>
              {evidenciasList.map((e) => (
                <Tr key={e.id}>
                  <Td className="font-medium text-lp-ink">{e.documentoNome}</Td>
                  <Td>{ENTIDADE_LABEL[e.entidadeTipo] ?? e.entidadeTipo}</Td>
                  <Td>{e.responsavel ?? "—"}</Td>
                  <Td>v{e.versao}</Td>
                  <Td>
                    <StatusBadge label={STATUS_LABEL[e.status]} tone={STATUS_TONE[e.status as keyof typeof STATUS_TONE]} />
                  </Td>
                  <Td>
                    {e.status === "pendente" && (
                      <div className="flex gap-3">
                        <form action={atualizarStatusEvidencia}>
                          <input type="hidden" name="id" value={e.id} />
                          <input type="hidden" name="status" value="aprovado" />
                          <button type="submit" className="font-mono text-xs text-lp-pink hover:underline">
                            Aprovar
                          </button>
                        </form>
                        <form action={atualizarStatusEvidencia}>
                          <input type="hidden" name="id" value={e.id} />
                          <input type="hidden" name="status" value="rejeitado" />
                          <button type="submit" className="font-mono text-xs text-rose-600 hover:underline">
                            Rejeitar
                          </button>
                        </form>
                      </div>
                    )}
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
