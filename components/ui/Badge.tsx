import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
}

const variants = {
  default: "bg-[#edf2ed] text-[#334652] border border-[#d6e0d6]",
  success: "bg-[#e4f5ee] text-[#1d5f4f] border border-[#bde0d1]",
  warning: "bg-[#fff4dc] text-[#7b5a1c] border border-[#f3ddab]",
  danger: "bg-[#fdecea] text-[#8c3626] border border-[#efc3bb]",
  info: "bg-[#e7f3f8] text-[#2e5d73] border border-[#b7d5e3]",
};

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
