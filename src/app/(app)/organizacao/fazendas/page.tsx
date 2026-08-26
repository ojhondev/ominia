import { requireSession } from "@/lib/auth/require-session";
import { listFazendas, listUsinas } from "@/lib/queries/organizacao";
import { criarFazenda, editarFazenda, excluirFazenda } from "../actions";
import { Field, Input, Select } from "@/components/ui/field";
import { Table, THead, Th, Tr, Td } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { FormError } from "@/components/ui/form-error";

const TIPO_LABEL: Record<string, string> = {
  proprio: "Próprio",
  terceiro: "Terceiro",
  cooperativa: "Cooperativa",
};

export default async function FazendasPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string; editar?: string }>;
}) {
  const session = await requireSession();
  const { erro, editar } = await searchParams;
  const [lista, usinas] = await Promise.all([
    listFazendas(session.empresaId),
    listUsinas(session.empresaId),
  ]);
  const emEdicao = editar ? lista.find((f) => f.id === editar) : undefined;

  return (
    <div className="flex flex-col gap-6">
      <FormError code={erro} />

      <form
        action={emEdicao ? editarFazenda : criarFazenda}
        className="grid grid-cols-2 gap-4 rounded-2xl border border-lp-line bg-white p-6 md:grid-cols-4"
      >
        {emEdicao && <input type="hidden" name="id" value={emEdicao.id} />}
        <Field label="Produtor" htmlFor="produtor">
          <Input id="produtor" name="produtor" required placeholder="João da Silva" defaultValue={emEdicao?.produtor} />
        </Field>
        <Field label="Propriedade" htmlFor="propriedade">
          <Input id="propriedade" name="propriedade" required placeholder="Fazenda Boa Vista" defaultValue={emEdicao?.propriedade} />
        </Field>
        <Field label="Município" htmlFor="municipio">
          <Input id="municipio" name="municipio" placeholder="Sertãozinho" defaultValue={emEdicao?.municipio ?? ""} />
        </Field>
        <Field label="Estado" htmlFor="estado">
          <Input id="estado" name="estado" maxLength={2} placeholder="SP" defaultValue={emEdicao?.estado ?? ""} />
        </Field>
        <Field label="CAR" htmlFor="car">
          <Input id="car" name="car" placeholder="SP-3550308-XXXX..." defaultValue={emEdicao?.car ?? ""} />
        </Field>
        <Field label="Área total (ha)" htmlFor="areaHectares">
          <Input id="areaHectares" name="areaHectares" type="number" step="any" min="0" placeholder="450" defaultValue={emEdicao?.areaHectares ?? ""} />
        </Field>
        <Field label="Área preservada (ha)" htmlFor="areaPreservadaHectares">
          <Input
            id="areaPreservadaHectares"
            name="areaPreservadaHectares"
            type="number"
            step="any"
            min="0"
            placeholder="90"
            defaultValue={emEdicao?.areaPreservadaHectares ?? ""}
          />
        </Field>
        <Field label="Tipo de fornecedor" htmlFor="tipoFornecedor">
          <Select id="tipoFornecedor" name="tipoFornecedor" defaultValue={emEdicao?.tipoFornecedor ?? "terceiro"}>
            <option value="proprio">Próprio</option>
            <option value="terceiro">Terceiro</option>
            <option value="cooperativa">Cooperativa</option>
          </Select>
        </Field>
        <Field label="Usina vinculada" htmlFor="usinaId">
          <Select id="usinaId" name="usinaId" defaultValue={emEdicao?.usinaId ?? ""}>
            <option value="">Sem vínculo</option>
            {usinas.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nome}
              </option>
            ))}
          </Select>
        </Field>
        <div className="col-span-2 flex items-end gap-3 md:col-span-4">
          <button
            type="submit"
            className="rounded-full bg-lp-pink px-7 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            {emEdicao ? "Salvar alterações" : "Adicionar fazenda"}
          </button>
          {emEdicao && (
            <a href="/organizacao/fazendas" className="text-sm text-lp-muted hover:text-lp-ink">
              Cancelar
            </a>
          )}
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
            <Th>Preservada</Th>
            <Th>Tipo</Th>
            <Th>Usina</Th>
            <Th />
          </THead>
          <tbody>
            {lista.map((f) => (
              <Tr key={f.id}>
                <Td className="font-medium text-lp-ink">{f.produtor}</Td>
                <Td>{f.propriedade}</Td>
                <Td>{[f.municipio, f.estado].filter(Boolean).join(" / ") || "—"}</Td>
                <Td>{f.areaHectares ? `${Number(f.areaHectares).toLocaleString("pt-BR")} ha` : "—"}</Td>
                <Td>{f.areaPreservadaHectares ? `${Number(f.areaPreservadaHectares).toLocaleString("pt-BR")} ha` : "—"}</Td>
                <Td>
                  <StatusBadge label={TIPO_LABEL[f.tipoFornecedor]} />
                </Td>
                <Td>{f.usinaNome ?? "—"}</Td>
                <Td>
                  <div className="flex gap-3">
                    <a href={`/organizacao/fazendas?editar=${f.id}`} className="font-mono text-xs text-lp-pink hover:underline">
                      Editar
                    </a>
                    <form action={excluirFazenda}>
                      <input type="hidden" name="id" value={f.id} />
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
