import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { STORAGE_KEYS } from "../../lib/constants";

const getInitialTheme = () => {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem(STORAGE_KEYS.theme);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const ThemeToggle = () => {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem(STORAGE_KEYS.theme, theme);
  }, [theme]);

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-900 transition hover:bg-neutral-100 hover:text-ink dark:text-neutral-400 dark:hover:bg-white/10"
    >
      {isDark ? (
        <Sun size={18} strokeWidth={2.2} />
      ) : (
        <Moon size={18} strokeWidth={2.2} />
      )}
    </button>
  );
};

export default ThemeToggle;
