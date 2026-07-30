"use client";

import { useState, useMemo, ReactNode } from "react";
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./Table";
import { Input } from "./Input";
import { Button } from "./Button";
import { Card } from "./Card";
import { Skeleton } from "./Skeleton";

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  sortable?: boolean;
  className?: string;
}

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  sortable?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  loading?: boolean;
  pagination?: PaginationProps;
}

type SortConfig = {
  key: string;
  direction: "asc" | "desc";
} | null;

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  sortable = false,
  searchable = false,
  searchPlaceholder = "Buscar...",
  emptyMessage = "Nenhum resultado encontrado.",
  onRowClick,
  loading = false,
  pagination,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const processedData = useMemo(() => {
    let result = [...data];

    if (searchable && search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(lowerSearch)
        )
      );
    }

    if (sortable && sortConfig) {
      result.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];

        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, search, sortConfig, sortable, searchable]);

  // Loading State
  if (loading) {
    return (
      <div className="space-y-4">
        {searchable && <Skeleton className="h-10 w-full sm:w-64" />}
        <Card className="overflow-hidden">
          <div className="p-4 space-y-4">
            <div className="flex gap-4 border-b border-[var(--border)] pb-2">
              {columns.map((col, i) => (
                <Skeleton key={i} className="h-6 flex-1" />
              ))}
            </div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4">
                {columns.map((col, j) => (
                  <Skeleton key={j} className="h-12 flex-1" />
                ))}
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  const renderPagination = () => {
    if (!pagination) return null;
    const totalPages = Math.ceil(pagination.total / pagination.pageSize);
    
    return (
      <div className="flex items-center justify-between mt-4">
        <span className="text-sm text-[var(--text-subtle)]">
          Mostrando {(pagination.page - 1) * pagination.pageSize + 1} a {Math.min(pagination.page * pagination.pageSize, pagination.total)} de {pagination.total} resultados
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => pagination.onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            <ChevronLeft size={16} className="mr-1" /> Anterior
          </Button>
          <span className="text-sm font-medium px-2">
            Página {pagination.page} de {totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => pagination.onPageChange(pagination.page + 1)}
            disabled={pagination.page >= totalPages}
          >
            Próxima <ChevronRight size={16} className="ml-1" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full space-y-4">
      {searchable && (
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={16} className="text-[var(--text-subtle)]" />
          </div>
          <Input
            className="pl-9"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}

      {/* Tabela para Desktop */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={`${col.className || ""} ${col.sortable !== false && sortable ? "cursor-pointer select-none hover:bg-[var(--bg)]" : ""}`}
                  onClick={() => col.sortable !== false && sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {sortable && col.sortable !== false && sortConfig?.key === col.key && (
                      <span className="text-[var(--brand)]">
                        {sortConfig.direction === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </span>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {processedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-[var(--text-subtle)]">
                    <span className="text-sm">{emptyMessage}</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              processedData.map((item, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className={onRowClick ? "cursor-pointer hover:bg-[var(--bg)]" : ""}
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((col) => (
                    <TableCell key={col.key} className={col.className}>
                      {col.render ? col.render(item) : (item as any)[col.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Cards para Mobile */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {processedData.length === 0 ? (
          <Card className="p-8 text-center text-[var(--text-subtle)]">
            {emptyMessage}
          </Card>
        ) : (
          processedData.map((item, rowIndex) => (
            <Card
              key={rowIndex}
              className={`p-4 ${onRowClick ? "cursor-pointer active:scale-[0.99] transition-transform" : ""}`}
              onClick={() => onRowClick?.(item)}
            >
              <dl className="space-y-2">
                {columns.map((col) => (
                  <div key={col.key} className="flex justify-between items-start gap-4">
                    <dt className="text-xs font-medium text-[var(--text-subtle)]">{col.header}</dt>
                    <dd className="text-sm font-semibold text-[var(--text)] text-right">
                      {col.render ? col.render(item) : (item as any)[col.key]}
                    </dd>
                  </div>
                ))}
              </dl>
            </Card>
          ))
        )}
      </div>

      {renderPagination()}
    </div>
  );
}
