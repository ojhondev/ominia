import Link from "next/link";
import { Reveal } from "./reveal";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <video
        className="absolute inset-0 -z-20 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden
      >
        <source src="/video/hero-bg.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blackout/10 via-transparent to-blackout" />

      <div className="flex w-full flex-col items-start px-6 pt-20 pb-20 text-left sm:px-10 sm:pt-32 sm:pb-28 lg:px-16 lg:pt-56 lg:pb-40 xl:px-24">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-graphite-light bg-blackout/50 px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-neon-glow backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-neon-glow pulse-dot" aria-hidden />
            Hub de tecnologia ESG para a agroindústria brasileira
          </span>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="mt-6 max-w-4xl text-3xl leading-tight font-medium tracking-tight text-whiteout sm:mt-8 sm:text-5xl md:text-6xl lg:text-[80px] lg:leading-[1]">
            Dados. Compliance e Valor para a agroindústria brasileira.
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p className="mt-6 max-w-2xl text-lg text-cloud">
            A Ominia centraliza o dado da sua cadeia produtiva, transforma isso em
            compliance com trilha de auditoria, e prova, em reais, quanto o ESG está
            gerando ou economizando para o seu agronegócio. Um hub — não um score que
            você não controla.
          </p>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row">
            <Link
              href="/cadastro"
              className="rounded-full bg-whiteout px-7 py-3 text-sm font-medium text-graphite-deep transition-opacity hover:opacity-90"
            >
              Começar agora
            </Link>
            <a
              href="#valor"
              className="rounded-full border border-graphite-light bg-blackout/40 px-[18px] py-3 text-sm text-whiteout backdrop-blur-sm transition-colors hover:border-neon-glow"
            >
              Ver o Pilar Valor
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
