import type { InputHTMLAttributes, SelectHTMLAttributes, ReactNode } from "react";

const inputClass =
  "w-full rounded-xl border border-lp-line bg-white px-3 py-2 text-sm text-lp-ink placeholder:text-lp-muted focus:border-lp-pink focus:outline-none";

export function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="flex flex-col gap-1.5">
      <span className="font-mono text-xs tracking-wide text-lp-muted uppercase">{label}</span>
      {children}
    </label>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputClass} ${props.className ?? ""}`} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${inputClass} ${props.className ?? ""}`} />;
}
