// Latest original post on X (no replies or reposts). Pay-per-use API: the
// same post is billed once per UTC day, and Vercel's data cache keeps reads rare.
const BEARER = process.env.X_BEARER_TOKEN;
const USER_ID = "1934608034979889152"; // @aidaniil

export interface Post {
  id: string;
  text: string;
  url: string;
  date: string;
  views?: number;
  likes: number;
  replies: number;
  reposts: number;
  photo?: string;
  author: { name: string; username: string; avatar?: string };
}

interface ApiTweet {
  id: string;
  text: string;
  created_at: string;
  note_tweet?: { text: string };
  attachments?: { media_keys?: string[] };
  public_metrics?: {
    like_count: number;
    reply_count: number;
    retweet_count: number;
    quote_count: number;
    impression_count?: number;
  };
}

function clean(text: string) {
  return text
    .replace(/https:\/\/t\.co\/\w+/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function getLatestPost(): Promise<Post | null> {
  if (!BEARER) return null;
  try {
    const params = new URLSearchParams({
      max_results: "5",
      exclude: "replies,retweets",
      "tweet.fields": "created_at,public_metrics,attachments,note_tweet",
      expansions: "author_id,attachments.media_keys",
      "media.fields": "type,url,preview_image_url",
      "user.fields": "name,username,profile_image_url",
    });
    const res = await fetch(`https://api.x.com/2/users/${USER_ID}/tweets?${params}`, {
      headers: { Authorization: `Bearer ${BEARER}` },
      next: { revalidate: 900 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const json: {
      data?: ApiTweet[];
      includes?: {
        users?: { name: string; username: string; profile_image_url?: string }[];
        media?: { media_key: string; type: string; url?: string; preview_image_url?: string }[];
      };
    } = await res.json();

    const t = json.data?.[0];
    if (!t) return null;
    const user = json.includes?.users?.[0];
    const media = json.includes?.media?.find((m) => t.attachments?.media_keys?.includes(m.media_key));

    return {
      id: t.id,
      text: clean(t.note_tweet?.text ?? t.text),
      url: `https://x.com/aidaniil/status/${t.id}`,
      date: t.created_at,
      views: t.public_metrics?.impression_count,
      likes: t.public_metrics?.like_count ?? 0,
      replies: t.public_metrics?.reply_count ?? 0,
      reposts: (t.public_metrics?.retweet_count ?? 0) + (t.public_metrics?.quote_count ?? 0),
      photo: media?.url ?? media?.preview_image_url,
      author: {
        name: user?.name ?? "Dan",
        username: user?.username ?? "aidaniil",
        // _normal is 48px; _bigger is 73px, crisp at 20px on retina.
        avatar: user?.profile_image_url?.replace("_normal.", "_bigger."),
      },
    };
  } catch {
    return null;
  }
}
