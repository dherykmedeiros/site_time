import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const textareaId = id || props.name;

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
          className={`block w-full rounded-[12px] border bg-white px-3 py-2 text-sm text-[var(--text)] shadow-sm transition-colors focus:outline-none ${
            error
              ? "border-[#e2a79b] focus:border-[var(--danger)]"
              : "border-[var(--border)] focus:border-[var(--brand)]"
          } ${className}`}
          rows={4}
          {...props}
        />
        {error && <p className="text-sm text-[var(--danger)]">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
