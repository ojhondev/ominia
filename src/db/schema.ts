import {
  pgTable,
  uuid,
  text,
  integer,
  numeric,
  boolean,
  date,
  timestamp,
  jsonb,
  pgEnum,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";

// ---------------------------------------------------------------------------
// Enums — reservados para estados de ciclo de vida realmente fechados. Campos
// de classificação abertos (categoria, tipo_fonte, escopo_tipo, entidade_tipo,
// subtipo) ficam como text: crescem por cadastro, não por migration — ver
// docs/DATA-MODEL.md secao 3.4 e docs/DATA-MODEL-COMPLIANCE.md secao 3.1.
// ---------------------------------------------------------------------------

export const unidadeStatusEnum = pgEnum("unidade_status", ["ativa", "inativa"]);
export const fornecedorStatusEnum = pgEnum("fornecedor_status_cadastro", [
  "pendente",
  "ativo",
  "bloqueado",
]);
export const valorIndicadorStatusEnum = pgEnum("valor_indicador_status", [
  "pendente",
  "validado",
  "divergente",
  "rejeitado",
]);
export const divergenciaStatusEnum = pgEnum("divergencia_status", [
  "aberta",
  "em_analise",
  "resolvida",
]);
export const usuarioPapelEnum = pgEnum("usuario_papel", [
  "admin",
  "operacoes",
  "compliance",
  "fornecedor",
]);
export const frameworkTipoEnum = pgEnum("framework_tipo", ["regulatorio", "voluntario"]);
export const riscoStatusEnum = pgEnum("risco_status", [
  "identificado",
  "em_mitigacao",
  "mitigado",
  "aceito",
]);
export const politicaStatusEnum = pgEnum("politica_status", [
  "rascunho",
  "vigente",
  "em_revisao",
  "revogada",
]);
export const questionarioStatusEnum = pgEnum("questionario_status", [
  "recebido",
  "em_preenchimento",
  "respondido",
  "enviado",
]);
export const respostaOrigemEnum = pgEnum("resposta_origem", [
  "sugerida_ia",
  "editada_manual",
]);
export const relatorioStatusEnum = pgEnum("relatorio_status", [
  "rascunho",
  "em_revisao",
  "publicado",
  "substituido",
]);
export const assegurancaTipoEnum = pgEnum("asseguranca_tipo", ["limitada", "razoavel"]);
export const assegurancaParecerEnum = pgEnum("asseguranca_parecer", [
  "aprovado",
  "aprovado_com_ressalvas",
  "reprovado",
]);
export const metaStatusEnum = pgEnum("meta_status", [
  "em_andamento",
  "atingida",
  "nao_atingida",
  "revisada",
]);
export const projetoStatusEnum = pgEnum("projeto_status", [
  "planejado",
  "em_execucao",
  "concluido",
  "cancelado",
]);
export const cenarioTipoRiscoEnum = pgEnum("cenario_tipo_risco", ["fisico", "transicao"]);
export const elegibilidadeStatusEnum = pgEnum("elegibilidade_status", [
  "elegivel",
  "elegivel_parcial",
  "nao_elegivel",
]);
export const valorEventoStatusEnum = pgEnum("valor_evento_status", [
  "calculado",
  "validado",
  "publicado",
]);

// ---------------------------------------------------------------------------
// Pilar 1 — Dados (docs/DATA-MODEL.md)
// ---------------------------------------------------------------------------

export const empresas = pgTable("empresas", {
  id: uuid("id").primaryKey().defaultRandom(),
  nome: text("nome").notNull(),
  cnpj: text("cnpj").notNull().unique(),
  segmento: text("segmento"),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
});

export const unidades = pgTable("unidades", {
  id: uuid("id").primaryKey().defaultRandom(),
  empresaId: uuid("empresa_id")
    .notNull()
    .references(() => empresas.id, { onDelete: "cascade" }),
  nome: text("nome").notNull(),
  tipo: text("tipo").notNull(),
  cnpj: text("cnpj"),
  municipio: text("municipio"),
  uf: text("uf"),
  status: unidadeStatusEnum("status").notNull().default("ativa"),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
});

export const fornecedores = pgTable("fornecedores", {
  id: uuid("id").primaryKey().defaultRandom(),
  empresaId: uuid("empresa_id")
    .notNull()
    .references(() => empresas.id, { onDelete: "cascade" }),
  nome: text("nome").notNull(),
  documento: text("documento").notNull(),
  tipo: text("tipo").notNull(),
  car: text("car"),
  statusCadastro: fornecedorStatusEnum("status_cadastro").notNull().default("pendente"),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
});

export const fornecedorRelacionamentos = pgTable("fornecedor_relacionamentos", {
  id: uuid("id").primaryKey().defaultRandom(),
  fornecedorId: uuid("fornecedor_id")
    .notNull()
    .references(() => fornecedores.id, { onDelete: "cascade" }),
  fornecedorRelacionadoId: uuid("fornecedor_relacionado_id")
    .notNull()
    .references(() => fornecedores.id, { onDelete: "cascade" }),
  tipoRelacao: text("tipo_relacao").notNull(),
  nivel: integer("nivel").notNull().default(1),
});

export const indicadores = pgTable("indicadores", {
  id: uuid("id").primaryKey().defaultRandom(),
  codigo: text("codigo").notNull().unique(),
  nome: text("nome").notNull(),
  categoria: text("categoria").notNull(),
  unidadeMedida: text("unidade_medida").notNull(),
  metodologia: text("metodologia"),
});

export const usuarios = pgTable("usuarios", {
  id: uuid("id").primaryKey().defaultRandom(),
  empresaId: uuid("empresa_id").references(() => empresas.id, { onDelete: "cascade" }),
  nome: text("nome").notNull(),
  email: text("email").notNull().unique(),
  senhaHash: text("senha_hash").notNull(),
  papel: usuarioPapelEnum("papel").notNull().default("operacoes"),
  fornecedorId: uuid("fornecedor_id").references(() => fornecedores.id, {
    onDelete: "set null",
  }),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
});

export const valoresIndicador = pgTable("valores_indicador", {
  id: uuid("id").primaryKey().defaultRandom(),
  indicadorId: uuid("indicador_id")
    .notNull()
    .references(() => indicadores.id, { onDelete: "restrict" }),
  escopoTipo: text("escopo_tipo").notNull(),
  escopoId: uuid("escopo_id").notNull(),
  periodoInicio: date("periodo_inicio").notNull(),
  periodoFim: date("periodo_fim").notNull(),
  valor: numeric("valor").notNull(),
  status: valorIndicadorStatusEnum("status").notNull().default("pendente"),
  responsavelId: uuid("responsavel_id").references(() => usuarios.id, {
    onDelete: "set null",
  }),
  validadoEm: timestamp("validado_em"),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
});

export const fontesValor = pgTable("fontes_valor", {
  id: uuid("id").primaryKey().defaultRandom(),
  valorIndicadorId: uuid("valor_indicador_id")
    .notNull()
    .references(() => valoresIndicador.id, { onDelete: "cascade" }),
  tipoFonte: text("tipo_fonte").notNull(),
  origemDetalhe: text("origem_detalhe"),
  valorReportado: numeric("valor_reportado").notNull(),
  capturadoEm: timestamp("capturado_em").notNull().defaultNow(),
});

export const divergencias = pgTable("divergencias", {
  id: uuid("id").primaryKey().defaultRandom(),
  valorIndicadorId: uuid("valor_indicador_id")
    .notNull()
    .references(() => valoresIndicador.id, { onDelete: "cascade" }),
  descricao: text("descricao").notNull(),
  status: divergenciaStatusEnum("status").notNull().default("aberta"),
  resolvidoPor: uuid("resolvido_por").references(() => usuarios.id, {
    onDelete: "set null",
  }),
  resolvidoEm: timestamp("resolvido_em"),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
});

export const documentos = pgTable("documentos", {
  id: uuid("id").primaryKey().defaultRandom(),
  empresaId: uuid("empresa_id")
    .notNull()
    .references(() => empresas.id, { onDelete: "cascade" }),
  tipo: text("tipo").notNull(),
  arquivoUrl: text("arquivo_url").notNull(),
  hashIntegridade: text("hash_integridade"),
  enviadoPor: uuid("enviado_por").references(() => usuarios.id, { onDelete: "set null" }),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
});

export const documentoVinculos = pgTable("documento_vinculos", {
  id: uuid("id").primaryKey().defaultRandom(),
  documentoId: uuid("documento_id")
    .notNull()
    .references(() => documentos.id, { onDelete: "cascade" }),
  entidadeTipo: text("entidade_tipo").notNull(),
  entidadeId: uuid("entidade_id").notNull(),
});

export const auditoriaLog = pgTable("auditoria_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  entidadeTipo: text("entidade_tipo").notNull(),
  entidadeId: uuid("entidade_id").notNull(),
  acao: text("acao").notNull(),
  usuarioId: uuid("usuario_id").references(() => usuarios.id, { onDelete: "set null" }),
  valorAnterior: jsonb("valor_anterior"),
  valorNovo: jsonb("valor_novo"),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// Pilar 2 — Compliance (docs/DATA-MODEL-COMPLIANCE.md)
// ---------------------------------------------------------------------------

export const frameworks = pgTable("frameworks", {
  id: uuid("id").primaryKey().defaultRandom(),
  codigo: text("codigo").notNull().unique(),
  nome: text("nome").notNull(),
  versao: text("versao"),
  tipo: frameworkTipoEnum("tipo").notNull().default("voluntario"),
  vigenteAPartir: date("vigente_a_partir"),
});

export const requisitos = pgTable("requisitos", {
  id: uuid("id").primaryKey().defaultRandom(),
  frameworkId: uuid("framework_id")
    .notNull()
    .references(() => frameworks.id, { onDelete: "cascade" }),
  codigo: text("codigo").notNull(),
  topico: text("topico"),
  titulo: text("titulo").notNull(),
  descricao: text("descricao"),
  obrigatorio: boolean("obrigatorio").notNull().default(true),
});

export const requisitoIndicadores = pgTable("requisito_indicadores", {
  id: uuid("id").primaryKey().defaultRandom(),
  requisitoId: uuid("requisito_id")
    .notNull()
    .references(() => requisitos.id, { onDelete: "cascade" }),
  indicadorId: uuid("indicador_id")
    .notNull()
    .references(() => indicadores.id, { onDelete: "cascade" }),
});

export const riscos = pgTable("riscos", {
  id: uuid("id").primaryKey().defaultRandom(),
  empresaId: uuid("empresa_id")
    .notNull()
    .references(() => empresas.id, { onDelete: "cascade" }),
  categoria: text("categoria").notNull(),
  titulo: text("titulo").notNull(),
  descricao: text("descricao"),
  probabilidade: integer("probabilidade").notNull(),
  impacto: integer("impacto").notNull(),
  score: integer("score").notNull(),
  status: riscoStatusEnum("status").notNull().default("identificado"),
  mitigacao: text("mitigacao"),
  responsavelId: uuid("responsavel_id").references(() => usuarios.id, {
    onDelete: "set null",
  }),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
});

export const riscoVinculos = pgTable("risco_vinculos", {
  id: uuid("id").primaryKey().defaultRandom(),
  riscoId: uuid("risco_id")
    .notNull()
    .references(() => riscos.id, { onDelete: "cascade" }),
  entidadeTipo: text("entidade_tipo").notNull(),
  entidadeId: uuid("entidade_id").notNull(),
});

export const politicas = pgTable("politicas", {
  id: uuid("id").primaryKey().defaultRandom(),
  empresaId: uuid("empresa_id")
    .notNull()
    .references(() => empresas.id, { onDelete: "cascade" }),
  nome: text("nome").notNull(),
  tipo: text("tipo").notNull(),
  versao: text("versao"),
  vigenciaInicio: date("vigencia_inicio"),
  vigenciaFim: date("vigencia_fim"),
  status: politicaStatusEnum("status").notNull().default("rascunho"),
  documentoId: uuid("documento_id").references(() => documentos.id, {
    onDelete: "set null",
  }),
  aprovadorId: uuid("aprovador_id").references(() => usuarios.id, {
    onDelete: "set null",
  }),
});

export const questionarios = pgTable("questionarios", {
  id: uuid("id").primaryKey().defaultRandom(),
  empresaId: uuid("empresa_id")
    .notNull()
    .references(() => empresas.id, { onDelete: "cascade" }),
  origemTipo: text("origem_tipo").notNull(),
  origemNome: text("origem_nome"),
  prazo: date("prazo"),
  status: questionarioStatusEnum("status").notNull().default("recebido"),
});

export const questionarioPerguntas = pgTable("questionario_perguntas", {
  id: uuid("id").primaryKey().defaultRandom(),
  questionarioId: uuid("questionario_id")
    .notNull()
    .references(() => questionarios.id, { onDelete: "cascade" }),
  texto: text("texto").notNull(),
  requisitoId: uuid("requisito_id").references(() => requisitos.id, {
    onDelete: "set null",
  }),
  ordem: integer("ordem").notNull().default(0),
});

export const questionarioRespostas = pgTable("questionario_respostas", {
  id: uuid("id").primaryKey().defaultRandom(),
  perguntaId: uuid("pergunta_id")
    .notNull()
    .references(() => questionarioPerguntas.id, { onDelete: "cascade" }),
  respostaTexto: text("resposta_texto"),
  origemResposta: respostaOrigemEnum("origem_resposta").notNull().default("editada_manual"),
  valorIndicadorId: uuid("valor_indicador_id").references(() => valoresIndicador.id, {
    onDelete: "set null",
  }),
  respondidoPor: uuid("respondido_por").references(() => usuarios.id, {
    onDelete: "set null",
  }),
  respondidoEm: timestamp("respondido_em"),
});

export const relatorios = pgTable("relatorios", {
  id: uuid("id").primaryKey().defaultRandom(),
  empresaId: uuid("empresa_id")
    .notNull()
    .references(() => empresas.id, { onDelete: "cascade" }),
  frameworkId: uuid("framework_id")
    .notNull()
    .references(() => frameworks.id, { onDelete: "restrict" }),
  periodoInicio: date("periodo_inicio").notNull(),
  periodoFim: date("periodo_fim").notNull(),
  versao: integer("versao").notNull().default(1),
  status: relatorioStatusEnum("status").notNull().default("rascunho"),
  relatorioAnteriorId: uuid("relatorio_anterior_id").references(
    (): AnyPgColumn => relatorios.id,
  ),
  publicadoEm: timestamp("publicado_em"),
});

export const relatorioRequisitos = pgTable("relatorio_requisitos", {
  id: uuid("id").primaryKey().defaultRandom(),
  relatorioId: uuid("relatorio_id")
    .notNull()
    .references(() => relatorios.id, { onDelete: "cascade" }),
  requisitoId: uuid("requisito_id")
    .notNull()
    .references(() => requisitos.id, { onDelete: "restrict" }),
  valorSnapshot: jsonb("valor_snapshot"),
  completudePercentual: numeric("completude_percentual"),
});

export const assegurancoes = pgTable("assegurancoes", {
  id: uuid("id").primaryKey().defaultRandom(),
  relatorioId: uuid("relatorio_id")
    .notNull()
    .references(() => relatorios.id, { onDelete: "cascade" }),
  auditorNome: text("auditor_nome"),
  auditorEmpresa: text("auditor_empresa"),
  tipoAsseguranca: assegurancaTipoEnum("tipo_asseguranca"),
  parecer: assegurancaParecerEnum("parecer"),
  dataEmissao: date("data_emissao"),
  documentoId: uuid("documento_id").references(() => documentos.id, {
    onDelete: "set null",
  }),
});

// ---------------------------------------------------------------------------
// Pilar 3 — Valor (docs/DATA-MODEL-VALOR.md)
// ---------------------------------------------------------------------------

export const metas = pgTable("metas", {
  id: uuid("id").primaryKey().defaultRandom(),
  empresaId: uuid("empresa_id")
    .notNull()
    .references(() => empresas.id, { onDelete: "cascade" }),
  tipo: text("tipo").notNull(),
  indicadorId: uuid("indicador_id")
    .notNull()
    .references(() => indicadores.id, { onDelete: "restrict" }),
  baselineValor: numeric("baseline_valor"),
  baselineAno: integer("baseline_ano"),
  valorAlvo: numeric("valor_alvo"),
  anoAlvo: integer("ano_alvo"),
  status: metaStatusEnum("status").notNull().default("em_andamento"),
});

export const projetosSustentaveis = pgTable("projetos_sustentaveis", {
  id: uuid("id").primaryKey().defaultRandom(),
  empresaId: uuid("empresa_id")
    .notNull()
    .references(() => empresas.id, { onDelete: "cascade" }),
  nome: text("nome").notNull(),
  categoria: text("categoria").notNull(),
  investimentoTotal: numeric("investimento_total"),
  dataInicio: date("data_inicio"),
  dataFimPrevista: date("data_fim_prevista"),
  status: projetoStatusEnum("status").notNull().default("planejado"),
});

export const projetoIndicadores = pgTable("projeto_indicadores", {
  id: uuid("id").primaryKey().defaultRandom(),
  projetoId: uuid("projeto_id")
    .notNull()
    .references(() => projetosSustentaveis.id, { onDelete: "cascade" }),
  indicadorId: uuid("indicador_id")
    .notNull()
    .references(() => indicadores.id, { onDelete: "cascade" }),
});

export const cenariosClimaticos = pgTable("cenarios_climaticos", {
  id: uuid("id").primaryKey().defaultRandom(),
  empresaId: uuid("empresa_id")
    .notNull()
    .references(() => empresas.id, { onDelete: "cascade" }),
  nome: text("nome").notNull(),
  fonteMetodologia: text("fonte_metodologia"),
  horizonteAno: integer("horizonte_ano"),
  premissas: jsonb("premissas"),
});

export const cenarioImpactos = pgTable("cenario_impactos", {
  id: uuid("id").primaryKey().defaultRandom(),
  cenarioId: uuid("cenario_id")
    .notNull()
    .references(() => cenariosClimaticos.id, { onDelete: "cascade" }),
  tipoRisco: cenarioTipoRiscoEnum("tipo_risco").notNull(),
  escopoTipo: text("escopo_tipo").notNull(),
  escopoId: uuid("escopo_id").notNull(),
  descricaoImpacto: text("descricao_impacto"),
  valorEstimado: numeric("valor_estimado"),
  unidadeValor: text("unidade_valor"),
});

export const linhasCreditoVerde = pgTable("linhas_credito_verde", {
  id: uuid("id").primaryKey().defaultRandom(),
  nome: text("nome").notNull(),
  instituicao: text("instituicao"),
  tipo: text("tipo"),
});

export const linhaCreditoCriterios = pgTable("linha_credito_criterios", {
  id: uuid("id").primaryKey().defaultRandom(),
  linhaId: uuid("linha_id")
    .notNull()
    .references(() => linhasCreditoVerde.id, { onDelete: "cascade" }),
  descricaoCriterio: text("descricao_criterio").notNull(),
  requisitoId: uuid("requisito_id").references(() => requisitos.id, {
    onDelete: "set null",
  }),
  indicadorId: uuid("indicador_id").references(() => indicadores.id, {
    onDelete: "set null",
  }),
  valorMinimo: numeric("valor_minimo"),
  valorMaximo: numeric("valor_maximo"),
  obrigatorio: boolean("obrigatorio").notNull().default(true),
});

export const elegibilidadeAvaliacoes = pgTable("elegibilidade_avaliacoes", {
  id: uuid("id").primaryKey().defaultRandom(),
  empresaId: uuid("empresa_id")
    .notNull()
    .references(() => empresas.id, { onDelete: "cascade" }),
  linhaId: uuid("linha_id")
    .notNull()
    .references(() => linhasCreditoVerde.id, { onDelete: "cascade" }),
  dataAvaliacao: date("data_avaliacao").notNull(),
  status: elegibilidadeStatusEnum("status").notNull().default("nao_elegivel"),
});

export const elegibilidadeCriterioResultados = pgTable(
  "elegibilidade_criterio_resultados",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    avaliacaoId: uuid("avaliacao_id")
      .notNull()
      .references(() => elegibilidadeAvaliacoes.id, { onDelete: "cascade" }),
    criterioId: uuid("criterio_id")
      .notNull()
      .references(() => linhaCreditoCriterios.id, { onDelete: "cascade" }),
    atendido: boolean("atendido").notNull().default(false),
    valorEncontrado: text("valor_encontrado"),
    gap: text("gap"),
  },
);

export const scoreModelos = pgTable("score_modelos", {
  id: uuid("id").primaryKey().defaultRandom(),
  nome: text("nome").notNull(),
  versao: text("versao").notNull(),
  vigenteAPartir: date("vigente_a_partir"),
});

export const scoreModeloCriterios = pgTable("score_modelo_criterios", {
  id: uuid("id").primaryKey().defaultRandom(),
  modeloId: uuid("modelo_id")
    .notNull()
    .references(() => scoreModelos.id, { onDelete: "cascade" }),
  descricao: text("descricao").notNull(),
  peso: numeric("peso").notNull(),
  indicadorId: uuid("indicador_id").references(() => indicadores.id, {
    onDelete: "set null",
  }),
  requisitoId: uuid("requisito_id").references(() => requisitos.id, {
    onDelete: "set null",
  }),
});

export const scoreFornecedorResultados = pgTable("score_fornecedor_resultados", {
  id: uuid("id").primaryKey().defaultRandom(),
  fornecedorId: uuid("fornecedor_id")
    .notNull()
    .references(() => fornecedores.id, { onDelete: "cascade" }),
  modeloId: uuid("modelo_id")
    .notNull()
    .references(() => scoreModelos.id, { onDelete: "restrict" }),
  periodoReferencia: date("periodo_referencia").notNull(),
  scoreFinal: numeric("score_final").notNull(),
  detalhamento: jsonb("detalhamento"),
});

export const valorEventos = pgTable("valor_eventos", {
  id: uuid("id").primaryKey().defaultRandom(),
  empresaId: uuid("empresa_id")
    .notNull()
    .references(() => empresas.id, { onDelete: "cascade" }),
  pilarCategoria: text("pilar_categoria").notNull(),
  subtipo: text("subtipo").notNull(),
  escopoTipo: text("escopo_tipo").notNull(),
  escopoId: uuid("escopo_id").notNull(),
  periodoInicio: date("periodo_inicio").notNull(),
  periodoFim: date("periodo_fim").notNull(),
  valorNumerico: numeric("valor_numerico").notNull(),
  unidadeValor: text("unidade_valor").notNull(),
  metodologia: text("metodologia"),
  baseadoEm: jsonb("baseado_em"),
  status: valorEventoStatusEnum("status").notNull().default("calculado"),
  validadoPor: uuid("validado_por").references(() => usuarios.id, {
    onDelete: "set null",
  }),
  geradoEm: timestamp("gerado_em").notNull().defaultNow(),
});
