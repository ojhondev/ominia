import { Reveal } from "./reveal";
import { EmailCaptureForm } from "./email-capture-form";

export function Hero({ status }: { status?: "inscrito" | "erro" }) {
  return (
    <div className="relative isolate min-h-[520px] overflow-hidden rounded-xl sm:min-h-[620px] sm:rounded-[26px] lg:min-h-[680px]">
      <video
        className="absolute inset-0 -z-20 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/video/hero-poster.jpg"
        aria-hidden
      >
        <source src="/video/hero-bg.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 -z-10 bg-black/55 transition-colors duration-300 hover:bg-black/65" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-lp-purple/80 via-black/10 to-transparent" />

      <div className="flex min-h-[560px] w-full flex-col items-center justify-center gap-6 px-6 py-24 text-center sm:min-h-[620px] sm:px-10 lg:min-h-[680px] lg:px-16">
        <Reveal>
          <h1 className="max-w-3xl text-3xl leading-[1.15] font-medium tracking-tight text-white sm:text-5xl lg:text-6xl">
            Hub de soluções para inventário de emissões CBio e Bonsucro.
          </h1>
        </Reveal>

        <Reveal delay={80}>
          <p className="max-w-xl text-base text-white/80 sm:text-lg">
            Conhecimento e tecnologia para fazer mais pela agroindústria
            brasileira.
          </p>
        </Reveal>

        <Reveal delay={160} className="mt-4 w-full max-w-md">
          <EmailCaptureForm
            origem="hero"
            successMessage={status === "inscrito" ? "Cadastro recebido — em breve entramos em contato." : undefined}
            errorMessage={status === "erro" ? "Digite um e-mail válido." : undefined}
          />
        </Reveal>
      </div>
    </div>
  );
}
