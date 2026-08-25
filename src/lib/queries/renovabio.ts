import { and, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { calculos, indicadores, usinas, safras, versoesMetodologia, metodologias } from "@/db/schema";

export async function listCalculosCbio(empresaId: string) {
  const [renovabio] = await db.select().from(metodologias).where(eq(metodologias.nome, "RenovaBio")).limit(1);
  if (!renovabio) return [];

  const versoes = await db.select().from(versoesMetodologia).where(eq(versoesMetodologia.metodologiaId, renovabio.id));
  const versaoIds = versoes.map((v) => v.id);
  if (versaoIds.length === 0) return [];

  return db
    .select({
      id: calculos.id,
      codigo: indicadores.codigo,
      resultado: calculos.resultado,
      unidadeResultado: calculos.unidadeResultado,
      calculadoEm: calculos.calculadoEm,
      usinaNome: usinas.nome,
      safraNome: safras.nome,
      inputs: calculos.inputs,
    })
    .from(calculos)
    .innerJoin(indicadores, eq(calculos.indicadorId, indicadores.id))
    .leftJoin(usinas, eq(calculos.usinaId, usinas.id))
    .leftJoin(safras, eq(calculos.safraId, safras.id))
    .where(and(eq(calculos.empresaId, empresaId), inArray(calculos.versaoMetodologiaId, versaoIds)))
    .orderBy(desc(calculos.calculadoEm))
    .limit(100);
}
