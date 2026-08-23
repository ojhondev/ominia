import Link from "next/link";
import { OminiaMark } from "@/components/brand/ominia-mark";

const columns = [
  {
    title: "Produto",
    links: [
      { href: "#dados", label: "Dados" },
      { href: "#compliance", label: "Compliance" },
      { href: "#valor", label: "Valor" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { href: "#diferencial", label: "Por que Ominia" },
      { href: "/cadastro", label: "Começar" },
      { href: "/login", label: "Entrar" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="py-16">
      <div className="flex w-full flex-col gap-12 px-6 sm:flex-row sm:justify-between sm:px-10 lg:px-16 xl:px-24">
        <div className="max-w-xs">
          <OminiaMark height={20} />
          <p className="mt-4 text-sm text-ash">
            Hub de tecnologia ESG para a agroindústria brasileira. Dados, Compliance e
            Valor para todo o agronegócio, em um só lugar.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-12 sm:flex sm:gap-16">
          {columns.map((column) => (
            <div key={column.title}>
              <p className="font-mono text-xs uppercase tracking-wide text-ash">
                {column.title}
              </p>
              <ul className="mt-4 flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-cloud transition-colors hover:text-whiteout"
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

      <div className="mt-16 w-full border-t border-graphite-light px-6 pt-8 sm:px-10 lg:px-16 xl:px-24">
        <p className="text-xs text-pewter">
          © {new Date().getFullYear()} Ominia. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
