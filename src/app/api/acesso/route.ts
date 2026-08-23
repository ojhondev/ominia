import { NextResponse, type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { usuarios } from "@/db/schema";
import { createSession } from "@/lib/auth/session";

const DEMO_EMAIL = "demo@ominia.dev";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const esperado = process.env.DEMO_ACCESS_TOKEN;

  if (!esperado || token !== esperado) {
    return new NextResponse("Not found", { status: 404 });
  }

  const [usuario] = await db
    .select()
    .from(usuarios)
    .where(eq(usuarios.email, DEMO_EMAIL))
    .limit(1);

  if (!usuario || !usuario.empresaId) {
    return new NextResponse("Not found", { status: 404 });
  }

  await createSession(usuario.id, usuario.empresaId, usuario.papel);
  return NextResponse.redirect(new URL("/dashboard", request.url));
}
