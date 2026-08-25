# PRD — Ominia
**Carbon & Compliance OS para Usinas Sucroenergéticas — CBIO (RenovaBio/ANP) + Bonsucro**

Versão: 0.2 · Data: 2026-08-25
Substitui a versão 0.1 (hub ESG genérico) — ver nota de escopo abaixo.

---

## 0. Nota de escopo (por que este PRD substitui o anterior)

A versão 0.1 descrevia a Ominia como um hub ESG genérico em três pilares
(Dados → Compliance → Valor) para agroindústria em geral. Esta versão reduz o
escopo do MVP a um ICP específico e de altíssima dor regulatória: **usinas
sucroenergéticas**, com dois motores de compliance como âncora comercial:

- **CBIO / RenovaBio** (ANP) — obrigação com valor financeiro direto (crédito
  de descarbonização negociável em bolsa).
- **Bonsucro** — padrão de sustentabilidade exigido por compradores
  internacionais de açúcar e etanol.

Os três pilares do PRD anterior (Dados, Compliance, Valor) continuam válidos
como arquitetura conceitual — este documento os torna concretos: o **Data Hub**
e o **Evidence Hub** aqui descritos são a implementação do Pilar Dados, os
motores CBIO e Bonsucro são a implementação do Pilar Compliance, e o CBIO
estimado (crédito negociável) é a primeira prova viva do Pilar Valor.

---

## 1. Contexto regulatório crítico

A **RenovaCalc está em revisão no momento em que este PRD é escrito**. Em
17/08/2026 a ANP abriu participação social para novas versões da RenovaCalc,
decorrentes da Resolução ANP nº 984/2025 e da revisão das premissas da NEEA,
com prazo até 16/09/2026.

**Implicação de arquitetura, não negociável:** o motor CBIO precisa nascer com
**versionamento de metodologia**, nunca com fórmulas hard-coded. Se uma regra
mudar, o sistema precisa continuar respondendo "por que o resultado da safra
2025 era X e hoje mostra Y" (ver seção 12).

A ANP também exige que o produtor **arquive documentação comprobatória por no
mínimo cinco anos** e monitore/registre os dados anualmente — isso molda o
desenho do Evidence Hub desde o início (seção 5).

---

## 2. Arquitetura geral do produto

Não é "um módulo CBIO" e "um módulo Bonsucro" isolados. É uma plataforma com
coleta e validação únicas, reaproveitadas por múltiplas metodologias:

```
                         PLATAFORMA
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
   DATA HUB             EVIDENCE HUB        WORKFLOW HUB
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
                    ▼                 ▼
              MOTOR CBIO        MOTOR BONSUCRO
                    │                 │
                    ▼                 ▼
                NEEA/CBIO       INDICADORES BPS
                    │                 │
                    └────────┬────────┘
                             ▼
                    AUDITORIA / RELATÓRIO
```

**Lógica central:** coletar uma vez → validar uma vez → reutilizar os dados em
várias metodologias. Isso está alinhado ao movimento da própria ANP e da
Bonsucro de harmonizar as informações exigidas pelas duas frentes.

---

## 3. Módulos principais

| # | Módulo | Função |
|---|---|---|
| 01 | Organização | Empresas, usinas, fazendas, usuários e permissões |
| 02 | Data Hub | Coleta, importação e tratamento dos dados |
| 03 | Evidence Hub | Documentos e evidências |
| 04 | Motor GHG | Cálculo de emissões |
| 05 | Motor RenovaBio/CBIO | RenovaCalc, NEEA e CBIO |
| 06 | Motor Bonsucro | Indicadores e cálculos Bonsucro |
| 07 | Auditoria & Compliance | Pendências, evidências e rastreabilidade |
| 08 | Dashboards & Relatórios | Resultado, evolução e exportações |

---

## 4. Módulo 01 — Organização

Base do sistema, não o core, mas todo o resto depende dela.

- **Empresa** — CNPJ, razão social, unidades, responsáveis
- **Usina** — unidade produtora, localização, capacidade, rotas de produção
- **Fazendas/fornecedores** — produtor, propriedade, município, estado, CAR, área, fornecedor
- **Safras** — safra, período, área, produção, fornecedor
- **Usuários** — administrador, sustentabilidade, agrícola, industrial, fiscal, auditor, consultor

**Função:** o sistema precisa saber quem produziu o quê, onde, quando e em qual unidade.

---

## 5. Módulo 02 — Data Hub

Provavelmente o módulo mais importante do produto.

### 5.1 Coleta manual

- **Agrícola** — área plantada, produtividade, fertilizantes, calcário, gesso, defensivos, sementes, diesel, irrigação, operações agrícolas, resíduos
- **Industrial** — cana processada, etanol produzido, açúcar, energia elétrica, vapor, combustíveis, produtos químicos, água, resíduos, coprodutos
- **Logística** — distância, modal, combustível, quantidade transportada

### 5.2 Upload e pipeline

Aceita XLSX, CSV, XML, PDF, JPG/PNG e documentos diversos.

```
UPLOAD → OCR/Parser → Classificação → Extração → Normalização
       → Validação → Aprovação humana → DATA HUB
```

---

## 6. Módulo 03 — Evidence Hub

O que transforma o sistema de calculadora em plataforma de compliance. Cada
número precisa poder responder: **"Qual documento comprova isso?"**

```
Indicador → Dado → Fonte → Documento → Responsável → Data → Versão
```

Funções: upload, validade, vencimento, responsável, aprovação, rejeição,
comentário, histórico, versionamento, vínculo com indicador/fornecedor/safra.

> A ANP exige arquivamento de documentação comprobatória por no mínimo cinco
> anos, com monitoramento e registro anual — requisito de produto desde o
> dia 1, não um "nice to have" futuro.

---

## 7. Módulo 04 — Motor GHG

Motor matemático independente — não sabe o que é Bonsucro ou CBIO, apenas:
**atividade → fator → emissão**.

```
Emissão = Dado de atividade × Fator de emissão
Emissões totais = Σ emissões de todas as fontes
Intensidade GHG = Emissões totais / unidade funcional
```

A unidade funcional depende da metodologia consumidora (tCO₂e/t cana,
tCO₂e/t produto, gCO₂e/MJ, etc.).

**Submotores:** GHG-Agrícola, GHG-Industrial, GHG-Transporte, GHG-LUC (mudança
de uso do solo), GHG-Alocação (produto/coproduto/energia/massa) e um banco de
**fatores de emissão** versionado (fonte, unidade, validade).

---

## 8. Módulo 05 — Motor RenovaBio / CBIO

Aqui o rigor precisa ser máximo: a RenovaCalc calcula a intensidade de carbono
e determina a NEEA, que compara a intensidade do biocombustível com a do
combustível fóssil substituto. 8 submódulos:

| Sub | Nome | Função |
|---|---|---|
| CBIO-01 | Elegibilidade | % de volume elegível a partir de origem, fornecedor, propriedade, área, documentação e cadeia de custódia |
| CBIO-02 | Cadeia de custódia | Produtor → Propriedade → Intermediário → Cooperativa → Usina → Matéria-prima (crítico para grãos/óleos vegetais) |
| CBIO-03 | Perfil agrícola | Fertilizantes, calcário, gesso, diesel, defensivos, produtividade, área, operações |
| CBIO-04 | Perfil industrial | Matéria-prima, energia, combustível, processo, produto, coprodutos, rendimento |
| CBIO-05 | Intensidade de carbono (CI) | Via ACV — abordagem principal da RenovaCalc |
| CBIO-06 | NEEA | Diferença entre CI do fóssil substituto e CI do biocombustível |
| CBIO-07 | Fator de emissão de CBIO | Fórmula oficial ANP (abaixo) |
| CBIO-08 | Quantidade de CBIO | Volume comercializado × fator de emissão |

**Nota crítica de implementação:** a ausência de dados primários pode levar a
valores médios e fatores de penalização, **reduzindo a NEEA** — a ANP descreve
essa lógica explicitamente. O motor não pode ignorar esse caminho: precisa
tratar "dado ausente" como estado de primeira classe, não como erro.

#### Fórmulas oficiais (fonte: ANP, Informe Técnico nº 02/SBQ)

```
CI = Emissões de GEE do ciclo de vida / Energia do biocombustível     [gCO2eq/MJ]

NEEA = CI(combustível fóssil substituto) − CI(biocombustível)

f = NEEA × (f_elegível / 100) × ρ × PCI × 10⁻⁶

  onde:
  f          = fator para emissão de CBIO
  NEEA       = gCO2eq/MJ
  f_elegível = fração elegível (%)
  ρ          = massa específica (t/m³)
  PCI        = poder calorífico inferior (MJ/kg)

CBIO = Volume comercializado × Fator para emissão de CBIO
```

**Importante:** essas fórmulas não devem ser congeladas como código fixo. O
motor precisa reproduzir exatamente a versão vigente da RenovaCalc, incluindo
fatores, alocações, penalizações e parâmetros (ver seção 12, Versionamento).

**Exemplo hipotético (apenas para teste unitário de software, não como valor regulatório):**
NEEA = 60 gCO₂e/MJ · Elegibilidade = 90% · ρ = 0,79 t/m³ · PCI = 26,8 MJ/kg ·
Volume = 10.000 m³ → o software calcula o fator e a quantidade de CBIOs
correspondente.

---

## 9. Módulo 06 — Motor Bonsucro

Bonsucro não é apenas carbono. O Production Standard 5.2.1 cobre trabalhadores,
direitos trabalhistas, GHG e outras dimensões ambientais e produtivas. O
Calculator 5.2.4 acompanha o Standard 5.2.1 e é válido desde 01/01/2026.
9 motores internos:

| Sub | Nome | Foco |
|---|---|---|
| BNS-01 | Produtividade | Produção de cana / área; produção de produto / cana processada — limites e regras da versão vigente do Standard, não fórmula fixa |
| BNS-02 | Solo | Análise do solo, práticas de conservação, erosão, cobertura, manejo, fertilidade |
| BNS-03 | Água | Captação, consumo, irrigação, efluentes, descarga; indicador de produtividade da água |
| BNS-04 | Biodiversidade & Ecossistemas | Áreas protegidas, habitats, vegetação, mapas, APP, conservação, mudança de uso da terra, riscos |
| BNS-05 | GHG | **Reutiliza o Carbon Engine (Módulo 04)** — não cria um segundo calculador |
| BNS-06 | Insumos | Fertilizantes, defensivos, combustíveis, químicos — uso real vs. parâmetro Bonsucro |
| BNS-07 | Social & Trabalhista | Funcionários, terceirizados, treinamento, segurança, acidentes, jornada, direitos, remuneração, políticas, evidências |
| BNS-08 | Econômico | Produtividade, receita, custos, valor econômico, eficiência |
| BNS-09 | Compliance Bonsucro | Requisito → Dado → Cálculo → Meta → Status → Evidência |

```
BNS-05:  DATA HUB → CARBON ENGINE → resultado BNS-GHG   (reuso, não duplicação)
```

**Status de compliance (BNS-09):** 🟢 Conforme · 🟡 Atenção · 🔴 Não conforme ·
⚪ Sem dados

---

## 10. Módulo 07 — Auditoria

Transversal aos dois motores. Cada indicador carrega:

```
Indicador
├── Valor          ├── Fonte           ├── Data
├── Unidade        ├── Documento       ├── Status
├── Fórmula        ├── Responsável     └── Histórico
├── Metodologia
└── Versão
```

Funções: checklist, pendências, evidências, auditor externo, comentários,
aprovação, rejeição, trilha de alterações, versionamento, exportação —
fundamental porque a ANP exige manutenção de documentação e registros por
cinco anos (ver seção 1).

---

## 11. Módulo 08 — Dashboard

O cliente não quer ver 500 fórmulas. Quer ver:

**RenovaBio** — NEEA (gCO₂e/MJ) · Intensidade de carbono (gCO₂e/MJ) · Volume
elegível (%) · CBIO estimado

**Bonsucro** — Score geral (%) · Indicadores conformes (X/Y) · Pendências ·
Evidências vencendo

**GHG** — Emissões totais (tCO₂e)

---

## 12. Modelo de dados genérico

Não criar uma tabela `renovacalc_results` e jogar tudo lá. Criar um modelo
genérico que suporte múltiplas metodologias sem reconstrução:

```
organizations · facilities · farms · suppliers · harvests · products
activities · activity_records · emission_factors
methodologies · methodology_versions
indicators · calculations · calculation_results
documents · evidences · requirements · compliance_results
users · audit_logs
```

Isso permite adicionar RenovaBio 2026, RenovaBio 2027, Bonsucro 5.2.1,
Bonsucro 5.3, GHG Protocol, ISO 14064 etc. sem reconstruir o sistema.

### 12.1 Versionamento de metodologia (não negociável)

```
Methodology
   ├── RenovaBio
   │     ├── v2025
   │     └── v2026
   └── Bonsucro
         ├── v5.2.1
         └── futura versão
```

Cada cálculo salva: `calculation_id, methodology, methodology_version, inputs,
factors, formula_version, result, timestamp, user`.

Isso é o que permite responder "por que o resultado da safra 2025 era 58,4 e
hoje o sistema mostra 61,2?" — nível enterprise, e particularmente relevante
agora que a ANP está atualizando a RenovaCalc via Resolução 984/2025
(seção 1).

### 12.2 Banco de fórmulas

**`calculation_rules`** — metodologia, versão, indicador, fórmula, unidade de
entrada, unidade de saída, fonte, documento, vigência, status.

**`emission_factors`** — fator, valor, unidade, fonte, versão, validade.

O cálculo vira **configuração + engine**, não código espalhado pelo sistema.

---

## 13. Fontes oficiais ("fonte da verdade")

**RenovaBio / ANP**
- RenovaCalc e atualizações 2026 — ANP
- Resolução ANP nº 984/2025 e documentos de certificação
- FAQ oficial da ANP com cálculo de CBIO
- Informe Técnico nº 02/SBQ — Certificação (fórmula do fator de emissão)
- Informe Técnico nº 06/SBQ — Cadeia de custódia
- (ANP recomenda observar também os Informes Técnicos 3 e 4)

**Bonsucro**
- Production Standard 5.2.1
- Calculator 5.2.4 (válido desde 01/01/2026)

---

## 14. Roadmap de MVP

| Fase | Duração | Escopo |
|---|---|---|
| **1 — Core** | 20–30 dias | Organização, Data Hub, upload Excel/CSV, Evidence Hub, Carbon Engine, Dashboard |
| **2 — RenovaBio** | 15–20 dias | Elegibilidade, cadeia de custódia, perfil agrícola/industrial, CI, NEEA, fator CBIO, estimativa de CBIO |
| **3 — Bonsucro** | 15–20 dias | Indicadores, água, solo, biodiversidade, GHG (reuso), social, econômico, compliance |
| **4 — Automação** | — | IA para documentos, parsing de XML, classificação automática, alertas, workflows, integrações, API |

---

## 15. Visão do produto final

Não é "um software para calcular CBIO". É um **Carbon & Compliance OS para
usinas sucroenergéticas**, com quatro grandes motores:

```
DATA HUB (Excel · XML · PDF · ERP · Formulários)
        ↓
CARBON ENGINE (Atividade × Fator → GHG · CO2e · ACV)
        ↓
  ┌─────────────┬─────────────┐
  RENOVABIO         BONSUCRO
  CI · NEEA         GHG · Água · Solo
  Elegibilidade     Biodiversidade
  CBIO              Social · Econômico
  └─────────────┴─────────────┘
        ↓
AUDIT / COMPLIANCE (Evidências · Pendências · Auditoria · Histórico)
        ↓
REPORTING (CBIO · ESG · GHG · Bonsucro · Auditor)
```

**Ponto estratégico:** as fórmulas não vão direto para o Claude Code. Primeiro
a Resolução ANP 984/2025 + Informes Técnicos 02/03/04/06 + RenovaCalc vigente
+ Bonsucro 5.2.1/Calculator 5.2.4 viram uma **especificação matemática
versionada**. Só depois essa especificação é entregue para implementação.
Isso reduz o risco de construir um "SaaS de carbono" que calcula corretamente
do ponto de vista de programação, mas incorretamente do ponto de vista
regulatório — o risco que realmente pode matar a empresa neste produto.

---

## 16. Relação com o PRD anterior (pilares Dados/Compliance/Valor)

| Pilar (v0.1) | Implementação concreta (v0.2) |
|---|---|
| Dados | Módulos 01–03 (Organização, Data Hub, Evidence Hub) |
| Compliance | Módulos 04–07 (Motor GHG, Motor CBIO, Motor Bonsucro, Auditoria) |
| Valor | CBIO estimado (crédito negociável) + score Bonsucro como diferenciador comercial junto a compradores internacionais |

Os documentos [DATA-MODEL.md](DATA-MODEL.md),
[DATA-MODEL-COMPLIANCE.md](DATA-MODEL-COMPLIANCE.md) e
[DATA-MODEL-VALOR.md](DATA-MODEL-VALOR.md) precisam ser revisados à luz do
modelo de dados genérico da seção 12 antes da implementação.
