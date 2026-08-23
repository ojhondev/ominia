"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { indicadores } from "@/db/schema";
import { requireSession } from "@/lib/auth/require-session";

export async function criarIndicador(formData: FormData) {
  await requireSession();

  const codigo = String(formData.get("codigo") ?? "").trim().toUpperCase();
  const nome = String(formData.get("nome") ?? "").trim();
  const categoria = String(formData.get("categoria") ?? "").trim();
  const unidadeMedida = String(formData.get("unidadeMedida") ?? "").trim();

  if (!codigo || !nome || !categoria || !unidadeMedida) return;

  await db.insert(indicadores).values({ codigo, nome, categoria, unidadeMedida });

  revalidatePath("/dados/indicadores");
}
