import { and, desc, eq, isNull, or } from "drizzle-orm";
import { db } from "@/db";
import { fatoresEmissao, calculos, indicadores, usinas, safras } from "@/db/schema";

/** Fatores globais (empresaId nulo, catálogo de referência) + fatores próprios da empresa. */
export async function listFatores(empresaId: string) {
  return db
    .select()
    .from(fatoresEmissao)
    .where(and(eq(fatoresEmissao.ativo, true), or(isNull(fatoresEmissao.empresaId), eq(fatoresEmissao.empresaId, empresaId))))
    .orderBy(fatoresEmissao.categoria);
}

export async function listCalculosGhg(empresaId: string) {
  return db
    .select({
      id: calculos.id,
      resultado: calculos.resultado,
      unidadeResultado: calculos.unidadeResultado,
      inputs: calculos.inputs,
      calculadoEm: calculos.calculadoEm,
      usinaNome: usinas.nome,
      safraNome: safras.nome,
    })
    .from(calculos)
    .innerJoin(indicadores, eq(calculos.indicadorId, indicadores.id))
    .leftJoin(usinas, eq(calculos.usinaId, usinas.id))
    .leftJoin(safras, eq(calculos.safraId, safras.id))
    .where(and(eq(calculos.empresaId, empresaId), eq(indicadores.codigo, "EMISSAO")))
    .orderBy(desc(calculos.calculadoEm))
    .limit(100);
}

export function unidadeSaidaFator(unidadeFator: string) {
  return unidadeFator.split("/")[0]?.trim() || unidadeFator;
}
