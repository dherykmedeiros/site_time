import React from "react";

export interface ClubCrestProps {
  className?: string;
  variant?: "normal" | "white" | "footer";
  initials?: string;
  badgeUrl?: string | null;
}

export default function ClubCrest({
  className = "w-9 h-[42px] shrink-0",
  variant = "normal",
  initials = "MC",
  badgeUrl = null
}: ClubCrestProps) {
  if (badgeUrl) {
    return (
      <img
        src={badgeUrl}
        alt={`Escudo ${initials}`}
        className={`${className} object-contain`}
      />
    );
  }

  let fill = "var(--primary)";
  let stroke = "var(--ink)";
  let textFill = "var(--text-inv)";
  let lineStroke = "var(--bg)";

  if (variant === "white") {
    fill = "#fff";
    stroke = "#fff";
    textFill = "var(--primary)";
    lineStroke = "var(--primary)";
  } else if (variant === "footer") {
    fill = "var(--primary)";
    stroke = "#fff";
    textFill = "#fff";
    lineStroke = "#fff";
  }

  return (
    <svg className={className} viewBox="0 0 36 42">
      <path d="M18 1 L34 5 V22 C34 30 27 38 18 41 C9 38 2 30 2 22 V5 Z" fill={fill} stroke={stroke} strokeWidth="1" />
      <path d="M2 14 H34 M2 28 H34" stroke={lineStroke} strokeWidth=".8" opacity=".5" />
      <text x="18" y="26" textAnchor="middle" fill={textFill} className="font-serif font-bold" fontSize="13">
        {initials}
      </text>
    </svg>
  );
}
