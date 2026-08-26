ALTER TYPE "public"."categoria_atividade" ADD VALUE 'social';--> statement-breakpoint
ALTER TYPE "public"."categoria_atividade" ADD VALUE 'economico';--> statement-breakpoint
ALTER TABLE "documentos" ADD COLUMN "arquivo_url" text;--> statement-breakpoint
ALTER TABLE "documentos" ADD COLUMN "arquivo_nome" text;--> statement-breakpoint
ALTER TABLE "documentos" ADD COLUMN "arquivo_mime_type" text;--> statement-breakpoint
ALTER TABLE "documentos" ADD COLUMN "arquivo_tamanho_bytes" integer;--> statement-breakpoint
ALTER TABLE "fazendas" ADD COLUMN "area_preservada_hectares" numeric;