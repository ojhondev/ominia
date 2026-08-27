"use client";

import { useMemo, useState } from "react";
import { Table, THead, Th, Tr, Td } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { ActionButton } from "@/components/ui/action-button";
import { ConfirmForm } from "@/components/ui/confirm-form";
import { Field, Select, Input } from "@/components/ui/field";
import { TIPOS_POR_CATEGORIA, labelDoTipo } from "@/lib/tipos-atividade";

const CATEGORIA_LABEL: Record<string, string> = {
  agricola: "Agrícola",
  industrial: "Industrial",
  logistica: "Logística",
  social: "Social",
  economico: "Econômico",
};

type Registro = {
  id: string;
  categoria: string;
  tipo: string;
  quantidade: string;
  unidade: string;
  dataReferencia: string;
  usinaNome: string | null;
  fazendaPropriedade: string | null;
  safraNome: string | null;
  status: string;
};

export function RegistrosTable({
  registros,
  validarRegistro,
  excluirRegistro,
}: {
  registros: Registro[];
  validarRegistro: (formData: FormData) => void;
  excluirRegistro: (formData: FormData) => void;
}) {
  const [categoria, setCategoria] = useState("");
  const [tipo, setTipo] = useState("");
  const [de, setDe] = useState("");
  const [ate, setAte] = useState("");

  const tiposDisponiveis = useMemo(() => {
    const presentes = new Set(registros.map((r) => r.tipo));
    const base = categoria ? (TIPOS_POR_CATEGORIA[categoria] ?? []) : Object.values(TIPOS_POR_CATEGORIA).flat();
    const catalogados = base.filter((t) => presentes.has(t.value));
    const catalogadosValues = new Set(catalogados.map((t) => t.value));
    const avulsos = [...presentes]
      .filter((t) => !catalogadosValues.has(t) && (!categoria || registros.some((r) => r.tipo === t && r.categoria === categoria)))
      .map((v) => ({ value: v, label: labelDoTipo(v) }));
    return [...catalogados, ...avulsos].sort((a, b) => a.label.localeCompare(b.label, "pt-BR"));
  }, [registros, categoria]);

  const filtrados = registros.filter((r) => {
    if (categoria && r.categoria !== categoria) return false;
    if (tipo && r.tipo !== tipo) return false;
    if (de && r.dataReferencia < de) return false;
    if (ate && r.dataReferencia > ate) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 rounded-2xl border border-lp-line bg-white p-4 sm:grid-cols-4">
        <Field label="Categoria" htmlFor="filtro-categoria">
          <Select
            id="filtro-categoria"
            value={categoria}
            onChange={(e) => {
              setCategoria(e.target.value);
              setTipo("");
            }}
          >
            <option value="">Todas</option>
            {Object.entries(CATEGORIA_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Tipo" htmlFor="filtro-tipo">
          <Select id="filtro-tipo" value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="">Todos</option>
            {tiposDisponiveis.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="De" htmlFor="filtro-de">
          <Input id="filtro-de" type="date" value={de} onChange={(e) => setDe(e.target.value)} />
        </Field>
        <Field label="Até" htmlFor="filtro-ate">
          <Input id="filtro-ate" type="date" value={ate} onChange={(e) => setAte(e.target.value)} />
        </Field>
      </div>

      {filtrados.length === 0 ? (
        <EmptyState title="Nenhum registro com esse filtro" description="Ajuste categoria, tipo ou período para ver outros registros." />
      ) : (
        <Table>
          <THead>
            <Th>Categoria</Th>
            <Th>Tipo</Th>
            <Th>Quantidade</Th>
            <Th>Data</Th>
            <Th>Usina</Th>
            <Th>Fazenda</Th>
            <Th>Safra</Th>
            <Th>Status</Th>
            <Th />
          </THead>
          <tbody>
            {filtrados.map((r) => (
              <Tr key={r.id}>
                <Td>{CATEGORIA_LABEL[r.categoria] ?? r.categoria}</Td>
                <Td className="font-medium text-lp-ink">{labelDoTipo(r.tipo)}</Td>
                <Td>
                  {Number(r.quantidade).toLocaleString("pt-BR")} {r.unidade}
                </Td>
                <Td>{r.dataReferencia}</Td>
                <Td>{r.usinaNome ?? "—"}</Td>
                <Td>{r.fazendaPropriedade ?? "—"}</Td>
                <Td>{r.safraNome ?? "—"}</Td>
                <Td>
                  <StatusBadge
                    label={r.status === "validado" ? "Validado" : "Rascunho"}
                    tone={r.status === "validado" ? "positive" : "neutral"}
                  />
                </Td>
                <Td>
                  <div className="flex gap-2">
                    {r.status === "rascunho" && (
                      <form action={validarRegistro}>
                        <input type="hidden" name="id" value={r.id} />
                        <ActionButton type="submit" variant="primary" pendingLabel="Validando...">
                          Validar
                        </ActionButton>
                      </form>
                    )}
                    <ConfirmForm action={excluirRegistro} confirmMessage="Excluir este registro de atividade? Essa ação não pode ser desfeita.">
                      <input type="hidden" name="id" value={r.id} />
                      <ActionButton type="submit" variant="danger" pendingLabel="Excluindo...">
                        Excluir
                      </ActionButton>
                    </ConfirmForm>
                  </div>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
