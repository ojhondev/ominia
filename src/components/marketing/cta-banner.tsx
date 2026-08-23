import Link from "next/link";
import { Reveal } from "./reveal";

export function CtaBanner() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-(--breakpoint-xl) px-6">
        <Reveal className="mx-auto flex max-w-3xl flex-col items-center rounded-ui border border-graphite-light bg-graphite-deep px-8 py-16 text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-neon-glow">
            Piloto de 90 dias
          </span>
          <h2 className="mt-5 max-w-xl text-3xl font-medium tracking-tight text-whiteout sm:text-4xl">
            Comece com sua operação real, não com um Compliance perfeito
          </h2>
          <p className="mt-5 max-w-xl text-base text-ash">
            Sem promessa vaga. Em 90 dias você vê o Pilar Valor em números — e decide
            se faz sentido continuar.
          </p>
          <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row">
            <Link
              href="/cadastro"
              className="rounded-full bg-whiteout px-7 py-3 text-sm font-medium text-graphite-deep transition-opacity hover:opacity-90"
            >
              Falar com o time
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-graphite-light px-[18px] py-3 text-sm text-whiteout transition-colors hover:border-neon-glow"
            >
              Entrar
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
