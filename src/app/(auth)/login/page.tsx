import Link from "next/link";
import Image from "next/image";
import { signIn } from "../actions";
import { SubmitButton } from "@/components/ui/submit-button";

const ERROS: Record<string, string> = {
  credenciais: "E-mail ou senha incorretos.",
};

const inputClass =
  "rounded-xl border border-lp-line bg-white px-3 py-2 text-sm text-lp-ink outline-none focus:border-lp-pink";

const labelClass = "font-mono text-xs uppercase tracking-wide text-lp-muted";

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const params = await searchParams;
  const erroParam = params.erro;
  const erro = typeof erroParam === "string" ? ERROS[erroParam] : undefined;

  return (
    <div className="flex flex-col gap-6">
      <Image src="/brand/ominia-wordmark-dark.png" alt="Ominia" width={116} height={21} priority className="h-[21px] w-auto" />

      <div>
        <h1 className="text-xl font-medium tracking-tight text-lp-ink">Entrar</h1>
        <p className="mt-1 text-sm text-lp-muted">Acesse o hub ESG da sua empresa.</p>
      </div>

      {erro && (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">
          {erro}
        </p>
      )}

      <form action={signIn} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className={labelClass}>
            E-mail
          </label>
          <input id="email" name="email" type="email" required className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="senha" className={labelClass}>
            Senha
          </label>
          <input id="senha" name="senha" type="password" required className={inputClass} />
        </div>
        <SubmitButton className="mt-2" pendingLabel="Entrando...">Entrar</SubmitButton>
      </form>

      <p className="text-center text-sm text-lp-muted">
        Ainda não tem uma conta?{" "}
        <Link href="/cadastro" className="font-medium text-lp-ink hover:text-lp-pink">
          Criar conta
        </Link>
      </p>
    </div>
  );
}
