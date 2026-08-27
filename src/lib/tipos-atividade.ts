export type TipoAtividade = { value: string; label: string };

/**
 * Catálogo de tipos de registro por categoria. O `value` é o slug gravado no banco
 * (usado por engines de cálculo que casam por string exata, ex. Bonsucro BNS-02/06/07/08)
 * — nunca renomear um `value` já em uso. O `label` é só para exibição/seleção.
 */
export const TIPOS_POR_CATEGORIA: Record<string, TipoAtividade[]> = {
  agricola: [
    { value: "diesel_agricola", label: "Diesel agrícola" },
    { value: "fertilizante_n", label: "Fertilizante N" },
    { value: "fertilizante_p", label: "Fertilizante P" },
    { value: "fertilizante_k", label: "Fertilizante K" },
    { value: "calcario", label: "Calcário" },
    { value: "gesso", label: "Gesso agrícola" },
    { value: "defensivo", label: "Defensivo agrícola" },
  ],
  industrial: [
    { value: "cana_processada", label: "Cana processada" },
    { value: "etanol_produzido", label: "Etanol produzido" },
    { value: "acucar_produzido", label: "Açúcar produzido" },
    { value: "energia_eletrica", label: "Energia elétrica" },
    { value: "vapor", label: "Vapor" },
    { value: "agua_industrial", label: "Água industrial" },
  ],
  logistica: [
    { value: "combustivel_transporte", label: "Combustível de transporte" },
    { value: "distancia_km", label: "Distância percorrida (km)" },
    { value: "quantidade_transportada", label: "Quantidade transportada" },
  ],
  social: [
    { value: "funcionarios_total", label: "Funcionários (total)" },
    { value: "acidentes_registrados", label: "Acidentes registrados" },
    { value: "horas_treinamento", label: "Horas de treinamento" },
  ],
  economico: [
    { value: "receita_safra", label: "Receita da safra" },
    { value: "custo_producao", label: "Custo de produção" },
  ],
};

export const TIPO_LABEL: Record<string, string> = Object.fromEntries(
  Object.values(TIPOS_POR_CATEGORIA)
    .flat()
    .map((t) => [t.value, t.label]),
);

export function labelDoTipo(tipo: string): string {
  return TIPO_LABEL[tipo] ?? tipo;
}
