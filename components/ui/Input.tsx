import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-semibold text-[var(--text)]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`block w-full rounded-[12px] border bg-white px-3 py-2 text-sm text-[var(--text)] shadow-sm transition-colors focus:outline-none ${
            error
              ? "border-[#e2a79b] focus:border-[var(--danger)]"
              : "border-[var(--border)] focus:border-[var(--brand)]"
          } ${className}`}
          {...props}
        />
        {error && <p className="text-sm text-[var(--danger)]">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
