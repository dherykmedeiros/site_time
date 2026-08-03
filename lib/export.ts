/**
 * Utilitários para geração e exportação de arquivos CSV e formatação de relatórios.
 */

/**
 * Escapa valores para inclusão em arquivos CSV de forma compatível com Excel e Google Sheets.
 */
export function formatCsvValue(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) return '""';
  const str = String(value).trim();
  // Se contiver aspas, vírgula ou quebra de linha, envolve em aspas e duplica as aspas internas
  if (str.includes('"') || str.includes(',') || str.includes(';') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

/**
 * Gera o conteúdo bruto de um arquivo CSV com cabeçalhos e linhas formatadas em UTF-8 com BOM (\uFEFF).
 */
export function generateCsvContent(headers: string[], rows: (string | number | boolean | null | undefined)[][]): string {
  const bom = "\uFEFF";
  const headerLine = headers.map(formatCsvValue).join(";");
  const dataLines = rows.map((row) => row.map(formatCsvValue).join(";")).join("\r\n");
  return `${bom}${headerLine}\r\n${dataLines}`;
}

/**
 * Cria uma resposta HTTP de download para CSV.
 */
export function createCsvResponse(filename: string, headers: string[], rows: (string | number | boolean | null | undefined)[][]): Response {
  const csvContent = generateCsvContent(headers, rows);
  return new Response(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}.csv"`,
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
