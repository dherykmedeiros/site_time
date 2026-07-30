"use client";

import React, { createContext, useContext, useState, KeyboardEvent, useRef } from "react";

type TabsContextType = {
  value: string;
  onValueChange: (value: string) => void;
};

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export interface TabsRootProps {
  children: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

/**
 * Componente principal das Tabs
 */
export function TabsRoot({
  children,
  value,
  defaultValue,
  onValueChange,
  className = "",
}: TabsRootProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue || "");
  const isControlled = value !== undefined;
  
  const currentValue = isControlled ? value : uncontrolledValue;
  const handleValueChange = (newValue: string) => {
    if (!isControlled) {
      setUncontrolledValue(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
      <div className={`w-full ${className}`} data-tabs-root>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export interface TabsListProps {
  children: React.ReactNode;
  className?: string;
  "aria-label"?: string;
}

/**
 * Lista de abas
 */
export function TabsList({ children, className = "", "aria-label": ariaLabel }: TabsListProps) {
  const listRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const list = listRef.current;
    if (!list) return;

    const tabs = Array.from(list.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])'));
    const currentIndex = tabs.findIndex(tab => tab === document.activeElement);

    if (currentIndex === -1) return;

    let nextIndex = currentIndex;
    if (e.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % tabs.length;
      e.preventDefault();
    } else if (e.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      e.preventDefault();
    } else if (e.key === "Home") {
      nextIndex = 0;
      e.preventDefault();
    } else if (e.key === "End") {
      nextIndex = tabs.length - 1;
      e.preventDefault();
    }

    if (nextIndex !== currentIndex) {
      tabs[nextIndex].focus();
    }
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-orientation="horizontal"
      aria-label={ariaLabel}
      className={`flex border-b border-[var(--border)] ${className}`}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
}

export interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

/**
 * Gatilho de uma aba
 */
export function TabsTrigger({ value, children, className = "", disabled }: TabsTriggerProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsTrigger must be used within TabsRoot");

  const isSelected = context.value === value;

  return (
    <button
      role="tab"
      aria-selected={isSelected}
      aria-controls={`tabpanel-${value}`}
      id={`tab-${value}`}
      disabled={disabled}
      onClick={() => {
        if (!disabled) context.onValueChange(value);
      }}
      className={`
        px-4 py-2 text-sm font-medium transition-colors
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]
        disabled:opacity-50 disabled:cursor-not-allowed
        ${isSelected 
          ? "text-[var(--brand)] border-b-2 border-[var(--brand)] -mb-[1px]" 
          : "text-[var(--text-muted)] hover:text-[var(--text)] border-b-2 border-transparent"
        }
        ${className}
      `}
      tabIndex={isSelected ? 0 : -1}
    >
      {children}
    </button>
  );
}

export interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Conteúdo de uma aba
 */
export function TabsContent({ value, children, className = "" }: TabsContentProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsContent must be used within TabsRoot");

  const isSelected = context.value === value;

  if (!isSelected) return null;

  return (
    <div
      role="tabpanel"
      id={`tabpanel-${value}`}
      aria-labelledby={`tab-${value}`}
      tabIndex={0}
      className={`mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] rounded-sm ${className}`}
    >
      {children}
    </div>
  );
}

export { TabsRoot as Tabs };
