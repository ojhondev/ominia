"use server";

import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/require-session";
import { registrarAuditoria } from "@/lib/audit";
import { getOwnedRegistro, getUsableFator, getOwnedFator } from "@/lib/ownership";
import { db } from "@/db";
import { fatoresEmissao, calculos, indicadores } from "@/db/schema";
import { ensureGhgVersao } from "@/lib/seed/metodologias";
import { unidadeSaidaFator } from "@/lib/queries/ghg";

function validarFatorForm(formData: FormData) {
  const nome = String(formData.get("nome") ?? "").trim();
  const categoria = String(formData.get("categoria") ?? "").trim();
  const valorRaw = String(formData.get("valor") ?? "").trim();
  const unidade = String(formData.get("unidade") ?? "").trim();
  const fonte = String(formData.get("fonte") ?? "").trim();
  const versao = String(formData.get("versao") ?? "").trim();
  const validoDe = String(formData.get("validoDe") ?? "").trim();
  const valor = Number(valorRaw);

  if (!nome || !categoria || !unidade || !fonte || !versao || !validoDe || Number.isNaN(valor) || valor <= 0) {
    redirect("/ghg?erro=campos_invalidos");
  }

  return { nome, categoria, valor: valorRaw, unidade, fonte, versao, validoDe };
}

export async function criarFator(formData: FormData) {
  const session = await requireSession();
  const dados = validarFatorForm(formData);

  const [fator] = await db
    .insert(fatoresEmissao)
    .values({ empresaId: session.empresaId, ...dados })
    .returning();

  await registrarAuditoria({
    empresaId: session.empresaId,
    usuarioId: session.usuarioId,
    entidade: "fatores_emissao",
    entidadeId: fator.id,
    acao: "criou",
    detalhes: { nome: dados.nome, valor: dados.valor, unidade: dados.unidade },
  });

  revalidatePath("/ghg");
}

export async function editarFator(formData: FormData) {
  const session = await requireSession();
  const id = String(formData.get("id") ?? "");

  const existente = await getOwnedFator(id, session.empresaId);
  if (!existente) redirect("/ghg?erro=nao_encontrado");

  const dados = validarFatorForm(formData);

  await db
    .update(fatoresEmissao)
    .set(dados)
    .where(and(eq(fatoresEmissao.id, id), eq(fatoresEmissao.empresaId, session.empresaId)));

  await registrarAuditoria({
    empresaId: session.empresaId,
    usuarioId: session.usuarioId,
    entidade: "fatores_emissao",
    entidadeId: id,
    acao: "atualizou",
  });

  revalidatePath("/ghg");
}

export async function excluirFator(formData: FormData) {
  const session = await requireSession();
  const id = String(formData.get("id") ?? "");

  const existente = await getOwnedFator(id, session.empresaId);
  if (!existente) redirect("/ghg?erro=nao_encontrado");

  await db.delete(fatoresEmissao).where(and(eq(fatoresEmissao.id, id), eq(fatoresEmissao.empresaId, session.empresaId)));

  await registrarAuditoria({
    empresaId: session.empresaId,
    usuarioId: session.usuarioId,
    entidade: "fatores_emissao",
    entidadeId: id,
    acao: "excluiu",
  });

  revalidatePath("/ghg");
}

export async function calcularEmissao(formData: FormData) {
  const session = await requireSession();

  const registroId = String(formData.get("registroId") ?? "").trim();
  const fatorId = String(formData.get("fatorId") ?? "").trim();
  if (!registroId || !fatorId) redirect("/ghg?erro=campos_invalidos");

  const registro = await getOwnedRegistro(registroId, session.empresaId);
  if (!registro) redirect("/ghg?erro=nao_encontrado");

  const fator = await getUsableFator(fatorId, session.empresaId);
  if (!fator) redirect("/ghg?erro=nao_encontrado");

  const resultado = Number(registro.quantidade) * Number(fator.valor);
  const versao = await ensureGhgVersao();
  const [indicador] = await db
    .select()
    .from(indicadores)
    .where(eq(indicadores.versaoMetodologiaId, versao.id))
    .limit(1);

  const [calculo] = await db
    .insert(calculos)
    .values({
      empresaId: session.empresaId,
      usinaId: registro.usinaId,
      safraId: registro.safraId ?? undefined,
      indicadorId: indicador.id,
      versaoMetodologiaId: versao.id,
      inputs: { registroId, fatorId, quantidade: registro.quantidade, fatorValor: fator.valor, fatorUnidade: fator.unidade },
      resultado: String(resultado),
      unidadeResultado: unidadeSaidaFator(fator.unidade),
      calculadoPor: session.usuarioId,
    })
    .returning();

  await registrarAuditoria({
    empresaId: session.empresaId,
    usuarioId: session.usuarioId,
    entidade: "calculos",
    entidadeId: calculo.id,
    acao: "calculou",
    detalhes: { indicador: "EMISSAO", resultado },
  });

  revalidatePath("/ghg");
  revalidatePath("/dashboard");
}
