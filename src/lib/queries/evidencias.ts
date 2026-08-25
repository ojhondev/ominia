import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { documentos, evidencias } from "@/db/schema";

export async function listDocumentos(empresaId: string) {
  return db.select().from(documentos).where(eq(documentos.empresaId, empresaId)).orderBy(desc(documentos.criadoEm));
}

export async function listEvidencias(empresaId: string) {
  return db
    .select({
      id: evidencias.id,
      entidadeTipo: evidencias.entidadeTipo,
      entidadeId: evidencias.entidadeId,
      responsavel: evidencias.responsavel,
      status: evidencias.status,
      versao: evidencias.versao,
      criadoEm: evidencias.criadoEm,
      documentoNome: documentos.nome,
      documentoTipo: documentos.tipo,
      documentoValidoAte: documentos.validoAte,
    })
    .from(evidencias)
    .leftJoin(documentos, eq(evidencias.documentoId, documentos.id))
    .where(eq(evidencias.empresaId, empresaId))
    .orderBy(desc(evidencias.criadoEm));
}
