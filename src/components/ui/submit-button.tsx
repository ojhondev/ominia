"use client";

import { useFormStatus } from "react-dom";
import type { ReactNode } from "react";
import { Spinner } from "./spinner";

const SIZES = {
  md: "px-7 py-3 text-sm",
  sm: "px-5 py-2 text-sm",
} as const;

export function SubmitButton({
  children,
  pendingLabel = "Salvando...",
  size = "md",
  className = "",
}: {
  children: ReactNode;
  pendingLabel?: string;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex items-center gap-2 rounded-full bg-lp-pink font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 ${SIZES[size]} ${className}`}
    >
      {pending && <Spinner className="size-4" />}
      {pending ? pendingLabel : children}
    </button>
  );
}
