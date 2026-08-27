"use server";

import { createHash, randomBytes } from "crypto";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob";
import { requireAdmin } from "@/lib/auth/require-session";
import { registrarAuditoria } from "@/lib/audit";
import { getOwnedCalculo, getOwnedRelatorio } from "@/lib/ownership";
import { getRelatorioDetalhado } from "@/lib/queries/relatorios";
import { CONSENTIMENTOS_RELATORIO } from "@/lib/consentimentos-relatorio";
import { gerarSeloPng } from "@/lib/selo";
import { getSiteUrl } from "@/lib/site-url";
import { db } from "@/db";
import { calculos, indicadores, usinas, relatoriosEmissao } from "@/db/schema";

function gerarSlugPublico() {
  return randomBytes(9).toString("base64url");
}

export async function criarRelatorio(formData: FormData) {
  const session = await requireAdmin();
  const calculoId = String(formData.get("calculoId") ?? "").trim();
  if (!calculoId) redirect("/relatorios?erro=campos_invalidos");

  const calculo = await getOwnedCalculo(calculoId, session.empresaId);
  if (!calculo) redirect("/relatorios?erro=nao_encontrado");

  const [detalhe] = await db
    .select({ indicadorNome: indicadores.nome, usinaNome: usinas.nome })
    .from(calculos)
    .innerJoin(indicadores, eq(calculos.indicadorId, indicadores.id))
    .leftJoin(usinas, eq(calculos.usinaId, usinas.id))
    .where(eq(calculos.id, calculoId))
    .limit(1);

  const titulo = detalhe
    ? `${detalhe.indicadorNome}${detalhe.usinaNome ? ` — ${detalhe.usinaNome}` : ""}`
    : "Relatório de emissão";

  let novo;
  try {
    [novo] = await db
      .insert(relatoriosEmissao)
      .values({
        empresaId: session.empresaId,
        calculoId,
        slugPublico: gerarSlugPublico(),
        titulo,
        status: "rascunho",
        criadoPor: session.usuarioId,
      })
      .returning();
  } catch {
    redirect("/relatorios?erro=relatorio_ja_existe");
  }

  await registrarAuditoria({
    empresaId: session.empresaId,
    usuarioId: session.usuarioId,
    entidade: "relatorios_emissao",
    entidadeId: novo.id,
    acao: "criou_rascunho",
  });

  revalidatePath("/relatorios");
  redirect(`/relatorios/${novo.id}`);
}

export async function atualizarRascunho(formData: FormData) {
  const session = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const titulo = String(formData.get("titulo") ?? "").trim();
  const notas = String(formData.get("notas") ?? "").trim() || null;

  const relatorio = await getOwnedRelatorio(id, session.empresaId);
  if (!relatorio) redirect("/relatorios?erro=nao_encontrado");
  if (relatorio.status === "publicado") redirect(`/relatorios/${id}?erro=relatorio_publicado`);
  if (!titulo) redirect(`/relatorios/${id}?erro=campos_invalidos`);

  await db
    .update(relatoriosEmissao)
    .set({ titulo, notas })
    .where(and(eq(relatoriosEmissao.id, id), eq(relatoriosEmissao.empresaId, session.empresaId)));

  revalidatePath(`/relatorios/${id}`);
  revalidatePath("/relatorios");
}

export async function excluirRascunho(formData: FormData) {
  const session = await requireAdmin();
  const id = String(formData.get("id") ?? "");

  const relatorio = await getOwnedRelatorio(id, session.empresaId);
  if (!relatorio) redirect("/relatorios?erro=nao_encontrado");
  if (relatorio.status === "publicado") redirect(`/relatorios/${id}?erro=relatorio_publicado`);

  await db.delete(relatoriosEmissao).where(and(eq(relatoriosEmissao.id, id), eq(relatoriosEmissao.empresaId, session.empresaId)));

  await registrarAuditoria({
    empresaId: session.empresaId,
    usuarioId: session.usuarioId,
    entidade: "relatorios_emissao",
    entidadeId: id,
    acao: "excluiu_rascunho",
  });

  revalidatePath("/relatorios");
  redirect("/relatorios");
}

export async function publicarRelatorio(formData: FormData) {
  const session = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const consentimentosRaw = String(formData.get("consentimentos") ?? "");

  const relatorio = await getOwnedRelatorio(id, session.empresaId);
  if (!relatorio) redirect("/relatorios?erro=nao_encontrado");
  if (relatorio.status === "publicado") redirect(`/relatorios/${id}?erro=relatorio_publicado`);

  let chavesAceitas: string[];
  try {
    chavesAceitas = JSON.parse(consentimentosRaw);
  } catch {
    redirect(`/relatorios/${id}?erro=consentimentos_incompletos`);
  }

  const chavesEsperadas = CONSENTIMENTOS_RELATORIO.map((c) => c.chave);
  const todasConfirmadas =
    Array.isArray(chavesAceitas) && chavesEsperadas.every((chave) => chavesAceitas.includes(chave));
  if (!todasConfirmadas) redirect(`/relatorios/${id}?erro=consentimentos_incompletos`);

  const detalhe = await getRelatorioDetalhado(id, session.empresaId);
  if (!detalhe) redirect("/relatorios?erro=nao_encontrado");

  const publicadoEm = new Date();
  const payloadHash = {
    titulo: detalhe.titulo,
    notas: detalhe.notas,
    indicadorNome: detalhe.indicadorNome,
    metodologiaNome: detalhe.metodologiaNome,
    versao: detalhe.versao,
    resultado: detalhe.calculoResultado,
    unidade: detalhe.calculoUnidade,
    inputs: detalhe.calculoInputs,
    usinaNome: detalhe.usinaNome,
    safraNome: detalhe.safraNome,
    calculoEm: detalhe.calculoEm,
    publicadoEm: publicadoEm.toISOString(),
  };
  const hashConteudo = createHash("sha256").update(JSON.stringify(payloadHash)).digest("hex");

  const urlPublica = `${getSiteUrl()}/registro/${relatorio.slugPublico}`;

  let seloUrl: string;
  try {
    const seloBuffer = await gerarSeloPng(urlPublica, relatorio.slugPublico);
    const blob = await put(`selos/${session.empresaId}/${relatorio.slugPublico}.png`, seloBuffer, {
      access: "public",
      contentType: "image/png",
    });
    seloUrl = blob.url;
  } catch {
    redirect(`/relatorios/${id}?erro=falha_upload`);
  }

  const consentimentosRegistrados = chavesAceitas.map((chave) => ({
    chave,
    confirmadoPor: session.usuarioId,
    confirmadoEm: publicadoEm.toISOString(),
  }));

  await db
    .update(relatoriosEmissao)
    .set({
      status: "publicado",
      hashConteudo,
      seloUrl,
      consentimentos: consentimentosRegistrados,
      publicadoPor: session.usuarioId,
      publicadoEm,
    })
    .where(and(eq(relatoriosEmissao.id, id), eq(relatoriosEmissao.empresaId, session.empresaId)));

  await registrarAuditoria({
    empresaId: session.empresaId,
    usuarioId: session.usuarioId,
    entidade: "relatorios_emissao",
    entidadeId: id,
    acao: "publicou",
    detalhes: { slugPublico: relatorio.slugPublico, hashConteudo },
  });

  revalidatePath(`/relatorios/${id}`);
  revalidatePath("/relatorios");
}
