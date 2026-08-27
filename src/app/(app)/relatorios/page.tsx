import Link from "next/link";
import { requireAdmin } from "@/lib/auth/require-session";
import { listRelatorios, listCalculosSemRelatorio } from "@/lib/queries/relatorios";
import { criarRelatorio } from "./actions";
import { Field, Select } from "@/components/ui/field";
import { Table, THead, Th, Tr, Td } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { FormError } from "@/components/ui/form-error";
import { SubmitButton } from "@/components/ui/submit-button";

export default async function RelatoriosPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const session = await requireAdmin();
  const { erro } = await searchParams;
  const [relatorios, calculosDisponiveis] = await Promise.all([
    listRelatorios(session.empresaId),
    listCalculosSemRelatorio(session.empresaId),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-medium tracking-tight text-lp-ink">Registro de Integridade</h1>
        <p className="mt-1 max-w-2xl text-lp-muted">
          Gere um relatório público e verificável a partir de uma emissão já calculada — com selo em PNG e hash de
          integridade. Não é uma certificação de conformidade RenovaBio/Bonsucro, é um registro de que o dado não
          foi alterado desde a publicação.
        </p>
      </div>

      <FormError code={erro} />

      {calculosDisponiveis.length === 0 ? (
        <EmptyState
          title="Nenhum cálculo disponível"
          description="Faça um cálculo em GHG, RenovaBio ou Bonsucro primeiro — cada cálculo pode virar um relatório."
        />
      ) : (
        <form
          action={criarRelatorio}
          className="flex flex-col gap-4 rounded-2xl border border-lp-line bg-white p-6 sm:flex-row sm:items-end sm:gap-4"
        >
          <div className="flex-1">
            <Field label="Cálculo" htmlFor="calculoId">
              <Select id="calculoId" name="calculoId" required defaultValue="">
                <option value="" disabled>
                  Selecione um cálculo sem relatório
                </option>
                {calculosDisponiveis.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.metodologiaNome} — {c.indicadorNome} · {c.usinaNome ?? "—"} ·{" "}
                    {new Date(c.calculadoEm).toLocaleDateString("pt-BR")}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <SubmitButton pendingLabel="Criando...">Criar rascunho</SubmitButton>
        </form>
      )}

      {relatorios.length === 0 ? (
        <EmptyState title="Nenhum relatório ainda" description="Relatórios criados aparecem aqui, publicados ou em rascunho." />
      ) : (
        <Table>
          <THead>
            <Th>Título</Th>
            <Th>Metodologia</Th>
            <Th>Usina</Th>
            <Th>Status</Th>
            <Th>Criado em</Th>
          </THead>
          <tbody>
            {relatorios.map((r) => (
              <Tr key={r.id}>
                <Td className="font-medium text-lp-ink">
                  <Link href={`/relatorios/${r.id}`} className="hover:text-lp-pink-deep hover:underline">
                    {r.titulo}
                  </Link>
                </Td>
                <Td>{r.metodologiaNome}</Td>
                <Td>{r.usinaNome ?? "—"}</Td>
                <Td>
                  {r.status === "publicado" ? (
                    <StatusBadge label="Publicado" tone="positive" />
                  ) : (
                    <StatusBadge label="Rascunho" tone="neutral" />
                  )}
                </Td>
                <Td>{new Date(r.criadoEm).toLocaleDateString("pt-BR")}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
