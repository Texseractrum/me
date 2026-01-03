import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "location.json");

export interface LocationData {
  city: string | null;
  country?: string;
}

export async function getLocation(): Promise<LocationData> {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return { city: null };
  }
}
