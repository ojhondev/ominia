export const ERROS: Record<string, string> = {
  campos_invalidos: "Preencha todos os campos obrigatórios com valores válidos.",
  numero_invalido: "Informe um número válido maior que zero.",
  nao_encontrado: "Registro não encontrado ou você não tem acesso a ele.",
  cnpj_invalido: "CNPJ inválido. Verifique os números digitados.",
  email_em_uso: "Já existe uma conta com este e-mail.",
  dados_invalidos: "Preencha todos os campos (senha com pelo menos 8 caracteres).",
  credenciais: "E-mail ou senha incorretos.",
  arquivo_obrigatorio: "Selecione um arquivo para enviar.",
  arquivo_muito_grande: "Arquivo maior que 20 MB. Envie um arquivo menor.",
  falha_upload: "Não foi possível enviar o arquivo. Tente novamente.",
  tem_dependencias: "Não é possível excluir: existem registros vinculados a este item.",
};

export function errorMessage(code?: string): string | undefined {
  if (!code) return undefined;
  return ERROS[code] ?? "Não foi possível concluir a ação. Verifique os dados e tente novamente.";
}
