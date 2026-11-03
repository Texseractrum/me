import type { Commit } from "@/lib/github";
import type { Post } from "@/lib/x";
import { Row } from "@/components/row";

function ago(iso: string, now: number) {
  const m = Math.max(0, Math.floor((now - Date.parse(iso)) / 60_000));
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return d === 1 ? "yesterday" : `${d}d ago`;
}

function Line({ children, meta }: { children: React.ReactNode; meta: string }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-[2ch]">
      <span className="truncate">{children}</span>
      <span className="text-right text-dim">{meta}</span>
    </div>
  );
}

export function Activity({ post, commit, now }: { post: Post | null; commit: Commit | null; now: number }) {
  if (!post && !commit) return null;
  return (
    <div>
      {post && (
        <Row label="Last post">
          <Line meta={ago(post.date, now)}>
            <a href={post.url} target="_blank" rel="noopener noreferrer" className="text-ink/75 hover:text-ink">
              {post.text}
            </a>
          </Line>
        </Row>
      )}
      {commit && (
        <Row label="Last commit">
          <Line meta={ago(commit.date, now)}>
            {commit.private ? (
              <>
                <span className="text-ink/75">{commit.repo}</span>
                <span className="text-dim">, private repo</span>
              </>
            ) : (
              <a href={commit.url} target="_blank" rel="noopener noreferrer" className="text-ink/75 hover:text-ink">
                {commit.message}
                <span className="text-dim"> in {commit.repo}</span>
              </a>
            )}
          </Line>
        </Row>
      )}
    </div>
  );
}
