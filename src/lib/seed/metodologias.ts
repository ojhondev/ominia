import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { metodologias, versoesMetodologia, indicadores, requisitos } from "@/db/schema";

export async function ensureMetodologia(nome: string, descricao?: string) {
  const [existente] = await db.select().from(metodologias).where(eq(metodologias.nome, nome)).limit(1);
  if (existente) return existente;
  const [criada] = await db.insert(metodologias).values({ nome, descricao }).returning();
  return criada;
}

export async function ensureVersao(params: {
  metodologiaId: string;
  versao: string;
  vigenteDe: string;
  status?: "ativo" | "em_revisao" | "obsoleto";
  fonte?: string;
}) {
  const [existente] = await db
    .select()
    .from(versoesMetodologia)
    .where(and(eq(versoesMetodologia.metodologiaId, params.metodologiaId), eq(versoesMetodologia.versao, params.versao)))
    .limit(1);
  if (existente) return existente;

  const [criada] = await db
    .insert(versoesMetodologia)
    .values({
      metodologiaId: params.metodologiaId,
      versao: params.versao,
      vigenteDe: params.vigenteDe,
      status: params.status ?? "ativo",
      fonte: params.fonte,
    })
    .returning();
  return criada;
}

export async function ensureIndicador(params: {
  versaoMetodologiaId: string;
  codigo: string;
  nome: string;
  unidade?: string;
  formula?: string;
}) {
  const [existente] = await db
    .select()
    .from(indicadores)
    .where(and(eq(indicadores.versaoMetodologiaId, params.versaoMetodologiaId), eq(indicadores.codigo, params.codigo)))
    .limit(1);
  if (existente) return existente;

  const [criado] = await db
    .insert(indicadores)
    .values({
      versaoMetodologiaId: params.versaoMetodologiaId,
      codigo: params.codigo,
      nome: params.nome,
      unidade: params.unidade,
      formula: params.formula,
    })
    .returning();
  return criado;
}

export async function ensureRequisito(params: {
  versaoMetodologiaId: string;
  codigo: string;
  nome: string;
  descricao?: string;
}) {
  const [existente] = await db
    .select()
    .from(requisitos)
    .where(and(eq(requisitos.versaoMetodologiaId, params.versaoMetodologiaId), eq(requisitos.codigo, params.codigo)))
    .limit(1);
  if (existente) return existente;

  const [criado] = await db
    .insert(requisitos)
    .values({
      versaoMetodologiaId: params.versaoMetodologiaId,
      codigo: params.codigo,
      nome: params.nome,
      descricao: params.descricao,
    })
    .returning();
  return criado;
}

/** GHG Protocol — versão genérica usada pelo Carbon Engine (Módulo 04), reutilizada por BNS-05. */
export async function ensureGhgVersao() {
  const met = await ensureMetodologia("GHG Protocol", "Motor de emissões genérico — atividade × fator");
  const versao = await ensureVersao({
    metodologiaId: met.id,
    versao: "corporate-std",
    vigenteDe: "2026-01-01",
    fonte: "GHG Protocol Corporate Standard",
  });
  await ensureIndicador({
    versaoMetodologiaId: versao.id,
    codigo: "EMISSAO",
    nome: "Emissão de GEE por atividade",
    unidade: "tCO2e",
    formula: "Emissão = Dado de atividade × Fator de emissão",
  });
  return versao;
}

/** RenovaBio / ANP — versão vigente sob revisão (Resolução ANP 984/2025). */
export async function ensureRenovaBioVersao() {
  const met = await ensureMetodologia("RenovaBio", "RenovaCalc / NEEA / CBIO — ANP");
  const versao = await ensureVersao({
    metodologiaId: met.id,
    versao: "2025",
    vigenteDe: "2025-01-01",
    status: "em_revisao",
    fonte: "ANP — Resolução nº 984/2025, Informe Técnico nº 02/SBQ",
  });
  await ensureIndicador({
    versaoMetodologiaId: versao.id,
    codigo: "CI",
    nome: "Intensidade de carbono",
    unidade: "gCO2eq/MJ",
    formula: "CI = Emissões de GEE do ciclo de vida ÷ Energia do biocombustível",
  });
  await ensureIndicador({
    versaoMetodologiaId: versao.id,
    codigo: "NEEA",
    nome: "Nota de Eficiência Energético-Ambiental",
    unidade: "gCO2eq/MJ",
    formula: "NEEA = CI(fóssil substituto) − CI(biocombustível)",
  });
  await ensureIndicador({
    versaoMetodologiaId: versao.id,
    codigo: "CBIO_FATOR",
    nome: "Fator de emissão de CBIO",
    unidade: "CBIO/m³",
    formula: "f = NEEA × (f_elegível ÷ 100) × ρ × PCI × 10⁻⁶",
  });
  await ensureIndicador({
    versaoMetodologiaId: versao.id,
    codigo: "CBIO_QTD",
    nome: "Quantidade de CBIO",
    unidade: "CBIO",
    formula: "CBIO = Volume comercializado × Fator para emissão de CBIO",
  });
  return versao;
}

/** Bonsucro — Production Standard 5.2.1 / Calculator 5.2.4, vigente desde 01/01/2026. */
export async function ensureBonsucroVersao() {
  const met = await ensureMetodologia("Bonsucro", "Production Standard — certificação de sustentabilidade");
  const versao = await ensureVersao({
    metodologiaId: met.id,
    versao: "5.2.1",
    vigenteDe: "2026-01-01",
    fonte: "Bonsucro Production Standard 5.2.1 / Calculator 5.2.4",
  });

  const submodulos: { codigo: string; nome: string; descricao: string }[] = [
    { codigo: "BNS-01", nome: "Produtividade", descricao: "Produção de cana / área; produção de produto / cana processada" },
    { codigo: "BNS-02", nome: "Solo", descricao: "Análise do solo, conservação, erosão, cobertura, manejo, fertilidade" },
    { codigo: "BNS-03", nome: "Água", descricao: "Captação, consumo, irrigação, efluentes, descarga; produtividade da água" },
    { codigo: "BNS-04", nome: "Biodiversidade & Ecossistemas", descricao: "Áreas protegidas, habitats, vegetação, APP, mudança de uso da terra" },
    { codigo: "BNS-05", nome: "GHG", descricao: "Reutiliza o Carbon Engine (Módulo 04) — não cria um segundo calculador" },
    { codigo: "BNS-06", nome: "Insumos", descricao: "Fertilizantes, defensivos, combustíveis, químicos — uso real vs. parâmetro Bonsucro" },
    { codigo: "BNS-07", nome: "Social & Trabalhista", descricao: "Funcionários, terceirizados, treinamento, segurança, acidentes, jornada, direitos" },
    { codigo: "BNS-08", nome: "Econômico", descricao: "Produtividade, receita, custos, valor econômico, eficiência" },
    { codigo: "BNS-09", nome: "Compliance Bonsucro", descricao: "Requisito → Dado → Cálculo → Meta → Status → Evidência" },
  ];

  for (const sub of submodulos) {
    await ensureRequisito({ versaoMetodologiaId: versao.id, codigo: sub.codigo, nome: sub.nome, descricao: sub.descricao });
  }

  await ensureIndicador({
    versaoMetodologiaId: versao.id,
    codigo: "BNS01_PRODUTIVIDADE",
    nome: "Produtividade agrícola",
    unidade: "t cana/ha",
    formula: "Produtividade = Produção de cana ÷ Área",
  });
  await ensureIndicador({
    versaoMetodologiaId: versao.id,
    codigo: "BNS03_AGUA",
    nome: "Produtividade da água",
    unidade: "t produto/m³ água",
    formula: "Produtividade da água = Produção ÷ Água consumida",
  });
  await ensureIndicador({
    versaoMetodologiaId: versao.id,
    codigo: "BNS02_SOLO",
    nome: "Intensidade de correção de solo",
    unidade: "kg/ha",
    formula: "Correção de solo = (calcário + gesso aplicados) ÷ área colhida",
  });
  await ensureIndicador({
    versaoMetodologiaId: versao.id,
    codigo: "BNS04_BIODIVERSIDADE",
    nome: "Área preservada",
    unidade: "%",
    formula: "% preservado = média(área preservada da fazenda ÷ área total da fazenda)",
  });
  await ensureIndicador({
    versaoMetodologiaId: versao.id,
    codigo: "BNS05_GHG",
    nome: "Emissões de GEE da safra",
    unidade: "variável",
    formula: "Soma dos cálculos do Motor GHG (indicador EMISSAO) vinculados à safra",
  });
  await ensureIndicador({
    versaoMetodologiaId: versao.id,
    codigo: "BNS06_INSUMOS",
    nome: "Intensidade de uso de insumos",
    unidade: "kg/ha",
    formula: "Insumos = (fertilizantes + defensivos aplicados) ÷ área colhida",
  });
  await ensureIndicador({
    versaoMetodologiaId: versao.id,
    codigo: "BNS07_SEGURANCA",
    nome: "Taxa de acidentes",
    unidade: "acidentes/1000 funcionários",
    formula: "Taxa = (acidentes registrados ÷ funcionários totais) × 1000",
  });
  await ensureIndicador({
    versaoMetodologiaId: versao.id,
    codigo: "BNS08_MARGEM",
    nome: "Margem bruta por tonelada",
    unidade: "R$/t",
    formula: "Margem = (receita da safra − custo de produção) ÷ produção",
  });

  return versao;
}
