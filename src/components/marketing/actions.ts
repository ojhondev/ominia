"use server";

import { redirect } from "next/navigation";
import { db } from "@/db";
import { leads } from "@/db/schema";

export async function cadastrarLead(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const origem = String(formData.get("origem") ?? "lp");

  if (!email || !email.includes("@")) {
    redirect(`/?erro=email_invalido#${origem}`);
  }

  await db.insert(leads).values({ email, origem }).onConflictDoNothing();

  redirect(`/?inscrito=1#${origem}`);
}
