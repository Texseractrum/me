import { GarminConnect } from "garmin-connect";

export interface VitalsData {
  heartRate: number | null;
  sleepScore: number | null;
}

// In-memory cache
let cachedVitals: VitalsData = { heartRate: null, sleepScore: null };
let lastFetchTime = 0;
let lastAttemptTime = 0;
let isFetching = false;
let rateLimitedUntil = 0;

const CACHE_TTL = 30 * 60 * 1000; // 30 minutes - refresh data
const MIN_FETCH_INTERVAL = 10 * 60 * 1000; // 10 minutes - minimum between attempts
const RATE_LIMIT_BACKOFF = 60 * 60 * 1000; // 1 hour backoff if rate limited

// Background fetch - never blocks the request
async function refreshVitalsInBackground() {
  const now = Date.now();

  // Don't fetch if already fetching
  if (isFetching) return;

  // Don't fetch if rate limited
  if (now < rateLimitedUntil) {
    console.log("Garmin: Rate limited, skipping fetch");
    return;
  }

  // Don't fetch more often than MIN_FETCH_INTERVAL
  if (now - lastAttemptTime < MIN_FETCH_INTERVAL) {
    return;
  }

  const email = process.env.GARMIN_EMAIL;
  const password = process.env.GARMIN_PASSWORD;

  if (!email || !password) return;

  isFetching = true;
  lastAttemptTime = now;
  console.log("Garmin: Starting background refresh...");

  try {
    const client = new GarminConnect({
      username: email,
      password: password,
    });

    await client.login();
    console.log("Garmin: Login successful");

    const today = new Date();

    const [heartRateData, sleepData] = await Promise.all([
      client.getHeartRate(today).catch(() => null),
      client.getSleepData(today).catch(() => null),
    ]);

    const vitals: VitalsData = {
      heartRate: heartRateData?.restingHeartRate ?? null,
      sleepScore: (sleepData as any)?.dailySleepDTO?.sleepScores?.overall?.value ?? null,
    };

    // Update cache if we got data
    if (vitals.heartRate !== null || vitals.sleepScore !== null) {
      cachedVitals = vitals;
      lastFetchTime = now;
      console.log("Garmin: Cache updated", vitals);
    }
  } catch (error: any) {
    console.error("Garmin fetch error:", error?.message || error);

    // Detect rate limiting
    if (error?.message?.includes("429") || error?.message?.includes("rate")) {
      rateLimitedUntil = now + RATE_LIMIT_BACKOFF;
      console.log("Garmin: Rate limited, backing off for 1 hour");
    }
  } finally {
    isFetching = false;
  }
}

// Always returns immediately with cached data
// Triggers background refresh if cache is stale
export async function getVitals(): Promise<VitalsData> {
  const now = Date.now();
  const isStale = now - lastFetchTime > CACHE_TTL;

  // Trigger background refresh if stale (non-blocking)
  if (isStale) {
    refreshVitalsInBackground();
  }

  // Always return cached data immediately
  return cachedVitals;
}
