import { pgTable, uuid, text, timestamp, pgEnum, numeric, date, boolean, integer, jsonb } from "drizzle-orm/pg-core";

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export const usuarioPapelEnum = pgEnum("usuario_papel", [
  "admin",
  "sustentabilidade",
  "agricola",
  "industrial",
  "fiscal",
  "auditor",
  "consultor",
]);

export const categoriaAtividadeEnum = pgEnum("categoria_atividade", [
  "agricola",
  "industrial",
  "logistica",
  "social",
  "economico",
]);

export const origemRegistroEnum = pgEnum("origem_registro", ["manual", "upload"]);

export const statusRegistroEnum = pgEnum("status_registro", ["rascunho", "validado"]);

export const statusEvidenciaEnum = pgEnum("status_evidencia", [
  "pendente",
  "aprovado",
  "rejeitado",
]);

export const statusVersaoMetodologiaEnum = pgEnum("status_versao_metodologia", [
  "ativo",
  "em_revisao",
  "obsoleto",
]);

export const statusComplianceEnum = pgEnum("status_compliance", [
  "conforme",
  "atencao",
  "nao_conforme",
  "sem_dados",
]);

export const tipoFornecedorEnum = pgEnum("tipo_fornecedor", [
  "proprio",
  "terceiro",
  "cooperativa",
]);

export const statusRelatorioEnum = pgEnum("status_relatorio", ["rascunho", "publicado"]);

// ---------------------------------------------------------------------------
// Módulo 01 — Organização
// ---------------------------------------------------------------------------

export const empresas = pgTable("empresas", {
  id: uuid("id").primaryKey().defaultRandom(),
  nome: text("nome").notNull(),
  cnpj: text("cnpj").notNull().unique(),
  segmento: text("segmento"),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
});

export const usuarios = pgTable("usuarios", {
  id: uuid("id").primaryKey().defaultRandom(),
  empresaId: uuid("empresa_id").references(() => empresas.id, { onDelete: "cascade" }),
  nome: text("nome").notNull(),
  email: text("email").notNull().unique(),
  senhaHash: text("senha_hash").notNull(),
  papel: usuarioPapelEnum("papel").notNull().default("admin"),
  onboardingConcluidoEm: timestamp("onboarding_concluido_em"),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
});

export const leads = pgTable("leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  origem: text("origem").notNull().default("lp"),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
});

export const usinas = pgTable("usinas", {
  id: uuid("id").primaryKey().defaultRandom(),
  empresaId: uuid("empresa_id").notNull().references(() => empresas.id, { onDelete: "cascade" }),
  nome: text("nome").notNull(),
  municipio: text("municipio"),
  estado: text("estado"),
  capacidadeProducaoTon: numeric("capacidade_producao_ton"),
  rotaProducao: text("rota_producao"),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
});

export const fazendas = pgTable("fazendas", {
  id: uuid("id").primaryKey().defaultRandom(),
  empresaId: uuid("empresa_id").notNull().references(() => empresas.id, { onDelete: "cascade" }),
  usinaId: uuid("usina_id").references(() => usinas.id, { onDelete: "set null" }),
  produtor: text("produtor").notNull(),
  propriedade: text("propriedade").notNull(),
  municipio: text("municipio"),
  estado: text("estado"),
  car: text("car"),
  areaHectares: numeric("area_hectares"),
  areaPreservadaHectares: numeric("area_preservada_hectares"),
  tipoFornecedor: tipoFornecedorEnum("tipo_fornecedor").notNull().default("terceiro"),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
});

export const safras = pgTable("safras", {
  id: uuid("id").primaryKey().defaultRandom(),
  empresaId: uuid("empresa_id").notNull().references(() => empresas.id, { onDelete: "cascade" }),
  usinaId: uuid("usina_id").notNull().references(() => usinas.id, { onDelete: "cascade" }),
  nome: text("nome").notNull(),
  dataInicio: date("data_inicio"),
  dataFim: date("data_fim"),
  areaColhidaHectares: numeric("area_colhida_hectares"),
  producaoToneladas: numeric("producao_toneladas"),
  encerrada: boolean("encerrada").notNull().default(false),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// Módulo 02 — Data Hub
// ---------------------------------------------------------------------------

export const registrosAtividade = pgTable("registros_atividade", {
  id: uuid("id").primaryKey().defaultRandom(),
  empresaId: uuid("empresa_id").notNull().references(() => empresas.id, { onDelete: "cascade" }),
  usinaId: uuid("usina_id").notNull().references(() => usinas.id, { onDelete: "cascade" }),
  fazendaId: uuid("fazenda_id").references(() => fazendas.id, { onDelete: "set null" }),
  safraId: uuid("safra_id").references(() => safras.id, { onDelete: "set null" }),
  categoria: categoriaAtividadeEnum("categoria").notNull(),
  tipo: text("tipo").notNull(),
  quantidade: numeric("quantidade").notNull(),
  unidade: text("unidade").notNull(),
  dataReferencia: date("data_referencia").notNull(),
  origem: origemRegistroEnum("origem").notNull().default("manual"),
  status: statusRegistroEnum("status").notNull().default("rascunho"),
  observacao: text("observacao"),
  criadoPor: uuid("criado_por").references(() => usuarios.id, { onDelete: "set null" }),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// Módulo 03 — Evidence Hub
// ---------------------------------------------------------------------------

export const documentos = pgTable("documentos", {
  id: uuid("id").primaryKey().defaultRandom(),
  empresaId: uuid("empresa_id").notNull().references(() => empresas.id, { onDelete: "cascade" }),
  nome: text("nome").notNull(),
  tipo: text("tipo").notNull(),
  referenciaExterna: text("referencia_externa"),
  arquivoUrl: text("arquivo_url"),
  arquivoNome: text("arquivo_nome"),
  arquivoMimeType: text("arquivo_mime_type"),
  arquivoTamanhoBytes: integer("arquivo_tamanho_bytes"),
  validoAte: date("valido_ate"),
  uploadedPor: uuid("uploaded_por").references(() => usuarios.id, { onDelete: "set null" }),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
});

export const evidencias = pgTable("evidencias", {
  id: uuid("id").primaryKey().defaultRandom(),
  empresaId: uuid("empresa_id").notNull().references(() => empresas.id, { onDelete: "cascade" }),
  documentoId: uuid("documento_id").notNull().references(() => documentos.id, { onDelete: "cascade" }),
  entidadeTipo: text("entidade_tipo").notNull(),
  entidadeId: uuid("entidade_id"),
  responsavel: text("responsavel"),
  status: statusEvidenciaEnum("status").notNull().default("pendente"),
  comentario: text("comentario"),
  versao: integer("versao").notNull().default(1),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// Módulo 04 — Motor GHG
// ---------------------------------------------------------------------------

export const fatoresEmissao = pgTable("fatores_emissao", {
  id: uuid("id").primaryKey().defaultRandom(),
  empresaId: uuid("empresa_id").references(() => empresas.id, { onDelete: "cascade" }),
  nome: text("nome").notNull(),
  categoria: text("categoria").notNull(),
  valor: numeric("valor").notNull(),
  unidade: text("unidade").notNull(),
  fonte: text("fonte").notNull(),
  versao: text("versao").notNull(),
  validoDe: date("valido_de").notNull(),
  validoAte: date("valido_ate"),
  ativo: boolean("ativo").notNull().default(true),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// Metodologias e versionamento (base para Motores CBIO e Bonsucro — PRD §12.1)
// ---------------------------------------------------------------------------

export const metodologias = pgTable("metodologias", {
  id: uuid("id").primaryKey().defaultRandom(),
  nome: text("nome").notNull().unique(),
  descricao: text("descricao"),
});

export const versoesMetodologia = pgTable("versoes_metodologia", {
  id: uuid("id").primaryKey().defaultRandom(),
  metodologiaId: uuid("metodologia_id").notNull().references(() => metodologias.id, { onDelete: "cascade" }),
  versao: text("versao").notNull(),
  vigenteDe: date("vigente_de").notNull(),
  vigenteAte: date("vigente_ate"),
  status: statusVersaoMetodologiaEnum("status").notNull().default("ativo"),
  fonte: text("fonte"),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
});

export const indicadores = pgTable("indicadores", {
  id: uuid("id").primaryKey().defaultRandom(),
  versaoMetodologiaId: uuid("versao_metodologia_id").notNull().references(() => versoesMetodologia.id, { onDelete: "cascade" }),
  codigo: text("codigo").notNull(),
  nome: text("nome").notNull(),
  unidade: text("unidade"),
  formula: text("formula"),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
});

export const calculos = pgTable("calculos", {
  id: uuid("id").primaryKey().defaultRandom(),
  empresaId: uuid("empresa_id").notNull().references(() => empresas.id, { onDelete: "cascade" }),
  usinaId: uuid("usina_id").notNull().references(() => usinas.id, { onDelete: "cascade" }),
  safraId: uuid("safra_id").references(() => safras.id, { onDelete: "set null" }),
  indicadorId: uuid("indicador_id").notNull().references(() => indicadores.id, { onDelete: "restrict" }),
  versaoMetodologiaId: uuid("versao_metodologia_id").notNull().references(() => versoesMetodologia.id, { onDelete: "restrict" }),
  inputs: jsonb("inputs").notNull(),
  resultado: numeric("resultado").notNull(),
  unidadeResultado: text("unidade_resultado"),
  calculadoPor: uuid("calculado_por").references(() => usuarios.id, { onDelete: "set null" }),
  calculadoEm: timestamp("calculado_em").notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// Módulo 07 — Auditoria & Compliance
// ---------------------------------------------------------------------------

export const requisitos = pgTable("requisitos", {
  id: uuid("id").primaryKey().defaultRandom(),
  versaoMetodologiaId: uuid("versao_metodologia_id").notNull().references(() => versoesMetodologia.id, { onDelete: "cascade" }),
  codigo: text("codigo").notNull(),
  nome: text("nome").notNull(),
  descricao: text("descricao"),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
});

export const resultadosCompliance = pgTable("resultados_compliance", {
  id: uuid("id").primaryKey().defaultRandom(),
  empresaId: uuid("empresa_id").notNull().references(() => empresas.id, { onDelete: "cascade" }),
  usinaId: uuid("usina_id").notNull().references(() => usinas.id, { onDelete: "cascade" }),
  safraId: uuid("safra_id").references(() => safras.id, { onDelete: "set null" }),
  requisitoId: uuid("requisito_id").notNull().references(() => requisitos.id, { onDelete: "cascade" }),
  status: statusComplianceEnum("status").notNull().default("sem_dados"),
  percentualCompleto: numeric("percentual_completo"),
  atualizadoEm: timestamp("atualizado_em").notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// Registro de Integridade e Rastreabilidade (relatório público por emissão)
// ---------------------------------------------------------------------------

export const relatoriosEmissao = pgTable("relatorios_emissao", {
  id: uuid("id").primaryKey().defaultRandom(),
  empresaId: uuid("empresa_id").notNull().references(() => empresas.id, { onDelete: "cascade" }),
  calculoId: uuid("calculo_id").notNull().unique().references(() => calculos.id, { onDelete: "cascade" }),
  slugPublico: text("slug_publico").notNull().unique(),
  titulo: text("titulo").notNull(),
  notas: text("notas"),
  status: statusRelatorioEnum("status").notNull().default("rascunho"),
  hashConteudo: text("hash_conteudo"),
  seloUrl: text("selo_url"),
  consentimentos: jsonb("consentimentos"),
  criadoPor: uuid("criado_por").references(() => usuarios.id, { onDelete: "set null" }),
  publicadoPor: uuid("publicado_por").references(() => usuarios.id, { onDelete: "set null" }),
  publicadoEm: timestamp("publicado_em"),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
});

export const logsAuditoria = pgTable("logs_auditoria", {
  id: uuid("id").primaryKey().defaultRandom(),
  empresaId: uuid("empresa_id").notNull().references(() => empresas.id, { onDelete: "cascade" }),
  usuarioId: uuid("usuario_id").references(() => usuarios.id, { onDelete: "set null" }),
  entidade: text("entidade").notNull(),
  entidadeId: uuid("entidade_id"),
  acao: text("acao").notNull(),
  detalhes: jsonb("detalhes"),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
});
