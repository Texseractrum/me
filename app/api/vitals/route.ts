import { GarminConnect } from "garmin-connect";

const EMAIL = process.env.GARMIN_EMAIL;
const PASSWORD = process.env.GARMIN_PASSWORD;

let cachedClient: GarminConnect | null = null;
let lastFetch: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CachedData {
  heartRate: number | null;
  sleepScore: number | null;
  fetchedAt: number;
}

let cachedData: CachedData | null = null;

async function getClient(): Promise<GarminConnect> {
  if (cachedClient) {
    return cachedClient;
  }

  const client = new GarminConnect({
    username: EMAIL!,
    password: PASSWORD!,
  });
  await client.login();
  cachedClient = client;

  return client;
}

async function fetchVitals() {
  const now = Date.now();

  if (cachedData && now - lastFetch < CACHE_DURATION) {
    return cachedData;
  }

  try {
    const client = await getClient();

    const today = new Date();

    const [heartRateData, sleepData] = await Promise.all([
      client.getHeartRate(today).catch(() => null),
      client.getSleepData(today).catch(() => null),
    ]);

    const heartRate = heartRateData?.restingHeartRate ?? null;
    const sleepScore = sleepData?.sleepScores?.overall?.value ?? null;

    cachedData = {
      heartRate,
      sleepScore,
      fetchedAt: now,
    };
    lastFetch = now;

    return cachedData;
  } catch (error) {
    console.error("Garmin fetch error:", error);
    return cachedData ?? { heartRate: null, sleepScore: null, fetchedAt: now };
  }
}

export async function GET() {
  if (!EMAIL || !PASSWORD) {
    return Response.json({
      heartRate: null,
      sleepScore: null,
      error: "Garmin credentials not configured",
    });
  }

  try {
    const vitals = await fetchVitals();

    return Response.json({
      heartRate: vitals.heartRate,
      sleepScore: vitals.sleepScore,
    });
  } catch {
    return Response.json({ heartRate: null, sleepScore: null });
  }
}
