import { requireSession } from "@/lib/auth/require-session";
import { listSafras, listUsinas } from "@/lib/queries/organizacao";
import { criarSafra } from "../actions";
import { Field, Input, Select } from "@/components/ui/field";
import { Table, THead, Th, Tr, Td } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";

export default async function SafrasPage() {
  const session = await requireSession();
  const [lista, usinas] = await Promise.all([
    listSafras(session.empresaId),
    listUsinas(session.empresaId),
  ]);

  return (
    <div className="flex flex-col gap-6">
      {usinas.length === 0 ? (
        <EmptyState
          title="Cadastre uma usina primeiro"
          description="Toda safra precisa estar vinculada a uma usina. Volte para a aba Usinas e cadastre a primeira."
        />
      ) : (
        <form
          action={criarSafra}
          className="grid grid-cols-2 gap-4 rounded-2xl border border-lp-line bg-white p-6 md:grid-cols-4"
        >
          <Field label="Usina" htmlFor="usinaId">
            <Select id="usinaId" name="usinaId" required defaultValue="">
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
            <Input id="nome" name="nome" required placeholder="2025/2026" />
          </Field>
          <Field label="Início" htmlFor="dataInicio">
            <Input id="dataInicio" name="dataInicio" type="date" />
          </Field>
          <Field label="Fim" htmlFor="dataFim">
            <Input id="dataFim" name="dataFim" type="date" />
          </Field>
          <Field label="Área colhida (ha)" htmlFor="areaColhidaHectares">
            <Input id="areaColhidaHectares" name="areaColhidaHectares" type="number" step="any" placeholder="52000" />
          </Field>
          <Field label="Produção (t cana)" htmlFor="producaoToneladas">
            <Input id="producaoToneladas" name="producaoToneladas" type="number" step="any" placeholder="3400000" />
          </Field>
          <div className="col-span-2 flex items-end md:col-span-4">
            <button
              type="submit"
              className="rounded-full bg-lp-pink px-7 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Adicionar safra
            </button>
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
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
