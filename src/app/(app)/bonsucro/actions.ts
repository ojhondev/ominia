"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/require-session";
import { registrarAuditoria } from "@/lib/audit";
import { db } from "@/db";
import { calculos, indicadores, safras, resultadosCompliance } from "@/db/schema";
import { ensureBonsucroVersao } from "@/lib/seed/metodologias";

async function indicadorPorCodigo(versaoId: string, codigo: string) {
  const [indicador] = await db
    .select()
    .from(indicadores)
    .where(and(eq(indicadores.versaoMetodologiaId, versaoId), eq(indicadores.codigo, codigo)))
    .limit(1);
  return indicador;
}

export async function calcularProdutividade(formData: FormData) {
  const session = await requireSession();
  const safraId = String(formData.get("safraId") ?? "").trim();
  if (!safraId) return;

  const [safra] = await db.select().from(safras).where(eq(safras.id, safraId)).limit(1);
  if (!safra || !safra.producaoToneladas || !safra.areaColhidaHectares) return;

  const resultado = Number(safra.producaoToneladas) / Number(safra.areaColhidaHectares);
  const versao = await ensureBonsucroVersao();
  const indicador = await indicadorPorCodigo(versao.id, "BNS01_PRODUTIVIDADE");
  if (!indicador) return;

  const [calculo] = await db
    .insert(calculos)
    .values({
      empresaId: session.empresaId,
      usinaId: safra.usinaId,
      safraId: safra.id,
      indicadorId: indicador.id,
      versaoMetodologiaId: versao.id,
      inputs: { producaoToneladas: safra.producaoToneladas, areaColhidaHectares: safra.areaColhidaHectares },
      resultado: String(resultado),
      unidadeResultado: "t cana/ha",
      calculadoPor: session.usuarioId,
    })
    .returning();

  await registrarAuditoria({
    empresaId: session.empresaId,
    usuarioId: session.usuarioId,
    entidade: "calculos",
    entidadeId: calculo.id,
    acao: "calculou",
    detalhes: { indicador: "BNS01_PRODUTIVIDADE", resultado },
  });

  revalidatePath("/bonsucro");
  revalidatePath("/dashboard");
}

export async function calcularProdutividadeAgua(formData: FormData) {
  const session = await requireSession();
  const safraId = String(formData.get("safraId") ?? "").trim();
  const aguaConsumidaM3 = Number(formData.get("aguaConsumidaM3"));
  if (!safraId || Number.isNaN(aguaConsumidaM3) || aguaConsumidaM3 <= 0) return;

  const [safra] = await db.select().from(safras).where(eq(safras.id, safraId)).limit(1);
  if (!safra || !safra.producaoToneladas) return;

  const resultado = Number(safra.producaoToneladas) / aguaConsumidaM3;
  const versao = await ensureBonsucroVersao();
  const indicador = await indicadorPorCodigo(versao.id, "BNS03_AGUA");
  if (!indicador) return;

  const [calculo] = await db
    .insert(calculos)
    .values({
      empresaId: session.empresaId,
      usinaId: safra.usinaId,
      safraId: safra.id,
      indicadorId: indicador.id,
      versaoMetodologiaId: versao.id,
      inputs: { producaoToneladas: safra.producaoToneladas, aguaConsumidaM3 },
      resultado: String(resultado),
      unidadeResultado: "t produto/m³",
      calculadoPor: session.usuarioId,
    })
    .returning();

  await registrarAuditoria({
    empresaId: session.empresaId,
    usuarioId: session.usuarioId,
    entidade: "calculos",
    entidadeId: calculo.id,
    acao: "calculou",
    detalhes: { indicador: "BNS03_AGUA", resultado },
  });

  revalidatePath("/bonsucro");
  revalidatePath("/dashboard");
}

export async function atualizarStatusRequisito(formData: FormData) {
  const session = await requireSession();
  const requisitoId = String(formData.get("requisitoId") ?? "").trim();
  const usinaId = String(formData.get("usinaId") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim() as
    | "conforme"
    | "atencao"
    | "nao_conforme"
    | "sem_dados";
  if (!requisitoId || !usinaId || !status) return;

  const [existente] = await db
    .select()
    .from(resultadosCompliance)
    .where(and(eq(resultadosCompliance.requisitoId, requisitoId), eq(resultadosCompliance.usinaId, usinaId)))
    .limit(1);

  if (existente) {
    await db.update(resultadosCompliance).set({ status, atualizadoEm: new Date() }).where(eq(resultadosCompliance.id, existente.id));
  } else {
    await db.insert(resultadosCompliance).values({
      empresaId: session.empresaId,
      usinaId,
      requisitoId,
      status,
    });
  }

  await registrarAuditoria({
    empresaId: session.empresaId,
    usuarioId: session.usuarioId,
    entidade: "resultados_compliance",
    entidadeId: requisitoId,
    acao: "atualizou_status",
    detalhes: { usinaId, status },
  });

  revalidatePath("/bonsucro");
  revalidatePath("/auditoria");
  revalidatePath("/dashboard");
}
