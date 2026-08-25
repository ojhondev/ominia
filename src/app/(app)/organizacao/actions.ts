"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/require-session";
import { registrarAuditoria } from "@/lib/audit";
import { db } from "@/db";
import { usinas, fazendas, safras } from "@/db/schema";

function numOrNull(v: FormDataEntryValue | null) {
  const s = String(v ?? "").trim();
  return s === "" ? null : s;
}

export async function criarUsina(formData: FormData) {
  const session = await requireSession();

  const nome = String(formData.get("nome") ?? "").trim();
  if (!nome) return;

  const [usina] = await db
    .insert(usinas)
    .values({
      empresaId: session.empresaId,
      nome,
      municipio: numOrNull(formData.get("municipio")),
      estado: numOrNull(formData.get("estado")),
      capacidadeProducaoTon: numOrNull(formData.get("capacidadeProducaoTon")),
      rotaProducao: numOrNull(formData.get("rotaProducao")),
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

export async function criarFazenda(formData: FormData) {
  const session = await requireSession();

  const produtor = String(formData.get("produtor") ?? "").trim();
  const propriedade = String(formData.get("propriedade") ?? "").trim();
  if (!produtor || !propriedade) return;

  const usinaId = numOrNull(formData.get("usinaId"));

  const [fazenda] = await db
    .insert(fazendas)
    .values({
      empresaId: session.empresaId,
      usinaId: usinaId ?? undefined,
      produtor,
      propriedade,
      municipio: numOrNull(formData.get("municipio")),
      estado: numOrNull(formData.get("estado")),
      car: numOrNull(formData.get("car")),
      areaHectares: numOrNull(formData.get("areaHectares")),
      tipoFornecedor: (String(formData.get("tipoFornecedor") ?? "terceiro") as
        | "proprio"
        | "terceiro"
        | "cooperativa"),
    })
    .returning();

  await registrarAuditoria({
    empresaId: session.empresaId,
    usuarioId: session.usuarioId,
    entidade: "fazendas",
    entidadeId: fazenda.id,
    acao: "criou",
    detalhes: { produtor, propriedade },
  });

  revalidatePath("/organizacao/fazendas");
  revalidatePath("/dashboard");
}

export async function criarSafra(formData: FormData) {
  const session = await requireSession();

  const nome = String(formData.get("nome") ?? "").trim();
  const usinaId = String(formData.get("usinaId") ?? "").trim();
  if (!nome || !usinaId) return;

  const [safra] = await db
    .insert(safras)
    .values({
      empresaId: session.empresaId,
      usinaId,
      nome,
      dataInicio: numOrNull(formData.get("dataInicio")),
      dataFim: numOrNull(formData.get("dataFim")),
      areaColhidaHectares: numOrNull(formData.get("areaColhidaHectares")),
      producaoToneladas: numOrNull(formData.get("producaoToneladas")),
    })
    .returning();

  await registrarAuditoria({
    empresaId: session.empresaId,
    usuarioId: session.usuarioId,
    entidade: "safras",
    entidadeId: safra.id,
    acao: "criou",
    detalhes: { nome },
  });

  revalidatePath("/organizacao/safras");
  revalidatePath("/dashboard");
}
