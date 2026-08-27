import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { usinas, fazendas, safras, registrosAtividade, documentos, fatoresEmissao, calculos, relatoriosEmissao } from "@/db/schema";

/**
 * Cada helper busca a linha por id **e** empresaId na mesma query — nunca por id sozinho.
 * Isso impede que um usuário autenticado leia ou escreva em cima de dados de outra empresa
 * mesmo que consiga adivinhar/expor um UUID de outro tenant.
 */

export async function getOwnedUsina(id: string, empresaId: string) {
  const [row] = await db.select().from(usinas).where(and(eq(usinas.id, id), eq(usinas.empresaId, empresaId))).limit(1);
  return row ?? null;
}

export async function getOwnedFazenda(id: string, empresaId: string) {
  const [row] = await db.select().from(fazendas).where(and(eq(fazendas.id, id), eq(fazendas.empresaId, empresaId))).limit(1);
  return row ?? null;
}

export async function getOwnedSafra(id: string, empresaId: string) {
  const [row] = await db.select().from(safras).where(and(eq(safras.id, id), eq(safras.empresaId, empresaId))).limit(1);
  return row ?? null;
}

export async function getOwnedRegistro(id: string, empresaId: string) {
  const [row] = await db
    .select()
    .from(registrosAtividade)
    .where(and(eq(registrosAtividade.id, id), eq(registrosAtividade.empresaId, empresaId)))
    .limit(1);
  return row ?? null;
}

export async function getOwnedDocumento(id: string, empresaId: string) {
  const [row] = await db.select().from(documentos).where(and(eq(documentos.id, id), eq(documentos.empresaId, empresaId))).limit(1);
  return row ?? null;
}

/** Fator de emissão: `empresaId` nulo é catálogo global (visível a todos, não editável por tenant). */
export async function getUsableFator(id: string, empresaId: string) {
  const [row] = await db.select().from(fatoresEmissao).where(eq(fatoresEmissao.id, id)).limit(1);
  if (!row) return null;
  if (row.empresaId !== null && row.empresaId !== empresaId) return null;
  return row;
}

export async function getOwnedFator(id: string, empresaId: string) {
  const [row] = await db
    .select()
    .from(fatoresEmissao)
    .where(and(eq(fatoresEmissao.id, id), eq(fatoresEmissao.empresaId, empresaId)))
    .limit(1);
  return row ?? null;
}

export async function getOwnedCalculo(id: string, empresaId: string) {
  const [row] = await db.select().from(calculos).where(and(eq(calculos.id, id), eq(calculos.empresaId, empresaId))).limit(1);
  return row ?? null;
}

export async function getOwnedRelatorio(id: string, empresaId: string) {
  const [row] = await db
    .select()
    .from(relatoriosEmissao)
    .where(and(eq(relatoriosEmissao.id, id), eq(relatoriosEmissao.empresaId, empresaId)))
    .limit(1);
  return row ?? null;
}
