CREATE TYPE "public"."asseguranca_parecer" AS ENUM('aprovado', 'aprovado_com_ressalvas', 'reprovado');--> statement-breakpoint
CREATE TYPE "public"."asseguranca_tipo" AS ENUM('limitada', 'razoavel');--> statement-breakpoint
CREATE TYPE "public"."cenario_tipo_risco" AS ENUM('fisico', 'transicao');--> statement-breakpoint
CREATE TYPE "public"."divergencia_status" AS ENUM('aberta', 'em_analise', 'resolvida');--> statement-breakpoint
CREATE TYPE "public"."elegibilidade_status" AS ENUM('elegivel', 'elegivel_parcial', 'nao_elegivel');--> statement-breakpoint
CREATE TYPE "public"."fornecedor_status_cadastro" AS ENUM('pendente', 'ativo', 'bloqueado');--> statement-breakpoint
CREATE TYPE "public"."framework_tipo" AS ENUM('regulatorio', 'voluntario');--> statement-breakpoint
CREATE TYPE "public"."meta_status" AS ENUM('em_andamento', 'atingida', 'nao_atingida', 'revisada');--> statement-breakpoint
CREATE TYPE "public"."politica_status" AS ENUM('rascunho', 'vigente', 'em_revisao', 'revogada');--> statement-breakpoint
CREATE TYPE "public"."projeto_status" AS ENUM('planejado', 'em_execucao', 'concluido', 'cancelado');--> statement-breakpoint
CREATE TYPE "public"."questionario_status" AS ENUM('recebido', 'em_preenchimento', 'respondido', 'enviado');--> statement-breakpoint
CREATE TYPE "public"."relatorio_status" AS ENUM('rascunho', 'em_revisao', 'publicado', 'substituido');--> statement-breakpoint
CREATE TYPE "public"."resposta_origem" AS ENUM('sugerida_ia', 'editada_manual');--> statement-breakpoint
CREATE TYPE "public"."risco_status" AS ENUM('identificado', 'em_mitigacao', 'mitigado', 'aceito');--> statement-breakpoint
CREATE TYPE "public"."unidade_status" AS ENUM('ativa', 'inativa');--> statement-breakpoint
CREATE TYPE "public"."usuario_papel" AS ENUM('admin', 'operacoes', 'compliance', 'fornecedor');--> statement-breakpoint
CREATE TYPE "public"."valor_evento_status" AS ENUM('calculado', 'validado', 'publicado');--> statement-breakpoint
CREATE TYPE "public"."valor_indicador_status" AS ENUM('pendente', 'validado', 'divergente', 'rejeitado');--> statement-breakpoint
CREATE TABLE "assegurancoes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"relatorio_id" uuid NOT NULL,
	"auditor_nome" text,
	"auditor_empresa" text,
	"tipo_asseguranca" "asseguranca_tipo",
	"parecer" "asseguranca_parecer",
	"data_emissao" date,
	"documento_id" uuid
);
--> statement-breakpoint
CREATE TABLE "auditoria_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entidade_tipo" text NOT NULL,
	"entidade_id" uuid NOT NULL,
	"acao" text NOT NULL,
	"usuario_id" uuid,
	"valor_anterior" jsonb,
	"valor_novo" jsonb,
	"criado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cenario_impactos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cenario_id" uuid NOT NULL,
	"tipo_risco" "cenario_tipo_risco" NOT NULL,
	"escopo_tipo" text NOT NULL,
	"escopo_id" uuid NOT NULL,
	"descricao_impacto" text,
	"valor_estimado" numeric,
	"unidade_valor" text
);
--> statement-breakpoint
CREATE TABLE "cenarios_climaticos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empresa_id" uuid NOT NULL,
	"nome" text NOT NULL,
	"fonte_metodologia" text,
	"horizonte_ano" integer,
	"premissas" jsonb
);
--> statement-breakpoint
CREATE TABLE "divergencias" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"valor_indicador_id" uuid NOT NULL,
	"descricao" text NOT NULL,
	"status" "divergencia_status" DEFAULT 'aberta' NOT NULL,
	"resolvido_por" uuid,
	"resolvido_em" timestamp,
	"criado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "documento_vinculos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"documento_id" uuid NOT NULL,
	"entidade_tipo" text NOT NULL,
	"entidade_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "documentos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empresa_id" uuid NOT NULL,
	"tipo" text NOT NULL,
	"arquivo_url" text NOT NULL,
	"hash_integridade" text,
	"enviado_por" uuid,
	"criado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "elegibilidade_avaliacoes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empresa_id" uuid NOT NULL,
	"linha_id" uuid NOT NULL,
	"data_avaliacao" date NOT NULL,
	"status" "elegibilidade_status" DEFAULT 'nao_elegivel' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "elegibilidade_criterio_resultados" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"avaliacao_id" uuid NOT NULL,
	"criterio_id" uuid NOT NULL,
	"atendido" boolean DEFAULT false NOT NULL,
	"valor_encontrado" text,
	"gap" text
);
--> statement-breakpoint
CREATE TABLE "empresas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nome" text NOT NULL,
	"cnpj" text NOT NULL,
	"segmento" text,
	"criado_em" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "empresas_cnpj_unique" UNIQUE("cnpj")
);
--> statement-breakpoint
CREATE TABLE "fontes_valor" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"valor_indicador_id" uuid NOT NULL,
	"tipo_fonte" text NOT NULL,
	"origem_detalhe" text,
	"valor_reportado" numeric NOT NULL,
	"capturado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fornecedor_relacionamentos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fornecedor_id" uuid NOT NULL,
	"fornecedor_relacionado_id" uuid NOT NULL,
	"tipo_relacao" text NOT NULL,
	"nivel" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fornecedores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empresa_id" uuid NOT NULL,
	"nome" text NOT NULL,
	"documento" text NOT NULL,
	"tipo" text NOT NULL,
	"car" text,
	"status_cadastro" "fornecedor_status_cadastro" DEFAULT 'pendente' NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "frameworks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"codigo" text NOT NULL,
	"nome" text NOT NULL,
	"versao" text,
	"tipo" "framework_tipo" DEFAULT 'voluntario' NOT NULL,
	"vigente_a_partir" date,
	CONSTRAINT "frameworks_codigo_unique" UNIQUE("codigo")
);
--> statement-breakpoint
CREATE TABLE "indicadores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"codigo" text NOT NULL,
	"nome" text NOT NULL,
	"categoria" text NOT NULL,
	"unidade_medida" text NOT NULL,
	"metodologia" text,
	CONSTRAINT "indicadores_codigo_unique" UNIQUE("codigo")
);
--> statement-breakpoint
CREATE TABLE "linha_credito_criterios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"linha_id" uuid NOT NULL,
	"descricao_criterio" text NOT NULL,
	"requisito_id" uuid,
	"indicador_id" uuid,
	"valor_minimo" numeric,
	"valor_maximo" numeric,
	"obrigatorio" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "linhas_credito_verde" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nome" text NOT NULL,
	"instituicao" text,
	"tipo" text
);
--> statement-breakpoint
CREATE TABLE "metas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empresa_id" uuid NOT NULL,
	"tipo" text NOT NULL,
	"indicador_id" uuid NOT NULL,
	"baseline_valor" numeric,
	"baseline_ano" integer,
	"valor_alvo" numeric,
	"ano_alvo" integer,
	"status" "meta_status" DEFAULT 'em_andamento' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "politicas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empresa_id" uuid NOT NULL,
	"nome" text NOT NULL,
	"tipo" text NOT NULL,
	"versao" text,
	"vigencia_inicio" date,
	"vigencia_fim" date,
	"status" "politica_status" DEFAULT 'rascunho' NOT NULL,
	"documento_id" uuid,
	"aprovador_id" uuid
);
--> statement-breakpoint
CREATE TABLE "projeto_indicadores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"projeto_id" uuid NOT NULL,
	"indicador_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projetos_sustentaveis" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empresa_id" uuid NOT NULL,
	"nome" text NOT NULL,
	"categoria" text NOT NULL,
	"investimento_total" numeric,
	"data_inicio" date,
	"data_fim_prevista" date,
	"status" "projeto_status" DEFAULT 'planejado' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "questionario_perguntas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"questionario_id" uuid NOT NULL,
	"texto" text NOT NULL,
	"requisito_id" uuid,
	"ordem" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "questionario_respostas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pergunta_id" uuid NOT NULL,
	"resposta_texto" text,
	"origem_resposta" "resposta_origem" DEFAULT 'editada_manual' NOT NULL,
	"valor_indicador_id" uuid,
	"respondido_por" uuid,
	"respondido_em" timestamp
);
--> statement-breakpoint
CREATE TABLE "questionarios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empresa_id" uuid NOT NULL,
	"origem_tipo" text NOT NULL,
	"origem_nome" text,
	"prazo" date,
	"status" "questionario_status" DEFAULT 'recebido' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "relatorio_requisitos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"relatorio_id" uuid NOT NULL,
	"requisito_id" uuid NOT NULL,
	"valor_snapshot" jsonb,
	"completude_percentual" numeric
);
--> statement-breakpoint
CREATE TABLE "relatorios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empresa_id" uuid NOT NULL,
	"framework_id" uuid NOT NULL,
	"periodo_inicio" date NOT NULL,
	"periodo_fim" date NOT NULL,
	"versao" integer DEFAULT 1 NOT NULL,
	"status" "relatorio_status" DEFAULT 'rascunho' NOT NULL,
	"relatorio_anterior_id" uuid,
	"publicado_em" timestamp
);
--> statement-breakpoint
CREATE TABLE "requisito_indicadores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"requisito_id" uuid NOT NULL,
	"indicador_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "requisitos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"framework_id" uuid NOT NULL,
	"codigo" text NOT NULL,
	"topico" text,
	"titulo" text NOT NULL,
	"descricao" text,
	"obrigatorio" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "risco_vinculos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"risco_id" uuid NOT NULL,
	"entidade_tipo" text NOT NULL,
	"entidade_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "riscos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empresa_id" uuid NOT NULL,
	"categoria" text NOT NULL,
	"titulo" text NOT NULL,
	"descricao" text,
	"probabilidade" integer NOT NULL,
	"impacto" integer NOT NULL,
	"score" integer NOT NULL,
	"status" "risco_status" DEFAULT 'identificado' NOT NULL,
	"mitigacao" text,
	"responsavel_id" uuid,
	"criado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "score_fornecedor_resultados" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fornecedor_id" uuid NOT NULL,
	"modelo_id" uuid NOT NULL,
	"periodo_referencia" date NOT NULL,
	"score_final" numeric NOT NULL,
	"detalhamento" jsonb
);
--> statement-breakpoint
CREATE TABLE "score_modelo_criterios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"modelo_id" uuid NOT NULL,
	"descricao" text NOT NULL,
	"peso" numeric NOT NULL,
	"indicador_id" uuid,
	"requisito_id" uuid
);
--> statement-breakpoint
CREATE TABLE "score_modelos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nome" text NOT NULL,
	"versao" text NOT NULL,
	"vigente_a_partir" date
);
--> statement-breakpoint
CREATE TABLE "unidades" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empresa_id" uuid NOT NULL,
	"nome" text NOT NULL,
	"tipo" text NOT NULL,
	"cnpj" text,
	"municipio" text,
	"uf" text,
	"status" "unidade_status" DEFAULT 'ativa' NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "usuarios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empresa_id" uuid,
	"nome" text NOT NULL,
	"email" text NOT NULL,
	"senha_hash" text NOT NULL,
	"papel" "usuario_papel" DEFAULT 'operacoes' NOT NULL,
	"fornecedor_id" uuid,
	"criado_em" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "usuarios_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "valor_eventos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empresa_id" uuid NOT NULL,
	"pilar_categoria" text NOT NULL,
	"subtipo" text NOT NULL,
	"escopo_tipo" text NOT NULL,
	"escopo_id" uuid NOT NULL,
	"periodo_inicio" date NOT NULL,
	"periodo_fim" date NOT NULL,
	"valor_numerico" numeric NOT NULL,
	"unidade_valor" text NOT NULL,
	"metodologia" text,
	"baseado_em" jsonb,
	"status" "valor_evento_status" DEFAULT 'calculado' NOT NULL,
	"validado_por" uuid,
	"gerado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "valores_indicador" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"indicador_id" uuid NOT NULL,
	"escopo_tipo" text NOT NULL,
	"escopo_id" uuid NOT NULL,
	"periodo_inicio" date NOT NULL,
	"periodo_fim" date NOT NULL,
	"valor" numeric NOT NULL,
	"status" "valor_indicador_status" DEFAULT 'pendente' NOT NULL,
	"responsavel_id" uuid,
	"validado_em" timestamp,
	"criado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "assegurancoes" ADD CONSTRAINT "assegurancoes_relatorio_id_relatorios_id_fk" FOREIGN KEY ("relatorio_id") REFERENCES "public"."relatorios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assegurancoes" ADD CONSTRAINT "assegurancoes_documento_id_documentos_id_fk" FOREIGN KEY ("documento_id") REFERENCES "public"."documentos"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auditoria_log" ADD CONSTRAINT "auditoria_log_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cenario_impactos" ADD CONSTRAINT "cenario_impactos_cenario_id_cenarios_climaticos_id_fk" FOREIGN KEY ("cenario_id") REFERENCES "public"."cenarios_climaticos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cenarios_climaticos" ADD CONSTRAINT "cenarios_climaticos_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "divergencias" ADD CONSTRAINT "divergencias_valor_indicador_id_valores_indicador_id_fk" FOREIGN KEY ("valor_indicador_id") REFERENCES "public"."valores_indicador"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "divergencias" ADD CONSTRAINT "divergencias_resolvido_por_usuarios_id_fk" FOREIGN KEY ("resolvido_por") REFERENCES "public"."usuarios"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documento_vinculos" ADD CONSTRAINT "documento_vinculos_documento_id_documentos_id_fk" FOREIGN KEY ("documento_id") REFERENCES "public"."documentos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_enviado_por_usuarios_id_fk" FOREIGN KEY ("enviado_por") REFERENCES "public"."usuarios"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "elegibilidade_avaliacoes" ADD CONSTRAINT "elegibilidade_avaliacoes_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "elegibilidade_avaliacoes" ADD CONSTRAINT "elegibilidade_avaliacoes_linha_id_linhas_credito_verde_id_fk" FOREIGN KEY ("linha_id") REFERENCES "public"."linhas_credito_verde"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "elegibilidade_criterio_resultados" ADD CONSTRAINT "elegibilidade_criterio_resultados_avaliacao_id_elegibilidade_avaliacoes_id_fk" FOREIGN KEY ("avaliacao_id") REFERENCES "public"."elegibilidade_avaliacoes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "elegibilidade_criterio_resultados" ADD CONSTRAINT "elegibilidade_criterio_resultados_criterio_id_linha_credito_criterios_id_fk" FOREIGN KEY ("criterio_id") REFERENCES "public"."linha_credito_criterios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fontes_valor" ADD CONSTRAINT "fontes_valor_valor_indicador_id_valores_indicador_id_fk" FOREIGN KEY ("valor_indicador_id") REFERENCES "public"."valores_indicador"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fornecedor_relacionamentos" ADD CONSTRAINT "fornecedor_relacionamentos_fornecedor_id_fornecedores_id_fk" FOREIGN KEY ("fornecedor_id") REFERENCES "public"."fornecedores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fornecedor_relacionamentos" ADD CONSTRAINT "fornecedor_relacionamentos_fornecedor_relacionado_id_fornecedores_id_fk" FOREIGN KEY ("fornecedor_relacionado_id") REFERENCES "public"."fornecedores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fornecedores" ADD CONSTRAINT "fornecedores_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "linha_credito_criterios" ADD CONSTRAINT "linha_credito_criterios_linha_id_linhas_credito_verde_id_fk" FOREIGN KEY ("linha_id") REFERENCES "public"."linhas_credito_verde"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "linha_credito_criterios" ADD CONSTRAINT "linha_credito_criterios_requisito_id_requisitos_id_fk" FOREIGN KEY ("requisito_id") REFERENCES "public"."requisitos"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "linha_credito_criterios" ADD CONSTRAINT "linha_credito_criterios_indicador_id_indicadores_id_fk" FOREIGN KEY ("indicador_id") REFERENCES "public"."indicadores"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "metas" ADD CONSTRAINT "metas_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "metas" ADD CONSTRAINT "metas_indicador_id_indicadores_id_fk" FOREIGN KEY ("indicador_id") REFERENCES "public"."indicadores"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "politicas" ADD CONSTRAINT "politicas_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "politicas" ADD CONSTRAINT "politicas_documento_id_documentos_id_fk" FOREIGN KEY ("documento_id") REFERENCES "public"."documentos"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "politicas" ADD CONSTRAINT "politicas_aprovador_id_usuarios_id_fk" FOREIGN KEY ("aprovador_id") REFERENCES "public"."usuarios"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projeto_indicadores" ADD CONSTRAINT "projeto_indicadores_projeto_id_projetos_sustentaveis_id_fk" FOREIGN KEY ("projeto_id") REFERENCES "public"."projetos_sustentaveis"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projeto_indicadores" ADD CONSTRAINT "projeto_indicadores_indicador_id_indicadores_id_fk" FOREIGN KEY ("indicador_id") REFERENCES "public"."indicadores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projetos_sustentaveis" ADD CONSTRAINT "projetos_sustentaveis_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questionario_perguntas" ADD CONSTRAINT "questionario_perguntas_questionario_id_questionarios_id_fk" FOREIGN KEY ("questionario_id") REFERENCES "public"."questionarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questionario_perguntas" ADD CONSTRAINT "questionario_perguntas_requisito_id_requisitos_id_fk" FOREIGN KEY ("requisito_id") REFERENCES "public"."requisitos"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questionario_respostas" ADD CONSTRAINT "questionario_respostas_pergunta_id_questionario_perguntas_id_fk" FOREIGN KEY ("pergunta_id") REFERENCES "public"."questionario_perguntas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questionario_respostas" ADD CONSTRAINT "questionario_respostas_valor_indicador_id_valores_indicador_id_fk" FOREIGN KEY ("valor_indicador_id") REFERENCES "public"."valores_indicador"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questionario_respostas" ADD CONSTRAINT "questionario_respostas_respondido_por_usuarios_id_fk" FOREIGN KEY ("respondido_por") REFERENCES "public"."usuarios"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questionarios" ADD CONSTRAINT "questionarios_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "relatorio_requisitos" ADD CONSTRAINT "relatorio_requisitos_relatorio_id_relatorios_id_fk" FOREIGN KEY ("relatorio_id") REFERENCES "public"."relatorios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "relatorio_requisitos" ADD CONSTRAINT "relatorio_requisitos_requisito_id_requisitos_id_fk" FOREIGN KEY ("requisito_id") REFERENCES "public"."requisitos"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "relatorios" ADD CONSTRAINT "relatorios_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "relatorios" ADD CONSTRAINT "relatorios_framework_id_frameworks_id_fk" FOREIGN KEY ("framework_id") REFERENCES "public"."frameworks"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "relatorios" ADD CONSTRAINT "relatorios_relatorio_anterior_id_relatorios_id_fk" FOREIGN KEY ("relatorio_anterior_id") REFERENCES "public"."relatorios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "requisito_indicadores" ADD CONSTRAINT "requisito_indicadores_requisito_id_requisitos_id_fk" FOREIGN KEY ("requisito_id") REFERENCES "public"."requisitos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "requisito_indicadores" ADD CONSTRAINT "requisito_indicadores_indicador_id_indicadores_id_fk" FOREIGN KEY ("indicador_id") REFERENCES "public"."indicadores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "requisitos" ADD CONSTRAINT "requisitos_framework_id_frameworks_id_fk" FOREIGN KEY ("framework_id") REFERENCES "public"."frameworks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "risco_vinculos" ADD CONSTRAINT "risco_vinculos_risco_id_riscos_id_fk" FOREIGN KEY ("risco_id") REFERENCES "public"."riscos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "riscos" ADD CONSTRAINT "riscos_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "riscos" ADD CONSTRAINT "riscos_responsavel_id_usuarios_id_fk" FOREIGN KEY ("responsavel_id") REFERENCES "public"."usuarios"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "score_fornecedor_resultados" ADD CONSTRAINT "score_fornecedor_resultados_fornecedor_id_fornecedores_id_fk" FOREIGN KEY ("fornecedor_id") REFERENCES "public"."fornecedores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "score_fornecedor_resultados" ADD CONSTRAINT "score_fornecedor_resultados_modelo_id_score_modelos_id_fk" FOREIGN KEY ("modelo_id") REFERENCES "public"."score_modelos"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "score_modelo_criterios" ADD CONSTRAINT "score_modelo_criterios_modelo_id_score_modelos_id_fk" FOREIGN KEY ("modelo_id") REFERENCES "public"."score_modelos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "score_modelo_criterios" ADD CONSTRAINT "score_modelo_criterios_indicador_id_indicadores_id_fk" FOREIGN KEY ("indicador_id") REFERENCES "public"."indicadores"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "score_modelo_criterios" ADD CONSTRAINT "score_modelo_criterios_requisito_id_requisitos_id_fk" FOREIGN KEY ("requisito_id") REFERENCES "public"."requisitos"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unidades" ADD CONSTRAINT "unidades_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_fornecedor_id_fornecedores_id_fk" FOREIGN KEY ("fornecedor_id") REFERENCES "public"."fornecedores"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "valor_eventos" ADD CONSTRAINT "valor_eventos_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "valor_eventos" ADD CONSTRAINT "valor_eventos_validado_por_usuarios_id_fk" FOREIGN KEY ("validado_por") REFERENCES "public"."usuarios"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "valores_indicador" ADD CONSTRAINT "valores_indicador_indicador_id_indicadores_id_fk" FOREIGN KEY ("indicador_id") REFERENCES "public"."indicadores"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "valores_indicador" ADD CONSTRAINT "valores_indicador_responsavel_id_usuarios_id_fk" FOREIGN KEY ("responsavel_id") REFERENCES "public"."usuarios"("id") ON DELETE set null ON UPDATE no action;