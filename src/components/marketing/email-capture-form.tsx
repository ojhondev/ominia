import { cadastrarLead } from "./actions";

export function EmailCaptureForm({
  origem,
  consent = false,
  successMessage,
  errorMessage,
}: {
  origem: string;
  consent?: boolean;
  successMessage?: string;
  errorMessage?: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      {successMessage && (
        <p className="rounded-full bg-lp-pink/10 px-4 py-2 text-center text-sm font-medium text-lp-pink-deep">
          {successMessage}
        </p>
      )}
      {errorMessage && (
        <p className="rounded-full bg-red-50 px-4 py-2 text-center text-sm font-medium text-red-600">
          {errorMessage}
        </p>
      )}
      <form
        action={cadastrarLead}
        className="flex w-full max-w-md flex-col gap-2 sm:flex-row sm:items-center sm:gap-1 sm:rounded-full sm:bg-white sm:p-1.5 sm:shadow-[0px_8px_24px_rgba(21,15,38,0.16)]"
      >
        <input type="hidden" name="origem" value={origem} />
        <input
          type="email"
          name="email"
          required
          placeholder="Seu melhor e-mail"
          className="w-full rounded-full border border-lp-line bg-white px-5 py-3 text-sm text-lp-ink outline-none placeholder:text-lp-muted sm:flex-1 sm:border-0 sm:bg-transparent"
        />
        <button
          type="submit"
          className="w-full shrink-0 rounded-full bg-lp-pink px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 sm:w-auto"
        >
          Cadastrar
        </button>
      </form>
      {consent && (
        <label className="flex items-start gap-2.5 text-xs text-lp-muted">
          <input type="checkbox" required className="mt-0.5 size-3.5 rounded border-lp-line" />
          <span>
            Declaro que conheço a{" "}
            <a href="#" className="underline underline-offset-2 hover:text-lp-ink">
              Política de Privacidade
            </a>{" "}
            e autorizo a utilização das minhas informações pela Ominia.
          </span>
        </label>
      )}
    </div>
  );
}
