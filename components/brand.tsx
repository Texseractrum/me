import type { CSSProperties, ReactNode } from "react";

const LOGOS = {
  sparkles: "/logos/sparkles.svg",
  ycombinator: "/logos/ycombinator.svg",
  openai: "/logos/openai.svg",
  anthropic: "/logos/anthropic.svg",
  a16z: "/logos/a16z.png",
  "general-catalyst": "/logos/general-catalyst.png",
  cloudflare: "/logos/cloudflare.svg",
} as const;

// A brand name with its mark in front. The mark is a mask filled with
// currentColor, so it takes the surrounding text tone instead of brand colours,
// and it sits in a 2ch cell so the monospace grid stays intact.
export function Brand({ logo, children }: { logo: keyof typeof LOGOS; children: ReactNode }) {
  return (
    <span className="whitespace-nowrap">
      <span
        aria-hidden="true"
        className="brand-logo"
        // Wide marks (the cloud) get a little more room so they don't shrink to a sliver.
        style={{ "--logo": `url(${LOGOS[logo]})`, ...(logo === "cloudflare" && { "--logo-w": "15px" }) } as CSSProperties}
      />
      {children}
    </span>
  );
}
