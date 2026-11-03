import { Eye, Heart, MessageCircle } from "lucide-react";
import type { Post } from "@/lib/substack";

const NEW_FOR_DAYS = 21;

function compact(n: number) {
  if (n < 1000) return String(n);
  const k = n / 1000;
  return `${k < 10 ? k.toFixed(1).replace(/\.0$/, "") : Math.round(k)}k`;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const month = d.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
  return `${month} ’${String(d.getUTCFullYear()).slice(2)}`;
}

export function Writing({ posts, now }: { posts: Post[]; now: number }) {
  if (!posts.length) return null;

  return (
    <section aria-labelledby="writing-label" className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-4">
        <h2
          id="writing-label"
          className="font-mono text-sm font-normal uppercase tracking-widest text-neutral-400"
        >
          Writing
        </h2>
        <a
          href="https://substack.aidaniil.com/archive"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-sm text-neutral-400 transition-colors hover:text-black dark:hover:text-white"
        >
          all posts →
        </a>
      </div>

      <ol className="flex min-w-0 flex-col gap-3">
        {posts.map((post) => {
          const fresh = now - Date.parse(post.date) < NEW_FOR_DAYS * 864e5;
          return (
            <li key={post.url} className="group flex min-w-0 items-baseline gap-3 font-mono">
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                title={post.subtitle}
                className="min-w-0 truncate text-base text-neutral-600 underline decoration-neutral-300 underline-offset-4 transition-colors duration-200 hover:text-black hover:decoration-black dark:text-neutral-400 dark:decoration-neutral-700 dark:hover:text-white dark:hover:decoration-white"
              >
                {post.title}
              </a>
              {fresh && (
                <span className="shrink-0 rounded-full border border-neutral-300 px-1.5 text-[10px] uppercase leading-4 tracking-widest text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
                  new
                </span>
              )}
              <span
                aria-hidden="true"
                className="min-w-4 flex-1 -translate-y-[0.3em] border-b border-dotted border-neutral-300 transition-colors duration-200 group-hover:border-neutral-400 dark:border-neutral-700 dark:group-hover:border-neutral-500"
              />
              <span className="flex shrink-0 items-baseline gap-3 text-sm tabular-nums text-neutral-400 dark:text-neutral-500">
                {post.views != null && (
                  <span
                    className="inline-flex items-center gap-1"
                    aria-label={`${post.views.toLocaleString("en-US")} views`}
                    title={`${post.views.toLocaleString("en-US")} views`}
                  >
                    <Eye aria-hidden="true" className="size-3 translate-y-px" strokeWidth={2} />
                    {compact(post.views)}
                  </span>
                )}
                <span
                  className="inline-flex items-center gap-1"
                  aria-label={`${post.likes} likes`}
                  title={`${post.likes} likes`}
                >
                  <Heart
                    aria-hidden="true"
                    className="size-3 translate-y-px transition-[color,fill] duration-300 group-hover:fill-rose-500 group-hover:text-rose-500"
                    strokeWidth={2}
                  />
                  {post.likes}
                </span>
                {post.comments > 0 && (
                  <a
                    href={`${post.url}/comments`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden items-center gap-1 transition-colors hover:text-black sm:inline-flex dark:hover:text-white"
                    aria-label={`${post.comments} comments`}
                    title={`${post.comments} comments`}
                  >
                    <MessageCircle aria-hidden="true" className="size-3 translate-y-px" strokeWidth={2} />
                    {post.comments}
                  </a>
                )}
              </span>
              <time
                dateTime={post.date}
                className="shrink-0 text-sm tabular-nums text-neutral-400 transition-colors duration-200 group-hover:text-neutral-600 dark:text-neutral-500 dark:group-hover:text-neutral-300"
              >
                {formatDate(post.date)}
              </time>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
