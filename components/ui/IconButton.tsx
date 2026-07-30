import { ButtonHTMLAttributes, ReactNode, forwardRef } from "react";
import { Button } from "./Button"; // Assume Button is in the same directory

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** O ícone a ser renderizado */
  icon: ReactNode;
  /** Variante visual do botão */
  variant?: "primary" | "secondary" | "danger" | "ghost";
  /** Tamanho do botão */
  size?: "sm" | "md" | "lg";
  /** Rótulo acessível (obrigatório) */
  label: string;
  /** Se deve ser circular (padrão: false, que usa rounded-lg) */
  circular?: boolean;
}

/**
 * Componente IconButton para botões que contém apenas um ícone
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, variant = "primary", size = "md", label, circular = false, className = "", ...props }, ref) => {
    const sizeClasses = {
      sm: "w-[32px] h-[32px] p-0 flex items-center justify-center",
      md: "w-[36px] h-[36px] p-0 flex items-center justify-center",
      lg: "w-[44px] h-[44px] p-0 flex items-center justify-center",
    };

    const shapeClass = circular ? "rounded-full" : "rounded-lg";

    return (
      <Button
        ref={ref}
        variant={variant}
        aria-label={label}
        className={`${sizeClasses[size]} ${shapeClass} ${className}`}
        {...props}
      >
        {icon}
      </Button>
    );
  }
);

IconButton.displayName = "IconButton";
