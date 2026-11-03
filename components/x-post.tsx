/* eslint-disable @next/next/no-img-element */
import type { Post } from "@/lib/x";
import { Row } from "@/components/row";

function compact(n: number) {
  if (n < 1000) return String(n);
  const k = n / 1000;
  return `${k < 10 ? k.toFixed(1).replace(/\.0$/, "") : Math.round(k)}k`;
}

function ago(iso: string, now: number) {
  const m = Math.max(0, Math.floor((now - Date.parse(iso)) / 60_000));
  if (m < 60) return `${Math.max(m, 1)}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

// A small X post, set on the page grid: every line is 24px, numbers share the
// Writing columns, and the photo (if any) is exactly three lines tall.
export function XPost({ post, now }: { post: Post | null; now: number }) {
  if (!post) return null;

  return (
    <Row label="On X">
      <a href={post.url} target="_blank" rel="noopener noreferrer" className="group block !no-underline">
        <div className="grid grid-cols-[minmax(0,1fr)_12ch] sm:grid-cols-[minmax(0,1fr)_12ch_10ch]">
          <span className="flex min-w-0 items-center gap-[1ch]">
            {post.author.avatar && (
              <img
                src={post.author.avatar}
                alt=""
                width={18}
                height={18}
                className="size-[18px] shrink-0 rounded-full"
              />
            )}
            <span className="truncate">
              <span className="text-ink">{post.author.name}</span>
              <span className="text-dim">
                {" "}
                @{post.author.username}, {ago(post.date, now)}
              </span>
            </span>
          </span>
          <span className="text-right text-dim">
            {post.views != null && `${compact(post.views)} views`}
          </span>
          <span className="hidden text-right text-dim sm:block">{post.likes} likes</span>
        </div>

        <div className={post.photo ? "grid grid-cols-[minmax(0,1fr)_72px] gap-x-[2ch]" : undefined}>
          <p className="line-clamp-3 whitespace-pre-line text-ink/75 group-hover:text-ink">{post.text}</p>
          {post.photo && (
            <img
              src={`${post.photo}?name=small`}
              alt=""
              width={72}
              height={72}
              className="size-[72px] rounded-[3px] object-cover opacity-90 group-hover:opacity-100"
            />
          )}
        </div>
      </a>
    </Row>
  );
}
