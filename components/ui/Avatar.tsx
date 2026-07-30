import React from "react";

export interface AvatarProps {
  src?: string | null;
  alt?: string;
  initials?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  status?: "online" | "offline" | "away";
  className?: string;
}

const sizeClasses = {
  xs: "w-6 h-6 text-xs",
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-14 h-14 text-lg",
  xl: "w-20 h-20 text-xl",
};

const statusClasses = {
  online: "bg-green-500",
  offline: "bg-gray-400",
  away: "bg-amber-500",
};

const statusSizes = {
  xs: "w-1.5 h-1.5 border",
  sm: "w-2 h-2 border-2",
  md: "w-2.5 h-2.5 border-2",
  lg: "w-3 h-3 border-2",
  xl: "w-4 h-4 border-[3px]",
};

/**
 * Componente de Avatar para usuários/jogadores
 */
export function Avatar({
  src,
  alt = "",
  initials,
  size = "md",
  status,
  className = "",
}: AvatarProps) {
  return (
    <div className={`relative inline-block ${className}`}>
      <div
        className={`
          flex items-center justify-center rounded-full overflow-hidden 
          bg-[var(--brand-soft)] text-[var(--brand)] font-medium
          border border-[var(--border)]
          ${sizeClasses[size]}
        `}
      >
        {src ? (
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        ) : (
          <span>{initials?.substring(0, 2).toUpperCase() || "?"}</span>
        )}
      </div>
      
      {status && (
        <span
          className={`
            absolute bottom-0 right-0 rounded-full border-[var(--bg)]
            ${statusClasses[status]}
            ${statusSizes[size]}
          `}
          title={`Status: ${status}`}
        />
      )}
    </div>
  );
}
