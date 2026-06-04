"use client";

import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="font-mono text-sm text-neutral-400 transition-colors duration-200 hover:text-black dark:hover:text-white"
      aria-label="Toggle theme"
      suppressHydrationWarning
    >
      {isDark ? "Light" : "Dark"}
    </button>
  );
}
