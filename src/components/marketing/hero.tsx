import Link from "next/link";
import { Reveal } from "./reveal";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <video
        className="absolute inset-0 -z-20 h-full w-full object-cover opacity-40"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden
      >
        <source src="/video/hero-bg.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blackout/40 via-blackout/70 to-blackout" />

      <div className="mx-auto flex max-w-(--breakpoint-xl) flex-col items-center px-6 pt-32 pb-40 text-center">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-graphite-light px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-neon-glow">
            <span className="h-1.5 w-1.5 rounded-full bg-neon-glow pulse-dot" aria-hidden />
            Hub de tecnologia ESG para agroindústria brasileira
          </span>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="mt-8 max-w-4xl text-5xl font-medium tracking-tight text-whiteout sm:text-6xl lg:text-[80px] lg:leading-[1]">
            ESG para quem opera a usina.
            <br />
            Não para quem empresta.
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p className="mt-6 max-w-2xl text-lg text-ash">
            A Ominia centraliza o dado da sua operação, transforma isso em compliance
            com trilha de auditoria, e prova, em reais, quanto o seu ESG está gerando
            ou economizando. Um hub — não um score que você não controla.
          </p>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Link
              href="/cadastro"
              className="rounded-full bg-whiteout px-7 py-3 text-sm font-medium text-graphite-deep transition-opacity hover:opacity-90"
            >
              Começar agora
            </Link>
            <a
              href="#valor"
              className="rounded-full border border-graphite-light px-[18px] py-3 text-sm text-whiteout transition-colors hover:border-neon-glow"
            >
              Ver o Pilar Valor
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
