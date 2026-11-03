import { SparkleLink } from "@/components/sparkle-link";

export interface Role {
  name: string;
  href: string;
  role: string;
  batch?: string;
  current?: boolean;
  sparkle?: boolean;
}

// Row height drives the rail: it runs from the first dot's center to the
// last dot's center, so it never pokes out past either end.
const ROW = "h-11";
const HALF_ROW = "1.375rem";

export function Experience({ roles }: { roles: Role[] }) {
  return (
    <section aria-label="Experience">
      <ol className="relative">
        <span
          aria-hidden="true"
          className="absolute left-[3.5px] w-px bg-gradient-to-b from-neutral-400 via-neutral-300 to-neutral-200 dark:from-neutral-400 dark:via-neutral-700 dark:to-neutral-800"
          style={{ top: HALF_ROW, bottom: HALF_ROW }}
        />

        {roles.map((item) => {
          const LinkTag = item.sparkle ? SparkleLink : "a";
          const linkProps = item.sparkle
            ? {}
            : { target: "_blank", rel: "noopener noreferrer" };

          return (
            <li
              key={item.href}
              className={`group relative flex ${ROW} items-center gap-4 font-mono`}
            >
              <Dot current={item.current} />

              <div className="flex min-w-0 flex-1 items-baseline gap-3">
                <LinkTag
                  href={item.href}
                  {...linkProps}
                  className={`shrink-0 text-base underline underline-offset-4 transition-colors duration-200 ${
                    item.current
                      ? "text-neutral-900 decoration-neutral-300 hover:decoration-black dark:text-neutral-100 dark:decoration-neutral-600 dark:hover:decoration-white"
                      : "text-neutral-600 decoration-neutral-300 hover:text-black hover:decoration-black dark:text-neutral-400 dark:decoration-neutral-700 dark:hover:text-white dark:hover:decoration-white"
                  }`}
                >
                  {item.name}
                </LinkTag>

                {item.batch && (
                  <span className="shrink-0 text-sm text-neutral-400 dark:text-neutral-500">
                    {item.batch}
                  </span>
                )}

                {/* Dot leader, like a table of contents. Brightens on hover. */}
                <span
                  aria-hidden="true"
                  className="min-w-6 flex-1 -translate-y-[0.3em] border-b border-dotted border-neutral-300 transition-colors duration-200 group-hover:border-neutral-400 dark:border-neutral-700 dark:group-hover:border-neutral-500"
                />

                <span
                  className={`shrink-0 text-sm transition-colors duration-200 ${
                    item.current
                      ? "text-neutral-600 dark:text-neutral-300"
                      : "text-neutral-400 group-hover:text-neutral-600 dark:text-neutral-500 dark:group-hover:text-neutral-300"
                  }`}
                >
                  {item.role}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function Dot({ current }: { current?: boolean }) {
  if (current) {
    return (
      <span aria-hidden="true" className="relative z-10 flex h-2 w-2 shrink-0">
        {/* Slow breathing halo: this is the one happening now. */}
        <span className="absolute inset-0 rounded-full bg-neutral-900 opacity-30 motion-safe:animate-[ping_2.4s_cubic-bezier(0,0,0.2,1)_infinite] dark:bg-white" />
        <span className="relative h-2 w-2 rounded-full bg-neutral-900 dark:bg-white" />
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className="relative z-10 h-2 w-2 shrink-0 rounded-full border border-neutral-400 bg-background transition-colors duration-200 group-hover:border-neutral-900 group-hover:bg-neutral-900 dark:border-neutral-600 dark:group-hover:border-white dark:group-hover:bg-white"
    />
  );
}
