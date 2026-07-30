import { ReactNode } from "react";
import { AlertCircle } from "lucide-react";

interface FormFieldProps {
  /** Rótulo do campo */
  label: string;
  /** ID do input associado */
  htmlFor: string;
  /** Mensagem de erro opcional */
  error?: string;
  /** Se o campo é obrigatório */
  required?: boolean;
  /** Texto de dica opcional */
  hint?: string;
  /** O input propriamente dito */
  children: ReactNode;
  /** Classes CSS adicionais para o container */
  className?: string;
}

/**
 * Componente FormField para envolver inputs de formulário com rótulo, dicas e erros
 */
export function FormField({
  label,
  htmlFor,
  error,
  required,
  hint,
  children,
  className = "",
}: FormFieldProps) {
  const errorId = `${htmlFor}-error`;
  const hintId = `${htmlFor}-hint`;

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      <label
        htmlFor={htmlFor}
        className="text-[10px] font-black uppercase tracking-[0.25em] text-[var(--text-subtle)] flex items-center gap-1"
      >
        {label}
        {required && <span className="text-[var(--danger)]" aria-hidden="true">*</span>}
      </label>
      
      <div className="relative">
        {/* Usamos cloneElement se precisarmos injetar aria-describedby no child diretamente, 
            mas o mais seguro é que o usuário do FormField passe os arias no children.
            Como este é um wrapper genérico, assumimos que o children sabe lidar com as próprias props,
            ou envolvemos numa div que repassa a descrição para leitores de tela se necessário. */}
        {children}
      </div>

      {hint && !error && (
        <span id={hintId} className="text-xs text-[var(--text-subtle)] mt-0.5">
          {hint}
        </span>
      )}

      {error && (
        <span id={errorId} className="text-sm text-[var(--danger)] flex items-center gap-1.5 mt-0.5" role="alert">
          <AlertCircle size={14} />
          {error}
        </span>
      )}
    </div>
  );
}
