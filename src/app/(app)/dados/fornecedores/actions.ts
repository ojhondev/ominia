"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { fornecedores } from "@/db/schema";
import { requireSession } from "@/lib/auth/require-session";

export async function criarFornecedor(formData: FormData) {
  const session = await requireSession();

  const nome = String(formData.get("nome") ?? "").trim();
  const documento = String(formData.get("documento") ?? "").trim();
  const tipo = String(formData.get("tipo") ?? "").trim();

  if (!nome || !documento || !tipo) return;

  await db.insert(fornecedores).values({
    empresaId: session.empresaId,
    nome,
    documento,
    tipo,
  });

  revalidatePath("/dados/fornecedores");
}
