import { kv } from "@vercel/kv";

export interface LocationData {
  city: string | null;
  country?: string;
}

export async function getLocation(): Promise<LocationData> {
  try {
    const location = await kv.get<LocationData>("location");
    return location ?? { city: null };
  } catch {
    return { city: null };
  }
}
