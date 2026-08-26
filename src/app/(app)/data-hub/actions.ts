"use server";

import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/require-session";
import { registrarAuditoria } from "@/lib/audit";
import { getOwnedUsina, getOwnedFazenda, getOwnedSafra, getOwnedRegistro } from "@/lib/ownership";
import { db } from "@/db";
import { registrosAtividade } from "@/db/schema";

const CATEGORIAS = ["agricola", "industrial", "logistica", "social", "economico"] as const;

function orNull(v: FormDataEntryValue | null) {
  const s = String(v ?? "").trim();
  return s === "" ? null : s;
}

export async function criarRegistro(formData: FormData) {
  const session = await requireSession();

  const usinaId = String(formData.get("usinaId") ?? "").trim();
  const categoria = String(formData.get("categoria") ?? "").trim();
  const tipo = String(formData.get("tipo") ?? "").trim();
  const quantidadeRaw = String(formData.get("quantidade") ?? "").trim();
  const unidade = String(formData.get("unidade") ?? "").trim();
  const dataReferencia = String(formData.get("dataReferencia") ?? "").trim();
  const fazendaId = orNull(formData.get("fazendaId"));
  const safraId = orNull(formData.get("safraId"));

  const quantidade = Number(quantidadeRaw);

  if (
    !usinaId ||
    !(CATEGORIAS as readonly string[]).includes(categoria) ||
    !tipo ||
    !unidade ||
    !dataReferencia ||
    Number.isNaN(quantidade) ||
    quantidade <= 0
  ) {
    redirect("/data-hub?erro=campos_invalidos");
  }

  const usina = await getOwnedUsina(usinaId, session.empresaId);
  if (!usina) redirect("/data-hub?erro=nao_encontrado");

  if (fazendaId && !(await getOwnedFazenda(fazendaId, session.empresaId))) {
    redirect("/data-hub?erro=nao_encontrado");
  }
  if (safraId && !(await getOwnedSafra(safraId, session.empresaId))) {
    redirect("/data-hub?erro=nao_encontrado");
  }

  const [registro] = await db
    .insert(registrosAtividade)
    .values({
      empresaId: session.empresaId,
      usinaId,
      fazendaId: fazendaId ?? undefined,
      safraId: safraId ?? undefined,
      categoria: categoria as (typeof CATEGORIAS)[number],
      tipo,
      quantidade: quantidadeRaw,
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
    detalhes: { categoria, tipo, quantidade: quantidadeRaw, unidade },
  });

  revalidatePath("/data-hub");
  revalidatePath("/dashboard");
}

export async function validarRegistro(formData: FormData) {
  const session = await requireSession();
  const id = String(formData.get("id") ?? "");

  const registro = await getOwnedRegistro(id, session.empresaId);
  if (!registro) redirect("/data-hub?erro=nao_encontrado");

  await db
    .update(registrosAtividade)
    .set({ status: "validado" })
    .where(and(eq(registrosAtividade.id, id), eq(registrosAtividade.empresaId, session.empresaId)));

  await registrarAuditoria({
    empresaId: session.empresaId,
    usuarioId: session.usuarioId,
    entidade: "registros_atividade",
    entidadeId: id,
    acao: "validou",
  });

  revalidatePath("/data-hub");
}

export async function excluirRegistro(formData: FormData) {
  const session = await requireSession();
  const id = String(formData.get("id") ?? "");

  const registro = await getOwnedRegistro(id, session.empresaId);
  if (!registro) redirect("/data-hub?erro=nao_encontrado");

  await db
    .delete(registrosAtividade)
    .where(and(eq(registrosAtividade.id, id), eq(registrosAtividade.empresaId, session.empresaId)));

  await registrarAuditoria({
    empresaId: session.empresaId,
    usuarioId: session.usuarioId,
    entidade: "registros_atividade",
    entidadeId: id,
    acao: "excluiu",
  });

  revalidatePath("/data-hub");
  revalidatePath("/dashboard");
}
