// Direct read-only access to Dan's Fitbit data through the Google Health API.
// https://developers.google.com/health

const CLIENT_ID = process.env.GOOGLE_HEALTH_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_HEALTH_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GOOGLE_HEALTH_REFRESH_TOKEN;

const API = "https://health.googleapis.com/v4/users/me/dataTypes";
const FAMILY = "dataSourceFamily=users/me/dataSourceFamilies/google-wearables";
const TTL_MS = 2 * 60 * 1000;

export interface Vitals {
  heartRate?: { bpm: number; measuredAt: string };
  restingHeartRate?: number;
  sleep?: { minutesAsleep: number; end: string };
  steps?: { count: number; asOf: string };
}

let token: { value: string; expiresAt: number } | null = null;
let cache: { data: Vitals | null; at: number } | null = null;

async function accessToken() {
  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) return null;
  if (token && token.expiresAt > Date.now() + 60_000) return token.value;
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
    cache: "no-store",
  });
  const json = await res.json();
  if (!json.access_token) return null;
  token = { value: json.access_token, expiresAt: Date.now() + json.expires_in * 1000 };
  return token.value;
}

async function points(auth: string, path: string) {
  const res = await fetch(`${API}/${path}`, {
    headers: { Authorization: `Bearer ${auth}` },
    cache: "no-store",
    signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) return [];
  return ((await res.json()).dataPoints ?? []) as Record<string, any>[]; // eslint-disable-line @typescript-eslint/no-explicit-any
}

const filter = (expr: string) => `filter=${encodeURIComponent(expr)}`;

function civilMidnight(timeZone: string) {
  const d = new Intl.DateTimeFormat("en-CA", { timeZone, dateStyle: "short" }).format(new Date());
  return `${d}T00:00:00`;
}

async function fetchVitals(timeZone: string): Promise<Vitals | null> {
  const auth = await accessToken();
  if (!auth) return null;
  const since = new Date(Date.now() - 24 * 3600_000).toISOString();

  const [hr, rhr, sleep, steps] = await Promise.all([
    points(auth, `heart-rate/dataPoints:reconcile?${FAMILY}&pageSize=1&${filter(`heart_rate.sample_time.physical_time >= "${since}"`)}`),
    points(auth, `daily-resting-heart-rate/dataPoints?pageSize=1`),
    points(auth, `sleep/dataPoints:reconcile?${FAMILY}&pageSize=1`),
    points(auth, `steps/dataPoints:reconcile?${FAMILY}&pageSize=1440&${filter(`steps.interval.civil_start_time >= "${civilMidnight(timeZone)}"`)}`),
  ]);

  const vitals: Vitals = {};

  const latest = hr[0]?.heartRate;
  if (latest) vitals.heartRate = { bpm: Number(latest.beatsPerMinute), measuredAt: latest.sampleTime.physicalTime };

  const resting = rhr[0]?.dailyRestingHeartRate?.beatsPerMinute;
  if (resting) vitals.restingHeartRate = Number(resting);

  const night = sleep[0]?.sleep;
  if (night?.interval?.endTime) {
    const asleepMs = (night.stages ?? [])
      .filter((s: { type: string }) => s.type !== "AWAKE")
      .reduce((sum: number, s: { startTime: string; endTime: string }) => sum + (Date.parse(s.endTime) - Date.parse(s.startTime)), 0);
    if (asleepMs > 0) vitals.sleep = { minutesAsleep: Math.round(asleepMs / 60_000), end: night.interval.endTime };
  }

  if (steps.length) {
    const count = steps.reduce((sum, p) => sum + Number(p.steps?.count ?? 0), 0);
    const asOf = steps.map((p) => p.steps?.interval?.endTime).filter(Boolean).sort().at(-1);
    vitals.steps = { count, asOf: asOf ?? new Date().toISOString() };
  }

  return vitals;
}

export async function getVitals(timeZone = "America/Los_Angeles"): Promise<Vitals | null> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.data;
  try {
    const data = await fetchVitals(timeZone);
    cache = { data, at: Date.now() };
    return data;
  } catch {
    return cache?.data ?? null;
  }
}
