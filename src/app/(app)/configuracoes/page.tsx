import { requireAdmin } from "@/lib/auth/require-session";
import { getEmpresa } from "@/lib/queries/dashboard";
import { listUsuarios } from "@/lib/queries/configuracoes";
import { atualizarEmpresa, convidarUsuario, removerUsuario } from "./actions";
import { Field, Input, Select } from "@/components/ui/field";
import { Table, THead, Th, Tr, Td } from "@/components/ui/table";
import { FormError } from "@/components/ui/form-error";
import { StatusBadge } from "@/components/ui/status-badge";
import { ActionButton } from "@/components/ui/action-button";
import { SubmitButton } from "@/components/ui/submit-button";
import { ConfirmForm } from "@/components/ui/confirm-form";
import { formatCnpj } from "@/lib/cnpj";

const PAPEL_LABEL: Record<string, string> = {
  admin: "Administrador",
  sustentabilidade: "Sustentabilidade",
  agricola: "Agrícola",
  industrial: "Industrial",
  fiscal: "Fiscal",
  auditor: "Auditor",
  consultor: "Consultor",
};

export default async function ConfiguracoesPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const session = await requireAdmin();
  const { erro } = await searchParams;
  const [empresa, usuariosList] = await Promise.all([
    getEmpresa(session.empresaId),
    listUsuarios(session.empresaId),
  ]);

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-medium tracking-tight text-lp-ink">Configurações</h1>
        <p className="mt-1 text-lp-muted">Dados da empresa e usuários com acesso à conta.</p>
      </div>

      <FormError code={erro} />

      <section className="flex flex-col gap-4">
        <h2 className="font-mono text-xs uppercase tracking-wide text-lp-muted">Dados da empresa</h2>
        <form
          action={atualizarEmpresa}
          className="grid grid-cols-1 gap-4 rounded-2xl border border-lp-line bg-white p-6 sm:grid-cols-2"
        >
          <Field label="Nome da empresa" htmlFor="nome">
            <Input id="nome" name="nome" required defaultValue={empresa?.nome} />
          </Field>
          <Field label="CNPJ" htmlFor="cnpj">
            <Input id="cnpj" name="cnpj" required defaultValue={empresa?.cnpj ? formatCnpj(empresa.cnpj) : ""} />
          </Field>
          <Field label="Segmento (opcional)" htmlFor="segmento">
            <Input id="segmento" name="segmento" placeholder="Sucroenergético, grãos, bioenergia..." defaultValue={empresa?.segmento ?? ""} />
          </Field>
          <div className="flex items-end sm:col-span-2">
            <SubmitButton>Salvar dados da empresa</SubmitButton>
          </div>
        </form>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-mono text-xs uppercase tracking-wide text-lp-muted">Convidar pessoa para a equipe</h2>
        <form
          action={convidarUsuario}
          className="grid grid-cols-1 gap-4 rounded-2xl border border-lp-line bg-white p-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          <Field label="Nome" htmlFor="nome-usuario">
            <Input id="nome-usuario" name="nome" required placeholder="Nome completo" />
          </Field>
          <Field label="E-mail" htmlFor="email-usuario">
            <Input id="email-usuario" name="email" type="email" required placeholder="pessoa@empresa.com" />
          </Field>
          <Field label="Senha inicial" htmlFor="senha-usuario">
            <Input id="senha-usuario" name="senha" type="password" required minLength={8} placeholder="mín. 8 caracteres" />
          </Field>
          <Field label="Papel" htmlFor="papel-usuario">
            <Select id="papel-usuario" name="papel" defaultValue="agricola">
              {Object.entries(PAPEL_LABEL)
                .filter(([value]) => value !== "admin")
                .map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
            </Select>
          </Field>
          <div className="sm:col-span-2 lg:col-span-4">
            <SubmitButton pendingLabel="Adicionando...">Adicionar à equipe</SubmitButton>
          </div>
        </form>
        <p className="text-xs text-lp-muted">
          A pessoa entra direto com o e-mail e a senha definidos aqui — não há e-mail de convite ainda.
          Compartilhe as credenciais por um canal seguro.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-mono text-xs uppercase tracking-wide text-lp-muted">Equipe ({usuariosList.length})</h2>
        <Table>
          <THead>
            <Th>Nome</Th>
            <Th>E-mail</Th>
            <Th>Papel</Th>
            <Th />
          </THead>
          <tbody>
            {usuariosList.map((u) => (
              <Tr key={u.id}>
                <Td className="font-medium text-lp-ink">
                  {u.nome} {u.id === session.usuarioId && <StatusBadge label="Você" tone="positive" />}
                </Td>
                <Td>{u.email}</Td>
                <Td>{PAPEL_LABEL[u.papel] ?? u.papel}</Td>
                <Td>
                  {u.id !== session.usuarioId && (
                    <ConfirmForm action={removerUsuario} confirmMessage={`Remover "${u.nome}" da equipe? Essa pessoa perde o acesso imediatamente.`}>
                      <input type="hidden" name="id" value={u.id} />
                      <ActionButton type="submit" variant="danger" pendingLabel="Removendo...">
                        Remover
                      </ActionButton>
                    </ConfirmForm>
                  )}
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </section>
    </div>
  );
}
