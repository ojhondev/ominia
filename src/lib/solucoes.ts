export type Solucao = {
  slug: string;
  titulo: string;
  resumo: string;
  funcionalidades: string[];
};

export const solucoes: Solucao[] = [
  {
    slug: "emissoes",
    titulo: "Inventário de Emissões GEE",
    resumo:
      "Levantamos o inventário de emissões da sua operação seguindo o GHG Protocol, com trilha de auditoria completa — pronto para relatórios, certificadoras e bancos.",
    funcionalidades: [
      "Coleta automatizada de dados",
      "Cálculo Escopo 1, 2 e 3",
      "Metodologia GHG Protocol",
      "Relatório pronto para auditoria",
    ],
  },
  {
    slug: "bonsucro",
    titulo: "Certificação Bonsucro",
    resumo:
      "Estruturamos o dossiê e as evidências necessárias para a certificação Bonsucro, do cadastro de fornecedores ao relatório final de auditoria.",
    funcionalidades: [
      "Cadastro de fornecedores",
      "Evidências organizadas",
      "Checklist de conformidade",
      "Dossiê para auditoria externa",
    ],
  },
  {
    slug: "cbios",
    titulo: "Créditos CBios (RenovaBio)",
    resumo:
      "Organizamos os dados necessários para a emissão de CBios dentro do RenovaBio, com rastreabilidade completa da produção ao crédito emitido.",
    funcionalidades: [
      "Cálculo de nota de eficiência",
      "Rastreabilidade do biocombustível",
      "Emissão de CBios simplificada",
      "Acompanhamento no mercado",
    ],
  },
  {
    slug: "auditoria",
    titulo: "Trilha de Auditoria e Evidências",
    resumo:
      "Cada número gerado já nasce com origem, responsável e data registrados — pronto para qualquer auditoria externa, sem dossiê de última hora.",
    funcionalidades: [
      "Origem de cada número",
      "Responsável e data registrados",
      "Evidências centralizadas",
      "Exportação para auditor",
    ],
  },
  {
    slug: "score",
    titulo: "Score ESG de Fornecedores",
    resumo:
      "Avaliamos sua cadeia de fornecedores com critérios claros e evidência por trás de cada nota — visibilidade real, não uma pontuação genérica.",
    funcionalidades: [
      "Avaliação estruturada",
      "Critérios claros e auditáveis",
      "Evidência por trás de cada nota",
      "Comparação entre fornecedores",
    ],
  },
];

export function getSolucao(slug: string): Solucao | undefined {
  return solucoes.find((s) => s.slug === slug);
}
