import { requireSession } from "@/lib/auth/require-session";
import { listAlertas } from "@/lib/queries/alertas";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { ActionLink } from "@/components/ui/action-button";

const TONE = { critico: "negative", atencao: "warning", info: "neutral" } as const;
const LABEL = { critico: "Crítico", atencao: "Atenção", info: "Info" } as const;

export default async function AlertasPage() {
  const session = await requireSession();
  const alertas = await listAlertas(session.empresaId);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-medium tracking-tight text-lp-ink">Alertas</h1>
        <p className="mt-1 max-w-2xl text-lp-muted">
          Prazos vencendo, evidências paradas e requisitos fora de conformidade — calculado a partir do que já está
          cadastrado, sem precisar abrir cada módulo para descobrir.
        </p>
      </div>

      {alertas.length === 0 ? (
        <EmptyState title="Nenhum alerta no momento" description="Documentos em dia, evidências revisadas e compliance sem pendência crítica." />
      ) : (
        <div className="flex flex-col gap-3">
          {alertas.map((a) => (
            <div key={a.id} className="flex flex-col gap-3 rounded-2xl border border-lp-line bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <StatusBadge label={LABEL[a.severidade]} tone={TONE[a.severidade]} />
                <div>
                  <p className="font-medium text-lp-ink">{a.titulo}</p>
                  <p className="mt-0.5 text-sm text-lp-muted">{a.descricao}</p>
                </div>
              </div>
              <ActionLink href={a.href}>Resolver →</ActionLink>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
