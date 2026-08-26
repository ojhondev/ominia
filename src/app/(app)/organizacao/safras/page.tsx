import { requireSession } from "@/lib/auth/require-session";
import { listSafras, listUsinas } from "@/lib/queries/organizacao";
import { criarSafra, editarSafra, encerrarSafra, excluirSafra } from "../actions";
import { Field, Input, Select } from "@/components/ui/field";
import { Table, THead, Th, Tr, Td } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { FormError } from "@/components/ui/form-error";

export default async function SafrasPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string; editar?: string }>;
}) {
  const session = await requireSession();
  const { erro, editar } = await searchParams;
  const [lista, usinas] = await Promise.all([
    listSafras(session.empresaId),
    listUsinas(session.empresaId),
  ]);
  const emEdicao = editar ? lista.find((s) => s.id === editar) : undefined;

  return (
    <div className="flex flex-col gap-6">
      <FormError code={erro} />

      {usinas.length === 0 ? (
        <EmptyState
          title="Cadastre uma usina primeiro"
          description="Toda safra precisa estar vinculada a uma usina. Volte para a aba Usinas e cadastre a primeira."
        />
      ) : (
        <form
          action={emEdicao ? editarSafra : criarSafra}
          className="grid grid-cols-2 gap-4 rounded-2xl border border-lp-line bg-white p-6 md:grid-cols-4"
        >
          {emEdicao && <input type="hidden" name="id" value={emEdicao.id} />}
          <Field label="Usina" htmlFor="usinaId">
            <Select id="usinaId" name="usinaId" required defaultValue={emEdicao?.usinaId ?? ""}>
              <option value="" disabled>
                Selecione
              </option>
              {usinas.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nome}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Safra" htmlFor="nome">
            <Input id="nome" name="nome" required placeholder="2025/2026" defaultValue={emEdicao?.nome} />
          </Field>
          <Field label="Início" htmlFor="dataInicio">
            <Input id="dataInicio" name="dataInicio" type="date" defaultValue={emEdicao?.dataInicio ?? ""} />
          </Field>
          <Field label="Fim" htmlFor="dataFim">
            <Input id="dataFim" name="dataFim" type="date" defaultValue={emEdicao?.dataFim ?? ""} />
          </Field>
          <Field label="Área colhida (ha)" htmlFor="areaColhidaHectares">
            <Input
              id="areaColhidaHectares"
              name="areaColhidaHectares"
              type="number"
              step="any"
              min="0"
              placeholder="52000"
              defaultValue={emEdicao?.areaColhidaHectares ?? ""}
            />
          </Field>
          <Field label="Produção (t cana)" htmlFor="producaoToneladas">
            <Input
              id="producaoToneladas"
              name="producaoToneladas"
              type="number"
              step="any"
              min="0"
              placeholder="3400000"
              defaultValue={emEdicao?.producaoToneladas ?? ""}
            />
          </Field>
          <div className="col-span-2 flex items-end gap-3 md:col-span-4">
            <button
              type="submit"
              className="rounded-full bg-lp-pink px-7 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              {emEdicao ? "Salvar alterações" : "Adicionar safra"}
            </button>
            {emEdicao && (
              <a href="/organizacao/safras" className="text-sm text-lp-muted hover:text-lp-ink">
                Cancelar
              </a>
            )}
          </div>
        </form>
      )}

      {lista.length === 0 ? (
        <EmptyState
          title="Nenhuma safra cadastrada"
          description="Safras organizam registros de atividade, cálculos e evidências por ciclo produtivo."
        />
      ) : (
        <Table>
          <THead>
            <Th>Safra</Th>
            <Th>Usina</Th>
            <Th>Período</Th>
            <Th>Área colhida</Th>
            <Th>Produção</Th>
            <Th>Status</Th>
            <Th />
          </THead>
          <tbody>
            {lista.map((s) => (
              <Tr key={s.id}>
                <Td className="font-medium text-lp-ink">{s.nome}</Td>
                <Td>{s.usinaNome ?? "—"}</Td>
                <Td>
                  {s.dataInicio ?? "—"} → {s.dataFim ?? "—"}
                </Td>
                <Td>{s.areaColhidaHectares ? `${Number(s.areaColhidaHectares).toLocaleString("pt-BR")} ha` : "—"}</Td>
                <Td>{s.producaoToneladas ? `${Number(s.producaoToneladas).toLocaleString("pt-BR")} t` : "—"}</Td>
                <Td>
                  <StatusBadge
                    label={s.encerrada ? "Encerrada" : "Aberta"}
                    tone={s.encerrada ? "neutral" : "positive"}
                  />
                </Td>
                <Td>
                  <div className="flex flex-wrap gap-3">
                    <a href={`/organizacao/safras?editar=${s.id}`} className="font-mono text-xs text-lp-pink hover:underline">
                      Editar
                    </a>
                    <form action={encerrarSafra}>
                      <input type="hidden" name="id" value={s.id} />
                      <button type="submit" className="font-mono text-xs text-lp-muted hover:underline">
                        {s.encerrada ? "Reabrir" : "Encerrar"}
                      </button>
                    </form>
                    <form action={excluirSafra}>
                      <input type="hidden" name="id" value={s.id} />
                      <button type="submit" className="font-mono text-xs text-rose-600 hover:underline">
                        Excluir
                      </button>
                    </form>
                  </div>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
