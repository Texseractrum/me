"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

const noop = () => () => {};

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  // The theme is only known on the client; render the label after mount so the
  // server's guess never sticks. Both labels are 5ch, so nothing shifts.
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="cursor-pointer text-dim hover:text-ink"
      aria-label={!mounted ? "Toggle theme" : isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      <span className={mounted ? undefined : "invisible"}>
        {mounted && isDark ? "Light" : "Dark"}
      </span>
    </button>
  );
}
