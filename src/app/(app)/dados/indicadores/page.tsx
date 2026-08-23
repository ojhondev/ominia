import { asc } from "drizzle-orm";
import { db } from "@/db";
import { indicadores } from "@/db/schema";
import { criarIndicador } from "./actions";

const inputClass =
  "rounded-ui border border-graphite-light bg-graphite-deep px-3 py-2 text-sm text-whiteout outline-none focus:border-neon-glow";

export default async function IndicadoresPage() {
  const lista = await db.select().from(indicadores).orderBy(asc(indicadores.categoria));

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-medium tracking-tight text-whiteout">
          Catálogo de indicadores
        </h1>
        <p className="mt-1 text-ash">
          Catálogo global — o mesmo indicador alimenta requisitos de compliance e
          eventos de valor em várias empresas e frameworks.
        </p>
      </div>

      <form
        action={criarIndicador}
        className="grid grid-cols-1 gap-4 rounded-ui border border-graphite-light bg-graphite-deep p-6 sm:grid-cols-5"
      >
        <input name="codigo" placeholder="Código (ex: GEE_ESCOPO1)" required className={inputClass} />
        <input name="nome" placeholder="Nome" required className={inputClass} />
        <input name="categoria" placeholder="Categoria (ex: emissões)" required className={inputClass} />
        <input name="unidadeMedida" placeholder="Unidade (ex: tCO2e)" required className={inputClass} />
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
                Código
              </th>
              <th className="px-4 py-3 font-mono text-xs font-medium uppercase tracking-wide">
                Nome
              </th>
              <th className="px-4 py-3 font-mono text-xs font-medium uppercase tracking-wide">
                Categoria
              </th>
              <th className="px-4 py-3 font-mono text-xs font-medium uppercase tracking-wide">
                Unidade
              </th>
            </tr>
          </thead>
          <tbody>
            {lista.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-pewter">
                  Nenhum indicador cadastrado ainda.
                </td>
              </tr>
            )}
            {lista.map((indicador) => (
              <tr key={indicador.id} className="border-b border-graphite-light last:border-0">
                <td className="px-4 py-3 font-mono text-xs text-neon-glow">
                  {indicador.codigo}
                </td>
                <td className="px-4 py-3 text-whiteout">{indicador.nome}</td>
                <td className="px-4 py-3 text-cloud">{indicador.categoria}</td>
                <td className="px-4 py-3 text-cloud">{indicador.unidadeMedida}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
