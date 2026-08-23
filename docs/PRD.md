# PRD — Ominia
**Hub de Tecnologia ESG para Agroindústria**

Versão: 0.1 (rascunho inicial) · Data: 2026-08-22

---

## 1. Visão de produto

Ominia é um hub de tecnologia ESG estruturado em três pilares que se alimentam em
sequência:

**Dados → Compliance → Valor**

> Não existe conformidade confiável sem dado confiável, e não existe ESG que importe
> para o negócio sem que ele seja traduzido em valor financeiro, de capital, comercial e
> estratégico.

O ICP (perfil de cliente ideal) de entrada é a **agroindústria** — começando por
usinas e plantas industriais com operação intensiva em energia, água, resíduos e
cadeia de fornecedores —, num momento em que a legislação ambiental e tributária
brasileira está em transição ativa e cria tanto obrigação quanto oportunidade para
quem tem dado organizado.

### 1.1 Problema

Hoje, ESG em empresas de agroindústria é tocado em planilhas dispersas, e-mails com
anexos de fornecedores, PDFs de laudos e sistemas que não conversam entre si
(ERP, sistemas de campo, financeiro, jurídico). Isso gera três dores concretas:

1. **Dado não confiável** — sem trilha de auditoria, sem versionamento, sem
   cruzamento entre fontes (ex.: o volume de energia declarado bate com a fatura?).
2. **Compliance reativo** — relatórios e questionários (clientes, bancos,
   investidores, órgãos reguladores) são montados sob pressão de prazo, refazendo
   trabalho a cada pedido.
3. **ESG sem tradução em decisão de negócio** — a empresa sabe que "faz ESG", mas não
   sabe quanto isso economiza, quanto destrava em crédito, ou quanto abre/fecha
   portas comerciais.

### 1.2 Proposta de valor por pilar

| Pilar | Frase-chave | O que resolve |
|---|---|---|
| **Dados** | "Transformamos dados dispersos da empresa em uma base ESG confiável." | Centralização automática + validação + trilha de auditoria |
| **Compliance** | "Transformamos seus dados em conformidade e evidências." | Frameworks regulatórios e voluntários com evidência montada automaticamente |
| **Valor** | "Quanto o ESG está gerando ou economizando para sua empresa?" | ESG como inteligência de decisão, não como relatório |

---

## 2. Pilar 1 — Dados

### 2.1 O que centraliza (fontes)

- Energia, água e resíduos (consumo, geração, destinação)
- Emissões (escopo 1, 2 e 3)
- Fornecedores (cadastro, documentação, histórico de ocorrências)
- Indicadores sociais (força de trabalho, saúde e segurança, comunidade)
- Documentos e evidências (laudos, certificados, notas fiscais, contratos)
- Dados de unidades/filiais (multi-planta, consolidação por operação)
- Informações da cadeia de valor (fornecedores de fornecedores, quando disponível)

### 2.2 Como funciona

- **Coleta automática** — integrações com ERP, sistemas de campo/industriais,
  planilhas legadas (via importação estruturada, não como fonte permanente) e
  portais de fornecedores.
- **Validação** — regras de consistência (unidades, faixas plausíveis, duplicidade) e
  detecção de lacunas antes que o dado entre na base.
- **Cruzamento** — o mesmo indicador é conferido contra múltiplas fontes (ex.: energia
  declarada operacionalmente vs. fatura vs. medição), sinalizando divergências em vez
  de aceitar o dado cegamente.
- **Trilha de auditoria** — cada valor carrega origem, timestamp, quem validou e
  histórico de alterações. Isso é o que torna o dado defensável perante auditor,
  banco ou órgão regulador — e é o principal ponto de diferenciação frente a
  "ESG em planilha".

### 2.3 Por que isso importa agora

O mercado está migrando de "ter um relatório de sustentabilidade" para "ter dado
auditável de sustentabilidade" — bancos, investidores e grandes compradores da cadeia
já pedem evidência, não afirmação. Qualidade e auditabilidade do dado deixam de ser
diferencial e passam a ser pré-requisito.

---

## 3. Pilar 2 — Compliance

> Modelo de dados detalhado em [docs/DATA-MODEL-COMPLIANCE.md](DATA-MODEL-COMPLIANCE.md)
> (frameworks, requisitos, matriz de riscos, políticas, questionários, relatórios e
> asseguração).

### 3.1 Frameworks e obrigações cobertas

- **IFRS S1 / S2** (normas do ISSB sobre divulgação de sustentabilidade e clima)
- **CBPS** (Comitê Brasileiro de Pronunciamentos de Sustentabilidade — convergência
  brasileira do IFRS S1/S2, com adoção faseada para companhias abertas)
- **GRI** (Global Reporting Initiative)
- Inventário de emissões (GEE, metodologia GHG Protocol)
- Matriz de riscos ESG
- Políticas internas (ambientais, sociais, anticorrupção, cadeia de fornecedores)
- Evidências documentais por indicador
- Questionários de clientes, bancos e investidores (respondidos a partir da base
  única, não remontados do zero a cada pedido)
- Relatórios (voluntários e regulatórios)
- Preparação para auditoria/asseguração externa (third-party assurance)

> **Nota de produto:** framework regulatório brasileiro (CBPS, marco do mercado de
> carbono, reforma tributária, licenciamento ambiental) está em mudança ativa em
> 2026. O PRD assume o cenário conhecido até o início deste projeto — a lista de
> normas e prazos precisa de validação jurídica periódica antes de virar
> compromisso de produto (ver seção 8, Riscos).

### 3.2 Diferencial: pacote de evidências gerado por IA

Para cada indicador de compliance, o sistema monta automaticamente o conjunto de
evidências que sustenta aquele número — sem que alguém precise garimpar e-mails e
pastas manualmente.

**Exemplo de card de indicador:**

```
Indicador:          Emissões de GEE
Status:             92% completo
Evidências:         14 documentos
Fonte:              ERP + fornecedor + documento fiscal
Responsável:        Operações
Última validação:   12/08/2026
```

Cada indicador tem: % de completude, lista de evidências vinculadas, fonte de cada
dado que compõe o número, responsável interno e data da última validação — dando
visibilidade tanto para quem responde a due diligence quanto para quem audita
internamente antes de expor o número.

---

## 4. Pilar 3 — Valor (o produto mais importante do hub)

> Modelo de dados detalhado em [docs/DATA-MODEL-VALOR.md](DATA-MODEL-VALOR.md)
> (ledger de valor, metas, projetos, cenários climáticos, elegibilidade de crédito
> verde e score ESG de fornecedores).

A tese central: **ESG não é "ser", é "gerar ou economizar"** — e o hub precisa provar
isso em número, não em discurso.

### 4.1 Financeiro
- Economia de energia
- Redução de desperdícios
- Redução de emissões (e custo evitado associado, quando houver precificação de
  carbono aplicável)
- Eficiência operacional

### 4.2 Capital
- Elegibilidade para linhas verdes (crédito rural sustentável, linhas de bancos de
  fomento e comerciais com taxa vinculada a desempenho ESG)
- Preparação para financiamento sustentável (green/sustainability-linked bonds e
  empréstimos)
- Indicadores estruturados para bancos e investidores
- Melhoria do perfil de risco de crédito

### 4.3 Comercial
- Score ESG para fornecedores (e do próprio negócio frente a seus compradores)
- Atendimento a requisitos de clientes (grandes compradores da cadeia, varejo,
  trading)
- Qualificação para cadeias globais de suprimento
- Preparação para exportação (due diligence de cadeia, rastreabilidade — relevante
  para exigências como as de desmatamento zero em mercados compradores)

### 4.4 Estratégia
- Metas de descarbonização
- Cenários climáticos (stress test de transição e physical risk)
- Custo de transição
- ROI de projetos sustentáveis

### 4.5 Por que isso é o produto, não um "extra"

O mercado está saindo de **"ESG como relatório"** para **"ESG como inteligência para
decisão"**. Capital, informação qualificada, descarbonização e natureza são vetores
centrais da agenda empresarial atual — o hub precisa devolver, para cada dado
coletado e cada item de compliance resolvido, uma resposta objetiva de quanto isso
vale para a empresa.

---

## 5. Fluxo do produto (como os pilares se conectam)

```
DADOS                    COMPLIANCE                  VALOR
──────                   ──────────                  ─────
Coleta automática   →    Frameworks (IFRS S1/S2,  →   Financeiro (economia,
Validação                CBPS, GRI, GEE)              eficiência)
Cruzamento          →    Evidências por indicador →   Capital (crédito, risco)
Trilha de auditoria      Questionários e relatórios   Comercial (score, export)
                         Auditoria/asseguração         Estratégia (metas, ROI)
```

Um mesmo dado bruto sobe a "escada" e vira, no topo, uma resposta de negócio. Isso é
o que justifica o hub ser uma plataforma única em vez de três produtos separados: o
valor do Pilar 3 só é confiável porque nasce do dado auditável do Pilar 1, e o
compliance do Pilar 2 é o que dá a evidência que sustenta o valor apresentado a
banco/cliente/investidor.

---

## 6. ICP e contexto regulatório (agroindústria, Brasil)

### 6.1 Por que agroindústria como entrada

- Operações intensivas em energia, água, resíduos e emissões — todos os eixos do
  Pilar Dados já existem como dor operacional, não como exercício teórico.
- Cadeia de fornecedores extensa e heterogênea (produtores rurais, cooperativas,
  transportadoras) — dor real de rastreabilidade e score de fornecedor.
- Pressão regulatória e comercial crescente: exportação, financiamento rural
  sustentável e exigências de compradores internacionais empurram o setor a
  produzir evidência, não só discurso.

### 6.2 Movimento regulatório recente a monitorar (não travar como verdade absoluta)

Estes são os vetores regulatórios brasileiros mais relevantes para o discurso de
compliance do produto — precisam de validação jurídica contínua, pois o cenário
segue em mudança:

- **CBPS / convergência com IFRS S1-S2** — adoção faseada de divulgação de
  sustentabilidade por companhias abertas, com tendência de efeito cascata sobre
  fornecedores e parceiros de crédito.
- **Mercado regulado de carbono (SBCE)** — cria obrigação de inventário e reporte de
  emissões para instalações acima de limiar definido, relevante para plantas
  industriais do setor (ex.: usinas).
- **Reforma tributária (IBS/CBS e Imposto Seletivo)** — mudança na forma de tributar
  consumo, com potencial de diferenciação para atividades com externalidade
  ambiental — relevante para o discurso financeiro do Pilar Valor.
- **Regularização ambiental / CAR e Código Florestal** — base de dado fundiário e
  ambiental que qualquer score de fornecedor rural precisa cruzar.
- **Exigências de desmatamento zero de mercados compradores (ex.: UE)** — pressão
  comercial de rastreabilidade que reforça a dor do Pilar Compliance/Valor
  comercial.

**Ação de produto:** manter uma camada de "biblioteca de frameworks" desacoplada do
motor de dados, para que mudanças de norma (novo prazo, novo limiar, nova
obrigação) sejam configuração, não retrabalho de arquitetura.

---

## 7. Roadmap sugerido (fases)

| Fase | Foco | Entregável |
|---|---|---|
| **1 — Dados** | Fundação | Centralização, validação, cruzamento e trilha de auditoria para as 7 fontes listadas na seção 2.1 |
| **2 — Compliance** | Cima do dado validado | Biblioteca de frameworks (IFRS S1/S2, CBPS, GRI, GEE), matriz de riscos, geração automática de pacote de evidências por indicador |
| **3 — Valor** | Produto de decisão | Módulos financeiro, capital, comercial e estratégia consumindo os dados já validados e os indicadores já em compliance |

A ordem não é arbitrária: Valor depende de Compliance ser confiável, e Compliance
depende de Dados ser auditável. Construir Valor antes de Dados estar sólido produz
números que ninguém em banco/auditoria vai aceitar.

---

## 8. Riscos e mitigação

| Risco | Mitigação |
|---|---|
| Cenário regulatório muda rápido (normas, prazos, limiares) | Frameworks como configuração, não como código; revisão jurídica periódica agendada |
| Dado de origem (ERP, fornecedor) é ele mesmo não confiável | Cruzamento multi-fonte e sinalização de divergência em vez de aceitação cega (seção 2.2) |
| "Pacote de evidências por IA" gera evidência incompleta ou incorreta | IA monta o pacote, mas o indicador sempre expõe fonte + responsável + status — validação humana antes de expor a auditor/banco fica explícita na UI |
| Cliente entende ESG só como obrigação, não vê o Pilar Valor | Pilar Valor é vendido como resposta central ("quanto isso vale"), não como módulo adicional — refletir isso na priorização comercial e no onboarding |

---

## 9. Métricas de sucesso (hipóteses iniciais, a validar)

- % de indicadores de compliance com evidência completa (meta de "100% completo" por
  indicador, não só por relatório)
- Tempo para responder a um questionário de cliente/banco (antes vs. depois do hub)
- Valor financeiro/capital/comercial atribuído e reportado ao cliente por trimestre
  (prova viva do Pilar Valor)
- Taxa de divergência detectada no cruzamento de dados (sinal de que a validação
  está funcionando, não de que o cliente tem dado ruim)

---

## 10. Próximos passos

1. Validar com o usuário: nome definitivo do produto (memória de sessão anterior
   registrava o nome "Omnia"; esta sessão usa "Ominia" — confirmar antes de fixar
   marca, domínio e repositório).
2. ~~Detalhar o modelo de dados do Pilar 1~~ — feito em
   [docs/DATA-MODEL.md](DATA-MODEL.md) (entidades: unidade/filial, fornecedor,
   indicador, valor, fonte, divergência, evidência, auditoria).
3. Levantamento jurídico específico (com fonte primária, não best-effort de IA) dos
   prazos e obrigações citados na seção 6.2, para transformar a "biblioteca de
   frameworks" em requisito concreto de produto.
4. Definir MVP: recomenda-se iniciar pelo Pilar Dados fechado para um único ICP
   (ex.: usina de cana-de-açúcar) antes de expandir frameworks de compliance.
