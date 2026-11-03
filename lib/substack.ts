const PUBLICATION = "https://substack.aidaniil.com";
// Public: titles, dates, likes. Author-only (needs the session cookie): views.
const ARCHIVE_URL = `${PUBLICATION}/api/v1/archive?sort=new&limit=12`;
const STATS_URL = `${PUBLICATION}/api/v1/post_management/published?offset=0&limit=25&order_by=post_date&order_direction=desc`;
const SESSION = process.env.SUBSTACK_SESSION; // connect.sid for the custom domain
const TTL_MS = 15 * 60 * 1000;

export interface Post {
  id: number;
  title: string;
  url: string;
  date: string;
  subtitle?: string;
  likes: number;
  comments: number;
  restacks: number;
  views?: number;
}

interface ArchivePost {
  id?: number;
  title?: string;
  subtitle?: string | null;
  canonical_url?: string;
  post_date?: string;
  audience?: string;
  reaction_count?: number;
  comment_count?: number;
  restacks?: number;
}

let cache: { posts: Post[]; at: number } | null = null;

async function getViews(): Promise<Map<number, number>> {
  if (!SESSION) return new Map();
  try {
    const res = await fetch(STATS_URL, {
      headers: { Cookie: `connect.sid=${SESSION}`, "User-Agent": "aidaniil.com" },
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return new Map();
    const data: { posts?: { id: number; stats?: { views?: number } }[] } = await res.json();
    return new Map(
      (data.posts ?? [])
        .filter((p) => typeof p.stats?.views === "number")
        .map((p) => [p.id, p.stats!.views!]),
    );
  } catch {
    return new Map();
  }
}

export async function getPosts(limit = 4): Promise<Post[]> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.posts.slice(0, limit);

  try {
    const [res, views] = await Promise.all([
      fetch(ARCHIVE_URL, {
        headers: { "User-Agent": "aidaniil.com", Accept: "application/json" },
        next: { revalidate: 900 },
      }),
      getViews(),
    ]);
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
          views: views.get(p.id!),
        }),
      )
      .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

    cache = { posts, at: Date.now() };
    return posts.slice(0, limit);
  } catch {
    return cache?.posts.slice(0, limit) ?? [];
  }
}
