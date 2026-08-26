import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { usuarios } from "@/db/schema";

export async function listUsuarios(empresaId: string) {
  return db
    .select({ id: usuarios.id, nome: usuarios.nome, email: usuarios.email, papel: usuarios.papel, criadoEm: usuarios.criadoEm })
    .from(usuarios)
    .where(eq(usuarios.empresaId, empresaId))
    .orderBy(asc(usuarios.criadoEm));
}
