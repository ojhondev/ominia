import { requireSession } from "@/lib/auth/require-session";
import { listUsinas } from "@/lib/queries/organizacao";
import { criarUsina } from "./actions";
import { Field, Input } from "@/components/ui/field";
import { Table, THead, Th, Tr, Td } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";

export default async function UsinasPage() {
  const session = await requireSession();
  const lista = await listUsinas(session.empresaId);

  return (
    <div className="flex flex-col gap-6">
      <form
        action={criarUsina}
        className="grid grid-cols-2 gap-4 rounded-2xl border border-lp-line bg-white p-6 md:grid-cols-4"
      >
        <Field label="Nome da usina" htmlFor="nome">
          <Input id="nome" name="nome" required placeholder="Usina Santa Fé" />
        </Field>
        <Field label="Município" htmlFor="municipio">
          <Input id="municipio" name="municipio" placeholder="Ribeirão Preto" />
        </Field>
        <Field label="Estado" htmlFor="estado">
          <Input id="estado" name="estado" placeholder="SP" maxLength={2} />
        </Field>
        <Field label="Capacidade (t cana/safra)" htmlFor="capacidadeProducaoTon">
          <Input id="capacidadeProducaoTon" name="capacidadeProducaoTon" type="number" step="any" placeholder="3500000" />
        </Field>
        <div className="col-span-2 md:col-span-4">
          <Field label="Rota de produção" htmlFor="rotaProducao">
            <Input id="rotaProducao" name="rotaProducao" placeholder="Açúcar + etanol + bioeletricidade" />
          </Field>
        </div>
        <div className="col-span-2 flex items-end md:col-span-4">
          <button
            type="submit"
            className="rounded-full bg-lp-pink px-7 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Adicionar usina
          </button>
        </div>
      </form>

      {lista.length === 0 ? (
        <EmptyState
          title="Nenhuma usina cadastrada"
          description="Cadastre a primeira usina para começar a vincular fazendas, safras e registros de atividade."
        />
      ) : (
        <Table>
          <THead>
            <Th>Nome</Th>
            <Th>Município/UF</Th>
            <Th>Capacidade</Th>
            <Th>Rota de produção</Th>
          </THead>
          <tbody>
            {lista.map((u) => (
              <Tr key={u.id}>
                <Td className="font-medium text-lp-ink">{u.nome}</Td>
                <Td>{[u.municipio, u.estado].filter(Boolean).join(" / ") || "—"}</Td>
                <Td>{u.capacidadeProducaoTon ? `${Number(u.capacidadeProducaoTon).toLocaleString("pt-BR")} t` : "—"}</Td>
                <Td>{u.rotaProducao ?? "—"}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
