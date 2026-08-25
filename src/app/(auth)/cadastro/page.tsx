import Link from "next/link";
import Image from "next/image";
import { signUp } from "../actions";

const ERROS: Record<string, string> = {
  dados_invalidos: "Preencha todos os campos (senha com pelo menos 8 caracteres).",
  email_em_uso: "Já existe uma conta com este e-mail.",
};

const inputClass =
  "rounded-xl border border-lp-line bg-white px-3 py-2 text-sm text-lp-ink outline-none focus:border-lp-pink";

const labelClass = "font-mono text-xs uppercase tracking-wide text-lp-muted";

export default async function CadastroPage({ searchParams }: PageProps<"/cadastro">) {
  const params = await searchParams;
  const erroParam = params.erro;
  const erro = typeof erroParam === "string" ? ERROS[erroParam] : undefined;

  return (
    <div className="flex flex-col gap-6">
      <Image src="/brand/ominia-wordmark-dark.png" alt="Ominia" width={116} height={21} priority className="h-[21px] w-auto" />

      <div>
        <h1 className="text-xl font-medium tracking-tight text-lp-ink">Criar conta</h1>
        <p className="mt-1 text-sm text-lp-muted">
          Comece a organizar os dados ESG da sua empresa.
        </p>
      </div>

      {erro && (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">
          {erro}
        </p>
      )}

      <form action={signUp} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="nomeEmpresa" className={labelClass}>
            Nome da empresa
          </label>
          <input id="nomeEmpresa" name="nomeEmpresa" required className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cnpj" className={labelClass}>
            CNPJ
          </label>
          <input id="cnpj" name="cnpj" required className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="nome" className={labelClass}>
            Seu nome
          </label>
          <input id="nome" name="nome" required className={inputClass} />
        </div>
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
          <input
            id="senha"
            name="senha"
            type="password"
            required
            minLength={8}
            className={inputClass}
          />
        </div>
        <button
          type="submit"
          className="mt-2 rounded-full bg-lp-pink px-7 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Criar conta
        </button>
      </form>

      <p className="text-center text-sm text-lp-muted">
        Já tem uma conta?{" "}
        <Link href="/login" className="font-medium text-lp-ink hover:text-lp-pink">
          Entrar
        </Link>
      </p>
    </div>
  );
}
