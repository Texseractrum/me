const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_ENDPOINT =
  "https://api.spotify.com/v1/me/player/currently-playing";

async function getAccessToken() {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: REFRESH_TOKEN!,
    }),
  });

  return response.json();
}

async function getNowPlaying() {
  const { access_token } = await getAccessToken();

  const response = await fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    next: { revalidate: 30 },
  });

  if (response.status === 204 || response.status > 400) {
    return null;
  }

  return response.json();
}

export async function GET() {
  try {
    const data = await getNowPlaying();

    if (!data || !data.item) {
      return Response.json({ isPlaying: false });
    }

    const track = data.item;

    return Response.json({
      isPlaying: data.is_playing,
      title: track.name,
      artist: track.artists.map((a: { name: string }) => a.name).join(", "),
      album: track.album.name,
      url: track.external_urls.spotify,
      albumArt: track.album.images[0]?.url,
    });
  } catch {
    return Response.json({ isPlaying: false });
  }
}
