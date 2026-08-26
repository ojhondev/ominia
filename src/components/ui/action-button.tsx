"use client";

import Link from "next/link";
import { useFormStatus } from "react-dom";
import type { ReactNode, ButtonHTMLAttributes } from "react";
import { Spinner } from "./spinner";

const VARIANTS = {
  neutral: "border border-lp-line bg-white text-lp-ink hover:bg-lp-paper-soft",
  danger: "border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100",
  primary: "border border-transparent bg-lp-pink text-white hover:opacity-90",
} as const;

const base = "inline-flex items-center justify-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60";

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
  disabled,
  pendingLabel,
  ...props
}: {
  variant?: keyof typeof VARIANTS;
  children: ReactNode;
  pendingLabel?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const { pending } = useFormStatus();
  const showPending = props.type === "submit" && pending;

  return (
    <button {...props} disabled={disabled || showPending} className={`${base} ${VARIANTS[variant]}`}>
      {showPending && <Spinner className="size-3" />}
      {showPending && pendingLabel ? pendingLabel : children}
    </button>
  );
}
