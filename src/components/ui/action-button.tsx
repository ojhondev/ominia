import Link from "next/link";
import type { ReactNode, ButtonHTMLAttributes } from "react";

const VARIANTS = {
  neutral: "border border-lp-line bg-white text-lp-ink hover:bg-lp-paper-soft",
  danger: "border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100",
  primary: "border border-transparent bg-lp-pink text-white hover:opacity-90",
} as const;

const base = "inline-flex items-center justify-center rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors";

export function ActionLink({
  href,
  variant = "neutral",
  children,
}: {
  href: string;
  variant?: keyof typeof VARIANTS;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={`${base} ${VARIANTS[variant]}`}>
      {children}
    </Link>
  );
}

export function ActionButton({
  variant = "neutral",
  children,
  ...props
}: { variant?: keyof typeof VARIANTS; children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} className={`${base} ${VARIANTS[variant]}`}>
      {children}
    </button>
  );
}
