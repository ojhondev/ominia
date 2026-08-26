"use server";

import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/require-session";
import { registrarAuditoria } from "@/lib/audit";
import { getOwnedSafra, getOwnedUsina } from "@/lib/ownership";
import { somaQuantidadePorTipo } from "@/lib/queries/data-hub";
import { emissoesDaSafra } from "@/lib/queries/bonsucro";
import { listFazendas } from "@/lib/queries/organizacao";
import { db } from "@/db";
import { calculos, indicadores, resultadosCompliance, requisitos } from "@/db/schema";
import { ensureBonsucroVersao } from "@/lib/seed/metodologias";

async function indicadorPorCodigo(versaoId: string, codigo: string) {
  const [indicador] = await db
    .select()
    .from(indicadores)
    .where(and(eq(indicadores.versaoMetodologiaId, versaoId), eq(indicadores.codigo, codigo)))
    .limit(1);
  return indicador;
}

async function salvarCalculo(params: {
  session: { empresaId: string; usuarioId: string };
  usinaId: string;
  safraId?: string;
  codigo: string;
  resultado: number;
  unidade: string;
  inputs: Record<string, unknown>;
}) {
  const versao = await ensureBonsucroVersao();
  const indicador = await indicadorPorCodigo(versao.id, params.codigo);
  if (!indicador) redirect("/bonsucro?erro=nao_encontrado");

  const [calculo] = await db
    .insert(calculos)
    .values({
      empresaId: params.session.empresaId,
      usinaId: params.usinaId,
      safraId: params.safraId,
      indicadorId: indicador.id,
      versaoMetodologiaId: versao.id,
      inputs: params.inputs,
      resultado: String(params.resultado),
      unidadeResultado: params.unidade,
      calculadoPor: params.session.usuarioId,
    })
    .returning();

  await registrarAuditoria({
    empresaId: params.session.empresaId,
    usuarioId: params.session.usuarioId,
    entidade: "calculos",
    entidadeId: calculo.id,
    acao: "calculou",
    detalhes: { indicador: params.codigo, resultado: params.resultado },
  });
}

// ---------------------------------------------------------------------------
// BNS-01 · Produtividade agrícola
// ---------------------------------------------------------------------------

export async function calcularProdutividade(formData: FormData) {
  const session = await requireSession();
  const safraId = String(formData.get("safraId") ?? "").trim();

  const safra = await getOwnedSafra(safraId, session.empresaId);
  if (!safra) redirect("/bonsucro?erro=nao_encontrado");
  if (!safra.producaoToneladas || !safra.areaColhidaHectares) redirect("/bonsucro?erro=campos_invalidos");

  const resultado = Number(safra.producaoToneladas) / Number(safra.areaColhidaHectares);
  await salvarCalculo({
    session,
    usinaId: safra.usinaId,
    safraId: safra.id,
    codigo: "BNS01_PRODUTIVIDADE",
    resultado,
    unidade: "t cana/ha",
    inputs: { producaoToneladas: safra.producaoToneladas, areaColhidaHectares: safra.areaColhidaHectares },
  });

  revalidatePath("/bonsucro");
  revalidatePath("/dashboard");
}

// ---------------------------------------------------------------------------
// BNS-02 · Solo (calcário + gesso aplicados por hectare)
// ---------------------------------------------------------------------------

export async function calcularSolo(formData: FormData) {
  const session = await requireSession();
  const safraId = String(formData.get("safraId") ?? "").trim();

  const safra = await getOwnedSafra(safraId, session.empresaId);
  if (!safra) redirect("/bonsucro?erro=nao_encontrado");
  if (!safra.areaColhidaHectares) redirect("/bonsucro?erro=campos_invalidos");

  const totalCorretivos = await somaQuantidadePorTipo(session.empresaId, safraId, ["calcario", "gesso"]);
  if (totalCorretivos <= 0) redirect("/bonsucro?erro=campos_invalidos");

  const resultado = totalCorretivos / Number(safra.areaColhidaHectares);
  await salvarCalculo({
    session,
    usinaId: safra.usinaId,
    safraId: safra.id,
    codigo: "BNS02_SOLO",
    resultado,
    unidade: "kg/ha",
    inputs: { totalCorretivos, areaColhidaHectares: safra.areaColhidaHectares },
  });

  revalidatePath("/bonsucro");
}

// ---------------------------------------------------------------------------
// BNS-03 · Água
// ---------------------------------------------------------------------------

export async function calcularProdutividadeAgua(formData: FormData) {
  const session = await requireSession();
  const safraId = String(formData.get("safraId") ?? "").trim();
  const aguaConsumidaM3 = Number(formData.get("aguaConsumidaM3"));

  const safra = await getOwnedSafra(safraId, session.empresaId);
  if (!safra) redirect("/bonsucro?erro=nao_encontrado");
  if (!safra.producaoToneladas || Number.isNaN(aguaConsumidaM3) || aguaConsumidaM3 <= 0) {
    redirect("/bonsucro?erro=campos_invalidos");
  }

  const resultado = Number(safra.producaoToneladas) / aguaConsumidaM3;
  await salvarCalculo({
    session,
    usinaId: safra.usinaId,
    safraId: safra.id,
    codigo: "BNS03_AGUA",
    resultado,
    unidade: "t produto/m³",
    inputs: { producaoToneladas: safra.producaoToneladas, aguaConsumidaM3 },
  });

  revalidatePath("/bonsucro");
  revalidatePath("/dashboard");
}

// ---------------------------------------------------------------------------
// BNS-04 · Biodiversidade (% de área preservada nas fazendas da usina)
// ---------------------------------------------------------------------------

export async function calcularBiodiversidade(formData: FormData) {
  const session = await requireSession();
  const usinaId = String(formData.get("usinaId") ?? "").trim();

  const usina = await getOwnedUsina(usinaId, session.empresaId);
  if (!usina) redirect("/bonsucro?erro=nao_encontrado");

  const fazendas = (await listFazendas(session.empresaId)).filter(
    (f) => f.usinaId === usinaId && f.areaHectares && f.areaPreservadaHectares,
  );
  if (fazendas.length === 0) redirect("/bonsucro?erro=campos_invalidos");

  const percentuais = fazendas.map((f) => Number(f.areaPreservadaHectares) / Number(f.areaHectares));
  const resultado = (percentuais.reduce((a, b) => a + b, 0) / percentuais.length) * 100;

  await salvarCalculo({
    session,
    usinaId,
    codigo: "BNS04_BIODIVERSIDADE",
    resultado,
    unidade: "%",
    inputs: { fazendasConsideradas: fazendas.length },
  });

  revalidatePath("/bonsucro");
}

// ---------------------------------------------------------------------------
// BNS-05 · GHG (reutiliza o Motor GHG — soma os cálculos já feitos para a safra)
// ---------------------------------------------------------------------------

export async function calcularGhgBonsucro(formData: FormData) {
  const session = await requireSession();
  const safraId = String(formData.get("safraId") ?? "").trim();

  const safra = await getOwnedSafra(safraId, session.empresaId);
  if (!safra) redirect("/bonsucro?erro=nao_encontrado");

  const emissoes = await emissoesDaSafra(session.empresaId, safraId);
  if (!emissoes) redirect("/bonsucro?erro=campos_invalidos");

  await salvarCalculo({
    session,
    usinaId: safra.usinaId,
    safraId: safra.id,
    codigo: "BNS05_GHG",
    resultado: emissoes.total,
    unidade: emissoes.unidade,
    inputs: { origem: "soma dos cálculos EMISSAO do Motor GHG para esta safra" },
  });

  revalidatePath("/bonsucro");
}

// ---------------------------------------------------------------------------
// BNS-06 · Insumos (fertilizantes + defensivos por hectare)
// ---------------------------------------------------------------------------

export async function calcularInsumos(formData: FormData) {
  const session = await requireSession();
  const safraId = String(formData.get("safraId") ?? "").trim();

  const safra = await getOwnedSafra(safraId, session.empresaId);
  if (!safra) redirect("/bonsucro?erro=nao_encontrado");
  if (!safra.areaColhidaHectares) redirect("/bonsucro?erro=campos_invalidos");

  const totalInsumos = await somaQuantidadePorTipo(session.empresaId, safraId, [
    "fertilizante_n",
    "fertilizante_p",
    "fertilizante_k",
    "defensivo",
  ]);
  if (totalInsumos <= 0) redirect("/bonsucro?erro=campos_invalidos");

  const resultado = totalInsumos / Number(safra.areaColhidaHectares);
  await salvarCalculo({
    session,
    usinaId: safra.usinaId,
    safraId: safra.id,
    codigo: "BNS06_INSUMOS",
    resultado,
    unidade: "kg/ha",
    inputs: { totalInsumos, areaColhidaHectares: safra.areaColhidaHectares },
  });

  revalidatePath("/bonsucro");
}

// ---------------------------------------------------------------------------
// BNS-07 · Social — taxa de acidentes por 1000 funcionários
// ---------------------------------------------------------------------------

export async function calcularSeguranca(formData: FormData) {
  const session = await requireSession();
  const safraId = String(formData.get("safraId") ?? "").trim();

  const safra = await getOwnedSafra(safraId, session.empresaId);
  if (!safra) redirect("/bonsucro?erro=nao_encontrado");

  const funcionarios = await somaQuantidadePorTipo(session.empresaId, safraId, ["funcionarios_total"]);
  const acidentes = await somaQuantidadePorTipo(session.empresaId, safraId, ["acidentes_registrados"]);
  if (funcionarios <= 0) redirect("/bonsucro?erro=campos_invalidos");

  const resultado = (acidentes / funcionarios) * 1000;
  await salvarCalculo({
    session,
    usinaId: safra.usinaId,
    safraId: safra.id,
    codigo: "BNS07_SEGURANCA",
    resultado,
    unidade: "acidentes/1000 funcionários",
    inputs: { funcionarios, acidentes },
  });

  revalidatePath("/bonsucro");
}

// ---------------------------------------------------------------------------
// BNS-08 · Econômico — margem bruta por tonelada
// ---------------------------------------------------------------------------

export async function calcularEconomico(formData: FormData) {
  const session = await requireSession();
  const safraId = String(formData.get("safraId") ?? "").trim();

  const safra = await getOwnedSafra(safraId, session.empresaId);
  if (!safra) redirect("/bonsucro?erro=nao_encontrado");
  if (!safra.producaoToneladas) redirect("/bonsucro?erro=campos_invalidos");

  const receita = await somaQuantidadePorTipo(session.empresaId, safraId, ["receita_safra"]);
  const custo = await somaQuantidadePorTipo(session.empresaId, safraId, ["custo_producao"]);
  if (receita <= 0) redirect("/bonsucro?erro=campos_invalidos");

  const resultado = (receita - custo) / Number(safra.producaoToneladas);
  await salvarCalculo({
    session,
    usinaId: safra.usinaId,
    safraId: safra.id,
    codigo: "BNS08_MARGEM",
    resultado,
    unidade: "R$/t",
    inputs: { receita, custo, producaoToneladas: safra.producaoToneladas },
  });

  revalidatePath("/bonsucro");
}

// ---------------------------------------------------------------------------
// BNS-09 · Compliance por usina
// ---------------------------------------------------------------------------

export async function atualizarStatusRequisito(formData: FormData) {
  const session = await requireSession();
  const requisitoId = String(formData.get("requisitoId") ?? "").trim();
  const usinaId = String(formData.get("usinaId") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim() as
    | "conforme"
    | "atencao"
    | "nao_conforme"
    | "sem_dados";

  const usina = await getOwnedUsina(usinaId, session.empresaId);
  if (!usina) redirect("/bonsucro?erro=nao_encontrado");

  const [requisito] = await db.select().from(requisitos).where(eq(requisitos.id, requisitoId)).limit(1);
  if (!requisito || !["conforme", "atencao", "nao_conforme", "sem_dados"].includes(status)) {
    redirect("/bonsucro?erro=campos_invalidos");
  }

  const [existente] = await db
    .select()
    .from(resultadosCompliance)
    .where(
      and(
        eq(resultadosCompliance.requisitoId, requisitoId),
        eq(resultadosCompliance.usinaId, usinaId),
        eq(resultadosCompliance.empresaId, session.empresaId),
      ),
    )
    .limit(1);

  if (existente) {
    await db
      .update(resultadosCompliance)
      .set({ status, atualizadoEm: new Date() })
      .where(and(eq(resultadosCompliance.id, existente.id), eq(resultadosCompliance.empresaId, session.empresaId)));
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
