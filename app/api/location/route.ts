import { createClient } from "redis";

interface Location {
  city: string;
  country?: string;
  updatedAt: string;
}

const getRedis = async () => {
  const client = createClient({ url: process.env.REDIS_URL });
  await client.connect();
  return client;
};

export async function GET() {
  const redis = await getRedis();
  try {
    const data = await redis.get("location");
    await redis.disconnect();

    if (!data) {
      return Response.json({ city: null });
    }

    return Response.json(JSON.parse(data));
  } catch {
    await redis.disconnect();
    return Response.json({ city: null });
  }
}

export async function POST(request: Request) {
  const apiKey = request.headers.get("x-api-key");

  if (apiKey !== process.env.LOCATION_API_KEY) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const redis = await getRedis();
  try {
    const body = await request.json();

    if (!body.city) {
      await redis.disconnect();
      return Response.json({ error: "City is required" }, { status: 400 });
    }

    const location: Location = {
      city: body.city,
      country: body.country,
      updatedAt: new Date().toISOString(),
    };

    await redis.set("location", JSON.stringify(location));
    await redis.disconnect();

    return Response.json({ success: true, location });
  } catch {
    await redis.disconnect();
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
}
