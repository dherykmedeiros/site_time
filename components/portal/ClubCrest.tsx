import React from "react";

export interface ClubCrestProps {
  className?: string;
  variant?: "normal" | "white" | "footer" | "opponent";
  initials?: string;
  badgeUrl?: string | null;
}

export default function ClubCrest({
  className = "w-9 h-[42px] shrink-0",
  variant = "normal",
  initials = "MC",
  badgeUrl = null,
}: ClubCrestProps) {
  if (badgeUrl) {
    return (
      <img
        src={badgeUrl}
        alt={`Escudo ${initials}`}
        className={`${className} object-contain filter drop-shadow-sm`}
      />
    );
  }

  let fill = "var(--primary, #0a584b)";
  let stroke = "var(--border-strong, #d4cfc1)";
  let textFill = "#ffffff";
  let lineStroke = "rgba(255,255,255,0.3)";

  if (variant === "white") {
    fill = "#ffffff";
    stroke = "#ffffff";
    textFill = "var(--primary, #0a584b)";
    lineStroke = "var(--primary-tint, #e6efed)";
  } else if (variant === "footer") {
    fill = "var(--primary, #0a584b)";
    stroke = "#ffffff";
    textFill = "#ffffff";
    lineStroke = "rgba(255,255,255,0.3)";
  } else if (variant === "opponent") {
    fill = "var(--surface-sunk, #241f1b)";
    stroke = "var(--border-strong, #3a342e)";
    textFill = "var(--text, #161412)";
    lineStroke = "var(--border-strong, #d4cfc1)";
  }

  return (
    <svg className={className} viewBox="0 0 36 42">
      <path
        d="M18 1 L34 5 V22 C34 30 27 38 18 41 C9 38 2 30 2 22 V5 Z"
        fill={fill}
        stroke={stroke}
        strokeWidth="1.5"
      />
      <path d="M2 14 H34 M2 28 H34" stroke={lineStroke} strokeWidth="1" opacity="0.6" />
      <text
        x="18"
        y="26"
        textAnchor="middle"
        fill={textFill}
        className="font-serif font-bold"
        fontSize="12"
        fontWeight="700"
      >
        {initials}
      </text>
    </svg>
  );
}
