/* eslint-disable @next/next/no-img-element */
import { BarChart2, Heart, MessageCircle, Repeat2 } from "lucide-react";
import type { Post } from "@/lib/x";
import { Row } from "@/components/row";

function compact(n: number) {
  if (n < 1000) return String(n);
  if (n < 1_000_000) {
    const k = n / 1000;
    return `${k < 10 ? k.toFixed(1).replace(/\.0$/, "") : Math.round(k)}K`;
  }
  return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
}

// X's own timestamp style: 5m, 23h, then "Nov 2".
function stamp(iso: string, now: number) {
  const m = Math.max(1, Math.floor((now - Date.parse(iso)) / 60_000));
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function XLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-[18px] fill-current">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function Stat({ icon: Icon, value }: { icon: typeof Heart; value?: number }) {
  return (
    <span className="inline-flex items-center gap-1">
      <Icon aria-hidden="true" className="size-[16px]" strokeWidth={1.75} />
      {value != null && value > 0 && <span className="text-[13px] tabular-nums">{compact(value)}</span>}
    </span>
  );
}

// Looks like a post on X (system sans, X's colours and spacing), sitting in
// the page's content column under an "On X" label.
export function XPost({ post, now }: { post: Post | null; now: number }) {
  if (!post) return null;

  return (
    <Row label="On X">
      <a
        href={post.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Post by ${post.author.name} on X`}
        className="tweet block rounded-2xl border border-[#cfd9de] bg-white px-4 pb-3 pt-3 !no-underline transition-colors hover:bg-[#f7f9f9] dark:border-[#2f3336] dark:bg-black dark:hover:bg-[#080808]"
      >
        <div className="flex gap-3">
          {post.author.avatar && (
            <img
              src={post.author.avatar}
              alt=""
              width={40}
              height={40}
              className="size-10 shrink-0 rounded-full"
            />
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="flex min-w-0 items-baseline gap-1 text-[15px] leading-5">
                <span className="truncate font-bold text-[#0f1419] dark:text-[#e7e9ea]">{post.author.name}</span>
                <span className="truncate text-[#536471] dark:text-[#71767b]">
                  @{post.author.username} · {stamp(post.date, now)}
                </span>
              </div>
              <span className="text-[#0f1419] dark:text-[#e7e9ea]">
                <XLogo />
              </span>
            </div>

            <p className="mt-0.5 line-clamp-4 whitespace-pre-line text-[15px] leading-5 text-[#0f1419] dark:text-[#e7e9ea]">
              {post.text}
            </p>

            {post.photo && (
              <img
                src={`${post.photo}?name=small`}
                alt=""
                className="mt-3 max-h-56 w-full rounded-2xl border border-[#cfd9de] object-cover dark:border-[#2f3336]"
              />
            )}

            <div className="mt-3 flex max-w-[425px] justify-between text-[#536471] dark:text-[#71767b]">
              <Stat icon={MessageCircle} value={post.replies} />
              <Stat icon={Repeat2} value={post.reposts} />
              <Stat icon={Heart} value={post.likes} />
              <Stat icon={BarChart2} value={post.views} />
            </div>
          </div>
        </div>
      </a>
    </Row>
  );
}
