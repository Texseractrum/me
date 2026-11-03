"use client";

import { motion, useReducedMotion } from "motion/react";

// A dot that beats at the measured heart rate: one beat every 60/bpm seconds.
export function Heartbeat({ bpm }: { bpm: number }) {
  const reduce = useReducedMotion();
  const period = 60 / Math.min(Math.max(bpm, 30), 200);

  return (
    <motion.span
      aria-hidden="true"
      className="inline-block size-[6px] -translate-y-[1px] rounded-full bg-live"
      animate={reduce ? undefined : { scale: [1, 1.45, 1, 1.2, 1], opacity: [0.7, 1, 0.75, 0.9, 0.7] }}
      transition={{ duration: period, repeat: Infinity, ease: "easeOut", times: [0, 0.12, 0.28, 0.4, 1] }}
    />
  );
}
