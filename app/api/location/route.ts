import { kv } from "@vercel/kv";

interface Location {
  city: string;
  country?: string;
  updatedAt: string;
}

export async function GET() {
  const location = await kv.get<Location>("location");

  if (!location) {
    return Response.json({ city: null });
  }

  return Response.json(location);
}

export async function POST(request: Request) {
  const apiKey = request.headers.get("x-api-key");

  if (apiKey !== process.env.LOCATION_API_KEY) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (!body.city) {
      return Response.json({ error: "City is required" }, { status: 400 });
    }

    const location: Location = {
      city: body.city,
      country: body.country,
      updatedAt: new Date().toISOString(),
    };

    await kv.set("location", location);

    return Response.json({ success: true, location });
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
}
