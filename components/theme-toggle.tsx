"use client";

import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="font-mono text-sm text-red-500 transition-colors duration-200 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400"
      aria-label="Toggle theme"
      suppressHydrationWarning
    >
      {isDark ? "Light" : "Dark"}
    </button>
  );
}
