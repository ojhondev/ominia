export type RegistroLog = {
  data: string;
  evento: string;
  fonte: string;
};

export type Formula = {
  nome: string;
  expressao: string;
  onde: string;
};

export type ModuloMercado = {
  slug: string;
  titulo: string;
  resumo: string;
  destaques: string[];
  registro: RegistroLog[];
  formulas?: Formula[];
};

export const modulosMercado: ModuloMercado[] = [
  {
    slug: "plataforma",
    titulo: "Plataforma geral",
    resumo:
      "Como a Ominia trata o dado da sua empresa por baixo do capô — isolamento entre clientes, trilha de auditoria e onde cada informação fica guardada.",
    destaques: [
      "Isolamento por empresa em toda leitura e escrita",
      "Trilha de auditoria em cada criação, cálculo e aprovação",
      "Documentos e evidências com upload real, não só metadado",
      "Acesso a dados administrativos restrito a admins da própria empresa",
    ],
    registro: [
      {
        data: "26/08/2026",
        evento: "Verificação de isolamento entre empresas testada com duas contas reais e adulteração direta de URL — sem vazamento de dado.",
        fonte: "Auditoria interna de produto",
      },
      {
        data: "26/08/2026",
        evento: "Upload de documentos passou a usar armazenamento de arquivo real (Vercel Blob), substituindo referência somente em texto.",
        fonte: "Changelog de produto",
      },
      {
        data: "25/08/2026",
        evento: "Modelo de dados genérico e versionado por metodologia implementado, permitindo adicionar novas normas sem reconstrução do sistema.",
        fonte: "PRD interno — seção 12",
      },
    ],
  },
  {
    slug: "emissoes",
    titulo: "Módulo Inventário de Emissões GEE",
    resumo:
      "O motor de emissões é intencionalmente simples e auditável: não inventa fator nenhum, só aplica o que está registrado.",
    destaques: [
      "Fórmula única, sem exceção por cliente",
      "Banco de fatores de emissão versionado, com fonte e validade",
      "Submotores por origem: agrícola, industrial, transporte, mudança de uso do solo",
      "Reaproveitado por outros módulos — nunca duplicado",
    ],
    registro: [
      {
        data: "Vigente",
        evento: "Metodologia de referência: GHG Protocol Corporate Standard.",
        fonte: "GHG Protocol",
      },
      {
        data: "26/08/2026",
        evento: "Fatores de emissão passaram a poder ser próprios da empresa (medição real) além do catálogo global de referência.",
        fonte: "Changelog de produto",
      },
    ],
    formulas: [
      {
        nome: "Emissão por atividade",
        expressao: "Emissão = Dado de atividade × Fator de emissão",
        onde: "Todo registro do Data Hub, ao ser cruzado com um fator cadastrado",
      },
      {
        nome: "Intensidade de GHG",
        expressao: "Intensidade = Emissões totais ÷ unidade funcional (t cana, t produto, MJ)",
        onde: "Consolidação por safra ou por usina",
      },
    ],
  },
  {
    slug: "bonsucro",
    titulo: "Módulo de Certificação Bonsucro",
    resumo:
      "Nove frentes do Production Standard, cada uma com um requisito, um status e a evidência que sustenta esse status.",
    destaques: [
      "9 sub-requisitos (BNS-01 a BNS-09) rastreados por usina",
      "GHG do Bonsucro reaproveita o mesmo motor de emissões — não duplica cálculo",
      "Score de conformidade calculado, nunca digitado à mão",
      "Cada requisito aceita evidência documental vinculada",
    ],
    registro: [
      {
        data: "01/01/2026",
        evento: "Versão vigente: Production Standard 5.2.1 / Calculator 5.2.4.",
        fonte: "Bonsucro",
      },
      {
        data: "26/08/2026",
        evento: "Implementados os cálculos de produtividade agrícola (BNS-01), solo (BNS-02), água (BNS-03), biodiversidade (BNS-04), insumos (BNS-06), segurança (BNS-07) e econômico (BNS-08) a partir de dado real do cliente.",
        fonte: "Changelog de produto",
      },
    ],
    formulas: [
      {
        nome: "BNS-01 · Produtividade agrícola",
        expressao: "Produtividade = Produção de cana ÷ Área colhida",
        onde: "Calculado a partir dos dados já cadastrados na safra",
      },
      {
        nome: "BNS-03 · Produtividade da água",
        expressao: "Produtividade da água = Produção ÷ Água consumida",
        onde: "Requer volume de água consumida informado pelo cliente",
      },
    ],
  },
  {
    slug: "cbios",
    titulo: "Módulo de Créditos CBios",
    resumo:
      "As fórmulas usadas são as fórmulas oficiais da ANP, ponto — não uma aproximação nossa.",
    destaques: [
      "Fórmula de NEEA, fator de emissão e quantidade de CBIO conforme Informe Técnico nº 02/SBQ",
      "Todo cálculo grava a versão de metodologia usada — resultados antigos nunca mudam retroativamente",
      "CI via ACV e elegibilidade ainda são inseridos manualmente pelo cliente",
      "Metodologia sinalizada como \"em revisão\" enquanto a ANP não publica a nova versão",
    ],
    registro: [
      {
        data: "17/08/2026",
        evento: "ANP abriu participação social para novas versões da RenovaCalc, decorrente da Resolução nº 984/2025 e da revisão das premissas da NEEA — prazo até 16/09/2026.",
        fonte: "ANP",
      },
      {
        data: "26/08/2026",
        evento: "Motor de cálculo de NEEA, fator e quantidade de CBIO implementado com a fórmula oficial, testado contra conta na mão.",
        fonte: "Changelog de produto",
      },
    ],
    formulas: [
      {
        nome: "NEEA",
        expressao: "NEEA = CI(combustível fóssil substituto) − CI(biocombustível)",
        onde: "Informe Técnico nº 02/SBQ",
      },
      {
        nome: "Fator de emissão de CBIO",
        expressao: "f = NEEA × (fração elegível ÷ 100) × ρ × PCI × 10⁻⁶",
        onde: "Informe Técnico nº 02/SBQ",
      },
      {
        nome: "Quantidade de CBIO",
        expressao: "CBIO = Volume comercializado × Fator para emissão de CBIO",
        onde: "FAQ oficial da ANP",
      },
    ],
  },
  {
    slug: "auditoria",
    titulo: "Módulo de Trilha de Auditoria e Evidências",
    resumo:
      "A pergunta que todo auditor faz — \"qual documento comprova isso?\" — já tem resposta antes de ser feita.",
    destaques: [
      "Toda criação, cálculo, aprovação e mudança de status fica registrada com autor e data",
      "Evidência vinculada diretamente à usina, fazenda ou safra que ela comprova",
      "Aprovação e rejeição de evidência com trilha própria",
      "Nada é sobrescrito silenciosamente — o histórico fica",
    ],
    registro: [
      {
        data: "26/08/2026",
        evento: "Confirmação de compliance por usina passou a ser calculada em tempo real a partir dos requisitos avaliados.",
        fonte: "Changelog de produto",
      },
      {
        data: "Requisito legal",
        evento: "A ANP exige arquivamento de documentação comprobatória por no mínimo cinco anos, com monitoramento e registro anual.",
        fonte: "ANP",
      },
    ],
  },
  {
    slug: "calculadoras",
    titulo: "Calculadoras",
    resumo:
      "Todas as fórmulas que a Ominia usa, publicadas — sem caixa-preta.",
    destaques: [
      "Mesmas fórmulas usadas dentro da plataforma, sem simplificação para a página pública",
      "Fonte oficial citada em cada fórmula",
      "Unidade de entrada e saída explícita",
      "Atualizado sempre que a metodologia de origem muda",
    ],
    registro: [
      {
        data: "26/08/2026",
        evento: "Página pública de fórmulas publicada, espelhando o motor de cálculo interno.",
        fonte: "Changelog de produto",
      },
    ],
    formulas: [
      {
        nome: "Emissão por atividade (GHG)",
        expressao: "Emissão = Dado de atividade × Fator de emissão",
        onde: "GHG Protocol",
      },
      {
        nome: "NEEA (RenovaBio)",
        expressao: "NEEA = CI(fóssil substituto) − CI(biocombustível)",
        onde: "ANP — Informe Técnico nº 02/SBQ",
      },
      {
        nome: "Fator de emissão de CBIO",
        expressao: "f = NEEA × (fração elegível ÷ 100) × ρ × PCI × 10⁻⁶",
        onde: "ANP — Informe Técnico nº 02/SBQ",
      },
      {
        nome: "Quantidade de CBIO",
        expressao: "CBIO = Volume comercializado × Fator para emissão de CBIO",
        onde: "ANP — FAQ oficial",
      },
      {
        nome: "Produtividade agrícola (Bonsucro BNS-01)",
        expressao: "Produtividade = Produção de cana ÷ Área colhida",
        onde: "Bonsucro Production Standard 5.2.1",
      },
      {
        nome: "Produtividade da água (Bonsucro BNS-03)",
        expressao: "Produtividade da água = Produção ÷ Água consumida",
        onde: "Bonsucro Production Standard 5.2.1",
      },
    ],
  },
];

export function getModuloMercado(slug: string) {
  return modulosMercado.find((m) => m.slug === slug);
}
