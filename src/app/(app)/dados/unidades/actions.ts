"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { unidades } from "@/db/schema";
import { requireSession } from "@/lib/auth/require-session";

export async function criarUnidade(formData: FormData) {
  const session = await requireSession();

  const nome = String(formData.get("nome") ?? "").trim();
  const tipo = String(formData.get("tipo") ?? "").trim();
  const municipio = String(formData.get("municipio") ?? "").trim();
  const uf = String(formData.get("uf") ?? "").trim();

  if (!nome || !tipo) return;

  await db.insert(unidades).values({
    empresaId: session.empresaId,
    nome,
    tipo,
    municipio: municipio || null,
    uf: uf || null,
  });

  revalidatePath("/dados/unidades");
}
