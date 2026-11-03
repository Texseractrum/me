"use client";

import { useEffect, useState } from "react";

function format(timeZone: string, date: number) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);
}

export function LocalTime({ timeZone, initial }: { timeZone: string; initial: number }) {
  const [now, setNow] = useState(initial);

  useEffect(() => {
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

  return (
    <span className="text-dim" suppressHydrationWarning>
      {format(timeZone, now)} local time
    </span>
  );
}
