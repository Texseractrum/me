"use client";

import { useEffect, useState } from "react";

function parts(timeZone: string, date: Date) {
  const formatted = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).formatToParts(date);
  const get = (type: string) => formatted.find((p) => p.type === type)?.value ?? "";
  const hour24 = Number(
    new Intl.DateTimeFormat("en-US", { timeZone, hour: "numeric", hourCycle: "h23" }).format(date),
  );
  return {
    hour: get("hour"),
    minute: get("minute"),
    period: get("dayPeriod").toLowerCase(),
    night: hour24 < 7 || hour24 >= 23,
  };
}

export function LocalTime({ timeZone, initial }: { timeZone: string; initial: number }) {
  const [now, setNow] = useState(initial);

  useEffect(() => {
    // Re-render on the minute boundary, then every minute.
    let interval: ReturnType<typeof setInterval>;
    const tick = () => setNow(Date.now());
    const timeout = setTimeout(() => {
      tick();
      interval = setInterval(tick, 60_000);
    }, 60_000 - (Date.now() % 60_000));
    tick();
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  const t = parts(timeZone, new Date(now));

  return (
    <span
      className="shrink-0 text-sm tabular-nums text-neutral-400"
      title={t.night ? "Probably asleep" : "My local time"}
      suppressHydrationWarning
    >
      {t.hour}
      {/* The colon ticks like a clock, so it's clearly live. */}
      <span className="motion-safe:animate-[colon-blink_2s_steps(1,end)_infinite]">:</span>
      {t.minute} {t.period}
      {t.night && <span aria-hidden="true"> ☾</span>}
    </span>
  );
}
