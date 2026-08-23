import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { unidades } from "@/db/schema";
import { requireSession } from "@/lib/auth/require-session";
import { criarUnidade } from "./actions";

const inputClass =
  "rounded-ui border border-graphite-light bg-graphite-deep px-3 py-2 text-sm text-whiteout outline-none focus:border-neon-glow";

export default async function UnidadesPage() {
  const session = await requireSession();
  const lista = await db
    .select()
    .from(unidades)
    .where(eq(unidades.empresaId, session.empresaId))
    .orderBy(desc(unidades.criadoEm));

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-medium tracking-tight text-whiteout">Unidades</h1>
        <p className="mt-1 text-ash">
          Plantas, usinas e demais unidades industriais da sua empresa — a base do
          Pilar Dados.
        </p>
      </div>

      <form
        action={criarUnidade}
        className="grid grid-cols-1 gap-4 rounded-ui border border-graphite-light bg-graphite-deep p-6 sm:grid-cols-4"
      >
        <input name="nome" placeholder="Nome da unidade" required className={inputClass} />
        <input name="tipo" placeholder="Tipo (ex: usina, fazenda)" required className={inputClass} />
        <input name="municipio" placeholder="Município" className={inputClass} />
        <div className="flex gap-2">
          <input name="uf" placeholder="UF" maxLength={2} className={`${inputClass} w-20`} />
          <button
            type="submit"
            className="flex-1 rounded-full bg-whiteout px-5 py-2 text-sm font-medium text-graphite-deep transition-opacity hover:opacity-90"
          >
            Adicionar
          </button>
        </div>
      </form>

      <div className="overflow-x-auto rounded-ui border border-graphite-light">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-graphite-light bg-graphite text-ash">
              <th className="px-4 py-3 font-mono text-xs font-medium uppercase tracking-wide">
                Nome
              </th>
              <th className="px-4 py-3 font-mono text-xs font-medium uppercase tracking-wide">
                Tipo
              </th>
              <th className="px-4 py-3 font-mono text-xs font-medium uppercase tracking-wide">
                Local
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
                  Nenhuma unidade cadastrada ainda.
                </td>
              </tr>
            )}
            {lista.map((unidade) => (
              <tr key={unidade.id} className="border-b border-graphite-light last:border-0">
                <td className="px-4 py-3 text-whiteout">{unidade.nome}</td>
                <td className="px-4 py-3 text-cloud">{unidade.tipo}</td>
                <td className="px-4 py-3 text-cloud">
                  {[unidade.municipio, unidade.uf].filter(Boolean).join(" / ") || "—"}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-neon-muted px-2.5 py-0.5 font-mono text-xs text-neon-glow">
                    {unidade.status}
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
