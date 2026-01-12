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
      className="font-mono text-sm text-neutral-400 transition-all duration-300 hover:text-black dark:hover:text-white hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(0,0,0,0.5)] dark:hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
      aria-label="Toggle theme"
    >
      {isDark ? "Light" : "Dark"}
    </button>
  );
}
