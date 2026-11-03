import { getSql } from "@/lib/location";

const PUBLICATION = "https://substack.aidaniil.com";
const ARCHIVE_URL = `${PUBLICATION}/api/v1/archive?sort=new&limit=12`;
const TTL_MS = 15 * 60 * 1000;

export interface Post {
  id: number;
  title: string;
  url: string;
  date: string; // ISO
  subtitle?: string;
  likes: number;
  comments: number;
  restacks: number;
  /** Author-only stat, synced daily into our DB (see /api/substack/stats). */
  views?: number;
}

interface ArchivePost {
  id?: number;
  title?: string;
  subtitle?: string | null;
  canonical_url?: string;
  post_date?: string;
  audience?: string;
  type?: string;
  reaction_count?: number;
  comment_count?: number;
  restacks?: number;
}

let cache: { posts: Post[]; at: number } | null = null;

export async function getPosts(limit = 4): Promise<Post[]> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.posts.slice(0, limit);

  try {
    const res = await fetch(ARCHIVE_URL, {
      headers: { "User-Agent": "aidaniil.com", Accept: "application/json" },
      next: { revalidate: 900 },
    });
    if (!res.ok) throw new Error(`substack ${res.status}`);
    const data: ArchivePost[] = await res.json();

    const posts = data
      .filter((p) => p.id && p.title && p.canonical_url && p.post_date && p.audience === "everyone")
      .map(
        (p): Post => ({
          id: p.id!,
          title: p.title!,
          url: p.canonical_url!,
          date: new Date(p.post_date!).toISOString(),
          subtitle: p.subtitle || undefined,
          likes: p.reaction_count ?? 0,
          comments: p.comment_count ?? 0,
          restacks: p.restacks ?? 0,
        }),
      )
      .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

    const views = await getViews();
    for (const post of posts) post.views = views.get(post.id);

    cache = { posts, at: Date.now() };
    return posts.slice(0, limit);
  } catch {
    return cache?.posts.slice(0, limit) ?? [];
  }
}

export async function ensureStatsTable() {
  await getSql()`
    CREATE TABLE IF NOT EXISTS substack_post_stats (
      post_id bigint PRIMARY KEY,
      views integer NOT NULL,
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;
}

async function getViews(): Promise<Map<number, number>> {
  try {
    await ensureStatsTable();
    const rows = await getSql()<{ post_id: string; views: number }[]>`
      SELECT post_id, views FROM substack_post_stats
    `;
    return new Map(rows.map((r) => [Number(r.post_id), r.views]));
  } catch {
    return new Map();
  }
}

export async function saveViews(stats: { id: number; views: number }[]) {
  await ensureStatsTable();
  const sql = getSql();
  for (const { id, views } of stats) {
    await sql`
      INSERT INTO substack_post_stats (post_id, views, updated_at)
      VALUES (${id}, ${views}, now())
      ON CONFLICT (post_id) DO UPDATE SET views = EXCLUDED.views, updated_at = now()
    `;
  }
  cache = null;
}
