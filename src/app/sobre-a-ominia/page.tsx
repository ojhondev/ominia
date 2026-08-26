import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { NewsletterCta } from "@/components/marketing/newsletter-cta";
import { Reveal } from "@/components/marketing/reveal";

const pilares = [
  "Nascemos de um problema real: compliance de carbono virando dossiê de última hora antes de uma auditoria",
  "Construímos sobre as fórmulas oficiais de cada norma — RenovaBio, Bonsucro, GHG Protocol — sem aproximação própria",
  "Cada cálculo grava a versão de metodologia usada, para nunca mudar um resultado já emitido retroativamente",
  "Tratamos o dado da usina como o ativo mais sensível da plataforma — isolado por empresa, do início ao fim",
];

const principios = [
  {
    titulo: "Metodologia antes de design",
    texto: "Toda funcionalidade nova começa pela norma oficial que ela precisa cumprir, não pela tela que seria bonita de fazer.",
  },
  {
    titulo: "Nenhum número sem origem",
    texto: "Se um dado não tem fonte, responsável e data, ele não vira resultado dentro da Ominia.",
  },
  {
    titulo: "Construído com quem usa",
    texto: "Cada módulo é validado com usinas reais antes de virar funcionalidade permanente do produto.",
  },
];

export default async function SobreAOminiaPage({
  searchParams,
}: {
  searchParams: Promise<{ inscrito?: string; erro?: string }>;
}) {
  const sp = await searchParams;
  const inscrito = sp.inscrito === "1";
  const erro = sp.erro === "email_invalido";
  const status = inscrito ? "inscrito" : erro ? "erro" : undefined;

  return (
    <div className="min-h-screen bg-lp-paper">
      <SiteHeader />

      <section className="px-4 pt-16 pb-10 text-center sm:px-6 sm:pt-20 lg:px-10">
        <Reveal>
          <p className="text-sm text-lp-muted">Sobre a Ominia</p>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="mx-auto mt-3 max-w-3xl text-3xl leading-tight font-medium tracking-tight text-lp-ink sm:text-5xl">
            Compliance de carbono não devia ser um dossiê de última hora
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mx-auto mt-6 max-w-xl text-base text-lp-muted sm:text-lg">
            A Ominia nasceu para usinas de cana que precisam provar, com fonte e não com achismo, o que já fazem
            certo — para o RenovaBio, para a Bonsucro e para o próprio mercado.
          </p>
        </Reveal>
      </section>

      <div className="px-4 sm:px-6 lg:px-10">
        <Reveal>
          <div className="flex aspect-video items-center justify-center rounded-2xl border border-dashed border-lp-line bg-lp-paper-soft text-sm text-lp-muted sm:aspect-[21/9] sm:max-h-80">
            Imagem
          </div>
        </Reveal>
      </div>

      <section className="px-4 py-16 sm:px-6 lg:px-10">
        <Reveal>
          <h2 className="text-2xl font-medium tracking-tight text-lp-ink sm:text-3xl">Por que existimos</h2>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pilares.map((p, i) => (
            <Reveal key={p} delay={i * 80}>
              <div
                className={`flex h-56 flex-col justify-between rounded-2xl p-6 ${
                  i % 2 === 0 ? "bg-lp-purple" : "bg-lp-maroon-deep"
                }`}
              >
                <p className="text-base leading-snug font-medium text-white">{p}</p>
                <span className="flex size-9 items-center justify-center rounded-full bg-lp-pink text-white">
                  <ArrowRight className="size-4" strokeWidth={2} />
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-10">
        {principios.map((p, i) => (
          <div key={p.titulo} className={i > 0 ? "border-t border-lp-line" : undefined}>
            <Reveal delay={i * 60}>
              <div className="flex flex-col gap-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
                <h3 className="text-2xl font-medium text-lp-ink sm:w-72 sm:shrink-0">{p.titulo}</h3>
                <p className="text-sm text-lp-muted sm:max-w-md">{p.texto}</p>
              </div>
            </Reveal>
          </div>
        ))}
      </section>

      <NewsletterCta status={status} redirectTo="/sobre-a-ominia" />
      <SiteFooter />
    </div>
  );
}
