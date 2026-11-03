import { getSql } from "@/lib/location";

// Only these fields ever leave Dan's Mac (see scripts/push-vitals.mjs).
export interface Vitals {
  heartRate?: { bpm: number; measuredAt: string };
  restingHeartRate?: number;
  sleep?: { minutesAsleep: number; end: string };
  steps?: { count: number; asOf: string };
}

async function ensureTable() {
  await getSql()`
    CREATE TABLE IF NOT EXISTS app_vitals (
      id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
      data jsonb NOT NULL,
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;
}

export async function getVitals(): Promise<Vitals | null> {
  try {
    await ensureTable();
    const rows = await getSql()<{ data: Vitals }[]>`SELECT data FROM app_vitals WHERE id = 1`;
    return rows[0]?.data ?? null;
  } catch {
    return null;
  }
}

const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : undefined);
const iso = (v: unknown) =>
  typeof v === "string" && !Number.isNaN(Date.parse(v)) ? new Date(v).toISOString() : undefined;

/** Whitelist and validate whatever the client sent. */
export function sanitizeVitals(input: unknown): Vitals {
  const v = (input ?? {}) as Record<string, Record<string, unknown> | number | undefined>;
  const out: Vitals = {};
  const hr = v.heartRate as Record<string, unknown> | undefined;
  if (num(hr?.bpm) && iso(hr?.measuredAt)) out.heartRate = { bpm: num(hr!.bpm)!, measuredAt: iso(hr!.measuredAt)! };
  if (num(v.restingHeartRate)) out.restingHeartRate = num(v.restingHeartRate);
  const sl = v.sleep as Record<string, unknown> | undefined;
  if (num(sl?.minutesAsleep) && iso(sl?.end)) out.sleep = { minutesAsleep: num(sl!.minutesAsleep)!, end: iso(sl!.end)! };
  const st = v.steps as Record<string, unknown> | undefined;
  if (num(st?.count) != null && iso(st?.asOf)) out.steps = { count: num(st!.count)!, asOf: iso(st!.asOf)! };
  return out;
}

export async function saveVitals(vitals: Vitals) {
  await ensureTable();
  await getSql()`
    INSERT INTO app_vitals (id, data, updated_at)
    VALUES (1, ${getSql().json(vitals as never)}, now())
    ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = now()
  `;
}
