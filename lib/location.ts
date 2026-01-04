import { createClient } from "redis";

export interface LocationData {
  city: string | null;
  country?: string;
}

export async function getLocation(): Promise<LocationData> {
  try {
    const client = createClient({ url: process.env.REDIS_URL });
    await client.connect();
    const data = await client.get("location");
    await client.disconnect();

    if (!data) return { city: null };
    return JSON.parse(data);
  } catch {
    return { city: null };
  }
}
