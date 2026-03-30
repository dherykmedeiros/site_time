import { ReactNode } from "react";

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
  className?: string;
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = "Nenhum registro encontrado",
  className = "",
}: TableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="rounded-[14px] border border-dashed border-[var(--border)] bg-[#fbfcfb] py-8 text-center text-sm text-[var(--text-muted)]">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto rounded-[14px] border border-[var(--border)] bg-white ${className}`}>
      <table className="min-w-full divide-y divide-[#e5ece5]">
        <thead className="bg-[#f3f7f3]">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#eef2ee] bg-white">
          {data.map((item) => (
            <tr key={keyExtractor(item)} className="transition-colors hover:bg-[#f8fbf8]">
              {columns.map((col) => (
                <td key={col.key} className="whitespace-nowrap px-6 py-4 text-sm text-[var(--text)]">
                  {col.render
                    ? col.render(item)
                    : String((item as Record<string, unknown>)[col.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
