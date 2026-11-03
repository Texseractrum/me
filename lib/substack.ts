const PUBLICATION = "https://substack.aidaniil.com";
const ARCHIVE_URL = `${PUBLICATION}/api/v1/archive?sort=new&limit=12`;
const TTL_MS = 15 * 60 * 1000;

export interface Post {
  title: string;
  url: string;
  date: string; // ISO
  subtitle?: string;
  likes: number;
  comments: number;
  restacks: number;
}

interface ArchivePost {
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
      .filter((p) => p.title && p.canonical_url && p.post_date && p.audience === "everyone")
      .map(
        (p): Post => ({
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

    cache = { posts, at: Date.now() };
    return posts.slice(0, limit);
  } catch {
    return cache?.posts.slice(0, limit) ?? [];
  }
}
