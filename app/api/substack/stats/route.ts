import { saveViews } from "@/lib/substack";

// Substack only exposes views to the author, so a daily job running in Dan's
// logged-in browser pushes them here: POST { posts: [{ id, views }] }.
export async function POST(request: Request) {
  const key = process.env.STATS_API_KEY;
  if (!key || request.headers.get("x-api-key") !== key) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const stats = (Array.isArray(body?.posts) ? body.posts : [])
      .map((p: { id?: unknown; views?: unknown }) => ({ id: Number(p.id), views: Number(p.views) }))
      .filter(
        (p: { id: number; views: number }) =>
          Number.isSafeInteger(p.id) && p.id > 0 && Number.isFinite(p.views) && p.views >= 0,
      );

    if (!stats.length) return Response.json({ error: "No posts" }, { status: 400 });
    await saveViews(stats);
    return Response.json({ ok: true, saved: stats.length });
  } catch {
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}
