import { requireSession } from "@/lib/auth/require-session";
import { listUsinas, listSafras } from "@/lib/queries/organizacao";
import { listCalculosBonsucro, listRequisitosComStatus, complianceScore } from "@/lib/queries/bonsucro";
import { ensureBonsucroVersao } from "@/lib/seed/metodologias";
import { calcularProdutividade, calcularProdutividadeAgua, atualizarStatusRequisito } from "./actions";
import { Field, Input, Select } from "@/components/ui/field";
import { Table, THead, Th, Tr, Td } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";

const CODIGO_LABEL: Record<string, string> = {
  BNS01_PRODUTIVIDADE: "BNS-01 · Produtividade agrícola",
  BNS03_AGUA: "BNS-03 · Produtividade da água",
};

const STATUS_OPTIONS = [
  { value: "conforme", label: "Conforme", tone: "positive" as const },
  { value: "atencao", label: "Atenção", tone: "warning" as const },
  { value: "nao_conforme", label: "Não conforme", tone: "negative" as const },
  { value: "sem_dados", label: "Sem dados", tone: "neutral" as const },
];

export default async function BonsucroPage({
  searchParams,
}: {
  searchParams: Promise<{ usinaId?: string }>;
}) {
  const session = await requireSession();
  const { usinaId: usinaSelecionada } = await searchParams;

  const [usinasList, safrasList, historico] = await Promise.all([
    listUsinas(session.empresaId),
    listSafras(session.empresaId),
    listCalculosBonsucro(session.empresaId),
    ensureBonsucroVersao(),
  ]);

  const usinaAtiva = usinaSelecionada || usinasList[0]?.id;
  const requisitos = usinaAtiva ? await listRequisitosComStatus(session.empresaId, usinaAtiva) : [];
  const score = usinaAtiva ? await complianceScore(session.empresaId, usinaAtiva) : null;

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-medium tracking-tight text-lp-ink">Motor Bonsucro</h1>
        <p className="mt-1 text-lp-muted">
          Production Standard 5.2.1 / Calculator 5.2.4, vigente desde 01/01/2026. Não é apenas carbono: cobre
          produtividade, solo, água, biodiversidade, GHG, insumos, social e econômico.
        </p>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="font-mono text-xs uppercase tracking-wide text-lp-muted">BNS-01 · Produtividade agrícola</h2>
        {safrasList.length === 0 ? (
          <EmptyState title="Nenhuma safra cadastrada" description="Cadastre uma safra com produção e área colhida em Organização → Safras." />
        ) : (
          <form action={calcularProdutividade} className="flex flex-wrap items-end gap-4 rounded-2xl border border-lp-line bg-white p-6">
            <div className="min-w-64">
              <Field label="Safra" htmlFor="safraId-prod">
                <Select id="safraId-prod" name="safraId" required defaultValue="">
                  <option value="" disabled>
                    Selecione (produção e área colhida já cadastradas)
                  </option>
                  {safrasList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.usinaNome} — {s.nome}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
            <button type="submit" className="rounded-full bg-lp-pink px-7 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90">
              Calcular produtividade
            </button>
          </form>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-mono text-xs uppercase tracking-wide text-lp-muted">BNS-03 · Produtividade da água</h2>
        {safrasList.length === 0 ? (
          <EmptyState title="Nenhuma safra cadastrada" description="Cadastre uma safra em Organização → Safras." />
        ) : (
          <form action={calcularProdutividadeAgua} className="flex flex-wrap items-end gap-4 rounded-2xl border border-lp-line bg-white p-6">
            <div className="min-w-64">
              <Field label="Safra" htmlFor="safraId-agua">
                <Select id="safraId-agua" name="safraId" required defaultValue="">
                  <option value="" disabled>
                    Selecione
                  </option>
                  {safrasList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.usinaNome} — {s.nome}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
            <div className="w-48">
              <Field label="Água consumida (m³)" htmlFor="aguaConsumidaM3">
                <Input id="aguaConsumidaM3" name="aguaConsumidaM3" type="number" step="any" required placeholder="180000" />
              </Field>
            </div>
            <button type="submit" className="rounded-full bg-lp-pink px-7 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90">
              Calcular
            </button>
          </form>
        )}
      </section>

      {historico.length > 0 && (
        <Table>
          <THead>
            <Th>Indicador</Th>
            <Th>Resultado</Th>
            <Th>Usina</Th>
            <Th>Safra</Th>
            <Th>Calculado em</Th>
          </THead>
          <tbody>
            {historico.map((c) => (
              <Tr key={c.id}>
                <Td className="font-medium text-lp-ink">{CODIGO_LABEL[c.codigo] ?? c.codigo}</Td>
                <Td>
                  {Number(c.resultado).toLocaleString("pt-BR", { maximumFractionDigits: 4 })} {c.unidadeResultado}
                </Td>
                <Td>{c.usinaNome ?? "—"}</Td>
                <Td>{c.safraNome ?? "—"}</Td>
                <Td>{new Date(c.calculadoEm).toLocaleString("pt-BR")}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}

      <div className="rounded-2xl border border-lp-line bg-white p-4 text-sm text-lp-muted">
        <span className="font-mono text-xs uppercase tracking-wide text-lp-muted">BNS-05 · GHG</span> — reutiliza o{" "}
        <a href="/ghg" className="text-lp-pink hover:underline">
          Motor GHG
        </a>{" "}
        (Módulo 04). Não há um segundo calculador de emissões.
      </div>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-xs uppercase tracking-wide text-lp-muted">BNS-09 · Compliance por usina</h2>
          {score && (
            <StatusBadge label={`Score: ${score.percentual}% (${score.conformes}/${score.total})`} tone={score.percentual >= 70 ? "positive" : "warning"} />
          )}
        </div>

        {usinasList.length === 0 ? (
          <EmptyState title="Cadastre uma usina primeiro" description="Vá em Organização → Usinas." />
        ) : (
          <>
            <form method="get" className="flex items-end gap-4">
              <div className="min-w-64">
                <Field label="Usina" htmlFor="usinaId">
                  <Select id="usinaId" name="usinaId" defaultValue={usinaAtiva}>
                    {usinasList.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.nome}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>
              <button type="submit" className="rounded-full border border-lp-line px-6 py-2.5 text-sm text-lp-ink transition-colors hover:bg-lp-paper-soft">
                Ver
              </button>
            </form>

            <Table>
              <THead>
                <Th>Sub</Th>
                <Th>Requisito</Th>
                <Th>Status</Th>
                <Th>Atualizar</Th>
              </THead>
              <tbody>
                {requisitos.map(({ requisito, status }) => {
                  const opt = STATUS_OPTIONS.find((o) => o.value === status)!;
                  return (
                    <Tr key={requisito.id}>
                      <Td className="font-mono text-xs text-lp-muted">{requisito.codigo}</Td>
                      <Td className="font-medium text-lp-ink">
                        {requisito.nome}
                        <p className="mt-0.5 text-xs font-normal text-lp-muted">{requisito.descricao}</p>
                      </Td>
                      <Td>
                        <StatusBadge label={opt.label} tone={opt.tone} />
                      </Td>
                      <Td>
                        <form action={atualizarStatusRequisito} className="flex items-center gap-2">
                          <input type="hidden" name="requisitoId" value={requisito.id} />
                          <input type="hidden" name="usinaId" value={usinaAtiva} />
                          <Select name="status" defaultValue={status} className="!w-auto py-1 text-xs">
                            {STATUS_OPTIONS.map((o) => (
                              <option key={o.value} value={o.value}>
                                {o.label}
                              </option>
                            ))}
                          </Select>
                          <button type="submit" className="font-mono text-xs text-lp-pink hover:underline">
                            Salvar
                          </button>
                        </form>
                      </Td>
                    </Tr>
                  );
                })}
              </tbody>
            </Table>
          </>
        )}
      </section>
    </div>
  );
}
