import Link from "next/link";
import { OminiaMark } from "@/components/brand/ominia-mark";
import { signIn } from "../actions";

const ERROS: Record<string, string> = {
  credenciais: "E-mail ou senha incorretos.",
};

const inputClass =
  "rounded-ui border border-graphite-light bg-graphite-deep px-3 py-2 text-sm text-whiteout outline-none focus:border-neon-glow";

const labelClass = "font-mono text-xs uppercase tracking-wide text-ash";

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const params = await searchParams;
  const erroParam = params.erro;
  const erro = typeof erroParam === "string" ? ERROS[erroParam] : undefined;

  return (
    <div className="flex flex-col gap-6">
      <OminiaMark height={22} />

      <div>
        <h1 className="text-xl font-medium tracking-tight text-whiteout">Entrar</h1>
        <p className="mt-1 text-sm text-ash">Acesse o hub ESG da sua empresa.</p>
      </div>

      {erro && (
        <p className="rounded-ui border border-system-warning/40 bg-system-warning/10 px-4 py-2 text-sm text-system-warning">
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
        <button
          type="submit"
          className="mt-2 rounded-full bg-whiteout px-7 py-3 text-sm font-medium text-graphite-deep transition-opacity hover:opacity-90"
        >
          Entrar
        </button>
      </form>

      <p className="text-center text-sm text-ash">
        Ainda não tem uma conta?{" "}
        <Link href="/cadastro" className="font-medium text-whiteout hover:text-neon-glow">
          Criar conta
        </Link>
      </p>
    </div>
  );
}
