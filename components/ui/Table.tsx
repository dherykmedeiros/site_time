import { ReactNode, HTMLAttributes, TableHTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from "react";

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
}

interface TableProps<T> {
  columns?: Column<T>[];
  data?: T[];
  keyExtractor?: (item: T) => string;
  emptyMessage?: string;
  className?: string;
  children?: ReactNode;
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = "Nenhum registro encontrado",
  className = "",
  children,
  ...props
}: TableProps<T> & TableHTMLAttributes<HTMLTableElement>) {
  if (children) {
    return (
      <div className={`overflow-x-auto rounded-[14px] border border-[var(--border)] bg-[var(--bg-elevated)] backdrop-blur-sm ${className}`}>
        <table className="min-w-full divide-y divide-white/5" {...props}>
          {children}
        </table>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="rounded-[14px] border border-dashed border-[var(--border)] bg-white/[0.02] py-8 text-center text-sm text-[var(--text-muted)]">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto rounded-[14px] border border-[var(--border)] bg-[var(--bg-elevated)] backdrop-blur-sm ${className}`}>
      <table className="min-w-full divide-y divide-white/5" {...props}>
        <thead className="bg-white/[0.03]">
          <tr>
            {columns?.map((col) => (
              <th
                key={col.key}
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 bg-transparent">
          {data.map((item) => (
            <tr key={keyExtractor ? keyExtractor(item) : String((item as any).id || Math.random())} className="transition-colors hover:bg-white/[0.03]">
              {columns?.map((col) => (
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

export function TableHeader({ className = "", children, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={`bg-white/[0.03] ${className}`} {...props}>
      {children}
    </thead>
  );
}

export function TableBody({ className = "", children, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={`divide-y divide-white/5 bg-transparent ${className}`} {...props}>
      {children}
    </tbody>
  );
}

export function TableRow({ className = "", children, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={`transition-colors hover:bg-white/[0.03] ${className}`} {...props}>
      {children}
    </tr>
  );
}

export function TableHead({ className = "", children, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] ${className}`}
      {...props}
    >
      {children}
    </th>
  );
}

export function TableCell({ className = "", children, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={`whitespace-nowrap px-6 py-4 text-sm text-[var(--text)] ${className}`} {...props}>
      {children}
    </td>
  );
}
