import { requireSession } from "@/lib/auth/require-session";
import { listFazendas, listUsinas } from "@/lib/queries/organizacao";
import { criarFazenda } from "../actions";
import { Field, Input, Select } from "@/components/ui/field";
import { Table, THead, Th, Tr, Td } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";

const TIPO_LABEL: Record<string, string> = {
  proprio: "Próprio",
  terceiro: "Terceiro",
  cooperativa: "Cooperativa",
};

export default async function FazendasPage() {
  const session = await requireSession();
  const [lista, usinas] = await Promise.all([
    listFazendas(session.empresaId),
    listUsinas(session.empresaId),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <form
        action={criarFazenda}
        className="grid grid-cols-2 gap-4 rounded-2xl border border-lp-line bg-white p-6 md:grid-cols-4"
      >
        <Field label="Produtor" htmlFor="produtor">
          <Input id="produtor" name="produtor" required placeholder="João da Silva" />
        </Field>
        <Field label="Propriedade" htmlFor="propriedade">
          <Input id="propriedade" name="propriedade" required placeholder="Fazenda Boa Vista" />
        </Field>
        <Field label="Município" htmlFor="municipio">
          <Input id="municipio" name="municipio" placeholder="Sertãozinho" />
        </Field>
        <Field label="Estado" htmlFor="estado">
          <Input id="estado" name="estado" maxLength={2} placeholder="SP" />
        </Field>
        <Field label="CAR" htmlFor="car">
          <Input id="car" name="car" placeholder="SP-3550308-XXXX..." />
        </Field>
        <Field label="Área (ha)" htmlFor="areaHectares">
          <Input id="areaHectares" name="areaHectares" type="number" step="any" placeholder="450" />
        </Field>
        <Field label="Tipo de fornecedor" htmlFor="tipoFornecedor">
          <Select id="tipoFornecedor" name="tipoFornecedor" defaultValue="terceiro">
            <option value="proprio">Próprio</option>
            <option value="terceiro">Terceiro</option>
            <option value="cooperativa">Cooperativa</option>
          </Select>
        </Field>
        <Field label="Usina vinculada" htmlFor="usinaId">
          <Select id="usinaId" name="usinaId" defaultValue="">
            <option value="">Sem vínculo</option>
            {usinas.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nome}
              </option>
            ))}
          </Select>
        </Field>
        <div className="col-span-2 flex items-end md:col-span-4">
          <button
            type="submit"
            className="rounded-full bg-lp-pink px-7 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Adicionar fazenda
          </button>
        </div>
      </form>

      {lista.length === 0 ? (
        <EmptyState
          title="Nenhuma fazenda cadastrada"
          description="Cadastre os fornecedores agrícolas para habilitar a cadeia de custódia do motor CBIO (CBIO-02)."
        />
      ) : (
        <Table>
          <THead>
            <Th>Produtor</Th>
            <Th>Propriedade</Th>
            <Th>Município/UF</Th>
            <Th>Área</Th>
            <Th>Tipo</Th>
            <Th>Usina</Th>
          </THead>
          <tbody>
            {lista.map((f) => (
              <Tr key={f.id}>
                <Td className="font-medium text-lp-ink">{f.produtor}</Td>
                <Td>{f.propriedade}</Td>
                <Td>{[f.municipio, f.estado].filter(Boolean).join(" / ") || "—"}</Td>
                <Td>{f.areaHectares ? `${Number(f.areaHectares).toLocaleString("pt-BR")} ha` : "—"}</Td>
                <Td>
                  <StatusBadge label={TIPO_LABEL[f.tipoFornecedor]} />
                </Td>
                <Td>{f.usinaNome ?? "—"}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
