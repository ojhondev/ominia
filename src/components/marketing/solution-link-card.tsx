import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Solucao } from "@/lib/solucoes";

export function SolutionLinkCard({ solucao, dark }: { solucao: Solucao; dark: boolean }) {
  return (
    <Link
      href={`/solucoes/${solucao.slug}`}
      className={`group flex h-72 w-64 shrink-0 flex-col justify-between rounded-2xl p-6 transition-transform hover:-translate-y-1 sm:w-72 ${
        dark ? "bg-lp-purple" : "bg-lp-maroon-deep"
      }`}
    >
      <p className="text-lg leading-snug font-medium text-white">{solucao.titulo}</p>
      <span className="flex size-9 items-center justify-center rounded-full bg-lp-pink text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
        <ArrowRight className="size-4" strokeWidth={2} />
      </span>
    </Link>
  );
}
