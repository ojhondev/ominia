"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/require-session";
import { registrarAuditoria } from "@/lib/audit";
import { db } from "@/db";
import { calculos, indicadores } from "@/db/schema";
import { ensureRenovaBioVersao } from "@/lib/seed/metodologias";

export async function calcularCbio(formData: FormData) {
  const session = await requireSession();

  const usinaId = String(formData.get("usinaId") ?? "").trim();
  const safraId = String(formData.get("safraId") ?? "").trim() || undefined;
  const ciBiocombustivel = Number(formData.get("ciBiocombustivel"));
  const ciFossil = Number(formData.get("ciFossil"));
  const elegibilidade = Number(formData.get("elegibilidade"));
  const massaEspecifica = Number(formData.get("massaEspecifica"));
  const pci = Number(formData.get("pci"));
  const volume = Number(formData.get("volume"));

  if (
    !usinaId ||
    [ciBiocombustivel, ciFossil, elegibilidade, massaEspecifica, pci, volume].some((n) => Number.isNaN(n))
  ) {
    return;
  }

  // Fórmulas oficiais — ANP, Informe Técnico nº 02/SBQ (ver PRD §8).
  const neea = ciFossil - ciBiocombustivel;
  const fatorCbio = neea * (elegibilidade / 100) * massaEspecifica * pci * 1e-6;
  const quantidadeCbio = volume * fatorCbio;

  const versao = await ensureRenovaBioVersao();
  const indicadoresVersao = await db.select().from(indicadores).where(eq(indicadores.versaoMetodologiaId, versao.id));
  const porCodigo = Object.fromEntries(indicadoresVersao.map((i) => [i.codigo, i]));

  const inputsComuns = { ciBiocombustivel, ciFossil, elegibilidade, massaEspecifica, pci, volume };

  const linhas: { codigo: "NEEA" | "CBIO_FATOR" | "CBIO_QTD"; resultado: number; unidade: string }[] = [
    { codigo: "NEEA", resultado: neea, unidade: "gCO2eq/MJ" },
    { codigo: "CBIO_FATOR", resultado: fatorCbio, unidade: "CBIO/m³" },
    { codigo: "CBIO_QTD", resultado: quantidadeCbio, unidade: "CBIO" },
  ];

  for (const linha of linhas) {
    const indicador = porCodigo[linha.codigo];
    if (!indicador) continue;
    const [calculo] = await db
      .insert(calculos)
      .values({
        empresaId: session.empresaId,
        usinaId,
        safraId,
        indicadorId: indicador.id,
        versaoMetodologiaId: versao.id,
        inputs: inputsComuns,
        resultado: String(linha.resultado),
        unidadeResultado: linha.unidade,
        calculadoPor: session.usuarioId,
      })
      .returning();

    await registrarAuditoria({
      empresaId: session.empresaId,
      usuarioId: session.usuarioId,
      entidade: "calculos",
      entidadeId: calculo.id,
      acao: "calculou",
      detalhes: { indicador: linha.codigo, resultado: linha.resultado, versaoMetodologia: versao.versao },
    });
  }

  revalidatePath("/renovabio");
  revalidatePath("/dashboard");
}
