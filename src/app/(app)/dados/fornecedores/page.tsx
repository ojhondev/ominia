import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { fornecedores } from "@/db/schema";
import { requireSession } from "@/lib/auth/require-session";
import { criarFornecedor } from "./actions";

const inputClass =
  "rounded-ui border border-graphite-light bg-graphite-deep px-3 py-2 text-sm text-whiteout outline-none focus:border-neon-glow";

const STATUS_LABEL: Record<string, string> = {
  pendente: "Pendente",
  ativo: "Ativo",
  bloqueado: "Bloqueado",
};

export default async function FornecedoresPage() {
  const session = await requireSession();
  const lista = await db
    .select()
    .from(fornecedores)
    .where(eq(fornecedores.empresaId, session.empresaId))
    .orderBy(desc(fornecedores.criadoEm));

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-medium tracking-tight text-whiteout">Fornecedores</h1>
        <p className="mt-1 text-ash">
          Cadeia de fornecedores da sua empresa — cadastro gratuito, sem custo por
          fornecedor rastreado.
        </p>
      </div>

      <form
        action={criarFornecedor}
        className="grid grid-cols-1 gap-4 rounded-ui border border-graphite-light bg-graphite-deep p-6 sm:grid-cols-4"
      >
        <input name="nome" placeholder="Nome do fornecedor" required className={inputClass} />
        <input name="documento" placeholder="CNPJ/CPF" required className={inputClass} />
        <input
          name="tipo"
          placeholder="Tipo (ex: produtor_rural)"
          required
          className={inputClass}
        />
        <button
          type="submit"
          className="rounded-full bg-whiteout px-5 py-2 text-sm font-medium text-graphite-deep transition-opacity hover:opacity-90"
        >
          Adicionar
        </button>
      </form>

      <div className="overflow-x-auto rounded-ui border border-graphite-light">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-graphite-light bg-graphite text-ash">
              <th className="px-4 py-3 font-mono text-xs font-medium uppercase tracking-wide">
                Nome
              </th>
              <th className="px-4 py-3 font-mono text-xs font-medium uppercase tracking-wide">
                Documento
              </th>
              <th className="px-4 py-3 font-mono text-xs font-medium uppercase tracking-wide">
                Tipo
              </th>
              <th className="px-4 py-3 font-mono text-xs font-medium uppercase tracking-wide">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {lista.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-pewter">
                  Nenhum fornecedor cadastrado ainda.
                </td>
              </tr>
            )}
            {lista.map((fornecedor) => (
              <tr key={fornecedor.id} className="border-b border-graphite-light last:border-0">
                <td className="px-4 py-3 text-whiteout">{fornecedor.nome}</td>
                <td className="px-4 py-3 font-mono text-xs text-cloud">
                  {fornecedor.documento}
                </td>
                <td className="px-4 py-3 text-cloud">{fornecedor.tipo}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-neon-muted px-2.5 py-0.5 font-mono text-xs text-neon-glow">
                    {STATUS_LABEL[fornecedor.statusCadastro] ?? fornecedor.statusCadastro}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
