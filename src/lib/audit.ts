import { db } from "@/db";
import { logsAuditoria } from "@/db/schema";

export async function registrarAuditoria(params: {
  empresaId: string;
  usuarioId?: string;
  entidade: string;
  entidadeId?: string;
  acao: string;
  detalhes?: Record<string, unknown>;
}) {
  await db.insert(logsAuditoria).values({
    empresaId: params.empresaId,
    usuarioId: params.usuarioId,
    entidade: params.entidade,
    entidadeId: params.entidadeId,
    acao: params.acao,
    detalhes: params.detalhes ?? null,
  });
}
