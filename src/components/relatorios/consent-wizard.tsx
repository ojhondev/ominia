"use client";

import { useState } from "react";
import { CONSENTIMENTOS_RELATORIO } from "@/lib/consentimentos-relatorio";
import { publicarRelatorio } from "@/app/(app)/relatorios/actions";
import { SubmitButton } from "@/components/ui/submit-button";

export function ConsentWizard({ relatorioId }: { relatorioId: string }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [aceitos, setAceitos] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);

  const total = CONSENTIMENTOS_RELATORIO.length;
  const atual = CONSENTIMENTOS_RELATORIO[step];
  const ultimo = step === total - 1;
  const aceitosFinal = ultimo && checked ? [...aceitos, atual.chave] : aceitos;

  function abrir() {
    setStep(0);
    setAceitos([]);
    setChecked(false);
    setOpen(true);
  }

  function avancar() {
    if (!checked) return;
    setAceitos((prev) => [...prev, atual.chave]);
    setChecked(false);
    setStep((s) => s + 1);
  }

  return (
    <>
      <button
        type="button"
        onClick={abrir}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-lp-pink px-7 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        Publicar relatório
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-lp-ink/50 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs tracking-wide text-lp-muted uppercase">
                Aviso {step + 1} de {total}
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fechar"
                className="text-lp-muted hover:text-lp-ink"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 flex gap-1">
              {CONSENTIMENTOS_RELATORIO.map((c, i) => (
                <span key={c.chave} className={`h-1 flex-1 rounded-full ${i <= step ? "bg-lp-pink" : "bg-lp-line"}`} />
              ))}
            </div>

            <h3 className="mt-5 text-lg font-medium text-lp-ink">{atual.titulo}</h3>
            <p className="mt-2 text-sm text-lp-muted">{atual.texto}</p>

            <label className="mt-5 flex items-start gap-2.5 rounded-xl border border-lp-line bg-lp-paper-soft p-3 text-sm text-lp-ink">
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
                className="mt-0.5 size-4 shrink-0 accent-lp-pink"
              />
              Li e entendi.
            </label>

            <div className="mt-6 flex justify-end gap-2">
              {!ultimo ? (
                <button
                  type="button"
                  disabled={!checked}
                  onClick={avancar}
                  className="rounded-full bg-lp-pink px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Próximo
                </button>
              ) : (
                <form
                  action={publicarRelatorio}
                  onSubmit={(e) => {
                    if (!checked) e.preventDefault();
                  }}
                >
                  <input type="hidden" name="id" value={relatorioId} />
                  <input type="hidden" name="consentimentos" value={JSON.stringify(aceitosFinal)} />
                  <SubmitButton pendingLabel="Publicando...">Publicar relatório</SubmitButton>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
