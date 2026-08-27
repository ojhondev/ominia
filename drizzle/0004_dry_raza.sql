CREATE TYPE "public"."status_relatorio" AS ENUM('rascunho', 'publicado');--> statement-breakpoint
CREATE TABLE "relatorios_emissao" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empresa_id" uuid NOT NULL,
	"calculo_id" uuid NOT NULL,
	"slug_publico" text NOT NULL,
	"titulo" text NOT NULL,
	"notas" text,
	"status" "status_relatorio" DEFAULT 'rascunho' NOT NULL,
	"hash_conteudo" text,
	"selo_url" text,
	"consentimentos" jsonb,
	"criado_por" uuid,
	"publicado_por" uuid,
	"publicado_em" timestamp,
	"criado_em" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "relatorios_emissao_calculo_id_unique" UNIQUE("calculo_id"),
	CONSTRAINT "relatorios_emissao_slug_publico_unique" UNIQUE("slug_publico")
);
--> statement-breakpoint
ALTER TABLE "relatorios_emissao" ADD CONSTRAINT "relatorios_emissao_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "relatorios_emissao" ADD CONSTRAINT "relatorios_emissao_calculo_id_calculos_id_fk" FOREIGN KEY ("calculo_id") REFERENCES "public"."calculos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "relatorios_emissao" ADD CONSTRAINT "relatorios_emissao_criado_por_usuarios_id_fk" FOREIGN KEY ("criado_por") REFERENCES "public"."usuarios"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "relatorios_emissao" ADD CONSTRAINT "relatorios_emissao_publicado_por_usuarios_id_fk" FOREIGN KEY ("publicado_por") REFERENCES "public"."usuarios"("id") ON DELETE set null ON UPDATE no action;