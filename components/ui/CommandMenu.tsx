"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Search } from "lucide-react";

export interface CommandItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string[];
  onSelect: () => void;
  group?: string;
  disabled?: boolean;
}

interface CommandMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CommandItem[];
}

export function CommandMenu({ open, onOpenChange, items }: CommandMenuProps) {
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  // Agrupar itens
  const groupedItems = filteredItems.reduce((acc, item) => {
    const group = item.group || "Geral";
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
      setSearch("");
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selected = filteredItems[selectedIndex];
        if (selected && !selected.disabled) {
          selected.onSelect();
          onOpenChange(false);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        onOpenChange(false);
      }
    },
    [filteredItems, selectedIndex, onOpenChange]
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4" role="dialog" aria-modal="true">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />
      <div 
        className="relative w-full max-w-lg bg-[var(--bg-elevated)] rounded-xl shadow-2xl border border-[var(--border)] overflow-hidden flex flex-col max-h-[80vh]"
        role="combobox"
        aria-expanded="true"
        aria-haspopup="listbox"
      >
        <div className="flex items-center px-4 border-b border-[var(--border)]">
          <Search size={20} className="text-[var(--text-subtle)] mr-3" />
          <input
            ref={inputRef}
            className="flex-1 h-14 bg-transparent outline-none text-[var(--text)] placeholder:text-[var(--text-subtle)]"
            placeholder="Buscar ações..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
          />
          <div className="text-[10px] text-[var(--text-subtle)] bg-[var(--bg)] px-1.5 py-0.5 rounded border border-[var(--border)]">
            ESC
          </div>
        </div>

        <div className="overflow-y-auto p-2" role="listbox">
          {Object.keys(groupedItems).length === 0 ? (
            <div className="p-4 text-center text-[var(--text-subtle)] text-sm">
              Nenhum resultado encontrado.
            </div>
          ) : (
            Object.entries(groupedItems).map(([group, groupItems]) => (
              <div key={group} className="mb-2 last:mb-0">
                <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.25em] text-[var(--text-subtle)]">
                  {group}
                </div>
                {groupItems.map((item) => {
                  const index = filteredItems.indexOf(item);
                  const isSelected = index === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      role="option"
                      aria-selected={isSelected}
                      className={`flex items-center px-3 py-2.5 rounded-lg cursor-pointer text-sm transition-colors ${
                        isSelected ? "bg-[var(--bg)] text-[var(--brand)]" : "text-[var(--text)] hover:bg-[var(--bg)]"
                      } ${item.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                      onClick={() => {
                        if (!item.disabled) {
                          item.onSelect();
                          onOpenChange(false);
                        }
                      }}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      {item.icon && <span className="mr-3 text-[var(--text-muted)] flex-shrink-0">{item.icon}</span>}
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.shortcut && (
                        <div className="flex items-center gap-1 ml-4">
                          {item.shortcut.map((key) => (
                            <kbd key={key} className="text-[10px] font-mono text-[var(--text-subtle)] bg-[var(--bg)] px-1.5 py-0.5 rounded border border-[var(--border)]">
                              {key}
                            </kbd>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
