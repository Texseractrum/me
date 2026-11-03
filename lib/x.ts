// Latest original post on X (no replies or reposts). Pay-per-use API: the
// same post is billed once per UTC day, and Vercel's data cache keeps reads rare.
const BEARER = process.env.X_BEARER_TOKEN;
const USER_ID = "1934608034979889152"; // @aidaniil

export interface Post {
  id: string;
  text: string;
  url: string;
  date: string;
}

export async function getLatestPost(): Promise<Post | null> {
  if (!BEARER) return null;
  try {
    const res = await fetch(
      `https://api.x.com/2/users/${USER_ID}/tweets?max_results=5&exclude=replies,retweets&tweet.fields=created_at,note_tweet`,
      {
        headers: { Authorization: `Bearer ${BEARER}` },
        next: { revalidate: 900 },
        signal: AbortSignal.timeout(5000),
      },
    );
    if (!res.ok) return null;
    const json: { data?: { id: string; text: string; created_at: string; note_tweet?: { text: string } }[] } =
      await res.json();
    const t = json.data?.[0];
    if (!t) return null;
    const text = (t.note_tweet?.text ?? t.text)
      .replace(/https:\/\/t\.co\/\w+/g, "")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/\s+/g, " ")
      .trim();
    return {
      id: t.id,
      text: text || "Posted a photo",
      url: `https://x.com/aidaniil/status/${t.id}`,
      date: t.created_at,
    };
  } catch {
    return null;
  }
}
