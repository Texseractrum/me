import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "location.json");

interface Location {
  city: string;
  country?: string;
  updatedAt: string;
}

async function ensureDataDir() {
  const dir = path.dirname(DATA_FILE);
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch {
    // Directory exists
  }
}

async function readLocation(): Promise<Location | null> {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return null;
  }
}

async function writeLocation(location: Location) {
  await ensureDataDir();
  await fs.writeFile(DATA_FILE, JSON.stringify(location, null, 2));
}

export async function GET() {
  const location = await readLocation();

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

    await writeLocation(location);

    return Response.json({ success: true, location });
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
}
