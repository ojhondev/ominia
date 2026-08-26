"use server";

import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/require-session";
import { registrarAuditoria } from "@/lib/audit";
import { getOwnedUsina, getOwnedFazenda, getOwnedSafra } from "@/lib/ownership";
import { db } from "@/db";
import { usinas, fazendas, safras } from "@/db/schema";

function orNull(v: FormDataEntryValue | null) {
  const s = String(v ?? "").trim();
  return s === "" ? null : s;
}

function positiveOrNull(v: FormDataEntryValue | null): string | null | "invalid" {
  const s = String(v ?? "").trim();
  if (s === "") return null;
  const n = Number(s);
  if (Number.isNaN(n) || n <= 0) return "invalid";
  return s;
}

// ---------------------------------------------------------------------------
// Usinas
// ---------------------------------------------------------------------------

export async function criarUsina(formData: FormData) {
  const session = await requireSession();
  const nome = String(formData.get("nome") ?? "").trim();
  const capacidade = positiveOrNull(formData.get("capacidadeProducaoTon"));

  if (!nome || capacidade === "invalid") {
    redirect("/organizacao?erro=campos_invalidos");
  }

  const [usina] = await db
    .insert(usinas)
    .values({
      empresaId: session.empresaId,
      nome,
      municipio: orNull(formData.get("municipio")),
      estado: orNull(formData.get("estado")),
      capacidadeProducaoTon: capacidade,
      rotaProducao: orNull(formData.get("rotaProducao")),
    })
    .returning();

  await registrarAuditoria({
    empresaId: session.empresaId,
    usuarioId: session.usuarioId,
    entidade: "usinas",
    entidadeId: usina.id,
    acao: "criou",
    detalhes: { nome },
  });

  revalidatePath("/organizacao");
  revalidatePath("/dashboard");
}

export async function editarUsina(formData: FormData) {
  const session = await requireSession();
  const id = String(formData.get("id") ?? "");
  const nome = String(formData.get("nome") ?? "").trim();
  const capacidade = positiveOrNull(formData.get("capacidadeProducaoTon"));

  const existente = await getOwnedUsina(id, session.empresaId);
  if (!existente) redirect("/organizacao?erro=nao_encontrado");
  if (!nome || capacidade === "invalid") redirect("/organizacao?erro=campos_invalidos");

  await db
    .update(usinas)
    .set({
      nome,
      municipio: orNull(formData.get("municipio")),
      estado: orNull(formData.get("estado")),
      capacidadeProducaoTon: capacidade,
      rotaProducao: orNull(formData.get("rotaProducao")),
    })
    .where(and(eq(usinas.id, id), eq(usinas.empresaId, session.empresaId)));

  await registrarAuditoria({
    empresaId: session.empresaId,
    usuarioId: session.usuarioId,
    entidade: "usinas",
    entidadeId: id,
    acao: "atualizou",
    detalhes: { nome },
  });

  revalidatePath("/organizacao");
  revalidatePath("/dashboard");
}

export async function excluirUsina(formData: FormData) {
  const session = await requireSession();
  const id = String(formData.get("id") ?? "");

  const existente = await getOwnedUsina(id, session.empresaId);
  if (!existente) redirect("/organizacao?erro=nao_encontrado");

  await db.delete(usinas).where(and(eq(usinas.id, id), eq(usinas.empresaId, session.empresaId)));

  await registrarAuditoria({
    empresaId: session.empresaId,
    usuarioId: session.usuarioId,
    entidade: "usinas",
    entidadeId: id,
    acao: "excluiu",
  });

  revalidatePath("/organizacao");
  revalidatePath("/dashboard");
}

// ---------------------------------------------------------------------------
// Fazendas
// ---------------------------------------------------------------------------

async function validarFazendaForm(formData: FormData, session: { empresaId: string }) {
  const produtor = String(formData.get("produtor") ?? "").trim();
  const propriedade = String(formData.get("propriedade") ?? "").trim();
  const area = positiveOrNull(formData.get("areaHectares"));
  const areaPreservada = positiveOrNull(formData.get("areaPreservadaHectares"));
  const usinaIdRaw = orNull(formData.get("usinaId"));

  if (!produtor || !propriedade || area === "invalid" || areaPreservada === "invalid") {
    redirect("/organizacao/fazendas?erro=campos_invalidos");
  }

  let usinaId: string | undefined;
  if (usinaIdRaw) {
    const usina = await getOwnedUsina(usinaIdRaw, session.empresaId);
    if (!usina) redirect("/organizacao/fazendas?erro=nao_encontrado");
    usinaId = usinaIdRaw;
  }

  return {
    produtor,
    propriedade,
    area,
    areaPreservada,
    usinaId,
    municipio: orNull(formData.get("municipio")),
    estado: orNull(formData.get("estado")),
    car: orNull(formData.get("car")),
    tipoFornecedor: String(formData.get("tipoFornecedor") ?? "terceiro") as "proprio" | "terceiro" | "cooperativa",
  };
}

export async function criarFazenda(formData: FormData) {
  const session = await requireSession();
  const dados = await validarFazendaForm(formData, session);

  const [fazenda] = await db
    .insert(fazendas)
    .values({
      empresaId: session.empresaId,
      usinaId: dados.usinaId,
      produtor: dados.produtor,
      propriedade: dados.propriedade,
      municipio: dados.municipio,
      estado: dados.estado,
      car: dados.car,
      areaHectares: dados.area,
      areaPreservadaHectares: dados.areaPreservada,
      tipoFornecedor: dados.tipoFornecedor,
    })
    .returning();

  await registrarAuditoria({
    empresaId: session.empresaId,
    usuarioId: session.usuarioId,
    entidade: "fazendas",
    entidadeId: fazenda.id,
    acao: "criou",
    detalhes: { produtor: dados.produtor, propriedade: dados.propriedade },
  });

  revalidatePath("/organizacao/fazendas");
  revalidatePath("/dashboard");
}

export async function editarFazenda(formData: FormData) {
  const session = await requireSession();
  const id = String(formData.get("id") ?? "");
  const existente = await getOwnedFazenda(id, session.empresaId);
  if (!existente) redirect("/organizacao/fazendas?erro=nao_encontrado");

  const dados = await validarFazendaForm(formData, session);

  await db
    .update(fazendas)
    .set({
      usinaId: dados.usinaId,
      produtor: dados.produtor,
      propriedade: dados.propriedade,
      municipio: dados.municipio,
      estado: dados.estado,
      car: dados.car,
      areaHectares: dados.area,
      areaPreservadaHectares: dados.areaPreservada,
      tipoFornecedor: dados.tipoFornecedor,
    })
    .where(and(eq(fazendas.id, id), eq(fazendas.empresaId, session.empresaId)));

  await registrarAuditoria({
    empresaId: session.empresaId,
    usuarioId: session.usuarioId,
    entidade: "fazendas",
    entidadeId: id,
    acao: "atualizou",
  });

  revalidatePath("/organizacao/fazendas");
}

export async function excluirFazenda(formData: FormData) {
  const session = await requireSession();
  const id = String(formData.get("id") ?? "");
  const existente = await getOwnedFazenda(id, session.empresaId);
  if (!existente) redirect("/organizacao/fazendas?erro=nao_encontrado");

  await db.delete(fazendas).where(and(eq(fazendas.id, id), eq(fazendas.empresaId, session.empresaId)));

  await registrarAuditoria({
    empresaId: session.empresaId,
    usuarioId: session.usuarioId,
    entidade: "fazendas",
    entidadeId: id,
    acao: "excluiu",
  });

  revalidatePath("/organizacao/fazendas");
}

// ---------------------------------------------------------------------------
// Safras
// ---------------------------------------------------------------------------

async function validarSafraForm(formData: FormData, session: { empresaId: string }) {
  const nome = String(formData.get("nome") ?? "").trim();
  const usinaId = String(formData.get("usinaId") ?? "").trim();
  const area = positiveOrNull(formData.get("areaColhidaHectares"));
  const producao = positiveOrNull(formData.get("producaoToneladas"));

  if (!nome || !usinaId || area === "invalid" || producao === "invalid") {
    redirect("/organizacao/safras?erro=campos_invalidos");
  }

  const usina = await getOwnedUsina(usinaId, session.empresaId);
  if (!usina) redirect("/organizacao/safras?erro=nao_encontrado");

  return {
    nome,
    usinaId,
    area,
    producao,
    dataInicio: orNull(formData.get("dataInicio")),
    dataFim: orNull(formData.get("dataFim")),
  };
}

export async function criarSafra(formData: FormData) {
  const session = await requireSession();
  const dados = await validarSafraForm(formData, session);

  const [safra] = await db
    .insert(safras)
    .values({
      empresaId: session.empresaId,
      usinaId: dados.usinaId,
      nome: dados.nome,
      dataInicio: dados.dataInicio,
      dataFim: dados.dataFim,
      areaColhidaHectares: dados.area,
      producaoToneladas: dados.producao,
    })
    .returning();

  await registrarAuditoria({
    empresaId: session.empresaId,
    usuarioId: session.usuarioId,
    entidade: "safras",
    entidadeId: safra.id,
    acao: "criou",
    detalhes: { nome: dados.nome },
  });

  revalidatePath("/organizacao/safras");
  revalidatePath("/dashboard");
}

export async function editarSafra(formData: FormData) {
  const session = await requireSession();
  const id = String(formData.get("id") ?? "");
  const existente = await getOwnedSafra(id, session.empresaId);
  if (!existente) redirect("/organizacao/safras?erro=nao_encontrado");

  const dados = await validarSafraForm(formData, session);

  await db
    .update(safras)
    .set({
      usinaId: dados.usinaId,
      nome: dados.nome,
      dataInicio: dados.dataInicio,
      dataFim: dados.dataFim,
      areaColhidaHectares: dados.area,
      producaoToneladas: dados.producao,
    })
    .where(and(eq(safras.id, id), eq(safras.empresaId, session.empresaId)));

  await registrarAuditoria({
    empresaId: session.empresaId,
    usuarioId: session.usuarioId,
    entidade: "safras",
    entidadeId: id,
    acao: "atualizou",
  });

  revalidatePath("/organizacao/safras");
}

export async function encerrarSafra(formData: FormData) {
  const session = await requireSession();
  const id = String(formData.get("id") ?? "");
  const existente = await getOwnedSafra(id, session.empresaId);
  if (!existente) redirect("/organizacao/safras?erro=nao_encontrado");

  await db
    .update(safras)
    .set({ encerrada: !existente.encerrada })
    .where(and(eq(safras.id, id), eq(safras.empresaId, session.empresaId)));

  await registrarAuditoria({
    empresaId: session.empresaId,
    usuarioId: session.usuarioId,
    entidade: "safras",
    entidadeId: id,
    acao: existente.encerrada ? "reabriu" : "encerrou",
  });

  revalidatePath("/organizacao/safras");
}

export async function excluirSafra(formData: FormData) {
  const session = await requireSession();
  const id = String(formData.get("id") ?? "");
  const existente = await getOwnedSafra(id, session.empresaId);
  if (!existente) redirect("/organizacao/safras?erro=nao_encontrado");

  await db.delete(safras).where(and(eq(safras.id, id), eq(safras.empresaId, session.empresaId)));

  await registrarAuditoria({
    empresaId: session.empresaId,
    usuarioId: session.usuarioId,
    entidade: "safras",
    entidadeId: id,
    acao: "excluiu",
  });

  revalidatePath("/organizacao/safras");
  revalidatePath("/dashboard");
}
