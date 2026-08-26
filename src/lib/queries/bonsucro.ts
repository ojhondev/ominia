import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  calculos,
  indicadores,
  usinas,
  safras,
  metodologias,
  versoesMetodologia,
  requisitos,
  resultadosCompliance,
} from "@/db/schema";

export async function getBonsucroVersaoId() {
  const [met] = await db.select().from(metodologias).where(eq(metodologias.nome, "Bonsucro")).limit(1);
  if (!met) return null;
  const [versao] = await db.select().from(versoesMetodologia).where(eq(versoesMetodologia.metodologiaId, met.id)).limit(1);
  return versao?.id ?? null;
}

export async function listCalculosBonsucro(empresaId: string) {
  const versaoId = await getBonsucroVersaoId();
  if (!versaoId) return [];

  return db
    .select({
      id: calculos.id,
      codigo: indicadores.codigo,
      resultado: calculos.resultado,
      unidadeResultado: calculos.unidadeResultado,
      calculadoEm: calculos.calculadoEm,
      usinaNome: usinas.nome,
      safraNome: safras.nome,
    })
    .from(calculos)
    .innerJoin(indicadores, eq(calculos.indicadorId, indicadores.id))
    .leftJoin(usinas, eq(calculos.usinaId, usinas.id))
    .leftJoin(safras, eq(calculos.safraId, safras.id))
    .where(and(eq(calculos.empresaId, empresaId), eq(calculos.versaoMetodologiaId, versaoId)))
    .orderBy(desc(calculos.calculadoEm))
    .limit(50);
}

export async function listRequisitosComStatus(empresaId: string, usinaId: string) {
  const versaoId = await getBonsucroVersaoId();
  if (!versaoId) return [];

  const reqs = await db.select().from(requisitos).where(eq(requisitos.versaoMetodologiaId, versaoId)).orderBy(requisitos.codigo);
  const resultados = await db
    .select()
    .from(resultadosCompliance)
    .where(and(eq(resultadosCompliance.empresaId, empresaId), eq(resultadosCompliance.usinaId, usinaId)));

  const porRequisito = Object.fromEntries(resultados.map((r) => [r.requisitoId, r]));

  return reqs.map((r) => ({
    requisito: r,
    status: porRequisito[r.id]?.status ?? "sem_dados",
  }));
}

export async function complianceScore(empresaId: string, usinaId: string) {
  const lista = await listRequisitosComStatus(empresaId, usinaId);
  if (lista.length === 0) return null;
  const conformes = lista.filter((l) => l.status === "conforme").length;
  return { conformes, total: lista.length, percentual: Math.round((conformes / lista.length) * 100) };
}

/** Soma os cálculos EMISSAO (Motor GHG) de uma safra. Se houver mais de uma unidade
 * entre os cálculos, o resultado fica marcado como "misto" em vez de somar valores
 * incompatíveis. */
export async function emissoesDaSafra(empresaId: string, safraId: string) {
  const rows = await db
    .select({ resultado: calculos.resultado, unidadeResultado: calculos.unidadeResultado })
    .from(calculos)
    .innerJoin(indicadores, eq(calculos.indicadorId, indicadores.id))
    .where(and(eq(calculos.empresaId, empresaId), eq(calculos.safraId, safraId), eq(indicadores.codigo, "EMISSAO")));

  if (rows.length === 0) return null;

  const unidades = new Set(rows.map((r) => r.unidadeResultado ?? "—"));
  const total = rows.reduce((acc, r) => acc + Number(r.resultado), 0);
  const unidade = unidades.size === 1 ? [...unidades][0] : "misto (ver Motor GHG)";

  return { total, unidade };
}
