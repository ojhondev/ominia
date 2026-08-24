import { requireSession } from "@/lib/auth/require-session";
import { getEmpresa } from "@/lib/queries/dashboard";

export default async function DashboardPage() {
  const session = await requireSession();
  const empresa = await getEmpresa(session.empresaId);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-medium tracking-tight text-whiteout">
          Olá, {empresa?.nome ?? "bem-vindo(a)"}
        </h1>
        <p className="mt-1 text-ash">
          Inventário de emissões CBio e Bonsucro — em breve, direto aqui.
        </p>
      </div>

      <div className="flex min-h-72 flex-col items-center justify-center gap-2 rounded-ui border border-dashed border-graphite-light p-12 text-center">
        <p className="font-mono text-xs uppercase tracking-wide text-neon-glow">
          Em construção
        </p>
        <p className="max-w-md text-sm text-pewter">
          O módulo de inventário está sendo reconstruído para o novo escopo
          (CBio e Bonsucro). Ver{" "}
          <code className="rounded bg-graphite px-1.5 py-0.5 font-mono text-xs text-cloud">
            docs/PRD.md
          </code>
          .
        </p>
      </div>
    </div>
  );
}
