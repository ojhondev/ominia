"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { OminiaMark } from "@/components/brand/ominia-mark";

const navLinks = [
  { href: "#dados", label: "Dados" },
  { href: "#compliance", label: "Compliance" },
  { href: "#valor", label: "Valor" },
  { href: "#diferencial", label: "Por que Ominia" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-graphite-light/60 bg-blackout/70 backdrop-blur-md">
      <div className="flex w-full items-center justify-between px-6 py-5 sm:px-10 lg:px-16 xl:px-24">
        <Link href="/" aria-label="Ominia" onClick={() => setOpen(false)}>
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

        <div className="hidden items-center gap-3 md:flex">
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
        </div>

        <button
          type="button"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="text-whiteout md:hidden"
        >
          {open ? <X className="size-6" strokeWidth={1.75} /> : <Menu className="size-6" strokeWidth={1.75} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-graphite-light bg-blackout px-6 py-6 md:hidden">
          <nav className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-base text-whiteout"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="rounded-full border border-graphite-light px-[18px] py-3 text-center text-sm text-whiteout"
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              onClick={() => setOpen(false)}
              className="rounded-full bg-whiteout px-7 py-3 text-center text-sm font-medium text-graphite-deep"
            >
              Começar
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
