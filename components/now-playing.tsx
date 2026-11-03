"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { SpotifyData } from "@/lib/spotify";

const POLL_MS = 20_000;
const BAR_HEIGHT = 11;
const REST_SCALE = 2 / BAR_HEIGHT;

// Each bar gets its own rhythm so the motion never visibly loops in sync.
const BARS = [
  { frames: [0.35, 1, 0.55, 0.85, 0.4], duration: 1.15, still: 0.55 },
  { frames: [0.9, 0.45, 1, 0.3, 0.75], duration: 0.95, still: 1 },
  { frames: [0.5, 0.8, 0.3, 1, 0.6], duration: 1.3, still: 0.7 },
];

function timeAgo(iso: string, now: number) {
  const diff = Math.max(0, now - Date.parse(iso));
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function Equalizer({ live }: { live: boolean }) {
  const reduceMotion = useReducedMotion();

  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-end gap-[2px] transition-[color,filter] duration-700 ${
        live
          ? "text-[#1db954] dark:text-[#1ed760] dark:drop-shadow-[0_0_4px_rgba(30,215,96,0.45)]"
          : "text-neutral-300 dark:text-neutral-600"
      }`}
      style={{ height: BAR_HEIGHT }}
    >
      {BARS.map((bar, i) => (
        <motion.span
          key={i}
          className="block w-[2px] rounded-full bg-current"
          style={{ height: BAR_HEIGHT, originY: 1 }}
          // Start from rest so live bars visibly rise into their bounce on load.
          initial={{ scaleY: REST_SCALE }}
          animate={
            live
              ? { scaleY: reduceMotion ? bar.still : bar.frames }
              : { scaleY: REST_SCALE }
          }
          transition={
            live && !reduceMotion
              ? {
                  duration: bar.duration,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                  delay: i * 0.12,
                }
              : // Winding down: settle gently, one bar after another.
                { duration: 0.9, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }
          }
        />
      ))}
    </span>
  );
}

export function NowPlaying({ initial }: { initial: SpotifyData }) {
  const [data, setData] = useState(initial);
  // Seeded with server time so the first client render matches SSR.
  const [now, setNow] = useState(initial.fetchedAt);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/spotify", { cache: "no-store" });
      if (!res.ok) return;
      const next: SpotifyData = await res.json();
      setData(next);
    } catch {
      // keep showing what we have
    }
  }, []);

  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 1000);
    const poll = setInterval(() => {
      if (document.visibilityState === "visible") refresh();
    }, POLL_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(tick);
      clearInterval(poll);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refresh]);

  // Live progress, extrapolated locally from when the server took the snapshot.
  const elapsed = Math.max(0, now - data.fetchedAt);
  const progress =
    data.isPlaying && data.progressMs != null && data.durationMs
      ? Math.min(1, (data.progressMs + elapsed) / data.durationMs)
      : null;

  // When the song should have ended, check for the next one right away.
  const songOver = progress === 1;
  useEffect(() => {
    if (!songOver) return;
    const t = setTimeout(refresh, 1500);
    return () => clearTimeout(t);
  }, [songOver, refresh]);

  if (!data.title) {
    return (
      <span className="font-mono text-base text-neutral-600 dark:text-neutral-400">
        —
      </span>
    );
  }

  const live = data.isPlaying;
  const ago = !live && data.playedAt ? timeAgo(data.playedAt, now) : null;
  const status = live ? "Listening now" : ago ? `Last played ${ago}` : "Last played";

  return (
    <span className="flex min-w-0 items-baseline gap-3" title={status}>
      <Equalizer live={live} />
      <span className="sr-only">{status}: </span>
      <a
        key={data.url ?? data.title}
        href={data.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`group min-w-0 truncate font-mono text-base text-neutral-600 transition-colors hover:text-black dark:text-neutral-400 dark:hover:text-white ${
          progress != null
            ? "bg-no-repeat pb-[3px] [--fill:#a3a3a3] [--track:#e5e5e5] hover:[--fill:#000] dark:[--fill:#737373] dark:[--track:#404040] dark:hover:[--fill:#fff]"
            : "underline decoration-neutral-300 underline-offset-2 hover:decoration-black dark:decoration-neutral-600 dark:hover:decoration-white"
        }`}
        style={
          progress != null
            ? {
                // The underline doubles as a progress bar while the song plays.
                backgroundImage:
                  "linear-gradient(var(--fill), var(--fill)), linear-gradient(var(--track), var(--track))",
                backgroundSize: `${(progress * 100).toFixed(2)}% 1px, 100% 1px`,
                backgroundPosition: "0 100%, 0 100%",
                transition: "background-size 1s linear, color 150ms",
              }
            : undefined
        }
      >
        {data.title}
        {data.artist && <span className="text-neutral-400"> · {data.artist}</span>}
      </a>
      {ago && (
        <span className="shrink-0 font-mono text-sm text-neutral-400">{ago}</span>
      )}
    </span>
  );
}
