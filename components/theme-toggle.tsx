"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="font-mono text-sm text-neutral-400" aria-label="Toggle theme">
        —
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="font-mono text-sm text-red-600 transition-colors duration-200 hover:text-red-800 dark:hover:text-red-400"
      aria-label="Toggle theme"
    >
      {isDark ? "Light" : "Dark"}
    </button>
  );
}
