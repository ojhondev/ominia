"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { empresas, usuarios } from "@/db/schema";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSession, destroySession } from "@/lib/auth/session";

export async function signUp(formData: FormData) {
  const nomeEmpresa = String(formData.get("nomeEmpresa") ?? "").trim();
  const cnpj = String(formData.get("cnpj") ?? "").trim();
  const nome = String(formData.get("nome") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const senha = String(formData.get("senha") ?? "");

  if (!nomeEmpresa || !cnpj || !nome || !email || senha.length < 8) {
    redirect("/cadastro?erro=dados_invalidos");
  }

  const [existente] = await db
    .select({ id: usuarios.id })
    .from(usuarios)
    .where(eq(usuarios.email, email))
    .limit(1);

  if (existente) {
    redirect("/cadastro?erro=email_em_uso");
  }

  const [empresa] = await db.insert(empresas).values({ nome: nomeEmpresa, cnpj }).returning();
  const [usuario] = await db
    .insert(usuarios)
    .values({
      empresaId: empresa.id,
      nome,
      email,
      senhaHash: hashPassword(senha),
      papel: "admin",
    })
    .returning();

  await createSession(usuario.id, empresa.id, usuario.papel);
  redirect("/dashboard");
}

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const senha = String(formData.get("senha") ?? "");

  const [usuario] = await db
    .select()
    .from(usuarios)
    .where(eq(usuarios.email, email))
    .limit(1);

  if (!usuario || !usuario.empresaId || !verifyPassword(senha, usuario.senhaHash)) {
    redirect("/login?erro=credenciais");
  }

  await createSession(usuario.id, usuario.empresaId, usuario.papel);
  redirect("/dashboard");
}

export async function signOut() {
  await destroySession();
  redirect("/login");
}
