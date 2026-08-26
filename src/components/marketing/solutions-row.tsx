"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { Reveal } from "./reveal";
import { solucoes, type Solucao } from "@/lib/solucoes";

function SolutionCard({
  solucao,
  dark,
  open,
  hidden = false,
  onOpen,
  onClose,
  onToggle,
}: {
  solucao: Solucao;
  dark: boolean;
  open: boolean;
  hidden?: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
}) {
  return (
    <div
      id={hidden ? undefined : solucao.slug}
      aria-hidden={hidden}
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
      onClick={onToggle}
      role="button"
      tabIndex={hidden ? -1 : 0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onToggle();
      }}
      className={`flex w-72 shrink-0 cursor-pointer flex-col justify-between rounded-2xl p-6 transition-[min-height] duration-300 ease-out sm:w-80 ${
        dark ? "bg-lp-purple" : "bg-lp-maroon-deep"
      } ${open ? "min-h-96" : "min-h-80"}`}
    >
      <div>
        <p className="text-lg leading-snug font-medium text-white">
          {solucao.titulo}
        </p>
        <div
          className={`grid transition-all duration-300 ease-out ${
            open ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <p className="overflow-hidden text-sm leading-relaxed text-white/75">
            {solucao.resumo}
          </p>
        </div>
      </div>

      <Link
        href={`/solucoes/${solucao.slug}`}
        aria-label={`Ver mais sobre ${solucao.titulo}`}
        tabIndex={hidden ? -1 : 0}
        onClick={(e) => e.stopPropagation()}
        className={`flex size-9 shrink-0 items-center justify-center rounded-full bg-lp-pink text-white transition-transform duration-300 ${
          open ? "rotate-45" : ""
        }`}
      >
        {open ? <Plus className="size-4" strokeWidth={2} /> : <ArrowRight className="size-4" strokeWidth={2} />}
      </Link>
    </div>
  );
}

export function SolutionsRow() {
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [clickedId, setClickedId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [closedOnMobile, setClosedOnMobile] = useState<Set<string>>(new Set());

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const openId = clickedId ?? hoverId;
  const paused = !isMobile && openId !== null;

  const isOpen = (slug: string) => (isMobile ? !closedOnMobile.has(slug) : openId === slug);

  const toggle = (slug: string) => {
    if (isMobile) {
      setClosedOnMobile((prev) => {
        const next = new Set(prev);
        if (next.has(slug)) next.delete(slug);
        else next.add(slug);
        return next;
      });
      return;
    }
    setClickedId((current) => (current === slug ? null : slug));
  };

  const track = [...solucoes, ...solucoes];

  return (
    <section id="time" className="py-16">
      <div className="px-4 sm:px-6 lg:px-10">
        <Reveal>
          <h2 className="max-w-2xl text-3xl leading-tight font-medium tracking-tight text-lp-ink sm:text-4xl">
            Conheça as frentes que já estamos construindo
          </h2>
        </Reveal>
      </div>

      <div className="mt-10 overflow-hidden">
        <div
          className="marquee-track-slow flex w-max items-start gap-4 px-4 sm:px-6 lg:px-10"
          style={{ animationPlayState: paused ? "paused" : "running" }}
        >
          {track.map((solucao, i) => {
            const isDuplicate = i >= solucoes.length;
            return (
              <SolutionCard
                key={`${solucao.slug}-${i}`}
                solucao={solucao}
                dark={i % 2 === 0}
                hidden={isDuplicate}
                open={isOpen(solucao.slug)}
                onOpen={() => setHoverId(solucao.slug)}
                onClose={() => setHoverId((current) => (current === solucao.slug ? null : current))}
                onToggle={() => toggle(solucao.slug)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
