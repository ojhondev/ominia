import { Reveal } from "./reveal";

const lines = [
  { text: "$ ominia trace fornecedor --id FRN-0412", tone: "prompt" },
  { text: "✓ origem geoespacial validada — 0 ha em área embargada", tone: "ok" },
  { text: "✓ documento socioambiental — vigente até 2027-03", tone: "ok" },
  { text: "✓ indicador GEE Scope 1 — 1.240 tCO2e  [Pilar Dados]", tone: "ok" },
  { text: "→ evidência de compliance gerada — pronta para auditoria", tone: "arrow" },
  { text: "→ valor financeiro associado: R$ 18.400  [Pilar Valor]", tone: "arrow" },
] as const;

const toneClass: Record<(typeof lines)[number]["tone"], string> = {
  prompt: "text-whiteout",
  ok: "text-cloud",
  arrow: "text-neon-glow",
};

export function TraceBlock() {
  return (
    <section className="border-b border-graphite-light bg-depth py-24 sm:py-32">
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24">
        <Reveal className="max-w-2xl text-left">
          <span className="font-mono text-xs uppercase tracking-widest text-neon-glow">
            Um fluxo, não três ferramentas
          </span>
          <h2 className="mt-4 text-3xl font-medium tracking-tight text-whiteout sm:text-4xl">
            Dados → Compliance → Valor, em uma única chamada
          </h2>
          <p className="mt-5 text-base text-ash">
            Cada fornecedor da sua cadeia produtiva percorre o mesmo pipeline: entra
            como dado, sai como evidência de auditoria e como número em reais.
          </p>
        </Reveal>

        <Reveal
          delay={120}
          className="mt-14 max-w-2xl rounded-ui border border-graphite-light bg-graphite-deep p-6 shadow-lg sm:p-8"
        >
          <div className="mb-5 flex gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-graphite-light" />
            <span className="h-2.5 w-2.5 rounded-full bg-graphite-light" />
            <span className="h-2.5 w-2.5 rounded-full bg-neon-muted" />
          </div>
          <pre className="overflow-x-auto font-mono text-sm leading-relaxed whitespace-pre-wrap">
            {lines.map((line, i) => (
              <div
                key={line.text}
                className={`reveal reveal-in ${toneClass[line.tone]}`}
                style={{ animationDelay: `${i * 180}ms` }}
              >
                {line.text}
              </div>
            ))}
          </pre>
        </Reveal>
      </div>
    </section>
  );
}
