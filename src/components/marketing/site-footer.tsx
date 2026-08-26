import Image from "next/image";
import Link from "next/link";
import { solucoes } from "@/lib/solucoes";
import { modulosMercado } from "@/lib/relacao-mercado";

function InstagramGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="size-4.5">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedinGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4.5">
      <path d="M4.98 3.5C4.98 4.88 3.9 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.24 8.25h4.5V23H.24V8.25Zm7.7 0h4.32v2.02h.06c.6-1.14 2.07-2.34 4.26-2.34 4.56 0 5.4 3 5.4 6.9V23h-4.5v-6.65c0-1.59-.03-3.63-2.21-3.63-2.22 0-2.56 1.73-2.56 3.52V23h-4.5V8.25Z" />
    </svg>
  );
}

const columns = [
  {
    title: "Produto",
    links: solucoes.map((s) => ({ href: `/solucoes/${s.slug}`, label: s.titulo })),
  },
  {
    title: "Relação com o Mercado",
    links: modulosMercado.map((m) => ({ href: `/relacao-mercado/${m.slug}`, label: m.titulo })),
  },
  {
    title: "Institucional",
    links: [
      { href: "/sobre-a-ominia", label: "Sobre a Ominia" },
      { href: "/time", label: "Time" },
      { href: "/etica-e-transparencia", label: "Ética e Transparência" },
      { href: "/contato", label: "Contato" },
    ],
  },
  {
    title: "Fale Conosco",
    links: [
      { href: "mailto:ouvidoria@ominia.com.br", label: "ouvidoria@ominia.com.br" },
      { href: "mailto:privacidade@ominia.com.br", label: "privacidade@ominia.com.br" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="px-4 pb-4 sm:px-6 lg:px-10">
      <div className="rounded-[32px] bg-lp-purple px-6 py-14 sm:px-10 lg:px-16">
        <div className="flex flex-col gap-12 sm:flex-row sm:justify-between">
          <div>
            <Image
              src="/brand/ominia-wordmark-white.png"
              alt="Ominia"
              width={116}
              height={21}
              className="h-[22px] w-auto"
            />
            <div className="mt-5 flex items-center gap-4">
              <a href="#" aria-label="Instagram" className="text-white/60 transition-colors hover:text-white">
                <InstagramGlyph />
              </a>
              <a href="#" aria-label="LinkedIn" className="text-white/60 transition-colors hover:text-white">
                <LinkedinGlyph />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:flex sm:flex-wrap sm:gap-x-10 sm:gap-y-10 lg:gap-x-16">
            {columns.map((column) => (
              <div key={column.title}>
                <p className="font-mono text-xs tracking-wide text-white/50 uppercase">
                  {column.title}
                </p>
                <ul className="mt-4 flex flex-col gap-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/80 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-white/15 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>Ominia {new Date().getFullYear()}</p>
          <p>Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
