import { requireSession } from "@/lib/auth/require-session";
import { listUsinas, listSafras } from "@/lib/queries/organizacao";
import { listCalculosBonsucro, listRequisitosComStatus, complianceScore } from "@/lib/queries/bonsucro";
import { ensureBonsucroVersao } from "@/lib/seed/metodologias";
import {
  calcularProdutividade,
  calcularSolo,
  calcularProdutividadeAgua,
  calcularBiodiversidade,
  calcularGhgBonsucro,
  calcularInsumos,
  calcularSeguranca,
  calcularEconomico,
  atualizarStatusRequisito,
} from "./actions";
import { Field, Input, Select } from "@/components/ui/field";
import { Table, THead, Th, Tr, Td } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { FormError } from "@/components/ui/form-error";
import { ActionButton } from "@/components/ui/action-button";
import { SubmitButton } from "@/components/ui/submit-button";

const CODIGO_LABEL: Record<string, string> = {
  BNS01_PRODUTIVIDADE: "BNS-01 · Produtividade agrícola",
  BNS02_SOLO: "BNS-02 · Correção de solo",
  BNS03_AGUA: "BNS-03 · Produtividade da água",
  BNS04_BIODIVERSIDADE: "BNS-04 · Área preservada",
  BNS05_GHG: "BNS-05 · GHG (Motor GHG)",
  BNS06_INSUMOS: "BNS-06 · Uso de insumos",
  BNS07_SEGURANCA: "BNS-07 · Taxa de acidentes",
  BNS08_MARGEM: "BNS-08 · Margem bruta",
};

const STATUS_OPTIONS = [
  { value: "conforme", label: "Conforme", tone: "positive" as const },
  { value: "atencao", label: "Atenção", tone: "warning" as const },
  { value: "nao_conforme", label: "Não conforme", tone: "negative" as const },
  { value: "sem_dados", label: "Sem dados", tone: "neutral" as const },
];

function SelectSafra({ id, safras }: { id: string; safras: { id: string; nome: string; usinaNome: string | null }[] }) {
  return (
    <Select id={id} name="safraId" required defaultValue="">
      <option value="" disabled>
        Selecione
      </option>
      {safras.map((s) => (
        <option key={s.id} value={s.id}>
          {s.usinaNome} — {s.nome}
        </option>
      ))}
    </Select>
  );
}

export default async function BonsucroPage({
  searchParams,
}: {
  searchParams: Promise<{ usinaId?: string; erro?: string }>;
}) {
  const session = await requireSession();
  const { usinaId: usinaSelecionada, erro } = await searchParams;

  const [usinasList, safrasList, historico] = await Promise.all([
    listUsinas(session.empresaId),
    listSafras(session.empresaId),
    listCalculosBonsucro(session.empresaId),
    ensureBonsucroVersao(),
  ]);

  const usinaAtiva = usinaSelecionada || usinasList[0]?.id;
  const requisitos = usinaAtiva ? await listRequisitosComStatus(session.empresaId, usinaAtiva) : [];
  const score = usinaAtiva ? await complianceScore(session.empresaId, usinaAtiva) : null;

  const cardClass = "flex flex-col gap-3 rounded-2xl border border-lp-line bg-white p-5";

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-medium tracking-tight text-lp-ink">Motor Bonsucro</h1>
        <p className="mt-1 text-lp-muted">
          Production Standard 5.2.1 / Calculator 5.2.4, vigente desde 01/01/2026. Não é apenas carbono: cobre
          produtividade, solo, água, biodiversidade, GHG, insumos, social e econômico.
        </p>
      </div>

      <FormError code={erro} />

      {safrasList.length === 0 ? (
        <EmptyState title="Nenhuma safra cadastrada" description="Cadastre uma safra em Organização → Safras e registros no Data Hub antes de calcular os indicadores Bonsucro." />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className={cardClass}>
            <h3 className="font-mono text-xs uppercase tracking-wide text-lp-muted">BNS-01 · Produtividade agrícola</h3>
            <p className="text-xs text-lp-muted">Produção ÷ área colhida (dados já cadastrados na safra).</p>
            <form action={calcularProdutividade} className="flex flex-col gap-3">
              <Field label="Safra" htmlFor="safraId-01"><SelectSafra id="safraId-01" safras={safrasList} /></Field>
              <SubmitButton size="sm" pendingLabel="Calculando...">Calcular</SubmitButton>
            </form>
          </div>

          <div className={cardClass}>
            <h3 className="font-mono text-xs uppercase tracking-wide text-lp-muted">BNS-02 · Solo</h3>
            <p className="text-xs text-lp-muted">Calcário + gesso aplicados (Data Hub) ÷ área colhida.</p>
            <form action={calcularSolo} className="flex flex-col gap-3">
              <Field label="Safra" htmlFor="safraId-02"><SelectSafra id="safraId-02" safras={safrasList} /></Field>
              <SubmitButton size="sm" pendingLabel="Calculando...">Calcular</SubmitButton>
            </form>
          </div>

          <div className={cardClass}>
            <h3 className="font-mono text-xs uppercase tracking-wide text-lp-muted">BNS-03 · Água</h3>
            <p className="text-xs text-lp-muted">Produção ÷ água consumida no período.</p>
            <form action={calcularProdutividadeAgua} className="flex flex-col gap-3">
              <Field label="Safra" htmlFor="safraId-03"><SelectSafra id="safraId-03" safras={safrasList} /></Field>
              <Field label="Água consumida (m³)" htmlFor="aguaConsumidaM3">
                <Input id="aguaConsumidaM3" name="aguaConsumidaM3" type="number" step="any" min="0" required placeholder="180000" />
              </Field>
              <SubmitButton size="sm" pendingLabel="Calculando...">Calcular</SubmitButton>
            </form>
          </div>

          <div className={cardClass}>
            <h3 className="font-mono text-xs uppercase tracking-wide text-lp-muted">BNS-04 · Biodiversidade</h3>
            <p className="text-xs text-lp-muted">Média de área preservada ÷ área total das fazendas da usina.</p>
            <form action={calcularBiodiversidade} className="flex flex-col gap-3">
              <Field label="Usina" htmlFor="usinaId-04">
                <Select id="usinaId-04" name="usinaId" required defaultValue="">
                  <option value="" disabled>Selecione</option>
                  {usinasList.map((u) => (
                    <option key={u.id} value={u.id}>{u.nome}</option>
                  ))}
                </Select>
              </Field>
              <SubmitButton size="sm" pendingLabel="Calculando...">Calcular</SubmitButton>
            </form>
            <p className="text-xs text-lp-muted">Preencha &ldquo;Área preservada&rdquo; em Organização → Fazendas.</p>
          </div>

          <div className={cardClass}>
            <h3 className="font-mono text-xs uppercase tracking-wide text-lp-muted">BNS-05 · GHG</h3>
            <p className="text-xs text-lp-muted">
              Reutiliza o{" "}
              <a href="/ghg" className="text-lp-pink hover:underline">Motor GHG</a> — soma os cálculos de emissão já
              feitos para a safra. Não há um segundo calculador.
            </p>
            <form action={calcularGhgBonsucro} className="flex flex-col gap-3">
              <Field label="Safra" htmlFor="safraId-05"><SelectSafra id="safraId-05" safras={safrasList} /></Field>
              <SubmitButton size="sm" pendingLabel="Consolidando...">Consolidar</SubmitButton>
            </form>
          </div>

          <div className={cardClass}>
            <h3 className="font-mono text-xs uppercase tracking-wide text-lp-muted">BNS-06 · Insumos</h3>
            <p className="text-xs text-lp-muted">Fertilizantes + defensivos (Data Hub) ÷ área colhida.</p>
            <form action={calcularInsumos} className="flex flex-col gap-3">
              <Field label="Safra" htmlFor="safraId-06"><SelectSafra id="safraId-06" safras={safrasList} /></Field>
              <SubmitButton size="sm" pendingLabel="Calculando...">Calcular</SubmitButton>
            </form>
          </div>

          <div className={cardClass}>
            <h3 className="font-mono text-xs uppercase tracking-wide text-lp-muted">BNS-07 · Social</h3>
            <p className="text-xs text-lp-muted">Taxa de acidentes por 1.000 funcionários (Data Hub, categoria Social).</p>
            <form action={calcularSeguranca} className="flex flex-col gap-3">
              <Field label="Safra" htmlFor="safraId-07"><SelectSafra id="safraId-07" safras={safrasList} /></Field>
              <SubmitButton size="sm" pendingLabel="Calculando...">Calcular</SubmitButton>
            </form>
          </div>

          <div className={cardClass}>
            <h3 className="font-mono text-xs uppercase tracking-wide text-lp-muted">BNS-08 · Econômico</h3>
            <p className="text-xs text-lp-muted">Margem bruta por tonelada (Data Hub, categoria Econômico).</p>
            <form action={calcularEconomico} className="flex flex-col gap-3">
              <Field label="Safra" htmlFor="safraId-08"><SelectSafra id="safraId-08" safras={safrasList} /></Field>
              <SubmitButton size="sm" pendingLabel="Calculando...">Calcular</SubmitButton>
            </form>
          </div>
        </div>
      )}

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
                          <ActionButton type="submit" variant="primary" pendingLabel="Salvando...">
                            Salvar
                          </ActionButton>
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
