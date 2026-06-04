import postgres from "postgres";

export interface LocationData {
  city: string | null;
  country?: string;
  updatedAt?: string;
}

let sql: postgres.Sql | null = null;

interface LocationRow {
  city: string;
  country: string | null;
  updated_at: string;
}

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SECRET_KEY;

  if (!url || !key) return null;

  return { url, key };
}

function toLocation(row: LocationRow): LocationData {
  return {
    city: row.city,
    country: row.country ?? undefined,
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

async function supabaseRequest(path: string, init?: RequestInit) {
  const config = getSupabaseConfig();
  if (!config) {
    throw new Error("SUPABASE_URL or SUPABASE_SECRET_KEY is not configured");
  }

  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Supabase request failed with ${response.status}`);
  }

  if (response.status === 204) return null;

  return response.json();
}

function getSql() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured");
  }

  sql ??= postgres(process.env.DATABASE_URL, {
    max: 1,
    ssl: "require",
  });

  return sql;
}

export async function ensureLocationTable() {
  await getSql()`
    CREATE TABLE IF NOT EXISTS app_location (
      id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
      city text NOT NULL,
      country text,
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;
}

export async function getLocation(): Promise<LocationData> {
  try {
    if (getSupabaseConfig()) {
      const rows = (await supabaseRequest(
        "app_location?select=city,country,updated_at&id=eq.1&limit=1"
      )) as LocationRow[];

      return rows[0] ? toLocation(rows[0]) : { city: null };
    }

    await ensureLocationTable();
    const rows = await getSql()<{
      city: string;
      country: string | null;
      updated_at: Date;
    }[]>`
      SELECT city, country, updated_at
      FROM app_location
      WHERE id = 1
      LIMIT 1
    `;

    const location = rows[0];
    if (!location) return { city: null };

    return {
      city: location.city,
      country: location.country ?? undefined,
      updatedAt: location.updated_at.toISOString(),
    };
  } catch {
    return { city: null };
  }
}

export async function setLocation(city: string, country?: string | null) {
  if (getSupabaseConfig()) {
    const rows = (await supabaseRequest("app_location?on_conflict=id", {
      method: "POST",
      headers: {
        Prefer: "resolution=merge-duplicates,return=representation",
      },
      body: JSON.stringify({
        id: 1,
        city,
        country: country ?? null,
        updated_at: new Date().toISOString(),
      }),
    })) as LocationRow[];

    return toLocation(rows[0]);
  }

  await ensureLocationTable();
  const rows = await getSql()<{
    city: string;
    country: string | null;
    updated_at: Date;
  }[]>`
    INSERT INTO app_location (id, city, country, updated_at)
    VALUES (1, ${city}, ${country ?? null}, now())
    ON CONFLICT (id) DO UPDATE SET
      city = EXCLUDED.city,
      country = EXCLUDED.country,
      updated_at = EXCLUDED.updated_at
    RETURNING city, country, updated_at
  `;

  const location = rows[0];

  return {
    city: location.city,
    country: location.country ?? undefined,
    updatedAt: location.updated_at.toISOString(),
  };
}
