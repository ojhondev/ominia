import type { ReactNode } from "react";
import { eq } from "drizzle-orm";
import { LogOut } from "lucide-react";
import { db } from "@/db";
import { empresas } from "@/db/schema";
import { requireSession } from "@/lib/auth/require-session";
import { signOut } from "@/app/(auth)/actions";
import { Sidebar } from "@/components/nav/sidebar";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await requireSession();
  const [empresa] = await db
    .select({ nome: empresas.nome })
    .from(empresas)
    .where(eq(empresas.id, session.empresaId))
    .limit(1);

  return (
    <div className="flex min-h-screen bg-blackout">
      <Sidebar empresaNome={empresa?.nome} />
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-end border-b border-graphite-light px-8">
          <form action={signOut}>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-ui px-3 py-1.5 text-sm text-ash transition-colors hover:bg-graphite hover:text-whiteout"
            >
              <LogOut className="size-4" strokeWidth={2} />
              Sair
            </button>
          </form>
        </header>
        <main className="flex-1 px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
