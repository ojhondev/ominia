import Link from "next/link";
import { OminiaMark } from "@/components/brand/ominia-mark";

const navLinks = [
  { href: "#dados", label: "Dados" },
  { href: "#compliance", label: "Compliance" },
  { href: "#valor", label: "Valor" },
  { href: "#diferencial", label: "Por que Ominia" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-graphite-light/60 bg-blackout/70 backdrop-blur-md">
      <div className="flex w-full items-center justify-between px-6 py-5 sm:px-10 lg:px-16 xl:px-24">
        <Link href="/" aria-label="Ominia">
          <OminiaMark height={20} />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-whiteout transition-colors hover:text-neon-glow"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden rounded-full border border-graphite-light px-[18px] py-3 text-sm text-whiteout transition-colors hover:border-neon-glow sm:inline-block"
          >
            Entrar
          </Link>
          <Link
            href="/cadastro"
            className="rounded-full bg-whiteout px-7 py-3 text-sm font-medium text-graphite-deep transition-opacity hover:opacity-90"
          >
            Começar
          </Link>
        </div>
      </div>
    </header>
  );
}
