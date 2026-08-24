"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Menu, X, ArrowUpRight } from "lucide-react";
import { solucoes } from "@/lib/solucoes";

const solucoesNav = solucoes.map((s) => ({ href: `/solucoes/${s.slug}`, label: s.titulo }));

const institucional = [
  { href: "/#sobre", label: "Sobre a Ominia" },
  { href: "/#time", label: "Time" },
  { href: "/#relacao-mercado", label: "Relação com o Mercado" },
];

function Dropdown({ label, items }: { label: string; items: { href: string; label: string }[] }) {
  return (
    <div className="group relative">
      <button
        type="button"
        className="flex items-center gap-1 text-sm text-lp-ink/70 transition-colors hover:text-lp-ink"
      >
        {label}
        <ChevronDown className="size-3.5" strokeWidth={2} />
      </button>
      <div className="invisible absolute top-full left-1/2 z-50 w-64 -translate-x-1/2 pt-3 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100">
        <div className="rounded-2xl border border-lp-line bg-lp-paper p-2 shadow-[0px_16px_32px_rgba(21,15,38,0.12)]">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-xl px-3 py-2.5 text-sm text-lp-ink/80 transition-colors hover:bg-lp-paper-soft hover:text-lp-ink"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-4 z-50 px-4 sm:top-6 sm:px-6 lg:px-10">
      <header className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-lp-line bg-lp-paper/95 py-3 pr-3 pl-6 shadow-[0px_8px_24px_rgba(21,15,38,0.08)] backdrop-blur-md">
        <Link href="/" aria-label="Ominia" onClick={() => setOpen(false)}>
          <Image
            src="/brand/ominia-wordmark-dark.png"
            alt="Ominia"
            width={116}
            height={21}
            priority
            className="h-[21px] w-auto"
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Dropdown label="Soluções" items={solucoesNav} />
          <Dropdown label="Institucional" items={institucional} />
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/login"
            className="rounded-full bg-lp-pink px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Entrar
          </Link>
          <Link
            href="/#relacao-mercado"
            className="flex items-center gap-1 px-4 py-2.5 text-sm font-medium text-lp-ink transition-colors hover:text-lp-pink-deep"
          >
            Relação com o Mercado
            <ArrowUpRight className="size-3.5" strokeWidth={2} />
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="text-lp-ink md:hidden"
        >
          {open ? <X className="size-6" strokeWidth={1.75} /> : <Menu className="size-6" strokeWidth={1.75} />}
        </button>
      </header>

      {open && (
        <div className="mx-auto mt-2 max-w-6xl rounded-3xl border border-lp-line bg-lp-paper p-6 shadow-[0px_16px_32px_rgba(21,15,38,0.12)] md:hidden">
          <p className="font-mono text-xs tracking-wide text-lp-muted uppercase">Soluções</p>
          <nav className="mt-3 flex flex-col gap-3">
            {solucoesNav.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="text-base text-lp-ink">
                {item.label}
              </Link>
            ))}
          </nav>

          <p className="mt-6 font-mono text-xs tracking-wide text-lp-muted uppercase">Institucional</p>
          <nav className="mt-3 flex flex-col gap-3">
            {institucional.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setOpen(false)} className="text-base text-lp-ink">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="mt-6 flex flex-col gap-3 border-t border-lp-line pt-6">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="rounded-full bg-lp-pink px-6 py-3 text-center text-sm font-medium text-white"
            >
              Entrar
            </Link>
            <Link
              href="/#relacao-mercado"
              onClick={() => setOpen(false)}
              className="rounded-full border border-lp-line px-6 py-3 text-center text-sm font-medium text-lp-ink"
            >
              Relação com o Mercado
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
