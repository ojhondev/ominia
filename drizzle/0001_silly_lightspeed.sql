CREATE TYPE "public"."categoria_atividade" AS ENUM('agricola', 'industrial', 'logistica');--> statement-breakpoint
CREATE TYPE "public"."origem_registro" AS ENUM('manual', 'upload');--> statement-breakpoint
CREATE TYPE "public"."status_compliance" AS ENUM('conforme', 'atencao', 'nao_conforme', 'sem_dados');--> statement-breakpoint
CREATE TYPE "public"."status_evidencia" AS ENUM('pendente', 'aprovado', 'rejeitado');--> statement-breakpoint
CREATE TYPE "public"."status_registro" AS ENUM('rascunho', 'validado');--> statement-breakpoint
CREATE TYPE "public"."status_versao_metodologia" AS ENUM('ativo', 'em_revisao', 'obsoleto');--> statement-breakpoint
CREATE TYPE "public"."tipo_fornecedor" AS ENUM('proprio', 'terceiro', 'cooperativa');--> statement-breakpoint
CREATE TABLE "calculos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empresa_id" uuid NOT NULL,
	"usina_id" uuid NOT NULL,
	"safra_id" uuid,
	"indicador_id" uuid NOT NULL,
	"versao_metodologia_id" uuid NOT NULL,
	"inputs" jsonb NOT NULL,
	"resultado" numeric NOT NULL,
	"unidade_resultado" text,
	"calculado_por" uuid,
	"calculado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "documentos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empresa_id" uuid NOT NULL,
	"nome" text NOT NULL,
	"tipo" text NOT NULL,
	"referencia_externa" text,
	"valido_ate" date,
	"uploaded_por" uuid,
	"criado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "evidencias" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empresa_id" uuid NOT NULL,
	"documento_id" uuid NOT NULL,
	"entidade_tipo" text NOT NULL,
	"entidade_id" uuid,
	"responsavel" text,
	"status" "status_evidencia" DEFAULT 'pendente' NOT NULL,
	"comentario" text,
	"versao" integer DEFAULT 1 NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fatores_emissao" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nome" text NOT NULL,
	"categoria" text NOT NULL,
	"valor" numeric NOT NULL,
	"unidade" text NOT NULL,
	"fonte" text NOT NULL,
	"versao" text NOT NULL,
	"valido_de" date NOT NULL,
	"valido_ate" date,
	"ativo" boolean DEFAULT true NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fazendas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empresa_id" uuid NOT NULL,
	"usina_id" uuid,
	"produtor" text NOT NULL,
	"propriedade" text NOT NULL,
	"municipio" text,
	"estado" text,
	"car" text,
	"area_hectares" numeric,
	"tipo_fornecedor" "tipo_fornecedor" DEFAULT 'terceiro' NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "indicadores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"versao_metodologia_id" uuid NOT NULL,
	"codigo" text NOT NULL,
	"nome" text NOT NULL,
	"unidade" text,
	"formula" text,
	"criado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "logs_auditoria" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empresa_id" uuid NOT NULL,
	"usuario_id" uuid,
	"entidade" text NOT NULL,
	"entidade_id" uuid,
	"acao" text NOT NULL,
	"detalhes" jsonb,
	"criado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "metodologias" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nome" text NOT NULL,
	"descricao" text,
	CONSTRAINT "metodologias_nome_unique" UNIQUE("nome")
);
--> statement-breakpoint
CREATE TABLE "registros_atividade" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empresa_id" uuid NOT NULL,
	"usina_id" uuid NOT NULL,
	"fazenda_id" uuid,
	"safra_id" uuid,
	"categoria" "categoria_atividade" NOT NULL,
	"tipo" text NOT NULL,
	"quantidade" numeric NOT NULL,
	"unidade" text NOT NULL,
	"data_referencia" date NOT NULL,
	"origem" "origem_registro" DEFAULT 'manual' NOT NULL,
	"status" "status_registro" DEFAULT 'rascunho' NOT NULL,
	"observacao" text,
	"criado_por" uuid,
	"criado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "requisitos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"versao_metodologia_id" uuid NOT NULL,
	"codigo" text NOT NULL,
	"nome" text NOT NULL,
	"descricao" text,
	"criado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resultados_compliance" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empresa_id" uuid NOT NULL,
	"usina_id" uuid NOT NULL,
	"safra_id" uuid,
	"requisito_id" uuid NOT NULL,
	"status" "status_compliance" DEFAULT 'sem_dados' NOT NULL,
	"percentual_completo" numeric,
	"atualizado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "safras" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empresa_id" uuid NOT NULL,
	"usina_id" uuid NOT NULL,
	"nome" text NOT NULL,
	"data_inicio" date,
	"data_fim" date,
	"area_colhida_hectares" numeric,
	"producao_toneladas" numeric,
	"encerrada" boolean DEFAULT false NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "usinas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empresa_id" uuid NOT NULL,
	"nome" text NOT NULL,
	"municipio" text,
	"estado" text,
	"capacidade_producao_ton" numeric,
	"rota_producao" text,
	"criado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "versoes_metodologia" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"metodologia_id" uuid NOT NULL,
	"versao" text NOT NULL,
	"vigente_de" date NOT NULL,
	"vigente_ate" date,
	"status" "status_versao_metodologia" DEFAULT 'ativo' NOT NULL,
	"fonte" text,
	"criado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "usuarios" ALTER COLUMN "papel" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "usuarios" ALTER COLUMN "papel" SET DEFAULT 'admin'::text;--> statement-breakpoint
DROP TYPE "public"."usuario_papel";--> statement-breakpoint
CREATE TYPE "public"."usuario_papel" AS ENUM('admin', 'sustentabilidade', 'agricola', 'industrial', 'fiscal', 'auditor', 'consultor');--> statement-breakpoint
ALTER TABLE "usuarios" ALTER COLUMN "papel" SET DEFAULT 'admin'::"public"."usuario_papel";--> statement-breakpoint
ALTER TABLE "usuarios" ALTER COLUMN "papel" SET DATA TYPE "public"."usuario_papel" USING "papel"::"public"."usuario_papel";--> statement-breakpoint
ALTER TABLE "calculos" ADD CONSTRAINT "calculos_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calculos" ADD CONSTRAINT "calculos_usina_id_usinas_id_fk" FOREIGN KEY ("usina_id") REFERENCES "public"."usinas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calculos" ADD CONSTRAINT "calculos_safra_id_safras_id_fk" FOREIGN KEY ("safra_id") REFERENCES "public"."safras"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calculos" ADD CONSTRAINT "calculos_indicador_id_indicadores_id_fk" FOREIGN KEY ("indicador_id") REFERENCES "public"."indicadores"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calculos" ADD CONSTRAINT "calculos_versao_metodologia_id_versoes_metodologia_id_fk" FOREIGN KEY ("versao_metodologia_id") REFERENCES "public"."versoes_metodologia"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calculos" ADD CONSTRAINT "calculos_calculado_por_usuarios_id_fk" FOREIGN KEY ("calculado_por") REFERENCES "public"."usuarios"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_uploaded_por_usuarios_id_fk" FOREIGN KEY ("uploaded_por") REFERENCES "public"."usuarios"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidencias" ADD CONSTRAINT "evidencias_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidencias" ADD CONSTRAINT "evidencias_documento_id_documentos_id_fk" FOREIGN KEY ("documento_id") REFERENCES "public"."documentos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fazendas" ADD CONSTRAINT "fazendas_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fazendas" ADD CONSTRAINT "fazendas_usina_id_usinas_id_fk" FOREIGN KEY ("usina_id") REFERENCES "public"."usinas"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "indicadores" ADD CONSTRAINT "indicadores_versao_metodologia_id_versoes_metodologia_id_fk" FOREIGN KEY ("versao_metodologia_id") REFERENCES "public"."versoes_metodologia"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "logs_auditoria" ADD CONSTRAINT "logs_auditoria_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "logs_auditoria" ADD CONSTRAINT "logs_auditoria_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "registros_atividade" ADD CONSTRAINT "registros_atividade_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "registros_atividade" ADD CONSTRAINT "registros_atividade_usina_id_usinas_id_fk" FOREIGN KEY ("usina_id") REFERENCES "public"."usinas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "registros_atividade" ADD CONSTRAINT "registros_atividade_fazenda_id_fazendas_id_fk" FOREIGN KEY ("fazenda_id") REFERENCES "public"."fazendas"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "registros_atividade" ADD CONSTRAINT "registros_atividade_safra_id_safras_id_fk" FOREIGN KEY ("safra_id") REFERENCES "public"."safras"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "registros_atividade" ADD CONSTRAINT "registros_atividade_criado_por_usuarios_id_fk" FOREIGN KEY ("criado_por") REFERENCES "public"."usuarios"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "requisitos" ADD CONSTRAINT "requisitos_versao_metodologia_id_versoes_metodologia_id_fk" FOREIGN KEY ("versao_metodologia_id") REFERENCES "public"."versoes_metodologia"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resultados_compliance" ADD CONSTRAINT "resultados_compliance_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resultados_compliance" ADD CONSTRAINT "resultados_compliance_usina_id_usinas_id_fk" FOREIGN KEY ("usina_id") REFERENCES "public"."usinas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resultados_compliance" ADD CONSTRAINT "resultados_compliance_safra_id_safras_id_fk" FOREIGN KEY ("safra_id") REFERENCES "public"."safras"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resultados_compliance" ADD CONSTRAINT "resultados_compliance_requisito_id_requisitos_id_fk" FOREIGN KEY ("requisito_id") REFERENCES "public"."requisitos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "safras" ADD CONSTRAINT "safras_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "safras" ADD CONSTRAINT "safras_usina_id_usinas_id_fk" FOREIGN KEY ("usina_id") REFERENCES "public"."usinas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usinas" ADD CONSTRAINT "usinas_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "versoes_metodologia" ADD CONSTRAINT "versoes_metodologia_metodologia_id_metodologias_id_fk" FOREIGN KEY ("metodologia_id") REFERENCES "public"."metodologias"("id") ON DELETE cascade ON UPDATE no action;