import type { ReactNode } from "react";

// The page's one structural device: a 13ch label column and a content column.
// `marker` hangs in the margin left of the label so it never shifts text.
export function Row({
  label,
  marker,
  children,
}: {
  label: ReactNode;
  marker?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-[13ch_minmax(0,1fr)]">
      <h2 className="relative text-dim">
        {marker && (
          <span className="absolute right-full top-0 mr-[1ch] flex h-6 items-center">
            {marker}
          </span>
        )}
        {label}
      </h2>
      <div className="min-w-0">{children}</div>
    </section>
  );
}
