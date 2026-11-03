import type { Post } from "@/lib/substack";

function compact(n: number) {
  if (n < 1000) return String(n);
  const k = n / 1000;
  return `${k < 10 ? k.toFixed(1).replace(/\.0$/, "") : Math.round(k)}k`;
}

function longDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function Writing({ posts }: { posts: Post[] }) {
  return (
    <ul>
      {posts.map((post) => (
        <li
          key={post.url}
          className="grid grid-cols-[minmax(0,1fr)_12ch] sm:grid-cols-[minmax(0,1fr)_12ch_10ch]"
        >
          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            title={[post.subtitle, longDate(post.date)].filter(Boolean).join("\n")}
            className="truncate text-ink/75 hover:text-ink"
          >
            {post.title}
          </a>
          <span className="whitespace-nowrap text-right text-dim">
            {post.views != null && `${compact(post.views)} views`}
          </span>
          <span className="hidden whitespace-nowrap text-right text-dim sm:block">
            {post.likes} likes
          </span>
        </li>
      ))}
    </ul>
  );
}
