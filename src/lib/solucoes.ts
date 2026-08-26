export type Solucao = {
  slug: string;
  titulo: string;
  resumo: string;
  imagem: string;
  funcionalidades: string[];
  porSegmento: Record<"Sucroenergético" | "Grãos" | "Proteína Animal" | "Bioenergia", string>;
};

export const solucoes: Solucao[] = [
  {
    slug: "emissoes",
    titulo: "Inventário de Emissões GEE",
    resumo:
      "Levantamos o inventário de emissões da sua operação seguindo o GHG Protocol, com trilha de auditoria completa — pronto para relatórios, certificadoras e bancos.",
    imagem: "/marketing/solucao-emissoes.png",
    funcionalidades: [
      "Coleta automatizada de dados",
      "Cálculo Escopo 1, 2 e 3",
      "Metodologia GHG Protocol",
      "Relatório pronto para auditoria",
    ],
    porSegmento: {
      Sucroenergético:
        "Emissões de moagem, cogeração e transporte de cana consolidadas em um inventário único, pronto para relatar a compradores e financiadores.",
      Grãos:
        "Do secador ao silo: emissões de secagem, armazenagem e logística de grãos organizadas por safra e por unidade.",
      "Proteína Animal":
        "Emissões de criação, abate e tratamento de dejetos calculadas com os fatores certos para cada etapa da cadeia.",
      Bioenergia:
        "Emissões da geração de biogás e biometano rastreadas da biomassa de entrada até a energia entregue.",
    },
  },
  {
    slug: "bonsucro",
    titulo: "Certificação Bonsucro",
    resumo:
      "Estruturamos o dossiê e as evidências necessárias para a certificação Bonsucro, do cadastro de fornecedores ao relatório final de auditoria.",
    imagem: "/marketing/solucao-bonsucro.png",
    funcionalidades: [
      "Cadastro de fornecedores",
      "Evidências organizadas",
      "Checklist de conformidade",
      "Dossiê para auditoria externa",
    ],
    porSegmento: {
      Sucroenergético:
        "O padrão foi feito para cana — organize fornecedores, água, solo e segurança do trabalho em um só lugar para a auditoria.",
      Grãos:
        "Prepare evidências de manejo e cadeia de fornecedores de grãos nos moldes que uma certificação como a Bonsucro exige.",
      "Proteína Animal":
        "Estruture o dossiê de bem-estar animal, efluentes e segurança do trabalho com o mesmo rigor de evidência do padrão Bonsucro.",
      Bioenergia:
        "Organize os critérios ambientais e sociais da geração de bioenergia em um checklist de conformidade auditável.",
    },
  },
  {
    slug: "cbios",
    titulo: "Créditos CBios (RenovaBio)",
    resumo:
      "Organizamos os dados necessários para a emissão de CBios dentro do RenovaBio, com rastreabilidade completa da produção ao crédito emitido.",
    imagem: "/marketing/solucao-cbios.png",
    funcionalidades: [
      "Cálculo de nota de eficiência",
      "Rastreabilidade do biocombustível",
      "Emissão de CBios simplificada",
      "Acompanhamento no mercado",
    ],
    porSegmento: {
      Sucroenergético: "Etanol e bioeletricidade com rastreabilidade completa da cana até a emissão do CBio.",
      Grãos: "Biodiesel e etanol de milho: intensidade de carbono calculada com os dados reais da sua originação de grãos.",
      "Proteína Animal":
        "Biometano de dejetos animais qualificado para o RenovaBio, com cadeia de custódia documentada desde a granja.",
      Bioenergia: "Biomassa florestal e resíduos agrícolas com nota de eficiência energético-ambiental calculada por lote.",
    },
  },
  {
    slug: "auditoria",
    titulo: "Trilha de Auditoria e Evidências",
    resumo:
      "Cada número gerado já nasce com origem, responsável e data registrados — pronto para qualquer auditoria externa, sem dossiê de última hora.",
    imagem: "/marketing/solucao-auditoria.png",
    funcionalidades: [
      "Origem de cada número",
      "Responsável e data registrados",
      "Evidências centralizadas",
      "Exportação para auditor",
    ],
    porSegmento: {
      Sucroenergético:
        "Cada tonelada de cana processada já sai com origem, data e responsável registrados — sem garimpar e-mail antes da auditoria da usina.",
      Grãos: "Da originação ao silo, cada lote de grãos carrega o documento que comprova o número, pronto para o comprador exigir.",
      "Proteína Animal":
        "Vacinação, abate e destinação de dejetos com evidência anexada a cada registro — não apenas uma planilha de controle.",
      Bioenergia: "Volume de biomassa recebido e energia gerada com o laudo correspondente sempre a um clique de distância.",
    },
  },
];

export function getSolucao(slug: string): Solucao | undefined {
  return solucoes.find((s) => s.slug === slug);
}
