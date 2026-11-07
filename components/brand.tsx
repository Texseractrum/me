import type { CSSProperties, ReactNode } from "react";

// Each mark is set like a capital letter: sized from the font's cap height
// (0.71em in Geist Mono), centred on it, with optical corrections so a solid
// square, a circle and a wide cloud all read as the same size. `h` is the
// mark's height in em, `r` its width-to-height ratio (viewBoxes are cropped tight).
const CAP = 0.71;
const MARKS = {
  sparkles: { src: "/logos/sparkles.svg", h: 0.8, r: 0.903 },
  ycombinator: { src: "/logos/ycombinator.svg", h: 0.7, r: 1 },
  openai: { src: "/logos/openai.svg", h: 0.76, r: 0.986 },
  anthropic: { src: "/logos/anthropic.svg", h: 0.6, r: 1.419 },
  a16z: { src: "/logos/a16z.png", h: 0.76, r: 1 },
  "general-catalyst": { src: "/logos/general-catalyst.png", h: 0.74, r: 1 },
  cloudflare: { src: "/logos/cloudflare.svg", h: 0.5, r: 2.211 },
} as const;

// A brand name with its mark in front. The mark is a mask filled with the
// dim text tone, never brand colour. Names follow the Work list: the current
// company in full ink, everything else a step quieter.
export function Brand({
  logo,
  current,
  children,
}: {
  logo: keyof typeof MARKS;
  current?: boolean;
  children: ReactNode;
}) {
  const m = MARKS[logo];
  const style = {
    "--logo": `url(${m.src})`,
    width: `${(m.h * m.r).toFixed(3)}em`,
    height: `${m.h}em`,
    verticalAlign: `${((CAP - m.h) / 2).toFixed(3)}em`,
  } as CSSProperties;
  return (
    <span className={`whitespace-nowrap ${current ? "text-ink" : "text-ink/75"}`}>
      <span aria-hidden="true" className="brand-logo" style={style} />
      {children}
    </span>
  );
}
