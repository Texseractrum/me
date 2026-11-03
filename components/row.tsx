import type { ReactNode } from "react";

// The page's one structural device: a 13ch label column and a content column.
export function Row({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-[13ch_minmax(0,1fr)]">
      <h2 className="text-dim">{label}</h2>
      <div className="min-w-0">{children}</div>
    </section>
  );
}
