"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/require-session";
import { registrarAuditoria } from "@/lib/audit";
import { db } from "@/db";
import { registrosAtividade } from "@/db/schema";

function orNull(v: FormDataEntryValue | null) {
  const s = String(v ?? "").trim();
  return s === "" ? null : s;
}

export async function criarRegistro(formData: FormData) {
  const session = await requireSession();

  const usinaId = String(formData.get("usinaId") ?? "").trim();
  const categoria = String(formData.get("categoria") ?? "").trim() as
    | "agricola"
    | "industrial"
    | "logistica";
  const tipo = String(formData.get("tipo") ?? "").trim();
  const quantidade = String(formData.get("quantidade") ?? "").trim();
  const unidade = String(formData.get("unidade") ?? "").trim();
  const dataReferencia = String(formData.get("dataReferencia") ?? "").trim();

  if (!usinaId || !categoria || !tipo || !quantidade || !unidade || !dataReferencia) return;

  const [registro] = await db
    .insert(registrosAtividade)
    .values({
      empresaId: session.empresaId,
      usinaId,
      fazendaId: orNull(formData.get("fazendaId")),
      safraId: orNull(formData.get("safraId")),
      categoria,
      tipo,
      quantidade,
      unidade,
      dataReferencia,
      origem: "manual",
      status: "rascunho",
      observacao: orNull(formData.get("observacao")),
      criadoPor: session.usuarioId,
    })
    .returning();

  await registrarAuditoria({
    empresaId: session.empresaId,
    usuarioId: session.usuarioId,
    entidade: "registros_atividade",
    entidadeId: registro.id,
    acao: "criou",
    detalhes: { categoria, tipo, quantidade, unidade },
  });

  revalidatePath("/data-hub");
  revalidatePath("/dashboard");
}

export async function validarRegistro(formData: FormData) {
  const session = await requireSession();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await db.update(registrosAtividade).set({ status: "validado" }).where(eq(registrosAtividade.id, id));

  await registrarAuditoria({
    empresaId: session.empresaId,
    usuarioId: session.usuarioId,
    entidade: "registros_atividade",
    entidadeId: id,
    acao: "validou",
  });

  revalidatePath("/data-hub");
}
