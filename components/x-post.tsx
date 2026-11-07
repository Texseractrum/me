/* eslint-disable @next/next/no-img-element */
import { BarChart2, Heart, MessageCircle, Repeat2 } from "lucide-react";
import type { Media, Post } from "@/lib/x";
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
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-[14px] fill-current">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function Stat({ icon: Icon, value }: { icon: typeof Heart; value?: number }) {
  return (
    <span className="inline-flex h-6 items-center gap-1.5">
      <Icon aria-hidden="true" className="size-[15px]" strokeWidth={1.75} />
      {value != null && value > 0 && <span className="text-[13px] tabular-nums">{compact(value)}</span>}
    </span>
  );
}

// X serves each image at a few fixed widths; let the browser pick a sharp one.
function srcSet(src: string) {
  return `${src}?name=small 680w, ${src}?name=medium 1200w, ${src}?name=large 2048w`;
}

function Tile({ m, sizes, className = "", style }: { m: Media; sizes: string; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`relative overflow-hidden bg-ink/5 ${className}`} style={style}>
      <img
        src={`${m.src}?name=medium`}
        srcSet={srcSet(m.src)}
        sizes={sizes}
        alt={m.alt ?? ""}
        width={m.width}
        height={m.height}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 size-full object-cover"
      />
      {m.kind === "video" && (
        <span className="absolute left-1/2 top-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white ring-2 ring-white/80">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="ml-0.5 size-5 fill-current">
            <path d="M8 5.14v13.72a1 1 0 0 0 1.52.85l10.6-6.86a1 1 0 0 0 0-1.7L9.52 4.3A1 1 0 0 0 8 5.14z" />
          </svg>
        </span>
      )}
      {m.kind === "animated_gif" && (
        <span className="absolute bottom-2 left-2 rounded bg-black/70 px-1 text-[11px] font-semibold leading-4 text-white">
          GIF
        </span>
      )}
    </div>
  );
}

// Laid out the way X does it: one item at its own shape (very tall ones
// cropped), two side by side, three as one tall plus two stacked, four as 2x2.
function PostMedia({ media }: { media: Media[] }) {
  if (!media.length) return null;
  const frame = "my-3 overflow-hidden rounded-lg border border-ink/12";
  const full = "(min-width: 768px) 480px, calc(100vw - 110px)";
  const half = "(min-width: 768px) 240px, calc(50vw - 55px)";

  if (media.length === 1) {
    const m = media[0];
    const ratio = m.width && m.height ? Math.min(5, Math.max(0.8, m.width / m.height)) : 16 / 9;
    return (
      <div className={frame}>
        <Tile m={m} sizes={full} className="w-full" style={{ aspectRatio: ratio }} />
      </div>
    );
  }

  return (
    <div className={`${frame} grid aspect-video grid-cols-2 grid-rows-2 gap-[2px]`}>
      {media.map((m, i) => (
        <Tile
          key={m.src}
          m={m}
          sizes={half}
          className={media.length === 2 || (media.length === 3 && i === 0) ? "row-span-2" : ""}
        />
      ))}
    </div>
  );
}

// A post on X, set into the page: Geist sans, the site's two text tones, and
// 24px lines. On wide screens the -my-3 hangs the border in the half-lines above
// and below, so the author line sits level with the "On X" label. On phones the
// label stacks above, so the card drops below it instead of overlapping.
export function XPost({ post, now }: { post: Post | null; now: number }) {
  if (!post) return null;

  return (
    <Row label="On X">
      <a
        href={post.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Post by ${post.author.name} on X`}
        className="tweet mt-2 block sm:-mt-3 sm:-mb-3 rounded-xl border border-ink/12 bg-background px-[15px] py-[11px] !no-underline transition-colors hover:border-ink/25"
      >
        <div className="flex gap-3">
          {post.author.avatar && (
            <img
              src={post.author.avatar}
              alt=""
              width={36}
              height={36}
              className="mt-[2px] size-9 shrink-0 rounded-full"
            />
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="flex min-w-0 items-baseline gap-1">
                <span className="truncate font-semibold text-ink">{post.author.name}</span>
                <span className="truncate text-dim">
                  @{post.author.username} · {stamp(post.date, now)}
                </span>
              </div>
              <span className="flex h-6 items-center text-dim">
                <XLogo />
              </span>
            </div>

            <p className="line-clamp-4 whitespace-pre-line text-ink/85">
              {post.text}
            </p>

            <PostMedia media={post.media} />

            <div className="flex max-w-[400px] justify-between text-dim">
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
