import { eq } from "drizzle-orm";
import { db } from "@/db";
import { empresas } from "@/db/schema";

export async function getEmpresa(empresaId: string) {
  const [empresa] = await db.select().from(empresas).where(eq(empresas.id, empresaId));
  return empresa ?? null;
}
