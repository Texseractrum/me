import { getVitals, sanitizeVitals, saveVitals } from "@/lib/vitals";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json((await getVitals()) ?? {});
}

// Pushed every 15 minutes by scripts/push-vitals.mjs on Dan's Mac.
export async function POST(request: Request) {
  const key = process.env.STATS_API_KEY;
  if (!key || request.headers.get("x-api-key") !== key) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const vitals = sanitizeVitals(await request.json());
    if (!Object.keys(vitals).length) return Response.json({ error: "Empty" }, { status: 400 });
    await saveVitals(vitals);
    return Response.json({ ok: true, fields: Object.keys(vitals) });
  } catch {
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}
