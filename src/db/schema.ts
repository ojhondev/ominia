import { pgTable, uuid, text, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const usuarioPapelEnum = pgEnum("usuario_papel", [
  "admin",
  "operacoes",
  "compliance",
  "fornecedor",
]);

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
  papel: usuarioPapelEnum("papel").notNull().default("operacoes"),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
});

export const leads = pgTable("leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  origem: text("origem").notNull().default("lp"),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
});
