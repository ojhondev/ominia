"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/require-session";
import { registrarAuditoria } from "@/lib/audit";
import { db } from "@/db";
import { documentos, evidencias } from "@/db/schema";

function orNull(v: FormDataEntryValue | null) {
  const s = String(v ?? "").trim();
  return s === "" ? null : s;
}

export async function criarDocumento(formData: FormData) {
  const session = await requireSession();

  const nome = String(formData.get("nome") ?? "").trim();
  const tipo = String(formData.get("tipo") ?? "").trim();
  if (!nome || !tipo) return;

  const [documento] = await db
    .insert(documentos)
    .values({
      empresaId: session.empresaId,
      nome,
      tipo,
      referenciaExterna: orNull(formData.get("referenciaExterna")),
      validoAte: orNull(formData.get("validoAte")),
      uploadedPor: session.usuarioId,
    })
    .returning();

  await registrarAuditoria({
    empresaId: session.empresaId,
    usuarioId: session.usuarioId,
    entidade: "documentos",
    entidadeId: documento.id,
    acao: "criou",
    detalhes: { nome, tipo },
  });

  revalidatePath("/evidencias");
}

export async function criarEvidencia(formData: FormData) {
  const session = await requireSession();

  const documentoId = String(formData.get("documentoId") ?? "").trim();
  const alvo = String(formData.get("alvo") ?? "").trim(); // "tipo:id"
  const [entidadeTipo, entidadeId] = alvo.split(":");
  if (!documentoId || !entidadeTipo || !entidadeId) return;

  const [evidencia] = await db
    .insert(evidencias)
    .values({
      empresaId: session.empresaId,
      documentoId,
      entidadeTipo,
      entidadeId,
      responsavel: orNull(formData.get("responsavel")),
      status: "pendente",
    })
    .returning();

  await registrarAuditoria({
    empresaId: session.empresaId,
    usuarioId: session.usuarioId,
    entidade: "evidencias",
    entidadeId: evidencia.id,
    acao: "criou",
    detalhes: { entidadeTipo, documentoId },
  });

  revalidatePath("/evidencias");
}

export async function atualizarStatusEvidencia(formData: FormData) {
  const session = await requireSession();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as "aprovado" | "rejeitado";
  if (!id || !status) return;

  await db.update(evidencias).set({ status }).where(eq(evidencias.id, id));

  await registrarAuditoria({
    empresaId: session.empresaId,
    usuarioId: session.usuarioId,
    entidade: "evidencias",
    entidadeId: id,
    acao: status === "aprovado" ? "aprovou" : "rejeitou",
  });

  revalidatePath("/evidencias");
}
