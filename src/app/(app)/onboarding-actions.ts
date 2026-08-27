"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/require-session";
import { db } from "@/db";
import { usuarios } from "@/db/schema";

export async function concluirOnboarding() {
  const session = await requireSession();
  await db.update(usuarios).set({ onboardingConcluidoEm: new Date() }).where(eq(usuarios.id, session.usuarioId));
  revalidatePath("/", "layout");
}
