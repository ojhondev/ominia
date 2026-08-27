"use client";

import { useState } from "react";
import { Field, Input, Select } from "@/components/ui/field";
import { TIPOS_POR_CATEGORIA } from "@/lib/tipos-atividade";

const CATEGORIAS = [
  { value: "agricola", label: "Agrícola" },
  { value: "industrial", label: "Industrial" },
  { value: "logistica", label: "Logística" },
  { value: "social", label: "Social" },
  { value: "economico", label: "Econômico" },
];

const OUTRO = "__outro__";

export function CategoriaTipoFields() {
  const [categoria, setCategoria] = useState("agricola");
  const [tipo, setTipo] = useState<string>(TIPOS_POR_CATEGORIA.agricola[0].value);
  const [outro, setOutro] = useState("");

  const opcoes = TIPOS_POR_CATEGORIA[categoria] ?? [];

  return (
    <>
      <Field label="Categoria" htmlFor="categoria">
        <Select
          id="categoria"
          name="categoria"
          required
          value={categoria}
          onChange={(e) => {
            const nova = e.target.value;
            setCategoria(nova);
            setTipo(TIPOS_POR_CATEGORIA[nova]?.[0]?.value ?? OUTRO);
          }}
        >
          {CATEGORIAS.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Tipo" htmlFor="tipo-select">
        <Select id="tipo-select" value={tipo} onChange={(e) => setTipo(e.target.value)}>
          {opcoes.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
          <option value={OUTRO}>Outro (digitar)</option>
        </Select>
        {tipo === OUTRO ? (
          <Input
            className="mt-2"
            name="tipo"
            required
            placeholder="Nome do tipo"
            value={outro}
            onChange={(e) => setOutro(e.target.value)}
          />
        ) : (
          <input type="hidden" name="tipo" value={tipo} />
        )}
      </Field>
    </>
  );
}
