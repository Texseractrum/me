import { ImageResponse } from "next/og";

export const alt = "Dan Bekirov, CEO of Sparkles (YC W26)";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadFont(text: string) {
  try {
    const css = await (
      await fetch(
        `https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500&text=${encodeURIComponent(text)}`,
      )
    ).text();
    const url = css.match(/src: url\((.+?)\) format/)?.[1];
    if (!url) return null;
    return await (await fetch(url)).arrayBuffer();
  } catch {
    return null;
  }
}

// Faint dotted field echoing the ASCII smoke on the site.
const FIELD = Array.from({ length: 12 }, (_, row) =>
  Array.from({ length: 24 }, (_, col) => {
    const v = Math.sin(col * 0.35 + row * 0.5) + Math.cos(col * 0.12 - row * 0.3);
    return v > 1.2 ? ":" : v > 0.6 ? "." : " ";
  }).join(""),
);

export default async function Image() {
  const lines = [
    "Dan Bekirov",
    "CEO @ Sparkles.dev (YC W26)",
    "Backed by Y Combinator and angels from",
    "OpenAI, Anthropic, a16z, General Catalyst, Cloudflare",
    "aidaniil.com",
  ];
  const font = await loadFont(lines.join("") + FIELD.join("") + ".:");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#0a0a0a",
          color: "#e5e5e5",
          fontFamily: font ? "Geist Mono" : "monospace",
          padding: 80,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: 56,
            top: 48,
            display: "flex",
            flexDirection: "column",
            color: "#3a3a3a",
            fontSize: 22,
            lineHeight: 1.35,
            whiteSpace: "pre",
          }}
        >
          {FIELD.map((l, i) => (
            <div key={i} style={{ display: "flex" }}>
              {l}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ width: 14, height: 14, borderRadius: 7, background: "#fff" }} />
              <div style={{ fontSize: 56, fontWeight: 500, color: "#fff" }}>{lines[0]}</div>
            </div>
            <div style={{ fontSize: 32, color: "#8a8a8a", marginTop: 24, marginLeft: 34 }}>
              {lines[1]}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", fontSize: 26, color: "#6b6b6b", lineHeight: 1.5 }}>
            <div>{lines[2]}</div>
            <div>{lines[3]}</div>
            <div style={{ color: "#a3a3a3", marginTop: 28 }}>{lines[4]}</div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: font ? [{ name: "Geist Mono", data: font, weight: 400 }] : undefined,
    },
  );
}
