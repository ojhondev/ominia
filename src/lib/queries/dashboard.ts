import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { empresas, usinas, safras, calculos, indicadores } from "@/db/schema";
import { listUsinas } from "./organizacao";
import { complianceScore, listRequisitosComStatus } from "./bonsucro";

export async function getEmpresa(empresaId: string) {
  const [empresa] = await db.select().from(empresas).where(eq(empresas.id, empresaId));
  return empresa ?? null;
}

export async function getResumoDashboard(empresaId: string) {
  const [{ totalUsinas }] = await db
    .select({ totalUsinas: sql<number>`count(*)::int` })
    .from(usinas)
    .where(eq(usinas.empresaId, empresaId));

  const [{ totalSafrasAbertas }] = await db
    .select({ totalSafrasAbertas: sql<number>`count(*)::int` })
    .from(safras)
    .where(and(eq(safras.empresaId, empresaId), eq(safras.encerrada, false)));

  const [emissaoTotal] = await db
    .select({ total: sql<string>`coalesce(sum(${calculos.resultado}), 0)` })
    .from(calculos)
    .innerJoin(indicadores, eq(calculos.indicadorId, indicadores.id))
    .where(and(eq(calculos.empresaId, empresaId), eq(indicadores.codigo, "EMISSAO")));

  const [cbioTotal] = await db
    .select({ total: sql<string>`coalesce(sum(${calculos.resultado}), 0)` })
    .from(calculos)
    .innerJoin(indicadores, eq(calculos.indicadorId, indicadores.id))
    .where(and(eq(calculos.empresaId, empresaId), eq(indicadores.codigo, "CBIO_QTD")));

  const usinasList = await listUsinas(empresaId);
  const [scores, requisitosPorUsina] = await Promise.all([
    Promise.all(usinasList.map((u) => complianceScore(empresaId, u.id))),
    Promise.all(usinasList.map((u) => listRequisitosComStatus(empresaId, u.id))),
  ]);
  const scoresValidos = scores.filter((s): s is NonNullable<typeof s> => s !== null);
  const bonsucroScoreMedio =
    scoresValidos.length > 0
      ? Math.round(scoresValidos.reduce((acc, s) => acc + s.percentual, 0) / scoresValidos.length)
      : null;

  const requisitosPendentes = requisitosPorUsina
    .flat()
    .filter((r) => r.status === "sem_dados").length;

  return {
    totalUsinas,
    totalSafrasAbertas,
    emissaoTotal: Number(emissaoTotal.total),
    cbioEstimado: Number(cbioTotal.total),
    bonsucroScoreMedio,
    requisitosPendentes,
  };
}
