import type { ReactNode } from "react";
import { eq } from "drizzle-orm";
import { LogOut } from "lucide-react";
import { db } from "@/db";
import { empresas, usuarios } from "@/db/schema";
import { requireSession } from "@/lib/auth/require-session";
import { signOut } from "@/app/(auth)/actions";
import { Sidebar } from "@/components/nav/sidebar";
import { MobileNav } from "@/components/nav/mobile-nav";
import { OnboardingTour } from "@/components/onboarding/onboarding-tour";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await requireSession();
  const [empresa] = await db
    .select({ nome: empresas.nome })
    .from(empresas)
    .where(eq(empresas.id, session.empresaId))
    .limit(1);
  const [usuario] = await db
    .select({ onboardingConcluidoEm: usuarios.onboardingConcluidoEm })
    .from(usuarios)
    .where(eq(usuarios.id, session.usuarioId))
    .limit(1);

  const isAdmin = session.papel === "admin";

  return (
    <div className="flex h-screen overflow-hidden bg-lp-paper-soft print:h-auto print:overflow-visible">
      {!usuario?.onboardingConcluidoEm && <OnboardingTour />}
      <Sidebar empresaNome={empresa?.nome} isAdmin={isAdmin} />
      <div className="flex flex-1 flex-col overflow-hidden print:overflow-visible">
        <header className="no-print flex h-16 shrink-0 items-center justify-between border-b border-lp-line bg-lp-paper px-4 sm:px-8">
          <MobileNav empresaNome={empresa?.nome} isAdmin={isAdmin} />
          <div className="hidden md:block" />
          <form action={signOut}>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm text-lp-muted transition-colors hover:bg-lp-paper-soft hover:text-lp-ink"
            >
              <LogOut className="size-4" strokeWidth={2} />
              Sair
            </button>
          </form>
        </header>
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 sm:py-8 print:overflow-visible print:px-0 print:py-0">
          {children}
        </main>
      </div>
    </div>
  );
}
