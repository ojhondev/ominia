import { Reveal } from "./reveal";
import { EmailCaptureForm } from "./email-capture-form";

export function NewsletterCta({
  status,
  redirectTo = "/",
}: {
  status?: "inscrito" | "erro";
  redirectTo?: string;
}) {
  return (
    <section id="contato" className="px-4 py-16 sm:px-6 lg:px-10">
      <Reveal>
        <div className="flex flex-col items-center gap-6 text-center">
          <h2 className="text-2xl font-medium tracking-tight text-lp-muted sm:text-3xl">
            Assine nossa newsletter
          </h2>
          <EmailCaptureForm
            origem="newsletter"
            redirectTo={redirectTo}
            consent
            successMessage={status === "inscrito" ? "Cadastro recebido — em breve entramos em contato." : undefined}
            errorMessage={status === "erro" ? "Digite um e-mail válido." : undefined}
          />
        </div>
      </Reveal>
    </section>
  );
}
