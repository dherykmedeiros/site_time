"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { FormField } from "./FormField";
import { Input } from "./Input"; // Assume Input is in the same directory

interface CurrencyInputProps {
  /** Valor em centavos (ex: 1500 = R$ 15,00) */
  value: number;
  /** Função chamada quando o valor muda, retorna o valor em centavos */
  onChange: (cents: number) => void;
  /** Rótulo do campo */
  label?: string;
  /** Mensagem de erro */
  error?: string;
  /** Se o campo está desabilitado */
  disabled?: boolean;
  /** Texto de placeholder */
  placeholder?: string;
  /** ID para acessibilidade */
  id?: string;
  /** Se o campo é obrigatório */
  required?: boolean;
}

/**
 * Componente CurrencyInput para entrada de valores em Real (BRL)
 */
export function CurrencyInput({
  value,
  onChange,
  label,
  error,
  disabled,
  placeholder = "R$ 0,00",
  id = "currency-input",
  required,
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState("");

  // Converter centavos para string formatada
  const formatCentsToBRL = (cents: number): string => {
    if (isNaN(cents) || cents === 0) return "";
    const formatter = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    });
    return formatter.format(cents / 100);
  };

  // Sincronizar display com o valor externo
  useEffect(() => {
    setDisplayValue(formatCentsToBRL(value));
  }, [value]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Extrair apenas os dígitos
    const rawDigits = e.target.value.replace(/\D/g, "");
    
    if (rawDigits === "") {
      setDisplayValue("");
      onChange(0);
      return;
    }

    const cents = parseInt(rawDigits, 10);
    
    // Atualizar o valor de exibição internamente
    const formatter = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    });
    
    setDisplayValue(formatter.format(cents / 100));
    onChange(cents);
  };

  const inputElement = (
    <Input
      id={id}
      type="text"
      inputMode="numeric"
      value={displayValue}
      onChange={handleChange}
      disabled={disabled}
      placeholder={placeholder}
      className={error ? "border-[var(--danger)] focus:ring-[var(--danger)]" : ""}
      aria-invalid={!!error}
    />
  );

  if (label) {
    return (
      <FormField label={label} htmlFor={id} error={error} required={required}>
        {inputElement}
      </FormField>
    );
  }

  return inputElement;
}
