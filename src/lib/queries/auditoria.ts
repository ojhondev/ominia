import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { logsAuditoria, usuarios } from "@/db/schema";

export async function listLogsAuditoria(empresaId: string) {
  return db
    .select({
      id: logsAuditoria.id,
      entidade: logsAuditoria.entidade,
      acao: logsAuditoria.acao,
      detalhes: logsAuditoria.detalhes,
      criadoEm: logsAuditoria.criadoEm,
      usuarioNome: usuarios.nome,
    })
    .from(logsAuditoria)
    .leftJoin(usuarios, eq(logsAuditoria.usuarioId, usuarios.id))
    .where(eq(logsAuditoria.empresaId, empresaId))
    .orderBy(desc(logsAuditoria.criadoEm))
    .limit(100);
}
