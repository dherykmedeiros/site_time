import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const textareaId = id || props.name;
    const errorId = error && textareaId ? `${textareaId}-error` : undefined;

    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-semibold text-[var(--text)]">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          className={`block w-full rounded-[12px] border bg-white px-3 py-2 text-sm text-[var(--text)] shadow-sm transition-colors focus:outline-none ${
            error
              ? "border-[#e2a79b] focus:border-[var(--danger)]"
              : "border-[var(--border)] focus:border-[var(--brand)]"
          } ${className}`}
          rows={4}
          {...props}
        />
        {error && <p id={errorId} role="alert" className="text-sm text-[var(--danger)]">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
