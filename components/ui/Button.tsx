import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const variants = {
  primary:
    "bg-[var(--brand)] text-[#010403] hover:bg-[var(--brand-neon)] shadow-sm font-bold",
  secondary:
    "bg-[rgba(16,185,129,0.12)] text-[#6ee7b7] hover:bg-[rgba(16,185,129,0.2)] border border-[rgba(16,185,129,0.3)]",
  danger:
    "bg-[var(--danger)] text-white hover:bg-[#dc2626] shadow-sm",
  ghost:
    "bg-transparent text-[var(--text-muted)] hover:bg-white/[0.06] hover:text-[var(--text)]",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm rounded-[10px]",
  md: "px-4 py-2 text-sm rounded-[12px]",
  lg: "px-6 py-3 text-base rounded-[14px]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, className = "", children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
