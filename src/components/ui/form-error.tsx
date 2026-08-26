import { errorMessage } from "@/lib/errors";

export function FormError({ code }: { code?: string }) {
  const message = errorMessage(code);
  if (!message) return null;

  return (
    <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm text-rose-700">{message}</p>
  );
}
