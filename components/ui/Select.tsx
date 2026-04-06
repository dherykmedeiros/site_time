import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className = "", id, ...props }, ref) => {
    const selectId = id || props.name;
    const errorId = error && selectId ? `${selectId}-error` : undefined;

    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={selectId} className="block text-sm font-semibold text-[var(--text)]">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          className={`block w-full rounded-[12px] border bg-white px-3 py-2 text-sm text-[var(--text)] shadow-sm transition-colors focus:outline-none ${
            error
              ? "border-[#e2a79b] focus:border-[var(--danger)]"
              : "border-[var(--border)] focus:border-[var(--brand)]"
          } ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="">{placeholder}</option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p id={errorId} role="alert" className="text-sm text-[var(--danger)]">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
