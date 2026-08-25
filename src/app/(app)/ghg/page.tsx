import { requireSession } from "@/lib/auth/require-session";
import { listFatores, listCalculosGhg } from "@/lib/queries/ghg";
import { listRegistros } from "@/lib/queries/data-hub";
import { criarFator, calcularEmissao } from "./actions";
import { Field, Input, Select } from "@/components/ui/field";
import { Table, THead, Th, Tr, Td } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";

export default async function GhgPage() {
  const session = await requireSession();
  const [fatores, registros, historico] = await Promise.all([
    listFatores(),
    listRegistros(session.empresaId),
    listCalculosGhg(session.empresaId),
  ]);

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-medium tracking-tight text-lp-ink">Motor GHG</h1>
        <p className="mt-1 text-lp-muted">
          Motor independente — não sabe o que é Bonsucro ou CBIO, apenas{" "}
          <span className="font-mono text-lp-ink/80">atividade × fator → emissão</span>. Reutilizado pelo BNS-05 do
          Motor Bonsucro.
        </p>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="font-mono text-xs uppercase tracking-wide text-lp-muted">Fatores de emissão</h2>
        <form
          action={criarFator}
          className="grid grid-cols-2 gap-4 rounded-2xl border border-lp-line bg-white p-6 md:grid-cols-4"
        >
          <Field label="Nome" htmlFor="nome">
            <Input id="nome" name="nome" required placeholder="Diesel" />
          </Field>
          <Field label="Categoria" htmlFor="categoria">
            <Input id="categoria" name="categoria" required placeholder="combustível, eletricidade, fertilizante..." />
          </Field>
          <Field label="Valor" htmlFor="valor">
            <Input id="valor" name="valor" type="number" step="any" required placeholder="2.68" />
          </Field>
          <Field label="Unidade" htmlFor="unidade">
            <Input id="unidade" name="unidade" required placeholder="kgCO2e/L" />
          </Field>
          <Field label="Fonte" htmlFor="fonte">
            <Input id="fonte" name="fonte" required placeholder="GHG Protocol / MCTI" />
          </Field>
          <Field label="Versão" htmlFor="versao">
            <Input id="versao" name="versao" required placeholder="2026" />
          </Field>
          <Field label="Válido de" htmlFor="validoDe">
            <Input id="validoDe" name="validoDe" type="date" required />
          </Field>
          <div className="flex items-end">
            <button
              type="submit"
              className="rounded-full bg-lp-pink px-7 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Adicionar fator
            </button>
          </div>
        </form>

        {fatores.length === 0 ? (
          <EmptyState title="Nenhum fator cadastrado" description="Cadastre fatores de emissão para poder calcular emissões a partir dos registros de atividade." />
        ) : (
          <Table>
            <THead>
              <Th>Nome</Th>
              <Th>Categoria</Th>
              <Th>Valor</Th>
              <Th>Fonte</Th>
              <Th>Versão</Th>
            </THead>
            <tbody>
              {fatores.map((f) => (
                <Tr key={f.id}>
                  <Td className="font-medium text-lp-ink">{f.nome}</Td>
                  <Td>{f.categoria}</Td>
                  <Td>
                    {Number(f.valor).toLocaleString("pt-BR")} {f.unidade}
                  </Td>
                  <Td>{f.fonte}</Td>
                  <Td>{f.versao}</Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-mono text-xs uppercase tracking-wide text-lp-muted">Calcular emissão</h2>

        {registros.length === 0 || fatores.length === 0 ? (
          <EmptyState
            title="Falta registro de atividade ou fator"
            description="Cadastre ao menos um registro no Data Hub e um fator de emissão para calcular."
          />
        ) : (
          <form
            action={calcularEmissao}
            className="grid grid-cols-1 gap-4 rounded-2xl border border-lp-line bg-white p-6 md:grid-cols-3"
          >
            <Field label="Registro de atividade" htmlFor="registroId">
              <Select id="registroId" name="registroId" required defaultValue="">
                <option value="" disabled>
                  Selecione
                </option>
                {registros.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.tipo} — {Number(r.quantidade).toLocaleString("pt-BR")} {r.unidade} ({r.dataReferencia})
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Fator de emissão" htmlFor="fatorId">
              <Select id="fatorId" name="fatorId" required defaultValue="">
                <option value="" disabled>
                  Selecione
                </option>
                {fatores.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.nome} ({f.valor} {f.unidade})
                  </option>
                ))}
              </Select>
            </Field>
            <div className="flex items-end">
              <button
                type="submit"
                className="rounded-full bg-lp-pink px-7 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                Calcular
              </button>
            </div>
          </form>
        )}

        {historico.length === 0 ? (
          <EmptyState title="Nenhum cálculo ainda" description="Os cálculos de emissão aparecem aqui, com trilha completa de inputs e metodologia." />
        ) : (
          <Table>
            <THead>
              <Th>Resultado</Th>
              <Th>Usina</Th>
              <Th>Safra</Th>
              <Th>Calculado em</Th>
            </THead>
            <tbody>
              {historico.map((c) => (
                <Tr key={c.id}>
                  <Td className="font-medium text-lp-ink">
                    {Number(c.resultado).toLocaleString("pt-BR", { maximumFractionDigits: 3 })} {c.unidadeResultado}
                  </Td>
                  <Td>{c.usinaNome ?? "—"}</Td>
                  <Td>{c.safraNome ?? "—"}</Td>
                  <Td>{new Date(c.calculadoEm).toLocaleString("pt-BR")}</Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
      </section>
    </div>
  );
}
