import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { NewsletterCta } from "@/components/marketing/newsletter-cta";
import { EmailCaptureForm } from "@/components/marketing/email-capture-form";
import { Reveal } from "@/components/marketing/reveal";

const canais = [
  { titulo: "Comercial", email: "comercial@ominia.com.br" },
  { titulo: "Suporte", email: "suporte@ominia.com.br" },
  { titulo: "Ouvidoria", email: "ouvidoria@ominia.com.br" },
  { titulo: "Privacidade", email: "privacidade@ominia.com.br" },
];

export default async function ContatoPage({
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
          <p className="text-sm text-lp-muted">Contato</p>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="mx-auto mt-3 max-w-3xl text-3xl leading-tight font-medium tracking-tight text-lp-ink sm:text-5xl">
            Fale com a gente
          </h1>
        </Reveal>
        <Reveal delay={160} className="mt-8 flex justify-center">
          <EmailCaptureForm
            origem="contato"
            redirectTo="/contato"
            ctaLabel="Quero ser contatado"
            successMessage={status === "inscrito" ? "Cadastro recebido — em breve entramos em contato." : undefined}
            errorMessage={status === "erro" ? "Digite um e-mail válido." : undefined}
          />
        </Reveal>
      </section>

      <div className="px-4 sm:px-6 lg:px-10">
        <Reveal>
          <div className="flex aspect-video items-center justify-center rounded-2xl border border-dashed border-lp-line bg-lp-paper-soft text-sm text-lp-muted sm:aspect-[21/9]">
            Imagem
          </div>
        </Reveal>
      </div>

      <section className="px-4 py-16 sm:px-6 lg:px-10">
        <Reveal>
          <h2 className="text-2xl font-medium tracking-tight text-lp-ink sm:text-3xl">Canais diretos</h2>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {canais.map((c, i) => (
            <Reveal key={c.titulo} delay={i * 80}>
              <a
                href={`mailto:${c.email}`}
                className={`flex h-40 flex-col justify-between rounded-2xl p-6 transition-opacity hover:opacity-90 ${
                  i % 2 === 0 ? "bg-lp-purple" : "bg-lp-maroon-deep"
                }`}
              >
                <div>
                  <p className="text-base font-medium text-white">{c.titulo}</p>
                  <p className="mt-1 text-sm text-white/70">{c.email}</p>
                </div>
                <span className="flex size-9 items-center justify-center rounded-full bg-lp-pink text-white">
                  <ArrowRight className="size-4" strokeWidth={2} />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      <NewsletterCta status={status} redirectTo="/contato" />
      <SiteFooter />
    </div>
  );
}
