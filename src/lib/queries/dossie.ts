import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  usinas,
  safras,
  evidencias,
  documentos,
  calculos,
  indicadores,
  versoesMetodologia,
  metodologias,
  relatoriosEmissao,
} from "@/db/schema";
import { listRequisitosComStatus, complianceScore } from "./bonsucro";

export async function getDossie(usinaId: string, empresaId: string) {
  const [usina] = await db
    .select()
    .from(usinas)
    .where(and(eq(usinas.id, usinaId), eq(usinas.empresaId, empresaId)))
    .limit(1);
  if (!usina) return null;

  const [requisitosComStatus, score, safrasDaUsina] = await Promise.all([
    listRequisitosComStatus(empresaId, usinaId),
    complianceScore(empresaId, usinaId),
    db.select().from(safras).where(and(eq(safras.usinaId, usinaId), eq(safras.empresaId, empresaId))),
  ]);
  const safraIds = new Set(safrasDaUsina.map((s) => s.id));

  const todasEvidencias = await db
    .select({
      id: evidencias.id,
      entidadeTipo: evidencias.entidadeTipo,
      entidadeId: evidencias.entidadeId,
      status: evidencias.status,
      responsavel: evidencias.responsavel,
      criadoEm: evidencias.criadoEm,
      documentoNome: documentos.nome,
      documentoUrl: documentos.arquivoUrl,
      documentoValidoAte: documentos.validoAte,
    })
    .from(evidencias)
    .leftJoin(documentos, eq(evidencias.documentoId, documentos.id))
    .where(eq(evidencias.empresaId, empresaId));

  const evidenciasDaUsina = todasEvidencias.filter(
    (e) =>
      (e.entidadeTipo === "usina" && e.entidadeId === usinaId) ||
      (e.entidadeTipo === "safra" && e.entidadeId !== null && safraIds.has(e.entidadeId)),
  );

  const calculosDaUsina = await db
    .select({
      id: calculos.id,
      indicadorNome: indicadores.nome,
      resultado: calculos.resultado,
      unidadeResultado: calculos.unidadeResultado,
      calculadoEm: calculos.calculadoEm,
      metodologiaNome: metodologias.nome,
      versao: versoesMetodologia.versao,
    })
    .from(calculos)
    .innerJoin(indicadores, eq(calculos.indicadorId, indicadores.id))
    .innerJoin(versoesMetodologia, eq(calculos.versaoMetodologiaId, versoesMetodologia.id))
    .innerJoin(metodologias, eq(versoesMetodologia.metodologiaId, metodologias.id))
    .where(and(eq(calculos.empresaId, empresaId), eq(calculos.usinaId, usinaId)))
    .orderBy(desc(calculos.calculadoEm));

  const relatoriosPublicados = await db
    .select({
      id: relatoriosEmissao.id,
      titulo: relatoriosEmissao.titulo,
      slugPublico: relatoriosEmissao.slugPublico,
      publicadoEm: relatoriosEmissao.publicadoEm,
    })
    .from(relatoriosEmissao)
    .innerJoin(calculos, eq(relatoriosEmissao.calculoId, calculos.id))
    .where(
      and(
        eq(relatoriosEmissao.empresaId, empresaId),
        eq(calculos.usinaId, usinaId),
        eq(relatoriosEmissao.status, "publicado"),
      ),
    )
    .orderBy(desc(relatoriosEmissao.publicadoEm));

  return {
    usina,
    requisitosComStatus,
    score,
    safras: safrasDaUsina,
    evidencias: evidenciasDaUsina,
    calculos: calculosDaUsina,
    relatoriosPublicados,
  };
}
