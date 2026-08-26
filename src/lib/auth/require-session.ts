import { redirect } from "next/navigation";
import { getSession } from "./session";

export async function requireSession() {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

/** Só o papel "admin" gerencia dados da empresa e equipe — todo o resto do produto
 * (Organização, Data Hub, motores de cálculo, Evidence Hub, Auditoria) continua
 * acessível a qualquer papel autenticado. */
export async function requireAdmin() {
  const session = await requireSession();
  if (session.papel !== "admin") redirect("/dashboard?erro=sem_permissao");
  return session;
}
