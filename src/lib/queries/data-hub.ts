import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import { registrosAtividade, usinas, fazendas, safras } from "@/db/schema";

export async function listRegistros(empresaId: string) {
  return db
    .select({
      id: registrosAtividade.id,
      categoria: registrosAtividade.categoria,
      tipo: registrosAtividade.tipo,
      quantidade: registrosAtividade.quantidade,
      unidade: registrosAtividade.unidade,
      dataReferencia: registrosAtividade.dataReferencia,
      origem: registrosAtividade.origem,
      status: registrosAtividade.status,
      usinaNome: usinas.nome,
      fazendaPropriedade: fazendas.propriedade,
      safraNome: safras.nome,
      criadoEm: registrosAtividade.criadoEm,
    })
    .from(registrosAtividade)
    .leftJoin(usinas, eq(registrosAtividade.usinaId, usinas.id))
    .leftJoin(fazendas, eq(registrosAtividade.fazendaId, fazendas.id))
    .leftJoin(safras, eq(registrosAtividade.safraId, safras.id))
    .where(eq(registrosAtividade.empresaId, empresaId))
    .orderBy(desc(registrosAtividade.criadoEm))
    .limit(200);
}

/** Soma a quantidade dos registros de uma safra cujo `tipo` esteja na lista informada. */
export async function somaQuantidadePorTipo(empresaId: string, safraId: string, tipos: string[]) {
  const [row] = await db
    .select({ total: sql<string>`coalesce(sum(${registrosAtividade.quantidade}), 0)` })
    .from(registrosAtividade)
    .where(
      and(
        eq(registrosAtividade.empresaId, empresaId),
        eq(registrosAtividade.safraId, safraId),
        inArray(registrosAtividade.tipo, tipos),
      ),
    );
  return Number(row.total);
}
