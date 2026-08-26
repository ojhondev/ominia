import { requireSession } from "@/lib/auth/require-session";
import { listUsinas } from "@/lib/queries/organizacao";
import { criarUsina, editarUsina, excluirUsina } from "./actions";
import { Field, Input } from "@/components/ui/field";
import { Table, THead, Th, Tr, Td } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { FormError } from "@/components/ui/form-error";
import { ActionLink, ActionButton } from "@/components/ui/action-button";
import { SubmitButton } from "@/components/ui/submit-button";
import { ConfirmForm } from "@/components/ui/confirm-form";

export default async function UsinasPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string; editar?: string }>;
}) {
  const session = await requireSession();
  const { erro, editar } = await searchParams;
  const lista = await listUsinas(session.empresaId);
  const emEdicao = editar ? lista.find((u) => u.id === editar) : undefined;

  return (
    <div className="flex flex-col gap-6">
      <FormError code={erro} />

      <form
        action={emEdicao ? editarUsina : criarUsina}
        className="grid grid-cols-2 gap-4 rounded-2xl border border-lp-line bg-white p-6 md:grid-cols-4"
      >
        {emEdicao && <input type="hidden" name="id" value={emEdicao.id} />}
        <Field label="Nome da usina" htmlFor="nome">
          <Input id="nome" name="nome" required placeholder="Usina Santa Fé" defaultValue={emEdicao?.nome} />
        </Field>
        <Field label="Município" htmlFor="municipio">
          <Input id="municipio" name="municipio" placeholder="Ribeirão Preto" defaultValue={emEdicao?.municipio ?? ""} />
        </Field>
        <Field label="Estado" htmlFor="estado">
          <Input id="estado" name="estado" placeholder="SP" maxLength={2} defaultValue={emEdicao?.estado ?? ""} />
        </Field>
        <Field label="Capacidade (t cana/safra)" htmlFor="capacidadeProducaoTon">
          <Input
            id="capacidadeProducaoTon"
            name="capacidadeProducaoTon"
            type="number"
            step="any"
            min="0"
            placeholder="3500000"
            defaultValue={emEdicao?.capacidadeProducaoTon ?? ""}
          />
        </Field>
        <div className="col-span-2 md:col-span-4">
          <Field label="Rota de produção" htmlFor="rotaProducao">
            <Input
              id="rotaProducao"
              name="rotaProducao"
              placeholder="Açúcar + etanol + bioeletricidade"
              defaultValue={emEdicao?.rotaProducao ?? ""}
            />
          </Field>
        </div>
        <div className="col-span-2 flex items-end gap-3 md:col-span-4">
          <SubmitButton>{emEdicao ? "Salvar alterações" : "Adicionar usina"}</SubmitButton>
          {emEdicao && (
            <a href="/organizacao" className="text-sm text-lp-muted hover:text-lp-ink">
              Cancelar
            </a>
          )}
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
            <Th />
          </THead>
          <tbody>
            {lista.map((u) => (
              <Tr key={u.id}>
                <Td className="font-medium text-lp-ink">{u.nome}</Td>
                <Td>{[u.municipio, u.estado].filter(Boolean).join(" / ") || "—"}</Td>
                <Td>{u.capacidadeProducaoTon ? `${Number(u.capacidadeProducaoTon).toLocaleString("pt-BR")} t` : "—"}</Td>
                <Td>{u.rotaProducao ?? "—"}</Td>
                <Td>
                  <div className="flex gap-2">
                    <ActionLink href={`/organizacao?editar=${u.id}`}>Editar</ActionLink>
                    <ConfirmForm action={excluirUsina} confirmMessage={`Excluir a usina "${u.nome}"? Essa ação não pode ser desfeita.`}>
                      <input type="hidden" name="id" value={u.id} />
                      <ActionButton type="submit" variant="danger" pendingLabel="Excluindo...">
                        Excluir
                      </ActionButton>
                    </ConfirmForm>
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
