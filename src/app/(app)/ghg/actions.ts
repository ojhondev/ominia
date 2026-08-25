"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/require-session";
import { registrarAuditoria } from "@/lib/audit";
import { db } from "@/db";
import { fatoresEmissao, registrosAtividade, calculos, indicadores } from "@/db/schema";
import { ensureGhgVersao } from "@/lib/seed/metodologias";
import { unidadeSaidaFator } from "@/lib/queries/ghg";

export async function criarFator(formData: FormData) {
  const session = await requireSession();

  const nome = String(formData.get("nome") ?? "").trim();
  const categoria = String(formData.get("categoria") ?? "").trim();
  const valor = String(formData.get("valor") ?? "").trim();
  const unidade = String(formData.get("unidade") ?? "").trim();
  const fonte = String(formData.get("fonte") ?? "").trim();
  const versao = String(formData.get("versao") ?? "").trim();
  const validoDe = String(formData.get("validoDe") ?? "").trim();

  if (!nome || !categoria || !valor || !unidade || !fonte || !versao || !validoDe) return;

  const [fator] = await db
    .insert(fatoresEmissao)
    .values({ nome, categoria, valor, unidade, fonte, versao, validoDe })
    .returning();

  await registrarAuditoria({
    empresaId: session.empresaId,
    usuarioId: session.usuarioId,
    entidade: "fatores_emissao",
    entidadeId: fator.id,
    acao: "criou",
    detalhes: { nome, valor, unidade },
  });

  revalidatePath("/ghg");
}

export async function calcularEmissao(formData: FormData) {
  const session = await requireSession();

  const registroId = String(formData.get("registroId") ?? "").trim();
  const fatorId = String(formData.get("fatorId") ?? "").trim();
  if (!registroId || !fatorId) return;

  const [registro] = await db.select().from(registrosAtividade).where(eq(registrosAtividade.id, registroId)).limit(1);
  const [fator] = await db.select().from(fatoresEmissao).where(eq(fatoresEmissao.id, fatorId)).limit(1);
  if (!registro || !fator) return;

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
