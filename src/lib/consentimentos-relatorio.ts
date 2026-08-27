export type ConsentimentoRelatorio = {
  chave: string;
  titulo: string;
  texto: string;
};

/**
 * Avisos exibidos passo a passo antes de publicar um Registro de Integridade.
 * A mesma lista de `chave`s é validada no servidor (ver actions.ts) — o cliente
 * não pode publicar sem ter confirmado exatamente estes avisos.
 */
export const CONSENTIMENTOS_RELATORIO: ConsentimentoRelatorio[] = [
  {
    chave: "publico",
    titulo: "Este relatório será público",
    texto:
      "Qualquer pessoa com o link poderá acessá-lo — incluindo concorrentes, compradores, bancos e órgãos reguladores. Não é uma área restrita.",
  },
  {
    chave: "dados_sensiveis",
    titulo: "Revise dados comercialmente sensíveis",
    texto:
      "Volumes de produção, preços e dados de fornecedores podem ser informação estratégica. Confirme que está de acordo em tornar este cálculo específico público.",
  },
  {
    chave: "imutavel",
    titulo: "Depois de publicado, não pode ser editado",
    texto:
      "Nenhum usuário da sua empresa — nem administradores — poderá editar ou remover este relatório depois de publicado. Uma correção só pode ser feita pela equipe da Ominia, mediante solicitação formal.",
  },
  {
    chave: "nao_e_certificacao",
    titulo: "Isto não é uma certificação de conformidade",
    texto:
      "O selo atesta que os dados não foram alterados desde a publicação e qual metodologia foi usada no cálculo — não substitui e não equivale a uma certificação RenovaBio (ANP) ou Bonsucro, que exigem auditoria por um organismo acreditado.",
  },
  {
    chave: "autorizacao",
    titulo: "Confirmação de autorização",
    texto: "Confirmo que tenho autorização para publicar este relatório em nome da minha empresa.",
  },
];
