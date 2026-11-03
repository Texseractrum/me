"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { SpotifyData } from "@/lib/spotify";
import { Row } from "@/components/row";

const POLL_MS = 20_000;
const BAR_HEIGHT = 10;
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
      className={`inline-flex shrink-0 items-end gap-[2px] transition-colors duration-700 ${
        live ? "text-live" : "text-dim/60"
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

  const live = data.isPlaying && !!data.title;
  const ago = !live && data.playedAt ? timeAgo(data.playedAt, now) : null;

  return (
    <Row label={live ? "Listening" : "Last played"}>
      {data.title ? (
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-[2ch]">
          <a
            href={data.url}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate text-ink/75 hover:text-ink"
          >
            {data.title}
            {data.artist && <span className="text-dim"> by {data.artist}</span>}
          </a>
          {/* Status lives in the right-hand meta column, like every other number on the page. */}
          {live ? (
            <span className="inline-flex items-baseline gap-[1ch] text-dim">
              <Equalizer live />
              now
            </span>
          ) : (
            ago && <span className="text-right text-dim">{ago}</span>
          )}
        </div>
      ) : (
        <span className="text-dim">Nothing yet</span>
      )}
    </Row>
  );
}
