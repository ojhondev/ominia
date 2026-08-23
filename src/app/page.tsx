import Link from "next/link";
import { OminiaMark } from "@/components/brand/ominia-mark";

const pilares = [
  {
    nome: "Dados",
    frase: "Transformamos dados dispersos da empresa em uma base ESG confiável.",
  },
  {
    nome: "Compliance",
    frase: "Transformamos seus dados em conformidade e evidências.",
  },
  {
    nome: "Valor",
    frase: "Quanto o ESG está gerando ou economizando para sua empresa?",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-blackout">
      <header className="mx-auto flex max-w-(--breakpoint-xl) items-center justify-between px-6 py-8">
        <OminiaMark height={22} />
        <nav className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-full border border-graphite-light px-[18px] py-3 text-sm text-whiteout transition-colors hover:border-neon-glow"
          >
            Entrar
          </Link>
          <Link
            href="/cadastro"
            className="rounded-full bg-whiteout px-7 py-3 text-sm font-medium text-graphite-deep transition-opacity hover:opacity-90"
          >
            Começar
          </Link>
        </nav>
      </header>

      <main className="mx-auto flex max-w-(--breakpoint-xl) flex-col items-center px-6 pt-24 pb-32 text-center">
        <span className="font-mono text-xs uppercase tracking-widest text-neon-glow">
          Hub de tecnologia ESG para agroindústria
        </span>
        <h1 className="mt-6 max-w-4xl text-5xl font-medium tracking-tight text-whiteout sm:text-6xl">
          Dados. Compliance. Valor.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-ash">
          A Ominia centraliza o dado ESG da sua operação, transforma isso em
          conformidade com trilha de auditoria, e prova, em reais, quanto isso gera ou
          economiza.
        </p>
        <Link
          href="/cadastro"
          className="mt-10 rounded-full bg-whiteout px-7 py-3 text-sm font-medium text-graphite-deep transition-opacity hover:opacity-90"
        >
          Começar agora
        </Link>

        <div className="mt-28 grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
          {pilares.map((pilar) => (
            <div
              key={pilar.nome}
              className="rounded-ui border border-graphite-light bg-graphite-deep p-6 text-left"
            >
              <p className="font-mono text-xs uppercase tracking-wide text-neon-glow">
                {pilar.nome}
              </p>
              <p className="mt-3 text-sm text-cloud">{pilar.frase}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
