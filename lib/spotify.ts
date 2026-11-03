const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_ENDPOINT =
  "https://api.spotify.com/v1/me/player/currently-playing?additional_types=track,episode";
const RECENTLY_PLAYED_ENDPOINT =
  "https://api.spotify.com/v1/me/player/recently-played?limit=1";

// A paused track keeps showing up in currently-playing for a long time.
// Past this point we'd rather show the last finished track with its real time.
const STALE_PAUSE_MS = 30 * 60 * 1000;
const RESULT_TTL_MS = 10 * 1000;

export interface SpotifyData {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  url?: string;
  albumArt?: string;
  /** ISO time the track was last heard (finished, or paused). Absent while live. */
  playedAt?: string;
  progressMs?: number;
  durationMs?: number;
  /** Server time the snapshot was taken, so clients can extrapolate progress. */
  fetchedAt: number;
}

type SpotifyArtist = { name: string };
type SpotifyItem = {
  name: string;
  duration_ms?: number;
  external_urls?: { spotify?: string };
  artists?: SpotifyArtist[];
  album?: { images?: { url: string }[] };
  show?: { name: string; images?: { url: string }[] };
  images?: { url: string }[];
};

let tokenCache: { token: string; expiresAt: number } | null = null;
let resultCache: { data: SpotifyData; at: number } | null = null;
let inflight: Promise<SpotifyData> | null = null;

async function getAccessToken(): Promise<string | null> {
  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) return null;
  if (tokenCache && tokenCache.expiresAt > Date.now() + 60_000) {
    return tokenCache.token;
  }

  const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: REFRESH_TOKEN,
    }),
    cache: "no-store",
  });
  const data = await response.json();
  if (!data?.access_token) return null;

  tokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000,
  };
  return tokenCache.token;
}

function describe(item: SpotifyItem) {
  return {
    title: item.name,
    artist: item.artists?.length
      ? item.artists.map((a) => a.name).join(", ")
      : item.show?.name,
    url: item.external_urls?.spotify,
    albumArt:
      item.album?.images?.[0]?.url ??
      item.images?.[0]?.url ??
      item.show?.images?.[0]?.url,
    durationMs: item.duration_ms,
  };
}

async function fetchSpotify(): Promise<SpotifyData> {
  const fetchedAt = Date.now();
  const token = await getAccessToken();
  if (!token) return { isPlaying: false, fetchedAt };

  const headers = { Authorization: `Bearer ${token}` };

  const [nowRes, recentRes] = await Promise.all([
    fetch(NOW_PLAYING_ENDPOINT, { headers, cache: "no-store" }),
    fetch(RECENTLY_PLAYED_ENDPOINT, { headers, cache: "no-store" }),
  ]);

  const now = nowRes.status === 200 ? await nowRes.json() : null;
  const recent = recentRes.ok ? await recentRes.json() : null;
  const last = recent?.items?.[0] as
    | { track: SpotifyItem; played_at: string }
    | undefined;

  if (now?.item && now.is_playing) {
    return {
      isPlaying: true,
      ...describe(now.item),
      progressMs: now.progress_ms ?? undefined,
      fetchedAt,
    };
  }

  // Paused mid-track: Spotify's `timestamp` is when playback state last changed.
  const pausedAt = typeof now?.timestamp === "number" ? now.timestamp : null;
  const lastAt = last ? Date.parse(last.played_at) : null;
  if (
    now?.item &&
    pausedAt &&
    fetchedAt - pausedAt < STALE_PAUSE_MS &&
    (!lastAt || pausedAt >= lastAt)
  ) {
    return {
      isPlaying: false,
      ...describe(now.item),
      playedAt: new Date(pausedAt).toISOString(),
      fetchedAt,
    };
  }

  if (last) {
    return {
      isPlaying: false,
      ...describe(last.track),
      playedAt: last.played_at,
      fetchedAt,
    };
  }

  return { isPlaying: false, fetchedAt };
}

export async function getNowPlaying(): Promise<SpotifyData> {
  if (resultCache && Date.now() - resultCache.at < RESULT_TTL_MS) {
    return resultCache.data;
  }
  if (inflight) return inflight;

  inflight = fetchSpotify()
    .then((data) => {
      resultCache = { data, at: Date.now() };
      return data;
    })
    .catch(() => resultCache?.data ?? { isPlaying: false, fetchedAt: Date.now() })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}
