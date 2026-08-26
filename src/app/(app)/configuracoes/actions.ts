"use server";

import { and, eq, ne } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/require-session";
import { registrarAuditoria } from "@/lib/audit";
import { hashPassword } from "@/lib/auth/password";
import { isValidCnpj, onlyDigits } from "@/lib/cnpj";
import { db } from "@/db";
import { empresas, usuarios, usuarioPapelEnum } from "@/db/schema";

const PAPEIS = usuarioPapelEnum.enumValues;

export async function atualizarEmpresa(formData: FormData) {
  const session = await requireSession();

  const nome = String(formData.get("nome") ?? "").trim();
  const cnpj = onlyDigits(String(formData.get("cnpj") ?? ""));
  const segmento = String(formData.get("segmento") ?? "").trim() || null;

  if (!nome || !isValidCnpj(cnpj)) {
    redirect("/configuracoes?erro=cnpj_invalido");
  }

  const [duplicado] = await db
    .select({ id: empresas.id })
    .from(empresas)
    .where(and(eq(empresas.cnpj, cnpj), ne(empresas.id, session.empresaId)))
    .limit(1);
  if (duplicado) {
    redirect("/configuracoes?erro=cnpj_em_uso");
  }

  await db.update(empresas).set({ nome, cnpj, segmento }).where(eq(empresas.id, session.empresaId));

  await registrarAuditoria({
    empresaId: session.empresaId,
    usuarioId: session.usuarioId,
    entidade: "empresas",
    entidadeId: session.empresaId,
    acao: "atualizou",
    detalhes: { nome },
  });

  revalidatePath("/configuracoes");
  revalidatePath("/dashboard");
}

export async function convidarUsuario(formData: FormData) {
  const session = await requireSession();

  const nome = String(formData.get("nome") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const senha = String(formData.get("senha") ?? "");
  const papel = String(formData.get("papel") ?? "");

  if (!nome || !email || senha.length < 8 || !PAPEIS.includes(papel as (typeof PAPEIS)[number])) {
    redirect("/configuracoes?erro=campos_invalidos");
  }

  const [existente] = await db.select({ id: usuarios.id }).from(usuarios).where(eq(usuarios.email, email)).limit(1);
  if (existente) {
    redirect("/configuracoes?erro=email_em_uso");
  }

  const [usuario] = await db
    .insert(usuarios)
    .values({
      empresaId: session.empresaId,
      nome,
      email,
      senhaHash: hashPassword(senha),
      papel: papel as (typeof PAPEIS)[number],
    })
    .returning();

  await registrarAuditoria({
    empresaId: session.empresaId,
    usuarioId: session.usuarioId,
    entidade: "usuarios",
    entidadeId: usuario.id,
    acao: "convidou",
    detalhes: { nome, email, papel },
  });

  revalidatePath("/configuracoes");
}

export async function removerUsuario(formData: FormData) {
  const session = await requireSession();
  const id = String(formData.get("id") ?? "");

  if (id === session.usuarioId) {
    redirect("/configuracoes?erro=nao_remover_proprio");
  }

  const [alvo] = await db
    .select({ id: usuarios.id })
    .from(usuarios)
    .where(and(eq(usuarios.id, id), eq(usuarios.empresaId, session.empresaId)))
    .limit(1);
  if (!alvo) {
    redirect("/configuracoes?erro=nao_encontrado");
  }

  await db.delete(usuarios).where(and(eq(usuarios.id, id), eq(usuarios.empresaId, session.empresaId)));

  await registrarAuditoria({
    empresaId: session.empresaId,
    usuarioId: session.usuarioId,
    entidade: "usuarios",
    entidadeId: id,
    acao: "removeu",
  });

  revalidatePath("/configuracoes");
}
