"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const KEY = "mcfc-theme";
    const saved = localStorage.getItem(KEY) as "light" | "dark" | null;
    const initialTheme = saved || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
  }, []);

  useEffect(() => {
    document.body.classList.add("mcfc-portal-body");
    return () => {
      document.body.classList.remove("mcfc-portal-body");
    };
  }, []);

  const toggleTheme = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("mcfc-theme", newTheme);
  };

  if (!mounted) {
    return (
      <div className="theme-toggle" role="group" aria-label="Tema">
        <button type="button" className="opacity-50" aria-label="Tema claro">
          <SunIcon />
        </button>
        <button type="button" className="opacity-50" aria-label="Tema escuro">
          <MoonIcon />
        </button>
      </div>
    );
  }

  return (
    <div className="theme-toggle" role="group" aria-label="Tema">
      <button
        type="button"
        className={theme === "light" ? "on" : ""}
        onClick={() => toggleTheme("light")}
        aria-label="Tema claro"
        title="Tema claro"
      >
        <SunIcon />
      </button>
      <button
        type="button"
        className={theme === "dark" ? "on" : ""}
        onClick={() => toggleTheme("dark")}
        aria-label="Tema escuro"
        title="Tema escuro"
      >
        <MoonIcon />
      </button>
    </div>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
