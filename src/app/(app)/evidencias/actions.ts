"use server";

import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { put, del } from "@vercel/blob";
import { requireSession } from "@/lib/auth/require-session";
import { registrarAuditoria } from "@/lib/audit";
import { getOwnedUsina, getOwnedFazenda, getOwnedSafra, getOwnedDocumento } from "@/lib/ownership";
import { db } from "@/db";
import { documentos, evidencias } from "@/db/schema";

const TAMANHO_MAXIMO_BYTES = 20 * 1024 * 1024; // 20 MB

function orNull(v: FormDataEntryValue | null) {
  const s = String(v ?? "").trim();
  return s === "" ? null : s;
}

export async function criarDocumento(formData: FormData) {
  const session = await requireSession();

  const nome = String(formData.get("nome") ?? "").trim();
  const tipo = String(formData.get("tipo") ?? "").trim();
  const referenciaExterna = orNull(formData.get("referenciaExterna"));
  const arquivo = formData.get("arquivo");
  const temArquivo = arquivo instanceof File && arquivo.size > 0;

  if (!nome || !tipo || (!temArquivo && !referenciaExterna)) {
    redirect("/evidencias?erro=campos_invalidos");
  }

  let arquivoUrl: string | null = null;
  let arquivoNome: string | null = null;
  let arquivoMimeType: string | null = null;
  let arquivoTamanhoBytes: number | null = null;

  if (temArquivo) {
    const file = arquivo as File;
    if (file.size > TAMANHO_MAXIMO_BYTES) {
      redirect("/evidencias?erro=arquivo_muito_grande");
    }

    try {
      const blob = await put(`documentos/${session.empresaId}/${Date.now()}-${file.name}`, file, {
        access: "public",
        addRandomSuffix: true,
      });
      arquivoUrl = blob.url;
      arquivoNome = file.name;
      arquivoMimeType = file.type || null;
      arquivoTamanhoBytes = file.size;
    } catch {
      redirect("/evidencias?erro=falha_upload");
    }
  }

  const [documento] = await db
    .insert(documentos)
    .values({
      empresaId: session.empresaId,
      nome,
      tipo,
      referenciaExterna,
      arquivoUrl,
      arquivoNome,
      arquivoMimeType,
      arquivoTamanhoBytes,
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
    detalhes: { nome, tipo, arquivo: temArquivo ? arquivoNome : "referência externa" },
  });

  revalidatePath("/evidencias");
}

export async function excluirDocumento(formData: FormData) {
  const session = await requireSession();
  const id = String(formData.get("id") ?? "");

  const documento = await getOwnedDocumento(id, session.empresaId);
  if (!documento) redirect("/evidencias?erro=nao_encontrado");

  if (documento.arquivoUrl) {
    try {
      await del(documento.arquivoUrl);
    } catch {
      // arquivo já pode ter sido removido; não bloqueia a exclusão do registro
    }
  }

  await db.delete(documentos).where(and(eq(documentos.id, id), eq(documentos.empresaId, session.empresaId)));

  await registrarAuditoria({
    empresaId: session.empresaId,
    usuarioId: session.usuarioId,
    entidade: "documentos",
    entidadeId: id,
    acao: "excluiu",
  });

  revalidatePath("/evidencias");
}

export async function criarEvidencia(formData: FormData) {
  const session = await requireSession();

  const documentoId = String(formData.get("documentoId") ?? "").trim();
  const alvo = String(formData.get("alvo") ?? "").trim(); // "tipo:id"
  const [entidadeTipo, entidadeId] = alvo.split(":");

  if (!documentoId || !entidadeTipo || !entidadeId) {
    redirect("/evidencias?erro=campos_invalidos");
  }

  const documento = await getOwnedDocumento(documentoId, session.empresaId);
  if (!documento) redirect("/evidencias?erro=nao_encontrado");

  const entidadeExiste =
    entidadeTipo === "usina"
      ? await getOwnedUsina(entidadeId, session.empresaId)
      : entidadeTipo === "fazenda"
        ? await getOwnedFazenda(entidadeId, session.empresaId)
        : entidadeTipo === "safra"
          ? await getOwnedSafra(entidadeId, session.empresaId)
          : null;

  if (!entidadeExiste) redirect("/evidencias?erro=nao_encontrado");

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

  const [evidencia] = await db
    .select()
    .from(evidencias)
    .where(and(eq(evidencias.id, id), eq(evidencias.empresaId, session.empresaId)))
    .limit(1);
  if (!evidencia) redirect("/evidencias?erro=nao_encontrado");
  if (status !== "aprovado" && status !== "rejeitado") redirect("/evidencias?erro=campos_invalidos");

  await db
    .update(evidencias)
    .set({ status })
    .where(and(eq(evidencias.id, id), eq(evidencias.empresaId, session.empresaId)));

  await registrarAuditoria({
    empresaId: session.empresaId,
    usuarioId: session.usuarioId,
    entidade: "evidencias",
    entidadeId: id,
    acao: status === "aprovado" ? "aprovou" : "rejeitou",
  });

  revalidatePath("/evidencias");
  revalidatePath("/auditoria");
}

export async function excluirEvidencia(formData: FormData) {
  const session = await requireSession();
  const id = String(formData.get("id") ?? "");

  const [evidencia] = await db
    .select()
    .from(evidencias)
    .where(and(eq(evidencias.id, id), eq(evidencias.empresaId, session.empresaId)))
    .limit(1);
  if (!evidencia) redirect("/evidencias?erro=nao_encontrado");

  await db.delete(evidencias).where(and(eq(evidencias.id, id), eq(evidencias.empresaId, session.empresaId)));

  await registrarAuditoria({
    empresaId: session.empresaId,
    usuarioId: session.usuarioId,
    entidade: "evidencias",
    entidadeId: id,
    acao: "excluiu",
  });

  revalidatePath("/evidencias");
}
